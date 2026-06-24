import { Rocket, BookOpen, Trophy, Eye, Code2, Sparkles } from 'lucide-react'
import { Section, Hook, Prose, KeyIdea, Code } from '../../components/learning/Section'
import { CodePlayground } from '../../components/learning/CodePlayground'
import { Quiz } from '../../components/learning/Quiz'

/*
 * Module 0 — Welcome.
 * Sets expectations: what React is, how this playground works, and how the
 * progress system rewards you. Intentionally light (no challenge) — it's the
 * on-ramp.
 */
export default function WelcomeModule() {
  return (
    <>
      <Section icon={Rocket} title="Welcome" step="Start here">
        <Hook>
          What if you could learn React the way you learn a video game — by
          playing, failing, and trying again — instead of just reading docs?
        </Hook>
        <Prose>
          <p>
            <strong>React</strong> is a JavaScript library for building user
            interfaces out of small, reusable pieces called{' '}
            <strong>components</strong>. You describe what the UI should look
            like for a given state, and React efficiently updates the screen
            when that state changes — you stop manually poking the DOM and start
            declaring what you want.
          </p>
          <p>
            This playground teaches React from zero to hooks through{' '}
            <em>learning by doing</em>. Every concept comes with live code you
            can edit, a way to <em>see</em> when React re-renders, and a quick
            quiz to make it stick.
          </p>
        </Prose>
      </Section>

      <Section icon={BookOpen} title="How each module works" step="The rhythm">
        <Prose>
          <p>Every lesson follows the same six-step flow, so you always know what's next:</p>
        </Prose>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { icon: Sparkles, t: '1. Hook', d: 'A question to spark curiosity before any theory.' },
            { icon: BookOpen, t: '2. Explanation', d: 'A short, jargon-light explanation with an analogy.' },
            { icon: Code2, t: '3. Live Playground', d: 'Editable code with an instant live preview.' },
            { icon: Eye, t: '4. Render Visualizer', d: 'Watch components flash exactly when they re-render.' },
            { icon: Trophy, t: '5. Mini Challenge', d: 'A small task with a self-check checklist.' },
            { icon: Sparkles, t: '6. Quiz', d: 'Instant feedback — and a little confetti when you nail it.' },
          ].map((s) => (
            <div key={s.t} className="rounded-xl border border-white/10 bg-surface-900 p-4">
              <s.icon size={18} className="mb-2 text-accent" />
              <p className="font-semibold text-slate-100">{s.t}</p>
              <p className="text-sm text-slate-400">{s.d}</p>
            </div>
          ))}
        </div>
        <KeyIdea title="The progress tracker">
          You earn <Code>XP</Code> for completing modules (+50), answering
          quizzes (+20), and finishing challenges (+30). XP fills your level bar
          and unlocks badges. Everything is saved in your browser via{' '}
          <Code>localStorage</Code>, so you can close the tab and pick up later.
        </KeyIdea>
      </Section>

      <Section icon={Code2} title="Try it now" step="Playground">
        <Prose>
          <p>
            Here's a live React component. Change the <Code>name</Code> value
            below and watch the preview update instantly — that's the whole loop
            you'll use throughout the course.
          </p>
        </Prose>
        <CodePlayground
          title="Your first edit"
          files={{
            '/App.js': `export default function App() {
  const name = "future React dev"; // 👈 change this string
  return <h1>Hello, {name}!</h1>;
}
`,
          }}
          editorHeight={200}
        />
      </Section>

      <Section icon={Sparkles} title="Quick check" step="Quiz">
        <Quiz
          questions={[
            {
              id: 'q1',
              question: 'In one line, what is React?',
              options: [
                'A database for storing user data',
                'A JavaScript library for building UIs from reusable components',
                'A CSS framework like Tailwind',
                'A programming language that replaces JavaScript',
              ],
              answer: 1,
              explanation:
                'React is a JS library focused on building user interfaces out of reusable components.',
            },
            {
              id: 'q2',
              question: 'Where is your learning progress saved?',
              options: [
                'On a remote server you must log into',
                "It isn't saved — it resets each visit",
                "In your browser's localStorage",
                'In a cookie that expires hourly',
              ],
              answer: 2,
              explanation:
                'Progress persists locally via localStorage, so it survives refreshes and revisits.',
            },
          ]}
        />
      </Section>
    </>
  )
}
