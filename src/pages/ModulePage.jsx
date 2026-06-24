import { useParams, Link } from 'react-router-dom'
import { moduleById } from '../data/modulesList'
import { PageTransition } from '../components/layout/PageTransition'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'

// Renders a single module by its slug. The rich, per-module learning layout
// (hook → explanation → playground → visualizer → challenge → quiz) is added
// in the next milestone once those components exist.
export default function ModulePage() {
  const { slug } = useParams()
  const meta = moduleById[slug]

  if (!meta) {
    return (
      <PageTransition className="py-24 text-center">
        <p className="text-slate-400">Module “{slug}” not found.</p>
        <Link to="/" className="mt-4 inline-block">
          <Button>Back home</Button>
        </Link>
      </PageTransition>
    )
  }

  return (
    <PageTransition className="space-y-4">
      <p className="font-mono text-sm text-slate-500">Module {meta.num}</p>
      <h1 className="text-3xl font-bold">{meta.title}</h1>
      <p className="text-slate-400">{meta.short}</p>
      <Card className="grid h-64 place-items-center text-slate-500">
        Module content coming soon
      </Card>
    </PageTransition>
  )
}
