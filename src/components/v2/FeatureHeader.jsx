import { cn } from '../../lib/cn'

/*
 * Shared header for v2 "Interview Mastery" pages so they feel like one product.
 * icon + title + subtitle, with an optional right-aligned stat/score slot.
 */
export function FeatureHeader({ icon: Icon, title, subtitle, right, tone = 'accent' }) {
  const toneCls = tone === 'flash' ? 'from-flash/20 to-flash/5 text-flash' : 'from-accent/20 to-accent-glow/10 text-accent'
  return (
    <header className="flex flex-wrap items-start justify-between gap-3">
      <div className="flex items-start gap-3">
        {Icon && (
          <span className={cn('grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br', toneCls)}>
            <Icon size={24} />
          </span>
        )}
        <div>
          <h1 className="text-3xl font-extrabold leading-tight">{title}</h1>
          {subtitle && <p className="max-w-2xl text-content-muted">{subtitle}</p>}
        </div>
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </header>
  )
}
