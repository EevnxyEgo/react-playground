import { Suspense } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { testingById, getAdjacentTesting } from '../data/testingModules'
import { testingComponents } from '../modules/testing/registry'
import { ModuleLayout } from '../components/learning/ModuleLayout'
import { PageTransition } from '../components/layout/PageTransition'
import { Button } from '../components/ui/Button'
import { useProgress } from '../hooks/useProgress'

/*
 * Renders a Testing Fundamentals module. Reuses the shared ModuleLayout with
 * track overrides: testing-specific completion + adjacency + the /testing base
 * path, so completing testing modules doesn't touch Foundations progress.
 */
export default function TestingModulePage() {
  const { slug } = useParams()
  const { isTestingDone, toggleTesting } = useProgress()
  const meta = testingById[slug]

  if (!meta) {
    return (
      <PageTransition className="py-24 text-center">
        <p className="text-content-muted">Testing module “{slug}” doesn't exist.</p>
        <Link to="/testing/why-test" className="mt-4 inline-block">
          <Button>Start the track</Button>
        </Link>
      </PageTransition>
    )
  }

  const Body = testingComponents[slug]
  const { prev, next } = getAdjacentTesting(slug)

  return (
    <ModuleLayout
      meta={{ ...meta, category: 'Testing' }}
      isDone={isTestingDone(slug)}
      onToggleDone={() => toggleTesting(slug)}
      prev={prev}
      next={next}
      basePath="/testing"
      xpAmount={50}
    >
      <Suspense fallback={<div className="grid h-48 place-items-center"><Loader2 className="animate-spin text-accent" size={28} /></div>}>
        <Body />
      </Suspense>
    </ModuleLayout>
  )
}
