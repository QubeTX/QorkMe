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

  describe('generateCandidates', () => {
    it('produces a deduplicated batch ordered shortest-first with a timestamp fallback', () => {
      const candidates = ShortCodeGenerator.generateCandidates(12);

      expect(candidates.length).toBeGreaterThanOrEqual(2);
      expect(new Set(candidates).size).toBe(candidates.length);

      // Lengths never shrink across the batch (shortest candidates lead, so
      // the RPC prefers short codes while the namespace has room)
      const generated = candidates.slice(0, -1);
      for (let i = 1; i < generated.length; i++) {
        expect(generated[i].length).toBeGreaterThanOrEqual(generated[i - 1].length);
      }
      expect(generated[0]).toHaveLength(4);

      // Guaranteed-unique last resort
      expect(candidates[candidates.length - 1]).toMatch(/^q[0-9a-z]+$/);
    });

    it('starts at the requested minimum length for retry escalation', () => {
      const candidates = ShortCodeGenerator.generateCandidates(6, 5);
      expect(candidates[0]).toHaveLength(5);
    });

    it('never emits reserved words', () => {
      for (let run = 0; run < 20; run++) {
        const candidates = ShortCodeGenerator.generateCandidates(12);
        for (const code of candidates) {
          expect(code).not.toBe('test');
          expect(code).not.toBe('demo');
        }
      }
    });
  });
});
