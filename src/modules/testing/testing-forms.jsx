import { FormInput, BookOpen, FlaskConical, Target, Sparkles } from 'lucide-react'
import { Section, Hook, Prose, KeyIdea, Code } from '../../components/learning/Section'
import { TestPlayground } from '../../components/testing/TestPlayground'
import { Challenge } from '../../components/learning/Challenge'
import { Quiz } from '../../components/learning/Quiz'
import { Badge } from '../../components/ui/Badge'

/*
 * Reinforcement exercise (DoD 1.3): tests a validated form like the one from the
 * v2 Challenge Library, instead of an isolated throwaway component.
 */
export default function TestingForms() {
  return (
    <>
      <Section icon={FormInput} title="Testing a real form" step="Hook">
        <Hook>
          A signup form should block submit until it's valid and show errors
          inline. How do you prove that with a test, the way a user would
          experience it?
        </Hook>
        <Badge tone="accent">Reinforcement — tests a form like the v2 Challenge Library’s</Badge>
      </Section>

      <Section icon={BookOpen} title="What to assert" step="Explanation">
        <Prose>
          <p>
            For forms, assert the <strong>user-visible outcomes</strong>: that
            typing updates the field, that an invalid value shows an error message,
            and that the submit button is disabled/enabled appropriately. Query
            inputs by their label with <Code>getByLabelText</Code>.
          </p>
        </Prose>
        <KeyIdea title="Label your inputs">
          <Code>getByLabelText</Code> only works if inputs are associated with a
          <Code>&lt;label&gt;</Code> (via htmlFor/id or wrapping). Testing nudges
          you toward accessible forms.
        </KeyIdea>
      </Section>

      <Section icon={FlaskConical} title="Live: validation behavior" step="Playground">
        <TestPlayground
          editorHeight={440}
          files={{
            '/SignupForm.js': `import { useState } from "react";
export default function SignupForm() {
  const [email, setEmail] = useState("");
  const valid = /\\S+@\\S+\\.\\S+/.test(email);
  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <label htmlFor="email">Email</label>
      <input id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      {!valid && email.length > 0 && <p role="alert">Enter a valid email</p>}
      <button type="submit" disabled={!valid}>Sign up</button>
    </form>
  );
}\n`,
            '/SignupForm.test.js': `import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import SignupForm from "./SignupForm";

test("submit is disabled until the email is valid; error shows otherwise", () => {
  render(<SignupForm />);
  const submit = screen.getByRole("button", { name: /sign up/i });
  const email = screen.getByLabelText(/email/i);
  expect(submit).toBeDisabled();

  fireEvent.change(email, { target: { value: "nope" } });
  expect(screen.getByRole("alert")).toHaveTextContent(/valid email/i);
  expect(submit).toBeDisabled();

  fireEvent.change(email, { target: { value: "ada@dev.com" } });
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  expect(submit).toBeEnabled();
});
`,
          }}
        />
      </Section>

      <Section icon={Target} title="Your turn" step="Challenge">
        <Challenge
          task={
            <>
              Add a required <Code>name</Code> field to the form and a test
              asserting submit stays disabled until both name and a valid email are
              filled in.
            </>
          }
          checklist={[
            'A labeled name input is added',
            'Submit requires both name and valid email',
            'A test types into both fields and asserts the button enables',
            'All tests pass',
          ]}
          hint="Query the new field with getByLabelText(/name/i), type into it, and assert expect(submit).toBeEnabled()."
        />
      </Section>

      <Section icon={Sparkles} title="Quiz" step="Check yourself">
        <Quiz
          questions={[
            {
              id: 'q1',
              question: 'Which query finds an input by its <label> text?',
              options: ['getByText', 'getByLabelText', 'getByRole("input")', 'getByPlaceholder only'],
              answer: 1,
              explanation: 'getByLabelText finds form controls via their associated label — the accessible way.',
            },
            {
              id: 'q2',
              question: 'A good matcher to assert a button is not clickable is…',
              options: ['toBeVisible', 'toBeDisabled', 'toBeNull', 'toHaveClass("disabled")'],
              answer: 1,
              explanation: 'toBeDisabled (from jest-dom) asserts the actual disabled state, not a class name.',
            },
          ]}
        />
      </Section>
    </>
  )
}
