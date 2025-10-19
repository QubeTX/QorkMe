'use client';

import { useEffect, useMemo, useState } from 'react';
import { Matrix, letters, type Frame } from '@/components/ui/matrix';

/**
 * SecureAccessMatrix renders two stacked dot-matrix words:
 * - "SECURE" on first line
 * - "ACCESS" on second line
 * - Both same size with shimmer animation
 * - Single-line rendering (not bold)
 */

const buildEmptyFrame = (rows: number, cols: number): Frame =>
  Array.from({ length: rows }, () => Array(cols).fill(0));

const clamp = (value: number, min = 0, max = 1) => Math.min(Math.max(value, min), max);

// Render text string into frame at specified position
function renderTextToFrame(
  frame: Frame,
  text: string,
  startRow: number,
  startCol: number,
  charMap: Record<string, Frame>,
  brightnessMap?: number[]
): void {
  let currentCol = startCol;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const pattern = charMap[char];

    if (!pattern) continue;

    const brightness = brightnessMap ? brightnessMap[i] : 1;

    // Render character pattern
    for (let r = 0; r < pattern.length; r++) {
      for (let c = 0; c < pattern[r].length; c++) {
        const targetRow = startRow + r;
        const targetCol = currentCol + c;

        if (
          targetRow >= 0 &&
          targetRow < frame.length &&
          targetCol >= 0 &&
          targetCol < frame[0].length
        ) {
          frame[targetRow][targetCol] = pattern[r][c] * brightness;
        }
      }
    }

    // Move to next character position (5 cols + 1 spacing)
    currentCol += 6;
  }
}

// Generate shimmer/glitter animation frames
function createShimmerFrames(frameCount: number, charCount: number): number[][] {
  const frames: number[][] = [];

  for (let f = 0; f < frameCount; f++) {
    const brightness: number[] = [];

    for (let i = 0; i < charCount; i++) {
      // Create shimmer effect: each character pulses slightly out of phase
      const phase = (i / charCount) * Math.PI * 2;
      const progress = (f / frameCount) * Math.PI * 2;

      // Subtle shimmer between 0.7 and 1.0
      const shimmer = Math.sin(progress + phase) * 0.15 + 0.85;

      brightness.push(clamp(shimmer, 0.7, 1.0));
    }

    frames.push(brightness);
  }

  return frames;
}

// Create combined frame with both words
function createSecureAccessFrame(
  secureBrightness: number[],
  accessBrightness: number[],
  rows: number,
  cols: number
): Frame {
  const frame = buildEmptyFrame(rows, cols);

  // Calculate centered positions for both words
  const secureText = 'SECURE';
  const accessText = 'ACCESS';

  const secureWidth = secureText.length * 6 - 1; // 6 per char (5 + 1 spacing), minus last spacing
  const accessWidth = accessText.length * 6 - 1;

  const secureStartCol = Math.floor((cols - secureWidth) / 2);
  const accessStartCol = Math.floor((cols - accessWidth) / 2);

  const secureStartRow = 1;
  const accessStartRow = 10; // Leave space between words (7 rows for text + 2 gap)

  // Render SECURE
  renderTextToFrame(frame, secureText, secureStartRow, secureStartCol, letters, secureBrightness);

  // Render ACCESS
  renderTextToFrame(frame, accessText, accessStartRow, accessStartCol, letters, accessBrightness);

  return frame;
}

export function SecureAccessMatrix() {
  const [frameIndex, setFrameIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Only render on client to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Animate shimmer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % 24);
    }, 100); // 10 FPS shimmer animation
    return () => clearInterval(interval);
  }, []);

  // Generate shimmer frames for both words
  const secureShimmerFrames = useMemo(() => createShimmerFrames(24, 6), []); // "SECURE" = 6 chars
  const accessShimmerFrames = useMemo(() => createShimmerFrames(24, 6), []); // "ACCESS" = 6 chars

  // Matrix dimensions (responsive)
  const matrixRows = 18; // SECURE (7) + gap (3) + ACCESS (7) + padding (1)
  const matrixCols = 50; // Wide enough for "SECURE" (desktop)
  const matrixColsMobile = 38; // Compact for mobile

  // Create combined frame with shimmer
  const combinedFrame = useMemo(() => {
    const secureBrightness = secureShimmerFrames[frameIndex];
    const accessBrightness = accessShimmerFrames[frameIndex];
    return createSecureAccessFrame(secureBrightness, accessBrightness, matrixRows, matrixCols);
  }, [frameIndex, secureShimmerFrames, accessShimmerFrames, matrixRows, matrixCols]);

  const palette = {
    on: 'rgba(196, 114, 79, 1)', // Bright terracotta
    off: 'rgba(196, 114, 79, 0.08)', // Very subtle off state
  };

  // Return placeholder during SSR to prevent hydration mismatch
  if (!mounted) {
    return (
      <div
        id="secure-access-matrix-container"
        className="secure-access-matrix-container relative mb-8 flex items-center justify-center"
      >
        <div
          id="matrix-placeholder"
          className="matrix-placeholder hidden md:block"
          style={{
            width: `${matrixCols * 6 + (matrixCols - 1) * 2}px`,
            height: `${matrixRows * 6 + (matrixRows - 1) * 2}px`,
          }}
        />
        <div
          id="matrix-placeholder-mobile"
          className="matrix-placeholder-mobile md:hidden"
          style={{
            width: `${matrixColsMobile * 4.5 + (matrixColsMobile - 1) * 2}px`,
            height: `${matrixRows * 4.5 + (matrixRows - 1) * 2}px`,
          }}
        />
      </div>
    );
  }

  return (
    <div
      id="secure-access-matrix-container"
      className="secure-access-matrix-container relative mb-8 flex items-center justify-center"
    >
      {/* Matrix with feathered edges - Desktop */}
      <div
        id="matrix-wrapper-desktop"
        className="matrix-wrapper-desktop relative hidden md:block"
        style={{
          WebkitMaskImage:
            'radial-gradient(ellipse 100% 100% at center, black 30%, rgba(0,0,0,0.8) 50%, rgba(0,0,0,0.4) 70%, transparent 100%)',
          maskImage:
            'radial-gradient(ellipse 100% 100% at center, black 30%, rgba(0,0,0,0.8) 50%, rgba(0,0,0,0.4) 70%, transparent 100%)',
        }}
      >
        <Matrix
          rows={matrixRows}
          cols={matrixCols}
          pattern={combinedFrame}
          size={6}
          gap={2}
          palette={palette}
          brightness={1}
          ariaLabel="Secure Access animated title"
          cascadeDelay={8}
          cascadeStartDelay={200}
        />
      </div>

      {/* Matrix with feathered edges - Mobile */}
      <div
        id="matrix-wrapper-mobile"
        className="matrix-wrapper-mobile relative md:hidden"
        style={{
          WebkitMaskImage:
            'radial-gradient(ellipse 100% 100% at center, black 30%, rgba(0,0,0,0.8) 50%, rgba(0,0,0,0.4) 70%, transparent 100%)',
          maskImage:
            'radial-gradient(ellipse 100% 100% at center, black 30%, rgba(0,0,0,0.8) 50%, rgba(0,0,0,0.4) 70%, transparent 100%)',
        }}
      >
        <Matrix
          rows={matrixRows}
          cols={matrixColsMobile}
          pattern={combinedFrame}
          size={4.5}
          gap={2}
          palette={palette}
          brightness={1}
          ariaLabel="Secure Access animated title"
          cascadeDelay={8}
          cascadeStartDelay={200}
        />
      </div>
    </div>
  );
}
