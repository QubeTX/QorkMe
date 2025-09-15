# QorkMe Design System

## Sophisticated Sandstone & Earth Tone Aesthetic

### Table of Contents

1. [Design Philosophy](#design-philosophy)
2. [Color Palette](#color-palette)
3. [Typography](#typography)
4. [Spacing & Grid](#spacing--grid)
5. [Theme System](#theme-system)
6. [Components](#components)
7. [Animations](#animations)
8. [Design Patterns](#design-patterns)

---

## Design Philosophy

QorkMe's design system embraces sophisticated minimalist principles, emphasizing:

- **Refined & Functional**: Every element serves a purpose with elegant clarity
- **Sandstone Color Harmony**: Warm earth tones that feel natural and sophisticated
- **Enhanced Card Architecture**: Elevated content with stronger borders and accent highlights
- **Seamless Theming**: Intelligent light/dark mode with deep earth tone transitions
- **Bold Typography Excellence**: ZT Bros Oskon serif fonts with uppercase styling and strong character
- **Sophisticated Interactions**: Enhanced hover effects and refined animations that elevate usability

## Color Palette

### Sandstone & Earth Tones

```css
/* Primary Colors */
--sandstone-bg: #f5e6d3; /* Warm sandstone background */
--sand-surface: #faf7f2; /* Light sand surface */
--desert-sand: #8b7355; /* Desert sand brown primary */
--earth-brown: #3e2723; /* Rich earth brown secondary */
--medium-earth: #5d4037; /* Medium earth brown accent */

/* Hover States */
--desert-sand-hover: #6d5a44; /* Desert sand hover */
--earth-brown-hover: #2e1a17; /* Earth brown hover */
--medium-earth-hover: #4e342e; /* Medium earth hover */

/* Surface Colors */
--surface-elevated: #ffffff; /* Elevated card backgrounds */
--sandy-border: #d4b896; /* Sandy border color */
--border-hover: #c4a57d; /* Border hover state */
```

### Dark Theme Colors

```css
/* Dark Theme Overrides */
--dark-earth: #1a1410; /* Dark earth background */
--dark-surface: #2e2520; /* Dark brown surface */
--dark-elevated: #3e342e; /* Dark elevated surface */
--sandy-tan: #d4b896; /* Sandy tan primary */
--light-sandstone: #f5e6d3; /* Light sandstone secondary */
--medium-sand: #c4a57d; /* Medium sand accent */
--dark-border: #4e3f36; /* Dark theme borders */
--dark-border-hover: #5d4a3f; /* Dark border hover */
```

### Semantic Usage

- **Primary Actions**: Desert Sand Brown variants with stronger presence
- **Secondary Actions**: Rich Earth Brown for sophisticated contrast
- **Accent Elements**: Medium Earth Brown for highlights and features
- **Success States**: Earthy Green (#7cb342) maintaining earth tone consistency
- **Warning States**: Burnt Orange (#f57c00) complementing the warm palette
- **Text Hierarchy**: Deep Brown (light) / Light Sandstone (dark)
- **Backgrounds**: Warm Sandstone (light) / Deep Earth (dark)
- **Cards**: Enhanced with stronger borders and earth tone accent highlights

## Typography

### ZT Bros Oskon Font System

```css
/* Primary Fonts */
--font-display: 'ZT Bros Oskon', 'Playfair Display', Georgia, serif; /* Headlines, hero text */
--font-body: 'ZT Bros Oskon', 'Crimson Text', Georgia, serif; /* Body text, paragraphs */
--font-mono: 'JetBrains Mono', 'Courier New', monospace; /* Code, technical content */

/* Fallback Fonts (Google Fonts) */
--font-fallback: 'Playfair Display', 'Crimson Text', Georgia, serif;
```

### Responsive Type Scale (CSS Clamp)

```css
/* Fluid Typography */
--text-xs: clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem); /* 12-14px */
--text-sm: clamp(0.875rem, 0.8rem + 0.375vw, 1rem); /* 14-16px */
--text-base: clamp(1rem, 0.9rem + 0.5vw, 1.125rem); /* 16-18px */
--text-lg: clamp(1.125rem, 1rem + 0.625vw, 1.25rem); /* 18-20px */
--text-xl: clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem); /* 20-24px */
--text-2xl: clamp(1.5rem, 1.3rem + 1vw, 2rem); /* 24-32px */
--text-3xl: clamp(2rem, 1.7rem + 1.5vw, 2.75rem); /* 32-44px */
--text-4xl: clamp(2.75rem, 2.3rem + 2.25vw, 4rem); /* 44-64px */
```

### Typography Hierarchy

- **Display (ZT Bros Oskon)**: Hero headlines with uppercase styling and bold weight
- **Headings (ZT Bros Oskon)**: Page titles and section headers with strong serif character
- **Body (ZT Bros Oskon)**: Paragraphs, UI text, forms with refined serif readability
- **Code (JetBrains Mono)**: Technical content, URLs, code snippets
- **Text Transform**: Uppercase for headings and buttons for modern impact
- **Line Heights**: 1.7 for body text, 1.1 for headings for tighter spacing
- **Font Weights**: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

## Spacing & Grid

### 8px Grid System

Base unit: `8px` - All spacing follows 8px increments for visual consistency

### Spacing Scale

```css
--space-1: 0.25rem; /* 4px  - Tight spacing */
--space-2: 0.5rem; /* 8px  - Base unit */
--space-3: 0.75rem; /* 12px - Small spacing */
--space-4: 1rem; /* 16px - Standard spacing */
--space-6: 1.5rem; /* 24px - Medium spacing */
--space-8: 2rem; /* 32px - Large spacing */
--space-12: 3rem; /* 48px - Extra large */
--space-16: 4rem; /* 64px - Section spacing */
--space-20: 5rem; /* 80px - Page spacing */
```

### Container System

```css
/* Responsive Container Widths */
--container-sm: 640px; /* Small devices */
--container-md: 768px; /* Tablets */
--container-lg: 1024px; /* Laptops */
--container-xl: 1280px; /* Desktops */
--container-2xl: 1536px; /* Large screens */

/* Content Constraints */
--content-width: 65ch; /* Optimal reading width */
--sidebar-width: 280px; /* Navigation sidebars */
```

## Theme System

### CSS Custom Properties Architecture

```css
:root {
  /* Light Theme (Default) */
  --bg-primary: var(--sandstone-bg);
  --bg-secondary: var(--sand-surface);
  --text-primary: var(--earth-brown);
  --text-secondary: var(--medium-earth);
  --accent-primary: var(--desert-sand);
  --accent-secondary: var(--medium-earth);
}

[data-theme='dark'] {
  /* Dark Theme Overrides */
  --bg-primary: var(--dark-earth);
  --bg-secondary: var(--dark-surface);
  --text-primary: var(--light-sandstone);
  --text-secondary: var(--sandy-tan);
  --accent-primary: var(--sandy-tan);
  --accent-secondary: var(--medium-sand);
}
```

### Theme Transitions

```css
* {
  transition:
    background-color 250ms ease,
    color 250ms ease,
    border-color 250ms ease;
}
```

## Components

### 1. Card Component

**File**: `components/cards/Card.tsx`

**Variants**:

- `standard`: Basic card with subtle shadow
- `elevated`: Enhanced shadow for emphasis
- `interactive`: Hover effects and cursor pointer

**Features**:

- Soft border-radius (8px)
- Box shadow: subtle depth without harsh borders
- Theme-aware background colors
- Smooth hover transitions
- Responsive padding

### 2. Button Component

**File**: `components/ui/Button.tsx`

**Variants**:

- `primary`: Desert sand brown background, light text
- `secondary`: Rich earth brown background, light text
- `outline`: Transparent with earth brown border
- `ghost`: No background, enhanced hover effects

**Sizes**:

- `sm`: 36px height, compact padding
- `md`: 44px height, standard padding
- `lg`: 52px height, generous padding

**Design Rules**:

- Rounded corners (4px) for refined aesthetic
- Stronger borders with earth tone accents
- ZT Bros Oskon font, semibold weight with uppercase styling
- Hover: enhanced scale and pronounced color shifts
- Focus: 2px outline with earth brown theme color
- Disabled: reduced opacity and cursor, muted earth tones

### 3. Input Component

**File**: `components/ui/Input.tsx`

**Features**:

- Enhanced border (2px) with sandstone-themed colors
- Refined corners (4px) for sophisticated feel
- Focus state: 2px earth brown outline with sandstone background
- Error state: deep red border with earth tone integration
- Success state: earthy green border maintaining palette consistency
- Generous padding (16px horizontal, 12px vertical)
- Placeholder text with earth tone contrast optimization

### 4. FeatureCard Component

**File**: `components/cards/FeatureCard.tsx`

**Features**:

- Icon integration with Lucide React icons
- Structured content layout (icon, title, description)
- Hover effects with subtle lift animation
- Theme-aware styling
- Responsive design for mobile/desktop

### 5. ThemeToggle Component

**File**: `components/ThemeToggle.tsx`

**Features**:

- Smooth icon transitions (Sun/Moon)
- Theme persistence in localStorage
- System preference detection
- Accessible button with proper ARIA labels
- Consistent styling with button variants

### 6. URL Shortener Form

**File**: `components/UrlShortener.tsx`

**Structure**:

- Clean card-based layout
- Large, accessible input field
- Optional custom alias section
- Primary action button with loading states
- Icon integration with consistent sizing
- Form validation feedback

### 7. Short URL Display

**File**: `components/ShortUrlDisplay.tsx`

**Features**:

- Card-based result presentation
- One-click copy functionality with toast feedback
- QR code generation in modal/expandable section
- Analytics preview with clean data visualization
- Share buttons for social platforms
- Responsive layout for all devices

## Animations

### Micro-Interactions

```css
/* Enhanced Hover Effects */
.card-hover {
  transition:
    transform 250ms ease,
    box-shadow 250ms ease,
    border-color 250ms ease;
}

.card-hover:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(62, 39, 35, 0.15);
  border-color: var(--color-border-hover);
}

/* Button Interactions */
.button-press {
  transition: transform 150ms ease;
}

.button-press:active {
  transform: scale(0.98);
}

/* Theme Transitions */
.theme-transition {
  transition:
    background-color 250ms ease,
    color 250ms ease;
}
```

### Loading States

```css
/* Shimmer Effect */
@keyframes shimmer {
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
}

.loading-shimmer {
  background: linear-gradient(90deg, transparent, rgba(135, 169, 107, 0.1), transparent);
  animation: shimmer 1.5s infinite;
}
```

### Animation Guidelines

- **Duration**: 150ms for micro-interactions, 250ms for theme changes, 1.5s for loading
- **Easing**: `ease` for natural movement, `ease-in-out` for reversible animations
- **Performance**: Prioritize transform and opacity for GPU acceleration
- **Accessibility**: Respect `prefers-reduced-motion` user preferences
- **Purpose**: Enhance usability, provide feedback, maintain user engagement

## Design Patterns

### 1. Card Pattern

```css
.modern-card {
  background: var(--color-surface);
  border-radius: 12px;
  border: 1px solid var(--color-border);
  box-shadow: 0 2px 8px var(--color-shadow);
  padding: 2rem;
  transition:
    transform 250ms ease,
    box-shadow 250ms ease,
    border-color 250ms ease;
}

.modern-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px var(--color-shadow-hover);
  border-color: var(--color-border-hover);
}
```

### 2. Content Hierarchy

- **Hero Sections**: Large typography, generous spacing, centered content
- **Feature Sections**: Card-based layout with icons and descriptive text
- **Form Areas**: Clean inputs with proper labeling and validation states
- **Navigation**: Minimal, icon-supported, theme-aware

### 3. Form Patterns

- **Labels**: ZT Grafton medium, adequate contrast
- **Inputs**: Rounded corners, comfortable padding, clear focus states
- **Buttons**: Contextual colors, appropriate sizing, loading states
- **Validation**: Inline feedback with color and text cues
- **Layout**: Logical flow, responsive stacking

### 4. Interactive States

- **Hover**: Subtle lift (2px), shadow enhancement, color shifts
- **Focus**: 2px outline in theme color, enhanced visibility
- **Active**: Gentle scale down (0.98), immediate feedback
- **Disabled**: Reduced opacity (0.6), cursor not-allowed, muted colors
- **Loading**: Shimmer effects, skeleton states, progress indicators

### 5. Toast Notifications

```css
.toast-notification {
  background: var(--color-surface);
  color: var(--color-text-primary);
  border: 2px solid var(--color-primary);
  border-radius: 8px;
  font-family: var(--font-body);
  box-shadow: 0 4px 12px var(--color-shadow);
}
```

### 6. Layout Patterns

- **Hero Section**: Centered content with feature cards below
- **Grid Layouts**: CSS Grid with auto-fit columns, responsive breakpoints
- **Navigation**: Clean header with theme toggle and minimal links
- **Footer**: Simple, informative, matching header styling
- **Responsive Design**: Mobile-first approach with progressive enhancement

## Responsive Design

### Breakpoints System

```css
/* Tailwind-based breakpoints */
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablets */
lg: 1024px  /* Laptops */
xl: 1280px  /* Desktops */
2xl: 1536px /* Large screens */
```

### Mobile-First Strategy

- **Layout**: Single column on mobile, progressive multi-column on larger screens
- **Typography**: Fluid scaling with CSS clamp for optimal readability
- **Spacing**: Tighter spacing on mobile, more generous on desktop
- **Cards**: Full-width on mobile, grid-based on larger screens
- **Navigation**: Collapsible/drawer on mobile, horizontal on desktop
- **Interactive Elements**: Touch-friendly sizing (minimum 44px) on mobile

## Accessibility

### WCAG 2.1 AA Compliance

- **Color Contrast**: All text combinations exceed 4.5:1 ratio
- **Focus Management**: Clear, consistent focus indicators (2px outline)
- **Color Independence**: Information not conveyed by color alone
- **Theme Support**: High contrast options in dark mode

### Keyboard Navigation

- **Tab Order**: Logical navigation flow through interactive elements
- **Focus Trapping**: Modal dialogs properly contain focus
- **Skip Links**: Available for screen reader users
- **Keyboard Shortcuts**: Standard browser shortcuts supported

### Screen Reader Support

- **Semantic HTML**: Proper heading hierarchy, landmark elements
- **ARIA Labels**: Descriptive labels for icons and complex interactions
- **Live Regions**: Dynamic content updates announced
- **Form Labels**: Explicit association between labels and inputs
- **Alternative Text**: Meaningful descriptions for images and icons

### Motion and Animation

- **Reduced Motion**: Respects `prefers-reduced-motion` user preference
- **Animation Controls**: Option to disable non-essential animations
- **Performance**: Smooth animations that don't cause vestibular disorders

## Implementation Notes

### CSS Architecture

- **Utility-First**: Tailwind CSS v4 with custom design tokens
- **Custom Properties**: CSS variables for all colors, spacing, and typography
- **Component Scope**: Styled-components or CSS modules for complex components
- **Global Styles**: Essential base styles and theme variables in `app/globals.css`
- **Design Tokens**: Centralized system for consistent values across the application

### Performance Optimization

- **Font Loading**: `font-display: swap` for ZT Bros Oskon with serif fallbacks
- **Animation Performance**: GPU-accelerated properties (transform, opacity)
- **Bundle Optimization**: Tree-shaking unused styles and components
- **Lazy Loading**: Code splitting for non-critical components
- **Reduced Motion**: Conditional animations based on user preferences
- **Enhanced Shadows**: Optimized shadow rendering with earth tone colors

### Theme Implementation

```css
/* Theme Provider with CSS Custom Properties */
:root {
  color-scheme: light;
  --color-background: #f5e6d3; /* Warm sandstone */
  --color-surface: #faf7f2; /* Light sand */
  --color-primary: #8b7355; /* Desert sand brown */
  --color-text-primary: #2e1a17; /* Deep brown */
}

[data-theme='dark'] {
  color-scheme: dark;
  --color-background: #1a1410; /* Dark earth */
  --color-surface: #2e2520; /* Dark brown surface */
  --color-primary: #d4b896; /* Sandy tan */
  --color-text-primary: #f5e6d3; /* Light sandstone */
}

/* Enhanced transitions */
* {
  transition:
    background-color 250ms ease,
    color 250ms ease,
    border-color 250ms ease;
}
```

### Development Workflow

- **Design Tokens**: Centralized token system for design consistency
- **Component Library**: Reusable components with consistent styling
- **TypeScript**: Type-safe component props and theme values
- **Testing**: Visual regression testing for design system components
- **Documentation**: Living style guide with interactive examples

---

## Component Usage Examples

### Card Components

```tsx
// Basic Card
<Card variant="standard">
  <p>Card content here</p>
</Card>

// Interactive Feature Card
<FeatureCard
  icon={<LinkIcon />}
  title="Smart URL Shortening"
  description="Generate memorable short codes with intelligent patterns"
/>
```

### Button Variants

```tsx
// Primary Action
<Button variant="primary" size="lg">
  Shorten URL
</Button>

// Secondary Action
<Button variant="outline" size="md">
  Copy Link
</Button>
```

### Form Elements

```tsx
// URL Input with Validation
<Input
  type="url"
  placeholder="Enter your long URL..."
  error={validationError}
  success={isValid}
/>

// Theme Toggle
<ThemeToggle />
```

### Layout Components

```tsx
// Page Container
<div className="container mx-auto px-4 py-8">
  <Card variant="elevated">{/* Main content */}</Card>
</div>
```

---

This modern design system ensures visual consistency and excellent user experience across the QorkMe application while maintaining clean, professional aesthetics that scale beautifully across all devices and themes.
