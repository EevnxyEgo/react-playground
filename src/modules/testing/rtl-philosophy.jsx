import { Brain, BookOpen, FlaskConical, Sparkles } from 'lucide-react'
import { Section, Hook, Prose, KeyIdea, Code } from '../../components/learning/Section'
import { TestPlayground } from '../../components/testing/TestPlayground'
import { CommonMistake } from '../../components/learning/CommonMistake'
import { Quiz } from '../../components/learning/Quiz'

export default function RtlPhilosophy() {
  return (
    <>
      <Section icon={Brain} title="Test like a user, not like a robot" step="Hook">
        <Hook>
          Two tests can check the "same" thing. One breaks every time you rename a
          CSS class; the other survives any refactor as long as the UI still works.
          What's the difference?
        </Hook>
        <Prose>
          <p>
            React Testing Library's guiding principle: <em>“The more your tests
            resemble the way your software is used, the more confidence they give
            you.”</em> Query the screen the way a <strong>user</strong> (or screen
            reader) would — by role, label and visible text — not by internal
            details like class names or component state.
          </p>
        </Prose>
      </Section>

      <Section icon={BookOpen} title="Why query by role/text/label" step="Explanation">
        <Prose>
          <p>
            Querying by <Code>getByRole('button', {'{ name: /save/i }'})</Code> tests
            what the user perceives <em>and</em> nudges you toward accessible
            markup. Querying by <Code>.querySelector('.btn-primary')</Code> couples
            your test to styling that has nothing to do with behavior.
          </p>
        </Prose>
        <KeyIdea title="Bonus: accessibility for free">
          Because role/label queries depend on accessible names, tests written
          this way fail when your markup isn't accessible — quietly pushing you
          toward better HTML.
        </KeyIdea>
      </Section>

      <Section icon={FlaskConical} title="Good queries, live" step="Playground">
        <TestPlayground
          editorHeight={360}
          files={{
            '/Greeting.js': `export default function Greeting({ name }) {
  return (
    <section>
      <h1>Welcome, {name}!</h1>
      <button type="button">Sign out</button>
    </section>
  );
}\n`,
            '/Greeting.test.js': `import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Greeting from "./Greeting";

test("greets the user by name and shows a sign-out button", () => {
  render(<Greeting name="Ada" />);
  // by visible text / heading role — like a user reads it
  expect(screen.getByRole("heading", { name: /welcome, ada/i })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /sign out/i })).toBeInTheDocument();
});
`,
          }}
        />
        <CommonMistake to="/debugging-gauntlet">
          Testing by implementation detail (asserting state values or CSS classes)
          makes tests brittle — they break on harmless refactors. Prefer
          role/text/label queries. (Related brittleness shows up in the Debugging
          Gauntlet's mutation/key bugs.)
        </CommonMistake>
      </Section>

      <Section icon={Sparkles} title="Quiz" step="Check yourself">
        <Quiz
          questions={[
            {
              id: 'q1',
              question: 'RTL encourages you to query elements by…',
              options: ['CSS class names', 'Internal component state', 'Role, label and visible text', 'The DOM index'],
              answer: 2,
              explanation: 'Querying the way a user perceives the UI makes tests resilient and accessibility-aware.',
            },
            {
              id: 'q2',
              question: 'A test that breaks when you rename a CSS class is…',
              options: ['Testing behavior', 'Testing implementation detail (brittle)', 'An integration test', 'Ideal'],
              answer: 1,
              explanation: 'Coupling to class names tests implementation, not behavior — brittle.',
            },
          ]}
        />
      </Section>
    </>
  )
}
