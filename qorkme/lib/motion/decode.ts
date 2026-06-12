'use client';

import { createTimer } from './anime';

const GLYPHS = '!<>-_\\/[]{}—=+*^?#';

/**
 * Scramble-decode a text element: cycles random glyphs, resolving left →
 * right over `duration` ms (terminal flavor; used by the load-sequence
 * eyebrow and section label pills). textContent only — never markup.
 */
export function decode(el: HTMLElement, duration = 450): void {
  const original = el.textContent ?? '';
  if (!original) return;
  const len = original.length;
  createTimer({
    duration,
    onUpdate: (self: { progress: number }) => {
      const resolved = Math.floor(self.progress * len);
      let out = original.slice(0, resolved);
      for (let i = resolved; i < len; i++) {
        const ch = original[i];
        out += ch === ' ' ? ' ' : GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      el.textContent = out;
    },
    onComplete: () => {
      el.textContent = original;
    },
  });
}
