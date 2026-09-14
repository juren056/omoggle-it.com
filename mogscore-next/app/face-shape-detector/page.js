import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import LocalFaceTool from '@/components/LocalFaceTool'

export const metadata = {
  title: 'Free Face Shape Detector — Private & Local',
  description: 'Estimate your closest face shape from one authorized adult photo. Processing stays in your browser and includes uncertainty and measurement notes.',
  alternates: { canonical: 'https://omoggle-it.com/face-shape-detector' },
}

export default function FaceShapeDetectorPage() {
  return <><Navbar /><header className="seo-page-header"><div className="container-sm"><span className="hero-eyebrow">Private browser tool</span><h1>Free Face Shape Detector</h1><p>Get a rough, explainable shape match without uploading your photo. Angle, hair, facial hair and lens distortion can affect the result.</p></div></header><main><section className="section"><div className="container-sm"><div className="tool-section"><LocalFaceTool variant="shape" /></div></div></section><section className="section section-alt"><article className="content-section container-sm"><h2>What the detector measures</h2><p>The local rule compares face length, cheek width, jaw width and forehead width from detected landmarks. It returns a closest and secondary category; it does not identify you or guarantee a styling outcome.</p><p>If the photo is angled or partly covered, use the <Link href="/face-shape-guide">manual face shape guide</Link> and retest with a front-facing photo.</p></article></section></main><Footer /></>
}
