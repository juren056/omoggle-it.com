import Navbar from '@/components/Navbar'
import { cleanInternalHtmlLinks } from '@/lib/html-links'
import Footer from '@/components/Footer'
import Link from 'next/link'

export const metadata = {
  title: 'PSL шкала: что это и как оценивают лицо от 1 до 10 | MogScore',
  description: 'Что такое PSL шкала простыми словами: ранги от 1 до 10, термины LTN, MTN, HTN, Chadlite, как ИИ Omoggle считает балл и почему угол съёмки меняет результат.',
  alternates: {
    canonical: 'https://omoggle-it.com/ru/psl-scale-explained',
    languages: {
      en: 'https://omoggle-it.com/psl-scale-explained',
      ru: 'https://omoggle-it.com/ru/psl-scale-explained',
    },
  },
}

const articleContent = `<img src="/images/psl-scale.jpg" alt="PSL шкала от 1 до 10 с описанием рангов и тиров привлекательности" width="900" height="500" style="width:100%;border-radius:var(--r-lg);margin-bottom:var(--sp-md);border:1px solid var(--border);" loading="eager">

      <p>PSL шкала — это система оценки привлекательности лица от 1 до 10, которая пришла из сообществ луксмаксинга. Её же использует ИИ <a href="/ru/what-is-omoggle">Omoggle</a>, чтобы за секунды выставить лицу балл. Ниже разбираем, что означает каждый ранг, чем ИИ-оценка отличается от мнения живого человека и почему один и тот же человек может получить разный балл на разных фото.</p>

      <h2>Что такое PSL шкала простыми словами</h2>
      <p>PSL расшифровывается как <strong>PUAHate, Sluthate, Lookism</strong> — это старые форумы, где и сложилась единая шкала оценки внешности. Сегодня аббревиатуру чаще понимают как «Physical, Status, Looks». Суть одна: лицо оценивают по измеримым признакам — симметрия, пропорции, линия челюсти, скулы, область глаз — и переводят это в число от 1 до 10.</p>
      <p>Важно понимать: PSL — это не строгий медицинский стандарт, а условная система координат сообщества. Она полезна как ориентир, но не как приговор.</p>

      <h2>Ранги от 1 до 10 и реальные тиры</h2>
      <p>На практике почти все люди попадают в диапазон 4–7. Крайние значения (1–2 и 9–10) встречаются редко и в основном теоретические.</p>
      <h3>1–3 — Sub3 / «Molecule»</h3>
      <p>Сильная асимметрия, слабая линия челюсти или выраженный отрицательный <a href="/ru/canthal-tilt-guide">кантальный наклон</a>. В Omoggle такие баллы чаще означают неудачный ракурс и плохой свет, а не реальные черты лица.</p>
      <h3>4–5 — LTN и MTN (Low/Mid Tier Normie)</h3>
      <p>Самый частый диапазон. Средние черты, приемлемая симметрия. Это хорошая база для <a href="/ru/looksmaxxing-guide">луксмаксинга</a>: за счёт ухода за кожей, тренировок и правильной подачи балл реально поднять.</p>
      <h3>6–7 — HTN и Chadlite (High Tier Normie)</h3>
      <p>Заметно выше среднего. Положительный кантальный наклон, чёткая челюсть, высокая симметрия. Chadlite (7.0+) — это верхний ранг, который реально встречается в таблице лидеров Omoggle.</p>
      <h3>8–10 — Chad и Slayer</h3>
      <p>Теоретический потолок шкалы. На момент 2026 года подтверждённых игроков с рангом Chad или Slayer в Omoggle нет.</p>

      <h2>Чем ИИ-оценка отличается от мнения человека</h2>
      <p>Живой человек оценивает лицо целиком: харизму, мимику, стиль, голос, контекст. ИИ так не умеет. Он анализирует статичное фото и измеряет геометрию — расстояния, углы, симметрию, чёткость кожи. Поэтому ИИ-балл:</p>
      <ul>
        <li>стабильнее и без личных симпатий, но «слепой» к обаянию и движению;</li>
        <li>сильно зависит от качества фото — ракурса, света, разрешения;</li>
        <li>это ориентир и развлечение, а не объективная истина о вашей внешности.</li>
      </ul>

      <h2>Почему угол съёмки так сильно меняет балл</h2>
      <p>Один и тот же человек легко получает разброс в 1,5–2 балла только из-за фото. Причины простые:</p>
      <ul>
        <li><strong>Высота камеры.</strong> Съёмка чуть выше уровня глаз подчёркивает положительный кантальный наклон и визуально усиливает челюсть.</li>
        <li><strong>Свет.</strong> Мягкий боковой свет проявляет структуру лица; верхний жёсткий свет даёт тени и «съедает» черты.</li>
        <li><strong>Ракурс и наклон головы.</strong> Прямое фото анфас читается ИИ точнее, чем снимок снизу или в три четверти.</li>
        <li><strong>Резкость.</strong> На размытом фото ИИ хуже находит ориентиры и занижает чистоту кожи.</li>
      </ul>
      <p>Поэтому прежде чем делать выводы о своём PSL, стоит проверить несколько нормальных фото при разном освещении.</p>

      <h2>Как узнать свой PSL балл</h2>
      <p>Проще всего — загрузить фото в бесплатный ИИ-анализатор. Он разложит результат по 6 метрикам (симметрия, кантальный наклон, челюсть, скулы, чистота кожи, общая гармония) и покажет ваш ранг по PSL шкале за пару секунд, без регистрации.</p>
      <div class="highlight-box"><p>Проверьте свой балл прямо сейчас — <a href="/ru/tools"><strong>бесплатный ИИ-анализатор лица</strong></a>. Загрузите фото и получите оценку от 1 до 10.</p></div>`

export default function Page() {
  return (
    <>
      <Navbar />
      <header style={{padding:'var(--sp-lg) 0 var(--sp-sm)',borderBottom:'1px solid var(--border)'}}>
        <div className="container-sm">
          <nav style={{fontSize:'.82rem',color:'var(--text-muted)',marginBottom:'.75rem'}}>
            <Link href="/ru" style={{color:'var(--gold)'}}>Главная</Link>
            <span style={{margin:'0 .5rem'}}>›</span>
            <a href="/blog" style={{color:'var(--gold)'}}>Блог</a>
            <span style={{margin:'0 .5rem'}}>›</span>
            <span>Справка</span>
          </nav>
          <span className="card-tag">Справка</span>
          <h1 style={{marginTop:'.75rem'}}>PSL шкала: что означает каждая оценка от 1 до 10</h1>
          <p style={{color:'var(--text-muted)',fontSize:'.85rem',marginTop:'.5rem'}}>Обновлено: май 2026</p>
        </div>
      </header>
      <main className="section">
        <div className="container-sm">
          <article className="article-content" dangerouslySetInnerHTML={{ __html: cleanInternalHtmlLinks(articleContent) }} />
          <aside style={{marginTop:'var(--sp-lg)',paddingTop:'var(--sp-md)',borderTop:'1px solid var(--border)'}}>
            <h2 style={{fontSize:'1.2rem',marginBottom:'var(--sp-sm)'}}>Похожие статьи</h2>
            <div style={{display:'flex',flexWrap:'wrap',gap:'.5rem'}}>
              <Link href="/ru" className="tag">Главная</Link>
              <Link href="/ru/tools" className="tag">ИИ-анализатор лица →</Link>
              <Link href="/ru/what-is-omoggle" className="tag">Что такое Omoggle</Link>
              <Link href="/ru/looksmaxxing-guide" className="tag">Гайд по луксмаксингу</Link>
              <Link href="/ru/canthal-tilt-guide" className="tag">Кантальный наклон</Link>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  )
}
