// ---------------------------------------
// Story 1.2 Task 2: Login Error Handling Service
// Enterprise error management for authentication
// ---------------------------------------

import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

export interface LoginErrorContext {
  errorCode: string;
  originalError: unknown;
  userAction: string;
  formData?: Record<string, unknown>;
  timestamp: number;
  userFriendlyMessage: string;
  technicalMessage: string;
  suggestions: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'network' | 'authentication' | 'authorization' | 'validation' | 'server' | 'client';
  isRetryable: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class LoginErrorHandlingService {

  private readonly errorMappings = new Map([
    ['invalid_username_or_password', {
      userFriendlyMessage: 'Invalid username or password. Please check your credentials and try again.',
      suggestions: [
        'Verify your username and password are correct',
        'Check if Caps Lock is enabled',
        'Try using the "Forgot Password" option if needed'
      ],
      severity: 'medium' as const,
      category: 'authentication' as const,
      isRetryable: true
    }],
    ['account_locked', {
      userFriendlyMessage: 'Your account has been temporarily locked due to multiple failed login attempts.',
      suggestions: [
        'Wait for the lockout period to expire',
        'Contact support if you need immediate assistance',
        'Use the "Forgot Password" option to reset your password'
      ],
      severity: 'high' as const,
      category: 'authentication' as const,
      isRetryable: false
    }],
    ['account_disabled', {
      userFriendlyMessage: 'Your account has been disabled. Please contact support for assistance.',
      suggestions: [
        'Contact system administrator',
        'Verify your account status',
        'Check for any pending account verification requirements'
      ],
      severity: 'high' as const,
      category: 'authorization' as const,
      isRetryable: false
    }],
    ['email_not_confirmed', {
      userFriendlyMessage: 'Please confirm your email address before logging in.',
      suggestions: [
        'Check your email for a confirmation link',
        'Look in your spam/junk folder',
        'Request a new confirmation email'
      ],
      severity: 'medium' as const,
      category: 'authentication' as const,
      isRetryable: false
    }],
    ['too_many_attempts', {
      userFriendlyMessage: 'Too many login attempts. Please wait before trying again.',
      suggestions: [
        'Wait for the cooldown period to expire',
        'Try again in a few minutes',
        'Use the "Forgot Password" option if you\'ve forgotten your credentials'
      ],
      severity: 'medium' as const,
      category: 'authentication' as const,
      isRetryable: true
    }],
    ['network_error', {
      userFriendlyMessage: 'Unable to connect to the server. Please check your internet connection.',
      suggestions: [
        'Check your internet connection',
        'Try refreshing the page',
        'Contact support if the problem persists'
      ],
      severity: 'medium' as const,
      category: 'network' as const,
      isRetryable: true
    }],
    ['server_error', {
      userFriendlyMessage: 'A server error occurred. Please try again later.',
      suggestions: [
        'Try again in a few moments',
        'Refresh the page and try again',
        'Contact support if the problem continues'
      ],
      severity: 'high' as const,
      category: 'server' as const,
      isRetryable: true
    }],
    ['validation_error', {
      userFriendlyMessage: 'Please correct the highlighted fields and try again.',
      suggestions: [
        'Check all required fields are filled',
        'Ensure email format is correct',
        'Verify password meets requirements'
      ],
      severity: 'low' as const,
      category: 'validation' as const,
      isRetryable: true
    }]
  ]);

  /**
   * Process and contextualize login errors
   * @param error Original error object
   * @param userAction Description of what the user was trying to do
   * @param formData Optional form data for context
   */
  handleLoginError(
    error: unknown,
    userAction = 'logging in',
    formData?: Record<string, unknown>
  ): LoginErrorContext {
    const timestamp = Date.now();

    // Determine error code and details
    const { errorCode, technicalMessage } = this.analyzeError(error);

    // Get mapped error information
    const errorMapping = this.errorMappings.get(errorCode) || this.getDefaultErrorMapping();

    // Create error context
    const context: LoginErrorContext = {
      errorCode,
      originalError: error,
      userAction,
      formData: formData ? this.sanitizeFormData(formData) : undefined,
      timestamp,
      userFriendlyMessage: errorMapping.userFriendlyMessage,
      technicalMessage,
      suggestions: [...errorMapping.suggestions],
      severity: errorMapping.severity,
      category: errorMapping.category,
      isRetryable: errorMapping.isRetryable
    };

    // Add contextual suggestions
    this.addContextualSuggestions(context, error);

    // Log error for monitoring
    this.logError(context);

    return context;
  }

  /**
   * Analyze error to determine code and technical details
   * @param error Error object to analyze
   */
  private analyzeError(error: unknown): { errorCode: string; technicalMessage: string } {
    if (error instanceof HttpErrorResponse) {
      return this.analyzeHttpError(error);
    }

    if (error instanceof Error) {
      return {
        errorCode: this.mapErrorMessage(error.message),
        technicalMessage: error.message
      };
    }

    if (typeof error === 'string') {
      return {
        errorCode: this.mapErrorMessage(error),
        technicalMessage: error
      };
    }

    return {
      errorCode: 'unknown_error',
      technicalMessage: 'An unknown error occurred'
    };
  }

  /**
   * Analyze HTTP error responses
   * @param httpError HTTP error response
   */
  private analyzeHttpError(httpError: HttpErrorResponse): { errorCode: string; technicalMessage: string } {
    const status = httpError.status;
    const errorBody = httpError.error;

    // Check for specific error messages in response body
    if (errorBody && typeof errorBody === 'object') {
      if (errorBody.error_description) {
        return {
          errorCode: this.mapErrorMessage(errorBody.error_description),
          technicalMessage: errorBody.error_description
        };
      }

      if (errorBody.message) {
        return {
          errorCode: this.mapErrorMessage(errorBody.message),
          technicalMessage: errorBody.message
        };
      }
    }

    // Map based on HTTP status codes
    switch (status) {
      case 0:
        return {
          errorCode: 'network_error',
          technicalMessage: 'Network connection failed'
        };
      case 400:
        return {
          errorCode: 'validation_error',
          technicalMessage: 'Bad request - validation failed'
        };
      case 401:
        return {
          errorCode: 'invalid_username_or_password',
          technicalMessage: 'Unauthorized - invalid credentials'
        };
      case 403:
        return {
          errorCode: 'account_disabled',
          technicalMessage: 'Forbidden - access denied'
        };
      case 429:
        return {
          errorCode: 'too_many_attempts',
          technicalMessage: 'Too many requests - rate limited'
        };
      case 500:
      case 502:
      case 503:
      case 504:
        return {
          errorCode: 'server_error',
          technicalMessage: `Server error (${status})`
        };
      default:
        return {
          errorCode: 'server_error',
          technicalMessage: `HTTP ${status}: ${httpError.statusText}`
        };
    }
  }

  /**
   * Map error messages to error codes
   * @param message Error message
   */
  private mapErrorMessage(message: string): string {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('invalid') && (lowerMessage.includes('username') || lowerMessage.includes('password'))) {
      return 'invalid_username_or_password';
    }

    if (lowerMessage.includes('locked') || lowerMessage.includes('lockout')) {
      return 'account_locked';
    }

    if (lowerMessage.includes('disabled') || lowerMessage.includes('suspended')) {
      return 'account_disabled';
    }

    if (lowerMessage.includes('confirm') && lowerMessage.includes('email')) {
      return 'email_not_confirmed';
    }

    if (lowerMessage.includes('too many') || lowerMessage.includes('rate limit')) {
      return 'too_many_attempts';
    }

    if (lowerMessage.includes('network') || lowerMessage.includes('connection')) {
      return 'network_error';
    }

    if (lowerMessage.includes('server') || lowerMessage.includes('internal error')) {
      return 'server_error';
    }

    return 'unknown_error';
  }

  /**
   * Get default error mapping for unknown errors
   */
  private getDefaultErrorMapping() {
    return {
      userFriendlyMessage: 'An unexpected error occurred. Please try again.',
      suggestions: [
        'Try again in a few moments',
        'Refresh the page and try again',
        'Contact support if the problem persists'
      ],
      severity: 'medium' as const,
      category: 'client' as const,
      isRetryable: true
    };
  }

  /**
   * Add contextual suggestions based on error details
   * @param context Error context to enhance
   * @param _error Original error
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private addContextualSuggestions(context: LoginErrorContext, _error: unknown): void {
    // Add time-based suggestions
    const currentHour = new Date().getHours();
    if (context.category === 'network' && (currentHour < 6 || currentHour > 22)) {
      context.suggestions.push('Network maintenance may be in progress during off-peak hours');
    }

    // Add browser-specific suggestions
    if (context.category === 'client') {
      context.suggestions.push('Try using a different browser or clearing your browser cache');
    }

    // Add retry timing suggestions
    if (context.isRetryable) {
      switch (context.severity) {
        case 'low':
          context.suggestions.push('You can retry immediately');
          break;
        case 'medium':
          context.suggestions.push('Wait a moment before retrying');
          break;
        case 'high':
          context.suggestions.push('Wait a few minutes before retrying');
          break;
      }
    }

    // Add security-related suggestions for authentication errors
    if (context.category === 'authentication' && context.errorCode === 'invalid_username_or_password') {
      context.suggestions.push('Ensure you are using the correct login page');
      context.suggestions.push('Check for any browser extensions that might interfere');
    }
  }

  /**
   * Sanitize form data for logging (remove sensitive information)
   * @param formData Original form data
   */
  private sanitizeFormData(formData: Record<string, unknown>): Record<string, unknown> {
    const sanitized = { ...formData };

    // Remove or mask sensitive fields
    const sensitiveFields = ['password', 'confirmPassword', 'token', 'secret'];

    sensitiveFields.forEach(field => {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    });

    return sanitized;
  }

  /**
   * Log error for monitoring and debugging
   * @param context Error context
   */
  private logError(context: LoginErrorContext): void {
    const logLevel = this.getLogLevel(context.severity);
    const logMessage = `Login Error [${context.errorCode}]: ${context.technicalMessage}`;

    const logData = {
      errorCode: context.errorCode,
      userAction: context.userAction,
      timestamp: context.timestamp,
      category: context.category,
      severity: context.severity,
      isRetryable: context.isRetryable,
      technicalMessage: context.technicalMessage
    };

    // In a real application, you would send this to your logging service
    console[logLevel](logMessage, logData);
  }

  /**
   * Get appropriate log level based on error severity
   * @param severity Error severity
   */
  private getLogLevel(severity: string): 'error' | 'warn' | 'info' {
    switch (severity) {
      case 'critical':
      case 'high':
        return 'error';
      case 'medium':
        return 'warn';
      default:
        return 'info';
    }
  }

  /**
   * Get user-friendly error message
   * @param context Error context
   */
  getUserMessage(context: LoginErrorContext): string {
    return context.userFriendlyMessage;
  }

  /**
   * Get error suggestions for user
   * @param context Error context
   */
  getSuggestions(context: LoginErrorContext): string[] {
    return context.suggestions;
  }

  /**
   * Determine if error is retryable
   * @param context Error context
   */
  isRetryable(context: LoginErrorContext): boolean {
    return context.isRetryable;
  }

  /**
   * Get retry delay recommendation in seconds
   * @param context Error context
   */
  getRetryDelay(context: LoginErrorContext): number {
    if (!context.isRetryable) return 0;

    switch (context.severity) {
      case 'low':
        return 0;
      case 'medium':
        return 3;
      case 'high':
        return 10;
      case 'critical':
        return 30;
      default:
        return 5;
    }
  }

  /**
   * Check if error suggests account issues
   * @param context Error context
   */
  suggestsAccountIssue(context: LoginErrorContext): boolean {
    return ['account_locked', 'account_disabled', 'email_not_confirmed'].includes(context.errorCode);
  }

  /**
   * Check if error suggests credential issues
   * @param context Error context
   */
  suggestsCredentialIssue(context: LoginErrorContext): boolean {
    return context.errorCode === 'invalid_username_or_password';
  }

  /**
   * Get recovery actions for the error
   * @param context Error context
   */
  getRecoveryActions(context: LoginErrorContext): {action: string; label: string; priority: number}[] {
    const actions: {action: string; label: string; priority: number}[] = [];

    switch (context.errorCode) {
      case 'invalid_username_or_password':
        actions.push(
          { action: 'forgot_password', label: 'Reset Password', priority: 1 },
          { action: 'retry', label: 'Try Again', priority: 2 }
        );
        break;
      case 'email_not_confirmed':
        actions.push(
          { action: 'resend_confirmation', label: 'Resend Confirmation Email', priority: 1 },
          { action: 'contact_support', label: 'Contact Support', priority: 2 }
        );
        break;
      case 'account_locked':
      case 'account_disabled':
        actions.push(
          { action: 'contact_support', label: 'Contact Support', priority: 1 },
          { action: 'forgot_password', label: 'Reset Password', priority: 2 }
        );
        break;
      default:
        if (context.isRetryable) {
          actions.push({ action: 'retry', label: 'Try Again', priority: 1 });
        }
        actions.push({ action: 'contact_support', label: 'Contact Support', priority: 3 });
        break;
    }

    return actions.sort((a, b) => a.priority - b.priority);
  }
}
