# Font Files

This directory contains the Makira Sans Serif and IBM Plex Mono font files in WOFF2 format.

## Font Families

**Makira Sans Serif** — primary face for all visible type (body, UI, headings, display):

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
