# Matrix Display Implementation Plan

## Project: QorkMe URL Shortener
**Date**: 2025-10-18
**Component**: MatrixDisplay (Unified dot-matrix title and clock display)

---

## Overview

The QorkMe homepage features a **unified dot-matrix display** as the hero element, showing:
- **Animated "Qork.Me" title** with subtle shimmer/glitter effect
- **Live digital clock** displaying HH:MM:SS format
- **Feathered edges** for smooth blending with the background
- **Earthy terracotta color palette** matching QorkMe's design system

This approach replaces the previous animated background matrix with a focused, prominent display element.

---

## Technical Approach

### Strategy: Unified Single Matrix Display

Create **ONE Matrix component** that contains both the title and clock:
1. Renders "Qork.Me" using custom letter patterns
2. Displays current time below title using digit patterns
3. Animates shimmer effect on title for visual interest
4. Updates time every second
5. Uses feathered opacity mask for smooth edge blending

---

## Implementation Details

### 1. Letter Patterns

**File**: `qorkme/components/ui/matrix.tsx`

Added letter patterns for the alphabet (7 rows × 5 columns each):
- **Q**: Capital Q with distinctive tail
- **o**: Lowercase o
- **r**: Lowercase r
- **k**: Lowercase k
- **M**: Capital M
- **e**: Lowercase e
- **.**: Period/dot
- **:**: Colon (for time separator)
- **Space**: Empty 5-column gap

These patterns are exported as `letters` object alongside the existing `digits` export.

---

### 2. MatrixDisplay Component

**File**: `qorkme/components/MatrixDisplay.tsx`

#### Component Structure

```tsx
export function MatrixDisplay() {
  // State
  const [time, setTime] = useState(new Date());
  const [frameIndex, setFrameIndex] = useState(0);

  // Time updates (every second)
  // Shimmer animation (10 FPS)

  // Render unified frame with title + clock
  return <Matrix ... />
}
```

#### Matrix Dimensions

- **Rows**: 17
  - Title: 7 rows
  - Gap: 2 rows
  - Clock: 7 rows
  - Padding: 1 row (top/bottom)
- **Columns**: 60
  - Wide enough for "Qork.Me" (7 chars × 6 cols = 42 cols)
  - Wide enough for "HH:MM:SS" (8 chars × 6 cols = 48 cols)

#### Cell Specifications

- **Cell size**: 8px (larger for better visibility as hero element)
- **Gap**: 2px between cells
- **Total width**: ~540px (60 × 9px)
- **Total height**: ~170px (17 × 10px)

---

### 3. Shimmer/Glitter Animation

**Function**: `createTitleFrames(frameCount: number)`

Generates 24 frames of brightness variations for each character in "Qork.Me":

```tsx
// Each character pulses slightly out of phase
const phase = (i / charCount) * Math.PI * 2;
const progress = (f / frameCount) * Math.PI * 2;

// Subtle shimmer between 0.7 and 1.0
const shimmer = Math.sin(progress + phase) * 0.15 + 0.85;

// Occasional random sparkle
const sparkle = sparkleChance > 0.95 ? 0.2 : 0;
```

**Result**: Smooth, organic shimmer effect that cycles through all characters, making the title appear alive and dynamic.

---

### 4. Frame Rendering

**Function**: `createUnifiedFrame(time, titleBrightness, rows, cols)`

Creates a single frame containing:

1. **Title**: "Qork.Me" centered horizontally at row 1
2. **Clock**: Current time centered horizontally at row 10

**Rendering process**:
- Calculate centered column position for each element
- Iterate through character patterns
- Apply brightness values (shimmer for title, full brightness for clock)
- Combine into single frame array

---

### 5. Feathered Edge Effect

Applied using CSS mask:

```tsx
style={{
  WebkitMaskImage: 'radial-gradient(ellipse 100% 100% at center, black 40%, transparent 100%)',
  maskImage: 'radial-gradient(ellipse 100% 100% at center, black 40%, transparent 100%)'
}}
```

**Effect**: Creates smooth fade from solid center (40%) to fully transparent edges (100%), giving the display a soft, integrated appearance.

---

## Visual Design

### Color Palette (Earthy Terracotta)

| State  | Color                      | Usage                    |
|--------|----------------------------|--------------------------|
| On     | `rgba(196, 114, 79, 1)`    | Active cells (100% opacity) |
| Off    | `rgba(196, 114, 79, 0.08)` | Inactive cells (8% opacity) |

**Design system reference**: `#c4724f` (terracotta primary)

### Layout

```
┌─────────────────────────────────┐
│     Feathered top edge          │
│                                 │
│        Q o r k . M e           │  ← Shimmering title
│                                 │
│                                 │
│        1 5 : 3 0 : 4 2         │  ← Live clock
│                                 │
│     Feathered bottom edge       │
└─────────────────────────────────┘
```

**Position**: Centered on page, between tagline and URL shortener form

---

## Animation Details

### Shimmer Effect

- **Frame count**: 24 frames
- **Update rate**: 10 FPS (every 100ms)
- **Brightness range**: 0.7 to 1.0
- **Phase offset**: Each character offset by `(index / 7) * 2π`
- **Sparkle**: Random 5% chance per character per frame

**Purpose**: Creates organic, attention-grabbing animation without being distracting

### Clock Updates

- **Update interval**: 1 second
- **Format**: HH:MM:SS (24-hour)
- **Brightness**: Constant 1.0 (no shimmer on clock for readability)

---

## Performance Considerations

### Optimization Strategies

1. **Memoization**:
   - Shimmer frames pre-generated and cached
   - Frame only regenerated when time or shimmer frame changes

2. **Efficient Updates**:
   - Time updates: 1 Hz (every second)
   - Shimmer updates: 10 Hz (every 100ms)
   - No expensive calculations in render loop

3. **Static Patterns**:
   - Letter and digit patterns defined once
   - No dynamic pattern generation

### Expected Performance

| Metric                    | Target       | Notes                        |
|---------------------------|--------------|------------------------------|
| Frame generation time     | < 10ms       | Per update (shimmer or time) |
| Shimmer FPS               | 10 FPS       | Smooth subtle animation      |
| Memory usage              | < 1 MB       | 24 frames × 17×60 cells      |
| Initial render            | < 500ms      | SSR + hydration              |

---

## Integration

### Page Layout

**File**: `qorkme/app/page.tsx`

```tsx
<div className="animate-fadeIn text-center">
  <MatrixDisplay />
  <p className="mt-4 text-lg text-text-secondary md:text-xl">
    Smart URL shortening, beautifully simple
  </p>
</div>

<div className="mt-12">
  <UrlShortener />
</div>
```

**Flow**:
1. Matrix display (title + clock)
2. Tagline text
3. URL shortener form

### Background

- **Removed**: Previous animated matrix background
- **Current**: Clean, solid background using design system colors
- **Effect**: Keeps focus on the unified matrix display and form

---

## Files Modified

| File                                      | Changes                                    |
|-------------------------------------------|--------------------------------------------|
| `qorkme/components/ui/matrix.tsx`         | Added `letters` export with alphabet patterns |
| `qorkme/components/MatrixDisplay.tsx`     | New component with unified title + clock   |
| `qorkme/app/page.tsx`                     | Updated to use MatrixDisplay, removed old background |
| `MATRIX_BACKGROUND_PLAN.md`              | Updated documentation (this file)          |

---

## Testing Checklist

- [x] **Title rendering**: "Qork.Me" displays correctly
- [x] **Clock accuracy**: Shows correct time in HH:MM:SS format
- [x] **Clock updates**: Changes every second without flickering
- [x] **Shimmer animation**: Smooth, subtle glitter effect on title
- [x] **Feathered edges**: Smooth opacity fade at display edges
- [x] **Color accuracy**: Matches terracotta design system
- [x] **Centering**: Display centered horizontally on page
- [x] **Performance**: No lag or stuttering
- [x] **Responsive**: Works on different screen sizes

---

## Future Enhancements

Potential improvements if needed:

1. **Responsive sizing**: Adjust cell size based on viewport width
2. **Colon blink**: Make clock colons blink on/off for classic digital clock feel
3. **Custom messages**: Allow temporary messages to replace title on special events
4. **Color themes**: Alternate color palettes (e.g., blue, green, amber)
5. **Mobile optimization**: Smaller display on mobile devices
6. **Accessibility**: Add screen reader announcements for time updates
7. **Additional animations**: Pulse effect, wave pattern, or other effects

---

## Troubleshooting

### Issue: Shimmer too subtle

**Solution**: Increase brightness range in `createTitleFrames()` from `[0.7, 1.0]` to `[0.5, 1.0]`

### Issue: Sparkle too frequent

**Solution**: Reduce sparkle chance from 0.95 to 0.97 or 0.98

### Issue: Feathered edge too aggressive

**Solution**: Adjust gradient stop from `40%` to `50%` or `60%` in mask style

### Issue: Clock not updating

**Solution**: Check `setInterval` is running and clearing properly in `useEffect`

### Issue: Display not centered

**Solution**: Verify parent container has `justify-center` class and adequate width

---

**End of Plan Document**
