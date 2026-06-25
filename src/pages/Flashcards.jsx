import { useMemo, useState } from 'react'
import { Layers, RotateCcw, Check, RefreshCw, MessageCircleQuestion, Eye } from 'lucide-react'
import { flashcards } from '../data/flashcards'
import { useProgress } from '../hooks/useProgress'
import { useSpacedRepetition, MASTERED_STRENGTH } from '../hooks/useSpacedRepetition'
import { PageTransition } from '../components/layout/PageTransition'
import { FeatureHeader } from '../components/v2/FeatureHeader'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { ProgressBar } from '../components/layout/ProgressBar'

/*
 * Flashcards — rapid-fire concept Q&A. As of v3 it runs on the SHARED
 * spaced-repetition engine (useSpacedRepetition): "Got it" is a success review,
 * "Needs review" a failure. Mastery + due-scheduling come from that one engine,
 * so these cards also show up in Today's Review.
 */
const PRIORITY = { review: 0, new: 1, got: 2 }

export default function Flashcards() {
  const { v2 } = useProgress()
  const { getItem, review } = useSpacedRepetition()
  const [sessionKey, setSessionKey] = useState(0)

  const statusOf = (id) => {
    const it = getItem('flashcard', id)
    if (!it) return 'new'
    return it.strength >= MASTERED_STRENGTH ? 'got' : 'review'
  }

  const initialQueue = useMemo(() => {
    return [...flashcards]
      .map((c) => ({ id: c.id, p: PRIORITY[statusOf(c.id)] }))
      .sort((a, b) => a.p - b.p)
      .map((c) => c.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionKey])

  const [queue, setQueue] = useState(initialQueue)
  const [pos, setPos] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [reviewedCount, setReviewedCount] = useState(0)

  function restart() {
    setSessionKey((k) => k + 1)
    setQueue(initialQueue)
    setPos(0)
    setRevealed(false)
    setReviewedCount(0)
  }

  const currentId = queue[pos]
  const card = flashcards.find((c) => c.id === currentId)
  const total = flashcards.length
  const gotCount = v2.counts.flashGot

  function mark(success) {
    review('flashcard', currentId, success) // shared SRS engine
    setReviewedCount((n) => n + 1)
    setQueue((q) => (success ? q : [...q, currentId])) // re-queue "needs review"
    setPos((p) => p + 1)
    setRevealed(false)
  }

  const done = pos >= queue.length

  return (
    <PageTransition className="space-y-6">
      <FeatureHeader
        icon={Layers}
        title="Flashcards"
        subtitle="Answer in your head first, then flip. Powered by the shared spaced-repetition engine — cards you miss come back sooner and appear in Today's Review."
        right={<Badge tone="accent">{gotCount}/{total} mastered</Badge>}
      />

      <div>
        <div className="mb-1 flex items-center justify-between text-xs text-content-muted">
          <span>Mastered (3+ day retention)</span>
          <span className="font-mono text-accent">{Math.round((gotCount / total) * 100)}%</span>
        </div>
        <ProgressBar value={(gotCount / total) * 100} />
      </div>

      {done ? (
        <div className="rounded-2xl border border-line/10 bg-surface-900 p-10 text-center">
          <Check className="mx-auto mb-3 text-emerald-400" size={32} />
          <p className="text-lg font-semibold text-content-strong">Session complete!</p>
          <p className="mt-1 text-content-muted">
            You reviewed {reviewedCount} card{reviewedCount === 1 ? '' : 's'}. {gotCount}/{total} are mastered.
          </p>
          <Button className="mt-4" onClick={restart}>
            <RefreshCw size={16} /> Start a new session
          </Button>
        </div>
      ) : (
        <>
          <p className="text-sm text-content-faint">
            Card {Math.min(pos + 1, queue.length)} of {queue.length} in this session
          </p>

          <div className="min-h-[260px] rounded-2xl border border-line/10 bg-surface-900 p-6">
            <div className="mb-3 flex items-center justify-between">
              <Badge tone="muted">{card.category}</Badge>
              {statusOf(card.id) === 'review' && <Badge tone="flash">learning</Badge>}
              {statusOf(card.id) === 'got' && <Badge tone="success">mastered</Badge>}
            </div>

            <p className="flex items-start gap-2 text-lg font-medium text-content-strong">
              <MessageCircleQuestion size={20} className="mt-0.5 shrink-0 text-accent" />
              {card.question}
            </p>

            {!revealed ? (
              <Button className="mt-6" variant="secondary" onClick={() => setRevealed(true)}>
                <Eye size={16} /> Show answer
              </Button>
            ) : (
              <div className="mt-4 space-y-3">
                <div className="rounded-lg border border-line/10 bg-surface-950 p-4 text-sm leading-relaxed text-content">
                  {card.answer}
                </div>
                <div className="rounded-lg border border-flash/20 bg-flash/5 p-3 text-sm text-content">
                  <span className="font-semibold text-flash">Likely follow-up: </span>
                  {card.followUp}
                </div>
                <div className="flex gap-2 pt-1">
                  <Button variant="outline" onClick={() => mark(false)}>
                    <RotateCcw size={15} /> Needs review
                  </Button>
                  <Button onClick={() => mark(true)}>
                    <Check size={15} /> Got it
                  </Button>
                </div>
              </div>
            )}
          </div>

          <Button variant="ghost" onClick={restart}>
            <RefreshCw size={14} /> Restart session
          </Button>
        </>
      )}
    </PageTransition>
  )
}
