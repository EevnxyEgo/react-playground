import { useState } from 'react'
import { Target, Check, Lightbulb, Trophy } from 'lucide-react'
import { useProgress } from '../../hooks/useProgress'
import { useModule } from './ModuleContext'
import { Button } from '../ui/Button'
import { cn } from '../../lib/cn'

/*
 * Challenge — a small hands-on task with a self-check checklist. When every
 * item is ticked, the learner can mark the challenge done (awards XP once per
 * module). An optional hint is revealed on demand.
 *
 * Props: { task, checklist: string[], hint? }
 */
export function Challenge({ task, checklist = [], hint }) {
  const { slug } = useModule()
  const { isChallengeDone, markChallengeDone } = useProgress()
  const done = isChallengeDone(slug)

  const [checked, setChecked] = useState(() => checklist.map(() => false))
  const [showHint, setShowHint] = useState(false)

  const allChecked = checked.length > 0 && checked.every(Boolean)

  function toggle(i) {
    setChecked((prev) => prev.map((v, idx) => (idx === i ? !v : v)))
  }

  return (
    <div className="rounded-xl border border-line/10 bg-surface-900 p-5">
      <div className="mb-3 flex items-center gap-2">
        <Target size={18} className="text-accent" />
        <h3 className="font-semibold text-content-strong">Mini Challenge</h3>
        {done && (
          <span className="ml-auto flex items-center gap-1 text-sm text-emerald-400">
            <Trophy size={15} /> Done
          </span>
        )}
      </div>

      <div className="mb-4 text-[15px] text-content">{task}</div>

      {checklist.length > 0 && (
        <ul className="mb-4 space-y-2">
          {checklist.map((item, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => toggle(i)}
                className="flex w-full items-start gap-2 text-left text-sm text-content focus-ring rounded"
              >
                <span
                  className={cn(
                    'mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded border transition-colors',
                    checked[i]
                      ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400'
                      : 'border-line/20',
                  )}
                >
                  {checked[i] && <Check size={13} />}
                </span>
                <span className={cn(checked[i] && 'text-content-muted line-through')}>{item}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant={done ? 'secondary' : 'primary'}
          size="sm"
          disabled={!allChecked || done}
          onClick={() => markChallengeDone(slug)}
        >
          <Check size={15} />
          {done ? 'Completed' : 'Mark challenge done (+30 XP)'}
        </Button>
        {hint && (
          <Button variant="ghost" size="sm" onClick={() => setShowHint((s) => !s)}>
            <Lightbulb size={15} /> {showHint ? 'Hide hint' : 'Hint'}
          </Button>
        )}
      </div>

      {showHint && hint && (
        <div className="mt-3 rounded-lg border border-flash/20 bg-flash/5 p-3 text-sm text-content">
          {hint}
        </div>
      )}
    </div>
  )
}
