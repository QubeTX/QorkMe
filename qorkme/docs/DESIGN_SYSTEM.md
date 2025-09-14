# QorkMe Design System

## Bauhaus-Inspired Industrial Functional Design

### Table of Contents

1. [Design Philosophy](#design-philosophy)
2. [Color Palette](#color-palette)
3. [Typography](#typography)
4. [Spacing & Grid](#spacing--grid)
5. [Components](#components)
6. [Animations](#animations)
7. [Design Patterns](#design-patterns)

---

## Design Philosophy

QorkMe's design system is built on Bauhaus principles, emphasizing:

- **Form Follows Function**: Every design element serves a purpose
- **Geometric Simplicity**: Basic shapes (circles, squares, triangles) as fundamental elements
- **Industrial Aesthetics**: Bold, clean lines with functional beauty
- **Minimalism**: Reduction to essential elements only
- **Unity of Art & Technology**: Seamless integration of aesthetic and functional elements

## Color Palette

### Primary Colors

```css
--bauhaus-red: #dc143c; /* Crimson - Secondary actions, alerts */
--bauhaus-blue: #0048ba; /* Cobalt Blue - Primary actions, links */
--bauhaus-yellow: #ffd700; /* Gold - Accents, highlights */
```

### Neutral Colors

```css
--bauhaus-black: #0a0a0a; /* Near black - Primary text, borders */
--bauhaus-white: #fafafa; /* Off white - Backgrounds */
--bauhaus-gray: #71797e; /* Slate gray - Secondary text, disabled states */
```

### Semantic Usage

- **Primary Actions**: Bauhaus Blue
- **Destructive/Alert**: Bauhaus Red
- **Success/Accent**: Bauhaus Yellow
- **Text**: Bauhaus Black on White, White on Black (dark mode)
- **Borders**: Always Bauhaus Black, 3-4px width

## Typography

### Font Families

```css
--font-display: 'Bebas Neue', sans-serif; /* Headlines, buttons */
--font-body: 'Inter', sans-serif; /* Body text, forms */
```

### Type Scale (Major Third - 1.25 ratio)

```
Display: 8rem  (128px) - Hero titles
H1:      4rem  (64px)  - Page titles
H2:      2.5rem (40px) - Section headers
H3:      1.5rem (24px) - Subsections
Body:    1rem  (16px)  - Standard text
Small:   0.875rem (14px) - Captions
```

### Typography Rules

- Display font: ALWAYS UPPERCASE, increased letter-spacing
- Body font: Sentence case, normal spacing
- Line height: 1.6 for body, 1.2 for headlines
- Font weights: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

## Spacing & Grid

### Grid Unit

Base unit: `8px` - All spacing should be multiples of 8px

### Spacing Scale

```css
--space-xs: 8px; /* 1 unit */
--space-sm: 16px; /* 2 units */
--space-md: 24px; /* 3 units */
--space-lg: 32px; /* 4 units */
--space-xl: 48px; /* 6 units */
--space-2xl: 64px; /* 8 units */
```

### Container Widths

- Mobile: 100% - 32px padding
- Tablet: 768px max
- Desktop: 1200px max
- Content: 800px max (reading width)

## Components

### 1. Button Component

**File**: `components/ui/Button.tsx`

**Variants**:

- `primary`: Blue background, white text
- `secondary`: Red background, white text
- `accent`: Yellow background, black text
- `outline`: Transparent with border

**Sizes**:

- `sm`: 32px height, 14px text
- `md`: 40px height, 16px text
- `lg`: 48px height, 18px text

**Design Rules**:

- 3px solid border (bauhaus-border class)
- Uppercase text with display font
- Hover: scale(1.05)
- Active: scale(0.95)
- Disabled: 50% opacity

### 2. Input Component

**File**: `components/ui/Input.tsx`

**Features**:

- 3px solid black border
- 4px focus ring (blue, 30% opacity)
- Error state: red border
- Placeholder: gray color
- Padding: 16px horizontal, 12px vertical

### 3. Geometric Decorations

**File**: `components/bauhaus/GeometricDecor.tsx`

**Elements**:

- Floating circles (red, blue)
- Rotating squares (45° rotation)
- Triangles (CSS borders technique)
- Opacity: 10-20% for background elements

**Animations**:

- `animate-float`: 4s ease-in-out infinite vertical movement
- `animate-rotate-slow`: 20s linear infinite rotation

### 4. URL Shortener Form

**File**: `components/UrlShortener.tsx`

**Structure**:

- Large primary input field
- Optional custom alias section (collapsible)
- Single primary action button
- Icon integration (Lucide icons)

### 5. Short URL Display

**File**: `components/ShortUrlDisplay.tsx`

**Features**:

- Copy to clipboard functionality
- QR code generation
- Analytics preview
- Bauhaus-styled cards with borders

## Animations

### Defined Animations

```css
@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes rotate-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
```

### Animation Guidelines

- Use sparingly for emphasis
- Duration: 200ms for micro-interactions, 4s+ for ambient animations
- Easing: ease-in-out for natural movement
- Performance: Use transform and opacity only

## Design Patterns

### 1. Card Pattern

```css
.bauhaus-card {
  border: 4px solid var(--bauhaus-black);
  background: var(--bauhaus-white);
  padding: 24px;
}
```

### 2. Geometric Logo Pattern

Combine three shapes to create brand identity:

- Circle (red)
- Square rotated 45° (blue)
- Triangle (yellow)

### 3. Form Patterns

- Labels: Display font, uppercase, small size
- Inputs: Full width, substantial padding
- Buttons: Full width on mobile, auto width on desktop
- Validation: Red border for errors, green for success

### 4. Layout Patterns

- **Hero Section**: Centered content, geometric decorations
- **Grid Layout**: 3-column on desktop, 1-column on mobile
- **Feature Cards**: Equal height, geometric shape icons
- **Footer**: Minimal, centered, display font

### 5. Interactive States

- **Hover**: Scale transform or color opacity change
- **Focus**: 4px ring with 30% opacity
- **Active**: Scale down (0.95)
- **Disabled**: 50% opacity, cursor not-allowed

### 6. Toast Notifications

```javascript
style: {
  background: 'var(--bauhaus-white)',
  color: 'var(--bauhaus-black)',
  border: '3px solid var(--bauhaus-black)',
  fontFamily: 'var(--font-display)',
  textTransform: 'uppercase',
}
```

## Responsive Design

### Breakpoints

```css
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
```

### Mobile-First Approach

- Stack elements vertically on mobile
- Increase spacing on larger screens
- Show/hide decorative elements based on screen size
- Adjust font sizes proportionally

## Accessibility

### Color Contrast

- All text meets WCAG AA standards
- Primary colors tested for sufficient contrast
- Focus indicators clearly visible

### Keyboard Navigation

- All interactive elements keyboard accessible
- Clear focus states
- Logical tab order
- Skip links where appropriate

### Screen Readers

- Semantic HTML structure
- ARIA labels for icons
- Descriptive button text
- Form labels properly associated

## Implementation Notes

### CSS Architecture

- Utility-first with Tailwind CSS v4
- Custom properties for theme values
- Component-specific styles in component files
- Global styles in `app/globals.css`

### Performance Considerations

- Optimize font loading (display: swap)
- Minimize animation on low-end devices
- Use CSS transforms for animations
- Lazy load heavy components

### Dark Mode Support

```css
@media (prefers-color-scheme: dark) {
  :root {
    --background: var(--bauhaus-black);
    --foreground: var(--bauhaus-white);
  }
}
```

---

## Component Usage Examples

### Button

```tsx
<Button variant="primary" size="lg">
  Shorten URL
</Button>
```

### Input

```tsx
<Input type="url" placeholder="Enter URL..." error={hasError} />
```

### Geometric Decoration

```tsx
<GeometricDecor className="opacity-20" />
```

---

This design system ensures consistency across the QorkMe application while maintaining the bold, functional aesthetic of Bauhaus design principles.
