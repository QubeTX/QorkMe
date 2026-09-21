# QorkMe design system

The September 2026 launch adopts the approved Dither + Hologram prototype. QorkMe remains a QubeTX property with its blue-to-violet identity, Makira typography, and rolling labels. Its production surface is now warm ivory. This document supersedes the older dark-only instructions in the vendored QubeTX reference kit.

## Shared visual language

- Page: `#f6f4ef`; form and panel surfaces: `#fdfcf9`; borders: `#dedbd5`.
- Main ink: `#172137`; secondary ink: `#5f687a`; muted text: `#656a7b`.
- Primary action: `#1757e8`; display gradient: blue to violet. Keep effect highlights inside the wordmark and away from text inputs.
- Makira Black 900 for the QORK.ME mark. Use sentence case for instructions and headings. IBM Plex Mono is reserved for commands, codes, and technical details.
- The main page contains one centered wordmark, one labeled URL input, one primary button, and an optional inline alias. The alias prefix is always `qork.me/`.
- On phones the input and button stack. Inputs use at least 16px type and primary controls exceed 44px in height. Keep visible keyboard focus and descriptive labels.
- Admin, sign-in, results, errors, and the CLI page share the palette and brand stage. Tables and documentation use progressive disclosure rather than decorative status panels.

## Motion and rendering

`components/brand/BrandStage.tsx` owns the reusable visual. A procedural Canvas 2D dither field sits behind a font-masked vgpu WebGPU hologram. The shader retains the upstream diffraction and pearl lighting; linked capsule outlines replace the demo triangle. Font ink metrics center the engraving, including the middle zero in 404.

There is one animation owner per property. All canvas renderers use the shared resize coordinator; rendering resolution is capped at 1.5 device pixels. Dither runs at 30fps. Hidden tabs and offscreen brand stages stop their clocks. Unmounting disposes GPU resources, subscriptions, and pointer listeners, including initialization that finishes late.

The operating system's reduced-motion setting applies site-wide; there is no footer toggle or stored motion override. Reduced motion shows the final readable state. Unsupported or failed WebGPU retains the HTML gradient wordmark; failed Canvas keeps a static dotted fallback. Effects are decorative and never gate form submission, copying, or navigation.

`DitherTrail` adds a small pointer wake using the same Bayer dots and character register. It sits behind page content, follows mouse movement with a slight lag, and dissolves in 850ms. Its 30fps clock sleeps when empty; scrolling, typing, hidden tabs, and route changes clear the wake. Touch input and reduced/paused motion do not draw a trail. The backing canvas is capped at 1.25 device pixels and two million total pixels, with at most 48 trail samples.

`PageDither` extends the texture through the homepage, CLI, and admin margins, with a lighter treatment on the homepage and phones. Its center mask keeps the reading column quiet, and opaque panels keep the texture outside controls. It reuses the dither renderer at 24fps with a 1.25 device-pixel / two-million-pixel cap, shared resize coordination, static fallback, hidden-tab suspension, and route cleanup.

Keep rolling Shorten/Working and Copy/Copied feedback truthful. Copy must be an explicit action and report success only after the clipboard write resolves. The result contracts the original URL into the shorter address without delaying access to Copy.

## Error pages

Missing, expired, and disabled links lead to a real HTML 404 page with an expanded dither field and holographic 404 set in Gail Rock Bold (700), with natural monospace spacing. The display font comes from the existing SHAUGHV CDN, with bundled IBM Plex Mono Bold as its fallback. The playful message is “This link went off-script.” The pixel ripple is optional; both keyboard and pointer can trigger it. Always retain clear routes home and back.

## Sources and fonts

See `THIRD_PARTY_NOTICES.md` and `hologram-source.json` for upstream attribution and verification. The retired prototype gallery and complete reference downloads are archived outside the repository. Only the selected production effect is shipped.

The favicon is an SVG outline of the actual Makira Black Q, with matching PNG/ICO variants. Font files and their licensing are documented in `public/fonts/README.md`.
