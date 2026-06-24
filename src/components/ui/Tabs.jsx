import { createContext, useContext, useId, useState } from 'react'
import { cn } from '../../lib/cn'

/*
 * A small, accessible tabs primitive used for Comparison Mode and anywhere
 * else we need switchable panels. Controlled or uncontrolled.
 *
 * Usage:
 *   <Tabs defaultValue="fn">
 *     <TabsList>
 *       <Tab value="fn">Function</Tab>
 *       <Tab value="class">Class</Tab>
 *     </TabsList>
 *     <TabPanel value="fn">...</TabPanel>
 *     <TabPanel value="class">...</TabPanel>
 *   </Tabs>
 */
const TabsCtx = createContext(null)

export function Tabs({ value, defaultValue, onValueChange, className, children }) {
  const [internal, setInternal] = useState(defaultValue)
  const active = value !== undefined ? value : internal
  const setActive = (v) => {
    if (value === undefined) setInternal(v)
    onValueChange?.(v)
  }
  const baseId = useId()
  return (
    <TabsCtx.Provider value={{ active, setActive, baseId }}>
      <div className={className}>{children}</div>
    </TabsCtx.Provider>
  )
}

export function TabsList({ className, children }) {
  return (
    <div
      role="tablist"
      className={cn(
        'inline-flex items-center gap-1 rounded-lg bg-surface-800/80 p-1',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function Tab({ value, className, children }) {
  const { active, setActive, baseId } = useContext(TabsCtx)
  const selected = active === value
  return (
    <button
      type="button"
      role="tab"
      id={`${baseId}-tab-${value}`}
      aria-selected={selected}
      aria-controls={`${baseId}-panel-${value}`}
      onClick={() => setActive(value)}
      className={cn(
        'rounded-md px-3 py-1.5 text-sm font-medium transition-all focus-ring',
        selected
          ? 'bg-accent text-surface-950 shadow'
          : 'text-slate-400 hover:text-slate-200',
        className,
      )}
    >
      {children}
    </button>
  )
}

export function TabPanel({ value, className, children }) {
  const { active, baseId } = useContext(TabsCtx)
  if (active !== value) return null
  return (
    <div
      role="tabpanel"
      id={`${baseId}-panel-${value}`}
      aria-labelledby={`${baseId}-tab-${value}`}
      className={cn('animate-fade-in', className)}
    >
      {children}
    </div>
  )
}
