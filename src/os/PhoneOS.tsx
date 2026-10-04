import { forwardRef, useEffect, useRef, useState, type PointerEvent as RPointerEvent } from 'react'
import { notifications, profile } from '../data/cv'
import { appNames, ui } from '../i18n'
import { haptic, useOS, useT, type AppId } from '../store'
import { requestGyro } from '../three/gyro'
import { Glyph } from './icons'
import { HomeScreen } from './HomeScreen'
import { AppHost } from './AppHost'
import './os.css'

export const SCREEN_PX = { w: 390, h: 844 }

const useClock = () => {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 10_000)
    return () => clearInterval(id)
  }, [])
  return now
}

const fmtTime = (d: Date) => d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })

function StatusBar({ dark }: { dark?: boolean }) {
  const now = useClock()
  return (
    <div className={`statusbar ${dark ? 'dark' : ''}`}>
      <span className="sb-time">{fmtTime(now)}</span>
      <span className="sb-right">
        <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor" aria-hidden>
          <rect x="0" y="8" width="3" height="4" rx="1" />
          <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
          <rect x="10" y="3" width="3" height="9" rx="1" />
          <rect x="15" y="0" width="3" height="12" rx="1" />
        </svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor" aria-hidden>
          <path d="M8 2.2c2.4 0 4.6.9 6.2 2.5l1.2-1.2A10.4 10.4 0 0 0 8 .5 10.4 10.4 0 0 0 .6 3.5l1.2 1.2A8.7 8.7 0 0 1 8 2.2zm0 3.4c1.5 0 2.8.6 3.8 1.5L13 5.9A7 7 0 0 0 8 3.9a7 7 0 0 0-5 2l1.2 1.2c1-.9 2.3-1.5 3.8-1.5zM8 9l-1.8 1.8L8 12.6l1.8-1.8z" />
        </svg>
        <span className="battery">
          <span className="battery-level" />
        </span>
      </span>
    </div>
  )
}

function DynamicIsland() {
  const t = useT()
  const locked = useOS((s) => s.locked)
  const app = useOS((s) => s.app)
  const [open, setOpen] = useState(false)

  // Uygulama açılınca başlığı kapatmasın
  useEffect(() => {
    if (app) setOpen(false)
  }, [app])

  // Kilit açılınca (ana ekrana düşüldüyse) bir kez kendiliğinden genişlesin
  useEffect(() => {
    if (locked || useOS.getState().app) return
    const a = setTimeout(() => setOpen(true), 700)
    const b = setTimeout(() => setOpen(false), 4200)
    return () => {
      clearTimeout(a)
      clearTimeout(b)
    }
  }, [locked])

  return (
    <button
      className={`island ${open ? 'open' : ''}`}
      onClick={() => {
        haptic()
        setOpen((o) => !o)
      }}
      aria-label={t(profile.status)}
    >
      <span className="island-compact">
        <span className="pulse-dot" />
      </span>
      <span className="island-full">
        <img src={profile.photo} alt="" className="island-avatar" />
        <span className="island-text">
          <b>{profile.name}</b>
          <span>
            <span className="pulse-dot" /> {t(profile.status)}
          </span>
        </span>
      </span>
    </button>
  )
}

function LockScreen() {
  const t = useT()
  const now = useClock()
  const { locked, unlock, open, lang } = useOS()
  const [scanning, setScanning] = useState(false)
  const start = useRef<number | null>(null)

  const doUnlock = (then?: AppId) => {
    if (scanning) return
    requestGyro()
    haptic(12)
    setScanning(true)
    setTimeout(() => {
      setScanning(false)
      if (then) open(then)
      else unlock()
    }, 650)
  }

  const onDown = (e: RPointerEvent) => (start.current = e.clientY)
  const onUp = (e: RPointerEvent) => {
    if (start.current !== null && start.current - e.clientY > 40) doUnlock()
    start.current = null
  }

  const date = now.toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div className={`lock ${locked ? '' : 'gone'}`} onPointerDown={onDown} onPointerUp={onUp} aria-hidden={!locked}>
      <div className="lock-date">{date}</div>
      <div className="lock-time">{fmtTime(now)}</div>
      <div className="lock-widget">
        <img src={profile.photo} alt="" />
        <div>
          <b>{profile.name}</b>
          <span>{t(profile.title)}</span>
        </div>
      </div>

      <div className="lock-notifs">
        {notifications.map((n, i) => (
          <button key={i} className="notif" style={{ animationDelay: `${0.6 + i * 0.25}s` }} onClick={() => doUnlock(n.app as AppId)}>
            <span className={`notif-icon ic-${n.app}`}>{Glyph[n.app as keyof typeof Glyph]?.()}</span>
            <span className="notif-body">
              <span className="notif-head">
                <b>{t(n.title)}</b>
                <em>{t(ui.now)}</em>
              </span>
              <span>{t(n.body)}</span>
            </span>
          </button>
        ))}
      </div>

      <div className="lock-bottom">
        <span className="round-btn">{Glyph.flashlight()}</span>
        <button className="unlock-cta" onClick={() => doUnlock()}>
          <span className={`faceid ${scanning ? 'scan' : ''}`}>{Glyph.faceId()}</span>
          <span className="unlock-text">{t(ui.unlock)}</span>
        </button>
        <span className="round-btn">{Glyph.camera()}</span>
      </div>
    </div>
  )
}

function Banner() {
  const t = useT()
  const { locked, app, open } = useOS()
  const [idx, setIdx] = useState<number | null>(null)

  useEffect(() => {
    if (locked || app) {
      setIdx(null)
      return
    }
    let i = 0
    let hide: ReturnType<typeof setTimeout>
    const show = () => {
      setIdx(i % notifications.length)
      i++
      hide = setTimeout(() => setIdx(null), 4000)
    }
    const first = setTimeout(show, 5500)
    const loop = setInterval(show, 16000)
    return () => {
      clearTimeout(first)
      clearTimeout(hide)
      clearInterval(loop)
    }
  }, [locked, app])

  const n = idx === null ? null : notifications[idx]
  return (
    <div className={`banner ${n ? 'show' : ''}`}>
      {n && (
        <button className="notif" onClick={() => open(n.app as AppId)}>
          <span className={`notif-icon ic-${n.app}`}>{Glyph[n.app as keyof typeof Glyph]?.()}</span>
          <span className="notif-body">
            <span className="notif-head">
              <b>{t(n.title)}</b>
              <em>{t(ui.now)}</em>
            </span>
            <span>{t(n.body)}</span>
          </span>
        </button>
      )}
    </div>
  )
}

function HomeIndicator() {
  const { app, close } = useOS()
  const start = useRef<number | null>(null)
  return (
    <div
      className="home-indicator-hit"
      onPointerDown={(e) => (start.current = e.clientY)}
      onPointerUp={(e) => {
        if (app && (start.current === null || start.current - e.clientY > -10)) {
          haptic()
          close()
        }
        start.current = null
      }}
      aria-label="Home"
      role="button"
    >
      <span className={`home-indicator ${app === 'terminal' || app === null ? '' : 'dark'}`} />
    </div>
  )
}

export const PhoneOS = forwardRef<HTMLDivElement>(function PhoneOS(_, ref) {
  const { locked, app, close, lang } = useOS()
  const t = useT()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [close])

  const lightApp = app !== null && app !== 'terminal'

  return (
    <div ref={ref} className="screen" lang={lang} style={{ width: SCREEN_PX.w, height: SCREEN_PX.h }}>
      <div className={`wallpaper ${locked ? '' : 'dim'}`} />
      <HomeScreen hidden={locked} />
      <LockScreen />
      <AppHost />
      <Banner />
      <StatusBar dark={lightApp} />
      <DynamicIsland />
      <HomeIndicator />
      <span className="sr-only" aria-live="polite">
        {app ? t(appNames[app]) : ''}
      </span>
    </div>
  )
})
