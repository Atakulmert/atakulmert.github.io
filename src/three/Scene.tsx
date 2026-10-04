import { ContactShadows, Environment, Lightformer } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useRef, type RefObject } from 'react'
import * as THREE from 'three'
import { useOS } from '../store'
import { ctl } from './controls'
import { PHONE, SCREEN } from './dims'
import { useTrackedScreen } from './screenOverlay'
import { Phone } from './Phone'
import { isCompact, isFlat } from '../viewport'

const FOV = 30
const TAN = Math.tan(THREE.MathUtils.degToRad(FOV / 2))
const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches


/** Kamera mesafesi + telefonun dönüşü/süzülmesi */
function Rig({ portal }: { portal: RefObject<HTMLElement | null> }) {
  const phone = useRef<THREE.Group>(null)
  const size = useThree((s) => s.size)
  const { locked, app } = useOS()

  useFrame((state, dt) => {
    const g = phone.current
    if (!g) return
    const aspect = size.width / size.height
    const compact = isCompact(size.width)
    // Mobilde kilit açılınca sanal ekran gerçek ekranı doldursun (üstünde 2D arayüz katmanı açılır)
    const fill = isFlat(size.width, locked)
    // 2D takip edilen ekranda telefon dönerse katman hizasını kaybeder: sadece sürükleme/çevirme döndürür
    const tracked = useTrackedScreen(size.width)
    const focus = !compact && app !== null
    ctl.disabled = fill

    let dist: number
    if (fill) dist = Math.max(SCREEN.h / (2 * TAN), SCREEN.w / (2 * TAN * aspect)) * 1.01 + PHONE.d / 2
    else if (focus) dist = Math.max((PHONE.h * 1.2) / (2 * TAN), (PHONE.w * 1.3) / (2 * TAN * aspect))
    // Dar ekranda üstte HUD (isim + butonlar) var; telefona daha fazla pay bırak
    else dist = Math.max((PHONE.h * (compact ? 1.55 : 1.32)) / (2 * TAN), (PHONE.w * 1.55) / (2 * TAN * aspect))

    const cam = state.camera
    cam.position.z = THREE.MathUtils.damp(cam.position.z, dist, 4, dt)

    const t = state.clock.elapsedTime
    const motion = reduceMotion ? 0 : 1
    const free = fill ? 0 : 1
    const parallax = !compact && !ctl.dragging ? 1 : 0
    const sway = tracked ? 0 : free

    const ry = ctl.base + ctl.dx + sway * (parallax * ctl.mx * 0.18 + motion * Math.sin(t * 0.5) * 0.06)
    const rx = ctl.dy + sway * (parallax * ctl.my * 0.1 + motion * Math.cos(t * 0.7) * 0.03)
    const y = free * motion * Math.sin(t * 0.9) * 0.06

    const k = ctl.dragging ? 14 : 5
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, ry, k, dt)
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, rx, k, dt)
    g.position.y = THREE.MathUtils.damp(g.position.y, y, 4, dt)
  })

  return (
    <group ref={phone}>
      <Phone portal={portal} />
    </group>
  )
}

export function Scene({ portal }: { portal: RefObject<HTMLElement | null> }) {
  return (
    <Canvas camera={{ fov: FOV, position: [0, 0, 14], near: 0.1, far: 60 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 5, 6]} intensity={1.4} />
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={3} position={[0, 5, -1]} scale={[10, 2, 1]} rotation-x={Math.PI / 2} />
        <Lightformer form="rect" intensity={2.5} color="#8fb0ff" position={[-5, 1, 1]} scale={[2, 8, 1]} rotation-y={Math.PI / 2} />
        <Lightformer form="rect" intensity={2.5} color="#ff8fb5" position={[5, 1, 1]} scale={[2, 8, 1]} rotation-y={-Math.PI / 2} />
        <Lightformer form="rect" intensity={0.8} position={[0, 0, 6]} scale={[10, 10, 1]} />
        <Lightformer form="rect" intensity={1} position={[0, 0, -6]} scale={[10, 10, 1]} rotation-y={Math.PI} />
      </Environment>
      <Rig portal={portal} />
      <ContactShadows position={[0, -PHONE.h / 2 - 0.35, 0]} opacity={0.45} scale={9} blur={2.6} far={4} resolution={512} color="#000" />
    </Canvas>
  )
}
