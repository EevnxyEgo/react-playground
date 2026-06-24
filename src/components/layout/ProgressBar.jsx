import { cn } from '../../lib/cn'

// Reusable horizontal progress bar (0–100). Used for overall completion and
// per-level XP. Animated width transition for a satisfying fill.
export function ProgressBar({ value = 0, className, barClassName, showLabel = false }) {
  const pct = Math.max(0, Math.min(100, value))
  return (
    <div className={cn('w-full', className)}>
      <div className="h-2 w-full overflow-hidden rounded-full bg-surface-700/80">
        <div
          className={cn(
            'h-full rounded-full bg-gradient-to-r from-accent to-accent-glow transition-[width] duration-500 ease-out',
            barClassName,
          )}
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      {showLabel && (
        <div className="mt-1 text-right text-xs text-content-muted">{pct}%</div>
      )}
    </div>
  )
}
