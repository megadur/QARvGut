// ---------------------------------------
// Story 1.2 Task 2: Password Reset Component
// Complete password reset with token validation
// ---------------------------------------

import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

import { AlertService, MessageSeverity } from '../../services/alert.service';
import { PasswordResetService } from '../../services/password-reset.service';
import { LoginValidationService } from '../../services/login-validation.service';
import { PasswordValidators } from '../../validators/password-validators';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrl: './password-reset.component.scss',
  imports: [ReactiveFormsModule, CommonModule, RouterModule]
})
export class PasswordResetComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  // Service injections
  private readonly formBuilder = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly alertService = inject(AlertService);
  private readonly passwordResetService = inject(PasswordResetService);
  private readonly validationService = inject(LoginValidationService);

  // Component state
  passwordResetForm!: FormGroup;
  isLoading = false;
  token = '';
  email = '';
  tokenValidationResult: { isValid: boolean; isExpired?: boolean; email?: string; error?: string } | null = null;
  validationErrors: Record<string, string[]> = {};

  ngOnInit(): void {
    this.initializeForm();
    this.extractToken();
    this.validateToken();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Initialize the password reset form
   */
  private initializeForm(): void {
    this.passwordResetForm = this.formBuilder.group({
      newPassword: ['', [
        Validators.required,
        Validators.minLength(8),
        PasswordValidators.strengthValidator()
      ]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: [PasswordValidators.matchValidator('newPassword', 'confirmPassword')]
    });
  }

  /**
   * Extract token from URL parameters
   */
  private extractToken(): void {
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.token = params['token'] || '';
        if (!this.token) {
          this.handleInvalidToken('No reset token provided');
        }
      });
  }

  /**
   * Validate the reset token
   */
  private validateToken(): void {
    if (!this.token) return;

    this.isLoading = true;
    this.passwordResetService.validateResetToken(this.token)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: result => {
          this.isLoading = false;
          this.tokenValidationResult = result;

          if (!result.isValid) {
            this.handleInvalidToken(result.error || 'Invalid reset token');
          } else if (result.isExpired) {
            this.handleExpiredToken();
          } else {
            this.email = result.email || '';
            this.alertService.showMessage(
              'Password Reset',
              'Please enter your new password below.',
              MessageSeverity.info
            );
          }
        },
        error: error => {
          this.isLoading = false;
          this.handleTokenValidationError(error);
        }
      });
  }

  /**
   * Handle password reset form submission
   */
  onSubmit(): void {
    if (this.isLoading || !this.tokenValidationResult?.isValid) return;

    // Validate form
    this.validationErrors = {};
    if (this.passwordResetForm.invalid) {
      this.passwordResetForm.markAllAsTouched();
      this.updateValidationErrors();
      return;
    }

    const formData = this.passwordResetForm.value;

    // Additional validation
    if (formData.newPassword !== formData.confirmPassword) {
      this.validationErrors['confirmPassword'] = ['Passwords do not match'];
      return;
    }

    this.performPasswordReset();
  }

  /**
   * Perform the password reset
   */
  private performPasswordReset(): void {
    const formData = this.passwordResetForm.value;
    this.isLoading = true;

    const resetData = {
      token: this.token,
      newPassword: formData.newPassword,
      confirmPassword: formData.confirmPassword
    };

    this.passwordResetService.completePasswordReset(resetData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: response => {
          this.isLoading = false;
          this.alertService.showMessage(
            'Password Reset Complete',
            response.message,
            MessageSeverity.success
          );

          // Redirect to login after short delay
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: error => {
          this.isLoading = false;
          const errorMessage = error.message || 'Failed to reset password. Please try again.';
          this.alertService.showMessage(
            'Password Reset Error',
            errorMessage,
            MessageSeverity.error
          );
        }
      });
  }

  /**
   * Handle invalid token scenario
   */
  private handleInvalidToken(message: string): void {
    this.alertService.showMessage(
      'Invalid Reset Link',
      message + '. Please request a new password reset.',
      MessageSeverity.error
    );

    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 3000);
  }

  /**
   * Handle expired token scenario
   */
  private handleExpiredToken(): void {
    this.alertService.showMessage(
      'Reset Link Expired',
      'This password reset link has expired. Please request a new one.',
      MessageSeverity.warn
    );

    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 3000);
  }

  /**
   * Handle token validation error
   */
  private handleTokenValidationError(error: { message?: string }): void {
    const errorMessage = error.message || 'Unable to validate reset token';
    this.alertService.showMessage(
      'Validation Error',
      errorMessage,
      MessageSeverity.error
    );
  }

  /**
   * Update validation errors from form state
   */
  private updateValidationErrors(): void {
    Object.keys(this.passwordResetForm.controls).forEach(key => {
      const control = this.passwordResetForm.get(key);
      if (control && control.invalid && (control.dirty || control.touched)) {
        this.validationErrors[key] = this.getControlErrors(key, control);
      }
    });
  }

  /**
   * Get error messages for a form control
   */
  private getControlErrors(fieldName: string, control: { errors: Record<string, unknown> | null }): string[] {
    const errors: string[] = [];

    if (control.errors) {
      Object.keys(control.errors).forEach(errorType => {
        switch (errorType) {
          case 'required': {
            errors.push(`${this.getFieldDisplayName(fieldName)} is required`);
            break;
          }
          case 'minlength': {
            const errorData = control.errors![errorType] as { requiredLength: number };
            const minLength = errorData.requiredLength;
            errors.push(`${this.getFieldDisplayName(fieldName)} must be at least ${minLength} characters`);
            break;
          }
          case 'strengthValidator': {
            const strengthErrors = control.errors![errorType] as string[];
            if (strengthErrors && strengthErrors.length > 0) {
              errors.push(...strengthErrors);
            }
            break;
          }
          case 'passwordMismatch':
            errors.push('Passwords do not match');
            break;
          default:
            errors.push(`${this.getFieldDisplayName(fieldName)} is invalid`);
        }
      });
    }

    return errors;
  }

  /**
   * Get display name for field
   */
  private getFieldDisplayName(fieldName: string): string {
    const fieldNames: Record<string, string> = {
      'newPassword': 'New Password',
      'confirmPassword': 'Confirm Password'
    };
    return fieldNames[fieldName] || fieldName;
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
    return !!(this.validationErrors[fieldName]?.length > 0);
  }

  /**
   * Navigate back to login
   */
  backToLogin(): void {
    this.router.navigate(['/login']);
  }

  /**
   * Get password strength indication
   */
  getPasswordStrength(): string {
    const password = this.passwordResetForm.get('newPassword')?.value;
    if (!password) return '';

    const strengthResult = PasswordValidators.validatePasswordStrength(password, {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumeric: true,
      requireSpecialChar: true
    });

    const strengthDescription = PasswordValidators.getStrengthDescription(strengthResult.score);
    return strengthDescription.text;
  }

  /**
   * Get password strength class for styling
   */
  getPasswordStrengthClass(): string {
    const password = this.passwordResetForm.get('newPassword')?.value;
    if (!password) return '';

    const strengthResult = PasswordValidators.validatePasswordStrength(password, {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumeric: true,
      requireSpecialChar: true
    });

    const strengthDescription = PasswordValidators.getStrengthDescription(strengthResult.score);
    return strengthDescription.cssClass;
  }
}
