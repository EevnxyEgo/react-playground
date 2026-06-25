// Lightweight v2 metadata: totals + nav definitions.
//
// Totals live here (as plain numbers) rather than being imported from the heavy
// challenge/debug/etc. data files, so AppContext can compute skill percentages
// without pulling those large code-string banks into the main bundle. Keep these
// in sync with the corresponding data arrays.
export const V2_TOTALS = {
  hookScenarios: 12,
  architecture: 6,
  challenges: 23,
  debugging: 9,
  predict: 12,
  flashcards: 16,
  capstone: 8,
  // v3
  testingModules: 11,
  tdd: 4,
  internals: 4,
}

// Module-id groupings that feed the readiness radar's module-driven axes.
export const SKILL_MODULES = {
  componentsJsx: ['components', 'jsx', 'composition'],
  stateProps: ['state', 'props', 'events', 'conditional-rendering', 'lists-and-keys', 'forms'],
  hooks: ['useeffect', 'useref', 'usecontext', 'usereducer', 'custom-hooks', 'optimization'],
}

// Interview Mastery track — pages surfaced in the sidebar (Track 2).
export const interviewPages = [
  { id: 'hook-decision-engine', title: 'Hook Decision Engine', icon: 'Workflow',
    short: 'Which hook do I reach for?' },
  { id: 'decision-map', title: 'Hooks Decision Map', icon: 'Map',
    short: 'One flowchart to rule them all' },
  { id: 'architecture-trainer', title: 'Architecture Trainer', icon: 'LayoutDashboard',
    short: 'Break UIs into components' },
  { id: 'challenges', title: 'Challenge Library', icon: 'Dumbbell',
    short: 'Realistic live-coding reps' },
  { id: 'debugging-gauntlet', title: 'Debugging Gauntlet', icon: 'Bug',
    short: 'Find & fix classic React bugs' },
  { id: 'predict-output', title: 'Predict the Output', icon: 'Eye',
    short: 'Read code, predict behavior' },
  { id: 'flashcards', title: 'Flashcards', icon: 'Layers',
    short: 'Rapid-fire concept Q&A' },
  { id: 'interview-simulator', title: 'Interview Simulator', icon: 'Timer',
    short: 'The full mock-interview flow' },
]
