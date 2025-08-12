// ---------------------------------------
// Story 1.2 Refactor: Password Validation Service
// Senior Dev Review - Extract Complex Validation Logic
// ---------------------------------------

import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export interface PasswordStrengthRequirements {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumeric: boolean;
  requireSpecialChar: boolean;
}

export interface PasswordStrengthResult {
  isValid: boolean;
  score: number; // 0-100
  missingRequirements: string[];
  errors?: Record<string, boolean>;
}

export class PasswordValidators {
  private static readonly DEFAULT_REQUIREMENTS: PasswordStrengthRequirements = {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumeric: true,
    requireSpecialChar: true
  };

  /**
   * Enhanced password strength validator with configurable requirements
   * @param requirements Optional custom requirements, defaults to company standards
   */
  static strengthValidator(requirements?: Partial<PasswordStrengthRequirements>): ValidatorFn {
    const config = { ...PasswordValidators.DEFAULT_REQUIREMENTS, ...requirements };

    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) {
        return null; // Let required validator handle empty values
      }

      const result = PasswordValidators.validatePasswordStrength(value, config);

      return result.isValid ? null : { passwordStrength: result.errors };
    };
  }

  /**
   * Cross-field password match validator
   * @param passwordField Name of password field
   * @param confirmPasswordField Name of confirm password field
   */
  static matchValidator(passwordField = 'password', confirmPasswordField = 'confirmPassword'): ValidatorFn {
    return (form: AbstractControl): ValidationErrors | null => {
      const password = form.get(passwordField)?.value;
      const confirmPassword = form.get(confirmPasswordField)?.value;

      if (!password || !confirmPassword) {
        return null; // Don't validate if either field is empty
      }

      return password === confirmPassword ? null : {
        passwordMismatch: {
          expectedField: passwordField,
          actualField: confirmPasswordField
        }
      };
    };
  }

  /**
   * Comprehensive password strength analysis
   * @param password The password to validate
   * @param requirements Strength requirements
   */
  static validatePasswordStrength(password: string, requirements: PasswordStrengthRequirements): PasswordStrengthResult {
    const tests = {
      hasMinLength: password.length >= requirements.minLength,
      hasUpperCase: requirements.requireUppercase ? /[A-Z]/.test(password) : true,
      hasLowerCase: requirements.requireLowercase ? /[a-z]/.test(password) : true,
      hasNumeric: requirements.requireNumeric ? /[0-9]/.test(password) : true,
      hasSpecialChar: requirements.requireSpecialChar ? /[!@#$%^&*(),.?":{}|<>_\-+=]/.test(password) : true
    };

    const failedTests = Object.entries(tests).filter(([, passed]) => !passed);
    const passedCount = Object.values(tests).filter(passed => passed).length;
    const score = Math.round((passedCount / Object.keys(tests).length) * 100);

    const missingRequirements: string[] = [];
    const errors: Record<string, boolean> = {};

    if (!tests.hasMinLength) {
      missingRequirements.push(`at least ${requirements.minLength} characters`);
      errors['minLength'] = true;
    }
    if (!tests.hasUpperCase) {
      missingRequirements.push('one uppercase letter');
      errors['requiresUppercase'] = true;
    }
    if (!tests.hasLowerCase) {
      missingRequirements.push('one lowercase letter');
      errors['requiresLowercase'] = true;
    }
    if (!tests.hasNumeric) {
      missingRequirements.push('one number');
      errors['requiresNumeric'] = true;
    }
    if (!tests.hasSpecialChar) {
      missingRequirements.push('one special character');
      errors['requiresSpecialChar'] = true;
    }

    return {
      isValid: failedTests.length === 0,
      score,
      missingRequirements,
      errors: failedTests.length > 0 ? errors : undefined
    };
  }

  /**
   * Get user-friendly password strength description
   * @param score Password strength score (0-100)
   */
  static getStrengthDescription(score: number): { text: string; color: string; cssClass: string } {
    if (score >= 100) return { text: 'Excellent', color: '#28a745', cssClass: 'text-success' };
    if (score >= 80) return { text: 'Strong', color: '#20c997', cssClass: 'text-info' };
    if (score >= 60) return { text: 'Good', color: '#ffc107', cssClass: 'text-warning' };
    if (score >= 40) return { text: 'Fair', color: '#fd7e14', cssClass: 'text-warning' };
    return { text: 'Weak', color: '#dc3545', cssClass: 'text-danger' };
  }
}
