# Human Changelog

A plain-English companion to [CHANGELOG.md](./CHANGELOG.md). Every change in the technical changelog has a layman's-terms version here — no version numbers, no code references, just what changed and why it matters.

For the technical version with versions, file paths, and exact details, see [CHANGELOG.md](./CHANGELOG.md).

---

## June 14, 2026 — Human changelog + pre-push documentation gate

**Added**

- This file — a plain-English translation of every technical changelog entry, so non-engineers can follow along without needing to decode file paths or code terms.
- A new rule was added requiring both changelogs (the technical one and this one) to be updated together in the same commit, so they never fall out of sync.
- A safety check that runs automatically before any code is pushed to the main branch. If someone pushes code or documentation without also updating the changelogs, the check stops the push and reminds the author to update them. It also prompts a review of the public-facing agent guide and developer docs. The check is designed to fail safely — if something goes wrong with the check itself, the push still goes through.

**Improved**

- The install page's animated headline now holds each phrase for a bit longer before cycling to the next one (was a bit too rushed).
- The documentation for the `qork` command-line tool was corrected — a stale example showing the old response format was replaced with the real one, and instructions for new commands (`--no-check`, `qork update`, `qork uninstall`) were fully documented.

---

## June 14, 2026 — qork CLI v1.1.0: help command, URL safety check, and full uninstall

**Added**

- `qork help` — typing `help` (or `qork help`) now shows the tool's documentation. The words "help", "update", and "uninstall" are always treated as commands, never accidentally sent to the shortener as URLs. Man pages (`man qork`) work on Linux and macOS installs.
- Pre-shortening safety check — before creating a short link, `qork` now verifies the target URL is real. It rejects plain text that isn't a web address, and refuses to shorten URLs that return "not found" or have a hostname that doesn't exist on the internet. URLs behind login walls, slow servers, or with temporary errors still shorten normally. Add `--no-check` to skip this entirely.
- Full uninstall on every platform, including Windows — `qork uninstall` now completely removes `qork` from your system regardless of how you installed it (Windows installer, Inno Setup installer, or directly via Cargo). It cleans up the program files, removes it from your PATH, removes it from Add/Remove Programs on Windows, and deletes the install record. Add `--yes` to skip the confirmation prompt (useful in automated scripts).

---

## June 14, 2026 — Native installers: Windows MSI/EXE, macOS .pkg, Linux .deb/.rpm

**Added**

- `qork` v1.0.1 now ships a full set of native installers in addition to the command-line one-liners — no need to use a terminal if you'd rather just double-click something:
  - **Windows**: Two MSI installers (one for personal use that doesn't need admin rights, one for IT-managed machines) and two traditional setup `.exe` installers in the same two flavors. `qork update` automatically uses whichever installer type you originally used.
  - **macOS**: A `.pkg` installer for both Apple Silicon and Intel Macs. The package is unsigned, so the first launch requires right-clicking and choosing Open.
  - **Linux**: `.deb` and `.rpm` packages for both x86-64 and ARM systems.
- The install page was reorganized to lead with the most sensible option per operating system — the terminal one-liner for Mac and Linux, the MSI/EXE for Windows. All native installer download links are available below that.

**Behind the scenes**

- Three separate automated build workflows produce all the installer formats and upload them to the GitHub release automatically.

---

## June 14, 2026 — qork CLI launched, public shorten API, and link source tracking

**Added**

- **`qork` command-line tool** — a new cross-platform tool you can install on Mac, Linux, or Windows to shorten URLs from your terminal. `qork <url>` prints the short link. `qork --alias` lets you request a custom code. `--json` outputs the raw data. `qork update` and `qork uninstall` manage themselves.
- **Install page** at `/install` — shows install instructions with OS-specific tabs, a sample usage session, a command reference table, and download links. Linked from the home page's `$ qork "url"` line and the footer.
- **Branded installer scripts** available at `qork.me/install.sh` (Mac/Linux) and `qork.me/install.ps1` (Windows) — these are thin wrappers over the official release downloads.
- **`qork.me/llms.txt`** — a plain-text guide for AI agents about how to use the qork.me API and CLI.
- **GET shortening** — you can now shorten a URL with a simple GET request (no JSON body needed). Both GET and POST return the same response, now including a full `href` field with the complete short URL.
- **Link source tracking** — every link now records where it was created: the website (`web`), the CLI tool (`cli`), or a direct API call (`api`). The admin dashboard shows a breakdown of new links by source. Older links are backfilled as `web`.
- Reserved the short codes `install`, `cli`, `download`, and `llms` so they can't be accidentally assigned to user-created links (they'd conflict with the new pages and files).

**Behind the scenes**

- Database migration adds the source column to the links table and updates the shortening function to record it on every new link.

---

## June 14, 2026 — Click count fix: totals now match what you see

**Fixed**

- The admin dashboard's headline "Total Clicks" number was using a different count than the per-link click numbers shown in the links table. They now agree. The issue was that older redirects (before a certain infrastructure change) were counted in the per-link total but not in the events log — the events log only has detailed rows for more recent redirects. The dashboard now uses the reliable per-link total for the headline.
- Analytics charts are now labeled "Tracked clicks" with a note clarifying they count detailed events (with device and time info), while the headline uses the full lifetime count. This prevents confusion between the two numbers.

**Behind the scenes**

- Database function updated to expose the correct total click count.

---

## June 14, 2026 — Admin analytics charts and searchable/filterable links table

**Added**

- Admin dashboard now has charts — a 14-day view of click activity and new links created, a top-links ranking by click count, and a clicks-by-device breakdown. All delivered in a single fast query.
- The links table now has live search (type to filter by short code or destination URL), status filters (All / Active / Off / Alias), sortable columns with direction arrows, a result count, and a bulk "Clear all" action with a double-confirm prompt.

**Improved**

- Home page now fits neatly in the browser window without scrolling on desktop, laptop, and tablet — the layout is height-aware and scales to fit. Very short viewports (landscape phones) gracefully fall back to natural scroll so nothing gets clipped.

**Behind the scenes**

- A new database function powers the analytics in a single query rather than many separate ones.

---

## June 14, 2026 — Full QubeTX design system: canonical blue and violet everywhere

**Improved**

- The site's accent color was previously a custom sage/bamboo green specific to QorkMe. This release reverts to the standard QubeTX brand colors: blue as the action color and a blue-to-violet gradient across the LED displays and brand elements. All animated dot displays were updated to match. The success state is now green. The warning, error, and info colors are unchanged.
- The home page hero was redesigned around a "terminal" aesthetic — an eyebrow label, a `$ qork "url"` command prompt with a blinking cursor, the QORK.ME wordmark rendered in a bold blue-to-violet gradient, a gradient hairline separator, the URL shortener form, and a live LED clock below.
- The LED word display on the home page was replaced by the Makira Black gradient wordmark described above. The LED board still powers the 404 page ("404 / NOT.FOUND") and the admin login page ("SECURE / ACCESS"), both now on the blue-to-violet color ramp.
- The admin console was redesigned in a technical "machine report" aesthetic — a stat grid (total links, clicks, average per link), a system status panel with database health details, and a compact sortable links table with inline actions. Responsive: table on desktop, card list on mobile.
- All animated label changes (button text, status indicators, copy confirmation) and the dot-field ripple that fires when a link is created are unchanged.

---

## June 12, 2026 — Search-engine and accessibility groundwork

**Added**

- Added the standard files that tell search engines how to crawl and list the site, plus a small footer contrast fix — making the homepage easier to find in search and helping it meet accessibility benchmarks.

---

## June 12, 2026 — Complete QubeTX design system redesign

**Improved**

- The entire site was rebuilt on the QubeTX design system — a dark-only "void" aesthetic with near-black backgrounds, hairline borders, and the IBM Plex Mono typeface for technical labels. (At this point the accent color was a custom sage green specific to QorkMe, later reverted to the standard QubeTX blue in the next release.)
- Home page: animated dot-grid background that swells around your cursor and fires a ripple when a link is created; LED wordmark for "QORK.ME"; live LED clock; the URL shortener card with animated label changes ("SHORTEN → WORKING…", "IDLE → INPUT → READY → BUSY → DONE" corner status, "CHECKING → AVAILABLE / TAKEN" for custom aliases, result URL that rolls in, and "COPY → COPIED" flash).
- Result page: short URL animates in on arrival, copy button with flash confirmation, QR code with no white border.
- Admin console: count-up stat numbers, health card, links table with inline feedback. Login page: "SECURE / ACCESS" LED display.
- 404 page: "404 / NOT.FOUND" LED sweep over the dot field. Also fixed a bug where the 404 page was caught in a redirect loop.
- Removed toast pop-up notifications everywhere — all feedback is now shown as inline text in the relevant component.

**Removed**

- Light mode and theme toggle (site is now dark-only).
- Several old components (animated background, tilt card wrapper, bauhaus decorations, old matrix background).
- `react-hot-toast` notification library.

**Behind the scenes**

- Animation library (anime.js), smooth scroll (Lenis), and text layout (Pretext) added. The `motion` package was removed. Test runner upgraded to Vitest 4 with jsdom. CI now tests on Node 20 and 22 (dropped Node 18).

---

## June 12, 2026 — Major database performance overhaul

**Improved**

- Creating a short link now makes exactly one database call instead of many. Previously the app would first scan for duplicates, then check availability one candidate at a time (up to 100 queries). Now a single database function handles all of that atomically — duplicate detection, reserved-word filtering, availability checking, and the insert — in one round trip.
- Detecting whether a URL has already been shortened is now much faster on large databases, because it uses a quick fingerprint of the URL instead of scanning every stored link.
- Short code generation now produces a batch of candidates (shortest first), so codes stay at 4 characters while space is available and grow automatically as the namespace fills up.
- Click analytics no longer get silently lost. The analytics record is now saved reliably after the visitor is redirected, instead of being kicked off in a way that could be cut short before it finished on the hosting platform.
- The admin health check went from 8 separate database queries down to 1.
- Admin links pagination now uses an estimated count instead of an exact full-table scan per page load — faster on large tables.

**Fixed**

- Line endings are now enforced to be Unix-style across the repo, preventing Windows checkouts from failing the code formatting check.

**Behind the scenes**

- Several database migrations: new atomic shorten function, performance improvements to access control policies, hardened function security, admin health stats function (restricted to admin use only), user deletion no longer blocks on owned links, and the reserved words list was synchronized between the app and the database.

---

## May 20, 2026 — SHAUGHV color palette and IBM Plex Mono

**Improved**

- The site's colors were updated to a SHAUGHV vintage palette: sage greens, olive tones, warm bamboo accents, and cream/espresso surfaces for dark mode. (This was a stepping stone toward the full QubeTX design system, which came in a later release.)
- IBM Plex Mono is now used for monospaced text (short URLs, code elements) — self-hosted rather than loaded from a CDN.

**Removed**

- The floating particle/blur-orb background decoration that appeared behind the home page.
- The 3D perspective tilt effect on the URL shortener card. The border shimmer inside the card was kept.

---

## April 8, 2026 — Security fixes and a local CI command

**Security**

- Click analytics were silently failing — a missing database policy meant no click data was being recorded. Fixed.
- Visitors were being blocked from following short links owned by other users (they should always be able to redirect). Fixed.
- The reserved words table was accidentally writable by anyone. Fixed — it is now read-only for regular users.
- Users could edit or delete links they didn't own via a loophole in the database rules. Fixed — only the link owner can modify their links.
- The ability to erase all data in a single operation (TRUNCATE) was unnecessarily available to regular users. Removed.

**Added**

- `npm run ci` — a single command that runs the full suite of quality checks (linting, type checking, formatting, tests, and build) locally, matching what GitHub Actions runs. Makes it easy to verify everything is green before pushing.

**Removed**

- Eight leftover font files from a previous typography experiment.

---

## March 21, 2026 — Single font across the site

**Improved**

- The site now uses only one font family (Makira Sans Serif) for everything — previous remnants of other fonts were fully removed. Two new weights (Extra Bold and Black) were added for display headings and the wordmark.
- The 404 page was refreshed with a new interactive background and updated copy.

**Removed**

- Two other font families (ZT Bros Oskon and Inter) and all references to them in documentation.

---

## March 20, 2026 — Typography overhaul: Makira replaces the display font

**Improved**

- The display/heading font was replaced with Makira Sans Serif across all pages. Four weights (Regular, Medium, SemiBold, Bold) were added.

**Removed**

- The previous display font (Personal Vogue) and the CSS class that was used to keep it off data tables.

---

## March 14, 2026 — Validator tests, image optimization, and several bug fixes

**Added**

- Test coverage for URL validation (including edge cases like IPv6 addresses and unusual protocols), the class-name utility, and the reserved-words list.

**Improved**

- Images throughout the site now use the built-in Next.js image component, which handles optimization automatically — removes manual `eslint-disable` workarounds that were suppressing warnings.
- The admin links table now computes its maximum click count once per render instead of once per row, making it faster on large lists.
- The in-memory URL redirect cache now has a size limit (1,000 entries) with oldest-first eviction, preventing unbounded memory growth.

**Fixed**

- IPv6 loopback addresses (`[::1]`) are now correctly rejected by the URL validator.
- Non-HTTP protocols (like `ftp://`) are now rejected instead of being silently rewritten to `https://`.

---

## March 14, 2026 — Developer documentation update

**Behind the scenes**

- The internal developer guide was fully rewritten to reflect the current state of the project — correct colors, layout quirks, admin console details, how the LED displays work, testing setup, and code-formatting configuration.

---

## March 14, 2026 — QR Gen link in the footer

**Added**

- A "QR Gen" link in the site footer pointing to `qr.qork.me` (QubeTX's QR code generator), opening in a new tab.

**Improved**

- The Admin link in the footer is now slightly dimmed by default so the new QR Gen link is visually balanced. It returns to full opacity on hover.

---

## March 13, 2026 — Faster mobile load by skipping entrance animations

**Improved**

- On mobile devices, the page now appears immediately instead of fading in gradually. The dot-matrix cascade, card fade-in, and footer fade-in entrance animations were disabled on mobile to eliminate the lag they caused.
- The decorative blur-orb background effects are also skipped on mobile to reduce GPU overhead.
- Desktop entrance animations are unchanged.

---

## March 13, 2026 — Formatting fix for CI

**Fixed**

- A code formatting inconsistency in the LED display component was causing the automated CI pipeline to fail. Fixed.

---

## March 8, 2026 — Admin console redesign with typography, metrics, and table styling

**Added**

- Admin and login pages now use the Personal Vogue font for headings, with Inter for data elements in the table.
- Metric card numbers now pulse with a subtle glow animation.
- The links table has alternating row colors and a highlight effect with a left border accent on hover.
- A "Last Active" column (showing relative time like "2 hours ago") was added to the links table.
- Click count bars — a small proportional bar in the Clicks column gives a quick visual sense of each link's relative popularity.

**Improved**

- Metric card numbers are larger and centered with the glow animation.
- "Active Ratio" metric was replaced with "Avg. Clicks / Link" — a more useful engagement number.
- Short codes in the table are now bold with a small external-link icon.

**Removed**

- The "Status" column from the links table (desktop and mobile).

---

## March 8, 2026 — Dimmer seconds on the LED clock

**Improved**

- The seconds display on the desktop LED clock (`:SS`) is now rendered at 40% brightness — visually de-emphasized relative to the hours and minutes, which makes the clock easier to read at a glance. Mobile clock unchanged.

---

## March 8, 2026 — Personal Vogue font on the home page + logo repositioned

**Added**

- The home page now uses the Personal Vogue font for all visible text (input field, button, footer, admin link).

**Improved**

- The Qork logo was moved to above the dot-matrix title/clock area on the home page.

---

## March 8, 2026 — Qork logo is now clickable everywhere, footer branding updated

**Improved**

- Every instance of the Qork logo across the site (home, 404, admin, footer) now links back to the homepage. The header logo was already linked; this made all the others consistent.
- The footer tagline was unified to "A Service By QubeTX." across all pages — each page previously had its own custom tagline.
- The Qork logo displays in its native terracotta color on hero areas and in the header, rather than inverting to white in dark mode.

---

## March 8, 2026 — Qork brand logo introduced across the entire site

**Added**

- The new Qork logo was added to: home page hero, site navigation bar (replacing a generic link icon), 404 page (replacing a compass icon), admin dashboard header, and site footer (replacing the SHAUGHV brandmark).
- All favicon sizes were regenerated from the new logo: browser tab icons, Apple touch icon, Android/PWA icons, and the `.ico` file for legacy browser support.

---

## March 8, 2026 — Admin table and layout polish

**Fixed**

- The "Created" column in the admin links table was running into the click count number due to missing spacing. Fixed.
- Active/Inactive status badges in the links table were inconsistently sized. Normalized to match the health card badge.
- The "SECURE ACCESS" display on the admin dashboard lacked breathing room above it when logged in. Added top margin.

---

## March 2, 2026 — Admin dashboard overhaul: health card, sortable table, pagination

**Added**

- New database health card showing: connection status with latency bar, row counts per table, active vs. inactive link ratio, and data freshness timestamps, with a manual refresh button.
- New paginated links table with sortable columns (code, destination, clicks, created, status), per-row delete with a confirmation prompt, and a mobile-friendly stacked card layout.
- Three new admin API endpoints: database health check, paginated link listing with sort/order params, and single-link deletion.

**Improved**

- Admin dashboard now shows summary stats (total links, clicks, active ratio) instantly on load — no waiting for the detailed cards.
- Authorization logic was extracted into a shared helper so the same check isn't duplicated across multiple admin routes.

**Fixed**

- The "SECURE ACCESS" dot-matrix background animation was running at 60fps even when nothing was visually changing, causing unnecessary CPU usage. It now only animates when actually needed.

**Removed**

- The 6-card metrics grid, the system-status pulse matrix, the separate database health card, and the "most recent URL" card — all consolidated into the new health card and links table.

---

## March 2, 2026 — Grid background viewport fix

**Fixed**

- The interactive grid background wasn't covering the full viewport — it was stuck in a corner due to a conflicting CSS positioning rule. Fixed.

---

## March 2, 2026 — Grid background performance: click ripple rewritten

**Improved**

- The click ripple effect on the interactive grid background was rewritten from JavaScript (which recalculated ~1,300 distances per animation frame) to a CSS animation. The result is the same visual ripple, but with no JavaScript math per frame — the animation runs entirely on the GPU.

---

## March 1, 2026 — Footer redesign and several performance fixes

**Improved**

- The site footer was redesigned with the SHAUGHV brandmark centered between the QorkMe name/tagline (left) and the Admin link (right) on desktop. Mobile uses a two-row centered layout. The semi-transparent background and top border were removed; vertical padding was reduced for a cleaner look.

**Fixed**

- The dot-matrix background animation was triggering ~108,000 DOM updates per second due to unnecessary 60fps physics loops running on all matrix cells. Physics are now disabled where not needed — only the shimmer animation runs.
- The interactive grid background was continuously re-rendering at 60fps even when idle. It now only updates when an active ripple is playing.
- Excessive GPU layers were created for every matrix cell (~1,800 of them). Those unnecessary layer hints were removed.
- The decorative blur orbs had very large blur values that were expensive to render. Reduced to 80px/60px and limited GPU layer hints to only the two elements that actually animate continuously.

**Added**

- SHAUGHV brand mark SVG (used in the footer).

---

## December 9, 2025 — Security update and admin sign-in redesign

**Security**

- Updated the underlying web framework to patch a known security vulnerability. No action needed by visitors — the fix is on our side.

**Improved**

- Redesigned the admin sign-in screen and its animated access panel, and made it render more smoothly on phones.

---

## November 29, 2025 — Fixed interactive grid not responding to hover in content areas

**Fixed**

- The interactive grid background wasn't responding to hover and click events in areas where content (like the URL shortener card) was rendered — transparent layers were blocking the pointer events meant for the grid. Fixed by setting decorative containers to be non-interactive, while keeping all actual UI elements (forms, buttons, footer) fully clickable.

**Behind the scenes**

- Documentation corrections — some noise filter values in the developer docs were wrong; corrected to match the actual implementation.

---

## November 20, 2025 — Subtler card tilt on mouse move

**Improved**

- The subtle 3D tilt effect on the URL shortener card when you move your mouse was reduced from a noticeable rotation to a very gentle one (5° max instead of 35°). The depth cue is still there, just much less distracting.

---

## November 20, 2025 — Removed security scan from CI

**Behind the scenes**

- The security scan job (dependency audit and secret detection) was removed from the automated CI pipeline. All other checks (tests, linting, type checking, formatting, build, bundle size) remain.

---

## November 20, 2025 — CI fixes for type checking and linting

**Fixed**

- Three separate issues that were causing the automated CI pipeline to fail: an uninitialized variable in the grid background component, a stale dependency warning in the matrix physics loop, and an unused variable in the tilt wrapper. All fixed without changing any visible behavior.
- Formatting inconsistencies in several UI components were corrected to keep the formatting check green.

---

## November 2, 2025 — Performance monitoring added

**Added**

- Vercel Speed Insights is now active on the site — it collects real-time performance data (page load speed, layout shift, etc.) that's visible in the Vercel dashboard. No visible change to the site itself.

---

## October 31, 2025 — Security dependency update

**Security**

- Updated a dependency (Vite) to resolve a reported security vulnerability. No functional changes.

---

## October 22, 2025 — Implementation notes saved for future reference

**Behind the scenes**

- A new internal document was added summarizing implementation patterns for the interactive grid background and dot-matrix display, for reference across future projects. No functional changes to the site.

---

## October 19, 2025 — Comprehensive design system documentation

**Behind the scenes**

- The design system document was expanded from a brief overview into a full, comprehensive brand guide with complete code examples for every major component, color system, typography, layout, frosted-glass effects, animation patterns, and responsive design. Created for reuse across projects.

---

## October 19, 2025 — Mobile matrix display optimization

**Improved**

- On mobile screens, the LED dot-matrix title display now shows a shortened version of the site name (4 characters instead of 7) and the clock omits seconds — both to prevent overflow on narrow screens. Desktop still shows the full "Qork.Me" title and full time with seconds.

**Behind the scenes**

- Developer documentation was updated to explain the mobile optimization pattern used for the matrix displays.

---

## October 19, 2025 — Admin console cleanup: removed a decorative badge

**Improved**

- Removed a pill-shaped "Admin Console" badge from the top of the admin dashboard — it was decorative clutter. The page heading is cleaner without it.
- Added more bottom padding to the admin page's main content area for better breathing room before the footer.
- Added a new "System Status" pulse card to the admin metrics grid (a 7×7 animated dot grid showing the system heartbeat), completing the 6-card layout.

---

## October 20, 2025 — Admin dashboard centering and login page spacing

**Improved**

- The admin dashboard content is now properly centered both vertically and horizontally in the viewport. The page now also scrolls correctly when the content is taller than the screen.
- The login page's GitHub authentication notice box has more internal padding, making it easier to read.

---

## October 20, 2025 — Contributor guide refreshed

**Behind the scenes**

- The contributor guide was updated to reflect the current project structure, required commands, coding conventions, and release process.

---

## October 19, 2025 — "SECURE / ACCESS" dot matrix on admin pages

**Added**

- Admin pages (dashboard and login) now display "SECURE" and "ACCESS" in the same dot-matrix shimmer style as the home page title. The letters needed for these words were added to the character map.

**Fixed**

- A CSS animation class that was referenced but never defined caused the login button and error message to remain invisible after page load. The missing animation classes were added.

---

## October 19, 2025 — README structure update

**Behind the scenes**

- The README's directory tree was regenerated from the actual project structure (31 directories, 87 files) to replace a hand-coded approximation that had grown stale.

---

## October 19, 2025 — New favicon system matching the dot-matrix aesthetic

**Added**

- A complete new favicon based on the dot-matrix design: four circles at the corners of a square, in terracotta. All sizes were generated: browser tab icons (16px, 32px, 48px), Apple home screen icon (180px), Android/PWA icons (192px, 512px), and a legacy `.ico` file for old browsers.
- PWA manifest — QorkMe can now be added to a device home screen with an app-like appearance (no browser chrome).

---

## October 19, 2025 — Grid background now covers the full screen dynamically

**Added**

- The interactive grid background now calculates how many cells are needed to cover the entire viewport, including very wide monitors. Previously it was limited to a fixed 800×800px area, leaving the right side of wide screens without hover effects.

**Fixed**

- The right half of wide screens now has fully interactive hover effects on the grid. The grid also updates automatically if the browser window is resized.

**Improved**

- The edge feathering on the dot-matrix display was upgraded from a simple 2-step gradient to a 4-step smooth fade, for a softer, more natural blending effect.

---

## October 19, 2025 — Admin authentication and dashboard redesign

**Added**

- A proper admin login page at `/admin/login` — GitHub OAuth sign-in button, error message handling, staggered page-load animations, and a "Back to homepage" link. Authenticated users are redirected to the dashboard automatically.
- The OAuth callback route that completes the GitHub login flow was added — this was the missing piece that was blocking admin login from working at all.
- Screen reader accessibility improvement: the URL input field now has a visually-hidden label that screen readers can announce.

**Improved**

- Admin dashboard redesigned with the new earthy color system — metric cards, database health info, sign-out section, proper redirect for unauthenticated users (to login) and unauthorized users (to login with error message).

**Fixed**

- Admin login now works end-to-end (it was broken before due to the missing OAuth callback).
- Two previously failing UI tests were corrected.

---

## October 19, 2025 — Page load animations

**Added**

- The home page now has a staggered entrance sequence: the dot-matrix title cascades in cell-by-cell (top-left to bottom-right), then the clock, then the shortener card, then the footer — over about 1.8 seconds total. The effect makes the page feel alive and polished on first load.

**Improved**

- The "QorkMe" text in the footer was made slightly thinner for a more refined look.

---

## October 19, 2025 — Results shown inside the card (no page navigation)

**Improved**

- After shortening a URL, the result now appears right inside the same card with a smooth fade transition — no more navigating to a separate success page. The card shows a loading state while working, then displays the short URL with a copy button. Clicking "Shorten Another URL" resets back to the input state.

---

## October 18, 2025 — Mobile layout fixes and responsive matrix

**Improved**

- The dot-matrix display is now properly responsive — desktop shows larger cells and more columns, mobile shows a compact version that fits without horizontal scrolling. Previously both used the same sizes which caused overflow on phones.
- The URL shortener card padding was simplified to a consistent value across all screen sizes using inline styles — this fixed an issue where Tailwind classes for padding were silently not generating in the version used.
- The home page layout now has proper horizontal padding on mobile so the card doesn't touch the screen edges on narrow phones.

**Behind the scenes**

- Documentation updated with real-world examples of Tailwind v4 padding/margin issues and the inline-style workaround pattern.

---

## October 18, 2025 — Footer alignment fix

**Fixed**

- The site footer was misaligned — the brand name, tagline, and metadata links weren't sitting on the same baseline. Fixed by normalizing text element types and spacing.
- Removed "Designed in San Francisco •" text from the footer; now reads "Powered by Supabase & Vercel".

---

## October 18, 2025 — Interactive grid background introduced

**Added**

- A new interactive grid background appeared behind the home page — a subtle grid of lines with a paper-like noise texture that glows in the brand color where you hover. It's drawn as a single lightweight graphic for smooth performance.

---

## October 18, 2025 — Layout documentation expanded

**Behind the scenes**

- Added a thorough internal layout guide documenting tricky CSS behaviors and their workarounds, plus expanded troubleshooting notes in the developer docs.

---

## October 18, 2025 — Gentler card tilt and roomier label

**Improved**

- The 3D tilt that follows your cursor on the URL shortener card was toned down to a much subtler effect, and the input label was given a little more breathing room above the field.

---

## October 18, 2025 — Page-flicker fixes, 12-hour clock, and input spacing

**Changed**

- The LED clock on the home page switched from a 24-hour format to a friendlier 12-hour format with AM/PM.

**Fixed**

- Fixed a brief flicker/mismatch that could occur as the page finished loading (the server and browser versions of the page now render identically). The sparkle effect that caused part of it was made consistent.
- Fixed the URL input field and button touching the edges of the card; they now keep consistent spacing on every screen size, and the input's focus highlight is no longer clipped.

---

## October 18, 2025 — Full-screen animated background with a clock

**Improved**

- The animated dot-matrix background was redesigned to fill the entire screen, with a digital clock at the center and waves rippling outward from it — a richer, more immersive backdrop than the previous floating dots.

---

## October 12–14, 2025 — Minor fixes and maintenance

**Fixed**

- Footer element alignment on desktop was corrected (baseline alignment across all footer text).

**Behind the scenes**

- Formatted the root changelog to keep CI formatting checks green.
- Added a small top offset to the navigation bar so it doesn't press against the very top of the viewport.
- Restored vertical spacing and alignment for the custom alias input section in the URL shortener.

---

## October 10, 2025 — Navigation bar tweaks (several small updates)

**Improved**

- Navigation bar top offset raised slightly so it consistently clears the top edge of the browser window.
- Navigation bar icon backgrounds and the theme toggle button were simplified — removed backgrounds, borders, rounded corners, and shadow for a cleaner look.
- Navigation bar horizontal padding increased on all breakpoints to give icons more room from the edges.
- Footer was enlarged and content aligned so the brand name, tagline, and metadata stay vertically centered.
- The "Share-ready link studio" badge was removed from the home hero to let the heading take center stage.
- The navigation tagline was removed — the header now shows only the QorkMe wordmark.
- Various earlier navigation bar copy changes to streamline the header (removing retired taglines, simplifying the status pill to text-only, removing a marketing action button).
- CI pipeline was sped up slightly — the bundle size report now reuses the build output from the previous step instead of rebuilding.

**Behind the scenes**

- Documentation was updated to describe the new earthy modern design system (warm parchment, terracotta, sage). Wording and ASCII normalization cleanup across several doc files.
- Inter Regular (400) set as the default body font; Inter Black (900) reserved for buttons.
- Global color tokens updated to the earthy modern palette.
- Agent contributor guide formatting was cleaned up.

---

## October 10, 2025 — Glassmorphism navigation bar

**Improved**

- The navigation bar was replaced with a standard glassmorphism-style bar (blurred background, consistent padding) that works the same on both the home page and the result page. The previous custom gradient nav was inconsistent between pages.

---

## September 25–27, 2025 — Navigation bar redesign iterations

**Improved**

- The marketing and result navigation bars went through several rounds of redesign: layered gradient framing, in-page anchor navigation, status badges, balanced action buttons, and finally settling on a glassmorphism bar. These were iterative visual improvements leading up to the final nav design.
- A shared `SiteHeader` component was introduced so both the marketing and result pages use the same navigation with a consistent theme toggle.

---

## September 22, 2025 — Admin console, result page simplification, and tests

**Added**

- Private admin console at `/admin`, gated by GitHub login. Shows aggregate stats (total links, active redirects, click totals, latest activity, database health) and a purge button that clears all data.
- Footer link to the admin console.

**Improved**

- The result page (shown after shortening a URL) was simplified to just the short link card and a prompt to create another — the metric tiles and detail panels were removed.
- Home page copy was updated to a more welcoming, focused tone.
- Internal documentation links were removed from the public-facing result page.

**Added**

- Unit test suite (shortcode engine, API routes, database clients, URL shortener form flow). Tests run automatically in CI.

**Behind the scenes**

- Prettier added as a dev dependency for consistent formatting in CI. Build tool pinned to a patched release to resolve a security advisory.

---

## September 15, 2025 — Major visual redesign: dark mode glassmorphism

**Improved**

- The entire UI was redesigned with a sophisticated dark-mode-first aesthetic: deep midnight blue and slate backgrounds, blue/purple/cyan accent colors, frosted-glass card effects with backdrop blur, layered shadows, shimmer animations on buttons and cards, floating animations on feature cards, and a consistent theme toggle.
- All components — buttons, inputs, cards, navigation — were updated to match the new design system.
- Contrast and accessibility were significantly improved over the previous earth-tone design.
- Light mode remains available as a secondary option.

---

## January 15, 2025 — Sandstone and earth tone design system (later replaced)

**Improved**

- The site was redesigned with a sandstone and earth-tone palette (warm browns, desert sand, deep earth tones) and bold serif typography (ZT Bros Oskon 90s font family). This replaced the previous natural greens design.
- Cards, buttons, inputs, and navigation were all updated to match the new warm aesthetic.
- Dark mode uses deep earth tones with warm transitions.

Note: this design was later replaced by the dark-mode glassmorphism system in September 2025, and then again by the full QubeTX system in June 2026.

---

## January 15, 2025 — Deployment fixes and font loading

**Fixed**

- Production deployment was failing because the repo uses a monorepo structure and Vercel couldn't find the app. Fixed by adding a root-level configuration pointing to the right subdirectory.
- GitHub Actions deployment workflow had an authentication error. Fixed.
- GitHub Actions security scanner was failing with a "same commit" error on pushes. Fixed.
- GitHub Actions was failing due to insufficient permissions for creating commit comments. Fixed.
- Fonts weren't loading correctly on the live site. Switched to Google Fonts (Outfit, Inter, JetBrains Mono) as the primary source while the custom font files were being prepared.

**Behind the scenes**

- The repo was linked to Vercel with project configuration files, enabling local Vercel CLI commands.
- A redundant second deployment workflow was disabled to stop duplicate deploy attempts and confusing failures.

---

## January 15, 2025 — Natural color palette and card-based redesign

**Improved**

- The UI was redesigned from the original Bauhaus industrial style to a clean, minimal card-based layout: sage green as the primary color, warm beige backgrounds, terracotta orange accents, and forest brown for text.
- Light and dark themes with smooth transitions; theme preference is saved across sessions.
- New components: card with elevated/standard variants, feature card, theme toggle with animated icon, updated button and input styles.

**Behind the scenes**

- Theme management moved to a React context provider. All components updated to use the new design tokens.

---

## January 14, 2025 — Initial release

**Added**

- URL shortening with memorable 4-character codes generated using a consonant-vowel pattern algorithm.
- Custom alias support — choose your own short code (case-insensitive matching, so "MyLink" and "mylink" are the same).
- Real-time click analytics tracking device type, browser, OS, country, city, and referrer for every redirect.
- QR code generation for each shortened URL.
- Collision prevention — the system ensures no two links share the same code.
- Reserved words protection — certain codes are blocked from being assigned to user links.
- Admin-friendly database designed to scale to 200,000+ URLs with fast indexed lookups.
- API endpoints: create a short link (POST), check alias availability (GET), and the redirect handler.
- Automated CI/CD: GitHub Actions runs linting, type checking, formatting, security scanning, and deploys to Vercel on every push to main. Preview deployments for pull requests.
- Security: input validation, SQL injection prevention, XSS protection headers, hashed IP addresses for privacy.
- Performance: database indexes on hot columns, in-memory cache for frequently-used short codes, edge deployment for fast redirects, progressive short code length (starts at 4 characters).
- Full documentation: setup guide, Vercel deployment guide, design system spec, database setup instructions, and developer guidance.
