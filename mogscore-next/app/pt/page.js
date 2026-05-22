import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'MogScore — Guia Omoggle, Looksmaxxing & PSL Scale Wiki',
  description: 'Analisador de rosto IA gratuito, PSL Scale explicado, rankings de tier do Omoggle e dicas para vencer.',
}

const featuredArticles = [
  {href:'/what-is-omoggle',tag:'Wiki',img:'/images/what-is-omoggle.jpg',title:'O que é Omoggle? Guia Completo 2026',desc:'A plataforma viral de avaliação de rostos — como funciona, tier list, streamers e como vencer.'},
  {href:'/psl-scale-explained',tag:'Referência',img:'/images/psl-scale.jpg',title:'PSL Scale Explicado: Ranks 1–10',desc:'A escala 1–10 que o Omoggle usa como base de pontuação. O que cada número significa.'},
  {href:'/how-to-win-omoggle',tag:'Estratégia',img:'/images/how-to-win-omoggle.jpg',title:'Como Vencer no Omoggle: 7 Dicas',desc:'Ângulo da câmera, iluminação — fatores que aumentam sua pontuação em 1,5–2 pontos.'},
  {href:'/hunter-eyes-guide',tag:'Guia',img:'/images/canthal-tilt.jpg',title:'Hunter Eyes: O Que São e Como Conseguir',desc:'A característica mais discutida — o que você pode fazer para melhorar a área dos olhos.'},
  {href:'/face-fat-loss-guide',tag:'Guia',img:'/images/gym-face.jpg',title:'Perda de Gordura Facial: Revele sua Mandíbula',desc:'Intervenção de maior ROI. Linha do tempo e abordagem mais eficaz.'},
  {href:'/looksmaxxing-results-timeline',tag:'Guia',img:'/images/looksmaxxing-guide.jpg',title:'Linha do Tempo de Resultados de Looksmaxxing',desc:'Linhas do tempo honestas: Skincare 4–6 semanas. Gordura facial 8–16 semanas.'}
]

const allArticles = [
  {href:'/softmaxxing-vs-hardmaxxing',tag:'Guia',img:'/images/looksmaxxing-guide.jpg',title:'Softmaxxing vs Hardmaxxing: Qual Primeiro?',date:'17 Mai'},
  {href:'/facial-symmetry-improvement',tag:'Guia',img:'/images/facial-symmetry.jpg',title:'Como Melhorar a Simetria Facial',date:'17 Mai'},
  {href:'/is-omoggle-ai',tag:'Investigação',img:'/images/what-is-omoggle.jpg',title:'Omoggle é Realmente IA?',date:'14 Mai'},
  {href:'/omoggle-fake-sites',tag:'Aviso',img:'/images/omoggle-updates.jpg',title:'Sites Falsos do Omoggle',date:'14 Mai'},
  {href:'/omoggle-tier-list-2026',tag:'Atualizado',img:'/images/tier-list.jpg',title:'Tier List 2026: Todos os 9 Ranks',date:'14 Mai'},
  {href:'/agent00-omoggle',tag:'Notícias',img:'/images/viral-moments.jpg',title:'Agent00 Usou Testa Postiça e Venceu',date:'14 Mai'},
  {href:'/jasontheween-omoggle',tag:'Notícias',img:'/images/viral-moments.jpg',title:'Jasontheween & CORE Boys no Omoggle',date:'14 Mai'},
  {href:'/xqc-omoggle',tag:'Notícias',img:'/images/xqc-omoggle.jpg',title:'xQc Perdeu 6 Vezes Seguidas',date:'5 Mai'},
  {href:'/asmongold-omoggle',tag:'Notícias',img:'/images/asmongold-omoggle.jpg',title:'Pontuação do Asmongold',date:'5 Mai'},
  {href:'/clavicular-mogged',tag:'Notícias',img:'/images/clavicular-mogged.jpg',title:'Clavicular Abandonou Após Ser Mogado',date:'5 Mai'},
  {href:'/omoggle-elo-system',tag:'Wiki',img:'/images/elo-system.jpg',title:'Sistema ELO do Omoggle',date:'3 Mai'},
  {href:'/omoggle-vs-omegle',tag:'Wiki',img:'/images/omoggle-vs-omegle.jpg',title:'Omoggle vs Omegle: Diferença?',date:'3 Mai'},
  {href:'/looksmaxxing-guide',tag:'Guia',img:'/images/looksmaxxing-guide.jpg',title:'Guia de Looksmaxxing para Iniciantes',date:'1 Mai'},
  {href:'/canthal-tilt-guide',tag:'Guia',img:'/images/canthal-tilt.jpg',title:'Guia de Inclinação Canthal',date:'1 Mai'},
  {href:'/mewing-guide',tag:'Guia',img:'/images/mewing-guide.jpg',title:'Guia de Mewing: Funciona?',date:'1 Mai'},
  {href:'/jawline-guide',tag:'Guia',img:'/images/jawline-gym.jpg',title:'Guia de Mandíbula',date:'1 Mai'},
  {href:'/skincare-looksmaxxing',tag:'Guia',img:'/images/skincare-looksmaxx.jpg',title:'Skincare para Looksmaxxing',date:'28 Abr'},
  {href:'/gym-face-guide',tag:'Guia',img:'/images/gym-face.jpg',title:'Guia Gym Face',date:'28 Abr'},
  {href:'/sleep-looksmaxxing',tag:'Guia',img:'/images/sleep-looksmaxxing.jpg',title:'Sono e Looksmaxxing',date:'28 Abr'},
  {href:'/haircut-looksmaxxing',tag:'Guia',img:'/images/haircut-looksmaxxing.jpg',title:'Melhor Corte de Cabelo',date:'25 Abr'}
]

const stats = [
  ['50K+','Visitantes Mensais'],
  ['54','Guias & Artigos'],
  ['9','Tiers ELO'],
  ['Grátis','Analisador IA']
]

export default function PTHomePage() {
  return (
    <>
      <Navbar />
      <header className="hero">
        <div className="container">
          <span className="hero-eyebrow">🔥 Viral na Twitch em 2026</span>
          <h1>Your Ultimate Guide to <em>Omoggle</em>,<br/>{'Mogging & Looksmaxxing'}</h1>
          <p className="hero-sub">{'Analisador de rosto IA gratuito, PSL Scale explicado, rankings e dicas de especialistas para vencer no Omoggle.'}</p>
          <div className="hero-actions">
            <Link href="/pt/tools" className="btn btn-primary">{'Analisar Meu Rosto com IA'}</Link>
            <Link href="/pt/what-is-omoggle" className="btn btn-outline">{'O que é Omoggle? →'}</Link>
          </div>
        </div>
      </header>

      <section className="section-alt section">
        <div className="container">
          <div className="stats-row">
            {stats.map(([num, label]) => (
              <div className="stat-item" key={label}>
                <span className="stat-num">{num}</span>
                <span className="stat-label">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">{'Ferramentas Gratuitas'}</span>
            <h2>{'Ferramentas de Looksmaxxing com IA'}</h2>
          </div>
          <div className="grid-2">
            <article className="tool-card">
              <div className="tool-icon">◈</div>
              <span className="tool-badge free">{'Grátis'}</span>
              <h3>{'Analisador de Rosto IA'}</h3>
              <p style={{fontSize:'.88rem',color:'var(--text-muted)',flex:1}}>{'Envie sua foto e obtenha um MogScore detalhado com 6 métricas faciais e dicas personalizadas.'}</p>
              <Link href="/pt/tools" className="btn btn-primary" style={{textAlign:'center',marginTop:'1rem'}}>{'Analisar Meu Rosto →'}</Link>
            </article>
            <article className="tool-card">
              <div className="tool-icon">⚡</div>
              <span className="tool-badge new">{'Novo'}</span>
              <h3>{'Batalha Mog 1v1'}</h3>
              <p style={{fontSize:'.88rem',color:'var(--text-muted)',flex:1}}>{'Envie duas fotos e deixe a IA decidir quem moga quem.'}</p>
              <Link href="/pt/tools#battle" className="btn btn-outline" style={{textAlign:'center',marginTop:'1rem'}}>{'Iniciar Batalha →'}</Link>
            </article>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <span className="section-label">{'Últimos Artigos'}</span>
            <h2>{'Guias em Destaque & Notícias'}</h2>
          </div>
          <div className="grid-3" style={{marginBottom:'var(--sp-lg)'}}>
            {featuredArticles.map(a => (
              <article className="card" key={a.href}>
                {a.img && <img src={a.img} alt={a.title} className="card-img" width="600" height="338" loading="lazy" />}
                <div className="card-body">
                  <span className="card-tag">{a.tag}</span>
                  <Link href={a.href} className="card-title">{a.title}</Link>
                  <p className="card-excerpt">{a.desc}</p>
                </div>
              </article>
            ))}
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:'8px',marginBottom:'var(--sp-lg)'}}>
            {allArticles.map(a => (
              <Link href={a.href} key={a.href} className="article-row-item">
                <div style={{display:'flex',alignItems:'center',gap:'.75rem',minWidth:0}}>
                  {a.img && <img src={a.img} alt={a.title} style={{width:60,height:42,objectFit:'cover',borderRadius:'var(--r-sm)',flexShrink:0}} loading="lazy" />}
                  <div style={{minWidth:0}}>
                    <span className="card-tag" style={{marginBottom:'.25rem',display:'inline-block'}}>{a.tag}</span>
                    <div style={{fontSize:'.9rem',color:'var(--text)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{a.title}</div>
                  </div>
                </div>
                <span style={{fontSize:'.78rem',color:'var(--text-dim)',flexShrink:0}}>{a.date}</span>
              </Link>
            ))}
          </div>
          <div style={{textAlign:'center'}}>
            <Link href="/blog" className="btn btn-outline">{'Ver Todos os Artigos →'}</Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
