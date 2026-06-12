import { describe, it, expect } from 'vitest';
import { renderWord, GLYPH_ROWS, GLYPH_COLS } from '../dotFont';

describe('renderWord', () => {
  it('sizes the bitmap to glyphs plus spacing columns', () => {
    const bitmap = renderWord('QUBETX');
    expect(bitmap.rows).toBe(GLYPH_ROWS);
    expect(bitmap.cols).toBe(6 * GLYPH_COLS + 5);
  });

  it('renders a known glyph correctly (T: full top row, center stem)', () => {
    const t = renderWord('T');
    // top row fully lit
    for (let c = 0; c < GLYPH_COLS; c++) expect(t.get(c, 0)).toBe(true);
    // stem in the center column only
    for (let r = 1; r < GLYPH_ROWS; r++) {
      expect(t.get(2, r)).toBe(true);
      expect(t.get(0, r)).toBe(false);
      expect(t.get(4, r)).toBe(false);
    }
  });

  it('keeps spacing columns unlit and is safe out of bounds', () => {
    const bitmap = renderWord('HI');
    for (let r = 0; r < GLYPH_ROWS; r++) expect(bitmap.get(GLYPH_COLS, r)).toBe(false);
    expect(bitmap.get(-1, 0)).toBe(false);
    expect(bitmap.get(0, 99)).toBe(false);
  });

  it('treats unknown characters as spaces', () => {
    const bitmap = renderWord('~');
    for (let r = 0; r < GLYPH_ROWS; r++) {
      for (let c = 0; c < GLYPH_COLS; c++) expect(bitmap.get(c, r)).toBe(false);
    }
  });
});
