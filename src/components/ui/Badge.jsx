import { cn } from '../../lib/cn'

// Small pill label — used for categories, "Comparison", "Visualizer", XP, etc.
const TONES = {
  default: 'bg-line/5 text-content border-line/10',
  accent: 'bg-accent/15 text-accent border-accent/30',
  flash: 'bg-flash/15 text-flash border-flash/30',
  success: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  muted: 'bg-line/5 text-content-muted border-line/10',
}

export function Badge({ tone = 'default', className, children, ...rest }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium',
        TONES[tone],
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  )
}
