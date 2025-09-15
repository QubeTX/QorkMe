/**
 * URL and Short Code Validation
 */

import { isReservedWord } from './reserved';

/**
 * Validate a URL
 */
export function validateUrl(url: string): {
  valid: boolean;
  normalizedUrl?: string;
  error?: string;
} {
  if (!url || url.trim().length === 0) {
    return { valid: false, error: 'URL is required' };
  }

  // Remove whitespace
  url = url.trim();

  // Check maximum length
  const maxLength = parseInt(process.env.MAX_URL_LENGTH || '2048');
  if (url.length > maxLength) {
    return { valid: false, error: `URL must be less than ${maxLength} characters` };
  }

  // Add protocol if missing
  let normalizedUrl = url;
  if (!url.match(/^https?:\/\//i)) {
    normalizedUrl = `https://${url}`;
  }

  // Validate URL format
  try {
    const urlObj = new URL(normalizedUrl);

    // Check for valid protocol
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return { valid: false, error: 'URL must use HTTP or HTTPS protocol' };
    }

    // Check for localhost/internal IPs (optional security)
    const hostname = urlObj.hostname.toLowerCase();
    const blockedHosts = ['localhost', '127.0.0.1', '0.0.0.0', '::1'];
    if (blockedHosts.includes(hostname)) {
      return { valid: false, error: 'Cannot shorten local URLs' };
    }

    // Check for private IP ranges (optional)
    const privateIpPatterns = [/^10\./, /^192\.168\./, /^172\.(1[6-9]|2[0-9]|3[01])\./];
    if (privateIpPatterns.some((pattern) => pattern.test(hostname))) {
      return { valid: false, error: 'Cannot shorten private network URLs' };
    }

    // Don't allow shortening our own domain
    const ourDomain = process.env.NEXT_PUBLIC_SHORT_DOMAIN || 'qork.me';
    if (hostname === ourDomain || hostname === `www.${ourDomain}`) {
      return { valid: false, error: 'Cannot shorten URLs from this domain' };
    }

    return { valid: true, normalizedUrl };
  } catch {
    return { valid: false, error: 'Invalid URL format' };
  }
}

/**
 * Validate a custom short code/alias
 */
export function validateShortCode(code: string): {
  valid: boolean;
  error?: string;
} {
  if (!code || code.trim().length === 0) {
    return { valid: false, error: 'Short code is required' };
  }

  code = code.trim();

  // Check length
  const minLength = parseInt(process.env.MIN_ALIAS_LENGTH || '3');
  const maxLength = parseInt(process.env.MAX_ALIAS_LENGTH || '50');

  if (code.length < minLength) {
    return { valid: false, error: `Short code must be at least ${minLength} characters` };
  }
  if (code.length > maxLength) {
    return { valid: false, error: `Short code must be less than ${maxLength} characters` };
  }

  // Check characters (alphanumeric and hyphens only)
  const validPattern = /^[a-zA-Z0-9-]+$/;
  if (!validPattern.test(code)) {
    return {
      valid: false,
      error: 'Short code can only contain letters, numbers, and hyphens',
    };
  }

  // Check for consecutive hyphens
  if (code.includes('--')) {
    return {
      valid: false,
      error: 'Short code cannot contain consecutive hyphens',
    };
  }

  // Check for leading/trailing hyphens
  if (code.startsWith('-') || code.endsWith('-')) {
    return {
      valid: false,
      error: 'Short code cannot start or end with a hyphen',
    };
  }

  // Check reserved words
  if (isReservedWord(code)) {
    return {
      valid: false,
      error: 'This short code is reserved and cannot be used',
    };
  }

  return { valid: true };
}

/**
 * Sanitize user input for database storage
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 500); // Limit length for metadata fields
}

/**
 * Extract metadata from URL (for title/description fetching)
 */
export function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}
