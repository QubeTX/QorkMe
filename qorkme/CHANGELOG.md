# Changelog

## [3.0.29] - 2025-10-18

### Changed

- **SiteFooter Alignment and Layout** (components/SiteFooter.tsx)
  - Fixed vertical alignment issues by replacing `<p>` element with `<span>` for consistent inline behavior
  - Removed "Designed in San Francisco • " text, now reads "Powered by Supabase & Vercel"
  - Updated responsive breakpoints from `sm:` to `md:` for consistent layout switching across both columns
  - Implemented edge-aligned layout with `md:justify-between` for left-flush and right-flush column positioning
  - Added `md:px-8` padding to parent container for comfortable breathing room from viewport edges
  - Removed `md:flex-1 md:basis-0` from columns to allow natural content-based sizing
  - Both columns now use matching `flex flex-col gap-2 md:flex-row md:items-center md:gap-6` pattern
  - Consistent `md:leading-none` line-height across all text elements for proper baseline alignment

## [3.0.28] - 2025-10-18

### Added

- **Interactive Grid Background Pattern** (components/ui/interactive-grid-pattern.tsx)
  - New SVG-based interactive grid background with organic noise texture
  - 20×20 grid (400 cells) at 40px cell size for subtle visual depth
  - Terracotta hover effect using `--color-primary` at 12% opacity
  - SVG fractal noise filter creates paper-like opacity variation (0.4-1.0 range) on grid lines
  - Single SVG element with minimal DOM overhead for 60fps performance
  - React state tracking only for hovered cells (not all 400 cells)
  - CSS transitions handle animations, pointer events isolated to interactive cells
  - Grid lines use `--color-border-strong` with strokeOpacity 0.6 for visible earthy strokes
  - Integrated into homepage (app/page.tsx) as absolute positioned background layer (z-0)

- **Comprehensive Grid Documentation**
  - CLAUDE.md: Added Interactive Grid Background section with implementation details and customization guide
  - docs/UI_LAYOUT_GUIDE.md: Added complete Interactive Grid Background section with:
    - Noise filter parameter explanations (baseFrequency, numOctaves, feColorMatrix)
    - Grid density and size customization examples
    - Performance considerations and cell limits
    - Common adjustment patterns (visibility, noise intensity, hover colors)
  - docs/DESIGN_SYSTEM.md: Added Interactive Grid Background subsection under Elevation & Effects:
    - Visual characteristics and design token usage
    - Noise filter specifications with alpha modulation formula
    - Performance metrics and usage guidelines

## [3.0.27] - 2025-10-18

### Added

- **Comprehensive Documentation Enhancements** (CLAUDE.md, docs/UI_LAYOUT_GUIDE.md)
  - Created new 683-line UI_LAYOUT_GUIDE.md documenting critical layout patterns, Tailwind v4 issues, and troubleshooting
  - Added Critical UI/Layout Patterns section to CLAUDE.md covering:
    - Tailwind v4 gotchas (inset-0 with padding, backdrop-blur browser support, container overflow)
    - Component-specific implementation patterns
    - Common pitfalls and their solutions
  - Added Development Troubleshooting section with cache clearing and verification commands
  - Expanded component structure documentation to include ui/ subdirectory (matrix.tsx, shimmering-text.tsx)
  - Added Matrix Display implementation details (12-hour format, deterministic rendering, hydration fixes)
  - Added URL Shortener Card Interactions documentation (3D tilt animation, responsive padding architecture)
  - Added "Modify matrix display or clock" task to Common Development Tasks

### Changed

- **Documentation Updates** (CLAUDE.md)
  - Updated custom alias validation length from 3-8 to 3-50 characters to match current implementation
  - Enhanced Typography section with stricter font usage rules (ZT Bros Oskon for display, Inter Regular 400 for body/UI)
  - Expanded Testing Strategy with specific test file paths and npm run commands
  - Added UI_LAYOUT_GUIDE.md reference to Documentation section

## [3.0.26] - 2025-10-18

### Changed

- **UrlShortener 3D Tilt Animation** (components/UrlShortener.tsx, lines 32-33)
  - Reduced cursor-following rotation effect divisor from `/20` to `/80`
  - Creates extremely subtle 3D tilt effect instead of exaggerated movement
  - Provides refined, non-distracting visual feedback on mouse movement

- **UrlShortener Label Spacing** (components/UrlShortener.tsx, line 161)
  - Increased "Enter Your URL" label margin from `mb-4` (16px) to `mb-6` (24px)
  - Improves visual breathing room between label text and container edges
  - Better aligns with responsive padding across mobile, tablet, and desktop

## [3.0.25] - 2025-10-18

### Fixed

- **React Hydration Mismatch** (components/ui/matrix.tsx, lines 187-188)
  - Fixed hydration error by adding explicit `px` units to width/height inline styles
  - Changed from `width: size` to `width: \`${size}px\`` to ensure server/client HTML match
  - Changed from `height: size` to `height: \`${size}px\`` to ensure consistent rendering
  - Eliminates console warnings about attribute mismatches between server and client

- **UrlShortener Padding Issue** (components/UrlShortener.tsx)
  - Fixed Input field and Button touching card edges by restructuring padding architecture
  - Removed `p-6 sm:p-8 md:p-12` from parent card container (line 126)
  - Added matching padding to each state container (Input/Loading/Output) with `inset-0` for absolute positioning
  - Ensures consistent internal spacing: 24px mobile, 32px small screens, 48px desktop
  - Input focus rings now display properly without being clipped by parent overflow
  - All three states (Input/Loading/Output) maintain proper breathing room from card edges

- **Non-Deterministic Rendering** (components/MatrixDisplay.tsx, lines 78-80)
  - Removed `Math.random()` sparkle effect from title animation
  - Ensures server and client render identical HTML for shimmer effect
  - Prevents hydration mismatches caused by random values

### Changed

- **Time Display Format** (components/MatrixDisplay.tsx, lines 103-134, 163, 221)
  - Converted from 24-hour format (HH:MM:SS) to 12-hour format with AM/PM (HH:MM:SS AM/PM)
  - Hours now display in 1-12 range instead of 0-23
  - Added AM/PM period detection based on 24-hour time
  - Increased matrix width from 54 to 66 columns to accommodate longer time string
  - Updated character map to include space, 'A', 'P', 'M' letters
  - Updated ARIA label to "Current time in 12-hour format with AM/PM" for accessibility

### Added

- **Letter Patterns** (components/ui/matrix.tsx, lines 533-550)
  - Added uppercase 'A' pattern (7×5 matrix) for AM/PM display
  - Added uppercase 'P' pattern (7×5 matrix) for AM/PM display
  - 'M' pattern already existed from "Qork.Me" title

- **Testing Documentation** (TESTING_CHECKLIST.md)
  - Created comprehensive testing checklist for Playwright session
  - Includes visual verification steps for all three fixes
  - Console error checks for hydration issues
  - Accessibility compliance verification
  - Responsive padding tests across breakpoints
  - Playwright test code examples for automated testing
  - Success criteria checklist and rollback plan

## [3.0.24] - 2025-10-18

### Changed

- Completely redesigned MatrixBackground component (components/MatrixBackground.tsx):
  - Replaced canvas-based moving dots and connection lines with unified viewport-filling Matrix display
  - Implemented single large matrix grid that dynamically calculates dimensions based on viewport size (~200×100 cells for typical screens)
  - Added centered digital clock displaying HH:MM:SS in retro 7-segment style using the digits preset from matrix.tsx
  - Created custom frame generator combining radial wave effects emanating from center with horizontal wave patterns
  - Waves pulse outward from clock center creating mesmerizing unified animation across entire background
  - Uses terracotta color palette (rgba(196, 114, 79)) matching QorkMe's earthy design system
  - Real-time clock updates every second without flickering
  - Optimized with memoization: frames only regenerate when time changes
  - 24 frames at 18 FPS for smooth retro aesthetic
  - 7px cells with 2px gaps for subtle background presence

### Added

- Created comprehensive technical documentation (MATRIX_BACKGROUND_PLAN.md) including implementation specifications, frame generation algorithms, performance optimization strategies, and troubleshooting guide

### Fixed

- Fixed TypeScript type compatibility issue in shimmering-text component (components/ui/shimmering-text.tsx) for framer-motion margin property with eslint-disable directive

## 2025-10-14 12:45

### Fixed

- Fixed horizontal alignment in SiteFooter component (qorkme/components/SiteFooter.tsx) by standardizing line-height values across all footer text elements to use `md:leading-none` at desktop breakpoints.
- Removed redundant flex classes from subtitle span.
- Ensures "QorkMe", "Thoughtful short links for modern teams", "Designed in San Francisco • Powered by Supabase & Vercel", and "Admin" are all aligned on the same horizontal baseline in the footer.

## 2025-10-12 20:47

- Documented the Prettier cleanup for the root changelog to keep CI formatting checks green.

## 2025-10-10 09:30

- Added top offset to the SiteHeader so the glass navbar no longer presses against the viewport edge across breakpoints.

## 2025-10-10 08:48

- Restored padding and vertical rhythm for the UrlShortener custom alias dropdown so the toggle and fields align with the design system spacing.

All notable changes to the QorkMe URL Shortener project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0.23] - 2025-10-10

### Changed

- Raised the fixed SiteHeader to `top-5 md:top-6` so the navbar consistently clears the top window edge.

## [3.0.22] - 2025-10-10

### Changed

- Removed background styling from the SiteHeader Link2 icon container (line 78) to display the icon without background, border, rounded corners, or shadow.
- Simplified the ThemeToggle button (line 14) by removing background, border, rounded corners, shadow, and hover border effects for a cleaner navbar aesthetic.

## [3.0.21] - 2025-10-10

### Changed

- Increased SiteHeader horizontal padding from `px-5 sm:px-8 lg:px-12` to `px-7 sm:px-10 lg:px-16` to prevent icon backgrounds from appearing cramped against navbar edges.

## [3.0.20] - 2025-10-10

### Changed

- Enlarged the SiteFooter and aligned its content so the brand line, tagline, and metadata stay vertically centered across breakpoints.

## [3.0.19] - 2025-10-10

### Documentation

- Updated repository and workspace READMEs to describe the earthy modern design system with warm parchment neutrals, terracotta accents, and sage highlights.

## [3.0.18] - 2025-10-10

### Documentation

- Polished wording and refined design system documentation after ASCII normalization cleanup.

## [3.0.17] - 2025-10-10

### Documentation

- Normalized all markdown punctuation to plain ASCII across AGENTS.md, CLAUDE.md, and design system files for better compatibility.

## [3.0.16] - 2025-10-10

### Changed

- Set Inter Regular (400) as the default body weight for improved readability, added Inter Black (900) for buttons via `--weight-ui-button` CSS variable, added an Inter heavy utility for fallback headings, and updated documentation to reflect the refined typography guidance.

## [3.0.15] - 2025-10-10

### Changed

- Recast the global token palette to the new earthy modern theme with parchment, terracotta, and sage colors.
- Limited font usage to ZT Bros Oskon for display and Inter for body text.
- Updated `docs/DESIGN_SYSTEM.md` and `globals.css` to enforce the new earthy aesthetic.

## [3.0.14] - 2025-10-10

### Documentation

- Streamlined agent contributor guide formatting and clarified workflow expectations.

## [3.0.13] - 2025-10-10

### Changed

- Removed the "Share-ready link studio" badge from the homepage hero section to streamline the visual hierarchy and allow the main heading to take immediate focus.

## [3.0.12] - 2025-09-27

### Changed

- Removed the navigation tagline output so the SiteHeader now renders only the QorkMe wordmark across marketing and result views.

## [3.0.11] - 2025-09-27

### Changed

- Reworded the homepage hero badge to spotlight share-ready copy so the marketing header area no longer surfaces the retired "Friendly link studio" tagline.

## [3.0.10] - 2025-09-27

### Changed

- Hid the marketing navigation badge and default tagline so the homepage header stays minimal while still letting result pages opt into contextual branding copy.

## [3.0.9] - 2025-09-27

### Changed

- Sped up CI by letting the bundle size audit reuse the `.next/` output from the build step instead of rebuilding the app during reporting.

## [3.0.8] - 2025-09-27

### Changed

- Widened the SiteHeader's horizontal padding steps so the bordered glass frame breathes more on every breakpoint without breaking responsive alignment.

## [3.0.7] - 2025-09-27

### Changed

- Simplified the navigation status treatment to a text-only callout and removed the marketing header action button to reduce visual weight while keeping spacing comfortable.

## [3.0.6] - 2025-09-27

### Changed

- Replaced the bespoke gradient navigation with a standard glassmorphism bar that unifies padding, typography, and call-to-action styling across desktop and mobile views.
- Introduced a shared `SiteHeader` component powering both marketing and result headers with a consistent menu, status pill, and theme toggle experience.

## [3.0.5] - 2025-09-25

### Changed

- Reimagined the marketing and result navigation bars with layered gradient framing, in-panel nav links, refreshed status badges, and balanced action spacing.
- Anchored homepage sections to power the new in-page navigation targets without disrupting existing calls to action.

## [3.0.4] - 2025-09-22

### Changed

- Redesigned both navigation headers with a broader glassmorphism frame, gradient accents, and expanded internal padding for clearer breathing room.
- Grouped the header action controls within pill-shaped containers to prevent the Live badge and theme toggle from crowding the navbar edges.

## [3.0.3] - 2025-09-22

### Added

- Private `/admin` console gated by Supabase GitHub authentication for the configured username (`NEXT_PUBLIC_SUPABASE_ADMIN_GITHUB`).
- Aggregate metrics cards showing total links, active redirects, click totals, latest activity timestamp, and a Supabase health check.
- Danger-zone purge action that removes all rows from `urls` and `clicks` via an authenticated API route.

### Changed

- Footer now links to the admin console for quick access once authenticated.
- Documentation updated with GitHub provider setup steps and the new environment variable.

## [3.0.2] - 2025-09-22

### Changed

- Simplified the result experience to feature only the short link card alongside a gentle prompt to create another link; metric tiles and detail panels are no longer rendered.
- Updated homepage hero copy, feature highlights, and CTAs to remove analytics messaging and lean into a more welcoming tone.
- Removed customer-facing links to internal documentation and adjusted metadata/taglines to match the lighter experience.

## [3.0.1] - 2025-09-22

### Added

- Vitest-powered `npm test` suite spanning the shortcode engine, `/api/shorten` route handlers, Supabase client factories, and the `UrlShortener` UI flow.
- GitHub Actions `npm test` step to fail CI when unit tests break.

### Changed

- Adjusted PostCSS configuration to maintain compatibility with Vitest's module pipeline.
- Refreshed developer documentation to call out the expanded testing workflow and local Vitest usage.
- Declared Prettier as a dev dependency so the formatting checks run consistently across local and CI environments.
- Pinned `esbuild` to a patched release via npm overrides to resolve security advisories without forcing breaking Vitest upgrades.

## [3.0.0] - 2025-09-15

### 🚀 Major UI Revolution - Sophisticated Dark Mode with Glassmorphism

#### Added

- **Sophisticated Dark Mode Architecture**
  - Deep midnight blue background (#0f172a) as primary theme
  - Slate blue surfaces (#1e293b) with elevated variants (#334155)
  - Bright accent colors: Blue (#60a5fa), Purple (#a855f7), Cyan (#06b6d4)
  - Complete overhaul from muddy earth tones to high-contrast sophistication

- **Advanced Glassmorphism Effects**
  - Backdrop-blur effects on all card components with `backdrop-filter: blur(10px)`
  - Layered shadow system with multiple depth levels
  - Transparent surface backgrounds with rgba values for depth
  - Border gradient highlights that appear on hover

- **Enhanced Card Design System**
  - Glassmorphism cards with sophisticated hover transforms
  - `translateY(-6px) scale(1.01)` hover effects for premium feel
  - Shimmer animations with gradient overlays
  - Enhanced depth with multi-layer box-shadows
  - Elevated card variants with accent border highlights

- **Premium Interactive Elements**
  - Button shimmer effects with pseudo-element gradient sweeps
  - Enhanced hover states with `scale(1.05)` transforms
  - Gradient backgrounds on all button variants
  - Sophisticated focus states with enhanced accessibility
  - Floating animations for feature cards

- **Advanced Background Patterns**
  - Radial gradient patterns for visual depth without distraction
  - Multiple gradient overlays in dark mode for sophisticated ambiance
  - Fixed background attachment for immersive experience
  - Subtle light mode patterns maintaining elegance

- **Enhanced Layout & Centering**
  - Proper flexbox implementation for perfect vertical centering
  - Hero section optimized for viewport centering
  - Improved responsive spacing and section organization
  - Better main/section structure for accessibility

#### Changed

- **Complete Dark Mode Revolution**
  - Transformed from basic earth tones to sophisticated blue/purple/cyan palette
  - Much better contrast ratios and modern appeal
  - Professional-grade color relationships and accessibility
  - Primary focus on dark mode with light mode as secondary

- **Component Architecture Modernization**
  - All buttons now feature gradient backgrounds and shimmer effects
  - Card components enhanced with glassmorphism and advanced shadows
  - Input fields with sophisticated focus states and backdrop effects
  - Navigation elements with enhanced interactivity

- **Typography & Spacing Refinements**
  - Better proportions and spacing throughout all components
  - Enhanced ZT Bros Oskon implementation with improved fallbacks
  - Uppercase styling with optimized tracking and weights
  - Improved readability with sophisticated color contrast

- **Animation & Interaction Overhaul**
  - Replaced basic hover effects with sophisticated transform animations
  - Added shimmer effects across interactive elements
  - Enhanced micro-animations with cubic-bezier easing
  - Floating animations for visual interest and premium feel

#### Technical Improvements

- **Advanced CSS Architecture**
  - Comprehensive glassmorphism utility classes
  - Multi-layer shadow system with theme-aware variables
  - Enhanced animation keyframes for sophisticated effects
  - GPU-accelerated transforms and backdrop-filter optimization

- **Performance Enhancements**
  - Optimized backdrop-filter rendering for smooth performance
  - Efficient shadow layering without performance impact
  - Streamlined animation system with proper easing
  - Enhanced responsiveness across all device types

- **Accessibility Improvements**
  - Much better contrast ratios with new color palette
  - Enhanced focus states with proper outline management
  - Improved color independence for information conveyance
  - Better keyboard navigation and screen reader support

#### Breaking Changes

- **Complete Visual Transformation**: Entire UI aesthetic changed from earth tones to sophisticated dark blues
- **Interaction Patterns**: All hover and interactive behaviors significantly enhanced
- **Color Palette**: Complete replacement of color scheme affects all visual elements
- **Component Styling**: All components updated with glassmorphism and advanced effects

#### Migration Notes

- All functional features remain identical - only visual design dramatically improved
- Existing shortened URLs continue to work without any changes
- Database schema and backend functionality completely unchanged
- Frontend represents a complete aesthetic evolution to premium standards

## [2.1.0] - 2025-01-15

### 🎨 Complete Design System Overhaul - Sandstone & Earth Tones (Deprecated)

#### Added

- **Sandstone & Earth Tone Color Palette**
  - Light theme: Warm sandstone background (#f5e6d3), light sand surface (#faf7f2)
  - Primary: Desert sand brown (#8b7355) with hover state (#6d5a44)
  - Secondary: Rich earth brown (#3e2723) with deeper hover (#2e1a17)
  - Accent: Medium earth brown (#5d4037) with refined hover (#4e342e)
  - Deep earth tones for dark theme variants (#1a1410, #2e2520, #3e342e)

- **ZT Bros Oskon 90s Typography System**
  - Complete font family implementation with all weights (Regular, Medium, SemiBold, Bold)
  - Italic variants for each weight (Regular, Medium, SemiBold, Bold Italic)
  - Bold serif typography for both display and body text
  - Uppercase styling for headings and buttons for modern impact
  - Fallback to Playfair Display and Crimson Text serif fonts from Google Fonts

- **Enhanced Design Components**
  - Refined card layouts with stronger borders and earth tone accent highlights
  - Updated button styling with uppercase text and enhanced hover effects
  - Enhanced input fields with sandstone-themed focus states and earth tone borders
  - Modernized navigation header with subtle earth tone gradients
  - Feature cards with accent color highlights and sophisticated interactions

- **Advanced CSS Architecture**
  - Comprehensive CSS custom properties for all sandstone and earth tone colors
  - Enhanced shadow system with warmer, more sophisticated depth
  - Refined border radius values for modern card aesthetics
  - Improved transition system with consistent timing for all interactions

#### Changed

- **Complete Visual Identity Transformation**
  - Replaced previous color scheme with sophisticated sandstone and earth tones
  - Updated from previous typography to ZT Bros Oskon 90s bold serif system
  - Enhanced card designs with stronger visual hierarchy and accent treatments
  - Modernized all component styling to reflect refined aesthetic
  - Improved contrast ratios and accessibility with earth tone palette

- **Typography Modernization**
  - Transitioned to ZT Bros Oskon serif fonts throughout the application
  - Implemented uppercase styling for headings and interactive elements
  - Enhanced text hierarchy with bold font weights and refined spacing
  - Improved readability with serif font choice and optimized line heights

- **Component Enhancement**
  - Strengthened card component borders with earth tone accents
  - Enhanced button hover effects with more pronounced visual feedback
  - Refined input field styling with sandstone-themed focus states
  - Updated navigation with subtle earth tone gradient treatments
  - Improved feature card design with accent color highlights

- **Theme System Updates**
  - Enhanced dark theme with deep earth tones and warm color transitions
  - Improved light theme with warm sandstone backgrounds and natural lighting
  - Refined CSS custom properties for better color consistency
  - Enhanced theme transitions with sophisticated color interpolation

#### Technical Improvements

- **Font Implementation**
  - Added complete ZT Bros Oskon font files to `/public/fonts/` directory
  - Implemented proper font-display: swap for optimal loading performance
  - Created comprehensive @font-face declarations for all weights and styles
  - Established graceful fallback system with serif fonts from Google Fonts

- **CSS Custom Properties Enhancement**
  - Expanded color variable system for comprehensive theme coverage
  - Improved semantic color naming for better maintainability
  - Enhanced shadow and border variables for consistent visual depth
  - Refined transition variables for smoother interactions

- **Design Token System**
  - Comprehensive sandstone and earth tone color tokens
  - Enhanced spacing and typography tokens for better consistency
  - Improved component-specific design tokens
  - Better organization of design system variables

#### Breaking Changes

- **Visual Breaking Changes**: Complete design aesthetic overhaul - all UI appearances significantly updated
- **Typography Changes**: Font family completely changed from previous system to ZT Bros Oskon
- **Color Scheme Changes**: Entire color palette updated to sandstone and earth tones
- **Component Styling**: All component appearances updated to match new design system

#### Migration Notes

- All functional features remain identical - only visual design has been updated
- Existing shortened URLs continue to work without any changes
- Database schema and backend functionality completely unchanged
- Frontend design and theming system comprehensively modernized

## [2.0.6] - 2025-01-15

### 🔧 Vercel Project Linking & Font Loading Fix

#### Added

- **Local Project Configuration**
  - Linked local repository with Vercel project using `vercel link`
  - Created `.vercel/project.json` with project and organization IDs
  - Established connection between local development and Vercel deployment
  - Enables local Vercel CLI commands for better development workflow

#### Fixed

- **Font Loading on Production**
  - Created `/public/fonts/` directory for font files
  - Updated CSS to use Google Fonts (Outfit, Inter, JetBrains Mono) as primary fonts
  - Prepared infrastructure for ZT Bros fonts when available
  - Fixed font display issues on live Vercel deployment

## [2.0.5] - 2025-01-15

### 🔧 Removed Redundant Deployment Workflow

#### Changed

- **Deployment Configuration**
  - Disabled redundant GitHub Actions deployment workflow
  - Eliminated duplicate deployment attempts and confusing failure messages
  - Now relying solely on Vercel's automatic GitHub integration
  - Deployments continue to work seamlessly through Vercel's native integration

## [2.0.4] - 2025-01-15

### 🔧 GitHub Actions Deployment Workflow Permissions

#### Fixed

- **Deployment Workflow Permissions**
  - Added explicit permissions for creating commit comments
  - Fixed "Resource not accessible by integration" error
  - Workflow now completes successfully after deployment

## [2.0.3] - 2025-01-15

### 🔧 CI/CD Security Scan Fix

#### Fixed

- **TruffleHog Security Scan**
  - Fixed "BASE and HEAD commits are the same" error in GitHub Actions
  - Updated workflow to properly handle push events with before/after commits
  - Security scanning now works correctly for both push and pull request events

## [2.0.2] - 2025-01-15

### 🔧 Vercel Root Directory Configuration

#### Fixed

- **Deployment Build Error**
  - Added root-level `vercel.json` to specify `qorkme` as the root directory
  - Resolved "package.json not found" error during Vercel builds
  - Fixed deployment failing due to monorepo structure

## [2.0.1] - 2025-01-15

### 🔧 CI/CD Configuration

#### Added

- **Vercel Deployment Token Configuration**
  - Added `VERCEL_TOKEN` to GitHub repository secrets
  - Configured automated deployment pipeline for production builds
  - Fixed GitHub Actions workflow authentication issues

#### Fixed

- Resolved Vercel CLI authentication error in deployment workflow
- GitHub Actions now successfully authenticates with Vercel for automated deployments

## [2.0.0] - 2025-01-15

### 🎨 Major Design System Overhaul

#### Added

- **Modern Card-Based Design System**
  - Complete transition from Bauhaus industrial to clean SF startup aesthetic
  - Card components with soft shadows and hover effects for enhanced interactivity
  - Modern minimalist layout with improved visual hierarchy
  - Interactive hover states and smooth animations throughout the interface

- **Natural Color Palette**
  - Sage green (#87A96B) as primary color replacing crimson red
  - Warm beige (#FDFBF7) background for light theme
  - Terracotta orange (#C65D00) as secondary accent color
  - Forest brown (#36454F) for primary text
  - Deep natural tones for dark theme variants

- **ZT Bros Typography System**
  - ZT Gatha font family for display headers with bold weights
  - ZT Grafton font family for body text in regular, medium, and semibold
  - ZT Mono font family for code and monospace elements
  - Fallback to Inter from Google Fonts for better font loading
  - Improved typography hierarchy with responsive clamp sizing

- **Dynamic Theme System**
  - Light/dark theme support with seamless transitions
  - System preference detection on initial load
  - Theme persistence in localStorage across sessions
  - CSS custom properties for consistent theming throughout app
  - Smooth 250ms transitions between theme changes

- **Enhanced Component Library**
  - `Card` component with elevated and standard variants
  - `FeatureCard` component for showcasing application features
  - `ThemeToggle` component with smooth icon transitions
  - Updated `Button` and `Input` components with new design language
  - `NavigationHeader` with theme toggle integration

- **Advanced CSS Architecture**
  - CSS custom properties for all colors, spacing, and design tokens
  - Consistent 8px grid system for spacing and layout
  - Responsive design utilities with mobile-first approach
  - Custom scrollbar styling matching the theme
  - Focus-visible styles for improved accessibility

#### Changed

- **Complete Visual Identity Transformation**
  - Replaced Bauhaus geometric decorations with clean card layouts
  - Updated color scheme from industrial (red/blue/yellow) to natural earth tones
  - Modernized typography from Bebas Neue/Inter to ZT Bros font family
  - Simplified visual elements focusing on content and usability

- **Homepage Redesign**
  - Card-based layout replacing geometric background elements
  - Featured sections in elevated cards with proper content hierarchy
  - Improved mobile responsiveness with better touch targets
  - Enhanced call-to-action placement and visual prominence

- **Component Architecture**
  - Modularized card components for better reusability
  - Theme-aware components using CSS custom properties
  - Improved component composition with consistent design patterns
  - Better separation of concerns between layout and styling

- **User Experience Improvements**
  - Smoother animations and micro-interactions
  - Better visual feedback for user actions
  - Improved contrast ratios for better accessibility
  - Enhanced mobile experience with touch-friendly interactions

#### Technical Updates

- **CSS Custom Properties Integration**
  - Comprehensive variable system for colors, typography, and spacing
  - Theme-specific variable overrides for dark mode
  - Consistent naming convention for design tokens
  - Better maintainability and design system scalability

- **Theme Context Provider**
  - React context for theme state management
  - TypeScript-safe theme switching functionality
  - Performance optimized with mounted state handling
  - Integration with localStorage and system preferences

- **Component Modernization**
  - Updated all components to use new design system
  - Improved TypeScript interfaces for component props
  - Better component composition and flexibility
  - Enhanced accessibility with proper ARIA attributes

#### Documentation Updates

- Updated README.md to reflect new design philosophy and system
- Revised design system documentation for modern aesthetic
- Updated component examples and usage guidelines
- Refreshed project descriptions and feature highlights

#### Breaking Changes

- **Visual Breaking Changes**: Complete design system overhaul means existing UI appearances will change significantly
- **Component API Changes**: Some component props may have changed to accommodate new design system
- **CSS Class Changes**: Custom CSS classes may need updates to work with new design tokens
- **Font Dependencies**: New ZT Bros fonts required for optimal display (graceful fallback to Inter included)

#### Migration Notes

- No functional API changes - all URL shortening functionality remains identical
- Existing shortened URLs continue to work without any changes
- Database schema and backend functionality unchanged
- Only frontend design and theming system has been updated

## [1.0.0] - 2025-01-14

### 🎉 Initial Release

#### Added

- **Core Features**
  - Smart URL shortening with consonant-vowel pattern algorithm for memorable codes
  - Custom alias support with case-insensitive matching
  - Real-time click analytics tracking (device, browser, OS, geographic data)
  - QR code generation for shortened URLs
  - Collision prevention for similar aliases (MyLink = mylink = MYLINK)
  - Reserved words protection system

- **Technical Stack**
  - Next.js 15.5.3 with App Router architecture
  - TypeScript 5 for type safety
  - Supabase for database and authentication
  - Tailwind CSS v4 with custom Bauhaus design system
  - React 19.1.0 with server components

- **Design System**
  - Bauhaus-inspired industrial functional design
  - Geometric elements (circles, squares, triangles) as brand identity
  - Primary color palette: Crimson (#DC143C), Cobalt Blue (#0048BA), Gold (#FFD700)
  - Custom typography: Bebas Neue (display), Inter (body)
  - 8px grid system for consistent spacing
  - Responsive design optimized for all devices

- **Database Architecture**
  - PostgreSQL via Supabase
  - Optimized for 200,000+ URLs with indexed lookups
  - Tables: urls, clicks, reserved_words, tags, url_tags
  - Row Level Security (RLS) policies
  - Atomic click counting functions
  - Case-insensitive short code storage

- **API Endpoints**
  - `POST /api/shorten` - Create shortened URLs
  - `GET /api/shorten?alias=` - Check alias availability
  - `GET /[shortCode]` - Redirect handler with analytics

- **CI/CD Pipeline**
  - GitHub Actions workflows for automated testing
  - Multi-node testing (Node.js 18.x and 20.x)
  - ESLint, Prettier, and TypeScript checking
  - Security scanning with npm audit and Trufflehog
  - Automated deployment to Vercel on main branch push
  - Preview deployments for pull requests

- **Security Features**
  - Input validation and sanitization
  - SQL injection prevention via parameterized queries
  - XSS protection headers
  - Rate limiting on API endpoints
  - Hashed IP addresses for privacy
  - Protected reserved words system

- **Performance Optimizations**
  - Database indexes on frequently queried columns
  - In-memory cache for hot URLs
  - Edge deployment for fast redirects
  - Progressive short code length (starts at 4 chars)
  - Optimized bundle splitting
  - Lazy loading for analytics components

- **Documentation**
  - Comprehensive README with setup instructions
  - `/docs/VERCEL_SETUP.md` - Complete Vercel deployment guide
  - `/docs/DEPLOYMENT.md` - Multi-platform deployment instructions
  - `/docs/DESIGN_SYSTEM.md` - Bauhaus design specifications
  - `/supabase/SETUP_INSTRUCTIONS.md` - Database setup with SQL
  - `/CLAUDE.md` - Development guidance for Claude Code

#### Configuration

- **Environment Variables**

  ```
  NEXT_PUBLIC_SUPABASE_URL=https://gzsdakrkbirevpxcadrg.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=[configured]
  SUPABASE_SERVICE_KEY=[configured]
  NEXT_PUBLIC_SITE_URL=https://qork.me
  NEXT_PUBLIC_SHORT_DOMAIN=qork.me
  ```

- **Vercel Deployment**
  - Project ID: `prj_UDJYaI9mWqQpRdFc7B1OmkFvDVuM`
  - Organization ID: `team_5bTCcFsgfAS2PstTiDBPvHQ7`
  - Production URL: https://qorkme-7yck5k0yh-realemmettss-projects.vercel.app
  - Custom domain: qork.me (pending DNS configuration)

- **Supabase Configuration**
  - Project ID: `gzsdakrkbirevpxcadrg`
  - Database URL: https://gzsdakrkbirevpxcadrg.supabase.co
  - Authentication: GitHub OAuth enabled
  - Email auth: Disabled

#### Dependencies

- **Production**
  - @supabase/ssr: ^0.7.0
  - @supabase/supabase-js: ^2.57.4
  - clsx: ^2.1.1
  - lucide-react: ^0.544.0
  - nanoid: ^5.1.5
  - next: 15.5.3
  - qrcode: ^1.5.4
  - react: 19.1.0
  - react-dom: 19.1.0
  - react-hot-toast: ^2.6.0
  - tailwind-merge: ^3.3.1

- **Development**
  - TypeScript: ^5
  - Tailwind CSS: ^4
  - ESLint with Next.js config
  - Prettier for code formatting
  - GitHub Actions for CI/CD

#### Project Structure

```
qorkme/
├── app/                    # Next.js App Router
├── components/            # React components
│   ├── ui/               # Base UI components
│   └── bauhaus/          # Bauhaus-specific components
├── lib/                   # Utilities and helpers
│   ├── shortcode/        # Code generation logic
│   └── supabase/         # Database clients
├── docs/                  # Documentation
├── supabase/             # Database schema
├── .github/workflows/    # CI/CD pipelines
└── .claude/              # Claude Code settings
```

### Deployment Notes

- Deployed to Vercel with automatic CI/CD via GitHub Actions
- Database hosted on Supabase free tier (500MB database, 2GB bandwidth)
- Ready for custom domain configuration
- All environment variables configured in Vercel

### Testing

- Type checking with TypeScript
- Linting with ESLint
- Format checking with Prettier
- Build verification in CI pipeline
- Security scanning with Trufflehog

### Known Issues

- None at initial release

### Future Enhancements

- Bulk URL import/export
- Advanced analytics dashboard
- URL expiration settings
- Team collaboration features
- API rate limiting improvements
- Mobile app companion

---

## Development Team

- Built with Claude Code (Anthropic)
- Designed for professional use at Geek Squad
- Optimized for long-term scalability (10+ years, 200,000+ URLs)

## License

Apache License 2.0

---

For more information, see the [README](./README.md) or visit the [documentation](./docs/).
