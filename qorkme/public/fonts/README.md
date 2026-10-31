# Font Files

This directory contains the Makira Sans Serif and Paper Mono font files in WOFF2 format.

## Font Families

**Makira Sans Serif** — primary face for body, UI, headings, and the QORK.ME wordmark:

- `Makira-Regular.woff2` - Regular (400)
- `Makira-Medium.woff2` - Medium (500)
- `Makira-SemiBold.woff2` - SemiBold (600)
- `Makira-Bold.woff2` - Bold (700)
- `Makira-ExtraBold.woff2` - ExtraBold (800)
- `Makira-Black.woff2` - Black (900)

**Geist Mono** — primary monospace face for commands, URL inputs, short links, admin data, and any element using `var(--font-mono)` or the `.font-mono` utility. The live [SHAUGHV CDN catalog](https://cdn.shaughv.com/tree.json) recommends this family. The root layout loads its [hosted stylesheet](https://cdn.shaughv.com/fonts/geist-mono/geist-mono.css); `Geist Mono Variable` covers weights 100–900 with normal and italic styles using `font-display: swap`. No Geist binaries are copied here. Upstream: [Geist](https://github.com/vercel/geist-font), SIL Open Font License 1.1.

**Paper Mono** — bundled fallback if the hosted Geist Mono font is unavailable.

- `PaperMono-Variable.woff2` — variable weights 100–800, normal style; one 53,276-byte file covers the UI's regular, medium, semibold, and bold weights.
- `PaperMono-OFL.txt` — original SIL Open Font License 1.1 and copyright notice from the Paper-Mono.Git Project Authors.

The unmodified font was supplied from the Paper Mono distribution (`fonts/webfonts/PaperMono[wght].woff2`), renamed only for a simple public URL. It is self-hosted with `font-display: swap`; system monospace fonts remain the fallback. Upstream: [Paper Mono](https://github.com/paper-design/paper-mono).

## Typography System

- **Body text & UI:** Makira Regular (400)
- **Emphasized text:** Makira Medium (500)
- **Headings:** Makira SemiBold (600)
- **Bold headings & smaller buttons:** Makira Bold (700)
- **Heavy emphasis:** Makira ExtraBold (800)
- **Display text & prominent buttons:** Makira Black (900)
- **Mono / code / short-URL display:** CDN-hosted Geist Mono Variable (400 by default), then bundled Paper Mono and system monospace fonts

See `app/layout.tsx` for the CDN stylesheet, `app/globals.css` for local @font-face declarations and font stacks, and `docs/DESIGN_SYSTEM.md` for complete typography specifications.

## Favicon

The September 2026 favicon uses an outlined Q from Makira Black, with a blue-violet fill and ivory background. SVG, ICO, PNG, and Apple-touch variants share that outline; no new font files were added or moved. Existing font licenses still apply.

## 404 display numerals

The large 404 uses **Gail Rock Bold (700)** from the existing SHAUGHV font CDN:
[bold WOFF2](https://cdn.shaughv.com/fonts/gail-rock/woff2/Gail-Rock-Bold.woff2).
The family is by Casloop Studio; the SHAUGHV asset registry records hosting permission.
No Gail Rock font binaries are copied into this repository or relicensed.
The scoped declaration in `components/brand/BrandStage.module.css` downloads the
24 KB face only when used. The shared Geist Mono stack, including bundled Paper Mono, provides the fallback.
