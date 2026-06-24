import { useState } from 'react'
import { Check, X, HelpCircle, Sparkles } from 'lucide-react'
import { useProgress } from '../../hooks/useProgress'
import { useModule } from './ModuleContext'
import { Confetti } from './Confetti'
import { cn } from '../../lib/cn'

/*
 * Quiz — 1–N multiple-choice questions with INSTANT feedback:
 *   correct  → green highlight + a confetti burst + XP (awarded once)
 *   wrong    → red highlight + the explanation of why
 *
 * Each question's progress is keyed "<moduleSlug>:<question.id>" so XP can't be
 * farmed by re-answering.
 *
 * questions: [{ id, question, options: string[], answer: number, explanation }]
 */
export function Quiz({ questions }) {
  return (
    <div className="space-y-4">
      {questions.map((q, i) => (
        <QuizItem key={q.id} q={q} index={i} />
      ))}
    </div>
  )
}

function QuizItem({ q, index }) {
  const { slug } = useModule()
  const { markQuizCorrect, isQuizCorrect } = useProgress()
  const key = `${slug}:${q.id}`
  const alreadyCorrect = isQuizCorrect(key)

  const [selected, setSelected] = useState(alreadyCorrect ? q.answer : null)
  const [fire, setFire] = useState(0)

  const answered = selected !== null
  const isCorrect = answered && selected === q.answer

  function choose(i) {
    if (isCorrect) return // lock once correct
    setSelected(i)
    if (i === q.answer) {
      setFire((f) => f + 1)
      markQuizCorrect(key) // idempotent + awards XP once
    }
  }

  return (
    <div className="relative rounded-xl border border-white/10 bg-surface-900 p-5">
      <Confetti fire={isCorrect ? fire : 0} />
      <p className="mb-3 flex items-start gap-2 font-medium text-slate-100">
        <HelpCircle size={18} className="mt-0.5 shrink-0 text-accent" />
        <span>
          <span className="mr-1 font-mono text-xs text-slate-500">Q{index + 1}.</span>
          {q.question}
        </span>
      </p>

      <div className="grid gap-2">
        {q.options.map((opt, i) => {
          const isThis = selected === i
          const showCorrect = answered && i === q.answer
          const showWrong = isThis && i !== q.answer
          return (
            <button
              key={i}
              type="button"
              onClick={() => choose(i)}
              disabled={isCorrect}
              className={cn(
                'flex items-center justify-between rounded-lg border px-3 py-2 text-left text-sm transition-colors focus-ring',
                !answered && 'border-white/10 hover:border-accent/40 hover:bg-white/5',
                showCorrect && 'border-emerald-500/50 bg-emerald-500/10 text-emerald-200',
                showWrong && 'border-rose-500/50 bg-rose-500/10 text-rose-200',
                answered && !showCorrect && !showWrong && 'border-white/10 opacity-60',
              )}
            >
              <span>{opt}</span>
              {showCorrect && <Check size={16} className="text-emerald-400" />}
              {showWrong && <X size={16} className="text-rose-400" />}
            </button>
          )
        })}
      </div>

      {/* Feedback */}
      {answered && (
        <div
          className={cn(
            'mt-3 rounded-lg p-3 text-sm',
            isCorrect ? 'bg-emerald-500/10 text-emerald-200' : 'bg-rose-500/10 text-rose-200',
          )}
        >
          {isCorrect ? (
            <p className="flex items-center gap-1.5 font-medium">
              <Sparkles size={14} /> Correct! +20 XP
            </p>
          ) : (
            <p>
              <span className="font-semibold">Not quite. </span>
              {q.explanation}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
