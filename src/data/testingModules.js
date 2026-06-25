// Track 4 — Testing Fundamentals (Jest + React Testing Library).
// Metadata drives the sidebar, routing (/testing/:slug) and prev/next nav.
// Completion is tracked in its own AppContext slice (testingDone) so it doesn't
// inflate the Foundations progress percentage.
export const testingModules = [
  { num: 1, id: 'why-test', title: 'Why Test? The Pyramid', icon: 'Target',
    short: 'Unit vs integration vs e2e, and testing behavior not implementation' },
  { num: 2, id: 'jest-basics', title: 'Jest Basics', icon: 'Code2',
    short: 'describe, test/it, expect and common matchers' },
  { num: 3, id: 'rtl-philosophy', title: 'RTL Philosophy', icon: 'Brain',
    short: 'Query like a user, not by implementation details' },
  { num: 4, id: 'querying', title: 'Querying Elements', icon: 'Eye',
    short: 'getBy / queryBy / findBy and which to use' },
  { num: 5, id: 'interaction', title: 'Simulating Interaction', icon: 'MousePointerClick',
    short: 'fireEvent vs user-event (and why user-event wins)' },
  { num: 6, id: 'testing-forms', title: 'Testing Forms', icon: 'FormInput',
    short: 'Input values and inline validation errors' },
  { num: 7, id: 'async', title: 'Testing Async', icon: 'Repeat',
    short: 'waitFor, findBy* and loading→success/error flows' },
  { num: 8, id: 'mocking', title: 'Mocking', icon: 'Network',
    short: 'Mock an API module / fetch call' },
  { num: 9, id: 'snapshots', title: 'Snapshot Testing', icon: 'Layers',
    short: 'What it’s for — and when not to' },
  { num: 10, id: 'testing-hooks', title: 'Testing Custom Hooks', icon: 'Puzzle',
    short: 'renderHook from @testing-library/react' },
  { num: 11, id: 'what-to-test', title: 'What’s Worth Testing', icon: 'Lightbulb',
    short: 'Avoiding both under- and over-testing' },
]

export const testingById = Object.fromEntries(testingModules.map((m) => [m.id, m]))

export function getAdjacentTesting(id) {
  const i = testingModules.findIndex((m) => m.id === id)
  return {
    prev: i > 0 ? testingModules[i - 1] : null,
    next: i >= 0 && i < testingModules.length - 1 ? testingModules[i + 1] : null,
  }
}
