import { useState } from 'react'
import { Target, ArrowLeft, CheckCircle2, FlaskConical, ChevronRight } from 'lucide-react'
import { tddChallenges } from '../data/tddChallenges'
import { useProgress } from '../hooks/useProgress'
import { PageTransition } from '../components/layout/PageTransition'
import { FeatureHeader } from '../components/v2/FeatureHeader'
import { TestPlayground } from '../components/testing/TestPlayground'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'

/*
 * TDD Mode — failing tests first. The user reads the spec, writes the
 * implementation until the in-browser runner goes green, then can reveal the
 * reference solution. Trains reading tests as a specification.
 */
export default function TddMode() {
  const { isTddSolved, solveTdd, v2 } = useProgress()
  const [activeId, setActiveId] = useState(null)
  const active = tddChallenges.find((c) => c.id === activeId)

  if (active) {
    // Reference solution must also include the test file so it runs green.
    const solutionFiles = { ...active.files, ...active.solution }
    return (
      <PageTransition className="space-y-5">
        <Button variant="ghost" onClick={() => setActiveId(null)}>
          <ArrowLeft size={16} /> All TDD exercises
        </Button>
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="flash">TDD</Badge>
          {isTddSolved(active.id) && <Badge tone="success">Solved</Badge>}
        </div>
        <h1 className="text-3xl font-extrabold">{active.title}</h1>
        <div className="rounded-xl border border-flash/20 bg-flash/5 p-4">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-flash">
            The spec (tests run red until you implement it)
          </p>
          <p className="text-content">{active.brief}</p>
        </div>
        <TestPlayground files={active.files} editorHeight={460} />
        <Reveal files={solutionFiles} />
        <Button
          variant={isTddSolved(active.id) ? 'secondary' : 'primary'}
          onClick={() => solveTdd(active.id)}
          disabled={isTddSolved(active.id)}
        >
          <CheckCircle2 size={16} /> {isTddSolved(active.id) ? 'Marked solved' : 'My tests pass — mark solved'}
        </Button>
      </PageTransition>
    )
  }

  return (
    <PageTransition className="space-y-6">
      <FeatureHeader
        icon={Target}
        title="TDD Mode"
        subtitle="Failing tests first. Read the spec, write the implementation until it goes green — exactly how take-home assignments are graded."
        tone="flash"
        right={<Badge tone="accent">{v2.counts.tddDone}/{tddChallenges.length} solved</Badge>}
      />
      <div className="grid gap-3 sm:grid-cols-2">
        {tddChallenges.map((c) => {
          const solved = isTddSolved(c.id)
          return (
            <button
              key={c.id}
              onClick={() => setActiveId(c.id)}
              className="group rounded-xl border border-line/10 bg-surface-900 p-4 text-left transition-all hover:border-flash/40 hover:shadow-glow focus-ring"
            >
              <div className="mb-1 flex items-center justify-between">
                <Badge tone="flash">red → green</Badge>
                {solved && <CheckCircle2 size={15} className="text-emerald-400" />}
              </div>
              <h3 className="font-semibold text-content-strong group-hover:text-flash">{c.title}</h3>
              <p className="mt-0.5 line-clamp-2 text-sm text-content-muted">{c.brief}</p>
              <span className="mt-2 inline-flex items-center gap-1 text-xs text-flash">
                Solve it <ChevronRight size={13} />
              </span>
            </button>
          )
        })}
      </div>
    </PageTransition>
  )
}

function Reveal({ files }) {
  const [show, setShow] = useState(false)
  if (!show) {
    return (
      <Button variant="outline" onClick={() => setShow(true)}>
        <FlaskConical size={15} /> Reveal reference solution
      </Button>
    )
  }
  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-content-strong">Reference solution (tests should be green):</p>
      <TestPlayground files={files} editorHeight={380} />
    </div>
  )
}
