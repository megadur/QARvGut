// ---------------------------------------
// Story 1.2 Task 3: Enhanced User Preferences Component
// Comprehensive user preferences management
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

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
  notifications: {
    email: boolean;
    browser: boolean;
    security: boolean;
    updates: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'contacts';
    showEmail: boolean;
    showPhone: boolean;
    showLastLogin: boolean;
  };
  dashboard: {
    layout: 'grid' | 'list';
    itemsPerPage: number;
    defaultView: string;
  };
}

@Component({
  selector: 'app-user-preferences',
  templateUrl: './user-preferences.component.html',
  styleUrl: './user-preferences.component.scss',
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class UserPreferencesComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  // Service injections
  private readonly authService = inject(AuthService);
  private readonly accountService = inject(AccountService);
  private readonly alertService = inject(AlertService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly formValidationService = inject(FormValidationService);
  private readonly router = inject(Router);

  // Component state
  preferencesForm!: FormGroup;
  isLoading = false;
  isSaving = false;
  currentUser: User | null = null;
  preferences: UserPreferences = this.getDefaultPreferences();
  validationErrors: Record<string, string[]> = {};

  // Available options
  availableLanguages = [
    { code: 'en', name: 'English' },
    { code: 'de', name: 'Deutsch' },
    { code: 'fr', name: 'Français' },
    { code: 'es', name: 'Español' },
    { code: 'it', name: 'Italiano' }
  ];

  availableTimezones = [
    { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
    { value: 'America/New_York', label: 'Eastern Time (ET)' },
    { value: 'America/Chicago', label: 'Central Time (CT)' },
    { value: 'America/Denver', label: 'Mountain Time (MT)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
    { value: 'Europe/London', label: 'Greenwich Mean Time (GMT)' },
    { value: 'Europe/Berlin', label: 'Central European Time (CET)' },
    { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST)' },
    { value: 'Asia/Shanghai', label: 'China Standard Time (CST)' },
    { value: 'Australia/Sydney', label: 'Australian Eastern Time (AET)' }
  ];

  availableDateFormats = [
    { value: 'MM/dd/yyyy', label: 'MM/dd/yyyy (US)' },
    { value: 'dd/MM/yyyy', label: 'dd/MM/yyyy (EU)' },
    { value: 'yyyy-MM-dd', label: 'yyyy-MM-dd (ISO)' },
    { value: 'dd.MM.yyyy', label: 'dd.MM.yyyy (German)' },
    { value: 'MMM dd, yyyy', label: 'MMM dd, yyyy (Long)' }
  ];

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser;

    if (!this.currentUser) {
      this.alertService.showMessage(
        'Authentication Error',
        'Please log in to manage your preferences',
        MessageSeverity.error
      );
      this.router.navigate(['/login']);
      return;
    }

    this.initializeForm();
    this.loadUserPreferences();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Get default preferences
   */
  private getDefaultPreferences(): UserPreferences {
    return {
      theme: 'light',
      language: 'en',
      timezone: 'UTC',
      dateFormat: 'MM/dd/yyyy',
      timeFormat: '12h',
      notifications: {
        email: true,
        browser: true,
        security: true,
        updates: false
      },
      privacy: {
        profileVisibility: 'private',
        showEmail: false,
        showPhone: false,
        showLastLogin: false
      },
      dashboard: {
        layout: 'grid',
        itemsPerPage: 10,
        defaultView: 'dashboard'
      }
    };
  }

  /**
   * Initialize the preferences form
   */
  private initializeForm(): void {
    this.preferencesForm = this.formBuilder.group({
      // Appearance
      theme: [this.preferences.theme, [Validators.required]],
      language: [this.preferences.language, [Validators.required]],

      // Regional
      timezone: [this.preferences.timezone, [Validators.required]],
      dateFormat: [this.preferences.dateFormat, [Validators.required]],
      timeFormat: [this.preferences.timeFormat, [Validators.required]],

      // Notifications
      emailNotifications: [this.preferences.notifications.email],
      browserNotifications: [this.preferences.notifications.browser],
      securityNotifications: [this.preferences.notifications.security],
      updateNotifications: [this.preferences.notifications.updates],

      // Privacy
      profileVisibility: [this.preferences.privacy.profileVisibility, [Validators.required]],
      showEmail: [this.preferences.privacy.showEmail],
      showPhone: [this.preferences.privacy.showPhone],
      showLastLogin: [this.preferences.privacy.showLastLogin],

      // Dashboard
      dashboardLayout: [this.preferences.dashboard.layout, [Validators.required]],
      itemsPerPage: [this.preferences.dashboard.itemsPerPage, [Validators.required, Validators.min(5), Validators.max(50)]],
      defaultView: [this.preferences.dashboard.defaultView, [Validators.required]]
    });
  }

  /**
   * Load user preferences from server
   */
  private loadUserPreferences(): void {
    if (!this.currentUser) return;

    this.isLoading = true;

    this.accountService.getUserPreferences()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (preferencesJson) => {
          if (preferencesJson) {
            try {
              this.preferences = { ...this.getDefaultPreferences(), ...JSON.parse(preferencesJson) };
              this.updateFormWithPreferences();
            } catch (error) {
              console.warn('Failed to parse user preferences:', error);
              // Use defaults if parsing fails
            }
          }
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
          console.warn('Failed to load user preferences:', error);
          // Continue with defaults
        }
      });
  }

  /**
   * Update form with loaded preferences
   */
  private updateFormWithPreferences(): void {
    this.preferencesForm.patchValue({
      theme: this.preferences.theme,
      language: this.preferences.language,
      timezone: this.preferences.timezone,
      dateFormat: this.preferences.dateFormat,
      timeFormat: this.preferences.timeFormat,
      emailNotifications: this.preferences.notifications.email,
      browserNotifications: this.preferences.notifications.browser,
      securityNotifications: this.preferences.notifications.security,
      updateNotifications: this.preferences.notifications.updates,
      profileVisibility: this.preferences.privacy.profileVisibility,
      showEmail: this.preferences.privacy.showEmail,
      showPhone: this.preferences.privacy.showPhone,
      showLastLogin: this.preferences.privacy.showLastLogin,
      dashboardLayout: this.preferences.dashboard.layout,
      itemsPerPage: this.preferences.dashboard.itemsPerPage,
      defaultView: this.preferences.dashboard.defaultView
    });
  }

  /**
   * Handle form submission
   */
  onSubmit(): void {
    if (this.isSaving || !this.currentUser) return;

    // Validate form
    const validationResult = this.formValidationService.validateForm(this.preferencesForm);
    this.validationErrors = {};

    if (!validationResult.isValid) {
      // Convert validation errors to display format
      validationResult.errors.forEach(error => {
        if (!this.validationErrors[error.field]) {
          this.validationErrors[error.field] = [];
        }
        this.validationErrors[error.field].push(error.message);
      });

      this.formValidationService.focusFirstInvalidField(this.preferencesForm);

      this.alertService.showMessage(
        'Validation Error',
        'Please correct the errors and try again',
        MessageSeverity.error
      );
      return;
    }

    this.savePreferences();
  }

  /**
   * Save preferences
   */
  private savePreferences(): void {
    this.isSaving = true;
    this.alertService.startLoadingMessage('Saving preferences...');

    const formData = this.preferencesForm.value;

    // Build preferences object
    const preferences: UserPreferences = {
      theme: formData.theme,
      language: formData.language,
      timezone: formData.timezone,
      dateFormat: formData.dateFormat,
      timeFormat: formData.timeFormat,
      notifications: {
        email: formData.emailNotifications,
        browser: formData.browserNotifications,
        security: formData.securityNotifications,
        updates: formData.updateNotifications
      },
      privacy: {
        profileVisibility: formData.profileVisibility,
        showEmail: formData.showEmail,
        showPhone: formData.showPhone,
        showLastLogin: formData.showLastLogin
      },
      dashboard: {
        layout: formData.dashboardLayout,
        itemsPerPage: formData.itemsPerPage,
        defaultView: formData.defaultView
      }
    };

    const preferencesJson = JSON.stringify(preferences);

    this.accountService.updateUserPreferences(preferencesJson)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.alertService.stopLoadingMessage();
          this.preferences = preferences;
          this.isSaving = false;

          this.alertService.showMessage(
            'Preferences Saved',
            'Your preferences have been successfully updated',
            MessageSeverity.success
          );

          // Apply theme change immediately if changed
          if (formData.theme !== this.preferences.theme) {
            this.applyTheme(formData.theme);
          }
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

    this.alertService.showStickyMessage(
      'Save Failed',
      'Unable to save your preferences. Please try again later.',
      MessageSeverity.error,
      error
    );
  }

  /**
   * Reset preferences to defaults
   */
  resetToDefaults(): void {
    this.alertService.showDialog(
      'Are you sure you want to reset all preferences to default values?',
      DialogType.confirm,
      () => {
        this.preferences = this.getDefaultPreferences();
        this.updateFormWithPreferences();

        this.alertService.showMessage(
          'Preferences Reset',
          'All preferences have been reset to default values',
          MessageSeverity.info
        );
      }
    );
  }

  /**
   * Apply theme immediately
   */
  private applyTheme(theme: string): void {
    const body = document.body;
    body.classList.remove('theme-light', 'theme-dark', 'theme-auto');

    if (theme === 'auto') {
      // Use system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      body.classList.add(prefersDark ? 'theme-dark' : 'theme-light');
    } else {
      body.classList.add(`theme-${theme}`);
    }
  }

  /**
   * Cancel and return to profile
   */
  cancel(): void {
    if (this.preferencesForm.dirty) {
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
    const control = this.preferencesForm.get(fieldName);
    if (!control) return '';

    if (this.hasFieldError(fieldName)) return 'is-invalid';
    if (control.valid && control.dirty) return 'is-valid';

    return '';
  }
}
