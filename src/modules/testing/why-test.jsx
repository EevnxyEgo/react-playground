import { Target, BookOpen, FlaskConical, Sparkles } from 'lucide-react'
import { Section, Hook, Prose, KeyIdea, Code } from '../../components/learning/Section'
import { TestPlayground } from '../../components/testing/TestPlayground'
import { Quiz } from '../../components/learning/Quiz'

export default function WhyTest() {
  return (
    <>
      <Section icon={Target} title="How do you know it still works?" step="Hook">
        <Hook>
          You ship a feature today. Next week you refactor something nearby. How
          do you know you didn't quietly break the first feature — without clicking
          through the whole app by hand every time?
        </Hook>
        <Prose>
          <p>
            Automated <strong>tests</strong> are how. They encode "this should
            work like X" so a machine re-checks it on every change. In interviews
            and take-homes, "how would you test this?" is almost guaranteed.
          </p>
        </Prose>
      </Section>

      <Section icon={BookOpen} title="The Testing Pyramid" step="Explanation">
        <Prose>
          <p>Tests come in layers, trading speed/number for realism:</p>
        </Prose>
        <div className="space-y-2">
          {[
            { w: 'w-1/3', label: 'E2E (Cypress/Playwright)', note: 'few · slow · most realistic', tone: 'bg-rose-500/20 text-rose-200' },
            { w: 'w-2/3', label: 'Integration / component (RTL)', note: 'some · medium · realistic enough', tone: 'bg-amber-500/20 text-amber-200' },
            { w: 'w-full', label: 'Unit (Jest)', note: 'many · fast · isolated', tone: 'bg-emerald-500/20 text-emerald-200' },
          ].map((row) => (
            <div key={row.label} className="flex justify-center">
              <div className={`${row.w} rounded-lg ${row.tone} px-3 py-2 text-center text-sm`}>
                <span className="font-semibold">{row.label}</span>
                <span className="block text-xs opacity-80">{row.note}</span>
              </div>
            </div>
          ))}
        </div>
        <KeyIdea title="Test behavior, not implementation">
          Good component tests assert <em>what the user sees and does</em> ("after
          clicking, the count shows 1"), not internal details ("state variable
          equals 1"). That way you can refactor freely and the tests still pass.
        </KeyIdea>
      </Section>

      <Section icon={FlaskConical} title="A test, live" step="Playground">
        <Prose>
          <p>
            This whole track runs tests <strong>live in your browser</strong>. Here's a
            trivial one — edit the expectation and watch it pass or fail.
          </p>
        </Prose>
        <TestPlayground
          editorHeight={300}
          files={{
            '/math.js': `export const add = (a, b) => a + b;\n`,
            '/math.test.js': `import { add } from "./math";

test("adds two numbers", () => {
  expect(add(2, 3)).toBe(5); // try changing 5 to 6
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
              question: 'Where do React component tests mostly sit on the pyramid?',
              options: ['End-to-end (top)', 'Integration/component (middle)', 'They aren’t tests', 'Manual QA'],
              answer: 1,
              explanation: 'RTL component tests render real components and assert behavior — integration-flavored, in the middle.',
            },
            {
              id: 'q2',
              question: '“Test behavior, not implementation” means…',
              options: [
                'Assert internal state variables directly',
                'Assert what the user sees/does, so refactors don’t break tests',
                'Only write end-to-end tests',
                'Never test at all',
              ],
              answer: 1,
              explanation: 'Testing observable behavior keeps tests resilient to internal refactors.',
            },
          ]}
        />
      </Section>
    </>
  )
}
