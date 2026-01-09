/**
 * Centralized logging utility with Sentry integration.
 *
 * @module lib/logger
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🤖 AI METACODE — Quick Reference for AI Agents
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * **FILE PURPOSE**: Centralized logging with automatic Sentry integration.
 * All console logging should go through this module for consistent behavior.
 *
 * **SECURITY CRITICAL**: Automatically sanitizes sensitive data.
 * - Passwords, tokens, API keys → [REDACTED]
 * - See SENSITIVE_KEYS constant for full list
 *
 * **BEHAVIOR BY ENVIRONMENT**:
 * | Env | Info | Warn | Error |
 * |-----|------|------|-------|
 * | development | console.info | console.warn | console.error |
 * | test | console.info | console.warn | console.error |
 * | production | Sentry message | Sentry warning | Sentry exception |
 *
 * **USAGE**:
 * ```typescript
 * import { logInfo, logWarn, logError } from '@/lib/logger'
 *
 * logInfo('User signed up', { email: user.email })
 * logWarn('Rate limit approached', { remaining: 2 })
 * logError('Payment failed', error, { orderId: '123' })
 * ```
 *
 * **AI ITERATION HINTS**:
 * - Adding sensitive field? Add to SENSITIVE_KEYS Set
 * - Never use console.log/error directly — use logger functions
 * - Context objects are sanitized automatically
 * - Error objects preserved for Sentry stack traces
 *
 * **SENTRY INTEGRATION**:
 * - Requires NEXT_PUBLIC_SENTRY_DSN env var
 * - Without DSN: falls back to console in all environments
 * - Errors captured with full context in Sentry dashboard
 *
 * **POTENTIAL IMPROVEMENTS**:
 * - [ ] Add structured logging format (JSON) for log aggregation
 * - [ ] Add request ID correlation
 * - [ ] Add performance timing helpers
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Integrates with Sentry for production error tracking and monitoring.
 * Works on both server and client side.
 */

import * as Sentry from '@sentry/nextjs'

function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development'
}

function isTest(): boolean {
  return process.env.NODE_ENV === 'test'
}

type LogLevel = 'info' | 'warn' | 'error'

interface LogContext {
  [key: string]: unknown
}

const SENSITIVE_KEYS = new Set([
  'password',
  'token',
  'authorization',
  'cookie',
  'api_key',
  'apikey',
  'secret',
])

function normalizeKey(key: string): string {
  return key.toLowerCase().replace(/[^a-z0-9]/g, '_')
}

function isSensitiveKey(key: string): boolean {
  const normalized = normalizeKey(key)
  return SENSITIVE_KEYS.has(normalized)
}

function sanitizeValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => sanitizeValue(item))
  }

  if (value && typeof value === 'object') {
    if (value instanceof Error || value instanceof Date || value instanceof RegExp) {
      return value
    }

    return Object.entries(value as Record<string, unknown>).reduce<Record<string, unknown>>(
      (acc, [key, entryValue]) => {
        acc[key] = isSensitiveKey(key) ? '[REDACTED]' : sanitizeValue(entryValue)
        return acc
      },
      {},
    )
  }

  return value
}

export function sanitizeLogContext(context?: LogContext): LogContext | undefined {
  if (!context) {
    return context
  }

  return sanitizeValue(context) as LogContext
}

/**
 * Check if Sentry is properly configured and available
 */
function isSentryAvailable(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN)
}

/**
 * Log an informational message
 * In production, sends to Sentry
 */
export function logInfo(message: string, context?: LogContext) {
  const sanitizedContext = sanitizeLogContext(context)
  if (isDevelopment() || isTest()) {
    console.info('[INFO]', message, sanitizedContext || '')
  } else if (isSentryAvailable()) {
    Sentry.captureMessage(message, { level: 'info', extra: sanitizedContext })
  }
}

/**
 * Log a warning
 * In production, sends to Sentry
 */
export function logWarn(message: string, context?: LogContext) {
  const sanitizedContext = sanitizeLogContext(context)
  if (isDevelopment() || isTest()) {
    console.warn('[WARN]', message, sanitizedContext || '')
  } else if (isSentryAvailable()) {
    Sentry.captureMessage(message, { level: 'warning', extra: sanitizedContext })
  }
}

/**
 * Log an error
 * In production, sends to Sentry with full error details
 */
export function logError(message: string, error?: Error | unknown, context?: LogContext) {
  const sanitizedContext = sanitizeLogContext(context)
  const sanitizedError = error instanceof Error ? error : sanitizeValue(error)
  if (isDevelopment() || isTest()) {
    console.error('[ERROR]', message, sanitizedError, sanitizedContext || '')
  } else if (isSentryAvailable()) {
    if (error instanceof Error) {
      Sentry.captureException(error, { extra: { message, ...sanitizedContext } })
    } else {
      Sentry.captureMessage(message, {
        level: 'error',
        extra: { error: sanitizeValue(error), ...sanitizedContext },
      })
    }
  } else {
    console.error('[ERROR]', message, sanitizedError, sanitizedContext || '')
  }
}

/**
 * Generic log function
 */
export function log(level: LogLevel, message: string, context?: LogContext) {
  switch (level) {
    case 'info':
      logInfo(message, context)
      break
    case 'warn':
      logWarn(message, context)
      break
    case 'error':
      logError(message, undefined, context)
      break
  }
}
