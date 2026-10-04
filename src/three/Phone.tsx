import { Html, RoundedBox } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef, type RefObject } from 'react'
import * as THREE from 'three'
import { PhoneOS } from '../os/PhoneOS'
import { SCREEN_PX } from '../os/PhoneOS'
import { screenOverlay, useTrackedScreen } from './screenOverlay'
import { DISTANCE_FACTOR, PHONE, roundedRect, SCREEN } from './dims'
import { makeStickerTexture, STICKERS } from './stickers'

const { w, h, d, r, bevel: b } = PHONE

function useGeometries() {
  return useMemo(() => {
    const depth = d - b * 2
    const body = new THREE.ExtrudeGeometry(roundedRect(w - b * 2, h - b * 2, r - b), {
      depth,
      bevelEnabled: true,
      bevelThickness: b,
      bevelSize: b,
      bevelSegments: 10,
      curveSegments: 48,
    })
    body.translate(0, 0, -depth / 2)
    // Ön ve arka cam: gövdenin düz yüzeyiyle birebir aynı boyut
    const glass = new THREE.ShapeGeometry(roundedRect(w - b * 2, h - b * 2, r - b), 48)
    const plate = new THREE.ExtrudeGeometry(roundedRect(0.86, 0.86, 0.22), {
      depth: 0.02,
      bevelEnabled: true,
      bevelThickness: 0.012,
      bevelSize: 0.012,
      bevelSegments: 4,
      curveSegments: 24,
    })
    return { body, glass, plate }
  }, [])
}

function Lens({ x, y }: { x: number; y: number }) {
  return (
    <group position={[x, y, 0.04]} rotation={[Math.PI / 2, 0, 0]}>
      <mesh>
        <cylinderGeometry args={[0.165, 0.17, 0.07, 40]} />
        <meshStandardMaterial color="#3a3a3e" metalness={1} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0.036, 0]}>
        <cylinderGeometry args={[0.125, 0.125, 0.01, 40]} />
        <meshPhysicalMaterial color="#05060a" metalness={0.2} roughness={0.05} clearcoat={1} />
      </mesh>
      <mesh position={[0, 0.042, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.004, 24]} />
        <meshPhysicalMaterial color="#1b2a55" metalness={0.6} roughness={0.1} clearcoat={1} />
      </mesh>
    </group>
  )
}

function Back() {
  const { glass, plate } = useGeometries()
  const stickers = useMemo(() => STICKERS.map((s) => ({ ...s, tex: makeStickerTexture(s) })), [])
  useEffect(() => () => stickers.forEach((s) => s.tex.dispose()), [stickers])

  return (
    // Arka yüz: bu grubun içinde x/y "arkadan bakınca" koordinatları
    <group position={[0, 0, -d / 2]} rotation={[0, Math.PI, 0]}>
      <mesh geometry={glass} position={[0, 0, 0.001]}>
        <meshPhysicalMaterial color="#2a2a2e" metalness={0.3} roughness={0.55} clearcoat={0.3} />
      </mesh>

      <group position={[-0.43, 1.46, 0]}>
        <mesh geometry={plate}>
          <meshPhysicalMaterial color="#2f2f33" metalness={0.4} roughness={0.25} clearcoat={0.6} />
        </mesh>
        <Lens x={-0.19} y={0.19} />
        <Lens x={-0.19} y={-0.19} />
        <Lens x={0.2} y={0} />
        <mesh position={[0.2, 0.25, 0.035]}>
          <circleGeometry args={[0.055, 24]} />
          <meshStandardMaterial color="#fff6d8" emissive="#fff3c4" emissiveIntensity={0.15} roughness={0.3} />
        </mesh>
        <mesh position={[0.2, -0.25, 0.035]}>
          <circleGeometry args={[0.045, 24]} />
          <meshStandardMaterial color="#0a0a0a" roughness={0.2} />
        </mesh>
      </group>

      {stickers.map((s, i) => (
        <mesh key={s.text} position={[s.x, s.y, 0.004 + i * 0.0012]} rotation={[0, 0, s.rot]}>
          <planeGeometry args={[s.w, s.h]} />
          <meshStandardMaterial map={s.tex} transparent roughness={0.6} alphaTest={0.02} />
        </mesh>
      ))}
    </group>
  )
}

function SideButton({ x, y, len }: { x: number; y: number; len: number }) {
  return (
    <RoundedBox args={[0.035, len, 0.075]} radius={0.015} smoothness={3} position={[x, y, 0]}>
      <meshStandardMaterial color="#48484c" metalness={1} roughness={0.3} />
    </RoundedBox>
  )
}

// portal: Html'in hedef düğümü sabit olmalı; yoksa ilk render'da hedef değişip ekran içeriği boş kalıyor
export function Phone({ portal }: { portal: RefObject<HTMLElement | null> }) {
  const { body, glass } = useGeometries()
  const group = useRef<THREE.Group>(null)
  const screenEl = useRef<HTMLDivElement>(null)
  const facingAway = useRef(false)
  const tmp = useMemo(() => ({ n: new THREE.Vector3(), p: new THREE.Vector3(), q: new THREE.Quaternion(), c: new THREE.Vector3() }), [])
  const size = useThree((s) => s.size)
  // Dokunmatik / dar ekran: arayüz 3D CSS yerine App'teki 2D katmanda (bkz. screenOverlay.ts)
  const tracked = useTrackedScreen(size.width)
  const last = useRef('')

  useFrame(({ camera }) => {
    const g = group.current
    if (!g) return
    g.getWorldQuaternion(tmp.q)
    g.getWorldPosition(tmp.p)
    tmp.n.set(0, 0, 1).applyQuaternion(tmp.q)
    const facing = tmp.n.dot(tmp.p.sub(camera.position).negate().normalize())

    if (!tracked) {
      // Telefon arkasını döndüğünde HTML ekranı gizle (DOM her zaman canvas'ın üstünde çizilir)
      const away = facing < 0.18
      if (screenEl.current && away !== facingAway.current) {
        facingAway.current = away
        screenEl.current.classList.toggle('backface', away)
      }
      return
    }

    const el = screenOverlay.el
    if (!el) return
    // Ekranın 4 köşesini ekrana projekte et → kapsayan dikdörtgen
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity
    for (const [sx, sy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
      tmp.c.set((sx * SCREEN.w) / 2, (sy * SCREEN.h) / 2, d / 2 + 0.002).applyMatrix4(g.matrixWorld).project(camera)
      const px = ((tmp.c.x + 1) / 2) * size.width
      const py = ((1 - tmp.c.y) / 2) * size.height
      x0 = Math.min(x0, px); x1 = Math.max(x1, px)
      y0 = Math.min(y0, py); y1 = Math.max(y1, py)
    }
    const scale = Math.min((x1 - x0) / SCREEN_PX.w, (y1 - y0) / SCREEN_PX.h)
    const left = (x0 + x1) / 2 - (SCREEN_PX.w * scale) / 2
    const top = (y0 + y1) / 2 - (SCREEN_PX.h * scale) / 2
    // Dönüş başlayınca (sürükleme / arkasını çevirme) katmanı gizle; tam öndeyken göster
    const visible = facing > 0.995
    const css = `translate(${left.toFixed(2)}px, ${top.toFixed(2)}px) scale(${scale.toFixed(5)})|${visible}`
    if (css === last.current) return
    last.current = css
    el.style.transform = css.split('|')[0]
    el.style.opacity = visible ? '1' : '0'
    el.style.pointerEvents = visible ? 'auto' : 'none'
  })

  return (
    <group ref={group}>
      <mesh geometry={body}>
        <meshPhysicalMaterial color="#4a4a50" metalness={1} roughness={0.28} clearcoat={0.4} />
      </mesh>

      {/* ön cam (ekran kapalıyken / kenarlarda görünen siyah) */}
      <mesh geometry={glass} position={[0, 0, d / 2 + 0.001]}>
        <meshPhysicalMaterial color="#020203" metalness={0.1} roughness={0.08} clearcoat={1} />
      </mesh>

      {/* sol: action + ses tuşları, sağ: güç tuşu */}
      <SideButton x={-w / 2 - 0.006} y={1.3} len={0.2} />
      <SideButton x={-w / 2 - 0.006} y={0.88} len={0.36} />
      <SideButton x={-w / 2 - 0.006} y={0.42} len={0.36} />
      <SideButton x={w / 2 + 0.006} y={0.75} len={0.6} />

      <Back />

      {!tracked && (
        <Html
          transform
          distanceFactor={DISTANCE_FACTOR}
          position={[0, 0, d / 2 + 0.002]}
          zIndexRange={[10, 0]}
          pointerEvents="auto"
          portal={portal as RefObject<HTMLElement>}
        >
          <PhoneOS ref={screenEl} />
        </Html>
      )}
    </group>
  )
}
