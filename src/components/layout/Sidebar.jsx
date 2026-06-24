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
} from 'lucide-react'
import { modulesList, CATEGORIES } from '../../data/modulesList'
import { getIcon } from '../../lib/icons'
import { useProgress } from '../../hooks/useProgress'
import { ProgressBar } from './ProgressBar'
import { cn } from '../../lib/cn'

/*
 * Sidebar — primary navigation.
 *   - Search filters the module list live.
 *   - Each module shows a completion checkmark (from global progress).
 *   - Grouped by category to give the curriculum a sense of structure.
 *   - On desktop it's a fixed rail; on mobile it slides in as a drawer.
 */
export function Sidebar({ open, onClose }) {
  const { isComplete, stats } = useProgress()
  const [query, setQuery] = useState('')

  // Filter once per query change. Keeps category grouping intact.
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
      {/* Mobile backdrop */}
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

        {/* Overall progress */}
        <div className="px-5 pb-3">
          <div className="mb-1 flex items-center justify-between text-xs text-content-muted">
            <span>Progress</span>
            <span className="font-mono text-accent">{stats.percent}%</span>
          </div>
          <ProgressBar value={stats.percent} />
        </div>

        {/* Search */}
        <div className="px-5 pb-2">
          <div className="relative">
            <Search
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-content-faint"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search modules…"
              className="w-full rounded-lg border border-line/10 bg-surface-800 py-2 pl-9 pr-3 text-sm text-content placeholder:text-content-faint focus-ring"
            />
          </div>
        </div>

        {/* Module list */}
        <nav className="flex-1 overflow-y-auto px-3 py-2">
          {CATEGORIES.map((cat) => {
            const items = filtered.filter((m) => m.category === cat)
            if (items.length === 0) return null
            return (
              <div key={cat} className="mb-3">
                <p className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-content-faint">
                  {cat}
                </p>
                <ul className="space-y-0.5">
                  {items.map((m) => {
                    const Icon = getIcon(m.icon)
                    const done = isComplete(m.id)
                    return (
                      <li key={m.id}>
                        <NavLink
                          to={`/learn/${m.id}`}
                          onClick={onClose}
                          className={({ isActive }) =>
                            cn(
                              'group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors focus-ring',
                              isActive
                                ? 'bg-accent/15 text-accent'
                                : 'text-content hover:bg-line/5',
                            )
                          }
                        >
                          <Icon size={16} className="shrink-0 opacity-80" />
                          <span className="flex-1 truncate">
                            <span className="mr-1 font-mono text-xs text-content-faint">
                              {m.num}
                            </span>
                            {m.title}
                          </span>
                          {done ? (
                            <CheckCircle2 size={15} className="shrink-0 text-emerald-400" />
                          ) : (
                            <Circle size={15} className="shrink-0 text-content-faint" />
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
            <p className="px-3 py-6 text-center text-sm text-content-faint">
              No modules match “{query}”.
            </p>
          )}
        </nav>

        {/* Footer links */}
        <div className="border-t border-line/10 p-3">
          <NavLink
            to="/sandbox"
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors focus-ring',
                isActive ? 'bg-accent/15 text-accent' : 'text-content hover:bg-line/5',
              )
            }
          >
            <FlaskConical size={16} /> Free Sandbox
          </NavLink>
          <NavLink
            to="/progress"
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors focus-ring',
                isActive ? 'bg-accent/15 text-accent' : 'text-content hover:bg-line/5',
              )
            }
          >
            <Trophy size={16} /> Progress & Badges
          </NavLink>
        </div>
      </aside>
    </>
  )
}
