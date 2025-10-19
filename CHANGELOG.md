# Changelog

## 2025-10-19 04:30

### Added

- **In-Card URL Shortener Result Display** (qorkme/components/UrlShortener.tsx)
  - Completely redesigned URL shortener flow to display results within the same card without page navigation
  - Implemented three-state system with smooth fade transitions between input, loading, and success views
  - Added automatic clipboard copy functionality that triggers immediately upon successful URL creation
  - Created success view with light-colored inner container using design system tokens (`--color-surface-elevated` at 15% opacity)
  - Integrated visual feedback elements: green checkmark icon, success message, and manual copy button with terracotta hover effect
  - Added "Shorten Another URL" button to seamlessly reset back to input view
  - Implemented fade animations: 200ms fade out for input elements, 300ms fade in for success display
  - Enhanced user experience eliminates navigation, provides instant feedback, and maintains context within single card interface
  - Updated qorkme/CHANGELOG.md with version 3.0.31 entry documenting all new features

## 2025-10-18 23:15

### Changed

- **Mobile Responsive Improvements** (qorkme/components/MatrixDisplay.tsx, qorkme/components/UrlShortener.tsx, qorkme/app/page.tsx)
  - **MatrixDisplay Component**: Implemented responsive matrix sizing to prevent overflow on narrow viewports
    - Desktop (md:768px+): Title renders at 8px cells with 50 columns, Time at 6px cells with 66 columns
    - Mobile (<768px): Title renders at 5px cells with 32 columns, Time at 3.5px cells with 42 columns
    - Separate mobile/desktop render paths using Tailwind `md:hidden` and `hidden md:block` utilities
    - Gap spacing now responsive: `gap-4` mobile, `md:gap-6` desktop
    - Prevents horizontal scrolling on small screens while maintaining readability
  - **UrlShortener Component**: Simplified card padding for mobile optimization
    - Changed from responsive Tailwind classes to fixed inline style: `style={{ padding: '24px' }}`
    - Tailwind v4 compatibility fix: `p-6`, `sm:p-8`, `md:p-12` classes were not generating properly
    - Consistent 24px padding across all viewports for simplified maintenance
  - **Homepage Layout**: Added mobile breathing room with inline styles
    - Content container: Added `paddingLeft: '24px', paddingRight: '24px'` for horizontal spacing
    - Card wrapper: Added `marginLeft: '16px', marginRight: '16px'` to prevent card from touching screen edges
    - Result: Card width on 375px viewport = 295px (375 - 48 container padding - 32 wrapper margin)
    - Inline styles used throughout due to Tailwind v4 utility generation issues with `px-6`, `mx-4` classes
  - **Documentation Updates**:
    - CLAUDE.md: Updated Matrix Display, URL Shortener Card, and Critical UI/Layout Patterns sections
    - Added new "Homepage Layout Spacing" section documenting mobile improvements
    - Added real-world examples of Tailwind v4 inline style workarounds
    - Added "Responsive Rendering" pattern for components with breakpoint-specific sizing
    - Updated qorkme/CHANGELOG.md with version 3.0.30 entry

### Technical Notes

- **Tailwind v4 Compatibility**: Project uses Tailwind CSS v4 which has different utility generation behavior than v3
  - Classes like `px-6`, `mx-4`, `p-12` may not generate properly depending on configuration
  - Solution: Use inline styles with explicit pixel values for guaranteed rendering
  - Pattern: `style={{ padding: '24px' }}` instead of `className="p-6"`
- **Responsive Component Pattern**: When components need different props at different breakpoints, render separate instances with Tailwind visibility utilities rather than trying to make single instance responsive
- **Mobile Layout Calculation**: Card width = viewport width - container padding - wrapper margins
  - 375px (iPhone SE) - 48px - 32px = 295px card width
  - Provides comfortable breathing room on all sides without card touching edges

## 2025-10-18 21:45

### Changed

- **SiteFooter Alignment and Layout Improvements** (qorkme/components/SiteFooter.tsx)
  - Fixed vertical baseline alignment by replacing `<p>` block element with `<span>` inline element for consistency with left column
  - Removed "Designed in San Francisco • " text from right column, streamlined to "Powered by Supabase & Vercel"
  - Unified responsive breakpoints from `sm:` to `md:` across both columns for consistent layout transitions
  - Implemented edge-aligned layout using `md:justify-between` to position left column flush-left and right column flush-right
  - Added `md:px-8` horizontal padding to parent container for comfortable breathing room from viewport edges
  - Removed `md:flex-1 md:basis-0` from both columns to allow natural content-based width sizing
  - Standardized both columns with identical flex patterns: `flex flex-col gap-2 md:flex-row md:items-center md:gap-6`
  - Applied consistent `md:leading-none` line-height across all footer text elements for proper baseline alignment at desktop breakpoint
  - Updated qorkme/CHANGELOG.md with version 3.0.29 entry

## 2025-10-18 21:16

### Added

- **Interactive Grid Background Pattern** (qorkme/components/ui/interactive-grid-pattern.tsx)
  - Implemented SVG-based interactive grid background with organic noise-driven opacity variation
  - 20×20 grid (400 cells) at 40px cell size provides subtle visual texture without overwhelming content
  - Terracotta hover glow using `--color-primary` at 12% opacity for brand-aligned interactivity
  - SVG fractal noise filter creates paper-like, organic opacity variation (0.4-1.0 range) on grid lines
  - Single SVG element architecture ensures 60fps performance with minimal DOM overhead
  - React state tracks only hovered cells (not all 400), CSS transitions handle animations
  - Grid lines use `--color-border-strong` with strokeOpacity 0.6 for warm, visible earthy strokes
  - Integrated into homepage (qorkme/app/page.tsx) as absolute positioned background layer at z-0

### Changed

- **Documentation Updates**
  - CLAUDE.md: Added Interactive Grid Background section under Critical UI/Layout Patterns with implementation details, customization guide, and noise filter parameter explanations
  - qorkme/docs/UI_LAYOUT_GUIDE.md: Added comprehensive Interactive Grid Background section documenting:
    - Key features (single SVG element, 60fps performance, noise-based opacity)
    - Implementation pattern with proper z-index layering
    - Customization guide for grid density, noise filter parameters, line appearance, and hover effects
    - Performance considerations (cell limits, mobile behavior, pointer events)
    - Common adjustments for visibility, noise intensity, and pattern variation
  - qorkme/docs/DESIGN_SYSTEM.md: Added Interactive Grid Background subsection under Elevation & Effects with:
    - Visual characteristics and design token usage
    - Noise filter specifications including alpha modulation formula
    - Performance metrics and usage guidelines
  - qorkme/CHANGELOG.md: Added version 3.0.28 entry documenting grid implementation and documentation updates

## 2025-10-18 21:01

- Enhanced CLAUDE.md with new Critical UI/Layout Patterns section documenting Tailwind v4 gotchas and common pitfalls (inset-0 with padding, backdrop-blur browser support, container overflow issues).
- Added Development Troubleshooting section with cache clearing commands and verification steps for Next.js development issues.
- Expanded component structure documentation to include ui/ subdirectory components (matrix.tsx, shimmering-text.tsx).
- Updated custom alias validation documentation from 3-8 characters to 3-50 characters to match current implementation.
- Enhanced Typography section with stricter font usage rules emphasizing ZT Bros Oskon for display and Inter Regular (400) for body/UI.
- Expanded Testing Strategy documentation with specific test file paths and npm run commands.
- Added Matrix Display implementation details documenting 12-hour time format, deterministic rendering, and hydration fixes.
- Added URL Shortener Card Interactions documentation covering 3D tilt animation and responsive padding architecture.
- Added "Modify matrix display or clock" task to Common Development Tasks section.
- Created comprehensive UI_LAYOUT_GUIDE.md file (683 lines) documenting critical layout patterns, Tailwind v4 issues, troubleshooting steps, and component-specific implementation details.
- Added UI_LAYOUT_GUIDE.md reference to Documentation section.

## 2025-10-18 23:45

- Reduced the UrlShortener card 3D tilt cursor-following animation from divisor `/20` to `/80` for an extremely subtle effect that doesn't distract from the user experience.
- Increased "Enter Your URL" label bottom margin from `mb-4` to `mb-6` to provide better visual breathing room between the label and the container edges.

## 2025-10-18 23:30

- Fixed React hydration mismatch error in Matrix component by adding explicit `px` units to width/height inline styles, changing from unitless numbers to properly formatted CSS strings.
- Converted MatrixDisplay time format from 24-hour to 12-hour with AM/PM period display, added letter patterns for 'A' and 'P' to matrix.tsx, increased matrix width from 54 to 66 columns to accommodate longer time string, and updated ARIA label for accessibility.
- Removed non-deterministic `Math.random()` sparkle effect from MatrixDisplay title animation to ensure consistent server/client rendering.
- Fixed UrlShortener card padding issue where Input field and Button were touching card edges: moved padding from parent card container to individual state containers (Input/Loading/Output), added `inset-0` to absolute positioned states to properly respect internal spacing across all responsive breakpoints (24px mobile, 32px small screens, 48px desktop).
- Created comprehensive testing checklist document (TESTING_CHECKLIST.md) with visual verification steps, accessibility checks, responsive padding tests, Playwright test scenarios, and success criteria for all changes.

## 2025-10-18 21:45

- Redesigned MatrixBackground component from canvas-based particle system to viewport-filling dot-matrix display with animated wave effects and centered digital clock showing HH:MM:SS in retro 7-segment style using terracotta colors from design system.
- Fixed TypeScript type compatibility issue in shimmering-text component for framer-motion margin property.

## 2025-10-14 12:45

- Fixed horizontal alignment in SiteFooter component by standardizing line-height values across all footer text elements to use `md:leading-none` at desktop breakpoints, ensuring "QorkMe", "Thoughtful short links for modern teams", "Designed in San Francisco • Powered by Supabase & Vercel", and "Admin" are all aligned on the same horizontal baseline.

## 2025-10-12 20:47

- Re-ran Prettier on the repository changelog so CI's formatting check passes again.

## 2025-10-10 09:30

- Added top offset to the SiteHeader so the navbar floats off the viewport edge across breakpoints.

## 2025-10-10 08:48

- Restored padding and vertical rhythm for the UrlShortener custom alias dropdown so the toggle and fields align with the design system spacing.

## 2025-10-10

- Simplified the SiteHeader Link2 icon and ThemeToggle button by removing background containers, borders, rounded corners, and shadows for a cleaner navbar appearance.

## 2025-10-10

- Increased the SiteHeader horizontal padding to prevent icon backgrounds from appearing cramped against navbar edges.

## 2025-10-10 01:50

- Refined the SiteFooter spacing and alignment so the brand line and metadata sit evenly across breakpoints.

## 2025-10-10 01:33

- Updated repository and app READMEs to describe the earthy modern design system with warm parchment neutrals, terracotta accents, and sage highlights.

## 2025-10-10 01:31

- Polished wording and refined design system documentation after ASCII normalization cleanup.

## 2025-10-10 01:29

- Normalized all markdown punctuation to plain ASCII across AGENTS.md, CLAUDE.md, and design system documentation for better compatibility.

## 2025-10-10 01:26

- Tuned Inter usage to default to light weight (300) for body copy, added heavy (900) fallback helpers, and refreshed typography guidance across docs and agent files.

## 2025-10-10 01:21

- Shifted the design system to an earthy modern palette, limited typography to ZT Bros Oskon and Inter, and refreshed `AGENTS.md`, `CLAUDE.md`, and `qorkme/docs/DESIGN_SYSTEM.md` to match.

## 2025-10-10 01:06

- Streamlined agent contributor guide formatting and clarified workflow expectations.

## 2025-10-10 01:03

- Removed the homepage hero badge so the main content area starts directly with the heading for cleaner visual flow.

## 2025-10-10 00:45

- Enforced dual changelog update requirements in agent guidelines to ensure both root and application changelogs stay synchronized.

## 2025-10-10 00:44

- Refreshed agent guidelines with clearer structure and simplified contribution workflow documentation.

## 2025-09-27 10:20

- Clarified `AGENTS.md` so contributors must update both changelog files with every project change.

## 2025-09-27 09:55

- Reframed `AGENTS.md` as a Repository Guidelines contributor guide covering structure, commands, and release hygiene expectations.

## 2025-09-27 08:40

- Removed the navigation tagline entirely so the QorkMe wordmark stands alone in every header context without fallback copy.

## 2025-09-27 08:10

- Removed the marketing navigation badge and default tagline so the homepage header now focuses on the core links while keeping branded taglines opt-in for other contexts.

## 2025-09-27 07:15

- Replaced the homepage hero's "Friendly link studio" badge with share-ready messaging to keep the header section aligned with the new minimal navigation shell.

## 2025-09-27 06:40

- Optimized the CI bundle size check to reuse the existing Next.js build artifacts so the workflow no longer performs a redundant rebuild when reporting `.next/` size.

## 2025-09-27 05:30

- Nudged the marketing navbar's internal padding wider so the bordered frame stretches further on desktop and mobile while keeping the glassmorphism shell responsive.

## 2025-09-27 04:45

- Softened the marketing navbar badge styling to remove the pill treatment and pulled the call-to-action button to keep the header minimal while preserving comfortable spacing.

## 2025-09-27 03:19

- Rebuilt the QorkMe navbar with a standard glassmorphism top bar, unified desktop/mobile layouts, and simplified status/action treatments for consistency across pages.

## 2025-09-25 17:35

- Rebuilt the QorkMe navigation shell with layered gradients, compact nav links, and refreshed status badge styling to replace the previous pill bar.

## 2025-09-22 03:10

- Refined the workspace navigation styling to mirror the refreshed application header, calling out the new gradient framing and widened action spacing.

## 2025-09-22 02:15

- Added `TODO-2025-09-22.md` at repository root capturing Supabase deployment tasks for later completion today.

## 2025-09-22 02:05

- Added a Supabase-backed `/admin` console gated by GitHub OAuth to surface aggregate link/click totals, health checks, and a protected purge action.
- Linked the admin console from the global footer and documented the GitHub provider setup plus new environment variable usage.

## 2025-09-22 01:05

- Removed all customer-facing analytics, documentation, and login affordances from the QorkMe UI so result pages now show only the short link card and a friendly follow-up CTA.
- Refreshed homepage messaging to emphasize a human, analytics-free experience while keeping the shortening flow unchanged.
- Tuned metadata and navigation copy to align with the simplified experience.

## 2025-09-22

- Reviewed `~/.codex/AGENTS.md`, project README, and CI workflow to collect current QorkMe context.
- Captured a detailed workspace brief in `CODEX_PROJECT.md`, including setup guidance and file tree.
- Authored a project-specific `AGENTS.md` describing working agreements, quality gates, and key references.
- Established this workspace-level changelog with today's documentation updates.
- Expanded the Vitest-based testing suite to cover shortcode logic, `/api/shorten` handlers, Supabase client factories, and the UrlShortener UI while updating documentation and CI to reflect the new workflow.
- Added Prettier as a dev dependency and normalized the new test utilities to keep `npm run format:check` passing locally and in CI.
- Locked `esbuild` to a patched release via npm overrides, cleared `npm audit --audit-level=moderate`, and reran the quality gate (lint, type-check, vitest, build).
