import { Menu, Moon, Sun, Star, Flame } from 'lucide-react'
import { useProgress } from '../../hooks/useProgress'
import { Toggle } from '../ui/Toggle'
import { Badge } from '../ui/Badge'

/*
 * Header — slim top bar. Holds the mobile menu trigger, a live XP/level
 * readout (so progress always feels visible), and the dark/light toggle.
 */
export function Header({ onMenu }) {
  const { stats, isDark, toggleTheme } = useProgress()

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-line/10 bg-surface-950/80 px-4 backdrop-blur lg:px-6">
      <button
        className="rounded-md p-2 text-content hover:bg-line/5 lg:hidden focus-ring"
        onClick={onMenu}
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      <div className="flex-1" />

      {/* Live stats */}
      <div className="hidden items-center gap-2 sm:flex">
        <Badge tone="accent" className="gap-1">
          <Flame size={13} /> Level {stats.level}
        </Badge>
        <Badge tone="flash" className="gap-1">
          <Star size={13} /> {stats.xp} XP
        </Badge>
      </div>

      {/* Theme toggle */}
      <div className="flex items-center gap-2">
        <Sun size={16} className={isDark ? 'text-content-faint' : 'text-flash'} />
        <Toggle
          checked={isDark}
          onChange={toggleTheme}
          label="Toggle dark mode"
        />
        <Moon size={16} className={isDark ? 'text-accent' : 'text-content-muted'} />
      </div>
    </header>
  )
}
