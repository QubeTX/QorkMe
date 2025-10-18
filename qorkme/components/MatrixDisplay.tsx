'use client';

import { useEffect, useMemo, useState } from 'react';
import { Matrix, digits, letters, type Frame } from '@/components/ui/matrix';

/**
 * MatrixDisplay renders a unified dot-matrix display showing:
 * - "Qork.Me" title with glittering/shimmer animation
 * - Current time (HH:MM:SS) below the title
 * - Feathered edges for smooth blending
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

// Generate shimmer/glitter animation frames for title
function createTitleFrames(frameCount: number): number[][] {
  // Each frame contains brightness values for each character in "Qork.Me"
  const frames: number[][] = [];
  const charCount = 7; // Q o r k . M e

  for (let f = 0; f < frameCount; f++) {
    const brightness: number[] = [];

    for (let i = 0; i < charCount; i++) {
      // Create shimmer effect: each character pulses slightly out of phase
      const phase = (i / charCount) * Math.PI * 2;
      const progress = (f / frameCount) * Math.PI * 2;

      // Subtle shimmer between 0.7 and 1.0
      const shimmer = Math.sin(progress + phase) * 0.15 + 0.85;

      // Occasional sparkle
      const sparkleChance = Math.random();
      const sparkle = sparkleChance > 0.95 ? 0.2 : 0;

      brightness.push(clamp(shimmer + sparkle, 0.7, 1.0));
    }

    frames.push(brightness);
  }

  return frames;
}

// Create unified frame with title and time
function createUnifiedFrame(
  time: Date,
  titleBrightness: number[],
  rows: number,
  cols: number
): Frame {
  const frame = buildEmptyFrame(rows, cols);

  // Calculate centered positions
  const titleText = 'Qork.Me';
  const titleWidth = titleText.length * 6 - 1; // 6 per char (5 + 1 spacing), minus last spacing
  const titleStartCol = Math.floor((cols - titleWidth) / 2);
  const titleStartRow = 1;

  // Render title with shimmer
  renderTextToFrame(frame, titleText, titleStartRow, titleStartCol, letters, titleBrightness);

  // Format time
  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');
  const timeText = `${hours}:${minutes}:${seconds}`;

  // Calculate time position (below title with spacing)
  const timeWidth = 6 * 6 + 2 * 6 - 1; // 6 digits + 2 colons
  const timeStartCol = Math.floor((cols - timeWidth) / 2);
  const timeStartRow = titleStartRow + 7 + 2; // Title height + gap

  // Create time character map combining digits and colon
  const timeCharMap = { ...digits, ':': letters[':'] };

  // Convert digit characters to patterns
  const timeCharMapConverted: Record<string, Frame> = {};
  for (const [key, value] of Object.entries(digits)) {
    timeCharMapConverted[key] = value;
  }
  timeCharMapConverted[':'] = letters[':'];

  // Render time
  renderTextToFrame(frame, timeText, timeStartRow, timeStartCol, timeCharMapConverted);

  return frame;
}

export function MatrixDisplay() {
  const [time, setTime] = useState(new Date());
  const [frameIndex, setFrameIndex] = useState(0);

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Animate shimmer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % 24);
    }, 100); // 10 FPS shimmer animation
    return () => clearInterval(interval);
  }, []);

  // Generate title shimmer frames
  const titleShimmerFrames = useMemo(() => createTitleFrames(24), []);

  // Matrix dimensions
  const rows = 17; // Title (7) + gap (2) + time (7) + padding (1 top/bottom)
  const cols = 60; // Wide enough for "Qork.Me" and "HH:MM:SS"

  // Create current frame
  const currentFrame = useMemo(() => {
    const titleBrightness = titleShimmerFrames[frameIndex];
    return createUnifiedFrame(time, titleBrightness, rows, cols);
  }, [time, frameIndex, titleShimmerFrames, rows, cols]);

  return (
    <div className="relative mb-8 flex justify-center">
      {/* Feathered edge effect using CSS mask */}
      <div
        className="relative"
        style={{
          WebkitMaskImage:
            'radial-gradient(ellipse 100% 100% at center, black 40%, transparent 100%)',
          maskImage: 'radial-gradient(ellipse 100% 100% at center, black 40%, transparent 100%)',
        }}
      >
        <Matrix
          rows={rows}
          cols={cols}
          pattern={currentFrame}
          size={8}
          gap={2}
          palette={{
            on: 'rgba(196, 114, 79, 1)', // Bright terracotta
            off: 'rgba(196, 114, 79, 0.08)', // Very subtle off state
          }}
          brightness={1}
          ariaLabel="Qork.Me - Animated title and current time display"
        />
      </div>
    </div>
  );
}
