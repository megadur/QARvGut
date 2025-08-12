// ---------------------------------------
// Story 1.2 Task 2: Login Validation Service
// Enterprise-grade validation for authentication forms
// ---------------------------------------

import { Injectable } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';

export interface LoginValidationResult {
  isValid: boolean;
  errors: LoginValidationError[];
  fieldErrors: Record<string, string[]>;
}

export interface LoginValidationError {
  field: string;
  type: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

@Injectable({
  providedIn: 'root'
})
export class LoginValidationService {

  /**
   * Comprehensive validation for login forms
   * @param form The reactive form to validate
   */
  validateLoginForm(form: FormGroup): LoginValidationResult {
    const errors: LoginValidationError[] = [];
    const fieldErrors: Record<string, string[]> = {};

    // Validate all form fields
    Object.keys(form.controls).forEach(field => {
      const control = form.get(field);
      const fieldValidationErrors = this.validateField(field, control);

      if (fieldValidationErrors.length > 0) {
        errors.push(...fieldValidationErrors);
        fieldErrors[field] = fieldValidationErrors.map(error => error.message);
      }
    });

    // Cross-field validation
    const crossFieldErrors = this.validateCrossFields(form);
    errors.push(...crossFieldErrors);

    return {
      isValid: errors.filter(e => e.severity === 'error').length === 0,
      errors,
      fieldErrors
    };
  }

  /**
   * Validate individual form field
   * @param fieldName Name of the field
   * @param control Form control to validate
   */
  private validateField(fieldName: string, control: AbstractControl | null): LoginValidationError[] {
    const errors: LoginValidationError[] = [];

    if (!control) return errors;

    const value = control.value;

    switch (fieldName) {
      case 'email':
      case 'userName':
        errors.push(...this.validateUsername(fieldName, value, control));
        break;
      case 'password':
        errors.push(...this.validatePassword(value, control));
        break;
    }

    return errors;
  }

  /**
   * Validate username/email field
   * @param fieldName Field name for error reporting
   * @param value Field value
   * @param control Form control
   */
  private validateUsername(fieldName: string, value: string, control: AbstractControl): LoginValidationError[] {
    const errors: LoginValidationError[] = [];

    // Required validation
    if (control.hasError('required')) {
      errors.push({
        field: fieldName,
        type: 'required',
        message: `${fieldName === 'email' ? 'Email' : 'Username'} is required`,
        severity: 'error'
      });
      return errors; // Don't proceed with other validations if required is missing
    }

    if (!value) return errors;

    // Email format validation if field is email
    if (fieldName === 'email' && control.hasError('email')) {
      errors.push({
        field: fieldName,
        type: 'email',
        message: 'Please enter a valid email address',
        severity: 'error'
      });
    }

    // Length validation
    if (value.length < 3) {
      errors.push({
        field: fieldName,
        type: 'minlength',
        message: `${fieldName === 'email' ? 'Email' : 'Username'} must be at least 3 characters long`,
        severity: 'error'
      });
    }

    if (value.length > 100) {
      errors.push({
        field: fieldName,
        type: 'maxlength',
        message: `${fieldName === 'email' ? 'Email' : 'Username'} must not exceed 100 characters`,
        severity: 'error'
      });
    }

    // Basic format validation for username
    if (fieldName === 'userName' && !/^[a-zA-Z0-9._@-]+$/.test(value)) {
      errors.push({
        field: fieldName,
        type: 'pattern',
        message: 'Username can only contain letters, numbers, and basic symbols (._@-)',
        severity: 'error'
      });
    }

    // Suspicious pattern detection
    if (this.containsSuspiciousPatterns(value)) {
      errors.push({
        field: fieldName,
        type: 'suspicious_pattern',
        message: 'Invalid characters detected in username',
        severity: 'warning'
      });
    }

    return errors;
  }

  /**
   * Validate password field
   * @param value Password value
   * @param control Form control
   */
  private validatePassword(value: string, control: AbstractControl): LoginValidationError[] {
    const errors: LoginValidationError[] = [];

    // Required validation
    if (control.hasError('required')) {
      errors.push({
        field: 'password',
        type: 'required',
        message: 'Password is required',
        severity: 'error'
      });
      return errors;
    }

    if (!value) return errors;

    // Length validation
    if (value.length < 1) {
      errors.push({
        field: 'password',
        type: 'minlength',
        message: 'Password cannot be empty',
        severity: 'error'
      });
    }

    if (value.length > 1000) {
      errors.push({
        field: 'password',
        type: 'maxlength',
        message: 'Password is too long',
        severity: 'error'
      });
    }

    // Security warnings for login (less strict than registration)
    if (value.length < 8) {
      errors.push({
        field: 'password',
        type: 'weak_password',
        message: 'Consider using a longer password for better security',
        severity: 'info'
      });
    }

    return errors;
  }

  /**
   * Cross-field validation for login forms
   * @param form Form group to validate
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private validateCrossFields(form: FormGroup): LoginValidationError[] {
    const errors: LoginValidationError[] = [];

    // Add any cross-field validations here
    // For login, we typically don't have complex cross-field validations
    // but this structure is ready for future enhancements

    return errors;
  }

  /**
   * Check for suspicious patterns in input
   * @param value Input value to check
   */
  private containsSuspiciousPatterns(value: string): boolean {
    const suspiciousPatterns = [
      /<[^>]*script[^>]*>/gi, // Script tags
      /javascript:/gi,        // JavaScript protocols
      /vbscript:/gi,         // VBScript protocols
      /on\w+\s*=/gi,         // Event handlers
      /[<>'"]/g              // HTML injection characters
    ];

    return suspiciousPatterns.some(pattern => pattern.test(value));
  }

  /**
   * Get user-friendly error messages for form display
   * @param validationResult Validation result
   */
  getFormErrorMessages(validationResult: LoginValidationResult): string[] {
    return validationResult.errors
      .filter(error => error.severity === 'error')
      .map(error => error.message);
  }

  /**
   * Get field-specific error message
   * @param fieldName Field name
   * @param validationResult Validation result
   */
  getFieldErrorMessage(fieldName: string, validationResult: LoginValidationResult): string | null {
    const fieldError = validationResult.errors.find(
      error => error.field === fieldName && error.severity === 'error'
    );
    return fieldError?.message || null;
  }

  /**
   * Focus first invalid field in the form
   * @param form Form group
   */
  focusFirstInvalidField(form: FormGroup): void {
    const firstInvalidControl = Object.keys(form.controls).find(key =>
      form.get(key)?.invalid
    );

    if (firstInvalidControl) {
      const element = document.getElementById(`login-${firstInvalidControl}`);
      if (element) {
        element.focus();
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }

  /**
   * Check if form has warnings (non-error issues)
   * @param validationResult Validation result
   */
  hasWarnings(validationResult: LoginValidationResult): boolean {
    return validationResult.errors.some(error => error.severity === 'warning');
  }

  /**
   * Get warning messages for display
   * @param validationResult Validation result
   */
  getWarningMessages(validationResult: LoginValidationResult): string[] {
    return validationResult.errors
      .filter(error => error.severity === 'warning')
      .map(error => error.message);
  }
}
