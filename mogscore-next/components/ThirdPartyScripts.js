'use client'

import Script from 'next/script'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { isSensitiveRoute } from '@/lib/ad-config'

const CONSENT_KEY = 'omoggle_optional_services_consent'

export default function ThirdPartyScripts({ analyticsId, analyticsEnabled }) {
  const pathname = usePathname()
  const sensitive = isSensitiveRoute(pathname)
  const [consent, setConsent] = useState(null)

  useEffect(() => {
    const timer = window.setTimeout(() => setConsent(window.localStorage.getItem(CONSENT_KEY)), 0)
    return () => window.clearTimeout(timer)
  }, [])

  function choose(value) {
    window.localStorage.setItem(CONSENT_KEY, value)
    if (value === 'denied' && typeof window.gtag === 'function') window.gtag('consent', 'update', { analytics_storage: 'denied', ad_storage: 'denied' })
    setConsent(value)
    window.dispatchEvent(new CustomEvent('omoggle-consent-change', { detail: value }))
  }

  const loadAnalytics = !sensitive && analyticsEnabled && consent === 'granted' && /^G-[A-Z0-9]+$/.test(analyticsId || '')

  return (
    <>
      {loadAnalytics ? (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${analyticsId}`} strategy="afterInteractive" />
          <Script id="ga4-config" strategy="afterInteractive">{`
            window.dataLayer=window.dataLayer||[];
            function gtag(){dataLayer.push(arguments);}
            window.gtag=gtag;
            gtag('js',new Date());
            gtag('config','${analyticsId}',{anonymize_ip:true});
          `}</Script>
        </>
      ) : null}
      {!sensitive && consent === null ? (
        <aside className="privacy-choice" aria-label="Optional service preferences">
          <p>Optional analytics and advertising help fund the free guides. They stay off until you choose.</p>
          <div>
            <button type="button" className="btn btn-outline" onClick={() => choose('denied')}>Keep off</button>
            <button type="button" className="btn btn-primary" onClick={() => choose('granted')}>Allow optional services</button>
          </div>
          <Link href="/privacy-policy">Privacy details</Link>
        </aside>
      ) : null}
      {!sensitive && consent !== null ? <button type="button" className="privacy-reset" onClick={() => choose(consent === 'granted' ? 'denied' : 'granted')}>{consent === 'granted' ? 'Turn optional services off' : 'Allow optional services'}</button> : null}
    </>
  )
}
