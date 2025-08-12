// ---------------------------------------
// Story 1.2 Task 2: Authentication Interface
// Login Component - ENTERPRISE REFACTORED
// ---------------------------------------

import { Component, OnInit, OnDestroy, Input, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { AlertService, MessageSeverity, DialogType } from '../../services/alert.service';
import { AuthService } from '../../services/auth.service';
import { ConfigurationService } from '../../services/configuration.service';
import { LoginValidationService } from '../../services/login-validation.service';
import { LoginSecurityService } from '../../services/login-security.service';
import { LoginErrorHandlingService } from '../../services/login-error-handling.service';
import { PasswordResetService } from '../../services/password-reset.service';
import { Utilities } from '../../services/utilities';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  imports: [ReactiveFormsModule, CommonModule, RouterModule]
})

export class LoginComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  // Service injections
  private readonly alertService = inject(AlertService);
  private readonly authService = inject(AuthService);
  private readonly configurations = inject(ConfigurationService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly validationService = inject(LoginValidationService);
  private readonly securityService = inject(LoginSecurityService);
  private readonly errorHandlingService = inject(LoginErrorHandlingService);
  private readonly passwordResetService = inject(PasswordResetService);

  // Form and UI state
  loginForm!: FormGroup;
  isLoading = false;
  showPasswordReset = false;
  passwordResetForm!: FormGroup;
  validationErrors: Record<string, string[]> = {};
  securityWarnings: string[] = [];

  @Input()
  isModal = false;

  modalClosedCallback: (() => void) | undefined;

  ngOnInit() {
    this.initializeForms();
    this.setupAuthenticationFlow();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Initialize reactive forms
   */
  private initializeForms(): void {
    this.loginForm = this.formBuilder.group({
      userName: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required]],
      rememberMe: [this.authService.rememberMe || false]
    });

    this.passwordResetForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  /**
   * Setup authentication flow handling
   */
  private setupAuthenticationFlow(): void {
    if (this.getShouldRedirect()) {
      this.authService.redirectLoginUser();
    } else {
      this.authService.getLoginStatusEvent()
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          if (this.getShouldRedirect()) {
            this.authService.redirectLoginUser();
          }
        });
    }
  }

  /**
   * Check if user should be redirected
   */
  getShouldRedirect(): boolean {
    return !this.isModal && this.authService.isLoggedIn && !this.authService.isSessionExpired;
  }

  /**
   * Handle login form submission
   */
  onSubmit(): void {
    if (this.isLoading) return;

    // Validate form
    const validationResult = this.validationService.validateLoginForm(this.loginForm);
    this.validationErrors = validationResult.fieldErrors;

    if (!validationResult.isValid) {
      this.validationService.focusFirstInvalidField(this.loginForm);
      return;
    }

    // Security validation
    const formData = this.loginForm.value;
    const clientInfo = {
      ip: this.getClientIP(),
      userAgent: navigator.userAgent
    };

    const securityResult = this.securityService.validateLoginSecurity(formData, clientInfo);

    if (!securityResult.isAllowed) {
      this.handleSecurityViolations(securityResult);
      return;
    }

    if (securityResult.requiresCaptcha) {
      // In a real app, you would show CAPTCHA here
      this.alertService.showMessage(
        'Security Verification',
        'Additional security verification is required. Please complete the CAPTCHA.',
        MessageSeverity.warn
      );
      return;
    }

    this.performLogin();
  }

  /**
   * Perform the actual login
   */
  private performLogin(): void {
    const formData = this.loginForm.value;
    this.isLoading = true;
    this.alertService.startLoadingMessage('', 'Attempting login...');

    // Record login attempt
    this.securityService.recordLoginAttempt(
      formData.userName,
      false, // Will update to true on success
      {
        ip: this.getClientIP(),
        userAgent: navigator.userAgent
      }
    );

    this.authService.loginWithPassword(formData.userName, formData.password, formData.rememberMe)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: user => {
          // Record successful login
          this.securityService.recordLoginAttempt(formData.userName, true);
          this.securityService.clearLoginAttempts(formData.userName);

          setTimeout(() => {
            this.alertService.stopLoadingMessage();
            this.isLoading = false;
            this.resetForm();

            if (!this.isModal) {
              this.alertService.showMessage('Login', `Welcome ${user.userName}!`, MessageSeverity.success);
            } else {
              this.alertService.showMessage('Login', `Session for ${user.userName} restored!`, MessageSeverity.success);
              setTimeout(() => {
                this.alertService.showStickyMessage('Session Restored', 'Please try your last operation again', MessageSeverity.default);
              }, 500);
              this.closeModal();
            }
          }, 500);
        },
        error: error => {
          this.alertService.stopLoadingMessage();
          this.handleLoginError(error);

          setTimeout(() => {
            this.isLoading = false;
          }, 500);
        }
      });
  }

  /**
   * Handle login errors with enterprise error handling
   */
  private handleLoginError(error: unknown): void {
    const errorContext = this.errorHandlingService.handleLoginError(
      error,
      'attempting to log in',
      { userName: this.loginForm.get('userName')?.value }
    );

    if (error instanceof HttpErrorResponse && Utilities.checkNoNetwork(error)) {
      this.alertService.showStickyMessage(
        Utilities.noNetworkMessageCaption,
        Utilities.noNetworkMessageDetail,
        MessageSeverity.error,
        error
      );
      this.offerBackendDevServer();
    } else {
      this.alertService.showStickyMessage(
        'Unable to login',
        errorContext.userFriendlyMessage,
        MessageSeverity.error,
        error
      );

      // Show suggestions if available
      const suggestions = this.errorHandlingService.getSuggestions(errorContext);
      if (suggestions.length > 0) {
        setTimeout(() => {
          this.alertService.showMessage(
            'Suggestions',
            suggestions.join('\n'),
            MessageSeverity.info
          );
        }, 1000);
      }
    }
  }

  /**
   * Handle security violations
   */
  private handleSecurityViolations(securityResult: { violations: { severity: string; message: string }[] }): void {
    const criticalViolations = securityResult.violations.filter(v => v.severity === 'critical');

    if (criticalViolations.length > 0) {
      this.alertService.showMessage(
        'Security Alert',
        criticalViolations[0].message,
        MessageSeverity.error
      );
      return;
    }

    // Show warnings
    const warnings = securityResult.violations
      .filter(v => v.severity === 'warning')
      .map(v => v.message);

    this.securityWarnings = warnings;
  }

  /**
   * Show password reset form
   */
  showPasswordResetForm(): void {
    this.showPasswordReset = true;
    this.passwordResetForm.reset();
  }

  /**
   * Hide password reset form
   */
  hidePasswordResetForm(): void {
    this.showPasswordReset = false;
    this.passwordResetForm.reset();
  }

  /**
   * Handle password reset request
   */
  onPasswordReset(): void {
    if (this.passwordResetForm.invalid) {
      this.passwordResetForm.markAllAsTouched();
      return;
    }

    const email = this.passwordResetForm.get('email')?.value;
    this.isLoading = true;

    this.passwordResetService.initiatePasswordReset({ email })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: response => {
          this.isLoading = false;
          this.alertService.showMessage(
            'Password Reset',
            response.message,
            MessageSeverity.success
          );
          this.hidePasswordResetForm();
        },
        error: error => {
          this.isLoading = false;
          const errorMessage = error.message || 'Failed to send password reset email';
          this.alertService.showMessage(
            'Password Reset Error',
            errorMessage,
            MessageSeverity.error
          );
        }
      });
  }

  /**
   * Get field validation error message
   */
  getFieldError(fieldName: string): string {
    return this.validationErrors[fieldName]?.[0] || '';
  }

  /**
   * Check if field has validation error
   */
  hasFieldError(fieldName: string): boolean {
    const control = this.loginForm.get(fieldName);
    return !!(control?.invalid && (control?.dirty || control?.touched));
  }

  /**
   * Reset form to initial state
   */
  private resetForm(): void {
    this.loginForm.reset({
      userName: '',
      password: '',
      rememberMe: this.authService.rememberMe || false
    });
    this.validationErrors = {};
    this.securityWarnings = [];
  }

  /**
   * Close modal if in modal mode
   */
  closeModal(): void {
    if (this.modalClosedCallback) {
      this.modalClosedCallback();
    }
  }

  /**
   * Get client IP (simplified - in real app use proper detection)
   */
  private getClientIP(): string {
    // In a real application, you would get this from the server or a service
    return 'unknown';
  }

  /**
   * Offer backend development server (from original implementation)
   */
  private offerBackendDevServer(): void {
    if (Utilities.checkIsLocalHost(location.origin) && Utilities.checkIsLocalHost(this.configurations.baseUrl)) {
      this.alertService.showDialog(
        'Dear Developer!<br />' +
        'It appears your backend Web API server is inaccessible or not running...<br />' +
        'Would you want to temporarily switch to the fallback development API server below? (Or specify another)',
        DialogType.prompt,
        value => {
          this.configurations.baseUrl = value as string;
          this.alertService.showStickyMessage('API Changed!', 'The target Web API has been changed to: ' + value, MessageSeverity.warn);
        },
        null,
        null,
        null,
        this.configurations.fallbackBaseUrl
      );
    }
  }
}
