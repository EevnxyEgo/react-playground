import { useState } from 'react'
import { Trophy, Lock, RotateCcw, Star, Flame, BookOpen, ListChecks } from 'lucide-react'
import { getIcon } from '../lib/icons'
import { useProgress } from '../hooks/useProgress'
import { PageTransition } from '../components/layout/PageTransition'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { ProgressBar } from '../components/layout/ProgressBar'
import { cn } from '../lib/cn'

// Progress dashboard: headline stats, level/XP, and the badge wall.
export default function Progress() {
  const { stats, badges, resetProgress } = useProgress()
  const [confirming, setConfirming] = useState(false)

  const earnedCount = badges.filter((b) => b.earned).length

  const tiles = [
    { icon: BookOpen, label: 'Modules done', value: `${stats.modulesDone}/${stats.totalModules}` },
    { icon: Star, label: 'Total XP', value: stats.xp },
    { icon: Flame, label: 'Level', value: stats.level },
    { icon: ListChecks, label: 'Quizzes correct', value: stats.quizCorrect },
  ]

  return (
    <PageTransition className="space-y-8">
      <div className="flex items-center gap-3">
        <Trophy className="text-flash" size={26} />
        <h1 className="text-3xl font-bold">Your Progress</h1>
      </div>

      {/* Stat tiles */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {tiles.map((t) => (
          <Card key={t.label} className="p-4">
            <t.icon size={18} className="mb-2 text-accent" />
            <p className="text-2xl font-bold text-slate-100">{t.value}</p>
            <p className="text-xs text-slate-400">{t.label}</p>
          </Card>
        ))}
      </div>

      {/* Level progress */}
      <Card className="p-5">
        <div className="mb-2 flex items-center justify-between">
          <span className="font-semibold">Level {stats.level}</span>
          <span className="font-mono text-sm text-slate-400">
            {stats.xpIntoLevel}/{stats.xpForLevel} XP to next level
          </span>
        </div>
        <ProgressBar value={(stats.xpIntoLevel / stats.xpForLevel) * 100} />
      </Card>

      {/* Badges */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-bold">Badges</h2>
          <span className="text-sm text-slate-500">
            {earnedCount}/{badges.length} earned
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {badges.map((b) => {
            const Icon = b.earned ? getIcon(b.icon) : Lock
            return (
              <Card
                key={b.id}
                className={cn(
                  'flex items-start gap-3 p-4 transition-all',
                  b.earned ? 'border-flash/30 shadow-glow' : 'opacity-60',
                )}
              >
                <span
                  className={cn(
                    'grid h-10 w-10 shrink-0 place-items-center rounded-lg',
                    b.earned ? 'bg-flash/15 text-flash' : 'bg-surface-800 text-slate-500',
                  )}
                >
                  <Icon size={18} />
                </span>
                <div className="min-w-0">
                  <p className="font-semibold text-slate-100">{b.title}</p>
                  <p className="text-xs text-slate-400">{b.description}</p>
                  {b.earned && (
                    <Badge tone="flash" className="mt-1">
                      Earned
                    </Badge>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Reset */}
      <Card className="flex flex-col items-start gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold text-slate-100">Reset progress</p>
          <p className="text-sm text-slate-400">
            Clears all completion, XP and badges from this browser. Can't be undone.
          </p>
        </div>
        {confirming ? (
          <div className="flex items-center gap-2">
            <Button variant="danger" onClick={() => { resetProgress(); setConfirming(false) }}>
              Yes, reset everything
            </Button>
            <Button variant="ghost" onClick={() => setConfirming(false)}>
              Cancel
            </Button>
          </div>
        ) : (
          <Button variant="outline" onClick={() => setConfirming(true)}>
            <RotateCcw size={16} /> Reset
          </Button>
        )}
      </Card>
    </PageTransition>
  )
}
