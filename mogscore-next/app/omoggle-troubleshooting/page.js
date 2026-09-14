import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AdSlot from '@/components/AdSlot'

export const metadata = {
  title: 'Omoggle Troubleshooting — Camera, Access & Connection',
  description: 'Diagnose Omoggle page, camera permission, black-screen, mobile-browser and connection problems with a practical branching checklist.',
  alternates: { canonical: 'https://omoggle-it.com/omoggle-troubleshooting' },
}

const branches = [
  ['The page will not open', 'Try the address in a private window, then another network. A browser error on one device does not prove a service outage.', 'Confirm the final address and HTTP error. If every device and network fails, check Omoggle’s own channels.'],
  ['Camera preview is black', 'Close Zoom, Teams and other camera apps. Reload, choose the correct camera, and remove a physical privacy cover.', 'Open the browser camera test below. If it also stays black, test the operating-system camera app.'],
  ['No permission prompt appears', 'Open the padlock/site controls beside the address, reset the camera permission, then reload.', 'A managed work or school browser may block permission prompts; try an unmanaged profile.'],
  ['Permission was denied', 'Change Camera to Allow in site settings. On iOS, also check Settings → Safari/your browser → Camera.', 'Reload after changing permission. Permission on this site does not change permission on another domain.'],
  ['Mobile browser behaves differently', 'Use a current Safari on iPhone or Chrome on Android, disable desktop-site mode, and close background camera apps.', 'Retest on Wi-Fi and mobile data to separate a network issue from a browser issue.'],
  ['Connection fails after camera works', 'Disable VPN or restrictive extensions temporarily and try a different network. Corporate firewalls may block real-time connections.', 'A cross-origin test from this site cannot reliably declare Omoggle online or offline.'],
]

export default function TroubleshootingPage() {
  return <><Navbar /><header className="hero"><div className="container-sm"><span className="hero-eyebrow">Independent help guide</span><h1>Omoggle Troubleshooting</h1><p className="hero-sub">Choose the symptom that matches what you see, change one thing, then repeat the check.</p><p><strong>Current status: unknown.</strong> Omoggle IT does not operate real-time Omoggle monitoring and will not show a fabricated green status.</p></div></header><main className="section"><div className="container-sm"><div className="troubleshooting-list">{branches.map(([title, steps, check]) => <section className="card" key={title}><div className="card-body"><h2>{title}</h2><h3>Try this</h3><p>{steps}</p><h3>Check the result</h3><p>{check}</p></div></section>)}</div><AdSlot pageType="troubleshooting" slotName="troubleshooting-after-steps" /><section><h2>Still not working?</h2><p>Record the browser name, operating system, exact error text and whether the operating-system camera app works. Then use our <Link href="/contact">contact page</Link> or Omoggle’s official support channel if one is available.</p><p>You can independently check your framing with the <Link href="/omoggle-practice-test">local camera setup tool</Link>. It does not connect to Omoggle.</p></section></div></main><Footer /></>
}
