// ---------------------------------------
// Story 1.2 Task 2: Password Reset Service
// Enterprise password reset functionality
// ---------------------------------------

import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';

export interface PasswordResetRequest {
  email: string;
  captchaToken?: string;
}

export interface PasswordResetResponse {
  success: boolean;
  message: string;
  resetToken?: string;
  expiresAt?: Date;
}

export interface PasswordResetValidation {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface TokenValidationResult {
  isValid: boolean;
  isExpired: boolean;
  email?: string;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PasswordResetService {

  private readonly tokenStore = new Map<string, {
    email: string;
    expiresAt: Date;
    used: boolean;
    attempts: number;
  }>();

  /**
   * Initiate password reset process
   * @param request Password reset request
   */
  initiatePasswordReset(request: PasswordResetRequest): Observable<PasswordResetResponse> {
    // Validate email format
    const emailValidation = this.validateEmail(request.email);
    if (!emailValidation.isValid) {
      return throwError(() => new Error(emailValidation.error || 'Invalid email address'));
    }

    // In a real application, this would call the backend API
    // For now, we'll simulate the process
    return this.simulatePasswordResetRequest(request).pipe(
      delay(1000), // Simulate network delay
      map(response => ({
        success: true,
        message: 'If an account with this email exists, you will receive a password reset link shortly.',
        resetToken: response.resetToken,
        expiresAt: response.expiresAt
      }))
    );
  }

  /**
   * Validate password reset token
   * @param token Reset token to validate
   */
  validateResetToken(token: string): Observable<TokenValidationResult> {
    if (!token || token.trim().length === 0) {
      return of({
        isValid: false,
        isExpired: false,
        error: 'Reset token is required'
      });
    }

    // Check token format
    if (!this.isValidTokenFormat(token)) {
      return of({
        isValid: false,
        isExpired: false,
        error: 'Invalid token format'
      });
    }

    // In a real application, this would validate with the backend
    return this.simulateTokenValidation(token).pipe(
      delay(500)
    );
  }

  /**
   * Complete password reset with new password
   * @param validation Password reset validation data
   */
  completePasswordReset(validation: PasswordResetValidation): Observable<PasswordResetResponse> {
    // Validate token first
    return this.validateResetToken(validation.token).pipe(
      delay(500),
      map(tokenResult => {
        if (!tokenResult.isValid) {
          throw new Error(tokenResult.error || 'Invalid or expired token');
        }

        if (tokenResult.isExpired) {
          throw new Error('Reset token has expired. Please request a new password reset.');
        }

        // Validate passwords match
        if (validation.newPassword !== validation.confirmPassword) {
          throw new Error('Passwords do not match');
        }

        // Validate password strength
        const passwordValidation = this.validatePasswordStrength(validation.newPassword);
        if (!passwordValidation.isValid) {
          throw new Error(passwordValidation.errors.join(', '));
        }

        // Mark token as used
        this.markTokenAsUsed(validation.token);

        return {
          success: true,
          message: 'Your password has been successfully reset. You can now log in with your new password.'
        };
      })
    );
  }

  /**
   * Check if password reset is available for email
   * @param email Email address to check
   */
  canRequestPasswordReset(email: string): Observable<{canRequest: boolean; reason?: string}> {
    const emailValidation = this.validateEmail(email);
    if (!emailValidation.isValid) {
      return of({
        canRequest: false,
        reason: emailValidation.error
      });
    }

    // Check rate limiting (simplified)
    const recentAttempts = this.getRecentResetAttempts(email);
    if (recentAttempts >= 3) {
      return of({
        canRequest: false,
        reason: 'Too many password reset requests. Please wait before requesting another.'
      });
    }

    return of({ canRequest: true });
  }

  /**
   * Get password strength requirements
   */
  getPasswordRequirements(): {
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
    forbiddenPatterns: string[];
  } {
    return {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      forbiddenPatterns: [
        'password',
        '123456',
        'qwerty',
        'admin',
        'user'
      ]
    };
  }

  /**
   * Validate email format and security
   * @param email Email to validate
   */
  private validateEmail(email: string): {isValid: boolean; error?: string} {
    if (!email || email.trim().length === 0) {
      return { isValid: false, error: 'Email address is required' };
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, error: 'Please enter a valid email address' };
    }

    // Length validation
    if (email.length > 254) {
      return { isValid: false, error: 'Email address is too long' };
    }

    // Check for suspicious patterns
    const suspiciousPatterns = [
      /<[^>]*script[^>]*>/gi,
      /javascript:/gi,
      /[<>'"]/g
    ];

    if (suspiciousPatterns.some(pattern => pattern.test(email))) {
      return { isValid: false, error: 'Invalid characters in email address' };
    }

    return { isValid: true };
  }

  /**
   * Validate password strength
   * @param password Password to validate
   */
  private validatePasswordStrength(password: string): {isValid: boolean; errors: string[]} {
    const errors: string[] = [];
    const requirements = this.getPasswordRequirements();

    if (password.length < requirements.minLength) {
      errors.push(`Password must be at least ${requirements.minLength} characters long`);
    }

    if (requirements.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (requirements.requireLowercase && !/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (requirements.requireNumbers && !/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (requirements.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    // Check forbidden patterns
    const lowerPassword = password.toLowerCase();
    const forbiddenFound = requirements.forbiddenPatterns.find(pattern =>
      lowerPassword.includes(pattern.toLowerCase())
    );

    if (forbiddenFound) {
      errors.push(`Password cannot contain common words like "${forbiddenFound}"`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Check if token format is valid
   * @param token Token to validate
   */
  private isValidTokenFormat(token: string): boolean {
    // Token should be a UUID or similar format
    const tokenRegex = /^[a-zA-Z0-9\-_]{20,}$/;
    return tokenRegex.test(token);
  }

  /**
   * Simulate password reset request (replace with actual API call)
   * @param request Password reset request
   */
  private simulatePasswordResetRequest(request: PasswordResetRequest): Observable<{
    resetToken: string;
    expiresAt: Date;
  }> {
    // Generate a mock token
    const resetToken = this.generateMockToken();
    const expiresAt = new Date(Date.now() + (60 * 60 * 1000)); // 1 hour from now

    // Store token for validation
    this.tokenStore.set(resetToken, {
      email: request.email,
      expiresAt,
      used: false,
      attempts: 0
    });

    return of({
      resetToken,
      expiresAt
    });
  }

  /**
   * Simulate token validation (replace with actual API call)
   * @param token Token to validate
   */
  private simulateTokenValidation(token: string): Observable<TokenValidationResult> {
    const tokenData = this.tokenStore.get(token);

    if (!tokenData) {
      return of({
        isValid: false,
        isExpired: false,
        error: 'Invalid or expired token'
      });
    }

    if (tokenData.used) {
      return of({
        isValid: false,
        isExpired: false,
        error: 'This reset link has already been used'
      });
    }

    const now = new Date();
    const isExpired = now > tokenData.expiresAt;

    if (isExpired) {
      return of({
        isValid: false,
        isExpired: true,
        email: tokenData.email,
        error: 'Reset token has expired'
      });
    }

    // Increment attempt counter
    tokenData.attempts++;

    return of({
      isValid: true,
      isExpired: false,
      email: tokenData.email
    });
  }

  /**
   * Mark token as used
   * @param token Token to mark as used
   */
  private markTokenAsUsed(token: string): void {
    const tokenData = this.tokenStore.get(token);
    if (tokenData) {
      tokenData.used = true;
    }
  }

  /**
   * Generate mock token for simulation
   */
  private generateMockToken(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Get recent reset attempts for email (simplified rate limiting)
   * @param _email Email address
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private getRecentResetAttempts(_email: string): number {
    // In a real application, this would check against a database
    // For now, we'll return a random number for simulation
    return Math.floor(Math.random() * 5);
  }

  /**
   * Clear expired tokens (cleanup method)
   */
  clearExpiredTokens(): void {
    const now = new Date();
    for (const [token, data] of this.tokenStore.entries()) {
      if (now > data.expiresAt) {
        this.tokenStore.delete(token);
      }
    }
  }

  /**
   * Get token expiration time for display
   * @param token Reset token
   */
  getTokenExpiration(token: string): Date | null {
    const tokenData = this.tokenStore.get(token);
    return tokenData?.expiresAt || null;
  }

  /**
   * Check if email has pending reset requests
   * @param email Email address
   */
  hasPendingReset(email: string): boolean {
    const now = new Date();
    for (const tokenData of this.tokenStore.values()) {
      if (tokenData.email === email && !tokenData.used && now <= tokenData.expiresAt) {
        return true;
      }
    }
    return false;
  }
}
