// Telefonla bakan ziyaretçi için: cihaz eğimi → 3D telefon eğimi
export const tilt = { x: 0, y: 0, active: false }

let base: { beta: number; gamma: number } | null = null
let listening = false

const onOrient = (e: DeviceOrientationEvent) => {
  if (e.beta == null || e.gamma == null) return
  // İlk okumayı "nötr" kabul et; kullanıcı telefonu nasıl tutuyorsa ona göre
  if (!base) base = { beta: e.beta, gamma: e.gamma }
  const clamp = (v: number) => Math.max(-1, Math.min(1, v))
  tilt.x = clamp((e.beta - base.beta) / 30)
  tilt.y = clamp((e.gamma - base.gamma) / 30)
  tilt.active = true
}

/** iOS 13+ izin ister; bu yüzden bir kullanıcı dokunuşu içinde çağrılmalı */
export function requestGyro() {
  if (listening || typeof window === 'undefined' || !('DeviceOrientationEvent' in window)) return
  const DOE = DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> }
  const start = () => {
    listening = true
    window.addEventListener('deviceorientation', onOrient)
  }
  if (typeof DOE.requestPermission === 'function') {
    DOE.requestPermission()
      .then((r) => r === 'granted' && start())
      .catch(() => {})
  } else {
    start()
  }
}
