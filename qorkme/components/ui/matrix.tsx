'use client';

import { HTMLAttributes, useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export type Frame = number[][];

export type MatrixPalette = {
  on: string;
  off: string;
};

export interface MatrixProps extends HTMLAttributes<HTMLDivElement> {
  rows: number;
  cols: number;
  pattern?: Frame;
  frames?: Frame[];
  fps?: number;
  autoplay?: boolean;
  loop?: boolean;
  size?: number;
  gap?: number;
  palette?: MatrixPalette;
  brightness?: number;
  ariaLabel?: string;
  onFrame?: (index: number) => void;
  mode?: 'default' | 'vu';
  levels?: number[];
  cascadeDelay?: number; // Delay in ms per cell for cascade effect (diagonal top-left to bottom-right)
  cascadeStartDelay?: number; // Initial delay before cascade starts (in ms)
  enablePhysics?: boolean; // Enable mouse interaction and click waves
}

const defaultPalette: MatrixPalette = {
  on: 'rgba(224, 139, 97, 0.95)',
  off: 'rgba(224, 139, 97, 0.1)',
};

const clamp = (value: number, min = 0, max = 1) => Math.min(Math.max(value, min), max);

const buildEmptyFrame = (rows: number, cols: number): Frame =>
  Array.from({ length: rows }, () => Array(cols).fill(0));

const normaliseFrame = (frame: Frame, rows: number, cols: number): Frame => {
  const matrix = buildEmptyFrame(rows, cols);
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const value = frame?.[r]?.[c] ?? 0;
      matrix[r][c] = clamp(value);
    }
  }
  return matrix;
};

const createVuFrame = (rows: number, cols: number, levels: number[] = []): Frame => {
  const frame = buildEmptyFrame(rows, cols);
  for (let column = 0; column < cols; column += 1) {
    const level = levels[column] ?? 0;
    const activeRows = Math.round(clamp(level) * rows);

    for (let i = 0; i < activeRows; i += 1) {
      const rowIndex = rows - 1 - i;
      const intensity = clamp(level * (1 - i / rows) * 1.1, 0, 1);
      frame[rowIndex][column] = intensity;
    }
  }
  return frame;
};

interface Wave {
  x: number;
  y: number;
  startTime: number;
}

export function Matrix({
  rows,
  cols,
  pattern,
  frames,
  fps = 18,
  autoplay = true,
  loop = true,
  size = 16,
  gap = 6,
  palette = defaultPalette,
  brightness = 1,
  ariaLabel,
  onFrame,
  mode = 'default',
  levels,
  cascadeDelay = 0,
  cascadeStartDelay = 0,
  enablePhysics = true,
  className,
  style,
  ...rest
}: MatrixProps) {
  const [frameIndex, setFrameIndex] = useState(0);
  const frameIndexRef = useRef(0);
  const lastTimestamp = useRef<number | null>(null);
  const animated = autoplay && mode !== 'vu' && (frames?.length ?? 0) > 1;
  const containerRef = useRef<HTMLDivElement>(null);

  // Physics state
  const mousePos = useRef<{ x: number; y: number } | null>(null);
  const waves = useRef<Wave[]>([]);
  const [physicsTick, setPhysicsTick] = useState(0); // Force re-render for physics
  const now = useMemo(
    () => Date.now() + physicsTick * 0, // Tie recalculations to physics ticks without altering the timestamp
    [physicsTick]
  );

  useEffect(() => {
    frameIndexRef.current = 0;
    setFrameIndex(0);
  }, [frames, pattern, mode, rows, cols]);

  // Main animation loop handling both frames and physics
  useEffect(() => {
    if (!animated && !enablePhysics) return undefined;

    let raf = 0;

    const step = (timestamp: number) => {
      if (lastTimestamp.current === null) {
        lastTimestamp.current = timestamp;
      }

      const elapsed = timestamp - lastTimestamp.current;
      const frameInterval = 1000 / fps;

      // Update animation frames
      if (animated && frames?.length && elapsed >= frameInterval) {
        lastTimestamp.current = timestamp;

        const total = frames.length;
        const nextRaw = frameIndexRef.current + 1;
        const nextIndex = loop ? nextRaw % total : Math.min(nextRaw, total - 1);

        frameIndexRef.current = nextIndex;
        setFrameIndex(nextIndex);
        onFrame?.(nextIndex);

        if (!loop && nextIndex === total - 1 && !enablePhysics) {
          lastTimestamp.current = null;
          return;
        }
      }

      // Update physics (always runs if enabled)
      if (enablePhysics) {
        // Clean up old waves
        const now = Date.now();
        if (waves.current.length > 0) {
          waves.current = waves.current.filter((w) => now - w.startTime < 2000);
        }

        // Force re-render for physics updates (60fps)
        // We use a separate tick or just rely on the setFrameIndex if fps is high enough.
        // To get smooth 60fps physics, we need to render more often than 'fps' prop might suggest.
        // So we update a physics tick.
        setPhysicsTick((p) => (p + 1) % 60);
      }

      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(raf);
      lastTimestamp.current = null;
    };
  }, [animated, frames, fps, loop, onFrame, enablePhysics]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!enablePhysics || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mousePos.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseLeave = () => {
    mousePos.current = null;
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!enablePhysics || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    waves.current.push({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      startTime: Date.now(),
    });
  };

  const activeFrame = useMemo(() => {
    if (mode === 'vu') {
      return createVuFrame(rows, cols, levels ?? []);
    }

    if (pattern) {
      return normaliseFrame(pattern, rows, cols);
    }

    if (frames?.length) {
      const safeIndex = Math.min(frameIndex, frames.length - 1);
      return normaliseFrame(frames[safeIndex], rows, cols);
    }

    return buildEmptyFrame(rows, cols);
  }, [mode, levels, pattern, frames, frameIndex, rows, cols]);

  // Calculate cells with physics
  const cells = useMemo(() => {
    const baseCells = activeFrame.flat().map((value, index) => ({
      index,
      value: clamp(value * brightness),
    }));

    if (!enablePhysics) return baseCells;

    const cellSpacing = size + gap;

    return baseCells.map((cell) => {
      let { value } = cell;
      const r = Math.floor(cell.index / cols);
      const c = cell.index % cols;
      const cellX = c * cellSpacing + size / 2;
      const cellY = r * cellSpacing + size / 2;

      // Mouse influence
      if (mousePos.current) {
        const dx = cellX - mousePos.current.x;
        const dy = cellY - mousePos.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const radius = 120; // Interaction radius

        if (dist < radius) {
          // Scale boost based on proximity (gaussian-ish)
          const boost = Math.pow(1 - dist / radius, 2) * 0.6;
          value = clamp(value + boost);
        }
      }

      // Wave influence
      waves.current.forEach((wave) => {
        const age = now - wave.startTime;
        const waveSpeed = 0.3; // px per ms
        const waveRadius = age * waveSpeed;
        const waveWidth = 60;

        const dx = cellX - wave.x;
        const dy = cellY - wave.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (Math.abs(dist - waveRadius) < waveWidth) {
          // Wave peak calculation
          const relDist = Math.abs(dist - waveRadius);
          const waveBoost = Math.cos(((relDist / waveWidth) * Math.PI) / 2) * 0.8;
          value = clamp(value + waveBoost * (1 - age / 2000)); // Fade out over time
        }
      });

      return { ...cell, value };
    });
  }, [activeFrame, brightness, enablePhysics, cols, size, gap, now]);

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label={ariaLabel ?? 'Dot matrix display'}
      className={cn('matrix grid select-none touch-none', className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{
        gridTemplateColumns: `repeat(${cols}, ${size}px)`,
        gridTemplateRows: `repeat(${rows}, ${size}px)`,
        gap: `${gap}px`,
        ...style,
      }}
      {...rest}
    >
      {cells.map(({ index, value }) => {
        const isActive = value > 0.02;
        const opacity = isActive ? Math.max(value, 0.18) : 1;

        // Calculate cascade animation delay based on diagonal position (top-left to bottom-right)
        const row = Math.floor(index / cols);
        const col = index % cols;
        const diagonalIndex = row + col; // Cells on same diagonal have same sum
        const animationDelay =
          cascadeDelay > 0 ? `${cascadeStartDelay + diagonalIndex * cascadeDelay}ms` : undefined;

        return (
          <span
            key={index}
            className={cn(
              'inline-block rounded-full transition-all will-change-[transform,opacity,background-color]',
              // If physics is enabled, we disable CSS transitions for snappier response,
              // otherwise we keep the smooth fade for frame animations
              !enablePhysics && 'duration-700 ease-out',
              enablePhysics && 'duration-75 ease-out', // Much faster for physics
              cascadeDelay > 0 && 'animate-[fadeIn_0.4s_ease-out_both]'
            )}
            style={{
              width: `${size}px`,
              height: `${size}px`,
              backgroundColor: isActive ? palette.on : palette.off,
              opacity,
              transform: isActive
                ? `scale(${0.88 + value * 0.35})` // Slightly higher max scale for physics pop
                : `scale(${0.72 + value * 0.2})`,
              boxShadow: isActive && enablePhysics ? `0 0 ${value * 8}px ${palette.on}` : 'none', // Add glow for high intensity
              animationDelay,
            }}
          />
        );
      })}
    </div>
  );
}

type WaveConfig = {
  rows: number;
  cols: number;
  frames?: number;
  amplitude?: number;
  speed?: number;
};

type PulseConfig = {
  rows: number;
  cols: number;
  frames?: number;
};

type LoaderConfig = {
  rows: number;
  cols: number;
  frames?: number;
  trail?: number;
};

const createWaveFrames = ({
  rows,
  cols,
  frames = 32,
  amplitude = 1,
  speed = 2,
}: WaveConfig): Frame[] => {
  const output: Frame[] = [];
  for (let frameIndex = 0; frameIndex < frames; frameIndex += 1) {
    const phase = (frameIndex / frames) * Math.PI * 2 * speed;
    const frame: Frame = buildEmptyFrame(rows, cols);
    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        const x = (c / cols) * Math.PI * 2;
        const waveValue = Math.sin(x + phase) * Math.cos((r / rows) * Math.PI) * amplitude;
        frame[r][c] = clamp((waveValue + 1) / 2);
      }
    }
    output.push(frame);
  }
  return output;
};

const createPulseFrames = ({ rows, cols, frames = 24 }: PulseConfig): Frame[] => {
  const output: Frame[] = [];
  const centerRow = (rows - 1) / 2;
  const centerCol = (cols - 1) / 2;
  const maxRadius = Math.sqrt(centerRow ** 2 + centerCol ** 2);

  for (let frameIndex = 0; frameIndex < frames; frameIndex += 1) {
    const progress = frameIndex / frames;
    const frame: Frame = buildEmptyFrame(rows, cols);
    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        const distance = Math.sqrt((r - centerRow) ** 2 + (c - centerCol) ** 2);
        const wave = Math.cos((distance / maxRadius) * Math.PI - progress * 2);
        frame[r][c] = clamp((wave + 1) / 2);
      }
    }
    output.push(frame);
  }

  return output;
};

const createLoaderFrames = ({ rows, cols, frames = 12, trail = 3 }: LoaderConfig): Frame[] => {
  const output: Frame[] = [];
  const positions: Array<[number, number]> = [];
  const centerRow = (rows - 1) / 2;
  const centerCol = (cols - 1) / 2;
  const radius = Math.min(centerRow, centerCol);

  for (let i = 0; i < frames; i += 1) {
    const angle = (i / frames) * Math.PI * 2;
    const r = Math.round(centerRow + Math.sin(angle) * radius);
    const c = Math.round(centerCol + Math.cos(angle) * radius);
    positions.push([clamp(r, 0, rows - 1), clamp(c, 0, cols - 1)]);
  }

  for (let frameIndex = 0; frameIndex < frames; frameIndex += 1) {
    const frame: Frame = buildEmptyFrame(rows, cols);
    for (let t = 0; t < trail; t += 1) {
      const index = (frameIndex - t + frames) % frames;
      const [r, c] = positions[index];
      frame[r][c] = clamp(1 - t / trail);
    }
    output.push(frame);
  }

  return output;
};

const createSnakeFrames = (rows: number, cols: number): Frame[] => {
  const path: Array<[number, number]> = [];
  for (let r = 0; r < rows; r += 1) {
    if (r % 2 === 0) {
      for (let c = 0; c < cols; c += 1) {
        path.push([r, c]);
      }
    } else {
      for (let c = cols - 1; c >= 0; c -= 1) {
        path.push([r, c]);
      }
    }
  }

  const frames: Frame[] = [];
  const trail = Math.max(4, Math.round((rows + cols) / 4));

  for (let i = 0; i < path.length; i += 1) {
    const frame: Frame = buildEmptyFrame(rows, cols);
    for (let t = 0; t < trail; t += 1) {
      const idx = i - t;
      if (idx < 0) continue;
      const [r, c] = path[idx];
      frame[r][c] = clamp(1 - t / trail);
    }
    frames.push(frame);
  }

  return frames;
};

const createChevron = (direction: 'left' | 'right'): Frame => {
  if (direction === 'left') {
    return [
      [0, 0, 1, 0, 0],
      [0, 1, 0, 0, 0],
      [1, 0, 0, 0, 0],
      [0, 1, 0, 0, 0],
      [0, 0, 1, 0, 0],
    ];
  }
  return [
    [0, 0, 1, 0, 0],
    [0, 0, 0, 1, 0],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 1, 0],
    [0, 0, 1, 0, 0],
  ];
};

export const wave = createWaveFrames({ rows: 7, cols: 7, frames: 32 });
export const pulse = createPulseFrames({ rows: 7, cols: 7, frames: 28 });
export const loader = createLoaderFrames({ rows: 7, cols: 7, frames: 12 });
export const snake = createSnakeFrames(7, 7);
export const chevronLeft = createChevron('left');
export const chevronRight = createChevron('right');

export const digits: Frame[] = [
  [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  [
    [0, 0, 1, 0, 0],
    [0, 1, 1, 0, 0],
    [1, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [1, 1, 1, 1, 1],
  ],
  [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 0, 0, 0],
    [1, 1, 1, 1, 1],
  ],
  [
    [1, 1, 1, 1, 0],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 1, 0],
    [0, 0, 1, 1, 0],
    [0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  [
    [0, 0, 0, 1, 0],
    [0, 0, 1, 1, 0],
    [0, 1, 0, 1, 0],
    [1, 0, 0, 1, 0],
    [1, 1, 1, 1, 1],
    [0, 0, 0, 1, 0],
    [0, 0, 0, 1, 0],
  ],
  [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 0],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  [
    [1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 0, 0, 0],
    [0, 1, 0, 0, 0],
    [0, 1, 0, 0, 0],
  ],
  [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 1],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
  ],
];

export const vu = (levels: number[], rows = 7): Frame => createVuFrame(rows, levels.length, levels);

export const createMatrixWave = createWaveFrames;
export const createMatrixPulse = createPulseFrames;
export const createMatrixLoader = createLoaderFrames;

// Letter patterns for alphabet (7 rows × 5 columns each)
export const letters: Record<string, Frame> = {
  Q: [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 1, 0],
    [0, 1, 1, 0, 1],
  ],
  o: [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  r: [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [1, 0, 1, 1, 0],
    [1, 1, 0, 0, 1],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
  ],
  k: [
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 1, 0],
    [1, 0, 1, 0, 0],
    [1, 1, 0, 0, 0],
    [1, 0, 1, 0, 0],
    [1, 0, 0, 1, 0],
  ],
  M: [
    [1, 0, 0, 0, 1],
    [1, 1, 0, 1, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
  ],
  e: [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0],
    [0, 1, 1, 1, 0],
  ],
  '.': [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 1, 1, 0, 0],
    [0, 1, 1, 0, 0],
  ],
  ' ': [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ],
  ':': [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 1, 1, 0, 0],
    [0, 1, 1, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 1, 1, 0, 0],
    [0, 1, 1, 0, 0],
  ],
  A: [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
  ],
  P: [
    [1, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
  ],
  S: [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  E: [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1],
  ],
  C: [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  U: [
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  R: [
    [1, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 0],
    [1, 0, 1, 0, 0],
    [1, 0, 0, 1, 0],
    [1, 0, 0, 0, 1],
  ],
};
