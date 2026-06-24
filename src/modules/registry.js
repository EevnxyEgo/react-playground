import { lazy } from 'react'

/*
 * Lazy-loaded module bodies, keyed by slug (matching modulesList ids).
 *
 * Each module is code-split so visiting one only downloads that lesson (the
 * heavy Sandpack chunk is shared). Slugs without an entry here fall back to a
 * friendly "coming soon" placeholder in ModulePage, so the app always builds
 * and every sidebar link still navigates.
 */
export const moduleComponents = {
  welcome: lazy(() => import('./00-welcome/content.jsx')),
  components: lazy(() => import('./01-components/content.jsx')),
  jsx: lazy(() => import('./02-jsx/content.jsx')),
  props: lazy(() => import('./03-props/content.jsx')),
  state: lazy(() => import('./04-state/content.jsx')),
  events: lazy(() => import('./05-events/content.jsx')),
  'conditional-rendering': lazy(() => import('./06-conditional/content.jsx')),
  'lists-and-keys': lazy(() => import('./07-lists/content.jsx')),
  forms: lazy(() => import('./08-forms/content.jsx')),
  useeffect: lazy(() => import('./09-useeffect/content.jsx')),
  useref: lazy(() => import('./10-useref/content.jsx')),
  usecontext: lazy(() => import('./11-usecontext/content.jsx')),
  usereducer: lazy(() => import('./12-usereducer/content.jsx')),
  'custom-hooks': lazy(() => import('./13-custom-hooks/content.jsx')),
  optimization: lazy(() => import('./14-optimization/content.jsx')),
  'error-boundaries': lazy(() => import('./15-error-boundaries/content.jsx')),
  composition: lazy(() => import('./16-composition/content.jsx')),
  'react-router': lazy(() => import('./17-react-router/content.jsx')),
  'final-project': lazy(() => import('./18-final-project/content.jsx')),
}
