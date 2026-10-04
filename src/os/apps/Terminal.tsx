import { useEffect, useRef, useState, type FormEvent } from 'react'
import { education, jobs, profile, skills } from '../../data/cv'
import { appNames, ui } from '../../i18n'
import { useOS, useT, type AppId } from '../../store'
import { NavBar } from '../AppHost'

type Line = { kind: 'in' | 'out' | 'accent'; text: string }

const PROMPT = 'mert@pocket ~ %'

export function Terminal() {
  const t = useT()
  const { lang, setLang, open } = useOS()
  const [lines, setLines] = useState<Line[]>([
    { kind: 'accent', text: 'Pocket OS 1.0 — zsh' },
    { kind: 'out', text: t(ui.terminalHint) },
  ])
  const [value, setValue] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [hIdx, setHIdx] = useState(-1)
  const input = useRef<HTMLInputElement>(null)
  const end = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const box = end.current?.closest('.app-scroll')
    box?.scrollTo({ top: box.scrollHeight })
  }, [lines])

  const tr = lang === 'tr'

  const run = (raw: string): Line[] | 'clear' => {
    const [cmd, ...args] = raw.trim().split(/\s+/)
    const out = (...xs: string[]): Line[] => xs.map((text) => ({ kind: 'out', text }))
    switch (cmd?.toLowerCase()) {
      case '':
      case undefined:
        return []
      case 'help':
        return out(
          tr ? 'Komutlar:' : 'Commands:',
          '  whoami        ' + (tr ? 'ben kimim' : 'who am I'),
          '  experience    ' + (tr ? 'iş deneyimi' : 'work history'),
          '  skills        ' + (tr ? 'yetenekler' : 'tech skills'),
          '  education     ' + (tr ? 'eğitim' : 'education'),
          '  contact       ' + (tr ? 'iletişim' : 'contact info'),
          '  open <app>    about | career | settings | education | messages | web',
          '  npm run dev   ' + (tr ? 'dev sunucusunu başlat' : 'start the dev server'),
          '  cat package.json',
          '  git log       ' + (tr ? 'kariyer geçmişi' : 'career history'),
          '  lang tr|en    ' + (tr ? 'dili değiştir' : 'switch language'),
          '  clear         ' + (tr ? 'ekranı temizle' : 'clear screen'),
          '  npx hire-mert 👀',
        )
      case 'whoami':
        return out(`${profile.name} — ${t(profile.title)}`, t(profile.location), '', t(profile.summary))
      case 'experience':
      case 'exp':
        return jobs.flatMap((j) => out(`▸ ${j.company}  (${t(j.start)} – ${t(j.end)})`, `  ${t(j.role)}`))
      case 'skills':
        return out(
          `📱 ${t(ui.mobile)}: ${skills.mobile.join(', ')}`,
          `🌐 ${t(ui.web)}: ${skills.web.join(', ')}`,
          `${t(ui.shared)}: ${skills.shared.join(', ')}`,
          `${t(ui.other)}: ${skills.other.join(', ')}`,
          `${t(ui.spoken)}: ${skills.languages.map((l) => `${t(l.name)} (${t(l.level)})`).join(', ')}`,
        )
      case 'education':
        return out(`${t(education.school)} — ${education.year}`, t(education.degree))
      case 'contact':
        return out(`email:    ${profile.email}`, `linkedin: ${profile.linkedin.replace('https://', '')}`, ...(profile.showPhone ? [`phone:    ${profile.phone}`] : []))
      case 'lang':
        if (args[0] === 'tr' || args[0] === 'en') {
          setLang(args[0])
          return out(args[0] === 'tr' ? 'Dil: Türkçe ✓' : 'Language: English ✓')
        }
        return out('usage: lang tr|en')
      case 'open': {
        const id = args[0] as AppId
        if (id && id in appNames && id !== 'terminal') {
          setTimeout(() => open(id), 250)
          return out(`opening ${id}…`)
        }
        return out('usage: open about|career|settings|education|messages|web')
      }
      case 'clear':
        return 'clear'
      case 'sudo':
      case 'npx':
        if (args.join(' ').includes('hire-mert')) {
          return [
            { kind: 'out', text: '⠋ resolving dependencies…' },
            { kind: 'out', text: '✓ react-native@5+ years' },
            { kind: 'out', text: '✓ team-player  ✓ problem-solver' },
            { kind: 'accent', text: tr ? '🎉 Kurulum tamam! Şimdi bir e-posta at:' : '🎉 Installed! Now send an email:' },
            { kind: 'accent', text: `   ${profile.email}` },
          ]
        }
        return out(cmd === 'sudo' ? (tr ? 'Bu olay rapor edilecek. 🙃' : 'This incident will be reported. 🙃') : 'npm ERR! 404')
      case 'npm':
        if (args.join(' ') === 'run dev') {
          setTimeout(() => open('web'), 1400)
          return [
            { kind: 'out', text: '> mert-atakul@5.0.0 dev' },
            { kind: 'out', text: '> vite' },
            { kind: 'out', text: '' },
            { kind: 'accent', text: '  VITE ready in 312 ms' },
            { kind: 'out', text: '  ➜  Local:   http://localhost:5173/' },
            { kind: 'out', text: tr ? '  ➜  Web uygulaması açılıyor…' : '  ➜  Opening the Web app…' },
          ]
        }
        return out('usage: npm run dev')
      case 'cat':
        if (args[0] === 'package.json') {
          const deps = [...skills.mobile, ...skills.web, ...skills.shared].map((s) => `    "${s.toLowerCase().replace(/[^a-z0-9]+/g, '-')}": "latest"`)
          return out('{', '  "name": "mert-atakul",', '  "version": "5.0.0",', '  "dependencies": {', deps.join(',\n'), '  }', '}')
        }
        return args[0] === 'cv.pdf' ? out(tr ? 'Binary dosya 🙂 "whoami" dene.' : 'Binary file 🙂 try "whoami".') : out(`cat: ${args[0] ?? ''}: No such file`)
      case 'git':
        if (args[0] === 'log') {
          return jobs.flatMap((j, i): Line[] => [
            { kind: 'accent', text: `${(0x7a3f1 * (i + 3)).toString(16).padStart(7, 'a')} ${i === 0 ? '(HEAD -> main) ' : ''}${t(j.start)} – ${t(j.end)}` },
            { kind: 'out', text: `    feat: ${t(j.role)} @ ${j.company}` },
          ])
        }
        return out('usage: git log')
      case 'ls':
        return out('about  career  education  messages  settings  web  cv.pdf  package.json')
      default:
        return out(`zsh: command not found: ${cmd}`)
    }
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const res = run(value)
    if (value.trim()) setHistory((h) => [value, ...h])
    setHIdx(-1)
    setLines((l) => (res === 'clear' ? [] : [...l, { kind: 'in', text: value }, ...res]))
    setValue('')
  }

  return (
    <div className="terminal" onClick={() => input.current?.focus()}>
      <NavBar title={t(appNames.terminal)} large={false} />
      <div className="term-body">
        {lines.map((l, i) => (
          <div key={i} className={`term-line ${l.kind}`}>
            {l.kind === 'in' && <span className="prompt">{PROMPT} </span>}
            {l.text}
          </div>
        ))}
        <form onSubmit={submit} className="term-line in">
          <span className="prompt">{PROMPT} </span>
          <input
            ref={input}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowUp' && history.length) {
                const n = Math.min(hIdx + 1, history.length - 1)
                setHIdx(n)
                setValue(history[n])
                e.preventDefault()
              } else if (e.key === 'ArrowDown') {
                const n = Math.max(hIdx - 1, -1)
                setHIdx(n)
                setValue(n === -1 ? '' : history[n])
                e.preventDefault()
              }
              e.stopPropagation()
            }}
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            aria-label="terminal"
          />
        </form>
        <div ref={end} />
      </div>
    </div>
  )
}
