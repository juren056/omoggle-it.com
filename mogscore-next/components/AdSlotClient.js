'use client'

import Script from 'next/script'
import { useEffect, useRef, useState } from 'react'
import { trackSafeEvent } from '@/lib/analytics'

export default function AdSlotClient({ config, slotName }) {
  const ref = useRef(null)
  const [eligible, setEligible] = useState(false)

  useEffect(() => {
    if (!config.enabled) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setEligible(true)
        trackSafeEvent('ad_slot_requested', { page_type: config.pageType })
        observer.disconnect()
      }
    }, { rootMargin: '240px' })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [config.enabled, config.pageType])

  if (!config.enabled) return null
  return (
    <aside ref={ref} className="ad-slot" aria-label="Advertisement">
      <span>Advertisement</span>
      <div id={config.containerId} data-slot={slotName} />
      {eligible ? <Script id={`adsterra-${slotName}`} src={config.scriptUrl} strategy="lazyOnload" /> : null}
    </aside>
  )
}
