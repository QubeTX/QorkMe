import { describe, expect, it } from 'vitest';
import { sanitizeInput } from '@/lib/shortcode/validator';

describe('sanitizeInput', () => {
  it('trims leading and trailing whitespace', () => {
    expect(sanitizeInput('   hello world   ')).toBe('hello world');
    expect(sanitizeInput('\n\t test \r')).toBe('test');
  });

  it('removes HTML tags (< and >)', () => {
    expect(sanitizeInput('<h1>hello</h1>')).toBe('h1hello/h1');
    expect(sanitizeInput('<script>alert("xss")</script>')).toBe('scriptalert("xss")/script');
    expect(sanitizeInput('normal text')).toBe('normal text');
  });

  it('truncates strings longer than 500 characters', () => {
    const longString = 'a'.repeat(600);
    const sanitized = sanitizeInput(longString);
    expect(sanitized).toHaveLength(500);
    expect(sanitized).toBe('a'.repeat(500));
  });

  it('handles empty strings and strings with only whitespace', () => {
    expect(sanitizeInput('')).toBe('');
    expect(sanitizeInput('   ')).toBe('');
    expect(sanitizeInput('\n\t\r')).toBe('');
  });

  it('handles normal input without modifications', () => {
    expect(sanitizeInput('Just a normal description')).toBe('Just a normal description');
    expect(sanitizeInput('This has numbers 123 and symbols !@#$%^&*()')).toBe(
      'This has numbers 123 and symbols !@#$%^&*()'
    );
  });

  it('applies all sanitizations correctly together', () => {
    const complexInput = '  <script>console.log("xss")</script> ' + 'a'.repeat(500) + '  ';
    const sanitized = sanitizeInput(complexInput);

    // Total length of original part before 'a's is 33: "scriptconsole.log("xss")/script "
    // After trimming and removing tags:
    const expectedPrefix = 'scriptconsole.log("xss")/script ';
    expect(sanitized.startsWith(expectedPrefix)).toBe(true);
    expect(sanitized).toHaveLength(500);
  });
});
