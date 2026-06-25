import { Layers, BookOpen, FlaskConical, Sparkles } from 'lucide-react'
import { Section, Hook, Prose, KeyIdea, Code } from '../../components/learning/Section'
import { TestPlayground } from '../../components/testing/TestPlayground'
import { CommonMistake } from '../../components/learning/CommonMistake'
import { Quiz } from '../../components/learning/Quiz'

export default function Snapshots() {
  return (
    <>
      <Section icon={Layers} title="Freeze the output, catch the change" step="Hook">
        <Hook>
          What if a test could just record what a component renders, and shout the
          next time that output changes unexpectedly? That's a snapshot test — but
          they're a double-edged sword.
        </Hook>
      </Section>

      <Section icon={BookOpen} title="How snapshots work" step="Explanation">
        <Prose>
          <p>
            <Code>expect(container).toMatchSnapshot()</Code> serializes the rendered
            output to a <Code>.snap</Code> file on the first run. On later runs it
            compares against that saved snapshot; a difference fails the test until
            you review and update it (<Code>jest -u</Code>).
          </p>
        </Prose>
        <KeyIdea title="Good for: small, stable output">
          Snapshots shine for tiny presentational components or serialized data
          where any change is meaningful and easy to eyeball in the diff.
        </KeyIdea>
        <CommonMistake title="Common mistake: snapshotting everything" to="/testing/rtl-philosophy" linkLabel="Prefer behavior assertions">
          Huge snapshots of whole pages become noise: every trivial markup tweak
          fails them, so people blindly run <Code>-u</Code> and the test stops
          catching real bugs. Prefer explicit behavior assertions; reserve
          snapshots for small, stable output.
        </CommonMistake>
      </Section>

      <Section icon={FlaskConical} title="Snapshot (annotated)" step="Reference">
        <Prose>
          <p>
            Snapshot files are written to disk, so we show this one as annotated
            reference rather than running it live in the browser sandbox:
          </p>
        </Prose>
        <TestPlayground
          mode="annotated"
          editorHeight={260}
          files={{
            '/Badge.test.js': `import { render } from "@testing-library/react";
import Badge from "./Badge";

test("matches snapshot", () => {
  const { container } = render(<Badge tone="success">Live</Badge>);
  expect(container.firstChild).toMatchSnapshot();
});
`,
          }}
          expected={`First run → writes __snapshots__/Badge.test.js.snap:

exports[\`matches snapshot 1\`] = \`
<span class="badge badge--success">Live</span>
\`;

Later runs compare against it. A diff fails the test until you review + update.`}
        />
      </Section>

      <Section icon={Sparkles} title="Quiz" step="Check yourself">
        <Quiz
          questions={[
            {
              id: 'q1',
              question: 'A snapshot test fails. The correct first step is to…',
              options: [
                'Immediately run jest -u to update it',
                'Review the diff to decide if the change was intended',
                'Delete the test',
                'Ignore it',
              ],
              answer: 1,
              explanation: 'Always review the diff — blindly updating defeats the purpose of the snapshot.',
            },
            {
              id: 'q2',
              question: 'Snapshots are best used for…',
              options: ['Whole pages', 'Small, stable presentational output', 'Async flows', 'User interactions'],
              answer: 1,
              explanation: 'Large snapshots become noisy; small stable output keeps diffs meaningful.',
            },
          ]}
        />
      </Section>
    </>
  )
}
