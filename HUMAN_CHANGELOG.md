# Human Changelog

A plain-English companion to [CHANGELOG.md](./CHANGELOG.md). Every change in the technical changelog has a layman's-terms version here — no version numbers, no code references, just what changed and why it matters.

For the technical version with versions, file paths, and exact details, see [CHANGELOG.md](./CHANGELOG.md).

---

## June 23, 2026 — Windows install command works from any shell

**Improved**
- The one-line Windows install command on the install page now wraps the install script in a full PowerShell command, so it runs the same whether you paste it into the regular Command Prompt, PowerShell, or the Run box — and Windows' script-safety setting won't block it. This matches how other popular command-line tools present their Windows installs.

---

## June 19, 2026 — Install page polish: roomier Windows buttons, a paced demo, clearer API examples

**Improved**
- The Windows download buttons on the install page now have breathing room instead of touching the panel edges, and there's space below the last row so nothing feels cramped.
- The animated terminal demo now pauses for a moment after each shortened-link result before the next command appears, so it's easier to follow.
- The two API code examples are now separated by a blank line, making them easier to tell apart.

---

## June 14, 2026 — Bigger Windows download buttons that show the version on hover

**Improved**
- The Windows download buttons on the install page are now larger and stand out more — a blue-tinted style with a soft glow when you hover. When you hover (or tab to) a button, its label rolls over to reveal the exact release version you're about to download, then rolls back when you move away.

---

## June 14, 2026 — Easier Windows installs + faster command-line updates

**Added**
- The install page's Windows tab now shows the ready-to-run installers right under the command — the per-machine (needs admin) and per-user (no admin) editions, each as an MSI and an EXE — so they're easy to grab without scrolling. The full installer list still lives at the bottom of the page too.

**Improved**
- Made it clear that the one-line install commands need no programming tools — they just download a ready-built program for your computer (Mac, Linux, or Windows; Intel or ARM chips detected automatically). Only the optional developer-oriented command builds from source.
- Updating the command-line tool on Mac and Linux now downloads the ready-built program instead of rebuilding it from source — faster, and no developer tools required. (It already worked without them; now it's the preferred path even when they're installed.)

---

## June 14, 2026 — Docs Accuracy Pass + Changelog Governance

**Added**
- A plain-English companion changelog (this file, and one for the app subfolder) so non-engineers can follow what's changed without needing to read code. A new rule now requires these companion files to be kept in sync with the technical changelogs in every future commit.
- A pre-push safety gate for contributors: before code goes out to the main branch, an automated check reminds whoever is pushing to also update the changelogs and verify that related documentation files (install guides, README files, agent docs) are accurate. It never blocks silently — if it hits an error, it lets the push through and just warns.

**Improved**
- The animated text on the `/install` page now lingers a half-second longer on each phrase before rolling to the next, so the taglines and example commands are more readable.
- Corrected several inaccuracies in the `qork` CLI documentation across multiple files — specifically the shape of the API response (what fields come back when you shorten a link), the `--no-check` flag, the `update`/`uninstall` commands, the full list of native installer types for Windows/macOS/Linux, and how the CLI handles commands vs. URLs. The machine-readable guide at `qork.me/llms.txt` was verified accurate with no changes needed.

---

## June 14, 2026 — qork CLI New Features

**Improved**
- `qork help` now prints built-in documentation. The words "help", "update", and "uninstall" are always treated as commands (never accidentally shortened as URLs), while a real URL with a web address format always routes to the shortener — no ambiguity.
- Man pages ship with the Linux and macOS packages, so `man qork` works in a terminal.
- Before shortening a URL, `qork` now checks that the link actually exists: it rejects garbled text (not a real URL), refuses links that return "not found" or "gone" errors, and skips links to hosts that can't be resolved. Pages behind a login wall, server errors, and slow-loading sites are still shortened normally. You can bypass the check entirely with `--no-check` if you need to.
- `qork uninstall` now fully removes the program on every platform including Windows — binary, PATH entry, Start Menu entry, and install record — detecting how it was originally installed (system-wide installer, per-user installer, manual script, or developer package manager) and cleaning up accordingly. Add `--yes` or `-y` to skip the confirmation prompt (useful in scripts).

---

## June 14, 2026 — qork Native Installers

**Added**
- The `qork` CLI now ships native installers for every major OS on every release: four Windows installers (two `.msi` installers and two `.exe` installers, each in a version for machines with admin rights and a version for machines without), two macOS installers (one for Apple Silicon, one for Intel), and four Linux packages (the two standard package formats, each for both common chip architectures). The recommended way to install on Windows is one of these installers; on macOS/Linux, the single-line install command still works.
- The `/install` page reorganizes download options by operating system, putting the most natural install method for each platform first.
- Three automated release workflows now build and publish all of the above installer types to every GitHub Release automatically.

---

## June 14, 2026 — qork CLI, Public API, and Source Attribution

**Added**
- **`qork` CLI** — a new command-line tool for shortening URLs from the terminal, available on macOS, Linux, and Windows. Install it with a single command (`curl … | sh` on Mac/Linux, `irm … | iex` on Windows, or `cargo install qork`). Once installed, `qork <url>` prints your short link. Supports custom aliases (`--alias`), JSON output (`--json`), and built-in `qork update` / `qork uninstall` commands.
- **`/install` page** — a new page at `qork.me/install` with platform-specific install instructions and download links for the CLI. Also linked from the home page hero and footer.
- **One-liner install scripts** — `qork.me/install.sh` and `qork.me/install.ps1` as branded shortcut URLs that pass through to the official installers.
- **Machine-readable API guide** — `qork.me/llms.txt` serves a plain-text guide for AI agents that want to use the QorkMe API programmatically.
- **GET shorthand for the shorten API** — in addition to the existing POST method, you can now shorten a URL with a simple GET request using a URL parameter. Both methods return the same response, now including a fully-formed `href` field so you always get a ready-to-use link.
- **Source attribution on every link** — QorkMe now tracks whether a short link was created via the website, the CLI, or the API directly. This shows up in the admin dashboard as a "New links by source" breakdown. All existing links are retroactively marked as created from the web.

---

## June 14, 2026 — Click Count Fix

**Fixed**
- The "Total Clicks" and "Average Clicks" numbers in the admin dashboard were undercounting. They now correctly use the lifetime click counter stored on each link, which matches the per-link counts shown in the links table. The detailed click event log (which only covers newer redirects) is now clearly labeled "Tracked clicks" so there's no confusion between the two figures.

---

## June 14, 2026 — Admin Analytics and Viewport Fit

**Added**
- The admin dashboard now includes a 14-day analytics panel with bar charts showing clicks and new links over time, a ranking of the most-clicked links, and a device-type breakdown. These are powered by a new backend query that the admin area fetches on load.
- The links table now has live search, filter tabs (All / Active / Off / Alias), column sorting with directional arrows, a result count, and a bulk "Clear all" button right in the table — the old standalone danger-zone button for this has been retired.

**Improved**
- The home page now fits the browser window without scrolling on desktop, laptop, and tablet in portrait orientation (tested from phone-sized all the way to 4K screens). Very short landscape viewports (like a phone held sideways) scroll naturally instead of clipping content.

---

## June 14, 2026 — Full QubeTX Design System (Blue to Violet)

**Improved**
- QorkMe has been updated to match the canonical QubeTX design system colors exactly. The previous sage/bamboo sub-brand accent colors are gone; the site now uses QubeTX blue as the action color, with a blue-to-violet gradient across the animated dot field, LED clock, and matrix displays. The green, warning, error, and info status colors are unchanged.
- The home page hero has a new "terminal" layout: a label bar at the top, a `$ qork "url"` command line with a blinking cursor, the `QORK.ME` wordmark as a large Makira Black heading with the blue-to-violet gradient, then the URL shortener card, and finally the live LED clock. This replaces the previous LED matrix wordmark. The design scales cleanly from phones to large TV-sized screens.
- The admin console has been rebuilt in a machine-report visual register: a centered layout over a subtle dot field, a gradient-ruled heading, a stat grid, a database status panel with latency meter and active-ratio meter, and a hairline links table with colored short-code chips, alias/status tags, click meters, sortable columns, and pagination. On mobile the table collapses to cards. The old generic card-based dashboard is gone.
- All the little touches remain: the rolling text animation on every label change, the copy-confirmation flash, the ripple through the background dot field when a link is created, and the footer heartbeat status.

---

## June 12, 2026 — Search-engine and accessibility groundwork

**Added**
- Added the standard behind-the-scenes files that tell search engines how to find and list the site, plus a small footer contrast tweak — so the homepage is easier to discover and meets accessibility targets.

---

## June 12, 2026 — QubeTX Design System Redesign

**Improved**
- Full redesign onto the QubeTX design system — a dark-only look with deep near-black backgrounds, thin hairline borders, and a monospaced "technical" typeface for labels and statuses. The previous sage/bamboo accent colors are kept as a sub-brand touch in this version (later replaced by the canonical blue/violet — see the June 14 entry). Pop-up notifications are completely removed; every label change is now a smooth rolling text animation instead.
- The dot-field background now ripples outward when you create a short link.
- Every page has been rebuilt: home, result, 404 (including a fix for a redirect-loop bug), and admin console + login. Light mode and the theme toggle are removed — the site is now dark-only.

**Behind the scenes**
- The automated test tooling was upgraded to its latest major version, and the automated checks now run against two different versions of the underlying runtime for broader coverage.

---

## June 12, 2026 — Database Performance Pass

**Behind the scenes**
- The URL shortening process now hits the database exactly once per request (down from many sequential queries). Duplicate detection, reserved-word filtering, and short-code collision handling all happen in a single database function. This is dramatically faster under load and eliminates a class of race conditions.
- Click analytics are now reliably recorded even when the server response is fast — previously they could silently drop under certain timing conditions.
- The admin health check consolidates what used to be 8 separate database queries into a single call.
- Row-level security policies were tuned for better query performance.
- Line endings are now enforced as Unix-style in the repository to prevent formatting failures on Windows clones.

---

## May 20, 2026 — SHAUGHV Vintage Palette and Decor Cleanup

**Improved**
- Colors reskinned to a SHAUGHV vintage palette: cream surfaces, sage action color, olive body text, bamboo warm secondary. Both light and dark mode updated.
- Hardcoded terracotta colors on the URL shortener button and matrix displays replaced with sage to match the new palette.
- IBM Plex Mono added as the monospace font for the short-URL display and code blocks.

**Removed**
- Three floating background particles and two large blurred orbs have been removed from the home page — they were decorative but added visual noise and GPU cost.
- The 3D perspective tilt and mouse-following glare overlay on the URL shortener card are gone. The card sits flat; a subtle shimmer beam is preserved.

---

## April 8, 2026 — Security Hardening and Documentation

**Security**
- Fixed a bug where detailed click analytics were silently failing to record — no detail entries were being saved even though links were getting clicks. The permission rule that was blocking those writes has been added, so click details are now captured.
- Fixed a bug where redirecting to a URL owned by a logged-in user could fail for anonymous visitors. Redirects now always work regardless of who created the link.
- The reserved-words list (protected short codes that can't be used) is now properly locked down so anonymous visitors can't modify it. Previously it was fully open.
- Anonymous visitors can no longer modify or delete links they don't own. The previous policy had a loophole that allowed editing any link with no owner; it now requires you to be the authenticated creator.
- Removed the ability for regular users (anonymous or authenticated) to wipe entire tables — that capability is now admin-only.

**Added**
- A single command that runs the full set of quality checks locally (code style, type checking, formatting, tests, and a full build) so problems can be caught before code is pushed.

**Behind the scenes**
- Database function documentation added to the project's internal guide.
- Internal agent/contributor documentation updated with accurate dependency versions, route inventory, component counts, and admin API details.
- Removed 8 unused legacy font files that were left over from an earlier design iteration.

---

## March 21, 2026 — Makira-Only + 404 Page Refresh

**Improved**
- Makira Sans Serif is now the only font used across the entire site. All references to the previous ZT Bros Oskon and Inter fonts have been removed from styles, components, and documentation.
- The 404 error page has a refreshed design with the interactive dot-grid background and Makira font. The old navigation header was removed for a cleaner look.
- Added extra-bold and black weight variants of Makira for display text and headings.

**Removed**
- All references to the old ZT Bros Oskon and Inter fonts are gone from the site's styles, and the styling rule that applied the old heavy Inter weight has been swapped for a Makira equivalent.

---

## March 20, 2026 — Font Swap: Personal Vogue to Makira

**Improved**
- The site's main font has been switched from Personal Vogue (a serif) to Makira Sans Serif across all pages — home, admin dashboard, and admin login. Makira now applies universally, including on data tables and metrics (no more Inter fallback for those).

**Removed**
- Personal Vogue font files removed.

---

## March 19, 2026 — SHAUGHV Logo Attribution

**Behind the scenes**
- Added attribution comments to the SHAUGHV brandmark SVG for cross-repository searchability. No visible change.

---

## March 14, 2026 — PR Batch Review and Merge

**Added**
- New automated tests for URL and short-code validation, covering edge cases like IPv6 addresses and unusual protocols.
- New tests for the CSS class merging utility and the reserved-words list, including mutation-safety checks.

**Improved**
- Images across the site now use the framework's optimized image component instead of plain HTML image tags — better for performance and load times.
- The LED matrix animation is faster internally (roughly 52% speedup on frame allocation).
- The admin links table no longer does redundant work when calculating click proportions for each row.
- The URL redirect memory cache is now capped at 1,000 entries and evicts the oldest entries first, preventing unbounded memory growth under heavy traffic.

**Fixed**
- IPv6 loopback addresses (a technical form of "localhost") are now correctly blocked when someone tries to shorten them.
- URLs using non-web protocols like `ftp://` or `file://` are now properly rejected instead of silently being treated as web links.

**Removed**
- Cleaned up an unused variable from the result page.

---

## March 14, 2026 — Internal Documentation Refresh

**Behind the scenes**
- Corrected an outdated framework version number in the project guide. Rewrote the app-level contributor guide with updated colors, CSS-framework notes, admin console docs, matrix display details, and the requirement to keep both changelogs in sync.

---

## March 14, 2026 — Footer QR Generator Link

**Added**
- A "QR Gen" link in the footer pointing to the QR code generator at `qr.qork.me`, opening in a new tab.

**Improved**
- The Admin link in the footer is now slightly dimmed so the new QR Gen link is more visually prominent. Hovering over Admin restores its full visibility.

---

## March 13, 2026 — Mobile Performance Optimization

**Improved**
- All entrance animations on mobile phones are now disabled. Previously, hundreds of individual CSS animations would run on page load on mobile, which caused noticeable lag on phones. On desktop, the animated cascade remains fully intact.
- The decorative blurred background orbs are no longer rendered on mobile at all, saving GPU memory and battery.

---

## March 13, 2026 — CI Formatting Fix

**Behind the scenes**
- Fixed a code formatting issue that was causing the automated formatting check to fail in CI. No visible change.

---

## March 8, 2026 — Admin Dashboard Redesign

**Added**
- The admin login and dashboard pages now use the Personal Vogue display font. Numbers, URLs, and dates still render in Inter for readability.
- Metric card numbers now pulse with a subtle glow animation.
- The links table now has alternating row shading and a colored left-border highlight on hover.
- A "Last Active" column shows how recently each short link was clicked (e.g. "2d ago", "5h ago", "Never") with sortable header.
- Click counts now render as proportional mini bar charts in the table, showing relative engagement at a glance.

**Improved**
- The metric card numbers are now much larger and centered.
- The "Active Ratio" metric card (which was always 100% and thus not useful) has been replaced with "Average Clicks per Link" — a more meaningful engagement metric.

**Removed**
- The redundant Status column has been removed from the links table.

---

## March 8, 2026 — Clock Seconds Dimmed

**Improved**
- The seconds digits and their preceding colon on the desktop LED clock are now shown at 40% brightness. Hours and minutes are full brightness. This creates a visual hierarchy so the time is easier to read at a glance. The mobile clock (which doesn't show seconds) is unchanged.

---

## March 8, 2026 — Personal Vogue Font and Hero Logo Reorder

**Added**
- Personal Vogue font added for the home page — input field, button, footer subtitle, and admin link all render in Personal Vogue. Admin dashboard pages are unchanged.

**Improved**
- The Qork logo has been moved above the dot-matrix title and clock display on the home page for stronger brand presence at the top of the hero area.

---

## March 8, 2026 — Qork Logo Links and Footer Rebrand

**Improved**
- Every instance of the Qork logo across the site now links back to the home page.
- The footer subtitle across all pages now reads "A Service By QubeTX." — one consistent line replacing the previous per-page custom subtitles.
- The Qork logo in the hero, 404 page, and admin header retains its terracotta color in dark mode instead of inverting to white. The footer logo stays white in dark mode but shows terracotta on hover.

---

## March 8, 2026 — Qork Brand Logo Integration

**Added**
- A new Qork brand logo has been integrated across the entire site: home page hero, site header, 404 error page, admin dashboard, and footer.
- The browser tab icon (favicon), iOS home screen icon, and Progressive Web App icons have all been regenerated from the new logo.

---

## March 8, 2026 — Admin Visual Refinements

**Fixed**
- Fixed a visual bug where the "Created" date column in the admin links table was running into the click count column with no spacing, making the two values appear as one string.
- Made the Active/Inactive status badges in the links table consistently sized across desktop and mobile, matching the spacing of the "Operational" badge on the health card.
- Added proper breathing room above the "SECURE ACCESS" matrix display on the admin dashboard.

---

## March 2, 2026 — Admin Dashboard Overhaul

**Improved**
- The admin dashboard has been rebuilt from scratch: a clean stats row at the top, a database health card (latency, row counts, active/inactive ratio, timestamps), a full links management table with sortable columns, pagination, per-row delete, and a mobile card view, plus a danger zone and session management row.

**Added**
- A database health API endpoint that returns response time, row counts by table, and freshness timestamps.
- A paginated, sortable API endpoint for listing links.
- Per-link delete with cascade (clicking delete removes the link and all its click records).
- Two new admin UI components: a rich database health card and a full link management table with mobile layout.

**Fixed**
- The "SECURE ACCESS" matrix display on the admin login page was running unnecessary animation updates 60 times per second even though nothing was changing. This has been stopped, eliminating wasted CPU work on a static display element.

---

## March 2, 2026 — Background Grid Position Fix

**Fixed**
- Fixed a layout bug where the interactive dot grid background was collapsing to the height of the page content instead of filling the entire viewport.

---

## March 2, 2026 — Grid Click Ripple Performance

**Improved**
- When you click on the background dot grid, the ripple that spreads out from your click is now drawn by a single lightweight animation instead of running heavy math calculations on every frame. The page is dramatically less demanding on your device during and after a click — the amount of repeated screen-redrawing work dropped from over 120 times per click to just twice.

---

## March 1, 2026 — Footer Redesign and Performance Fixes

**Improved**
- The site footer has been completely redesigned: cleaner look without the semi-transparent background and top border, reduced height, three-column desktop layout (site name/subtitle | SHAUGHV logo centered | Admin link), and two-row mobile layout. "Powered by Supabase & Vercel" text removed.
- Added the official SHAUGHV brandmark to the footer.

**Fixed**
- Fixed a serious performance issue where the "SECURE ACCESS" matrix displays on the admin page were running animation loops continuously — even though they were showing static content. This was causing about 108,000 unnecessary DOM updates per second. Now the animations only run when there's actually something to animate.
- Fixed a similar issue with the interactive background grid, which was running a 60fps animation loop even when no ripples were active.
- Removed unnecessary graphics-acceleration hints from roughly 1,800 small matrix dots — they were forcing the browser to set up far too many separate graphics layers.
- Reduced blur intensity on the ambient background orbs, which has no visible impact but meaningfully reduces rendering cost.

---

## December 9, 2025 — Security update and admin sign-in redesign

**Security**
- Updated the underlying web framework to close a known security hole. Nothing for visitors to do — the fix is entirely on our side.

**Improved**
- Reworked the admin sign-in screen and its animated panel, and smoothed out how it draws on phones.

---

## November 29, 2025 — Interactive Grid Mouse Events Fix

**Fixed**
- Fixed a bug where hover and click effects on the background dot grid only worked on roughly the left 800 pixels of the screen. The right side of the screen was unresponsive because transparent overlay elements were capturing mouse events instead of passing them through to the grid. Now the grid is interactive across the full width of the viewport on all pages.

**Behind the scenes**
- Updated internal documentation to correct some inaccurate noise-filter parameter values that had been copied incorrectly.

---

## November 20, 2025 — Subtle Tilt Refinement

**Improved**
- The 3D tilt effect on the URL shortener card has been softened to a barely perceptible 5-degree envelope, and the glare overlay dimmed to match. The effect is present but no longer distracting when you're typing a URL.

---

## November 20, 2025 — CI Simplification

**Behind the scenes**
- The security scanning job has been removed from both CI pipelines. Lint, type checks, tests, formatting, build, and bundle size checks all remain.

---

## November 20, 2025 — CI Stabilization

**Fixed**
- Fixed code-quality and type errors in the interactive grid and matrix animation components that were causing the automated checks to fail.
- Fixed a lint warning in the card tilt component caused by an unused variable.
- Fixed code formatting in several animation components to satisfy the CI formatting check.

---

## November 2, 2025 — Speed Insights Integration

**Added**
- Added real-time performance monitoring to the site. It quietly measures real-world loading and responsiveness (things like how fast the page loads, how much it shifts around while loading, and how quickly it reacts to input) so the team can keep an eye on speed. There's no change to how the site works or feels for visitors.

---

## October 31, 2025 — Security Dependency Update

**Security**
- Updated a development tool to patch a known security vulnerability. No application code changed; all tests and the production build were confirmed passing.

---

## October 22, 2025 — Interactive Grid and Matrix Learnings Doc

**Behind the scenes**
- Added a new internal document consolidating lessons learned from building the interactive grid background and matrix display — useful for replicating these patterns in future projects. Updated the project brief to reference it.

---

## October 20, 2025 — Admin Page Centering and Login Padding

**Improved**
- The admin dashboard content is now properly centered both vertically and horizontally on the screen, while still being scrollable when content is taller than the viewport.
- Increased the padding inside the "sign in with GitHub" notice box on the admin login page for better readability and visual comfort.

---

## October 20, 2025 — Contributor Guide Update

**Behind the scenes**
- Rewrote the contributor/agent guidelines document with clearer structure, covering repo layout, tooling commands, code style, testing, release hygiene, and security expectations. Also reinforced the dual-changelog requirement.

---

## October 19, 2025 — Comprehensive Design System Documentation

**Behind the scenes**
- Transformed the design system documentation from a basic overview into a full brand guide: 2,000+ lines covering colors, typography, spacing, frosted-glass layering effects, the interactive grid, the matrix display, ready-to-use component examples, animation patterns, responsive strategies, and accessibility guidelines.

---

## October 19, 2025 — Mobile-Optimized Matrix Display

**Improved**
- The dot-matrix title on the home page now shows just "Qork" on mobile instead of "Qork.Me" — the full text was overflowing on narrow screens. Desktop still shows "Qork.Me".
- The dot-matrix clock on mobile now omits the seconds, showing only hours and minutes, which fits on narrow screens without horizontal scrolling. Desktop still shows seconds.
- Updated internal documentation to describe these mobile optimization details.

---

## October 19, 2025 — Admin Dashboard Enhancements

**Added**
- A sixth animated metric card — "System Status" — with a pulsing dot-matrix grid, completing a clean 2×3 grid layout on large screens.

**Improved**
- Increased bottom padding on the main admin content area for better breathing room above the footer.

**Removed**
- Removed the decorative "Admin Console" badge and icon from the dashboard header for a cleaner look.

---

## October 19, 2025 — Admin Pages Dot-Matrix Headers

**Added**
- The admin dashboard and admin login pages now display their headings as dot-matrix LED text ("SECURE" / "ACCESS") matching the visual style of the home page title. Missing uppercase letters were added to the matrix character set to make this possible.

**Fixed**
- Fixed a bug where the admin login button and error alerts were completely invisible due to missing animation class definitions. All fade-in delays are now properly defined.

---

## October 19, 2025 — Documentation: README Trees Refreshed

**Behind the scenes**
- Updated the directory tree listings in both the root and app-level README files with accurate output from the current codebase. Previous trees were outdated.

---

## October 19, 2025 — Favicon and PWA Icons

**Added**
- New favicon system based on a four-dot matrix pattern matching the home page aesthetic. The browser tab icon, iOS home screen icon, and Progressive Web App icons are all new. A web app manifest was added for PWA support (allows the site to be "installed" on mobile devices with its own icon and standalone display mode).

---

## October 20, 2025 00:05 — Dynamic Responsive Grid

**Added**
- The interactive background grid now dynamically calculates how many cells it needs to fill the viewport, including on ultra-wide monitors.

**Fixed**
- Fixed a bug where only the left ~800 pixels of the screen had working hover effects. The right side now responds correctly across any viewport width. The grid also updates when the browser window is resized.

**Improved**
- The feathering (fade) at the edges of the matrix displays has been upgraded from a 2-step to a 4-step gradient, making the edges blend more organically into the background.

---

## October 19, 2025 23:55 — Admin Authentication System

**Added**
- Sign-in-with-GitHub for the admin area is now fully working end to end: a login page with the interactive grid background, the missing piece that was previously blocking login entirely, and a redesigned admin dashboard matching the home page visual style.

**Fixed**
- Fixed a broken admin login — signing in with GitHub was sending people to the wrong place afterward, which meant nobody could actually log in. The step that finishes the sign-in process was missing entirely.
- Fixed two failing automated tests in the URL shortener UI.

**Improved**
- Added a hidden accessible label to the URL input field so screen readers can identify it correctly. This also allows automated tests to find the input by its label.

---

## October 19, 2025 11:00 — Staggered Page Load Animations

**Added**
- The home page now loads with a polished staggered cascade animation: the dot-matrix title sweeps in from top-left to bottom-right over about 200ms, then the clock follows, then the URL shortener card fades up, and finally the footer fades in. The total sequence takes about 1.8 seconds from page load to fully visible. All elements move up slightly as they appear for a natural entry feel.

**Improved**
- Made the footer wordmark lighter-weight for a more refined, less visually heavy footer appearance.

---

## October 19, 2025 04:30 — In-Card URL Shortener Result

**Improved**
- After shortening a URL, the result now appears inside the same card without navigating to a new page. The card transitions smoothly from the input view to a success view showing your short link, with a checkmark icon, automatic clipboard copy, a manual copy button, and a "Shorten Another URL" button to reset. Previously, success always navigated to a separate result page.

---

## October 18, 2025 23:45 — Subtle Tilt and Label Spacing

**Improved**
- The 3D cursor-following tilt on the URL shortener card has been made even more subtle (reduced by 4×) so it doesn't distract from the input experience.
- Increased the spacing between the "Enter Your URL" label and the input area for better visual breathing room.

---

## October 18, 2025 23:30 — Matrix Clock and Card Padding Fixes

**Fixed**
- Fixed a glitch where the LED matrix display would briefly render inconsistently between the server and the browser on first page load.
- Fixed the URL shortener card where the input field and button were touching the card edges on some screen sizes. Padding is now correctly applied inside each view state (input, loading, result).

**Improved**
- The live clock on the home page now shows time in 12-hour format with AM/PM (e.g. "3:42 PM") instead of 24-hour format.
- Removed a random sparkle effect from the matrix title display that was causing server/client rendering inconsistencies.

**Behind the scenes**
- Added a thorough testing checklist document for visually verifying all changes across viewports and devices.

---

## October 18, 2025 23:15 — Mobile Responsive Improvements

**Improved**
- The dot-matrix title and clock displays now use smaller cell sizes on mobile to prevent horizontal overflow on narrow screens. Desktop keeps the larger, more detailed rendering.
- The URL shortener card now uses consistent padding across all screen sizes, fixing an issue where some styling rules weren't being applied correctly in the current version of the CSS framework.
- Added horizontal spacing on mobile so the card doesn't touch the screen edges on small phones.
- Updated internal documentation with the discovered CSS-framework compatibility issue and the workaround pattern for it.

---

## October 18, 2025 21:45 — Footer Alignment Fix

**Improved**
- Fixed footer text vertical alignment so the left and right columns sit on the same baseline on desktop. Removed "Designed in San Francisco •" from the right column, leaving just "Powered by Supabase & Vercel". Unified responsive breakpoints and spacing across both columns.

---

## October 18, 2025 21:16 — Interactive Background Grid

**Added**
- The home page now has an interactive dot grid as the background — an SVG-based pattern with organic noise-driven opacity variation that gives a paper-like texture. Hovering over cells lights them up subtly with the brand color. The grid uses minimal DOM overhead and stays at 60fps. Documentation added covering implementation, customization, and performance considerations.

---

## October 18, 2025 21:01 — Documentation and Layout Guide

**Behind the scenes**
- Added a new internal layout guide documenting common styling pitfalls in the current CSS framework version and how to work around them, plus troubleshooting steps for clearing caches and verifying changes during development. Updated internal component, typography, testing, and matrix display documentation.

---

## October 18, 2025 21:45 (Earlier) — Background Redesign

**Improved**
- Redesigned the background from a canvas particle system to a viewport-filling dot-matrix display with animated wave effects and a centered digital clock in terracotta colors.

**Fixed**
- Fixed a type-compatibility issue in the shimmering text animation component.

---

## October 14, 2025 — Footer Baseline Alignment

**Fixed**
- Fixed a misalignment in the site footer where text elements ("QorkMe", the subtitle, credits, and the Admin link) weren't sitting on the same horizontal baseline on desktop.

---

## October 12, 2025 — Changelog Formatting Fix

**Behind the scenes**
- Re-ran code formatter on the changelog file so the CI formatting check passes again.

---

## October 10, 2025 — Navbar Float Offset

**Improved**
- Added a top offset to the navigation bar so it floats off the viewport edge rather than sitting flush against it, across all screen sizes.

---

## October 10, 2025 — Custom Alias Dropdown Spacing

**Fixed**
- Restored correct padding and spacing inside the custom alias dropdown on the URL shortener card so the toggle and input fields align properly.

---

## October 10, 2025 — Navbar Cleanup

**Improved**
- Simplified the navigation bar icons and theme toggle button by removing background containers, borders, rounded corners, and shadows. The navbar now looks cleaner with less visual clutter.

---

## October 10, 2025 — Navbar Icon Padding

**Improved**
- Increased the horizontal padding in the navigation bar so icons don't appear cramped against the edges.

---

## October 10, 2025 01:50 — Footer Spacing

**Improved**
- Refined footer spacing and text alignment so the brand line and metadata sit evenly across screen sizes.

---

## October 10, 2025 01:33 — README Design System Update

**Behind the scenes**
- Updated the project README files to describe the new earthy modern design system (warm parchment neutrals, terracotta accents, sage highlights).

---

## October 10, 2025 01:31 — Documentation Wording Polish

**Behind the scenes**
- Minor wording refinements in design system documentation after the punctuation cleanup pass below.

---

## October 10, 2025 01:29 — ASCII Normalization

**Behind the scenes**
- Converted all smart quotes, curly apostrophes, and fancy punctuation in the contributor guide, agent guide, and design system docs to plain ASCII equivalents for better compatibility with tools that parse markdown.

---

## October 10, 2025 01:26 — Typography Guidance Update

**Behind the scenes**
- Tuned internal typography guidance to use Inter light (300) as the default body weight, added heavy weight helpers, and refreshed typography docs across contributor and agent files.

---

## October 10, 2025 01:21 — Earthy Modern Palette Docs

**Behind the scenes**
- Updated the design system specification, contributor guide, and agent guide to reflect the shift to an earthy modern color palette and the two-font system (ZT Bros Oskon + Inter).

---

## October 10, 2025 01:06 — Contributor Guide Cleanup

**Behind the scenes**
- Streamlined formatting in the agent contributor guide and clarified workflow expectations.

---

## October 10, 2025 01:03 — Hero Badge Removed

**Improved**
- Removed the marketing badge from the homepage hero so the main content starts directly with the heading. Cleaner, less cluttered first impression.

---

## October 10, 2025 00:45 — Dual Changelog Enforcement

**Behind the scenes**
- Reinforced the rule that both the root and application changelogs must be updated together in the agent contributor guidelines.

---

## October 10, 2025 00:44 — Contributor Guidelines Refresh

**Behind the scenes**
- Refreshed the agent contributor guidelines with a clearer structure and simplified contribution workflow documentation.

---

## September 27, 2025 10:20 — Contributor Guide Clarification

**Behind the scenes**
- Clarified in the contributor guide that both changelog files must be updated with every project change.

---

## September 27, 2025 09:55 — Contributor Guide Reframing

**Behind the scenes**
- Reframed the contributor guide as a "Repository Guidelines" document covering structure, commands, and release hygiene expectations.

---

## September 27, 2025 08:40 — Header Tagline Removed

**Improved**
- The navigation tagline has been removed entirely. The QorkMe wordmark now stands alone in every header context.

---

## September 27, 2025 08:10 — Navigation Badge and Tagline Removed

**Improved**
- Removed the marketing navigation badge and the default tagline from the site header, focusing it on core links. Branded taglines can still be used on specific pages but are no longer the default.

---

## September 27, 2025 07:15 — Hero Badge Messaging Update

**Improved**
- Updated the homepage hero badge messaging to be share-ready, aligned with the new minimal navigation shell.

---

## September 27, 2025 06:40 — CI Bundle Check Optimization

**Behind the scenes**
- The CI pipeline's bundle size check now reuses the build that was already produced earlier in the pipeline instead of triggering a second redundant build.

---

## September 27, 2025 05:30 — Marketing Navbar Padding

**Improved**
- Widened the internal padding on the marketing navbar frame so it stretches further on both desktop and mobile while staying responsive.

---

## September 27, 2025 04:45 — Navbar Badge and CTA Simplification

**Improved**
- Softened the marketing navbar badge to remove the pill shape, and pulled back the call-to-action button to keep the header minimal with comfortable spacing.

---

## September 27, 2025 03:19 — Navbar Rebuilt

**Improved**
- Rebuilt the site navigation with a standard glassmorphism top bar (frosted glass effect), unified desktop and mobile layouts, and simplified status and action treatments.

---

## September 25, 2025 — Navigation Shell Refresh

**Improved**
- Rebuilt the navigation shell with layered gradients, compact nav links, and refreshed status badge styling, replacing the previous pill bar.

---

## September 22, 2025 03:10 — Workspace Nav Styling Note

**Behind the scenes**
- Internal note about workspace navigation styling mirroring the refreshed application header.

---

## September 22, 2025 02:15 — Supabase Tasks Note

**Behind the scenes**
- Added an internal to-do document at the repo root capturing pending Supabase deployment tasks.

---

## September 22, 2025 02:05 — Admin Console Added

**Added**
- A protected admin console at the `/admin` page that you reach by signing in with GitHub. It shows overall link and click totals, database health information, and a protected "wipe all data" action. Linked from the site footer.

---

## September 22, 2025 01:05 — Analytics UI Removed from Public Pages

**Removed**
- Analytics displays, login affordances, and documentation links have been removed from all user-facing result pages. Result pages now show only the short link card and a friendly follow-up prompt — nothing else.

**Improved**
- Homepage messaging updated to emphasize a simple, analytics-free experience for the end user. Metadata and navigation copy aligned with the simplified experience.

---

## September 22, 2025 — Project Foundation

**Added**
- Established the workspace-level changelog with the initial documentation updates.
- Captured a detailed project brief (structure, setup guidance, file tree) in an internal reference document.
- Authored project-specific contributor guidelines covering working agreements, quality gates, and key references.
- Expanded the automated test suite to cover short-code generation, the URL shortening API, database client setup, and the URL shortener UI component.
- Added an automatic code formatter and tidied all new test files so the formatting check stays green in the automated pipeline.
- Fixed a security advisory in a build dependency and cleared all moderate+ vulnerabilities; re-ran the full quality gate (lint, type check, tests, build) to confirm.
