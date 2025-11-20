'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';

interface InteractiveGridPatternProps {
  className?: string;
  width?: number;
  height?: number;
  squares?: [number, number];
  squaresClassName?: string;
}

interface Ripple {
  x: number;
  y: number;
  startTime: number;
}

export function InteractiveGridPattern({
  className = '',
  width = 40,
  height = 40,
  squares,
  squaresClassName = '',
}: InteractiveGridPatternProps) {
  const [hoveredCells, setHoveredCells] = useState<Set<string>>(new Set());
  const [gridSize, setGridSize] = useState({ cols: 20, rows: 20 });
  const containerRef = useRef<SVGSVGElement>(null);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const animationFrameRef = useRef<number>();

  // Dynamically calculate grid size based on viewport
  useEffect(() => {
    const updateGridSize = () => {
      // Calculate columns and rows needed to cover viewport
      // Add buffer of 2 cells to ensure full coverage during resize
      const cols = Math.ceil(window.innerWidth / width) + 2;
      const rows = Math.ceil(window.innerHeight / height) + 2;
      setGridSize({ cols, rows });
    };

    // Initial calculation
    updateGridSize();

    // Update on resize
    window.addEventListener('resize', updateGridSize);
    return () => window.removeEventListener('resize', updateGridSize);
  }, [width, height]);

  // Ripple animation loop
  useEffect(() => {
    const animate = () => {
      setRipples(prev => {
        const now = Date.now();
        // Filter out old ripples (older than 2s)
        const active = prev.filter(r => now - r.startTime < 2000);
        if (active.length !== prev.length) {
          return active;
        }
        return prev;
      });
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animationFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

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

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setRipples(prev => [
      ...prev,
      {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        startTime: Date.now(),
      }
    ]);
  }, []);

  // Use provided squares or dynamically calculated gridSize
  const cols = squares ? squares[0] : gridSize.cols;
  const rows = squares ? squares[1] : gridSize.rows;

  const now = Date.now();

  return (
    <svg
      ref={containerRef}
      className={`pointer-events-none select-none ${className}`}
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      onClick={handleClick}
      style={{ pointerEvents: 'auto' }} // Allow clicks
    >
      <defs>
        {/* Subtle radial gradient for spotlight effect */}
        <radialGradient id="grid-gradient">
          <stop offset="0%" stopColor="var(--color-border)" stopOpacity="0.15" />
          <stop offset="100%" stopColor="var(--color-border)" stopOpacity="0.05" />
        </radialGradient>

        {/* Refined noise texture for "washi paper" look */}
        <filter id="noise-texture" x="0%" y="0%" width="100%" height="100%">
          {/* Generate fractal noise */}
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.6" // Higher frequency for finer grain
            numOctaves="4" // More detail
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
                    0 0 0 0.4 0.5" // Adjusted contrast for subtle texture
            result="noiseAlpha"
          />
          {/* Apply noise as opacity mask to grid lines */}
          <feComposite in="SourceGraphic" in2="noiseAlpha" operator="in" />
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
      <rect width="100%" height="100%" fill="url(#grid-pattern)" filter="url(#noise-texture)" style={{ pointerEvents: 'none' }} />

      {/* Interactive cells */}
      <g className="pointer-events-auto">
        {Array.from({ length: rows }).map((_, rowIndex) =>
          Array.from({ length: cols }).map((_, colIndex) => {
            const cellId = `${rowIndex}-${colIndex}`;
            const cellX = colIndex * width + width / 2;
            const cellY = rowIndex * height + height / 2;
            
            // Calculate ripple effect
            let rippleOpacity = 0;
            ripples.forEach(ripple => {
              const age = now - ripple.startTime;
              const radius = age * 0.4; // Expansion speed
              const width = 100; // Ripple width
              const dx = cellX - ripple.x;
              const dy = cellY - ripple.y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              
              if (Math.abs(dist - radius) < width) {
                const intensity = Math.cos((Math.abs(dist - radius) / width) * Math.PI / 2);
                rippleOpacity += intensity * 0.2 * (1 - age / 2000);
              }
            });

            const isHovered = hoveredCells.has(cellId);
            const finalOpacity = Math.min(1, (isHovered ? 0.12 : 0) + rippleOpacity);

            return (
              <rect
                key={cellId}
                x={colIndex * width}
                y={rowIndex * height}
                width={width}
                height={height}
                fill="var(--color-primary)"
                fillOpacity={finalOpacity}
                className={`transition-opacity duration-300 ease-out ${squaresClassName}`}
                onMouseEnter={() => handleCellEnter(cellId)}
                onMouseLeave={() => handleCellLeave(cellId)}
                style={{
                  cursor: 'default',
                  transitionDuration: rippleOpacity > 0 ? '0ms' : '300ms' // Instant update for ripples
                }}
              />
            );
          })
        )}
      </g>

      {/* Subtle radial overlay for depth */}
      <rect width="100%" height="100%" fill="url(#grid-gradient)" pointerEvents="none" />
    </svg>
  );
}
