import { cn } from '../../lib/cn'

// Surface card — the primary content container across the app.
// rounded-xl, soft shadow, subtle border; adapts to light/dark.
export function Card({ className, as: Tag = 'div', children, ...rest }) {
  return (
    <Tag
      className={cn(
        'rounded-xl border border-line/10 bg-surface-900/80 shadow-card backdrop-blur-sm',
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  )
}

export function CardHeader({ className, children, ...rest }) {
  return (
    <div className={cn('px-5 pt-5 pb-3', className)} {...rest}>
      {children}
    </div>
  )
}

export function CardBody({ className, children, ...rest }) {
  return (
    <div className={cn('px-5 pb-5', className)} {...rest}>
      {children}
    </div>
  )
}
