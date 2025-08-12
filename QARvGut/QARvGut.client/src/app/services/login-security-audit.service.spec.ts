// ---------------------------------------
// Story 1.2 Task 2: Login Security Audit Service Tests
// Comprehensive unit tests for security auditing
// ---------------------------------------

import { TestBed } from '@angular/core/testing';
import {
  LoginSecurityAuditService,
  SecurityEventType,
  SecurityAuditLevel
} from './login-security-audit.service';

describe('LoginSecurityAuditService', () => {
  let service: LoginSecurityAuditService;
  let consoleErrorSpy: jasmine.Spy;
  let consoleWarnSpy: jasmine.Spy;
  let consoleInfoSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoginSecurityAuditService);
    consoleErrorSpy = spyOn(console, 'error');
    consoleWarnSpy = spyOn(console, 'warn');
    consoleInfoSpy = spyOn(console, 'info');
  });

  afterEach(() => {
    service.clearAuditLog();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Security Event Logging', () => {
    it('should log a basic security event', () => {
      // Act
      const event = service.logSecurityEvent(
        SecurityEventType.LOGIN_ATTEMPT,
        SecurityAuditLevel.LOW,
        { username: 'testuser' }
      );

      // Assert
      expect(event).toBeTruthy();
      expect(event.eventType).toBe(SecurityEventType.LOGIN_ATTEMPT);
      expect(event.severity).toBe(SecurityAuditLevel.LOW);
      expect(event.details['username']).toBe('testuser');
      expect(event.riskScore).toBeGreaterThanOrEqual(0);
      expect(event.riskScore).toBeLessThanOrEqual(100);
    });

    it('should generate unique event IDs', () => {
      // Act
      const event1 = service.logSecurityEvent(SecurityEventType.LOGIN_SUCCESS, SecurityAuditLevel.LOW);
      const event2 = service.logSecurityEvent(SecurityEventType.LOGIN_SUCCESS, SecurityAuditLevel.LOW);

      // Assert
      expect(event1.id).not.toBe(event2.id);
      expect(event1.id).toMatch(/^audit_\d+_\d+$/);
    });

    it('should include metadata in events', () => {
      // Act
      const event = service.logSecurityEvent(
        SecurityEventType.SECURITY_VIOLATION,
        SecurityAuditLevel.HIGH,
        { blocked: true }
      );

      // Assert
      expect(event.metadata).toBeDefined();
      expect(event.metadata.sessionId).toBeDefined();
      expect(event.metadata.deviceFingerprint).toBeDefined();
      expect(event.metadata.blocked).toBe(true);
      expect(event.ipAddress).toBeDefined();
      expect(event.userAgent).toBe(navigator.userAgent);
    });
  });

  describe('Login Attempt Logging', () => {
    it('should log successful login attempt', () => {
      // Act
      const event = service.logLoginAttempt('user123', true, { rememberMe: true });

      // Assert
      expect(event.eventType).toBe(SecurityEventType.LOGIN_SUCCESS);
      expect(event.severity).toBe(SecurityAuditLevel.LOW);
      expect(event.details['username']).toBe('user123');
      expect(event.details['success']).toBe(true);
      expect(event.details['rememberMe']).toBe(true);
      expect(event.userId).toBe('user123');
    });

    it('should log failed login attempt', () => {
      // Act
      const event = service.logLoginAttempt('user123', false);

      // Assert
      expect(event.eventType).toBe(SecurityEventType.LOGIN_FAILURE);
      expect(event.severity).toBe(SecurityAuditLevel.MEDIUM);
      expect(event.details['username']).toBe('user123');
      expect(event.details['success']).toBe(false);
      expect(event.userId).toBeUndefined();
    });
  });

  describe('Security Violation Logging', () => {
    it('should log blocked security violation', () => {
      // Act
      const event = service.logSecurityViolation(
        'XSS_ATTEMPT',
        true,
        { payload: '<script>alert(1)</script>' }
      );

      // Assert
      expect(event.eventType).toBe(SecurityEventType.SECURITY_VIOLATION);
      expect(event.severity).toBe(SecurityAuditLevel.HIGH);
      expect(event.details['violationType']).toBe('XSS_ATTEMPT');
      expect(event.details['blocked']).toBe(true);
      expect(event.details['mitigationAction']).toBe('Request blocked');
    });

    it('should log unblocked security violation as critical', () => {
      // Act
      const event = service.logSecurityViolation('SQL_INJECTION', false);

      // Assert
      expect(event.severity).toBe(SecurityAuditLevel.CRITICAL);
      expect(event.details['blocked']).toBe(false);
      expect(event.details['mitigationAction']).toBe('Alert generated');
    });
  });

  describe('Suspicious Activity Logging', () => {
    it('should log suspicious activity with medium severity for few indicators', () => {
      // Act
      const event = service.logSuspiciousActivity(
        'UNUSUAL_TIMING',
        ['rapid_requests', 'off_hours'],
        { requestCount: 10 }
      );

      // Assert
      expect(event.eventType).toBe(SecurityEventType.SUSPICIOUS_ACTIVITY);
      expect(event.severity).toBe(SecurityAuditLevel.MEDIUM);
      expect(event.details['activityType']).toBe('UNUSUAL_TIMING');
      expect(event.details['riskIndicators']).toEqual(['rapid_requests', 'off_hours']);
      expect(event.details['indicatorCount']).toBe(2);
    });

    it('should log suspicious activity with high severity for many indicators', () => {
      // Act
      const indicators = ['rapid_requests', 'unusual_location', 'bot_patterns', 'failed_attempts'];
      const event = service.logSuspiciousActivity('COORDINATED_ATTACK', indicators);

      // Assert
      expect(event.severity).toBe(SecurityAuditLevel.HIGH);
      expect(event.details['indicatorCount']).toBe(4);
    });
  });

  describe('Brute Force Detection', () => {
    it('should log brute force detection with critical severity', () => {
      // Act
      const event = service.logBruteForceDetection('attacker', 15, 300000, true);

      // Assert
      expect(event.eventType).toBe(SecurityEventType.BRUTE_FORCE_DETECTED);
      expect(event.severity).toBe(SecurityAuditLevel.CRITICAL);
      expect(event.details['username']).toBe('attacker');
      expect(event.details['attemptCount']).toBe(15);
      expect(event.details['timeWindow']).toBe(300000);
      expect(event.details['blocked']).toBe(true);
      expect(event.details['mitigationAction']).toBe('IP temporarily blocked');
    });

    it('should log account lock mitigation when not blocked', () => {
      // Act
      const event = service.logBruteForceDetection('user', 10, 600000, false);

      // Assert
      expect(event.details['mitigationAction']).toBe('Account temporarily locked');
    });
  });

  describe('Risk Score Calculation', () => {
    it('should calculate higher risk scores for critical events', () => {
      // Act
      const criticalEvent = service.logSecurityEvent(
        SecurityEventType.BRUTE_FORCE_DETECTED,
        SecurityAuditLevel.CRITICAL
      );
      const lowEvent = service.logSecurityEvent(
        SecurityEventType.LOGIN_SUCCESS,
        SecurityAuditLevel.LOW
      );

      // Assert
      expect(criticalEvent.riskScore).toBeGreaterThan(lowEvent.riskScore);
    });

    it('should increase risk score for unblocked violations', () => {
      // Act
      const blockedEvent = service.logSecurityViolation('TEST', true);
      const unblockedEvent = service.logSecurityViolation('TEST', false);

      // Assert
      expect(unblockedEvent.riskScore).toBeGreaterThan(blockedEvent.riskScore);
    });

    it('should increase risk score based on attempt count', () => {
      // Act
      const lowAttempts = service.logSecurityEvent(
        SecurityEventType.LOGIN_FAILURE,
        SecurityAuditLevel.MEDIUM,
        { attemptCount: 2 }
      );
      const highAttempts = service.logSecurityEvent(
        SecurityEventType.LOGIN_FAILURE,
        SecurityAuditLevel.MEDIUM,
        { attemptCount: 10 }
      );

      // Assert
      expect(highAttempts.riskScore).toBeGreaterThan(lowAttempts.riskScore);
    });
  });

  describe('Critical Event Handling', () => {
    it('should trigger special handling for critical events', () => {
      // Act
      service.logSecurityEvent(
        SecurityEventType.BRUTE_FORCE_DETECTED,
        SecurityAuditLevel.CRITICAL,
        { immediateAction: 'required' }
      );

      // Assert
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '🚨 CRITICAL SECURITY EVENT:',
        jasmine.objectContaining({
          type: SecurityEventType.BRUTE_FORCE_DETECTED
        })
      );
    });
  });

  describe('Console Logging by Severity', () => {
    it('should log critical events to console.error', () => {
      // Act
      service.logSecurityEvent(SecurityEventType.SECURITY_VIOLATION, SecurityAuditLevel.CRITICAL);

      // Assert
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it('should log high severity events to console.warn', () => {
      // Act
      service.logSecurityEvent(SecurityEventType.SUSPICIOUS_ACTIVITY, SecurityAuditLevel.HIGH);

      // Assert
      expect(consoleWarnSpy).toHaveBeenCalled();
    });

    it('should log medium severity events to console.info', () => {
      // Act
      service.logSecurityEvent(SecurityEventType.LOGIN_FAILURE, SecurityAuditLevel.MEDIUM);

      // Assert
      expect(consoleInfoSpy).toHaveBeenCalled();
    });
  });

  describe('Security Summary', () => {
    beforeEach(() => {
      // Create sample events for testing
      service.logLoginAttempt('user1', true);
      service.logLoginAttempt('user2', false);
      service.logSecurityViolation('XSS', true);
      service.logSuspiciousActivity('BOT', ['pattern1']);
      service.logBruteForceDetection('attacker', 5, 300000, true);
    });

    it('should generate comprehensive security summary', () => {
      // Act
      const summary = service.getSecuritySummary();

      // Assert
      expect(summary.totalEvents).toBe(5);
      expect(summary.successfulLogins).toBe(1);
      expect(summary.failedLogins).toBe(1);
      expect(summary.criticalEvents).toBe(1); // Brute force
      expect(summary.highRiskEvents).toBe(1); // Security violation
      expect(summary.suspiciousActivities).toBe(1);
      expect(summary.blockedAttempts).toBe(2); // Security violation + brute force
    });

    it('should calculate risk trends correctly', () => {
      // Act
      const summary = service.getSecuritySummary();

      // Assert
      expect(summary.riskTrends.last24Hours).toBe(5);
      expect(summary.riskTrends.last7Days).toBe(5);
      expect(summary.riskTrends.last30Days).toBe(5);
    });
  });

  describe('Event Querying', () => {
    beforeEach(() => {
      service.logSecurityEvent(SecurityEventType.LOGIN_SUCCESS, SecurityAuditLevel.LOW, {}, 'user1');
      service.logSecurityEvent(SecurityEventType.LOGIN_FAILURE, SecurityAuditLevel.MEDIUM, {}, 'user2');
      service.logSecurityEvent(SecurityEventType.SECURITY_VIOLATION, SecurityAuditLevel.HIGH);
    });

    it('should filter events by severity', () => {
      // Act
      const highEvents = service.getEventsBySeverity(SecurityAuditLevel.HIGH);

      // Assert
      expect(highEvents.length).toBe(1);
      expect(highEvents[0].severity).toBe(SecurityAuditLevel.HIGH);
    });

    it('should filter events by type', () => {
      // Act
      const loginEvents = service.getEventsByType(SecurityEventType.LOGIN_SUCCESS);

      // Assert
      expect(loginEvents.length).toBe(1);
      expect(loginEvents[0].eventType).toBe(SecurityEventType.LOGIN_SUCCESS);
    });

    it('should return recent events in descending order', () => {
      // Act
      const recentEvents = service.getRecentEvents(2);

      // Assert
      expect(recentEvents.length).toBe(2);
      expect(recentEvents[0].timestamp).toBeGreaterThanOrEqual(recentEvents[1].timestamp);
    });

    it('should search events by criteria', () => {
      // Act
      const results = service.searchEvents({
        eventType: SecurityEventType.LOGIN_FAILURE,
        userId: 'user2'
      });

      // Assert
      expect(results.length).toBe(1);
      expect(results[0].eventType).toBe(SecurityEventType.LOGIN_FAILURE);
      expect(results[0].userId).toBe('user2');
    });
  });

  describe('Audit Log Management', () => {
    it('should maintain maximum event limit', () => {
      // Arrange - Create more than max events (1000)
      for (let i = 0; i < 1005; i++) {
        service.logSecurityEvent(SecurityEventType.LOGIN_SUCCESS, SecurityAuditLevel.LOW);
      }

      // Act
      const summary = service.getSecuritySummary();

      // Assert
      expect(summary.totalEvents).toBe(1000);
    });

    it('should export audit log as JSON', () => {
      // Arrange
      service.logSecurityEvent(SecurityEventType.LOGIN_SUCCESS, SecurityAuditLevel.LOW);

      // Act
      const jsonExport = service.exportAuditLog('json');

      // Assert
      expect(() => JSON.parse(jsonExport)).not.toThrow();
      const parsed = JSON.parse(jsonExport);
      expect(Array.isArray(parsed)).toBe(true);
      expect(parsed.length).toBe(1);
    });

    it('should export audit log as CSV', () => {
      // Arrange
      service.logSecurityEvent(SecurityEventType.LOGIN_SUCCESS, SecurityAuditLevel.LOW);

      // Act
      const csvExport = service.exportAuditLog('csv');

      // Assert
      expect(csvExport).toContain('ID,Timestamp,Event Type');
      expect(csvExport).toContain('login_success');
    });

    it('should clear audit log when requested', () => {
      // Arrange
      service.logSecurityEvent(SecurityEventType.LOGIN_SUCCESS, SecurityAuditLevel.LOW);

      // Act
      service.clearAuditLog();
      const summary = service.getSecuritySummary();

      // Assert
      expect(summary.totalEvents).toBe(0);
    });
  });

  describe('Date Range Searching', () => {
    it('should filter events by date range', () => {
      // Arrange
      const now = Date.now();
      const hourAgo = now - (60 * 60 * 1000);

      service.logSecurityEvent(SecurityEventType.LOGIN_SUCCESS, SecurityAuditLevel.LOW);

      // Act
      const results = service.searchEvents({
        dateRange: { start: hourAgo, end: now + 1000 }
      });

      // Assert
      expect(results.length).toBe(1);
    });

    it('should exclude events outside date range', () => {
      // Arrange
      const now = Date.now();
      const futureStart = now + (24 * 60 * 60 * 1000);
      const futureEnd = futureStart + (60 * 60 * 1000);

      service.logSecurityEvent(SecurityEventType.LOGIN_SUCCESS, SecurityAuditLevel.LOW);

      // Act
      const results = service.searchEvents({
        dateRange: { start: futureStart, end: futureEnd }
      });

      // Assert
      expect(results.length).toBe(0);
    });
  });
});
