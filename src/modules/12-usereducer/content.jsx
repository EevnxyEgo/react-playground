import { useReducer } from 'react'
import { Workflow, GitCompare, Code2, Eye, Target, Sparkles } from 'lucide-react'
import { Section, Hook, Prose, KeyIdea, Code } from '../../components/learning/Section'
import { ComparisonTabs } from '../../components/learning/ComparisonTabs'
import { CodeBlock } from '../../components/learning/CodeBlock'
import { CodePlayground } from '../../components/learning/CodePlayground'
import { RenderFlashWrapper } from '../../components/learning/RenderFlashWrapper'
import { StateInspector } from '../../components/learning/StateInspector'
import { Challenge } from '../../components/learning/Challenge'
import { Quiz } from '../../components/learning/Quiz'
import { Button } from '../../components/ui/Button'

/*
 * Module 12 — useReducer.
 * For state with multiple sub-values that change together via clear "actions".
 * Live cart demo dispatches actions; StateInspector shows the resulting state.
 */
const PRODUCTS = [
  { id: 'apple', name: 'Apple', price: 2 },
  { id: 'bread', name: 'Bread', price: 3 },
]
const initialCart = { items: [], total: 0 }

function cartReducer(state, action) {
  switch (action.type) {
    case 'add':
      return {
        items: [...state.items, action.product.name],
        total: state.total + action.product.price,
      }
    case 'clear':
      return initialCart
    default:
      return state
  }
}

function CartDemo() {
  const [cart, dispatch] = useReducer(cartReducer, initialCart)
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <RenderFlashWrapper label="Cart (useReducer)">
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {PRODUCTS.map((p) => (
              <Button key={p.id} size="sm" onClick={() => dispatch({ type: 'add', product: p })}>
                Add {p.name} (${p.price})
              </Button>
            ))}
            <Button size="sm" variant="ghost" onClick={() => dispatch({ type: 'clear' })}>
              Clear
            </Button>
          </div>
          <p className="text-sm text-slate-300">
            {cart.items.length} item(s) · total{' '}
            <span className="font-mono text-accent">${cart.total}</span>
          </p>
        </div>
      </RenderFlashWrapper>
      <StateInspector data={cart} title="Cart state" />
    </div>
  )
}

export default function UseReducerModule() {
  return (
    <>
      <Section icon={Workflow} title="When useState gets crowded" step="Hook">
        <Hook>
          Your component has <Code>items</Code>, <Code>total</Code>,{' '}
          <Code>count</Code> — three useState calls that always change together on
          every "add to cart". Is there a tidier way to manage related state?
        </Hook>
        <Prose>
          <p>
            <Code>useReducer</Code> centralizes related state transitions into a
            single <strong>reducer</strong> function. Components just{' '}
            <Code>dispatch</Code> an <strong>action</strong> ("add", "clear"), and
            the reducer decides the next state. It's the same idea Redux is built
            on — but built into React.
          </p>
        </Prose>
      </Section>

      <Section icon={Code2} title="reducer + dispatch" step="Explanation">
        <CodeBlock
          filename="useReducer.js"
          code={`// A reducer: (currentState, action) => nextState
function reducer(state, action) {
  switch (action.type) {
    case "increment": return { count: state.count + 1 };
    case "reset":     return { count: 0 };
    default:          return state;
  }
}

const [state, dispatch] = useReducer(reducer, { count: 0 });

// Trigger a transition by dispatching an action:
dispatch({ type: "increment" });`}
        />
        <KeyIdea title="Reducers are pure">
          A reducer must be a <strong>pure function</strong>: given the same state
          and action it returns the same next state, with no side effects and no
          mutation. Always return a <em>new</em> object, never edit the old one.
        </KeyIdea>
      </Section>

      <Section icon={GitCompare} title="Stacked useState vs useReducer" step="Comparison">
        <ComparisonTabs
          defaultValue="reducer"
          tabs={[
            {
              value: 'usestate',
              label: 'Stacked useState',
              content: (
                <CodeBlock
                  filename="Cart.js"
                  code={`const [items, setItems] = useState([]);
const [total, setTotal] = useState(0);

function addItem(p) {
  setItems((prev) => [...prev, p.name]);
  setTotal((t) => t + p.price);   // must remember to update BOTH
}
// Easy to forget one; logic is scattered across handlers.`}
                />
              ),
            },
            {
              value: 'reducer',
              label: 'useReducer',
              badge: 'cleaner',
              content: (
                <CodeBlock
                  filename="Cart.js"
                  code={`function reducer(state, action) {
  switch (action.type) {
    case "add":
      return {
        items: [...state.items, action.p.name],
        total: state.total + action.p.price,
      };
    case "clear": return { items: [], total: 0 };
    default: return state;
  }
}

const [cart, dispatch] = useReducer(reducer, { items: [], total: 0 });
dispatch({ type: "add", p }); // all the logic lives in one place`}
                />
              ),
            },
          ]}
          note={
            <>
              Both work. Prefer <Code>useReducer</Code> when several values change
              together, when the next state depends on the previous, or when the
              update logic is getting complex — it keeps transitions in one
              testable place.
            </>
          }
        />
      </Section>

      <Section icon={Eye} title="Dispatch actions, watch state" step="Render Visualizer">
        <CartDemo />
      </Section>

      <Section icon={Code2} title="Build the cart" step="Playground">
        <CodePlayground
          title="useReducer cart"
          files={{
            '/App.js': `import { useReducer } from "react";

function reducer(state, action) {
  switch (action.type) {
    case "add":   return { count: state.count + 1, total: state.total + action.price };
    case "clear": return { count: 0, total: 0 };
    default:      return state;
  }
}

export default function App() {
  const [cart, dispatch] = useReducer(reducer, { count: 0, total: 0 });

  return (
    <div style={{ fontFamily: "sans-serif", padding: 16 }}>
      <p>Items: {cart.count} — Total: \${cart.total}</p>
      <button onClick={() => dispatch({ type: "add", price: 5 })}>Add $5 item</button>
      <button onClick={() => dispatch({ type: "clear" })} style={{ marginLeft: 8 }}>
        Clear
      </button>
    </div>
  );
}
`,
          }}
          editorHeight={340}
        />
      </Section>

      <Section icon={Target} title="Your turn" step="Challenge">
        <Challenge
          task={
            <>
              Add a new action type <Code>"remove"</Code> that subtracts one item
              and its price, and a button that dispatches it (don't let the totals
              go below zero).
            </>
          }
          checklist={[
            'The reducer handles a "remove" action',
            'It decrements count and subtracts the price',
            'It guards against negative values',
            'A Remove button dispatches { type: "remove", price }',
          ]}
          hint="In the reducer: case 'remove': return { count: Math.max(0, state.count - 1), total: Math.max(0, state.total - action.price) }."
        />
      </Section>

      <Section icon={Sparkles} title="Quiz" step="Check yourself">
        <Quiz
          questions={[
            {
              id: 'q1',
              question: 'What does a reducer function receive and return?',
              options: [
                'It receives props and returns JSX',
                'It receives (state, action) and returns the next state',
                'It receives an event and returns nothing',
                'It receives the dispatch function',
              ],
              answer: 1,
              explanation:
                'A reducer is (state, action) => nextState — a pure function describing each transition.',
            },
            {
              id: 'q2',
              question: 'How do you trigger a state change with useReducer?',
              options: [
                'Call setState',
                'Mutate the state object directly',
                'Call dispatch with an action object',
                'Return a new value from the component',
              ],
              answer: 2,
              explanation:
                'You dispatch({ type: ... }); the reducer computes the next state from it.',
            },
          ]}
        />
      </Section>
    </>
  )
}
