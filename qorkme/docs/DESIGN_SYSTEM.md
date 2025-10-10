# QorkMe Design System

## Vision & Principles

QorkMe should feel grounded, calm, and trustworthy, like a contemporary studio that works with natural materials. Every screen leans on warm parchment neutrals, terracotta accents, and sage greens while typography combines the character of ZT Bros Oskon with the clarity of Inter. The key principles are:

- **Earthy Modern:** Pair organic colors with refined layouts and generous whitespace.
- **Purposeful Contrast:** Use terracotta for the primary path, sage for support, and ink-like neutrals for structure.
- **Quiet Confidence:** Motion and depth stay subtle; blur and shadow are soft and never gimmicky.
- **Clarity First:** Establish a single hierarchy per view, keep copy concise, and reserve emphasis for actions.
- **Consistency over Components:** Favor simple markup, but apply the same palette, type scale, spacing, and states everywhere.

## Foundations

### Color System

All colors are defined as CSS custom properties in `qorkme/app/globals.css`. Use the tokens below instead of hard-coded hex values.

| Token                       | Hex / Value               | Usage                                               |
| --------------------------- | ------------------------- | --------------------------------------------------- |
| `--color-background`        | `#f6f1e8`                 | Page background for light theme.                    |
| `--color-background-accent` | `#ece3d2`                 | Section dividers, subtle stripes, light gradients.  |
| `--color-surface`           | `#ffffff`                 | Primary cards, modals, panels.                      |
| `--color-surface-elevated`  | `#f2e7d6`                 | Hovered cards, sticky headers, floating elements.   |
| `--color-surface-muted`     | `#e5dac5`                 | Muted badges, table stripes, subtle borders.        |
| `--color-primary`           | `#c4724f`                 | Primary CTA backgrounds, focus outlines, key icons. |
| `--color-accent`            | `#5f7d58`                 | Secondary actions, highlights, charts.              |
| `--color-secondary`         | `#2f2a26`                 | Primary text and icon color on light surfaces.      |
| `--color-text-secondary`    | `#49413a`                 | Body copy, form labels.                             |
| `--color-text-muted`        | `#6b6159`                 | Captions, helper text.                              |
| `--color-border`            | `rgba(108, 96, 81, 0.18)` | Divider strokes, card borders.                      |
| `--color-border-strong`     | `rgba(79, 69, 58, 0.32)`  | Input hover states, table grid lines.               |
| `--color-success`           | `#4f7c5a`                 | Success alerts, confirmation icons.                 |
| `--color-warning`           | `#d08a3b`                 | Warnings, pending states.                           |
| `--color-error`             | `#c04d3c`                 | Destructive actions, validation errors.             |
| `--color-info`              | `#5f7d58`                 | Informational banners and badges.                   |

**Dark theme tokens** (activated with `html[data-theme='dark']`) mirror the same relationships. Use `--color-*` variables so the correct value is applied automatically.

### Typography

Only two font families are permitted across the application.

- `--font-display`: `ZT Bros Oskon` for hero titles, headings, and prominent buttons. Default to weight 600; if ZT is unavailable for a heading, swap to `.font-inter-heavy` (Inter 900) to preserve contrast.
- `--font-body`: `Inter` Regular (weight 400) for paragraphs, input text, supporting labels, and UI chrome. Elevate emphasis with `.font-body-strong` (weight 500) instead of switching families.
- `--font-ui`/`--font-mono`: Alias to Inter so UI chrome and numeric strings inherit the same palette. Enable `font-variant-numeric: tabular-nums` when aligning numbers.

**Weight tokens** (implemented in `globals.css`):

- `--weight-body-regular: 400` - Default body text
- `--weight-body-strong: 500` - Emphasized body text, labels
- `--weight-ui-strong: 600` - Strong UI elements
- `--weight-ui-button: 900` - All button text (Inter Black for maximum contrast)
- `--weight-display-strong: 600` - Display font weight
- `--weight-inter-heavy: 900` - Heavy Inter fallback for headings

**Type scale** (implemented with responsive `clamp()` utilities in `globals.css`):

- Display / Hero: `clamp(2.75rem, 4vw + 1rem, 4.5rem)`
- H2: `clamp(2.25rem, 3vw + 1rem, 3.5rem)`
- H3: `clamp(1.75rem, 2vw + 1rem, 2.5rem)`
- H4-H6: Fixed 1.5rem, 1.25rem, 1.125rem
- Body: `1rem` base with `line-height: 1.6`
- Small text / captions: 0.875rem with 1.4 line-height

Headings stay in ZT Bros Oskon with tight tracking (`letter-spacing: 0.008em`) and weight 600. Body text uses Inter Regular (400) for comfortable readability. Never set headings in all caps; reserve uppercase for subdued pill labels or quiet metadata, and only use Inter via `.font-inter-heavy` when ZT is not technically possible.

### Layout & Spacing

- Base unit: `8px`. Stick to multiples via CSS custom properties (`--space-*`) defined in Tailwind theme utilities.
- Section rhythm: `--section-spacing` controls top/bottom padding (`clamp(4.5rem, 8vw, 7.5rem)`).
- Cards and containers use `--card-padding` and `--container-padding` to keep breathing room consistent from mobile through desktop.
- Layouts prefer vertical stacks with gaps of `clamp(2.75rem, 4vw, 4.5rem)` and grids with `clamp(2rem, 3.5vw, 3rem)` spacing.

### Elevation & Effects

- Shadows: use `var(--color-shadow)` tiers (`shadow-soft`, `shadow-medium`, `shadow-large`). They remain warm and diffused for light theme and more concentrated for dark theme.
- Glass layers: pair `var(--color-surface)` with subtle blur only when necessary; keep opacity above 0.9 to avoid muddy contrast.
- Gradients: limit to hero headings or section backdrops using `linear-gradient(135deg, var(--color-primary), var(--color-accent))` or the radial blends baked into `body::before`.
- Radius scale: `--radius-sm` (12px) through `--radius-xl` (28px) with `--radius-full` for pills.

## UI Elements

### Buttons

All buttons use the `.btn` class foundation defined in `globals.css`.

- **Typography**: All buttons use Inter Black (weight 900) via `--weight-ui-button` for maximum contrast and legibility
- **Primary**: background `var(--color-primary)`, text `var(--color-text-inverse)`. Hover keeps the same hue with a subtle highlight overlay. Focus shows a 2px outline using `var(--color-ring)`.
- **Secondary (outline)**: transparent background with border `var(--color-border)`. On hover the background becomes `color-mix(in srgb, var(--color-surface-elevated) 70%, transparent)` and the border upgrades to `--color-border-strong`.
- **Ghost**: No border, compact padding, text in `var(--color-secondary)`. Hover adds a light surface tint via `color-mix`.
- Disabled state reduces opacity to 0.45 and removes interactive shadows.

### Inputs & Form Controls

- Use the `.input` class for text inputs, textareas, and select triggers. Default border: `color-mix(in srgb, var(--color-border) 80%, transparent)`. Hover uses `--color-border-strong`; focus adds a 4px glow using `color-mix` with `--color-primary`.
- Input text uses Inter Regular (weight 400) for comfortable data entry
- Labels sit at 0.9rem Inter, `font-weight: 500` (`--weight-body-strong`), and use `--color-text-secondary`.
- Helper or validation text relies on `--color-text-muted` or the relevant status color.

### Cards & Surfaces

- Base card: `.card` with `--color-surface`, `--radius-xl`, and the soft shadow. Elevate with `.card-elevated`, which layers an extra stroke and deeper shadow.
- Padding always uses `--card-padding`. Add `gap` values of `1.5rem` between internal sections.
- In dark mode, cards automatically update via token overrides; avoid hard-coded backgrounds.

### Navigation & Page Chrome

- Header background blends `var(--color-surface)` with a translucent backdrop blur. Links inherit `var(--color-text-primary)` and switch to `var(--color-primary)` on hover.
- Footer uses `var(--color-background-accent)` with muted text.
- Section dividers: `1px` border using `color-mix(in srgb, var(--color-border) 70%, transparent)` with 32px top padding.

### Feedback & Messaging

- Success, warning, error, and info banners use the dedicated status tokens for icon and accent backgrounds while keeping text on neutral surfaces for legibility.
- Inline badges should stay lowercase, use `.font-body-strong` (Inter 500) or `--weight-ui-strong` when icons are present, and apply `--radius-full`.

## Interaction Patterns

- Motion: rely on the predefined keyframes (`fadeIn`, `slideIn`, `float`, etc.) sparingly. Duration stays within 240-600ms and respects `prefers-reduced-motion`.
- Focus: always show a visible outline using `var(--color-primary)` or `var(--color-ring)`; never remove `outline` without providing an accessible alternative.
- Hover: lighten backgrounds using `color-mix` with `--color-surface-elevated`; avoid scaling more than 1.02 to maintain calmness.
- Selection: uses the warm terracotta highlight (`color-mix(in srgb, var(--color-primary) 35%, transparent)`).

## Accessibility & Content

- Maintain a minimum 4.5:1 contrast ratio for essential text. The provided tokens meet this requirement in both themes when used as directed.
- Keep paragraphs to 65ch max (`--content-width`) for readability.
- Headlines favor sentence case. Body copy uses Inter Regular (400) for comfortable reading with improved legibility, while ZT Bros Oskon handles hero statements and primary headings.
- Iconography should stick to the existing outline style with 1.5px strokes matching `var(--color-secondary)`.

## Asset & Font Guidance

- Only bundle `ZT Bros Oskon` (webfont variants already in `public/fonts/`) and Inter from Google Fonts. Remove any dependencies on JetBrains Mono, Playfair, or other families.
- When exporting imagery or illustrations, bias toward textured neutrals and subtle organic shapes-avoid heavy neon or saturated gradients.

## Implementation Notes

- Global tokens live in `qorkme/app/globals.css`; Tailwind utilities inherit these values via `@theme inline`.
- Dark mode is toggled by setting `data-theme="dark"` on `<html>`, which automatically swaps the warm neutrals for deep espresso tones while maintaining accent colors.
- Utility classes `.font-display`, `.font-body`, `.font-body-strong`, `.font-inter-heavy`, `.btn`, `.card`, `.input`, `.shadow-*`, and `.animate-*` already align with this system. Extend them only if the new styles still reference the existing tokens.
- Before shipping UI changes, scan for hard-coded hex values or font stacks and replace them with the sanctioned tokens to keep the experience cohesive.
