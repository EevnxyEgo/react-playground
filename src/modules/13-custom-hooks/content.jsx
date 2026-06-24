import { useEffect, useState } from 'react'
import { Puzzle, BookOpen, Code2, Eye, Target, Sparkles } from 'lucide-react'
import { Section, Hook, Prose, KeyIdea, Code } from '../../components/learning/Section'
import { CodeBlock } from '../../components/learning/CodeBlock'
import { CodePlayground } from '../../components/learning/CodePlayground'
import { RenderFlashWrapper } from '../../components/learning/RenderFlashWrapper'
import { StateInspector } from '../../components/learning/StateInspector'
import { Challenge } from '../../components/learning/Challenge'
import { Quiz } from '../../components/learning/Quiz'

/*
 * Module 13 — Custom Hooks.
 * A custom hook is just a function that starts with `use` and calls other hooks.
 * Live demo: a real useWindowSize hook updating on resize.
 */

// A real custom hook — note it starts with "use" and calls built-in hooks.
function useWindowSize() {
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight })
  useEffect(() => {
    const onResize = () => setSize({ w: window.innerWidth, h: window.innerHeight })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return size
}

function WindowSizeDemo() {
  const size = useWindowSize()
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <RenderFlashWrapper label="useWindowSize()">
        <p className="text-sm text-content">
          Resize your browser window — this re-renders (flash) and updates live.
        </p>
        <p className="mt-2 font-mono text-2xl text-content-strong">
          {size.w} × {size.h}
        </p>
      </RenderFlashWrapper>
      <StateInspector data={size} title="Hook return value" />
    </div>
  )
}

export default function CustomHooksModule() {
  return (
    <>
      <Section icon={Puzzle} title="Stop copy-pasting logic" step="Hook">
        <Hook>
          You've written the same "read & write localStorage" dance in three
          components. Each time it's a <Code>useState</Code> plus a{' '}
          <Code>useEffect</Code>. Can you bottle that logic up and reuse it?
        </Hook>
        <Prose>
          <p>
            Yes — that's a <strong>custom hook</strong>. It's simply a JavaScript
            function whose name starts with <Code>use</Code> and which calls other
            hooks inside. You extract the stateful logic once and reuse it
            everywhere, each call getting its own independent state.
          </p>
        </Prose>
      </Section>

      <Section icon={BookOpen} title="Anatomy of a custom hook" step="Explanation">
        <CodeBlock
          filename="useLocalStorage.js"
          code={`import { useState, useEffect } from "react";

// Must start with "use" so React applies the Rules of Hooks.
function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    const saved = localStorage.getItem(key);
    return saved !== null ? JSON.parse(saved) : initial;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue]; // return whatever the caller needs
}

// Use it just like a built-in hook:
const [name, setName] = useLocalStorage("name", "");`}
        />
        <KeyIdea title="The Rules of Hooks">
          Call hooks only at the <strong>top level</strong> of a component or
          another hook — never inside loops, conditions, or nested functions. And
          only call them from React functions. The <Code>use</Code> prefix is how
          tooling enforces this.
        </KeyIdea>
        <Prose>
          <p className="text-sm text-content-muted">
            Fun fact: this very app is built from custom hooks —{' '}
            <Code>useRenderFlash</Code> (the flash effect) and{' '}
            <Code>useProgress</Code> (XP & completion) are both custom hooks.
          </p>
        </Prose>
      </Section>

      <Section icon={Eye} title="A live custom hook" step="Render Visualizer">
        <WindowSizeDemo />
      </Section>

      <Section icon={Code2} title="Build useLocalStorage" step="Playground">
        <CodePlayground
          title="useLocalStorage"
          files={{
            '/App.js': `import { useState, useEffect } from "react";

function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    const saved = localStorage.getItem(key);
    return saved !== null ? JSON.parse(saved) : initial;
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
}

export default function App() {
  const [name, setName] = useLocalStorage("demo-name", "");
  return (
    <div style={{ fontFamily: "sans-serif", padding: 16 }}>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Type, then refresh the preview"
      />
      <p>Saved name: {name}</p>
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
              Write a custom hook <Code>useToggle(initial)</Code> that returns{' '}
              <Code>[on, toggle]</Code> and use it to show/hide a message. The hook
              must start with <Code>use</Code>.
            </>
          }
          checklist={[
            'A function named useToggle exists (starts with "use")',
            'It uses useState internally',
            'It returns [on, toggle] where toggle flips the boolean',
            'A component uses it to show/hide something',
          ]}
          hint="function useToggle(initial=false){ const [on,setOn]=useState(initial); const toggle=()=>setOn(o=>!o); return [on, toggle]; }"
        />
      </Section>

      <Section icon={Sparkles} title="Quiz" step="Check yourself">
        <Quiz
          questions={[
            {
              id: 'q1',
              question: 'What makes a function a custom hook?',
              options: [
                'It returns JSX',
                'Its name starts with "use" and it calls other hooks inside',
                'It is defined inside a component',
                'It is exported as default',
              ],
              answer: 1,
              explanation:
                'Custom hooks are functions named useXxx that compose built-in hooks. The naming lets React enforce the Rules of Hooks.',
            },
            {
              id: 'q2',
              question: 'If two components call the same custom hook, do they share state?',
              options: [
                'Yes, the state is shared between them',
                'No — each call gets its own independent state',
                'Only if they are siblings',
                'Only when wrapped in a Provider',
              ],
              answer: 1,
              explanation:
                'Custom hooks share logic, not state. Each call has its own isolated state (to share state, use context).',
            },
          ]}
        />
      </Section>
    </>
  )
}
