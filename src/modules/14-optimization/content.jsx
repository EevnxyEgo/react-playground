import { memo, useState } from 'react'
import { Gauge, BookOpen, Code2, Eye, Target, Sparkles } from 'lucide-react'
import { Section, Hook, Prose, KeyIdea, Code } from '../../components/learning/Section'
import { CodeBlock } from '../../components/learning/CodeBlock'
import { CodePlayground } from '../../components/learning/CodePlayground'
import { Challenge } from '../../components/learning/Challenge'
import { Quiz } from '../../components/learning/Quiz'
import { useRenderFlash } from '../../hooks/useRenderFlash'
import { Button } from '../../components/ui/Button'

/*
 * Module 14 — Optimization (React.memo / useMemo / useCallback).
 * The Render Visualizer is the whole point: in the unoptimized panel BOTH
 * children flash on every parent update; in the memoized panel only the child
 * whose prop actually changed flashes.
 */

// A child that flashes itself on every (re)render and shows its render count.
function FlashChild({ label, value }) {
  const { ref, renderCount } = useRenderFlash()
  return (
    <div ref={ref} className="rounded-lg border border-line/10 bg-surface-950 p-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-content">{label}</span>
        <span className="rounded-full bg-flash/15 px-2 py-0.5 font-mono text-xs text-flash">
          renders: {renderCount}
        </span>
      </div>
      <p className="mt-1 font-mono text-xs text-content-faint">prop value: {String(value)}</p>
    </div>
  )
}
const MemoChild = memo(FlashChild)

function UnoptimizedPanel() {
  const [count, setCount] = useState(0)
  return (
    <div className="space-y-2 rounded-xl border border-rose-500/30 p-3">
      <p className="text-xs font-semibold text-rose-300">Without React.memo</p>
      <Button size="sm" onClick={() => setCount((c) => c + 1)}>
        Bump parent ({count})
      </Button>
      <FlashChild label="Child A (uses count)" value={count} />
      <FlashChild label="Child B (static prop)" value="static" />
      <p className="text-xs text-content-faint">Both children flash every time — even B.</p>
    </div>
  )
}

function OptimizedPanel() {
  const [count, setCount] = useState(0)
  return (
    <div className="space-y-2 rounded-xl border border-emerald-500/30 p-3">
      <p className="text-xs font-semibold text-emerald-300">With React.memo</p>
      <Button size="sm" onClick={() => setCount((c) => c + 1)}>
        Bump parent ({count})
      </Button>
      <MemoChild label="Child A (uses count)" value={count} />
      <MemoChild label="Child B (static prop)" value="static" />
      <p className="text-xs text-content-faint">Only A flashes — B's props never change.</p>
    </div>
  )
}

export default function OptimizationModule() {
  return (
    <>
      <Section icon={Gauge} title="Re-rendering things that didn't change" step="Hook">
        <Hook>
          When a parent re-renders, all its children re-render too — even the ones
          whose data didn't change. Usually that's fine. But what if a child is
          expensive? Can you skip the wasted work?
        </Hook>
        <Prose>
          <p>
            React gives you three tools to avoid needless work:{' '}
            <Code>React.memo</Code> (skip a component if its props are unchanged),{' '}
            <Code>useMemo</Code> (cache an expensive computed value), and{' '}
            <Code>useCallback</Code> (cache a function so memoized children don't
            see a "new" prop every render).
          </p>
        </Prose>
      </Section>

      <Section icon={Eye} title="Proof: memo skips unchanged children" step="Render Visualizer">
        <Prose>
          <p>
            Click "Bump parent" in both panels. On the left, <strong>both</strong>{' '}
            children flash. On the right, child B never flashes because{' '}
            <Code>React.memo</Code> sees its props are identical and skips it.
          </p>
        </Prose>
        <div className="grid gap-3 sm:grid-cols-2">
          <UnoptimizedPanel />
          <OptimizedPanel />
        </div>
      </Section>

      <Section icon={BookOpen} title="The three tools" step="Explanation">
        <CodeBlock
          filename="optimization.js"
          code={`// React.memo: skip re-render if props are shallow-equal
const Child = React.memo(function Child({ value }) { ... });

// useMemo: only recompute when deps change
const expensive = useMemo(() => slowCalc(items), [items]);

// useCallback: keep the SAME function reference between renders
const handleClick = useCallback(() => doThing(id), [id]);
// → passing handleClick to a memo'd child won't break the memo`}
        />
        <KeyIdea title="Don't over-optimize">
          Memoization isn't free — it adds complexity and a little overhead.
          Reach for it when you've got a real, measured performance problem
          (expensive renders, large lists), not by default on every component.
        </KeyIdea>
      </Section>

      <Section icon={Code2} title="useMemo in action" step="Playground">
        <CodePlayground
          title="useMemo"
          showConsole
          files={{
            '/App.js': `import { useState, useMemo } from "react";

function slowSquare(n) {
  console.log("computing square of", n); // watch when this runs
  let x = 0;
  for (let i = 0; i < 5000000; i++) x += 1; // pretend it's expensive
  return n * n;
}

export default function App() {
  const [num, setNum] = useState(2);
  const [other, setOther] = useState(0);

  // Only recomputes when \`num\` changes — not when \`other\` does.
  const square = useMemo(() => slowSquare(num), [num]);

  return (
    <div style={{ fontFamily: "sans-serif", padding: 16 }}>
      <p>{num}² = {square}</p>
      <button onClick={() => setNum(num + 1)}>num + 1</button>
      <button onClick={() => setOther(other + 1)} style={{ marginLeft: 8 }}>
        other + 1 ({other})
      </button>
      <p>Open the console: "computing…" only logs when num changes.</p>
    </div>
  );
}
`,
          }}
          editorHeight={380}
        />
      </Section>

      <Section icon={Target} title="Your turn" step="Challenge">
        <Challenge
          task={
            <>
              In the playground, confirm the behavior: clicking{' '}
              <Code>other + 1</Code> should <strong>not</strong> log "computing…".
              Then break it on purpose by removing <Code>[num]</Code> from{' '}
              <Code>useMemo</Code> and observe it recompute on every render.
            </>
          }
          checklist={[
            'Clicking "other + 1" does NOT recompute the square',
            'Clicking "num + 1" DOES recompute',
            'Removing the dependency array makes it recompute every render',
            'You restored the [num] dependency afterwards',
          ]}
          hint="The dependency array is what gates recomputation. With [num], it only re-runs when num changes; with no array, it runs every render."
        />
      </Section>

      <Section icon={Sparkles} title="Quiz" step="Check yourself">
        <Quiz
          questions={[
            {
              id: 'q1',
              question: 'What does React.memo do?',
              options: [
                'Caches the result of an expensive calculation',
                'Skips re-rendering a component when its props haven’t changed',
                'Memorizes a function reference',
                'Stores values in localStorage',
              ],
              answer: 1,
              explanation:
                'React.memo wraps a component and skips its re-render when props are shallow-equal to last time.',
            },
            {
              id: 'q2',
              question: 'Why pair useCallback with a memoized child?',
              options: [
                'It makes the child render faster internally',
                'Otherwise a new function is created each render, changing the prop and defeating memo',
                'useCallback is required for all event handlers',
                'It prevents the child from receiving props',
              ],
              answer: 1,
              explanation:
                'Inline functions are new references each render. useCallback keeps the same reference so the memo’d child sees unchanged props.',
            },
          ]}
        />
      </Section>
    </>
  )
}
