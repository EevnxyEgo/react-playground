// Debugging Gauntlet bank — the 9 classic React bugs.
//
// Each entry ships a `broken` Sandpack app that genuinely misbehaves, plus the
// `fixed` reference. The `symptom` tells the learner what to look for; the
// `explanation` + `pattern` make the lesson generalize beyond this snippet.
//
// Note: the infinite-loop cases are self-limiting — React throws "Maximum update
// depth exceeded" / "Too many re-renders", so they error out instead of hanging.

const one = (code) => ({ '/App.js': code })

export const debugBugs = [
  {
    id: 'stale-closure',
    title: 'Stale Closure in an Interval',
    bugType: 'Stale closure',
    difficulty: 'Hard',
    symptom: 'The interval always logs 0, even though the visible count goes up. Open the console.',
    broken: one(`import { useState, useEffect } from "react";

export default function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      console.log("count is", count); // 🐞 always logs 0
    }, 1000);
    return () => clearInterval(id);
  }, []); // empty deps -> this closure captured count = 0 forever

  return (
    <div style={{ fontFamily: "sans-serif", padding: 16 }}>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  );
}
`),
    fixed: one(`import { useState, useEffect, useRef } from "react";

export default function App() {
  const [count, setCount] = useState(0);
  const latest = useRef(count);
  latest.current = count; // always points at the freshest value

  useEffect(() => {
    const id = setInterval(() => {
      console.log("count is", latest.current); // ✅ reads the latest value
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ fontFamily: "sans-serif", padding: 16 }}>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  );
}
`),
    explanation:
      'The effect ran once on mount, so its callback closed over count = 0 permanently. The interval keeps using that stale snapshot.',
    pattern:
      'When a long-lived callback needs the latest value, either add the value to the dependency array (re-subscribing) or read it through a ref that you keep updated.',
  },
  {
    id: 'effect-infinite-loop',
    title: 'useEffect Infinite Loop',
    bugType: 'Missing/incorrect deps',
    difficulty: 'Medium',
    symptom: 'The number explodes / React throws "Maximum update depth exceeded" — the effect runs every render.',
    broken: one(`import { useState, useEffect } from "react";

export default function App() {
  const [n, setN] = useState(0);

  useEffect(() => {
    setN(n + 1); // 🐞 no dependency array -> runs after EVERY render -> loop
  });

  return <p style={{ fontFamily: "sans-serif", padding: 16 }}>n = {n}</p>;
}
`),
    fixed: one(`import { useState, useEffect } from "react";

export default function App() {
  const [n, setN] = useState(0);

  useEffect(() => {
    setN(1); // ✅ runs once on mount thanks to the [] dependency array
  }, []);

  return <p style={{ fontFamily: "sans-serif", padding: 16 }}>n = {n}</p>;
}
`),
    explanation:
      'Without a dependency array the effect runs after every render. Setting state triggers a render, which re-runs the effect, which sets state… forever.',
    pattern:
      'Give every effect a dependency array describing exactly what it depends on. If it should run once, use []. Never update state unconditionally in an effect that lacks deps.',
  },
  {
    id: 'state-mutation',
    title: 'Mutating State Directly',
    bugType: 'Direct state mutation',
    difficulty: 'Medium',
    symptom: 'Clicking "Add" does nothing visible — the list never re-renders.',
    broken: one(`import { useState } from "react";

export default function App() {
  const [list, setList] = useState(["Apple"]);

  const add = () => {
    list.push("Banana"); // 🐞 mutates the SAME array reference
    setList(list);        // same reference -> React bails out, no re-render
  };

  return (
    <div style={{ fontFamily: "sans-serif", padding: 16 }}>
      <button onClick={add}>Add</button>
      <ul>{list.map((x, i) => <li key={i}>{x}</li>)}</ul>
    </div>
  );
}
`),
    fixed: one(`import { useState } from "react";

export default function App() {
  const [list, setList] = useState(["Apple"]);

  const add = () => {
    setList((prev) => [...prev, "Banana"]); // ✅ new array reference
  };

  return (
    <div style={{ fontFamily: "sans-serif", padding: 16 }}>
      <button onClick={add}>Add</button>
      <ul>{list.map((x, i) => <li key={i}>{x}</li>)}</ul>
    </div>
  );
}
`),
    explanation:
      'React decides whether to re-render by comparing references. Mutating the array and passing the same reference looks "unchanged", so React skips the update.',
    pattern:
      'Treat state as immutable. Always create a new array/object ([...arr], {...obj}) instead of mutating the existing one.',
  },
  {
    id: 'missing-key',
    title: 'Missing key in a List',
    bugType: 'Missing key',
    difficulty: 'Easy',
    symptom: 'A console warning: "Each child in a list should have a unique key prop."',
    broken: one(`export default function App() {
  const fruits = ["Apple", "Banana", "Cherry"];
  return (
    <ul style={{ fontFamily: "sans-serif", padding: 16 }}>
      {fruits.map((f) => (
        <li>{f}</li>  /* 🐞 no key */
      ))}
    </ul>
  );
}
`),
    fixed: one(`export default function App() {
  const fruits = [
    { id: 1, name: "Apple" },
    { id: 2, name: "Banana" },
    { id: 3, name: "Cherry" },
  ];
  return (
    <ul style={{ fontFamily: "sans-serif", padding: 16 }}>
      {fruits.map((f) => (
        <li key={f.id}>{f.name}</li>  /* ✅ stable unique key */
      ))}
    </ul>
  );
}
`),
    explanation:
      'Keys give list items a stable identity so React can match them across renders. Without keys React falls back to index matching and warns.',
    pattern:
      'Always provide a stable, unique key (an id from your data) for elements rendered from an array.',
  },
  {
    id: 'index-key',
    title: 'Index as Key in a Reorderable List',
    bugType: 'Index as key',
    difficulty: 'Hard',
    symptom: 'Type into the boxes, then click "Remove first" — your text sticks to the wrong row.',
    broken: one(`import { useState } from "react";

const INITIAL = [
  { id: "a", label: "Apple" },
  { id: "b", label: "Banana" },
  { id: "c", label: "Cherry" },
];

export default function App() {
  const [items, setItems] = useState(INITIAL);
  return (
    <div style={{ fontFamily: "sans-serif", padding: 16 }}>
      <button onClick={() => setItems((x) => x.slice(1))}>Remove first</button>
      {items.map((item, index) => (
        <div key={index}> {/* 🐞 index key */}
          {item.label}: <input placeholder="type here" />
        </div>
      ))}
    </div>
  );
}
`),
    fixed: one(`import { useState } from "react";

const INITIAL = [
  { id: "a", label: "Apple" },
  { id: "b", label: "Banana" },
  { id: "c", label: "Cherry" },
];

export default function App() {
  const [items, setItems] = useState(INITIAL);
  return (
    <div style={{ fontFamily: "sans-serif", padding: 16 }}>
      <button onClick={() => setItems((x) => x.slice(1))}>Remove first</button>
      {items.map((item) => (
        <div key={item.id}> {/* ✅ stable id key */}
          {item.label}: <input placeholder="type here" />
        </div>
      ))}
    </div>
  );
}
`),
    explanation:
      'With index keys, removing the first item shifts every index, so React reuses the DOM nodes (and their uncontrolled input text) for different items.',
    pattern:
      'Never use the array index as a key when the list can reorder, insert, or delete. Use a stable id tied to the data.',
  },
  {
    id: 'batching-updater',
    title: 'Lost Updates (no functional updater)',
    bugType: 'Batching gotcha',
    difficulty: 'Medium',
    symptom: 'The "+3" button only adds 1 each click.',
    broken: one(`import { useState } from "react";

export default function App() {
  const [count, setCount] = useState(0);

  const addThree = () => {
    setCount(count + 1); // 🐞 all three read the SAME stale count
    setCount(count + 1);
    setCount(count + 1);
  };

  return (
    <div style={{ fontFamily: "sans-serif", padding: 16 }}>
      <p>Count: {count}</p>
      <button onClick={addThree}>+3</button>
    </div>
  );
}
`),
    fixed: one(`import { useState } from "react";

export default function App() {
  const [count, setCount] = useState(0);

  const addThree = () => {
    setCount((c) => c + 1); // ✅ each builds on the previous queued value
    setCount((c) => c + 1);
    setCount((c) => c + 1);
  };

  return (
    <div style={{ fontFamily: "sans-serif", padding: 16 }}>
      <p>Count: {count}</p>
      <button onClick={addThree}>+3</button>
    </div>
  );
}
`),
    explanation:
      'React batches the three updates in one render. All three read the same count value from the current closure, so they all compute the same result.',
    pattern:
      'When the next state depends on the previous, use the functional updater form: setState(prev => …).',
  },
  {
    id: 'setstate-in-render',
    title: 'setState During Render',
    bugType: 'Infinite render loop',
    difficulty: 'Easy',
    symptom: 'React throws "Too many re-renders".',
    broken: one(`import { useState } from "react";

export default function App() {
  const [n, setN] = useState(0);

  setN(n + 1); // 🐞 called during render -> re-render -> render -> loop

  return <p style={{ fontFamily: "sans-serif", padding: 16 }}>n = {n}</p>;
}
`),
    fixed: one(`import { useState } from "react";

export default function App() {
  const [n, setN] = useState(0);

  // ✅ state changes belong in event handlers or effects, never in render
  return (
    <div style={{ fontFamily: "sans-serif", padding: 16 }}>
      <p>n = {n}</p>
      <button onClick={() => setN(n + 1)}>+1</button>
    </div>
  );
}
`),
    explanation:
      'Calling a state setter during render schedules another render immediately, which renders again… React detects the runaway loop and throws.',
    pattern:
      'Never call setState in the render body. Put state updates in event handlers, or in useEffect if they must happen after render.',
  },
  {
    id: 'missing-cleanup',
    title: 'Missing Effect Cleanup',
    bugType: 'No cleanup / leak',
    difficulty: 'Medium',
    symptom: 'The counter speeds up over time — new intervals stack up because none are cleared.',
    broken: one(`import { useState, useEffect } from "react";

export default function App() {
  const [n, setN] = useState(0);

  useEffect(() => {
    setInterval(() => setN((x) => x + 1), 1000);
    // 🐞 no deps + no cleanup -> a new interval every render, none cleared
  });

  return <p style={{ fontFamily: "sans-serif", padding: 16 }}>Ticks: {n}</p>;
}
`),
    fixed: one(`import { useState, useEffect } from "react";

export default function App() {
  const [n, setN] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setN((x) => x + 1), 1000);
    return () => clearInterval(id); // ✅ cleanup
  }, []); // ✅ set up once

  return <p style={{ fontFamily: "sans-serif", padding: 16 }}>Ticks: {n}</p>;
}
`),
    explanation:
      'With no dependency array the effect runs on every render, each time starting another interval; with no cleanup the old ones keep firing and stack up.',
    pattern:
      'Anything ongoing (intervals, listeners, subscriptions) must be torn down in the effect’s cleanup return, and the deps array must be correct.',
  },
  {
    id: 'fetch-race',
    title: 'Data-Fetch Race Condition',
    bugType: 'Race condition',
    difficulty: 'Hard',
    symptom: 'Type quickly (e.g. "abc"): a slower earlier request can resolve last and show results for the wrong query.',
    broken: one(`import { useState, useEffect } from "react";

// Fake API: random latency so older requests can finish AFTER newer ones.
const search = (q) => new Promise((res) =>
  setTimeout(() => res(q + " results"), 200 + Math.random() * 800)
);

export default function App() {
  const [q, setQ] = useState("");
  const [result, setResult] = useState("");

  useEffect(() => {
    if (!q) return;
    search(q).then(setResult); // 🐞 no guard -> stale response can win
  }, [q]);

  return (
    <div style={{ fontFamily: "sans-serif", padding: 16 }}>
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" />
      <p>Showing: {result}</p>
    </div>
  );
}
`),
    fixed: one(`import { useState, useEffect } from "react";

const search = (q) => new Promise((res) =>
  setTimeout(() => res(q + " results"), 200 + Math.random() * 800)
);

export default function App() {
  const [q, setQ] = useState("");
  const [result, setResult] = useState("");

  useEffect(() => {
    if (!q) return;
    let active = true;
    search(q).then((r) => { if (active) setResult(r); }); // ✅ ignore stale
    return () => { active = false; };
  }, [q]);

  return (
    <div style={{ fontFamily: "sans-serif", padding: 16 }}>
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" />
      <p>Showing: {result}</p>
    </div>
  );
}
`),
    explanation:
      'Requests can resolve out of order. Without a guard, a slow earlier request can call setResult after a newer one, leaving stale data on screen.',
    pattern:
      'Make effects cancellable: flip an `active` flag (or use AbortController) in the cleanup so responses from superseded requests are ignored.',
  },
]
