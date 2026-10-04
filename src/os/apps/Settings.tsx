import { useState } from 'react'
import { profile, skills } from '../../data/cv'
import { appNames, ui } from '../../i18n'
import { haptic, useOS, useT } from '../../store'
import { NavBar } from '../AppHost'

const palette = ['#0a84ff', '#30d158', '#ff9f0a', '#bf5af2', '#ff375f', '#64d2ff', '#5e5ce6', '#ffd60a']

const abbr = (s: string) =>
  s.length <= 4
    ? s
    : s
    .replace(/[^A-Za-z0-9#+ ]/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

function Toggle({ onNope }: { onNope: () => void }) {
  const [wiggle, setWiggle] = useState(false)
  return (
    <span
      className={`toggle on ${wiggle ? 'wiggle' : ''}`}
      role="switch"
      aria-checked
      onClick={() => {
        haptic(20)
        setWiggle(true)
        onNope()
        setTimeout(() => setWiggle(false), 450)
      }}
    >
      <span className="knob" />
    </span>
  )
}

function SkillRows({ items, offset = 0, onNope }: { items: string[]; offset?: number; onNope: () => void }) {
  return (
    <section className="card list">
      {items.map((s, i) => (
        <div className="row" key={s}>
          <span className="set-icon" style={{ background: palette[(i + offset) % palette.length] }}>
            {abbr(s)}
          </span>
          <span className="row-title">{s}</span>
          <Toggle onNope={onNope} />
        </div>
      ))}
    </section>
  )
}

export function Settings() {
  const t = useT()
  const { lang, setLang } = useOS()
  const [toast, setToast] = useState(false)
  const nope = () => {
    setToast(true)
    setTimeout(() => setToast(false), 1600)
  }

  return (
    <div className="settings">
      <NavBar title={t(appNames.settings)} />

      <section className="card list">
        <div className="row profile-row">
          <img src={profile.photo} alt="" />
          <span className="stack">
            <b>{profile.name}</b>
            <span className="muted">{profile.email}</span>
          </span>
        </div>
      </section>

      <section className="card list">
        <div className="row">
          <span className="set-icon" style={{ background: '#0a84ff' }}>
            🌐
          </span>
          <span className="row-title">{t(ui.language)}</span>
          <span className="segmented">
            {(['tr', 'en'] as const).map((l) => (
              <button
                key={l}
                className={lang === l ? 'on' : ''}
                onClick={() => {
                  haptic()
                  setLang(l)
                }}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </span>
        </div>
      </section>

      <h3 className="section-label">📱 {t(ui.mobile)}</h3>
      <SkillRows items={skills.mobile} onNope={nope} />

      <h3 className="section-label">🌐 {t(ui.web)}</h3>
      <SkillRows items={skills.web} offset={2} onNope={nope} />

      <h3 className="section-label">{t(ui.shared)}</h3>
      <SkillRows items={skills.shared} offset={5} onNope={nope} />

      <h3 className="section-label">{t(ui.spoken)}</h3>
      <section className="card list">
        {skills.languages.map((l) => (
          <div className="row stack" key={l.name.en}>
            <span className="row-split">
              <span className="row-title">{t(l.name)}</span>
              <span className="muted">{t(l.level)}</span>
            </span>
            <span className="bar">
              <span style={{ width: `${l.value * 100}%` }} />
            </span>
          </div>
        ))}
      </section>

      <h3 className="section-label">{t(ui.strengths)}</h3>
      <div className="chips">
        {skills.strengths.map((s) => (
          <span key={s.en} className="chip">
            {t(s)}
          </span>
        ))}
      </div>

      <div className={`toast ${toast ? 'show' : ''}`}>{t(ui.cantDisable)}</div>
    </div>
  )
}
