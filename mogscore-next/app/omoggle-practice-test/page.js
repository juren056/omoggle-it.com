import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import OmogglePracticeTool from '@/components/OmogglePracticeTool'
import CameraSetupCheck from '@/components/CameraSetupCheck'
import LocalFaceTool from '@/components/LocalFaceTool'
import { StructuredData, breadcrumbSchema, webApplicationSchema } from '@/components/StructuredData'

const path = '/omoggle-practice-test'
const description = 'Practice Omoggle-style face comparison decisions with an interactive camera, lighting and presentation simulator before you play.'

export const metadata = {
  title: 'Omoggle Practice Test – Practice Before You Play',
  description,
  alternates: { canonical: `https://omoggle-it.com${path}` },
  openGraph: { title: 'Omoggle Practice Test', description, url: `https://omoggle-it.com${path}` },
}

const crumbs = [{ name: 'Home', href: '/' }, { name: 'Omoggle', href: '/what-is-omoggle' }, { name: 'Practice Test', href: path }]

export default function OmogglePracticePage() {
  return (
    <>
      <StructuredData data={webApplicationSchema({ name: 'Omoggle Practice Test', description, path })} />
      <StructuredData data={breadcrumbSchema(crumbs)} />
      <Navbar />
      <header className="seo-page-header">
        <div className="container-sm">
          <nav className="breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span>›</span><Link href="/what-is-omoggle">Omoggle</Link><span>›</span><span>Practice Test</span></nav>
          <span className="hero-eyebrow">Private camera setup practice</span>
          <h1>Omoggle Practice Test</h1>
          <p>Check camera permission, lighting, framing and head direction on your device before using a live site. No camera frame is uploaded.</p>
        </div>
      </header>
      <main>
        <section className="section"><div className="container"><OmogglePracticeTool /></div></section>
        <section className="section section-alt"><div className="container-sm"><div className="tool-section"><div className="tool-section-heading"><div className="tool-icon">◉</div><div><span className="tool-badge free">Local camera</span><h2 id="camera-check-heading">Camera Setup Check</h2><p>Check one private camera frame after completing the familiar practice quiz.</p></div></div><CameraSetupCheck showHeading={false} /></div></div></section>
        <section className="section"><div className="container-sm"><div className="tool-section"><div className="tool-section-heading"><div className="tool-icon">◈</div><div><span className="tool-badge free">Photo option</span><h2 id="analyzer-tool-heading">Local Photo Check</h2><p>Use an existing photo instead of enabling the camera.</p></div></div><LocalFaceTool variant="analyzer" showHeading={false} /></div></div></section>
        <section className="section section-alt"><article className="content-section container-sm">
          <h2>How the Omoggle Practice Test Works</h2>
          <p>The primary tool checks one camera frame or local photo for detectable face count, exposure, framing and head direction. The quiz then explains why repeatable setup choices matter. This is not Omoggle&apos;s official program and cannot verify or predict its undisclosed scoring rules.</p>

          <h2>How Omoggle Ratings Work</h2>
          <p>Omoggle-style systems compare facial landmarks, proportions and image characteristics. Lighting, lens distance, head position and expression can influence what the software detects. Read our <Link href="/what-is-omoggle">complete Omoggle guide</Link> for the platform overview.</p>

          <h2>How to Improve Your Omoggle Score</h2>
          <ul>
            <li>Use soft, even light from in front of the face.</li>
            <li>Keep the camera near eye level and avoid an extremely close wide-angle view.</li>
            <li>Use a relaxed, repeatable expression and a simple background.</li>
            <li>Compare several consistent attempts instead of treating one score as definitive.</li>
          </ul>
          <div className="highlight-box"><p>Ready to test a photo? Try the <Link href="/psl-test">free PSL Test</Link>, check your <Link href="/mog-score">Mog Score</Link>, or review the <Link href="/looksmaxxing-guide">Looksmaxxing Guide</Link>.</p></div>

          <h2>PSL vs Omoggle Score</h2>
          <p>The <Link href="/psl-scale">PSL scale</Link> is an informal looksmaxxing rating convention. An Omoggle score is the platform&apos;s own camera-dependent output. They may use similar vocabulary, but neither is a scientific measurement and the numbers are not interchangeable.</p>

          <h2>Frequently Asked Questions</h2>
          <div className="faq-list">
            {[
              ['What is an Omoggle practice test?', 'It is an interactive simulator for practicing camera, lighting and presentation choices before using a live face-comparison platform.'],
              ['Can I practice Omoggle online?', 'Yes. This page lets you practice setup decisions without a webcam match or another participant.'],
              ['How does Omoggle decide who wins?', 'Its software compares detected facial and image features, then produces platform-specific scores. Exact results can change with the input.'],
              ['What is a good Omoggle score?', 'There is no objective universal cutoff. Treat any score as entertainment and compare only under consistent conditions.'],
              ['Is Omoggle based on PSL?', 'It uses some vocabulary associated with PSL and looksmaxxing, but an Omoggle result is not the same thing as a standardized PSL measurement.'],
            ].map(([question, answer]) => <div className="faq-item" key={question}><h3>{question}</h3><p>{answer}</p></div>)}
          </div>
        </article></section>
      </main>
      <Footer />
    </>
  )
}
