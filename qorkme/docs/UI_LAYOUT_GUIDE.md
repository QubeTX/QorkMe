# UI/Layout Troubleshooting & Best Practices Guide

## Overview

This guide documents critical lessons learned about QorkMe's UI layout system, Tailwind CSS v4 integration, and common pitfalls when working with spacing and flexbox. Follow these patterns to avoid hours of debugging.

---

## Table of Contents

1. [Critical Layout Architecture](#critical-layout-architecture)
2. [Tailwind CSS v4 Gotchas](#tailwind-css-v4-gotchas)
3. [Spacing Best Practices](#spacing-best-practices)
4. [Component Structure Guidelines](#component-structure-guidelines)
5. [Common Pitfalls & Solutions](#common-pitfalls--solutions)
6. [Development Workflow](#development-workflow)
7. [File Structure Reference](#file-structure-reference)
8. [Quick Reference Commands](#quick-reference-commands)
9. [Code Examples](#code-examples)

---

## Critical Layout Architecture

### The Layout Hierarchy

QorkMe uses a three-level flexbox layout:

```jsx
<div id="page-wrapper">
  {' '}
  {/* min-h-screen flex flex-col */}
  <main id="main-content">
    {' '}
    {/* flex flex-1 items-center justify-center */}
    <div id="content-container">
      {' '}
      {/* flex flex-col gap-32 */}
      <MatrixDisplay />
      <UrlShortener />
    </div>
  </main>
</div>
```

### Critical Understanding: Flexbox Centering Collapses Margins

**THE GOTCHA**: When a parent has `items-center justify-center`, it will **collapse margins** on child elements!

```jsx
// ❌ WRONG - Margin will be ignored
<main className="flex items-center justify-center">
  <div className="mt-32">  {/* This margin won't work! */}
    <Component />
  </div>
</main>

// ✅ RIGHT - Use gap on the flex parent
<main className="flex items-center justify-center">
  <div className="flex flex-col gap-32">  {/* gap works! */}
    <Component1 />
    <Component2 />
  </div>
</main>
```

### Why This Happens

Flexbox centering (`items-center justify-center`) redistributes space around flex children. Margins become part of this redistribution and effectively get collapsed/ignored. The flex container treats everything as a single centered block.

**Solution**: Always use `gap` on the flex parent, not `margin` on flex children.

---

## Tailwind CSS v4 Gotchas

### Utility Class Generation Issues

QorkMe uses **Tailwind CSS v4** which has different class generation behavior than v3.

#### Classes That May Not Work

Some Tailwind utility classes don't always generate properly in v4:

- `p-16` - Padding utility for 4rem
- `md:p-16` - Responsive padding variants
- Large numeric values (>12) may not be pre-generated

#### When Tailwind Classes Fail

**Symptoms**:

- Class appears in HTML but no visual change
- Browser inspector shows class but no CSS rules
- Changes compile successfully but don't render

**Solution**: Use inline styles with explicit pixel values

```jsx
// ❌ May not work in Tailwind v4
<div className="p-16">

// ✅ Guaranteed to work
<div style={{ padding: '64px' }}>

// ✅ Also works - use smaller Tailwind values
<div className="p-12">  {/* 3rem = 48px */}
```

### CSS Specificity

Inline styles have the highest specificity and will always override Tailwind classes. Use this to your advantage when debugging.

```jsx
// Priority order (lowest to highest):
1. Tailwind utility classes
2. Custom classes in globals.css
3. Inline styles (style={{ ... }})
```

---

## Spacing Best Practices

### Use Flexbox `gap` Not Margins

**Golden Rule**: For spacing between siblings, ALWAYS use `gap` on the parent container.

```jsx
// ❌ WRONG - Fragile, hard to maintain
<div>
  <input className="mb-6" />
  <button />
</div>

// ✅ RIGHT - Clean, consistent, works everywhere
<div className="flex flex-col gap-6">
  <input />
  <button />
</div>
```

### Recommended Spacing Values

Based on QorkMe's design system:

| Use Case                         | Gap Class | Pixels | Rem    |
| -------------------------------- | --------- | ------ | ------ |
| Tight spacing (input → button)   | `gap-6`   | 24px   | 1.5rem |
| Standard spacing (card elements) | `gap-8`   | 32px   | 2rem   |
| Large spacing (sections)         | `gap-32`  | 128px  | 8rem   |

### Responsive Spacing Pattern

```jsx
// ✅ Responsive spacing between major sections
<div className="flex flex-col gap-32 md:gap-40 lg:gap-48">
  <Section1 />
  <Section2 />
</div>
```

### Internal Padding

For internal spacing (padding within a card/container), use inline styles if Tailwind classes fail:

```jsx
// ✅ Guaranteed to work
<div
  className="card-container"
  style={{ padding: '48px' }} // 3rem
>
  <Content />
</div>
```

---

## Component Structure Guidelines

### Keep It Flat

Avoid unnecessary nested containers. Each extra div adds complexity and potential layout issues.

```jsx
// ❌ WRONG - Unnecessary nesting
<div id="outer-card">
  <div id="inner-wrapper">
    <div id="content-container">
      <Input />
      <Button />
    </div>
  </div>
</div>

// ✅ RIGHT - Flat, simple structure
<div id="card" className="flex flex-col gap-6">
  <Input />
  <Button />
</div>
```

### Flex Properties on Direct Parent

Put flex layout properties on the **direct parent** of the elements you want to space.

```jsx
// ❌ WRONG - gap is too far from children
<div className="flex flex-col gap-6">
  <div>
    <Input />   {/* gap doesn't affect these */}
    <Button />
  </div>
</div>

// ✅ RIGHT - gap directly controls spacing
<div className="flex flex-col gap-6">
  <Input />   {/* gap works here */}
  <Button />
</div>
```

### Use Semantic IDs and Classes

Always add meaningful IDs and classes for easy debugging and targeting:

```jsx
<div id="url-shortener-card" className="url-shortener-card flex flex-col gap-6">
  <div id="input-wrapper" className="input-wrapper">
    <Input id="url-input" className="url-input" />
  </div>
  <Button id="shorten-button" className="shorten-button" />
</div>
```

This makes it easy to:

- Target elements in browser inspector
- Reference in documentation
- Debug layout issues
- Write specific CSS overrides

---

## Common Pitfalls & Solutions

### Problem 1: Margins Not Showing

**Symptoms**:

- Added `mt-32` to element
- No visual change
- Margin shows in inspector but has no effect

**Cause**: Parent container has `items-center` or `justify-center`

**Solution**:

```jsx
// Change from margin on child to gap on parent
<div className="flex flex-col gap-32">
  <Child1 />
  <Child2 />
</div>
```

---

### Problem 2: Tailwind Class Not Applying

**Symptoms**:

- Class appears in HTML: `class="p-16"`
- No CSS rules in browser inspector
- No visual effect

**Cause**: Tailwind v4 didn't generate that utility class

**Solution**:

```jsx
// Use inline style instead
<div style={{ padding: '64px' }}>
  {/* or use a smaller value that's pre-generated */}
  <div className="p-12">
```

---

### Problem 3: Changes Not Visible

**Symptoms**:

- Made changes to code
- Dev server recompiled successfully
- No visual change in browser

**Causes & Solutions**:

1. **Browser cache**: Hard refresh
   - Mac: `Cmd + Shift + R`
   - Windows: `Ctrl + Shift + R`

2. **Next.js cache**: Clear and restart

   ```bash
   rm -rf .next && npm run dev
   ```

3. **Verify file saved**: Check the actual file

   ```bash
   grep -n "your-change" path/to/file.tsx
   ```

4. **Verify HTML rendered**: Check browser output
   ```bash
   curl -s http://localhost:3000 | grep "class-name"
   ```

---

### Problem 4: Spacing Collapsed

**Symptoms**:

- Element should have space around it
- Everything is squished together
- Gap or padding seems ignored

**Cause**: Parent flexbox properties are interfering

**Checklist**:

1. Does parent have `items-center`? → Use `gap` not `margin`
2. Does parent have `justify-center`? → Use `gap` not `margin`
3. Is element absolutely positioned? → Remove `absolute`
4. Are there nested flex containers? → Simplify structure

---

### Problem 5: Absolute Positioning Issues

**Symptoms**:

- Multiple states overlapping
- Layout height is wrong
- Spacing calculations are unpredictable

**Cause**: Absolute positioning removes elements from document flow

**Solution**: Remove absolute positioning, use conditional rendering instead

```jsx
// ❌ WRONG - States overlap with absolute
<div className="card">
  <div className={state !== 'input' ? 'absolute opacity-0' : ''}>
    <InputState />
  </div>
  <div className={state !== 'loading' ? 'absolute opacity-0' : ''}>
    <LoadingState />
  </div>
</div>

// ✅ RIGHT - Only render active state
<div className="card">
  {state === 'input' && <InputState />}
  {state === 'loading' && <LoadingState />}
  {state === 'success' && <SuccessState />}
</div>
```

---

## Development Workflow

### Starting Fresh

When you need a completely clean build:

```bash
# Kill existing dev server (if running)
pkill -f "next dev"

# Clear Next.js cache
rm -rf .next

# Start fresh dev server
npm run dev
```

### Hard Refresh Browser

Always hard refresh after making CSS/layout changes:

- **Mac**: `Cmd + Shift + R`
- **Windows/Linux**: `Ctrl + Shift + R`
- **Chrome DevTools**: Right-click refresh → "Empty Cache and Hard Reload"

### Verify Changes Applied

1. **Check source file**:

   ```bash
   cat qorkme/components/YourComponent.tsx | grep -A 2 "className"
   ```

2. **Check rendered HTML**:

   ```bash
   curl -s http://localhost:3000 | grep 'id="your-element"'
   ```

3. **Check browser inspector**:
   - Open DevTools (F12)
   - Inspect element
   - Check "Computed" tab for actual CSS values
   - Check "Styles" tab for which rules are applying

### Debugging Spacing Issues

1. Add temporary colored backgrounds:

   ```jsx
   <div style={{ background: 'red' }}>
   <div style={{ background: 'blue' }}>
   ```

2. Check parent flex properties:

   ```jsx
   // Look for these in parent elements:
   items - center; // Collapses vertical margins
   justify - center; // Collapses horizontal margins
   ```

3. Verify gap is on correct element:
   ```jsx
   // gap must be on the PARENT of spaced children
   <Parent className="flex gap-8">
     {' '}
     ← gap here
     <Child1 />
     <Child2 />
   </Parent>
   ```

---

## File Structure Reference

### Key Files and What They Control

| File                           | Purpose                      | What to Change Here                                                         |
| ------------------------------ | ---------------------------- | --------------------------------------------------------------------------- |
| `app/page.tsx`                 | Main page layout             | Overall page structure, container centering, major spacing between sections |
| `app/globals.css`              | Global styles, design tokens | Color variables, typography, reusable utility classes                       |
| `components/UrlShortener.tsx`  | Card component               | Card structure, internal spacing, form layout                               |
| `components/MatrixDisplay.tsx` | Matrix/clock component       | Matrix display logic and layout                                             |
| `docs/DESIGN_SYSTEM.md`        | Design tokens reference      | Color palette, typography scale, spacing values                             |

### When to Edit Which File

**Changing spacing between matrix and card?**
→ Edit `app/page.tsx` - change `gap-32` on `#content-container`

**Changing card internal padding?**
→ Edit `components/UrlShortener.tsx` - change `padding` style on `#url-shortener-card`

**Changing input-to-button spacing?**
→ Edit `components/UrlShortener.tsx` - change `gap-6` on card's flex container

**Adding new color token?**
→ Edit `app/globals.css` - add to `:root` variables

**Documenting design decisions?**
→ Edit `docs/DESIGN_SYSTEM.md`

---

## Quick Reference Commands

### Development Server

```bash
# Start dev server
cd qorkme && npm run dev

# Kill dev server
pkill -f "next dev"

# Clear cache and restart
rm -rf .next && npm run dev

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Verification

```bash
# Check if class is in rendered HTML
curl -s http://localhost:3000 | grep "class=\".*p-16.*\""

# Check if file change was saved
grep -n "padding: '64px'" qorkme/components/UrlShortener.tsx

# View full rendered card HTML
curl -s http://localhost:3000 | grep -A 20 'id="url-shortener-card"'
```

### Debugging

```bash
# Check what Tailwind compiled
ls -la .next/static/css/

# Check for compilation errors
npm run build

# Type check
npm run type-check

# Lint check
npm run lint
```

---

## Code Examples

### Example 1: Proper Vertical Centering with Spacing

```jsx
// ✅ CORRECT PATTERN
export default function Page() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex flex-1 items-center justify-center py-8">
        <div className="flex w-full max-w-[700px] flex-col gap-32 px-4">
          <Header />
          <MainContent />
          <Footer />
        </div>
      </main>
    </div>
  );
}
```

**Why this works**:

- `items-center justify-center` on `main` centers the entire content container
- `gap-32` on inner `div` creates spacing between children
- `flex flex-col` on inner `div` stacks children vertically
- No margins used - only gap for spacing

---

### Example 2: Card with Internal Spacing

```jsx
// ✅ CORRECT PATTERN
export function Card() {
  return (
    <div
      id="card"
      className="flex flex-col gap-6 rounded-[30px] border bg-surface"
      style={{ padding: '48px' }} // Inline style for reliability
    >
      <div id="input-wrapper">
        <Input />
      </div>
      <Button />
    </div>
  );
}
```

**Why this works**:

- Single container, no unnecessary nesting
- `flex flex-col gap-6` spaces input and button
- `padding` as inline style guarantees it applies
- Semantic IDs for easy targeting

---

### Example 3: What NOT to Do

```jsx
// ❌ WRONG - Multiple issues
export function BadCard() {
  return (
    <div className="flex items-center justify-center">
      <div className="p-16">
        {' '}
        {/* Tailwind class may not work */}
        <div className="card-outer">
          {' '}
          {/* Unnecessary nesting */}
          <div className="card-inner">
            {' '}
            {/* More unnecessary nesting */}
            <div className="mt-8">
              {' '}
              {/* Margin will be collapsed */}
              <Input />
            </div>
            <div className="mt-6">
              {' '}
              {/* Fragile spacing */}
              <Button />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

**Problems**:

1. `items-center` collapses margins on children
2. `p-16` may not generate in Tailwind v4
3. Too many nested containers
4. Using margins instead of gap
5. No semantic IDs

---

### Example 4: Responsive Spacing

```jsx
// ✅ CORRECT PATTERN - Mobile to Desktop
export function ResponsiveLayout() {
  return (
    <div className="flex flex-col gap-16 md:gap-24 lg:gap-32 px-4 md:px-6 lg:px-8">
      <Section1 />
      <Section2 />
    </div>
  );
}
```

**Spacing breakdown**:

- Mobile: `gap-16` (4rem / 64px)
- Tablet: `gap-24` (6rem / 96px)
- Desktop: `gap-32` (8rem / 128px)

---

## Integration with Design System

This guide complements `DESIGN_SYSTEM.md`:

- **Design System**: Defines the "what" (colors, typography, spacing scale)
- **This Guide**: Defines the "how" (implementation patterns, avoiding pitfalls)

### When to Use Design Tokens vs Inline Values

**Use Design Tokens** (from `globals.css`):

- Colors: `bg-[color:var(--color-primary)]`
- Typography: `font-display`, `font-body`
- Borders: `border-[color:var(--color-border)]`

**Use Inline Values**:

- Padding when Tailwind classes fail: `style={{ padding: '48px' }}`
- Specific pixel values: `style={{ marginTop: '8rem' }}`
- Custom responsive values: `style={{ gap: '2rem' }}`

### Spacing Scale Reference

From the design system, these values work reliably:

```jsx
gap - 1; // 0.25rem = 4px   - Tiny gaps
gap - 2; // 0.5rem = 8px    - Compact spacing
gap - 4; // 1rem = 16px     - Standard spacing
gap - 6; // 1.5rem = 24px   - Comfortable spacing
gap - 8; // 2rem = 32px     - Generous spacing
gap - 12; // 3rem = 48px     - Large spacing
gap - 32; // 8rem = 128px    - Section spacing
```

---

## Interactive Grid Background

### Overview

QorkMe uses an SVG-based interactive grid background that adds subtle visual depth without impacting performance.

**Component**: `qorkme/components/ui/interactive-grid-pattern.tsx`

### Key Features

- **Single SVG element**: Renders 400 cells (20×20) with minimal DOM overhead
- **60fps performance**: CSS transitions handle animations, React only tracks hover state
- **Noise-based opacity**: Organic, paper-like texture via SVG fractal noise filter
- **Terracotta hover glow**: Uses `--color-primary` at 12% opacity for brand alignment

### Implementation Pattern

```tsx
<div className="relative">
  {/* Background layer */}
  <InteractiveGridPattern
    className="absolute inset-0 z-0"
    width={40}
    height={40}
    squares={[20, 20]}
  />

  {/* Content layer */}
  <div className="relative z-10">{/* Your content */}</div>
</div>
```

### Customization Guide

**Grid Density & Size:**

```tsx
<InteractiveGridPattern
  width={40} // Cell width (px) - smaller = denser grid
  height={40} // Cell height (px)
  squares={[20, 20]} // [columns, rows] - max ~50×50 for performance
/>
```

**Noise Filter Parameters** (in component `<defs>`):

```tsx
<feTurbulence
  baseFrequency="0.025"  // 0.01-0.05: Noise scale (lower = larger patterns)
  numOctaves="3"         // 1-4: Detail layers (higher = more complex)
  seed="42"              // Any number: Deterministic pattern
/>

<feColorMatrix
  values="0 0 0 0 0
          0 0 0 0 0
          0 0 0 0 0
          0 0 0 0.6 0.4"  // Last row: [slope] [intercept] for alpha
/>
// Alpha = (noise × 0.6) + 0.4 = range 0.4 to 1.0
// Adjust slope/intercept to change opacity variation intensity
```

**Grid Line Appearance** (in `<pattern>` section):

```tsx
<path
  stroke="var(--color-border-strong)" // Line color token
  strokeWidth="1" // Line thickness (0.5-2)
  strokeOpacity="0.6" // Base opacity (0.3-0.8)
/>
```

**Hover Effect** (in interactive cells):

```tsx
fill={isHovered ? 'var(--color-primary)' : 'transparent'}
fillOpacity={isHovered ? '0.12' : '0'}  // Adjust 0.08-0.20
className="transition-all duration-300"  // Adjust 150-500ms
```

### Performance Considerations

- **Cell limit**: Keep total cells under 2500 (50×50) to maintain 60fps
- **Mobile**: Touch devices don't show hover effects - grid remains static
- **Z-index**: Always place grid at `z-0`, content at `z-10` or higher
- **Pointer events**: Grid uses `pointer-events-none` on container, `pointer-events-auto` only on interactive cells

### Common Adjustments

**Make grid more visible:**

- Increase `strokeWidth` to `1.5` or `2`
- Increase `strokeOpacity` to `0.7` or `0.8`
- Use `--color-border-strong` instead of `--color-border`

**Make noise more/less intense:**

- More variation: `0 0 0 0.8 0.2` (wider opacity range 0.2-1.0)
- Less variation: `0 0 0 0.4 0.6` (narrower range 0.6-1.0)

**Change noise pattern:**

- Finer details: Increase `baseFrequency` to `0.04`
- Coarser texture: Decrease `baseFrequency` to `0.015`
- More layers: Increase `numOctaves` to `4`

**Change hover color:**

- Green accent: `var(--color-accent)` instead of `var(--color-primary)`
- Custom color: Any CSS color value

---

## Summary: Golden Rules

1. ✅ **Use `gap` on flex parents, not `margin` on children**
2. ✅ **Keep component structure flat - avoid unnecessary nesting**
3. ✅ **Use inline styles when Tailwind classes fail (especially padding)**
4. ✅ **Never use margins when parent has `items-center` or `justify-center`**
5. ✅ **Always add semantic IDs and classes for easy debugging**
6. ✅ **Clear `.next` cache when changes don't appear**
7. ✅ **Hard refresh browser after CSS/layout changes**
8. ✅ **Verify changes in both source files AND rendered HTML**
9. ✅ **Use InteractiveGridPattern at z-0, content at z-10 for proper layering**

---

## Questions or Issues?

If you encounter layout issues not covered here:

1. Check parent container for `items-center` or `justify-center`
2. Try using inline styles instead of Tailwind classes
3. Verify gap is on the direct parent of spaced elements
4. Clear cache and hard refresh
5. Check browser inspector for actual computed styles
6. Document the solution and update this guide!

---

**Last Updated**: Based on troubleshooting session from UI/layout spacing work
**Maintainer**: Update this guide whenever new layout patterns or gotchas are discovered
