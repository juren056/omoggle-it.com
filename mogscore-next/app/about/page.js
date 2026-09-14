import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'About',
  description: 'How Omoggle IT builds independent Omoggle guides and private browser-based presentation tools.',
  alternates: { canonical: 'https://omoggle-it.com/about' },
}

export default function AboutPage() {
  return <><Navbar /><header className="seo-page-header"><div className="container-sm"><span className="hero-eyebrow">About Omoggle IT</span><h1>Independent Tools and Practical Guides</h1><p>How the site approaches tools, editorial content and privacy.</p></div></header><main className="section"><article className="content-section container-sm"><p>Omoggle IT is an independent educational resource. It is not affiliated with Omoggle LLC and cannot see or verify Omoggle’s private ranking, matching or moderation systems.</p><h2>What we build</h2><p>Our free photo and camera tools run a self-hosted face-landmark model in your browser. They assess observable setup factors such as lighting, framing and head direction using disclosed entertainment rules. They do not determine objective attractiveness or personal worth.</p><h2>How the site is funded</h2><p>Free guides may contain clearly labelled Adsterra display or native advertising after optional services are allowed. Advertising stays disabled on photo, camera, account, billing and sign-in views.</p><h2>Editorial standard</h2><p>We distinguish documented facts, direct observations and our own heuristics. When live status or a platform rule cannot be verified, we say it is unknown.</p></article></main><Footer /></>
}
