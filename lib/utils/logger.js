/**
 * Environment-aware logger utility for Free-ATS-Scorer.
 * Logs detailed debug logs in development, and clean, sanitized logs in production.
 */

const isProd = process.env.NODE_ENV === 'production';

/**
 * Mask sensitive headers or token strings
 * @param {Object} headers - HTTP request headers
 * @returns {Object} - Sanitized headers object
 */
export function sanitizeHeaders(headers = {}) {
  const sanitized = { ...headers };
  const sensitiveKeys = ['authorization', 'cookie', 'x-api-key', 'set-cookie'];

  for (const key of Object.keys(sanitized)) {
    if (sensitiveKeys.includes(key.toLowerCase())) {
      sanitized[key] = '[REDACTED]';
    }
  }

  return sanitized;
}

export const logger = {
  info: (message, ...args) => {
    console.log(`[INFO] ${message}`, ...args);
  },

  warn: (message, ...args) => {
    console.warn(`[WARN] ${message}`, ...args);
  },

  error: (message, error = null) => {
    if (isProd) {
      // In production, log clean message without exposing full sensitive stack details externally
      console.error(`[ERROR] ${message}${error?.message ? `: ${error.message}` : ''}`);
    } else {
      console.error(`[ERROR] ${message}`, error || '');
    }
  },

  debug: (message, ...args) => {
    if (!isProd) {
      console.log(`[DEBUG] ${message}`, ...args);
    }
  }
};
