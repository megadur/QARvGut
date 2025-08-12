// ---------------------------------------
// Story 1.2 Task 2: Login Security Service
// Enterprise-grade security for authentication
// ---------------------------------------

import { Injectable } from '@angular/core';

export interface LoginSecurityResult {
  isAllowed: boolean;
  violations: LoginSecurityViolation[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  requiresCaptcha: boolean;
}

export interface LoginSecurityViolation {
  type: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  code: string;
}

export interface LoginAttempt {
  identifier: string;
  timestamp: number;
  success: boolean;
  ip?: string;
  userAgent?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginSecurityService {

  private readonly suspiciousPatterns = {
    sqlInjection: /('|('')|;|\|\||\/\*|\*\/|--|\b(union|select|insert|delete|update|drop|alter|exec|script)\b)/gi,
    xssAttempts: /<[^>]*script[^>]*>|javascript:|vbscript:|on\w+\s*=/gi,
    commonUsernames: ['admin', 'administrator', 'root', 'sa', 'test', 'guest', 'demo'],
    botPatterns: /bot|crawler|spider|scraper|automated/gi
  };

  private loginAttempts = new Map<string, LoginAttempt[]>();
  private blockedIPs = new Set<string>();
  private suspiciousIPs = new Map<string, number>(); // IP -> suspicion score

  /**
   * Validate login attempt for security issues
   * @param loginData Login form data
   * @param clientInfo Client information (IP, user agent, etc.)
   */
  validateLoginSecurity(
    loginData: { userName: string; password: string; rememberMe?: boolean },
    clientInfo: { ip?: string; userAgent?: string } = {}
  ): LoginSecurityResult {
    const violations: LoginSecurityViolation[] = [];

    // Check for blocked IPs
    if (clientInfo.ip && this.isIPBlocked(clientInfo.ip)) {
      violations.push({
        type: 'blocked_ip',
        severity: 'critical',
        message: 'Access denied from this IP address',
        code: 'IP_BLOCKED'
      });
    }

    // Validate input fields
    violations.push(...this.validateLoginInput(loginData.userName, 'username'));
    violations.push(...this.validateLoginInput(loginData.password, 'password'));

    // Check rate limiting
    const rateLimitResult = this.checkRateLimit(
      clientInfo.ip || loginData.userName,
      'login'
    );
    if (!rateLimitResult.allowed) {
      violations.push({
        type: 'rate_limit_exceeded',
        severity: 'critical',
        message: `Too many login attempts. Please wait ${rateLimitResult.retryAfterSeconds} seconds.`,
        code: 'RATE_LIMIT_EXCEEDED'
      });
    }

    // Bot detection
    if (clientInfo.userAgent && this.detectBot(clientInfo.userAgent)) {
      violations.push({
        type: 'bot_detected',
        severity: 'warning',
        message: 'Automated access detected',
        code: 'BOT_DETECTED'
      });
    }

    // Suspicious username patterns
    if (this.isSuspiciousUsername(loginData.userName)) {
      violations.push({
        type: 'suspicious_username',
        severity: 'warning',
        message: 'Username appears to be for automated testing',
        code: 'SUSPICIOUS_USERNAME'
      });
    }

    // Check for common attack patterns
    if (this.isCommonAttackPattern(loginData.userName, loginData.password)) {
      violations.push({
        type: 'attack_pattern',
        severity: 'error',
        message: 'Common attack pattern detected',
        code: 'ATTACK_PATTERN'
      });
    }

    const riskLevel = this.calculateRiskLevel(violations);
    const requiresCaptcha = this.shouldRequireCaptcha(
      clientInfo.ip || loginData.userName,
      violations
    );

    return {
      isAllowed: !violations.some(v => v.severity === 'critical'),
      violations,
      riskLevel,
      requiresCaptcha
    };
  }

  /**
   * Record login attempt for tracking
   * @param identifier User identifier (IP or username)
   * @param success Whether the attempt was successful
   * @param clientInfo Client information
   */
  recordLoginAttempt(
    identifier: string,
    success: boolean,
    clientInfo: { ip?: string; userAgent?: string } = {}
  ): void {
    const attempt: LoginAttempt = {
      identifier,
      timestamp: Date.now(),
      success,
      ip: clientInfo.ip,
      userAgent: clientInfo.userAgent
    };

    if (!this.loginAttempts.has(identifier)) {
      this.loginAttempts.set(identifier, []);
    }

    const attempts = this.loginAttempts.get(identifier)!;
    attempts.push(attempt);

    // Keep only recent attempts (last hour)
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    this.loginAttempts.set(
      identifier,
      attempts.filter(a => a.timestamp > oneHourAgo)
    );

    // Update IP suspicion scores
    if (clientInfo.ip && !success) {
      this.updateIPSuspicionScore(clientInfo.ip);
    }
  }

  /**
   * Validate individual login input field
   * @param value Field value
   * @param fieldType Type of field (username, password)
   */
  private validateLoginInput(value: string, fieldType: string): LoginSecurityViolation[] {
    const violations: LoginSecurityViolation[] = [];

    if (!value) return violations;

    // SQL injection detection
    if (this.suspiciousPatterns.sqlInjection.test(value)) {
      violations.push({
        type: 'sql_injection',
        severity: 'critical',
        message: `Potential SQL injection attempt in ${fieldType}`,
        code: 'SQL_INJECTION'
      });
    }

    // XSS attempt detection
    if (this.suspiciousPatterns.xssAttempts.test(value)) {
      violations.push({
        type: 'xss_attempt',
        severity: 'critical',
        message: `Potential XSS attempt in ${fieldType}`,
        code: 'XSS_ATTEMPT'
      });
    }

    // Length validation (potential DoS)
    if (value.length > 1000) {
      violations.push({
        type: 'excessive_length',
        severity: 'error',
        message: `${fieldType} exceeds maximum safe length`,
        code: 'EXCESSIVE_LENGTH'
      });
    }

    // Control character detection
    const hasControlChars = value.split('').some(char => {
      const code = char.charCodeAt(0);
      return code <= 31 || (code >= 127 && code <= 159);
    });

    if (hasControlChars) {
      violations.push({
        type: 'invalid_characters',
        severity: 'error',
        message: `${fieldType} contains invalid control characters`,
        code: 'INVALID_CHARS'
      });
    }

    return violations;
  }

  /**
   * Check if IP is blocked
   * @param ip IP address to check
   */
  private isIPBlocked(ip: string): boolean {
    return this.blockedIPs.has(ip);
  }

  /**
   * Detect if user agent suggests bot behavior
   * @param userAgent User agent string
   */
  private detectBot(userAgent: string): boolean {
    return this.suspiciousPatterns.botPatterns.test(userAgent);
  }

  /**
   * Check if username is suspicious
   * @param username Username to check
   */
  private isSuspiciousUsername(username: string): boolean {
    const lowerUsername = username.toLowerCase();
    return this.suspiciousPatterns.commonUsernames.some(common =>
      lowerUsername.includes(common)
    );
  }

  /**
   * Check for common attack patterns
   * @param username Username
   * @param password Password
   */
  private isCommonAttackPattern(username: string, password: string): boolean {
    // Check for username = password
    if (username.toLowerCase() === password.toLowerCase()) {
      return true;
    }

    // Check for common username/password combinations
    const commonCombos = [
      ['admin', 'admin'],
      ['admin', 'password'],
      ['root', 'root'],
      ['test', 'test'],
      ['guest', 'guest']
    ];

    const lowerUsername = username.toLowerCase();
    const lowerPassword = password.toLowerCase();

    return commonCombos.some(([user, pass]) =>
      lowerUsername === user && lowerPassword === pass
    );
  }

  /**
   * Rate limiting check
   * @param identifier User identifier
   * @param action Action being performed
   */
  private checkRateLimit(identifier: string, action: string): {
    allowed: boolean;
    remainingAttempts: number;
    retryAfterSeconds: number;
  } {
    const attempts = this.loginAttempts.get(identifier) || [];
    const now = Date.now();
    const windowMs = 15 * 60 * 1000; // 15 minutes
    const maxAttempts = action === 'login' ? 5 : 10;

    // Get recent attempts
    const recentAttempts = attempts.filter(attempt =>
      now - attempt.timestamp < windowMs
    );

    // Count failed attempts
    const failedAttempts = recentAttempts.filter(attempt => !attempt.success);

    if (failedAttempts.length >= maxAttempts) {
      const oldestFailedAttempt = Math.min(...failedAttempts.map(a => a.timestamp));
      const retryAfterMs = (oldestFailedAttempt + windowMs) - now;
      const retryAfterSeconds = Math.ceil(retryAfterMs / 1000);

      return {
        allowed: false,
        remainingAttempts: 0,
        retryAfterSeconds: Math.max(retryAfterSeconds, 0)
      };
    }

    return {
      allowed: true,
      remainingAttempts: maxAttempts - failedAttempts.length,
      retryAfterSeconds: 0
    };
  }

  /**
   * Update IP suspicion score
   * @param ip IP address
   */
  private updateIPSuspicionScore(ip: string): void {
    const currentScore = this.suspiciousIPs.get(ip) || 0;
    const newScore = currentScore + 1;

    this.suspiciousIPs.set(ip, newScore);

    // Auto-block IPs with high suspicion scores
    if (newScore >= 10) {
      this.blockedIPs.add(ip);
    }
  }

  /**
   * Calculate overall risk level
   * @param violations Array of security violations
   */
  private calculateRiskLevel(violations: LoginSecurityViolation[]): 'low' | 'medium' | 'high' | 'critical' {
    if (violations.some(v => v.severity === 'critical')) return 'critical';

    const errorCount = violations.filter(v => v.severity === 'error').length;
    if (errorCount >= 2) return 'high';
    if (errorCount >= 1) return 'medium';

    if (violations.length > 0) return 'low';
    return 'low';
  }

  /**
   * Determine if CAPTCHA should be required
   * @param identifier User identifier
   * @param violations Current violations
   */
  private shouldRequireCaptcha(identifier: string, violations: LoginSecurityViolation[]): boolean {
    // Require CAPTCHA if there are critical violations
    if (violations.some(v => v.severity === 'critical')) {
      return true;
    }

    // Check recent failed attempts
    const attempts = this.loginAttempts.get(identifier) || [];
    const recentFailedAttempts = attempts.filter(attempt =>
      !attempt.success && (Date.now() - attempt.timestamp) < (5 * 60 * 1000) // Last 5 minutes
    );

    // Require CAPTCHA after 3 failed attempts
    return recentFailedAttempts.length >= 3;
  }

  /**
   * Clear login attempts for identifier (after successful login)
   * @param identifier User identifier
   */
  clearLoginAttempts(identifier: string): void {
    this.loginAttempts.delete(identifier);
  }

  /**
   * Get login attempt statistics
   * @param identifier User identifier
   */
  getLoginStats(identifier: string): {
    totalAttempts: number;
    failedAttempts: number;
    lastAttempt: number | null;
    isRateLimited: boolean;
  } {
    const attempts = this.loginAttempts.get(identifier) || [];
    const failedAttempts = attempts.filter(a => !a.success);
    const rateLimitResult = this.checkRateLimit(identifier, 'login');

    return {
      totalAttempts: attempts.length,
      failedAttempts: failedAttempts.length,
      lastAttempt: attempts.length > 0 ? Math.max(...attempts.map(a => a.timestamp)) : null,
      isRateLimited: !rateLimitResult.allowed
    };
  }

  /**
   * Block IP address manually
   * @param ip IP address to block
   */
  blockIP(ip: string): void {
    this.blockedIPs.add(ip);
  }

  /**
   * Unblock IP address
   * @param ip IP address to unblock
   */
  unblockIP(ip: string): void {
    this.blockedIPs.delete(ip);
    this.suspiciousIPs.delete(ip);
  }

  /**
   * Get security recommendations based on current state
   * @param identifier User identifier
   */
  getSecurityRecommendations(identifier: string): string[] {
    const recommendations: string[] = [];
    const attempts = this.loginAttempts.get(identifier) || [];
    const failedAttempts = attempts.filter(a => !a.success);

    if (failedAttempts.length >= 2) {
      recommendations.push('Consider using a password manager for secure password storage');
    }

    if (failedAttempts.length >= 3) {
      recommendations.push('Multiple failed attempts detected. Verify you are using the correct credentials');
    }

    if (this.shouldRequireCaptcha(identifier, [])) {
      recommendations.push('CAPTCHA verification will be required for additional security');
    }

    return recommendations;
  }
}
