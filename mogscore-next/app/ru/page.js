import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { imageUrl } from '@/lib/images'

export const metadata = {
  title: 'MogScore — Гайд по Omoggle, Луксмаксинг & PSL Scale Wiki',
  description: 'Бесплатный ИИ-анализатор лица, объяснение PSL Scale, тировые рейтинги Omoggle и советы по победе.',
}

const featuredArticles = [
  {href:'/what-is-omoggle',tag:'Вики',img:'/images/what-is-omoggle.jpg',title:'Что такое Omoggle? Полный гайд 2026',desc:'Вирусная платформа оценки лиц — как работает, тир-лист, стримеры и как побеждать.'},
  {href:'/psl-scale-explained',tag:'Справка',img:'/images/psl-scale.jpg',title:'PSL Scale объяснён: ранги 1–10',desc:'Шкала 1–10 для ИИ-скоринга Omoggle. Что означает каждая цифра.'},
  {href:'/how-to-win-omoggle',tag:'Стратегия',img:'/images/how-to-win-omoggle.jpg',title:'Как побеждать в Omoggle: 7 советов',desc:'Угол камеры, освещение — факторы, повышающие счёт на 1,5–2 пункта.'},
  {href:'/hunter-eyes-guide',tag:'Гайд',img:'/images/canthal-tilt.jpg',title:'Hunter Eyes: что это и как получить',desc:'Самая обсуждаемая черта — что реально можно сделать для улучшения области глаз.'},
  {href:'/face-fat-loss-guide',tag:'Гайд',img:'/images/gym-face.jpg',title:'Сжигание жира на лице: линия челюсти',desc:'Самое рентабельное вмешательство. Сроки и наиболее эффективный подход.'},
  {href:'/looksmaxxing-results-timeline',tag:'Гайд',img:'/images/looksmaxxing-guide.jpg',title:'Хронология результатов луксмаксинга',desc:'Честные сроки: уход за кожей 4–6 недель. Жир на лице 8–16 недель.'}
]

const allArticles = [
  {href:'/softmaxxing-vs-hardmaxxing',tag:'Гайд',img:'/images/looksmaxxing-guide.jpg',title:'Softmaxxing vs Hardmaxxing: что сначала?',date:'17 мая'},
  {href:'/facial-symmetry-improvement',tag:'Гайд',img:'/images/facial-symmetry.jpg',title:'Как улучшить симметрию лица',date:'17 мая'},
  {href:'/is-omoggle-ai',tag:'Расследование',img:'/images/what-is-omoggle.jpg',title:'Omoggle — настоящий ИИ?',date:'14 мая'},
  {href:'/omoggle-fake-sites',tag:'Предупреждение',img:'/images/omoggle-updates.jpg',title:'Фейковые сайты Omoggle',date:'14 мая'},
  {href:'/omoggle-tier-list-2026',tag:'Обновлено',img:'/images/tier-list.jpg',title:'Тир-лист 2026: все 9 рангов',date:'14 мая'},
  {href:'/agent00-omoggle',tag:'Новости',img:'/images/viral-moments.jpg',title:'Agent00 вышел с накладным лбом и победил',date:'14 мая'},
  {href:'/jasontheween-omoggle',tag:'Новости',img:'/images/viral-moments.jpg',title:'Jasontheween и CORE Boys на Omoggle',date:'14 мая'},
  {href:'/xqc-omoggle',tag:'Новости',img:'/images/xqc-omoggle.jpg',title:'xQc проиграл 6 раз подряд',date:'5 мая'},
  {href:'/asmongold-omoggle',tag:'Новости',img:'/images/asmongold-omoggle.jpg',title:'Счёт и хайлайты Asmongold',date:'5 мая'},
  {href:'/clavicular-mogged',tag:'Новости',img:'/images/clavicular-mogged.jpg',title:'Clavicular бросил стрим',date:'5 мая'},
  {href:'/omoggle-elo-system',tag:'Вики',img:'/images/elo-system.jpg',title:'Система ELO Omoggle',date:'3 мая'},
  {href:'/omoggle-vs-omegle',tag:'Вики',img:'/images/omoggle-vs-omegle.jpg',title:'Omoggle vs Omegle: разница?',date:'3 мая'},
  {href:'/looksmaxxing-guide',tag:'Гайд',img:'/images/looksmaxxing-guide.jpg',title:'Гайд по луксмаксингу для начинающих',date:'1 мая'},
  {href:'/canthal-tilt-guide',tag:'Гайд',img:'/images/canthal-tilt.jpg',title:'Гайд по кантальному наклону',date:'1 мая'},
  {href:'/mewing-guide',tag:'Гайд',img:'/images/mewing-guide.jpg',title:'Гайд по мьюингу: работает ли?',date:'1 мая'},
  {href:'/jawline-guide',tag:'Гайд',img:'/images/jawline-gym.jpg',title:'Гайд по линии челюсти',date:'1 мая'},
  {href:'/skincare-looksmaxxing',tag:'Гайд',img:'/images/skincare-looksmaxx.jpg',title:'Уход за кожей для луксмаксинга',date:'28 апр'},
  {href:'/gym-face-guide',tag:'Гайд',img:'/images/gym-face.jpg',title:'Гайд Gym Face',date:'28 апр'},
  {href:'/sleep-looksmaxxing',tag:'Гайд',img:'/images/sleep-looksmaxxing.jpg',title:'Сон и луксмаксинг',date:'28 апр'},
  {href:'/haircut-looksmaxxing',tag:'Гайд',img:'/images/haircut-looksmaxxing.jpg',title:'Лучшая стрижка для луксмаксинга',date:'25 апр'}
]

const stats = [
  ['6','Анализируемых метрик'],
  ['54','Гайды & Статьи'],
  ['9','Тиры ELO'],
  ['Бесплатно','Анализатор · 3/день']
]

export default function RUHomePage() {
  return (
    <>
      <Navbar />
      <header className="hero">
        <div className="container">
          <span className="hero-eyebrow">🔥 Вирально на Twitch в 2026</span>
          <h1>{'Полный гайд по '}<em>Omoggle</em>,<br/>{'моггингу и луксмаксингу'}</h1>
          <p className="hero-sub">{'Бесплатный ИИ-анализатор лица, объяснение PSL Scale, тировые рейтинги и советы по победе в Omoggle.'}</p>
          <div className="hero-actions">
            <Link href="/ru/tools" className="btn btn-primary">{'Анализировать лицо с ИИ'}</Link>
            <Link href="/ru/what-is-omoggle" className="btn btn-outline">{'Что такое Omoggle? →'}</Link>
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
            <span className="section-label">{'Бесплатные инструменты'}</span>
            <h2>{'ИИ-инструменты луксмаксинга'}</h2>
          </div>
          <div className="grid-2">
            <article className="tool-card">
              <div className="tool-icon">◈</div>
              <span className="tool-badge free">{'Бесплатно · 3/день'}</span>
              <h3>{'ИИ-анализатор лица'}</h3>
              <p style={{fontSize:'.88rem',color:'var(--text-muted)',flex:1}}>{'Загрузите фото и получите подробный MogScore с оценкой 6 метрик лица и советами. Бесплатно — 3 анализа/день для гостей, 10 после входа.'}</p>
              <Link href="/ru/tools" className="btn btn-primary" style={{textAlign:'center',marginTop:'1rem'}}>{'Анализировать моё лицо →'}</Link>
            </article>
            <article className="tool-card">
              <div className="tool-icon">⚡</div>
              <span className="tool-badge new">{'Новое'}</span>
              <h3>{'Мог-баттл 1v1'}</h3>
              <p style={{fontSize:'.88rem',color:'var(--text-muted)',flex:1}}>{'Загрузите два фото и пусть ИИ решит, кто могнул кого.'}</p>
              <Link href="/ru/tools#battle" className="btn btn-outline" style={{textAlign:'center',marginTop:'1rem'}}>{'Начать баттл →'}</Link>
            </article>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <span className="section-label">{'Последние статьи'}</span>
            <h2>{'Избранные гайды & Новости'}</h2>
          </div>
          <div className="grid-3" style={{marginBottom:'var(--sp-lg)'}}>
            {featuredArticles.map(a => (
              <article className="card" key={a.href}>
                {a.img && <img src={imageUrl(a.img)} alt={a.title} className="card-img" width="600" height="338" loading="lazy" />}
                <div className="card-body">
                  <span className="card-tag">{a.tag}</span>
                  <Link href={`/ru${a.href}`} className="card-title">{a.title}</Link>
                  <p className="card-excerpt">{a.desc}</p>
                </div>
              </article>
            ))}
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:'8px',marginBottom:'var(--sp-lg)'}}>
            {allArticles.map(a => (
              <Link href={`/ru${a.href}`} key={a.href} className="article-row-item">
                <div style={{display:'flex',alignItems:'center',gap:'.75rem',minWidth:0}}>
                  {a.img && <img src={imageUrl(a.img)} alt={a.title} style={{width:60,height:42,objectFit:'cover',borderRadius:'var(--r-sm)',flexShrink:0}} loading="lazy" />}
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
            <Link href="/blog" className="btn btn-outline">{'Все статьи →'}</Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
