// Reconciliation Visualizer scenarios (v3, Section 2).
//
// Each scenario is a list of STEPS the user can step through like a debugger.
// A step shows one or two columns of a tree; each node has a `status` that the
// stepper colors:
//   same    → unchanged / reused as-is
//   reused  → same type, kept (diff matched it)
//   updated → same type, props/text changed (will be patched)
//   added   → newly mounted
//   removed → unmounted
//   touched → (commit phase) an actual DOM node React mutates
//
// phase: 'idle' | 'trigger' | 'render' | 'commit'
const n = (label, status = 'same', depth = 0) => ({ label, status, depth })

export const reconciliationScenarios = [
  {
    id: 'simple-update',
    title: 'A simple text update',
    summary: 'The cheapest case: same-type nodes, only the changed text is patched.',
    steps: [
      {
        phase: 'idle', title: 'Current tree on screen',
        explain: 'This is what React has already committed to the DOM.',
        tree: [n('<App>', 'same', 0), n('<p> "Count: 0"', 'same', 1)],
      },
      {
        phase: 'trigger', title: 'State changes',
        explain: 'You call setCount(1). React schedules a re-render starting at <App>.',
        tree: [n('<App>', 'same', 0), n('<p> "Count: 0"', 'same', 1)],
      },
      {
        phase: 'render', title: 'Render phase — diff the new tree',
        explain: 'React builds the new virtual tree and diffs it against the old. <App> is the same type → reused. <p> is the same type but its text changed → marked for update. No new nodes are created.',
        tree: [n('<App>', 'reused', 0), n('<p> "Count: 1"', 'updated', 1)],
      },
      {
        phase: 'commit', title: 'Commit phase — touch the DOM',
        explain: 'React mutates ONLY the changed text node in the real DOM. <App> and the <p> element itself are left in place — far less work than recreating anything.',
        tree: [n('<App>', 'same', 0), n('<p> textContent → "Count: 1"', 'touched', 1)],
      },
    ],
  },
  {
    id: 'list-keys',
    title: 'List re-render: good keys vs index keys',
    summary: 'Prepending one item is 1 insertion with stable keys — or 4 updates with index keys.',
    steps: [
      {
        phase: 'idle', title: 'Current list',
        explain: 'A list rendered from [A, B, C].',
        tree: [n('<ul>', 'same', 0), n('<li> A', 'same', 1), n('<li> B', 'same', 1), n('<li> C', 'same', 1)],
      },
      {
        phase: 'trigger', title: 'Prepend an item',
        explain: 'You prepend "Z" → the new list is [Z, A, B, C]. Watch how the key choice changes the diff.',
        tree: [n('<ul>', 'same', 0), n('<li> Z, A, B, C (incoming)', 'updated', 1)],
      },
      {
        phase: 'render', title: 'Render phase — diff with each key strategy',
        explain: 'With stable keys, React matches A/B/C by identity and just inserts Z. With index keys, every position’s content "changed", so React marks all four for update and appends one.',
        treeLabel: 'key={item.id} — correct',
        tree: [n('<ul>', 'reused', 0), n('<li> Z', 'added', 1), n('<li> A', 'reused', 1), n('<li> B', 'reused', 1), n('<li> C', 'reused', 1)],
        treeBLabel: 'key={index} — wrong',
        treeB: [n('<ul>', 'reused', 0), n('<li> idx0 → Z', 'updated', 1), n('<li> idx1 → A', 'updated', 1), n('<li> idx2 → B', 'updated', 1), n('<li> idx3 → C', 'added', 1)],
      },
      {
        phase: 'commit', title: 'Commit phase — DOM work',
        explain: 'Correct keys = a single DOM insertion. Index keys = four DOM updates for the exact same logical change — and any focus/state tied to those <li>s gets clobbered. This is the mechanical reason "index as key" is a bug for dynamic lists.',
        treeLabel: 'correct: 1 node touched',
        tree: [n('<li> Z inserted', 'touched', 1)],
        treeBLabel: 'index: 4 nodes touched',
        treeB: [n('<li> idx0 patched', 'touched', 1), n('<li> idx1 patched', 'touched', 1), n('<li> idx2 patched', 'touched', 1), n('<li> idx3 created', 'touched', 1)],
      },
    ],
  },
  {
    id: 'unmount-remount',
    title: 'Different type → unmount & remount',
    summary: 'Swapping one component for a different type is NOT a cheap update.',
    steps: [
      {
        phase: 'idle', title: 'Logged-out view',
        explain: 'At this position React is rendering <LoginForm> with its own DOM and state.',
        tree: [n('<App>', 'same', 0), n('<LoginForm>', 'same', 1), n('<input>', 'same', 2), n('<button> Log in', 'same', 2)],
      },
      {
        phase: 'trigger', title: 'Condition flips',
        explain: 'isLoggedIn becomes true, so <App> now returns <Dashboard /> at the same position instead of <LoginForm />.',
        tree: [n('<App>', 'same', 0), n('<LoginForm> → <Dashboard>?', 'updated', 1)],
      },
      {
        phase: 'render', title: 'Render phase — different types don’t diff',
        explain: 'Because <LoginForm> and <Dashboard> are DIFFERENT types at the same position, React does not try to diff their children. It marks the whole LoginForm subtree for removal and the whole Dashboard subtree as new.',
        tree: [
          n('<App>', 'reused', 0),
          n('<LoginForm>', 'removed', 1), n('<input>', 'removed', 2), n('<button>', 'removed', 2),
          n('<Dashboard>', 'added', 1), n('<h1> Welcome', 'added', 2), n('<nav>', 'added', 2),
        ],
      },
      {
        phase: 'commit', title: 'Commit phase — tear down & build up',
        explain: 'React removes every LoginForm DOM node and creates every Dashboard node from scratch. LoginForm’s state (e.g. typed input) is gone. This is much more work than a same-type update — a key reason changing component type resets the subtree.',
        tree: [
          n('LoginForm DOM removed', 'removed', 1),
          n('Dashboard DOM created', 'touched', 1),
        ],
      },
    ],
  },
  {
    id: 'batching',
    title: 'Batching: two setState, one render',
    summary: 'Multiple updates in one handler collapse into a single render pass.',
    steps: [
      {
        phase: 'idle', title: 'Before the click',
        explain: 'A component with two pieces of state, count and flag.',
        tree: [n('<Component> renders: 0', 'same', 0)],
      },
      {
        phase: 'trigger', title: 'One event, two updates',
        explain: 'The click handler runs: setCount(c => c + 1); setFlag(true). Two state updates fire from the same event.',
        tree: [n('handler: setCount(...); setFlag(...)', 'updated', 0)],
      },
      {
        phase: 'render', title: 'Render phase — batched vs not',
        explain: 'React batches both updates into ONE render pass. The clearly-hypothetical "no batching" column shows what you’d pay otherwise: a separate render for each setState.',
        treeLabel: 'React 18 — automatic batching',
        tree: [n('Render pass ×1 (count AND flag applied)', 'updated', 0)],
        treeBLabel: 'Hypothetical — no batching',
        treeB: [n('Render pass #1 (count)', 'updated', 0), n('Render pass #2 (flag)', 'updated', 0)],
      },
      {
        phase: 'commit', title: 'Commit phase — once',
        explain: 'Batching means React commits to the DOM a single time for the whole event. React 18 extended this "automatic batching" to promises, timeouts and native handlers too — so it applies almost everywhere now.',
        tree: [n('DOM updated once', 'touched', 0)],
      },
    ],
  },
]
