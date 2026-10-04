import { useEffect, useState, type ReactNode } from 'react'
import { appNames, ui } from '../i18n'
import { haptic, useOS, useT, type AppId } from '../store'
import { Glyph } from './icons'
import { About } from './apps/About'
import { Career } from './apps/Career'
import { Settings } from './apps/Settings'
import { Education } from './apps/Education'
import { Messages } from './apps/Messages'
import { Terminal } from './apps/Terminal'
import { Web } from './apps/Web'

const apps: Record<AppId, () => ReactNode> = {
  about: About,
  career: Career,
  settings: Settings,
  education: Education,
  messages: Messages,
  terminal: Terminal,
  web: Web,
}

/** iOS tarzı başlık çubuğu; uygulamalar içinde kullanılır */
export function NavBar({ title, large = true, right }: { title: string; large?: boolean; right?: ReactNode }) {
  const t = useT()
  const close = useOS((s) => s.close)
  return (
    <>
      <div className="navbar">
        <button
          className="nav-back"
          onClick={() => {
            haptic()
            close()
          }}
        >
          {Glyph.chevron()}
          <span>{t(ui.back)}</span>
        </button>
        {!large && <b className="nav-title">{title}</b>}
        <span className="nav-right">{right}</span>
      </div>
      {large && <h1 className="large-title">{title}</h1>}
    </>
  )
}

export function AppHost() {
  const { app, origin } = useOS()
  const [shown, setShown] = useState<AppId | null>(app)
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    if (app) {
      setShown(app)
      setClosing(false)
    } else if (shown) {
      setClosing(true)
      const id = setTimeout(() => {
        setShown(null)
        setClosing(false)
      }, 320)
      return () => clearTimeout(id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [app])

  if (!shown) return null
  const Content = apps[shown]
  return (
    <div
      key={shown}
      className={`app-window app-${shown} ${closing ? 'closing' : ''}`}
      style={{ transformOrigin: `${origin.x}px ${origin.y}px` }}
      role="dialog"
      aria-label={appNames[shown].en}
    >
      <div className="app-scroll">
        <Content />
      </div>
    </div>
  )
}
