import { useState } from 'react'
import { FormInput, GitCompare, Code2, Eye, Target, Sparkles } from 'lucide-react'
import { Section, Hook, Prose, KeyIdea, Code } from '../../components/learning/Section'
import { ComparisonTabs } from '../../components/learning/ComparisonTabs'
import { CodeBlock } from '../../components/learning/CodeBlock'
import { CodePlayground } from '../../components/learning/CodePlayground'
import { RenderFlashWrapper } from '../../components/learning/RenderFlashWrapper'
import { StateInspector } from '../../components/learning/StateInspector'
import { Challenge } from '../../components/learning/Challenge'
import { Quiz } from '../../components/learning/Quiz'

/*
 * Module 8 — Forms & Controlled Components.
 * Controlled vs uncontrolled, and the single-state-object pattern for many
 * inputs via the `name` attribute.
 */
function FormDemo() {
  const [form, setForm] = useState({ name: '', email: '', subscribe: false })

  // One handler for every field — keyed by the input's `name`.
  function update(e) {
    const { name, value, type, checked } = e.target
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const field = 'w-full rounded-lg border border-white/10 bg-surface-800 px-3 py-2 text-sm text-slate-200 focus-ring'

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <RenderFlashWrapper label="Controlled form">
        <div className="space-y-2">
          <input name="name" value={form.name} onChange={update} placeholder="Name" className={field} />
          <input name="email" value={form.email} onChange={update} placeholder="Email" className={field} />
          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input type="checkbox" name="subscribe" checked={form.subscribe} onChange={update} />
            Subscribe to the newsletter
          </label>
        </div>
      </RenderFlashWrapper>
      <StateInspector data={form} title="Form state (one object)" />
    </div>
  )
}

export default function FormsModule() {
  return (
    <>
      <Section icon={FormInput} title="Who owns the input?" step="Hook">
        <Hook>
          When you type into a text box, where does that text actually live — in
          React's state, or in the DOM element itself? The answer decides how you
          build every form.
        </Hook>
        <Prose>
          <p>
            In a <strong>controlled component</strong>, React state is the single
            source of truth: the input's <Code>value</Code> comes from state, and
            every keystroke updates state via <Code>onChange</Code>. The input
            can't change without React knowing.
          </p>
        </Prose>
      </Section>

      <Section icon={GitCompare} title="Controlled vs uncontrolled" step="Comparison">
        <ComparisonTabs
          defaultValue="controlled"
          tabs={[
            {
              value: 'controlled',
              label: 'Controlled',
              badge: 'recommended',
              content: (
                <CodeBlock
                  filename="Controlled.js"
                  code={`const [text, setText] = useState("");

<input
  value={text}                       // value comes FROM state
  onChange={(e) => setText(e.target.value)}
/>
// React always knows the value → easy to validate, reset, disable.`}
                />
              ),
            },
            {
              value: 'uncontrolled',
              label: 'Uncontrolled',
              content: (
                <CodeBlock
                  filename="Uncontrolled.js"
                  code={`const inputRef = useRef(null);

<input defaultValue="hi" ref={inputRef} />
// The DOM holds the value; you read it on demand:
// inputRef.current.value`}
                />
              ),
            },
          ]}
          note={
            <>
              Prefer <strong>controlled</strong> inputs for most forms — they make
              validation, conditional disabling and resetting trivial. Reach for{' '}
              <strong>uncontrolled</strong> (with a <Code>ref</Code>) for simple
              cases or when integrating non-React code.
            </>
          }
        />
      </Section>

      <Section icon={Code2} title="Many inputs, one state object" step="Playground">
        <Prose>
          <p>
            Instead of a <Code>useState</Code> per field, keep one object and key
            updates by the input's <Code>name</Code>. One handler covers them all.
          </p>
        </Prose>
        <CodePlayground
          title="Single-object form"
          files={{
            '/App.js': `import { useState } from "react";

export default function App() {
  const [form, setForm] = useState({ first: "", last: "" });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value })); // [name] = computed key
  }

  return (
    <div style={{ fontFamily: "sans-serif", padding: 16 }}>
      <input name="first" value={form.first} onChange={handleChange} placeholder="First" />
      <input name="last"  value={form.last}  onChange={handleChange} placeholder="Last" />
      <p>Hello, {form.first} {form.last}!</p>
    </div>
  );
}
`,
          }}
          editorHeight={300}
        />
      </Section>

      <Section icon={Eye} title="State updates on every keystroke" step="Render Visualizer">
        <Prose>
          <p>
            Type in the controlled form — each keystroke re-renders (flash) and
            the live state object updates immediately.
          </p>
        </Prose>
        <FormDemo />
      </Section>

      <Section icon={Target} title="Your turn" step="Challenge">
        <Challenge
          task={
            <>
              Add a third field, <Code>email</Code>, to the single-object form in
              the playground, and show a live summary line that includes it.
            </>
          }
          checklist={[
            'The initial state object includes an email field',
            'An <input name="email"> uses value + onChange',
            'The same handleChange covers it (no new handler)',
            'A summary shows the email value live',
          ]}
          hint="Because handleChange uses [name], you don't write new logic — just add the field to initial state and an input with name='email'."
        />
      </Section>

      <Section icon={Sparkles} title="Quiz" step="Check yourself">
        <Quiz
          questions={[
            {
              id: 'q1',
              question: 'In a controlled input, where does the value live?',
              options: [
                'In the DOM element only',
                'In React state (value comes from state, onChange updates it)',
                'In a cookie',
                'In a ref',
              ],
              answer: 1,
              explanation:
                'Controlled = React state is the source of truth; value={state} and onChange keeps them in sync.',
            },
            {
              id: 'q2',
              question: 'Why use `[name]` when updating a single form state object?',
              options: [
                'It’s required syntax for all setState calls',
                'It uses the input’s name as a computed key so one handler updates the right field',
                'It deletes the old field first',
                'It converts the value to a number',
              ],
              answer: 1,
              explanation:
                'Computed keys let one handler target whichever field fired the event, keyed by its name.',
            },
          ]}
        />
      </Section>
    </>
  )
}
