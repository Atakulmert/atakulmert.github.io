import { create } from 'zustand'
import type { L, Lang } from './data/cv'

export type AppId = 'about' | 'career' | 'settings' | 'education' | 'messages' | 'terminal' | 'web'

type Origin = { x: number; y: number } // açılış animasyonu için ikonun ekrandaki merkezi (px)

type State = {
  lang: Lang
  locked: boolean
  app: AppId | null
  origin: Origin
  flipped: boolean // telefon arkası görünüyor mu
  debug: boolean // gizli teşhis paneli (HUD'daki isme 5 dokunuş)
  toggleDebug: () => void
  setLang: (l: Lang) => void
  unlock: () => void
  lock: () => void
  open: (app: AppId, origin?: Origin) => void
  close: () => void
  flip: () => void
  setFlipped: (f: boolean) => void
}

const initialLang = (): Lang => {
  try {
    const saved = localStorage.getItem('lang')
    if (saved === 'tr' || saved === 'en') return saved
  } catch {
    /* storage kapalı olabilir */
  }
  return navigator.language?.toLowerCase().startsWith('tr') ? 'tr' : 'en'
}

export const useOS = create<State>((set) => ({
  lang: initialLang(),
  locked: true,
  app: null,
  origin: { x: 195, y: 422 },
  flipped: false,
  debug: false,
  toggleDebug: () => set((s) => ({ debug: !s.debug })),
  setLang: (lang) => {
    try {
      localStorage.setItem('lang', lang)
    } catch {
      /* yoksay */
    }
    document.documentElement.lang = lang
    set({ lang })
  },
  unlock: () => set({ locked: false }),
  lock: () => set({ locked: true, app: null }),
  open: (app, origin) => set((s) => ({ app, origin: origin ?? s.origin, locked: false, flipped: false })),
  close: () => set({ app: null }),
  flip: () => set((s) => ({ flipped: !s.flipped })),
  setFlipped: (flipped) => set({ flipped }),
}))

/** Lokalize metin seçici: const t = useT(); t(job.role) */
export const useT = () => {
  const lang = useOS((s) => s.lang)
  return (v: L) => v[lang]
}

export const haptic = (ms = 8) => {
  try {
    navigator.vibrate?.(ms)
  } catch {
    /* desteklenmiyor */
  }
}
