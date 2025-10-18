# Matrix Background Implementation Plan

## Project: QorkMe URL Shortener
**Date**: 2025-10-18
**Component**: MatrixBackground (Animated retro dot-matrix display background)

---

## Overview

Transform the QorkMe homepage background from a node-based particle system to a **unified retro dot-matrix display** featuring:
- **Viewport-filling matrix grid** with animated wave effects
- **Centered digital clock** displaying HH:MM:SS in 7-segment style digits
- **Radial wave animations** emanating from the clock center
- **Earthy terracotta color palette** matching QorkMe's design system

---

## Technical Approach

### Strategy: Single Large Matrix

Instead of creating a grid of small Matrix components, we create **ONE large Matrix component** that:
1. Fills the entire viewport dynamically based on screen size
2. Generates custom animation frames combining wave patterns and clock display
3. Updates in real-time (every second) to display current time
4. Optimizes performance through memoization and efficient rendering

---

## Implementation Details

### 1. Viewport-Based Dimensions

**File**: `qorkme/components/MatrixBackground.tsx`

```tsx
// Dynamic calculation based on viewport
const cellSize = 7;  // pixels per cell
const gap = 2;       // pixels between cells
const totalPerCell = cellSize + gap; // 9px total

const cols = Math.floor(window.innerWidth / totalPerCell);
const rows = Math.floor(window.innerHeight / totalPerCell);
```

**Example dimensions for common screen sizes:**

| Screen Size    | Columns | Rows | Total Cells | Cell Dimensions |
|----------------|---------|------|-------------|-----------------|
| 1920×1080 (FHD)| 213     | 120  | 25,560      | 7px + 2px gap   |
| 1366×768 (HD)  | 151     | 85   | 12,835      | 7px + 2px gap   |
| 2560×1440 (QHD)| 284     | 160  | 45,440      | 7px + 2px gap   |
| 3840×2160 (4K) | 426     | 240  | 102,240     | 7px + 2px gap   |

**SSR Fallback**: `180 cols × 100 rows` for server-side rendering

---

### 2. Frame Generation System

**Function**: `createUnifiedFrames(rows, cols, time, frameCount)`

Generates an array of `Frame[]` (24 frames) where each frame is a 2D array of brightness values (0-1).

#### Frame Structure

```tsx
type Frame = number[][]; // [row][col] = brightness (0..1)

// Example for 213×120 matrix:
Frame = [
  [0.2, 0.5, 0.8, ...], // Row 0: 213 values
  [0.3, 0.6, 0.9, ...], // Row 1: 213 values
  // ... 120 rows total
]
```

#### Frame Generation Process

**Step 1: Create Empty Frame**
```tsx
const frame = Array.from({ length: rows }, () => Array(cols).fill(0));
```

**Step 2: Generate Radial Wave Pattern**
```tsx
for (let r = 0; r < rows; r++) {
  for (let c = 0; c < cols; c++) {
    // Calculate distance from center
    const dx = c - centerCol;
    const dy = r - centerRow;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Create expanding wave based on distance
    const wave = Math.sin(
      (distance / maxDistance) * Math.PI * 4 -
      progress * Math.PI * 2
    ) * 0.5 + 0.5;

    // Add horizontal wave component
    const horizontalWave = Math.sin(
      (c / cols) * Math.PI * 3 +
      progress * Math.PI * 2
    ) * 0.3 + 0.5;

    // Combine: 60% radial + 40% horizontal
    frame[r][c] = clamp((wave * 0.6 + horizontalWave * 0.4) * 0.8);
  }
}
```

**Step 3: Overlay Clock Digits**
```tsx
// Format time as "HHMMSS" (6 digits)
const timeString = "153042"; // Example: 15:30:42

// Each digit is 7×5 cells from the `digits` preset
// Clock layout: HH  MM  SS (with 2-col spacing between pairs)
// Total width: (5×6 digits) + (2×2 spacing) = 34 columns

for (let digitIndex = 0; digitIndex < 6; digitIndex++) {
  const digitValue = parseInt(timeString[digitIndex]);
  const digitPattern = digits[digitValue]; // 7×5 frame

  // Calculate position with spacing
  const digitCol = clockStartCol + digitIndex * 5 + spacing;

  // Render digit by overriding wave pattern
  for (let dr = 0; dr < 7; dr++) {
    for (let dc = 0; dc < 5; dc++) {
      if (digitPattern[dr][dc] > 0) {
        frame[targetRow][targetCol] = 1; // Full brightness
      } else {
        frame[targetRow][targetCol] *= 0.3; // Dim background
      }
    }
  }
}
```

#### Animation Loop

24 frames looping at 18 FPS creates a smooth, continuous animation:
- **Frame 0**: Wave starts at center, clock displays current time
- **Frame 12**: Wave at maximum expansion
- **Frame 23**: Wave returns to start, loops seamlessly

---

### 3. Real-Time Clock Updates

**State Management**:
```tsx
const [time, setTime] = useState(new Date());

useEffect(() => {
  const interval = setInterval(() => {
    setTime(new Date());
  }, 1000);
  return () => clearInterval(interval);
}, []);
```

**Frame Regeneration**:
```tsx
const frames = useMemo(
  () => createUnifiedFrames(matrixConfig.rows, matrixConfig.cols, time, 24),
  [matrixConfig.rows, matrixConfig.cols, time]
);
```

**Optimization**: Frames are only regenerated when:
- Time changes (every second)
- Matrix dimensions change (viewport resize)

---

### 4. Matrix Component Integration

**Single Matrix Instance**:
```tsx
<Matrix
  rows={matrixConfig.rows}        // ~120-240 depending on viewport
  cols={matrixConfig.cols}        // ~213-426 depending on viewport
  frames={frames}                 // 24 frames with clock + waves
  fps={18}                        // Smooth animation at 18 FPS
  autoplay                        // Start immediately
  loop                            // Continuous animation
  size={7}                        // 7px cells
  gap={2}                         // 2px between cells
  palette={{
    on: 'rgba(196, 114, 79, 0.9)',  // Terracotta (active cells)
    off: 'rgba(196, 114, 79, 0.05)' // Very subtle off state
  }}
  brightness={0.75}               // Global brightness multiplier
/>
```

---

## Visual Design

### Color Palette (Earthy Terracotta)

| State  | Color                      | Usage                    |
|--------|----------------------------|--------------------------|
| Active | `rgba(196, 114, 79, 0.9)`  | Lit cells, clock digits  |
| Off    | `rgba(196, 114, 79, 0.05)` | Background cells         |

**Design system reference**: `#c4724f` (terracotta primary)

### Clock Display

```
HH  MM  SS
15  30  42

Each digit: 7 rows × 5 columns
Total: 7 rows × 34 columns (including spacing)
Position: Centered in viewport
```

**Clock appearance**:
- Bright terracotta digits (brightness = 1.0)
- Dimmed wave pattern around clock (brightness *= 0.3)
- Creates visual "glow" effect with contrast

### Wave Animation

**Radial component** (60% weight):
- Expands from center in circular pattern
- 4 complete wavelengths from center to edge
- Creates outward-flowing ripple effect

**Horizontal component** (40% weight):
- Flows left-to-right across screen
- 3 complete wavelengths across width
- Adds dynamic horizontal motion

**Combined effect**: Waves appear to pulse outward from the clock while flowing horizontally

---

## Performance Considerations

### Optimization Strategies

1. **Memoization**:
   - Matrix dimensions calculated once on mount
   - Frames only regenerated on time/dimension change
   - Prevents unnecessary recalculation

2. **Frame Management**:
   - Limited to 24 frames (optimal balance)
   - Each frame pre-computed and stored
   - Frame transitions via opacity changes only

3. **Rendering**:
   - Matrix component uses optimized SVG rendering
   - Cell positions pre-computed and memoized
   - Smooth animation via `requestAnimationFrame`

### Expected Performance

| Metric                    | Target       | Notes                        |
|---------------------------|--------------|------------------------------|
| Frame generation time     | < 100ms      | Per time update (1/second)   |
| Animation FPS             | 18 FPS       | Smooth retro aesthetic       |
| Memory usage (frames)     | ~10-50 MB    | 24 frames × 20k-100k cells   |
| Initial render            | < 2s         | SSR + hydration              |
| CPU usage during animation| < 5%         | Optimized RAF loop           |

### Performance Monitoring

Check browser DevTools:
- **Memory**: Watch for memory leaks during time updates
- **Performance**: Profile frame generation function
- **FPS**: Monitor animation smoothness (should stay at 18 FPS)

---

## Fallback Plan

**If performance issues occur** (lag, high CPU, memory issues):

### Fallback Strategy: Grid of Smaller Matrices

Revert to multiple small Matrix components with:

1. **Reduced individual size**: 5×5 or 7×7 cells per matrix
2. **Minimal grid gaps**: 0-2px between matrices
3. **Phase coordination**: Calculate offset for radial wave effect
4. **Separate clock overlay**: Absolute positioned div with Matrix components

**Implementation**:
```tsx
// Grid of small matrices
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(20, 1fr)', gap: '2px' }}>
  {gridCells.map((cell) => (
    <Matrix
      rows={7}
      cols={7}
      frames={waveFrames}
      // Calculate phase offset based on distance from center
      // to create unified radial effect
    />
  ))}
</div>

// Separate clock overlay
<div style={{ position: 'absolute', top: '50%', left: '50%' }}>
  <ClockDisplay />
</div>
```

---

## Testing Checklist

- [ ] **Visual appearance**: Matrix fills entire viewport without gaps
- [ ] **Clock accuracy**: Displays correct time in HH:MM:SS format
- [ ] **Clock updates**: Changes every second without flickering
- [ ] **Wave animation**: Smooth radial expansion from center
- [ ] **Performance**: No lag or stuttering during animation
- [ ] **Memory stability**: No memory leaks over time
- [ ] **Responsive**: Works on different screen sizes (mobile to 4K)
- [ ] **SSR compatibility**: Renders correctly on server-side
- [ ] **Accessibility**: Proper aria-label, doesn't interfere with content
- [ ] **Color consistency**: Matches QorkMe terracotta design system

---

## Files Modified

| File                                      | Changes                                    |
|-------------------------------------------|--------------------------------------------|
| `qorkme/components/MatrixBackground.tsx`  | Complete rewrite with unified matrix       |
| `qorkme/app/page.tsx`                     | No changes (already imports component)     |
| `qorkme/components/ui/matrix.tsx`         | No changes (using existing component)      |

---

## Next Steps

1. **Test on localhost**: Verify visual appearance and clock functionality
2. **Performance profiling**: Check frame generation time and memory usage
3. **Responsive testing**: Test on various screen sizes
4. **Browser compatibility**: Test in Chrome, Firefox, Safari
5. **Accessibility audit**: Ensure no issues with screen readers
6. **Production deployment**: Deploy if performance is acceptable
7. **Monitor metrics**: Watch for issues in production

---

## Implementation Notes

### Why Single Large Matrix?

**Advantages**:
- ✅ True unified appearance (no visual breaks)
- ✅ Simpler wave generation (continuous pattern)
- ✅ Easier clock integration (just overlay specific cells)
- ✅ More efficient (one animation loop vs. many)
- ✅ Better wave coordination (all cells in sync)

**Disadvantages**:
- ⚠️ Higher memory usage (large frame arrays)
- ⚠️ Frame generation cost (recalculate on time change)
- ⚠️ Potential performance issues on lower-end devices

### Why 24 Frames?

- Balances smoothness with memory/performance
- 24 frames @ 18 FPS = 1.33 second loop
- Enough frames for smooth wave motion
- Not too many frames to cause memory issues

### Why 7px Cells + 2px Gaps?

- Subtle background presence (doesn't overpower content)
- Good balance of detail and performance
- Provides enough resolution for 7×5 digit rendering
- Matches retro dot-matrix aesthetic

---

## References

- **Matrix component docs**: `NEW_REDESIGN_SAMPLE/MATRIX_DOCS.md`
- **Design system**: `qorkme/docs/DESIGN_SYSTEM.md`
- **Project overview**: `CLAUDE.md`
- **Matrix component**: `qorkme/components/ui/matrix.tsx`

---

## Troubleshooting

### Issue: Slow frame generation

**Symptoms**: Lag when time updates, delayed clock changes
**Solution**: Reduce frame count from 24 to 16, or reduce matrix size

### Issue: High memory usage

**Symptoms**: Browser slowdown over time, memory warnings
**Solution**: Implement frame recycling or switch to fallback grid approach

### Issue: Clock not visible

**Symptoms**: Clock digits blend with wave pattern
**Solution**: Increase brightness multiplier for clock area, reduce background opacity

### Issue: Waves not visible

**Symptoms**: Static pattern, no animation
**Solution**: Check FPS settings, verify frames array is updating

### Issue: Performance issues on mobile

**Symptoms**: Lag, stuttering, high CPU usage
**Solution**: Reduce cell count (larger cellSize), fewer frames, or disable on mobile

---

## Future Enhancements

Potential improvements if time/budget allows:

1. **Responsive wave speed**: Slower on mobile, faster on desktop
2. **Color themes**: Match wave color to time of day (blue morning, orange evening)
3. **Interactive effects**: Mouse movement influences wave patterns
4. **Alternative animations**: Switch between wave/pulse/snake on interval
5. **Date display**: Show date below time on larger screens
6. **Performance mode toggle**: User can disable animation if desired
7. **Custom messages**: Display short messages instead of time on special events
8. **Sound sync**: Pulse waves to music if audio detection available

---

**End of Plan Document**
