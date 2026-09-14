# Implementation report

## Delivered

The site now leads with free local utilities rather than new subscriptions. `/tools`, `/omoggle-practice-test`, `/psl-test` and `/mog-score` use a shared MediaPipe Worker; `/face-shape-detector` and `/omoggle-troubleshooting` were added. The quiz remains auxiliary. The homepage now contains tool entry points, an explicitly static example, FAQs, guides and truthful update dates. `/about` documents independence and funding.

The free path no longer calls `/api/analyze`. The legacy endpoint remains for active authenticated Pro members only, retains the Supabase quota/concurrency reservation and 30-second timeout, removes the automatic paid retry, and adds `CLOUD_ANALYSIS_ENABLED`. Existing Stripe portal/webhook and entitlement code remain. New checkout is closed by default with `NEW_SUBSCRIPTIONS_ENABLED`.

Legacy global/repeated AdSense and analytics injection was removed. A centralized Adsterra-only Native Banner/display path now requires production mode, valid configuration, an allowed page type, a non-sensitive route, consent and viewport proximity. It is not activated because real placement data was not supplied. The unverified Google `ads.txt` line was deleted.

The dependency audit identified critical advisories in Next 16.2.6. Next and its ESLint config were minimally upgraded to 16.3.5; `js-cookie`, `undici` and `baseline-browser-mapping` were pinned through npm overrides to compatible fixed versions. The final production-only npm audit reports zero known vulnerabilities.

Privacy text now distinguishes self-hosted model downloads, local image processing and deliberate legacy cloud use. High-priority unverifiable Omoggle weights, model/latency assertions, demographic claims and fixed score-improvement promises were removed or qualified. No large-scale URL, title, language or canonical migration was performed.

## URL handling

Added: `/face-shape-detector`, `/omoggle-troubleshooting`, `/about`, private `/account`.

Updated in place: `/`, `/tools`, `/omoggle-practice-test`, `/psl-test`, `/mog-score`, `/pricing`, `/privacy-policy`, `/what-is-omoggle` and selected factual guides.

Preserved: all prior sitemap content and locale URLs. The existing two canonical aliases remain. Deleted/redirected content URLs: none. Deleted non-page artifact: obsolete Google `public/ads.txt` line/file.

## External activation not claimed

No deploy, production database change, paid model call, Adsterra impression, revenue test, GSC analysis or real-device test was performed. See `manual-actions.md` and `verification-report.md`.
