import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Repeat, Check, RotateCcw, Layers, Dumbbell, Bug, HelpCircle, ArrowUpRight, CalendarCheck } from 'lucide-react'
import { flashcards } from '../data/flashcards'
import { challenges } from '../data/challenges'
import { debugBugs } from '../data/debugBugs'
import { moduleById } from '../data/modulesList'
import { testingById } from '../data/testingModules'
import { useSpacedRepetition } from '../hooks/useSpacedRepetition'
import { PageTransition } from '../components/layout/PageTransition'
import { FeatureHeader } from '../components/v2/FeatureHeader'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'

/*
 * Today's Review — one mixed queue of everything due across ALL content types,
 * powered by the shared spaced-repetition engine. Completing an item reschedules
 * it (success → further out; "again" → soon). This is the daily retention entry
 * point that replaces fragmented review surfaces.
 */
const flashcardById = Object.fromEntries(flashcards.map((c) => [c.id, c]))
const challengeById = Object.fromEntries(challenges.map((c) => [c.id, c]))
const debugById = Object.fromEntries(debugBugs.map((b) => [b.id, b]))

const TYPE_META = {
  flashcard: { icon: Layers, label: 'Flashcard' },
  quiz: { icon: HelpCircle, label: 'Module quiz' },
  challenge: { icon: Dumbbell, label: 'Challenge' },
  debug: { icon: Bug, label: 'Debugging' },
}

export default function Review() {
  const { dueItems, review } = useSpacedRepetition()
  const due = dueItems().slice(0, 6)

  return (
    <PageTransition className="space-y-6">
      <FeatureHeader
        icon={Repeat}
        title="Today's Review"
        subtitle="A small mixed queue of things due for a refresh — flashcards, quizzes, challenges and bugs you've done before. Spacing them out is how they stick."
        right={<Badge tone="accent">{due.length} due</Badge>}
      />

      {due.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line/20 bg-surface-900 p-10 text-center">
          <CalendarCheck className="mx-auto mb-3 text-emerald-400" size={28} />
          <p className="font-semibold text-content-strong">Nothing due right now 🎉</p>
          <p className="mt-1 text-sm text-content-muted">
            As you complete flashcards, quizzes, challenges and debugging exercises,
            they get scheduled to resurface here (3 days → 7 → 21 → 45). Come back
            tomorrow, or build your queue:
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <Link to="/flashcards"><Button variant="secondary" size="sm"><Layers size={15} /> Flashcards</Button></Link>
            <Link to="/challenges"><Button variant="secondary" size="sm"><Dumbbell size={15} /> Challenges</Button></Link>
            <Link to="/debugging-gauntlet"><Button variant="secondary" size="sm"><Bug size={15} /> Debugging</Button></Link>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {due.map((item) => (
            <ReviewCard key={`${item.type}:${item.itemId}`} item={item} review={review} />
          ))}
        </div>
      )}
    </PageTransition>
  )
}

function ReviewCard({ item, review }) {
  const [revealed, setRevealed] = useState(false)
  const meta = TYPE_META[item.type] || TYPE_META.flashcard
  const Icon = meta.icon

  // Resolve content per type.
  let title = item.itemId
  let body = null
  let link = null

  if (item.type === 'flashcard') {
    const c = flashcardById[item.itemId]
    title = c ? c.question : item.itemId
    body = revealed && c ? <p className="mt-2 rounded-lg border border-line/10 bg-surface-950 p-3 text-sm text-content">{c.answer}</p> : null
  } else if (item.type === 'quiz') {
    const m = moduleById[item.itemId] || testingById[item.itemId]
    const base = moduleById[item.itemId] ? '/learn/' : '/testing/'
    title = m ? `Quiz: ${m.title}` : `Quiz: ${item.itemId}`
    link = m ? `${base}${item.itemId}` : null
  } else if (item.type === 'challenge') {
    const c = challengeById[item.itemId]
    title = c ? c.title : item.itemId
    body = c ? <p className="mt-1 text-sm text-content-muted">{c.brief}</p> : null
    link = '/challenges'
  } else if (item.type === 'debug') {
    const b = debugById[item.itemId]
    title = b ? b.title : item.itemId
    body = b ? <p className="mt-1 text-sm text-content-muted">{b.symptom}</p> : null
    link = '/debugging-gauntlet'
  }

  return (
    <div className="rounded-xl border border-line/10 bg-surface-900 p-4">
      <div className="flex items-start gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent/15 text-accent">
          <Icon size={17} />
        </span>
        <div className="min-w-0 flex-1">
          <Badge tone="muted" className="mb-1">{meta.label}</Badge>
          <p className="font-medium text-content-strong">{title}</p>
          {body}
          {link && (
            <Link to={link} className="mt-1 inline-flex items-center gap-1 text-sm text-accent hover:underline">
              Open <ArrowUpRight size={13} />
            </Link>
          )}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {item.type === 'flashcard' && !revealed && (
          <Button size="sm" variant="secondary" onClick={() => setRevealed(true)}>Show answer</Button>
        )}
        <Button size="sm" variant="outline" onClick={() => review(item.type, item.itemId, false)}>
          <RotateCcw size={14} /> Again
        </Button>
        <Button size="sm" onClick={() => review(item.type, item.itemId, true)}>
          <Check size={14} /> Got it
        </Button>
      </div>
    </div>
  )
}
