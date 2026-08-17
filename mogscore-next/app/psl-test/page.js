import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import FaceRatingTool from '@/components/FaceRatingTool'
import { StructuredData, breadcrumbSchema, webApplicationSchema } from '@/components/StructuredData'

const path = '/psl-test'
const description = 'Take a free PSL test and analyze facial harmony, jawline, eye area, symmetry and proportions with our AI-powered face rating tool.'

export const metadata = {
  title: 'Free PSL Test – Calculate Your PSL Face Rating',
  description,
  alternates: { canonical: `https://omoggle-it.com${path}` },
  openGraph: { title: 'Free PSL Test – Calculate Your PSL Face Rating', description, url: `https://omoggle-it.com${path}` },
}

export default function PslTestPage() {
  const crumbs = [{ name: 'Home', href: '/' }, { name: 'PSL', href: '/psl-scale' }, { name: 'PSL Test', href: path }]
  return (
    <>
      <StructuredData data={webApplicationSchema({ name: 'Free PSL Test', description, path })} />
      <StructuredData data={breadcrumbSchema(crumbs)} />
      <Navbar />
      <header className="seo-page-header"><div className="container-sm">
        <nav className="breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span>›</span><Link href="/psl-scale">PSL</Link><span>›</span><span>PSL Test</span></nav>
        <span className="hero-eyebrow">Free · No signup required</span><h1>PSL Test</h1>
        <p>Upload one clear photo to get an entertainment-only PSL score across facial symmetry, jawline, eye area, midface, proportions, skin and overall harmony.</p>
      </div></header>
      <main>
        <section className="section"><div className="container"><FaceRatingTool variant="psl" /></div></section>
        <section className="section section-alt"><article className="content-section container-sm">
          <h2>What Your PSL Test Measures</h2>
          <p>The tool reuses our existing private face-analysis pipeline and presents the output for PSL search intent. It evaluates visible image features and derives seven readable result categories. Your photo is not published as a profile.</p>
          <ul><li>Overall PSL Score</li><li>Facial Symmetry</li><li>Jawline</li><li>Eye Area</li><li>Midface and Facial Proportions</li><li>Skin</li><li>Harmony</li></ul>
          <h2>How to Get a More Consistent Result</h2>
          <p>Use front-facing light, keep the lens around eye level and avoid filters or extreme expressions. A score can vary between photos, so use it as a presentation check—not a diagnosis or permanent label.</p>
          <h2>PSL Test vs PSL Scale</h2>
          <p>This page is the interactive tool. For the knowledge-oriented explanation of ratings from 1–10, see the <Link href="/psl-scale">PSL Scale guide</Link>. You can also convert the same type of analysis into a more playful <Link href="/mog-score">Mog Score</Link>.</p>
          <div className="highlight-box"><p><strong>Disclaimer:</strong> This tool is for entertainment and self-improvement purposes only. PSL ratings are subjective and are not scientific measurements of attractiveness.</p></div>
        </article></section>
      </main>
      <Footer />
    </>
  )
}
