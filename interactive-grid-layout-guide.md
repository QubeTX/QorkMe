# Interactive Grid Pattern - Z-Index & Pointer Events Guide

A reusable reference for implementing interactive SVG grid backgrounds with proper layering and interactivity.

---

## TL;DR

When using an interactive grid background at `z-0`, content containers at higher z-index values block hover/click events **even when transparent**. Fix this by adding `pointer-events-none` to transparent containers and `pointer-events-auto` to interactive elements.

---

## The Problem

### Symptom

Your interactive grid has hover effects that work at screen edges but not near cards, text, or other content.

### Root Cause

HTML elements capture pointer events by default, regardless of whether they have a visible background. A transparent `<main>` or `<div>` at `z-10` will still intercept mouse events before they reach the grid at `z-0`.

```
Z-INDEX STACK (mouse events captured by first element encountered):

z-10: <main> (transparent but captures events!)
  └── Content cards, text, etc.

z-0:  <InteractiveGridPattern> (never receives events in content area)
```

---

## The Solution

### Pattern: Selective Pointer Events

```tsx
// Page structure with proper pointer-events

<div className="page-wrapper relative min-h-screen">
  {/* LAYER 1: Interactive grid at z-0 */}
  <InteractiveGridPattern className="absolute inset-0 z-0" />

  {/* LAYER 2: Content at z-10 with pointer-events-none on containers */}
  <main className="relative z-10 pointer-events-none">
    <div className="content-container pointer-events-none">

      {/* Interactive elements get pointer-events-auto */}
      <div className="card-wrapper pointer-events-auto">
        <Card>
          <Input />  {/* Works normally */}
          <Button /> {/* Works normally */}
        </Card>
      </div>

      {/* Decorative elements stay pointer-events-none */}
      <DecorativeElement className="pointer-events-none" />

    </div>
  </main>

  {/* LAYER 3: Footer with pointer-events-auto */}
  <footer className="pointer-events-auto relative z-10">
    <Link href="/about">About</Link>  {/* Works normally */}
  </footer>
</div>
```

---

## Implementation Checklist

### Containers (pointer-events-none)

Add `pointer-events-none` to:

- [ ] `<main>` element
- [ ] Content wrapper divs
- [ ] Any transparent containers at z-10+

### Interactive Elements (pointer-events-auto)

Add `pointer-events-auto` to:

- [ ] Card/form wrappers
- [ ] Navigation components
- [ ] Footer element
- [ ] Any element with buttons, inputs, or links

### Decorative Elements (pointer-events-none)

Add `pointer-events-none` to:

- [ ] Animated titles/displays
- [ ] Background decorations
- [ ] SVG/canvas overlays
- [ ] Any purely visual component

---

## Visual Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                     PAGE WRAPPER                             │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ InteractiveGridPattern (z-0, pointer-events-auto)   │    │
│  │                                                     │    │
│  │  ┌───────────────────────────────────────────┐     │    │
│  │  │ Main (z-10, pointer-events-none)          │     │    │
│  │  │                                           │     │    │
│  │  │   ┌───────────────────────────────┐      │     │    │
│  │  │   │ Card (pointer-events-auto)    │      │     │    │
│  │  │   │  ┌─────────────────────────┐  │      │     │    │
│  │  │   │  │ Input, Button, Links   │  │      │     │    │
│  │  │   │  │ (interactive - works!) │  │      │     │    │
│  │  │   │  └─────────────────────────┘  │      │     │    │
│  │  │   └───────────────────────────────┘      │     │    │
│  │  │                                           │     │    │
│  │  │   ↑ Empty space here allows grid hover   │     │    │
│  │  │                                           │     │    │
│  │  └───────────────────────────────────────────┘     │    │
│  │                                                     │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Footer (z-10, pointer-events-auto)                   │    │
│  │   Links work normally here                           │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## Code Examples

### React/Next.js Page Component

```tsx
export default function HomePage() {
  return (
    <div className="relative min-h-screen">
      {/* Interactive grid background */}
      <InteractiveGridPattern
        className="absolute inset-0 z-0"
        width={40}
        height={40}
      />

      {/* Main content - transparent container */}
      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center pointer-events-none">
        <div className="max-w-2xl w-full pointer-events-none">

          {/* Decorative header - no interaction needed */}
          <AnimatedTitle className="pointer-events-none" />

          {/* Interactive card - needs clicks */}
          <div className="pointer-events-auto">
            <Card>
              <form>
                <input type="text" placeholder="Enter URL..." />
                <button type="submit">Submit</button>
              </form>
            </Card>
          </div>

        </div>
      </main>

      {/* Footer - interactive */}
      <footer className="pointer-events-auto relative z-10">
        <nav>
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
        </nav>
      </footer>
    </div>
  );
}
```

### CSS-Only Alternative

If you prefer CSS over Tailwind classes:

```css
/* Transparent containers */
.content-main,
.content-container {
  pointer-events: none;
}

/* Interactive elements */
.card,
.form,
.nav,
.footer {
  pointer-events: auto;
}

/* Decorative elements */
.animated-title,
.background-decor {
  pointer-events: none;
}
```

---

## Common Mistakes

### Mistake 1: Forgetting the Footer

The footer is often outside `<main>` but still needs `pointer-events-auto`:

```tsx
// ❌ Footer links won't work
<footer>
  <a href="/admin">Admin</a>
</footer>

// ✅ Footer links work
<footer className="pointer-events-auto relative z-10">
  <a href="/admin">Admin</a>
</footer>
```

### Mistake 2: Adding pointer-events-auto Too High

Don't add `pointer-events-auto` to containers that should pass through:

```tsx
// ❌ This blocks grid interaction everywhere
<main className="pointer-events-auto">
  <Card />
</main>

// ✅ Only the card captures events
<main className="pointer-events-none">
  <div className="pointer-events-auto">
    <Card />
  </div>
</main>
```

### Mistake 3: Nesting Issues

Child elements inherit `pointer-events-none` from parents, so you must explicitly reset:

```tsx
// ❌ Button inherits pointer-events-none, won't work
<main className="pointer-events-none">
  <button>Click me</button>
</main>

// ✅ Button wrapper resets to auto
<main className="pointer-events-none">
  <div className="pointer-events-auto">
    <button>Click me</button>
  </div>
</main>
```

---

## Browser Support

`pointer-events` CSS property is supported in all modern browsers:

- Chrome 1+
- Firefox 1.5+
- Safari 4+
- Edge 12+
- IE 11 (limited)

---

## Performance Notes

- `pointer-events-none` has negligible performance impact
- The grid component should use efficient state management (track only hovered cells, not all cells)
- SVG-based grids with CSS transitions maintain 60fps performance
- Consider disabling hover effects on touch devices

---

## Related Documentation

- [MDN: pointer-events](https://developer.mozilla.org/en-US/docs/Web/CSS/pointer-events)
- [CSS z-index stacking context](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_positioned_layout/Understanding_z-index/Stacking_context)

---

## Summary

| Element Type | Class | Why |
|--------------|-------|-----|
| Grid pattern | `z-0` | Background layer |
| Main/containers | `z-10 pointer-events-none` | Above grid, passes clicks through |
| Cards/forms | `pointer-events-auto` | Captures user interaction |
| Decorative | `pointer-events-none` | Visual only, no interaction |
| Footer | `z-10 pointer-events-auto` | Links need to work |

This pattern ensures your interactive grid works in all empty spaces while preserving full UI functionality for cards, buttons, inputs, and links.
