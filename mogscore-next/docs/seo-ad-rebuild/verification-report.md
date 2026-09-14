# Verification report

Updated: 2026-09-14. This file is finalized after the local production build and route crawl.

| Check | Result | Evidence |
|---|---|---|
| Baseline route inventory | PASS | 97 sitemap routes captured from pre-change local production build |
| Local rule unit tests | PASS | `npm run test:local-rules`: 3 passed, 0 failed; deterministic, shape output and invalid-landmark failure |
| Static privacy/ad/assets checks | PASS | `npm run test:rebuild-static`: 152 text files scanned; real model/WASM assets present; no AdSense residue |
| Existing link checks | PASS | `npm run test:html-links` |
| Existing first-phase regression | PASS | `npm run test:first-phase` |
| Related lint | PASS | Targeted ESLint over all changed JS/MJS files: 0 errors/warnings |
| Repository-wide lint | FAIL (pre-existing debt) | 78 errors and 8 warnings remain, mainly legacy raw internal anchors and hook warnings; no ignore rule was added for authored code. Vendored MediaPipe runtime is correctly excluded. |
| Production build/type check | PASS | `npm run verify:rebuild`; Next 16.3.5 compiled, type-checked and prerendered 269 pages |
| HTTP and SEO acceptance | PASS | 18 public pages anonymous 200; 100/100 sitemap URLs return 200; one canonical each; canonical-host redirect checks pass |
| Post-change production URL crawl | PASS | `routes-after.json`: 100 sitemap routes; 97 baseline routes retained plus 3 public pages |
| Chromium runtime/model inference | PASS | Microsoft Edge Chromium headless: real generated adult fixture produced score UI and 3 diagnostics; generated two-adult fixture was rejected; no GPTSAPI/ad/GA request observed on tool page |
| Layout | PASS (browser simulation) | 390, 753 and 1425 CSS-pixel viewports had equal client/scroll width and no overflowing element; screenshots retained |
| Share-card path | PASS | Photo-free card action completed without page error in Edge; original face is not drawn by implementation |
| Production dependency audit | PASS | `npm audit --omit=dev`: 0 vulnerabilities after targeted Next 16.3.5 and three transitive security overrides |
| Firefox/WebKit | BLOCKED | No installed project runners confirmed yet |
| Real iPhone/Android | BLOCKED | No physical devices in this local environment |
| Lighthouse/CWV trace | BLOCKED | Required Chrome DevTools MCP from the web-performance workflow is unavailable; no score is fabricated |
| Real Adsterra serving | BLOCKED | Placement and authorized ads.txt data not supplied; switch remains off |
| Paid cloud API call | NOT APPLICABLE | Deliberately not invoked for local acceptance testing |

Performance targets (LCP ≤2.5s, INP ≤200ms, CLS ≤0.1) remain targets until production field data exists. Model and WASM files do not load on article routes by design.

The test fixtures were produced by built-in ImageGen as fictional adults solely for acceptance testing; see `fixtures/README.md`. No real user photo or paid vision API was used.
