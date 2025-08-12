// ---------------------------------------
// Story 1.2 Task 2: Login Performance Service
// Enterprise performance monitoring for authentication
// ---------------------------------------

import { Injectable } from '@angular/core';

export interface LoginPerformanceMetrics {
  formRenderTime: number;
  validationTime: number;
  authenticationTime: number;
  totalLoginTime: number;
  securityCheckTime: number;
  errorHandlingTime: number;
  memoryUsage: number;
  timestamp: number;
}

interface PerformanceSession extends Partial<LoginPerformanceMetrics> {
  validationStart?: number;
  authStart?: number;
  securityStart?: number;
  errorStart?: number;
}

export interface PerformanceThresholds {
  formRenderWarning: number; // 100ms
  validationWarning: number; // 50ms
  authenticationWarning: number; // 2000ms
  totalLoginWarning: number; // 3000ms
  memoryWarning: number; // 10MB
}

@Injectable({
  providedIn: 'root'
})
export class LoginPerformanceService {

  private readonly performanceThresholds: PerformanceThresholds = {
    formRenderWarning: 100,
    validationWarning: 50,
    authenticationWarning: 2000,
    totalLoginWarning: 3000,
    memoryWarning: 10485760 // 10MB in bytes
  };

  private performanceMetrics: LoginPerformanceMetrics[] = [];
  private currentSession: PerformanceSession = {};

  /**
   * Start performance measurement for form rendering
   */
  startFormRender(): void {
    this.currentSession.timestamp = performance.now();
  }

  /**
   * End form render measurement
   */
  endFormRender(): void {
    if (this.currentSession.timestamp) {
      this.currentSession.formRenderTime = performance.now() - this.currentSession.timestamp;
    }
  }

  /**
   * Start validation performance measurement
   */
  startValidation(): void {
    this.currentSession.validationStart = performance.now();
  }

  /**
   * End validation measurement
   */
  endValidation(): void {
    if (this.currentSession.validationStart) {
      this.currentSession.validationTime = performance.now() - this.currentSession.validationStart;
    }
  }

  /**
   * Start authentication performance measurement
   */
  startAuthentication(): void {
    this.currentSession.authStart = performance.now();
  }

  /**
   * End authentication measurement
   */
  endAuthentication(): void {
    if (this.currentSession.authStart) {
      this.currentSession.authenticationTime = performance.now() - this.currentSession.authStart;
    }
  }

  /**
   * Start security check measurement
   */
  startSecurityCheck(): void {
    this.currentSession.securityStart = performance.now();
  }

  /**
   * End security check measurement
   */
  endSecurityCheck(): void {
    if (this.currentSession.securityStart) {
      this.currentSession.securityCheckTime = performance.now() - this.currentSession.securityStart;
    }
  }

  /**
   * Start error handling measurement
   */
  startErrorHandling(): void {
    this.currentSession.errorStart = performance.now();
  }

  /**
   * End error handling measurement
   */
  endErrorHandling(): void {
    if (this.currentSession.errorStart) {
      this.currentSession.errorHandlingTime = performance.now() - this.currentSession.errorStart;
    }
  }

  /**
   * Complete login performance measurement
   */
  completeLoginMeasurement(): LoginPerformanceMetrics {
    const totalTime = this.currentSession.timestamp ?
      performance.now() - this.currentSession.timestamp : 0;

    const metrics: LoginPerformanceMetrics = {
      formRenderTime: this.currentSession.formRenderTime || 0,
      validationTime: this.currentSession.validationTime || 0,
      authenticationTime: this.currentSession.authenticationTime || 0,
      securityCheckTime: this.currentSession.securityCheckTime || 0,
      errorHandlingTime: this.currentSession.errorHandlingTime || 0,
      totalLoginTime: totalTime,
      memoryUsage: this.getMemoryUsage(),
      timestamp: Date.now()
    };

    // Store metrics
    this.performanceMetrics.push(metrics);

    // Keep only last 100 measurements
    if (this.performanceMetrics.length > 100) {
      this.performanceMetrics = this.performanceMetrics.slice(-100);
    }

    // Reset current session
    this.currentSession = {};

    // Log performance warnings
    this.checkPerformanceThresholds(metrics);

    return metrics;
  }

  /**
   * Get current memory usage estimate
   */
  private getMemoryUsage(): number {
    if ('memory' in performance) {
      const memInfo = (performance as any).memory as { usedJSHeapSize?: number };
      return memInfo.usedJSHeapSize || 0;
    }
    return 0;
  }

  /**
   * Check performance thresholds and log warnings
   */
  private checkPerformanceThresholds(metrics: LoginPerformanceMetrics): void {
    const warnings: string[] = [];

    if (metrics.formRenderTime > this.performanceThresholds.formRenderWarning) {
      warnings.push(`Form render time: ${metrics.formRenderTime.toFixed(2)}ms (threshold: ${this.performanceThresholds.formRenderWarning}ms)`);
    }

    if (metrics.validationTime > this.performanceThresholds.validationWarning) {
      warnings.push(`Validation time: ${metrics.validationTime.toFixed(2)}ms (threshold: ${this.performanceThresholds.validationWarning}ms)`);
    }

    if (metrics.authenticationTime > this.performanceThresholds.authenticationWarning) {
      warnings.push(`Authentication time: ${metrics.authenticationTime.toFixed(2)}ms (threshold: ${this.performanceThresholds.authenticationWarning}ms)`);
    }

    if (metrics.totalLoginTime > this.performanceThresholds.totalLoginWarning) {
      warnings.push(`Total login time: ${metrics.totalLoginTime.toFixed(2)}ms (threshold: ${this.performanceThresholds.totalLoginWarning}ms)`);
    }

    if (metrics.memoryUsage > this.performanceThresholds.memoryWarning) {
      warnings.push(`Memory usage: ${(metrics.memoryUsage / 1024 / 1024).toFixed(2)}MB (threshold: ${(this.performanceThresholds.memoryWarning / 1024 / 1024).toFixed(2)}MB)`);
    }

    if (warnings.length > 0) {
      console.warn('🚨 Login Performance Warnings:', warnings);
    }
  }

  /**
   * Get performance analytics
   */
  getPerformanceAnalytics(): {
    averages: Partial<LoginPerformanceMetrics>;
    maximums: Partial<LoginPerformanceMetrics>;
    recentTrends: LoginPerformanceMetrics[];
    issues: string[];
  } {
    if (this.performanceMetrics.length === 0) {
      return {
        averages: {},
        maximums: {},
        recentTrends: [],
        issues: []
      };
    }

    const recent = this.performanceMetrics.slice(-10);
    const averages = this.calculateAverages(this.performanceMetrics);
    const maximums = this.calculateMaximums(this.performanceMetrics);
    const issues = this.identifyPerformanceIssues(averages);

    return {
      averages,
      maximums,
      recentTrends: recent,
      issues
    };
  }

  /**
   * Calculate average metrics
   */
  private calculateAverages(metrics: LoginPerformanceMetrics[]): Partial<LoginPerformanceMetrics> {
    const count = metrics.length;
    const totals = metrics.reduce((acc, metric) => ({
      formRenderTime: acc.formRenderTime + metric.formRenderTime,
      validationTime: acc.validationTime + metric.validationTime,
      authenticationTime: acc.authenticationTime + metric.authenticationTime,
      totalLoginTime: acc.totalLoginTime + metric.totalLoginTime,
      securityCheckTime: acc.securityCheckTime + metric.securityCheckTime,
      errorHandlingTime: acc.errorHandlingTime + metric.errorHandlingTime,
      memoryUsage: acc.memoryUsage + metric.memoryUsage
    }), {
      formRenderTime: 0,
      validationTime: 0,
      authenticationTime: 0,
      totalLoginTime: 0,
      securityCheckTime: 0,
      errorHandlingTime: 0,
      memoryUsage: 0
    });

    return {
      formRenderTime: totals.formRenderTime / count,
      validationTime: totals.validationTime / count,
      authenticationTime: totals.authenticationTime / count,
      totalLoginTime: totals.totalLoginTime / count,
      securityCheckTime: totals.securityCheckTime / count,
      errorHandlingTime: totals.errorHandlingTime / count,
      memoryUsage: totals.memoryUsage / count
    };
  }

  /**
   * Calculate maximum metrics
   */
  private calculateMaximums(metrics: LoginPerformanceMetrics[]): Partial<LoginPerformanceMetrics> {
    return metrics.reduce((max: Partial<LoginPerformanceMetrics>, metric) => ({
      formRenderTime: Math.max(max.formRenderTime || 0, metric.formRenderTime),
      validationTime: Math.max(max.validationTime || 0, metric.validationTime),
      authenticationTime: Math.max(max.authenticationTime || 0, metric.authenticationTime),
      totalLoginTime: Math.max(max.totalLoginTime || 0, metric.totalLoginTime),
      securityCheckTime: Math.max(max.securityCheckTime || 0, metric.securityCheckTime),
      errorHandlingTime: Math.max(max.errorHandlingTime || 0, metric.errorHandlingTime),
      memoryUsage: Math.max(max.memoryUsage || 0, metric.memoryUsage)
    }), {});
  }

  /**
   * Identify performance issues
   */
  private identifyPerformanceIssues(averages: Partial<LoginPerformanceMetrics>): string[] {
    const issues: string[] = [];

    if (averages.formRenderTime && averages.formRenderTime > this.performanceThresholds.formRenderWarning) {
      issues.push('Form rendering is slower than expected');
    }

    if (averages.validationTime && averages.validationTime > this.performanceThresholds.validationWarning) {
      issues.push('Form validation is taking too long');
    }

    if (averages.authenticationTime && averages.authenticationTime > this.performanceThresholds.authenticationWarning) {
      issues.push('Authentication calls are slow - check network or backend');
    }

    if (averages.memoryUsage && averages.memoryUsage > this.performanceThresholds.memoryWarning) {
      issues.push('Memory usage is high - possible memory leak');
    }

    return issues;
  }

  /**
   * Reset performance tracking
   */
  resetTracking(): void {
    this.performanceMetrics = [];
    this.currentSession = {};
  }

  /**
   * Get performance summary for logging
   */
  getPerformanceSummary(): string {
    const analytics = this.getPerformanceAnalytics();
    const avg = analytics.averages;

    return `Login Performance: Render: ${avg.formRenderTime?.toFixed(1)}ms, Validation: ${avg.validationTime?.toFixed(1)}ms, Auth: ${avg.authenticationTime?.toFixed(1)}ms, Total: ${avg.totalLoginTime?.toFixed(1)}ms`;
  }
}
