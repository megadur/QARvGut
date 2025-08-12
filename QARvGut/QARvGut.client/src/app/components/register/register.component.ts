// ---------------------------------------
// Story 1.2: User Registration & Profile Management
// Registration Component - User Registration Form
// ---------------------------------------

import { Component, OnInit, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { AlertService, MessageSeverity } from '../../services/alert.service';
import { AccountService } from '../../services/account.service';
import { AuthService } from '../../services/auth.service';
import { Utilities } from '../../services/utilities';
import { UserRegistration } from '../../models/user-edit.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  imports: [ReactiveFormsModule, CommonModule, RouterModule, TranslateModule]
})
export class RegisterComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private alertService = inject(AlertService);
  private accountService = inject(AccountService);
  private authService = inject(AuthService);
  private router = inject(Router);

  registrationForm!: FormGroup;
  isLoading = false;
  showValidationErrors = false;
  
  availableRoles = ['Assessor']; // Only Assessor role can self-register, Manager/Admin require approval

  ngOnInit() {
    this.buildRegistrationForm();
    
    // Redirect if already logged in
    if (this.authService.isLoggedIn && !this.authService.isSessionExpired) {
      this.authService.redirectLoginUser();
    }
  }

  private buildRegistrationForm() {
    this.registrationForm = this.formBuilder.group({
      userName: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(200)
      ]],
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.maxLength(200)
      ]],
      firstName: ['', [
        Validators.required,
        Validators.maxLength(50)
      ]],
      lastName: ['', [
        Validators.required,
        Validators.maxLength(50)
      ]],
      jobTitle: ['', [
        Validators.maxLength(100)
      ]],
      phoneNumber: ['', [
        Validators.maxLength(20)
      ]],
      department: ['', [
        Validators.maxLength(100)
      ]],
      phone: ['', [
        Validators.maxLength(20)
      ]],
      contactInfo: ['', [
        Validators.maxLength(500)
      ]],
      password: ['', [
        Validators.required,
        this.passwordStrengthValidator()
      ]],
      confirmPassword: ['', [
        Validators.required
      ]],
      role: ['Assessor', [
        Validators.required
      ]],
      acceptTerms: [false, [
        Validators.requiredTrue
      ]]
    }, {
      validators: this.passwordMatchValidator()
    });
  }

  private passwordStrengthValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      
      if (!value) {
        return null; // Let required validator handle empty values
      }

      const hasMinLength = value.length >= 8;
      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasNumeric = /[0-9]/.test(value);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

      const errors: Record<string, boolean> = {};
      
      if (!hasMinLength) errors['minLength'] = true;
      if (!hasUpperCase) errors['requiresUppercase'] = true;
      if (!hasLowerCase) errors['requiresLowercase'] = true;
      if (!hasNumeric) errors['requiresNumeric'] = true;
      if (!hasSpecialChar) errors['requiresSpecialChar'] = true;

      return Object.keys(errors).length ? { passwordStrength: errors } : null;
    };
  }

  private passwordMatchValidator(): ValidatorFn {
    return (form: AbstractControl): ValidationErrors | null => {
      const password = form.get('password')?.value;
      const confirmPassword = form.get('confirmPassword')?.value;
      
      if (password && confirmPassword && password !== confirmPassword) {
        return { passwordMismatch: true };
      }
      
      return null;
    };
  }

  onSubmit() {
    this.showValidationErrors = true;

    if (this.registrationForm.valid) {
      this.register();
    } else {
      this.showValidationAlerts();
    }
  }

  private register() {
    this.isLoading = true;
    this.alertService.startLoadingMessage('Creating your account...');

    const formData = this.registrationForm.value;
    
    // Create registration payload with the correct interface
    const registration: UserRegistration = {
      userName: formData.userName,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      fullName: `${formData.firstName} ${formData.lastName}`.trim(),
      jobTitle: formData.jobTitle || '',
      phoneNumber: formData.phoneNumber || '',
      department: formData.department || null,
      phone: formData.phone || null,
      contactInfo: formData.contactInfo || null,
      roles: [formData.role]
    };

    this.accountService.registerUser(registration)
      .subscribe({
        next: (user) => {
          this.alertService.stopLoadingMessage();
          this.isLoading = false;
          
          this.alertService.showMessage(
            'Registration Successful', 
            `Welcome ${user.userName}! Your account has been created successfully. ${
              formData.role !== 'Assessor' ? 'Administrator approval is required before you can access all features.' : ''
            }`,
            MessageSeverity.success
          );

          // Redirect to login page
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (error) => {
          this.alertService.stopLoadingMessage();
          this.isLoading = false;
          
          if (error.status === 400 && error.error?.errors) {
            // Handle validation errors from server
            const serverErrors = error.error.errors;
            this.handleServerValidationErrors(serverErrors);
          } else {
            const errorMessage = Utilities.getHttpResponseMessage(error) || 'An error occurred during registration';
            this.alertService.showStickyMessage('Registration Failed', errorMessage, MessageSeverity.error, error);
          }
        }
      });
  }

  private handleServerValidationErrors(serverErrors: Record<string, string[]>) {
    if (serverErrors['Email']) {
      this.alertService.showMessage('Registration Failed', 'This email address is already registered.', MessageSeverity.error);
    }
    if (serverErrors['UserName']) {
      this.alertService.showMessage('Registration Failed', 'This username is already taken.', MessageSeverity.error);
    }
    if (serverErrors['NewPassword']) {
      this.alertService.showMessage('Registration Failed', serverErrors['NewPassword'].join(' '), MessageSeverity.error);
    }
  }

  private showValidationAlerts() {
    const form = this.registrationForm;
    
    if (form.get('userName')?.errors?.['required']) {
      this.showErrorAlert('Username Required', 'Please enter a username (minimum 2 characters)');
    }
    
    if (form.get('email')?.errors?.['required']) {
      this.showErrorAlert('Email Required', 'Please enter a valid email address');
    } else if (form.get('email')?.errors?.['email']) {
      this.showErrorAlert('Invalid Email', 'Please enter a valid email address');
    }
    
    if (form.get('firstName')?.errors?.['required']) {
      this.showErrorAlert('First Name Required', 'Please enter your first name');
    }
    
    if (form.get('lastName')?.errors?.['required']) {
      this.showErrorAlert('Last Name Required', 'Please enter your last name');
    }
    
    if (form.get('password')?.errors?.['required']) {
      this.showErrorAlert('Password Required', 'Please enter a password');
    } else if (form.get('password')?.errors?.['passwordStrength']) {
      this.showPasswordStrengthAlert();
    }
    
    if (form.get('confirmPassword')?.errors?.['required']) {
      this.showErrorAlert('Confirm Password Required', 'Please confirm your password');
    } else if (form.errors?.['passwordMismatch']) {
      this.showErrorAlert('Password Mismatch', 'Passwords do not match');
    }
    
    if (form.get('acceptTerms')?.errors?.['required']) {
      this.showErrorAlert('Terms & Conditions', 'Please accept the Terms & Conditions to continue');
    }
  }

  private showPasswordStrengthAlert() {
    const requirements = [];
    const passwordErrors = this.registrationForm.get('password')?.errors?.['passwordStrength'];
    
    if (passwordErrors?.minLength) requirements.push('at least 8 characters');
    if (passwordErrors?.requiresUppercase) requirements.push('one uppercase letter');
    if (passwordErrors?.requiresLowercase) requirements.push('one lowercase letter');
    if (passwordErrors?.requiresNumeric) requirements.push('one number');
    if (passwordErrors?.requiresSpecialChar) requirements.push('one special character');
    
    this.showErrorAlert('Password Requirements', `Password must contain: ${requirements.join(', ')}`);
  }

  private showErrorAlert(caption: string, message: string) {
    this.alertService.showMessage(caption, message, MessageSeverity.error);
  }

  // Getters for template access to form controls
  get userName() { return this.registrationForm.get('userName'); }
  get email() { return this.registrationForm.get('email'); }
  get firstName() { return this.registrationForm.get('firstName'); }
  get lastName() { return this.registrationForm.get('lastName'); }
  get department() { return this.registrationForm.get('department'); }
  get phone() { return this.registrationForm.get('phone'); }
  get password() { return this.registrationForm.get('password'); }
  get confirmPassword() { return this.registrationForm.get('confirmPassword'); }
  get role() { return this.registrationForm.get('role'); }
  get acceptTerms() { return this.registrationForm.get('acceptTerms'); }
}
