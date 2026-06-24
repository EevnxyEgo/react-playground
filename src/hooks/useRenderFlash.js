import { useEffect, useLayoutEffect, useRef, useState } from 'react'

/*
 * useRenderFlash — the engine behind the Render Visualizer.
 *
 * Attach the returned `ref` to any element. Every time the host component
 * re-renders, that element briefly flashes (a yellow/amber ring that fades
 * out) so the learner can *literally see* React re-rendering it. We also
 * return `renderCount` so a module can display "rendered N times".
 *
 * How it works:
 *   - A ref counts renders without itself causing renders.
 *   - On each commit (useLayoutEffect → runs before paint) we toggle an
 *     animation class on the node, forcing the CSS keyframe to restart.
 *
 * This is intentionally a reusable custom hook — it's also the live subject of
 * Module 13 (Custom Hooks).
 */
export function useRenderFlash({ enabled = true } = {}) {
  const ref = useRef(null)
  const renderCount = useRef(0)
  // Bump a state value only so consumers re-render to read renderCount.current
  // via the returned number; the count itself lives in a ref.
  const [, force] = useState(0)
  renderCount.current += 1

  useLayoutEffect(() => {
    const node = ref.current
    if (!node || !enabled) return
    // Skip flashing the very first mount? We DO flash on mount too, because a
    // mount is a render and seeing it helps the mental model.
    node.classList.remove('rf-flash')
    // Force reflow so removing + re-adding the class restarts the animation.
    void node.offsetWidth
    node.classList.add('rf-flash')
  })

  // Clean up the class shortly after each flash so it can retrigger.
  useEffect(() => {
    const node = ref.current
    if (!node) return
    const t = setTimeout(() => node.classList.remove('rf-flash'), 750)
    return () => clearTimeout(t)
  })

  return {
    ref,
    renderCount: renderCount.current,
    // Allow a consumer to force a re-render of itself for demos.
    rerender: () => force((n) => n + 1),
  }
}
