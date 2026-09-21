# Font Files

This directory contains the Makira Sans Serif and IBM Plex Mono font files in WOFF2 format.

## Font Families

**Makira Sans Serif** — primary face for body, UI, headings, and the QORK.ME wordmark:

- `Makira-Regular.woff2` - Regular (400)
- `Makira-Medium.woff2` - Medium (500)
- `Makira-SemiBold.woff2` - SemiBold (600)
- `Makira-Bold.woff2` - Bold (700)
- `Makira-ExtraBold.woff2` - ExtraBold (800)
- `Makira-Black.woff2` - Black (900)

**IBM Plex Mono** — monospace face for code blocks, the short-URL display, and any element using `var(--font-mono)` or the `.font-mono` utility. IBM open source, licensed under SIL OFL 1.1.

- `IBMPlexMono-Regular.woff2` - Regular (400)
- `IBMPlexMono-Medium.woff2` - Medium (500)
- `IBMPlexMono-SemiBold.woff2` - SemiBold (600)
- `IBMPlexMono-Bold.woff2` - Bold (700)

## Typography System

- **Body text & UI:** Makira Regular (400)
- **Emphasized text:** Makira Medium (500)
- **Headings:** Makira SemiBold (600)
- **Bold headings & smaller buttons:** Makira Bold (700)
- **Heavy emphasis:** Makira ExtraBold (800)
- **Display text & prominent buttons:** Makira Black (900)
- **Mono / code / short-URL display:** IBM Plex Mono Regular (400)

See `app/globals.css` for @font-face declarations and `docs/DESIGN_SYSTEM.md` for complete typography specifications.

## Favicon

The September 2026 favicon uses an outlined Q from Makira Black, with a blue-violet fill and ivory background. SVG, ICO, PNG, and Apple-touch variants share that outline; no new font files were added or moved. Existing font licenses still apply.

## 404 display numerals

The large 404 uses **Gail Rock Bold (700)** from the existing SHAUGHV font CDN:
[bold WOFF2](https://cdn.shaughv.com/fonts/gail-rock/woff2/Gail-Rock-Bold.woff2).
The family is by Casloop Studio; the SHAUGHV asset registry records hosting permission.
No Gail Rock font binaries are copied into this repository or relicensed.
The scoped declaration in `components/brand/BrandStage.module.css` downloads the
24 KB face only when used. IBM Plex Mono Bold is the bundled fallback.
