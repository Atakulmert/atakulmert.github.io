import { useEffect, useState } from 'react'

// Gizli teşhis paneli: HUD'daki isme 5 kez dokununca açılır/kapanır.
// iOS'ta ilk yüklemede dokunuşların nereye gittiğini görmek için.

type Tap = { x: number; y: number; target: string; hit: string; click?: string }

const describe = (el: Element | null) => {
  if (!el) return '∅'
  const cls = typeof el.className === 'string' ? el.className.split(' ').filter(Boolean).slice(0, 2).join('.') : ''
  return `${el.tagName.toLowerCase()}${cls ? '.' + cls : ''}`
}

const rect = (el: Element | null) => {
  if (!el) return '∅'
  const r = el.getBoundingClientRect()
  return `${r.x.toFixed(0)},${r.y.toFixed(0)} ${r.width.toFixed(0)}×${r.height.toFixed(0)}`
}

export function DebugPanel() {
  const [, setTick] = useState(0)
  const [tap, setTap] = useState<Tap | null>(null)

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 300)

    const dot = (x: number, y: number, color: string) => {
      const d = document.createElement('div')
      d.className = 'dbg-dot'
      d.style.cssText = `left:${x}px;top:${y}px;background:${color}`
      document.body.appendChild(d)
      setTimeout(() => d.remove(), 1500)
    }
    const down = (e: PointerEvent) => {
      dot(e.clientX, e.clientY, '#ff375f')
      setTap({ x: e.clientX, y: e.clientY, target: describe(e.target as Element), hit: describe(document.elementFromPoint(e.clientX, e.clientY)) })
    }
    const click = (e: MouseEvent) => {
      dot(e.clientX, e.clientY, '#0a84ff')
      setTap((t) => (t ? { ...t, click: describe(e.target as Element) } : t))
    }
    window.addEventListener('pointerdown', down, true)
    window.addEventListener('click', click, true)
    return () => {
      clearInterval(id)
      window.removeEventListener('pointerdown', down, true)
      window.removeEventListener('click', click, true)
    }
  }, [])

  const vv = window.visualViewport
  const ios = navigator.userAgent.match(/OS (\d+[_\d]*) like Mac/)?.[1]?.replace(/_/g, '.') ?? '-'
  const tracked = document.querySelector('.tracked-screen') as HTMLElement | null

  return (
    <pre className="dbg-panel">
      {[
        `build   ${__BUILD_ID__}   iOS ${ios}`,
        `inner   ${innerWidth}×${innerHeight}  dpr ${devicePixelRatio}`,
        `vv      ${vv ? `${vv.width.toFixed(0)}×${vv.height.toFixed(0)} off ${vv.offsetLeft.toFixed(0)},${vv.offsetTop.toFixed(0)} s ${vv.scale.toFixed(2)}` : '-'}`,
        `scroll  ${scrollX},${scrollY}  doc ${document.documentElement.clientWidth}×${document.documentElement.clientHeight}`,
        `stage   ${rect(document.querySelector('.stage'))}`,
        `canvas  ${rect(document.querySelector('.stage canvas'))}`,
        `mode    ${tracked ? '2D tracked' : '3D html'}  op ${tracked?.style.opacity ?? '-'}`,
        `screen  ${rect(document.querySelector('.stage .screen'))}`,
        `tap     ${tap ? `${tap.x.toFixed(0)},${tap.y.toFixed(0)}` : '-'}`,
        `  tgt   ${tap?.target ?? '-'}`,
        `  hit   ${tap?.hit ?? '-'}`,
        `  click ${tap ? (tap.click ?? '✗ (yok)') : '-'}`,
      ].join('\n')}
    </pre>
  )
}
