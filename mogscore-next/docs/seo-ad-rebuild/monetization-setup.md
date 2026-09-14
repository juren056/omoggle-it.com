# Adsterra monetization setup

## Current state

Real ads are OFF. AdSense scripts and the Google `ads.txt` seller line were removed per the owner’s instruction. The only supported provider in this rebuild is Adsterra, limited to an ordinary Native Banner/display script. Popunder, Social Bar, Direct Link, forced redirect, interstitial and reward-for-click behavior are not implemented.

## Vercel environment values

Set these in the Production environment only:

1. `ADSTERRA_ENABLED=true`
2. `NEXT_PUBLIC_ADSTERRA_NATIVE_SCRIPT_URL=` the exact HTTPS Native Banner script URL copied from the Adsterra placement.
3. `NEXT_PUBLIC_ADSTERRA_NATIVE_CONTAINER_ID=` the exact container ID required by that placement.
4. `AD_PAGE_TYPES=home,content,troubleshooting` (remove a value to disable that page type).

These placement identifiers are normally public in browser markup; account credentials and API keys must never be placed in `NEXT_PUBLIC_*`. Preview/development builds never request ads even if configuration is accidentally present. `ADSTERRA_ENABLED=false` is the global kill switch.

The initial slots are after homepage tools, after article content, and after troubleshooting steps. Tool/photo/camera, sign-in, sign-up, account, billing, history and API routes are excluded. No cookie or optional-services popup is shown; an enabled placement lazy-loads near the viewport. No fill or a blocker leaves the page usable.

## ads.txt

`public/ads.txt` is intentionally absent because no verified Adsterra-authorized line was provided. Copy the exact line shown in the Adsterra dashboard; do not adapt the removed Google line or guess an account ID. Add it as `public/ads.txt`, deploy, then verify `https://omoggle-it.com/ads.txt` exactly matches the dashboard.

## Activation check

Deploy first with the switch false. Verify sensitive routes make no Adsterra or analytics requests. Then set the IDs and switch true on a public guide, and confirm exactly one placement request in browser Network tools. Also test rejection, ad blocking, mobile layout and no-fill. Revenue and recognized impressions must be read from Adsterra reports, never inferred from the local `ad_slot_requested` event.
