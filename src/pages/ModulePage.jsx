import { Suspense } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Loader2, Construction } from 'lucide-react'
import { moduleById } from '../data/modulesList'
import { moduleComponents } from '../modules/registry'
import { ModuleLayout } from '../components/learning/ModuleLayout'
import { PageTransition } from '../components/layout/PageTransition'
import { Button } from '../components/ui/Button'

/*
 * ModulePage — resolves :slug to the right lazy-loaded module body and renders
 * it inside the shared ModuleLayout. Unknown slugs → not found; known-but-not-
 * yet-authored slugs → a "coming soon" panel (still inside the layout, so
 * navigation and the mark-complete chrome remain consistent).
 */
export default function ModulePage() {
  const { slug } = useParams()
  const meta = moduleById[slug]

  if (!meta) {
    return (
      <PageTransition className="py-24 text-center">
        <p className="text-slate-400">Module “{slug}” doesn't exist.</p>
        <Link to="/" className="mt-4 inline-block">
          <Button>Back home</Button>
        </Link>
      </PageTransition>
    )
  }

  const Body = moduleComponents[slug]

  return (
    <ModuleLayout meta={meta}>
      {Body ? (
        <Suspense fallback={<ModuleLoading />}>
          <Body />
        </Suspense>
      ) : (
        <ComingSoon />
      )}
    </ModuleLayout>
  )
}

function ModuleLoading() {
  return (
    <div className="grid h-48 place-items-center text-slate-500">
      <Loader2 className="animate-spin text-accent" size={28} />
    </div>
  )
}

function ComingSoon() {
  return (
    <div className="rounded-xl border border-dashed border-white/15 bg-surface-900 p-10 text-center">
      <Construction className="mx-auto mb-3 text-flash" size={28} />
      <p className="font-semibold text-slate-200">This module is being authored.</p>
      <p className="mt-1 text-sm text-slate-400">
        Check back soon — or jump into the free sandbox to keep practicing.
      </p>
      <Link to="/sandbox" className="mt-4 inline-block">
        <Button variant="secondary">Open sandbox</Button>
      </Link>
    </div>
  )
}
