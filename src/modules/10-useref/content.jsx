import { useRef, useState } from 'react'
import { Crosshair, BookOpen, Code2, Eye, Target, Sparkles } from 'lucide-react'
import { Section, Hook, Prose, KeyIdea, Code } from '../../components/learning/Section'
import { CodeBlock } from '../../components/learning/CodeBlock'
import { CodePlayground } from '../../components/learning/CodePlayground'
import { RenderFlashWrapper } from '../../components/learning/RenderFlashWrapper'
import { Challenge } from '../../components/learning/Challenge'
import { Quiz } from '../../components/learning/Quiz'
import { CommonMistake } from '../../components/learning/CommonMistake'
import { Button } from '../../components/ui/Button'

/*
 * Module 10 — useRef.
 * Two jobs: (1) reach a DOM node, (2) hold a mutable value that survives renders
 * WITHOUT causing one. The visualizer puts useState next to useRef so the
 * "ref change → no re-render" behavior is obvious (no flash).
 */

// Local state so only THIS component re-renders when its button is clicked.
function StateCounter() {
  const [n, setN] = useState(0)
  return (
    <RenderFlashWrapper label="useState — triggers re-render">
      <p className="font-mono text-3xl text-content-strong">{n}</p>
      <Button size="sm" className="mt-2" onClick={() => setN((x) => x + 1)}>
        +1 (re-renders)
      </Button>
    </RenderFlashWrapper>
  )
}

function RefCounter() {
  const n = useRef(0)
  const [, force] = useState(0)
  return (
    <RenderFlashWrapper label="useRef — does NOT re-render">
      <p className="font-mono text-3xl text-content-strong">{n.current}</p>
      <div className="mt-2 flex gap-2">
        <Button size="sm" variant="secondary" onClick={() => (n.current += 1)}>
          +1 (no render)
        </Button>
        <Button size="sm" variant="ghost" onClick={() => force((x) => x + 1)}>
          force render
        </Button>
      </div>
      <p className="mt-1 text-xs text-content-faint">
        The value changes silently — click “force render” to reveal the real
        current value.
      </p>
    </RenderFlashWrapper>
  )
}

export default function UseRefModule() {
  return (
    <>
      <Section icon={Crosshair} title="An escape hatch from React" step="Hook">
        <Hook>
          How do you focus a text box when a button is clicked? Or count
          something between renders without forcing the UI to redraw every time?
        </Hook>
        <Prose>
          <p>
            <Code>useRef</Code> gives you a box, <Code>{'{ current: ... }'}</Code>,
            that survives every render. Two superpowers: point it at a{' '}
            <strong>DOM element</strong> to control it directly, or store a{' '}
            <strong>mutable value</strong> that <em>doesn't</em> trigger a
            re-render when it changes.
          </p>
        </Prose>
      </Section>

      <Section icon={BookOpen} title="ref vs state" step="Explanation">
        <CodeBlock
          filename="useRef.js"
          code={`const inputRef = useRef(null);     // 1) DOM access
<input ref={inputRef} />
inputRef.current.focus();          // reach the real DOM node

const renders = useRef(0);         // 2) value that persists,
renders.current += 1;              //    but never causes a re-render`}
        />
        <KeyIdea title="The rule of thumb">
          If changing the value should update the screen → use{' '}
          <strong>state</strong>. If it's "behind the scenes" data (a timer id, a
          previous value, a DOM node) → use a <strong>ref</strong>. Changing{' '}
          <Code>ref.current</Code> never re-renders.
        </KeyIdea>
      </Section>

      <Section icon={Eye} title="state re-renders, ref doesn't" step="Render Visualizer">
        <Prose>
          <p>
            Same counter, two tools. The <Code>useState</Code> one flashes and
            updates on every click. The <Code>useRef</Code> one changes its value
            silently — no flash, no update — until you force a render.
          </p>
        </Prose>
        <div className="grid gap-3 sm:grid-cols-2">
          <StateCounter />
          <RefCounter />
        </div>
      </Section>

      <Section icon={Code2} title="Focus an input" step="Playground">
        <CodePlayground
          title="DOM access with a ref"
          files={{
            '/App.js': `import { useRef } from "react";

export default function App() {
  const inputRef = useRef(null);

  return (
    <div style={{ fontFamily: "sans-serif", padding: 16 }}>
      <input ref={inputRef} placeholder="Click the button →" />
      <button
        onClick={() => inputRef.current.focus()}
        style={{ marginLeft: 8 }}
      >
        Focus the input
      </button>
    </div>
  );
}
`,
          }}
          editorHeight={260}
        />
      </Section>

      <Section icon={Target} title="Your turn" step="Challenge">
        <Challenge
          task={
            <>
              Add a ref called <Code>renderCount</Code> that increments on every
              render and is shown on screen. (Bonus: notice it can lag because
              changing a ref doesn't trigger a render.)
            </>
          }
          checklist={[
            'A ref is created with useRef(0)',
            'It is incremented in the component body each render',
            'Its value is displayed in the UI',
            'You understand why it does not, by itself, cause a re-render',
          ]}
          hint="const renderCount = useRef(0); then renderCount.current++ directly in the body, and render {renderCount.current}."
        />
      </Section>

      <Section icon={Sparkles} title="Quiz" step="Check yourself">
        <Quiz
          questions={[
            {
              id: 'q1',
              question: 'What happens when you change `ref.current`?',
              options: [
                'The component re-renders, like setState',
                'The value updates but no re-render is triggered',
                'React throws an error',
                'It updates the DOM automatically',
              ],
              answer: 1,
              explanation:
                'Refs are mutable boxes that persist across renders; mutating .current does NOT schedule a re-render.',
            },
            {
              id: 'q2',
              question: 'Which is the right tool to focus a specific DOM input?',
              options: [
                'useState',
                'A ref attached via the ref attribute, then ref.current.focus()',
                'document.write',
                'A prop named focus',
              ],
              answer: 1,
              explanation:
                'Attach a ref to the element and call ref.current.focus() — the standard way to reach a DOM node in React.',
            },
          ]}
        />
      </Section>

      <CommonMistake title="Common mistake: expecting a ref to re-render" to="/predict-output" linkLabel="Predict: ref vs state">
        {`Mutating ref.current never triggers a re-render. If the screen should update when the value changes, use state — a ref is for values that persist silently.`}
      </CommonMistake>
    </>
  )
}
