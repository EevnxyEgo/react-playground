import { useState } from 'react'
import { MousePointerClick, BookOpen, Code2, Eye, Target, Sparkles } from 'lucide-react'
import { Section, Hook, Prose, KeyIdea, Code } from '../../components/learning/Section'
import { CodeBlock } from '../../components/learning/CodeBlock'
import { CodePlayground } from '../../components/learning/CodePlayground'
import { RenderFlashWrapper } from '../../components/learning/RenderFlashWrapper'
import { StateInspector } from '../../components/learning/StateInspector'
import { Challenge } from '../../components/learning/Challenge'
import { Quiz } from '../../components/learning/Quiz'
import { Button } from '../../components/ui/Button'

/*
 * Module 5 — Event Handling.
 * onClick/onChange, passing a function (not calling it), passing arguments, and
 * the synthetic event. Live demo wires events → state → re-render.
 */
function EventsDemo() {
  const [clicks, setClicks] = useState(0)
  const [text, setText] = useState('')
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <RenderFlashWrapper label="Events → state → render">
        <div className="space-y-3">
          <Button size="sm" onClick={() => setClicks((c) => c + 1)}>
            Clicked {clicks} time{clicks === 1 ? '' : 's'}
          </Button>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type something…"
            className="w-full rounded-lg border border-white/10 bg-surface-800 px-3 py-2 text-sm text-slate-200 focus-ring"
          />
        </div>
      </RenderFlashWrapper>
      <StateInspector data={{ clicks, text }} title="Handler results" />
    </div>
  )
}

export default function EventsModule() {
  return (
    <>
      <Section icon={MousePointerClick} title="Making things happen" step="Hook">
        <Hook>
          A button that does nothing is just decoration. How do you actually run
          your code the moment a user clicks, types, or submits?
        </Hook>
        <Prose>
          <p>
            You attach <strong>event handlers</strong> — functions React calls
            when something happens. They look like HTML's <Code>onclick</Code>,
            but in JSX they're camelCase (<Code>onClick</Code>,{' '}
            <Code>onChange</Code>, <Code>onSubmit</Code>) and you hand them a{' '}
            <em>function</em>, not a string.
          </p>
        </Prose>
      </Section>

      <Section icon={BookOpen} title="The one mistake everyone makes" step="Explanation">
        <Prose>
          <p>
            Pass the function itself — don't <em>call</em> it. The difference is
            a tiny pair of parentheses with a huge effect:
          </p>
        </Prose>
        <CodeBlock
          filename="handlers.js"
          code={`// ✅ pass the function — React calls it on click
<button onClick={handleClick}>Click</button>

// ❌ calls it immediately during render (bug!)
<button onClick={handleClick()}>Click</button>

// ✅ need to pass arguments? wrap in an arrow
<button onClick={() => greet("Sam")}>Greet</button>

// the event object is passed automatically
<input onChange={(e) => setText(e.target.value)} />`}
        />
        <KeyIdea title="Synthetic events">
          React wraps the native browser event in a cross-browser{' '}
          <strong>SyntheticEvent</strong> with the same API (
          <Code>e.target</Code>, <Code>e.preventDefault()</Code>, …). One
          consistent event everywhere.
        </KeyIdea>
      </Section>

      <Section icon={Code2} title="A simple form" step="Playground">
        <CodePlayground
          title="Events in action"
          files={{
            '/App.js': `import { useState } from "react";

export default function App() {
  const [name, setName] = useState("");

  function handleSubmit(e) {
    e.preventDefault();            // stop the page reloading
    alert("Hi, " + (name || "stranger") + "!");
  }

  return (
    <form onSubmit={handleSubmit} style={{ fontFamily: "sans-serif", padding: 16 }}>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
      />
      <button type="submit" style={{ marginLeft: 8 }}>Greet me</button>
      <p>Live preview: {name}</p>
    </form>
  );
}
`,
          }}
          editorHeight={300}
        />
      </Section>

      <Section icon={Eye} title="Every handler causes a render" step="Render Visualizer">
        <Prose>
          <p>
            Each handler below updates state, which re-renders the component
            (flash) and updates the live state panel. Click and type to watch it.
          </p>
        </Prose>
        <EventsDemo />
      </Section>

      <Section icon={Target} title="Your turn" step="Challenge">
        <Challenge
          task={
            <>
              In the playground, add a <strong>Reset</strong> button that clears
              the input (sets <Code>name</Code> back to an empty string). Make
              sure it has <Code>type="button"</Code> so it doesn't submit the
              form.
            </>
          }
          checklist={[
            'A Reset button exists',
            'It has type="button"',
            'Clicking it sets name back to ""',
            'The input visibly clears',
          ]}
          hint='onClick={() => setName("")} — and remember type="button" so it does not trigger onSubmit.'
        />
      </Section>

      <Section icon={Sparkles} title="Quiz" step="Check yourself">
        <Quiz
          questions={[
            {
              id: 'q1',
              question: 'What does `onClick={handleClick()}` do?',
              options: [
                'Correctly registers handleClick to run on click',
                'Calls handleClick immediately during render, not on click',
                'Throws a syntax error',
                'Runs handleClick once per second',
              ],
              answer: 1,
              explanation:
                'The parentheses call it right away during render. Pass the reference (handleClick) or wrap it: () => handleClick().',
            },
            {
              id: 'q2',
              question: 'How do you read what a user typed in an input?',
              options: [
                'document.getElementById("input").value',
                'From e.target.value inside the onChange handler',
                'React passes it as the second argument to the component',
                'You can’t — inputs are write-only',
              ],
              answer: 1,
              explanation:
                'The change handler receives the event; e.target.value holds the current input value.',
            },
          ]}
        />
      </Section>
    </>
  )
}
