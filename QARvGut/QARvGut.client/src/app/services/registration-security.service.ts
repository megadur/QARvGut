// ---------------------------------------
// Story 1.2 Refactor: Security Enhancement Service
// Senior Dev Review - Security Excellence
// ---------------------------------------

import { Injectable } from '@angular/core';
import { HttpRequest } from '@angular/common/http';

export interface SecurityValidationResult {
  isValid: boolean;
  violations: SecurityViolation[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

export interface SecurityViolation {
  type: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  field?: string;
}

@Injectable({
  providedIn: 'root'
})
export class RegistrationSecurityService {

  private readonly suspiciousPatterns = {
    sqlInjection: /('|('')|;|\|\||\/\*|\*\/|--|\b(alter|create|delete|drop|exec|execute|insert|select|union|update|script|javascript|vbscript)\b)/gi,
    xssAttempts: /<[^>]*script[^>]*>|javascript:|vbscript:|on\w+\s*=/gi,
    commonPasswords: [
      'password', '123456', 'qwerty', 'abc123', 'letmein', 'monkey',
      'password123', 'admin', 'welcome', 'login', 'guest', 'test'
    ],
    suspiciousEmails: /@(10minutemail|guerrillamail|mailinator|tempmail)/gi,
    botPatterns: /bot|crawler|spider|scraper|automated|test@test\.com/gi
  };

  /**
   * Comprehensive security validation for registration data
   * @param registrationData User registration data
   */
  validateRegistrationSecurity(registrationData: Record<string, unknown>): SecurityValidationResult {
    const violations: SecurityViolation[] = [];

    // Check each field for security issues
    Object.entries(registrationData).forEach(([field, value]) => {
      if (typeof value === 'string') {
        violations.push(...this.validateField(field, value));
      }
    });

    // Special validations
    violations.push(...this.validatePasswordSecurity(registrationData['password'] as string));
    violations.push(...this.validateEmailSecurity(registrationData['email'] as string));
    violations.push(...this.validateUsernameSecurity(registrationData['userName'] as string));

    const riskLevel = this.calculateRiskLevel(violations);

    return {
      isValid: violations.length === 0 || !violations.some(v => v.severity === 'critical' || v.severity === 'error'),
      violations,
      riskLevel
    };
  }

  /**
   * Validate individual form field for security issues
   * @param fieldName Name of the field
   * @param value Field value
   */
  private validateField(fieldName: string, value: string): SecurityViolation[] {
    const violations: SecurityViolation[] = [];

    // SQL injection detection
    if (this.suspiciousPatterns.sqlInjection.test(value)) {
      violations.push({
        type: 'sql_injection_attempt',
        severity: 'critical',
        message: `Potential SQL injection attempt detected in ${fieldName}`,
        field: fieldName
      });
    }

    // XSS attempt detection
    if (this.suspiciousPatterns.xssAttempts.test(value)) {
      violations.push({
        type: 'xss_attempt',
        severity: 'critical',
        message: `Potential XSS attempt detected in ${fieldName}`,
        field: fieldName
      });
    }

    // Bot detection
    if (this.suspiciousPatterns.botPatterns.test(value)) {
      violations.push({
        type: 'bot_behavior',
        severity: 'warning',
        message: `Possible bot behavior detected in ${fieldName}`,
        field: fieldName
      });
    }

    // Check for excessive length (potential DoS)
    if (value.length > 10000) {
      violations.push({
        type: 'excessive_length',
        severity: 'error',
        message: `Field ${fieldName} exceeds maximum safe length`,
        field: fieldName
      });
    }

    // Check for null bytes or control characters
    const hasControlChars = value.split('').some(char => {
      const code = char.charCodeAt(0);
      return code <= 31 || (code >= 127 && code <= 159);
    });
    if (hasControlChars) {
      violations.push({
        type: 'invalid_characters',
        severity: 'error',
        message: `Field ${fieldName} contains invalid control characters`,
        field: fieldName
      });
    }

    return violations;
  }

  /**
   * Enhanced password security validation
   * @param password Password to validate
   */
  private validatePasswordSecurity(password: string): SecurityViolation[] {
    const violations: SecurityViolation[] = [];

    if (!password) return violations;

    // Common password check
    const lowercasePassword = password.toLowerCase();
    if (this.suspiciousPatterns.commonPasswords.some(common =>
      lowercasePassword.includes(common.toLowerCase()))) {
      violations.push({
        type: 'common_password',
        severity: 'warning',
        message: 'Password contains common dictionary words',
        field: 'password'
      });
    }

    // Sequential character detection
    if (this.hasSequentialCharacters(password)) {
      violations.push({
        type: 'sequential_characters',
        severity: 'warning',
        message: 'Password contains sequential characters',
        field: 'password'
      });
    }

    // Repeated character detection
    if (this.hasRepeatedCharacters(password)) {
      violations.push({
        type: 'repeated_characters',
        severity: 'warning',
        message: 'Password contains too many repeated characters',
        field: 'password'
      });
    }

    // Personal information detection (basic)
    if (this.containsPersonalInfo(password)) {
      violations.push({
        type: 'personal_info_password',
        severity: 'error',
        message: 'Password should not contain personal information',
        field: 'password'
      });
    }

    return violations;
  }

  /**
   * Email security validation
   * @param email Email to validate
   */
  private validateEmailSecurity(email: string): SecurityViolation[] {
    const violations: SecurityViolation[] = [];

    if (!email) return violations;

    // Disposable email detection
    if (this.suspiciousPatterns.suspiciousEmails.test(email)) {
      violations.push({
        type: 'disposable_email',
        severity: 'warning',
        message: 'Disposable email address detected',
        field: 'email'
      });
    }

    // Check for multiple @ symbols
    if ((email.match(/@/g) || []).length !== 1) {
      violations.push({
        type: 'malformed_email',
        severity: 'error',
        message: 'Email address is malformed',
        field: 'email'
      });
    }

    // Basic email injection attempts
    if (/[<>"\r\n]/.test(email)) {
      violations.push({
        type: 'email_injection_attempt',
        severity: 'critical',
        message: 'Potential email injection attempt detected',
        field: 'email'
      });
    }

    return violations;
  }

  /**
   * Username security validation
   * @param username Username to validate
   */
  private validateUsernameSecurity(username: string): SecurityViolation[] {
    const violations: SecurityViolation[] = [];

    if (!username) return violations;

    // Check for admin/system usernames
    const adminPatterns = /^(admin|administrator|root|system|sa|dba|superuser|owner|master)$/i;
    if (adminPatterns.test(username)) {
      violations.push({
        type: 'reserved_username',
        severity: 'error',
        message: 'Username is reserved for system use',
        field: 'userName'
      });
    }

    // Check for suspicious username patterns
    const suspiciousPatterns = /(test|demo|example|null|undefined|anonymous)(\d+)?$/i;
    if (suspiciousPatterns.test(username)) {
      violations.push({
        type: 'suspicious_username',
        severity: 'warning',
        message: 'Username appears to be for testing purposes',
        field: 'userName'
      });
    }

    return violations;
  }

  /**
   * Detect sequential characters in password
   * @param password Password to check
   */
  private hasSequentialCharacters(password: string): boolean {
    let sequentialCount = 0;
    for (let i = 0; i < password.length - 2; i++) {
      const char1 = password.charCodeAt(i);
      const char2 = password.charCodeAt(i + 1);
      const char3 = password.charCodeAt(i + 2);

      if (char2 === char1 + 1 && char3 === char2 + 1) {
        sequentialCount++;
      }
    }
    return sequentialCount >= 2;
  }

  /**
   * Detect repeated characters in password
   * @param password Password to check
   */
  private hasRepeatedCharacters(password: string): boolean {
    const charCount: Record<string, number> = {};
    for (const char of password) {
      charCount[char] = (charCount[char] || 0) + 1;
    }

    const maxRepeats = Math.max(...Object.values(charCount));
    return maxRepeats > password.length * 0.4; // More than 40% repeated characters
  }

  /**
   * Check if password contains personal information patterns
   * @param password Password to check
   */
  private containsPersonalInfo(password: string): boolean {
    // This is a basic implementation - in production, you'd cross-reference with user data
    const personalPatterns = [
      /\b(name|birthday|birth|phone|address|city|state|zip|postal)\b/i,
      /\b\d{4}-\d{2}-\d{2}\b/, // Date patterns
      /\b\d{10,}\b/ // Phone number patterns
    ];

    return personalPatterns.some(pattern => pattern.test(password));
  }

  /**
   * Calculate overall risk level based on violations
   * @param violations Array of security violations
   */
  private calculateRiskLevel(violations: SecurityViolation[]): 'low' | 'medium' | 'high' | 'critical' {
    if (violations.some(v => v.severity === 'critical')) return 'critical';
    if (violations.filter(v => v.severity === 'error').length >= 2) return 'high';
    if (violations.some(v => v.severity === 'error')) return 'medium';
    if (violations.length > 0) return 'low';
    return 'low';
  }

  /**
   * Sanitize input to prevent XSS and injection attacks
   * @param input Input string to sanitize
   */
  sanitizeInput(input: string): string {
    if (!input) return input;

    return input
      .replace(/[<>]/g, '') // Remove angle brackets
      .replace(/javascript:/gi, '') // Remove javascript protocols
      .replace(/vbscript:/gi, '') // Remove vbscript protocols
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim();
  }

  /**
   * Generate CSRF token for form submission
   * @returns CSRF token string
   */
  generateCSRFToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Validate request for potential security issues
   * @param request HTTP request to validate
   */
  validateHttpRequest(request: HttpRequest<unknown>): SecurityValidationResult {
    const violations: SecurityViolation[] = [];

    // Check for suspicious headers
    const suspiciousHeaders = ['x-forwarded-for', 'x-originating-ip', 'x-remote-ip'];
    suspiciousHeaders.forEach(header => {
      const value = request.headers.get(header);
      if (value && this.isSuspiciousIP(value)) {
        violations.push({
          type: 'suspicious_ip',
          severity: 'warning',
          message: `Suspicious IP detected in ${header}: ${value}`
        });
      }
    });

    // Check user agent
    const userAgent = request.headers.get('user-agent');
    if (userAgent && this.suspiciousPatterns.botPatterns.test(userAgent)) {
      violations.push({
        type: 'bot_user_agent',
        severity: 'warning',
        message: 'Suspicious user agent detected'
      });
    }

    // Check request size
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > 1024 * 1024) { // 1MB limit
      violations.push({
        type: 'excessive_request_size',
        severity: 'error',
        message: 'Request size exceeds safe limits'
      });
    }

    const riskLevel = this.calculateRiskLevel(violations);

    return {
      isValid: violations.length === 0 || !violations.some(v => v.severity === 'critical'),
      violations,
      riskLevel
    };
  }

  /**
   * Check if IP address is suspicious
   * @param ip IP address to check
   */
  private isSuspiciousIP(ip: string): boolean {
    // This is a simplified implementation
    // In production, you'd check against threat intelligence feeds
    const suspiciousRanges = [
      /^10\./, // Private ranges might be suspicious in some contexts
      /^192\.168\./,
      /^172\.(1[6-9]|2\d|3[01])\./,
      /^127\./, // Localhost
      /^0\.0\.0\.0$/, // Invalid IP
      /^255\.255\.255\.255$/ // Broadcast
    ];

    return suspiciousRanges.some(pattern => pattern.test(ip));
  }

  /**
   * Rate limiting check (simplified implementation)
   * @param identifier User identifier (IP, session, etc.)
   * @param action Action being performed
   */
  checkRateLimit(identifier: string, action: string): { allowed: boolean; remainingAttempts: number } {
    // This is a simplified in-memory implementation
    // In production, use Redis or similar distributed cache
    const key = `${action}:${identifier}`;
    const now = Date.now();
    const windowMs = 15 * 60 * 1000; // 15 minutes
    const maxAttempts = action === 'registration' ? 5 : 10;

    // Get or create rate limit data
    const rateLimitData = this.getRateLimitData(key);

    // Clean old attempts
    rateLimitData.attempts = rateLimitData.attempts.filter(timestamp => now - timestamp < windowMs);

    // Check if limit exceeded
    if (rateLimitData.attempts.length >= maxAttempts) {
      return { allowed: false, remainingAttempts: 0 };
    }

    // Record this attempt
    rateLimitData.attempts.push(now);
    this.setRateLimitData(key, rateLimitData);

    return {
      allowed: true,
      remainingAttempts: maxAttempts - rateLimitData.attempts.length
    };
  }

  private rateLimitStore = new Map<string, { attempts: number[] }>();

  private getRateLimitData(key: string): { attempts: number[] } {
    return this.rateLimitStore.get(key) || { attempts: [] };
  }

  private setRateLimitData(key: string, data: { attempts: number[] }): void {
    this.rateLimitStore.set(key, data);
  }
}
