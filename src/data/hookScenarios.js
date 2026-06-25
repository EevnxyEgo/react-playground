// Hook Decision Engine scenario bank.
//
// Each scenario trains the interview reflex "which hook do I reach for?". The
// `whyNot` map is the important part — interviewers probe exactly why the
// alternatives are wrong, so we make the user confront that.
//
// `answer` must be one of `options`.
export const hookScenarios = [
  {
    id: 'fetch-on-mount',
    scenario:
      'You need to fetch user data when the component mounts, and again whenever the `userId` prop changes.',
    options: ['useEffect', 'useMemo', 'useState', 'useCallback'],
    answer: 'useEffect',
    why: 'Fetching is a side effect. useEffect with `[userId]` runs after mount and re-runs whenever userId changes — exactly the trigger you described.',
    whyNot: {
      useMemo: 'useMemo is for caching a computed value during render, not for performing side effects like network requests.',
      useState: 'useState holds the result, but it cannot, by itself, trigger the fetch on mount / on dependency change.',
      useCallback: 'useCallback memoizes a function reference; it does not run anything when dependencies change.',
    },
  },
  {
    id: 'focus-input',
    scenario:
      'You need to access an <input> DOM node to call `.focus()` on it after the component renders.',
    options: ['useRef', 'useState', 'useEffect', 'useMemo'],
    answer: 'useRef',
    why: 'useRef gives you a stable handle to the DOM node via the `ref` attribute; ref.current.focus() reaches the real element.',
    whyNot: {
      useState: 'State is for data that drives rendering, not for holding a DOM node reference (and setting it would cause needless re-renders).',
      useEffect: 'You often CALL focus() inside an effect, but the thing that grabs the node is a ref — the question asks how to access the node.',
      useMemo: 'useMemo caches a value; it has nothing to do with DOM access.',
    },
  },
  {
    id: 'previous-value',
    scenario:
      "You're tracking the previous value of a prop to compare it against the current one across renders.",
    options: ['useRef', 'useState', 'useMemo', 'useContext'],
    answer: 'useRef',
    why: 'A ref persists across renders without causing one. Update ref.current in an effect after each render to remember the previous value (the classic usePrevious hook).',
    whyNot: {
      useState: 'Storing the previous value in state would trigger an extra re-render every time it changes — unnecessary churn.',
      useMemo: 'useMemo recomputes from current inputs; it has no memory of a value from a prior render.',
      useContext: 'Context shares values across the tree; it is unrelated to remembering a previous render’s value.',
    },
  },
  {
    id: 'complex-actions',
    scenario:
      'You have state update logic that depends on the action type, with 4+ possible actions (add, remove, update, clear).',
    options: ['useReducer', 'useState', 'useContext', 'useRef'],
    answer: 'useReducer',
    why: 'Multiple related transitions described by action types is the textbook useReducer case — all the logic lives in one pure reducer.',
    whyNot: {
      useState: 'Several useState calls with branching update logic scattered across handlers gets messy and error-prone for 4+ actions.',
      useContext: 'Context distributes state; it does not manage transition logic. (You often pair it WITH a reducer, but it is not the answer here.)',
      useRef: 'Refs do not trigger re-renders, so UI driven by these actions would not update.',
    },
  },
  {
    id: 'expensive-calc',
    scenario:
      'You want to avoid recalculating an expensive sorted list unless the source array actually changes.',
    options: ['useMemo', 'useCallback', 'useEffect', 'useRef'],
    answer: 'useMemo',
    why: 'useMemo caches the computed result and only recomputes when a dependency (the source array) changes.',
    whyNot: {
      useCallback: 'useCallback memoizes a function, not the value it returns. Here you want the cached RESULT, so useMemo.',
      useEffect: 'An effect runs after render and would need extra state to store the result — more complexity and an extra render.',
      useRef: 'A ref could cache it, but it would not recompute when the source changes without extra wiring useMemo gives you for free.',
    },
  },
  {
    id: 'value-no-rerender',
    scenario:
      'You need a value that survives re-renders but should NOT trigger a re-render when it changes (e.g. an interval id).',
    options: ['useRef', 'useState', 'useMemo', 'useReducer'],
    answer: 'useRef',
    why: 'useRef is a mutable box that persists across renders and never schedules a re-render when you change .current.',
    whyNot: {
      useState: 'Any setState triggers a re-render — the opposite of what you want for behind-the-scenes data.',
      useMemo: 'useMemo caches a derived value but is recomputed on dependency change; it is not a stable mutable container.',
      useReducer: 'Like useState, dispatching causes a re-render.',
    },
  },
  {
    id: 'siblings-share-state',
    scenario:
      'Two sibling components need to share and update the same piece of state.',
    options: ['Lift state up (useState in parent)', 'useRef in each sibling', 'Two separate useStates', 'useMemo'],
    answer: 'Lift state up (useState in parent)',
    why: 'Move the state to the closest common parent and pass it down as props (plus a setter). This "lifting state up" is how siblings stay in sync.',
    whyNot: {
      'useRef in each sibling': 'Separate refs are isolated and do not re-render; the siblings would never see each other’s updates.',
      'Two separate useStates': 'Two independent states would drift out of sync — there is no single source of truth.',
      useMemo: 'useMemo caches a computed value; it does not share mutable state between components.',
    },
  },
  {
    id: 'deep-theme',
    scenario:
      'You want to share a theme value across many deeply nested components without prop drilling.',
    options: ['useContext', 'Lift state up + props', 'useRef', 'useMemo'],
    answer: 'useContext',
    why: 'Context lets a Provider broadcast a value to an entire subtree; any descendant reads it with useContext — no props threaded through.',
    whyNot: {
      'Lift state up + props': 'Lifting + props works for nearby components but becomes prop drilling across many deep layers — exactly what Context avoids.',
      useRef: 'A ref is local to one component and does not propagate values down the tree.',
      useMemo: 'useMemo caches a value within one component; it does not distribute it to descendants.',
    },
  },
  {
    id: 'memo-callback',
    scenario:
      'You pass a callback to a React.memo child, but the child still re-renders every time because the function is recreated each render.',
    options: ['useCallback', 'useMemo', 'useRef', 'useEffect'],
    answer: 'useCallback',
    why: 'useCallback returns a stable function reference between renders (while its deps are unchanged), so the memoized child sees an unchanged prop and skips re-rendering.',
    whyNot: {
      useMemo: 'useMemo memoizes a value; useCallback(fn, deps) is the function-specific form (it equals useMemo(() => fn, deps)).',
      useRef: 'A ref could hold the function, but it would not update when its dependencies change, risking stale closures.',
      useEffect: 'useEffect runs side effects after render; it cannot stabilize a prop reference.',
    },
  },
  {
    id: 'skip-rerender',
    scenario:
      'A pure presentational child re-renders on every parent update even though its props never change. You want to skip that work.',
    options: ['React.memo', 'useMemo', 'useCallback', 'useRef'],
    answer: 'React.memo',
    why: 'React.memo wraps a component and skips re-rendering when its props are shallow-equal to the previous render.',
    whyNot: {
      useMemo: 'useMemo memoizes a value inside a component; it does not prevent a child component from re-rendering.',
      useCallback: 'useCallback stabilizes a function prop — useful as a complement, but it does not itself skip the child’s render.',
      useRef: 'Refs do not control whether a component re-renders.',
    },
  },
  {
    id: 'simple-toggle',
    scenario:
      'You need a simple boolean to open and close a modal in a single component.',
    options: ['useState', 'useReducer', 'useRef', 'useContext'],
    answer: 'useState',
    why: 'A single, simple piece of state with straightforward updates is exactly what useState is for.',
    whyNot: {
      useReducer: 'A reducer is overkill for one boolean with trivial toggling — reserve it for complex, multi-action state.',
      useRef: 'A ref would not re-render the UI when the boolean changes, so the modal would not show/hide.',
      useContext: 'Context is for sharing across components; this state is local to one component.',
    },
  },
  {
    id: 'measure-layout',
    scenario:
      'You must read an element’s measured size and synchronously adjust the DOM before the browser paints, to avoid a visible flicker.',
    options: ['useLayoutEffect', 'useEffect', 'useMemo', 'useRef'],
    answer: 'useLayoutEffect',
    why: 'useLayoutEffect fires synchronously after DOM mutations but BEFORE paint, so layout reads/writes happen without the user seeing a flicker.',
    whyNot: {
      useEffect: 'useEffect runs AFTER paint, so a layout adjustment there can cause a visible flash.',
      useMemo: 'useMemo runs during render and must not touch the DOM.',
      useRef: 'A ref grabs the node, but the timing guarantee (before paint) comes from useLayoutEffect.',
    },
  },
]
