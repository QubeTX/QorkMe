import { describe, expect, it, vi } from 'vitest';
import { ShortCodeGenerator } from '@/lib/shortcode/generator';

const READABLE_CHARS = '23456789abcdefghjkmnpqrstuvwxyz';
const CONSONANTS = '23456789bcdfghjkmnpqrstvwxyz';
const VOWELS = 'aeu';

describe('ShortCodeGenerator', () => {
  it('creates pronounceable codes with alternating consonants and vowels', () => {
    const code = ShortCodeGenerator.generateMemorableCode(6);
    expect(code).toHaveLength(6);

    for (let i = 0; i < code.length; i++) {
      const char = code[i];
      if (i % 2 === 0) {
        expect(CONSONANTS.includes(char)).toBe(true);
      } else {
        expect(VOWELS.includes(char)).toBe(true);
      }
    }
  });

  it('validates custom aliases correctly', () => {
    expect(ShortCodeGenerator.validateCustomAlias('pro-link').valid).toBe(true);

    const tooShort = ShortCodeGenerator.validateCustomAlias('ab');
    expect(tooShort.valid).toBe(false);
    expect(tooShort.error).toMatch(/at least 3/);

    const invalidChars = ShortCodeGenerator.validateCustomAlias('bad!');
    expect(invalidChars.valid).toBe(false);
    expect(invalidChars.error).toMatch(/letters, numbers, and hyphens/);
  });

  it('returns unique codes when availability eventually resolves true', async () => {
    const availability = vi
      .fn<[string], Promise<boolean>>()
      .mockResolvedValueOnce(false)
      .mockResolvedValueOnce(false)
      .mockResolvedValueOnce(true);

    const code = await ShortCodeGenerator.generateUniqueCode(availability);

    expect(availability).toHaveBeenCalledTimes(3);
    expect(code.length).toBeGreaterThanOrEqual(4);
    expect([...code].every((char) => READABLE_CHARS.includes(char))).toBe(true);
  });

  it('suggests longer codes for large url volumes', () => {
    expect(ShortCodeGenerator.getOptimalLength(200_000)).toBeGreaterThanOrEqual(4);
    expect(ShortCodeGenerator.getOptimalLength(1_000_000)).toBeGreaterThanOrEqual(5);
  });
});
