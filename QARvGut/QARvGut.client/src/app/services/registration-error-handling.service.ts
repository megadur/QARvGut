// ---------------------------------------
// Story 1.2 Refactor: Registration Error Handling Service
// Senior Dev Review - Centralized Error Management
// ---------------------------------------

import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { AlertService, MessageSeverity } from './alert.service';

export interface ErrorContext {
  operation: string;
  component: string;
  userId?: string;
  additionalData?: Record<string, unknown>;
}

export interface ProcessedError {
  userMessage: string;
  technicalMessage: string;
  severity: MessageSeverity;
  shouldRetry: boolean;
  logLevel: 'error' | 'warn' | 'info';
}

@Injectable({
  providedIn: 'root'
})
export class RegistrationErrorHandlingService {

  constructor(private alertService: AlertService) {}

  /**
   * Process registration-specific errors with context
   * @param error The HTTP error response
   * @param context Additional context for error processing
   */
  processRegistrationError(error: HttpErrorResponse, context: ErrorContext): ProcessedError {
    const processedError = this.analyzeError(error, context);
    this.logError(error, context, processedError);

    return processedError;
  }

  /**
   * Handle server validation errors specifically for registration
   * @param validationErrors Server validation error object
   */
  handleServerValidationErrors(validationErrors: Record<string, string[]>): string[] {
    const userMessages: string[] = [];

    const fieldMappings: Record<string, (errors: string[]) => string> = {
      'Email': () => 'This email address is already registered. Please use a different email or try logging in.',
      'UserName': () => 'This username is already taken. Please choose a different username.',
      'Password': (errors) => `Password validation failed: ${errors.join(', ')}`,
      'NewPassword': (errors) => `Password requirements not met: ${errors.join(', ')}`,
      'ConfirmPassword': () => 'Password confirmation does not match.',
      'FirstName': (errors) => `First name error: ${errors.join(', ')}`,
      'LastName': (errors) => `Last name error: ${errors.join(', ')}`,
      'Department': (errors) => `Department error: ${errors.join(', ')}`,
      'JobTitle': (errors) => `Job title error: ${errors.join(', ')}`,
      'PhoneNumber': (errors) => `Phone number error: ${errors.join(', ')}`
    };

    Object.entries(validationErrors).forEach(([field, errors]) => {
      const handler = fieldMappings[field];
      if (handler) {
        userMessages.push(handler(errors));
      } else {
        // Generic handler for unmapped fields
        userMessages.push(`${field}: ${errors.join(', ')}`);
      }
    });

    return userMessages;
  }

  /**
   * Display processed registration errors to user
   * @param error Processed error information
   */
  displayRegistrationError(error: ProcessedError): void {
    if (error.shouldRetry) {
      this.alertService.showStickyMessage(
        'Registration Error - Please Try Again',
        `${error.userMessage} If the problem persists, please contact support.`,
        error.severity
      );
    } else {
      this.alertService.showMessage(
        'Registration Error',
        error.userMessage,
        error.severity
      );
    }
  }

  /**
   * Analyze and categorize the error
   * @param error HTTP error response
   * @param context Error context
   */
  private analyzeError(error: HttpErrorResponse, context: ErrorContext): ProcessedError {
    // Network errors
    if (error.status === 0 || !navigator.onLine) {
      return {
        userMessage: 'Unable to connect to the server. Please check your internet connection and try again.',
        technicalMessage: `Network error in ${context.operation}: ${error.message}`,
        severity: MessageSeverity.error,
        shouldRetry: true,
        logLevel: 'error'
      };
    }

    // Client errors (4xx)
    if (error.status >= 400 && error.status < 500) {
      return this.processClientError(error, context);
    }

    // Server errors (5xx)
    if (error.status >= 500) {
      return {
        userMessage: 'A server error occurred. Our team has been notified. Please try again in a few minutes.',
        technicalMessage: `Server error ${error.status} in ${context.operation}: ${error.message}`,
        severity: MessageSeverity.error,
        shouldRetry: true,
        logLevel: 'error'
      };
    }

    // Unknown errors
    return {
      userMessage: 'An unexpected error occurred. Please try again or contact support if the problem persists.',
      technicalMessage: `Unknown error in ${context.operation}: ${error.message || 'No error message'}`,
      severity: MessageSeverity.error,
      shouldRetry: false,
      logLevel: 'error'
    };
  }

  /**
   * Process client-side errors (4xx status codes)
   * @param error HTTP error response
   * @param context Error context
   */
  private processClientError(error: HttpErrorResponse, context: ErrorContext): ProcessedError {
    switch (error.status) {
      case 400:
        // Bad Request - typically validation errors
        if (error.error?.errors) {
          const validationMessages = this.handleServerValidationErrors(error.error.errors);
          return {
            userMessage: validationMessages.join(' '),
            technicalMessage: `Validation error in ${context.operation}: ${JSON.stringify(error.error.errors)}`,
            severity: MessageSeverity.error,
            shouldRetry: false,
            logLevel: 'warn'
          };
        }
        break;

      case 401:
        return {
          userMessage: 'Authentication required. Please log in and try again.',
          technicalMessage: `Authentication error in ${context.operation}`,
          severity: MessageSeverity.error,
          shouldRetry: false,
          logLevel: 'warn'
        };

      case 403:
        return {
          userMessage: 'You do not have permission to perform this action.',
          technicalMessage: `Authorization error in ${context.operation}`,
          severity: MessageSeverity.error,
          shouldRetry: false,
          logLevel: 'warn'
        };

      case 409:
        return {
          userMessage: 'This information conflicts with existing data. Please check your entries and try again.',
          technicalMessage: `Conflict error in ${context.operation}: ${error.message}`,
          severity: MessageSeverity.error,
          shouldRetry: false,
          logLevel: 'warn'
        };

      case 422:
        return {
          userMessage: 'The information provided could not be processed. Please check your entries.',
          technicalMessage: `Unprocessable entity in ${context.operation}: ${error.message}`,
          severity: MessageSeverity.error,
          shouldRetry: false,
          logLevel: 'warn'
        };

      case 429:
        return {
          userMessage: 'Too many registration attempts. Please wait a few minutes before trying again.',
          technicalMessage: `Rate limit exceeded in ${context.operation}`,
          severity: MessageSeverity.warn,
          shouldRetry: true,
          logLevel: 'warn'
        };
    }

    // Generic client error
    return {
      userMessage: 'Invalid request. Please check your information and try again.',
      technicalMessage: `Client error ${error.status} in ${context.operation}: ${error.message}`,
      severity: MessageSeverity.error,
      shouldRetry: false,
      logLevel: 'error'
    };
  }

  /**
   * Log error details for debugging and monitoring
   * @param error Original HTTP error
   * @param context Error context
   * @param processedError Processed error information
   */
  private logError(error: HttpErrorResponse, context: ErrorContext, processedError: ProcessedError): void {
    const logData = {
      timestamp: new Date().toISOString(),
      context,
      httpStatus: error.status,
      httpMessage: error.message,
      url: error.url,
      processedError: {
        technicalMessage: processedError.technicalMessage,
        logLevel: processedError.logLevel
      }
    };

    // In production, this would be sent to a logging service
    if (processedError.logLevel === 'error') {
      console.error('Registration Error:', logData);
    } else if (processedError.logLevel === 'warn') {
      console.warn('Registration Warning:', logData);
    } else {
      console.info('Registration Info:', logData);
    }
  }

  /**
   * Provide user-friendly suggestions based on error type
   * @param error Processed error
   */
  getRecoverySuggestions(error: ProcessedError): string[] {
    const suggestions: string[] = [];

    if (error.shouldRetry) {
      suggestions.push('Try the operation again');
      suggestions.push('Refresh the page and try again');
    }

    if (error.technicalMessage.includes('network') || error.technicalMessage.includes('connection')) {
      suggestions.push('Check your internet connection');
      suggestions.push('Disable any VPN or proxy temporarily');
    }

    if (error.technicalMessage.includes('validation') || error.technicalMessage.includes('400')) {
      suggestions.push('Double-check all form fields');
      suggestions.push('Ensure all required fields are filled');
      suggestions.push('Try using a different email address');
    }

    if (suggestions.length === 0) {
      suggestions.push('Contact support if the problem persists');
    }

    return suggestions;
  }
}
