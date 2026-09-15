/**
 * Home hero backdrop: dark satin with sharp highlights along the folds, and drifting dust, in theme colours.
 * Loaded on demand by components/HeroBackdrop.tsx, so no other page pays for three.js.
 */
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  Mesh,
  PerspectiveCamera,
  PlaneGeometry,
  Points,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three'
import { pixelRatio, type SceneHandle } from './types'

export interface HeroOptions {
  reducedMotion: boolean
  /** Hex colours: cloth base, tight glint, rim light and dust. */
  colors: { base: string; sheen: string; rim: string; dust: string }
  onReady?: () => void
}

const SILK_VERTEX = /* glsl */ `
  uniform float uTime;
  uniform vec2 uPointer;
  uniform float uPointerStrength;
  varying vec3 vNormalW;
  varying vec3 vPosW;
  varying vec2 vUv;

  float height(vec2 p) {
    float t = uTime;
    float h = sin(p.x * 0.5 + t * 0.3) * 0.46;
    h += sin(p.y * 0.9 - t * 0.22 + p.x * 0.35) * 0.3;
    h += sin(p.x * 1.55 + p.y * 0.4 + t * 0.42) * 0.17;
    h += sin((p.x - p.y) * 2.3 - t * 0.5) * 0.05;
    float d = distance(p, uPointer);
    h += exp(-d * d * 0.3) * sin(d * 2.4 - t * 2.2) * 0.16 * uPointerStrength;
    return h;
  }

  void main() {
    vUv = uv;
    vec2 p = position.xy;
    float e = 0.04;
    float h = height(p);
    float dx = height(p + vec2(e, 0.0)) - height(p - vec2(e, 0.0));
    float dy = height(p + vec2(0.0, e)) - height(p - vec2(0.0, e));
    vec3 n = normalize(vec3(-dx / (2.0 * e), -dy / (2.0 * e), 1.0));
    vec4 world = modelMatrix * vec4(p, h, 1.0);
    vPosW = world.xyz;
    vNormalW = normalize(mat3(modelMatrix) * n);
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`

const SILK_FRAGMENT = /* glsl */ `
  uniform vec3 uBase;
  uniform vec3 uSheen;
  uniform vec3 uRim;
  uniform vec3 uLight;
  varying vec3 vNormalW;
  varying vec3 vPosW;
  varying vec2 vUv;

  void main() {
    vec3 n = normalize(vNormalW);
    if (!gl_FrontFacing) n = -n;
    vec3 v = normalize(cameraPosition - vPosW);
    vec3 l = normalize(uLight);
    float diffuse = max(dot(n, l), 0.0);
    float nh = max(dot(n, normalize(l + v)), 0.0);
    // A tight highlight for the satin glint, a soft one for the sheen around it.
    float glint = pow(nh, 90.0);
    float sheen = pow(nh, 10.0);
    float rim = pow(1.0 - max(dot(n, v), 0.0), 4.0);
    vec3 col = uBase * (0.22 + 0.55 * diffuse) + uSheen * (glint * 1.25 + sheen * 0.12) + uRim * rim * 0.14;
    float edge = smoothstep(0.0, 0.22, vUv.x) * smoothstep(1.0, 0.8, vUv.x) * smoothstep(0.0, 0.35, vUv.y) * smoothstep(1.0, 0.7, vUv.y);
    gl_FragColor = vec4(col, edge);
    #include <colorspace_fragment>
  }
`

const DUST_VERTEX = /* glsl */ `
  attribute float aSeed;
  uniform float uTime;
  uniform float uScale;
  varying float vAlpha;

  void main() {
    vec3 p = position;
    p.y = mod(p.y + uTime * (0.05 + aSeed * 0.12) + 3.0, 6.0) - 3.0;
    p.x += sin(uTime * 0.3 + aSeed * 40.0) * 0.25;
    p.z += cos(uTime * 0.23 + aSeed * 30.0) * 0.2;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = (1.6 + aSeed * 4.2) * uScale * (6.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
    float twinkle = 0.5 + 0.5 * sin(uTime * (0.7 + aSeed * 1.5) + aSeed * 90.0);
    vAlpha = twinkle * smoothstep(3.0, 2.0, abs(p.y));
  }
`

const DUST_FRAGMENT = /* glsl */ `
  uniform vec3 uColor;
  varying float vAlpha;

  void main() {
    float a = smoothstep(0.5, 0.0, length(gl_PointCoord - 0.5));
    gl_FragColor = vec4(uColor, a * vAlpha * 0.55);
    #include <colorspace_fragment>
  }
`

export function createHeroBackdrop(canvas: HTMLCanvasElement, { reducedMotion, colors, onReady }: HeroOptions): SceneHandle {
  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' })
  renderer.setPixelRatio(pixelRatio())
  renderer.setClearColor(0x000000, 0)

  const scene = new Scene()
  const camera = new PerspectiveCamera(42, 1, 0.1, 60)
  const lookAt = new Vector3(0, -0.7, 0)

  const silkMaterial = new ShaderMaterial({
    vertexShader: SILK_VERTEX,
    fragmentShader: SILK_FRAGMENT,
    transparent: true,
    depthWrite: false,
    uniforms: {
      uTime: { value: 2.5 },
      uPointer: { value: new Vector2(99, 99) },
      uPointerStrength: { value: 0 },
      uBase: { value: new Color(colors.base) },
      uSheen: { value: new Color(colors.sheen) },
      uRim: { value: new Color(colors.rim) },
      uLight: { value: new Vector3(-0.5, 0.9, 0.45) },
    },
  })
  const silk = new Mesh(new PlaneGeometry(18, 10, 220, 120), silkMaterial)
  silk.rotation.set(-1.02, 0, -0.1)
  silk.position.set(0, -1.7, -1.2)
  scene.add(silk)

  const narrow = window.innerWidth < 768
  const count = narrow ? 160 : 300
  const positions = new Float32Array(count * 3)
  const seeds = new Float32Array(count)
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 14
    positions[i * 3 + 1] = (Math.random() - 0.5) * 6
    positions[i * 3 + 2] = -3 + Math.random() * 5.5
    seeds[i] = Math.random()
  }
  const dustGeometry = new BufferGeometry()
  dustGeometry.setAttribute('position', new BufferAttribute(positions, 3))
  dustGeometry.setAttribute('aSeed', new BufferAttribute(seeds, 1))
  const dustMaterial = new ShaderMaterial({
    vertexShader: DUST_VERTEX,
    fragmentShader: DUST_FRAGMENT,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    uniforms: {
      uTime: { value: 2.5 },
      uScale: { value: pixelRatio() },
      uColor: { value: new Color(colors.dust) },
    },
  })
  const dust = new Points(dustGeometry, dustMaterial)
  scene.add(dust)

  // Pointer, in -1…1 across the canvas; eased every frame.
  const pointer = new Vector2(0, 0)
  const pointerTarget = new Vector2(0, 0)
  let strengthTarget = 0

  const onPointerMove = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return
    const r = canvas.getBoundingClientRect()
    const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom
    strengthTarget = inside ? 1 : 0
    if (!inside) return
    pointerTarget.set(((e.clientX - r.left) / r.width) * 2 - 1, -(((e.clientY - r.top) / r.height) * 2 - 1))
  }

  let running = false
  let raf = 0
  let last = 0
  let time = 2.5

  const draw = () => {
    camera.position.x = pointer.x * 0.55
    camera.position.y = 0.45 + pointer.y * 0.3
    camera.lookAt(lookAt)
    renderer.render(scene, camera)
  }

  const resize = () => {
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    if (!w || !h) return
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    const wide = camera.aspect >= 1
    camera.position.z = wide ? 7.6 : 10.5
    // On wide screens the silk sits under the garment, leaving the headline on calm ground.
    silk.position.x = wide ? 2.6 : 0
    dust.position.x = wide ? 2 : 0
    camera.updateProjectionMatrix()
    if (!running) draw()
  }

  const frame = (now: number) => {
    const dt = last ? Math.min((now - last) / 1000, 0.05) : 0.016
    last = now
    time += dt
    const ease = 1 - Math.exp(-dt * 3)
    pointer.lerp(pointerTarget, ease)
    const strength = silkMaterial.uniforms.uPointerStrength
    strength.value += (strengthTarget - strength.value) * ease
    // Plane-local coordinates for the ripple under the cursor.
    silkMaterial.uniforms.uPointer.value.set(pointer.x * 7 - silk.position.x, pointer.y * 2.5 - 1.2)
    silkMaterial.uniforms.uTime.value = time
    dustMaterial.uniforms.uTime.value = time
    draw()
    raf = requestAnimationFrame(frame)
  }

  const observer = new ResizeObserver(resize)
  observer.observe(canvas)
  resize()
  draw()
  onReady?.()
  if (!reducedMotion) window.addEventListener('pointermove', onPointerMove, { passive: true })

  return {
    setActive(active) {
      if (reducedMotion || active === running) return
      running = active
      if (active) {
        last = 0
        raf = requestAnimationFrame(frame)
      } else cancelAnimationFrame(raf)
    },
    dispose() {
      running = false
      cancelAnimationFrame(raf)
      observer.disconnect()
      window.removeEventListener('pointermove', onPointerMove)
      silk.geometry.dispose()
      silkMaterial.dispose()
      dustGeometry.dispose()
      dustMaterial.dispose()
      renderer.dispose()
      renderer.forceContextLoss()
    },
  }
}
