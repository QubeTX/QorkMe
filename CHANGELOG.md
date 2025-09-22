# Changelog

## 2025-09-22
- Reviewed `~/.codex/AGENTS.md`, project README, and CI workflow to collect current QorkMe context.
- Captured a detailed workspace brief in `CODEX_PROJECT.md`, including setup guidance and file tree.
- Authored a project-specific `AGENTS.md` describing working agreements, quality gates, and key references.
- Established this workspace-level changelog with today's documentation updates.
- Expanded the Vitest-based testing suite to cover shortcode logic, `/api/shorten` handlers, Supabase client factories, and the UrlShortener UI while updating documentation and CI to reflect the new workflow.
- Added Prettier as a dev dependency and normalized the new test utilities to keep `npm run format:check` passing locally and in CI.
- Locked `esbuild` to a patched release via npm overrides, cleared `npm audit --audit-level=moderate`, and reran the quality gate (lint, type-check, vitest, build).
