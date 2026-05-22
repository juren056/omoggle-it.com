'use client'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const featuredArticles = [
  {tag:'Вики',img:'/images/what-is-omoggle.jpg',title:'Что такое Omoggle? Полный гайд 2026',desc:'Вирусная платформа оценки лиц с ИИ — как работает, тир-лист, стримеры и как побеждать.'},
{tag:'Справка',img:'/images/psl-scale.jpg',title:'PSL Scale объяснён: ранги 1–10',desc:'Шкала 1–10, которую Omoggle использует для ИИ-скоринга. Что означает каждая цифра.'},
{tag:'Стратегия',img:'/images/how-to-win-omoggle.jpg',title:'Как побеждать в Omoggle: 7 советов',desc:'Угол камеры, освещение, фон — факторы, повышающие счёт на 1,5–2 пункта.'},
{tag:'Гайд',img:'/images/canthal-tilt.jpg',title:'Hunter Eyes: что это и как получить',desc:'Самая обсуждаемая черта луксмаксинга — что реально можно сделать для улучшения области глаз.'},
{tag:'Гайд',img:'/images/gym-face.jpg',title:'Сжигание жира на лице: чёткая линия челюсти',desc:'Самое рентабельное вмешательство в луксмаксинге. Сроки и наиболее эффективный подход.'},
{tag:'Гайд',img:'/images/looksmaxxing-guide.jpg',title:'Хронология результатов луксмаксинга',desc:'Честные сроки: уход за кожей 4–6 недель. Жир на лице 8–16 недель. Мьюинг — месяцы и годы.'}
]

const allArticles = [
  {tag:'Гайд',img:'/images/looksmaxxing-guide.jpg',title:'Softmaxxing vs Hardmaxxing: что сначала?',date:'17 мая'},
{tag:'Гайд',img:null,title:'Как улучшить симметрию лица',date:'17 мая'},
{tag:'Расследование',img:null,title:'Omoggle — настоящий ИИ? Ответ разработчика',date:'14 мая'},
{tag:'Предупреждение',img:null,title:'Фейковые сайты Omoggle: как отличить',date:'14 мая'},
{tag:'Обновлено',img:null,title:'Тир-лист 2026: все 9 рангов включая Adam',date:'14 мая'},
{tag:'Новости',img:null,title:'Agent00 вышел с накладным лбом и победил',date:'14 мая'},
{tag:'Новости',img:null,title:'Jasontheween и CORE Boys на Omoggle',date:'14 мая'},
{tag:'Новости',img:'/images/xqc-omoggle.jpg',title:'xQc проиграл 6 раз подряд',date:'5 мая'},
{tag:'Новости',img:'/images/asmongold-omoggle.jpg',title:'Счёт и хайлайты Asmongold',date:'5 мая'},
{tag:'Новости',img:'/images/clavicular-mogged.jpg',title:'Clavicular бросил стрим после пораженья',date:'5 мая'},
{tag:'Вики',img:'/images/elo-system.jpg',title:'Система ELO Omoggle объяснена',date:'3 мая'},
{tag:'Вики',img:'/images/omoggle-vs-omegle.jpg',title:'Omoggle vs Omegle: в чём разница?',date:'3 мая'},
{tag:'Гайд',img:'/images/looksmaxxing-guide.jpg',title:'Гайд по луксмаксингу для начинающих',date:'1 мая'},
{tag:'Гайд',img:'/images/canthal-tilt.jpg',title:'Гайд по кантальному наклону',date:'1 мая'},
{tag:'Гайд',img:'/images/mewing-guide.jpg',title:'Гайд по мьюингу: работает ли?',date:'1 мая'},
{tag:'Гайд',img:'/images/jawline-gym.jpg',title:'Гайд по линии челюсти',date:'1 мая'},
{tag:'Гайд',img:'/images/skincare-looksmaxx.jpg',title:'Уход за кожей для луксмаксинга',date:'28 апр'},
{tag:'Гайд',img:'/images/gym-face.jpg',title:'Гайд Gym Face',date:'28 апр'},
{tag:'Гайд',img:'/images/sleep-looksmaxxing.jpg',title:'Сон и луксмаксинг: почему это важно',date:'28 апр'},
{tag:'Гайд',img:'/images/haircut-looksmaxxing.jpg',title:'Лучшая стрижка для луксмаксинга',date:'25 апр'}
]

const stats = [
  ['50K+','Посетителей в месяц'],
  ['54','Гайды & Статьи'],
  ['9','Тиры ELO объяснены'],
  ['Бесплатно','ИИ-анализатор лица']
]

export default function RUHomePage() {
  return (
    <>
      <Navbar />
      <header className="hero">
        <div className="container">
          <span className="hero-eyebrow">🔥 Вирально на Twitch в 2026</span>
          <h1>Your Ultimate Guide to <em>Omoggle</em>,<br/>Моггинг & Луксмаксинг</h1>
          <p className="hero-sub">Бесплатный ИИ-анализатор лица, объяснение PSL Scale, тировые рейтинги и экспертные советы по победе в Omoggle.</p>
          <div className="hero-actions">
            <Link href="/ru/tools" className="btn btn-primary">Анализировать лицо с ИИ</Link>
            <Link href="/ru/what-is-omoggle" className="btn btn-outline">Что такое Omoggle? →</Link>
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
            <span className="section-label">Бесплатные инструменты</span>
            <h2>ИИ-инструменты луксмаксинга</h2>
          </div>
          <div className="grid-2">
            <article className="tool-card">
              <div className="tool-icon">◈</div>
              <span className="tool-badge free">Бесплатно</span>
              <h3>ИИ-анализатор лица</h3>
              <p style={{fontSize:'.88rem',color:'var(--text-muted)',flex:1}}>Загрузите фото и получите подробный MogScore с оценкой 6 метрик лица и персональными советами.</p>
              <Link href="/ru/tools" className="btn btn-primary" style={{textAlign:'center',marginTop:'1rem'}}>Анализировать моё лицо →</Link>
            </article>
            <article className="tool-card">
              <div className="tool-icon">⚡</div>
              <span className="tool-badge new">Новое</span>
              <h3>Мог-баттл 1v1</h3>
              <p style={{fontSize:'.88rem',color:'var(--text-muted)',flex:1}}>Загрузите два фото и пусть ИИ решит, кто могнул кого. Идеально для споров с друзьями.</p>
              <Link href="/ru/tools#battle" className="btn btn-outline" style={{textAlign:'center',marginTop:'1rem'}}>Начать баттл →</Link>
            </article>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Последние статьи</span>
            <h2>Избранные гайды & Новости</h2>
          </div>
          <div className="grid-3" style={{marginBottom:'var(--sp-lg)'}}>
            {featuredArticles.map((a, i) => (
              <article className="card" key={i}>
                {a.img && <img src={a.img} alt={a.title} className="card-img" width="600" height="338" loading="lazy" />}
                <div className="card-body">
                  <span className="card-tag">{a.tag}</span>
                  <a href={`/ru/${['what-is-omoggle','psl-scale-explained','how-to-win-omoggle','hunter-eyes-guide','face-fat-loss-guide','looksmaxxing-results-timeline'][i]}`} className="card-title">{a.title}</a>
                  <p className="card-excerpt">{a.desc}</p>
                </div>
              </article>
            ))}
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:'8px',marginBottom:'var(--sp-lg)'}}>
            {allArticles.map((a, i) => (
              <a href={`/ru/${['softmaxxing-vs-hardmaxxing','facial-symmetry-improvement','is-omoggle-ai','omoggle-fake-sites','omoggle-tier-list-2026','agent00-omoggle','jasontheween-omoggle','xqc-omoggle','asmongold-omoggle','clavicular-mogged','omoggle-elo-system','omoggle-vs-omegle','looksmaxxing-guide','canthal-tilt-guide','mewing-guide','jawline-guide','skincare-looksmaxxing','gym-face-guide','sleep-looksmaxxing','haircut-looksmaxxing'][i]}`} key={i} className="article-row-item">
                <div style={{display:'flex',alignItems:'center',gap:'.75rem',minWidth:0}}>
                  {a.img && <img src={a.img} alt={a.title} style={{width:60,height:42,objectFit:'cover',borderRadius:'var(--r-sm)',flexShrink:0}} loading="lazy" />}
                  <div style={{minWidth:0}}>
                    <span className="card-tag" style={{marginBottom:'.25rem',display:'inline-block'}}>{a.tag}</span>
                    <div style={{fontSize:'.9rem',color:'var(--text)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{a.title}</div>
                  </div>
                </div>
                <span style={{fontSize:'.78rem',color:'var(--text-dim)',flexShrink:0}}>{a.date}</span>
              </a>
            ))}
          </div>
          <div style={{textAlign:'center'}}>
            <Link href="/ru/blog" className="btn btn-outline">Все статьи →</Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
