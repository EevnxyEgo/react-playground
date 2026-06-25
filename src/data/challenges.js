// Interview Challenge Library.
//
// Each challenge mirrors a real live-coding prompt: an interviewer-style brief
// (slightly open-ended on purpose), a deliberately minimal starter (harder than
// the v1 modules — not fill-in-the-blank), a reference solution, and a
// "what a strong candidate also considers" list (edge cases, a11y, hook choice).
//
// files/solution are Sandpack file maps. Async exercises simulate the network
// with setTimeout so they run offline and deterministically.

export const challengeCategories = [
  'Component-building classics',
  'Data & async patterns',
  'Forms',
  'Custom hooks',
  'Patterns',
]

const reactStarter = (body) => ({ '/App.js': body })

export const challenges = [
  // ---------------------------------------------------------------- classics
  {
    id: 'counter',
    category: 'Component-building classics',
    title: 'Counter',
    difficulty: 'Warm-up',
    brief: 'Build a counter with increment, decrement and reset buttons. The count should start at 0.',
    files: reactStarter(`export default function App() {
  // Build a counter: + , - , reset
  return <div style={{ fontFamily: "sans-serif", padding: 16 }}></div>;
}
`),
    solution: reactStarter(`import { useState } from "react";

export default function App() {
  const [count, setCount] = useState(0);
  return (
    <div style={{ fontFamily: "sans-serif", padding: 16 }}>
      <h2>{count}</h2>
      <button onClick={() => setCount((c) => c - 1)}>-</button>
      <button onClick={() => setCount((c) => c + 1)}>+</button>
      <button onClick={() => setCount(0)}>reset</button>
    </div>
  );
}
`),
    considers: [
      'Use the functional updater setCount(c => c + 1) so rapid clicks don’t drop updates.',
      'Should the counter clamp at a min/max? Ask the interviewer.',
      'Accessible labels on icon-only buttons (aria-label).',
    ],
  },
  {
    id: 'toggle',
    category: 'Component-building classics',
    title: 'Toggle / Show-Hide Panel',
    difficulty: 'Warm-up',
    brief: 'A button that shows and hides a panel of content. Button text should reflect the state.',
    files: reactStarter(`export default function App() {
  // Toggle a panel open/closed
  return <div style={{ fontFamily: "sans-serif", padding: 16 }}></div>;
}
`),
    solution: reactStarter(`import { useState } from "react";

export default function App() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ fontFamily: "sans-serif", padding: 16 }}>
      <button aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        {open ? "Hide" : "Show"} details
      </button>
      {open && <p>Here are the details. 👀</p>}
    </div>
  );
}
`),
    considers: [
      'aria-expanded on the trigger for screen readers.',
      'Conditional render (&&) vs CSS hiding — &&  removes from the DOM.',
      'Could this be a reusable <Disclosure> component?',
    ],
  },
  {
    id: 'star-rating',
    category: 'Component-building classics',
    title: 'Star Rating',
    difficulty: 'Easy',
    brief: 'A 5-star rating widget. Clicking a star sets the rating; hovering previews it.',
    files: reactStarter(`export default function App() {
  // 5 stars: click to set, hover to preview
  return <div style={{ fontFamily: "sans-serif", padding: 16 }}></div>;
}
`),
    solution: reactStarter(`import { useState } from "react";

export default function App() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  return (
    <div style={{ fontFamily: "sans-serif", padding: 16, fontSize: 28 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          role="button"
          aria-label={n + " stars"}
          style={{ cursor: "pointer", color: n <= (hover || rating) ? "#f59e0b" : "#cbd5e1" }}
          onClick={() => setRating(n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
        >
          ★
        </span>
      ))}
      <p style={{ fontSize: 14 }}>Rating: {rating}/5</p>
    </div>
  );
}
`),
    considers: [
      'Keyboard support: arrow keys / focusable stars for accessibility.',
      'Separate hover state from committed rating so leaving restores the choice.',
      'Make it controlled (value + onChange) so a parent can own the rating.',
    ],
  },
  {
    id: 'accordion',
    category: 'Component-building classics',
    title: 'Accordion / FAQ',
    difficulty: 'Easy',
    brief: 'A list of FAQ items; clicking one expands its answer. Only one item open at a time.',
    files: reactStarter(`const FAQ = [
  { q: "What is React?", a: "A UI library." },
  { q: "What is JSX?", a: "HTML-like syntax in JS." },
  { q: "What is a hook?", a: "A function to use React features." },
];

export default function App() {
  // Only one panel open at a time
  return <div style={{ fontFamily: "sans-serif", padding: 16 }}></div>;
}
`),
    solution: reactStarter(`import { useState } from "react";

const FAQ = [
  { q: "What is React?", a: "A UI library." },
  { q: "What is JSX?", a: "HTML-like syntax in JS." },
  { q: "What is a hook?", a: "A function to use React features." },
];

export default function App() {
  const [openIndex, setOpenIndex] = useState(null);
  return (
    <div style={{ fontFamily: "sans-serif", padding: 16 }}>
      {FAQ.map((item, i) => (
        <div key={i} style={{ borderBottom: "1px solid #ccc" }}>
          <button
            aria-expanded={openIndex === i}
            style={{ width: "100%", textAlign: "left", padding: 8 }}
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
          >
            {item.q}
          </button>
          {openIndex === i && <p style={{ padding: 8 }}>{item.a}</p>}
        </div>
      ))}
    </div>
  );
}
`),
    considers: [
      'Single source of truth (openIndex) enforces "one open at a time" — vs a boolean per item.',
      'aria-expanded + associating the panel with the button for a11y.',
      'Allow multiple-open mode? Then use a Set of open indexes.',
    ],
  },
  {
    id: 'tabs',
    category: 'Component-building classics',
    title: 'Tabs',
    difficulty: 'Easy',
    brief: 'A tab bar that switches between content panels. The active tab is visually highlighted.',
    files: reactStarter(`const TABS = ["Overview", "Specs", "Reviews"];

export default function App() {
  return <div style={{ fontFamily: "sans-serif", padding: 16 }}></div>;
}
`),
    solution: reactStarter(`import { useState } from "react";

const TABS = ["Overview", "Specs", "Reviews"];

export default function App() {
  const [active, setActive] = useState(0);
  return (
    <div style={{ fontFamily: "sans-serif", padding: 16 }}>
      <div role="tablist" style={{ display: "flex", gap: 8 }}>
        {TABS.map((t, i) => (
          <button
            key={t}
            role="tab"
            aria-selected={active === i}
            onClick={() => setActive(i)}
            style={{ fontWeight: active === i ? "bold" : "normal" }}
          >
            {t}
          </button>
        ))}
      </div>
      <div role="tabpanel" style={{ paddingTop: 12 }}>
        Content for {TABS[active]}
      </div>
    </div>
  );
}
`),
    considers: [
      'Active index in the parent so tabs + panel stay in sync.',
      'role="tab"/"tabpanel" + aria-selected; arrow-key navigation for full a11y.',
      'Could be generalized into compound components (see the Patterns challenge).',
    ],
  },
  {
    id: 'modal',
    category: 'Component-building classics',
    title: 'Modal / Dialog',
    difficulty: 'Medium',
    brief: 'A modal that opens via a button and closes on (a) the close button, (b) clicking the backdrop, and (c) pressing Escape.',
    files: reactStarter(`export default function App() {
  // Open a modal; close on button, backdrop click, and Escape key
  return <div style={{ fontFamily: "sans-serif", padding: 16 }}></div>;
}
`),
    solution: reactStarter(`import { useState, useEffect } from "react";

export default function App() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey); // cleanup!
  }, [open]);

  return (
    <div style={{ fontFamily: "sans-serif", padding: 16 }}>
      <button onClick={() => setOpen(true)}>Open modal</button>
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", display: "grid", placeItems: "center" }}
        >
          <div
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
            style={{ background: "#fff", padding: 24, borderRadius: 8 }}
          >
            <h3>Hello from the modal</h3>
            <button onClick={() => setOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
`),
    considers: [
      'stopPropagation on the dialog so inner clicks don’t hit the backdrop handler.',
      'Clean up the keydown listener in the effect return — or you leak listeners.',
      'Real-world: focus trap, return focus on close, role="dialog" + aria-modal, scroll lock, portal.',
    ],
  },
  {
    id: 'stopwatch',
    category: 'Component-building classics',
    title: 'Stopwatch',
    difficulty: 'Medium',
    brief: 'A stopwatch with Start, Pause and Reset. It counts up in tenths of a second while running.',
    files: reactStarter(`export default function App() {
  // Start / Pause / Reset stopwatch
  return <div style={{ fontFamily: "sans-serif", padding: 16 }}></div>;
}
`),
    solution: reactStarter(`import { useState, useRef, useEffect } from "react";

export default function App() {
  const [ms, setMs] = useState(0);
  const [running, setRunning] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!running) return;
    ref.current = setInterval(() => setMs((m) => m + 100), 100);
    return () => clearInterval(ref.current); // cleanup on pause/unmount
  }, [running]);

  return (
    <div style={{ fontFamily: "sans-serif", padding: 16 }}>
      <h2>{(ms / 1000).toFixed(1)}s</h2>
      <button onClick={() => setRunning(true)} disabled={running}>Start</button>
      <button onClick={() => setRunning(false)} disabled={!running}>Pause</button>
      <button onClick={() => { setRunning(false); setMs(0); }}>Reset</button>
    </div>
  );
}
`),
    considers: [
      'Store the interval id in a ref (it shouldn’t trigger re-renders).',
      'Functional updater inside the interval to avoid a stale closure on ms.',
      'For accuracy over long runs, prefer Date.now() deltas over accumulating +100.',
    ],
  },
  {
    id: 'digital-clock',
    category: 'Component-building classics',
    title: 'Digital Clock',
    difficulty: 'Easy',
    brief: 'A clock that displays the current time and updates every second.',
    files: reactStarter(`export default function App() {
  // Live-updating clock
  return <div style={{ fontFamily: "sans-serif", padding: 16 }}></div>;
}
`),
    solution: reactStarter(`import { useState, useEffect } from "react";

export default function App() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div style={{ fontFamily: "sans-serif", padding: 16, fontSize: 32 }}>
      {now.toLocaleTimeString()}
    </div>
  );
}
`),
    considers: [
      'Empty dependency array — set the interval up once on mount.',
      'Always clear the interval on unmount (cleanup).',
      'Drift: setInterval isn’t perfectly accurate; fine for a clock, not for timing.',
    ],
  },
  {
    id: 'todo-filter',
    category: 'Component-building classics',
    title: 'Todo List with Filters',
    difficulty: 'Medium',
    brief: 'A todo list: add, remove, toggle complete, and filter by all / active / completed.',
    files: reactStarter(`export default function App() {
  // add, remove, toggle, filter (all/active/completed)
  return <div style={{ fontFamily: "sans-serif", padding: 16 }}></div>;
}
`),
    solution: reactStarter(`import { useState } from "react";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [filter, setFilter] = useState("all");

  const add = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setTodos((t) => [...t, { id: Date.now(), text, done: false }]);
    setText("");
  };
  const toggle = (id) => setTodos((t) => t.map((x) => x.id === id ? { ...x, done: !x.done } : x));
  const remove = (id) => setTodos((t) => t.filter((x) => x.id !== id));
  const visible = todos.filter((t) => filter === "all" ? true : filter === "active" ? !t.done : t.done);

  return (
    <div style={{ fontFamily: "sans-serif", padding: 16 }}>
      <form onSubmit={add}>
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="New todo" />
        <button>Add</button>
      </form>
      <div>
        {["all", "active", "completed"].map((f) => (
          <button key={f} onClick={() => setFilter(f)} style={{ fontWeight: filter === f ? "bold" : "normal" }}>{f}</button>
        ))}
      </div>
      <ul>
        {visible.map((t) => (
          <li key={t.id}>
            <input type="checkbox" checked={t.done} onChange={() => toggle(t.id)} />
            <span style={{ textDecoration: t.done ? "line-through" : "none" }}>{t.text}</span>
            <button onClick={() => remove(t.id)}>✕</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
`),
    considers: [
      'Derive the filtered list during render — don’t store it as separate state.',
      'Immutable updates (map/filter/spread), never mutate the array in place.',
      'Stable keys (t.id, not the index) since items are added/removed.',
    ],
  },

  // ----------------------------------------------------------- data & async
  {
    id: 'fetch-on-mount',
    category: 'Data & async patterns',
    title: 'Fetch on Mount (loading/error/success)',
    difficulty: 'Medium',
    brief: 'Fetch a list of users when the component mounts and render explicit loading, error and success states.',
    files: reactStarter(`// A fake API (resolves after 800ms; ~20% of the time it fails)
function fakeApi() {
  return new Promise((res, rej) =>
    setTimeout(() => (Math.random() > 0.2 ? res(["Ada", "Linus", "Grace"]) : rej(new Error("Network error"))), 800)
  );
}

export default function App() {
  // Show loading, then error OR the list
  return <div style={{ fontFamily: "sans-serif", padding: 16 }}></div>;
}
`),
    solution: reactStarter(`import { useState, useEffect } from "react";

function fakeApi() {
  return new Promise((res, rej) =>
    setTimeout(() => (Math.random() > 0.2 ? res(["Ada", "Linus", "Grace"]) : rej(new Error("Network error"))), 800)
  );
}

export default function App() {
  const [status, setStatus] = useState("loading"); // loading | error | success
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    setStatus("loading");
    fakeApi()
      .then((d) => { if (active) { setData(d); setStatus("success"); } })
      .catch((e) => { if (active) { setError(e); setStatus("error"); } });
    return () => { active = false; }; // ignore late results after unmount
  }, []);

  if (status === "loading") return <p style={{ padding: 16 }}>Loading…</p>;
  if (status === "error") return <p style={{ padding: 16 }}>⚠️ {error.message}</p>;
  return (
    <ul style={{ fontFamily: "sans-serif", padding: 16 }}>
      {data.map((u) => <li key={u}>{u}</li>)}
    </ul>
  );
}
`),
    considers: [
      'Model the request as a status enum (loading/error/success), not a tangle of booleans.',
      'Guard against setting state after unmount (the `active` flag) — avoids warnings/races.',
      'Real apps: AbortController, retry, and an empty-state when data is [].',
    ],
  },
  {
    id: 'debounced-search',
    category: 'Data & async patterns',
    title: 'Debounced Search',
    difficulty: 'Medium',
    brief: 'A search input that only "calls the API" after the user stops typing for 400ms.',
    files: reactStarter(`export default function App() {
  // Only search after the user pauses typing
  return <div style={{ fontFamily: "sans-serif", padding: 16 }}></div>;
}
`),
    solution: reactStarter(`import { useState, useEffect } from "react";

export default function App() {
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");

  useEffect(() => {
    const id = setTimeout(() => setDebounced(query), 400);
    return () => clearTimeout(id); // reset the timer on every keystroke
  }, [query]);

  useEffect(() => {
    if (debounced) console.log("Searching API for:", debounced);
  }, [debounced]);

  return (
    <div style={{ fontFamily: "sans-serif", padding: 16 }}>
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search…" />
      <p>Debounced value: {debounced}</p>
      <small>Open the console — it only logs after you pause.</small>
    </div>
  );
}
`),
    considers: [
      'Clearing the timeout on each change is what debounces it.',
      'Extract this into a reusable useDebounce hook (see the custom-hook challenge).',
      'Cancel in-flight requests for the old query to avoid out-of-order results.',
    ],
  },
  {
    id: 'pagination',
    category: 'Data & async patterns',
    title: 'Client-side Pagination',
    difficulty: 'Medium',
    brief: 'Given an array of 50 items, show 10 per page with Previous/Next and a page indicator.',
    files: reactStarter(`const ITEMS = Array.from({ length: 50 }, (_, i) => "Item " + (i + 1));

export default function App() {
  return <div style={{ fontFamily: "sans-serif", padding: 16 }}></div>;
}
`),
    solution: reactStarter(`import { useState } from "react";

const ITEMS = Array.from({ length: 50 }, (_, i) => "Item " + (i + 1));
const PER_PAGE = 10;

export default function App() {
  const [page, setPage] = useState(0);
  const pages = Math.ceil(ITEMS.length / PER_PAGE);
  const slice = ITEMS.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  return (
    <div style={{ fontFamily: "sans-serif", padding: 16 }}>
      <ul>{slice.map((x) => <li key={x}>{x}</li>)}</ul>
      <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}>Prev</button>
      <span> Page {page + 1} / {pages} </span>
      <button onClick={() => setPage((p) => Math.min(pages - 1, p + 1))} disabled={page === pages - 1}>Next</button>
    </div>
  );
}
`),
    considers: [
      'Derive the visible slice from page state — don’t duplicate the data.',
      'Disable Prev/Next at the boundaries; clamp the page index.',
      'Server-side pagination instead would fetch per page (offset/limit or cursor).',
    ],
  },
  {
    id: 'load-more',
    category: 'Data & async patterns',
    title: 'Load More',
    difficulty: 'Medium',
    brief: 'Show 5 items initially with a "Load more" button that appends the next 5 until none remain.',
    files: reactStarter(`const ALL = Array.from({ length: 18 }, (_, i) => "Row " + (i + 1));

export default function App() {
  return <div style={{ fontFamily: "sans-serif", padding: 16 }}></div>;
}
`),
    solution: reactStarter(`import { useState } from "react";

const ALL = Array.from({ length: 18 }, (_, i) => "Row " + (i + 1));

export default function App() {
  const [count, setCount] = useState(5);
  const visible = ALL.slice(0, count);
  const done = count >= ALL.length;

  return (
    <div style={{ fontFamily: "sans-serif", padding: 16 }}>
      <ul>{visible.map((x) => <li key={x}>{x}</li>)}</ul>
      {done ? <p>That’s everything.</p> : (
        <button onClick={() => setCount((c) => Math.min(ALL.length, c + 5))}>Load more</button>
      )}
    </div>
  );
}
`),
    considers: [
      'Track how many to show, derive the slice — simplest correct model.',
      'Hide the button when all items are shown.',
      'True infinite scroll uses IntersectionObserver on a sentinel element.',
    ],
  },
  {
    id: 'shopping-cart',
    category: 'Data & async patterns',
    title: 'Shopping Cart (shared state)',
    difficulty: 'Hard',
    brief: 'A product list with “Add to cart”, a cart with quantity controls and a running total. State is shared between the list, the cart, and a header count.',
    files: reactStarter(`const PRODUCTS = [
  { id: 1, name: "Mug", price: 8 },
  { id: 2, name: "Shirt", price: 20 },
  { id: 3, name: "Sticker", price: 3 },
];

export default function App() {
  // add to cart, change quantity, show total + header count
  return <div style={{ fontFamily: "sans-serif", padding: 16 }}></div>;
}
`),
    solution: reactStarter(`import { useState } from "react";

const PRODUCTS = [
  { id: 1, name: "Mug", price: 8 },
  { id: 2, name: "Shirt", price: 20 },
  { id: 3, name: "Sticker", price: 3 },
];

export default function App() {
  // Cart state lives at the top so header, list and cart all share it.
  const [cart, setCart] = useState({}); // { [id]: qty }

  const add = (id) => setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const setQty = (id, qty) =>
    setCart((c) => {
      const next = { ...c };
      if (qty <= 0) delete next[id]; else next[id] = qty;
      return next;
    });

  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  const total = PRODUCTS.reduce((sum, p) => sum + (cart[p.id] || 0) * p.price, 0);

  return (
    <div style={{ fontFamily: "sans-serif", padding: 16 }}>
      <h3>🛒 Cart ({count})</h3>
      <ul>
        {PRODUCTS.map((p) => (
          <li key={p.id}>
            {p.name} – \${p.price} <button onClick={() => add(p.id)}>Add</button>
            {cart[p.id] > 0 && (
              <span> | qty:
                <button onClick={() => setQty(p.id, cart[p.id] - 1)}>-</button>
                {cart[p.id]}
                <button onClick={() => setQty(p.id, cart[p.id] + 1)}>+</button>
              </span>
            )}
          </li>
        ))}
      </ul>
      <strong>Total: \${total}</strong>
    </div>
  );
}
`),
    considers: [
      'Lift cart state to the common ancestor (or Context) so header/list/cart stay in sync.',
      'Derive count and total during render — don’t store them as separate state.',
      'Removing an item when qty hits 0; immutable object updates throughout.',
    ],
  },

  // ----------------------------------------------------------------- forms
  {
    id: 'validated-form',
    category: 'Forms',
    title: 'Validated Form',
    difficulty: 'Medium',
    brief: 'A signup form (name, email, password) with inline validation messages and a submit that’s disabled until valid.',
    files: reactStarter(`export default function App() {
  // controlled inputs + inline errors + disabled submit until valid
  return <div style={{ fontFamily: "sans-serif", padding: 16 }}></div>;
}
`),
    solution: reactStarter(`import { useState } from "react";

export default function App() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const errors = {
    name: form.name.trim() ? "" : "Name is required",
    email: /\\S+@\\S+\\.\\S+/.test(form.email) ? "" : "Valid email required",
    password: form.password.length >= 6 ? "" : "Min 6 characters",
  };
  const valid = Object.values(errors).every((e) => !e);
  const update = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  return (
    <form style={{ fontFamily: "sans-serif", padding: 16, display: "grid", gap: 8, maxWidth: 280 }}
      onSubmit={(e) => { e.preventDefault(); alert("Submitted!"); }}>
      {["name", "email", "password"].map((field) => (
        <div key={field}>
          <input name={field} value={form[field]} onChange={update} placeholder={field}
            type={field === "password" ? "password" : "text"} />
          {errors[field] && <div style={{ color: "crimson", fontSize: 12 }}>{errors[field]}</div>}
        </div>
      ))}
      <button disabled={!valid}>Sign up</button>
    </form>
  );
}
`),
    considers: [
      'Derive errors from state during render — no separate error state to keep in sync.',
      'Single change handler keyed by input name.',
      'UX: show errors after blur/touch, not while first typing; associate errors with inputs (aria-describedby).',
    ],
  },
  {
    id: 'multi-step-wizard',
    category: 'Forms',
    title: 'Multi-step Wizard',
    difficulty: 'Hard',
    brief: 'A 3-step form (account → profile → review) with Next/Back that preserves data between steps and shows a final summary.',
    files: reactStarter(`export default function App() {
  // step 1 -> 2 -> 3 (review), data preserved across steps
  return <div style={{ fontFamily: "sans-serif", padding: 16 }}></div>;
}
`),
    solution: reactStarter(`import { useState } from "react";

export default function App() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({ username: "", bio: "" });
  const set = (e) => setData((d) => ({ ...d, [e.target.name]: e.target.value }));

  return (
    <div style={{ fontFamily: "sans-serif", padding: 16, maxWidth: 320 }}>
      <p>Step {step + 1} of 3</p>
      {step === 0 && <input name="username" value={data.username} onChange={set} placeholder="Username" />}
      {step === 1 && <textarea name="bio" value={data.bio} onChange={set} placeholder="Bio" />}
      {step === 2 && (
        <pre style={{ background: "#eee", padding: 8 }}>{JSON.stringify(data, null, 2)}</pre>
      )}
      <div style={{ marginTop: 12 }}>
        <button disabled={step === 0} onClick={() => setStep((s) => s - 1)}>Back</button>
        {step < 2
          ? <button onClick={() => setStep((s) => s + 1)}>Next</button>
          : <button onClick={() => alert("Done!")}>Submit</button>}
      </div>
    </div>
  );
}
`),
    considers: [
      'Keep ALL step data in one state object at the top so it survives navigation.',
      'Per-step validation gating the Next button.',
      'Could model step transitions with useReducer if steps/branching grow.',
    ],
  },

  // ----------------------------------------------------------- custom hooks
  {
    id: 'use-debounce',
    category: 'Custom hooks',
    title: 'useDebounce',
    difficulty: 'Medium',
    brief: 'Write a useDebounce(value, delay) hook that returns the value only after it has stopped changing for `delay` ms, then use it.',
    files: {
      '/App.js': `import { useState } from "react";
// import { useDebounce } from "./useDebounce.js";  // <- write this

export default function App() {
  const [text, setText] = useState("");
  return (
    <div style={{ fontFamily: "sans-serif", padding: 16 }}>
      <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type…" />
    </div>
  );
}
`,
      '/useDebounce.js': `// Implement useDebounce(value, delay)
`,
    },
    solution: {
      '/App.js': `import { useState } from "react";
import { useDebounce } from "./useDebounce.js";

export default function App() {
  const [text, setText] = useState("");
  const debounced = useDebounce(text, 400);
  return (
    <div style={{ fontFamily: "sans-serif", padding: 16 }}>
      <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type…" />
      <p>Debounced: {debounced}</p>
    </div>
  );
}
`,
      '/useDebounce.js': `import { useState, useEffect } from "react";

export function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}
`,
    },
    considers: [
      'Clean up the timeout on every change (and on unmount).',
      'Include delay in the dependency array.',
      'Returns the debounced value — keep the hook focused and reusable.',
    ],
  },
  {
    id: 'use-fetch',
    category: 'Custom hooks',
    title: 'useFetch',
    difficulty: 'Hard',
    brief: 'Write a useFetch(fetcher) hook returning { data, loading, error }, handling re-fetch and ignoring stale results.',
    files: {
      '/App.js': `export default function App() {
  return <div style={{ fontFamily: "sans-serif", padding: 16 }}>Write useFetch in useFetch.js</div>;
}
`,
      '/useFetch.js': `// Implement useFetch(fetcher): { data, loading, error }
`,
    },
    solution: {
      '/App.js': `import { useFetch } from "./useFetch.js";

const fetcher = () => new Promise((res) => setTimeout(() => res({ msg: "Hello!" }), 700));

export default function App() {
  const { data, loading, error } = useFetch(fetcher);
  if (loading) return <p style={{ padding: 16 }}>Loading…</p>;
  if (error) return <p style={{ padding: 16 }}>Error: {error.message}</p>;
  return <pre style={{ padding: 16 }}>{JSON.stringify(data)}</pre>;
}
`,
      '/useFetch.js': `import { useState, useEffect } from "react";

export function useFetch(fetcher) {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  useEffect(() => {
    let active = true;
    setState({ data: null, loading: true, error: null });
    fetcher()
      .then((data) => active && setState({ data, loading: false, error: null }))
      .catch((error) => active && setState({ data: null, loading: false, error }));
    return () => { active = false; }; // ignore stale results
  }, [fetcher]);
  return state;
}
`,
    },
    considers: [
      'Guard against setting state after unmount / for a stale request (the active flag).',
      'Group data/loading/error so they update atomically.',
      'Beware: a new fetcher reference each render re-runs the effect — memoize it (useCallback).',
    ],
  },
  {
    id: 'use-localstorage',
    category: 'Custom hooks',
    title: 'useLocalStorage',
    difficulty: 'Medium',
    brief: 'Write useLocalStorage(key, initial) with the same API as useState, persisting to localStorage.',
    files: {
      '/App.js': `export default function App() {
  return <div style={{ fontFamily: "sans-serif", padding: 16 }}>Implement it in useLocalStorage.js</div>;
}
`,
      '/useLocalStorage.js': `// Implement useLocalStorage(key, initial)
`,
    },
    solution: {
      '/App.js': `import { useLocalStorage } from "./useLocalStorage.js";

export default function App() {
  const [name, setName] = useLocalStorage("name", "");
  return (
    <div style={{ fontFamily: "sans-serif", padding: 16 }}>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Type then refresh" />
      <p>Saved: {name}</p>
    </div>
  );
}
`,
      '/useLocalStorage.js': `import { useState, useEffect } from "react";

export function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved !== null ? JSON.parse(saved) : initial;
    } catch { return initial; }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  }, [key, value]);
  return [value, setValue];
}
`,
    },
    considers: [
      'Lazy initializer reads storage once, not on every render.',
      'Wrap JSON parse/stringify in try/catch (quota, private mode, bad data).',
      'Return [value, setValue] to mirror the useState API.',
    ],
  },
  {
    id: 'use-previous',
    category: 'Custom hooks',
    title: 'usePrevious',
    difficulty: 'Easy',
    brief: 'Write usePrevious(value) that returns the value from the previous render.',
    files: {
      '/App.js': `import { useState } from "react";
export default function App() {
  const [count, setCount] = useState(0);
  return (
    <div style={{ fontFamily: "sans-serif", padding: 16 }}>
      <p>Now: {count}</p>
      <button onClick={() => setCount((c) => c + 1)}>+1</button>
    </div>
  );
}
`,
      '/usePrevious.js': `// Implement usePrevious(value)
`,
    },
    solution: {
      '/App.js': `import { useState } from "react";
import { usePrevious } from "./usePrevious.js";

export default function App() {
  const [count, setCount] = useState(0);
  const prev = usePrevious(count);
  return (
    <div style={{ fontFamily: "sans-serif", padding: 16 }}>
      <p>Now: {count} — Before: {prev ?? "—"}</p>
      <button onClick={() => setCount((c) => c + 1)}>+1</button>
    </div>
  );
}
`,
      '/usePrevious.js': `import { useRef, useEffect } from "react";

export function usePrevious(value) {
  const ref = useRef();
  useEffect(() => { ref.current = value; }, [value]); // updates AFTER render
  return ref.current; // so this returns the previous render's value
}
`,
    },
    considers: [
      'A ref (not state) so reading the previous value doesn’t cause a re-render.',
      'Update the ref in an effect — it runs after render, so the read sees the prior value.',
      'Returns undefined on the first render (no previous value yet).',
    ],
  },
  {
    id: 'use-onclickoutside',
    category: 'Custom hooks',
    title: 'useOnClickOutside',
    difficulty: 'Medium',
    brief: 'Write useOnClickOutside(ref, handler) that calls handler when a click happens outside the referenced element (e.g. to close a dropdown).',
    files: {
      '/App.js': `import { useRef, useState } from "react";
export default function App() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  return (
    <div style={{ fontFamily: "sans-serif", padding: 16 }}>
      <button onClick={() => setOpen(true)}>Open</button>
      {open && <div ref={ref} style={{ border: "1px solid #ccc", padding: 12 }}>Click outside me</div>}
    </div>
  );
}
`,
      '/useOnClickOutside.js': `// Implement useOnClickOutside(ref, handler)
`,
    },
    solution: {
      '/App.js': `import { useRef, useState } from "react";
import { useOnClickOutside } from "./useOnClickOutside.js";

export default function App() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useOnClickOutside(ref, () => setOpen(false));
  return (
    <div style={{ fontFamily: "sans-serif", padding: 16 }}>
      <button onClick={() => setOpen(true)}>Open</button>
      {open && <div ref={ref} style={{ border: "1px solid #ccc", padding: 12 }}>Click outside me to close</div>}
    </div>
  );
}
`,
      '/useOnClickOutside.js': `import { useEffect } from "react";

export function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (e) => {
      if (!ref.current || ref.current.contains(e.target)) return;
      handler(e);
    };
    document.addEventListener("mousedown", listener);
    return () => document.removeEventListener("mousedown", listener);
  }, [ref, handler]);
}
`,
    },
    considers: [
      'Check ref.current.contains(target) to ignore clicks inside the element.',
      'Remove the listener on cleanup to avoid leaks/duplicates.',
      'mousedown (not click) avoids edge cases where the element unmounts before click fires.',
    ],
  },

  // -------------------------------------------------------------- patterns
  {
    id: 'compound-components',
    category: 'Patterns',
    title: 'Compound Components',
    difficulty: 'Hard',
    brief: 'Build a <Tabs> compound component used as <Tabs><Tabs.Tab/>…<Tabs.Panel/></Tabs>, sharing the active state via context.',
    files: {
      '/App.js': `export default function App() {
  return <div style={{ fontFamily: "sans-serif", padding: 16 }}>Build Tabs in Tabs.js</div>;
}
`,
      '/Tabs.js': `// Build a compound <Tabs> with Tabs.Tab and Tabs.Panel sharing context
`,
    },
    solution: {
      '/App.js': `import { Tabs } from "./Tabs.js";

export default function App() {
  return (
    <div style={{ fontFamily: "sans-serif", padding: 16 }}>
      <Tabs>
        <Tabs.List>
          <Tabs.Tab index={0}>One</Tabs.Tab>
          <Tabs.Tab index={1}>Two</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel index={0}>First panel</Tabs.Panel>
        <Tabs.Panel index={1}>Second panel</Tabs.Panel>
      </Tabs>
    </div>
  );
}
`,
      '/Tabs.js': `import { createContext, useContext, useState } from "react";

const TabsCtx = createContext(null);

export function Tabs({ children }) {
  const [active, setActive] = useState(0);
  return <TabsCtx.Provider value={{ active, setActive }}>{children}</TabsCtx.Provider>;
}
Tabs.List = ({ children }) => <div style={{ display: "flex", gap: 8 }}>{children}</div>;
Tabs.Tab = ({ index, children }) => {
  const { active, setActive } = useContext(TabsCtx);
  return (
    <button onClick={() => setActive(index)} style={{ fontWeight: active === index ? "bold" : "normal" }}>
      {children}
    </button>
  );
};
Tabs.Panel = ({ index, children }) => {
  const { active } = useContext(TabsCtx);
  return active === index ? <div style={{ paddingTop: 12 }}>{children}</div> : null;
};
`,
    },
    considers: [
      'Context shares the active index implicitly, so the consumer’s markup stays clean.',
      'Attaching sub-components (Tabs.Tab) gives a self-documenting API.',
      'Trade-off vs a simple props API: more flexible, but more moving parts.',
    ],
  },
  {
    id: 'render-props',
    category: 'Patterns',
    title: 'Render Props',
    difficulty: 'Medium',
    brief: 'Build a <MouseTracker> that tracks the cursor position and exposes it via a render-prop function child.',
    files: reactStarter(`export default function App() {
  // Build MouseTracker that calls children(position)
  return <div style={{ fontFamily: "sans-serif", padding: 16 }}></div>;
}
`),
    solution: reactStarter(`import { useState } from "react";

function MouseTracker({ children }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  return (
    <div
      onMouseMove={(e) => setPos({ x: e.clientX, y: e.clientY })}
      style={{ height: 160, border: "1px dashed #999" }}
    >
      {children(pos)}
    </div>
  );
}

export default function App() {
  return (
    <div style={{ fontFamily: "sans-serif", padding: 16 }}>
      <MouseTracker>
        {(pos) => <p>Mouse at {pos.x}, {pos.y}</p>}
      </MouseTracker>
    </div>
  );
}
`),
    considers: [
      'children is a FUNCTION here — the component owns behavior, the caller owns UI.',
      'Modern alternative: a custom hook (useMousePosition) is often cleaner than render props.',
      'Render props can cause extra nesting ("wrapper hell") — hooks usually win today.',
    ],
  },
]

export const challengesByCategory = challengeCategories.map((cat) => ({
  category: cat,
  items: challenges.filter((c) => c.category === cat),
}))
