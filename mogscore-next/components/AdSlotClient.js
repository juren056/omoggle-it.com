'use client'

import Script from 'next/script'
import { useEffect, useMemo, useRef, useState } from 'react'
import { trackSafeEvent } from '@/lib/analytics'

const PAGE_BANNERS = {
  home: { mobile: ['320x50', '300x250'], tablet: ['468x60', '300x250'], desktop: ['728x90', '160x300'] },
  content: { mobile: ['320x50', '300x250'], tablet: ['468x60', '300x250'], desktop: ['728x90', '300x250', '160x600'] },
  troubleshooting: { mobile: ['320x50'], tablet: ['468x60'], desktop: ['300x250', '160x300'] },
}

function viewportGroup(width) {
  if (width <= 520) return 'mobile'
  if (width <= 900) return 'tablet'
  return 'desktop'
}

function BannerFrame({ unit, slotName }) {
  const source = `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;display:grid;place-items:center;overflow:hidden;background:transparent"><script>atOptions={'key':'${unit.key}','format':'iframe','height':${unit.height},'width':${unit.width},'params':{}};<\/script><script src="${unit.scriptUrl}"><\/script></body></html>`
  return <iframe
    className="ad-banner-frame"
    title={`Advertisement ${unit.name}`}
    width={unit.width}
    height={unit.height}
    loading="lazy"
    sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
    referrerPolicy="strict-origin-when-cross-origin"
    srcDoc={source}
    data-slot={`${slotName}-${unit.name}`}
  />
}

export default function AdSlotClient({ config, slotName }) {
  const ref = useRef(null)
  const [eligible, setEligible] = useState(false)
  const [viewport, setViewport] = useState('desktop')

  useEffect(() => {
    const update = () => setViewport(viewportGroup(window.innerWidth))
    const timer = window.setTimeout(update, 0)
    window.addEventListener('resize', update)
    return () => { window.clearTimeout(timer); window.removeEventListener('resize', update) }
  }, [])

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

  const bannerUnits = useMemo(() => {
    const names = PAGE_BANNERS[config.pageType]?.[viewport] || []
    return names.map(name => config.banners[name]).filter(unit => unit?.enabled)
  }, [config.banners, config.pageType, viewport])

  const hasPlacement = config.native.enabled || config.smartlink.enabled || bannerUnits.length > 0
  if (!config.enabled || !hasPlacement) return null

  return (
    <aside ref={ref} className={`ad-slot ad-slot-${config.pageType}`} aria-label="Advertisement">
      <span>Advertisement</span>
      {eligible && config.native.enabled ? <div className="ad-native-unit"><div id={config.native.containerId} data-slot={`${slotName}-native`} /><Script id={`adsterra-native-${slotName}`} src={config.native.scriptUrl} strategy="lazyOnload" /></div> : null}
      {eligible ? <div className="ad-banner-grid">{bannerUnits.map(unit => <BannerFrame unit={unit} slotName={slotName} key={unit.name} />)}</div> : null}
      {eligible && config.smartlink.enabled ? <a className="ad-smartlink" href={config.smartlink.url} target="_blank" rel="sponsored noopener noreferrer">View sponsored offer</a> : null}
    </aside>
  )
}
