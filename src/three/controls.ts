import { useOS } from '../store'

// Sürükleme / fare durumunu render döngüsünün dışında tutuyoruz (her frame React render'ı olmasın)
export const ctl = {
  dragging: false,
  dx: 0, // sürüklemeden gelen anlık açı (rad)
  dy: 0,
  base: 0, // 0, π, 2π… → ön ya da arka yüze oturan açı
  mx: 0, // fare konumu (-1..1), masaüstünde hafif parallax için
  my: 0,
  disabled: false, // mobilde uygulama tam ekranken sürükleme kapalı
}

const parity = (a: number) => Math.abs(Math.round(a / Math.PI)) % 2 === 1

export function attachControls(el: HTMLElement) {
  let sx = 0
  let sy = 0
  let pid = -1

  const down = (e: PointerEvent) => {
    // Ekranın içindeki dokunuşlar arayüze ait, telefonu döndürmesin
    if (ctl.disabled || (e.target as HTMLElement).closest('.screen, .hud')) return
    pid = e.pointerId
    sx = e.clientX
    sy = e.clientY
    ctl.dragging = true
    el.setPointerCapture?.(pid)
  }
  const move = (e: PointerEvent) => {
    ctl.mx = (e.clientX / window.innerWidth) * 2 - 1
    ctl.my = (e.clientY / window.innerHeight) * 2 - 1
    if (!ctl.dragging || e.pointerId !== pid) return
    ctl.dx = (e.clientX - sx) * 0.009
    ctl.dy = Math.max(-0.6, Math.min(0.6, (e.clientY - sy) * 0.004))
  }
  const up = (e: PointerEvent) => {
    if (!ctl.dragging || e.pointerId !== pid) return
    ctl.dragging = false
    ctl.base = Math.round((ctl.base + ctl.dx) / Math.PI) * Math.PI
    ctl.dx = 0
    ctl.dy = 0
    useOS.getState().setFlipped(parity(ctl.base))
  }

  // "Arkasını çevir" butonu ya da uygulama açılışı flipped'ı değiştirirse açıyı ona uydur
  const unsub = useOS.subscribe((s, prev) => {
    if (s.flipped !== prev.flipped && parity(ctl.base) !== s.flipped) ctl.base += Math.PI
  })

  el.addEventListener('pointerdown', down)
  window.addEventListener('pointermove', move)
  window.addEventListener('pointerup', up)
  window.addEventListener('pointercancel', up)
  return () => {
    unsub()
    el.removeEventListener('pointerdown', down)
    window.removeEventListener('pointermove', move)
    window.removeEventListener('pointerup', up)
    window.removeEventListener('pointercancel', up)
  }
}
