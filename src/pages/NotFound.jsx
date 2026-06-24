import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'
import { PageTransition } from '../components/layout/PageTransition'
import { Button } from '../components/ui/Button'

export default function NotFound() {
  return (
    <PageTransition className="grid place-items-center py-24 text-center">
      <div className="space-y-4">
        <p className="font-mono text-6xl font-bold text-gradient">404</p>
        <p className="text-content-muted">
          That route doesn't exist — maybe it forgot to <code>return</code> some JSX.
        </p>
        <Link to="/">
          <Button>
            <Home size={16} /> Back home
          </Button>
        </Link>
      </div>
    </PageTransition>
  )
}
