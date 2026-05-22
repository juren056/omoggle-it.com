'use client'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const featuredArticles = [
  {tag:'Wiki',img:'/images/what-is-omoggle.jpg',title:'Omoggleとは？2026年完全ガイド',desc:'バイラルAIフェイス評価プラットフォームの解説 — 仕組み、ティアリスト、ストリーマーと勝ち方。'},
{tag:'参考',img:'/images/psl-scale.jpg',title:'PSLスケール解説：1〜10ランク',desc:'OmoggleのAIスコアリングの基盤となる1〜10スケール。各数字の意味を解説。'},
{tag:'戦略',img:'/images/how-to-win-omoggle.jpg',title:'Omoggleで勝つ方法：7つのコツ',desc:'カメラアングル、照明、背景 — スコアを1.5〜2ポイント上げるセットアップ要因。'},
{tag:'ガイド',img:'/images/canthal-tilt.jpg',title:'ハンターアイズ：入手方法ガイド',desc:'ルックスマックスで最も議論されるフィーチャー — 現実的に目元を改善する方法。'},
{tag:'ガイド',img:'/images/gym-face.jpg',title:'顔の脂肪を落とす：顎ラインを際立たせる',desc:'ROIが最も高いルックスマックス介入。タイムラインと最も効果的なアプローチ。'},
{tag:'ガイド',img:'/images/looksmaxxing-guide.jpg',title:'ルックスマックス結果タイムライン',desc:'正直なタイムライン：スキンケア4〜6週間。体脂肪8〜16週間。ミューイングは数ヶ月〜年単位。'}
]

const allArticles = [
  {tag:'ガイド',img:'/images/looksmaxxing-guide.jpg',title:'ソフトマックス vs ハードマックス',date:'5月17日'},
{tag:'ガイド',img:null,title:'顔の対称性を改善する方法',date:'5月17日'},
{tag:'調査',img:null,title:'OmoggleはAI？開発者が回答',date:'5月14日'},
{tag:'警告',img:null,title:'Omoggle偽サイト：見分け方',date:'5月14日'},
{tag:'更新',img:null,title:'2026年ティアリスト：Adamランク含む全9ランク',date:'5月14日'},
{tag:'ニュース',img:null,title:'Agent00が付け額で出場して勝利',date:'5月14日'},
{tag:'ニュース',img:null,title:'JasontheweenとCORE Boysのバトル',date:'5月14日'},
{tag:'ニュース',img:'/images/xqc-omoggle.jpg',title:'xQcが6連敗',date:'5月5日'},
{tag:'ニュース',img:'/images/asmongold-omoggle.jpg',title:'Asmongoldのスコアとハイライト',date:'5月5日'},
{tag:'ニュース',img:'/images/clavicular-mogged.jpg',title:'Clavicularがモグられてラージクイット',date:'5月5日'},
{tag:'Wiki',img:'/images/elo-system.jpg',title:'Omoggle ELOシステム解説',date:'5月3日'},
{tag:'Wiki',img:'/images/omoggle-vs-omegle.jpg',title:'Omoggle vs Omegle：違いは？',date:'5月3日'},
{tag:'ガイド',img:'/images/looksmaxxing-guide.jpg',title:'初心者のためのルックスマックスガイド',date:'5月1日'},
{tag:'ガイド',img:'/images/canthal-tilt.jpg',title:'カンタールチルトガイド',date:'5月1日'},
{tag:'ガイド',img:'/images/mewing-guide.jpg',title:'ミューイングガイド：効果はある？',date:'5月1日'},
{tag:'ガイド',img:'/images/jawline-gym.jpg',title:'顎ラインガイド：シャープな顎の作り方',date:'5月1日'},
{tag:'ガイド',img:'/images/skincare-looksmaxx.jpg',title:'ルックスマックスのスキンケア',date:'4月28日'},
{tag:'ガイド',img:'/images/gym-face.jpg',title:'ジムフェイスガイド',date:'4月28日'},
{tag:'ガイド',img:'/images/sleep-looksmaxxing.jpg',title:'睡眠とルックスマックス',date:'4月28日'},
{tag:'ガイド',img:'/images/haircut-looksmaxxing.jpg',title:'ルックスマックスに最適なヘアカット',date:'4月25日'}
]

const stats = [
  ['50K+','月間訪問者'],
  ['54','ガイド & 記事'],
  ['9','ELOティア解説'],
  ['無料','AIフェイスアナライザー']
]

export default function JAHomePage() {
  return (
    <>
      <Navbar />
      <header className="hero">
        <div className="container">
          <span className="hero-eyebrow">🔥 Twitchでバイラル中 2026</span>
          <h1>Your Ultimate Guide to <em>Omoggle</em>,<br/>モギング & ルックスマックスの完全ガイド</h1>
          <p className="hero-sub">無料AIフェイスアナライザー、PSLスケール解説、ティアランキングとOmoggleで勝つためのプロのコツ。</p>
          <div className="hero-actions">
            <Link href="/ja/tools" className="btn btn-primary">AIフェイスアナライザーを試す</Link>
            <Link href="/ja/what-is-omoggle" className="btn btn-outline">Omoggleとは？ →</Link>
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
            <span className="section-label">無料ツール</span>
            <h2>AI搭載ルックスマックスツール</h2>
          </div>
          <div className="grid-2">
            <article className="tool-card">
              <div className="tool-icon">◈</div>
              <span className="tool-badge free">無料</span>
              <h3>AIフェイスアナライザー</h3>
              <p style={{fontSize:'.88rem',color:'var(--text-muted)',flex:1}}>写真をアップロードして、6つの顔指標の詳細なMogScoreとルックスマックスのアドバイスを取得。</p>
              <Link href="/ja/tools" className="btn btn-primary" style={{textAlign:'center',marginTop:'1rem'}}>顔を分析する →</Link>
            </article>
            <article className="tool-card">
              <div className="tool-icon">⚡</div>
              <span className="tool-badge new">新着</span>
              <h3>1v1 モグバトル</h3>
              <p style={{fontSize:'.88rem',color:'var(--text-muted)',flex:1}}>2枚の写真をアップロードしてAIが判定。友達との対決に最適。</p>
              <Link href="/ja/tools#battle" className="btn btn-outline" style={{textAlign:'center',marginTop:'1rem'}}>バトルを開始する →</Link>
            </article>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <span className="section-label">最新記事</span>
            <h2>注目ガイド & ニュース</h2>
          </div>
          <div className="grid-3" style={{marginBottom:'var(--sp-lg)'}}>
            {featuredArticles.map((a, i) => (
              <article className="card" key={i}>
                {a.img && <img src={a.img} alt={a.title} className="card-img" width="600" height="338" loading="lazy" />}
                <div className="card-body">
                  <span className="card-tag">{a.tag}</span>
                  <a href={`/ja/${['what-is-omoggle','psl-scale-explained','how-to-win-omoggle','hunter-eyes-guide','face-fat-loss-guide','looksmaxxing-results-timeline'][i]}`} className="card-title">{a.title}</a>
                  <p className="card-excerpt">{a.desc}</p>
                </div>
              </article>
            ))}
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:'8px',marginBottom:'var(--sp-lg)'}}>
            {allArticles.map((a, i) => (
              <a href={`/ja/${['softmaxxing-vs-hardmaxxing','facial-symmetry-improvement','is-omoggle-ai','omoggle-fake-sites','omoggle-tier-list-2026','agent00-omoggle','jasontheween-omoggle','xqc-omoggle','asmongold-omoggle','clavicular-mogged','omoggle-elo-system','omoggle-vs-omegle','looksmaxxing-guide','canthal-tilt-guide','mewing-guide','jawline-guide','skincare-looksmaxxing','gym-face-guide','sleep-looksmaxxing','haircut-looksmaxxing'][i]}`} key={i} className="article-row-item">
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
            <Link href="/ja/blog" className="btn btn-outline">すべての記事を見る →</Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
