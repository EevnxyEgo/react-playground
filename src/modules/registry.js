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
  state: lazy(() => import('./04-state/content.jsx')),
}
