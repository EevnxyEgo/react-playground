import { Code2, AlertTriangle, BookOpen, Target, Sparkles, CheckCircle2 } from 'lucide-react'
import { Section, Hook, Prose, KeyIdea, Code } from '../../components/learning/Section'
import { CodeBlock } from '../../components/learning/CodeBlock'
import { CodePlayground } from '../../components/learning/CodePlayground'
import { Challenge } from '../../components/learning/Challenge'
import { Quiz } from '../../components/learning/Quiz'

/*
 * Module 2 — JSX.
 * Focuses on the rules that trip up beginners, using a deliberately broken
 * playground so learners read React's *real* error messages, then fix them.
 */
export default function JsxModule() {
  return (
    <>
      <Section icon={Code2} title="HTML… inside JavaScript?" step="Hook">
        <Hook>
          React code is full of things that look like HTML sitting right inside
          JavaScript. It's <em>almost</em> HTML — but <Code>class</Code> breaks,
          and returning two tags throws an error. What are the rules?
        </Hook>
        <Prose>
          <p>
            That HTML-looking syntax is <strong>JSX</strong>. It's not a string
            and not HTML — it's syntax sugar that compiles to{' '}
            <Code>React.createElement(...)</Code> calls. Because it becomes
            JavaScript, it has to play by JavaScript's rules.
          </p>
        </Prose>
      </Section>

      <Section icon={BookOpen} title="The five rules of JSX" step="Explanation">
        <div className="grid gap-3">
          {[
            ['Return one root element', 'Wrap siblings in a parent or an empty <>…</> Fragment.'],
            ['camelCase attributes', 'onclick → onClick, tabindex → tabIndex.'],
            ['className, not class', '`class` is a reserved word in JavaScript.'],
            ['Embed JS with { }', 'Put any JS expression in braces: {user.name}, {2 + 2}.'],
            ['Close every tag', 'Even void tags: <img />, <br />, <input />.'],
          ].map(([t, d]) => (
            <div key={t} className="flex items-start gap-2 rounded-lg border border-line/10 bg-surface-900 p-3">
              <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-accent" />
              <p className="text-sm text-content">
                <strong className="text-content-strong">{t}</strong> — {d}
              </p>
            </div>
          ))}
        </div>
        <KeyIdea title="Expressions, not statements">
          Inside <Code>{'{ }'}</Code> you can put any JS <em>expression</em> (it
          produces a value) but not a <em>statement</em> like <Code>if</Code> or{' '}
          <Code>for</Code>. Use a ternary or <Code>.map()</Code> instead.
        </KeyIdea>
      </Section>

      <Section icon={AlertTriangle} title="Read the real error messages" step="Playground">
        <Prose>
          <p>
            The code below is <strong>intentionally broken</strong> in three
            ways. Run it and read React's actual error, then click{' '}
            <strong>Show Solution</strong> to compare.
          </p>
        </Prose>
        <CodePlayground
          title="Broken JSX — fix it"
          files={{
            '/App.js': `export default function App() {
  const user = "Sam";

  // ❌ Three problems hide in here:
  return (
    <h1 class="title">Hello</h1>
    <p>Welcome, user</p>
    <img src="https://react.dev/favicon.ico">
  );
}
`,
          }}
          solution={{
            '/App.js': `export default function App() {
  const user = "Sam";

  // ✅ Fixed: one root (Fragment), className, {embedded JS}, closed <img />
  return (
    <>
      <h1 className="title">Hello</h1>
      <p>Welcome, {user}</p>
      <img src="https://react.dev/favicon.ico" alt="React" />
    </>
  );
}
`,
          }}
          editorHeight={300}
        />
      </Section>

      <Section icon={Code2} title="Embedding JavaScript" step="More practice">
        <Prose>
          <p>Anything in braces is evaluated as JavaScript. Try editing the values:</p>
        </Prose>
        <CodePlayground
          title="Braces = JavaScript"
          files={{
            '/App.js': `export default function App() {
  const name = "world";
  const hour = new Date().getHours();

  return (
    <div style={{ fontFamily: "sans-serif", padding: 16 }}>
      <h1>Hello, {name}! 👋</h1>
      <p>2 + 2 = {2 + 2}</p>
      <p>{hour < 12 ? "Good morning" : "Good afternoon"}</p>
    </div>
  );
}
`,
          }}
          editorHeight={260}
        />
      </Section>

      <Section icon={Target} title="Your turn" step="Challenge">
        <Challenge
          task={
            <>
              In the broken playground, fix all three issues so it renders without
              errors: wrap the elements in a Fragment, change <Code>class</Code> to{' '}
              <Code>className</Code>, show the real <Code>user</Code> value with{' '}
              braces, and close the <Code>&lt;img /&gt;</Code> tag.
            </>
          }
          checklist={[
            'Everything is wrapped in a single root / Fragment',
            'class is changed to className',
            '{user} is embedded with braces (shows "Sam")',
            'The <img /> tag is self-closed and has an alt',
            'The preview renders with no error',
          ]}
          hint="An empty Fragment <>…</> is the lightest way to return multiple elements without adding an extra wrapper div."
        />
      </Section>

      <Section icon={Sparkles} title="Quiz" step="Check yourself">
        <Quiz
          questions={[
            {
              id: 'q1',
              question: 'Why does JSX use `className` instead of `class`?',
              options: [
                'React renames it for performance',
                '`class` is a reserved keyword in JavaScript',
                'class only works on class components',
                'It’s purely a style preference',
              ],
              answer: 1,
              explanation:
                'JSX compiles to JS, and `class` is a reserved word there, so React uses `className`.',
            },
            {
              id: 'q2',
              question: 'How many root elements can a component return at the top level?',
              options: [
                'Exactly one (a Fragment counts as one)',
                'Up to three',
                'Any number, separated by commas',
                'Two: one visible and one hidden',
              ],
              answer: 0,
              explanation:
                'A component returns a single root. Wrap multiple siblings in a parent element or an empty <>…</> Fragment.',
            },
          ]}
        />
      </Section>
    </>
  )
}
