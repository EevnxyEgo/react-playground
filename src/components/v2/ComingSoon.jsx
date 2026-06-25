import { Construction } from 'lucide-react'
import { PageTransition } from '../layout/PageTransition'
import { FeatureHeader } from './FeatureHeader'

// Temporary placeholder used while each v2 feature page is being implemented.
export function ComingSoon({ icon, title, subtitle }) {
  return (
    <PageTransition className="space-y-6">
      <FeatureHeader icon={icon} title={title} subtitle={subtitle} />
      <div className="rounded-2xl border border-dashed border-line/20 bg-surface-900 p-10 text-center">
        <Construction className="mx-auto mb-3 text-flash" size={28} />
        <p className="font-semibold text-content-strong">Being built in this sprint…</p>
      </div>
    </PageTransition>
  )
}
