# Baseline audit before this rebuild

## Architecture

- Next.js 16.2.6 App Router with React 19.2.4; npm and `package-lock.json`.
- Route pages combine React Server Components, client tool/account components, and HTML article sources parsed with Cheerio by `app/[slug]/page.js`.
- Deployment configuration targets Vercel. No framework or hosting migration was performed.
- Clerk scopes account, sign-in and paid APIs. Supabase stores quotas/subscription records. Stripe checkout, portal and webhook code existed. GPTSAPI backed the old server-side image analysis.
- English article bodies come from `public/*.html`; three locale roots and translated/mirrored routes exist for Japanese, Portuguese and Russian.
- The old free analyzer converted a browser image to Base64, posted it to `/api/analyze`, and the server forwarded it to `gptsapi.net` using `gpt-4o-mini`. Invalid model output could cause one automatic second paid request.
- Google Analytics and Google AdSense were hardcoded globally and repeated in 70 static HTML files. This meant third-party scripts could load on photo-tool views. `public/ads.txt` contained a Google seller ID even though the owner now uses Adsterra.

## Baseline records

`routes-before.json` is a local production-build measurement, not a live production measurement. It records all 97 URLs from that build’s sitemap with status, final URL, title, H1, canonical and robots signals. Source expectations, local observations and online behavior are not conflated.

The repository contained no GSC, GA4, Adsterra revenue or model invoice export. Absence from an export therefore was not used to justify deletion, redirect, noindex or canonical consolidation.

## Confirmed problems

- Subscription and AI language dominated free paths despite the changed business model.
- Free face analysis incurred an external paid call and allowed guests.
- Exact Omoggle model weights, platform behavior and improvement promises appeared without a verifiable current primary source.
- Privacy copy did not match the intended local processing architecture.
- AdSense was injected despite the owner’s Adsterra choice.
- No actual face-shape detector or branch-based troubleshooting route existed.

## Not reproduced / intentionally preserved

- Public pages did not reproduce a Clerk redirect loop in the stored baseline; the route scope already excluded public content.
- HTTP/HTTPS and www behavior cannot be fully proven from localhost. Existing canonical host handling remains.
- Potential PSL and tier-page overlap lacks GSC evidence. Existing URLs remain, with the known `/psl-scale-explained` and `/psl-scale-test` aliases preserved rather than expanding consolidation.
- Locale URLs remain. No mass translation, deletion, noindex or English canonical was introduced.
