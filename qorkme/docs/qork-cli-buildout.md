# qork CLI build-out — notes & learnings

A retrospective on building **`qork`**, the cross-platform Rust URL-shortener CLI, and wiring it
into the QorkMe site + API. Written for the next person (or agent) who touches this. Dated
2026-06-14.

## What shipped

- **`qork` CLI** — a Rust crate in its **own repo** [`QubeTX/qork`](https://github.com/QubeTX/qork),
  published to **GitHub Releases** (all platforms) and **crates.io**. `qork <url>` prints a short
  link; `--alias`, `--json`, `qork update`, `qork uninstall`. v1.0.0 → v1.0.1 (installers).
- **Site (`qork.me`)** — `/install` page, home-hero + footer links, branded `public/install.sh` /
  `install.ps1` wrappers, `public/llms.txt` agent guide.
- **API** — `POST /api/shorten` + a new `GET /api/shorten?url=` convenience mode, both returning a
  fully-qualified `href`.
- **Source attribution** — every link records `source` ∈ {`web`,`cli`,`api`}, shown in the admin
  "New links by source" card.
- **Installers** — Windows Global/Corporate × MSI/EXE, macOS `.pkg` (×2 arch), Linux `.deb`/`.rpm`
  (×2 arch), plus the cargo-dist shell/PowerShell one-liners.

## Where things live

| Concern                               | Location                                                                                                                                                                 |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| CLI crate                             | `QubeTX/qork` (separate repo, local clone `C:\Users\hey\git\qork`)                                                                                                       |
| Shorten API                           | `qorkme/app/api/shorten/route.ts` (`createShortLink`, `resolveSource`)                                                                                                   |
| Source column / RPC                   | `urls.source`; `get_or_create_short_url(p_source)`; `admin_analytics().source_breakdown` — migration `supabase/migrations/20260614110001_add_url_source_attribution.sql` |
| Install page                          | `qorkme/app/install/{page.tsx,install.module.css,LatestVersion.tsx}`                                                                                                     |
| Branded install scripts / agent guide | `qorkme/public/{install.sh,install.ps1,llms.txt}`                                                                                                                        |
| Hero/footer links                     | `components/sections/Hero.tsx`, `components/SiteFooter.tsx`                                                                                                              |

## Cross-component contracts (keep these in lockstep)

- **Identity:** repo `QubeTX/qork`, binary/crate `qork`, crate version ↔ git tag `vX.Y.Z`.
- **API envelope:** `{ shortCode, shortUrl ("qork.me/x"), href ("https://qork.me/x"), longUrl, isNew }`.
  The CLI deserializes these; `href` is the display URL (fallback: `https://` + `shortUrl`).
- **`source` literals:** exactly `web | cli | api` across CLI body, `resolveSource()`, the DB column,
  the RPC, and the admin UI.
- **Install URLs:** `qork.me/install.sh|ps1` → `github.com/QubeTX/qork/releases/latest/download/qork-installer.{sh,ps1}`.
- **Release asset names:** `qork-<target>.tar.xz` (unix archives), `qork-x86_64-pc-windows-msvc.{msi,zip}`,
  `qork-x86_64-pc-windows-msvc-corporate.msi`, `qork-x86_64-pc-windows-msvc[-corporate]-setup.exe`,
  `qork-<target>.pkg`, `qork-<target>.deb|.rpm`. Referenced verbatim by the install page + `update.rs`.

## Gotchas & learnings (the expensive ones)

1. **cargo-dist `allow-dirty = ["msi"]` is a trap if you don't supply a `wix/main.wxs`.** It was copied
   from `tr300` (which hand-maintains a custom WiX file). With it set but no WXS present, the first
   v1.0.0 Release failed: _"WiX … There are no WXS files to create an installer."_ Two valid fixes:
   (a) drop `allow-dirty` and let `dist generate` write the default `wix/main.wxs`; or (b) keep
   `allow-dirty` AND commit a hand-customized `wix/main.wxs`. We ended at (b) once we added the
   `InstallSourceMarker` component — but the initial release needed (a) first.
2. **A GitHub secret added "to the repo" may be on the wrong repo.** `crates-publish` failed with
   `CARGO_REGISTRY_TOKEN is not configured` because the token wasn't on `QubeTX/qork`. Fix:
   `gh secret set CARGO_REGISTRY_TOKEN --repo QubeTX/qork`. Always confirm with `gh secret list --repo …`.
3. **Re-tagging a failed release is clean if nothing shipped under it.** v1.0.0's Release + publish both
   failed, so nothing was on crates.io or the Releases page → `git push origin --delete v1.0.0`,
   fix, re-tag, re-push. (Once a version is actually published to crates.io it's immutable — bump instead.)
4. **Static `public/` files and defined app routes beat the `[shortCode]` redirect.** `/install.sh`,
   `/llms.txt`, and `/install` all serve correctly (verified live: HTTP 200, not the 404 short-code
   handler). No route guard needed. `install`/`cli`/`download`/`llms` were reserved anyway.
5. **CORS is irrelevant to the CLI.** It's a non-browser `ureq` client, so no `vercel.json`/CORS change
   was needed for the CLI to POST `/api/shorten`. (CORS only gates browser fetch.)
6. **Adding a param to a Postgres function = DROP + CREATE**, not `CREATE OR REPLACE` (which can't change
   the signature). The new `p_source TEXT DEFAULT 'web'` is defaulted, so the _currently-deployed_ API
   (passing 4 args) kept working through the migration window — decoupling the DB change from the deploy.
7. **The CLI was shippable before the site deploy** because `href` + `source` are _additive_: the CLI
   falls back to `https://` + `shortUrl` when `href` is absent, and the old API ignored `source`. This
   let us release + verify the CLI against production before the API redeploy.
8. **`qork update` install-origin dispatch (Windows).** The four installers write
   `HKCU\Software\Qork\InstallSource` (`msi-global` / `msi-corporate` / `exe-global` / `exe-corporate`);
   `update.rs` reads it, downloads the matching installer, SHA256-verifies it against the `.sha256`
   sidecar, runs it silently, and re-checks `--version`. cargo / shell-installer installs fall through
   to the cargo + `curl|sh`/`irm|iex` chain. macOS/Linux always use that chain (no native-installer
   dispatch — accepted, matches the sibling CLIs).
9. **qork is the single-binary sibling.** tr300/wb300 add a shell alias, auto-run-on-new-shell, and a
   `migrate-cleanup` command — all deliberately **stripped** from qork's installers. qork installs one
   binary + PATH + the marker. Don't reintroduce that machinery.
10. **Unsigned macOS `.pkg`** (no Apple Developer ID): functional but Gatekeeper needs right-click → Open
    the first time. The `curl | sh` one-liner is the recommended macOS path; the `.pkg` is a convenience.
11. **cargo-dist tarballs are flat** (binary at the archive root). The unix-installers workflow uses
    `find -name qork` so it's robust either way.

## Distribution model — four workflows

| Workflow                   | Trigger                     | Builds                                                                                         |
| -------------------------- | --------------------------- | ---------------------------------------------------------------------------------------------- |
| `ci.yml`                   | push / PR                   | fmt, clippy `-D warnings`, test (Linux/macOS/Windows), release build, audit, `dist plan`       |
| `crates-publish.yml`       | after CI succeeds on `main` | `cargo publish` (skips if the version is already on crates.io)                                 |
| `release.yml` (cargo-dist) | tag `v*`                    | per-target archives, shell/PowerShell installers, **Global MSI**, GitHub Release               |
| `windows-installers.yml`   | tag `v*`                    | **Corporate MSI** + **Global/Corporate Inno EXEs** → uploads to the release                    |
| `unix-installers.yml`      | tag `v*`                    | macOS **`.pkg`** (×2) + Linux **`.deb`/`.rpm`** (×2 arch, via `nfpm`) → uploads to the release |

`windows-installers.yml` and `unix-installers.yml` poll until cargo-dist has created the Release, then
`gh release upload --clobber` (idempotent, no race).

## Cutting a new release

1. Bump `version` in `qork/Cargo.toml`; commit; `git push origin main` (CI → crates-publish).
2. `git tag vX.Y.Z && git push origin vX.Y.Z` → all three tag-triggered workflows build + upload.
3. Verify: `gh release view vX.Y.Z` lists every artifact; `curl -sI https://qork.me/install.sh` is 200.

## Verification quick-reference

```bash
# CLI (local)
cargo test && cargo clippy --all-targets -- -D warnings
qork https://example.com            # → https://qork.me/<code>

# API + routing (prod)
curl -sI https://qork.me/install.sh                                   # 200
curl -s "https://qork.me/api/shorten?url=https%3A%2F%2Fexample.com"   # JSON with href

# Source attribution (admin / SQL)
SELECT source, count(*) FROM urls GROUP BY 1;   # web | cli | api
```
