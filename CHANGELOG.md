# Changelog

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
