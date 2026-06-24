import { Trophy, BookOpen, Code2, Target, Sparkles, CheckCircle2 } from 'lucide-react'
import { Section, Hook, Prose, KeyIdea, Code } from '../../components/learning/Section'
import { CodePlayground } from '../../components/learning/CodePlayground'
import { Challenge } from '../../components/learning/Challenge'
import { Quiz } from '../../components/learning/Quiz'

/*
 * Module 18 — Final Project: Todo App.
 * The capstone: state, list+keys, controlled form, conditional rendering,
 * useEffect persistence and a custom hook all in one. Starter is a working
 * (in-memory) todo app; the solution adds localStorage + filters.
 */

const STARTER = {
  '/App.js': `import { useState } from "react";
import TodoItem from "./TodoItem.js";

export default function App() {
  // 🧠 State: the list of todos + the controlled input value
  const [todos, setTodos] = useState([
    { id: 1, text: "Learn React fundamentals", done: true },
    { id: 2, text: "Build the final project", done: false },
  ]);
  const [text, setText] = useState("");

  // ➕ Add (forms + immutable state update)
  function addTodo(e) {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;
    setTodos((prev) => [...prev, { id: Date.now(), text: value, done: false }]);
    setText("");
  }

  // ✅ Toggle + 🗑️ delete (update by id)
  const toggle = (id) =>
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  const remove = (id) => setTodos((prev) => prev.filter((t) => t.id !== id));

  const remaining = todos.filter((t) => !t.done).length;

  return (
    <div style={{ fontFamily: "sans-serif", padding: 16, maxWidth: 420 }}>
      <h2>📝 My Todos</h2>

      {/* Controlled form */}
      <form onSubmit={addTodo} style={{ display: "flex", gap: 8 }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What needs doing?"
          style={{ flex: 1, padding: 6 }}
        />
        <button type="submit">Add</button>
      </form>

      {/* List + keys, with conditional empty state */}
      {todos.length === 0 ? (
        <p>🎉 Nothing to do!</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {todos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} onToggle={toggle} onDelete={remove} />
          ))}
        </ul>
      )}

      <p>{remaining} item(s) left</p>
    </div>
  );
}
`,
  '/TodoItem.js': `// A small presentational component — receives props, renders one row.
export default function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <li style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0" }}>
      <input type="checkbox" checked={todo.done} onChange={() => onToggle(todo.id)} />
      <span style={{ flex: 1, textDecoration: todo.done ? "line-through" : "none" }}>
        {todo.text}
      </span>
      <button onClick={() => onDelete(todo.id)}>✕</button>
    </li>
  );
}
`,
}

const SOLUTION = {
  '/App.js': `import { useState } from "react";
import TodoItem from "./TodoItem.js";
import { useLocalStorage } from "./useLocalStorage.js";

export default function App() {
  // 💾 Persisted with a CUSTOM HOOK (state + useEffect under the hood)
  const [todos, setTodos] = useLocalStorage("todos", [
    { id: 1, text: "Learn React fundamentals", done: true },
    { id: 2, text: "Build the final project", done: false },
  ]);
  const [text, setText] = useState("");
  const [filter, setFilter] = useState("all"); // all | active | done

  function addTodo(e) {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;
    setTodos((prev) => [...prev, { id: Date.now(), text: value, done: false }]);
    setText("");
  }
  const toggle = (id) =>
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  const remove = (id) => setTodos((prev) => prev.filter((t) => t.id !== id));
  const clearDone = () => setTodos((prev) => prev.filter((t) => !t.done));

  // 🔀 Conditional rendering via a derived, filtered list
  const visible = todos.filter((t) =>
    filter === "all" ? true : filter === "active" ? !t.done : t.done
  );
  const remaining = todos.filter((t) => !t.done).length;

  return (
    <div style={{ fontFamily: "sans-serif", padding: 16, maxWidth: 420 }}>
      <h2>📝 My Todos</h2>

      <form onSubmit={addTodo} style={{ display: "flex", gap: 8 }}>
        <input value={text} onChange={(e) => setText(e.target.value)}
          placeholder="What needs doing?" style={{ flex: 1, padding: 6 }} />
        <button type="submit">Add</button>
      </form>

      <div style={{ display: "flex", gap: 8, margin: "8px 0" }}>
        {["all", "active", "done"].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ fontWeight: filter === f ? "bold" : "normal" }}>
            {f}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p>Nothing here.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {visible.map((todo) => (
            <TodoItem key={todo.id} todo={todo} onToggle={toggle} onDelete={remove} />
          ))}
        </ul>
      )}

      <p>{remaining} left · <button onClick={clearDone}>Clear done</button></p>
      <small>Refresh the preview — your todos persist! 💾</small>
    </div>
  );
}
`,
  '/useLocalStorage.js': `import { useState, useEffect } from "react";

// Custom hook: same API as useState, but synced to localStorage.
export function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved !== null ? JSON.parse(saved) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
`,
  '/TodoItem.js': STARTER['/TodoItem.js'],
}

export default function FinalProjectModule() {
  const concepts = [
    'useState — todos & input',
    'Lists & keys — .map() with key',
    'Forms — controlled input',
    'Events — onClick/onChange/onSubmit',
    'Conditional rendering — empty state & filters',
    'Props — TodoItem receives data + callbacks',
    'useEffect — persist to localStorage',
    'Custom hook — useLocalStorage',
  ]
  return (
    <>
      <Section icon={Trophy} title="The boss level" step="Capstone">
        <Hook>
          You've learned the pieces one by one. Now assemble them into a real,
          working app — the project every React dev builds first: a Todo app.
        </Hook>
        <Prose>
          <p>
            This isn't a toy snippet — it's a complete little application that uses{' '}
            <strong>almost everything</strong> from the course at once. Read it,
            run it, break it, extend it.
          </p>
        </Prose>
      </Section>

      <Section icon={BookOpen} title="What's inside" step="Concepts combined">
        <div className="grid gap-2 sm:grid-cols-2">
          {concepts.map((c) => (
            <div key={c} className="flex items-center gap-2 rounded-lg border border-white/10 bg-surface-900 p-2.5 text-sm text-slate-300">
              <CheckCircle2 size={15} className="shrink-0 text-emerald-400" />
              {c}
            </div>
          ))}
        </div>
        <KeyIdea title="Read the solution">
          The starter is a fully working in-memory todo app. Click{' '}
          <strong>Show Solution</strong> to see the upgraded version with{' '}
          <Code>localStorage</Code> persistence (via a custom hook) and{' '}
          all/active/done filters.
        </KeyIdea>
      </Section>

      <Section icon={Code2} title="The Todo App" step="Playground">
        <CodePlayground
          title="Final project — Todo App"
          files={STARTER}
          solution={SOLUTION}
          editorHeight={460}
        />
      </Section>

      <Section icon={Target} title="Your turn" step="Challenge">
        <Challenge
          task={
            <>
              Starting from the in-memory version, make the todos{' '}
              <strong>persist across refreshes</strong> with a{' '}
              <Code>useLocalStorage</Code> custom hook, then add{' '}
              <strong>all / active / done</strong> filter buttons. (The solution
              shows one way — try it yourself first!)
            </>
          }
          checklist={[
            'A useLocalStorage custom hook exists and is used for todos',
            'Todos survive a preview refresh',
            'Filter buttons (all/active/done) change the visible list',
            'A "clear done" action removes completed todos',
            'Everything still adds/toggles/deletes correctly',
          ]}
          hint="Swap useState('todos') for useLocalStorage('todos', initial). For filters, derive a `visible` array from todos based on a filter state, and map over `visible` instead of `todos`."
        />
      </Section>

      <Section icon={Sparkles} title="Final quiz" step="Graduation">
        <Quiz
          questions={[
            {
              id: 'q1',
              question: 'How are todos persisted across page refreshes here?',
              options: [
                'They’re sent to a backend server',
                'A useEffect writes them to localStorage (wrapped in a custom hook)',
                'React saves state automatically',
                'They aren’t — refresh clears them',
              ],
              answer: 1,
              explanation:
                'useLocalStorage uses useEffect to mirror state into localStorage, so it survives refreshes.',
            },
            {
              id: 'q2',
              question: 'Why give each <TodoItem> a `key={todo.id}`?',
              options: [
                'To style each item',
                'So React can track item identity for correct updates/removals',
                'It’s optional and only silences a warning',
                'To sort the list',
              ],
              answer: 1,
              explanation:
                'Stable keys let React update, reorder and remove the right items reliably — exactly the Lists & Keys lesson.',
            },
          ]}
        />
      </Section>
    </>
  )
}
