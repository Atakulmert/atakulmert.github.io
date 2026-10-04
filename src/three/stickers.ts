import * as THREE from 'three'

export type StickerSpec = {
  text: string
  bg: string
  fg: string
  shape: 'pill' | 'circle' | 'rect'
  w: number // dünya birimi
  h: number
  x: number // arka yüzde konum (arkadan bakınca)
  y: number
  rot: number
  font?: number // px, 1024 genişlikli canvas için
}

// Arka kapaktaki tech stack çıkartmaları. Font yüklemeye gerek kalmasın diye canvas ile çiziliyor.
export function makeStickerTexture(s: StickerSpec) {
  const W = 512
  const H = Math.round((W * s.h) / s.w)
  const c = document.createElement('canvas')
  c.width = W
  c.height = H
  const g = c.getContext('2d')!
  const pad = 10
  const r = s.shape === 'pill' ? (H - pad * 2) / 2 : s.shape === 'circle' ? W / 2 - pad : 40

  // beyaz die-cut kenarı + gölge
  g.shadowColor = 'rgba(0,0,0,0.35)'
  g.shadowBlur = 8
  g.fillStyle = '#fff'
  g.beginPath()
  if (s.shape === 'circle') g.arc(W / 2, H / 2, W / 2 - pad, 0, Math.PI * 2)
  else g.roundRect(pad, pad, W - pad * 2, H - pad * 2, r)
  g.fill()
  g.shadowBlur = 0

  g.fillStyle = s.bg
  g.beginPath()
  const inset = pad + 12
  if (s.shape === 'circle') g.arc(W / 2, H / 2, W / 2 - inset, 0, Math.PI * 2)
  else g.roundRect(inset, inset, W - inset * 2, H - inset * 2, Math.max(r - 12, 4))
  g.fill()

  g.fillStyle = s.fg
  g.textAlign = 'center'
  g.textBaseline = 'middle'
  const lines = s.text.split('\n')
  const size = s.font ?? Math.min(H * 0.42, (W * 1.5) / Math.max(...lines.map((l) => l.length)))
  g.font = `800 ${size}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`
  lines.forEach((l, i) => g.fillText(l, W / 2, H / 2 + (i - (lines.length - 1) / 2) * size * 1.1 + size * 0.04))

  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  return tex
}

// x/y: arkadan bakınca konum. Kamera modülü sol üstte (≈ x -0.5, y 1.5).
export const STICKERS: StickerSpec[] = [
  { text: '⚛ React Native', bg: '#20232a', fg: '#61dafb', shape: 'pill', w: 1.25, h: 0.36, x: 0.05, y: 0.55, rot: -0.12 },
  { text: '</>', bg: '#111', fg: '#fff', shape: 'circle', w: 0.46, h: 0.46, x: 0.55, y: 1.45, rot: 0.2 },
  { text: 'SQLite', bg: '#0f80cc', fg: '#fff', shape: 'pill', w: 0.75, h: 0.27, x: 0.45, y: 0.98, rot: -0.15 },
  { text: 'JS', bg: '#f7df1e', fg: '#000', shape: 'rect', w: 0.5, h: 0.5, x: 0.55, y: -0.1, rot: 0.15 },
  { text: 'Redux', bg: '#764abc', fg: '#fff', shape: 'pill', w: 0.9, h: 0.3, x: -0.4, y: -0.15, rot: 0.08 },
  { text: '🔥 Firebase', bg: '#1b1b1f', fg: '#ffca28', shape: 'pill', w: 1.0, h: 0.3, x: 0.05, y: -0.72, rot: -0.06 },
  { text: 'Google Maps', bg: '#fff', fg: '#1a73e8', shape: 'pill', w: 1.05, h: 0.3, x: -0.3, y: -1.25, rot: 0.1 },
  { text: 'HTML · CSS', bg: '#e44d26', fg: '#fff', shape: 'pill', w: 0.9, h: 0.28, x: 0.45, y: -1.65, rot: -0.12 },
]
