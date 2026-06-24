// Explicit lucide-react icon registry.
//
// modulesList/badges store icons as *strings* (plain data). This map resolves
// those strings to components. Importing each icon by name (rather than
// `import * as` ) keeps tree-shaking working so we only ship what we use.
import {
  Home,
  Boxes,
  Code2,
  Package,
  Activity,
  MousePointerClick,
  GitBranch,
  List,
  FormInput,
  Repeat,
  Crosshair,
  Network,
  Workflow,
  Puzzle,
  Gauge,
  ShieldAlert,
  Combine,
  Signpost,
  Trophy,
  // badge icons
  Footprints,
  Lightbulb,
  Swords,
  Brain,
  BookOpenCheck,
  Anchor,
  Flag,
  Zap,
  GraduationCap,
  HelpCircle,
} from 'lucide-react'

export const iconMap = {
  Home,
  Boxes,
  Code2,
  Package,
  Activity,
  MousePointerClick,
  GitBranch,
  List,
  FormInput,
  Repeat,
  Crosshair,
  Network,
  Workflow,
  Puzzle,
  Gauge,
  ShieldAlert,
  Combine,
  Signpost,
  Trophy,
  Footprints,
  Lightbulb,
  Swords,
  Brain,
  BookOpenCheck,
  Anchor,
  Flag,
  Zap,
  GraduationCap,
}

// Resolve a name → component, falling back to a neutral icon.
export function getIcon(name) {
  return iconMap[name] || HelpCircle
}
