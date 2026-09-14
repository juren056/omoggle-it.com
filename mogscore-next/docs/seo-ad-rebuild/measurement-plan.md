# Measurement and net-revenue plan

Optional GA4 is disabled until `ANALYTICS_ENABLED=true` and the visitor opts in. The implementation allowlists `tool_view`, `analysis_start`, `analysis_complete`, `analysis_error`, `practice_start`, `practice_complete`, `camera_permission_result`, `result_related_click`, `share_card_generate`, `guide_to_tool_click` and `ad_slot_requested`. Allowed parameters exclude images, filenames, landmarks, exact scores and form text.

`ad_slot_requested` means only that an eligible container approached the viewport. It is not an Adsterra impression and has no revenue value by itself.

Run the local report with three comma-separated exports:

```text
node scripts/revenue-report.mjs traffic.csv revenue.csv costs.csv
```

Traffic headers: `date,currency,sessions,organic_sessions,pageviews,analysis_starts,analysis_completes,related_clicks`.
Revenue headers: `date,currency,ad_revenue`.
Cost headers: `date,currency,model_cost,hosting_cost,other_cost`.

All files must cover the same dates and one currency. The report calculates organic share, pages/session, completion rate, related-click rate, Page RPM, attributable cost and net revenue. Empty denominators return `null`/data insufficient, not zero-performance claims. Site-wide costs remain site-wide unless a reliable allocation key is supplied.

For ad experiments, change one slot or layout variable at a time. Record start/end dates, page type and device class. Do not vary SEO text, canonical or navigation. Compare tool completion and total platform revenue; mark insufficient volume rather than claiming significance.
