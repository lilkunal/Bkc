export interface SceneHandle {
  /** Run or pause the animation loop, e.g. while the canvas is scrolled out of view or the tab is hidden. */
  setActive(active: boolean): void
  dispose(): void
}

/** Pixel ratio cap: sharp on 2× screens without paying for 3× phones. */
export const pixelRatio = () => Math.min(window.devicePixelRatio || 1, 1.75)
