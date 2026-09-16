/**
 * Bakes the 3D T-shirt (teeModel.ts) into product images, one at a time on a single offscreen renderer.
 * lib/mockup.ts calls this when there is no product photo and no blank-garment photo.
 */
import { WebGLRenderer } from 'three'
import { createTeeRig, type TeeLook, type TeeRig } from './teeModel'

let renderer: WebGLRenderer | null = null
let rig: TeeRig | null = null
let queue: Promise<unknown> = Promise.resolve()

async function bake(look: TeeLook, width: number): Promise<string | null> {
  const height = Math.round(width * 1.25)
  if (!renderer) {
    renderer = new WebGLRenderer({ canvas: document.createElement('canvas'), alpha: true, antialias: true, preserveDrawingBuffer: true })
    renderer.setClearColor(0x000000, 0)
    renderer.setPixelRatio(1)
  }
  renderer.setSize(width, height, false)
  if (!rig) rig = await createTeeRig(renderer, look)
  else await rig.setLook(look)
  rig.frame(width / height, 1.12)
  renderer.render(rig.scene, rig.camera)
  const blob = await new Promise<Blob | null>((resolve) => renderer!.domElement.toBlob(resolve, 'image/webp', 0.92))
  return blob ? URL.createObjectURL(blob) : null
}

/** Object URL of a baked T-shirt image (4:5), or null when WebGL is unavailable. */
export function bakeTee(look: TeeLook, width: number): Promise<string | null> {
  const job = queue.then(() => bake(look, width))
  queue = job.catch(() => undefined)
  return job.catch(() => null)
}
