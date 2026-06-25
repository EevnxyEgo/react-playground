import { useState } from 'react'
import { Eye, Check, X, ArrowRight, ArrowLeft, RotateCcw, Sparkles, Play } from 'lucide-react'
import { predictChallenges } from '../data/predictChallenges'
import { useProgress } from '../hooks/useProgress'
import { PageTransition } from '../components/layout/PageTransition'
import { FeatureHeader } from '../components/v2/FeatureHeader'
import { CodeBlock } from '../components/learning/CodeBlock'
import { CodePlayground } from '../components/learning/CodePlayground'
import { Confetti } from '../components/learning/Confetti'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { cn } from '../lib/cn'

/*
 * Predict the Output — read a snippet, predict the result/order, THEN run it.
 * Reveals the actual behavior in a live Sandpack preview + the mechanism.
 */
export default function PredictOutput() {
  const { answerPredict, predictResult, v2 } = useProgress()
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [revealed, setRevealed] = useState(false)
  const [showRun, setShowRun] = useState(false)
  const [fire, setFire] = useState(0)

  const c = predictChallenges[index]
  const correct = revealed && selected === c.answer

  function reveal() {
    if (selected == null) return
    setRevealed(true)
    const right = selected === c.answer
    answerPredict(c.id, right)
    if (right) setFire((f) => f + 1)
  }

  function goto(next) {
    setIndex(next)
    setSelected(null)
    setRevealed(false)
    setShowRun(false)
  }

  return (
    <PageTransition className="space-y-6">
      <FeatureHeader
        icon={Eye}
        title="Predict the Output"
        subtitle="“What does this log, and in what order?” Predict first, then run it. This trains code-reading — a staple of real interviews."
        right={<Badge tone="accent">Score {v2.counts.predictCorrect}/{predictChallenges.length}</Badge>}
      />

      <div className="flex flex-wrap gap-1.5">
        {predictChallenges.map((pc, i) => {
          const r = predictResult(pc.id)
          return (
            <button
              key={pc.id}
              onClick={() => goto(i)}
              className={cn(
                'h-2.5 w-2.5 rounded-full transition-all',
                i === index && 'ring-2 ring-accent ring-offset-2 ring-offset-surface-950',
                r?.correct ? 'bg-emerald-400' : r ? 'bg-rose-400' : 'bg-surface-600',
              )}
            />
          )
        })}
      </div>

      <div className="relative rounded-2xl border border-line/10 bg-surface-900 p-6">
        <Confetti fire={correct ? fire : 0} />
        <p className="mb-1 font-mono text-xs text-content-faint">
          {index + 1} of {predictChallenges.length} · {c.title}
        </p>

        <CodeBlock filename="snippet.js" code={c.code} className="mt-2" />

        <p className="mt-4 font-medium text-content-strong">{c.question}</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {c.options.map((opt, i) => {
            const isAnswer = i === c.answer
            const isPicked = selected === i
            return (
              <button
                key={i}
                disabled={revealed}
                onClick={() => setSelected(i)}
                className={cn(
                  'flex items-center justify-between rounded-lg border px-3 py-2 text-left text-sm transition-colors focus-ring',
                  !revealed && isPicked && 'border-accent bg-accent/10 text-accent',
                  !revealed && !isPicked && 'border-line/10 hover:border-accent/40',
                  revealed && isAnswer && 'border-emerald-500/50 bg-emerald-500/10 text-emerald-200',
                  revealed && isPicked && !isAnswer && 'border-rose-500/50 bg-rose-500/10 text-rose-200',
                  revealed && !isAnswer && !isPicked && 'border-line/10 opacity-60',
                )}
              >
                <span className="font-mono">{opt}</span>
                {revealed && isAnswer && <Check size={15} className="text-emerald-400" />}
                {revealed && isPicked && !isAnswer && <X size={15} className="text-rose-400" />}
              </button>
            )
          })}
        </div>

        {!revealed ? (
          <Button className="mt-4" disabled={selected == null} onClick={reveal}>
            Reveal
          </Button>
        ) : (
          <div className="mt-5 space-y-3">
            <div className={cn('rounded-lg p-3 text-sm', correct ? 'bg-emerald-500/10 text-emerald-200' : 'bg-rose-500/10 text-rose-200')}>
              <p className="flex items-center gap-1.5 font-semibold">
                {correct ? <Sparkles size={15} /> : <X size={15} />}
                {correct ? 'Correct!' : `Answer: ${c.options[c.answer]}`}
              </p>
              <p className="mt-1 text-content">{c.explanation}</p>
            </div>

            {!showRun ? (
              <Button variant="secondary" onClick={() => setShowRun(true)}>
                <Play size={15} /> Run it to confirm
              </Button>
            ) : (
              <CodePlayground title="Run it" files={c.files} showConsole editorHeight={300} />
            )}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <Button variant="ghost" disabled={index === 0} onClick={() => goto(index - 1)}>
          <ArrowLeft size={16} /> Previous
        </Button>
        <Button variant="ghost" onClick={() => goto(0)}>
          <RotateCcw size={14} /> Restart
        </Button>
        {index < predictChallenges.length - 1 ? (
          <Button variant="secondary" onClick={() => goto(index + 1)}>
            Next <ArrowRight size={16} />
          </Button>
        ) : (
          <span className="text-sm text-content-faint">Last one 🎉</span>
        )}
      </div>
    </PageTransition>
  )
}
