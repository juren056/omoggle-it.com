# Scoped rollback

Do not reset or erase the repository. Revert only the relevant reviewed files from version control or disable with configuration.

- Ads: set `ADSTERRA_ENABLED=false`; this removes requests and containers without a deploy after the environment rebuild/restart. Revert `AdSlot*`, `ad-config.js` and placements only if removing the infrastructure.
- Analytics/consent: set `ANALYTICS_ENABLED=false`. Revert `ThirdPartyScripts.js` and the layout mount if removing the preference UI.
- Local engine: revert the five tool pages/components plus `local-face-engine.js`, `local-face-rules.mjs` and the Worker. Remove MediaPipe dependency/assets only after no imports remain. Do not silently restore guest paid API calls.
- Legacy cloud: set `CLOUD_ANALYSIS_ENABLED=false` for immediate containment. Reverting the API authorization changes would re-expose paid calls and requires a separate security review.
- Homepage/navigation: revert `app/page.js`, `Navbar.js` and `Footer.js`; preserve old URLs.
- Content/SEO: revert individual HTML/page files. Keep sitemap entries synchronized with whichever routes remain. No redirect or deletion was introduced in this work.
- New subscriptions: `NEW_SUBSCRIPTIONS_ENABLED=false` is the safe state. Existing Stripe webhook, subscription rows and billing portal must not be removed during rollback.
