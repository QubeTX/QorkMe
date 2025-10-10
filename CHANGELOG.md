# Changelog

## 2025-10-10 12:15
- Shifted the design system to an earthy modern palette, limited typography to ZT Bros Oskon and Inter, and refreshed `AGENTS.md`, `CLAUDE.md`, and `qorkme/docs/DESIGN_SYSTEM.md` to match.

## 2025-10-10 11:30
- Removed the homepage hero badge so the main content area starts directly with the heading for cleaner visual flow.

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
