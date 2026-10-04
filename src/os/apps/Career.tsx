import { useState } from 'react'
import { earlier, jobs } from '../../data/cv'
import { appNames, ui } from '../../i18n'
import { haptic, useT } from '../../store'
import { NavBar } from '../AppHost'

// Wallet tarzı üst üste binmiş kartlar: dokununca kart açılır
export function Career() {
  const t = useT()
  const [sel, setSel] = useState<number | null>(0)

  return (
    <div className="career">
      <NavBar title={t(appNames.career)} />
      <p className="hint">{t(ui.tapCard)}</p>
      <div className="wallet">
        {jobs.map((j, i) => {
          const open = sel === i
          return (
            <button
              key={j.company}
              className={`wcard ${open ? 'open' : ''}`}
              style={{ background: `linear-gradient(150deg, ${j.color}, color-mix(in srgb, ${j.color} 55%, #000))`, zIndex: i }}
              onClick={() => {
                haptic()
                setSel(open ? null : i)
              }}
              aria-expanded={open}
            >
              <span className="wcard-top">
                <b>{j.company}</b>
                <span>
                  {t(j.start)} – {t(j.end)}
                </span>
              </span>
              <span className="wcard-role">
                {t(j.role)}
                {j.current && <em className="badge">{t(ui.current)}</em>}
              </span>
              <span className="wcard-body">
                <span className="wcard-loc">{j.location}</span>
                <ul>
                  {j.bullets.map((b) => (
                    <li key={b.en}>{t(b)}</li>
                  ))}
                </ul>
              </span>
            </button>
          )
        })}
      </div>

      <h3 className="section-label">{t(ui.earlier)}</h3>
      <section className="card list">
        {earlier.map((e) => (
          <div className="row stack" key={e.company}>
            <b>{e.company}</b>
            <span className="muted">
              {t(e.role)} · {e.year}
            </span>
          </div>
        ))}
      </section>
    </div>
  )
}
