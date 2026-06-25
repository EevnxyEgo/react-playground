import { useState } from 'react'
import { Eye, BookOpen, Layers, Sparkles, CheckCircle2 } from 'lucide-react'
import { reconciliationScenarios } from '../data/reconciliationScenarios'
import { useProgress } from '../hooks/useProgress'
import { PageTransition } from '../components/layout/PageTransition'
import { FeatureHeader } from '../components/v2/FeatureHeader'
import { ReconciliationStepper } from '../components/internals/ReconciliationStepper'
import { Section, Prose, KeyIdea, Code } from '../components/learning/Section'
import { TeachBackPrompt } from '../components/learning/TeachBackPrompt'
import { Badge } from '../components/ui/Badge'
import { cn } from '../lib/cn'

/*
 * Under the Hood — the Reconciliation Visualizer track. Concept explainers plus
 * the data-driven step-through stepper across all 4 scenarios, capped with a
 * teach-back prompt.
 */
export default function UnderTheHood() {
  const { isInternalsDone, completeInternals, v2 } = useProgress()
  const [activeId, setActiveId] = useState(reconciliationScenarios[0].id)
  const scenario = reconciliationScenarios.find((s) => s.id === activeId)

  return (
    <PageTransition className="space-y-8">
      <FeatureHeader
        icon={Eye}
        title="Under the Hood"
        subtitle="Not just WHEN React re-renders — WHY. Step through reconciliation and the render/commit phases like a debugger."
        right={<Badge tone="accent">{v2.counts.internalsDone}/{reconciliationScenarios.length} explored</Badge>}
      />

      <Section icon={BookOpen} title="The mental model" step="Concepts">
        <Prose>
          <p>
            React keeps a lightweight copy of your UI — the <strong>Virtual
            DOM</strong>. On a state change it builds a new virtual tree and{' '}
            <strong>reconciles</strong> (diffs) it against the old one, then makes
            the <em>minimal</em> set of real-DOM changes.
          </p>
          <p>
            That work happens in two phases. The <strong>render phase</strong>{' '}
            (reconciliation) builds and diffs the new tree — it can be
            paused/interrupted and produces no visible change yet. The{' '}
            <strong>commit phase</strong> is synchronous: React applies the diff to
            the real DOM.
          </p>
        </Prose>
        <KeyIdea title="Diff heuristics in one breath">
          Same type → update in place. Different type → throw away the subtree and
          rebuild. Lists → match children by <Code>key</Code>. <strong>Batching</strong>{' '}
          collapses multiple <Code>setState</Code> calls in one event into a single
          render.
        </KeyIdea>
      </Section>

      <Section icon={Layers} title="Step through it" step="Reconciliation Visualizer">
        <div className="flex flex-wrap gap-2">
          {reconciliationScenarios.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveId(s.id)}
              className={cn(
                'rounded-lg border px-3 py-1.5 text-left text-sm transition-colors focus-ring',
                s.id === activeId ? 'border-accent bg-accent/10 text-accent' : 'border-line/10 text-content-muted hover:border-accent/40',
              )}
            >
              {s.title}
              {isInternalsDone(s.id) && <CheckCircle2 size={13} className="ml-1.5 inline text-emerald-400" />}
            </button>
          ))}
        </div>
        <p className="text-sm text-content-muted">{scenario.summary}</p>
        <ReconciliationStepper
          key={scenario.id}
          scenario={scenario}
          onComplete={() => completeInternals(scenario.id)}
        />
      </Section>

      <Section icon={Sparkles} title="Make it stick" step="Teach-back">
        <TeachBackPrompt
          topic="how React reconciliation works"
          type="internals"
          model="Reconciliation is React's diffing step: on each render it builds a new virtual tree and compares it to the previous one. Same-type nodes are updated in place; different types cause the whole subtree to be unmounted and remounted; list children are matched by key. This happens in the render phase (build + diff, interruptible) and is applied in the commit phase (synchronous DOM mutations). Batching collapses multiple state updates from one event into a single render so the DOM is touched once."
        />
      </Section>
    </PageTransition>
  )
}
