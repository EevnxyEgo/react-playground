import { Link } from 'react-router-dom'
import {
  Radar as RadarIcon, ArrowRight, Dumbbell, Bug, Eye, Layers, Timer, Rocket,
} from 'lucide-react'
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
} from 'recharts'
import { useProgress } from '../hooks/useProgress'
import { PageTransition } from '../components/layout/PageTransition'
import { FeatureHeader } from '../components/v2/FeatureHeader'
import { ProgressBar } from '../components/layout/ProgressBar'
import { cn } from '../lib/cn'

/*
 * Confidence Dashboard ("Interview Readiness Report") — a 6-axis skill radar
 * derived from real activity across every v2 feature, plus a deep-linked
 * "weakest area" nudge and supporting activity tiles.
 */
export default function Readiness() {
  const { v2 } = useProgress()
  const { skills, readiness, weakest, counts, totals } = v2

  const chartData = skills.map((s) => ({ axis: s.label, value: s.value }))

  const tiles = [
    { icon: Dumbbell, label: 'Challenges solved', value: `${counts.challengeDone}/${totals.challenges}`, link: '/challenges' },
    { icon: Bug, label: 'Bugs fixed', value: `${counts.debugDone}/${totals.debugging}`, link: '/debugging-gauntlet' },
    { icon: Eye, label: 'Predict correct', value: `${counts.predictCorrect}/${totals.predict}`, link: '/predict-output' },
    { icon: Layers, label: 'Flashcards mastered', value: `${counts.flashGot}/${totals.flashcards}`, link: '/flashcards' },
    { icon: Timer, label: 'Mock interviews', value: counts.interviewSessions, link: '/interview-simulator' },
    { icon: Rocket, label: 'Capstone milestones', value: `${counts.capstoneDone}/${totals.capstone}`, link: '/capstone' },
  ]

  const readinessLabel =
    readiness >= 80 ? 'Interview-ready' : readiness >= 50 ? 'Getting there' : readiness >= 20 ? 'Warming up' : 'Just starting'

  return (
    <PageTransition className="space-y-6">
      <FeatureHeader
        icon={RadarIcon}
        title="Interview Readiness Report"
        subtitle="A live skill radar built from what you've actually done across the app — not self-rated."
        right={
          <div className="text-right">
            <p className="text-3xl font-extrabold text-gradient">{readiness}%</p>
            <p className="text-xs text-content-muted">{readinessLabel}</p>
          </div>
        }
      />

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Radar */}
        <div className="rounded-2xl border border-line/10 bg-surface-900 p-4">
          <p className="mb-2 text-sm font-semibold text-content-strong">Skill radar</p>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={chartData} outerRadius="72%">
                <PolarGrid stroke="rgba(148,163,184,0.25)" />
                <PolarAngleAxis dataKey="axis" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <PolarRadiusAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 10 }} angle={30} />
                <Radar dataKey="value" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.35} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Per-axis bars + weakest callout */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-line/10 bg-surface-900 p-4">
            <p className="mb-3 text-sm font-semibold text-content-strong">By axis</p>
            <div className="space-y-3">
              {skills.map((s) => (
                <div key={s.key}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <Link to={s.link} className="text-content-muted hover:text-accent">{s.label}</Link>
                    <span className="font-mono text-content">{s.value}%</span>
                  </div>
                  <ProgressBar value={s.value} />
                </div>
              ))}
            </div>
          </div>

          {/* Weakest-area deep link */}
          <div className="rounded-2xl border border-flash/30 bg-flash/5 p-4">
            <p className="text-sm font-semibold text-flash">Focus next: {weakest.label}</p>
            <p className="mt-1 text-sm text-content">
              Your <span className="font-semibold">{weakest.label}</span> score ({weakest.value}%) is your lowest.
              A few reps there will move the needle most.
            </p>
            <Link to={weakest.link} className="mt-3 inline-block">
              <span className="inline-flex items-center gap-1 rounded-lg bg-flash px-3 py-1.5 text-sm font-semibold text-slate-950 hover:brightness-110">
                Practice {weakest.label} <ArrowRight size={15} />
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Supporting activity tiles */}
      <section>
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-content-faint">Activity</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {tiles.map((t) => (
            <Link
              key={t.label}
              to={t.link}
              className={cn(
                'rounded-xl border border-line/10 bg-surface-900 p-4 transition-all hover:border-accent/40 hover:shadow-glow focus-ring',
              )}
            >
              <t.icon size={18} className="mb-2 text-accent" />
              <p className="text-2xl font-bold text-content-strong">{t.value}</p>
              <p className="text-xs text-content-muted">{t.label}</p>
            </Link>
          ))}
        </div>
      </section>
    </PageTransition>
  )
}
