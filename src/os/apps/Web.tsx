import { useState } from 'react'
import { profile, skills } from '../../data/cv'
import { ui } from '../../i18n'
import { haptic, useOS, useT } from '../../store'
import { Glyph } from '../icons'

// Telefonun içinde küçük bir tarayıcı: frontend tarafını gösteren mini bir web sitesi

const likeSource = `function LikeButton() {
  const [likes, setLikes] = useState(0)
  return (
    <button onClick={() => setLikes(likes + 1)}>
      ❤️ {likes}
    </button>
  )
}`

function LikeButton() {
  const [likes, setLikes] = useState(0)
  const [pop, setPop] = useState(0)
  return (
    <button
      className="w-like"
      onClick={() => {
        haptic()
        setLikes(likes + 1)
        setPop((p) => p + 1)
      }}
    >
      <span key={pop} className="w-like-heart">
        ❤️
      </span>{' '}
      {likes}
    </button>
  )
}

type Variant = 'primary' | 'outline' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

function Seg<T extends string>({ value, options, onChange }: { value: T; options: T[]; onChange: (v: T) => void }) {
  return (
    <span className="w-seg">
      {options.map((o) => (
        <button key={o} className={o === value ? 'on' : ''} onClick={() => onChange(o)}>
          {o}
        </button>
      ))}
    </span>
  )
}

function Playground() {
  const t = useT()
  const [variant, setVariant] = useState<Variant>('primary')
  const [size, setSize] = useState<Size>('md')
  const [rounded, setRounded] = useState(true)
  const jsx = `<Button variant="${variant}" size="${size}"${rounded ? ' rounded' : ''}>\n  Hire me\n</Button>`

  return (
    <section className="w-card">
      <h3>{t(ui.webPlayground)}</h3>
      <p className="w-muted">{t(ui.webPlaygroundSub)}</p>
      <div className="w-controls">
        <label>
          variant
          <Seg value={variant} options={['primary', 'outline', 'ghost']} onChange={setVariant} />
        </label>
        <label>
          size
          <Seg value={size} options={['sm', 'md', 'lg']} onChange={setSize} />
        </label>
        <label>
          rounded
          <span className={`w-switch ${rounded ? 'on' : ''}`} role="switch" aria-checked={rounded} onClick={() => setRounded(!rounded)}>
            <span />
          </span>
        </label>
      </div>
      <div className="w-stage">
        <button className={`w-btn ${variant} ${size} ${rounded ? 'rounded' : ''}`} onClick={() => haptic()}>
          Hire me
        </button>
      </div>
      <pre className="w-code">
        <Code src={jsx} />
      </pre>
    </section>
  )
}

/** Çok basit JSX renklendirici: string, tag, keyword */
function Code({ src }: { src: string }) {
  const parts = src.split(/("[^"]*"|<\/?[A-Za-z]+|\b(?:function|const|return|useState)\b|\{|\})/g)
  return (
    <code>
      {parts.map((p, i) =>
        /^"/.test(p) ? (
          <span key={i} className="tk-str">
            {p}
          </span>
        ) : /^<\/?[A-Za-z]/.test(p) ? (
          <span key={i} className="tk-tag">
            {p}
          </span>
        ) : /^(function|const|return|useState)$/.test(p) ? (
          <span key={i} className="tk-kw">
            {p}
          </span>
        ) : (
          p
        ),
      )}
    </code>
  )
}

const pageSource = `export default function Portfolio() {
  return (
    <main>
      <Hero kicker="Mobile & Web" />
      <LiveComponent><LikeButton /></LiveComponent>
      <Playground component={Button} />
      <Toolbox skills={skills.web} />
      <Contact email="${profile.email}" />
    </main>
  )
}`

export function Web() {
  const t = useT()
  const close = useOS((s) => s.close)
  const [source, setSource] = useState(false)
  const [loaded, setLoaded] = useState(false)

  return (
    <div className="web">
      <div className="w-urlbar">
        <button
          className="w-close"
          onClick={() => {
            haptic()
            close()
          }}
          aria-label={t(ui.back)}
        >
          {Glyph.chevron()}
        </button>
        <span className="w-url">
          <span className="w-lock">🔒</span> localhost:5173
        </span>
        <button
          className={`w-src ${source ? 'on' : ''}`}
          onClick={() => {
            haptic()
            setSource(!source)
          }}
          aria-label={t(source ? ui.hideSource : ui.viewSource)}
        >
          {'</>'}
        </button>
        <span className={`w-progress ${loaded ? 'done' : ''}`} onAnimationEnd={() => setLoaded(true)} />
      </div>

      {source ? (
        <div className="w-page">
          <p className="w-muted">{t(ui.viewSource)} · Portfolio.tsx</p>
          <pre className="w-code big">
            <Code src={pageSource} />
          </pre>
        </div>
      ) : (
        <div className="w-page">
          <header className="w-nav">
            <b>
              MA<span>.</span>
            </b>
            <span className="w-pill">{t(profile.focus)}</span>
          </header>

          <section className="w-hero">
            <span className="w-kicker">{t(ui.webHeroKicker)}</span>
            <h1>{t(ui.webHeroTitle)}</h1>
            <p>{t(ui.webHeroSub)}</p>
          </section>

          <section className="w-card">
            <h3>{t(ui.webLive)}</h3>
            <p className="w-muted">{t(ui.webLiveSub)}</p>
            <pre className="w-code">
              <Code src={likeSource} />
            </pre>
            <div className="w-stage">
              <span className="w-stage-label">{t(ui.webPreview)}</span>
              <LikeButton />
            </div>
          </section>

          <Playground />

          <section className="w-card">
            <h3>{t(ui.webSkills)}</h3>
            <div className="w-tools">
              {[...skills.web, ...skills.shared].map((s) => (
                <span key={s} className={`w-tool tool-${s.toLowerCase().replace(/[^a-z]/g, '')}`}>
                  {s}
                </span>
              ))}
            </div>
          </section>

          <section className="w-card dark">
            <h3>{t(ui.webThisSite)}</h3>
            <p>{t(ui.webThisSiteBody)}</p>
          </section>

          <a className="w-cta" href={`mailto:${profile.email}`} onClick={() => haptic()}>
            {t(ui.webContact)} →
          </a>
          <footer className="w-foot">© {new Date().getFullYear()} {profile.name}</footer>
        </div>
      )}
    </div>
  )
}
