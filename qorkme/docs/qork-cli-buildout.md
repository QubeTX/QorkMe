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

## v1.1.0 — follow-up learnings

v1.1.0 (still GitHub Releases + crates.io) added three things: a `qork help` command, a
pre-shorten safety check, and a full origin-aware `qork uninstall`. The notes below are the
"why it's built this way" for the next person. Source of truth: `qork/src/{cli.rs,command.rs,
check.rs,update.rs}` + `qork/nfpm.yaml`.

1. **The `qork help` bug → whole-word command resolution.** Before v1.1.0, `qork help` was treated
   as a URL: the API/CLI prepend `https://` to a schemeless arg, so `help` became `https://help`
   and got _shortened_ (you'd get a short link for a nonexistent site). Fix: command resolution
   moved out of `cli.rs` into `command.rs::Cli::resolve()`, which matches the bare positional
   `help` / `update` / `uninstall` **as whole words, case-insensitively** (`eq_ignore_ascii_case`,
   not a substring/prefix match) before falling through to "shorten this URL". The flags
   (`--help` / `--update` / `--uninstall`) and the bare words are equivalent. `command.rs` is kept
   separate from `cli.rs` specifically because `build.rs` `include!`s `cli.rs` to render the man
   page and only needs the arg _shape_, not the runtime dispatch.

2. **The pre-shorten check (`check.rs`) is a typo/dead-link guard, NOT an uptime gate.** Two layers,
   both skipped by `--no-check`:
   - **Offline structural** (instant, no network): the input must parse as an http/https URL whose
     host has a dot, is an IP, or is an IPv6 literal. A bare word (`asdf`, or a mistyped command)
     normalizes to `https://asdf` → no dot → rejected here with zero network calls. This is also the
     belt-and-braces backstop that keeps a mistyped command from being shortened.
   - **Online ping** (one HEAD request, follows up to 8 redirects, 10s timeout, browser-ish UA): it
     blocks **only** on a live `404`/`410` (`Verdict::Dead`) or a DNS-resolution failure
     (`Verdict::NoSuchHost` — "never valid from the start"). _Everything else proceeds_: 401/403
     (auth walls), 405/429, 5xx, timeouts, connection-refused, TLS quirks all still shorten. The
     ping uses a `Mozilla/5.0 (compatible; qork/<ver>; +https://qork.me)` UA because some servers
     404/403 unknown agents — but the real shorten POST still identifies as `qork/<ver>` so source
     attribution (`resolveSource()` ⇒ `cli`) is unaffected.

3. **Full origin-aware uninstall (`update.rs::uninstall`).** qork installs ONLY a binary + PATH +
   the Windows marker (no shell alias, no auto-run, no migrate-cleanup — those tr300/wb300
   behaviors are deliberately stripped), so a complete removal is correspondingly lean. Branches:
   - **Windows MSI** (Global or Corporate): scan the three Uninstall registry roots (HKLM 64-bit,
     HKLM WOW6432Node, HKCU) for qork's exact DisplayName (`qork` or `qork (Corporate Edition)` —
     exact match, never substring, so `qorkscrew` can't be hit), then run its `UninstallString`
     **rewritten from `/I` to `/X`** (registry often records repair mode) with `/passive
/norestart`. Global prompts UAC; Corporate is silent.
   - **Windows Inno EXE**: run the recorded `QuietUninstallString`/`UninstallString` with `/SILENT
/SUPPRESSMSGBOXES /NORESTART`.
   - **Windows cargo / shell / PowerShell / unknown**: a running `.exe` **can't delete itself** on
     Windows, so spawn a **detached** `cmd /c "(ping 127.0.0.1 -n 3 >nul & del /f /q "<exe>")"`
     helper (DETACHED_PROCESS | CREATE_NEW_PROCESS_GROUP) that waits ~2s for this process to exit
     and then deletes the binary. `ping … -n 3` is the portable sleep (no `timeout`, which breaks
     when stdin is redirected).
   - **macOS / Linux**: a running Unix binary _can_ be unlinked, so `std::fs::remove_file` the exe
     directly.
   - Every path also deletes the cargo-dist receipt and the `HKCU\Software\Qork` marker (idempotent)
     and notes (doesn't edit) the PATH line the installer added. `--yes`/`-y` skips the prompt and
     is **required** when stdin isn't a TTY (so scripts are explicit) — otherwise qork refuses.
   - The downloaded-installer paths SHA256-verify against the `.sha256` sidecar before running, the
     same MITM/corruption guard `qork update` uses.

4. **The nfpm `${QORK_BIN}` glob bug.** `nfpm.yaml`'s `contents.src: ${QORK_BIN}` failed at package
   time with `glob failed: ${QORK_BIN}: no matching files` — nfpm's own env-var expansion does NOT
   apply to the `contents.src` glob. Fix in `unix-installers.yml`: `sed`-render a concrete per-arch
   config (`nfpm-amd64.yaml` / `nfpm-arm64.yaml`) substituting `${QORK_ARCH}` / `${QORK_VERSION}` /
   `${QORK_BIN}` ourselves (the `|` sed delimiter keeps the binary path's slashes literal), then
   `nfpm package --config` that. Dependency-free and unambiguous.

5. **Man pages in deb/rpm/pkg.** `build.rs` renders `man/qork.1` from the clap definition; the
   `.deb`/`.rpm` (nfpm) install it to `/usr/share/man/man1/qork.1` and the macOS `.pkg`
   (unix-installers.yml) to `/usr/local/share/man/man1/qork.1`, so `man qork` works on those
   installs. (The one-liner/cargo/Windows installs don't lay down a man page — `qork help` is the
   portable equivalent.) Note the install locations differ per channel: `.pkg` → `/usr/local/bin`,
   `.deb`/`.rpm` → `/usr/bin`, Windows Global → `C:\Program Files\qork\bin`, Windows Corporate →
   `%LocalAppData%\Programs\qork\bin`.

6. **`/install` page slot-roll `LedeCycle`** (`app/install/LedeCycle.tsx`). The install hero's
   `$ …` lede is a client island that cycles a tagline + a handful of real example commands
   (`qork https://… --alias launch`, `qork --json …`, `qork update`, …) on a 3.7s interval, rolling
   each transition through the kit `SlotRoll` (`@/lib/motion/SlotRoll`). On-brand with the home hero
   rather than a static heading. Accessibility: the visual rolling line is `aria-hidden` while a
   stable `sr-only` "Shorten URLs from your terminal." is exposed to assistive tech; under
   `prefers-reduced-motion` the interval never starts (the line holds the first phrase).
