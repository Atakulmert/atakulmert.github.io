import * as THREE from 'three'
import { SCREEN_PX } from '../os/PhoneOS'

// Telefon ölçüleri (dünya birimi). Ekran oranı 390×844 ile birebir.
export const PHONE = { w: 1.96, h: 4.08, d: 0.2, r: 0.3, bevel: 0.04 }
export const SCREEN = { w: 1.82, h: 1.82 * (SCREEN_PX.h / SCREEN_PX.w) }

// drei <Html transform>: 1 dünya birimi = 400 / distanceFactor px
export const DISTANCE_FACTOR = (SCREEN.w * 400) / SCREEN_PX.w

export function roundedRect(w: number, h: number, r: number) {
  const s = new THREE.Shape()
  const x = -w / 2
  const y = -h / 2
  s.moveTo(x + r, y)
  s.lineTo(x + w - r, y)
  s.quadraticCurveTo(x + w, y, x + w, y + r)
  s.lineTo(x + w, y + h - r)
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  s.lineTo(x + r, y + h)
  s.quadraticCurveTo(x, y + h, x, y + h - r)
  s.lineTo(x, y + r)
  s.quadraticCurveTo(x, y, x + r, y)
  return s
}
