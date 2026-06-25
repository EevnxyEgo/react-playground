import { useEffect, useRef, useState } from 'react'
import { SkipBack, SkipForward, Play, Pause, RotateCcw } from 'lucide-react'
import { Button } from '../ui/Button'
import { cn } from '../../lib/cn'

/*
 * ReconciliationStepper — a reusable, DATA-DRIVEN step-through visualizer.
 * Pass a `scenario` (see data/reconciliationScenarios.js) and it renders a
 * debugger-style walk through the render → commit phases: play / pause /
 * step-forward / step-back. New scenarios are added as data, not new UI code.
 */
const STATUS = {
  same: { cls: 'border-line/15 text-content-muted', tag: '' },
  reused: { cls: 'border-emerald-500/30 bg-emerald-500/5 text-emerald-200', tag: 'reused' },
  updated: { cls: 'border-amber-500/40 bg-amber-500/10 text-amber-200', tag: 'update' },
  added: { cls: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-200', tag: 'added' },
  removed: { cls: 'border-rose-500/40 bg-rose-500/5 text-rose-300 line-through', tag: 'removed' },
  touched: { cls: 'border-cyan-400/50 bg-cyan-400/10 text-cyan-100 ring-1 ring-cyan-400/40', tag: 'DOM' },
}

const PHASE = {
  idle: { label: 'On screen', cls: 'bg-line/10 text-content-muted' },
  trigger: { label: 'State change', cls: 'bg-flash/15 text-flash' },
  render: { label: 'Render phase', cls: 'bg-accent/15 text-accent' },
  commit: { label: 'Commit phase', cls: 'bg-cyan-400/15 text-cyan-200' },
}

function TreeView({ nodes, label }) {
  return (
    <div className="flex-1">
      {label && <p className="mb-1.5 text-xs font-semibold text-content-muted">{label}</p>}
      <div className="space-y-1">
        {nodes.map((node, i) => {
          const s = STATUS[node.status] || STATUS.same
          return (
            <div
              key={i}
              className={cn('flex items-center justify-between rounded-md border px-2.5 py-1.5 font-mono text-xs transition-all', s.cls)}
              style={{ marginLeft: node.depth * 18 }}
            >
              <span>{node.label}</span>
              {s.tag && <span className="ml-2 rounded bg-black/20 px-1.5 py-0.5 text-[10px] uppercase tracking-wide">{s.tag}</span>}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function ReconciliationStepper({ scenario, onComplete }) {
  const [i, setI] = useState(0)
  const [playing, setPlaying] = useState(false)
  const completedRef = useRef(false)
  const steps = scenario.steps
  const step = steps[i]
  const atEnd = i >= steps.length - 1

  // Auto-advance while playing.
  useEffect(() => {
    if (!playing) return
    if (atEnd) {
      setPlaying(false)
      return
    }
    const t = setTimeout(() => setI((x) => Math.min(x + 1, steps.length - 1)), 1600)
    return () => clearTimeout(t)
  }, [playing, i, atEnd, steps.length])

  // Mark the scenario engaged once the user reaches the commit/last step.
  useEffect(() => {
    if (atEnd && !completedRef.current) {
      completedRef.current = true
      onComplete?.()
    }
  }, [atEnd, onComplete])

  // Reset when the scenario changes.
  useEffect(() => {
    setI(0)
    setPlaying(false)
    completedRef.current = false
  }, [scenario.id])

  const phase = PHASE[step.phase] || PHASE.idle

  return (
    <div className="rounded-2xl border border-line/10 bg-surface-900 p-5">
      {/* Controls */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Button size="sm" variant="ghost" onClick={() => { setPlaying(false); setI(0) }} title="Restart">
          <RotateCcw size={15} />
        </Button>
        <Button size="sm" variant="secondary" disabled={i === 0} onClick={() => { setPlaying(false); setI((x) => Math.max(0, x - 1)) }}>
          <SkipBack size={15} /> Back
        </Button>
        <Button size="sm" onClick={() => (atEnd ? (setI(0), setPlaying(true)) : setPlaying((p) => !p))}>
          {playing ? <Pause size={15} /> : <Play size={15} />} {playing ? 'Pause' : atEnd ? 'Replay' : 'Play'}
        </Button>
        <Button size="sm" variant="secondary" disabled={atEnd} onClick={() => { setPlaying(false); setI((x) => Math.min(steps.length - 1, x + 1)) }}>
          Step <SkipForward size={15} />
        </Button>
        <span className="ml-auto flex items-center gap-2">
          <span className={cn('rounded-full px-2 py-0.5 text-xs font-semibold', phase.cls)}>{phase.label}</span>
          <span className="font-mono text-xs text-content-faint">{i + 1}/{steps.length}</span>
        </span>
      </div>

      {/* Step progress dots */}
      <div className="mb-4 flex gap-1.5">
        {steps.map((_, idx) => (
          <button
            key={idx}
            onClick={() => { setPlaying(false); setI(idx) }}
            className={cn('h-1.5 flex-1 rounded-full transition-colors', idx <= i ? 'bg-accent' : 'bg-surface-600')}
          />
        ))}
      </div>

      {/* Step content */}
      <h3 className="text-base font-bold text-content-strong">{step.title}</h3>
      <p className="mt-1 mb-4 text-sm text-content-muted">{step.explain}</p>

      <div className="flex flex-col gap-4 sm:flex-row">
        <TreeView nodes={step.tree} label={step.treeLabel} />
        {step.treeB && <TreeView nodes={step.treeB} label={step.treeBLabel} />}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 border-t border-line/10 pt-3 text-[11px] text-content-faint">
        {['reused', 'updated', 'added', 'removed', 'touched'].map((k) => (
          <span key={k} className="inline-flex items-center gap-1.5">
            <span className={cn('h-2.5 w-2.5 rounded-sm border', STATUS[k].cls)} /> {k}
          </span>
        ))}
      </div>
    </div>
  )
}
