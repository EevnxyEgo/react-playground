import { cn } from '../../lib/cn'

// Reusable button with a few visual variants. Forwarding `className` lets
// callers tweak layout without prop-explosion.
const VARIANTS = {
  primary:
    'bg-gradient-to-r from-accent to-accent-glow text-slate-950 font-semibold hover:brightness-110 shadow-glow',
  secondary:
    'bg-surface-700 text-content-strong hover:bg-surface-600 border border-line/10',
  outline:
    'border border-accent/40 text-accent hover:bg-accent/10',
  ghost: 'text-content hover:bg-line/5',
  danger: 'bg-rose-500/90 text-white hover:bg-rose-500',
}

const SIZES = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-5 py-2.5 text-base gap-2',
  icon: 'p-2',
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  type = 'button',
  children,
  ...rest
}) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center rounded-lg transition-all duration-150 focus-ring disabled:opacity-50 disabled:pointer-events-none',
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  )
}
