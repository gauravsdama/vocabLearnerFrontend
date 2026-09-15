# Release readiness

Last reviewed: 2026-09-15

Status: **not ready to publish**

This is VocabCat's web client and public product site for learners who want short daily vocabulary practice. This nested checkout is canonical and tracks `gauravsdama/vocabLearnerFrontend`. The external clone now has a recoverable backup branch and a sync branch whose working content matches this checkout apart from ignored `.DS_Store` files.

`LANDING_PAGE_COPY.pair.md` is the human-owned landing-page copy source. Preserve its stable keys and approved wording. The broader UI inventory in `docs/product/UI_COPY.md` is still incomplete and must be reviewed before additional visible copy changes.

## Verified

- `npm run build` — passed.
- `npm run test:unit` — 12 passed.
- `npm run test:component` — 11 passed.
- `npm run test:security` — 6 passed, including the deployment-header contract.
- `npm run test:e2e` — 13 browser checks passed for the marketing page, legal routes, narrow layouts, reduced motion, automated accessibility, unauthenticated route guard, email verification failures, and password-reset failure state.
- `npm audit` and `npm audit --omit=dev` — zero findings after the React Router 7.18.4, Vite 7.3.6, and Vitest 4.1.11 updates.
- Eleven optimized WebP mascots are 139–200 KB each; the original PNG files remain as source artwork.
- The web build now bundles Sora locally instead of requesting Google Fonts.
- Email and Google new-account attempts now send explicit age, Terms, and Privacy acceptance for approved version `2026-09-15`. Existing sign-in does not send acceptance fields.
- Current marketing screenshot: `docs/screenshots/vocabcat-web-current.png`.
- A direct local browser capture reported three connection-refused console errors: one request to `http://localhost:8000/openapi.json` and two silent-refresh requests to `http://localhost:8000/api/v1/auth/refresh`. The backend was not running for that capture; the public page still rendered.
- Production `/`, `/privacy`, `/terms`, and `/accessibility` returned HTTP 200 during the audit. These probes did not validate rendered content or live auth flows.

## Blocking before publication

- Approve a first-party license, add third-party notices/provenance, and reconcile the divergent checkout.
- Deploy the current `vercel.json`, then verify CSP, frame restrictions, MIME sniffing protection, referrer policy, permissions policy, and HSTS on the live responses. The current deployment only exposes HSTS from that set.
- Add a deterministic completeness check from the human-owned copy source to implemented runtime strings. Finish stable IDs and approval states for all routes, errors, empty states, and accessibility labels.
- The approved policy version is `2026-09-15`; the Terms and Privacy pages display September 15, 2026.
- Complete live QA for email, Google, Apple handoff, signed writes, logout, deletion, legal acceptance, responsive layouts, keyboard navigation, screen readers, and reduced motion.
- Keep this release free-only; paid access and billing are out of scope.

Retain the release commit, lockfile hash, dependency audit, clean build/test output, production response headers, route screenshots, accessibility results, and provider-flow evidence.
