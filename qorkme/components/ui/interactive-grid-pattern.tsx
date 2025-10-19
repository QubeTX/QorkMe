'use client';

import React, { useState, useCallback, useRef } from 'react';

interface InteractiveGridPatternProps {
  className?: string;
  width?: number;
  height?: number;
  squares?: [number, number];
  squaresClassName?: string;
}

export function InteractiveGridPattern({
  className = '',
  width = 40,
  height = 40,
  squares = [20, 20],
  squaresClassName = '',
}: InteractiveGridPatternProps) {
  const [hoveredCells, setHoveredCells] = useState<Set<string>>(new Set());
  const containerRef = useRef<SVGSVGElement>(null);

  const handleCellEnter = useCallback((cellId: string) => {
    setHoveredCells((prev) => {
      const next = new Set(prev);
      next.add(cellId);
      return next;
    });
  }, []);

  const handleCellLeave = useCallback((cellId: string) => {
    setHoveredCells((prev) => {
      const next = new Set(prev);
      next.delete(cellId);
      return next;
    });
  }, []);

  const [cols, rows] = squares;

  return (
    <svg
      ref={containerRef}
      className={`pointer-events-none ${className}`}
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Subtle radial gradient for spotlight effect */}
        <radialGradient id="grid-gradient">
          <stop offset="0%" stopColor="var(--color-border)" stopOpacity="0.15" />
          <stop offset="100%" stopColor="var(--color-border)" stopOpacity="0.05" />
        </radialGradient>

        {/* Noise texture for organic opacity variation on grid lines */}
        <filter id="noise-texture" x="0%" y="0%" width="100%" height="100%">
          {/* Generate fractal noise */}
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.025"
            numOctaves="3"
            seed="42"
            result="noise"
          />
          {/* Convert noise to alpha channel only */}
          <feColorMatrix
            in="noise"
            type="matrix"
            values="0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 0.6 0.4"
            result="noiseAlpha"
          />
          {/* Apply noise as opacity mask to grid lines */}
          <feComposite
            in="SourceGraphic"
            in2="noiseAlpha"
            operator="in"
          />
        </filter>
      </defs>

      {/* Grid pattern */}
      <pattern
        id="grid-pattern"
        x="0"
        y="0"
        width={width}
        height={height}
        patternUnits="userSpaceOnUse"
      >
        <path
          d={`M ${width} 0 L 0 0 0 ${height}`}
          fill="none"
          stroke="var(--color-border-strong)"
          strokeWidth="1"
          strokeOpacity="0.6"
        />
      </pattern>

      {/* Background grid with noise texture */}
      <rect width="100%" height="100%" fill="url(#grid-pattern)" filter="url(#noise-texture)" />

      {/* Interactive cells */}
      <g className="pointer-events-auto">
        {Array.from({ length: rows }).map((_, rowIndex) =>
          Array.from({ length: cols }).map((_, colIndex) => {
            const cellId = `${rowIndex}-${colIndex}`;
            const isHovered = hoveredCells.has(cellId);

            return (
              <rect
                key={cellId}
                x={colIndex * width}
                y={rowIndex * height}
                width={width}
                height={height}
                fill={isHovered ? 'var(--color-primary)' : 'transparent'}
                fillOpacity={isHovered ? '0.12' : '0'}
                className={`transition-all duration-300 ease-out ${squaresClassName}`}
                onMouseEnter={() => handleCellEnter(cellId)}
                onMouseLeave={() => handleCellLeave(cellId)}
                style={{
                  cursor: 'default',
                }}
              />
            );
          })
        )}
      </g>

      {/* Subtle radial overlay for depth */}
      <rect
        width="100%"
        height="100%"
        fill="url(#grid-gradient)"
        pointerEvents="none"
      />
    </svg>
  );
}
