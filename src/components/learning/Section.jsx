import { HelpCircle, Sparkles } from 'lucide-react'
import { cn } from '../../lib/cn'

/*
 * Section primitives that give every module the same consistent 6-layer rhythm
 * (hook → explanation → playground → visualizer → challenge → quiz).
 */

// A numbered/labelled section block with an icon + heading.
export function Section({ icon: Icon, title, step, children, className }) {
  return (
    <section className={cn('scroll-mt-20', className)}>
      <div className="mb-3 flex items-center gap-2">
        {Icon && (
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent/15 text-accent">
            <Icon size={16} />
          </span>
        )}
        <h2 className="text-lg font-bold text-slate-100">{title}</h2>
        {step && (
          <span className="ml-auto font-mono text-xs text-slate-500">{step}</span>
        )}
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  )
}

// The opening "hook" — a curiosity-triggering question before any theory.
export function Hook({ children }) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-accent/20 bg-accent/5 p-5">
      <HelpCircle className="mb-2 text-accent" size={20} />
      <p className="text-lg font-medium text-slate-100">{children}</p>
    </div>
  )
}

// A callout for a memorable "key idea" / analogy.
export function KeyIdea({ children, title = 'Key idea' }) {
  return (
    <div className="rounded-xl border border-flash/20 bg-flash/5 p-4">
      <p className="mb-1 flex items-center gap-1.5 text-sm font-semibold text-flash">
        <Sparkles size={14} /> {title}
      </p>
      <div className="text-sm text-slate-300">{children}</div>
    </div>
  )
}

// Plain prose paragraph(s) with comfortable reading styles.
export function Prose({ children, className }) {
  return (
    <div className={cn('space-y-3 text-[15px] leading-relaxed text-slate-300', className)}>
      {children}
    </div>
  )
}

// Inline code chip.
export function Code({ children }) {
  return (
    <code className="rounded bg-surface-800 px-1.5 py-0.5 font-mono text-[0.85em] text-accent">
      {children}
    </code>
  )
}
