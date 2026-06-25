import { Puzzle, BookOpen, FlaskConical, Target, Sparkles } from 'lucide-react'
import { Section, Hook, Prose, KeyIdea, Code } from '../../components/learning/Section'
import { TestPlayground } from '../../components/testing/TestPlayground'
import { Challenge } from '../../components/learning/Challenge'
import { Badge } from '../../components/ui/Badge'
import { Quiz } from '../../components/learning/Quiz'

/*
 * Reinforcement: tests a custom hook (like the ones built in v1 Module 13 / the
 * v2 Challenge Library) with renderHook + act.
 */
export default function TestingHooks() {
  return (
    <>
      <Section icon={Puzzle} title="Testing logic without a UI" step="Hook">
        <Hook>
          A custom hook has no markup to query — it's pure logic. How do you test
          one in isolation, without building a throwaway component around it?
        </Hook>
        <Badge tone="accent">Reinforcement — tests a custom hook like v1 Module 13’s</Badge>
      </Section>

      <Section icon={BookOpen} title="renderHook + act" step="Explanation">
        <Prose>
          <p>
            <Code>renderHook</Code> (from <Code>@testing-library/react</Code>) runs
            a hook in a test component and exposes its return value at{' '}
            <Code>result.current</Code>. Wrap state updates in <Code>act()</Code> so
            React flushes them before you assert.
          </p>
        </Prose>
        <KeyIdea title="result.current is live">
          Each render updates <Code>result.current</Code>. Read it fresh after each
          <Code>act()</Code> — don't destructure it once and expect it to update.
        </KeyIdea>
      </Section>

      <Section icon={FlaskConical} title="Live: test useCounter" step="Playground">
        <TestPlayground
          editorHeight={420}
          files={{
            '/useCounter.js': `import { useState, useCallback } from "react";
export function useCounter(initial = 0) {
  const [count, setCount] = useState(initial);
  const increment = useCallback(() => setCount((c) => c + 1), []);
  const reset = useCallback(() => setCount(initial), [initial]);
  return { count, increment, reset };
}\n`,
            '/useCounter.test.js': `import { renderHook, act } from "@testing-library/react";
import { useCounter } from "./useCounter";

test("starts at the initial value and increments", () => {
  const { result } = renderHook(() => useCounter(5));
  expect(result.current.count).toBe(5);

  act(() => result.current.increment());
  expect(result.current.count).toBe(6);

  act(() => result.current.reset());
  expect(result.current.count).toBe(5);
});
`,
          }}
        />
      </Section>

      <Section icon={Target} title="Your turn" step="Challenge">
        <Challenge
          task={
            <>
              Add a <Code>decrement</Code> to <Code>useCounter</Code> and a test
              that increments twice then decrements once, asserting the final
              value.
            </>
          }
          checklist={[
            'useCounter returns a decrement function',
            'A test calls increment/decrement inside act()',
            'It asserts result.current.count after the operations',
            'Tests pass',
          ]}
          hint="const decrement = useCallback(() => setCount(c => c - 1), []); then act(() => result.current.decrement())."
        />
      </Section>

      <Section icon={Sparkles} title="Quiz" step="Check yourself">
        <Quiz
          questions={[
            {
              id: 'q1',
              question: 'What does renderHook expose a hook’s return value as?',
              options: ['result.value', 'result.current', 'hook.state', 'screen'],
              answer: 1,
              explanation: 'result.current holds the latest returned value; it updates on each render.',
            },
            {
              id: 'q2',
              question: 'Why wrap hook state updates in act()?',
              options: [
                'It’s optional decoration',
                'So React flushes updates before your assertions run',
                'To mock the hook',
                'To render a UI',
              ],
              answer: 1,
              explanation: 'act() ensures state updates and effects are applied before you assert on result.current.',
            },
          ]}
        />
      </Section>
    </>
  )
}
