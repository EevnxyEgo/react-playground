import { FlaskConical } from 'lucide-react'
import { PageTransition } from '../components/layout/PageTransition'
import { Card } from '../components/ui/Card'

// Free-form sandbox. A full live editor is wired up once the Sandpack-based
// CodePlayground component exists (next milestone).
export default function Sandbox() {
  return (
    <PageTransition className="space-y-4">
      <div className="flex items-center gap-3">
        <FlaskConical className="text-accent" size={26} />
        <h1 className="text-3xl font-bold">Free Sandbox</h1>
      </div>
      <p className="text-slate-400">
        A no-instructions space to experiment with React. (Live editor coming up.)
      </p>
      <Card className="grid h-64 place-items-center text-slate-500">
        Sandpack editor goes here
      </Card>
    </PageTransition>
  )
}
