import { useState } from 'react'
import { Boxes, GitCompare, Code2, Eye, Target, Sparkles } from 'lucide-react'
import { Section, Hook, Prose, KeyIdea, Code } from '../../components/learning/Section'
import { ComparisonTabs } from '../../components/learning/ComparisonTabs'
import { CodeBlock } from '../../components/learning/CodeBlock'
import { CodePlayground } from '../../components/learning/CodePlayground'
import { RenderFlashWrapper } from '../../components/learning/RenderFlashWrapper'
import { Challenge } from '../../components/learning/Challenge'
import { Quiz } from '../../components/learning/Quiz'
import { Button } from '../../components/ui/Button'

/*
 * Module 1 — Creating Components.
 * The reference module: every required layer is present, including the 3-way
 * comparison mode (function decl / arrow / class) and a real Render Visualizer.
 */

// In-app live demo: clicking re-renders the parent, so the wrapped "component"
// flashes — proving a re-render happened (no Sandpack needed for this part).
function ComponentRenderDemo() {
  const [count, setCount] = useState(0)
  return (
    <div className="space-y-3">
      <RenderFlashWrapper label="<Greeting /> component">
        <p className="text-slate-200">
          Hi 👋 — this component has re-rendered after{' '}
          <span className="font-mono text-accent">{count}</span> click(s).
        </p>
      </RenderFlashWrapper>
      <Button size="sm" onClick={() => setCount((c) => c + 1)}>
        Re-render the component
      </Button>
      <p className="text-xs text-slate-500">
        Each click updates state → React re-renders → you see the amber flash.
      </p>
    </div>
  )
}

export default function ComponentsModule() {
  return (
    <>
      <Section icon={Boxes} title="What even is a component?" step="Hook">
        <Hook>
          You keep seeing <Code>&lt;App /&gt;</Code> and <Code>&lt;Button /&gt;</Code> in
          React code. They look like HTML tags — but where do they come from, and
          what are they really?
        </Hook>
        <Prose>
          <p>
            A <strong>component</strong> is just a JavaScript function (or class)
            that returns some UI. Think of it like a <strong>custom HTML tag you
            invent yourself</strong>: define it once, then reuse it anywhere as{' '}
            <Code>&lt;Greeting /&gt;</Code>.
          </p>
          <p>
            Two non-negotiable rules: a component's name must start with a{' '}
            <strong>Capital letter</strong> (so React tells it apart from real
            HTML tags), and it must <strong>return something renderable</strong>{' '}
            (JSX, a string, <Code>null</Code>, …).
          </p>
        </Prose>
        <KeyIdea title="Analogy">
          Components are LEGO bricks. Each brick is simple on its own, but you
          snap them together to build something big — and you can reuse the same
          brick as many times as you want.
        </KeyIdea>
      </Section>

      <Section icon={GitCompare} title="Three ways to write the same component" step="Comparison">
        <Prose>
          <p>
            These three <Code>Greeting</Code> components are{' '}
            <strong>functionally identical</strong> — they all render the same
            heading. Flip between the tabs to compare the syntax:
          </p>
        </Prose>
        <ComparisonTabs
          defaultValue="fn"
          tabs={[
            {
              value: 'fn',
              label: 'Function',
              badge: 'modern',
              content: (
                <CodeBlock
                  filename="Greeting.js — function declaration"
                  code={`function Greeting() {
  return <h1>Hi 👋</h1>;
}`}
                />
              ),
            },
            {
              value: 'arrow',
              label: 'Arrow',
              badge: 'modern',
              content: (
                <CodeBlock
                  filename="Greeting.js — arrow function expression"
                  code={`const Greeting = () => {
  return <h1>Hi 👋</h1>;
};`}
                />
              ),
            },
            {
              value: 'class',
              label: 'Class',
              badge: 'legacy',
              content: (
                <CodeBlock
                  filename="Greeting.js — class component"
                  code={`import React from "react";

class Greeting extends React.Component {
  render() {
    return <h1>Hi 👋</h1>;
  }
}`}
                />
              ),
            },
          ]}
          note={
            <>
              All three produce the exact same output. <strong>Function
              components are the modern standard</strong> because{' '}
              <em>hooks (like useState) only work inside function components</em>.
              You'll still meet <strong>class components</strong> in older
              codebases, so it's worth recognizing them — but write new code as
              functions.
            </>
          }
        />
      </Section>

      <Section icon={Code2} title="Build one yourself" step="Playground">
        <Prose>
          <p>
            Edit the <Code>Greeting</Code> component below. Try changing the text,
            or add a second component and render it inside <Code>App</Code>.
          </p>
        </Prose>
        <CodePlayground
          title="Components live editor"
          files={{
            '/App.js': `// A component is a function that returns UI.
function Greeting() {
  return <h1>Hi 👋</h1>;
}

export default function App() {
  return (
    <div style={{ fontFamily: "sans-serif", padding: 16 }}>
      <Greeting />
    </div>
  );
}
`,
          }}
          solution={{
            '/App.js': `// Greeting as an arrow function, plus a second component.
const Greeting = () => {
  return <h1>Hi 👋</h1>;
};

const Farewell = () => {
  return <p>See you next module! 👋</p>;
};

export default function App() {
  return (
    <div style={{ fontFamily: "sans-serif", padding: 16 }}>
      <Greeting />
      <Farewell />
    </div>
  );
}
`,
          }}
          editorHeight={300}
        />
      </Section>

      <Section icon={Eye} title="See a component re-render" step="Render Visualizer">
        <Prose>
          <p>
            A component doesn't render just once — React re-runs it whenever its
            data changes. Click the button and watch the component{' '}
            <span className="text-flash">flash amber</span> every time it
            re-renders. The counter on the right tracks how many times it has run.
          </p>
        </Prose>
        <ComponentRenderDemo />
      </Section>

      <Section icon={Target} title="Your turn" step="Challenge">
        <Challenge
          task={
            <>
              In the playground above, convert <Code>Greeting</Code> into an{' '}
              <strong>arrow-function</strong> component, then create a second
              component called <Code>Farewell</Code> that renders{' '}
              <Code>&lt;p&gt;Bye!&lt;/p&gt;</Code>, and render both inside{' '}
              <Code>App</Code>.
            </>
          }
          checklist={[
            'Greeting is written as `const Greeting = () => { ... }`',
            'A new component `Farewell` exists',
            'App renders both <Greeting /> and <Farewell />',
            'The preview shows both messages',
          ]}
          hint="Components are just variables/functions — define Farewell the same way you defined Greeting, then drop <Farewell /> next to <Greeting /> inside App's return."
        />
      </Section>

      <Section icon={Sparkles} title="Quiz" step="Check yourself">
        <Quiz
          questions={[
            {
              id: 'q1',
              question: 'What turns an ordinary function into a React component?',
              options: [
                'It must use the `function` keyword (arrows are not allowed)',
                'It returns JSX/React elements and is named with a Capital letter',
                'It must call this.setState somewhere',
                'It has to live inside a class',
              ],
              answer: 1,
              explanation:
                'A component returns renderable UI and is Capitalized so React treats it as a component, not an HTML tag. Functions or arrows both work.',
            },
            {
              id: 'q2',
              question: 'Why are function components the modern default over classes?',
              options: [
                'Class components were removed from React',
                'Functions always render faster in every case',
                'Hooks (like useState/useEffect) only work in function components',
                'Functions can return multiple root elements but classes cannot',
              ],
              answer: 2,
              explanation:
                'Hooks only work in function components. Classes still work and appear in legacy code, but new code uses functions + hooks.',
            },
          ]}
        />
      </Section>
    </>
  )
}
