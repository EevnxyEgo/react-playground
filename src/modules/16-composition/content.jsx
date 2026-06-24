import { useState } from 'react'
import { Combine, BookOpen, Code2, Eye, Target, Sparkles } from 'lucide-react'
import { Section, Hook, Prose, KeyIdea, Code } from '../../components/learning/Section'
import { CodeBlock } from '../../components/learning/CodeBlock'
import { CodePlayground } from '../../components/learning/CodePlayground'
import { Challenge } from '../../components/learning/Challenge'
import { Quiz } from '../../components/learning/Quiz'
import { Button } from '../../components/ui/Button'

/*
 * Module 16 — Composition vs Inheritance.
 * children for slots + the render-props pattern for sharing behavior.
 */

// Composition via children + a "slot" prop.
function Panel({ title, actions, children }) {
  return (
    <div className="rounded-lg border border-line/10 bg-surface-950 p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-semibold text-content-strong">{title}</span>
        {actions}
      </div>
      <div className="text-sm text-content">{children}</div>
    </div>
  )
}

// Render prop: this component owns behavior (a toggle) and lets the CALLER
// decide what to render with it.
function Toggler({ children }) {
  const [on, setOn] = useState(false)
  return children(on, () => setOn((o) => !o))
}

function CompositionDemo() {
  return (
    <div className="space-y-3">
      <Panel title="Composed panel" actions={<Button size="sm" variant="ghost">⋯</Button>}>
        Anything you nest becomes <Code>children</Code>. Same Panel, any content.
      </Panel>

      <Toggler>
        {(on, toggle) => (
          <Panel
            title="Render prop"
            actions={
              <Button size="sm" onClick={toggle}>
                {on ? 'On' : 'Off'}
              </Button>
            }
          >
            The Toggler owns the on/off state; this caller decides how to display
            it: <strong>{on ? '🟢 enabled' : '⚪ disabled'}</strong>.
          </Panel>
        )}
      </Toggler>
    </div>
  )
}

export default function CompositionModule() {
  return (
    <>
      <Section icon={Combine} title="Reuse without inheritance" step="Hook">
        <Hook>
          You want one <Code>Dialog</Code> that can wrap a login form, a photo, or
          a confirmation message. In classic OOP you'd subclass. React says: don't
          — compose instead. Why?
        </Hook>
        <Prose>
          <p>
            React strongly favors <strong>composition over inheritance</strong>.
            Instead of extending a base component, you build small components and{' '}
            <em>combine</em> them — most often by passing content through{' '}
            <Code>props.children</Code>.
          </p>
        </Prose>
      </Section>

      <Section icon={BookOpen} title="Two composition patterns" step="Explanation">
        <CodeBlock
          filename="composition.js"
          code={`// 1) children as a generic "slot"
function Card({ children }) {
  return <div className="card">{children}</div>;
}
<Card><LoginForm /></Card>   // put anything inside

// 2) named slots via props (which can be JSX!)
function Dialog({ title, footer, children }) {
  return (
    <div>
      <h2>{title}</h2>
      <div>{children}</div>
      <div>{footer}</div>
    </div>
  );
}

// 3) render props — share behavior, caller controls the UI
function Toggler({ children }) {
  const [on, setOn] = useState(false);
  return children(on, () => setOn(!on)); // children is a FUNCTION
}
<Toggler>{(on, toggle) => <button onClick={toggle}>{on ? "On" : "Off"}</button>}</Toggler>`}
        />
        <KeyIdea title="Props can be JSX">
          A prop doesn't have to be a string or number — you can pass entire
          elements (<Code>header={'<Logo/>'}</Code>). That flexibility is why you
          almost never need inheritance in React.
        </KeyIdea>
      </Section>

      <Section icon={Eye} title="Composition live" step="Render Visualizer">
        <CompositionDemo />
      </Section>

      <Section icon={Code2} title="Build a reusable Dialog" step="Playground">
        <CodePlayground
          title="Composition with children"
          files={{
            '/App.js': `function Dialog({ title, children, footer }) {
  return (
    <div style={{ border: "1px solid #334", borderRadius: 10, padding: 16 }}>
      <h3 style={{ marginTop: 0 }}>{title}</h3>
      <div>{children}</div>
      <div style={{ marginTop: 12 }}>{footer}</div>
    </div>
  );
}

export default function App() {
  return (
    <div style={{ fontFamily: "sans-serif", padding: 16 }}>
      <Dialog
        title="Delete file?"
        footer={<button>Confirm</button>}
      >
        <p>This action cannot be undone.</p>
      </Dialog>
    </div>
  );
}
`,
          }}
          editorHeight={360}
        />
      </Section>

      <Section icon={Target} title="Your turn" step="Challenge">
        <Challenge
          task={
            <>
              Reuse the same <Code>Dialog</Code> a second time with completely
              different content and footer (e.g. a "Welcome" dialog with a "Get
              started" button) — proving one component, many uses, no subclassing.
            </>
          }
          checklist={[
            'A second <Dialog> is rendered',
            'It has a different title, children, and footer',
            'No new Dialog variant/class was created',
            'Both dialogs render correctly',
          ]}
          hint="Just render <Dialog title='Welcome' footer={<button>Get started</button>}>…</Dialog> again with new content."
        />
      </Section>

      <Section icon={Sparkles} title="Quiz" step="Check yourself">
        <Quiz
          questions={[
            {
              id: 'q1',
              question: 'React recommends which approach for reuse?',
              options: [
                'Inheritance (extend a base component)',
                'Composition (combine components, pass children)',
                'Copy-pasting components',
                'Global mixins',
              ],
              answer: 1,
              explanation:
                'React favors composition — build small pieces and combine them via children/props rather than subclassing.',
            },
            {
              id: 'q2',
              question: 'In the render-props pattern, what is `children`?',
              options: [
                'A string of text',
                'A function the component calls, passing data for the caller to render',
                'An array of child components',
                'A CSS class',
              ],
              answer: 1,
              explanation:
                'With render props, children is a function: the component supplies values and the caller returns the UI.',
            },
          ]}
        />
      </Section>
    </>
  )
}
