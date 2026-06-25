import { useEffect, useRef, useState } from 'react'
import {
  Timer, Play, ArrowRight, MessageCircleQuestion, ListChecks, BookOpen,
  CheckCircle2, Clock, RefreshCw, NotebookPen, Lightbulb,
} from 'lucide-react'
import { challenges } from '../data/challenges'
import { useProgress } from '../hooks/useProgress'
import { PageTransition } from '../components/layout/PageTransition'
import { FeatureHeader } from '../components/v2/FeatureHeader'
import { CodePlayground } from '../components/learning/CodePlayground'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { cn } from '../lib/cn'

/*
 * Live Interview Simulator — mirrors a real live-coding round:
 *   setup → clarify gate → plan gate → timed coding → self-review → reveal.
 * Clarifying questions and a plan are REQUIRED before the editor opens (the
 * habits juniors skip). Each attempt is saved to the Interview Journal.
 */
const REVIEW_ITEMS = [
  'Handled edge cases (empty state, error state)?',
  'Considered accessibility (labels, keyboard interaction)?',
  'Avoided obvious unnecessary re-renders?',
  'Naming is clear and consistent?',
]
const FOLLOW_UPS = [
  'How would this scale to 10,000 items?',
  'How would you test this component?',
  'What edge cases are still unhandled?',
  'How would you make it fully keyboard-accessible?',
]
const MIN_LEN = 12

function fmt(s) {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}:${String(sec).padStart(2, '0')}`
}

export default function InterviewSimulator() {
  const { saveInterview, interviewSessions } = useProgress()
  const [phase, setPhase] = useState('setup') // setup|clarify|plan|code|review|done
  const [challengeId, setChallengeId] = useState(challenges[0].id)
  const [minutes, setMinutes] = useState(25)
  const [clarifying, setClarifying] = useState('')
  const [plan, setPlan] = useState('')
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [checks, setChecks] = useState(REVIEW_ITEMS.map(() => false))
  const [showJournal, setShowJournal] = useState(false)
  const savedRef = useRef(false)

  const challenge = challenges.find((c) => c.id === challengeId)

  // Countdown while coding.
  useEffect(() => {
    if (phase !== 'code') return
    if (secondsLeft <= 0) {
      setPhase('review')
      return
    }
    const id = setInterval(() => setSecondsLeft((s) => s - 1), 1000)
    return () => clearInterval(id)
  }, [phase, secondsLeft])

  function startSession() {
    setClarifying('')
    setPlan('')
    setChecks(REVIEW_ITEMS.map(() => false))
    savedRef.current = false
    setPhase('clarify')
  }

  function beginCoding() {
    setSecondsLeft(minutes * 60)
    setPhase('code')
  }

  function finishReview() {
    if (!savedRef.current) {
      saveInterview({
        id: Date.now(),
        challengeId,
        title: challenge.title,
        clarifying,
        plan,
        selfReview: `${checks.filter(Boolean).length}/${REVIEW_ITEMS.length} checks`,
        date: new Date().toISOString(),
      })
      savedRef.current = true
    }
    setPhase('done')
  }

  const lowTime = phase === 'code' && secondsLeft <= 300

  return (
    <PageTransition className="space-y-6">
      <FeatureHeader
        icon={Timer}
        title="Interview Simulator"
        subtitle="A timed mock round — clarify, plan, then code under pressure. Practising the parts candidates usually skip is the whole point."
        tone="flash"
        right={
          <Button variant="ghost" onClick={() => setShowJournal((v) => !v)}>
            <NotebookPen size={16} /> Journal ({interviewSessions.length})
          </Button>
        }
      />

      {showJournal && <Journal sessions={interviewSessions} />}

      {/* High-stakes status bar (when in an active session) */}
      {phase !== 'setup' && (
        <div
          className={cn(
            'sticky top-14 z-10 flex items-center justify-between rounded-xl border px-4 py-2.5',
            lowTime ? 'border-rose-500/40 bg-rose-500/10' : 'border-flash/30 bg-flash/5',
          )}
        >
          <span className="flex items-center gap-2 text-sm font-semibold text-content-strong">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-flash/20 text-flash">●</span>
            Live: {challenge.title}
          </span>
          {(phase === 'code' || phase === 'review') && (
            <span className={cn('flex items-center gap-1.5 font-mono text-lg font-bold', lowTime ? 'text-rose-400' : 'text-flash')}>
              <Clock size={18} /> {fmt(Math.max(0, secondsLeft))}
            </span>
          )}
        </div>
      )}

      {/* ---- SETUP ---- */}
      {phase === 'setup' && (
        <div className="space-y-4 rounded-2xl border border-line/10 bg-surface-900 p-6">
          <h2 className="text-lg font-bold">Set up your mock interview</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-1 block text-content-muted">Problem</span>
              <select
                value={challengeId}
                onChange={(e) => setChallengeId(e.target.value)}
                className="w-full rounded-lg border border-line/10 bg-surface-800 px-3 py-2 text-sm text-content focus-ring"
              >
                {challenges.map((c) => (
                  <option key={c.id} value={c.id}>{c.category} — {c.title}</option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-content-muted">Time limit</span>
              <select
                value={minutes}
                onChange={(e) => setMinutes(Number(e.target.value))}
                className="w-full rounded-lg border border-line/10 bg-surface-800 px-3 py-2 text-sm text-content focus-ring"
              >
                {[15, 25, 35, 45].map((m) => <option key={m} value={m}>{m} minutes</option>)}
              </select>
            </label>
          </div>
          <Button onClick={startSession}>
            <Play size={16} /> Start interview
          </Button>
        </div>
      )}

      {/* ---- CLARIFY GATE ---- */}
      {phase === 'clarify' && (
        <Gate
          icon={MessageCircleQuestion}
          title="Step 1 — Ask clarifying questions"
          help="Before writing code, ask the interviewer at least one clarifying question. (Strong candidates always do this.)"
          brief={challenge.brief}
          value={clarifying}
          onChange={setClarifying}
          placeholder="e.g. Should the list support empty state? Do we need keyboard support? Is the data already sorted?"
          ctaLabel="Next: plan"
          onNext={() => setPhase('plan')}
        />
      )}

      {/* ---- PLAN GATE ---- */}
      {phase === 'plan' && (
        <Gate
          icon={ListChecks}
          title="Step 2 — Outline your approach"
          help="A few bullet points before you code: components, state, and the trickiest part."
          brief={challenge.brief}
          value={plan}
          onChange={setPlan}
          placeholder={'• Components: …\n• State lives in: …\n• Tricky bit: …'}
          ctaLabel="Start coding"
          ctaIcon={Play}
          onNext={beginCoding}
        />
      )}

      {/* ---- CODE ---- */}
      {phase === 'code' && (
        <div className="space-y-4">
          <div className="rounded-xl border border-line/10 bg-surface-900 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-content-faint">Brief</p>
            <p className="text-content">{challenge.brief}</p>
          </div>
          <CodePlayground title={`Coding: ${challenge.title}`} files={challenge.files} showConsole editorHeight={440} />
          <Button onClick={() => setPhase('review')}>
            I'm done — self-review <ArrowRight size={16} />
          </Button>
        </div>
      )}

      {/* ---- SELF REVIEW ---- */}
      {phase === 'review' && (
        <div className="space-y-4 rounded-2xl border border-line/10 bg-surface-900 p-6">
          {secondsLeft <= 0 && (
            <Badge tone="flash">⏰ Time’s up — review what you have</Badge>
          )}
          <h2 className="text-lg font-bold">Step 4 — Self-review</h2>
          <p className="text-sm text-content-muted">Be honest — this trains the eye an interviewer uses.</p>
          <ul className="space-y-2">
            {REVIEW_ITEMS.map((item, i) => (
              <li key={i}>
                <button
                  onClick={() => setChecks((c) => c.map((v, idx) => (idx === i ? !v : v)))}
                  className="flex w-full items-center gap-2 rounded-lg border border-line/10 p-2.5 text-left text-sm text-content focus-ring"
                >
                  <span className={cn('grid h-5 w-5 shrink-0 place-items-center rounded border', checks[i] ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400' : 'border-line/20')}>
                    {checks[i] && <CheckCircle2 size={13} />}
                  </span>
                  {item}
                </button>
              </li>
            ))}
          </ul>
          <Button onClick={finishReview}>
            Finish & reveal solution <ArrowRight size={16} />
          </Button>
        </div>
      )}

      {/* ---- DONE / REVEAL ---- */}
      {phase === 'done' && (
        <div className="space-y-5">
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
            <p className="flex items-center gap-1.5 font-semibold text-emerald-300">
              <CheckCircle2 size={16} /> Session saved to your Interview Journal
            </p>
          </div>

          <section>
            <h2 className="mb-2 flex items-center gap-1.5 text-lg font-bold">
              <BookOpen size={18} className="text-accent" /> Reference solution
            </h2>
            <CodePlayground title={challenge.title} files={challenge.solution} editorHeight={400} />
          </section>

          <section className="rounded-2xl border border-line/10 bg-surface-900 p-4">
            <h3 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-content-strong">
              <Lightbulb size={15} className="text-flash" /> Senior-level discussion notes
            </h3>
            <ul className="space-y-1.5">
              {challenge.considers.map((c, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-content">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-flash" /> {c}
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-accent/20 bg-accent/5 p-4">
            <h3 className="mb-2 text-sm font-semibold text-accent">Follow-up questions to expect</h3>
            <ul className="space-y-1.5">
              {FOLLOW_UPS.map((f, i) => (
                <li key={i} className="text-sm text-content">• {f}</li>
              ))}
            </ul>
          </section>

          <div className="flex gap-2">
            <Button onClick={() => setPhase('setup')}>
              <RefreshCw size={16} /> New session
            </Button>
            <Button variant="secondary" onClick={() => setShowJournal(true)}>
              <NotebookPen size={16} /> View journal
            </Button>
          </div>
        </div>
      )}
    </PageTransition>
  )
}

function Gate({ icon: Icon, title, help, brief, value, onChange, placeholder, ctaLabel, ctaIcon: Cta = ArrowRight, onNext }) {
  const ok = value.trim().length >= MIN_LEN
  return (
    <div className="space-y-4 rounded-2xl border border-line/10 bg-surface-900 p-6">
      <div className="flex items-center gap-2">
        <Icon size={18} className="text-accent" />
        <h2 className="text-lg font-bold">{title}</h2>
      </div>
      <div className="rounded-lg border border-line/10 bg-surface-950 p-3 text-sm">
        <span className="font-semibold text-content-strong">Brief: </span>
        <span className="text-content-muted">{brief}</span>
      </div>
      <p className="text-sm text-content-muted">{help}</p>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        placeholder={placeholder}
        className="w-full rounded-lg border border-line/10 bg-surface-800 px-3 py-2 text-sm text-content placeholder:text-content-faint focus-ring"
      />
      <div className="flex items-center justify-between">
        <span className={cn('text-xs', ok ? 'text-emerald-400' : 'text-content-faint')}>
          {ok ? 'Looks good.' : `Write at least ${MIN_LEN} characters to continue.`}
        </span>
        <Button disabled={!ok} onClick={onNext}>
          {ctaLabel} <Cta size={16} />
        </Button>
      </div>
    </div>
  )
}

function Journal({ sessions }) {
  if (sessions.length === 0) {
    return (
      <div className="rounded-2xl border border-line/10 bg-surface-900 p-5 text-sm text-content-muted">
        No attempts yet — your clarifying questions, plans and self-reviews will be saved here so you can see your growth.
      </div>
    )
  }
  return (
    <div className="space-y-2 rounded-2xl border border-line/10 bg-surface-900 p-5">
      <h2 className="text-sm font-bold uppercase tracking-wide text-content-faint">Interview Journal</h2>
      {sessions.map((s) => (
        <details key={s.id} className="rounded-lg border border-line/10 bg-surface-950 p-3">
          <summary className="cursor-pointer text-sm font-medium text-content-strong">
            {s.title}{' '}
            <span className="font-normal text-content-faint">
              · {new Date(s.date).toLocaleString()} · {s.selfReview}
            </span>
          </summary>
          <div className="mt-2 space-y-2 text-sm">
            <p><span className="font-semibold text-accent">Clarifying:</span> <span className="text-content">{s.clarifying}</span></p>
            <p><span className="font-semibold text-accent">Plan:</span> <span className="whitespace-pre-wrap text-content">{s.plan}</span></p>
          </div>
        </details>
      ))}
    </div>
  )
}
