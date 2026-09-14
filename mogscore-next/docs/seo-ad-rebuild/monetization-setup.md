# Adsterra monetization setup

## Current state

All ten active Adsterra units shown for domain 6052480 are configured and enabled by default in production. AdSense scripts and the Google `ads.txt` seller line were removed per the owner’s instruction. Every URL, container ID and banner key was copied from the supplied GET CODE output; none was inferred from a numeric unit ID.

| Adsterra unit | Dashboard ID | Runtime placement |
|---|---:|---|
| NativeBanner_1 | 31240649 | Native block inside eligible page slots |
| Popunder_1 | 31240650 | Public monetized routes only |
| SocialBar_1 | 31240651 | Public monetized routes only |
| Smartlink_1 | 31240652 | Explicit labeled sponsored link inside eligible page slots |
| 728x90_1 | 31240653 | Desktop home/content |
| 468x60_1 | 31240654 | Tablet home/content/troubleshooting |
| 160x300_1 | 31240655 | Desktop home/troubleshooting |
| 320x50_1 | 31240656 | Mobile home/content/troubleshooting |
| 300x250_1 | 31240657 | Mobile/tablet home/content and desktop content/troubleshooting |
| 160x600_1 | 31240658 | Desktop content |

## Vercel environment values

Set these in the Production environment only:

The verified public values are embedded as defaults, so a production deployment works without duplicating them in Vercel. The matching variables in `.env.example` remain available as per-unit overrides:

1. Native Banner: script URL and container ID.
2. Popunder and Social Bar: script URL for each unit.
3. Smartlink: the exact destination URL.
4. Each of the six banners: `atOptions.key` and the matching invoke script URL.
5. Keep `AD_PAGE_TYPES=home,content,troubleshooting`; remove a value to disable that page type.
6. `ADSTERRA_ENABLED` defaults to enabled in production. Set it to `false` for an immediate kill switch and rebuild/redeploy.

These placement identifiers are normally public in browser markup; account credentials and API keys must never be placed in `NEXT_PUBLIC_*`. Preview/development builds never request ads even if configuration is accidentally present. `ADSTERRA_ENABLED=false` is the global kill switch.

The page slots are after homepage tools, after article content, and after troubleshooting steps. Tool/photo/camera, sign-in, sign-up, account, billing, history, API, legal, contact, pricing and about routes are excluded. No cookie or optional-services popup is shown. Native/banner/Smartlink slots activate near the viewport; Popunder and Social Bar load only on eligible public routes. No fill or an ad blocker leaves the page usable.

## ads.txt

`public/ads.txt` is intentionally absent because no verified Adsterra-authorized line was provided. Copy the exact line shown in the Adsterra dashboard; do not adapt the removed Google line or guess an account ID. Add it as `public/ads.txt`, deploy, then verify `https://omoggle-it.com/ads.txt` exactly matches the dashboard.

## Activation check

After deployment, verify excluded routes make no Adsterra or analytics requests, then verify every unit ID through its own Adsterra statistics page and the expected responsive routes above. Also test popunder frequency, Social Bar dismissal, Smartlink labeling, ad blocking, mobile layout and no-fill. Revenue and recognized impressions must be read from Adsterra reports, never inferred from the local `ad_slot_requested` event.
