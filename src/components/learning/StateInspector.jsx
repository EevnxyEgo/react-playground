import { Braces } from 'lucide-react'
import { cn } from '../../lib/cn'

/*
 * StateInspector — the "Mini State Inspector". A small panel that shows a live
 * JSON view of whatever state object you pass it, so state feels concrete:
 * change the UI, watch the JSON update in real time.
 */
export function StateInspector({ data, title = 'State', className }) {
  return (
    <div className={cn('rounded-xl border border-line/10 bg-surface-950', className)}>
      <div className="flex items-center gap-1.5 border-b border-line/10 px-3 py-2 text-xs font-medium text-content-muted">
        <Braces size={13} className="text-accent" /> {title}
      </div>
      <pre className="overflow-x-auto p-3 text-[13px] leading-relaxed">
        <code className="font-mono">{format(data)}</code>
      </pre>
    </div>
  )
}

// Lightweight JSON pretty-print with very light coloring of values.
function format(data) {
  try {
    return JSON.stringify(data, null, 2)
  } catch {
    return String(data)
  }
}
