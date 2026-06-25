import { useState } from 'react'
import { Dumbbell, ArrowLeft, CheckCircle2, Lightbulb, ChevronRight } from 'lucide-react'
import { challengesByCategory, challenges } from '../data/challenges'
import { useProgress } from '../hooks/useProgress'
import { PageTransition } from '../components/layout/PageTransition'
import { FeatureHeader } from '../components/v2/FeatureHeader'
import { CodePlayground } from '../components/learning/CodePlayground'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { cn } from '../lib/cn'

/*
 * Interview Challenge Library — a browsable bank of realistic exercises. List
 * view groups by category; the detail view gives an interviewer-style brief, a
 * minimal Sandpack starter with a reveal-able reference solution, and a
 * "what a strong candidate also considers" callout.
 */
export default function Challenges() {
  const { isChallengeSolved, solveChallenge, v2 } = useProgress()
  const [activeId, setActiveId] = useState(null)
  const active = challenges.find((c) => c.id === activeId)

  if (active) {
    return (
      <ChallengeDetail
        challenge={active}
        solved={isChallengeSolved(active.id)}
        onSolve={() => solveChallenge(active.id)}
        onBack={() => setActiveId(null)}
      />
    )
  }

  return (
    <PageTransition className="space-y-6">
      <FeatureHeader
        icon={Dumbbell}
        title="Challenge Library"
        subtitle="Realistic live-coding reps. Briefs are phrased like an interviewer would — slightly open-ended on purpose. Try before you reveal."
        right={<Badge tone="accent">{v2.counts.challengeDone}/{challenges.length} solved</Badge>}
      />

      {challengesByCategory.map(({ category, items }) => (
        <section key={category}>
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-content-faint">{category}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((c) => {
              const solved = isChallengeSolved(c.id)
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveId(c.id)}
                  className="group rounded-xl border border-line/10 bg-surface-900 p-4 text-left transition-all hover:border-accent/40 hover:shadow-glow focus-ring"
                >
                  <div className="mb-1 flex items-center justify-between">
                    <Badge tone="muted">{c.difficulty}</Badge>
                    {solved && <CheckCircle2 size={15} className="text-emerald-400" />}
                  </div>
                  <h3 className="font-semibold text-content-strong group-hover:text-accent">{c.title}</h3>
                  <p className="mt-0.5 line-clamp-2 text-sm text-content-muted">{c.brief}</p>
                  <span className="mt-2 inline-flex items-center gap-1 text-xs text-accent">
                    Open <ChevronRight size={13} />
                  </span>
                </button>
              )
            })}
          </div>
        </section>
      ))}
    </PageTransition>
  )
}

function ChallengeDetail({ challenge, solved, onSolve, onBack }) {
  return (
    <PageTransition className="space-y-5">
      <Button variant="ghost" onClick={onBack}>
        <ArrowLeft size={16} /> All challenges
      </Button>

      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="muted">{challenge.category}</Badge>
        <Badge tone="accent">{challenge.difficulty}</Badge>
        {solved && <Badge tone="success">Solved</Badge>}
      </div>
      <h1 className="text-3xl font-extrabold">{challenge.title}</h1>

      {/* Interviewer-style brief */}
      <div className="rounded-xl border border-accent/20 bg-accent/5 p-4">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-accent">The brief</p>
        <p className="text-content">{challenge.brief}</p>
      </div>

      <CodePlayground
        title={challenge.title}
        files={challenge.files}
        solution={challenge.solution}
        showConsole
        editorHeight={420}
      />

      {/* Strong-candidate callout */}
      <div className="rounded-xl border border-flash/20 bg-flash/5 p-4">
        <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-flash">
          <Lightbulb size={15} /> What a strong candidate also considers
        </p>
        <ul className="space-y-1.5">
          {challenge.considers.map((c, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-content">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-flash" />
              {c}
            </li>
          ))}
        </ul>
      </div>

      <Button variant={solved ? 'secondary' : 'primary'} onClick={onSolve} disabled={solved}>
        <CheckCircle2 size={16} /> {solved ? 'Marked as solved' : 'I solved this'}
      </Button>
    </PageTransition>
  )
}
