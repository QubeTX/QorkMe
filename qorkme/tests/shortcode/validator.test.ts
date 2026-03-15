import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import {
  validateUrl,
  validateShortCode,
  sanitizeInput,
  extractDomain,
} from '@/lib/shortcode/validator';

describe('Validator', () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe('validateUrl', () => {
    it('rejects empty or whitespace URLs', () => {
      expect(validateUrl('').valid).toBe(false);
      expect(validateUrl('   ').valid).toBe(false);
    });

    it('rejects URLs exceeding max length', () => {
      vi.stubEnv('MAX_URL_LENGTH', '20');
      const longUrl = 'https://example.com/very/long/url';
      const result = validateUrl(longUrl);
      expect(result.valid).toBe(false);
      expect(result.error).toMatch(/URL must be less than 20 characters/);
    });

    it('adds https protocol if missing', () => {
      const result = validateUrl('example.com');
      expect(result.valid).toBe(true);
      expect(result.normalizedUrl).toBe('https://example.com');
    });

    it('rejects invalid URL formats', () => {
      const result = validateUrl('https://this is not a url');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Invalid URL format');
    });

    it('rejects non-http/https protocols', () => {
      const result = validateUrl('ftp://example.com');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('URL must use HTTP or HTTPS protocol');
    });

    it('rejects local URLs', () => {
      const blockedHosts = ['localhost', '127.0.0.1', '0.0.0.0', '[::1]'];
      blockedHosts.forEach((host) => {
        expect(validateUrl(`http://${host}`).valid).toBe(false);
      });
      // Need to make sure ::1 handles the URL parser format
      expect(validateUrl('http://[::1]').valid).toBe(false);
    });

    it('rejects private network URLs', () => {
      const privateIps = ['10.0.0.1', '192.168.1.1', '172.16.0.1', '172.31.255.255'];
      privateIps.forEach((ip) => {
        const result = validateUrl(`http://${ip}`);
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Cannot shorten private network URLs');
      });
    });

    it('rejects shortening own domain', () => {
      vi.stubEnv('NEXT_PUBLIC_SHORT_DOMAIN', 'qork.me');
      expect(validateUrl('https://qork.me/abc').valid).toBe(false);
      expect(validateUrl('https://www.qork.me/abc').valid).toBe(false);

      vi.stubEnv('NEXT_PUBLIC_SHORT_DOMAIN', 'custom.link');
      expect(validateUrl('https://custom.link/abc').valid).toBe(false);
    });

    it('accepts valid URLs', () => {
      const result = validateUrl('https://www.google.com/search?q=vitest');
      expect(result.valid).toBe(true);
      expect(result.normalizedUrl).toBe('https://www.google.com/search?q=vitest');
    });
  });

  describe('validateShortCode', () => {
    it('rejects empty or whitespace codes', () => {
      expect(validateShortCode('').valid).toBe(false);
      expect(validateShortCode('   ').valid).toBe(false);
    });

    it('rejects codes below minimum length', () => {
      vi.stubEnv('MIN_ALIAS_LENGTH', '3');
      const result = validateShortCode('ab');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Short code must be at least 3 characters');
    });

    it('rejects codes above maximum length', () => {
      vi.stubEnv('MAX_ALIAS_LENGTH', '10');
      const result = validateShortCode('thisiswaytoolong');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Short code must be less than 10 characters');
    });

    it('rejects invalid characters', () => {
      expect(validateShortCode('abc!').valid).toBe(false);
      expect(validateShortCode('abc_def').valid).toBe(false);
      expect(validateShortCode('abc def').valid).toBe(false);
    });

    it('rejects consecutive hyphens', () => {
      expect(validateShortCode('a--b').valid).toBe(false);
    });

    it('rejects leading and trailing hyphens', () => {
      expect(validateShortCode('-abc').valid).toBe(false);
      expect(validateShortCode('abc-').valid).toBe(false);
    });

    it('rejects reserved words', () => {
      expect(validateShortCode('admin').valid).toBe(false);
      expect(validateShortCode('login').valid).toBe(false);
    });

    it('accepts valid short codes', () => {
      expect(validateShortCode('my-link-123').valid).toBe(true);
      expect(validateShortCode('hello').valid).toBe(true);
    });
  });

  describe('sanitizeInput', () => {
    it('trims whitespace', () => {
      expect(sanitizeInput('  hello world  ')).toBe('hello world');
    });

    it('removes HTML tags', () => {
      expect(sanitizeInput('<script>alert("xss")</script>')).toBe('scriptalert("xss")/script');
      expect(sanitizeInput('<b>bold</b> text')).toBe('bbold/b text');
    });

    it('truncates to 500 characters', () => {
      const longInput = 'a'.repeat(600);
      const sanitized = sanitizeInput(longInput);
      expect(sanitized.length).toBe(500);
      expect(sanitized).toBe('a'.repeat(500));
    });
  });

  describe('extractDomain', () => {
    it('extracts domain from valid URLs', () => {
      expect(extractDomain('https://example.com/path')).toBe('example.com');
      expect(extractDomain('http://sub.example.com')).toBe('sub.example.com');
    });

    it('removes www. prefix', () => {
      expect(extractDomain('https://www.example.com/path')).toBe('example.com');
    });

    it('returns empty string for invalid URLs', () => {
      expect(extractDomain('not a url')).toBe('');
    });
  });
});
