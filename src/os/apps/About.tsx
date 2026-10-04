import { profile } from '../../data/cv'
import { appNames, ui } from '../../i18n'
import { haptic, useT } from '../../store'
import { NavBar } from '../AppHost'
import { Glyph } from '../icons'

export function About() {
  const t = useT()
  return (
    <div className="about">
      <NavBar title={t(appNames.about)} large={false} />
      <div className="contact-hero">
        <img src={profile.photo} alt={profile.name} className="contact-photo" />
        <h2>{profile.name}</h2>
        <p>{t(profile.title)}</p>
        <p className="muted">
          {Glyph.pin()} {t(profile.location)}
        </p>
      </div>

      <div className="contact-actions">
        <a href={`mailto:${profile.email}`} onClick={() => haptic()}>
          {Glyph.mail()}
          <span>{t(ui.email)}</span>
        </a>
        <a href={profile.linkedin} target="_blank" rel="noreferrer" onClick={() => haptic()}>
          {Glyph.linkedin()}
          <span>LinkedIn</span>
        </a>
        {profile.showPhone && (
          <a href={`tel:${profile.phone.replace(/\s/g, '')}`} onClick={() => haptic()}>
            {Glyph.phone()}
            <span>{t(ui.call)}</span>
          </a>
        )}
      </div>

      <section className="card">
        <h3>{t(ui.about)}</h3>
        <p>{t(profile.summary)}</p>
      </section>

      <h3 className="section-label">{t(ui.stats)}</h3>
      <div className="stats">
        {profile.stats.map((s) => (
          <div key={s.value + s.label.en} className="stat">
            <b>{s.value}</b>
            <span>{t(s.label)}</span>
          </div>
        ))}
      </div>

      <section className="card list">
        <div className="row">
          <span className="muted">{t(ui.email)}</span>
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
        </div>
        <div className="row">
          <span className="muted">LinkedIn</span>
          <a href={profile.linkedin} target="_blank" rel="noreferrer">
            {profile.linkedin.replace('https://', '')}
          </a>
        </div>
        {profile.showPhone && (
          <div className="row">
            <span className="muted">{t(ui.call)}</span>
            <a href={`tel:${profile.phone.replace(/\s/g, '')}`}>{profile.phone}</a>
          </div>
        )}
      </section>
    </div>
  )
}
