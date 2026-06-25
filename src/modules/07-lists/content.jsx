import { useState } from 'react'
import { List, BookOpen, Code2, Bug, Target, Sparkles } from 'lucide-react'
import { Section, Hook, Prose, KeyIdea, Code } from '../../components/learning/Section'
import { CodeBlock } from '../../components/learning/CodeBlock'
import { CodePlayground } from '../../components/learning/CodePlayground'
import { Challenge } from '../../components/learning/Challenge'
import { Quiz } from '../../components/learning/Quiz'
import { CommonMistake } from '../../components/learning/CommonMistake'
import { Button } from '../../components/ui/Button'

/*
 * Module 7 — Rendering Lists & Keys.
 * The headline is a real, reproducible "index-as-key" bug: type into the
 * uncontrolled inputs, remove the first row, and watch the index-keyed list
 * attach your text to the WRONG item while the id-keyed list stays correct.
 */
const INITIAL = [
  { id: 'a', label: 'Apple' },
  { id: 'b', label: 'Banana' },
  { id: 'c', label: 'Cherry' },
]

function KeyBugDemo() {
  const [items, setItems] = useState(INITIAL)

  const Row = ({ item }) => (
    <li className="flex items-center gap-2">
      <span className="w-16 text-sm text-content">{item.label}</span>
      <input
        // Uncontrolled on purpose: the DOM node holds its own text, so we can
        // see which node React reuses when the list changes.
        placeholder="type here"
        className="flex-1 rounded border border-line/10 bg-surface-800 px-2 py-1 text-sm text-content focus-ring"
      />
    </li>
  )

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="secondary" onClick={() => setItems((it) => it.slice(1))}>
          Remove first row
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setItems(INITIAL)}>
          Reset
        </Button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-rose-500/30 bg-surface-950 p-3">
          <p className="mb-2 text-xs font-semibold text-rose-300">key={'{index}'} — buggy</p>
          <ul className="space-y-2">
            {items.map((item, index) => (
              <Row key={index} item={item} />
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-emerald-500/30 bg-surface-950 p-3">
          <p className="mb-2 text-xs font-semibold text-emerald-300">key={'{item.id}'} — correct</p>
          <ul className="space-y-2">
            {items.map((item) => (
              <Row key={item.id} item={item} />
            ))}
          </ul>
        </div>
      </div>
      <p className="text-xs text-content-faint">
        Try it: type your initials into each box on both sides, then click
        “Remove first row”. On the left the text stays glued to its <em>position</em>{' '}
        (wrong item); on the right it correctly follows the <em>item</em>.
      </p>
    </div>
  )
}

export default function ListsModule() {
  return (
    <>
      <Section icon={List} title="Rendering many things" step="Hook">
        <Hook>
          You've got an array of 50 products from an API. You're not going to
          write 50 <Code>&lt;li&gt;</Code> tags by hand — so how do you turn data
          into UI?
        </Hook>
        <Prose>
          <p>
            With plain JavaScript: <Code>.map()</Code> over the array and return a
            React element for each item. React renders the resulting array.
          </p>
        </Prose>
      </Section>

      <Section icon={BookOpen} title=".map() + the key prop" step="Explanation">
        <CodeBlock
          filename="List.js"
          code={`const fruits = [
  { id: 1, name: "Apple" },
  { id: 2, name: "Banana" },
];

function List() {
  return (
    <ul>
      {fruits.map((fruit) => (
        <li key={fruit.id}>{fruit.name}</li>
        //   ▲ a stable, unique key
      ))}
    </ul>
  );
}`}
        />
        <KeyIdea title="Why keys matter">
          A <Code>key</Code> is how React identifies which item is which between
          renders. With stable keys it can update, insert and remove the right
          nodes. Use a <strong>stable unique id</strong> from your data — avoid
          the array <strong>index</strong> whenever the list can reorder, insert,
          or delete.
        </KeyIdea>
      </Section>

      <Section icon={Bug} title="See the index-key bug for real" step="Render Visualizer">
        <KeyBugDemo />
      </Section>

      <Section icon={Code2} title="Render a list yourself" step="Playground">
        <CodePlayground
          title="Lists & keys"
          files={{
            '/App.js': `export default function App() {
  const todos = [
    { id: 1, text: "Learn .map()" },
    { id: 2, text: "Use stable keys" },
    { id: 3, text: "Ship it 🚀" },
  ];

  return (
    <ul style={{ fontFamily: "sans-serif", padding: 16 }}>
      {todos.map((todo) => (
        <li key={todo.id}>{todo.text}</li>
      ))}
    </ul>
  );
}
`,
          }}
          editorHeight={280}
        />
      </Section>

      <Section icon={Target} title="Your turn" step="Challenge">
        <Challenge
          task={
            <>
              Add a fourth todo to the array, then display the{' '}
              <strong>count</strong> of todos above the list (e.g. "4 tasks").
              Keep using <Code>todo.id</Code> as the key.
            </>
          }
          checklist={[
            'A fourth item is added to the todos array',
            'The list shows all four items',
            'A count like "4 tasks" is displayed above the list',
            'Each <li> still uses key={todo.id}',
          ]}
          hint="Get the count with todos.length and render it: <p>{todos.length} tasks</p> before the <ul>."
        />
      </Section>

      <Section icon={Sparkles} title="Quiz" step="Check yourself">
        <Quiz
          questions={[
            {
              id: 'q1',
              question: 'What is the `key` prop for?',
              options: [
                'Styling each list item',
                'Helping React identify which item is which across renders',
                'Sorting the list automatically',
                'Making the list keyboard-accessible',
              ],
              answer: 1,
              explanation:
                'Keys give items a stable identity so React can correctly update/insert/remove them.',
            },
            {
              id: 'q2',
              question: 'When is using the array index as a key risky?',
              options: [
                'Always — index keys never work',
                'Only when the list is very long',
                'When the list can reorder, insert, or remove items',
                'Never — index is the recommended key',
              ],
              answer: 2,
              explanation:
                'If positions change, index keys make React reuse the wrong nodes (as the demo showed). Use stable ids.',
            },
          ]}
        />
      </Section>

      <CommonMistake title="Common mistake: array index as key" to="/debugging-gauntlet" linkLabel="Reproduce the index-key bug">
        {`Using the array index as a key on a reorderable list makes React reuse the wrong nodes — lost input/focus and subtle bugs. Use a stable id from your data.`}
      </CommonMistake>
    </>
  )
}
