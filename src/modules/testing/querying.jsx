import { Eye, BookOpen, FlaskConical, Sparkles } from 'lucide-react'
import { Section, Hook, Prose, KeyIdea, Code } from '../../components/learning/Section'
import { CodeBlock } from '../../components/learning/CodeBlock'
import { TestPlayground } from '../../components/testing/TestPlayground'
import { Quiz } from '../../components/learning/Quiz'

export default function Querying() {
  return (
    <>
      <Section icon={Eye} title="getBy, queryBy, findBy" step="Hook">
        <Hook>
          You want to assert something <em>isn't</em> on screen. You reach for
          <Code>getByText</Code> and your test crashes instead of failing nicely.
          Why — and which query should you have used?
        </Hook>
      </Section>

      <Section icon={BookOpen} title="The three families" step="Explanation">
        <CodeBlock
          filename="queries.js"
          code={`getBy*    → returns the element, THROWS if not found (use when it should exist)
queryBy*  → returns the element or null, never throws (use to assert ABSENCE)
findBy*   → returns a Promise, retries until it appears (use for ASYNC)

// assert presence
expect(screen.getByText("Saved")).toBeInTheDocument();
// assert absence  ✅ queryBy, not getBy
expect(screen.queryByText("Error")).not.toBeInTheDocument();
// wait for async
expect(await screen.findByText("Loaded")).toBeInTheDocument();`}
        />
        <KeyIdea title="Rule of thumb">
          Default to <Code>getBy</Code>. Use <Code>queryBy</Code> only to check
          something is absent. Use <Code>findBy</Code> when the thing appears
          asynchronously (after a fetch/timer).
        </KeyIdea>
      </Section>

      <Section icon={FlaskConical} title="All three, live" step="Playground">
        <TestPlayground
          editorHeight={380}
          files={{
            '/Box.js': `import { useState } from "react";
export default function Box() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button onClick={() => setOpen(true)}>Open</button>
      {open && <p>Now visible</p>}
    </div>
  );
}\n`,
            '/Box.test.js': `import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import Box from "./Box";

test("content is absent until opened", () => {
  render(<Box />);
  // queryBy → assert absence without throwing
  expect(screen.queryByText("Now visible")).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: /open/i }));
  // getBy → it should now exist
  expect(screen.getByText("Now visible")).toBeInTheDocument();
});
`,
          }}
        />
      </Section>

      <Section icon={Sparkles} title="Quiz" step="Check yourself">
        <Quiz
          questions={[
            {
              id: 'q1',
              question: 'Which query do you use to assert an element is NOT present?',
              options: ['getBy*', 'queryBy*', 'findBy*', 'any of them'],
              answer: 1,
              explanation: 'queryBy* returns null instead of throwing, so it pairs with .not.toBeInTheDocument().',
            },
            {
              id: 'q2',
              question: 'An element appears after an async fetch. Best query?',
              options: ['getByText', 'queryByText', 'findByText (awaited)', 'none work'],
              answer: 2,
              explanation: 'findBy* returns a Promise that retries until the element appears (or times out).',
            },
          ]}
        />
      </Section>
    </>
  )
}
