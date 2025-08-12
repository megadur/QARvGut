// ---------------------------------------
// Story 1.2 Task 2: Login Security Audit Service
// Comprehensive security auditing and compliance tracking
// ---------------------------------------

import { Injectable } from '@angular/core';

export enum SecurityAuditLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum SecurityEventType {
  LOGIN_ATTEMPT = 'login_attempt',
  LOGIN_SUCCESS = 'login_success',
  LOGIN_FAILURE = 'login_failure',
  SECURITY_VIOLATION = 'security_violation',
  SUSPICIOUS_ACTIVITY = 'suspicious_activity',
  RATE_LIMIT_EXCEEDED = 'rate_limit_exceeded',
  PASSWORD_RESET_REQUEST = 'password_reset_request',
  SESSION_TIMEOUT = 'session_timeout',
  BRUTE_FORCE_DETECTED = 'brute_force_detected',
  XSS_ATTEMPT_BLOCKED = 'xss_attempt_blocked',
  SQL_INJECTION_BLOCKED = 'sql_injection_blocked'
}

export interface SecurityAuditEvent {
  id: string;
  timestamp: number;
  eventType: SecurityEventType;
  severity: SecurityAuditLevel;
  userId?: string;
  ipAddress: string;
  userAgent: string;
  details: Record<string, unknown>;
  riskScore: number; // 0-100
  metadata: {
    sessionId?: string;
    deviceFingerprint?: string;
    geolocation?: string;
    previousAttempts?: number;
    blocked?: boolean;
    mitigationAction?: string;
  };
}

export interface SecuritySummary {
  totalEvents: number;
  criticalEvents: number;
  highRiskEvents: number;
  blockedAttempts: number;
  successfulLogins: number;
  failedLogins: number;
  suspiciousActivities: number;
  riskTrends: {
    last24Hours: number;
    last7Days: number;
    last30Days: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class LoginSecurityAuditService {

  private auditEvents: SecurityAuditEvent[] = [];
  private readonly maxEvents = 1000; // Keep last 1000 events
  private eventIdCounter = 1;

  /**
   * Log a security audit event
   */
  logSecurityEvent(
    eventType: SecurityEventType,
    severity: SecurityAuditLevel,
    details: Record<string, unknown> = {},
    userId?: string
  ): SecurityAuditEvent {

    const event: SecurityAuditEvent = {
      id: `audit_${this.eventIdCounter++}_${Date.now()}`,
      timestamp: Date.now(),
      eventType,
      severity,
      userId,
      ipAddress: this.getCurrentIP(),
      userAgent: navigator.userAgent,
      details,
      riskScore: this.calculateRiskScore(eventType, severity, details),
      metadata: {
        sessionId: this.getSessionId(),
        deviceFingerprint: this.generateDeviceFingerprint(),
        geolocation: this.getGeolocation(),
        previousAttempts: this.getPreviousAttempts(eventType),
        blocked: typeof details['blocked'] === 'boolean' ? details['blocked'] : false,
        mitigationAction: typeof details['mitigationAction'] === 'string' ? details['mitigationAction'] : undefined
      }
    };

    // Store event
    this.auditEvents.push(event);

    // Maintain size limit
    if (this.auditEvents.length > this.maxEvents) {
      this.auditEvents = this.auditEvents.slice(-this.maxEvents);
    }

    // Handle critical events immediately
    if (severity === SecurityAuditLevel.CRITICAL) {
      this.handleCriticalEvent(event);
    }

    // Log to console for development
    this.logToConsole(event);

    return event;
  }

  /**
   * Log login attempt
   */
  logLoginAttempt(username: string, success: boolean, additionalDetails: Record<string, unknown> = {}): SecurityAuditEvent {
    const eventType = success ? SecurityEventType.LOGIN_SUCCESS : SecurityEventType.LOGIN_FAILURE;
    const severity = success ? SecurityAuditLevel.LOW : SecurityAuditLevel.MEDIUM;

    const details = {
      username,
      success,
      ...additionalDetails
    };

    return this.logSecurityEvent(eventType, severity, details, success ? username : undefined);
  }

  /**
   * Log security violation
   */
  logSecurityViolation(
    violationType: string,
    blocked: boolean,
    details: Record<string, unknown> = {}
  ): SecurityAuditEvent {

    const severity = blocked ? SecurityAuditLevel.HIGH : SecurityAuditLevel.CRITICAL;

    const eventDetails = {
      violationType,
      blocked,
      mitigationAction: blocked ? 'Request blocked' : 'Alert generated',
      ...details
    };

    return this.logSecurityEvent(
      SecurityEventType.SECURITY_VIOLATION,
      severity,
      eventDetails
    );
  }

  /**
   * Log suspicious activity
   */
  logSuspiciousActivity(
    activityType: string,
    riskIndicators: string[],
    details: Record<string, unknown> = {}
  ): SecurityAuditEvent {

    const eventDetails = {
      activityType,
      riskIndicators,
      indicatorCount: riskIndicators.length,
      ...details
    };

    const severity = riskIndicators.length >= 3 ? SecurityAuditLevel.HIGH : SecurityAuditLevel.MEDIUM;

    return this.logSecurityEvent(
      SecurityEventType.SUSPICIOUS_ACTIVITY,
      severity,
      eventDetails
    );
  }

  /**
   * Log brute force detection
   */
  logBruteForceDetection(
    username: string,
    attemptCount: number,
    timeWindow: number,
    blocked: boolean
  ): SecurityAuditEvent {

    const details = {
      username,
      attemptCount,
      timeWindow,
      blocked,
      mitigationAction: blocked ? 'IP temporarily blocked' : 'Account temporarily locked'
    };

    return this.logSecurityEvent(
      SecurityEventType.BRUTE_FORCE_DETECTED,
      SecurityAuditLevel.CRITICAL,
      details
    );
  }

  /**
   * Get security summary
   */
  getSecuritySummary(): SecuritySummary {
    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;
    const week = 7 * day;
    const month = 30 * day;

    const criticalEvents = this.auditEvents.filter(e => e.severity === SecurityAuditLevel.CRITICAL);
    const highRiskEvents = this.auditEvents.filter(e => e.severity === SecurityAuditLevel.HIGH);
    const blockedAttempts = this.auditEvents.filter(e => e.metadata.blocked);
    const successfulLogins = this.auditEvents.filter(e => e.eventType === SecurityEventType.LOGIN_SUCCESS);
    const failedLogins = this.auditEvents.filter(e => e.eventType === SecurityEventType.LOGIN_FAILURE);
    const suspiciousActivities = this.auditEvents.filter(e => e.eventType === SecurityEventType.SUSPICIOUS_ACTIVITY);

    return {
      totalEvents: this.auditEvents.length,
      criticalEvents: criticalEvents.length,
      highRiskEvents: highRiskEvents.length,
      blockedAttempts: blockedAttempts.length,
      successfulLogins: successfulLogins.length,
      failedLogins: failedLogins.length,
      suspiciousActivities: suspiciousActivities.length,
      riskTrends: {
        last24Hours: this.auditEvents.filter(e => now - e.timestamp <= day).length,
        last7Days: this.auditEvents.filter(e => now - e.timestamp <= week).length,
        last30Days: this.auditEvents.filter(e => now - e.timestamp <= month).length
      }
    };
  }

  /**
   * Get events by severity
   */
  getEventsBySeverity(severity: SecurityAuditLevel): SecurityAuditEvent[] {
    return this.auditEvents.filter(event => event.severity === severity);
  }

  /**
   * Get events by type
   */
  getEventsByType(eventType: SecurityEventType): SecurityAuditEvent[] {
    return this.auditEvents.filter(event => event.eventType === eventType);
  }

  /**
   * Get recent events
   */
  getRecentEvents(limit = 50): SecurityAuditEvent[] {
    return this.auditEvents
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  /**
   * Search events
   */
  searchEvents(criteria: {
    eventType?: SecurityEventType;
    severity?: SecurityAuditLevel;
    userId?: string;
    ipAddress?: string;
    dateRange?: { start: number; end: number };
  }): SecurityAuditEvent[] {
    return this.auditEvents.filter(event => {
      if (criteria.eventType && event.eventType !== criteria.eventType) return false;
      if (criteria.severity && event.severity !== criteria.severity) return false;
      if (criteria.userId && event.userId !== criteria.userId) return false;
      if (criteria.ipAddress && event.ipAddress !== criteria.ipAddress) return false;
      if (criteria.dateRange && (
        event.timestamp < criteria.dateRange.start ||
        event.timestamp > criteria.dateRange.end
      )) return false;

      return true;
    });
  }

  /**
   * Export audit log
   */
  exportAuditLog(format: 'json' | 'csv' = 'json'): string {
    if (format === 'csv') {
      return this.exportAsCSV();
    }
    return JSON.stringify(this.auditEvents, null, 2);
  }

  /**
   * Clear audit log (use with caution)
   */
  clearAuditLog(): void {
    console.warn('🚨 Security audit log cleared');
    this.auditEvents = [];
  }

  /**
   * Calculate risk score for event
   */
  private calculateRiskScore(
    eventType: SecurityEventType,
    severity: SecurityAuditLevel,
    details: Record<string, unknown>
  ): number {
    let score = 0;

    // Base score by event type
    const eventTypeScores = {
      [SecurityEventType.LOGIN_SUCCESS]: 5,
      [SecurityEventType.LOGIN_FAILURE]: 15,
      [SecurityEventType.SECURITY_VIOLATION]: 60,
      [SecurityEventType.SUSPICIOUS_ACTIVITY]: 40,
      [SecurityEventType.RATE_LIMIT_EXCEEDED]: 30,
      [SecurityEventType.BRUTE_FORCE_DETECTED]: 90,
      [SecurityEventType.XSS_ATTEMPT_BLOCKED]: 70,
      [SecurityEventType.SQL_INJECTION_BLOCKED]: 80,
      [SecurityEventType.PASSWORD_RESET_REQUEST]: 10,
      [SecurityEventType.SESSION_TIMEOUT]: 5,
      [SecurityEventType.LOGIN_ATTEMPT]: 10
    };

    score += eventTypeScores[eventType] || 10;

    // Severity multiplier
    const severityMultipliers = {
      [SecurityAuditLevel.LOW]: 0.5,
      [SecurityAuditLevel.MEDIUM]: 1.0,
      [SecurityAuditLevel.HIGH]: 1.5,
      [SecurityAuditLevel.CRITICAL]: 2.0
    };

    score *= severityMultipliers[severity];

    // Additional risk factors
    if (details['blocked'] === false) score += 20; // Not blocked increases risk
    if (typeof details['attemptCount'] === 'number' && details['attemptCount'] > 5) {
      score += details['attemptCount'] * 2;
    }
    if (Array.isArray(details['riskIndicators']) && details['riskIndicators'].length > 0) {
      score += details['riskIndicators'].length * 5;
    }

    return Math.min(Math.round(score), 100); // Cap at 100
  }

  /**
   * Handle critical security events
   */
  private handleCriticalEvent(event: SecurityAuditEvent): void {
    console.error('🚨 CRITICAL SECURITY EVENT:', {
      id: event.id,
      type: event.eventType,
      details: event.details,
      riskScore: event.riskScore
    });

    // In production, this would trigger:
    // - Real-time alerts
    // - Security team notifications
    // - Automated response actions
    // - External security system integration
  }

  /**
   * Log to console with appropriate level
   */
  private logToConsole(event: SecurityAuditEvent): void {
    const logData = {
      id: event.id,
      type: event.eventType,
      severity: event.severity,
      riskScore: event.riskScore,
      details: event.details
    };

    switch (event.severity) {
      case SecurityAuditLevel.CRITICAL:
        console.error('🚨 SECURITY AUDIT:', logData);
        break;
      case SecurityAuditLevel.HIGH:
        console.warn('⚠️ SECURITY AUDIT:', logData);
        break;
      case SecurityAuditLevel.MEDIUM:
        console.info('ℹ️ SECURITY AUDIT:', logData);
        break;
      default:
        console.debug('🔍 SECURITY AUDIT:', logData);
    }
  }

  /**
   * Export as CSV format
   */
  private exportAsCSV(): string {
    if (this.auditEvents.length === 0) return '';

    const headers = [
      'ID', 'Timestamp', 'Event Type', 'Severity', 'User ID',
      'IP Address', 'Risk Score', 'Details', 'Blocked'
    ];

    const rows = this.auditEvents.map(event => [
      event.id,
      new Date(event.timestamp).toISOString(),
      event.eventType,
      event.severity,
      event.userId || '',
      event.ipAddress,
      event.riskScore.toString(),
      JSON.stringify(event.details).replace(/"/g, '""'),
      event.metadata.blocked ? 'Yes' : 'No'
    ]);

    return [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');
  }

  /**
   * Get current IP (mock implementation)
   */
  private getCurrentIP(): string {
    // In production, this would get the real client IP
    return '192.168.1.100';
  }

  /**
   * Get session ID
   */
  private getSessionId(): string {
    return sessionStorage.getItem('sessionId') || `session_${Date.now()}`;
  }

  /**
   * Generate device fingerprint
   */
  private generateDeviceFingerprint(): string {
    const components = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset().toString()
    ];

    return btoa(components.join('|')).substring(0, 16);
  }

  /**
   * Get geolocation (mock implementation)
   */
  private getGeolocation(): string {
    // In production, this would get real geolocation
    return 'Unknown';
  }

  /**
   * Get previous attempts count
   */
  private getPreviousAttempts(eventType: SecurityEventType): number {
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;

    return this.auditEvents.filter(event =>
      event.eventType === eventType &&
      (now - event.timestamp) <= oneHour
    ).length;
  }
}
