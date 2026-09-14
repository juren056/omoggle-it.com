import fs from 'node:fs/promises'

function csv(text) {
  const lines = text.trim().split(/\r?\n/).filter(Boolean)
  if (!lines.length) return []
  const headers = lines.shift().split(',').map(value => value.trim())
  return lines.map(line => Object.fromEntries(line.split(',').map((value, index) => [headers[index], value.trim()])))
}
async function load(file) { if (!file) return []; return csv(await fs.readFile(file, 'utf8')) }
const [trafficFile, revenueFile, costsFile] = process.argv.slice(2)
if (!trafficFile || !revenueFile || !costsFile) {
  console.error('Usage: node scripts/revenue-report.mjs traffic.csv revenue.csv costs.csv')
  process.exitCode = 2
} else {
  const [traffic, revenue, costs] = await Promise.all([load(trafficFile), load(revenueFile), load(costsFile)])
  const number = value => Number.parseFloat(value) || 0
  const sessions = traffic.reduce((sum, row) => sum + number(row.sessions), 0)
  const organic = traffic.reduce((sum, row) => sum + number(row.organic_sessions), 0)
  const pageviews = traffic.reduce((sum, row) => sum + number(row.pageviews), 0)
  const starts = traffic.reduce((sum, row) => sum + number(row.analysis_starts), 0)
  const completes = traffic.reduce((sum, row) => sum + number(row.analysis_completes), 0)
  const relatedClicks = traffic.reduce((sum, row) => sum + number(row.related_clicks), 0)
  const adRevenue = revenue.reduce((sum, row) => sum + number(row.ad_revenue), 0)
  const modelCost = costs.reduce((sum, row) => sum + number(row.model_cost), 0)
  const hostingCost = costs.reduce((sum, row) => sum + number(row.hosting_cost), 0)
  const otherCost = costs.reduce((sum, row) => sum + number(row.other_cost), 0)
  const currencies = new Set([...traffic, ...revenue, ...costs].map(row => row.currency).filter(Boolean))
  if (currencies.size > 1) throw new Error(`Currency mismatch: ${[...currencies].join(', ')}`)
  const ratio = (value, denominator) => denominator > 0 ? Number((value / denominator).toFixed(4)) : null
  const attributableCost = modelCost + hostingCost + otherCost
  console.log(JSON.stringify({
    status: sessions && pageviews ? 'calculated_from_supplied_exports' : 'insufficient_data',
    currency: [...currencies][0] || null,
    totals: { sessions, organicSessions: organic, pageviews, analysisStarts: starts, analysisCompletes: completes, relatedClicks, adRevenue, modelCost, hostingCost, otherCost, attributableCost, netRevenue: Number((adRevenue - attributableCost).toFixed(2)) },
    rates: { organicShare: ratio(organic, sessions), pagesPerSession: ratio(pageviews, sessions), toolCompletionRate: ratio(completes, starts), relatedContentClickRate: ratio(relatedClicks, completes), pageRpm: pageviews > 0 ? Number((adRevenue / pageviews * 1000).toFixed(2)) : null },
    notes: ['Ad revenue must come from the platform export.', 'Site-wide costs remain site-wide; no unsupported page allocation is attempted.'],
  }, null, 2))
}
