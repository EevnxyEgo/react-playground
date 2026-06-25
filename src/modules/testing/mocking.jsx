import { Network, BookOpen, FlaskConical, Sparkles } from 'lucide-react'
import { Section, Hook, Prose, KeyIdea, Code } from '../../components/learning/Section'
import { CodeBlock } from '../../components/learning/CodeBlock'
import { TestPlayground } from '../../components/testing/TestPlayground'
import { Quiz } from '../../components/learning/Quiz'

export default function Mocking() {
  return (
    <>
      <Section icon={Network} title="Tests shouldn't hit the real network" step="Hook">
        <Hook>
          Your component fetches from an API. You don't want tests making real
          network calls (slow, flaky, offline-breaking). How do you fake the API
          and still verify your component reacts correctly?
        </Hook>
      </Section>

      <Section icon={BookOpen} title="jest.fn and jest.mock" step="Explanation">
        <CodeBlock
          filename="mocking.js"
          code={`// jest.fn(): a spy you control — assert it was called, and with what
const onSave = jest.fn();
render(<Form onSave={onSave} />);
// ...interact...
expect(onSave).toHaveBeenCalledTimes(1);
expect(onSave).toHaveBeenCalledWith({ name: "Ada" });

// jest.mock(): replace a whole module (e.g. an API client)
jest.mock("./api");
import { getUser } from "./api";
getUser.mockResolvedValue({ name: "Ada" });`}
        />
        <KeyIdea title="Inject or mock the boundary">
          Mock at the edges — the network/API module — not your own component's
          logic. Even simpler: pass the dependency in as a prop (dependency
          injection) so the test supplies a fake.
        </KeyIdea>
      </Section>

      <Section icon={FlaskConical} title="Live: spy on a callback" step="Playground">
        <Prose>
          <p>
            A reliable, framework-agnostic mock: a <Code>jest.fn()</Code> spy
            passed in as a prop. Assert it fired with the right argument.
          </p>
        </Prose>
        <TestPlayground
          editorHeight={400}
          files={{
            '/SaveButton.js': `export default function SaveButton({ onSave }) {
  return <button onClick={() => onSave({ name: "Ada" })}>Save</button>;
}\n`,
            '/SaveButton.test.js': `import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import SaveButton from "./SaveButton";

test("calls onSave with the payload when clicked", () => {
  const onSave = jest.fn();              // the mock/spy
  render(<SaveButton onSave={onSave} />);
  fireEvent.click(screen.getByRole("button", { name: /save/i }));
  expect(onSave).toHaveBeenCalledTimes(1);
  expect(onSave).toHaveBeenCalledWith({ name: "Ada" });
});
`,
          }}
        />
      </Section>

      <Section icon={Network} title="Mocking a module (reference)" step="Annotated">
        <Prose>
          <p>
            For mocking an imported API module, <Code>jest.mock</Code> is the tool.
            Here's the canonical pattern (shown as reference — module mocking is
            best run in a full Jest setup):
          </p>
        </Prose>
        <TestPlayground
          mode="annotated"
          editorHeight={300}
          files={{
            '/Profile.test.js': `import { render, screen } from "@testing-library/react";
import Profile from "./Profile";
import { getUser } from "./api";

jest.mock("./api"); // auto-mock the module

test("renders the fetched user", async () => {
  getUser.mockResolvedValue({ name: "Ada" });
  render(<Profile id={1} />);
  expect(await screen.findByText("Ada")).toBeInTheDocument();
  expect(getUser).toHaveBeenCalledWith(1);
});
`,
          }}
          expected={`PASS  Profile.test.js
  ✓ renders the fetched user
getUser is replaced by an auto-mock; mockResolvedValue controls what it returns.`}
        />
      </Section>

      <Section icon={Sparkles} title="Quiz" step="Check yourself">
        <Quiz
          questions={[
            {
              id: 'q1',
              question: 'What does jest.fn() give you?',
              options: ['A real network call', 'A spy you can assert was called (and with what)', 'A snapshot', 'A DOM node'],
              answer: 1,
              explanation: 'jest.fn() is a mock function; assert toHaveBeenCalled / toHaveBeenCalledWith.',
            },
            {
              id: 'q2',
              question: 'Where should you mock in a component test?',
              options: ['Your component’s own logic', 'The boundary (API/module/network)', 'React itself', 'Nothing, ever'],
              answer: 1,
              explanation: 'Mock external boundaries so you test your component, not the network.',
            },
          ]}
        />
      </Section>
    </>
  )
}
