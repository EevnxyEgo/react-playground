import { lazy } from 'react'

// Lazy-loaded Testing Fundamentals module bodies, keyed by slug.
export const testingComponents = {
  'why-test': lazy(() => import('./why-test.jsx')),
  'jest-basics': lazy(() => import('./jest-basics.jsx')),
  'rtl-philosophy': lazy(() => import('./rtl-philosophy.jsx')),
  'querying': lazy(() => import('./querying.jsx')),
  'interaction': lazy(() => import('./interaction.jsx')),
  'testing-forms': lazy(() => import('./testing-forms.jsx')),
  'async': lazy(() => import('./async.jsx')),
  'mocking': lazy(() => import('./mocking.jsx')),
  'snapshots': lazy(() => import('./snapshots.jsx')),
  'testing-hooks': lazy(() => import('./testing-hooks.jsx')),
  'what-to-test': lazy(() => import('./what-to-test.jsx')),
}
