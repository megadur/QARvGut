// ---------------------------------------
// Story 1.2 Refactor: Performance Monitoring Service
// Senior Dev Review - Performance Excellence
// ---------------------------------------

import { Injectable } from '@angular/core';

export interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  category: 'timing' | 'count' | 'size' | 'error';
  metadata?: Record<string, unknown>;
}

export interface FormPerformanceData {
  formBuildTime: number;
  validationTime: number;
  submissionTime: number;
  renderTime: number;
  fieldCount: number;
  validationRuleCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class RegistrationPerformanceService {
  private metrics: PerformanceMetric[] = [];
  private readonly maxMetrics = 100; // Prevent memory leaks

  /**
   * Start timing a registration operation
   * @param operationName Name of the operation to time
   */
  startTiming(operationName: string): () => void {
    const startTime = performance.now();

    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;

      this.recordMetric({
        name: operationName,
        value: duration,
        timestamp: Date.now(),
        category: 'timing',
        metadata: {
          startTime,
          endTime
        }
      });
    };
  }

  /**
   * Record form performance metrics
   * @param data Form performance data
   */
  recordFormPerformance(data: FormPerformanceData): void {
    const metrics: PerformanceMetric[] = [
      {
        name: 'form_build_time',
        value: data.formBuildTime,
        timestamp: Date.now(),
        category: 'timing'
      },
      {
        name: 'validation_time',
        value: data.validationTime,
        timestamp: Date.now(),
        category: 'timing'
      },
      {
        name: 'submission_time',
        value: data.submissionTime,
        timestamp: Date.now(),
        category: 'timing'
      },
      {
        name: 'render_time',
        value: data.renderTime,
        timestamp: Date.now(),
        category: 'timing'
      },
      {
        name: 'field_count',
        value: data.fieldCount,
        timestamp: Date.now(),
        category: 'count'
      },
      {
        name: 'validation_rule_count',
        value: data.validationRuleCount,
        timestamp: Date.now(),
        category: 'count'
      }
    ];

    metrics.forEach(metric => this.recordMetric(metric));
  }

  /**
   * Record registration attempt metrics
   * @param success Whether registration was successful
   * @param duration Time taken for registration
   * @param errorType Optional error type if failed
   */
  recordRegistrationAttempt(success: boolean, duration: number, errorType?: string): void {
    this.recordMetric({
      name: 'registration_attempt',
      value: success ? 1 : 0,
      timestamp: Date.now(),
      category: 'count',
      metadata: {
        success,
        duration,
        errorType
      }
    });

    this.recordMetric({
      name: 'registration_duration',
      value: duration,
      timestamp: Date.now(),
      category: 'timing',
      metadata: {
        success,
        errorType
      }
    });
  }

  /**
   * Record password strength calculation performance
   * @param duration Time taken to calculate strength
   * @param passwordLength Length of password
   */
  recordPasswordStrengthCalculation(duration: number, passwordLength: number): void {
    this.recordMetric({
      name: 'password_strength_calculation',
      value: duration,
      timestamp: Date.now(),
      category: 'timing',
      metadata: {
        passwordLength
      }
    });
  }

  /**
   * Record form validation performance
   * @param duration Time taken for validation
   * @param fieldCount Number of fields validated
   * @param errorCount Number of validation errors
   */
  recordValidationPerformance(duration: number, fieldCount: number, errorCount: number): void {
    this.recordMetric({
      name: 'form_validation_duration',
      value: duration,
      timestamp: Date.now(),
      category: 'timing',
      metadata: {
        fieldCount,
        errorCount,
        avgTimePerField: duration / fieldCount
      }
    });
  }

  /**
   * Record API call performance
   * @param endpoint API endpoint called
   * @param duration Time taken for API call
   * @param success Whether call was successful
   * @param responseSize Size of response in bytes
   */
  recordApiCallPerformance(
    endpoint: string,
    duration: number,
    success: boolean,
    responseSize?: number
  ): void {
    this.recordMetric({
      name: 'api_call_duration',
      value: duration,
      timestamp: Date.now(),
      category: 'timing',
      metadata: {
        endpoint,
        success,
        responseSize
      }
    });
  }

  /**
   * Get performance summary for registration process
   */
  getPerformanceSummary(): {
    averageFormBuildTime: number;
    averageValidationTime: number;
    averageSubmissionTime: number;
    successRate: number;
    totalAttempts: number;
    commonErrorTypes: string[];
  } {
    const formBuildMetrics = this.getMetricsByName('form_build_time');
    const validationMetrics = this.getMetricsByName('validation_time');
    const submissionMetrics = this.getMetricsByName('submission_time');
    const attemptMetrics = this.getMetricsByName('registration_attempt');

    const successfulAttempts = attemptMetrics.filter(m => m.value === 1).length;
    const totalAttempts = attemptMetrics.length;

    const errorTypes: Record<string, number> = {};
    attemptMetrics
      .filter(m => m.value === 0 && m.metadata?.['errorType'])
      .forEach(m => {
        const errorType = m.metadata!['errorType'] as string;
        errorTypes[errorType] = (errorTypes[errorType] || 0) + 1;
      });

    const commonErrorTypes = Object.entries(errorTypes)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([type]) => type);

    return {
      averageFormBuildTime: this.calculateAverage(formBuildMetrics),
      averageValidationTime: this.calculateAverage(validationMetrics),
      averageSubmissionTime: this.calculateAverage(submissionMetrics),
      successRate: totalAttempts > 0 ? (successfulAttempts / totalAttempts) * 100 : 0,
      totalAttempts,
      commonErrorTypes
    };
  }

  /**
   * Get metrics by name
   * @param name Metric name to filter by
   */
  private getMetricsByName(name: string): PerformanceMetric[] {
    return this.metrics.filter(metric => metric.name === name);
  }

  /**
   * Calculate average value from metrics
   * @param metrics Array of metrics
   */
  private calculateAverage(metrics: PerformanceMetric[]): number {
    if (metrics.length === 0) return 0;
    return metrics.reduce((sum, metric) => sum + metric.value, 0) / metrics.length;
  }

  /**
   * Record a performance metric
   * @param metric The metric to record
   */
  private recordMetric(metric: PerformanceMetric): void {
    this.metrics.push(metric);

    // Prevent memory leaks by limiting stored metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics / 2); // Keep most recent half
    }

    // In production, send to analytics service
    this.sendToAnalytics(metric);
  }

  /**
   * Send metric to analytics service (placeholder for production implementation)
   * @param metric The metric to send
   */
  private sendToAnalytics(metric: PerformanceMetric): void {
    // In production, this would send to services like Google Analytics, Application Insights, etc.
    if (this.isProductionEnvironment()) {
      console.info(`Performance Metric: ${metric.name} = ${metric.value}ms`, metric);
    }
  }

  /**
   * Check if running in production environment
   */
  private isProductionEnvironment(): boolean {
    // Replace with actual environment check
    return false;
  }

  /**
   * Get all metrics for debugging (development only)
   */
  getAllMetrics(): PerformanceMetric[] {
    if (this.isProductionEnvironment()) {
      console.warn('getAllMetrics() should not be called in production');
      return [];
    }
    return [...this.metrics];
  }

  /**
   * Clear all stored metrics (useful for testing)
   */
  clearMetrics(): void {
    this.metrics = [];
  }

  /**
   * Create a performance-aware wrapper for async operations
   * @param operationName Name of the operation
   * @param operation The async operation to wrap
   */
  async wrapAsyncOperation<T>(
    operationName: string,
    operation: () => Promise<T>
  ): Promise<T> {
    const stopTiming = this.startTiming(operationName);
    try {
      const result = await operation();
      stopTiming();
      return result;
    } catch (error) {
      stopTiming();
      this.recordMetric({
        name: `${operationName}_error`,
        value: 1,
        timestamp: Date.now(),
        category: 'error',
        metadata: {
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      });
      throw error;
    }
  }
}
