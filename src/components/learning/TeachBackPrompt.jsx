import { useState } from 'react'
import { Link } from 'react-router-dom'
import { GraduationCap, Check, BookOpen, Save, Sparkles } from 'lucide-react'
import { useProgress } from '../../hooks/useProgress'
import { Button } from '../ui/Button'
import { cn } from '../../lib/cn'

/*
 * TeachBackPrompt — the Feynman-technique entry flow (v3, Section 3.3).
 *
 * "Explain this to a junior who's never heard of it, in your own words."
 * The model explanation reveal is gated until AFTER the user has written their
 * own (so we never anchor them). A non-graded self-check nudges quality. Saved
 * entries land in the Teach-Back Journal and feed the Communication axis.
 */
const SELF_CHECK = [
  'Did you give a concrete example?',
  'Did you explain WHY it matters, not just what it is?',
  'Could a junior actually act on this explanation?',
]
const MIN_LEN = 40

export function TeachBackPrompt({ topic, type = 'module', model }) {
  const { saveTeachBack } = useProgress()
  const [text, setText] = useState('')
  const [checks, setChecks] = useState(SELF_CHECK.map(() => false))
  const [showModel, setShowModel] = useState(false)
  const [saved, setSaved] = useState(false)

  const enough = text.trim().length >= MIN_LEN

  function save() {
    saveTeachBack({ id: Date.now(), topic, type, text: text.trim(), date: new Date().toISOString() })
    setSaved(true)
  }

  return (
    <div className="rounded-2xl border border-accent/20 bg-accent/5 p-5">
      <p className="mb-1 flex items-center gap-1.5 font-semibold text-content-strong">
        <GraduationCap size={18} className="text-accent" /> Teach it back
      </p>
      <p className="mb-3 text-sm text-content-muted">
        Explain <span className="font-medium text-content">{topic}</span> to a
        junior developer who's never heard of it — in your own words. (This is the
        single strongest way to find the gaps in your own understanding.)
      </p>

      <textarea
        value={text}
        onChange={(e) => { setText(e.target.value); setSaved(false) }}
        rows={5}
        placeholder="In my own words…"
        className="w-full rounded-lg border border-line/10 bg-surface-800 px-3 py-2 text-sm text-content placeholder:text-content-faint focus-ring"
      />

      {/* Self-check (non-graded nudge) */}
      <div className="mt-3 space-y-1.5">
        {SELF_CHECK.map((item, i) => (
          <button
            key={i}
            onClick={() => setChecks((c) => c.map((v, idx) => (idx === i ? !v : v)))}
            className="flex w-full items-center gap-2 text-left text-sm text-content-muted focus-ring rounded"
          >
            <span className={cn('grid h-4 w-4 shrink-0 place-items-center rounded border', checks[i] ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400' : 'border-line/20')}>
              {checks[i] && <Check size={11} />}
            </span>
            {item}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Button disabled={!enough || saved} onClick={save}>
          <Save size={15} /> {saved ? 'Saved to journal' : 'Save to journal'}
        </Button>
        {/* Model reveal gated until the user has written their own */}
        {model && (
          <Button
            variant="outline"
            disabled={!enough}
            onClick={() => setShowModel((s) => !s)}
            title={enough ? '' : 'Write your own explanation first'}
          >
            <BookOpen size={15} /> {showModel ? 'Hide model' : 'Compare with a model'}
          </Button>
        )}
        {saved && (
          <Link to="/teach-back" className="text-sm text-accent hover:underline">
            View journal →
          </Link>
        )}
      </div>

      {!enough && (
        <p className="mt-2 text-xs text-content-faint">Write at least {MIN_LEN} characters to save or compare.</p>
      )}

      {showModel && model && (
        <div className="mt-3 rounded-lg border border-line/10 bg-surface-950 p-3">
          <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-flash">
            <Sparkles size={13} /> One model explanation (yours doesn't need to match)
          </p>
          <p className="text-sm leading-relaxed text-content">{model}</p>
        </div>
      )}
    </div>
  )
}
