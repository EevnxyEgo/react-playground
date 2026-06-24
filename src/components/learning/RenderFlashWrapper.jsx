import { useRenderFlash } from '../../hooks/useRenderFlash'
import { Eye } from 'lucide-react'
import { cn } from '../../lib/cn'

/*
 * RenderFlashWrapper — the visible Render Visualizer.
 *
 * Wrap any live demo UI in this. Every time this wrapper re-renders (which
 * happens whenever its parent re-renders), it flashes an amber ring and bumps
 * a "renders: N" counter — so the learner can LITERALLY see React re-rendering.
 *
 * Because it reads from useRenderFlash, this component is also the running
 * example referenced by Module 13 (Custom Hooks).
 */
export function RenderFlashWrapper({ label = 'Live component', children, className }) {
  const { ref, renderCount } = useRenderFlash()

  return (
    <div
      ref={ref}
      className={cn(
        'relative rounded-xl border border-white/10 bg-surface-950 p-4 transition-shadow',
        className,
      )}
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
          <Eye size={13} className="text-flash" /> {label}
        </span>
        <span className="rounded-full bg-flash/15 px-2 py-0.5 font-mono text-xs text-flash">
          renders: {renderCount}
        </span>
      </div>
      {children}
    </div>
  )
}
