import { useMemo, useState } from 'react'
import { Layers, RotateCcw, Check, RefreshCw, MessageCircleQuestion, Eye } from 'lucide-react'
import { flashcards } from '../data/flashcards'
import { useProgress } from '../hooks/useProgress'
import { PageTransition } from '../components/layout/PageTransition'
import { FeatureHeader } from '../components/v2/FeatureHeader'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { ProgressBar } from '../components/layout/ProgressBar'

/*
 * Flashcards — rapid-fire concept Q&A with lightweight spaced repetition.
 * Cards previously marked "needs review" come up first; within a session, a
 * "needs review" card is re-queued so it resurfaces, while "got it" retires it.
 */
const PRIORITY = { review: 0, unseen: 1, got: 2 }

export default function Flashcards() {
  const { flashcardStatus, markFlashcard, v2 } = useProgress()
  const [sessionKey, setSessionKey] = useState(0)

  // Build the starting queue once per session, ordered by persisted status.
  const initialQueue = useMemo(() => {
    return [...flashcards]
      .map((c) => ({ id: c.id, p: PRIORITY[flashcardStatus(c.id) || 'unseen'] }))
      .sort((a, b) => a.p - b.p)
      .map((c) => c.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionKey])

  const [queue, setQueue] = useState(initialQueue)
  const [pos, setPos] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [reviewedCount, setReviewedCount] = useState(0)

  // Reset all local session state when restarting.
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
  const gotCount = flashcards.filter((c) => flashcardStatus(c.id) === 'got').length

  function mark(status) {
    markFlashcard(currentId, status)
    setReviewedCount((n) => n + 1)
    setQueue((q) => (status === 'review' ? [...q, currentId] : q)) // re-queue review cards
    setPos((p) => p + 1)
    setRevealed(false)
  }

  const done = pos >= queue.length

  return (
    <PageTransition className="space-y-6">
      <FeatureHeader
        icon={Layers}
        title="Flashcards"
        subtitle="Answer in your head (or out loud) first, then flip. Mark “needs review” and the card comes back around this session."
        right={<Badge tone="accent">{gotCount}/{total} mastered</Badge>}
      />

      {/* mastery progress */}
      <div>
        <div className="mb-1 flex items-center justify-between text-xs text-content-muted">
          <span>Mastered across all sessions</span>
          <span className="font-mono text-accent">{Math.round((gotCount / total) * 100)}%</span>
        </div>
        <ProgressBar value={(gotCount / total) * 100} />
      </div>

      {done ? (
        <div className="rounded-2xl border border-line/10 bg-surface-900 p-10 text-center">
          <Check className="mx-auto mb-3 text-emerald-400" size={32} />
          <p className="text-lg font-semibold text-content-strong">Session complete!</p>
          <p className="mt-1 text-content-muted">
            You reviewed {reviewedCount} card{reviewedCount === 1 ? '' : 's'}. {gotCount}/{total} are marked mastered.
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
              {flashcardStatus(card.id) === 'review' && <Badge tone="flash">needs review</Badge>}
              {flashcardStatus(card.id) === 'got' && <Badge tone="success">mastered</Badge>}
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
                  <Button variant="outline" onClick={() => mark('review')}>
                    <RotateCcw size={15} /> Needs review
                  </Button>
                  <Button onClick={() => mark('got')}>
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
