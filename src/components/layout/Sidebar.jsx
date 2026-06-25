import { useMemo, useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import {
  Search,
  CheckCircle2,
  Circle,
  FlaskConical,
  Trophy,
  Atom,
  X,
  Gauge,
} from 'lucide-react'
import { modulesList, CATEGORIES } from '../../data/modulesList'
import { interviewPages } from '../../data/v2meta'
import { getIcon } from '../../lib/icons'
import { useProgress } from '../../hooks/useProgress'
import { ProgressBar } from './ProgressBar'
import { cn } from '../../lib/cn'

/*
 * Sidebar — primary navigation, organized into the three v2 tracks:
 *   Foundations (v1 modules) · Interview Mastery · Capstone
 * plus a persistent Readiness Dashboard link with a live readiness %.
 * Search filters the Foundations module list.
 */
const navLinkClass = ({ isActive }) =>
  cn(
    'group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors focus-ring',
    isActive ? 'bg-accent/15 text-accent' : 'text-content hover:bg-line/5',
  )

function TrackLabel({ children }) {
  return (
    <p className="px-2 pb-1 pt-3 text-[11px] font-bold uppercase tracking-wider text-content-faint">
      {children}
    </p>
  )
}

export function Sidebar({ open, onClose }) {
  const { isComplete, stats, v2 } = useProgress()
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return modulesList
    return modulesList.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.short.toLowerCase().includes(q) ||
        String(m.num).includes(q),
    )
  }, [query])

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-30 bg-black/60 backdrop-blur-sm transition-opacity lg:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-line/10 bg-surface-900/95 backdrop-blur',
          'transition-transform duration-300 lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* Brand */}
        <div className="flex items-center justify-between gap-2 px-5 py-4">
          <Link to="/" className="flex items-center gap-2 focus-ring rounded-md" onClick={onClose}>
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-accent to-accent-glow text-slate-950">
              <Atom size={18} className="animate-[spin_8s_linear_infinite]" />
            </span>
            <span className="text-base font-extrabold tracking-tight text-gradient">
              React Playground
            </span>
          </Link>
          <button
            className="rounded-md p-1 text-content-muted hover:bg-line/5 lg:hidden focus-ring"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Persistent Readiness summary */}
        <div className="px-3">
          <NavLink
            to="/readiness"
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                'block rounded-xl border p-3 transition-colors focus-ring',
                isActive
                  ? 'border-accent/50 bg-accent/10'
                  : 'border-line/10 bg-surface-800/60 hover:border-accent/30',
              )
            }
          >
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 font-semibold text-content-strong">
                <Gauge size={14} className="text-accent" /> Interview Readiness
              </span>
              <span className="font-mono text-accent">{v2.readiness}%</span>
            </div>
            <ProgressBar value={v2.readiness} />
          </NavLink>
        </div>

        {/* Search */}
        <div className="px-3 pt-3 pb-1">
          <div className="relative">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-content-faint" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search modules…"
              className="w-full rounded-lg border border-line/10 bg-surface-800 py-2 pl-9 pr-3 text-sm text-content placeholder:text-content-faint focus-ring"
            />
          </div>
        </div>

        {/* Tracks */}
        <nav className="flex-1 overflow-y-auto px-3 py-1">
          {/* Track 1 — Foundations */}
          <TrackLabel>Foundations</TrackLabel>
          {CATEGORIES.map((cat) => {
            const items = filtered.filter((m) => m.category === cat)
            if (items.length === 0) return null
            return (
              <div key={cat} className="mb-1">
                <p className="px-2 pb-0.5 pt-1.5 text-[10px] font-semibold uppercase tracking-wider text-content-faint/70">
                  {cat}
                </p>
                <ul className="space-y-0.5">
                  {items.map((m) => {
                    const Icon = getIcon(m.icon)
                    const done = isComplete(m.id)
                    return (
                      <li key={m.id}>
                        <NavLink to={`/learn/${m.id}`} onClick={onClose} className={navLinkClass}>
                          <Icon size={16} className="shrink-0 opacity-80" />
                          <span className="flex-1 truncate">
                            <span className="mr-1 font-mono text-xs text-content-faint">{m.num}</span>
                            {m.title}
                          </span>
                          {done ? (
                            <CheckCircle2 size={15} className="shrink-0 text-emerald-400" />
                          ) : (
                            <Circle size={15} className="shrink-0 text-content-faint/50" />
                          )}
                        </NavLink>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )
          })}
          {filtered.length === 0 && (
            <p className="px-3 py-3 text-center text-sm text-content-faint">
              No modules match “{query}”.
            </p>
          )}

          {/* Track 2 — Interview Mastery */}
          <TrackLabel>Interview Mastery</TrackLabel>
          <ul className="space-y-0.5">
            {interviewPages.map((p) => {
              const Icon = getIcon(p.icon)
              return (
                <li key={p.id}>
                  <NavLink to={`/${p.id}`} onClick={onClose} className={navLinkClass}>
                    <Icon size={16} className="shrink-0 opacity-80" />
                    <span className="flex-1 truncate">{p.title}</span>
                  </NavLink>
                </li>
              )
            })}
          </ul>

          {/* Track 3 — Capstone */}
          <TrackLabel>Capstone</TrackLabel>
          <NavLink to="/capstone" onClick={onClose} className={navLinkClass}>
            {(() => {
              const Icon = getIcon('Rocket')
              return <Icon size={16} className="shrink-0 opacity-80" />
            })()}
            <span className="flex-1 truncate">Build Your Portfolio</span>
          </NavLink>
        </nav>

        {/* Footer */}
        <div className="border-t border-line/10 p-3">
          <NavLink to="/sandbox" onClick={onClose} className={navLinkClass}>
            <FlaskConical size={16} /> Free Sandbox
          </NavLink>
          <NavLink to="/progress" onClick={onClose} className={navLinkClass}>
            <Trophy size={16} /> Progress & Badges
          </NavLink>
        </div>
      </aside>
    </>
  )
}
