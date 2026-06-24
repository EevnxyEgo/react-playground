import { Link } from 'react-router-dom'
import {
  Sparkles,
  Play,
  FlaskConical,
  ArrowRight,
  Eye,
  CheckCircle2,
  Code2,
} from 'lucide-react'
import { modulesList, CATEGORIES } from '../data/modulesList'
import { getIcon } from '../lib/icons'
import { useProgress } from '../hooks/useProgress'
import { PageTransition } from '../components/layout/PageTransition'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { ProgressBar } from '../components/layout/ProgressBar'

// Landing page: a hero + the full curriculum laid out as clickable cards,
// each reflecting the learner's completion state.
export default function Home() {
  const { isComplete, stats } = useProgress()

  const features = [
    { icon: Code2, title: 'Live playgrounds', text: 'Edit real React code and see results instantly.' },
    { icon: Eye, title: 'Render Visualizer', text: 'Watch components flash exactly when React re-renders them.' },
    { icon: Sparkles, title: 'Instant quizzes', text: 'Check understanding with immediate feedback and XP.' },
  ]

  return (
    <PageTransition className="space-y-10">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br from-surface-900 via-surface-900 to-surface-800 p-8 lg:p-12">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
        <div className="relative max-w-2xl space-y-5">
          <Badge tone="accent" className="gap-1">
            <Sparkles size={13} /> Learn React by doing
          </Badge>
          <h1 className="text-4xl font-extrabold leading-tight lg:text-5xl">
            Master React, <span className="text-gradient">one playground at a time.</span>
          </h1>
          <p className="text-lg text-slate-400">
            From your first component to advanced hooks — {modulesList.length} hands-on
            modules with live code, render visualizations and quizzes that make the
            concepts actually stick.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link to="/learn/welcome">
              <Button size="lg">
                <Play size={18} /> Start learning
              </Button>
            </Link>
            <Link to="/sandbox">
              <Button size="lg" variant="secondary">
                <FlaskConical size={18} /> Open sandbox
              </Button>
            </Link>
          </div>

          {stats.modulesDone > 0 && (
            <div className="pt-4">
              <div className="mb-1 flex items-center justify-between text-sm text-slate-400">
                <span>You're {stats.percent}% through the course</span>
                <span className="font-mono text-accent">{stats.xp} XP</span>
              </div>
              <ProgressBar value={stats.percent} />
            </div>
          )}
        </div>
      </section>

      {/* Feature highlights */}
      <section className="grid gap-4 sm:grid-cols-3">
        {features.map((f) => (
          <Card key={f.title} className="p-5">
            <f.icon className="mb-3 text-accent" size={22} />
            <h3 className="font-semibold text-slate-100">{f.title}</h3>
            <p className="mt-1 text-sm text-slate-400">{f.text}</p>
          </Card>
        ))}
      </section>

      {/* Curriculum */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-bold">The curriculum</h2>
          <span className="text-sm text-slate-500">
            {stats.modulesDone}/{stats.totalModules} complete
          </span>
        </div>

        {CATEGORIES.map((cat) => {
          const items = modulesList.filter((m) => m.category === cat)
          return (
            <div key={cat}>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                {cat}
              </h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((m) => {
                  const Icon = getIcon(m.icon)
                  const done = isComplete(m.id)
                  return (
                    <Link key={m.id} to={`/learn/${m.id}`} className="group focus-ring rounded-xl">
                      <Card className="h-full p-4 transition-all hover:border-accent/30 hover:shadow-glow">
                        <div className="flex items-start gap-3">
                          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-surface-800 text-accent">
                            <Icon size={18} />
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs text-slate-500">
                                {String(m.num).padStart(2, '0')}
                              </span>
                              {done && (
                                <CheckCircle2 size={14} className="text-emerald-400" />
                              )}
                            </div>
                            <h4 className="truncate font-semibold text-slate-100 group-hover:text-accent">
                              {m.title}
                            </h4>
                            <p className="mt-0.5 line-clamp-2 text-sm text-slate-400">
                              {m.short}
                            </p>
                          </div>
                          <ArrowRight
                            size={16}
                            className="mt-1 shrink-0 text-slate-600 transition-transform group-hover:translate-x-0.5 group-hover:text-accent"
                          />
                        </div>
                      </Card>
                    </Link>
                  )
                })}
              </div>
            </div>
          )
        })}
      </section>
    </PageTransition>
  )
}
