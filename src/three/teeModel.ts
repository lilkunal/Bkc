/**
 * A realistic T-shirt built in three.js from the garment silhouette (lib/tee.ts): softly inflated front and
 * back panels with fabric folds, a jersey-knit normal map, cotton sheen, the product print on the front,
 * a rib collar, stitched hems and a soft studio shadow. Used live in the home hero (heroTee.ts) and baked
 * into product images (teeBaker.ts). No image files needed.
 */
import {
  ACESFilmicToneMapping,
  CanvasTexture,
  Color,
  DirectionalLight,
  FrontSide,
  Group,
  HemisphereLight,
  Mesh,
  MeshPhysicalMaterial,
  PMREMGenerator,
  PerspectiveCamera,
  PlaneGeometry,
  RepeatWrapping,
  SRGBColorSpace,
  Scene,
  Vector2,
  type Texture,
  type WebGLRenderer,
} from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { drawPrint, hasPrint, type PrintSpec } from '../lib/print'
import { teeShape } from '../lib/tee'

export interface TeeLook {
  fit: string
  teeHex: string
  print: PrintSpec
}

/** Silhouette space used by lib/tee.ts. */
const SW = 400
const SH = 470
const SCALE = 2 / SW
const SIZE = { w: SW * SCALE, h: SH * SCALE }

/** Distance-field grid. */
const GW = 200
const GH = 235

interface Neck {
  cx: number
  top: number
  bottom: number
  halfWidth: number
}

interface ShapeData {
  front: PlaneGeometry
  back: PlaneGeometry
  alpha: CanvasTexture
  shadow: CanvasTexture
  neck: Neck
  hemY: number
  hemX: [number, number]
}

const shapes = new Map<string, ShapeData>()

function drawMask(fit: string, w: number, h: number, blur = 0) {
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!
  if (blur) ctx.filter = `blur(${blur}px)`
  ctx.scale(w / SW, h / SH)
  ctx.fillStyle = '#fff'
  ctx.fill(new Path2D(teeShape(fit).body))
  return canvas
}

/** Chamfer distance from every inside grid cell to the silhouette edge (grid px). */
function distanceField(fit: string) {
  const data = drawMask(fit, GW, GH).getContext('2d')!.getImageData(0, 0, GW, GH).data
  const d = new Float32Array(GW * GH)
  for (let i = 0; i < d.length; i++) d[i] = data[i * 4] > 127 ? 1e6 : 0
  const at = (x: number, y: number) => (x < 0 || y < 0 || x >= GW || y >= GH ? 0 : d[y * GW + x])
  for (let y = 0; y < GH; y++) {
    for (let x = 0; x < GW; x++) {
      const i = y * GW + x
      if (d[i]) d[i] = Math.min(d[i], at(x - 1, y) + 1, at(x, y - 1) + 1, at(x - 1, y - 1) + 1.4142, at(x + 1, y - 1) + 1.4142)
    }
  }
  for (let y = GH - 1; y >= 0; y--) {
    for (let x = GW - 1; x >= 0; x--) {
      const i = y * GW + x
      if (d[i]) d[i] = Math.min(d[i], at(x + 1, y) + 1, at(x, y + 1) + 1, at(x + 1, y + 1) + 1.4142, at(x - 1, y + 1) + 1.4142)
    }
  }
  return d
}

/** Distance to the edge in silhouette units, bilinearly sampled. */
function sampleDistance(d: Float32Array, sx: number, sy: number) {
  const gx = (sx * GW) / SW
  const gy = (sy * GH) / SH
  const x0 = Math.floor(gx)
  const y0 = Math.floor(gy)
  const fx = gx - x0
  const fy = gy - y0
  const g = (x: number, y: number) => (x < 0 || y < 0 || x >= GW || y >= GH ? 0 : d[y * GW + x])
  const v = g(x0, y0) * (1 - fx) * (1 - fy) + g(x0 + 1, y0) * fx * (1 - fy) + g(x0, y0 + 1) * (1 - fx) * fy + g(x0 + 1, y0 + 1) * fx * fy
  return (v * SW) / GW
}

/** Cloth height: rounded edges, a fuller chest, and a few soft folds. */
function clothHeight(dist: number, sx: number, sy: number) {
  if (dist <= 0) return 0
  const r = Math.min(dist / 38, 1)
  let z = Math.sqrt(1 - (1 - r) * (1 - r)) * 13
  const bx = (sx - 200) / 110
  const by = (sy - 250) / 170
  z += 8 * Math.exp(-(bx * bx + by * by) * 1.4) * r
  const folds =
    1.7 * Math.sin(sx * 0.05 + sy * 0.03) +
    1.2 * Math.sin(-sx * 0.035 + sy * 0.06 + 1.1) +
    0.8 * Math.sin(sy * 0.11 + Math.sin(sx * 0.025) * 2.2) +
    0.5 * Math.sin(sx * 0.13 - sy * 0.02)
  return z + folds * r * r
}

function panel(d: Float32Array, depth: number) {
  const geometry = new PlaneGeometry(SIZE.w, SIZE.h, 150, 176)
  const pos = geometry.attributes.position
  for (let i = 0; i < pos.count; i++) {
    const sx = pos.getX(i) / SCALE + SW / 2
    const sy = SH / 2 - pos.getY(i) / SCALE
    pos.setZ(i, clothHeight(sampleDistance(d, sx, sy), sx, sy) * SCALE * depth)
  }
  geometry.computeVertexNormals()
  return geometry
}

function shapeFor(fit: string): ShapeData {
  const key = fit || 'regular'
  const cached = shapes.get(key)
  if (cached) return cached

  const d = distanceField(key)
  const inside = (x: number, y: number) => d[y * GW + x] > 0
  const topAt = (x: number) => {
    for (let y = 0; y < GH; y++) if (inside(x, y)) return y
    return GH
  }
  const cx = Math.round(GW / 2)
  const bottom = topAt(cx)
  let top = bottom
  for (let x = Math.round(cx - GW * 0.3); x <= cx + GW * 0.3; x++) top = Math.min(top, topAt(x))
  let edge = cx
  while (edge > 0 && topAt(edge) > top + 3) edge--
  let hemRow = GH - 1
  while (hemRow > 0 && !inside(cx, hemRow)) hemRow--
  const row = hemRow - 6
  let left = cx
  while (left > 0 && inside(left, row)) left--
  let right = cx
  while (right < GW - 1 && inside(right, row)) right++
  const k = SW / GW

  const alpha = new CanvasTexture(drawMask(key, 1024, Math.round((1024 * SH) / SW)))
  const shadow = new CanvasTexture(drawMask(key, 256, Math.round((256 * SH) / SW), 9))
  const data: ShapeData = {
    front: panel(d, 1),
    back: panel(d, 0.7),
    alpha,
    shadow,
    neck: { cx: cx * k, top: top * k, bottom: bottom * k, halfWidth: (cx - edge) * k },
    hemY: hemRow * k,
    hemX: [left * k, right * k],
  }
  shapes.set(key, data)
  return data
}

let knit: CanvasTexture | null = null

/** Tiny jersey-knit height pattern turned into a tangent-space normal map. */
function knitNormals() {
  if (knit) return knit
  const n = 64
  const heights = new Float32Array(n * n)
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const col = x % 8
      const across = 0.5 + 0.5 * Math.cos(((col - 4) / 4) * Math.PI)
      const v = Math.sin(((y + (col < 4 ? col : 8 - col)) / 8) * Math.PI * 2)
      heights[y * n + x] = across * (0.6 + 0.4 * v)
    }
  }
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = n
  const ctx = canvas.getContext('2d')!
  const img = ctx.createImageData(n, n)
  const h = (x: number, y: number) => heights[((y + n) % n) * n + ((x + n) % n)]
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const dx = (h(x + 1, y) - h(x - 1, y)) * 1.6
      const dy = (h(x, y + 1) - h(x, y - 1)) * 1.6
      const len = Math.hypot(dx, dy, 1)
      const i = (y * n + x) * 4
      img.data[i] = ((-dx / len) * 0.5 + 0.5) * 255
      img.data[i + 1] = ((dy / len) * 0.5 + 0.5) * 255
      img.data[i + 2] = ((1 / len) * 0.5 + 0.5) * 255
      img.data[i + 3] = 255
    }
  }
  ctx.putImageData(img, 0, 0)
  knit = new CanvasTexture(canvas)
  knit.wrapS = knit.wrapT = RepeatWrapping
  knit.repeat.set(46, 54)
  return knit
}

function shade(hex: string, f: number) {
  const c = new Color(hex)
  c.offsetHSL(0, 0, f)
  return `#${c.getHexString()}`
}

function luma(hex: string) {
  const c = new Color(hex)
  return 0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b
}

/** Front texture: fabric colour with a faint mottle, rib collar, hem stitching and the print. */
async function frontTexture(look: TeeLook, shape: ShapeData) {
  const w = 1024
  const h = Math.round((1024 * SH) / SW)
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = look.teeHex
  ctx.fillRect(0, 0, w, h)

  // cotton mottle
  ctx.globalAlpha = 0.035
  for (let i = 0; i < 1400; i++) {
    ctx.fillStyle = Math.random() > 0.5 ? '#000' : '#fff'
    ctx.fillRect(Math.random() * w, Math.random() * h, 2 + Math.random() * 6, 1 + Math.random() * 2)
  }
  ctx.globalAlpha = 1

  ctx.save()
  ctx.scale(w / SW, h / SH)
  const dark = luma(look.teeHex) > 0.5
  const { neck } = shape

  // rib collar following the neckline
  const ry = neck.bottom - neck.top
  ctx.lineCap = 'round'
  ctx.strokeStyle = shade(look.teeHex, dark ? -0.06 : 0.05)
  ctx.lineWidth = 11
  ctx.beginPath()
  ctx.ellipse(neck.cx, neck.top, neck.halfWidth + 3, ry + 3, 0, 0.08, Math.PI - 0.08)
  ctx.stroke()
  ctx.strokeStyle = shade(look.teeHex, dark ? -0.12 : 0.1)
  ctx.lineWidth = 1
  for (let i = 0; i < 3; i++) {
    ctx.beginPath()
    ctx.ellipse(neck.cx, neck.top, neck.halfWidth + i * 3.5, ry + i * 3.5, 0, 0.1, Math.PI - 0.1)
    ctx.stroke()
  }

  // hem stitching
  ctx.setLineDash([3, 3])
  ctx.strokeStyle = shade(look.teeHex, dark ? -0.16 : 0.14)
  ctx.lineWidth = 1.1
  for (const offset of [12, 15]) {
    ctx.beginPath()
    ctx.moveTo(shape.hemX[0] + 4, shape.hemY - offset)
    ctx.lineTo(shape.hemX[1] - 4, shape.hemY - offset)
    ctx.stroke()
  }
  ctx.setLineDash([])

  if (hasPrint(look.print)) {
    await document.fonts.load(`40px ${look.print.font}`, look.print.printLines.join(' ') || 'BKC').catch(() => undefined)
    ctx.globalAlpha = 0.95
    drawPrint(ctx, look.print, teeShape(look.fit).print)
    ctx.globalAlpha = 1
  }
  ctx.restore()

  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  texture.anisotropy = 8
  return texture
}


function cloth(map: Texture | null, color: string | null, alpha: Texture) {
  return new MeshPhysicalMaterial({
    map,
    color: color ? new Color(color) : new Color('#ffffff'),
    alphaMap: alpha,
    alphaTest: 0.5,
    normalMap: knitNormals(),
    normalScale: new Vector2(0.28, 0.28),
    roughness: 0.93,
    metalness: 0,
    sheen: 1,
    sheenRoughness: 0.7,
    sheenColor: new Color('#ffffff').multiplyScalar(0.3),
    side: FrontSide,
  })
}

export interface TeeRig {
  scene: Scene
  camera: PerspectiveCamera
  group: Group
  /** Fit the garment into a viewport of this aspect, with `margin` around it. */
  frame(aspect: number, margin?: number): void
  setLook(look: TeeLook): Promise<void>
  dispose(): void
}

export async function createTeeRig(renderer: WebGLRenderer, initial: TeeLook): Promise<TeeRig> {
  renderer.toneMapping = ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.08
  renderer.outputColorSpace = SRGBColorSpace

  const scene = new Scene()
  const pmrem = new PMREMGenerator(renderer)
  const environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
  pmrem.dispose()
  scene.environment = environment
  scene.environmentIntensity = 0.55

  const key = new DirectionalLight('#fff3e3', 2.4)
  key.position.set(-2.2, 3, 4)
  const rim = new DirectionalLight('#e4ecff', 0.9)
  rim.position.set(3, 1.5, -2.5)
  scene.add(key, rim, new HemisphereLight('#ffffff', '#3a342c', 0.35))

  const camera = new PerspectiveCamera(22, 0.8, 0.1, 50)
  const group = new Group()
  scene.add(group)

  let look = initial
  let shape = shapeFor(look.fit)
  const frontMat = cloth(await frontTexture(look, shape), null, shape.alpha)
  const backMat = cloth(null, look.teeHex, shape.alpha)
  const front = new Mesh(shape.front, frontMat)
  const back = new Mesh(shape.back, backMat)
  back.rotation.y = Math.PI
  back.position.z = -0.003
  group.add(back, front)

  const placeNeck = () => {}
  placeNeck()

  return {
    scene,
    camera,
    group,
    frame(aspect, margin = 1.1) {
      camera.aspect = aspect
      const tan = Math.tan((camera.fov * Math.PI) / 360)
      const byHeight = (SIZE.h * margin) / 2 / tan
      const byWidth = (SIZE.w * margin) / 2 / (tan * aspect)
      camera.position.set(0, 0, Math.max(byHeight, byWidth))
      camera.lookAt(0, 0, 0)
      camera.updateProjectionMatrix()
    },
    async setLook(next) {
      const fitChanged = next.fit !== look.fit
      look = next
      if (fitChanged) {
        shape = shapeFor(next.fit)
        front.geometry = shape.front
        back.geometry = shape.back
        frontMat.alphaMap = backMat.alphaMap = shape.alpha
        placeNeck()
      }
      const map = await frontTexture(next, shape)
      frontMat.map?.dispose()
      frontMat.map = map
      backMat.color.set(next.teeHex)
      frontMat.needsUpdate = backMat.needsUpdate = true
    },
    dispose() {
      frontMat.map?.dispose()
      frontMat.dispose()
      backMat.dispose()
      environment.dispose()
    },
  }
}
