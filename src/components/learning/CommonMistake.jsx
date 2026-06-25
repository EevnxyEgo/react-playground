import { Link } from 'react-router-dom'
import { AlertTriangle, ArrowUpRight } from 'lucide-react'

/*
 * <CommonMistake> — an inline callout surfacing a classic mistake right where
 * it's relevant. It cross-links to existing Debugging Gauntlet / Predict-the-
 * Output content instead of duplicating the explanation (v3, Section 3.4).
 *
 * Props: { title?, children, to?, linkLabel? }
 */
export function CommonMistake({ title = 'Common mistake', children, to, linkLabel = 'See it in action' }) {
  return (
    <div className="rounded-xl border border-rose-500/25 bg-rose-500/5 p-4">
      <p className="mb-1 flex items-center gap-1.5 text-sm font-semibold text-rose-300">
        <AlertTriangle size={15} /> {title}
      </p>
      <div className="text-sm text-content">{children}</div>
      {to && (
        <Link
          to={to}
          className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
        >
          {linkLabel} <ArrowUpRight size={14} />
        </Link>
      )}
    </div>
  )
}
