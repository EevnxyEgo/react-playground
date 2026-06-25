import { MousePointerClick, BookOpen, FlaskConical, Sparkles } from 'lucide-react'
import { Section, Hook, Prose, KeyIdea, Code } from '../../components/learning/Section'
import { CodeBlock } from '../../components/learning/CodeBlock'
import { TestPlayground } from '../../components/testing/TestPlayground'
import { Quiz } from '../../components/learning/Quiz'

export default function Interaction() {
  return (
    <>
      <Section icon={MousePointerClick} title="Clicking and typing in tests" step="Hook">
        <Hook>
          Your component works when you click it by hand. How do you make a test
          click the button, type into the input, and check what happened?
        </Hook>
      </Section>

      <Section icon={BookOpen} title="fireEvent vs user-event" step="Explanation">
        <CodeBlock
          filename="interaction.js"
          code={`// fireEvent: dispatches a single raw DOM event
fireEvent.click(button);
fireEvent.change(input, { target: { value: "hi" } });

// user-event: simulates a REAL user (focus, keydown, keyup, input…)
const user = userEvent.setup();
await user.click(button);
await user.type(input, "hi");   // fires per-keystroke events`}
        />
        <KeyIdea title="Prefer user-event">
          <Code>user-event</Code> models real interactions far more faithfully
          (focus, hover, individual keystrokes), catching bugs <Code>fireEvent</Code>
          misses. It's async — remember to <Code>await</Code> it.
        </KeyIdea>
      </Section>

      <Section icon={FlaskConical} title="Interaction, live" step="Playground">
        <Prose>
          <p>
            A live, passing interaction test using <Code>fireEvent</Code>. (This
            in-browser runner executes <Code>fireEvent</Code> reliably; in a real
            project you'd reach for <Code>user-event</Code> — see the annotated
            version just below.)
          </p>
        </Prose>
        <TestPlayground
          editorHeight={360}
          files={{
            '/Counter.js': `import { useState } from "react";
export default function Counter() {
  const [n, setN] = useState(0);
  return (
    <div>
      <p>Count: {n}</p>
      <button onClick={() => setN((c) => c + 1)}>increment</button>
    </div>
  );
}\n`,
            '/Counter.test.js': `import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import Counter from "./Counter";

test("increments on each click", () => {
  render(<Counter />);
  const btn = screen.getByRole("button", { name: /increment/i });
  fireEvent.click(btn);
  fireEvent.click(btn);
  expect(screen.getByText("Count: 2")).toBeInTheDocument();
});
`,
          }}
        />
      </Section>

      <Section icon={MousePointerClick} title="The user-event version (preferred)" step="Reference">
        <Prose>
          <p>
            In a real Jest setup, write it with <Code>user-event</Code> — it
            models a real user far more faithfully:
          </p>
        </Prose>
        <TestPlayground
          mode="annotated"
          editorHeight={240}
          files={{
            '/Counter.test.js': `import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Counter from "./Counter";

test("increments on each click", async () => {
  const user = userEvent.setup();
  render(<Counter />);
  const btn = screen.getByRole("button", { name: /increment/i });
  await user.click(btn);
  await user.click(btn);
  expect(screen.getByText("Count: 2")).toBeInTheDocument();
});
`,
          }}
          expected={`PASS  Counter.test.js
  ✓ increments on each click
user.click() fires the full pointer+focus+click sequence a real user triggers.`}
        />
      </Section>

      <Section icon={Sparkles} title="Quiz" step="Check yourself">
        <Quiz
          questions={[
            {
              id: 'q1',
              question: 'Why is user-event generally preferred over fireEvent?',
              options: [
                'It’s shorter to type',
                'It simulates realistic user interaction (focus, per-key events)',
                'fireEvent is deprecated',
                'It doesn’t need render()',
              ],
              answer: 1,
              explanation: 'user-event fires the full sequence of events a real user triggers, catching more bugs.',
            },
            {
              id: 'q2',
              question: 'What must you remember when using userEvent.setup() APIs?',
              options: ['They are synchronous', 'await them (they return Promises)', 'They auto-render', 'They mock the DOM'],
              answer: 1,
              explanation: 'user-event interactions are async — await user.click/type.',
            },
          ]}
        />
      </Section>
    </>
  )
}
