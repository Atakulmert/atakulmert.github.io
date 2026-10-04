import type { MouseEvent, ReactNode } from 'react'
import { jobs, profile, skills } from '../data/cv'
import { appNames, ui } from '../i18n'
import { haptic, useOS, useT, type AppId } from '../store'
import { Glyph, iconBg } from './icons'

function AppIcon({ id, label, onPress, href, children }: { id: string; label?: string; onPress?: (e: MouseEvent<HTMLElement>) => void; href?: string; children: ReactNode }) {
  const inner = (
    <>
      <span className="app-icon" style={{ background: iconBg[id] }}>
        {children}
      </span>
      {label && <span className="app-label">{label}</span>}
    </>
  )
  return href ? (
    <a className="app" href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" onClick={() => haptic()}>
      {inner}
    </a>
  ) : (
    <button className="app" onClick={onPress}>
      {inner}
    </button>
  )
}

export function HomeScreen({ hidden }: { hidden: boolean }) {
  const t = useT()
  const open = useOS((s) => s.open)
  // Aktif bir iş yoksa en son iş "Son rol" olarak gösterilir
  const current = jobs.find((j) => j.current) ?? jobs[0]

  // İkonun ekran içindeki merkezini bul → uygulama oradan büyüyerek açılsın
  const launch = (id: AppId) => (e: MouseEvent<HTMLElement>) => {
    haptic()
    const icon = (e.currentTarget.querySelector('.app-icon') ?? e.currentTarget) as HTMLElement
    const screen = icon.closest('.screen') as HTMLElement
    let x = icon.offsetWidth / 2
    let y = icon.offsetHeight / 2
    for (let el: HTMLElement | null = icon; el && el !== screen; el = el.offsetParent as HTMLElement | null) {
      x += el.offsetLeft
      y += el.offsetTop
    }
    open(id, { x, y })
  }

  const stack = [
    ...skills.mobile.slice(0, 4).map((name) => ({ name, icon: '📱' })),
    ...skills.web.map((name) => ({ name, icon: '🌐' })),
    ...skills.shared.map((name) => ({ name, icon: '⚡' })),
  ]
  const grid: AppId[] = ['about', 'career', 'education', 'settings', 'web']

  return (
    <div className={`home ${hidden ? 'hidden' : ''}`} aria-hidden={hidden}>
      <button className="widget widget-profile" onClick={launch('about')}>
        <img src={profile.photo} alt={profile.name} />
        <span className="wp-text">
          <b>{profile.name}</b>
          <span>{t(profile.title)}</span>
          <span className="wp-meta">
            {Glyph.pin()} {t(profile.location)}
          </span>
          <span className="status-pill">
            <span className="pulse-dot" /> {t(profile.status)}
          </span>
        </span>
      </button>

      <div className="widget-row">
        <button className="widget widget-small widget-role" onClick={launch('career')}>
          <span className="ws-label">{t(current.current ? ui.widgetRole : ui.widgetLastRole)}</span>
          <b className="ws-company">{current.company}</b>
          <span className="ws-sub">{t(current.role)}</span>
          <span className="ws-since">
            {t(current.start)} — {t(current.end)}
          </span>
        </button>
        <button className="widget widget-small widget-exp" onClick={launch('settings')}>
          <span className="ws-label">{t(ui.widgetExp)}</span>
          <span className="ring">
            <svg viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.5" className="ring-bg" />
              <circle cx="18" cy="18" r="15.5" className="ring-fg" />
            </svg>
            <b>5+</b>
          </span>
          <span className="ws-sub">{t(ui.years)} · React Native</span>
        </button>
      </div>

      <div className="grid">
        {grid.map((id) => (
          <AppIcon key={id} id={id} label={t(appNames[id])} onPress={launch(id)}>
            {Glyph[id]()}
          </AppIcon>
        ))}
      </div>

      {/* Kayan tech stack bandı (marquee); liste iki kez yazılır ki döngü kesintisiz olsun */}
      <button className="widget widget-stack" onClick={launch('settings')} aria-label="Tech stack">
        <span className="ws-label">Tech stack</span>
        <span className="marquee">
          <span className="marquee-track">
            {[0, 1].map((k) => (
              <span key={k} className="stack-chips" aria-hidden={k === 1}>
                {stack.map((s) => (
                  <span key={s.name}>
                    {s.icon} {s.name}
                  </span>
                ))}
              </span>
            ))}
          </span>
        </span>
      </button>

      <div className="page-dots">
        <span className="on" />
        <span />
      </div>

      <div className="dock">
        <AppIcon id="messages" onPress={launch('messages')}>
          {Glyph.messages()}
        </AppIcon>
        <AppIcon id="mail" href={`mailto:${profile.email}`}>
          {Glyph.mail()}
        </AppIcon>
        <AppIcon id="linkedin" href={profile.linkedin}>
          {Glyph.linkedin()}
        </AppIcon>
        <AppIcon id="terminal" onPress={launch('terminal')}>
          {Glyph.terminal()}
        </AppIcon>
      </div>
    </div>
  )
}
