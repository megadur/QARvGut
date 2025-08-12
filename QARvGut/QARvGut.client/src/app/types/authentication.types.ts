// ---------------------------------------
// Story 1.2 Task 2: Authentication Error Types
// Centralized typing for consistent error handling
// ---------------------------------------

export interface AuthenticationError {
  code: string;
  message: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  category: 'network' | 'authentication' | 'authorization' | 'validation' | 'server' | 'client';
  isRetryable: boolean;
  retryAfterSeconds?: number;
  suggestions: string[];
  field?: string;
}

export interface AuthenticationErrorContext {
  error: AuthenticationError;
  originalError: unknown;
  userAction: string;
  timestamp: number;
  formData?: Record<string, unknown>;
  recoveryActions: RecoveryAction[];
}

export interface RecoveryAction {
  action: string;
  label: string;
  priority: number;
  disabled?: boolean;
}

export interface ValidationResult<T = Record<string, unknown>> {
  isValid: boolean;
  errors: AuthenticationError[];
  fieldErrors: Record<string, AuthenticationError[]>;
  warnings: AuthenticationError[];
  data?: T;
}

export interface SecurityValidationResult extends ValidationResult {
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  requiresCaptcha: boolean;
  blockedReasons: string[];
  allowedAttempts: number;
  remainingAttempts: number;
}

export interface LoginAttemptContext {
  identifier: string;
  timestamp: number;
  success: boolean;
  ip?: string;
  userAgent?: string;
  errorCode?: string;
  riskLevel?: string;
}

export interface PasswordResetContext {
  email: string;
  token?: string;
  timestamp: number;
  expiresAt?: number;
  isValid?: boolean;
  attempts: number;
}
