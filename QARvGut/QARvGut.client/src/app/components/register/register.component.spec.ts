// ---------------------------------------
// Story 1.2 Refactor: Comprehensive Unit Tests
// Senior Dev Review - Testing Excellence
// ---------------------------------------

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

import { RegisterComponent } from './register.component';
import { AlertService } from '../../services/alert.service';
import { AccountService } from '../../services/account.service';
import { AuthService } from '../../services/auth.service';
import { FormValidationService } from '../../services/form-validation.service';
import { UserRegistration } from '../../models/user-edit.model';
import { User } from '../../models/user.model';
import { LoginValidationService } from '../../services/login-validation.service';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let mockAlertService: jasmine.SpyObj<AlertService>;
  let mockAccountService: jasmine.SpyObj<AccountService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockFormValidationService: jasmine.SpyObj<FormValidationService>;

  const mockUser: User = {
    id: '1',
    userName: 'testuser',
    fullName: 'Test User',
    email: 'test@example.com',
    jobTitle: 'Developer',
    phoneNumber: '123-456-7890',
    roles: ['Assessor'],
    isEnabled: true,
    isLockedOut: false,
    department: 'IT',
    phone: '123-456-7890',
    contactInfo: 'test contact',
    preferences: null,
    lastLoginDate: null,
    lastLoginIp: null,
    loginCount: 0,
    isActive: true,
    gesperrtSeit: null,
    avatar: null,
    friendlyName: 'Developer Test User',
    firstName: 'Test',
    lastName: 'User'
  };

  beforeEach(async () => {
    const alertSpy = jasmine.createSpyObj('AlertService', [
      'startLoadingMessage', 'stopLoadingMessage', 'showMessage', 'showStickyMessage'
    ]);
    const accountSpy = jasmine.createSpyObj('AccountService', ['registerUser']);
    const authSpy = jasmine.createSpyObj('AuthService', ['redirectLoginUser']);
    Object.defineProperty(authSpy, 'isLoggedIn', { writable: true, value: false });
    Object.defineProperty(authSpy, 'isSessionExpired', { writable: true, value: false });
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const formValidationSpy = jasmine.createSpyObj('FormValidationService', [
      'validateForm', 'focusFirstInvalidField'
    ]);

    await TestBed.configureTestingModule({
      imports: [RegisterComponent, ReactiveFormsModule],
      providers: [
        { provide: AlertService, useValue: alertSpy },
        { provide: AccountService, useValue: accountSpy },
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpy },
        { provide: FormValidationService, useValue: formValidationSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    mockAlertService = TestBed.inject(AlertService) as jasmine.SpyObj<AlertService>;
    mockAccountService = TestBed.inject(AccountService) as jasmine.SpyObj<AccountService>;
    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    mockFormValidationService = TestBed.inject(FormValidationService) as jasmine.SpyObj<FormValidationService>;
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize form with correct default values', () => {
      fixture.detectChanges();

      expect(component.registrationForm.get('role')?.value).toBe('Assessor');
      expect(component.registrationForm.get('acceptTerms')?.value).toBe(false);
      expect(component.availableRoles).toEqual(['Assessor']);
    });

    it('should redirect if user is already logged in', () => {
      spyOnProperty(mockAuthService, 'isLoggedIn', 'get').and.returnValue(true);
      spyOnProperty(mockAuthService, 'isSessionExpired', 'get').and.returnValue(false);

      fixture.detectChanges();

      expect(mockAuthService.redirectLoginUser).toHaveBeenCalled();
    });

    it('should not redirect if session is expired', () => {
      spyOnProperty(mockAuthService, 'isLoggedIn', 'get').and.returnValue(true);
      spyOnProperty(mockAuthService, 'isSessionExpired', 'get').and.returnValue(true);

      fixture.detectChanges();

      expect(mockAuthService.redirectLoginUser).not.toHaveBeenCalled();
    });
  });

  describe('Form Validation', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should require username', () => {
      const usernameControl = component.registrationForm.get('userName');
      expect(usernameControl?.hasError('required')).toBe(true);
    });

    it('should validate email format', () => {
      const emailControl = component.registrationForm.get('email');
      emailControl?.setValue('invalid-email');
      expect(emailControl?.hasError('email')).toBe(true);

      emailControl?.setValue('valid@example.com');
      expect(emailControl?.hasError('email')).toBe(false);
    });

    it('should enforce minimum username length', () => {
      const usernameControl = component.registrationForm.get('userName');
      usernameControl?.setValue('a');
      expect(usernameControl?.hasError('minlength')).toBe(true);

      usernameControl?.setValue('ab');
      expect(usernameControl?.hasError('minlength')).toBe(false);
    });

    it('should validate password strength', () => {
      const passwordControl = component.registrationForm.get('password');
      passwordControl?.setValue('weak');
      expect(passwordControl?.hasError('passwordStrength')).toBe(true);

      passwordControl?.setValue('Strong123!');
      expect(passwordControl?.hasError('passwordStrength')).toBe(false);
    });

    it('should validate password match', () => {
      const passwordControl = component.registrationForm.get('password');
      const confirmPasswordControl = component.registrationForm.get('confirmPassword');

      passwordControl?.setValue('Strong123!');
      confirmPasswordControl?.setValue('Different123!');

      expect(component.registrationForm.hasError('passwordMismatch')).toBe(true);

      confirmPasswordControl?.setValue('Strong123!');
      expect(component.registrationForm.hasError('passwordMismatch')).toBe(false);
    });

    it('should require terms acceptance', () => {
      const acceptTermsControl = component.registrationForm.get('acceptTerms');
      expect(acceptTermsControl?.hasError('required')).toBe(true);

      acceptTermsControl?.setValue(true);
      expect(acceptTermsControl?.hasError('required')).toBe(false);
    });
  });

  describe('Registration Process', () => {
    beforeEach(() => {
      fixture.detectChanges();
      // Set valid form values
      component.registrationForm.patchValue({
        userName: 'testuser',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        password: 'Strong123!',
        confirmPassword: 'Strong123!',
        acceptTerms: true
      });
    });

    it('should call registerUser service on successful form submission', () => {
      mockAccountService.registerUser.and.returnValue(of(mockUser));

      component.onSubmit();

      expect(mockAccountService.registerUser).toHaveBeenCalled();
      expect(mockAlertService.startLoadingMessage).toHaveBeenCalledWith('Creating your account...');
    });

    it('should create correct registration payload', () => {
      component.registrationForm.patchValue({
        jobTitle: 'Developer',
        phoneNumber: '123-456-7890',
        department: 'IT'
      });

      mockAccountService.registerUser.and.returnValue(of(mockUser));
      component.onSubmit();

      const expectedPayload: UserRegistration = {
        userName: 'testuser',
        email: 'test@example.com',
        password: 'Strong123!',
        confirmPassword: 'Strong123!',
        fullName: 'Test User',
        jobTitle: 'Developer',
        phoneNumber: '123-456-7890',
        department: 'IT',
        phone: null,
        contactInfo: null,
        roles: ['Assessor']
      };

      expect(mockAccountService.registerUser).toHaveBeenCalledWith(expectedPayload);
    });


    it('should handle server validation errors', () => {
      const errorResponse = new HttpErrorResponse({
        status: 400,
        error: {
          errors: {
            'Email': ['This email is already registered'],
            'UserName': ['This username is taken']
          }
        }
      });

      mockAccountService.registerUser.and.returnValue(throwError(() => errorResponse));

      component.onSubmit();

      expect(mockAlertService.stopLoadingMessage).toHaveBeenCalled();

    });

    it('should handle network errors', () => {
      const networkError = new HttpErrorResponse({
        status: 0,
        error: 'Network error'
      });

      mockAccountService.registerUser.and.returnValue(throwError(() => networkError));

      component.onSubmit();

      expect(mockAlertService.stopLoadingMessage).toHaveBeenCalled();
      expect(mockAlertService.showStickyMessage).toHaveBeenCalled();
    });

    it('should handle form validation errors', () => {
      component.registrationForm.patchValue({
        userName: '', // Invalid
        acceptTerms: false // Invalid
      });

      mockFormValidationService.validateForm.and.returnValue({
        isValid: false,
        errors: [
          { field: 'userName', error: 'required', message: 'Username is required', severity: 'error' }
        ],
        firstInvalidField: 'userName'
      });

      component.onSubmit();

      expect(mockFormValidationService.validateForm).toHaveBeenCalled();
      expect(mockFormValidationService.focusFirstInvalidField).toHaveBeenCalled();

    });
  });

  describe('Form Field Getters', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should provide access to form controls', () => {
      expect(component.userName).toBe(component.registrationForm.get('userName'));
      expect(component.email).toBe(component.registrationForm.get('email'));
      expect(component.firstName).toBe(component.registrationForm.get('firstName'));
      expect(component.lastName).toBe(component.registrationForm.get('lastName'));
      expect(component.password).toBe(component.registrationForm.get('password'));
      expect(component.confirmPassword).toBe(component.registrationForm.get('confirmPassword'));
    });
  });

  describe('Component Lifecycle', () => {
    it('should clean up subscriptions on destroy', () => {
      fixture.detectChanges();
      spyOn(component['destroy$'], 'next');
      spyOn(component['destroy$'], 'complete');

      fixture.destroy();

      expect(component['destroy$'].next).toHaveBeenCalled();
      expect(component['destroy$'].complete).toHaveBeenCalled();
    });
  });

  describe('Integration with PasswordValidators', () => {
    it('should use PasswordValidators for password strength validation', () => {
      const passwordControl = component.registrationForm.get('password');

      // Test weak password
      passwordControl?.setValue('123');
      expect(passwordControl?.hasError('passwordStrength')).toBe(true);

      // Test strong password
      passwordControl?.setValue('StrongPassword123!');
      expect(passwordControl?.hasError('passwordStrength')).toBe(false);
    });

    it('should use PasswordValidators for password matching', () => {
      component.registrationForm.patchValue({
        password: 'StrongPassword123!',
        confirmPassword: 'DifferentPassword123!'
      });

      expect(component.registrationForm.hasError('passwordMismatch')).toBe(true);

      component.registrationForm.patchValue({
        confirmPassword: 'StrongPassword123!'
      });

      expect(component.registrationForm.hasError('passwordMismatch')).toBe(false);
    });
  });
});

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

    loginForm = formBuilder.group({
      userName: ['', Validators.required],
      password: ['', Validators.required]
    });
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should validate login form', () => {
    // Simulate form input
    loginForm.patchValue({
      userName: 'testuser',
      password: 'password123'
    });

    const result = service.validateLoginForm(loginForm);

    expect(result).toBeNull(); // No errors expected
  });


});
