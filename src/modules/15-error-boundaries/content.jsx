import { AlertTriangle, BookOpen, Code2, Eye, Target, Sparkles, ShieldAlert } from 'lucide-react'
import { Section, Hook, Prose, KeyIdea, Code } from '../../components/learning/Section'
import { CodeBlock } from '../../components/learning/CodeBlock'
import { CodePlayground } from '../../components/learning/CodePlayground'
import { Challenge } from '../../components/learning/Challenge'
import { Quiz } from '../../components/learning/Quiz'

/*
 * Module 15 — Error Boundaries.
 * The one place you still NEED a class component. The genuine throw/catch demo
 * lives in Sandpack (isolated console); the in-app section is an illustrative
 * before/after so the app's own console stays clean.
 */
function CrashIllustration() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="rounded-xl border border-rose-500/30 bg-surface-950 p-4">
        <p className="mb-2 text-xs font-semibold text-rose-300">No boundary 💥</p>
        <div className="rounded-lg bg-rose-950/40 p-3 text-center text-sm text-rose-200">
          <AlertTriangle className="mx-auto mb-1" size={18} />
          Blank white screen — the whole app crashes
        </div>
      </div>
      <div className="rounded-xl border border-emerald-500/30 bg-surface-950 p-4">
        <p className="mb-2 text-xs font-semibold text-emerald-300">With boundary ✅</p>
        <div className="rounded-lg bg-emerald-950/30 p-3 text-center text-sm text-emerald-200">
          <ShieldAlert className="mx-auto mb-1" size={18} />
          Friendly fallback — the rest of the app keeps working
        </div>
      </div>
    </div>
  )
}

export default function ErrorBoundariesModule() {
  return (
    <>
      <Section icon={ShieldAlert} title="When one component explodes" step="Hook">
        <Hook>
          A single component throws an error during render. Should your users see
          a blank white page and lose everything — or a tidy "something went
          wrong, try again"?
        </Hook>
        <Prose>
          <p>
            An <strong>Error Boundary</strong> is a component that catches errors
            thrown by its children during rendering, and shows a fallback UI
            instead of letting the whole tree crash. It's React's version of a{' '}
            <Code>try/catch</Code> for the component tree.
          </p>
        </Prose>
      </Section>

      <Section icon={BookOpen} title="Still a class-only pattern" step="Explanation">
        <Prose>
          <p>
            Error boundaries are the one feature that <strong>has no hook
            equivalent</strong> — you must write a class with one (or both) of
            these special methods:
          </p>
        </Prose>
        <CodeBlock
          filename="ErrorBoundary.js"
          code={`class ErrorBoundary extends React.Component {
  state = { hasError: false };

  // 1) Render the fallback on the next render after an error
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  // 2) Side effect: log the error (e.g. to a monitoring service)
  componentDidCatch(error, info) {
    console.log("Logged:", error.message);
  }

  render() {
    if (this.state.hasError) return <FallbackUI />;
    return this.props.children;
  }
}`}
        />
        <KeyIdea title="What they DON'T catch">
          Error boundaries catch errors during <strong>rendering</strong>,
          lifecycle methods and constructors of the tree below them. They do{' '}
          <em>not</em> catch errors in event handlers, async code, or the boundary
          itself — use a normal <Code>try/catch</Code> for those.
        </KeyIdea>
      </Section>

      <Section icon={Eye} title="Crash vs caught" step="Render Visualizer">
        <CrashIllustration />
      </Section>

      <Section icon={Code2} title="Catch a real error" step="Playground">
        <Prose>
          <p>
            Click "Trigger error" — the <Code>Buggy</Code> component throws, but
            the boundary catches it and shows the fallback. Check the console for
            the logged error, then click "Try again" to recover.
          </p>
        </Prose>
        <CodePlayground
          title="Error boundary"
          showConsole
          files={{
            '/App.js': `import React from "react";

class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error) {
    console.log("Boundary caught:", error.message);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 12, background: "#fee", borderRadius: 8 }}>
          ⚠️ Something went wrong.{" "}
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function Buggy() {
  const [boom, setBoom] = React.useState(false);
  if (boom) throw new Error("Buggy component exploded 💥");
  return <button onClick={() => setBoom(true)}>Trigger error</button>;
}

export default function App() {
  return (
    <div style={{ fontFamily: "sans-serif", padding: 16 }}>
      <h3>The rest of the app is fine 🙂</h3>
      <ErrorBoundary>
        <Buggy />
      </ErrorBoundary>
    </div>
  );
}
`,
          }}
          editorHeight={420}
        />
      </Section>

      <Section icon={Target} title="Your turn" step="Challenge">
        <Challenge
          task={
            <>
              Improve the fallback UI: show the actual error message. Store the
              error in state via <Code>getDerivedStateFromError(error)</Code> and
              render <Code>this.state.error.message</Code> in the fallback.
            </>
          }
          checklist={[
            'getDerivedStateFromError returns { hasError: true, error }',
            'The fallback renders the real error message',
            'Trigger error still shows the boundary, not a crash',
            'Try again still recovers',
          ]}
          hint="Return { hasError: true, error } from getDerivedStateFromError(error), then show {this.state.error?.message} in the fallback."
        />
      </Section>

      <Section icon={Sparkles} title="Quiz" step="Check yourself">
        <Quiz
          questions={[
            {
              id: 'q1',
              question: 'Can you write an error boundary as a function component with hooks?',
              options: [
                'Yes, with useError',
                'No — it must be a class (getDerivedStateFromError / componentDidCatch)',
                'Yes, with useEffect',
                'Only in React 19+',
              ],
              answer: 1,
              explanation:
                'There is no hook equivalent yet; error boundaries require a class component.',
            },
            {
              id: 'q2',
              question: 'Which of these does an error boundary NOT catch?',
              options: [
                'Errors during a child’s render',
                'Errors in a child’s constructor',
                'Errors thrown inside an onClick event handler',
                'Errors in a child’s lifecycle method',
              ],
              answer: 2,
              explanation:
                'Event handler errors aren’t caught by boundaries — wrap that logic in a regular try/catch.',
            },
          ]}
        />
      </Section>
    </>
  )
}
