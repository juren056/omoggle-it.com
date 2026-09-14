# Manual actions after code review

1. In Vercel Production variables, keep `ADSTERRA_ENABLED=false` for the first deploy. Add the exact Native Banner script URL and container ID from Adsterra, then follow `monetization-setup.md` before enabling it.
2. Add `public/ads.txt` only from the exact Adsterra dashboard authorization line. Rebuild and verify the public response.
3. Analytics is intentionally not mounted and there is no cookie popup. If analytics is ever added later, review regional disclosure and consent obligations before deployment.
4. Keep `NEW_SUBSCRIPTIONS_ENABLED=false` unless the business deliberately reopens sales. Keep `CLOUD_ANALYSIS_ENABLED=true` only while existing Pro members must retain the legacy benefit; turning it false is an immediate server-side circuit breaker.
5. Run the production smoke checklist: homepage, five local tools, one article, locale roots, robots, sitemap, account sign-in, existing-member portal, Adsterra rejection/allow paths, and network inspection on a photo route.
6. Submit the updated sitemap in the existing Search Console property. Do not request bulk reindexing or remove preserved URLs without query/page data.
7. Test on a real iPhone and Android device; browser emulation is not equivalent to hardware camera testing.
