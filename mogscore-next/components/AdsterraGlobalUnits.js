'use client'

import Script from 'next/script'
import { usePathname } from 'next/navigation'
import { isAdExcludedRoute } from '@/lib/ad-config'

export default function AdsterraGlobalUnits({ config }) {
  const pathname = usePathname()
  if (!config.enabled || isAdExcludedRoute(pathname)) return null

  return <>
    {config.popunder.enabled ? <Script id="adsterra-popunder" src={config.popunder.scriptUrl} strategy="afterInteractive" /> : null}
    {config.socialBar.enabled ? <Script id="adsterra-social-bar" src={config.socialBar.scriptUrl} strategy="lazyOnload" /> : null}
  </>
}
