'use client'

const ALLOWED_EVENTS = new Set([
  'tool_view', 'analysis_start', 'analysis_complete', 'analysis_error',
  'practice_start', 'practice_complete', 'camera_permission_result',
  'result_related_click', 'share_card_generate', 'guide_to_tool_click',
  'ad_slot_requested',
])

const ALLOWED_PARAMS = new Set(['tool_name', 'page_type', 'processing_mode', 'error_category', 'duration_bucket', 'rule_version', 'target'])

export function trackSafeEvent(name, params = {}) {
  if (!ALLOWED_EVENTS.has(name) || typeof window === 'undefined' || typeof window.gtag !== 'function') return
  const safe = {}
  for (const [key, value] of Object.entries(params)) {
    if (ALLOWED_PARAMS.has(key) && ['string', 'number', 'boolean'].includes(typeof value)) safe[key] = value
  }
  window.gtag('event', name, safe)
}

export function durationBucket(milliseconds) {
  if (milliseconds < 500) return 'under_500ms'
  if (milliseconds < 1500) return '500_1499ms'
  if (milliseconds < 3000) return '1500_2999ms'
  return '3000ms_plus'
}
