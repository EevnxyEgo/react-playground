import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import { modulesList, TOTAL_MODULES, CATEGORIES } from '../data/modulesList'
import { badges as badgeDefs } from '../data/badges'

/*
 * AppContext — the app's global brain, written from scratch with
 * useReducer + Context (no Redux/Zustand on purpose). This file is itself a
 * worked example of the patterns taught in Module 11 (useContext) and
 * Module 12 (useReducer).
 *
 * What lives here:
 *   - theme (dark/light)            → also synced to <html class="dark">
 *   - completed[]                   → which modules are marked complete
 *   - quizCorrect{}                 → which quiz questions were answered right
 *   - challengesDone{}              → which mini-challenges are checked off
 *
 * XP, level, percent and earned badges are all DERIVED from the above, so the
 * numbers can never disagree with the raw progress.
 */

// ---- XP economy -----------------------------------------------------------
export const XP = {
  module: 50, // marking a module complete
  quiz: 20, // each correct quiz question
  challenge: 30, // each completed mini-challenge
}

const STORAGE_KEY = 'react-playground:v1'

const initialState = {
  theme: 'dark',
  completed: {}, // { [moduleId]: true }
  quizCorrect: {}, // { [questionKey]: true }
  challengesDone: {}, // { [moduleId]: true }
}

// ---- Reducer --------------------------------------------------------------
function reducer(state, action) {
  switch (action.type) {
    case 'HYDRATE':
      // Merge persisted state over defaults (forward-compatible).
      return { ...state, ...action.payload }

    case 'SET_THEME':
      return { ...state, theme: action.theme }

    case 'TOGGLE_THEME':
      return { ...state, theme: state.theme === 'dark' ? 'light' : 'dark' }

    case 'COMPLETE_MODULE':
      if (state.completed[action.moduleId]) return state // idempotent
      return { ...state, completed: { ...state.completed, [action.moduleId]: true } }

    case 'UNCOMPLETE_MODULE': {
      const next = { ...state.completed }
      delete next[action.moduleId]
      return { ...state, completed: next }
    }

    case 'MARK_QUIZ_CORRECT':
      if (state.quizCorrect[action.key]) return state // never double-count
      return { ...state, quizCorrect: { ...state.quizCorrect, [action.key]: true } }

    case 'MARK_CHALLENGE_DONE':
      if (state.challengesDone[action.moduleId]) return state
      return {
        ...state,
        challengesDone: { ...state.challengesDone, [action.moduleId]: true },
      }

    case 'UNMARK_CHALLENGE':
      if (!state.challengesDone[action.moduleId]) return state
      {
        const next = { ...state.challengesDone }
        delete next[action.moduleId]
        return { ...state, challengesDone: next }
      }

    case 'RESET_PROGRESS':
      return { ...initialState, theme: state.theme }

    default:
      return state
  }
}

// Lazy initializer: read persisted state from localStorage exactly once.
function init(base) {
  if (typeof window === 'undefined') return base
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return base
    return { ...base, ...JSON.parse(raw) }
  } catch {
    return base
  }
}

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState, init)

  // Persist whenever progress/theme changes.
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      /* storage might be unavailable (private mode) — fail silently */
    }
  }, [state])

  // Reflect the theme on <html> so Tailwind's `dark:` variants apply globally.
  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', state.theme === 'dark')
    root.style.colorScheme = state.theme
  }, [state.theme])

  // ---- Derived stats (memoized) ------------------------------------------
  const stats = useMemo(() => {
    const modulesDone = Object.keys(state.completed).length
    const quizCorrect = Object.keys(state.quizCorrect).length
    const challengesDone = Object.keys(state.challengesDone).length
    const xp =
      modulesDone * XP.module + quizCorrect * XP.quiz + challengesDone * XP.challenge
    const percent = Math.round((modulesDone / TOTAL_MODULES) * 100)

    // Which whole categories are fully complete?
    const categoriesComplete = {}
    for (const cat of CATEGORIES) {
      const inCat = modulesList.filter((m) => m.category === cat)
      categoriesComplete[cat] =
        inCat.length > 0 && inCat.every((m) => state.completed[m.id])
    }

    // Level: every 150 XP is a level (purely cosmetic flavor).
    const level = Math.floor(xp / 150) + 1
    const xpIntoLevel = xp % 150
    const xpForLevel = 150

    return {
      modulesDone,
      totalModules: TOTAL_MODULES,
      quizCorrect,
      challengesDone,
      xp,
      percent,
      level,
      xpIntoLevel,
      xpForLevel,
      categoriesComplete,
    }
  }, [state.completed, state.quizCorrect, state.challengesDone])

  const earnedBadges = useMemo(
    () => badgeDefs.map((b) => ({ ...b, earned: b.check(stats) })),
    [stats],
  )

  const value = useMemo(
    () => ({ state, dispatch, stats, badges: earnedBadges }),
    [state, stats, earnedBadges],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

// Custom hook so consumers never touch the raw context object.
export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>')
  return ctx
}
