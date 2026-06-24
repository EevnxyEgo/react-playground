import { useState } from 'react'
import { Signpost, BookOpen, Code2, Eye, Target, Sparkles, Globe } from 'lucide-react'
import { Section, Hook, Prose, KeyIdea, Code } from '../../components/learning/Section'
import { CodeBlock } from '../../components/learning/CodeBlock'
import { CodePlayground } from '../../components/learning/CodePlayground'
import { Challenge } from '../../components/learning/Challenge'
import { Quiz } from '../../components/learning/Quiz'
import { Button } from '../../components/ui/Button'

/*
 * Module 17 — React Router Basics.
 * Routes/Link/useParams. The interactive demo is a tiny state-based router so
 * it's 100% reliable; the Sandpack uses the real react-router-dom.
 */
function MiniRouterDemo() {
  const [path, setPath] = useState('/')

  let view
  if (path === '/') view = <p>🏠 Home — welcome!</p>
  else if (path === '/about') view = <p>ℹ️ About — a tiny SPA router.</p>
  else if (path.startsWith('/user/')) {
    const id = path.split('/')[2]
    view = (
      <p>
        👤 User profile — <Code>useParams()</Code> would give{' '}
        <span className="font-mono text-accent">id = {id}</span>
      </p>
    )
  } else view = <p>404 — no route matched.</p>

  const link = (to, label) => (
    <Button
      size="sm"
      variant={path === to ? 'primary' : 'secondary'}
      onClick={() => setPath(to)}
    >
      {label}
    </Button>
  )

  return (
    <div className="rounded-xl border border-white/10 bg-surface-950 p-4">
      <div className="mb-3 flex flex-wrap gap-2">
        {link('/', 'Home')}
        {link('/about', 'About')}
        {link('/user/42', 'User 42')}
        {link('/user/ada', 'User ada')}
      </div>
      <div className="mb-2 flex items-center gap-2 rounded-md border border-white/10 bg-surface-900 px-3 py-1.5 font-mono text-xs text-slate-400">
        <Globe size={13} className="text-accent" /> myapp.com{path}
      </div>
      <div className="rounded-lg bg-surface-900 p-3 text-sm text-slate-200">{view}</div>
      <p className="mt-2 text-xs text-slate-500">
        Notice: the content swaps with no full-page reload — that's a Single Page App.
      </p>
    </div>
  )
}

export default function ReactRouterModule() {
  return (
    <>
      <Section icon={Signpost} title="Many pages, no reloads" step="Hook">
        <Hook>
          A real app has a home page, a profile page, a settings page… but React
          renders a single HTML file. So how do you get multiple "pages" and a
          working back button without the browser reloading every time?
        </Hook>
        <Prose>
          <p>
            With a client-side router. <strong>react-router-dom</strong> maps URL
            paths to components and swaps them in place — a{' '}
            <strong>Single Page App (SPA)</strong>. The URL changes, the right
            component renders, and there's no full reload. (This very playground
            uses it!)
          </p>
        </Prose>
      </Section>

      <Section icon={BookOpen} title="The core pieces" step="Explanation">
        <CodeBlock
          filename="router.js"
          code={`import { BrowserRouter, Routes, Route, Link, useParams } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      {/* Link = navigation without a page reload */}
      <nav>
        <Link to="/">Home</Link>
        <Link to="/user/42">User 42</Link>
      </nav>

      {/* Routes picks the FIRST matching Route */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user/:id" element={<User />} />  {/* :id is a param */}
        <Route path="*" element={<NotFound />} />       {/* catch-all */}
      </Routes>
    </BrowserRouter>
  );
}

function User() {
  const { id } = useParams();   // read the :id from the URL
  return <p>User #{id}</p>;
}`}
        />
        <KeyIdea title="Link, not <a>">
          Use <Code>&lt;Link to="…"&gt;</Code> instead of a plain{' '}
          <Code>&lt;a href&gt;</Code>. An anchor triggers a full page reload (and
          loses your app state); <Code>Link</Code> navigates instantly on the
          client. Use <Code>useNavigate()</Code> to navigate from code.
        </KeyIdea>
      </Section>

      <Section icon={Eye} title="SPA navigation in action" step="Render Visualizer">
        <MiniRouterDemo />
      </Section>

      <Section icon={Code2} title="Real react-router" step="Playground">
        <Prose>
          <p>
            This playground uses the actual <Code>react-router-dom</Code>. Click
            the links and watch the URL + view change. (It may take a moment to
            install the dependency the first time.)
          </p>
        </Prose>
        <CodePlayground
          title="react-router-dom"
          customSetup={{ dependencies: { 'react-router-dom': '6.28.0' } }}
          files={{
            '/App.js': `import { MemoryRouter, Routes, Route, Link, useParams } from "react-router-dom";

function Home() { return <h3>🏠 Home</h3>; }
function User() {
  const { id } = useParams();
  return <h3>👤 User #{id}</h3>;
}

export default function App() {
  return (
    <MemoryRouter>
      <div style={{ fontFamily: "sans-serif", padding: 16 }}>
        <nav style={{ display: "flex", gap: 8 }}>
          <Link to="/">Home</Link>
          <Link to="/user/1">User 1</Link>
          <Link to="/user/2">User 2</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/user/:id" element={<User />} />
          <Route path="*" element={<h3>404</h3>} />
        </Routes>
      </div>
    </MemoryRouter>
  );
}
`,
          }}
          editorHeight={400}
        />
      </Section>

      <Section icon={Target} title="Your turn" step="Challenge">
        <Challenge
          task={
            <>
              Add a new route <Code>/about</Code> rendering an <Code>About</Code>{' '}
              component, and a <Code>&lt;Link&gt;</Code> in the nav to reach it.
            </>
          }
          checklist={[
            'An About component exists',
            'A <Route path="/about" element={<About />} /> is added',
            'A <Link to="/about"> appears in the nav',
            'Clicking it shows the About view without a reload',
          ]}
          hint="Add both a <Link to='/about'>About</Link> in the nav and a matching <Route path='/about' element={<About/>} /> inside <Routes>."
        />
      </Section>

      <Section icon={Sparkles} title="Quiz" step="Check yourself">
        <Quiz
          questions={[
            {
              id: 'q1',
              question: 'Why use <Link> instead of a plain <a> tag?',
              options: [
                'They look different',
                '<Link> navigates on the client with no full page reload',
                '<a> doesn’t work in React at all',
                '<Link> is required for styling',
              ],
              answer: 1,
              explanation:
                '<Link> does client-side navigation (no reload, app state preserved); a plain <a> reloads the whole page.',
            },
            {
              id: 'q2',
              question: 'How do you read the `:id` from a route like /user/:id?',
              options: [
                'props.id',
                'useParams() → const { id } = useParams()',
                'useState(id)',
                'this.props.match.id only',
              ],
              answer: 1,
              explanation:
                'useParams() returns an object of the dynamic URL segments, e.g. { id }.',
            },
          ]}
        />
      </Section>
    </>
  )
}
