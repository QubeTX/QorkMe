import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { validateUrl, validateShortCode, sanitizeInput, extractDomain } from '@/lib/shortcode/validator';

describe('Validator', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('validateUrl', () => {
    it('returns error for empty url', () => {
      expect(validateUrl('')).toEqual({ valid: false, error: 'URL is required' });
      expect(validateUrl('   ')).toEqual({ valid: false, error: 'URL is required' });
    });

    it('returns error when url exceeds max length', () => {
      process.env.MAX_URL_LENGTH = '10';
      expect(validateUrl('https://example.com')).toEqual({ valid: false, error: 'URL must be less than 10 characters' });
    });

    it('adds https:// if protocol is missing', () => {
      const result = validateUrl('example.com');
      expect(result.valid).toBe(true);
      expect(result.normalizedUrl).toBe('https://example.com');
    });

    it('returns error for invalid URL format', () => {
      // Something that URL constructor cannot parse even with https added
      // Or an invalid protocol
      // validateUrl currently adds https:// if it doesn't match ^https?://i
      // so ftp://example.com becomes https://ftp://example.com, which is valid to URL constructor and is https protocol.
      // let's pass an invalid protocol that matches the first test, e.g. http:something
      expect(validateUrl('not a url')).toEqual({ valid: false, error: 'Invalid URL format' });
      expect(validateUrl('http://')).toEqual({ valid: false, error: 'Invalid URL format' });
    });

    it('blocks localhost and internal IPs', () => {
      const blocked = ['localhost', '127.0.0.1', '0.0.0.0'];
      blocked.forEach((host) => {
        expect(validateUrl(`http://${host}`)).toEqual({ valid: false, error: 'Cannot shorten local URLs' });
      });
      // Test IPv6 specifically, the hostname returned by URL includes the brackets
      expect(validateUrl('http://[::1]')).toEqual({ valid: false, error: 'Cannot shorten local URLs' });
    });

    it('blocks private IP ranges', () => {
      const privateIps = ['10.0.0.1', '192.168.1.1', '172.16.0.1', '172.31.255.255'];
      privateIps.forEach((ip) => {
        expect(validateUrl(`http://${ip}`)).toEqual({ valid: false, error: 'Cannot shorten private network URLs' });
      });
    });

    it('allows public IPs', () => {
      expect(validateUrl('http://8.8.8.8').valid).toBe(true);
      expect(validateUrl('http://172.32.0.1').valid).toBe(true); // Outside private range
    });

    it('blocks own domain', () => {
      process.env.NEXT_PUBLIC_SHORT_DOMAIN = 'qork.me';
      expect(validateUrl('https://qork.me/abc')).toEqual({ valid: false, error: 'Cannot shorten URLs from this domain' });
      expect(validateUrl('https://www.qork.me')).toEqual({ valid: false, error: 'Cannot shorten URLs from this domain' });
    });

    it('returns valid and normalized url for valid inputs', () => {
      const result = validateUrl('https://www.google.com/search?q=test');
      expect(result.valid).toBe(true);
      expect(result.normalizedUrl).toBe('https://www.google.com/search?q=test');
    });
  });

  describe('validateShortCode', () => {
    it('returns error for empty short code', () => {
      expect(validateShortCode('')).toEqual({ valid: false, error: 'Short code is required' });
      expect(validateShortCode('   ')).toEqual({ valid: false, error: 'Short code is required' });
    });

    it('returns error for short codes that are too short', () => {
      process.env.MIN_ALIAS_LENGTH = '3';
      expect(validateShortCode('ab')).toEqual({ valid: false, error: 'Short code must be at least 3 characters' });
    });

    it('returns error for short codes that are too long', () => {
      process.env.MAX_ALIAS_LENGTH = '5';
      expect(validateShortCode('abcdef')).toEqual({ valid: false, error: 'Short code must be less than 5 characters' });
    });

    it('returns error for invalid characters', () => {
      expect(validateShortCode('abc_def')).toEqual({ valid: false, error: 'Short code can only contain letters, numbers, and hyphens' });
      expect(validateShortCode('abc def')).toEqual({ valid: false, error: 'Short code can only contain letters, numbers, and hyphens' });
      expect(validateShortCode('abc!def')).toEqual({ valid: false, error: 'Short code can only contain letters, numbers, and hyphens' });
    });

    it('returns error for consecutive hyphens', () => {
      expect(validateShortCode('ab--cd')).toEqual({ valid: false, error: 'Short code cannot contain consecutive hyphens' });
    });

    it('returns error for leading or trailing hyphens', () => {
      expect(validateShortCode('-abc')).toEqual({ valid: false, error: 'Short code cannot start or end with a hyphen' });
      expect(validateShortCode('abc-')).toEqual({ valid: false, error: 'Short code cannot start or end with a hyphen' });
    });

    it('returns error for reserved words', () => {
      expect(validateShortCode('api')).toEqual({ valid: false, error: 'This short code is reserved and cannot be used' });
      expect(validateShortCode('admin')).toEqual({ valid: false, error: 'This short code is reserved and cannot be used' });
      expect(validateShortCode('API')).toEqual({ valid: false, error: 'This short code is reserved and cannot be used' }); // case insensitive
    });

    it('returns valid for acceptable short codes', () => {
      expect(validateShortCode('my-link-123')).toEqual({ valid: true });
      expect(validateShortCode('abc')).toEqual({ valid: true });
    });
  });

  describe('sanitizeInput', () => {
    it('trims whitespace', () => {
      expect(sanitizeInput('  hello world  ')).toBe('hello world');
    });

    it('removes < and > characters', () => {
      expect(sanitizeInput('<script>alert("xss")</script>')).toBe('scriptalert("xss")/script');
      expect(sanitizeInput('<div>test</div>')).toBe('divtest/div');
    });

    it('limits length to 500 characters', () => {
      const longString = 'a'.repeat(600);
      const sanitized = sanitizeInput(longString);
      expect(sanitized.length).toBe(500);
      expect(sanitized).toBe('a'.repeat(500));
    });
  });

  describe('extractDomain', () => {
    it('extracts hostname from valid URL', () => {
      expect(extractDomain('https://example.com/path?query=1')).toBe('example.com');
    });

    it('removes www. from hostname', () => {
      expect(extractDomain('https://www.example.com/path')).toBe('example.com');
      expect(extractDomain('http://www.google.co.uk')).toBe('google.co.uk');
    });

    it('returns empty string for invalid URL', () => {
      expect(extractDomain('not-a-url')).toBe('');
      expect(extractDomain('')).toBe('');
    });
  });
});
