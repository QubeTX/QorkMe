'use client';

import { useEffect, useMemo, useState } from 'react';
import { Matrix, digits, type Frame } from '@/components/ui/matrix';

/**
 * MatrixBackground renders a single large viewport-filling Matrix display
 * with animated wave effects and a centered digital clock.
 *
 * The entire background is one unified matrix grid that responds to
 * viewport size and includes a real-time clock display at the center.
 */

// Helper to build empty frame
const buildEmptyFrame = (rows: number, cols: number): Frame =>
  Array.from({ length: rows }, () => Array(cols).fill(0));

// Helper to clamp values
const clamp = (value: number, min = 0, max = 1) => Math.min(Math.max(value, min), max);

// Create unified frames with wave pattern and clock overlay
function createUnifiedFrames(rows: number, cols: number, time: Date, frameCount = 24): Frame[] {
  const frames: Frame[] = [];
  const centerRow = Math.floor(rows / 2);
  const centerCol = Math.floor(cols / 2);

  // Format time as HH:MM:SS
  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');
  const timeString = `${hours}${minutes}${seconds}`;

  // Each digit is 7 rows × 5 cols, total width for 6 digits = 30 cols (5 × 6)
  // Add spacing between digit pairs: 2 cols each = +4 cols total = 34 cols
  const clockWidth = 34;
  const clockHeight = 7;
  const clockStartCol = centerCol - Math.floor(clockWidth / 2);
  const clockStartRow = centerRow - Math.floor(clockHeight / 2);

  for (let frameIndex = 0; frameIndex < frameCount; frameIndex++) {
    const frame = buildEmptyFrame(rows, cols);
    const progress = frameIndex / frameCount;

    // Generate radial wave pattern emanating from center
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        // Calculate distance from center
        const dx = c - centerCol;
        const dy = r - centerRow;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = Math.sqrt(centerRow ** 2 + centerCol ** 2);

        // Create expanding wave effect
        const wave =
          Math.sin((distance / maxDistance) * Math.PI * 4 - progress * Math.PI * 2) * 0.5 + 0.5;

        // Add horizontal wave component
        const horizontalWave =
          Math.sin((c / cols) * Math.PI * 3 + progress * Math.PI * 2) * 0.3 + 0.5;

        // Combine waves
        frame[r][c] = clamp((wave * 0.6 + horizontalWave * 0.4) * 0.8);
      }
    }

    // Overlay clock digits
    for (let digitIndex = 0; digitIndex < 6; digitIndex++) {
      const digitValue = parseInt(timeString[digitIndex], 10);
      const digitPattern = digits[digitValue];

      // Calculate position for this digit (5 cols per digit + 2 col spacing after pairs)
      const spacingOffset = digitIndex >= 2 ? 2 : 0;
      const extraSpacing = digitIndex >= 4 ? 2 : 0;
      const digitCol = clockStartCol + digitIndex * 5 + spacingOffset + extraSpacing;

      // Render digit pattern
      for (let dr = 0; dr < 7; dr++) {
        for (let dc = 0; dc < 5; dc++) {
          const targetRow = clockStartRow + dr;
          const targetCol = digitCol + dc;

          // Bounds check
          if (targetRow >= 0 && targetRow < rows && targetCol >= 0 && targetCol < cols) {
            const digitValue = digitPattern[dr][dc];
            // Make clock digits bright and override wave pattern
            if (digitValue > 0) {
              frame[targetRow][targetCol] = 1;
            } else {
              // Dim the wave pattern around the clock for contrast
              frame[targetRow][targetCol] *= 0.3;
            }
          }
        }
      }
    }

    frames.push(frame);
  }

  return frames;
}

export function MatrixBackground() {
  const [time, setTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Calculate matrix dimensions based on viewport
  const matrixConfig = useMemo(() => {
    if (typeof window === 'undefined') {
      // SSR fallback
      return {
        rows: 100,
        cols: 180,
        cellSize: 7,
        gap: 2,
      };
    }

    const cellSize = 7; // pixels per cell
    const gap = 2; // pixels between cells
    const totalPerCell = cellSize + gap;

    const cols = Math.floor(window.innerWidth / totalPerCell);
    const rows = Math.floor(window.innerHeight / totalPerCell);

    return { rows, cols, cellSize, gap };
  }, []);

  // Generate frames with current time
  const frames = useMemo(
    () => createUnifiedFrames(matrixConfig.rows, matrixConfig.cols, time, 24),
    [matrixConfig.rows, matrixConfig.cols, time]
  );

  return (
    <div
      className="fixed inset-0 z-0 flex items-center justify-center overflow-hidden"
      aria-hidden="true"
    >
      <Matrix
        rows={matrixConfig.rows}
        cols={matrixConfig.cols}
        frames={frames}
        fps={18}
        autoplay
        loop
        size={matrixConfig.cellSize}
        gap={matrixConfig.gap}
        palette={{
          on: 'rgba(196, 114, 79, 0.9)', // Terracotta from design system
          off: 'rgba(196, 114, 79, 0.05)',
        }}
        brightness={0.75}
        ariaLabel="Animated matrix background with digital clock"
      />
    </div>
  );
}
