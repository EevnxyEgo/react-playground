import { FlaskConical } from 'lucide-react'
import { PageTransition } from '../components/layout/PageTransition'
import { CodePlayground } from '../components/learning/CodePlayground'

// Free-form sandbox: a blank-ish Sandpack with no instructions, purely for
// experimentation. Edits live only in the session (intentionally not saved).
const STARTER = {
  '/App.js': `export default function App() {
  // 🧪 This is your playground. Try anything!
  const name = "React explorer";
  return (
    <div style={{ fontFamily: "sans-serif", padding: 24 }}>
      <h1>Hello, {name} 👋</h1>
      <p>Edit this code and watch the preview update instantly.</p>
    </div>
  );
}
`,
}

export default function Sandbox() {
  return (
    <PageTransition className="space-y-4">
      <div className="flex items-center gap-3">
        <FlaskConical className="text-accent" size={26} />
        <div>
          <h1 className="text-3xl font-bold">Free Sandbox</h1>
          <p className="text-slate-400">
            No lessons, no rules — just you and React. Experiment freely.
          </p>
        </div>
      </div>

      <CodePlayground
        title="Sandbox"
        files={STARTER}
        showConsole
        editorHeight={460}
      />
    </PageTransition>
  )
}
