# SEO, local tools and Adsterra rebuild ledger

Updated: 2026-09-14

| Module | Status | Evidence / remaining dependency |
|---|---|---|
| Baseline route inventory | Complete | `routes-before.json`, captured from the pre-change production build on localhost:3127 (97 sitemap URLs) |
| Existing search URL preservation | Complete | No content URL deletion or migration; two previously established canonical aliases remain |
| Homepage and navigation | Complete | Free tools lead; member account replaces new-user subscription CTA |
| Local MediaPipe engine | Complete in code | Pinned package, self-hosted model/WASM, module Worker, deterministic rule tests |
| Omoggle Practice | Complete in code | User-triggered camera, one-frame check, stop/cancel, photo alternative, quiz retained |
| PSL, Mog and face-shape tools | Complete in code | Shared local engine; distinct outputs and limitations |
| Legacy cloud cost control | Complete | Active Pro + auth required, quota retained, 30s timeout, retry removed, kill switch added |
| Existing member protection | Complete in code | `/account`, subscription status and Stripe portal retained; webhooks untouched |
| New subscription acquisition | Closed by default | `NEW_SUBSCRIPTIONS_ENABLED=false` |
| Ad network migration | Complete in code | All 10 Adsterra units mapped: Native, Popunder, Social Bar, Smartlink and six responsive banners |
| Real ad activation | Ready for deploy | All 10 GET CODE values configured; authorized `ads.txt` line is still a separate dashboard dependency |
| Optional-services choice | Complete | No popup; tool, account, API, legal and commercial-policy routes exclude ad scripts |
| Privacy copy | Complete | Reflects local default and legacy paid cloud exception |
| Troubleshooting and About | Complete | New crawlable pages with honest unknown status |
| Analytics events | Complete in code | Allowlisted event names and non-sensitive parameters only |
| Net revenue workflow | Complete | `scripts/revenue-report.mjs`; real exports still required |
| GSC/GA4/ad revenue analysis | Not available | No export supplied; no ranking, cannibalization or revenue claims made |
| Browser/runtime verification | Complete for Edge simulation | Real model success + multiple-face rejection; Firefox/WebKit and physical phones remain external gaps |
| Production deploy / DNS | Out of scope | Must be performed by owner after review |
