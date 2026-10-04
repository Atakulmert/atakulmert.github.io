import { useEffect, useRef, useState } from 'react'
import { profile } from './data/cv'
import { ui } from './i18n'
import { PhoneOS, SCREEN_PX } from './os/PhoneOS'
import { haptic, useOS, useT } from './store'
import { attachControls } from './three/controls'
import { isCompact, Scene } from './three/Scene'
import './styles.css'

const hasWebGL = () => {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

const useWidth = () => {
  const [w, setW] = useState(() => window.innerWidth)
  useEffect(() => {
    const on = () => setW(window.innerWidth)
    window.addEventListener('resize', on)
    return () => window.removeEventListener('resize', on)
  }, [])
  return w
}

function Hud() {
  const t = useT()
  const { lang, setLang, flipped, flip, locked } = useOS()
  const compact = isCompact(useWidth())
  // Mobilde kilit açılınca ekran tamamen telefona ait; HUD gizlenir
  const hidden = compact && !locked

  return (
    <div className={`hud ${hidden ? 'hud-hidden' : ''}`}>
      <header className="hud-top">
        <div className="hud-name">
          <b>{profile.name}</b>
          <span>
            {t(profile.title)} · {t(profile.focus)}
          </span>
        </div>
        <div className="hud-actions">
          <div className="lang-toggle" role="group" aria-label={t(ui.language)}>
            {(['tr', 'en'] as const).map((l) => (
              <button key={l} className={lang === l ? 'on' : ''} onClick={() => setLang(l)}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <button
            className="flip-btn"
            onClick={() => {
              haptic()
              flip()
            }}
          >
            ↻ {t(flipped ? ui.flipBack : ui.flip)}
          </button>
        </div>
      </header>
      <p className="hud-hint">
        {t(ui.hintDrag)} · {t(ui.hintTap)}
      </p>
    </div>
  )
}

function Fallback() {
  const t = useT()
  // 3D yoksa aynı arayüzü düz bir CSS telefon çerçevesinde göster
  const fit = () => Math.min(1, (window.innerHeight - 80) / (SCREEN_PX.h + 28), (window.innerWidth - 32) / (SCREEN_PX.w + 28))
  const [scale, setScale] = useState(fit)
  useEffect(() => {
    const on = () => setScale(fit())
    window.addEventListener('resize', on)
    return () => window.removeEventListener('resize', on)
  }, [])
  return (
    <div className="fallback">
      <div className="css-phone" style={{ transform: `scale(${scale})` }}>
        <PhoneOS />
      </div>
      <p className="fallback-note">{t(ui.fallbackNote)}</p>
    </div>
  )
}

export default function App() {
  const stage = useRef<HTMLDivElement>(null)
  const [webgl] = useState(hasWebGL)
  const lang = useOS((s) => s.lang)

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  useEffect(() => {
    if (webgl && stage.current) return attachControls(stage.current)
  }, [webgl])

  if (!webgl) return <Fallback />

  return (
    <div ref={stage} className="stage">
      <Scene portal={stage} />
      <Hud />
    </div>
  )
}
