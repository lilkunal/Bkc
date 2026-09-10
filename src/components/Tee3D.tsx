import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Float, PresentationControls } from '@react-three/drei'
import * as THREE from 'three'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js'
import type { Product } from '../data/catalog'
import { teeShape } from '../lib/tee'

/**
 * Real-time 3D hero tee. The silhouette is extruded from the same SVG path the
 * shop renders use, and the print is painted onto a canvas texture so the
 * selected print face updates live.
 */

const W = 400
const H = 470
const SCALE = 0.01
const TEX_W = 1024
const TEX_H = Math.round((TEX_W * H) / W)

type PrintAnchor = { x: number; y: number; w: number }

function buildGeometry(body: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}"><path d="${body}"/></svg>`
  const shapes = new SVGLoader().parse(svg).paths.flatMap((path) => path.toShapes())
  const geometry = new THREE.ExtrudeGeometry(shapes, {
    depth: 18,
    bevelEnabled: true,
    bevelThickness: 16,
    bevelSize: 9,
    bevelSegments: 10,
    curveSegments: 36,
  })
  geometry.center()
  // SVG space is y-down. Flipping Y and Z together turns the print face towards
  // the camera without mirroring it.
  geometry.scale(SCALE, -SCALE, -SCALE)
  return geometry
}

function makeNoiseCanvas(w: number, h: number, low = 0, high = 255) {
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  if (!ctx) return canvas
  const img = ctx.createImageData(w, h)
  for (let i = 0; i < img.data.length; i += 4) {
    const v = low + Math.random() * (high - low)
    img.data[i] = v
    img.data[i + 1] = v
    img.data[i + 2] = v
    img.data[i + 3] = 255
  }
  ctx.putImageData(img, 0, 0)
  return canvas
}

/** Same sizing rule as renderTee() in lib/tee.ts. */
function fitSize(text: string, maxWidth: number, cap: number) {
  const len = Math.max(text.length, 1)
  return Math.max(11, Math.min(cap, (maxWidth / len) * 1.72))
}

function paintTee(ctx: CanvasRenderingContext2D, product: Product, font: string, pr: PrintAnchor, noise: HTMLCanvasElement) {
  const k = ctx.canvas.width / W

  // fabric
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.globalAlpha = 1
  ctx.fillStyle = product.teeHex
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  ctx.globalCompositeOperation = 'overlay'
  ctx.globalAlpha = 0.07
  ctx.drawImage(noise, 0, 0)
  ctx.globalCompositeOperation = 'source-over'
  ctx.globalAlpha = 1

  ctx.setTransform(k, 0, 0, k, 0, 0)
  const side = ctx.createLinearGradient(0, 0, W, 0)
  side.addColorStop(0, 'rgba(0,0,0,0.22)')
  side.addColorStop(0.24, 'rgba(255,255,255,0.05)')
  side.addColorStop(0.5, 'rgba(255,255,255,0)')
  side.addColorStop(0.8, 'rgba(0,0,0,0.05)')
  side.addColorStop(1, 'rgba(0,0,0,0.24)')
  ctx.fillStyle = side
  ctx.fillRect(0, 0, W, H)

  // print, laid out exactly like renderTee()
  const ink = product.printHex
  const lines = product.printLines.filter(Boolean).slice(0, 3)
  const glyph = product.glyph

  ctx.save()
  ctx.translate(200, pr.y)
  ctx.rotate((-0.5 * Math.PI) / 180)
  ctx.translate(-200, -pr.y)
  ctx.globalAlpha = 0.95

  const backdrop = product.backdrop
  if (backdrop && backdrop !== 'none') {
    const colour = product.backdropHex || ink
    ctx.fillStyle = colour
    ctx.strokeStyle = colour
    if (backdrop === 'burst') {
      ctx.beginPath()
      ctx.arc(200, pr.y, 112, 0, Math.PI * 2)
      ctx.fill()
    } else if (backdrop === 'ring') {
      ctx.beginPath()
      ctx.lineWidth = 9
      ctx.arc(200, pr.y, 106, 0, Math.PI * 2)
      ctx.stroke()
    } else if (backdrop === 'box') {
      ctx.fillRect(98, pr.y - 84, 204, 168)
    } else if (backdrop === 'banner') {
      ctx.fillRect(78, pr.y - 27, 244, 54)
    } else if (backdrop === 'star') {
      ctx.fill(new Path2D(`M200 ${pr.y - 118}l17 68 66-19-49 49 57 42-70 2 9 66-30-55-30 55 9-66-70-2 57-42-49-49 66 19z`))
    }
  }

  const glyphSize = lines.length ? 74 : 116
  const cap = pr.w > 160 ? 44 : 38
  const sizes = lines.map((line, i) => fitSize(line, pr.w, i === 0 ? cap : cap - 6))
  const totalH = sizes.reduce((sum, s) => sum + s * 1.06, 0) + (glyph ? glyphSize * 0.92 : 0)
  let cursor = pr.y - totalH / 2

  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'
  ctx.fillStyle = ink
  if (glyph) {
    cursor += glyphSize * 0.78
    ctx.font = `${glyphSize}px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif`
    ctx.fillText(glyph, pr.x, cursor)
    cursor += glyphSize * 0.2
  }
  ctx.letterSpacing = '0.5px'
  lines.forEach((line, i) => {
    cursor += sizes[i] * 0.96
    ctx.font = `${sizes[i].toFixed(1)}px ${font}`
    ctx.fillText(line, pr.x, cursor)
    cursor += sizes[i] * 0.12
  })
  ctx.letterSpacing = '0px'
  ctx.restore()
}

function TeeMesh({ product, font, animate }: { product: Product; font: string; animate: boolean }) {
  const invalidate = useThree((state) => state.invalidate)
  const { body, print } = teeShape(product.fit)
  const group = useRef<THREE.Group>(null)

  const geometry = useMemo(() => buildGeometry(body), [body])
  const noise = useMemo(() => makeNoiseCanvas(TEX_W, TEX_H), [])
  const canvas = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = TEX_W
    c.height = TEX_H
    return c
  }, [])

  const texture = useMemo(() => {
    const t = new THREE.CanvasTexture(canvas)
    t.flipY = false
    t.colorSpace = THREE.SRGBColorSpace
    // cap UVs are in SVG units (0..400, 0..470)
    t.repeat.set(1 / W, 1 / H)
    t.anisotropy = 8
    return t
  }, [canvas])

  const bump = useMemo(() => {
    const t = new THREE.CanvasTexture(makeNoiseCanvas(128, 128, 90, 165))
    t.wrapS = THREE.RepeatWrapping
    t.wrapT = THREE.RepeatWrapping
    t.repeat.set(1 / 12, 1 / 12)
    return t
  }, [])

  const materials = useMemo(
    () => [
      new THREE.MeshPhysicalMaterial({
        map: texture,
        bumpMap: bump,
        bumpScale: 0.4,
        roughness: 0.9,
        sheen: 0.8,
        sheenRoughness: 0.7,
        sheenColor: new THREE.Color('#ffffff'),
      }),
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(product.teeHex).multiplyScalar(0.8),
        roughness: 0.95,
        sheen: 0.6,
        sheenRoughness: 0.8,
      }),
    ],
    [texture, bump, product.teeHex],
  )

  useEffect(() => {
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let live = true
    const paint = () => {
      if (!live) return
      paintTee(ctx, product, font, print, noise)
      texture.needsUpdate = true
      invalidate()
    }
    paint()
    // repaint once the web font for this print face is ready
    document.fonts.load(`40px ${font}`, product.printLines.join(' ') || 'BKC').then(paint, paint)
    document.fonts.ready.then(paint)
    return () => {
      live = false
    }
  }, [canvas, texture, noise, product, font, print, invalidate])

  useEffect(() => () => geometry.dispose(), [geometry])
  useEffect(() => () => materials.forEach((m) => m.dispose()), [materials])
  useEffect(
    () => () => {
      texture.dispose()
      bump.dispose()
    },
    [texture, bump],
  )

  useFrame(({ clock }) => {
    if (!animate || !group.current) return
    group.current.rotation.y = Math.sin(clock.elapsedTime * 0.45) * 0.28
  })

  return (
    <group ref={group}>
      <mesh geometry={geometry} material={materials} />
    </group>
  )
}

type Tee3DProps = {
  product: Product
  font: string
  animate: boolean
  interactive: boolean
  label: string
}

export default function Tee3D({ product, font, animate, interactive, label }: Tee3DProps) {
  const wrap = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const el = wrap.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting))
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const tee = (
    <Float enabled={animate} speed={1.1} rotationIntensity={0.18} floatIntensity={0.55} floatingRange={[-0.08, 0.08]}>
      <TeeMesh product={product} font={font} animate={animate} />
    </Float>
  )

  return (
    <div ref={wrap} className="h-full w-full" role="img" aria-label={label}>
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 7.5], fov: 32 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        frameloop={visible && animate ? 'always' : 'demand'}
        style={{ touchAction: interactive ? 'none' : 'pan-y' }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.NeutralToneMapping
          gl.toneMappingExposure = 1.05
        }}
      >
        <ambientLight intensity={0.45} />
        <hemisphereLight args={['#ffffff', '#1d1a15', 0.6]} />
        <directionalLight position={[-3.5, 4, 6]} intensity={2.4} color="#ffffff" />
        <spotLight position={[4, 5, 4]} angle={0.5} penumbra={1} intensity={30} color="#fffaf2" />
        <pointLight position={[3.5, 1.5, -2.5]} intensity={18} distance={12} color="#C9A24A" />
        {interactive ? (
          <PresentationControls global={false} cursor snap speed={1.4} zoom={1} rotation={[0, 0, 0]} polar={[-0.18, 0.18]} azimuth={[-0.7, 0.7]}>
            {tee}
          </PresentationControls>
        ) : (
          tee
        )}
        <ContactShadows position={[0, -2.25, 0]} opacity={0.55} scale={7} blur={2.6} far={4} resolution={512} color="#000000" />
      </Canvas>
    </div>
  )
}
