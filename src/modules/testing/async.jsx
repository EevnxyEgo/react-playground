import { Repeat, BookOpen, FlaskConical, Sparkles } from 'lucide-react'
import { Section, Hook, Prose, KeyIdea, Code } from '../../components/learning/Section'
import { CodeBlock } from '../../components/learning/CodeBlock'
import { TestPlayground } from '../../components/testing/TestPlayground'
import { Badge } from '../../components/ui/Badge'
import { Quiz } from '../../components/learning/Quiz'

/*
 * Reinforcement: tests a loading→success fetch flow like the v2 Challenge
 * Library's "fetch on mount" exercise.
 */
export default function AsyncTesting() {
  return (
    <>
      <Section icon={Repeat} title="Testing things that take time" step="Hook">
        <Hook>
          A component shows "Loading…", then the data arrives. If your test checks
          for the data immediately, it fails — the fetch hasn't resolved yet. How
          do you wait correctly (without arbitrary sleeps)?
        </Hook>
        <Badge tone="accent">Reinforcement — tests a fetch flow like the v2 Challenge Library</Badge>
      </Section>

      <Section icon={BookOpen} title="findBy* and waitFor" step="Explanation">
        <CodeBlock
          filename="async.js"
          code={`// findBy* retries until the element appears (or times out) — preferred
expect(await screen.findByText("Ada")).toBeInTheDocument();

// waitFor retries an assertion block
await waitFor(() => {
  expect(screen.getByText("Done")).toBeInTheDocument();
});

// assert a loading state disappears
await waitForElementToBeRemoved(() => screen.getByText("Loading…"));`}
        />
        <KeyIdea title="Never use fixed setTimeout in tests">
          Don't "sleep 1 second and hope." <Code>findBy</Code>/<Code>waitFor</Code>
          poll until the condition is met, so tests are both reliable and as fast
          as possible.
        </KeyIdea>
      </Section>

      <Section icon={FlaskConical} title="Live: loading → success" step="Playground">
        <TestPlayground
          editorHeight={440}
          files={{
            '/Users.js': `import { useState, useEffect } from "react";

// fake API resolving after a tick
const fetchUsers = () => new Promise((res) => setTimeout(() => res(["Ada", "Linus"]), 50));

export default function Users() {
  const [users, setUsers] = useState(null);
  useEffect(() => { let on = true; fetchUsers().then((u) => on && setUsers(u)); return () => (on = false); }, []);
  if (!users) return <p>Loading…</p>;
  return <ul>{users.map((u) => <li key={u}>{u}</li>)}</ul>;
}\n`,
            '/Users.test.js': `import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Users from "./Users";

test("shows loading, then the fetched users", async () => {
  render(<Users />);
  expect(screen.getByText("Loading…")).toBeInTheDocument();
  // findBy waits for the async result
  expect(await screen.findByText("Ada")).toBeInTheDocument();
  expect(screen.getByText("Linus")).toBeInTheDocument();
  expect(screen.queryByText("Loading…")).not.toBeInTheDocument();
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
              question: 'Best way to wait for async content to appear?',
              options: ['A fixed setTimeout', 'await findByText / waitFor', 'getByText immediately', 'It can’t be tested'],
              answer: 1,
              explanation: 'findBy*/waitFor poll until the condition holds — reliable and fast, no arbitrary sleeps.',
            },
            {
              id: 'q2',
              question: 'Why avoid fixed sleeps in tests?',
              options: ['They’re illegal', 'They make tests slow and flaky', 'They don’t compile', 'They’re fine actually'],
              answer: 1,
              explanation: 'Fixed waits are either too short (flaky) or too long (slow). Polling utilities fix both.',
            },
          ]}
        />
      </Section>
    </>
  )
}
