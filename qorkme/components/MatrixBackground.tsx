'use client';

import { useEffect, useMemo, useState } from 'react';
import { Matrix, digits, type Frame } from '@/components/ui/matrix';

/**
 * MatrixBackground renders a grid of small Matrix components that together
 * create a unified viewport-filling display with animated wave effects and
 * a centered digital clock overlay.
 *
 * This approach uses multiple small matrices (7×7 cells each) with coordinated
 * phase offsets to create the appearance of one large unified matrix, while
 * maintaining better performance and lower memory usage.
 */

// Helper to build empty frame
const buildEmptyFrame = (rows: number, cols: number): Frame =>
  Array.from({ length: rows }, () => Array(cols).fill(0));

// Helper to clamp values
const clamp = (value: number, min = 0, max = 1) => Math.min(Math.max(value, min), max);

// Calculate phase offset based on distance from center
function calculatePhaseOffset(
  cellPosition: { x: number; y: number },
  center: { x: number; y: number }
): number {
  const dx = cellPosition.x - center.x;
  const dy = cellPosition.y - center.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const maxDistance = Math.sqrt(center.x ** 2 + center.y ** 2);

  // Normalized distance creates radial wave effect
  const normalizedDistance = distance / maxDistance;
  return normalizedDistance * Math.PI * 4;
}

// Create wave frames with phase offset for small matrix
const frameCache = new Map<string, Frame[]>();

function createOffsetWaveFrames(
  rows: number,
  cols: number,
  frameCount: number,
  phaseOffset: number
): Frame[] {
  const cacheKey = `${rows}-${cols}-${frameCount}-${phaseOffset.toFixed(3)}`;

  if (frameCache.has(cacheKey)) {
    return frameCache.get(cacheKey)!;
  }

  const frames: Frame[] = [];

  for (let f = 0; f < frameCount; f++) {
    const frame = buildEmptyFrame(rows, cols);
    const progress = f / frameCount;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        // Radial wave component
        const radialWave = Math.sin(phaseOffset - progress * Math.PI * 2) * 0.5 + 0.5;

        // Horizontal wave component
        const horizontalWave =
          Math.sin((c / cols) * Math.PI * 2 + progress * Math.PI * 2) * 0.3 + 0.5;

        // Vertical wave component
        const verticalWave =
          Math.sin((r / rows) * Math.PI * 2 + progress * Math.PI * 2) * 0.2 + 0.5;

        // Combine waves
        frame[r][c] = clamp((radialWave * 0.6 + horizontalWave * 0.25 + verticalWave * 0.15) * 0.8);
      }
    }

    frames.push(frame);
  }

  frameCache.set(cacheKey, frames);
  return frames;
}

// Clock overlay component
function ClockOverlay() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');
  const timeDigits = [...hours.split(''), ...minutes.split(''), ...seconds.split('')];

  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <div className="flex gap-3">
        {/* Hours */}
        <div className="flex gap-1">
          {timeDigits.slice(0, 2).map((digit, index) => (
            <Matrix
              key={`h-${index}`}
              rows={7}
              cols={5}
              pattern={digits[parseInt(digit, 10)]}
              size={7}
              gap={2}
              palette={{
                on: 'rgba(196, 114, 79, 1)',
                off: 'rgba(196, 114, 79, 0)',
              }}
              brightness={1}
              ariaLabel={index === 0 ? `${hours} hours` : undefined}
            />
          ))}
        </div>

        {/* Minutes */}
        <div className="flex gap-1">
          {timeDigits.slice(2, 4).map((digit, index) => (
            <Matrix
              key={`m-${index}`}
              rows={7}
              cols={5}
              pattern={digits[parseInt(digit, 10)]}
              size={7}
              gap={2}
              palette={{
                on: 'rgba(196, 114, 79, 1)',
                off: 'rgba(196, 114, 79, 0)',
              }}
              brightness={1}
              ariaLabel={index === 0 ? `${minutes} minutes` : undefined}
            />
          ))}
        </div>

        {/* Seconds */}
        <div className="flex gap-1">
          {timeDigits.slice(4, 6).map((digit, index) => (
            <Matrix
              key={`s-${index}`}
              rows={7}
              cols={5}
              pattern={digits[parseInt(digit, 10)]}
              size={7}
              gap={2}
              palette={{
                on: 'rgba(196, 114, 79, 1)',
                off: 'rgba(196, 114, 79, 0)',
              }}
              brightness={1}
              ariaLabel={index === 0 ? `${seconds} seconds` : undefined}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function MatrixBackground() {
  // Calculate grid of small matrices
  const gridConfig = useMemo(() => {
    if (typeof window === 'undefined') {
      return { gridCells: [], center: { x: 0, y: 0 } };
    }

    const MATRIX_SIZE = 12; // Each matrix is 12×12 cells (larger for better performance)
    const CELL_SIZE = 6; // 6px per cell (slightly smaller)
    const GAP = 2; // 2px between cells

    // Calculate total size of one matrix including gaps
    const matrixPixelSize = MATRIX_SIZE * CELL_SIZE + (MATRIX_SIZE - 1) * GAP;

    // Calculate how many matrices fit with minimal spacing
    const matrixSpacing = 2; // Minimal gap between matrices
    const totalMatrixSize = matrixPixelSize + matrixSpacing;

    const gridCols = Math.ceil(window.innerWidth / totalMatrixSize) + 1;
    const gridRows = Math.ceil(window.innerHeight / totalMatrixSize) + 1;

    const center = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    };

    const gridCells = [];

    for (let r = 0; r < gridRows; r++) {
      for (let c = 0; c < gridCols; c++) {
        const x = c * totalMatrixSize;
        const y = r * totalMatrixSize;
        const phaseOffset = calculatePhaseOffset({ x, y }, center);

        gridCells.push({
          id: `${r}-${c}`,
          position: { x, y },
          phaseOffset,
        });
      }
    }

    return { gridCells, center };
  }, []);

  return (
    <div
      className="fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
      aria-label="Animated matrix background"
    >
      {/* Grid of small matrices */}
      <div className="relative h-full w-full">
        {gridConfig.gridCells.map((cell) => {
          const frames = createOffsetWaveFrames(12, 12, 24, cell.phaseOffset);

          return (
            <div
              key={cell.id}
              className="absolute"
              style={{
                left: cell.position.x,
                top: cell.position.y,
              }}
            >
              <Matrix
                rows={12}
                cols={12}
                frames={frames}
                fps={18}
                autoplay
                loop
                size={6}
                gap={2}
                palette={{
                  on: 'rgba(196, 114, 79, 0.9)',
                  off: 'rgba(196, 114, 79, 0.05)',
                }}
                brightness={0.75}
              />
            </div>
          );
        })}
      </div>

      {/* Clock overlay */}
      <ClockOverlay />
    </div>
  );
}
