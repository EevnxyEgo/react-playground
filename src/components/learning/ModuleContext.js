import { createContext, useContext } from 'react'

/*
 * ModuleContext lets nested learning components (Quiz, Challenge) know which
 * module they belong to, so they can build stable progress keys like
 * "jsx:q1" without every call site having to pass the slug down manually.
 */
export const ModuleContext = createContext({ slug: null, meta: null })

export function useModule() {
  return useContext(ModuleContext)
}
