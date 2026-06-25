import { useState } from 'react'
import { GitBranch, BookOpen, Code2, Eye, Target, Sparkles } from 'lucide-react'
import { Section, Hook, Prose, KeyIdea, Code } from '../../components/learning/Section'
import { CodeBlock } from '../../components/learning/CodeBlock'
import { CodePlayground } from '../../components/learning/CodePlayground'
import { RenderFlashWrapper } from '../../components/learning/RenderFlashWrapper'
import { Challenge } from '../../components/learning/Challenge'
import { Quiz } from '../../components/learning/Quiz'
import { CommonMistake } from '../../components/learning/CommonMistake'
import { Button } from '../../components/ui/Button'

/*
 * Module 6 — Conditional Rendering.
 * &&, ternary, early return, switch — plus the classic `0 &&` gotcha.
 */
function ToggleDemo() {
  const [show, setShow] = useState(true)
  return (
    <RenderFlashWrapper label="Show/hide toggle">
      <div className="space-y-3">
        <Button size="sm" onClick={() => setShow((s) => !s)}>
          {show ? 'Hide' : 'Show'} the secret
        </Button>
        {show ? (
          <p className="rounded-lg bg-accent/10 p-3 text-accent">
            🔒 The secret is: React makes this easy.
          </p>
        ) : (
          <p className="text-sm text-content-faint">(hidden)</p>
        )}
      </div>
    </RenderFlashWrapper>
  )
}

export default function ConditionalModule() {
  return (
    <>
      <Section icon={GitBranch} title="Show this, not that" step="Hook">
        <Hook>
          You want a "Log out" button for signed-in users and a "Log in" button
          for everyone else — in the same spot. How do you render different UI
          based on a condition?
        </Hook>
        <Prose>
          <p>
            JSX has no <Code>if</Code> inside <Code>{'{ }'}</Code> (that's a
            statement). Instead you use JavaScript <strong>expressions</strong>{' '}
            that evaluate to UI. There are four common patterns.
          </p>
        </Prose>
      </Section>

      <Section icon={BookOpen} title="Four ways to branch" step="Explanation">
        <CodeBlock
          filename="patterns.js"
          code={`// 1) Logical && — render something or nothing
{isLoggedIn && <LogoutButton />}

// 2) Ternary — render one thing or another
{isLoggedIn ? <LogoutButton /> : <LoginButton />}

// 3) Early return — bail out before the main JSX
if (loading) return <Spinner />;
return <Profile />;

// 4) Assign to a variable first (great for switch/case)
let content;
switch (status) {
  case "loading": content = <Spinner />; break;
  case "error":   content = <Error />;   break;
  default:        content = <Data />;
}
return <div>{content}</div>;`}
        />
        <KeyIdea title="The 0 gotcha">
          <Code>{'{count && <Badge/>}'}</Code> renders <strong>0</strong> on
          screen when <Code>count</Code> is 0, because <Code>0</Code> is falsy
          and gets returned as-is. Use <Code>{'{count > 0 && <Badge/>}'}</Code>{' '}
          or a ternary instead.
        </KeyIdea>
      </Section>

      <Section icon={Code2} title="Show/hide toggle" step="Playground">
        <CodePlayground
          title="Conditional rendering"
          files={{
            '/App.js': `import { useState } from "react";

export default function App() {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ fontFamily: "sans-serif", padding: 16 }}>
      <button onClick={() => setOpen(!open)}>
        {open ? "Hide details" : "Show details"}
      </button>

      {open && (
        <p>👀 Now you see me. Toggle again to hide.</p>
      )}
    </div>
  );
}
`,
          }}
          editorHeight={280}
        />
      </Section>

      <Section icon={Eye} title="Conditions + re-render" step="Render Visualizer">
        <Prose>
          <p>Toggle below — the component re-renders (flash) and swaps which branch shows.</p>
        </Prose>
        <ToggleDemo />
      </Section>

      <Section icon={Target} title="Your turn" step="Challenge">
        <Challenge
          task={
            <>
              Add a second piece of state, <Code>liked</Code>, and a button that
              toggles it. Use a <strong>ternary</strong> to show either{' '}
              <Code>❤️ Liked</Code> or <Code>🤍 Like</Code> on the button.
            </>
          }
          checklist={[
            'A new boolean state `liked` exists',
            'A button toggles liked on click',
            'A ternary chooses the button label/emoji based on liked',
            'The label updates when you click',
          ]}
          hint="const [liked, setLiked] = useState(false); then {liked ? '❤️ Liked' : '🤍 Like'} as the button content."
        />
      </Section>

      <Section icon={Sparkles} title="Quiz" step="Check yourself">
        <Quiz
          questions={[
            {
              id: 'q1',
              question: 'What renders for `{items.length && <List />}` when the list is empty?',
              options: [
                'Nothing (empty)',
                'The number 0 appears on screen',
                'It throws an error',
                'The <List /> renders anyway',
              ],
              answer: 1,
              explanation:
                '0 is falsy and is returned as-is, so a literal 0 shows. Use items.length > 0 && … instead.',
            },
            {
              id: 'q2',
              question: 'Which pattern renders one of TWO options?',
              options: [
                'The && operator',
                'A ternary: condition ? <A /> : <B />',
                'A plain if statement inside JSX braces',
                'A for loop',
              ],
              answer: 1,
              explanation:
                '&& renders something-or-nothing; a ternary picks between two results.',
            },
          ]}
        />
      </Section>

      <CommonMistake title="Common mistake: the falsy-0 render" to="/debugging-gauntlet" linkLabel="See the bug">
        {`When a count is 0, a logical-AND render shows a literal 0 on screen (0 is falsy and returned as-is). Guard with count greater than 0, or use a ternary.`}
      </CommonMistake>
    </>
  )
}
