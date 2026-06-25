import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import { modulesList, TOTAL_MODULES, CATEGORIES } from '../data/modulesList'
import { badges as badgeDefs } from '../data/badges'
import { V2_TOTALS, SKILL_MODULES } from '../data/v2meta'

/*
 * AppContext — the app's global brain, written from scratch with
 * useReducer + Context (no Redux/Zustand on purpose). This file is itself a
 * worked example of the patterns taught in Module 11 (useContext) and
 * Module 12 (useReducer).
 *
 * v1 tracked: theme, completed modules, quiz answers, challenge checkboxes.
 * v2.0 extends the SAME store (not a second system) with Interview-Mastery
 * metrics: hook-engine answers, architecture drills, challenge solves, debugging
 * fixes, predict-the-output answers, flashcard recall, interview sessions and
 * capstone milestones. From all of this we derive a 6-axis skill radar.
 */

// ---- XP economy -----------------------------------------------------------
export const XP = {
  module: 50, // marking a module complete
  quiz: 20, // each correct quiz question
  challenge: 30, // each completed mini-challenge
}

const STORAGE_KEY = 'react-playground:v1' // kept stable so v1 progress survives

const initialState = {
  theme: 'dark',
  // v1
  completed: {}, // { [moduleId]: true }
  quizCorrect: {}, // { [questionKey]: true }
  challengesDone: {}, // { [moduleId]: true }
  // v2 — Interview Mastery
  hookEngine: {}, // { [scenarioId]: { correct: bool } }
  architecture: {}, // { [mockupId]: true }
  challengeSolves: {}, // { [challengeId]: true }
  debugFixed: {}, // { [bugId]: true }
  predict: {}, // { [predictId]: { correct: bool } }
  flashcards: {}, // { [cardId]: 'got' | 'review' }
  interviewSessions: [], // [{ id, challengeId, title, clarifying, plan, selfReview, date }]
  capstone: {}, // { [milestoneId]: true }
}

// ---- Reducer --------------------------------------------------------------
function reducer(state, action) {
  switch (action.type) {
    case 'HYDRATE':
      return { ...state, ...action.payload }

    case 'SET_THEME':
      return { ...state, theme: action.theme }
    case 'TOGGLE_THEME':
      return { ...state, theme: state.theme === 'dark' ? 'light' : 'dark' }

    // ---- v1 modules / quizzes / mini-challenges ----
    case 'COMPLETE_MODULE':
      if (state.completed[action.moduleId]) return state
      return { ...state, completed: { ...state.completed, [action.moduleId]: true } }
    case 'UNCOMPLETE_MODULE': {
      const next = { ...state.completed }
      delete next[action.moduleId]
      return { ...state, completed: next }
    }
    case 'MARK_QUIZ_CORRECT':
      if (state.quizCorrect[action.key]) return state
      return { ...state, quizCorrect: { ...state.quizCorrect, [action.key]: true } }
    case 'MARK_CHALLENGE_DONE':
      if (state.challengesDone[action.moduleId]) return state
      return { ...state, challengesDone: { ...state.challengesDone, [action.moduleId]: true } }
    case 'UNMARK_CHALLENGE': {
      if (!state.challengesDone[action.moduleId]) return state
      const next = { ...state.challengesDone }
      delete next[action.moduleId]
      return { ...state, challengesDone: next }
    }

    // ---- v2 Interview Mastery ----
    case 'HOOK_ANSWER':
      // keep the best result (once correct, stays correct)
      if (state.hookEngine[action.id]?.correct) return state
      return {
        ...state,
        hookEngine: { ...state.hookEngine, [action.id]: { correct: action.correct } },
      }
    case 'ARCH_COMPLETE':
      if (state.architecture[action.id]) return state
      return { ...state, architecture: { ...state.architecture, [action.id]: true } }
    case 'CHALLENGE_SOLVE':
      if (state.challengeSolves[action.id]) return state
      return { ...state, challengeSolves: { ...state.challengeSolves, [action.id]: true } }
    case 'DEBUG_FIXED':
      if (state.debugFixed[action.id]) return state
      return { ...state, debugFixed: { ...state.debugFixed, [action.id]: true } }
    case 'PREDICT_ANSWER':
      if (state.predict[action.id]?.correct) return state
      return { ...state, predict: { ...state.predict, [action.id]: { correct: action.correct } } }
    case 'FLASHCARD_MARK':
      return { ...state, flashcards: { ...state.flashcards, [action.id]: action.status } }
    case 'INTERVIEW_SAVE':
      return { ...state, interviewSessions: [action.session, ...state.interviewSessions] }
    case 'CAPSTONE_TOGGLE': {
      const next = { ...state.capstone }
      if (next[action.id]) delete next[action.id]
      else next[action.id] = true
      return { ...state, capstone: next }
    }

    case 'RESET_PROGRESS':
      return { ...initialState, theme: state.theme }

    default:
      return state
  }
}

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

// Is an interview session "substantive" (used by the Communication skill axis)?
function isSubstantive(s) {
  const ok = (t) => typeof t === 'string' && t.trim().length >= 12
  return ok(s.clarifying) && ok(s.plan)
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState, init)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      /* storage unavailable — ignore */
    }
  }, [state])

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', state.theme === 'dark')
    root.style.colorScheme = state.theme
  }, [state.theme])

  // ---- Derived stats (v1) -------------------------------------------------
  const stats = useMemo(() => {
    const modulesDone = Object.keys(state.completed).length
    const quizCorrect = Object.keys(state.quizCorrect).length
    const challengesDone = Object.keys(state.challengesDone).length
    const xp = modulesDone * XP.module + quizCorrect * XP.quiz + challengesDone * XP.challenge
    const percent = Math.round((modulesDone / TOTAL_MODULES) * 100)

    const categoriesComplete = {}
    for (const cat of CATEGORIES) {
      const inCat = modulesList.filter((m) => m.category === cat)
      categoriesComplete[cat] = inCat.length > 0 && inCat.every((m) => state.completed[m.id])
    }

    const level = Math.floor(xp / 150) + 1
    return {
      modulesDone,
      totalModules: TOTAL_MODULES,
      quizCorrect,
      challengesDone,
      xp,
      percent,
      level,
      xpIntoLevel: xp % 150,
      xpForLevel: 150,
      categoriesComplete,
    }
  }, [state.completed, state.quizCorrect, state.challengesDone])

  const earnedBadges = useMemo(
    () => badgeDefs.map((b) => ({ ...b, earned: b.check(stats) })),
    [stats],
  )

  // ---- Derived v2 metrics + skill radar ----------------------------------
  const v2 = useMemo(() => {
    const moduleAvg = (ids) => {
      if (ids.length === 0) return 0
      const done = ids.filter((id) => state.completed[id]).length
      return (done / ids.length) * 100
    }

    const hookAnswered = Object.keys(state.hookEngine).length
    const hookCorrect = Object.values(state.hookEngine).filter((v) => v.correct).length
    const hookAccuracy = hookAnswered ? (hookCorrect / hookAnswered) * 100 : 0
    // require some volume before accuracy counts at full weight
    const hookConfidence = hookAccuracy * Math.min(1, hookAnswered / 8)

    const archDone = Object.keys(state.architecture).length
    const debugDone = Object.keys(state.debugFixed).length
    const challengeDone = Object.keys(state.challengeSolves).length
    const predictAnswered = Object.keys(state.predict).length
    const predictCorrect = Object.values(state.predict).filter((v) => v.correct).length
    const flashGot = Object.values(state.flashcards).filter((v) => v === 'got').length
    const flashReviewed = Object.keys(state.flashcards).length
    const substantiveSessions = state.interviewSessions.filter(isSubstantive).length
    const capstoneDone = Object.keys(state.capstone).length

    const pct = (n, total) => Math.round(Math.min(100, total ? (n / total) * 100 : 0))

    // Six radar axes (0–100), each from real activity (Section 10).
    const skills = [
      { key: 'componentsJsx', label: 'Components & JSX', value: Math.round(moduleAvg(SKILL_MODULES.componentsJsx)), link: '/learn/components' },
      { key: 'stateProps', label: 'State & Props', value: Math.round(moduleAvg(SKILL_MODULES.stateProps)), link: '/learn/state' },
      {
        key: 'hooks',
        label: 'Hooks Mastery',
        value: Math.round(0.45 * moduleAvg(SKILL_MODULES.hooks) + 0.55 * hookConfidence),
        link: '/hook-decision-engine',
      },
      { key: 'architecture', label: 'Architecture', value: pct(archDone, V2_TOTALS.architecture), link: '/architecture-trainer' },
      { key: 'debugging', label: 'Debugging', value: pct(debugDone, V2_TOTALS.debugging), link: '/debugging-gauntlet' },
      { key: 'communication', label: 'Communication', value: pct(substantiveSessions, 3), link: '/interview-simulator' },
    ]

    const readiness = Math.round(skills.reduce((s, a) => s + a.value, 0) / skills.length)
    const weakest = [...skills].sort((a, b) => a.value - b.value)[0]

    return {
      skills,
      readiness,
      weakest,
      counts: {
        hookAnswered,
        hookCorrect,
        archDone,
        debugDone,
        challengeDone,
        predictAnswered,
        predictCorrect,
        flashGot,
        flashReviewed,
        interviewSessions: state.interviewSessions.length,
        substantiveSessions,
        capstoneDone,
      },
      totals: V2_TOTALS,
    }
  }, [state])

  const value = useMemo(
    () => ({ state, dispatch, stats, badges: earnedBadges, v2 }),
    [state, stats, earnedBadges, v2],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>')
  return ctx
}
