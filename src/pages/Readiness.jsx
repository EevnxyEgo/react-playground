import { Gauge } from 'lucide-react'
import { ComingSoon } from '../components/v2/ComingSoon'

export default function Readiness() {
  return <ComingSoon icon={Gauge} title="Interview Readiness" subtitle="Your skill radar across all axes." />
}
