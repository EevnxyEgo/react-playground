import { Link } from 'react-router-dom'
import { Map, ArrowDown, CornerDownRight, Workflow } from 'lucide-react'
import { PageTransition } from '../components/layout/PageTransition'
import { FeatureHeader } from '../components/v2/FeatureHeader'
import { Button } from '../components/ui/Button'
import { cn } from '../lib/cn'

/*
 * Hooks Decision Map — one visual flowchart to fall back on. A primary
 * "state vs ref vs reducer" decision tree, plus a quick-reference grid for the
 * side cases (effects, memoization).
 */
function Node({ children, tone = 'default', className }) {
  const tones = {
    default: 'border-line/15 bg-surface-900 text-content',
    q: 'border-accent/40 bg-accent/10 text-content-strong',
    answer: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200',
    alt: 'border-flash/40 bg-flash/10 text-flash',
  }
  return (
    <div className={cn('rounded-xl border px-4 py-3 text-sm', tones[tone], className)}>
      {children}
    </div>
  )
}

const Down = () => <ArrowDown className="mx-auto my-1 text-content-faint" size={16} />

function Branch({ label, children }) {
  return (
    <div className="flex items-start gap-2">
      <CornerDownRight size={16} className="mt-3 shrink-0 text-content-faint" />
      <div className="flex-1">
        {label && <p className="mb-1 text-xs font-semibold text-content-muted">{label}</p>}
        {children}
      </div>
    </div>
  )
}

export default function DecisionMap() {
  const quickRef = [
    { case: 'Run a side effect (fetch, subscribe, timer)', use: 'useEffect', note: 'Add deps; return cleanup for anything ongoing.' },
    { case: 'Side effect that must run before paint (measure layout)', use: 'useLayoutEffect', note: 'Synchronous, before the browser paints.' },
    { case: 'Cache an expensive computed value', use: 'useMemo', note: 'Recomputes only when deps change.' },
    { case: 'Stabilize a function passed to a memo child', use: 'useCallback', note: 'Same as useMemo(() => fn, deps).' },
    { case: 'Skip re-render of an unchanged child', use: 'React.memo', note: 'Shallow-compares props.' },
    { case: 'Share a value across many deep components', use: 'useContext', note: 'Pair with useReducer for shared logic.' },
  ]

  return (
    <PageTransition className="space-y-6">
      <FeatureHeader
        icon={Map}
        title="Hooks Decision Map"
        subtitle="The single mental model: decide what kind of thing you're managing, then follow the arrows."
        right={
          <Link to="/hook-decision-engine">
            <Button variant="secondary">
              <Workflow size={16} /> Practice it
            </Button>
          </Link>
        }
      />

      {/* Primary state decision tree */}
      <section className="rounded-2xl border border-line/10 bg-surface-900 p-6">
        <h2 className="mb-4 text-lg font-bold">“I have some data to manage…”</h2>

        <Node tone="q">Does changing this value need to update the UI (cause a re-render)?</Node>
        <Down />
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="mb-1 text-xs font-semibold text-content-muted">NO — it's behind the scenes</p>
            <Node tone="answer">
              <span className="font-mono font-semibold">useRef</span>
              <p className="mt-1 text-xs text-content-muted">
                DOM nodes, interval ids, previous values — persists without re-rendering.
              </p>
            </Node>
          </div>
          <div>
            <p className="mb-1 text-xs font-semibold text-content-muted">YES — it drives the UI</p>
            <Node tone="q">Is it owned by one component, or shared?</Node>
            <div className="mt-2 space-y-2">
              <Branch label="Shared across many deep components">
                <Node tone="answer"><span className="font-mono font-semibold">useContext</span> (+ useReducer for logic)</Node>
              </Branch>
              <Branch label="Shared between siblings">
                <Node tone="answer">Lift state up to the common parent</Node>
              </Branch>
              <Branch label="Local to this component">
                <Node tone="q">Is the update logic simple?</Node>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  <Node tone="answer">Yes → <span className="font-mono font-semibold">useState</span></Node>
                  <Node tone="answer">No / many actions → <span className="font-mono font-semibold">useReducer</span></Node>
                </div>
              </Branch>
            </div>
          </div>
        </div>
      </section>

      {/* Quick reference for the side cases */}
      <section className="rounded-2xl border border-line/10 bg-surface-900 p-6">
        <h2 className="mb-4 text-lg font-bold">Quick reference — the other reflexes</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line/10 text-xs uppercase tracking-wide text-content-faint">
                <th className="py-2 pr-4 font-semibold">When you need to…</th>
                <th className="py-2 pr-4 font-semibold">Reach for</th>
                <th className="py-2 font-semibold">Note</th>
              </tr>
            </thead>
            <tbody>
              {quickRef.map((r) => (
                <tr key={r.use} className="border-b border-line/10 last:border-0">
                  <td className="py-2.5 pr-4 text-content">{r.case}</td>
                  <td className="py-2.5 pr-4">
                    <span className="rounded bg-accent/15 px-1.5 py-0.5 font-mono text-accent">{r.use}</span>
                  </td>
                  <td className="py-2.5 text-content-muted">{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </PageTransition>
  )
}
