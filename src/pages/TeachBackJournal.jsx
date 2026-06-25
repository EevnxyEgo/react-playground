import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { GraduationCap, BookOpen, Calendar } from 'lucide-react'
import { useProgress } from '../hooks/useProgress'
import { PageTransition } from '../components/layout/PageTransition'
import { FeatureHeader } from '../components/v2/FeatureHeader'
import { Badge } from '../components/ui/Badge'
import { cn } from '../lib/cn'

/*
 * Teach-Back Journal — browse your own Feynman-style explanations, organized by
 * topic, persisted in localStorage (via AppContext). Substantive entries feed
 * the Communication skill axis.
 */
const TYPE_LABEL = { module: 'Module', challenge: 'Challenge', internals: 'Internals' }

export default function TeachBackJournal() {
  const { teachBack } = useProgress()
  const [groupBy, setGroupBy] = useState('date') // date | topic

  const groups = useMemo(() => {
    const map = new Map()
    for (const e of teachBack) {
      const key = groupBy === 'topic' ? e.topic : new Date(e.date).toLocaleDateString()
      if (!map.has(key)) map.set(key, [])
      map.get(key).push(e)
    }
    return [...map.entries()]
  }, [teachBack, groupBy])

  return (
    <PageTransition className="space-y-6">
      <FeatureHeader
        icon={GraduationCap}
        title="Teach-Back Journal"
        subtitle="Your own explanations, in your own words — the Feynman technique. Re-reading these is a fast way to find (and close) gaps."
        right={<Badge tone="accent">{teachBack.length} entries</Badge>}
      />

      {teachBack.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line/20 bg-surface-900 p-10 text-center">
          <BookOpen className="mx-auto mb-3 text-content-faint" size={28} />
          <p className="font-semibold text-content-strong">No entries yet</p>
          <p className="mt-1 text-sm text-content-muted">
            Finish a module, challenge, or an Under-the-Hood scenario and use the
            “Teach it back” prompt to add your first explanation.
          </p>
          <Link to="/under-the-hood" className="mt-4 inline-block text-sm text-accent hover:underline">
            Try it on reconciliation →
          </Link>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-content-muted">Group by:</span>
            {['date', 'topic'].map((g) => (
              <button
                key={g}
                onClick={() => setGroupBy(g)}
                className={cn('rounded-lg border px-2.5 py-1 capitalize transition-colors focus-ring', groupBy === g ? 'border-accent bg-accent/10 text-accent' : 'border-line/10 text-content-muted')}
              >
                {g}
              </button>
            ))}
          </div>

          {groups.map(([key, entries]) => (
            <section key={key}>
              <h2 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-content-faint">
                <Calendar size={13} /> {key}
              </h2>
              <div className="space-y-2">
                {entries.map((e) => (
                  <div key={e.id} className="rounded-xl border border-line/10 bg-surface-900 p-4">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-content-strong">{e.topic}</span>
                      <Badge tone="muted">{TYPE_LABEL[e.type] || e.type}</Badge>
                      <span className="ml-auto text-xs text-content-faint">{new Date(e.date).toLocaleString()}</span>
                    </div>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-content">{e.text}</p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </>
      )}
    </PageTransition>
  )
}
