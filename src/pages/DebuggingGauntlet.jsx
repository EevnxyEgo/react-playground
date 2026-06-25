import { useState } from 'react'
import { Bug, ArrowLeft, CheckCircle2, AlertTriangle, Wrench, ChevronRight } from 'lucide-react'
import { debugBugs } from '../data/debugBugs'
import { useProgress } from '../hooks/useProgress'
import { PageTransition } from '../components/layout/PageTransition'
import { FeatureHeader } from '../components/v2/FeatureHeader'
import { CodePlayground } from '../components/learning/CodePlayground'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'

/*
 * Debugging Gauntlet — broken Sandpack apps that genuinely misbehave. The user
 * locates and fixes the bug in the editor, then reveals the reference fix plus
 * the general pattern so the lesson transfers beyond this snippet.
 */
export default function DebuggingGauntlet() {
  const { isDebugFixed, markDebugFixed, v2 } = useProgress()
  const [activeId, setActiveId] = useState(null)
  const active = debugBugs.find((b) => b.id === activeId)

  if (active) {
    return (
      <BugDetail
        bug={active}
        fixed={isDebugFixed(active.id)}
        onFix={() => markDebugFixed(active.id)}
        onBack={() => setActiveId(null)}
      />
    )
  }

  return (
    <PageTransition className="space-y-6">
      <FeatureHeader
        icon={Bug}
        title="Debugging Gauntlet"
        subtitle="Real interviews hand you broken code. Each app below misbehaves on purpose — find the bug, fix it in the editor, then check your reasoning."
        right={<Badge tone="flash">{v2.counts.debugDone}/{debugBugs.length} fixed</Badge>}
      />

      <div className="grid gap-3 sm:grid-cols-2">
        {debugBugs.map((b) => {
          const done = isDebugFixed(b.id)
          return (
            <button
              key={b.id}
              onClick={() => setActiveId(b.id)}
              className="group rounded-xl border border-line/10 bg-surface-900 p-4 text-left transition-all hover:border-flash/40 hover:shadow-glow focus-ring"
            >
              <div className="mb-1 flex items-center justify-between">
                <Badge tone="flash">{b.bugType}</Badge>
                {done && <CheckCircle2 size={15} className="text-emerald-400" />}
              </div>
              <h3 className="font-semibold text-content-strong group-hover:text-flash">{b.title}</h3>
              <p className="mt-0.5 line-clamp-2 text-sm text-content-muted">{b.symptom}</p>
              <span className="mt-2 inline-flex items-center gap-1 text-xs text-flash">
                Debug it <ChevronRight size={13} />
              </span>
            </button>
          )
        })}
      </div>
    </PageTransition>
  )
}

function BugDetail({ bug, fixed, onFix, onBack }) {
  return (
    <PageTransition className="space-y-5">
      <Button variant="ghost" onClick={onBack}>
        <ArrowLeft size={16} /> All bugs
      </Button>

      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="flash">{bug.bugType}</Badge>
        <Badge tone="muted">{bug.difficulty}</Badge>
        {fixed && <Badge tone="success">Fixed</Badge>}
      </div>
      <h1 className="text-3xl font-extrabold">{bug.title}</h1>

      <div className="flex items-start gap-2 rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 text-sm text-content">
        <AlertTriangle size={16} className="mt-0.5 shrink-0 text-rose-400" />
        <div>
          <span className="font-semibold text-rose-300">Symptom: </span>
          {bug.symptom}
        </div>
      </div>

      <CodePlayground
        title={`Buggy: ${bug.title}`}
        files={bug.broken}
        solution={bug.fixed}
        showConsole
        editorHeight={420}
      />

      <div className="rounded-xl border border-line/10 bg-surface-900 p-4">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-content-faint">Why it broke</p>
        <p className="text-sm text-content">{bug.explanation}</p>
      </div>

      <div className="flex items-start gap-2 rounded-xl border border-accent/20 bg-accent/5 p-4 text-sm text-content">
        <Wrench size={16} className="mt-0.5 shrink-0 text-accent" />
        <div>
          <span className="font-semibold text-accent">The general pattern: </span>
          {bug.pattern}
        </div>
      </div>

      <Button variant={fixed ? 'secondary' : 'primary'} onClick={onFix} disabled={fixed}>
        <CheckCircle2 size={16} /> {fixed ? 'Marked as fixed' : 'I fixed it'}
      </Button>
    </PageTransition>
  )
}
