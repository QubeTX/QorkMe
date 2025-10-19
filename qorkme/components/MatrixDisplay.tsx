'use client';

import { useEffect, useMemo, useState } from 'react';
import { Matrix, digits, letters, type Frame } from '@/components/ui/matrix';

/**
 * MatrixDisplay renders two separate dot-matrix displays:
 * - "Qork.Me" title with glittering/shimmer animation (larger, 8px cells)
 * - Current time in 24-hour format (HH:MM:SS) below the title (smaller, 6px cells)
 * - Increased vertical spacing for visual hierarchy
 * - Feathered edges on both displays for smooth blending
 */

const buildEmptyFrame = (rows: number, cols: number): Frame =>
  Array.from({ length: rows }, () => Array(cols).fill(0));

const clamp = (value: number, min = 0, max = 1) => Math.min(Math.max(value, min), max);

// Make letter pattern bold by expanding each dot with an outline
function makeBoldPattern(pattern: Frame): Frame {
  const rows = pattern.length;
  const cols = pattern[0]?.length || 0;
  const boldPattern: Frame = Array.from({ length: rows }, () => Array(cols).fill(0));

  // Copy original pattern and add outline/stroke effect
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (pattern[r][c] > 0) {
        // Set the original dot
        boldPattern[r][c] = 1;

        // Add adjacent dots for thickness (right and bottom for consistency)
        if (c + 1 < cols) boldPattern[r][c + 1] = 1; // Right
        if (r + 1 < rows) boldPattern[r + 1][c] = 1; // Bottom
        if (r + 1 < rows && c + 1 < cols) boldPattern[r + 1][c + 1] = 1; // Diagonal
      }
    }
  }

  return boldPattern;
}

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

      brightness.push(clamp(shimmer, 0.7, 1.0));
    }

    frames.push(brightness);
  }

  return frames;
}

// Create title frame with shimmer
function createTitleFrame(titleBrightness: number[], rows: number, cols: number): Frame {
  const frame = buildEmptyFrame(rows, cols);

  // Calculate centered position for title
  const titleText = 'Qork.Me';
  const titleWidth = titleText.length * 6 - 1; // 6 per char (5 + 1 spacing), minus last spacing
  const titleStartCol = Math.floor((cols - titleWidth) / 2);
  const titleStartRow = 1;

  // Create bold letter patterns for title
  const boldLetters: Record<string, Frame> = {};
  for (const [char, pattern] of Object.entries(letters)) {
    boldLetters[char] = makeBoldPattern(pattern);
  }

  // Render title with bold letters and shimmer
  renderTextToFrame(frame, titleText, titleStartRow, titleStartCol, boldLetters, titleBrightness);

  return frame;
}

// Create time frame
function createTimeFrame(time: Date, rows: number, cols: number): Frame {
  const frame = buildEmptyFrame(rows, cols);

  // Format time (12-hour format with AM/PM)
  const hours24 = time.getHours();
  const hours12 = hours24 % 12 || 12; // Convert 0-23 to 1-12
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');
  const period = hours24 >= 12 ? 'PM' : 'AM';
  const timeText = `${hours12.toString().padStart(2, '0')}:${minutes}:${seconds} ${period}`;

  // Calculate centered position for time
  const timeWidth = 8 * 6 + 2 * 6 + 6 - 1; // 8 digits + 2 colons + 1 space + 2 letters (AM/PM) - 1
  const timeStartCol = Math.floor((cols - timeWidth) / 2);
  const timeStartRow = 1;

  // Create time character map combining digits, colon, space, and AM/PM letters
  const timeCharMapConverted: Record<string, Frame> = {};
  for (const [key, value] of Object.entries(digits)) {
    timeCharMapConverted[key] = value;
  }
  timeCharMapConverted[':'] = letters[':'];
  timeCharMapConverted[' '] = letters[' '];
  timeCharMapConverted['A'] = letters['A'];
  timeCharMapConverted['P'] = letters['P'];
  timeCharMapConverted['M'] = letters['M'];

  // Render time
  renderTextToFrame(frame, timeText, timeStartRow, timeStartCol, timeCharMapConverted);

  return frame;
}

export function MatrixDisplay() {
  const [time, setTime] = useState(new Date());
  const [frameIndex, setFrameIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Only render on client to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

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

  // Matrix dimensions for title
  const titleRows = 9; // Title (7) + padding (1 top/bottom)
  const titleCols = 50; // Wide enough for "Qork.Me"

  // Matrix dimensions for time
  const timeRows = 9; // Time (7) + padding (1 top/bottom)
  const timeCols = 66; // Wide enough for "HH:MM:SS AM/PM"

  // Create title frame with shimmer
  const titleFrame = useMemo(() => {
    const titleBrightness = titleShimmerFrames[frameIndex];
    return createTitleFrame(titleBrightness, titleRows, titleCols);
  }, [frameIndex, titleShimmerFrames, titleRows, titleCols]);

  // Create time frame
  const timeFrame = useMemo(() => {
    return createTimeFrame(time, timeRows, timeCols);
  }, [time, timeRows, timeCols]);

  const palette = {
    on: 'rgba(196, 114, 79, 1)', // Bright terracotta
    off: 'rgba(196, 114, 79, 0.08)', // Very subtle off state
  };

  // Return placeholder during SSR to prevent hydration mismatch
  if (!mounted) {
    return (
      <div id="matrix-display-container" className="matrix-display-container relative mb-8 flex flex-col items-center gap-6">
        <div id="title-matrix-placeholder" className="title-matrix-placeholder" style={{ width: `${titleCols * 8 + (titleCols - 1) * 2}px`, height: `${titleRows * 8 + (titleRows - 1) * 2}px` }} />
        <div id="time-matrix-placeholder" className="time-matrix-placeholder" style={{ width: `${timeCols * 6 + (timeCols - 1) * 2}px`, height: `${timeRows * 6 + (timeRows - 1) * 2}px` }} />
      </div>
    );
  }

  return (
    <div id="matrix-display-container" className="matrix-display-container relative mb-8 flex flex-col items-center gap-6">
      {/* Title Matrix with feathered edges */}
      <div
        id="title-matrix-wrapper"
        className="title-matrix-wrapper relative"
        style={{
          WebkitMaskImage:
            'radial-gradient(ellipse 100% 100% at center, black 40%, transparent 100%)',
          maskImage: 'radial-gradient(ellipse 100% 100% at center, black 40%, transparent 100%)',
        }}
      >
        <Matrix
          rows={titleRows}
          cols={titleCols}
          pattern={titleFrame}
          size={8}
          gap={2}
          palette={palette}
          brightness={1}
          ariaLabel="Qork.Me animated title"
        />
      </div>

      {/* Time Matrix - smaller size for secondary importance */}
      <div
        id="time-matrix-wrapper"
        className="time-matrix-wrapper relative"
        style={{
          WebkitMaskImage:
            'radial-gradient(ellipse 100% 100% at center, black 40%, transparent 100%)',
          maskImage: 'radial-gradient(ellipse 100% 100% at center, black 40%, transparent 100%)',
        }}
      >
        <Matrix
          rows={timeRows}
          cols={timeCols}
          pattern={timeFrame}
          size={6}
          gap={2}
          palette={palette}
          brightness={1}
          ariaLabel="Current time in 12-hour format with AM/PM"
        />
      </div>
    </div>
  );
}
