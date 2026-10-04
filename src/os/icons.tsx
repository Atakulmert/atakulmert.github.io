import type { ReactNode } from 'react'

const S = (p: { children: ReactNode; size?: number }) => (
  <svg
    width={p.size ?? 30}
    height={p.size ?? 30}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.9}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    {p.children}
  </svg>
)

export const Glyph = {
  about: () => (
    <S>
      <circle cx="12" cy="8.5" r="3.6" />
      <path d="M4.8 19.5c1.3-3.4 4-5 7.2-5s5.9 1.6 7.2 5" />
    </S>
  ),
  career: () => (
    <S>
      <rect x="3" y="7" width="18" height="13" rx="2.5" />
      <path d="M8.5 7V5.5A1.5 1.5 0 0 1 10 4h4a1.5 1.5 0 0 1 1.5 1.5V7M3 12.5h18" />
    </S>
  ),
  education: () => (
    <S>
      <path d="M2.5 9 12 4.5 21.5 9 12 13.5z" />
      <path d="M6.5 11v4.5c1.5 1.6 3.4 2.4 5.5 2.4s4-.8 5.5-2.4V11M21.5 9v5" />
    </S>
  ),
  settings: () => (
    <S>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 2.8v2.4M12 18.8v2.4M21.2 12h-2.4M5.2 12H2.8M18.5 5.5l-1.7 1.7M7.2 16.8l-1.7 1.7M18.5 18.5l-1.7-1.7M7.2 7.2 5.5 5.5" />
    </S>
  ),
  messages: () => (
    <S>
      <path d="M12 4c5 0 9 3.2 9 7.3s-4 7.3-9 7.3c-1 0-2-.1-2.9-.4L5 20l1-3.6C4.2 15 3 13.3 3 11.3 3 7.2 7 4 12 4z" fill="currentColor" stroke="none" />
    </S>
  ),
  terminal: () => (
    <S>
      <path d="m5 7 5 5-5 5M12.5 17H19" />
    </S>
  ),
  web: () => (
    <S>
      <circle cx="12" cy="12" r="8.6" />
      <path d="m15.6 8.4-2.2 5-5 2.2 2.2-5z" fill="currentColor" />
    </S>
  ),
  mail: () => (
    <S>
      <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
      <path d="m3.8 7 8.2 6 8.2-6" />
    </S>
  ),
  linkedin: () => (
    <svg width={28} height={28} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M5.4 8.8h3.1V19H5.4zM7 4a1.8 1.8 0 1 1 0 3.6A1.8 1.8 0 0 1 7 4zm3.5 4.8h3v1.4c.4-.8 1.5-1.7 3.1-1.7 3.3 0 3.9 2.1 3.9 4.9V19h-3.1v-5c0-1.2 0-2.7-1.7-2.7s-1.9 1.3-1.9 2.6V19h-3.1z" />
    </svg>
  ),
  phone: () => (
    <S size={22}>
      <path d="M6.5 3.5h2.8l1.4 4-2 1.4a11 11 0 0 0 6.4 6.4l1.4-2 4 1.4v2.8a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2z" />
    </S>
  ),
  pin: () => (
    <S size={16}>
      <path d="M12 21s-6.5-5.6-6.5-11A6.5 6.5 0 0 1 18.5 10c0 5.4-6.5 11-6.5 11z" />
      <circle cx="12" cy="10" r="2.3" />
    </S>
  ),
  chevron: () => (
    <S size={22}>
      <path d="m15 5-7 7 7 7" />
    </S>
  ),
  flashlight: () => (
    <S size={22}>
      <path d="M8 3h8v4l-2 3v10a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V10L8 7z" />
    </S>
  ),
  camera: () => (
    <S size={22}>
      <path d="M4 8h3l1.8-2.5h6.4L17 8h3v11H4z" />
      <circle cx="12" cy="13" r="3.4" />
    </S>
  ),
  faceId: () => (
    <svg width={56} height={56} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" aria-hidden>
      <path d="M3 8V5.5A2.5 2.5 0 0 1 5.5 3H8M16 3h2.5A2.5 2.5 0 0 1 21 5.5V8M21 16v2.5a2.5 2.5 0 0 1-2.5 2.5H16M8 21H5.5A2.5 2.5 0 0 1 3 18.5V16" />
      <path d="M8.5 9v1.2M15.5 9v1.2M12 9v4h-1M9 16.2c1.8 1.3 4.2 1.3 6 0" />
    </svg>
  ),
}

// İkon arka planları (iOS benzeri gradyanlar)
export const iconBg: Record<string, string> = {
  about: 'linear-gradient(160deg,#8e8e93,#48484a)',
  career: 'linear-gradient(160deg,#1c1c1e,#000)',
  education: 'linear-gradient(160deg,#ff9f0a,#ff6b00)',
  settings: 'linear-gradient(160deg,#a1a1a6,#636366)',
  messages: 'linear-gradient(160deg,#5df27a,#1fbf43)',
  terminal: 'linear-gradient(160deg,#2c2c2e,#000)',
  mail: 'linear-gradient(160deg,#4fb3ff,#0a6cff)',
  web: 'linear-gradient(160deg,#5ac8fa,#007aff)',
  linkedin: 'linear-gradient(160deg,#1f8fe0,#0a66c2)',
}
