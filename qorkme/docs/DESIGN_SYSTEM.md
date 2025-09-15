# QorkMe Design System

## Modern Dark Mode with Sophisticated Blues & Glassmorphism

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
- **Sophisticated Color Architecture**: Deep midnight blues with bright accent colors
- **Enhanced Glassmorphism**: Backdrop-blur effects with layered shadow systems
- **Advanced Dark Mode**: Primary focus on dark theme with sophisticated blue/purple/cyan palette
- **Bold Typography Excellence**: ZT Bros Oskon serif fonts with uppercase styling and strong character
- **Premium Interactions**: Shimmer effects, hover transforms, and floating animations

## Color Palette

### Light Theme - Natural & Warm

```css
/* Light Theme Base */
--color-background: linear-gradient(135deg, #f5e6d3 0%, #faf7f2 100%); /* Warm sandstone gradient */
--color-surface: rgba(250, 247, 242, 0.9); /* Light sand with transparency */
--color-surface-elevated: rgba(255, 255, 255, 0.95);
--color-primary: #8b7355; /* Desert sand brown */
--color-secondary: #3e2723; /* Rich earth brown */
--color-accent: #5d4037; /* Medium earth brown */

/* Text Colors */
--color-text-primary: #2e1a17; /* Deep brown */
--color-text-secondary: #5d4037; /* Medium brown */
--color-text-muted: #8b7355; /* Light brown */
```

### Dark Theme - Sophisticated Blues (Primary Focus)

```css
/* Dark Theme - Modern Sophistication */
--color-background: #0f172a; /* Deep midnight blue */
--color-surface: #1e293b; /* Slate blue surface */
--color-surface-elevated: #334155; /* Elevated slate */
--color-primary: #60a5fa; /* Bright blue */
--color-secondary: #a855f7; /* Rich purple */
--color-accent: #06b6d4; /* Cyan accent */

/* Text Colors */
--color-text-primary: #f1f5f9; /* Almost white */
--color-text-secondary: #cbd5e1; /* Light gray */
--color-text-muted: #64748b; /* Muted gray */

/* Enhanced Borders & Shadows */
--color-border: #475569; /* Gray border */
--color-shadow: rgba(0, 0, 0, 0.5);
--color-shadow-hover: rgba(0, 0, 0, 0.7);
```

### Design Philosophy & Usage

- **Primary Theme**: Dark mode as the primary experience with sophisticated midnight blue background
- **Accent Strategy**: Bright blue (#60a5fa), rich purple (#a855f7), and cyan (#06b6d4) for interactive elements
- **Card Design**: Glassmorphism with backdrop-blur effects and layered shadows
- **Interactive Elements**: Enhanced hover states with transforms, shimmer effects, and color transitions
- **Light Mode**: Natural sandstone/earth tones as secondary experience
- **Contrast**: Much improved from previous muddy browns to sophisticated high-contrast blues

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

### 1. Enhanced Card Component

**File**: `components/cards/Card.tsx`

**Variants**:

- `standard`: Glassmorphism card with backdrop-blur and subtle shadows
- `elevated`: Premium card with stronger borders, enhanced shadows, and accent highlights
- `interactive`: Enhanced hover states with transforms and shimmer effects

**Advanced Features**:

- **Glassmorphism Effects**: `backdrop-filter: blur(10px)` with transparency
- **Layered Shadow System**: Multiple shadow layers for depth
- **Hover Transforms**: `translateY(-6px) scale(1.01)` on hover
- **Shimmer Animations**: Gradient overlays with shimmer effects
- **Border Gradients**: Top border with gradient highlights
- **Responsive Design**: Touch-friendly on mobile with enhanced interactions

### 2. Enhanced Button Component

**File**: `components/ui/Button.tsx`

**Variants**:

- `primary`: Gradient from secondary to secondary-hover with shimmer effect
- `secondary`: Gradient from accent to accent-hover with enhanced shadows
- `accent`: Gradient from primary to primary-hover with sophisticated styling
- `outline`: Transparent with themed borders and glassmorphism hover
- `ghost`: Minimal with sophisticated hover gradients

**Advanced Features**:

- **Shimmer Effects**: `before:` pseudo-element with gradient sweep animation
- **Enhanced Transforms**: `hover:scale-[1.05]` and `active:scale-[0.95]`
- **Gradient Backgrounds**: Multiple gradient variants for each button type
- **Uppercase Typography**: ZT Bros Oskon with tracking and weight adjustments
- **Shadow Enhancements**: `shadow-xl` to `shadow-2xl` on hover
- **Transition Sophistication**: 300ms duration with advanced easing

### 3. Enhanced Input Component

**File**: `components/ui/Input.tsx`

**Advanced Features**:

- **Glassmorphism Base**: Surface background with backdrop-blur effects
- **Dynamic Borders**: 2px borders with sophisticated color transitions
- **Focus Enhancement**: Box-shadow with themed color and background change
- **Theme Integration**: Seamless integration with both light and dark modes
- **Typography Consistency**: ZT Bros Oskon font family throughout
- **Accessibility**: Enhanced focus-visible states and proper contrast ratios

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

## Advanced Animations & Effects

### Sophisticated Micro-Interactions

```css
/* Enhanced Card Hover with Glassmorphism */
.card:hover {
  transform: translateY(-6px) scale(1.01);
  box-shadow:
    0 20px 25px -5px var(--color-shadow-hover),
    0 10px 10px -5px var(--color-shadow);
  border-color: var(--color-primary);
  background: var(--color-surface-elevated);
}

/* Button Shimmer Effects */
.btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, transparent, rgba(255, 255, 255, 0.1));
  transform: translateX(-100%);
  transition: transform var(--transition-base);
}

.btn:hover::before {
  transform: translateX(0);
}

/* Advanced Button Interactions */
.btn:hover {
  transform: scale(1.05);
}

.btn:active {
  transform: scale(0.95);
}
```

### Advanced Animation Keyframes

```css
/* Floating Animation for Feature Cards */
@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  33% {
    transform: translateY(-8px) rotate(1deg);
  }
  66% {
    transform: translateY(-4px) rotate(-1deg);
  }
}

/* Enhanced Shimmer Effect */
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* Glow Animation for Accent Elements */
@keyframes glow {
  0%, 100% {
    box-shadow: 0 0 20px var(--color-primary);
  }
  50% {
    box-shadow: 0 0 30px var(--color-primary), 0 0 40px var(--color-primary);
  }
}
```

### Enhanced Animation Guidelines

- **Duration**: 150ms for micro-interactions, 300ms for complex transforms, 700ms for shimmer effects
- **Easing**: `cubic-bezier(0.4, 0, 0.2, 1)` for sophisticated movement patterns
- **Performance**: GPU-accelerated transforms and backdrop-filter effects
- **Layered Effects**: Multiple shadow layers and gradient overlays for depth
- **Accessibility**: Full `prefers-reduced-motion` support with graceful degradation
- **Purpose**: Create premium feel with sophisticated visual feedback

## Advanced Design Patterns

### 1. Glassmorphism Card Pattern

```css
.card {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  backdrop-filter: blur(10px);
  box-shadow:
    0 4px 6px -1px var(--color-shadow),
    0 2px 4px -1px var(--color-shadow);
  position: relative;
  overflow: hidden;
}

.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--color-primary), transparent);
  opacity: 0;
  transition: opacity var(--transition-base);
}

.card:hover {
  transform: translateY(-6px) scale(1.01);
  box-shadow:
    0 20px 25px -5px var(--color-shadow-hover),
    0 10px 10px -5px var(--color-shadow);
  border-color: var(--color-primary);
}

.card:hover::before {
  opacity: 1;
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

- **Font Loading**: `font-display: swap` for ZT Bros Oskon with comprehensive fallback system
- **Advanced Animation Performance**: GPU-accelerated backdrop-filter, transform, and opacity
- **Glassmorphism Optimization**: Efficient backdrop-blur rendering with minimal performance impact
- **Bundle Optimization**: Tree-shaking unused styles and sophisticated effect components
- **Lazy Loading**: Code splitting for animation-heavy and interactive components
- **Reduced Motion**: Graceful degradation for all shimmer, float, and transform animations
- **Shadow Layering**: Multi-layer shadow system optimized for both themes

### Advanced Theme Implementation

```css
/* Light Theme - Natural & Warm */
:root {
  color-scheme: light;
  --color-background: linear-gradient(135deg, #f5e6d3 0%, #faf7f2 100%);
  --color-surface: rgba(250, 247, 242, 0.9);
  --color-primary: #8b7355;
  --color-text-primary: #2e1a17;
}

/* Dark Theme - Sophisticated Blues (Primary Focus) */
[data-theme='dark'] {
  color-scheme: dark;
  --color-background: #0f172a; /* Deep midnight blue */
  --color-surface: #1e293b; /* Slate blue surface */
  --color-primary: #60a5fa; /* Bright blue */
  --color-secondary: #a855f7; /* Rich purple */
  --color-accent: #06b6d4; /* Cyan accent */
  --color-text-primary: #f1f5f9;
}

/* Enhanced Background Patterns */
[data-theme='dark'] body::before {
  background-image:
    radial-gradient(circle at 20% 80%, rgba(96, 165, 250, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(168, 85, 247, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(6, 182, 212, 0.03) 0%, transparent 50%);
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

## Summary

This sophisticated design system represents a major evolution from basic card layouts to premium glassmorphism effects. The dark mode-first approach with sophisticated blue/purple/cyan palette creates a modern, high-end aesthetic that rivals premium SaaS applications.

### Key Achievements:

- **Glassmorphism Excellence**: Backdrop-blur effects with layered shadows
- **Advanced Animations**: Shimmer effects, floating animations, and sophisticated hover states
- **Dark Mode Sophistication**: Midnight blue (#0f172a) to bright accent colors (#60a5fa, #a855f7, #06b6d4)
- **Enhanced Interactivity**: Scale transforms, gradient overlays, and premium visual feedback
- **Typography Excellence**: ZT Bros Oskon with uppercase styling and enhanced spacing
- **Performance Optimized**: GPU-accelerated effects with graceful degradation

This design system ensures QorkMe delivers a premium, sophisticated user experience that stands out in the URL shortener market.
