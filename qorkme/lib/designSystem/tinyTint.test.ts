import { describe, it, expect } from 'vitest';
import { tint } from './tinyTint';

const joined = (code: string, lang: Parameters<typeof tint>[1]) =>
  tint(code, lang)
    .map((t) => t.text)
    .join('');

describe('tinyTint', () => {
  it('round-trips every input exactly (no characters lost)', () => {
    const samples: Array<[string, Parameters<typeof tint>[1]]> = [
      ["const label = attachSlotText(el, 'Copy') // controller", 'ts'],
      ['.value { color: var(--color-arrival); width: 28px; }', 'css'],
      ['$ npm install animejs framer-motion --save', 'bash'],
      ['plain prose with no code at all', 'text'],
      ['', 'ts'],
    ];
    for (const [code, lang] of samples) {
      expect(joined(code, lang)).toBe(code);
    }
  });

  it('tints ts keywords, strings, comments, and calls', () => {
    const tokens = tint("import { decode } from '@/lib/motion' // seam", 'ts');
    expect(tokens.find((t) => t.text === 'import')?.kind).toBe('keyword');
    expect(tokens.find((t) => t.text === "'@/lib/motion'")?.kind).toBe('string');
    expect(tokens.find((t) => t.text === '// seam')?.kind).toBe('comment');
    const call = tint('decode(el, 450)', 'ts');
    expect(call.find((t) => t.text === 'decode')?.kind).toBe('fn');
    expect(call.find((t) => t.text === '450')?.kind).toBe('number');
  });

  it('tints css custom properties, selectors, and props', () => {
    const tokens = tint('.pill {\n  color: var(--color-text-dim);\n}', 'css');
    expect(tokens.find((t) => t.text === '--color-text-dim')?.kind).toBe('cssvar');
    expect(tokens.find((t) => t.text === '.pill ')?.kind).toBe('selector');
    expect(tokens.find((t) => t.text === 'color')?.kind).toBe('prop');
  });

  it('tints bash prompts, flags, and comments', () => {
    const tokens = tint('$ npm test --watch # the gate', 'bash');
    expect(tokens.find((t) => t.text === '$')?.kind).toBe('prompt');
    expect(tokens.find((t) => t.text === '--watch')?.kind).toBe('flag');
    expect(tokens.find((t) => t.text === '# the gate')?.kind).toBe('comment');
  });

  it('treats tsx as ts', () => {
    expect(joined('<SlotRoll text={status} />', 'tsx')).toBe('<SlotRoll text={status} />');
  });
});
