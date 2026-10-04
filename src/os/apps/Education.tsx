import { education } from '../../data/cv'
import { appNames, ui } from '../../i18n'
import { useT } from '../../store'
import { NavBar } from '../AppHost'
import { Glyph } from '../icons'

export function Education() {
  const t = useT()
  return (
    <div className="education">
      <NavBar title={t(appNames.education)} />
      <div className="diploma">
        <span className="diploma-icon">{Glyph.education()}</span>
        <h2>{t(education.school)}</h2>
        <p>{t(education.degree)}</p>
        <div className="diploma-meta">
          <span>
            {Glyph.pin()} {education.location}
          </span>
          <span>
            {t(ui.degree)} · <b>{education.year}</b>
          </span>
        </div>
      </div>
    </div>
  )
}
