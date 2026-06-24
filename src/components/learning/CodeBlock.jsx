import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { cn } from '../../lib/cn'

/*
 * Static, non-editable code display with a copy button — used for short
 * snippets and inside ComparisonTabs where a full Sandpack would be overkill.
 * (Kept deliberately simple: no syntax-highlighting dependency.)
 */
export function CodeBlock({ code, filename, className }) {
  const [copied, setCopied] = useState(false)

  function copy() {
    navigator.clipboard?.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div className={cn('overflow-hidden rounded-lg border border-line/10 bg-surface-950', className)}>
      <div className="flex items-center justify-between border-b border-line/10 bg-surface-800/60 px-3 py-1.5">
        <span className="font-mono text-xs text-content-muted">{filename || 'snippet'}</span>
        <button
          onClick={copy}
          className="flex items-center gap-1 rounded px-1.5 py-1 text-xs text-content-muted hover:bg-line/5 focus-ring"
        >
          {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-[13px] leading-relaxed">
        <code className="font-mono text-content">{code}</code>
      </pre>
    </div>
  )
}
