// ---------------------------------------
// Story 1.2 Task 2: Login Validation Service Tests
// Comprehensive test coverage for enterprise validation
// ---------------------------------------

import { TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginValidationService } from './login-validation.service';

describe('LoginValidationService', () => {
  let service: LoginValidationService;
  let formBuilder: FormBuilder;
  let loginForm: FormGroup;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoginValidationService, FormBuilder]
    });

    service = TestBed.inject(LoginValidationService);
    formBuilder = TestBed.inject(FormBuilder);

    // Create a standard login form for testing
    loginForm = formBuilder.group({
      userName: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required]]
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('validateLoginForm', () => {
    it('should return valid result for valid form', () => {
      loginForm.patchValue({
        userName: 'testuser',
        password: 'password123'
      });

      const result = service.validateLoginForm(loginForm);

      expect(result.isValid).toBe(true);
      expect(result.errors.length).toBe(0);
      expect(Object.keys(result.fieldErrors).length).toBe(0);
    });

    it('should return invalid result for empty form', () => {
      const result = service.validateLoginForm(loginForm);

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.fieldErrors['userName']).toContain('Username is required');
      expect(result.fieldErrors['password']).toContain('Password is required');
    });

    it('should validate username length requirements', () => {
      loginForm.patchValue({
        userName: 'ab', // Too short
        password: 'password123'
      });

      const result = service.validateLoginForm(loginForm);

      expect(result.isValid).toBe(false);
      expect(result.fieldErrors['userName']).toContain('Username must be at least 3 characters long');
    });

    it('should validate email format when using email field', () => {
      const emailForm = formBuilder.group({
        email: ['invalid-email', [Validators.required, Validators.email]],
        password: ['password123', [Validators.required]]
      });

      const result = service.validateLoginForm(emailForm);

      expect(result.isValid).toBe(false);
      expect(result.fieldErrors['email']).toContain('Please enter a valid email address');
    });

    it('should detect suspicious patterns in username', () => {
      loginForm.patchValue({
        userName: '<script>alert("xss")</script>',
        password: 'password123'
      });

      const result = service.validateLoginForm(loginForm);

      expect(result.isValid).toBe(false);
      const hasWarning = result.errors.some(error =>
        error.type === 'suspicious_pattern' && error.severity === 'warning'
      );
      expect(hasWarning).toBe(true);
    });

    it('should handle maximum length validation', () => {
      const longUsername = 'a'.repeat(101);
      loginForm.patchValue({
        userName: longUsername,
        password: 'password123'
      });

      const result = service.validateLoginForm(loginForm);

      expect(result.isValid).toBe(false);
      expect(result.fieldErrors['userName']).toContain('Username must not exceed 100 characters');
    });

    it('should provide informational messages for short passwords', () => {
      loginForm.patchValue({
        userName: 'testuser',
        password: 'short'
      });

      const result = service.validateLoginForm(loginForm);

      const hasInfoMessage = result.errors.some(error =>
        error.severity === 'info' && error.message.includes('Consider using a longer password')
      );
      expect(hasInfoMessage).toBe(true);
    });
  });

  describe('getFormErrorMessages', () => {
    it('should return error messages for form display', () => {
      const result = service.validateLoginForm(loginForm); // Empty form
      const errorMessages = service.getFormErrorMessages(result);

      expect(errorMessages.length).toBeGreaterThan(0);
      expect(errorMessages).toContain('Username is required');
      expect(errorMessages).toContain('Password is required');
    });

    it('should filter out non-error messages', () => {
      loginForm.patchValue({
        userName: 'testuser',
        password: 'short' // This generates an info message
      });

      const result = service.validateLoginForm(loginForm);
      const errorMessages = service.getFormErrorMessages(result);

      // Should not include info messages, only errors
      const hasInfoMessage = errorMessages.some(msg => msg.includes('Consider using a longer password'));
      expect(hasInfoMessage).toBe(false);
    });
  });

  describe('getFieldErrorMessage', () => {
    it('should return specific field error message', () => {
      const result = service.validateLoginForm(loginForm); // Empty form
      const usernameError = service.getFieldErrorMessage('userName', result);

      expect(usernameError).toBe('Username is required');
    });

    it('should return null for valid fields', () => {
      loginForm.patchValue({
        userName: 'testuser',
        password: 'password123'
      });

      const result = service.validateLoginForm(loginForm);
      const usernameError = service.getFieldErrorMessage('userName', result);

      expect(usernameError).toBeNull();
    });
  });

  describe('focusFirstInvalidField', () => {
    beforeEach(() => {
      // Mock DOM elements
      const mockElement = {
        focus: jasmine.createSpy('focus'),
        scrollIntoView: jasmine.createSpy('scrollIntoView')
      };
      spyOn(document, 'getElementById').and.returnValue(mockElement as unknown as HTMLElement);
    });

    it('should focus first invalid field', () => {
      loginForm.get('userName')?.setErrors({ required: true });

      service.focusFirstInvalidField(loginForm);

      expect(document.getElementById).toHaveBeenCalledWith('login-userName');
    });

    it('should handle missing DOM elements gracefully', () => {
      (document.getElementById as jasmine.Spy).and.returnValue(null);
      loginForm.get('userName')?.setErrors({ required: true });

      expect(() => {
        service.focusFirstInvalidField(loginForm);
      }).not.toThrow();
    });
  });

  describe('hasWarnings', () => {
    it('should detect warning messages', () => {
      loginForm.patchValue({
        userName: '<script>alert("test")</script>', // Suspicious pattern
        password: 'password123'
      });

      const result = service.validateLoginForm(loginForm);
      const hasWarnings = service.hasWarnings(result);

      expect(hasWarnings).toBe(true);
    });

    it('should return false when no warnings present', () => {
      loginForm.patchValue({
        userName: 'testuser',
        password: 'password123'
      });

      const result = service.validateLoginForm(loginForm);
      const hasWarnings = service.hasWarnings(result);

      expect(hasWarnings).toBe(false);
    });
  });

  describe('getWarningMessages', () => {
    it('should return warning messages', () => {
      loginForm.patchValue({
        userName: '<script>test</script>', // Suspicious pattern
        password: 'password123'
      });

      const result = service.validateLoginForm(loginForm);
      const warnings = service.getWarningMessages(result);

      expect(warnings.length).toBeGreaterThan(0);
      expect(warnings[0]).toContain('Invalid characters detected');
    });

    it('should return empty array when no warnings', () => {
      loginForm.patchValue({
        userName: 'testuser',
        password: 'password123'
      });

      const result = service.validateLoginForm(loginForm);
      const warnings = service.getWarningMessages(result);

      expect(warnings).toEqual([]);
    });
  });

  describe('cross-field validation', () => {
    it('should handle forms without cross-field requirements', () => {
      loginForm.patchValue({
        userName: 'testuser',
        password: 'password123'
      });

      const result = service.validateLoginForm(loginForm);

      // Login forms typically don't have cross-field validation
      // but the structure should support it
      expect(result.isValid).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should handle form with null controls', () => {
      const emptyForm = formBuilder.group({});

      const result = service.validateLoginForm(emptyForm);

      expect(result.isValid).toBe(true); // No fields to validate
      expect(result.errors.length).toBe(0);
    });

    it('should handle special characters in valid usernames', () => {
      loginForm.patchValue({
        userName: 'user.name@domain.com',
        password: 'password123'
      });

      const result = service.validateLoginForm(loginForm);

      expect(result.isValid).toBe(true);
    });

    it('should handle very long passwords gracefully', () => {
      const veryLongPassword = 'a'.repeat(1001);
      loginForm.patchValue({
        userName: 'testuser',
        password: veryLongPassword
      });

      const result = service.validateLoginForm(loginForm);

      expect(result.isValid).toBe(false);
      expect(result.fieldErrors['password']).toContain('Password is too long');
    });
  });
});
