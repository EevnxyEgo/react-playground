import { Code2, BookOpen, FlaskConical, Target, Sparkles } from 'lucide-react'
import { Section, Hook, Prose, KeyIdea, Code } from '../../components/learning/Section'
import { CodeBlock } from '../../components/learning/CodeBlock'
import { TestPlayground } from '../../components/testing/TestPlayground'
import { Challenge } from '../../components/learning/Challenge'
import { Quiz } from '../../components/learning/Quiz'

export default function JestBasics() {
  return (
    <>
      <Section icon={Code2} title="The shape of a test" step="Hook">
        <Hook>
          Every test framework boils down to the same three moves: describe a
          group, run a case, and assert an expectation. What do those look like in
          Jest?
        </Hook>
      </Section>

      <Section icon={BookOpen} title="describe / test / expect" step="Explanation">
        <CodeBlock
          filename="anatomy.test.js"
          code={`describe("calculator", () => {      // groups related tests
  test("adds", () => {              // a single case (alias: it)
    expect(2 + 3).toBe(5);         // matcher asserts the result
  });
});

// Common matchers:
expect(x).toBe(5);                  // strict === (primitives)
expect(obj).toEqual({ a: 1 });      // deep equality (objects/arrays)
expect(value).toBeTruthy();         // / toBeFalsy / toBeNull
expect(arr).toContain("a");         // membership
expect(fn).toHaveBeenCalled();      // spies/mocks`}
        />
        <KeyIdea title="toBe vs toEqual">
          Use <Code>toBe</Code> for primitives (===). Use <Code>toEqual</Code> for
          objects/arrays — it compares by value, since two different objects with
          the same contents are not <Code>===</Code>.
        </KeyIdea>
      </Section>

      <Section icon={FlaskConical} title="Run real matchers" step="Playground">
        <TestPlayground
          editorHeight={340}
          files={{
            '/cart.js': `export function total(items) {
  return items.reduce((sum, i) => sum + i.price * i.qty, 0);
}\n`,
            '/cart.test.js': `import { total } from "./cart";

describe("total()", () => {
  test("sums price * qty", () => {
    expect(total([{ price: 2, qty: 3 }, { price: 5, qty: 1 }])).toBe(11);
  });
  test("empty cart is 0", () => {
    expect(total([])).toBe(0);
  });
});
`,
          }}
        />
      </Section>

      <Section icon={Target} title="Your turn" step="Challenge">
        <Challenge
          task={
            <>
              Add a third test asserting that <Code>total</Code> works for a single
              item, and a test using <Code>toEqual</Code> on an object somewhere.
            </>
          }
          checklist={[
            'A new test case is added inside the describe block',
            'It uses expect(...).toBe(...) correctly',
            'One assertion uses toEqual for an object/array',
            'All tests pass (green)',
          ]}
          hint="Add another test(...) block. For toEqual: expect({a:1}).toEqual({a:1})."
        />
      </Section>

      <Section icon={Sparkles} title="Quiz" step="Check yourself">
        <Quiz
          questions={[
            {
              id: 'q1',
              question: 'Which matcher compares objects by value?',
              options: ['toBe', 'toEqual', 'toContain', 'toBeTruthy'],
              answer: 1,
              explanation: 'toEqual does deep value comparison; toBe is strict === (fails for two distinct objects).',
            },
            {
              id: 'q2',
              question: 'What is `it` in Jest?',
              options: ['A different kind of test', 'An alias for `test`', 'A matcher', 'A mock helper'],
              answer: 1,
              explanation: 'it() and test() are aliases — `it("does X")` reads nicely in a describe block.',
            },
          ]}
        />
      </Section>
    </>
  )
}
