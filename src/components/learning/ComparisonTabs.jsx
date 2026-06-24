import { Tabs, TabsList, Tab, TabPanel } from '../ui/Tabs'
import { Badge } from '../ui/Badge'
import { Info } from 'lucide-react'

/*
 * ComparisonTabs — "two (or three) ways to write the same thing", side by side.
 * Required by Modules 1 (3-way), 4 and 9 (function vs class).
 *
 * tabs: [{ value, label, badge?, content }]   // content is any JSX
 * note: optional takeaway explaining that the variants are equivalent.
 */
export function ComparisonTabs({ tabs, defaultValue, note }) {
  return (
    <div className="space-y-3">
      <Tabs defaultValue={defaultValue ?? tabs[0]?.value}>
        <TabsList className="flex-wrap">
          {tabs.map((t) => (
            <Tab key={t.value} value={t.value}>
              {t.label}
              {t.badge && (
                <Badge tone="muted" className="ml-1.5">
                  {t.badge}
                </Badge>
              )}
            </Tab>
          ))}
        </TabsList>

        {tabs.map((t) => (
          <TabPanel key={t.value} value={t.value} className="mt-3">
            {t.content}
          </TabPanel>
        ))}
      </Tabs>

      {note && (
        <div className="flex items-start gap-2 rounded-lg border border-line/10 bg-surface-800/50 p-3 text-sm text-content">
          <Info size={16} className="mt-0.5 shrink-0 text-accent" />
          <div>{note}</div>
        </div>
      )}
    </div>
  )
}
