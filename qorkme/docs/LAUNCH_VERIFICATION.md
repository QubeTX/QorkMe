# Dither + Hologram launch verification

## Local checks — September 21, 2026

- Full Vitest suite: 39 files, 222 tests passed, covering shortcode rules, API errors, admin identity, request races, redirect freshness, atomic purge routing, clipboard rejection, cancellation, and keyboard tabs.
- Eight simultaneous requests for one destination returned the same short link; exactly one response reported a new link.
- The local form created `launch-check-20260921`; explicit Copy matched its full HTTPS address. Duplicate aliases and invalid URLs produced inline errors. Two redirects returned the destination with `no-store`.
- A temporary, transaction-scoped table of 250,000 synthetic URLs exercised equivalent indexes: code lookup 0.689ms, newest-25 pagination 1.206ms, and selective substring search 1.337ms execution time. This is a query-plan probe, not a production throughput or load qualification. Synthetic rows were not inserted into production URL tables.
- Real Chrome WebGPU rendering verified on this machine, including pointer lighting and the linked-ring engraving centered in the 404 zero. Desktop and 390px layouts inspected for main form, CLI, and missing links; motion toggle and reduced motion checked.
- CLI release assets checked against GitHub v1.1.1. Copying preserves the full Windows PowerShell wrapper. Arrow-key tab selection and phone command wrapping verified.
- Database migrations applied: indexed search/paging, concurrent URL deduplication, aggregate simplification, private admin functions, and atomic purge. Anonymous execution of private admin functions is denied.
- Local GitHub authentication succeeded. The local environment has no service-role key, so populated admin operations are reserved for the authenticated production smoke test; errors remain visible and retryable.

- A blocked hologram module produced the real `fallback` state while the form still shortened a URL successfully. Network blocking was removed after the check.

## Release checks

Local optimized production build passed on Next.js 15.5.25. Lint, TypeScript, formatting, and npm audit passed (zero reported vulnerabilities). The optimized bundle renders both effects live in Chrome. Main layout was compared at the same 1534×903 viewport as the approved prototype.

## Production checks — September 21, 2026

- [PR #26](https://github.com/QubeTX/QorkMe/pull/26) merged. Application commit `12a170a3ca35eb81e0cc4d1470b77837a2fadbfc` passed the Node 20 and 22 checks and [production deployment workflow](https://github.com/QubeTX/QorkMe/actions/runs/35573396990).
- Vercel deployment `dpl_8vpnWcRFQSDhaWSrNiW8dray5Ggo` is READY and assigned to `qork.me`; its commit matches the application commit above.
- Created `launch-prod-20260921` through the live form. Alias availability, `qork.me/` prefix, loading, result reveal, exact clipboard contents, and return to the form worked. Two redirects returned the correct destination with `no-store`; both the lifetime counter and detailed analytics recorded two visits. Duplicate aliases returned 409 and invalid URLs returned 400. The GET API returned the same flat envelope and recorded CLI source correctly.
- GitHub sign-in worked with the existing browser session. The session survived deployment and subsequent reloads. Admin search, alias and status filters, sorting, two-page pagination, traffic analytics, and database diagnostics loaded real data. Anonymous admin requests returned 401; anonymous execution of private database functions remains denied.
- Chrome rendered both effects live on the main, admin, CLI, and missing-link pages. Verified the centered linked-ring engraving, pointer lighting, 404 ripple feedback, motion pause, and reduced-motion setting. Main, admin, CLI, 404, and saved-link views passed 390px layout checks without horizontal overflow. The saved-link page wraps a 50-character alias, has one H1, and generates its QR code successfully.
- The CLI page reports v1.1.1, copies the complete Windows PowerShell command, supports keyboard platform switching, and presents working install assets. The main page, install page, favicon, and installer scripts returned 200. No new application console errors appeared during the production smoke.
- An expired disposable link immediately redirected to the missing-link page. The missing-link page returns HTTP 404.
- With the user's explicit authorization, called the atomic `admin_purge_links()` database function: **26 URLs and 142 detailed click events removed**. Readback confirmed **0 URLs, 0 click events, and 75 reserved words preserved**. Refreshed admin showed zero totals and `NO LINKS YET`. The deleted demo immediately redirected to `/link-not-found`, and its alias became available again. The browser's destructive confirmation dialog was not exercised; the purge function and authenticated route have separate automated coverage.

Production screenshots are retained in the local `qorkme-launch` artifact folder. This verification update changes documentation only; the deployed application commit remains the one identified above.

![Main page](screenshots/dither-hologram-home.png)

![404 with pointer lighting](screenshots/dither-hologram-404.png)

## Practical limits

GPU effects are decoration. A readable HTML gradient and static dotted field remain available when rendering fails. Device/browser coverage is Chrome on this Windows machine plus responsive emulation; no claim is made about every GPU or physical mobile device. Database performance depends on traffic, plan capacity, and query selectivity. Indexed probes and request timeouts do not establish unlimited capacity.
