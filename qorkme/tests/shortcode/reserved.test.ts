import { describe, expect, it } from 'vitest';
import { isReservedWord, getReservedWords, RESERVED_WORDS } from '@/lib/shortcode/reserved';

describe('Reserved Words Utils', () => {
  describe('isReservedWord', () => {
    it('returns true for exact lowercase reserved words', () => {
      expect(isReservedWord('admin')).toBe(true);
      expect(isReservedWord('api')).toBe(true);
      expect(isReservedWord('help')).toBe(true);
    });

    it('returns true for uppercase or mixed-case reserved words', () => {
      expect(isReservedWord('ADMIN')).toBe(true);
      expect(isReservedWord('Api')).toBe(true);
      expect(isReservedWord('HeLp')).toBe(true);
    });

    it('returns false for unreserved words', () => {
      expect(isReservedWord('my-custom-url')).toBe(false);
      expect(isReservedWord('hello')).toBe(false);
      expect(isReservedWord('not-reserved')).toBe(false);
    });

    it('returns false for partial matches or extensions', () => {
      expect(isReservedWord('admins')).toBe(false);
      expect(isReservedWord('api-v1')).toBe(false);
      expect(isReservedWord('helpme')).toBe(false);
    });
  });

  describe('getReservedWords', () => {
    it('returns an array of all reserved words', () => {
      const words = getReservedWords();

      expect(Array.isArray(words)).toBe(true);
      expect(words.length).toBe(RESERVED_WORDS.size);

      // Check a few known words are in the array
      expect(words).toContain('admin');
      expect(words).toContain('api');
      expect(words).toContain('404');
    });

    it('returns an independent array that does not modify the original set if mutated', () => {
      const words = getReservedWords();
      const originalLength = words.length;

      // Mutating the returned array should not affect the Set
      words.push('new-fake-reserved-word');

      const wordsAgain = getReservedWords();
      expect(wordsAgain.length).toBe(originalLength);
      expect(wordsAgain).not.toContain('new-fake-reserved-word');
    });
  });
});
