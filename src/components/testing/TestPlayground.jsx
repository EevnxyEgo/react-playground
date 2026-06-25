import { useState } from 'react'
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackTests,
  SandpackPreview,
} from '@codesandbox/sandpack-react'
import { FlaskConical, Eye, RotateCcw, Lightbulb } from 'lucide-react'
import { useProgress } from '../../hooks/useProgress'
import { Button } from '../ui/Button'
import { cn } from '../../lib/cn'

/*
 * TestPlayground — a live, in-browser test runner built on Sandpack's
 * `SandpackTests` (a Jest-compatible subset) + React Testing Library.
 *
 * SPIKE FINDINGS (Section 1.1):
 *  - SandpackTests ships INSIDE @codesandbox/sandpack-react — no new dependency.
 *  - It auto-discovers `*.test.js(x)` files and provides Jest globals
 *    (describe/it/test/expect, jest.fn, beforeEach…).
 *  - React Testing Library works live when its packages are added via
 *    customSetup.dependencies and `@testing-library/jest-dom` is imported in the
 *    test file (registers matchers like toBeInTheDocument).
 *  - Reliable in-browser: render, screen, getByRole/Text/LabelText,
 *    queryBy/findBy, fireEvent, user-event clicks/typing, waitFor, renderHook,
 *    and module mocking via jest.mock for local files.
 *  - Less reliable: real-timer-heavy fake-timer combos and some network mocking.
 *    For any such case we fall back to `mode="annotated"` — show the test code +
 *    a clearly-labeled expected-output panel instead of claiming live execution.
 */
const RTL_DEPS = {
  '@testing-library/react': '14.3.1',
  '@testing-library/dom': '10.4.0',
  '@testing-library/jest-dom': '6.6.3',
  '@testing-library/user-event': '14.5.2',
}

export function TestPlayground({
  files,
  dependencies = {},
  editorHeight = 420,
  mode = 'live', // 'live' = run tests in-browser; 'annotated' = code + expected output
  expected, // shown in annotated mode
  showPreview = false,
  className,
}) {
  const { isDark } = useProgress()
  const [resetKey, setResetKey] = useState(0)
  const [tab, setTab] = useState('tests') // tests | preview (when showPreview)

  return (
    <div className={cn('overflow-hidden rounded-xl border border-line/10 bg-surface-900', className)}>
      <div className="flex items-center justify-between border-b border-line/10 bg-surface-800/60 px-3 py-2">
        <span className="flex items-center gap-2 text-sm font-medium text-content">
          <FlaskConical size={15} className="text-accent" />
          {mode === 'live' ? 'Live Test Runner' : 'Test (annotated)'}
        </span>
        <div className="flex items-center gap-1.5">
          {showPreview && mode === 'live' && (
            <Button size="sm" variant="ghost" onClick={() => setTab(tab === 'tests' ? 'preview' : 'tests')}>
              <Eye size={14} /> {tab === 'tests' ? 'Preview' : 'Tests'}
            </Button>
          )}
          <Button size="sm" variant="ghost" onClick={() => setResetKey((k) => k + 1)}>
            <RotateCcw size={14} /> Reset
          </Button>
        </div>
      </div>

      <SandpackProvider
        key={resetKey}
        template="react"
        theme={isDark ? 'dark' : 'light'}
        files={files}
        customSetup={{ dependencies: { ...RTL_DEPS, ...dependencies } }}
        options={{ recompileMode: 'delayed', recompileDelay: 500 }}
      >
        <SandpackLayout>
          <SandpackCodeEditor showLineNumbers showTabs wrapContent style={{ height: editorHeight }} />
          {mode === 'live' ? (
            tab === 'preview' ? (
              <SandpackPreview style={{ height: editorHeight }} />
            ) : (
              <SandpackTests style={{ height: editorHeight }} verbose />
            )
          ) : null}
        </SandpackLayout>
      </SandpackProvider>

      {mode === 'annotated' && expected && (
        <div className="border-t border-line/10 bg-surface-950 p-3">
          <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-flash">
            <Lightbulb size={13} /> Expected result (annotated — not run live here)
          </p>
          <pre className="overflow-x-auto text-xs leading-relaxed text-content">{expected}</pre>
        </div>
      )}
    </div>
  )
}
