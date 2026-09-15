/**
 * A ring of curved product cards: drag or swipe to spin, click the front card to open it.
 * Loaded on demand by components/CollectionRing.tsx.
 */
import {
  CanvasTexture,
  Color,
  DoubleSide,
  Group,
  LinearMipmapLinearFilter,
  Mesh,
  PerspectiveCamera,
  PlaneGeometry,
  Raycaster,
  SRGBColorSpace,
  Scene,
  ShaderMaterial,
  Vector2,
  WebGLRenderer,
} from 'three'
import { pixelRatio, type SceneHandle } from './types'

export interface RingOptions {
  count: number
  reducedMotion: boolean
  /** A card has come to the front. */
  onFront(index: number): void
  /** The front card was clicked or tapped. */
  onSelect(index: number): void
  onReady?(): void
  /** Hex colours: card backs, the front card's frame, and the placeholder tile. */
  colors?: { back: string; accent: string; tile: string }
}

export interface RingHandle extends SceneHandle {
  goTo(index: number): void
  /** Move by whole cards: +1 brings the next card forward. */
  step(delta: number): void
  setTexture(index: number, source: HTMLCanvasElement): void
  setAutoplay(on: boolean): void
}

const CARD_W = 2.3
const CARD_H = CARD_W * 1.25
const GAP = 0.55

const CARD_VERTEX = /* glsl */ `
  uniform float uRadius;
  varying vec2 vUv;
  varying float vDepth;

  void main() {
    vUv = uv;
    vec4 world = modelMatrix * vec4(position, 1.0);
    vDepth = world.z / uRadius;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`

const CARD_FRAGMENT = /* glsl */ `
  uniform sampler2D uMap;
  uniform vec3 uBack;
  uniform vec3 uGold;
  uniform float uFocus;
  uniform float uReflection;
  varying vec2 vUv;
  varying float vDepth;

  void main() {
    float light = mix(0.16, 1.0, smoothstep(-0.9, 0.96, vDepth));
    vec3 col = gl_FrontFacing ? texture2D(uMap, vUv).rgb : uBack;
    col *= light;

    // Thin gold frame that draws in as a card reaches the front.
    vec2 edge = min(vUv, 1.0 - vUv) * vec2(${CARD_W.toFixed(2)}, ${CARD_H.toFixed(3)});
    float frame = 1.0 - smoothstep(0.0, 0.012, min(edge.x, edge.y));
    col = mix(col, uGold, frame * uFocus * 0.9);

    float alpha = 1.0;
    if (uReflection > 0.5) alpha = smoothstep(0.55, 0.0, vUv.y) * 0.2;
    gl_FragColor = vec4(col, alpha);
    #include <colorspace_fragment>
  }
`

function bentCard(radius: number) {
  const geometry = new PlaneGeometry(CARD_W, CARD_H, 24, 1)
  const pos = geometry.attributes.position
  for (let i = 0; i < pos.count; i++) {
    const a = pos.getX(i) / radius
    pos.setX(i, Math.sin(a) * radius)
    pos.setZ(i, Math.cos(a) * radius - radius)
  }
  pos.needsUpdate = true
  geometry.computeBoundingSphere()
  return geometry
}

const mod = (n: number, m: number) => ((n % m) + m) % m

export function createCollectionRing(canvas: HTMLCanvasElement, opts: RingOptions): RingHandle {
  const { count, reducedMotion } = opts
  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' })
  renderer.setPixelRatio(pixelRatio())
  renderer.setClearColor(0x000000, 0)
  const anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8)

  const scene = new Scene()
  const camera = new PerspectiveCamera(30, 1, 0.1, 80)
  const stepAngle = (Math.PI * 2) / count
  const radius = Math.max((count * (CARD_W + GAP)) / (Math.PI * 2), 2.8)

  const geometry = bentCard(radius)
  const ring = new Group()
  scene.add(ring)

  const blank = document.createElement('canvas')
  blank.width = blank.height = 4
  const blankCtx = blank.getContext('2d')!
  blankCtx.fillStyle = opts.colors?.tile ?? '#1D1A15'
  blankCtx.fillRect(0, 0, 4, 4)

  const cards: { pivot: Group; card: Mesh; mirror: Mesh; material: ShaderMaterial; mirrorMaterial: ShaderMaterial; texture: CanvasTexture }[] = []
  for (let i = 0; i < count; i++) {
    const texture = new CanvasTexture(blank)
    texture.colorSpace = SRGBColorSpace
    const uniforms = {
      uMap: { value: texture },
      uRadius: { value: radius },
      uBack: { value: new Color(opts.colors?.back ?? '#14120F') },
      uGold: { value: new Color(opts.colors?.accent ?? '#C9A24A') },
      uFocus: { value: 0 },
      uReflection: { value: 0 },
    }
    const material = new ShaderMaterial({ vertexShader: CARD_VERTEX, fragmentShader: CARD_FRAGMENT, uniforms, side: DoubleSide })
    const mirrorMaterial = new ShaderMaterial({
      vertexShader: CARD_VERTEX,
      fragmentShader: CARD_FRAGMENT,
      uniforms: { ...uniforms, uReflection: { value: 1 } },
      side: DoubleSide,
      transparent: true,
      depthWrite: false,
    })

    const pivot = new Group()
    pivot.rotation.y = i * stepAngle
    const card = new Mesh(geometry, material)
    card.position.z = radius
    card.userData.index = i
    const mirror = new Mesh(geometry, mirrorMaterial)
    mirror.position.set(0, -CARD_H - 0.08, radius)
    mirror.scale.y = -1
    pivot.add(card, mirror)
    ring.add(pivot)
    cards.push({ pivot, card, mirror, material, mirrorMaterial, texture })
  }

  let angle = 0
  let target = 0
  let front = -1
  let autoplay = !reducedMotion
  let hovering = false
  let lastInteraction = performance.now()
  let lastAuto = performance.now()

  const snap = (a: number) => Math.round(a / stepAngle) * stepAngle

  const goTo = (index: number) => {
    const desired = -index * stepAngle
    target = desired + Math.PI * 2 * Math.round((angle - desired) / (Math.PI * 2))
    lastInteraction = performance.now()
    if (reducedMotion) angle = target
    kick()
  }

  const step = (delta: number) => {
    target = snap(target) - delta * stepAngle
    if (reducedMotion) angle = target
    kick()
  }

  // Pointer: drag to spin, click to pick.
  const ndc = new Vector2()
  const raycaster = new Raycaster()
  let dragging = false
  let pointerId = -1
  let lastX = 0
  let moved = 0
  let velocity = 0

  const pick = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect()
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -(((e.clientY - r.top) / r.height) * 2 - 1))
    raycaster.setFromCamera(ndc, camera)
    const hit = raycaster.intersectObjects(cards.map((c) => c.card), false)[0]
    return hit ? (hit.object.userData.index as number) : -1
  }

  const onDown = (e: PointerEvent) => {
    if (e.button !== 0) return
    dragging = true
    pointerId = e.pointerId
    lastX = e.clientX
    moved = 0
    velocity = 0
    lastInteraction = performance.now()
  }

  const onMove = (e: PointerEvent) => {
    if (dragging && e.pointerId === pointerId) {
      const dx = e.clientX - lastX
      lastX = e.clientX
      moved += Math.abs(dx)
      if (moved > 6 && !canvas.hasPointerCapture(e.pointerId)) canvas.setPointerCapture(e.pointerId)
      const k = stepAngle / Math.max(canvas.clientWidth * 0.3, 120)
      angle += dx * k
      target = angle
      velocity = dx * k
      lastInteraction = performance.now()
      kick()
    } else if (e.pointerType === 'mouse') {
      canvas.style.cursor = pick(e) >= 0 ? 'pointer' : 'grab'
    }
  }

  const onUp = (e: PointerEvent) => {
    if (!dragging || e.pointerId !== pointerId) return
    dragging = false
    if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId)
    if (moved < 6) {
      const index = pick(e)
      if (index >= 0) {
        if (index === front) opts.onSelect(index)
        else goTo(index)
      }
    } else {
      target = snap(angle + velocity * 10)
      if (reducedMotion) angle = target
    }
    lastInteraction = performance.now()
    kick()
  }

  const onCancel = () => {
    dragging = false
    target = snap(angle)
    kick()
  }

  const onEnter = () => (hovering = true)
  const onLeave = () => (hovering = false)

  canvas.addEventListener('pointerdown', onDown)
  canvas.addEventListener('pointermove', onMove)
  canvas.addEventListener('pointerup', onUp)
  canvas.addEventListener('pointercancel', onCancel)
  canvas.addEventListener('pointerenter', onEnter)
  canvas.addEventListener('pointerleave', onLeave)

  const resize = () => {
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    if (!w || !h) return
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    // Far enough back that the front card and its neighbours' edges fit.
    const tan = Math.tan((camera.fov * Math.PI) / 360)
    const distance = Math.max((CARD_W * 2.35) / (2 * tan * camera.aspect), (CARD_H * 1.5) / (2 * tan))
    camera.position.set(0, 0.2, radius + distance)
    camera.lookAt(0, -0.45, radius)
    camera.updateProjectionMatrix()
    kick()
  }

  let running = false
  let active = false
  let raf = 0
  let last = 0

  const update = (dt: number) => {
    const now = performance.now()
    if (autoplay && !dragging && !hovering && now - lastInteraction > 4500 && now - lastAuto > 3800) {
      lastAuto = now
      step(1)
    }
    if (!dragging) angle += (target - angle) * (1 - Math.exp(-dt * 5.5))
    ring.rotation.y = angle

    for (let i = 0; i < count; i++) {
      const c = cards[i]
      const focus = Math.pow(Math.max(0, Math.cos(i * stepAngle + angle)), 12)
      c.material.uniforms.uFocus.value = focus
      c.card.position.y = focus * 0.08
      c.card.scale.setScalar(1 + focus * 0.04)
    }

    const current = mod(Math.round(-angle / stepAngle), count)
    if (current !== front) {
      front = current
      opts.onFront(front)
    }
    return dragging || Math.abs(target - angle) > 0.0005
  }

  const frame = (now: number) => {
    const dt = last ? Math.min((now - last) / 1000, 0.05) : 0.016
    last = now
    const moving = update(dt)
    renderer.render(scene, camera)
    // Keep looping while moving, or while autoplay may need to fire.
    if (active && (moving || autoplay)) raf = requestAnimationFrame(frame)
    else running = false
  }

  function kick() {
    if (!active || running) return
    running = true
    last = 0
    raf = requestAnimationFrame(frame)
  }

  const observer = new ResizeObserver(resize)
  observer.observe(canvas)
  resize()
  update(0)
  renderer.render(scene, camera)
  opts.onReady?.()

  return {
    goTo,
    step,
    setAutoplay(on) {
      autoplay = on && !reducedMotion
      if (autoplay) {
        lastInteraction = performance.now()
        kick()
      }
    },
    setTexture(index, source) {
      const c = cards[index]
      if (!c) return
      const texture = new CanvasTexture(source)
      texture.colorSpace = SRGBColorSpace
      texture.anisotropy = anisotropy
      texture.minFilter = LinearMipmapLinearFilter
      c.material.uniforms.uMap.value = texture
      c.mirrorMaterial.uniforms.uMap.value = texture
      c.texture.dispose()
      c.texture = texture
      if (!running) renderer.render(scene, camera)
    },
    setActive(on) {
      active = on
      if (on) kick()
      else {
        cancelAnimationFrame(raf)
        running = false
      }
    },
    dispose() {
      active = false
      cancelAnimationFrame(raf)
      observer.disconnect()
      canvas.removeEventListener('pointerdown', onDown)
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerup', onUp)
      canvas.removeEventListener('pointercancel', onCancel)
      canvas.removeEventListener('pointerenter', onEnter)
      canvas.removeEventListener('pointerleave', onLeave)
      geometry.dispose()
      for (const c of cards) {
        c.material.dispose()
        c.mirrorMaterial.dispose()
        c.texture.dispose()
      }
      renderer.dispose()
      renderer.forceContextLoss()
    },
  }
}
