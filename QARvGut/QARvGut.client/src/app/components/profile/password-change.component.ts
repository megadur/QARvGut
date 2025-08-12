// ---------------------------------------
// Story 1.2 Task 3: Password Change Component
// Secure password change with current password verification
// ---------------------------------------

import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { AuthService } from '../../services/auth.service';
import { AccountService } from '../../services/account.service';
import { AlertService, MessageSeverity } from '../../services/alert.service';
import { FormValidationService } from '../../services/form-validation.service';
import { User } from '../../models/user.model';
import { UserEdit } from '../../models/user-edit.model';

// Import password validators if they exist
// import { PasswordValidators } from '../../validators/password-validators';

@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.component.html',
  styleUrl: './password-change.component.scss',
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class PasswordChangeComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  // Service injections
  private readonly authService = inject(AuthService);
  private readonly accountService = inject(AccountService);
  private readonly alertService = inject(AlertService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly formValidationService = inject(FormValidationService);
  private readonly router = inject(Router);

  // Component state
  passwordForm!: FormGroup;
  isLoading = false;
  isSaving = false;
  currentUser: User | null = null;
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;
  validationErrors: Record<string, string[]> = {};

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser;

    if (!this.currentUser) {
      this.alertService.showMessage(
        'Authentication Error',
        'Please log in to change your password',
        MessageSeverity.error
      );
      this.router.navigate(['/login']);
      return;
    }

    this.initializeForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Initialize the password form
   */
  private initializeForm(): void {
    this.passwordForm = this.formBuilder.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      ]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  /**
   * Custom validator to check if passwords match
   */
  private passwordMatchValidator = (group: FormGroup) => {
    const newPassword = group.get('newPassword');
    const confirmPassword = group.get('confirmPassword');

    if (!newPassword || !confirmPassword) {
      return null;
    }

    if (newPassword.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    // Clear mismatch error if passwords match, but preserve other errors
    if (confirmPassword.errors) {
      delete confirmPassword.errors['passwordMismatch'];
      if (Object.keys(confirmPassword.errors).length === 0) {
        confirmPassword.setErrors(null);
      }
    }

    return null;
  };

  /**
   * Toggle password visibility
   */
  togglePasswordVisibility(field: 'current' | 'new' | 'confirm'): void {
    switch (field) {
      case 'current':
        this.showCurrentPassword = !this.showCurrentPassword;
        break;
      case 'new':
        this.showNewPassword = !this.showNewPassword;
        break;
      case 'confirm':
        this.showConfirmPassword = !this.showConfirmPassword;
        break;
    }
  }

  /**
   * Handle form submission
   */
  onSubmit(): void {
    if (this.isSaving || !this.currentUser) return;

    // Validate form
    const validationResult = this.formValidationService.validateForm(this.passwordForm);
    this.validationErrors = {};

    if (!validationResult.isValid) {
      // Convert validation errors to display format
      validationResult.errors.forEach(error => {
        if (!this.validationErrors[error.field]) {
          this.validationErrors[error.field] = [];
        }
        this.validationErrors[error.field].push(error.message);
      });

      this.formValidationService.focusFirstInvalidField(this.passwordForm);

      this.alertService.showMessage(
        'Validation Error',
        'Please correct the errors and try again',
        MessageSeverity.error
      );
      return;
    }

    this.changePassword();
  }

  /**
   * Change password
   */
  private changePassword(): void {
    if (!this.currentUser) return;

    this.isSaving = true;
    this.alertService.startLoadingMessage('Changing password...');

    const formData = this.passwordForm.value;

    // Create update payload with password change
    const updateData = new UserEdit();

    // Copy current user properties
    updateData.id = this.currentUser.id;
    updateData.userName = this.currentUser.userName;
    updateData.email = this.currentUser.email;
    updateData.firstName = this.currentUser.firstName;
    updateData.lastName = this.currentUser.lastName;
    updateData.jobTitle = this.currentUser.jobTitle || '';
    updateData.department = this.currentUser.department;
    updateData.phoneNumber = this.currentUser.phoneNumber || '';
    updateData.contactInfo = this.currentUser.contactInfo;
    updateData.isEnabled = this.currentUser.isEnabled;
    updateData.isLockedOut = this.currentUser.isLockedOut;
    updateData.roles = this.currentUser.roles;

    // Copy other required properties
    updateData.loginCount = this.currentUser.loginCount;
    updateData.isActive = this.currentUser.isActive;
    updateData.phone = this.currentUser.phone;
    updateData.preferences = this.currentUser.preferences;
    updateData.lastLoginDate = this.currentUser.lastLoginDate;
    updateData.lastLoginIp = this.currentUser.lastLoginIp;
    updateData.gesperrtSeit = this.currentUser.gesperrtSeit;
    updateData.avatar = this.currentUser.avatar;

    // Set password fields
    updateData.currentPassword = formData.currentPassword;
    updateData.newPassword = formData.newPassword;
    updateData.confirmPassword = formData.confirmPassword;

    this.accountService.updateUser(updateData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.alertService.stopLoadingMessage();

          this.alertService.showMessage(
            'Password Changed',
            'Your password has been successfully updated',
            MessageSeverity.success
          );

          // Clear the form
          this.passwordForm.reset();

          setTimeout(() => {
            this.router.navigate(['/profile']);
          }, 1500);
        },
        error: (error) => {
          this.alertService.stopLoadingMessage();
          this.handleChangeError(error);
        }
      });
  }

  /**
   * Handle password change errors
   */
  private handleChangeError(error: unknown): void {
    this.isSaving = false;

    // Handle validation errors from server
    if (error && typeof error === 'object' && 'error' in error) {
      const httpError = error as { status: number; error: { errors: Record<string, string | string[]> } };
      if (httpError.status === 400 && httpError.error?.errors) {
        const serverErrors = httpError.error.errors;

        // Convert server validation errors
        Object.keys(serverErrors).forEach(field => {
          const fieldKey = field.toLowerCase();
          this.validationErrors[fieldKey] = Array.isArray(serverErrors[field])
            ? serverErrors[field]
            : [serverErrors[field]];
        });

        this.alertService.showMessage(
          'Validation Error',
          'Please correct the errors and try again',
          MessageSeverity.error
        );
        return;
      }

      // Handle authentication errors (incorrect current password)
      if (httpError.status === 401 || httpError.status === 403) {
        this.validationErrors['currentpassword'] = ['Current password is incorrect'];
        this.alertService.showMessage(
          'Authentication Error',
          'Current password is incorrect',
          MessageSeverity.error
        );
        return;
      }
    }

    // Generic error handling
    this.alertService.showStickyMessage(
      'Password Change Failed',
      'Unable to change your password. Please try again later.',
      MessageSeverity.error,
      error
    );
  }

  /**
   * Cancel password change and return to profile
   */
  cancel(): void {
    this.router.navigate(['/profile']);
  }

  /**
   * Check if form field has errors
   */
  hasFieldError(fieldName: string): boolean {
    const control = this.passwordForm.get(fieldName);
    return !!(
      (control && control.invalid && (control.dirty || control.touched)) ||
      (this.validationErrors[fieldName] && this.validationErrors[fieldName].length > 0)
    );
  }

  /**
   * Get field errors
   */
  getFieldErrors(fieldName: string): string[] {
    const errors: string[] = [];

    // Add server validation errors
    if (this.validationErrors[fieldName]) {
      errors.push(...this.validationErrors[fieldName]);
    }

    // Add client-side validation errors
    const control = this.passwordForm.get(fieldName);
    if (control && control.errors) {
      if (control.errors['required']) {
        errors.push('This field is required');
      }
      if (control.errors['minlength']) {
        errors.push(`Minimum length is ${control.errors['minlength'].requiredLength} characters`);
      }
      if (control.errors['pattern']) {
        errors.push('Password must contain uppercase, lowercase, number, and special character');
      }
      if (control.errors['passwordMismatch']) {
        errors.push('Passwords do not match');
      }
    }

    return errors;
  }

  /**
   * Get field CSS class
   */
  getFieldClass(fieldName: string): string {
    const control = this.passwordForm.get(fieldName);
    if (!control) return '';

    if (this.hasFieldError(fieldName)) return 'is-invalid';
    if (control.valid && control.dirty) return 'is-valid';

    return '';
  }

  /**
   * Get password strength indicator
   */
  getPasswordStrength(): { label: string; class: string; width: number } {
    const password = this.passwordForm.get('newPassword')?.value || '';

    if (password.length === 0) {
      return { label: '', class: '', width: 0 };
    }

    let score = 0;
    let feedback = '';

    // Length check
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;

    // Character type checks
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    // Complexity bonus
    if (password.length >= 16 && score >= 5) score += 1;

    if (score <= 2) {
      feedback = 'Weak';
      return { label: feedback, class: 'bg-danger', width: 25 };
    } else if (score <= 4) {
      feedback = 'Medium';
      return { label: feedback, class: 'bg-warning', width: 60 };
    } else if (score <= 5) {
      feedback = 'Strong';
      return { label: feedback, class: 'bg-success', width: 90 };
    } else {
      feedback = 'Very Strong';
      return { label: feedback, class: 'bg-success', width: 100 };
    }
  }
}
