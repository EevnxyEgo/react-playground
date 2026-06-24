import { useEffect, useState } from 'react'
import { Repeat, GitCompare, Code2, Eye, Target, Sparkles, Timer } from 'lucide-react'
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
 * Module 9 — useEffect vs Lifecycle methods.
 * Comparison mode (class lifecycle vs useEffect) + a deps-array visualizer that
 * proves an effect only re-runs when its dependencies change. The cleanup /
 * memory-leak lesson lives in the Sandpack playground (console is isolated).
 */
function EffectDepsDemo() {
  const [count, setCount] = useState(0)
  const [other, setOther] = useState(0)
  const [effectRuns, setEffectRuns] = useState(0)

  // Runs only when `count` changes — NOT when `other` changes.
  useEffect(() => {
    setEffectRuns((r) => r + 1)
  }, [count])

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <RenderFlashWrapper label="Effect with [count] dependency">
        <div className="space-y-3">
          <div className="flex gap-2">
            <Button size="sm" onClick={() => setCount((c) => c + 1)}>
              count +1
            </Button>
            <Button size="sm" variant="secondary" onClick={() => setOther((o) => o + 1)}>
              other +1
            </Button>
          </div>
          <p className="text-xs text-content-faint">
            Both buttons re-render the component, but only “count +1” re-runs the effect.
          </p>
        </div>
      </RenderFlashWrapper>
      <StateInspector data={{ count, other, effectRuns }} title="Effect runs vs state" />
    </div>
  )
}

export default function UseEffectModule() {
  return (
    <>
      <Section icon={Repeat} title="Running code at the right time" step="Hook">
        <Hook>
          You need to start a timer, fetch data, or set up a subscription — things
          that should happen <em>after</em> the component is on screen, and be
          torn down when it leaves. Where does that code go?
        </Hook>
        <Prose>
          <p>
            Not in the render body (that runs during rendering and shouldn't have
            side effects). It goes in <Code>useEffect</Code> — React runs it{' '}
            <strong>after</strong> the render is committed to the screen.
          </p>
        </Prose>
      </Section>

      <Section icon={Code2} title="The dependency array decides timing" step="Explanation">
        <CodeBlock
          filename="useEffect.js"
          code={`useEffect(() => {
  // side effect runs AFTER render

  return () => {
    // cleanup runs before the next effect AND on unmount
  };
}, [deps]);

// [] (empty)   → run once after first render (mount)
// [a, b]       → run after mount + whenever a or b change
// (no array)   → run after EVERY render`}
        />
        <KeyIdea title="Always clean up subscriptions & timers">
          If your effect starts something ongoing (interval, event listener,
          subscription), return a cleanup function that stops it. Forget this and
          you get <strong>memory leaks</strong> — timers that keep firing after
          the component is gone.
        </KeyIdea>
      </Section>

      <Section icon={GitCompare} title="Lifecycle methods vs useEffect" step="Comparison">
        <ComparisonTabs
          defaultValue="fn"
          tabs={[
            {
              value: 'fn',
              label: 'Function + useEffect',
              badge: 'modern',
              content: (
                <CodeBlock
                  filename="Clock.js"
                  code={`function Clock() {
  const [time, setTime] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setTime(Date.now()), 1000); // didMount
    return () => clearInterval(id);                          // willUnmount
  }, []); // [] → set up once

  return <p>{new Date(time).toLocaleTimeString()}</p>;
}`}
                />
              ),
            },
            {
              value: 'class',
              label: 'Class lifecycle',
              badge: 'legacy',
              content: (
                <CodeBlock
                  filename="Clock.js"
                  code={`class Clock extends React.Component {
  state = { time: Date.now() };

  componentDidMount() {
    this.id = setInterval(() => this.setState({ time: Date.now() }), 1000);
  }
  componentDidUpdate(prevProps) { /* react to prop/state changes */ }
  componentWillUnmount() {
    clearInterval(this.id); // cleanup
  }

  render() {
    return <p>{new Date(this.state.time).toLocaleTimeString()}</p>;
  }
}`}
                />
              ),
            },
          ]}
          note={
            <>
              One <Code>useEffect</Code> with cleanup replaces three lifecycle
              methods. Mentally: <Code>componentDidMount</Code> = effect with{' '}
              <Code>[]</Code>; <Code>componentDidUpdate</Code> = effect with deps;{' '}
              <Code>componentWillUnmount</Code> = the returned cleanup function.
            </>
          }
        />
      </Section>

      <Section icon={Eye} title="When does the effect actually run?" step="Render Visualizer">
        <Prose>
          <p>
            The effect depends on <Code>[count]</Code>. Click both buttons:
            everything re-renders (flash), but the effect-run counter only ticks
            when <Code>count</Code> changes.
          </p>
        </Prose>
        <EffectDepsDemo />
      </Section>

      <Section icon={Timer} title="See a memory leak (and fix it)" step="Playground">
        <Prose>
          <p>
            This timer is <strong>missing its cleanup</strong>. Open the console,
            then toggle the timer off — you'll see React warn about updating an
            unmounted component (the interval is leaking). Click{' '}
            <strong>Show Solution</strong> to add the cleanup and silence it.
          </p>
        </Prose>
        <CodePlayground
          title="Interval cleanup"
          showConsole
          files={{
            '/App.js': `import { useState, useEffect } from "react";

function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    // ❌ no cleanup — the interval keeps running after unmount
  }, []);

  return <p>Elapsed: {seconds}s</p>;
}

export default function App() {
  const [show, setShow] = useState(true);
  return (
    <div style={{ fontFamily: "sans-serif", padding: 16 }}>
      <button onClick={() => setShow((v) => !v)}>
        {show ? "Hide" : "Show"} timer
      </button>
      {show && <Timer />}
    </div>
  );
}
`,
          }}
          solution={{
            '/App.js': `import { useState, useEffect } from "react";

function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id); // ✅ cleanup on unmount
  }, []);

  return <p>Elapsed: {seconds}s</p>;
}

export default function App() {
  const [show, setShow] = useState(true);
  return (
    <div style={{ fontFamily: "sans-serif", padding: 16 }}>
      <button onClick={() => setShow((v) => !v)}>
        {show ? "Hide" : "Show"} timer
      </button>
      {show && <Timer />}
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
              In the playground, add the cleanup so the interval is cleared on
              unmount. Then change the dependency array so the effect logs a
              message whenever a (new) <Code>seconds</Code> value crosses 5 — using
              a second effect with <Code>[seconds]</Code>.
            </>
          }
          checklist={[
            'The interval effect returns () => clearInterval(id)',
            'Hiding the timer no longer warns in the console',
            'A second useEffect depends on [seconds]',
            'It console.logs when seconds reaches 5',
          ]}
          hint="You can have multiple useEffects. Add useEffect(() => { if (seconds === 5) console.log('5!'); }, [seconds])."
        />
      </Section>

      <Section icon={Sparkles} title="Quiz" step="Check yourself">
        <Quiz
          questions={[
            {
              id: 'q1',
              question: 'What does an empty dependency array `[]` mean?',
              options: [
                'Run the effect after every render',
                'Run the effect once, after the first render (mount)',
                'Never run the effect',
                'Run the effect only on unmount',
              ],
              answer: 1,
              explanation:
                '[] means no dependencies change, so the effect runs once on mount (and cleanup on unmount).',
            },
            {
              id: 'q2',
              question: 'Which lifecycle method does the cleanup function correspond to?',
              options: [
                'componentDidMount',
                'componentDidUpdate',
                'componentWillUnmount (and before re-running the effect)',
                'render',
              ],
              answer: 2,
              explanation:
                'The returned cleanup runs on unmount and before the effect re-runs — like componentWillUnmount.',
            },
          ]}
        />
      </Section>
    </>
  )
}
