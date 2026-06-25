import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Workflow, Check, X, ArrowRight, ArrowLeft, Map, RotateCcw, Sparkles } from 'lucide-react'
import { hookScenarios } from '../data/hookScenarios'
import { useProgress } from '../hooks/useProgress'
import { PageTransition } from '../components/layout/PageTransition'
import { FeatureHeader } from '../components/v2/FeatureHeader'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Confetti } from '../components/learning/Confetti'
import { cn } from '../lib/cn'

/*
 * Hook Decision Engine — drills "which hook do I reach for here?".
 * The user must (a) pick a hook and (b) articulate WHY (free text, ungraded)
 * before revealing the answer + a "why NOT the alternatives" breakdown.
 */
export default function HookDecisionEngine() {
  const { answerHook, hookResult, v2 } = useProgress()
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [why, setWhy] = useState('')
  const [revealed, setRevealed] = useState(false)
  const [fire, setFire] = useState(0)

  const s = hookScenarios[index]
  const correct = revealed && selected === s.answer

  function reveal() {
    if (selected == null) return
    setRevealed(true)
    const isRight = selected === s.answer
    answerHook(s.id, isRight)
    if (isRight) setFire((f) => f + 1)
  }

  function goto(next) {
    setIndex(next)
    setSelected(null)
    setWhy('')
    setRevealed(false)
  }

  const answeredCount = v2.counts.hookAnswered
  const score = v2.counts.hookCorrect

  return (
    <PageTransition className="space-y-6">
      <FeatureHeader
        icon={Workflow}
        title="Hook Decision Engine"
        subtitle="Read a real scenario, decide which hook fits and why, then see why the alternatives fall short — the exact thing interviewers probe."
        right={
          <div className="flex flex-col items-end gap-1 text-sm">
            <Badge tone="accent">Score {score}/{hookScenarios.length}</Badge>
            <Link to="/decision-map" className="flex items-center gap-1 text-content-muted hover:text-accent">
              <Map size={14} /> Decision Map
            </Link>
          </div>
        }
      />

      {/* progress dots */}
      <div className="flex flex-wrap gap-1.5">
        {hookScenarios.map((sc, i) => {
          const r = hookResult(sc.id)
          return (
            <button
              key={sc.id}
              onClick={() => goto(i)}
              title={`Scenario ${i + 1}`}
              className={cn(
                'h-2.5 w-2.5 rounded-full transition-all',
                i === index && 'ring-2 ring-accent ring-offset-2 ring-offset-surface-950',
                r?.correct ? 'bg-emerald-400' : r ? 'bg-rose-400' : 'bg-surface-600',
              )}
            />
          )
        })}
      </div>

      {/* scenario card */}
      <div className="relative rounded-2xl border border-line/10 bg-surface-900 p-6">
        <Confetti fire={correct ? fire : 0} />
        <p className="mb-1 font-mono text-xs text-content-faint">
          Scenario {index + 1} of {hookScenarios.length}
        </p>
        <p className="text-lg font-medium text-content-strong">{s.scenario}</p>

        {/* options */}
        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          {s.options.map((opt) => {
            const isAnswer = opt === s.answer
            const isPicked = selected === opt
            return (
              <button
                key={opt}
                disabled={revealed}
                onClick={() => setSelected(opt)}
                className={cn(
                  'flex items-center justify-between rounded-lg border px-3 py-2.5 text-left text-sm font-medium transition-colors focus-ring',
                  !revealed && isPicked && 'border-accent bg-accent/10 text-accent',
                  !revealed && !isPicked && 'border-line/10 hover:border-accent/40',
                  revealed && isAnswer && 'border-emerald-500/50 bg-emerald-500/10 text-emerald-200',
                  revealed && isPicked && !isAnswer && 'border-rose-500/50 bg-rose-500/10 text-rose-200',
                  revealed && !isAnswer && !isPicked && 'border-line/10 opacity-60',
                )}
              >
                <span className="font-mono">{opt}</span>
                {revealed && isAnswer && <Check size={16} className="text-emerald-400" />}
                {revealed && isPicked && !isAnswer && <X size={16} className="text-rose-400" />}
              </button>
            )
          })}
        </div>

        {/* why box */}
        <div className="mt-4">
          <label className="mb-1 block text-xs font-medium text-content-muted">
            Why? (say it out loud / type it — this isn't graded, it builds the habit)
          </label>
          <textarea
            value={why}
            onChange={(e) => setWhy(e.target.value)}
            disabled={revealed}
            rows={2}
            placeholder="e.g. it's a side effect that depends on userId, so…"
            className="w-full rounded-lg border border-line/10 bg-surface-800 px-3 py-2 text-sm text-content placeholder:text-content-faint focus-ring disabled:opacity-60"
          />
        </div>

        {!revealed ? (
          <Button className="mt-4" disabled={selected == null} onClick={reveal}>
            Reveal answer
          </Button>
        ) : (
          <div className="mt-5 space-y-3">
            <div
              className={cn(
                'rounded-lg p-3 text-sm',
                correct ? 'bg-emerald-500/10 text-emerald-200' : 'bg-rose-500/10 text-rose-200',
              )}
            >
              <p className="flex items-center gap-1.5 font-semibold">
                {correct ? <Sparkles size={15} /> : <X size={15} />}
                {correct ? 'Correct!' : `Not quite — the answer is ${s.answer}.`}
              </p>
              <p className="mt-1 text-content">{s.why}</p>
            </div>

            <div className="rounded-lg border border-line/10 bg-surface-950 p-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-content-faint">
                Why not the others
              </p>
              <ul className="space-y-1.5 text-sm">
                {Object.entries(s.whyNot).map(([opt, reason]) => (
                  <li key={opt} className="text-content-muted">
                    <span className="font-mono text-content">{opt}</span> — {reason}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* nav */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" disabled={index === 0} onClick={() => goto(index - 1)}>
          <ArrowLeft size={16} /> Previous
        </Button>
        <Button variant="ghost" onClick={() => goto(0)} title="Restart from the first scenario">
          <RotateCcw size={14} /> Restart
        </Button>
        {index < hookScenarios.length - 1 ? (
          <Button variant="secondary" onClick={() => goto(index + 1)}>
            Next <ArrowRight size={16} />
          </Button>
        ) : (
          <Link to="/architecture-trainer">
            <Button>
              Architecture Trainer <ArrowRight size={16} />
            </Button>
          </Link>
        )}
      </div>
    </PageTransition>
  )
}
