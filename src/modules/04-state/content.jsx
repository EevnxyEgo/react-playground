import { useState } from 'react'
import { Activity, GitCompare, Code2, Eye, Target, Sparkles, Bug } from 'lucide-react'
import { Section, Hook, Prose, KeyIdea, Code } from '../../components/learning/Section'
import { ComparisonTabs } from '../../components/learning/ComparisonTabs'
import { CodeBlock } from '../../components/learning/CodeBlock'
import { CodePlayground } from '../../components/learning/CodePlayground'
import { RenderFlashWrapper } from '../../components/learning/RenderFlashWrapper'
import { StateInspector } from '../../components/learning/StateInspector'
import { Challenge } from '../../components/learning/Challenge'
import { Quiz } from '../../components/learning/Quiz'
import { Button } from '../../components/ui/Button'

/*
 * Module 4 — State.
 * Comparison mode (useState vs class state) + the headline Render Visualizer:
 * the StateInspector shows live state while the component flashes on every
 * re-render, making the "state change → re-render" link concrete.
 */

// The live counter demo. Wrapped so it flashes on each re-render; the
// StateInspector mirrors the state object in real time.
function StateCounterDemo() {
  const [count, setCount] = useState(0)
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <RenderFlashWrapper label="Counter (useState)">
        <div className="py-2 text-center">
          <p className="font-mono text-5xl font-bold text-slate-100">{count}</p>
          <div className="mt-4 flex justify-center gap-2">
            <Button size="sm" variant="secondary" onClick={() => setCount((c) => c - 1)}>
              −1
            </Button>
            <Button size="sm" onClick={() => setCount((c) => c + 1)}>
              +1
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setCount(0)}>
              reset
            </Button>
          </div>
        </div>
      </RenderFlashWrapper>
      <StateInspector data={{ count }} title="Live state" />
    </div>
  )
}

export default function StateModule() {
  return (
    <>
      <Section icon={Bug} title="Why doesn't this number update?" step="Hook">
        <Hook>
          This button increments a plain variable on every click — yet the screen
          never changes. Click it in the playground and see for yourself. Why?
        </Hook>
        <CodePlayground
          title="The bug: a plain variable"
          files={{
            '/App.js': `export default function App() {
  let count = 0; // just a normal variable

  function handleClick() {
    count = count + 1;
    console.log("count is now", count); // it DOES change…
  }

  return (
    <div style={{ fontFamily: "sans-serif", padding: 16 }}>
      <h1>Count: {count}</h1>
      <button onClick={handleClick}>+1</button>
      <p>Open the console — the value changes, but the UI doesn't.</p>
    </div>
  );
}
`,
          }}
          showConsole
          editorHeight={300}
        />
        <Prose>
          <p>
            The variable <em>does</em> change — but changing a normal variable
            doesn't tell React to update the screen. React only re-renders when
            you change <strong>state</strong>. That's what <Code>useState</Code> is
            for.
          </p>
        </Prose>
      </Section>

      <Section icon={Activity} title="State = memory that triggers a re-render" step="Explanation">
        <Prose>
          <p>
            <strong>State</strong> is data a component remembers between renders.
            When you update state, React <strong>re-runs the component</strong>{' '}
            and updates the DOM to match.
          </p>
          <p>
            In a function component you create state with <Code>useState</Code>:
          </p>
        </Prose>
        <CodeBlock
          filename="counter.js"
          code={`const [count, setCount] = useState(0);
//      ▲        ▲                  ▲
//   current  setter to        initial
//   value    update it         value`}
        />
        <KeyIdea title="Analogy">
          A normal variable is like writing a number on a whiteboard that nobody
          looks at again. State is a number on a smart display — the moment you
          change it, the display (your UI) refreshes automatically.
        </KeyIdea>
      </Section>

      <Section icon={GitCompare} title="useState vs class state" step="Comparison">
        <Prose>
          <p>
            The same counter, written both ways. Function components use the{' '}
            <Code>useState</Code> hook; class components keep a <Code>this.state</Code>{' '}
            object and call <Code>this.setState</Code>.
          </p>
        </Prose>
        <ComparisonTabs
          defaultValue="fn"
          tabs={[
            {
              value: 'fn',
              label: 'Function + useState',
              badge: 'modern',
              content: (
                <CodeBlock
                  filename="Counter.js"
                  code={`import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}`}
                />
              ),
            },
            {
              value: 'class',
              label: 'Class + this.state',
              badge: 'legacy',
              content: (
                <CodeBlock
                  filename="Counter.js"
                  code={`import React from "react";

class Counter extends React.Component {
  state = { count: 0 };

  render() {
    return (
      <button
        onClick={() => this.setState({ count: this.state.count + 1 })}
      >
        Count: {this.state.count}
      </button>
    );
  }
}`}
                />
              ),
            },
          ]}
          note={
            <>
              Both re-render on update. The function version is shorter and is
              the standard today. Note: <Code>this.setState</Code> <em>merges</em>{' '}
              into the state object, while a <Code>useState</Code> setter{' '}
              <em>replaces</em> that piece of state — a classic gotcha when moving
              between the two.
            </>
          }
        />
      </Section>

      <Section icon={Eye} title="Watch state drive re-renders" step="Render Visualizer">
        <Prose>
          <p>
            Now the fixed version. Every time you change <Code>count</Code>, two
            things happen at once: the component <span className="text-flash">flashes</span>{' '}
            (it re-rendered) and the live state panel updates. State and
            re-rendering are two sides of the same coin.
          </p>
        </Prose>
        <StateCounterDemo />
      </Section>

      <Section icon={Code2} title="Make it your own" step="Playground">
        <CodePlayground
          title="useState counter"
          files={{
            '/App.js': `import { useState } from "react";

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ fontFamily: "sans-serif", padding: 16 }}>
      <h1>Count: {count}</h1>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  );
}
`,
          }}
          solution={{
            '/App.js': `import { useState } from "react";

export default function App() {
  // Challenge solution: starts at 10, with a Reset button.
  const [count, setCount] = useState(10);

  return (
    <div style={{ fontFamily: "sans-serif", padding: 16 }}>
      <h1>Count: {count}</h1>
      <button onClick={() => setCount(count + 1)}>+1</button>
      <button onClick={() => setCount(10)} style={{ marginLeft: 8 }}>
        Reset
      </button>
    </div>
  );
}
`,
          }}
          editorHeight={300}
        />
      </Section>

      <Section icon={Target} title="Your turn" step="Challenge">
        <Challenge
          task={
            <>
              Modify the counter so it <strong>starts at 10</strong> instead of 0,
              then add a <strong>Reset</strong> button that sets it back to 10.
            </>
          }
          checklist={[
            'useState is initialized with 10',
            'The preview shows "Count: 10" on load',
            'A Reset button exists',
            'Clicking Reset returns the count to 10',
          ]}
          hint="The initial value is the argument to useState(...). For Reset, call setCount(10) in an onClick handler."
        />
      </Section>

      <Section icon={Sparkles} title="Quiz" step="Check yourself">
        <Quiz
          questions={[
            {
              id: 'q1',
              question: 'Why didn’t the plain `let count` version update the screen?',
              options: [
                'The variable never actually changed',
                'Changing a normal variable does not tell React to re-render',
                'You can’t use let inside a component',
                'console.log blocks the UI from updating',
              ],
              answer: 1,
              explanation:
                'React only re-renders in response to state (or prop) changes. A normal variable changes in memory but React never hears about it.',
            },
            {
              id: 'q2',
              question: 'What does `const [count, setCount] = useState(0)` give you?',
              options: [
                'Two unrelated variables that both equal 0',
                'The current state value and a function to update it (and re-render)',
                'A way to read state, but you must mutate count directly to change it',
                'A class instance with a count property',
              ],
              answer: 1,
              explanation:
                'useState returns a pair: the current value and a setter. Calling the setter updates the value and schedules a re-render. Never mutate count directly.',
            },
          ]}
        />
      </Section>
    </>
  )
}
