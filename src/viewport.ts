import { useEffect, useState } from 'react'

export const isCompact = (width: number) => width < 760

export const useWidth = () => {
  const [w, setW] = useState(() => window.innerWidth)
  useEffect(() => {
    const on = () => setW(window.innerWidth)
    window.addEventListener('resize', on)
    return () => window.removeEventListener('resize', on)
  }, [])
  return w
}

/** Dar ekranda kilit açıkken kamera, sanal ekran gerçek ekranı dolduracak kadar yaklaşır */
export const isFlat = (width: number, locked: boolean) => isCompact(width) && !locked
