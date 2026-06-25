import { useMemo, useState } from 'react'
import { LayoutDashboard, CheckCircle2, Eye, Lightbulb, AlertTriangle } from 'lucide-react'
import { architectureMockups } from '../data/architectureMockups'
import { useProgress } from '../hooks/useProgress'
import { PageTransition } from '../components/layout/PageTransition'
import { FeatureHeader } from '../components/v2/FeatureHeader'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { cn } from '../lib/cn'

/*
 * Component Architecture Trainer — drills "how do I split this UI into
 * components, and where does state live?". The user names regions, sketches a
 * component tree, and assigns an owner to each piece of state BEFORE revealing
 * the model breakdown.
 */
export default function ArchitectureTrainer() {
  const { isArchDone, completeArch, v2 } = useProgress()
  const [activeId, setActiveId] = useState(architectureMockups[0].id)
  const mockup = architectureMockups.find((m) => m.id === activeId)

  return (
    <PageTransition className="space-y-6">
      <FeatureHeader
        icon={LayoutDashboard}
        title="Component Architecture Trainer"
        subtitle="Break a UI into components and decide where each piece of state should live — the 'lifting state up' instinct interviewers look for."
        right={<Badge tone="accent">{v2.counts.archDone}/{architectureMockups.length} done</Badge>}
      />

      <div className="flex flex-wrap gap-2">
        {architectureMockups.map((m) => (
          <button
            key={m.id}
            onClick={() => setActiveId(m.id)}
            className={cn(
              'rounded-lg border px-3 py-1.5 text-sm transition-colors focus-ring',
              m.id === activeId
                ? 'border-accent bg-accent/10 text-accent'
                : 'border-line/10 text-content-muted hover:border-accent/40',
            )}
          >
            {m.title}
            {isArchDone(m.id) && <CheckCircle2 size={13} className="ml-1.5 inline text-emerald-400" />}
          </button>
        ))}
      </div>

      <MockupExercise key={mockup.id} mockup={mockup} done={isArchDone(mockup.id)} onComplete={() => completeArch(mockup.id)} />
    </PageTransition>
  )
}

function MockupExercise({ mockup, done, onComplete }) {
  const [selected, setSelected] = useState(null)
  const [labels, setLabels] = useState({}) // regionId -> user's component name
  const [tree, setTree] = useState('')
  const [owners, setOwners] = useState({}) // dataIndex -> chosen owner
  const [revealed, setRevealed] = useState(false)

  const ownerOptions = useMemo(() => {
    const set = new Set(['App'])
    mockup.regions.forEach((r) => set.add(r.suggested))
    return [...set]
  }, [mockup])

  return (
    <div className="space-y-5">
      <p className="text-content-muted">
        <Badge tone="muted" className="mr-2">{mockup.difficulty}</Badge>
        {mockup.description}
      </p>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Wireframe */}
        <div className="rounded-2xl border border-line/10 bg-surface-900 p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-content-faint">
            Wireframe — click a region
          </p>
          <svg viewBox={mockup.viewBox} className="w-full rounded-lg bg-surface-950">
            {mockup.regions.map((r, i) => {
              const isSel = selected === r.id
              return (
                <g key={r.id} onClick={() => setSelected(r.id)} className="cursor-pointer">
                  <rect
                    x={r.x}
                    y={r.y}
                    width={r.w}
                    height={r.h}
                    rx="6"
                    fill={isSel ? 'rgba(56,189,248,0.18)' : 'rgba(255,255,255,0.03)'}
                    stroke={isSel ? '#38bdf8' : 'rgba(148,163,184,0.4)'}
                    strokeWidth={isSel ? 2 : 1}
                  />
                  <circle cx={r.x + 14} cy={r.y + 14} r="9" fill="#38bdf8" />
                  <text x={r.x + 14} y={r.y + 18} textAnchor="middle" fontSize="11" fill="#0a0f1a" fontWeight="700">
                    {i + 1}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>

        {/* Region naming */}
        <div className="rounded-2xl border border-line/10 bg-surface-900 p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-content-faint">
            Name each region as a component
          </p>
          <ul className="space-y-2">
            {mockup.regions.map((r, i) => (
              <li
                key={r.id}
                onMouseEnter={() => setSelected(r.id)}
                className={cn(
                  'rounded-lg border p-2 transition-colors',
                  selected === r.id ? 'border-accent/40 bg-accent/5' : 'border-line/10',
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent text-[11px] font-bold text-slate-950">
                    {i + 1}
                  </span>
                  <span className="text-xs text-content-muted">{r.label}</span>
                </div>
                <input
                  value={labels[r.id] || ''}
                  onChange={(e) => setLabels((l) => ({ ...l, [r.id]: e.target.value }))}
                  placeholder="e.g. ProductCard"
                  disabled={revealed}
                  className="mt-1.5 w-full rounded border border-line/10 bg-surface-800 px-2 py-1 font-mono text-xs text-content focus-ring disabled:opacity-60"
                />
                {revealed && (
                  <p className="mt-1 text-xs text-emerald-300">model: <span className="font-mono">{r.suggested}</span></p>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Component tree */}
      <div className="rounded-2xl border border-line/10 bg-surface-900 p-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-content-faint">
          Sketch the component tree (indented text)
        </p>
        <textarea
          value={tree}
          onChange={(e) => setTree(e.target.value)}
          disabled={revealed}
          rows={5}
          placeholder={'App\n├─ Navbar\n└─ ProductGrid\n   └─ ProductCard'}
          className="w-full rounded-lg border border-line/10 bg-surface-800 px-3 py-2 font-mono text-sm text-content placeholder:text-content-faint focus-ring disabled:opacity-60"
        />
      </div>

      {/* State ownership */}
      <div className="rounded-2xl border border-line/10 bg-surface-900 p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-content-faint">
          Where should each piece of state live?
        </p>
        <div className="space-y-2">
          {mockup.dataItems.map((d, i) => (
            <div key={i} className="flex flex-wrap items-center gap-2">
              <span className="flex-1 text-sm text-content">{d}</span>
              <select
                value={owners[i] || ''}
                onChange={(e) => setOwners((o) => ({ ...o, [i]: e.target.value }))}
                disabled={revealed}
                className="rounded-lg border border-line/10 bg-surface-800 px-2 py-1.5 text-sm text-content focus-ring disabled:opacity-60"
              >
                <option value="">owner…</option>
                {ownerOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>

      {!revealed ? (
        <Button onClick={() => setRevealed(true)}>
          <Eye size={16} /> Reveal model breakdown
        </Button>
      ) : (
        <div className="space-y-4">
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
            <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-emerald-300">
              <Lightbulb size={15} /> Model component tree
            </p>
            <pre className="overflow-x-auto rounded-lg bg-surface-950 p-3 font-mono text-sm text-content">{mockup.model.tree}</pre>
          </div>

          <div className="rounded-2xl border border-line/10 bg-surface-900 p-4">
            <p className="mb-2 text-sm font-semibold text-content-strong">Where state lives & why</p>
            <ul className="space-y-2">
              {mockup.model.ownership.map((o, i) => (
                <li key={i} className="rounded-lg border border-line/10 bg-surface-950 p-3 text-sm">
                  <p className="text-content">
                    <span className="font-medium text-content-strong">{o.data}</span> →{' '}
                    <span className="rounded bg-accent/15 px-1.5 py-0.5 font-mono text-accent">{o.owner}</span>
                  </p>
                  <p className="mt-1 text-content-muted">{o.why}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-start gap-2 rounded-2xl border border-flash/20 bg-flash/5 p-4 text-sm text-content">
            <AlertTriangle size={16} className="mt-0.5 shrink-0 text-flash" />
            <div>
              <span className="font-semibold text-flash">What would go wrong otherwise: </span>
              {mockup.model.pitfall}
            </div>
          </div>

          <Button variant={done ? 'secondary' : 'primary'} onClick={onComplete} disabled={done}>
            <CheckCircle2 size={16} /> {done ? 'Completed' : 'Mark this exercise done'}
          </Button>
        </div>
      )}
    </div>
  )
}
