import { useEffect, useRef, useState, type ReactNode } from 'react'
import { chat, contactQuestion, profile } from '../../data/cv'
import { ui } from '../../i18n'
import { haptic, useT } from '../../store'
import { NavBar } from '../AppHost'
import { Glyph } from '../icons'

// key: h1/h2 = selamlama, q<i>/a<i> = hazır soru-cevap, cq/cphone/cmail = iletişim
type Msg = { from: 'me' | 'them'; key: string }

// Sohbet tarzı iletişim: ziyaretçi hazır sorulardan birini seçer, "Mert" cevap verir
export function Messages() {
  const t = useT()
  const [msgs, setMsgs] = useState<Msg[]>([
    { from: 'them', key: 'h1' },
    { from: 'them', key: 'h2' },
  ])
  const [asked, setAsked] = useState<string[]>([])
  const [typing, setTyping] = useState(false)
  const end = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // scrollIntoView 3D dönüşümlü sayfayı da kaydırabilir, sadece uygulamanın kendi scroll'unu kullan
    const box = end.current?.closest('.app-scroll')
    box?.scrollTo({ top: box.scrollHeight, behavior: 'smooth' })
  }, [msgs, typing])

  const ask = (id: string, replies: string[]) => {
    if (typing) return
    haptic()
    setAsked((a) => [...a, id])
    setMsgs((m) => [...m, { from: 'me', key: id === 'c' ? 'cq' : `q${id}` }])
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      haptic(12)
      setMsgs((m) => [...m, ...replies.map((key) => ({ from: 'them' as const, key }))])
    }, 1100)
  }

  // Metinler render sırasında çözülür ki dil değişince sohbet de çevrilsin
  const textOf = (m: Msg): ReactNode => {
    switch (m.key) {
      case 'h1':
        return t(ui.chatHello1)
      case 'h2':
        return t(ui.chatHello2)
      case 'cq':
        return t(contactQuestion)
      case 'cphone':
        return (
          <a href={`tel:${profile.phone.replace(/\s/g, '')}`} onClick={() => haptic()}>
            📞 {profile.phone}
          </a>
        )
      case 'cmail':
        return (
          <a href={`mailto:${profile.email}`} onClick={() => haptic()}>
            ✉️ {profile.email}
          </a>
        )
    }
    const i = +m.key.slice(1)
    return m.key.startsWith('q') ? t(chat[i].q) : t(chat[i].a)
  }

  const remaining = chat.map((_, i) => i).filter((i) => !asked.includes(String(i)))

  return (
    <div className="messages">
      <NavBar
        title={profile.name}
        large={false}
        right={
          <a className="nav-mail" href={`mailto:${profile.email}`} aria-label={t(ui.sendEmail)}>
            {Glyph.mail()}
          </a>
        }
      />
      <div className="chat-head">
        <img src={profile.photo} alt="" />
        <b>{profile.name}</b>
        <span className="muted">
          <span className="pulse-dot" /> {t(ui.online)}
        </span>
      </div>

      <div className="chat">
        {msgs.map((m) => (
          <div key={m.key} className={`bubble ${m.from} ${m.key === 'cphone' || m.key === 'cmail' ? 'contact' : ''}`}>
            {textOf(m)}
          </div>
        ))}
        {typing && (
          <div className="bubble them typing" aria-label={t(ui.typing)}>
            <span />
            <span />
            <span />
          </div>
        )}
        <div ref={end} />
      </div>

      <div className="quick">
        {remaining.map((i) => (
          <button key={i} className="chip action" onClick={() => ask(String(i), [`a${i}`])} disabled={typing}>
            {t(chat[i].q)}
          </button>
        ))}
        {!asked.includes('c') && (
          <button className="chip primary" onClick={() => ask('c', ['cphone', 'cmail'])} disabled={typing}>
            {t(contactQuestion)}
          </button>
        )}
      </div>
    </div>
  )
}
