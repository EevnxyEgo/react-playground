// Central metadata for every learning module.
// This single source of truth drives:
//   - the sidebar (grouped by `category`, ordered by `num`)
//   - routing (`/learn/:slug`)
//   - progress tracking (each module is keyed by its stable `id`)
//
// Keeping this as plain data (no JSX/components) means routing and navigation
// never depend on heavy module content being loaded.

export const CATEGORIES = ['Start', 'Fundamentals', 'Hooks', 'Advanced', 'Project']

export const modulesList = [
  { num: 0, id: 'welcome', title: 'Welcome', icon: 'Home', category: 'Start',
    short: 'What React is & how to use this playground' },

  { num: 1, id: 'components', title: 'Creating Components', icon: 'Boxes', category: 'Fundamentals',
    short: 'Three ways to write the same component', comparison: true },
  { num: 2, id: 'jsx', title: 'JSX', icon: 'Code2', category: 'Fundamentals',
    short: 'The HTML-in-JS syntax and its rules' },
  { num: 3, id: 'props', title: 'Props', icon: 'Package', category: 'Fundamentals',
    short: 'Passing data into components' },
  { num: 4, id: 'state', title: 'State', icon: 'Activity', category: 'Fundamentals',
    short: 'Data that changes over time', comparison: true, visualizer: true },
  { num: 5, id: 'events', title: 'Event Handling', icon: 'MousePointerClick', category: 'Fundamentals',
    short: 'Reacting to clicks, input and more' },
  { num: 6, id: 'conditional-rendering', title: 'Conditional Rendering', icon: 'GitBranch', category: 'Fundamentals',
    short: 'Showing UI based on conditions' },
  { num: 7, id: 'lists-and-keys', title: 'Lists & Keys', icon: 'List', category: 'Fundamentals',
    short: 'Rendering arrays and why keys matter' },
  { num: 8, id: 'forms', title: 'Forms & Controlled Components', icon: 'FormInput', category: 'Fundamentals',
    short: 'Controlled vs uncontrolled inputs' },

  { num: 9, id: 'useeffect', title: 'useEffect vs Lifecycle', icon: 'Repeat', category: 'Hooks',
    short: 'Side effects & cleanup', comparison: true, visualizer: true },
  { num: 10, id: 'useref', title: 'useRef', icon: 'Crosshair', category: 'Hooks',
    short: 'DOM access & values that survive renders', visualizer: true },
  { num: 11, id: 'usecontext', title: 'useContext & Context API', icon: 'Network', category: 'Hooks',
    short: 'Avoiding prop drilling' },
  { num: 12, id: 'usereducer', title: 'useReducer', icon: 'Workflow', category: 'Hooks',
    short: 'Managing complex state logic' },
  { num: 13, id: 'custom-hooks', title: 'Custom Hooks', icon: 'Puzzle', category: 'Hooks',
    short: 'Extracting and reusing logic' },

  { num: 14, id: 'optimization', title: 'Optimization', icon: 'Gauge', category: 'Advanced',
    short: 'React.memo, useMemo, useCallback', visualizer: true },
  { num: 15, id: 'error-boundaries', title: 'Error Boundaries', icon: 'ShieldAlert', category: 'Advanced',
    short: 'Catching render-time crashes' },
  { num: 16, id: 'composition', title: 'Composition vs Inheritance', icon: 'Combine', category: 'Advanced',
    short: 'children & render props' },
  { num: 17, id: 'react-router', title: 'React Router Basics', icon: 'Signpost', category: 'Advanced',
    short: 'SPA navigation between pages' },

  { num: 18, id: 'final-project', title: 'Final Project: Todo App', icon: 'Trophy', category: 'Project',
    short: 'The boss level — combine everything' },
]

// Quick lookups
export const moduleById = Object.fromEntries(modulesList.map((m) => [m.id, m]))
export const TOTAL_MODULES = modulesList.length

// Ordered navigation helpers (used for Prev/Next buttons on a module page)
export function getAdjacentModules(id) {
  const idx = modulesList.findIndex((m) => m.id === id)
  return {
    prev: idx > 0 ? modulesList[idx - 1] : null,
    next: idx >= 0 && idx < modulesList.length - 1 ? modulesList[idx + 1] : null,
  }
}
