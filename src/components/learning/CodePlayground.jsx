import { useState } from 'react'
import { Sandpack } from '@codesandbox/sandpack-react'
import { Lightbulb, RotateCcw, Code2 } from 'lucide-react'
import { useProgress } from '../../hooks/useProgress'
import { Button } from '../ui/Button'
import { cn } from '../../lib/cn'

/*
 * CodePlayground — the reusable Sandpack wrapper used by every module.
 *
 * Gives the learner a real editor + live preview side by side. Features:
 *   - editable starter code (`files`)
 *   - an optional collapsible "Show Solution" that swaps in `solution` files
 *   - optional live console (handy for log-based challenges)
 *   - theme follows the app's dark/light setting
 *
 * Remounting (via `key`) when toggling the solution intentionally resets the
 * editor to the chosen file set.
 */
export function CodePlayground({
  files,
  solution,
  template = 'react',
  showConsole = false,
  editorHeight = 320,
  title = 'Live Playground',
  className,
  customSetup,
}) {
  const { isDark } = useProgress()
  const [showSolution, setShowSolution] = useState(false)
  const [resetKey, setResetKey] = useState(0)

  // When showing the solution, solution files override matching starter files.
  const activeFiles = showSolution && solution ? { ...files, ...solution } : files

  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border border-line/10 bg-surface-900',
        className,
      )}
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-line/10 bg-surface-800/60 px-3 py-2">
        <span className="flex items-center gap-2 text-sm font-medium text-content">
          <Code2 size={15} className="text-accent" /> {title}
        </span>
        <div className="flex items-center gap-1.5">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setResetKey((k) => k + 1)}
            title="Reset code"
          >
            <RotateCcw size={14} /> Reset
          </Button>
          {solution && (
            <Button
              size="sm"
              variant={showSolution ? 'primary' : 'outline'}
              onClick={() => {
                setShowSolution((s) => !s)
                setResetKey((k) => k + 1)
              }}
            >
              <Lightbulb size={14} />
              {showSolution ? 'Hide Solution' : 'Show Solution'}
            </Button>
          )}
        </div>
      </div>

      <Sandpack
        key={`${showSolution}-${resetKey}`}
        template={template}
        theme={isDark ? 'dark' : 'light'}
        files={activeFiles}
        customSetup={customSetup}
        options={{
          editorHeight,
          showLineNumbers: true,
          showInlineErrors: true,
          showConsole,
          showConsoleButton: showConsole,
          showTabs: Object.keys(files).length > 1,
          wrapContent: true,
          classes: { 'sp-wrapper': 'sp-playground' },
        }}
      />
    </div>
  )
}
