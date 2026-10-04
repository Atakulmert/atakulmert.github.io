import { createContext, useContext, useEffect, useLayoutEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
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

// Başlık çubukları kayan içeriğin DIŞINDA, sabit bir katmanda çizilir.
// iOS Safari, 3D dönüşümlü sayfada scroll alanı içindeki sticky elemanlara gelen dokunuşları kaçırabiliyor.
const HeaderSlot = createContext<HTMLElement | null>(null)

/** Çocuklarını uygulamanın sabit başlık katmanına taşır */
export function AppHeader({ children }: { children: ReactNode }) {
  const slot = useContext(HeaderSlot)
  return slot ? createPortal(children, slot) : null
}

/** iOS tarzı başlık çubuğu; uygulamalar içinde kullanılır */
export function NavBar({ title, large = true, right }: { title: string; large?: boolean; right?: ReactNode }) {
  const t = useT()
  const close = useOS((s) => s.close)
  return (
    <>
      <AppHeader>
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
      </AppHeader>
      {large && <h1 className="large-title">{title}</h1>}
    </>
  )
}

export function AppHost() {
  const { app, origin } = useOS()
  const [shown, setShown] = useState<AppId | null>(app)
  const [closing, setClosing] = useState(false)
  const [slot, setSlot] = useState<HTMLDivElement | null>(null)
  const [headerH, setHeaderH] = useState(0)

  // İçerik, başlığın altından başlasın diye başlık yüksekliğini ölç
  useLayoutEffect(() => {
    if (!slot) return
    const measure = () => setHeaderH(slot.offsetHeight)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(slot)
    return () => ro.disconnect()
  }, [slot])

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
      <div className="app-header" ref={setSlot} />
      <div className="app-scroll" style={{ paddingTop: headerH }}>
        <HeaderSlot.Provider value={slot}>
          <Content />
        </HeaderSlot.Provider>
      </div>
    </div>
  )
}
