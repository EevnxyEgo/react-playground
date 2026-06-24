import { useState } from 'react'
import { Package, BookOpen, Code2, Eye, Target, Sparkles } from 'lucide-react'
import { Section, Hook, Prose, KeyIdea, Code } from '../../components/learning/Section'
import { CodeBlock } from '../../components/learning/CodeBlock'
import { CodePlayground } from '../../components/learning/CodePlayground'
import { RenderFlashWrapper } from '../../components/learning/RenderFlashWrapper'
import { Challenge } from '../../components/learning/Challenge'
import { Quiz } from '../../components/learning/Quiz'

/*
 * Module 3 — Props.
 * Passing data in, destructuring, defaults and children. The visualizer shows
 * that a prop change re-renders the child.
 */

function Greeting({ name }) {
  return <p className="text-content">Hello, {name || '…'} 👋</p>
}

function PropsRenderDemo() {
  const [name, setName] = useState('React')
  return (
    <div className="space-y-3">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Type a name"
        className="w-full rounded-lg border border-line/10 bg-surface-800 px-3 py-2 text-sm text-content focus-ring"
      />
      <RenderFlashWrapper label="<Greeting name={name} />">
        <Greeting name={name} />
      </RenderFlashWrapper>
      <p className="text-xs text-content-faint">
        Type above: the new prop value flows in and the child re-renders (flash).
      </p>
    </div>
  )
}

export default function PropsModule() {
  return (
    <>
      <Section icon={Package} title="One component, many looks" step="Hook">
        <Hook>
          You need ten cards that all look the same but show different text. Do
          you write ten components? Of course not — but how do you feed each one
          its own content?
        </Hook>
        <Prose>
          <p>
            The answer is <strong>props</strong> (short for "properties"). Props
            are the inputs you pass <em>into</em> a component, exactly like
            arguments to a function. Same component, different data each time.
          </p>
        </Prose>
      </Section>

      <Section icon={BookOpen} title="How props work" step="Explanation">
        <Prose>
          <p>
            You pass props as attributes when you use a component, and the
            component receives them as a single <Code>props</Code> object. Most
            people <strong>destructure</strong> the bits they need:
          </p>
        </Prose>
        <CodeBlock
          filename="Card.js"
          code={`// Pass props like attributes:
<Card title="Hello" subtitle="World" />

// Receive + destructure them:
function Card({ title, subtitle }) {
  return (
    <div className="card">
      <h2>{title}</h2>
      <p>{subtitle}</p>
    </div>
  );
}`}
        />
        <KeyIdea title="Props are read-only">
          A component must never change its own props — treat them as
          read-only ingredients passed from the parent. Data flows{' '}
          <strong>down</strong>. (To change something over time, that's{' '}
          <em>state</em>, from the previous module.)
        </KeyIdea>
      </Section>

      <Section icon={Code2} title="Build a reusable Card" step="Playground">
        <Prose>
          <p>
            Here's a <Code>&lt;Card /&gt;</Code> used three times with different
            props — including a <strong>default value</strong> and{' '}
            <Code>props.children</Code> (whatever you nest inside the tags).
          </p>
        </Prose>
        <CodePlayground
          title="Reusable Card"
          files={{
            '/App.js': `// A reusable card. \`badge\` has a default; \`children\` is the nested content.
function Card({ title, badge = "New", children }) {
  return (
    <div style={{ border: "1px solid #334", borderRadius: 12, padding: 16, margin: 8 }}>
      <small style={{ color: "#58c4dc" }}>{badge}</small>
      <h3 style={{ margin: "4px 0" }}>{title}</h3>
      <div>{children}</div>
    </div>
  );
}

export default function App() {
  return (
    <div style={{ fontFamily: "sans-serif", padding: 8 }}>
      <Card title="Reusable!">This text is props.children.</Card>
      <Card title="With a badge" badge="Hot">Different content here.</Card>
      <Card title="Default badge">No badge prop → uses the default.</Card>
    </div>
  );
}
`,
          }}
          editorHeight={340}
        />
      </Section>

      <Section icon={Eye} title="Props changes trigger re-renders" step="Render Visualizer">
        <Prose>
          <p>
            Just like state, when a component receives a <strong>new prop value</strong>{' '}
            it re-renders. Type in the box and watch <Code>Greeting</Code> flash
            each time its <Code>name</Code> prop changes.
          </p>
        </Prose>
        <PropsRenderDemo />
      </Section>

      <Section icon={Target} title="Your turn" step="Challenge">
        <Challenge
          task={
            <>
              Add a new <Code>Card</Code> in the playground with a custom{' '}
              <Code>badge</Code> of your choice, and give it some nested{' '}
              <Code>children</Code> content. Then add a brand-new prop (e.g.{' '}
              <Code>footer</Code>) to the Card component and display it.
            </>
          }
          checklist={[
            'A new <Card> is rendered with a custom badge prop',
            'It has nested children content between the tags',
            'The Card component reads a new prop (e.g. footer) via destructuring',
            'The new prop shows up in the preview',
          ]}
          hint="Add the prop name to the destructured list `{ title, badge = 'New', children, footer }`, then render {footer} somewhere in the card."
        />
      </Section>

      <Section icon={Sparkles} title="Quiz" step="Check yourself">
        <Quiz
          questions={[
            {
              id: 'q1',
              question: 'What are props most like?',
              options: [
                'Global variables shared by all components',
                'Arguments passed into a function',
                'A component’s private internal memory',
                'CSS classes',
              ],
              answer: 1,
              explanation:
                'Props are inputs passed into a component from its parent — just like function arguments.',
            },
            {
              id: 'q2',
              question: 'What is `props.children`?',
              options: [
                'A list of a component’s child components defined elsewhere',
                'Whatever JSX you nest between the component’s opening and closing tags',
                'The component’s state',
                'A reserved prop you cannot use',
              ],
              answer: 1,
              explanation:
                'children is a special prop holding the content nested inside the component’s tags.',
            },
          ]}
        />
      </Section>
    </>
  )
}
