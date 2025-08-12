// ---------------------------------------
// Story 1.2 Task 3: Profile Edit Component
// Enterprise profile editing with validation
// ---------------------------------------

import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { AuthService } from '../../services/auth.service';
import { AccountService } from '../../services/account.service';
import { AlertService, MessageSeverity, DialogType } from '../../services/alert.service';
import { FormValidationService } from '../../services/form-validation.service';
import { User } from '../../models/user.model';
import { UserEdit } from '../../models/user-edit.model';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrl: './profile-edit.component.scss',
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class ProfileEditComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  // Service injections
  private readonly authService = inject(AuthService);
  private readonly accountService = inject(AccountService);
  private readonly alertService = inject(AlertService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly formValidationService = inject(FormValidationService);
  private readonly router = inject(Router);

  // Component state
  profileForm!: FormGroup;
  isLoading = false;
  isSaving = false;
  currentUser: User | null = null;
  validationErrors: Record<string, string[]> = {};

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser;

    if (!this.currentUser) {
      this.alertService.showMessage(
        'Authentication Error',
        'Please log in to edit your profile',
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
   * Initialize the profile form with current user data
   */
  private initializeForm(): void {
    this.profileForm = this.formBuilder.group({
      firstName: [
        this.currentUser?.firstName || '',
        [Validators.required, Validators.minLength(2), Validators.maxLength(50)]
      ],
      lastName: [
        this.currentUser?.lastName || '',
        [Validators.required, Validators.minLength(2), Validators.maxLength(50)]
      ],
      email: [
        this.currentUser?.email || '',
        [Validators.required, Validators.email]
      ],
      jobTitle: [
        this.currentUser?.jobTitle || '',
        [Validators.maxLength(100)]
      ],
      department: [
        this.currentUser?.department || '',
        [Validators.maxLength(100)]
      ],
      phoneNumber: [
        this.currentUser?.phoneNumber || '',
        [Validators.pattern(/^[+]?[1-9][\d]{0,15}$/)]
      ],
      contactInfo: [
        this.currentUser?.contactInfo || '',
        [Validators.maxLength(500)]
      ]
    });

    // Set readonly for email (typically not editable)
    this.profileForm.get('email')?.disable();
  }

  /**
   * Handle form submission
   */
  onSubmit(): void {
    if (this.isSaving || !this.currentUser) return;

    // Validate form
    const validationResult = this.formValidationService.validateForm(this.profileForm);
    this.validationErrors = {};

    if (!validationResult.isValid) {
      // Convert validation errors to display format
      validationResult.errors.forEach(error => {
        if (!this.validationErrors[error.field]) {
          this.validationErrors[error.field] = [];
        }
        this.validationErrors[error.field].push(error.message);
      });

      this.formValidationService.focusFirstInvalidField(this.profileForm);

      this.alertService.showMessage(
        'Validation Error',
        'Please correct the errors and try again',
        MessageSeverity.error
      );
      return;
    }

    this.saveProfile();
  }

  /**
   * Save profile data
   */
  private saveProfile(): void {
    if (!this.currentUser) return;

    this.isSaving = true;
    this.alertService.startLoadingMessage('Saving profile...');

    const formData = this.profileForm.value;

    // Create update payload - UserEdit extends User
    const updateData = new UserEdit();

    // Copy current user properties
    updateData.id = this.currentUser.id;
    updateData.userName = this.currentUser.userName;
    updateData.email = this.currentUser.email;
    updateData.firstName = formData.firstName;
    updateData.lastName = formData.lastName;
    updateData.jobTitle = formData.jobTitle || '';
    updateData.department = formData.department || null;
    updateData.phoneNumber = formData.phoneNumber || '';
    updateData.contactInfo = formData.contactInfo || null;
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

    this.accountService.updateUser(updateData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.alertService.stopLoadingMessage();

          // The user will be automatically updated via auth token refresh
          // No reauthenticateUser method exists in AuthService

          this.alertService.showMessage(
            'Profile Updated',
            'Your profile has been successfully updated',
            MessageSeverity.success
          );

          setTimeout(() => {
            this.router.navigate(['/profile']);
          }, 1500);
        },
        error: (error) => {
          this.alertService.stopLoadingMessage();
          this.handleSaveError(error);
        }
      });
  }

  /**
   * Handle save errors
   */
  private handleSaveError(error: unknown): void {
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
    }

    // Generic error handling
    this.alertService.showStickyMessage(
      'Update Failed',
      'Unable to update your profile. Please try again later.',
      MessageSeverity.error,
      error
    );
  }

  /**
   * Cancel editing and return to profile view
   */
  cancel(): void {
    if (this.profileForm.dirty) {
      this.alertService.showDialog(
        'You have unsaved changes. Are you sure you want to cancel?',
        DialogType.confirm,
        () => {
          this.router.navigate(['/profile']);
        }
      );
    } else {
      this.router.navigate(['/profile']);
    }
  }

  /**
   * Check if form field has errors
   */
  hasFieldError(fieldName: string): boolean {
    return !!(this.validationErrors[fieldName] && this.validationErrors[fieldName].length > 0);
  }

  /**
   * Get field errors
   */
  getFieldErrors(fieldName: string): string[] {
    return this.validationErrors[fieldName] || [];
  }

  /**
   * Get field error class
   */
  getFieldClass(fieldName: string): string {
    const control = this.profileForm.get(fieldName);
    if (!control) return '';

    if (this.hasFieldError(fieldName)) return 'is-invalid';
    if (control.valid && control.dirty) return 'is-valid';

    return '';
  }
}
