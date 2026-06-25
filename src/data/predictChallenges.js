// Predict-the-Output bank.
//
// Trains code-READING. Each item shows a snippet, asks the user to predict the
// result/order BEFORE running it, then reveals the actual behavior in a live
// Sandpack preview + the mechanism behind it (batching, closures, effect timing,
// render vs commit).
//
// `answer` is the index into `options`. `files` is a runnable Sandpack map.

const run = (code) => ({ '/App.js': code })

export const predictChallenges = [
  {
    id: 'stale-batch',
    title: 'Three setState calls',
    code: `const [count, setCount] = useState(0);
function handle() {
  setCount(count + 1);
  setCount(count + 1);
  setCount(count + 1);
}
// click the button once — what is count?`,
    question: 'After clicking the button once, count is…',
    options: ['3', '1', '0', 'undefined'],
    answer: 1,
    explanation:
      'All three calls read the same `count` (0) from the current render’s closure, so they all compute 1. React batches them into a single update → count = 1.',
    files: run(`import { useState } from "react";
export default function App() {
  const [count, setCount] = useState(0);
  function handle() {
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
  }
  return (
    <div style={{ fontFamily: "sans-serif", padding: 16 }}>
      <p>count = {count}</p>
      <button onClick={handle}>+3?</button>
    </div>
  );
}
`),
  },
  {
    id: 'functional-batch',
    title: 'Three functional updaters',
    code: `setCount(c => c + 1);
setCount(c => c + 1);
setCount(c => c + 1);
// click once — what is count?`,
    question: 'After one click, count is…',
    options: ['1', '2', '3', '0'],
    answer: 2,
    explanation:
      'Each functional updater receives the latest queued value, so they chain: 0→1→2→3. Use this form when the next state depends on the previous.',
    files: run(`import { useState } from "react";
export default function App() {
  const [count, setCount] = useState(0);
  function handle() {
    setCount((c) => c + 1);
    setCount((c) => c + 1);
    setCount((c) => c + 1);
  }
  return (
    <div style={{ fontFamily: "sans-serif", padding: 16 }}>
      <p>count = {count}</p>
      <button onClick={handle}>+3</button>
    </div>
  );
}
`),
  },
  {
    id: 'render-vs-effect',
    title: 'Render log vs effect log',
    code: `console.log("A: render");
useEffect(() => {
  console.log("B: effect");
});
// what logs, in what order, on first mount?`,
    question: 'On first mount the console shows…',
    options: ['B then A', 'A then B', 'Only A', 'Only B'],
    answer: 1,
    explanation:
      'The render body runs first (logs A), React commits to the DOM, then effects run after paint (logs B). Render → commit → effect.',
    files: run(`import { useEffect } from "react";
export default function App() {
  console.log("A: render");
  useEffect(() => {
    console.log("B: effect");
  });
  return <p style={{ fontFamily: "sans-serif", padding: 16 }}>Check the console</p>;
}
`),
  },
  {
    id: 'async-state',
    title: 'Reading state right after setState',
    code: `const [n, setN] = useState(0);
function handle() {
  setN(5);
  console.log(n); // what prints?
}`,
    question: 'When you click, the console logs…',
    options: ['5', '0', 'undefined', 'It throws'],
    answer: 1,
    explanation:
      'setState does not mutate the variable synchronously. `n` is still the current render’s value (0) until the next render. The update is reflected on the re-render, not immediately.',
    files: run(`import { useState } from "react";
export default function App() {
  const [n, setN] = useState(0);
  function handle() {
    setN(5);
    console.log("n is", n);
  }
  return (
    <div style={{ fontFamily: "sans-serif", padding: 16 }}>
      <p>n = {n}</p>
      <button onClick={handle}>set to 5 + log</button>
    </div>
  );
}
`),
  },
  {
    id: 'child-parent-effect',
    title: 'Effect order: parent vs child',
    code: `// Parent renders <Child/>
// Parent effect logs "parent"
// Child effect logs "child"
// what order on mount?`,
    question: 'On mount the effects log…',
    options: ['parent, child', 'child, parent', 'parent only', 'child only'],
    answer: 1,
    explanation:
      'Children commit before parents, so child effects run before parent effects: "child" then "parent". (Render goes top-down; effects fire bottom-up.)',
    files: run(`import { useEffect } from "react";
function Child() {
  useEffect(() => console.log("child effect"));
  return <p>child</p>;
}
export default function App() {
  useEffect(() => console.log("parent effect"));
  return <div style={{ fontFamily: "sans-serif", padding: 16 }}><Child /></div>;
}
`),
  },
  {
    id: 'closure-loop',
    title: 'setTimeout in a loop',
    code: `for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// what logs?`,
    question: 'This logs…',
    options: ['0 1 2', '3 3 3', '1 2 3', '0 0 0'],
    answer: 0,
    explanation:
      '`let` is block-scoped, so each iteration captures its own `i`: 0, 1, 2. (With `var` it would be 3 3 3, because var is function-scoped and shared.)',
    files: run(`export default function App() {
  for (let i = 0; i < 3; i++) {
    setTimeout(() => console.log(i), 100);
  }
  return <p style={{ fontFamily: "sans-serif", padding: 16 }}>Check the console</p>;
}
`),
  },
  {
    id: 'var-loop',
    title: 'setTimeout in a loop (var)',
    code: `for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// what logs?`,
    question: 'With `var`, this logs…',
    options: ['0 1 2', '3 3 3', '0 0 0', '1 2 3'],
    answer: 1,
    explanation:
      '`var` is function-scoped, so all three closures share the SAME `i`. By the time the timeouts fire, the loop has finished and i === 3 → "3 3 3".',
    files: run(`export default function App() {
  for (var i = 0; i < 3; i++) {
    setTimeout(() => console.log(i), 100);
  }
  return <p style={{ fontFamily: "sans-serif", padding: 16 }}>Check the console</p>;
}
`),
  },
  {
    id: 'key-remount',
    title: 'Changing key resets state',
    code: `// <Counter key={id} /> where id toggles
// Counter has its own useState count
// after incrementing then changing id, count is?`,
    question: 'Changing the component’s key after incrementing makes count…',
    options: ['keep its value', 'reset to 0', 'become NaN', 'throw'],
    answer: 1,
    explanation:
      'Changing a component’s key tells React it’s a different instance, so it unmounts the old one and mounts a fresh one — local state resets to its initial value.',
    files: run(`import { useState } from "react";
function Counter() {
  const [c, setC] = useState(0);
  return <button onClick={() => setC(c + 1)}>count {c}</button>;
}
export default function App() {
  const [id, setId] = useState(0);
  return (
    <div style={{ fontFamily: "sans-serif", padding: 16 }}>
      <Counter key={id} />
      <button onClick={() => setId((x) => x + 1)} style={{ marginLeft: 8 }}>
        change key (remount)
      </button>
    </div>
  );
}
`),
  },
  {
    id: 'zero-render',
    title: 'Rendering with &&',
    code: `const items = [];
return <div>{items.length && <List/>}</div>;
// what appears?`,
    question: 'On screen you see…',
    options: ['nothing', 'the number 0', 'the List', 'an error'],
    answer: 1,
    explanation:
      '`items.length` is 0 (falsy), and && returns that 0, which React renders as the text "0". Use `items.length > 0 && …` or a ternary.',
    files: run(`export default function App() {
  const items = [];
  return (
    <div style={{ fontFamily: "sans-serif", padding: 16 }}>
      Result: [{items.length && <span>list</span>}]
    </div>
  );
}
`),
  },
  {
    id: 'cleanup-order',
    title: 'Effect cleanup order',
    code: `useEffect(() => {
  console.log("run", v);
  return () => console.log("cleanup", v);
}, [v]);
// v goes 0 -> 1. what logs on the update?`,
    question: 'When v changes from 0 to 1, the logs are…',
    options: ['run 1', 'cleanup 0, run 1', 'run 1, cleanup 0', 'cleanup 1, run 1'],
    answer: 1,
    explanation:
      'Before re-running an effect, React runs the PREVIOUS cleanup. So you get "cleanup 0" (old) then "run 1" (new). Same order on unmount (cleanup only).',
    files: run(`import { useState, useEffect } from "react";
export default function App() {
  const [v, setV] = useState(0);
  useEffect(() => {
    console.log("run", v);
    return () => console.log("cleanup", v);
  }, [v]);
  return (
    <div style={{ fontFamily: "sans-serif", padding: 16 }}>
      <p>v = {v}</p>
      <button onClick={() => setV(1)}>set v = 1</button>
    </div>
  );
}
`),
  },
  {
    id: 'derived-state',
    title: 'Derived value during render',
    code: `const [first] = useState("Ada");
const [last] = useState("Lovelace");
const full = first + " " + last;
// is \`full\` always in sync?`,
    question: 'The derived `full` value is…',
    options: [
      'always correct, recomputed each render',
      'stale until you call setState',
      'only updated inside useEffect',
      'cached forever',
    ],
    answer: 0,
    explanation:
      'Values computed during render from current state/props are always up to date — they’re recalculated every render. You usually don’t need extra state for derived data.',
    files: run(`import { useState } from "react";
export default function App() {
  const [first, setFirst] = useState("Ada");
  const [last] = useState("Lovelace");
  const full = first + " " + last; // derived, no extra state
  return (
    <div style={{ fontFamily: "sans-serif", padding: 16 }}>
      <p>{full}</p>
      <button onClick={() => setFirst("Grace")}>rename</button>
    </div>
  );
}
`),
  },
  {
    id: 'object-identity',
    title: 'New object prop each render',
    code: `<Child style={{ color: "red" }} />
// Child is wrapped in React.memo.
// does memo skip re-renders here?`,
    question: 'With an inline object prop, React.memo…',
    options: [
      'skips re-renders (props look equal)',
      're-renders every time (new object each render)',
      'throws an error',
      'renders only once',
    ],
    answer: 1,
    explanation:
      'The inline {{color:"red"}} is a brand-new object reference every render, so memo’s shallow comparison always sees a "changed" prop and re-renders. Memoize the object (useMemo) or hoist it.',
    files: run(`import { memo, useState } from "react";
const Child = memo(function Child({ style }) {
  console.log("Child render");
  return <p style={style}>child (see console)</p>;
});
export default function App() {
  const [, force] = useState(0);
  return (
    <div style={{ fontFamily: "sans-serif", padding: 16 }}>
      <button onClick={() => force((n) => n + 1)}>re-render parent</button>
      <Child style={{ color: "red" }} />
    </div>
  );
}
`),
  },
]
