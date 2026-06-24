import { createContext, useContext, useState } from 'react'
import { Network, BookOpen, Code2, Eye, Target, Sparkles, ArrowDown, Zap } from 'lucide-react'
import { Section, Hook, Prose, KeyIdea, Code } from '../../components/learning/Section'
import { CodeBlock } from '../../components/learning/CodeBlock'
import { CodePlayground } from '../../components/learning/CodePlayground'
import { Challenge } from '../../components/learning/Challenge'
import { Quiz } from '../../components/learning/Quiz'
import { Button } from '../../components/ui/Button'

/*
 * Module 11 — useContext & the Context API.
 * Visualizes prop drilling vs context, then a live demo where a deeply nested
 * button reads theme straight from context — no props threaded through.
 */

// A self-contained demo context (separate from the app's real AppContext).
const DemoTheme = createContext(null)

function DeepButton() {
  const { dark, toggle } = useContext(DemoTheme) // reaches up, skipping parents
  return (
    <div
      className={
        'rounded-lg border p-3 text-sm ' +
        (dark ? 'border-accent/40 bg-surface-800 text-content-strong' : 'border-amber-400/40 bg-amber-50 text-slate-900')
      }
    >
      <p className="mb-2">I'm 3 levels deep and got the theme from context.</p>
      <Button size="sm" onClick={toggle}>
        Toggle theme ({dark ? 'dark' : 'light'})
      </Button>
    </div>
  )
}
const Level2 = () => <div className="rounded-lg border border-line/10 p-3"><p className="mb-2 text-xs text-content-faint">Level 2 (passes no props)</p><DeepButton /></div>
const Level1 = () => <div className="rounded-lg border border-line/10 p-3"><p className="mb-2 text-xs text-content-faint">Level 1 (passes no props)</p><Level2 /></div>

function ContextDemo() {
  const [dark, setDark] = useState(true)
  return (
    <DemoTheme.Provider value={{ dark, toggle: () => setDark((d) => !d) }}>
      <div className="rounded-xl border border-accent/30 p-3">
        <p className="mb-2 text-xs font-semibold text-accent">App (Provider holds the value)</p>
        <Level1 />
      </div>
    </DemoTheme.Provider>
  )
}

// A small visual contrasting drilling (value at every level) vs context (teleport).
function DrillingDiagram() {
  const Box = ({ children, tone }) => (
    <div className={'rounded-lg border px-3 py-2 text-center text-xs ' + tone}>{children}</div>
  )
  const drill = 'border-rose-500/30 bg-rose-500/5 text-rose-200'
  const ctx = 'border-emerald-500/30 bg-emerald-500/5 text-emerald-200'
  const plain = 'border-line/10 bg-surface-900 text-content-muted'
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-1">
        <p className="mb-1 text-xs font-semibold text-rose-300">Prop drilling 😩</p>
        <Box tone={drill}>App (has theme)</Box>
        <ArrowDown className="mx-auto text-rose-400" size={14} />
        <Box tone={drill}>Layout (props.theme ↓)</Box>
        <ArrowDown className="mx-auto text-rose-400" size={14} />
        <Box tone={drill}>Sidebar (props.theme ↓)</Box>
        <ArrowDown className="mx-auto text-rose-400" size={14} />
        <Box tone={drill}>Button (finally uses it)</Box>
      </div>
      <div className="space-y-1">
        <p className="mb-1 text-xs font-semibold text-emerald-300">Context 🎯</p>
        <Box tone={ctx}>App (Provider value=theme)</Box>
        <div className="flex items-center justify-center gap-1 text-emerald-400">
          <Zap size={14} /> <span className="text-[11px]">teleports past the middle</span>
        </div>
        <Box tone={plain}>Layout (knows nothing)</Box>
        <Box tone={plain}>Sidebar (knows nothing)</Box>
        <Box tone={ctx}>Button (useContext) ✅</Box>
      </div>
    </div>
  )
}

export default function UseContextModule() {
  return (
    <>
      <Section icon={Network} title="The prop-drilling headache" step="Hook">
        <Hook>
          A button buried five components deep needs the current theme. Must every
          component in between accept and forward a <Code>theme</Code> prop it
          doesn't even use?
        </Hook>
        <Prose>
          <p>
            Passing props through layers that don't care about them is called{' '}
            <strong>prop drilling</strong>. It's noisy and fragile. The{' '}
            <strong>Context API</strong> lets a parent broadcast a value to an
            entire subtree, so any descendant can grab it directly.
          </p>
        </Prose>
      </Section>

      <Section icon={Eye} title="Drilling vs context, side by side" step="Render Visualizer">
        <DrillingDiagram />
      </Section>

      <Section icon={BookOpen} title="Three steps to use context" step="Explanation">
        <CodeBlock
          filename="theme-context.js"
          code={`// 1) Create a context
const ThemeContext = createContext("light");

// 2) Provide a value to a subtree
<ThemeContext.Provider value="dark">
  <App />
</ThemeContext.Provider>

// 3) Consume it anywhere below — no props threaded through
function Button() {
  const theme = useContext(ThemeContext);
  return <button className={theme}>Click</button>;
}`}
        />
        <KeyIdea title="Use it for 'global-ish' data">
          Context shines for things many components need: theme, current user,
          language, auth. Don't reach for it for every prop — normal props are
          still the default for parent→child data.
        </KeyIdea>
      </Section>

      <Section icon={Code2} title="Live: a deep consumer" step="Demo">
        <Prose>
          <p>
            The button below is three levels down. The levels in between pass{' '}
            <strong>zero props</strong> — the button reads theme straight from the
            provider via <Code>useContext</Code>.
          </p>
        </Prose>
        <ContextDemo />
      </Section>

      <Section icon={Code2} title="Build a theme switcher" step="Playground">
        <CodePlayground
          title="Context theme switcher"
          files={{
            '/App.js': `import { createContext, useContext, useState } from "react";

const ThemeContext = createContext();

function ThemedBox() {
  const { theme, toggle } = useContext(ThemeContext);
  const dark = theme === "dark";
  return (
    <div style={{
      padding: 16, borderRadius: 8,
      background: dark ? "#0d1424" : "#f1f5f9",
      color: dark ? "#e2e8f0" : "#0f172a",
    }}>
      <p>Current theme: {theme}</p>
      <button onClick={toggle}>Toggle theme</button>
    </div>
  );
}

export default function App() {
  const [theme, setTheme] = useState("dark");
  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      <div style={{ fontFamily: "sans-serif", padding: 16 }}>
        <ThemedBox />
      </div>
    </ThemeContext.Provider>
  );
}
`,
          }}
          editorHeight={400}
        />
      </Section>

      <Section icon={Target} title="Your turn" step="Challenge">
        <Challenge
          task={
            <>
              Add a second value to the same context — a <Code>user</Code> name —
              and display it inside <Code>ThemedBox</Code> (e.g. "Hello, Ada"),
              without adding any new props to the component.
            </>
          }
          checklist={[
            'The Provider value includes a user name',
            'ThemedBox reads user via useContext (no new prop)',
            'The user name shows in the preview',
            'No prop drilling was added',
          ]}
          hint="Put user in the value object: value={{ theme, toggle, user: 'Ada' }}, then destructure it in ThemedBox."
        />
      </Section>

      <Section icon={Sparkles} title="Quiz" step="Check yourself">
        <Quiz
          questions={[
            {
              id: 'q1',
              question: 'What problem does the Context API primarily solve?',
              options: [
                'Slow rendering of large lists',
                'Passing data through many intermediate components that don’t need it (prop drilling)',
                'Fetching data from a server',
                'Styling components',
              ],
              answer: 1,
              explanation:
                'Context lets descendants read a value directly, avoiding threading props through uninterested middle components.',
            },
            {
              id: 'q2',
              question: 'Which hook reads a context value?',
              options: ['useState', 'useRef', 'useContext', 'useEffect'],
              answer: 2,
              explanation:
                'useContext(MyContext) returns the nearest Provider’s value above the component.',
            },
          ]}
        />
      </Section>
    </>
  )
}
