// Minimal app shell — replaced with the full layout + routes in a later step.
// For now it just proves the Vite + Tailwind + React 18 toolchain works.
export default function App() {
  return (
    <main className="min-h-screen grid place-items-center p-8">
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-extrabold text-gradient">React Playground</h1>
        <p className="text-slate-400">Learn React by doing — scaffold is alive. 🚀</p>
      </div>
    </main>
  )
}
