import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle2, Circle, ArrowLeft, ArrowRight, GitCompare, Eye } from 'lucide-react'
import { getAdjacentModules } from '../../data/modulesList'
import { getIcon } from '../../lib/icons'
import { useProgress } from '../../hooks/useProgress'
import { ModuleContext } from './ModuleContext'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { PageTransition } from '../layout/PageTransition'

/*
 * ModuleLayout — the consistent chrome around every module's content:
 *   - header (number, title, category + feature badges)
 *   - a "Mark complete" toggle that awards XP
 *   - prev/next navigation
 * It also provides ModuleContext so quizzes/challenges can key their progress.
 */
export function ModuleLayout({ meta, children }) {
  const { isComplete, toggleComplete } = useProgress()
  const done = isComplete(meta.id)
  const { prev, next } = getAdjacentModules(meta.id)
  const Icon = getIcon(meta.icon)

  // Scroll to top whenever the module changes — nicer than landing mid-page.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' })
  }, [meta.id])

  return (
    <ModuleContext.Provider value={{ slug: meta.id, meta }}>
      <PageTransition className="space-y-8 pb-12">
        {/* Header */}
        <header className="space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <Badge tone="muted">{meta.category}</Badge>
            <span className="font-mono text-content-faint">
              Module {String(meta.num).padStart(2, '0')}
            </span>
            {meta.comparison && (
              <Badge tone="accent" className="gap-1">
                <GitCompare size={12} /> Comparison
              </Badge>
            )}
            {meta.visualizer && (
              <Badge tone="flash" className="gap-1">
                <Eye size={12} /> Render Visualizer
              </Badge>
            )}
          </div>
          <div className="flex items-start gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-accent/20 to-accent-glow/10 text-accent">
              <Icon size={24} />
            </span>
            <div>
              <h1 className="text-3xl font-extrabold leading-tight">{meta.title}</h1>
              <p className="text-content-muted">{meta.short}</p>
            </div>
          </div>
        </header>

        {/* Body (the 6 layers) */}
        <div className="space-y-10">{children}</div>

        {/* Mark complete */}
        <motion.div
          className="rounded-xl border border-line/10 bg-surface-900 p-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold text-content-strong">
                {done ? 'Module completed 🎉' : 'Finished this module?'}
              </p>
              <p className="text-sm text-content-muted">
                {done
                  ? 'Nice work. You can revisit it any time.'
                  : 'Mark it complete to earn XP and track your progress.'}
              </p>
            </div>
            <Button
              variant={done ? 'secondary' : 'primary'}
              onClick={() => toggleComplete(meta.id)}
            >
              {done ? <Circle size={16} /> : <CheckCircle2 size={16} />}
              {done ? 'Mark as not done' : 'Mark complete (+50 XP)'}
            </Button>
          </div>
        </motion.div>

        {/* Prev / Next */}
        <nav className="flex items-center justify-between gap-3">
          {prev ? (
            <Link to={`/learn/${prev.id}`} className="flex-1">
              <Button variant="ghost" className="w-full justify-start">
                <ArrowLeft size={16} />
                <span className="truncate text-left">{prev.title}</span>
              </Button>
            </Link>
          ) : (
            <span className="flex-1" />
          )}
          {next ? (
            <Link to={`/learn/${next.id}`} className="flex-1">
              <Button variant="secondary" className="w-full justify-end">
                <span className="truncate text-right">{next.title}</span>
                <ArrowRight size={16} />
              </Button>
            </Link>
          ) : (
            <span className="flex-1" />
          )}
        </nav>
      </PageTransition>
    </ModuleContext.Provider>
  )
}
