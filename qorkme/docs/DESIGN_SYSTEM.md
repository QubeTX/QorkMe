# QorkMe Brand & Design System Guide

**Version 1.0** • A comprehensive branding guide for creating websites in the QorkMe visual style

---

## Table of Contents

1. [Brand Vision & Principles](#brand-vision--principles)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Layout & Spacing](#layout--spacing)
5. [Glassmorphism & Depth](#glassmorphism--depth)
6. [Interactive Grid Background](#interactive-grid-background)
7. [Matrix Display System](#matrix-display-system)
8. [Component Library](#component-library)
9. [Animation & Motion](#animation--motion)
10. [Responsive Design](#responsive-design)
11. [Accessibility](#accessibility)
12. [Implementation Guide](#implementation-guide)

---

## Brand Vision & Principles

QorkMe embodies an **earthy modern** aesthetic that merges organic warmth with contemporary glassmorphic depth. The brand feels like a contemporary design studio that works with natural materials while embracing cutting-edge digital techniques.

### Design Philosophy

**Earthy Modern**

- Organic color palettes (warm parchment, terracotta, sage) meet refined layouts
- Natural tones create warmth while precise geometry maintains professionalism
- Generous whitespace allows elements to breathe
- Texture through subtle noise patterns and organic variations

**Purposeful Contrast**

- Terracotta (`#c4724f`) drives all primary actions and focus states
- Sage (`#5f7d58`) supports secondary paths and success states
- Deep browns (`#2f2a26`) provide structural clarity and text hierarchy
- High contrast ensures legibility while maintaining warmth

**Quiet Confidence**

- Motion and depth remain subtle and refined
- Blur, shadow, and animation enhance without overwhelming
- Never gimmicky, always purposeful
- Calm, professional interactions that feel premium

**Glass-Morphic Depth**

- Semi-transparent surfaces with backdrop blur create layered dimension
- White borders at low opacity (5-20%) define edges subtly
- Inset highlights add glass-like reflections
- Multiple shadow layers create realistic depth

**Clarity First**

- Establish singular visual hierarchy per view
- Copy stays concise and action-oriented
- Emphasis reserved for primary actions
- Information architecture drives layout decisions

**Interactive Delight**

- Subtle hover effects create engaging micro-interactions
- Smooth transitions maintain flow between states
- Responsive feedback makes interfaces feel alive
- Performance-first approach ensures 60fps throughout

---

## Color System

QorkMe's color palette combines warm, earthy neutrals with vibrant terracotta and sage accents. All colors are defined as CSS custom properties to enable seamless theme switching.

### Light Theme Palette

**Backgrounds**

```css
--color-background: #f6f1e8 /* Warm parchment - page background */
  --color-background-accent: #ece3d2 /* Lighter parchment - section dividers, footer */;
```

**Surfaces**

```css
--color-surface: #ffffff /* Pure white - primary cards, modals */ --color-surface-elevated: #f2e7d6
  /* Cream - hovered cards, sticky headers */ --color-surface-muted: #e5dac5
  /* Muted cream - badges, table stripes */;
```

**Brand Colors**

```css
--color-primary: #c4724f /* Terracotta - CTAs, focus rings, icons */ --color-primary-hover: #b46444
  /* Darker terracotta - hover states */ --color-accent: #5f7d58
  /* Sage green - secondary actions, success */ --color-accent-hover: #4f6a49
  /* Darker sage - accent hover */;
```

**Text**

```css
--color-secondary: #2f2a26 /* Deep brown - primary text, icons */ --color-text-primary: #2f2a26
  /* Headings, key text */ --color-text-secondary: #49413a /* Body copy, labels, supporting text */
  --color-text-muted: #6b6159 /* Captions, helper text, placeholders */
  --color-text-inverse: #f6f1e8 /* Text on dark backgrounds (buttons) */;
```

**UI Elements**

```css
--color-border: rgba(108, 96, 81, 0.18) /* Subtle warm borders */
  --color-border-strong: rgba(79, 69, 58, 0.32) /* Stronger borders, hovers */
  --color-ring: rgba(196, 114, 79, 0.32) /* Focus ring (terracotta) */
  --color-shadow: rgba(40, 32, 26, 0.08) /* Base shadow (warm brown) */
  --color-shadow-hover: rgba(40, 32, 26, 0.16) /* Elevated shadow */;
```

**Status Colors**

```css
--color-success: #4f7c5a /* Deep sage - success states */ --color-warning: #d08a3b
  /* Warm amber - warnings */ --color-error: #c04d3c /* Terracotta red - errors */
  --color-info: #5f7d58 /* Sage - informational */;
```

### Dark Theme Palette

Dark theme uses espresso tones while maintaining the same warm character:

```css
[data-theme='dark'] {
  --color-background: linear-gradient(180deg, #1f1c18 0%, #171410 100%);
  --color-background-accent: #26221e;
  --color-surface: rgba(33, 29, 26, 0.94);
  --color-surface-elevated: rgba(46, 40, 36, 0.92);
  --color-primary: #e08b61; /* Brighter terracotta for dark */
  --color-text-primary: #f4ede2; /* Warm white */
  --color-text-secondary: #d9cfc0; /* Cream */
  /* ... additional tokens */
}
```

### Color Usage in Code

**Method 1: Direct CSS Variables**

```css
background: var(--color-surface);
color: var(--color-text-primary);
border: 1px solid var(--color-border);
```

**Method 2: Tailwind Arbitrary Values**

```tsx
<div className="bg-[color:var(--color-primary)] text-[color:var(--color-text-inverse)]">
```

**Method 3: Opacity Modifiers**

```tsx
<div className="bg-[color:var(--color-surface-elevated)]/[0.15]">
{/* Renders as: background with 15% opacity */}
```

**Method 4: Direct RGBA for Specific Effects**

```tsx
<div style={{ background: 'rgba(250, 249, 245, 0.03)' }}>
{/* Used for precise glassmorphic effects */}
```

**Method 5: Color-mix for Dynamic Blending**

```css
border: 1px solid color-mix(in srgb, var(--color-border) 70%, transparent);
/* Mixes border color at 70% with 30% transparent */
```

### Color Contrast Guidelines

All text/background combinations meet **WCAG 2.1 Level AA** (4.5:1 minimum):

| Foreground     | Background | Ratio | Pass |
| -------------- | ---------- | ----- | ---- |
| Text Primary   | Background | 11.2  | ✓    |
| Text Secondary | Background | 7.8   | ✓    |
| Text Muted     | Background | 4.6   | ✓    |
| Text Inverse   | Primary    | 5.1   | ✓    |
| Primary        | Background | 4.9   | ✓    |

---

## Typography

QorkMe uses **two font families exclusively**: ZT Bros Oskon for display moments and Inter for everything else.

### Font Families

#### ZT Bros Oskon (Display Font)

```css
--font-display: 'ZT Bros Oskon', serif;
```

**When to Use:**

- Hero titles and main headings (h1-h3)
- Brand name displays
- Prominent section headers
- Large decorative text

**When NOT to Use:**

- Body text or paragraphs
- Form inputs or labels
- UI chrome (nav, footer links)
- **Buttons** (common mistake!)

**Available Weights:**

- 400 (Regular)
- 500 (Medium)
- 600 (SemiBold) ← Primary display weight
- 700 (Bold)

**Characteristics:**

- Geometric, modern, slightly condensed
- Tight letter-spacing (`0.008em`)
- Line height: `1.15` (tight for visual impact)
- Best for short, impactful statements

#### Inter (Body & UI Font)

```css
--font-body: 'Inter', sans-serif;
--font-ui: 'Inter', sans-serif; /* Alias for UI elements */
--font-mono: 'Inter', sans-serif; /* Alias for numeric content */
```

**When to Use:**

- **All body text** (paragraphs, descriptions)
- **All UI elements** (navigation, labels, badges)
- **All buttons** (Inter Black 900 required!)
- Form inputs and placeholder text
- Numeric content (enable `tabular-nums`)
- Footer text and links

**Available Weights:**

- 300 (Light) - rarely used
- 400 (Regular) - **Default for body text**
- 500 (Medium) - Emphasized text, labels
- 600 (SemiBold) - Strong UI elements
- 700 (Bold) - Headings when ZT unavailable
- 900 (Black) - **All button text**

### Font Weight System

```css
--weight-body-regular: 400 /* Default body text, paragraphs */ --weight-body-strong: 500
  /* Emphasized text, form labels */ --weight-ui-strong: 600 /* Strong UI elements */
  --weight-display-strong: 600 /* ZT Bros Oskon display weight */ --weight-ui-button: 900
  /* ALL buttons (Inter Black) */ --weight-inter-heavy: 900
  /* Heavy Inter for headings if ZT unavailable */;
```

### Type Scale

Responsive typography using `clamp()` for fluid scaling:

```css
/* Headings (ZT Bros Oskon) */
h1: clamp(2.75rem, 4vw + 1rem, 4.5rem)   /* 44px → 72px */
h2: clamp(2.25rem, 3vw + 1rem, 3.5rem)   /* 36px → 56px */
h3: clamp(1.75rem, 2vw + 1rem, 2.5rem)   /* 28px → 40px */
h4: 1.5rem                                /* 24px fixed */
h5: 1.25rem                               /* 20px fixed */
h6: 1.125rem                              /* 18px fixed */

/* Body text (Inter) */
body: 1rem (16px base)
small: 0.875rem (14px)

/* Line heights */
Headings: 1.15    /* Tight for impact */
Body: 1.6         /* Comfortable reading */
Small: 1.4        /* Balanced for captions */
```

### Letter Spacing Patterns

```css
ZT Bros Oskon headings: 0.008em    /* Subtle tightening */
Buttons: 0.02em                     /* Slight expansion for clarity */
Footer brand: 0.16em                /* Ultra-wide with uppercase */
Admin links: 0.12em                 /* Medium tracking with uppercase */
```

### Typography Examples

**Hero Heading**

```tsx
<h1 className="font-display text-[clamp(2.75rem,4vw+1rem,4.5rem)] font-semibold tracking-[0.008em] leading-[1.15]">
  Smart URL Shortening
</h1>
```

**Body Text**

```tsx
<p className="font-body text-base text-[color:var(--color-text-secondary)] leading-relaxed">
  This is body copy with <strong className="font-medium">emphasized content</strong>.
</p>
```

**Button (CORRECT)**

```tsx
<button className="font-ui [font-weight:var(--weight-ui-button)] tracking-[0.02em] text-base">
  Shorten URL
</button>
```

**Footer Brand**

```tsx
<span className="font-display text-2xl font-normal uppercase tracking-[0.16em]">QORKME</span>
```

### Common Typography Mistakes

❌ **WRONG: Button with display font**

```tsx
<button className="font-display">Click Me</button>
```

✅ **CORRECT: Button with Inter Black**

```tsx
<button className="font-ui [font-weight:var(--weight-ui-button)]">Click Me</button>
```

---

## Layout & Spacing

QorkMe follows an **8px base unit** system with responsive clamp values for fluid scaling across all viewport sizes.

### Spacing Tokens

```css
--container-max: 1200px /* Maximum content width */ --container-padding: clamp(1.25rem, 6vw, 3.5rem)
  /* 20px → 56px */ --section-spacing: clamp(4.5rem, 8vw, 7.5rem) /* 72px → 120px */
  --card-padding: clamp(1.75rem, 1.2vw + 1.35rem, 2.75rem) /* 28px → 44px */;
```

### Border Radius Scale

```css
--radius-sm: 12px /* Small badges, pills */ --radius-md: 16px /* Inputs, small cards */
  --radius-lg: 22px /* Standard buttons */ --radius-xl: 28px /* Large cards */ --radius-full: 9999px
  /* Perfect circles */;
```

**Note:** UrlShortener uses `30px` radius for distinctive extra-rounded appearance.

### Spacing Guidelines

**Page Sections**

- Vertical rhythm: `var(--section-spacing)` (72-120px)
- Horizontal padding: `var(--container-padding)` (20-56px)

**Card Interiors**

- Padding: `var(--card-padding)` (28-44px)
- Internal gaps: `1.5rem` (24px) between sections

**Component Spacing**

- Vertical stacks: `clamp(2.75rem, 4vw, 4.5rem)` (44-72px)
- Grid gaps: `clamp(2rem, 3.5vw, 3rem)` (32-48px)
- All spacing: Multiples of 8px (0.5rem, 1rem, 1.5rem, 2rem, etc.)

### Transition Timing

```css
--transition-fast: 140ms ease /* Quick hover responses */ --transition-base: 240ms ease
  /* Standard interactions */ --transition-slow: 420ms ease /* Theme transitions */;
```

**Usage:**

- **Fast (140ms):** Icon color changes, subtle hover effects
- **Base (240ms):** Buttons, cards, opacity fades
- **Slow (420ms):** Theme switching, major layout shifts

---

## Glassmorphism & Depth

QorkMe's signature aesthetic relies on **glassmorphism**—semi-transparent surfaces with backdrop blur creating layered, dimensional interfaces.

### Core Glassmorphism Formula

```tsx
<div className="
  rounded-[30px]
  border border-white/10
  bg-[color:var(--color-surface)]/[0.03]
  backdrop-blur-xl
  shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1),0_0_0_1px_rgba(255,255,255,0.05)]
">
```

#### Layer Breakdown

**1. Semi-Transparent Background**

```css
bg-[color:var(--color-surface)]/[0.03]
/* Pure white at 3% opacity - barely visible tint */
```

**2. Backdrop Blur**

```css
backdrop-blur-xl
/* Translates to: backdrop-filter: blur(24px) */
/* Creates frosted glass effect */
```

**3. Subtle Border**

```css
border border-white/10
/* White border at 10% opacity */
/* Provides gentle edge definition */
```

**4. Multi-Layered Shadows**

```css
shadow-[
  0_8px_32px_rgba(0,0,0,0.3),              /* Main drop shadow (depth) */
  inset_0_1px_0_rgba(255,255,255,0.1),    /* Top inner highlight (glass reflection) */
  0_0_0_1px_rgba(255,255,255,0.05)        /* Outer glow (subtle halo) */
]
```

**5. Extra-Rounded Corners**

```css
rounded-[30px]
/* 30px radius for modern, friendly appearance */
```

### Glassmorphism Opacity Hierarchy

| Surface Type    | Opacity | Usage Example                |
| --------------- | ------- | ---------------------------- |
| Main card       | `0.03`  | Primary interactive surfaces |
| Elevated panel  | `0.15`  | Success panels, nested cards |
| Input (default) | `0.4`   | Form inputs dark state       |
| Input (focus)   | `0.6`   | Form inputs when focused     |
| Footer/sections | `0.55`  | Background accents           |

### Complete Glassmorphic Card Example

```tsx
<div
  className="flex flex-col gap-6
             rounded-[30px]
             border border-white/10
             bg-[color:var(--color-surface)]/[0.03]
             shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1),0_0_0_1px_rgba(255,255,255,0.05)]
             backdrop-blur-xl"
  style={{ padding: '24px' }}
>
  <h2 className="font-display text-2xl">Glassmorphic Card</h2>
  <p className="font-body text-[color:var(--color-text-secondary)]">
    Semi-transparent surface with frosted glass effect
  </p>
</div>
```

### Input Field Glassmorphism

Inputs use darker glassmorphic treatment for contrast:

```tsx
<input
  className="w-full rounded-2xl
             border-2 border-white/10
             bg-[rgba(20,20,19,0.4)]
             backdrop-blur-sm
             px-6 py-5 text-lg
             text-[color:var(--color-text-primary)]
             placeholder:text-[color:var(--color-text-muted)]
             focus:border-[color:var(--color-primary)]
             focus:bg-[rgba(20,20,19,0.6)]
             focus:shadow-[0_0_0_4px_rgba(196,114,79,0.1)]
             focus:outline-none"
  placeholder="Enter text..."
/>
```

**Key Characteristics:**

- Dark base: `rgba(20,20,19,0.4)` (40% opaque)
- Light blur: `backdrop-blur-sm` (8px)
- **Focus darkening**: Opacity increases to `0.6` (60%)
- Custom focus ring: Terracotta glow at 10% opacity

### Success Panel Glass Effect

```tsx
<div
  className="flex flex-col gap-4
               rounded-[20px]
               bg-[color:var(--color-surface-elevated)]/[0.15]
               p-8
               backdrop-blur-sm"
>
  <div className="flex items-center gap-2">
    <CheckIcon className="h-6 w-6 text-[color:var(--color-success)]" />
    <p className="font-ui text-sm font-medium text-[color:var(--color-success)]">Success!</p>
  </div>
</div>
```

**Characteristics:**

- Surface elevated color at 15% (more visible than main card)
- Lighter blur (`backdrop-blur-sm` = 8px)
- Slightly smaller radius (20px) for nested hierarchy

### Shadow System

#### Standard Card Shadows

```css
/* Base card */
box-shadow: 0 20px 36px -26px var(--color-shadow);

/* Hovered card */
box-shadow: 0 32px 52px -28px var(--color-shadow-hover);

/* Elevated card */
box-shadow:
  0 32px 60px -36px var(--color-shadow),
  0 0 0 1px color-mix(in srgb, var(--color-border) 68%, transparent);
```

#### Utility Shadow Classes

```css
.shadow-soft {
  box-shadow: 0 10px 30px -20px var(--color-shadow);
}

.shadow-medium {
  box-shadow: 0 16px 35px -24px var(--color-shadow);
}

.shadow-large {
  box-shadow: 0 28px 60px -30px var(--color-shadow);
}
```

#### Button Glassmorphic Shadow

```css
box-shadow:
  0 4px 20px rgba(196, 114, 79, 0.3),
  /* Terracotta glow */ inset 0 1px 0 rgba(255, 255, 255, 0.2); /* Top highlight */
```

### Performance Tips

- **Limit backdrop-blur usage** to key surfaces only (expensive operation)
- **Prefer preset values** (`backdrop-blur-sm`, `-xl`) over custom values
- **Never animate blur** directly (animate opacity/transform instead)
- **Layer semi-transparent surfaces** instead of multiple blur layers
- **Keep border opacity 5-20%** for subtle but visible definition

---

## Interactive Grid Background

The interactive grid is QorkMe's signature background element—a subtle, responsive SVG pattern that reacts to hover with terracotta glows while maintaining organic texture through noise filtering.

### Complete Implementation

```tsx
// components/ui/interactive-grid-pattern.tsx
'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';

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
  squares,
  squaresClassName = '',
}: InteractiveGridPatternProps) {
  const [hoveredCells, setHoveredCells] = useState<Set<string>>(new Set());
  const [gridSize, setGridSize] = useState({ cols: 20, rows: 20 });
  const containerRef = useRef<SVGSVGElement>(null);

  // Dynamically calculate grid size based on viewport
  useEffect(() => {
    const updateGridSize = () => {
      const cols = Math.ceil(window.innerWidth / width) + 2;
      const rows = Math.ceil(window.innerHeight / height) + 2;
      setGridSize({ cols, rows });
    };

    updateGridSize();
    window.addEventListener('resize', updateGridSize);
    return () => window.removeEventListener('resize', updateGridSize);
  }, [width, height]);

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

  const cols = squares ? squares[0] : gridSize.cols;
  const rows = squares ? squares[1] : gridSize.rows;

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

        {/* Noise texture for organic opacity variation */}
        <filter id="noise-texture" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.025"    {/* Low frequency = larger patterns */}
            numOctaves="3"           {/* Noise detail layers */}
            seed="42"                {/* Deterministic */}
            result="noise"
          />
          <feColorMatrix
            in="noise"
            type="matrix"
            values="0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 0.6 0.4"   {/* Alpha = (noise × 0.6) + 0.4 */}
            result="noiseAlpha"
          />
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
                style={{ cursor: 'default' }}
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
```

### Usage Pattern

```tsx
// In your page component
<div className="relative min-h-screen">
  {/* Interactive grid background */}
  <InteractiveGridPattern className="absolute inset-0 z-0" width={40} height={40} />

  {/* Page content appears above grid */}
  <div className="relative z-10">
    <YourContent />
  </div>
</div>
```

### Design Specifications

**Visual Properties:**

- **Cell size:** 40×40px (creates ~20×20 grid on typical viewports)
- **Line color:** `var(--color-border-strong)` (warm gray)
- **Line opacity:** `0.6` (60% visible)
- **Line weight:** 1px
- **Hover fill:** `var(--color-primary)` (terracotta)
- **Hover opacity:** `0.12` (12% subtle glow)
- **Transition:** 300ms ease-out

**Noise Filter:**

- **Type:** Fractal noise (smooth, cloud-like)
- **Base frequency:** `0.025` (larger, subtler patterns)
- **Octaves:** `3` (layered detail)
- **Opacity range:** 0.4-1.0 (40-100%)
- **Effect:** Creates organic paper-like texture

**Performance:**

- Single SVG element (minimal DOM)
- State tracks only hovered cells (not all 2000+)
- CSS transitions (GPU accelerated)
- 60fps on all modern devices

### Customization Options

```tsx
// Fixed grid size (performance optimization)
<InteractiveGridPattern
  squares={[25, 25]}    // 25×25 grid (625 cells)
  width={50}            // Larger cells (50px)
  height={50}
/>

// Custom cell styling
<InteractiveGridPattern
  squaresClassName="hover:fill-blue-500"  // Custom hover color
/>

// Without viewport resizing (static)
<InteractiveGridPattern
  squares={[20, 20]}    // Fixed grid prevents resize calculations
/>
```

---

## Matrix Display System

The dot-matrix display is QorkMe's most distinctive visual element—rendering retro-style circular dots in terracotta to display animated titles and real-time clock information.

### Core Matrix Component

```tsx
// components/ui/matrix.tsx (simplified core)
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

export type Frame = number[][]; // [row][col] brightness 0..1

export interface MatrixProps {
  rows: number;
  cols: number;
  pattern?: Frame; // Static pattern
  frames?: Frame[]; // Animation frames
  fps?: number;
  autoplay?: boolean;
  loop?: boolean;
  size?: number; // Cell size in pixels
  gap?: number; // Gap between cells
  palette?: {
    on: string; // Full brightness color
    off: string; // Dim/off color
  };
  brightness?: number;
  ariaLabel?: string;
  cascadeDelay?: number;
  cascadeStartDelay?: number;
  className?: string;
}

export function Matrix({
  rows,
  cols,
  pattern,
  frames,
  fps = 12,
  autoplay = true,
  loop = true,
  size = 10,
  gap = 2,
  palette = {
    on: 'currentColor',
    off: 'var(--muted-foreground)',
  },
  brightness = 1,
  ariaLabel,
  cascadeDelay = 0,
  cascadeStartDelay = 0,
  className = '',
}: MatrixProps) {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [cascadeProgress, setCascadeProgress] = useState(0);
  const frameRef = useRef(0);

  // Animation loop
  useEffect(() => {
    if (!frames || !autoplay) return;

    const interval = setInterval(() => {
      setCurrentFrame((prev) => {
        const next = prev + 1;
        return loop ? next % frames.length : Math.min(next, frames.length - 1);
      });
    }, 1000 / fps);

    return () => clearInterval(interval);
  }, [frames, fps, autoplay, loop]);

  // Cascade animation
  useEffect(() => {
    if (cascadeDelay === 0) {
      setCascadeProgress(1);
      return;
    }

    const timeout = setTimeout(() => {
      const totalCells = rows * cols;
      const interval = setInterval(() => {
        setCascadeProgress((prev) => {
          const next = prev + 1 / totalCells;
          if (next >= 1) {
            clearInterval(interval);
            return 1;
          }
          return next;
        });
      }, cascadeDelay);
    }, cascadeStartDelay);

    return () => clearTimeout(timeout);
  }, [rows, cols, cascadeDelay, cascadeStartDelay]);

  const activePattern = pattern || (frames ? frames[currentFrame] : []);

  const width = cols * size + (cols - 1) * gap;
  const height = rows * size + (rows - 1) * gap;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      role="img"
      aria-label={ariaLabel}
    >
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((_, c) => {
          const cellBrightness = activePattern[r]?.[c] ?? 0;
          const cellIndex = r * cols + c;
          const cascadeVisible = cascadeProgress >= cellIndex / (rows * cols);

          const opacity = cascadeVisible ? cellBrightness * brightness : 0;
          const color = cellBrightness > 0.5 ? palette.on : palette.off;

          return (
            <circle
              key={`${r}-${c}`}
              cx={c * (size + gap) + size / 2}
              cy={r * (size + gap) + size / 2}
              r={size / 2}
              fill={color}
              opacity={opacity}
              style={{
                transition: `opacity ${1000 / fps}ms ease-out`,
              }}
            />
          );
        })
      )}
    </svg>
  );
}

// Character definitions (5×7 grid)
export const digits: Record<string, Frame> = {
  '0': [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 1, 1],
    [1, 0, 1, 0, 1],
    [1, 1, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  '1': [
    [0, 0, 1, 0, 0],
    [0, 1, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 1, 1, 0],
  ],
  // ... additional digits
};

export const letters: Record<string, Frame> = {
  Q: [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 1, 0, 1],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 1, 1],
  ],
  // ... additional letters
  ':': [
    [0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
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
};
```

### QorkMe Title Implementation

```tsx
// components/MatrixDisplay.tsx (title portion)
'use client';

import { useEffect, useMemo, useState } from 'react';
import { Matrix, digits, letters, type Frame } from '@/components/ui/matrix';

export function MatrixDisplay() {
  const [time, setTime] = useState(new Date());
  const [frameIndex, setFrameIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Shimmer animation (10 FPS)
  useEffect(() => {
    const interval = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % 24);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Generate shimmer brightness values
  const titleShimmerFrames = useMemo(() => {
    const frames: number[][] = [];
    const charCount = 7; // "Qork.Me"

    for (let f = 0; f < 24; f++) {
      const brightness: number[] = [];
      for (let i = 0; i < charCount; i++) {
        const phase = (i / charCount) * Math.PI * 2;
        const progress = (f / 24) * Math.PI * 2;
        const shimmer = Math.sin(progress + phase) * 0.15 + 0.85;
        brightness.push(Math.max(0.7, Math.min(1.0, shimmer)));
      }
      frames.push(brightness);
    }

    return frames;
  }, []);

  // Bold pattern generator
  function makeBoldPattern(pattern: Frame): Frame {
    const rows = pattern.length;
    const cols = pattern[0]?.length || 0;
    const bold: Frame = Array.from({ length: rows }, () => Array(cols).fill(0));

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (pattern[r][c] > 0) {
          bold[r][c] = 1;
          if (c + 1 < cols) bold[r][c + 1] = 1;
          if (r + 1 < rows) bold[r + 1][c] = 1;
          if (r + 1 < rows && c + 1 < cols) bold[r + 1][c + 1] = 1;
        }
      }
    }

    return bold;
  }

  // Render text into frame
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

      currentCol += 6; // 5px character + 1px spacing
    }
  }

  // Create title frame
  const titleFrame = useMemo(() => {
    const rows = 9;
    const cols = 50;
    const frame: Frame = Array.from({ length: rows }, () => Array(cols).fill(0));

    const titleText = 'Qork.Me';
    const titleWidth = titleText.length * 6 - 1;
    const startCol = Math.floor((cols - titleWidth) / 2);

    // Create bold letters
    const boldLetters: Record<string, Frame> = {};
    for (const [char, pattern] of Object.entries(letters)) {
      boldLetters[char] = makeBoldPattern(pattern);
    }

    renderTextToFrame(frame, titleText, 1, startCol, boldLetters, titleShimmerFrames[frameIndex]);

    return frame;
  }, [frameIndex, titleShimmerFrames]);

  // Create time frame (12-hour format)
  const timeFrame = useMemo(() => {
    const rows = 9;
    const cols = 66;
    const frame: Frame = Array.from({ length: rows }, () => Array(cols).fill(0));

    const hours24 = time.getHours();
    const hours12 = hours24 % 12 || 12;
    const minutes = time.getMinutes().toString().padStart(2, '0');
    const seconds = time.getSeconds().toString().padStart(2, '0');
    const period = hours24 >= 12 ? 'PM' : 'AM';
    const timeText = `${hours12.toString().padStart(2, '0')}:${minutes}:${seconds} ${period}`;

    const timeWidth = 14 * 6 - 1;
    const startCol = Math.floor((cols - timeWidth) / 2);

    const timeChars = {
      ...digits,
      ':': letters[':'],
      ' ': letters[' '],
      A: letters['A'],
      P: letters['P'],
      M: letters['M'],
    };
    renderTextToFrame(frame, timeText, 1, startCol, timeChars);

    return frame;
  }, [time]);

  const palette = {
    on: 'rgba(196, 114, 79, 1)', // Terracotta
    off: 'rgba(196, 114, 79, 0.08)', // 8% opacity
  };

  if (!mounted) return <div style={{ height: '200px' }} />;

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Title Matrix with radial fade */}
      <div
        style={{
          WebkitMaskImage:
            'radial-gradient(ellipse 100% 100% at center, black 30%, rgba(0,0,0,0.8) 50%, rgba(0,0,0,0.4) 70%, transparent 100%)',
          maskImage:
            'radial-gradient(ellipse 100% 100% at center, black 30%, rgba(0,0,0,0.8) 50%, rgba(0,0,0,0.4) 70%, transparent 100%)',
        }}
      >
        <Matrix
          rows={9}
          cols={50}
          pattern={titleFrame}
          size={8}
          gap={2}
          palette={palette}
          ariaLabel="Qork.Me animated title"
          cascadeDelay={8}
          cascadeStartDelay={200}
        />
      </div>

      {/* Time Matrix */}
      <div
        style={{
          WebkitMaskImage:
            'radial-gradient(ellipse 100% 100% at center, black 30%, rgba(0,0,0,0.8) 50%, rgba(0,0,0,0.4) 70%, transparent 100%)',
          maskImage:
            'radial-gradient(ellipse 100% 100% at center, black 30%, rgba(0,0,0,0.8) 50%, rgba(0,0,0,0.4) 70%, transparent 100%)',
        }}
      >
        <Matrix
          rows={9}
          cols={66}
          pattern={timeFrame}
          size={6}
          gap={2}
          palette={palette}
          ariaLabel="Current time"
          cascadeDelay={6}
          cascadeStartDelay={500}
        />
      </div>
    </div>
  );
}
```

### Matrix Specifications

**Color Palette:**

- **On:** `rgba(196, 114, 79, 1)` - Full terracotta
- **Off:** `rgba(196, 114, 79, 0.08)` - 8% opacity (ghost pixels)

**Sizing (Desktop):**

- **Title:** 9 rows × 50 cols, 8px cells, 2px gap (~500px wide)
- **Time:** 9 rows × 66 cols, 6px cells, 2px gap (~528px wide)

**Sizing (Mobile):**

- **Title:** 9 rows × 26 cols, 5px cells ("Qork" only)
- **Time:** 9 rows × 50 cols, 3px cells (no seconds)

**Animation:**

- **Shimmer:** 24 frames at 10 FPS (100ms intervals)
- **Brightness range:** 0.7-1.0 (70-100%)
- **Phase offset:** Each character leads/lags by `2π / charCount`
- **Cascade:** 8ms delay per cell, 200ms start delay

**Radial Fade Mask:**

```css
radial-gradient(
  ellipse 100% 100% at center,
  black 30%,                /* Full opacity center */
  rgba(0,0,0,0.8) 50%,      /* Slight fade */
  rgba(0,0,0,0.4) 70%,      /* Moderate fade */
  transparent 100%          /* Fully transparent edges */
)
```

---

## Component Library

### Buttons

#### Primary Button (Standard)

```tsx
<button
  className="
  btn
  font-ui
  [font-weight:var(--weight-ui-button)]
  tracking-[0.02em]
  bg-[color:var(--color-primary)]
  text-[color:var(--color-text-inverse)]
  border border-[color:var(--color-primary)]
  shadow-soft
  hover:bg-[color:var(--color-primary-hover)]
  focus-visible:outline-none
  focus-visible:ring-2
  focus-visible:ring-[color:var(--color-ring)]
  focus-visible:ring-offset-2
  disabled:opacity-60
  disabled:cursor-not-allowed
  min-h-[46px]
  px-5
  rounded-[var(--radius-lg)]
  transition-all
  duration-[var(--transition-base)]
"
>
  Primary Action
</button>
```

#### Primary Button with Gradient

```tsx
<button
  className="
  btn
  w-full
  rounded-2xl
  border-none
  bg-gradient-to-br from-[color:var(--color-primary)] to-[#c56647]
  px-5 py-6
  font-ui text-lg font-semibold
  text-[color:var(--color-text-inverse)]
  shadow-[0_4px_20px_rgba(196,114,79,0.3),inset_0_1px_0_rgba(255,255,255,0.2)]
  hover:shadow-[0_6px_24px_rgba(196,114,79,0.4),inset_0_1px_0_rgba(255,255,255,0.2)]
  transition-all
  duration-[var(--transition-base)]
"
>
  Shorten URL
</button>
```

#### Secondary (Outline) Button

```tsx
<button
  className="
  btn
  font-ui
  [font-weight:var(--weight-ui-button)]
  bg-transparent
  text-[color:var(--color-text-secondary)]
  border border-[color:var(--color-border-strong)]
  hover:text-[color:var(--color-primary)]
  hover:border-[color:var(--color-primary)]
  hover:bg-[color:var(--color-primary)]/10
  min-h-[46px]
  px-5
  rounded-[var(--radius-lg)]
"
>
  Secondary Action
</button>
```

#### Ghost Button

```tsx
<button
  className="
  btn
  font-ui
  [font-weight:var(--weight-ui-button)]
  bg-transparent
  text-[color:var(--color-text-secondary)]
  border border-transparent
  hover:bg-[color:var(--color-surface-muted)]/55
  min-h-[46px]
  px-5
  rounded-[var(--radius-lg)]
"
>
  Ghost Action
</button>
```

### Input Fields

#### Standard Input

```tsx
<input
  type="text"
  className="
    input
    w-full
    text-base
    font-body
    placeholder:text-[color:var(--color-text-muted)]
    focus-visible:outline-none
    focus-visible:ring-0
  "
  placeholder="Enter text..."
/>
```

Where `.input` is defined in CSS:

```css
.input {
  background: var(--color-surface);
  border: 1px solid color-mix(in srgb, var(--color-border) 80%, transparent);
  border-radius: var(--radius-md);
  color: var(--color-text-primary);
  font-family: var(--font-body);
  min-height: 48px;
  padding-inline: 1rem;
  transition:
    border-color var(--transition-base),
    box-shadow var(--transition-base),
    background-color var(--transition-base);
}

.input:hover {
  border-color: color-mix(in srgb, var(--color-border-strong) 65%, transparent);
}

.input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--color-primary) 18%, transparent);
  background: color-mix(in srgb, var(--color-surface-elevated) 90%, var(--color-surface) 10%);
}
```

#### Glassmorphic Input (UrlShortener Style)

```tsx
<input
  type="url"
  className="
    w-full
    rounded-2xl
    border-2 border-white/10
    bg-[rgba(20,20,19,0.4)]
    backdrop-blur-sm
    px-6 py-5
    text-lg
    text-[color:var(--color-text-primary)]
    placeholder:text-[color:var(--color-text-muted)]
    focus:border-[color:var(--color-primary)]
    focus:bg-[rgba(20,20,19,0.6)]
    focus:shadow-[0_0_0_4px_rgba(196,114,79,0.1)]
    focus:outline-none
    transition-all
    duration-[var(--transition-base)]
  "
  placeholder="Enter Your URL — https://example.com/your/very/long/url/here..."
/>
```

### Cards

#### Standard Card

```tsx
<div className="card">
  <div className="flex flex-col gap-6">
    <h3 className="font-display text-2xl">Card Title</h3>
    <p className="font-body text-[color:var(--color-text-secondary)]">Card content goes here</p>
  </div>
</div>
```

Where `.card` is defined:

```css
.card {
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  padding: var(--card-padding);
  border: 1px solid color-mix(in srgb, var(--color-border) 70%, transparent);
  box-shadow: 0 20px 36px -26px var(--color-shadow);
  transition:
    transform var(--transition-base),
    box-shadow var(--transition-base);
}

.card:hover {
  box-shadow: 0 32px 52px -28px var(--color-shadow-hover);
}
```

#### Glassmorphic Card

```tsx
<div
  className="
    flex flex-col gap-6
    rounded-[30px]
    border border-white/10
    bg-[color:var(--color-surface)]/[0.03]
    shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1),0_0_0_1px_rgba(255,255,255,0.05)]
    backdrop-blur-xl
  "
  style={{ padding: '24px' }}
>
  <h3 className="font-display text-2xl">Glassmorphic Card</h3>
  <p className="font-body text-[color:var(--color-text-secondary)]">
    Semi-transparent surface with frosted effect
  </p>
</div>
```

### Loading Spinner

```tsx
<div className="flex min-h-[200px] items-center justify-center">
  <div className="flex flex-col items-center gap-4">
    <div
      className="
      h-12 w-12
      animate-spin
      rounded-full
      border-4
      border-[color:var(--color-surface-muted)]
      border-t-[color:var(--color-primary)]
    "
    />
    <p className="font-ui text-sm text-[color:var(--color-text-muted)]">Loading...</p>
  </div>
</div>
```

### Success Panel

```tsx
<div className="flex flex-col gap-6">
  <div
    className="
    flex flex-col gap-4
    rounded-[20px]
    bg-[color:var(--color-surface-elevated)]/[0.15]
    p-8
    backdrop-blur-sm
  "
  >
    {/* Success indicator */}
    <div className="flex items-center gap-2">
      <svg
        className="h-6 w-6 text-[color:var(--color-success)]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
      <p className="font-ui text-sm font-medium text-[color:var(--color-success)]">Success!</p>
    </div>

    {/* Result display */}
    <div className="flex items-center gap-3 rounded-xl bg-[rgba(255,255,255,0.05)] p-4">
      <p className="flex-1 font-mono text-lg text-[color:var(--color-text-primary)] break-all">
        https://qork.me/abc123
      </p>

      {/* Copy button */}
      <button
        className="
          flex-shrink-0
          rounded-lg
          bg-[color:var(--color-primary)]/20
          p-2
          text-[color:var(--color-primary)]
          transition-colors
          hover:bg-[color:var(--color-primary)]/30
        "
        aria-label="Copy to clipboard"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
      </button>
    </div>
  </div>
</div>
```

### Footer

```tsx
<footer
  className="
  border-t border-[color:var(--color-border)]/60
  bg-[color:var(--color-background-accent)]/55
  py-14 md:py-16
"
>
  <div className="container flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
    {/* Brand */}
    <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-6">
      <span
        className="
        font-display
        text-xl md:text-2xl
        font-normal
        uppercase
        tracking-[0.16em]
        text-[color:var(--color-text-primary)]
        md:leading-none
      "
      >
        QORKME
      </span>
      <span
        className="
        text-sm md:text-base
        text-[color:var(--color-text-muted)]
        leading-relaxed
        md:border-l md:border-[color:var(--color-border)]/60 md:pl-6 md:leading-none
      "
      >
        Thoughtful short links for modern teams
      </span>
    </div>

    {/* Links */}
    <div className="flex flex-col gap-2 text-sm md:flex-row md:items-center md:gap-6">
      <span className="text-[color:var(--color-text-muted)]">Powered by Supabase &amp; Vercel</span>
      <a
        href="/admin"
        className="
          font-semibold
          uppercase
          tracking-[0.12em]
          text-[color:var(--color-secondary)]
          transition-colors
          hover:text-[color:var(--color-primary)]
        "
      >
        Admin
      </a>
    </div>
  </div>
</footer>
```

---

## Animation & Motion

### Keyframe Animations

#### fadeIn

```css
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Usage classes */
.animate-fadeIn {
  animation: fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}
.animate-fadeIn-delay-200 {
  animation: fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.2s both;
}
.animate-fadeIn-delay-800 {
  animation: fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.8s both;
}
.animate-fadeIn-delay-1200 {
  animation: fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) 1.2s both;
}
```

**Usage:**

```tsx
<div className="animate-fadeIn">Fades in immediately</div>
<div className="animate-fadeIn-delay-200">Fades in after 200ms</div>
```

#### pulse

```css
@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.04);
    opacity: 0.75;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

#### shimmer

```css
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-shimmer {
  position: relative;
  overflow: hidden;
}

.animate-shimmer::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.16), transparent);
  animation: shimmer 2s infinite;
}
```

#### float

```css
@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-6px);
  }
}

.animate-float {
  animation: float 3.8s ease-in-out infinite;
}
```

### Transition Patterns

**Fade State Transition:**

```tsx
const [fadeState, setFadeState] = useState<'in' | 'out'>('in');

// Trigger fade out before state change
const handleTransition = () => {
  setFadeState('out');

  setTimeout(() => {
    // Change state after fade completes
    setShowNewContent(true);
    setFadeState('in');
  }, 200); // Match transition duration
};

// Apply to element
<div
  className={`transition-opacity duration-200 ${fadeState === 'in' ? 'opacity-100' : 'opacity-0'}`}
>
  {content}
</div>;
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Respects user preference for reduced motion.

---

## Responsive Design

### Breakpoints

```css
sm: 640px    /* Small tablets */
md: 768px    /* Tablets */
lg: 1024px   /* Small laptops */
xl: 1280px   /* Desktops */
2xl: 1536px  /* Large desktops */
```

### Responsive Patterns

**Visibility:**

```tsx
{
  /* Mobile only */
}
<div className="md:hidden">Mobile content</div>;

{
  /* Desktop only */
}
<div className="hidden md:block">Desktop content</div>;
```

**Layout Changes:**

```tsx
{
  /* Stack on mobile, row on desktop */
}
<div className="flex flex-col md:flex-row gap-4 md:gap-6">
  <div>Item 1</div>
  <div>Item 2</div>
</div>;
```

**Grid Columns:**

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{/* Cards */}</div>
```

### Tailwind v4 Compatibility

**Issue:** Large spacing utilities may not generate in Tailwind v4.

**Solution:** Use inline styles for guaranteed results:

```tsx
{
  /* ❌ May not work */
}
<div className="px-6 mx-4">Content</div>;

{
  /* ✅ Guaranteed to work */
}
<div style={{ paddingLeft: '24px', paddingRight: '24px', marginLeft: '16px', marginRight: '16px' }}>
  Content
</div>;
```

### Mobile-Specific Spacing

```tsx
{
  /* Fixed padding via inline styles */
}
<div style={{ padding: '24px' }}>
  <UrlShortener />
</div>;

{
  /* Responsive gaps */
}
<div className="flex flex-col gap-4 md:gap-6 lg:gap-8">{/* Content */}</div>;
```

---

## Accessibility

### Focus States

All interactive elements must have visible focus indicators:

```css
:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 3px;
}

.btn:focus-visible {
  outline: 2px solid var(--color-ring);
  outline-offset: 2px;
}
```

### ARIA Labels

```tsx
{
  /* Buttons with icons */
}
<button aria-label="Copy to clipboard">
  <CopyIcon />
</button>;

{
  /* Matrix displays */
}
<Matrix ariaLabel="Current time in 12-hour format" />;

{
  /* Loading states */
}
<div role="status" aria-live="polite">
  <Spinner />
  <span className="sr-only">Loading...</span>
</div>;
```

### Screen Reader Only Class

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

**Usage:**

```tsx
<label htmlFor="url-input" className="sr-only">
  Enter Your URL
</label>
<input id="url-input" />
```

### Content Width

```css
p {
  max-width: 65ch; /* Optimal reading width */
}
```

---

## Implementation Guide

### Setting Up QorkMe Style

**1. Install Dependencies**

```bash
npm install tailwindcss@next @tailwindcss/typography
npm install @fontsource/inter  # or use Google Fonts CDN
```

**2. Configure Fonts**

Place ZT Bros Oskon woff2 files in `public/fonts/`:

- `ZTBrosOskon90s-Regular.woff2`
- `ZTBrosOskon90s-SemiBold.woff2`
- etc.

**3. Create globals.css**

```css
@import 'tailwindcss';

/* Font faces */
@font-face {
  font-family: 'ZT Bros Oskon';
  src: url('/fonts/ZTBrosOskon90s-SemiBold.woff2') format('woff2');
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;900&display=swap');

/* CSS Custom Properties */
:root {
  --color-background: #f6f1e8;
  --color-surface: #ffffff;
  --color-primary: #c4724f;
  --color-accent: #5f7d58;
  --color-text-primary: #2f2a26;
  --color-text-secondary: #49413a;
  --color-text-muted: #6b6159;
  --color-border: rgba(108, 96, 81, 0.18);
  --color-border-strong: rgba(79, 69, 58, 0.32);

  --font-display: 'ZT Bros Oskon', serif;
  --font-body: 'Inter', sans-serif;
  --font-ui: 'Inter', sans-serif;

  --weight-body-regular: 400;
  --weight-body-strong: 500;
  --weight-ui-button: 900;
  --weight-display-strong: 600;

  --radius-sm: 12px;
  --radius-md: 16px;
  --radius-lg: 22px;
  --radius-xl: 28px;
  --radius-full: 9999px;

  --transition-fast: 140ms ease;
  --transition-base: 240ms ease;
  --transition-slow: 420ms ease;
}

/* Base Styles */
body {
  min-height: 100vh;
  background: var(--color-background);
  color: var(--color-text-primary);
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: var(--weight-body-regular);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  font-family: var(--font-display);
  font-weight: 600;
  letter-spacing: 0.008em;
  line-height: 1.15;
  color: var(--color-text-primary);
}

/* Utility Classes */
.card {
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  border: 1px solid color-mix(in srgb, var(--color-border) 70%, transparent);
  box-shadow: 0 20px 36px -26px rgba(40, 32, 26, 0.08);
}

.btn {
  font-family: var(--font-ui);
  font-weight: var(--weight-ui-button);
  border-radius: var(--radius-lg);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
  min-height: 46px;
  padding-inline: 1.6rem;
  transition: all var(--transition-base);
}

.input {
  background: var(--color-surface);
  border: 1px solid color-mix(in srgb, var(--color-border) 80%, transparent);
  border-radius: var(--radius-md);
  color: var(--color-text-primary);
  font-family: var(--font-body);
  min-height: 48px;
  padding-inline: 1rem;
  transition:
    border-color var(--transition-base),
    box-shadow var(--transition-base);
}

.input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--color-primary) 18%, transparent);
  outline: none;
}
```

**4. Add Components**

Copy InteractiveGridPattern and Matrix components from the implementation examples above.

**5. Use in Layout**

```tsx
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen">
      <InteractiveGridPattern className="absolute inset-0 z-0" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
```

### Quick Start Checklist

- [ ] Install ZT Bros Oskon font files
- [ ] Configure CSS custom properties
- [ ] Set up Tailwind CSS v4
- [ ] Copy InteractiveGridPattern component
- [ ] Copy Matrix component
- [ ] Create utility classes (.card, .btn, .input)
- [ ] Test theme switching
- [ ] Verify accessibility (focus states, ARIA labels)
- [ ] Test responsive behavior
- [ ] Optimize performance (check FPS)

---

_This brand and design system guide is comprehensive and verbose by design, intended for creating new websites in the QorkMe visual style with complete implementation details and examples._

---

# Reference Documentation

> **Note**: The following sections contain detailed reference documentation from the original component libraries. Some information may be redundant with the sections above. These are included for completeness and cross-project reference. For actual QorkMe implementation details, refer to the main sections above.

---

## Matrix Component Reference

---

title: Matrix
description: A retro dot-matrix display component with circular cells and smooth animations. Perfect for retro displays, indicators, and audio visualizations.
featured: true
component: true

---

<ComponentPreview
  name="matrix-demo"
  description="An interactive matrix display with smooth animations and unified patterns."
  hideCode={true}
/>

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">CLI</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx @elevenlabs/agents-cli@latest components add matrix
```

</TabsContent>

<TabsContent value="manual">

<Steps>

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource name="matrix" title="components/ui/matrix.tsx" />

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx showLineNumbers
import { digits, loader, Matrix, vu, wave } from '@/components/ui/matrix';
```

### Static Pattern

```tsx showLineNumbers
<Matrix rows={7} cols={5} pattern={digits[5]} ariaLabel="Number five" />
```

### Animated Display

```tsx showLineNumbers
<Matrix rows={7} cols={7} frames={wave} fps={20} loop ariaLabel="Wave animation" />
```

### VU Meter

```tsx showLineNumbers
<Matrix
  rows={7}
  cols={12}
  mode="vu"
  levels={[0.1, 0.6, 0.9, 0.7, 0.4, 0.8, 0.5, 0.3, 0.6, 0.9, 0.5, 0.2]}
/>
```

## API Reference

### Matrix

The main matrix display component.

```tsx
<Matrix rows={7} cols={7} frames={wave} fps={20} />
```

#### Props

| Prop       | Type                                   | Description                                                    |
| ---------- | -------------------------------------- | -------------------------------------------------------------- |
| rows       | `number`                               | Number of rows in the matrix (required)                        |
| cols       | `number`                               | Number of columns in the matrix (required)                     |
| pattern    | `Frame`                                | Static pattern to display (2D array of brightness values 0-1)  |
| frames     | `Frame[]`                              | Array of frames for animation (ignored if pattern is provided) |
| fps        | `number`                               | Frames per second for animation. Default: 12                   |
| autoplay   | `boolean`                              | Start animation automatically. Default: true                   |
| loop       | `boolean`                              | Loop animation. Default: true                                  |
| size       | `number`                               | Cell size in pixels. Default: 10                               |
| gap        | `number`                               | Gap between cells in pixels. Default: 2                        |
| palette    | `{on: string, off: string}`            | CSS colors for on/off states. Defaults to theme colors         |
| brightness | `number`                               | Global brightness multiplier (0-1). Default: 1                 |
| ariaLabel  | `string`                               | ARIA label for accessibility                                   |
| onFrame    | `(index: number) => void`              | Callback when frame changes during animation                   |
| mode       | `"default" \| "vu"`                    | Display mode. Default: "default"                               |
| levels     | `number[]`                             | Live levels for VU meter mode (0-1 per column)                 |
| className  | `string`                               | Additional CSS classes                                         |
| ...props   | `React.HTMLAttributes<HTMLDivElement>` | All standard div element props                                 |

### Frame Type

```tsx
type Frame = number[][]; // [row][col] brightness 0..1
```

A frame is a 2D array where each value represents the brightness of a cell (0 = off, 1 = full brightness).

Example:

```tsx
const smiley: Frame = [
  [0, 1, 1, 1, 0],
  [1, 0, 0, 0, 1],
  [1, 1, 0, 1, 1],
  [1, 0, 0, 0, 1],
  [0, 1, 1, 1, 0],
];
```

## Presets

The component comes with several built-in presets and animations:

### digits

7-segment style digits (0-9) on a 7×5 grid.

```tsx
import { digits, Matrix } from '@/components/ui/matrix';

export default () => <Matrix rows={7} cols={5} pattern={digits[5]} />;
```

### loader

Rotating spinner animation (7×7, 12 frames).

```tsx
import { loader, Matrix } from '@/components/ui/matrix';

export default () => <Matrix rows={7} cols={7} frames={loader} fps={12} />;
```

### pulse

Expanding pulse effect (7×7, 16 frames).

```tsx
import { Matrix, pulse } from '@/components/ui/matrix';

export default () => <Matrix rows={7} cols={7} frames={pulse} fps={16} />;
```

### wave

Smooth sine wave animation (7×7, 24 frames).

```tsx
import { Matrix, wave } from '@/components/ui/matrix';

export default () => <Matrix rows={7} cols={7} frames={wave} fps={20} />;
```

### snake

Snake traversal pattern (7×7, ~40 frames).

```tsx
import { Matrix, snake } from '@/components/ui/matrix';

export default () => <Matrix rows={7} cols={7} frames={snake} fps={15} />;
```

### chevronLeft / chevronRight

Simple directional arrows (5×5).

```tsx
import { chevronLeft, Matrix } from '@/components/ui/matrix';

export default () => <Matrix rows={5} cols={5} pattern={chevronLeft} />;
```

### vu()

Helper function to create VU meter frames.

```tsx
import { Matrix, vu } from '@/components/ui/matrix';

export default () => {
  const levels = [0.3, 0.6, 0.9, 0.7, 0.5];
  return <Matrix rows={7} cols={5} pattern={vu(5, levels)} />;
};
```

## Examples

### Retro Display

```tsx showLineNumbers
function RetroDisplay() {
  return (
    <div className="bg-muted/30 rounded-lg border p-8">
      <Matrix
        rows={7}
        cols={7}
        frames={wave}
        fps={20}
        size={16}
        gap={3}
        palette={{
          on: 'hsl(142 76% 36%)',
          off: 'hsl(142 76% 10%)',
        }}
        ariaLabel="Wave animation"
      />
    </div>
  );
}
```

### Digital Clock Digit

```tsx showLineNumbers
function ClockDigit({ value }: { value: number }) {
  return (
    <Matrix
      rows={7}
      cols={5}
      pattern={digits[value]}
      size={12}
      gap={2}
      ariaLabel={`Digit ${value}`}
    />
  );
}
```

### Audio Level Meter

```tsx showLineNumbers
function AudioMeter({ frequencyData }: { frequencyData: number[] }) {
  // Convert frequency data to 0-1 levels
  const levels = frequencyData.map((freq) => freq / 255);

  return (
    <Matrix
      rows={7}
      cols={frequencyData.length}
      mode="vu"
      levels={levels}
      size={8}
      gap={1}
      ariaLabel="Audio frequency meter"
    />
  );
}
```

### Custom Pattern

```tsx showLineNumbers
function Heart() {
  const heartPattern: Frame = [
    [0, 1, 1, 0, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 0],
    [0, 0, 1, 1, 1, 0, 0],
    [0, 0, 0, 1, 0, 0, 0],
  ];

  return (
    <Matrix
      rows={6}
      cols={7}
      pattern={heartPattern}
      size={14}
      gap={2}
      palette={{
        on: 'hsl(0 84% 60%)',
        off: 'hsl(0 84% 20%)',
      }}
    />
  );
}
```

## Advanced Usage

### Creating Custom Animations

```tsx showLineNumbers
function CustomAnimation() {
  // Create a simple blink animation
  const frames: Frame[] = [
    [
      [1, 0, 1],
      [0, 1, 0],
      [1, 0, 1],
    ], // Frame 1
    [
      [0, 1, 0],
      [1, 0, 1],
      [0, 1, 0],
    ], // Frame 2
  ];

  return <Matrix rows={3} cols={3} frames={frames} fps={2} loop />;
}
```

### Frame Change Callback

```tsx showLineNumbers
function AnimationTracker() {
  const [currentFrame, setCurrentFrame] = useState(0);

  return (
    <div>
      <Matrix rows={7} cols={7} frames={loader} fps={12} onFrame={setCurrentFrame} />
      <p>Frame: {currentFrame}</p>
    </div>
  );
}
```

### Dynamic VU Meter

```tsx showLineNumbers
function LiveVUMeter() {
  const [levels, setLevels] = useState(Array(12).fill(0));

  useEffect(() => {
    // Simulate audio levels
    const interval = setInterval(() => {
      setLevels(Array.from({ length: 12 }, () => Math.random()));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return <Matrix rows={7} cols={12} mode="vu" levels={levels} size={10} gap={2} />;
}
```

## Theming

The component uses CSS variables for theming:

```tsx
<Matrix
  palette={{
    on: 'currentColor', // Active cells (default - inherits text color)
    off: 'var(--muted-foreground)', // Inactive cells (default - muted but visible)
  }}
/>
```

### Classic Phosphor Green

```tsx
palette={{
  on: "hsl(142 76% 36%)",
  off: "hsl(142 76% 10%)",
}}
```

### Amber Terminal

```tsx
palette={{
  on: "hsl(38 92% 50%)",
  off: "hsl(38 92% 15%)",
}}
```

### Blue Neon

```tsx
palette={{
  on: "hsl(200 98% 39%)",
  off: "hsl(200 98% 12%)",
}}
```

## Performance

- Uses SVG for crisp rendering at any size
- Cell positions are precomputed and memoized
- Only opacity updates during frame transitions
- Stable FPS with time accumulator and `requestAnimationFrame`
- Tested with 7×7 (49 cells) and 16×16 (256 cells) grids
- Proper cleanup of animation frames on unmount

## Accessibility

- Container has `role="img"` for semantic meaning
- Configurable `aria-label` for description
- Animated displays use `aria-live="polite"`
- Frame information available via `onFrame` callback
- All interactive demos support keyboard navigation

## Notes

- Frames use brightness values from 0 (off) to 1 (full on)
- Circular cells provide a classic dot-matrix appearance
- VU meter mode provides real-time column-based visualization
- All presets are optimized for 7×7 or similar small grids
- Works in SSR environments (animation starts on mount)
- Compatible with all modern browsers
- Supports both light and dark themes

---

## Interactive Grid Pattern Reference

# React Interactive Grid Pattern

URL: /background/interactive-grid-pattern
React interactive grid background with Tron-style hover effects. Smooth 60fps performance and TypeScript integration with shadcn/ui styling.

---

title: React Interactive Grid Pattern
description: React interactive grid background with Tron-style hover effects. Smooth 60fps performance and TypeScript integration with shadcn/ui styling.
icon: Grid3x3
component: true

---

<PoweredBy packages={[{ name: "React", url: "https://reactjs.org/" }]} />

<Callout title="Trying to implement interactive grids?">
  [Join our Discord community](https://discord.com/invite/Z9NVtNE7bj) for help
  from other developers.
</Callout>

<br />

Static grids are boring. CSS-only grids can't track state. You need a grid that responds to users without killing performance. This React component creates an SVG grid where each cell lights up on hover, running at 60fps even with thousands of cells.

### Interactive hover effects

Watch grid cells illuminate as you move your cursor:

<Preview path="background/interactive-grid-pattern" />

Built for React and Next.js with full TypeScript support. The grid uses a single SVG element with minimal DOM manipulation, so hover effects stay smooth even on lower-end devices. Works perfectly with shadcn/ui design systems.

## Installation

<Installer packageName="interactive-grid-pattern" />

## Usage

```tsx
import { InteractiveGridPattern } from '@/components/ui/interactive-grid-pattern';

export default function Dashboard() {
  return (
    <div className="relative h-screen">
      <InteractiveGridPattern className="absolute inset-0" squares={[20, 20]} />
      <div className="relative z-10">{/* Your content */}</div>
    </div>
  );
}
```

## Why most interactive grids suck

Most developers create a div for each cell. Bad move. 400 cells = 400 DOM nodes = sluggish interactions. Others use canvas, which means managing a whole rendering context for what should be a simple hover effect.

This React component uses a single SVG with rect elements. Hover state is tracked with React's useState, but only for active cells. CSS transitions handle the visual changes. Result? Butter-smooth interactions even with 1000+ cells.

## Examples

### Colorful Hover Effects

Grid with vibrant colors that match your brand:

<Preview path="background/interactive-grid-pattern-colorful" />

### Multiple Variants

Different grid styles for various use cases:

<Preview path="background/interactive-grid-pattern-variants" />

## Features

- **Single SVG rendering** for thousands of cells without performance penalty
- **React state tracking** only for hovered cells
- **CSS transition animations** running at 60fps
- **TypeScript definitions** for proper IDE support in React projects
- **Customizable grid density** with width/height props
- **Responsive scaling** that adapts to container size
- **Radial gradient masking** for spotlight effects
- **shadcn/ui compatible** using Tailwind CSS classes

## API Reference

### InteractiveGridPattern

Main grid component that handles hover interactions.

| Prop               | Type               | Default    | Description                             |
| ------------------ | ------------------ | ---------- | --------------------------------------- |
| `className`        | `string`           | -          | Additional Tailwind CSS classes for SVG |
| `width`            | `number`           | `40`       | Width of each grid cell in pixels       |
| `height`           | `number`           | `40`       | Height of each grid cell in pixels      |
| `squares`          | `[number, number]` | `[24, 24]` | Grid dimensions \[columns, rows]        |
| `squaresClassName` | `string`           | -          | Classes for interactive square elements |

## Common gotchas

**Too many cells**: More than 50x50 grid starts impacting performance. Keep it reasonable—users can't distinguish individual cells beyond that anyway.

**Z-index layering**: Content needs `relative z-10` to appear above the grid. The SVG uses absolute positioning.

**Mobile performance**: Touch devices don't have hover, so the effect is lost. Consider disabling on mobile or using touch events instead.

**Color contrast**: Light hover effects get lost on light backgrounds. Use sufficient opacity or color contrast for visibility.

**Container sizing**: The grid fills its container. Make sure the parent has explicit dimensions or the grid won't render.

## Integration with other components

Perfect under [Particles](/background/particles) for layered effects. Combines well with [Gradient](/background/gradient) for depth. The grid is subtle enough to work behind any shadcn/ui component without competing for attention.

## Questions developers actually ask

<Accordions type="single">
  <Accordion id="custom-colors" title="How do I change the hover color?">
    Pass a custom `squaresClassName` with your Tailwind classes. Use `hover:fill-blue-500` or whatever color you want. The default uses `fill-neutral-600`.
  </Accordion>

  <Accordion id="click-events" title="Can I add click handlers to cells?">
    Yes, add onClick to the rect elements in the component. Each cell can have its own handler. Track clicked cells in state if you need persistent selection.
  </Accordion>

  <Accordion id="performance-limits" title="What's the maximum grid size?">
    Technically unlimited, but practically around 2500 cells (50x50). Beyond that, hover performance degrades. For larger grids, consider virtualizing or using canvas.
  </Accordion>

  <Accordion id="animation-speed" title="How do I speed up the hover animation?">
    The transition duration is set in CSS. Find the `transition-all duration-300` and change to `duration-150` for snappier response.
  </Accordion>

  <Accordion id="pattern-variations" title="Can I make hexagonal or triangular grids?">
    You'd need to modify the SVG structure. Hexagons require different path calculations. Triangles are easier—just rotate squares 45 degrees and clip.
  </Accordion>

  <Accordion id="spotlight-effect" title="How do I create a spotlight follow effect?">
    Track mouse position and calculate distance from each cell. Apply opacity based on distance. Performance-intensive but doable for smaller grids.
  </Accordion>
</Accordions>

---

## Shimmering Text Reference

---

title: Shimmering Text
description: Animated text with gradient shimmer effects and viewport-triggered animations using Motion.
featured: true
component: true

---

<ComponentPreview
  name="shimmering-text-demo"
  description="A text shimmer effect with customizable speed, intensity, and colors"
/>

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">CLI</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx @elevenlabs/agents-cli@latest components add shimmering-text
```

</TabsContent>

<TabsContent value="manual">

<Steps>

<Step>Install the following dependencies:</Step>

```bash
npm install motion
```

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource
  name="shimmering-text"
  title="components/ui/shimmering-text.tsx"
/>

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx showLineNumbers
import { ShimmeringText } from '@/components/ui/shimmering-text';
```

### Basic Usage

```tsx showLineNumbers
<ShimmeringText text="Hello, World!" />
```

### Custom Duration and Colors

```tsx showLineNumbers
<ShimmeringText text="Custom Shimmer" duration={3} color="#6B7280" shimmerColor="#3B82F6" />
```

### Trigger on Viewport Entry

```tsx showLineNumbers
<ShimmeringText text="Appears when scrolled into view" startOnView={true} once={true} />
```

### Repeating Animation

```tsx showLineNumbers
<ShimmeringText text="Repeating Shimmer" repeat={true} repeatDelay={1} duration={2} />
```

### With Custom Styling

```tsx showLineNumbers
<ShimmeringText text="Large Heading" className="text-4xl font-bold" spread={3} />
```

## API Reference

### ShimmeringText

An animated text component with gradient shimmer effect and viewport detection.

#### Props

| Prop         | Type      | Default | Description                                          |
| ------------ | --------- | ------- | ---------------------------------------------------- |
| text         | `string`  | -       | **Required.** Text to display with shimmer effect    |
| duration     | `number`  | `2`     | Animation duration in seconds                        |
| delay        | `number`  | `0`     | Delay before starting animation                      |
| repeat       | `boolean` | `true`  | Whether to repeat the animation                      |
| repeatDelay  | `number`  | `0.5`   | Pause duration between repeats in seconds            |
| className    | `string`  | -       | Optional CSS classes                                 |
| startOnView  | `boolean` | `true`  | Whether to start animation when entering viewport    |
| once         | `boolean` | `false` | Whether to animate only once                         |
| inViewMargin | `string`  | -       | Margin for viewport detection (e.g., "0px 0px -10%") |
| spread       | `number`  | `2`     | Shimmer spread multiplier                            |
| color        | `string`  | -       | Base text color (CSS custom property)                |
| shimmerColor | `string`  | -       | Shimmer gradient color (CSS custom property)         |

## Notes

- Built with [Motion](https://motion.dev/) for smooth, performant animations
- Uses CSS gradient background animation for the shimmer effect
- Viewport detection powered by Motion's `useInView` hook
- Dynamic spread calculation based on text length for consistent appearance
- Supports custom colors via CSS custom properties
- Text uses `background-clip: text` for gradient effect
- Default colors adapt to light/dark mode automatically
- Optimized with `useMemo` for performance
- Animation can be controlled via viewport intersection or immediate start
