// Concept Flashcards / Rapid-Fire Q&A bank.
//
// Each card: a real interview-style question, a model answer, and a likely
// follow-up the interviewer might ask next (trains discussion, not one-shot
// recall). The page adds simple spaced repetition (resurface "needs review").
export const flashcards = [
  {
    id: 'vdom',
    category: 'Core',
    question: 'What is the virtual DOM, and why does React use it?',
    answer:
      'The virtual DOM is a lightweight in-memory representation of the UI. On each render React builds a new tree, diffs it against the previous one, and applies only the minimal real-DOM changes. Direct DOM updates are slow and easy to get wrong; this lets you write declarative UI and let React handle efficient updates.',
    followUp: '“Is the virtual DOM always faster than direct DOM manipulation?” (No — it’s a productivity/consistency tradeoff; hand-tuned DOM can be faster, but VDOM is fast enough and far more maintainable.)',
  },
  {
    id: 'reconciliation',
    category: 'Core',
    question: 'What is reconciliation, at a high level?',
    answer:
      'Reconciliation is React’s diffing algorithm: it compares the new element tree with the previous one to decide what to update. It assumes elements of different types produce different trees, and uses keys to match list children across renders.',
    followUp: '“Why are keys important to reconciliation?” (They give list items stable identity so React updates/moves the right nodes instead of recreating them.)',
  },
  {
    id: 'state-vs-props',
    category: 'Core',
    question: 'What’s the difference between state and props?',
    answer:
      'Props are inputs passed into a component by its parent — read-only from the component’s perspective. State is data a component owns and can change over time; updating it triggers a re-render. Data flows down via props; state lives where it’s owned.',
    followUp: '“What if two components need the same state?” (Lift it to their closest common ancestor, or use Context.)',
  },
  {
    id: 'keys',
    category: 'Core',
    question: 'Why does React need a key when rendering lists, and what breaks if you get it wrong?',
    answer:
      'Keys give list items a stable identity so React can match them across renders and update/move/remove the right ones. Bad keys (especially array index on a reorderable list) make React reuse the wrong DOM nodes — causing wrong content, lost input focus, or stale uncontrolled values.',
    followUp: '“When is using the index acceptable?” (For static lists that never reorder, insert, or delete.)',
  },
  {
    id: 'controlled',
    category: 'Forms',
    question: 'Controlled vs uncontrolled components — the difference, and when to choose each?',
    answer:
      'A controlled input’s value comes from React state (value + onChange); React is the source of truth. An uncontrolled input keeps its value in the DOM, read via a ref. Prefer controlled for validation, conditional logic and resets; use uncontrolled for simple cases or integrating non-React code.',
    followUp: '“How would you read an uncontrolled input’s value?” (Attach a ref and read ref.current.value.)',
  },
  {
    id: 'effect-vs-layouteffect',
    category: 'Hooks',
    question: 'What’s the difference between useEffect and useLayoutEffect?',
    answer:
      'Both run after render, but useEffect runs asynchronously after the browser paints, while useLayoutEffect runs synchronously after DOM mutations and before paint. Use useLayoutEffect when you must measure or mutate layout before the user sees it (to avoid flicker); otherwise prefer useEffect.',
    followUp: '“Why prefer useEffect by default?” (useLayoutEffect blocks paint, so overusing it hurts performance.)',
  },
  {
    id: 'prop-drilling',
    category: 'Hooks',
    question: 'What is prop drilling, and how does Context address it (and when is Context the wrong tool)?',
    answer:
      'Prop drilling is passing props through many intermediate components that don’t use them, just to reach a deep consumer. Context lets a Provider broadcast a value so any descendant reads it directly. Context is the wrong tool for frequently-changing or localized state (it can cause broad re-renders) — props or a state library may fit better.',
    followUp: '“What’s a downside of Context for fast-changing values?” (Every consumer re-renders when the value changes.)',
  },
  {
    id: 'memo-vs-callback',
    category: 'Performance',
    question: 'What’s the difference between useMemo and useCallback?',
    answer:
      'useMemo caches a computed value and recomputes it only when dependencies change. useCallback caches a function reference. useCallback(fn, deps) is equivalent to useMemo(() => fn, deps). Use useMemo for expensive values; useCallback to keep a stable function for memoized children or effect deps.',
    followUp: '“When is useMemo NOT worth it?” (For cheap computations — the memo bookkeeping can cost more than it saves.)',
  },
  {
    id: 'reducer-vs-state',
    category: 'Hooks',
    question: 'When would you reach for useReducer instead of useState?',
    answer:
      'When state is complex (multiple related sub-values), when the next state depends on the previous, when there are many distinct actions, or when you want update logic centralized and testable in one pure reducer. For simple, independent values, useState is cleaner.',
    followUp: '“How do reducer + Context combine?” (Context distributes state + dispatch; the reducer centralizes transitions — a lightweight Redux.)',
  },
  {
    id: 'rules-of-hooks',
    category: 'Hooks',
    question: 'What are the Rules of Hooks, and why do they exist?',
    answer:
      'Only call hooks at the top level (not in loops, conditions, or nested functions), and only from React function components or other hooks. React tracks hook state by call order, so the order must be identical on every render — the rules guarantee that.',
    followUp: '“What breaks if you call a hook conditionally?” (The call order shifts between renders, so React associates state with the wrong hook.)',
  },
  {
    id: 'unnecessary-rerenders',
    category: 'Performance',
    question: 'What commonly causes unnecessary re-renders, and how would you diagnose/fix it?',
    answer:
      'A parent re-rendering re-renders children; new object/function props each render defeat memoization; context value changes re-render all consumers. Diagnose with the React DevTools Profiler. Fix with React.memo, useMemo/useCallback for stable props, splitting context, or moving state down.',
    followUp: '“Is wrapping everything in memo a good idea?” (No — memo has its own cost; optimize measured hotspots, not by default.)',
  },
  {
    id: 'react-memo',
    category: 'Performance',
    question: 'What does React.memo actually do, and when is it a premature optimization?',
    answer:
      'React.memo wraps a component and skips re-rendering when its props are shallow-equal to the previous render. It’s premature when the component is cheap to render, when props change every render anyway (new objects/functions), or before you’ve measured a real problem — it adds complexity and a comparison cost.',
    followUp: '“What often makes memo useless?” (Passing inline objects/functions as props — they’re new references each render.)',
  },
  {
    id: 'batching',
    category: 'Core',
    question: 'How does React batch state updates, and why does that matter?',
    answer:
      'React groups multiple state updates triggered in the same event (and, in React 18, in promises/timeouts too) into a single re-render. This avoids redundant renders. It matters because reading state right after setState gives the old value, and multiple setState calls reading the same value collapse — use the functional updater when the next value depends on the previous.',
    followUp: '“How do you ensure three increments in one handler all apply?” (setCount(c => c + 1) each time.)',
  },
  {
    id: 'error-boundary',
    category: 'Patterns',
    question: 'What can an Error Boundary catch, and what can’t it catch?',
    answer:
      'It catches errors thrown during rendering, in lifecycle methods, and in constructors of the tree below it, showing a fallback UI. It does NOT catch errors in event handlers, asynchronous code, server-side rendering, or in the boundary itself — use try/catch for those.',
    followUp: '“Can you write one with hooks?” (No — error boundaries still require a class with getDerivedStateFromError/componentDidCatch.)',
  },
  {
    id: 'mutation',
    category: 'Core',
    question: 'Why is directly mutating state a problem, even when the UI sometimes “seems” to update?',
    answer:
      'React detects changes by comparing references. Mutating an object/array keeps the same reference, so React may skip the re-render (or bail out of memo checks), leading to a stale UI. Even when something else triggers a render and it “appears” to work, it’s unreliable and breaks optimizations. Always create new references.',
    followUp: '“How do you update nested state immutably?” (Spread each level you change, or use a helper like Immer.)',
  },
  {
    id: 'composition',
    category: 'Patterns',
    question: 'Composition vs inheritance — why does React favor composition?',
    answer:
      'React composes behavior by combining components (children, props that are JSX, render props, custom hooks) rather than extending base classes. Composition is more flexible, avoids fragile class hierarchies, and matches React’s function-first model. The docs explicitly recommend it over inheritance.',
    followUp: '“How would you share non-visual logic between components?” (A custom hook — the modern alternative to HOCs/render props.)',
  },
]
