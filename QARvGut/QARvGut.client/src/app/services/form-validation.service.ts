// ---------------------------------------
// Story 1.2 Refactor: Form Validation Service
// Senior Dev Review - Centralized Validation Logic
// ---------------------------------------

import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

export interface ValidationErrorInfo {
  field: string;
  error: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

export interface FormValidationResult {
  isValid: boolean;
  errors: ValidationErrorInfo[];
  firstInvalidField?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FormValidationService {

  /**
   * Validate entire form and return structured error information
   * @param form The FormGroup to validate
   * @param fieldConfig Optional configuration for custom error messages
   */
  validateForm(form: FormGroup, fieldConfig?: Record<string, Record<string, string>>): FormValidationResult {
    const errors: ValidationErrorInfo[] = [];
    let firstInvalidField: string | undefined;

    Object.keys(form.controls).forEach(fieldName => {
      const control = form.get(fieldName);
      if (control && control.invalid) {
        if (!firstInvalidField) {
          firstInvalidField = fieldName;
        }

        const fieldErrors = this.getFieldValidationErrors(fieldName, control, fieldConfig?.[fieldName]);
        errors.push(...fieldErrors);
      }
    });

    // Check for form-level errors (e.g., password mismatch)
    if (form.errors) {
      const formErrors = this.getFormLevelErrors(form);
      errors.push(...formErrors);
    }

    return {
      isValid: errors.length === 0,
      errors,
      firstInvalidField
    };
  }

  /**
   * Get validation errors for a specific form field
   * @param fieldName Name of the field
   * @param control The form control
   * @param customMessages Optional custom error messages
   */
  private getFieldValidationErrors(
    fieldName: string,
    control: AbstractControl,
    customMessages?: Record<string, string>
  ): ValidationErrorInfo[] {
    const errors: ValidationErrorInfo[] = [];

    if (!control.errors) {
      return errors;
    }

    Object.keys(control.errors).forEach(errorKey => {
      const errorData = control.errors![errorKey];
      const message = customMessages?.[errorKey] || this.getDefaultErrorMessage(fieldName, errorKey, errorData);

      errors.push({
        field: fieldName,
        error: errorKey,
        message,
        severity: 'error'
      });
    });

    return errors;
  }

  /**
   * Get form-level validation errors (cross-field validations)
   * @param form The FormGroup
   */
  private getFormLevelErrors(form: FormGroup): ValidationErrorInfo[] {
    const errors: ValidationErrorInfo[] = [];

    if (!form.errors) {
      return errors;
    }

    Object.keys(form.errors).forEach(errorKey => {
      let message = '';
      let affectedField = '';

      switch (errorKey) {
        case 'passwordMismatch':
          message = 'Passwords do not match';
          affectedField = 'confirmPassword';
          break;
        default:
          message = `Form validation error: ${errorKey}`;
          affectedField = 'form';
      }

      errors.push({
        field: affectedField,
        error: errorKey,
        message,
        severity: 'error'
      });
    });

    return errors;
  }

  /**
   * Get default error messages for common validation errors
   * @param fieldName Name of the field
   * @param errorKey Type of validation error
   * @param errorData Additional error data
   */
  private getDefaultErrorMessage(fieldName: string, errorKey: string, errorData: unknown): string {
    const fieldDisplayName = this.getFieldDisplayName(fieldName);

    switch (errorKey) {
      case 'required':
        return `${fieldDisplayName} is required`;
      case 'email':
        return 'Please enter a valid email address';
      case 'minlength':
        return `${fieldDisplayName} must be at least ${(errorData as { requiredLength: number }).requiredLength} characters`;
      case 'maxlength':
        return `${fieldDisplayName} cannot exceed ${(errorData as { requiredLength: number }).requiredLength} characters`;
      case 'pattern':
        return `${fieldDisplayName} format is invalid`;
      case 'passwordStrength':
        return this.getPasswordStrengthErrorMessage(errorData as Record<string, boolean>);
      default:
        return `${fieldDisplayName} is invalid`;
    }
  }

  /**
   * Generate user-friendly field display names
   * @param fieldName Technical field name
   */
  private getFieldDisplayName(fieldName: string): string {
    const displayNames: Record<string, string> = {
      'userName': 'Username',
      'email': 'Email Address',
      'firstName': 'First Name',
      'lastName': 'Last Name',
      'jobTitle': 'Job Title',
      'phoneNumber': 'Phone Number',
      'department': 'Department',
      'phone': 'Phone',
      'contactInfo': 'Contact Information',
      'password': 'Password',
      'confirmPassword': 'Confirm Password',
      'role': 'Role',
      'acceptTerms': 'Terms & Conditions'
    };

    return displayNames[fieldName] || fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
  }

  /**
   * Generate detailed password strength error message
   * @param strengthErrors Password strength validation errors
   */
  private getPasswordStrengthErrorMessage(strengthErrors: Record<string, boolean>): string {
    const requirements: string[] = [];

    if (strengthErrors['minLength']) requirements.push('at least 8 characters');
    if (strengthErrors['requiresUppercase']) requirements.push('one uppercase letter');
    if (strengthErrors['requiresLowercase']) requirements.push('one lowercase letter');
    if (strengthErrors['requiresNumeric']) requirements.push('one number');
    if (strengthErrors['requiresSpecialChar']) requirements.push('one special character');

    return `Password must contain: ${requirements.join(', ')}`;
  }

  /**
   * Focus on the first invalid field in a form
   * @param form The FormGroup
   * @param containerSelector Optional container selector for scoped field search
   */
  focusFirstInvalidField(form: FormGroup, containerSelector?: string): void {
    const firstInvalidField = this.findFirstInvalidField(form);
    if (firstInvalidField) {
      setTimeout(() => {
        const fieldElement = containerSelector
          ? document.querySelector(`${containerSelector} [formControlName="${firstInvalidField}"]`)
          : document.querySelector(`[formControlName="${firstInvalidField}"]`);

        if (fieldElement instanceof HTMLElement) {
          fieldElement.focus();
        }
      }, 100);
    }
  }

  /**
   * Find the name of the first invalid field in form
   * @param form The FormGroup
   */
  private findFirstInvalidField(form: FormGroup): string | null {
    for (const fieldName of Object.keys(form.controls)) {
      const control = form.get(fieldName);
      if (control && control.invalid) {
        return fieldName;
      }
    }
    return null;
  }
}
