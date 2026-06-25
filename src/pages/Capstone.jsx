import { Rocket, CheckCircle2, Circle, ListChecks, Target, Lightbulb, Cloud } from 'lucide-react'
import { capstoneMilestones } from '../data/capstoneMilestones'
import { useProgress } from '../hooks/useProgress'
import { PageTransition } from '../components/layout/PageTransition'
import { FeatureHeader } from '../components/v2/FeatureHeader'
import { CodeBlock } from '../components/learning/CodeBlock'
import { Badge } from '../components/ui/Badge'
import { ProgressBar } from '../components/layout/ProgressBar'
import { cn } from '../lib/cn'

/*
 * Capstone Portfolio Track — milestones with deliberately decreasing
 * scaffolding (full code → zero hints) so the user finishes building
 * independently. Progress persists and contributes to the dashboard.
 */
const HINT = {
  full: { label: 'Full guidance', tone: 'text-emerald-300 border-emerald-500/40 bg-emerald-500/10' },
  moderate: { label: 'Moderate hints', tone: 'text-sky-300 border-sky-500/40 bg-sky-500/10' },
  light: { label: 'Light hints', tone: 'text-cyan-300 border-cyan-500/40 bg-cyan-500/10' },
  minimal: { label: 'Minimal hints', tone: 'text-amber-300 border-amber-500/40 bg-amber-500/10' },
  none: { label: 'On your own', tone: 'text-rose-300 border-rose-500/40 bg-rose-500/10' },
}

export default function Capstone() {
  const { isCapstoneDone, toggleCapstone, v2 } = useProgress()
  const total = capstoneMilestones.length
  const pct = Math.round((v2.counts.capstoneDone / total) * 100)

  return (
    <PageTransition className="space-y-6">
      <FeatureHeader
        icon={Rocket}
        title="Capstone — Build Your Portfolio Site"
        subtitle="A real project you build in your own repo. Notice the hints shrink each milestone — by the end you're flying solo. That independence is the goal."
        right={<Badge tone="accent">{v2.counts.capstoneDone}/{total} done</Badge>}
      />

      <div>
        <div className="mb-1 flex items-center justify-between text-xs text-content-muted">
          <span>Capstone progress</span>
          <span className="font-mono text-accent">{pct}%</span>
        </div>
        <ProgressBar value={pct} />
      </div>

      <ol className="space-y-4">
        {capstoneMilestones.map((m) => {
          const done = isCapstoneDone(m.id)
          const hint = HINT[m.hintLevel]
          return (
            <li key={m.id} className={cn('rounded-2xl border bg-surface-900 p-5', done ? 'border-emerald-500/30' : 'border-line/10')}>
              <div className="flex items-start gap-3">
                <button onClick={() => toggleCapstone(m.id)} className="mt-0.5 focus-ring rounded-full" aria-label="Toggle done">
                  {done ? <CheckCircle2 size={22} className="text-emerald-400" /> : <Circle size={22} className="text-content-faint" />}
                </button>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs text-content-faint">Milestone {m.num}</span>
                    <span className={cn('rounded-full border px-2 py-0.5 text-[11px] font-semibold', hint.tone)}>{hint.label}</span>
                  </div>
                  <h3 className="mt-0.5 text-lg font-bold text-content-strong">{m.title}</h3>
                  <p className="text-content-muted">{m.goal}</p>

                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <div>
                      <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-content-faint">
                        <Target size={13} /> Requirements
                      </p>
                      <ul className="space-y-1 text-sm text-content">
                        {m.requirements.map((r, i) => <li key={i}>• {r}</li>)}
                      </ul>
                    </div>
                    <div>
                      <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-content-faint">
                        <ListChecks size={13} /> Acceptance criteria
                      </p>
                      <ul className="space-y-1 text-sm text-content">
                        {m.acceptance.map((a, i) => <li key={i}>✓ {a}</li>)}
                      </ul>
                    </div>
                  </div>

                  {m.code && (
                    <div className="mt-3">
                      <CodeBlock filename="starter / reference" code={m.code} />
                    </div>
                  )}
                  {m.tip && (
                    <div className="mt-3 flex items-start gap-2 rounded-lg border border-flash/20 bg-flash/5 p-3 text-sm text-content">
                      <Lightbulb size={15} className="mt-0.5 shrink-0 text-flash" />
                      <span>{m.tip}</span>
                    </div>
                  )}
                  {m.deploy && (
                    <div className="mt-3">
                      <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-content-faint">
                        <Cloud size={13} /> Deploy guide
                      </p>
                      <pre className="overflow-x-auto rounded-lg border border-line/10 bg-surface-950 p-3 text-xs leading-relaxed text-content">{m.deploy}</pre>
                    </div>
                  )}
                </div>
              </div>
            </li>
          )
        })}
      </ol>
    </PageTransition>
  )
}
