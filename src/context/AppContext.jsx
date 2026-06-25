import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import { modulesList, TOTAL_MODULES, CATEGORIES } from '../data/modulesList'
import { badges as badgeDefs } from '../data/badges'
import { V2_TOTALS, SKILL_MODULES } from '../data/v2meta'

/*
 * AppContext — the app's global brain (useReducer + Context, no external lib).
 *
 *  v1: theme, completed modules, quiz answers, mini-challenge checkboxes.
 *  v2: Interview-Mastery metrics + a derived skill radar.
 *  v3: Testing track completion, TDD solves, Under-the-Hood scenarios, a unified
 *      spaced-repetition engine (srs), and a Teach-Back journal. The radar gains
 *      Testing and Internals axes; Communication now also counts teach-backs.
 *
 * Everything stays in ONE store (same localStorage key) so all prior progress
 * survives upgrades.
 */

export const XP = { module: 50, quiz: 20, challenge: 30 }

const STORAGE_KEY = 'react-playground:v1'

// ---- Spaced-repetition schedule (shared engine, see useSpacedRepetition) ----
const DAY = 86400000
const SRS_INTERVALS = [3 * DAY, 7 * DAY, 21 * DAY, 45 * DAY]

function srsKey(type, itemId) {
  return `${type}:${itemId}`
}
function seedSrs(srs, type, itemId, now) {
  const key = srsKey(type, itemId)
  if (srs[key]) return srs
  return { ...srs, [key]: { type, itemId, lastReviewedAt: now, nextDueAt: now + SRS_INTERVALS[0], strength: 0 } }
}
function reviewSrs(srs, type, itemId, success, now) {
  const key = srsKey(type, itemId)
  const prev = srs[key]
  const strength = success ? Math.min((prev?.strength ?? 0) + 1, SRS_INTERVALS.length - 1) : 0
  return {
    ...srs,
    [key]: { type, itemId, lastReviewedAt: now, nextDueAt: now + SRS_INTERVALS[strength], strength },
  }
}

const initialState = {
  theme: 'dark',
  // v1
  completed: {},
  quizCorrect: {},
  challengesDone: {},
  // v2
  hookEngine: {},
  architecture: {},
  challengeSolves: {},
  debugFixed: {},
  predict: {},
  flashcards: {}, // legacy status cache; scheduling now lives in `srs`
  interviewSessions: [],
  capstone: {},
  // v3
  testingDone: {}, // { [testingModuleId]: true }
  tddSolved: {}, // { [tddId]: true }
  internalsDone: {}, // { [scenarioId]: true }
  teachBack: [], // [{ id, topic, type, text, date }]
  srs: {}, // { [type:itemId]: { type, itemId, lastReviewedAt, nextDueAt, strength } }
}

function reducer(state, action) {
  switch (action.type) {
    case 'HYDRATE':
      return { ...state, ...action.payload }

    case 'SET_THEME':
      return { ...state, theme: action.theme }
    case 'TOGGLE_THEME':
      return { ...state, theme: state.theme === 'dark' ? 'light' : 'dark' }

    // ---- v1 ----
    case 'COMPLETE_MODULE':
      if (state.completed[action.moduleId]) return state
      return { ...state, completed: { ...state.completed, [action.moduleId]: true } }
    case 'UNCOMPLETE_MODULE': {
      const next = { ...state.completed }
      delete next[action.moduleId]
      return { ...state, completed: next }
    }
    case 'MARK_QUIZ_CORRECT': {
      if (state.quizCorrect[action.key]) return state
      // Seed a spaced-repetition review for this module's quiz (key = "slug:qid").
      const slug = String(action.key).split(':')[0]
      return {
        ...state,
        quizCorrect: { ...state.quizCorrect, [action.key]: true },
        srs: seedSrs(state.srs, 'quiz', slug, Date.now()),
      }
    }
    case 'MARK_CHALLENGE_DONE':
      if (state.challengesDone[action.moduleId]) return state
      return { ...state, challengesDone: { ...state.challengesDone, [action.moduleId]: true } }
    case 'UNMARK_CHALLENGE': {
      if (!state.challengesDone[action.moduleId]) return state
      const next = { ...state.challengesDone }
      delete next[action.moduleId]
      return { ...state, challengesDone: next }
    }

    // ---- v2 ----
    case 'HOOK_ANSWER':
      if (state.hookEngine[action.id]?.correct) return state
      return { ...state, hookEngine: { ...state.hookEngine, [action.id]: { correct: action.correct } } }
    case 'ARCH_COMPLETE':
      if (state.architecture[action.id]) return state
      return { ...state, architecture: { ...state.architecture, [action.id]: true } }
    case 'CHALLENGE_SOLVE':
      if (state.challengeSolves[action.id]) return state
      return {
        ...state,
        challengeSolves: { ...state.challengeSolves, [action.id]: true },
        srs: seedSrs(state.srs, 'challenge', action.id, Date.now()),
      }
    case 'DEBUG_FIXED':
      if (state.debugFixed[action.id]) return state
      return {
        ...state,
        debugFixed: { ...state.debugFixed, [action.id]: true },
        srs: seedSrs(state.srs, 'debug', action.id, Date.now()),
      }
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

    // ---- v3 ----
    case 'TESTING_TOGGLE': {
      const next = { ...state.testingDone }
      if (next[action.id]) delete next[action.id]
      else next[action.id] = true
      return { ...state, testingDone: next }
    }
    case 'TDD_SOLVE':
      if (state.tddSolved[action.id]) return state
      return { ...state, tddSolved: { ...state.tddSolved, [action.id]: true } }
    case 'INTERNALS_DONE':
      if (state.internalsDone[action.id]) return state
      return { ...state, internalsDone: { ...state.internalsDone, [action.id]: true } }
    case 'TEACHBACK_SAVE':
      return { ...state, teachBack: [action.entry, ...state.teachBack] }
    case 'SRS_SEED':
      return { ...state, srs: seedSrs(state.srs, action.srsType, action.itemId, action.now) }
    case 'SRS_REVIEW':
      return { ...state, srs: reviewSrs(state.srs, action.srsType, action.itemId, action.success, action.now) }

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
      /* ignore */
    }
  }, [state])

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', state.theme === 'dark')
    root.style.colorScheme = state.theme
  }, [state.theme])

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
      modulesDone, totalModules: TOTAL_MODULES, quizCorrect, challengesDone,
      xp, percent, level, xpIntoLevel: xp % 150, xpForLevel: 150, categoriesComplete,
    }
  }, [state.completed, state.quizCorrect, state.challengesDone])

  const earnedBadges = useMemo(
    () => badgeDefs.map((b) => ({ ...b, earned: b.check(stats) })),
    [stats],
  )

  const v2 = useMemo(() => {
    const moduleAvg = (ids) => {
      if (ids.length === 0) return 0
      const done = ids.filter((id) => state.completed[id]).length
      return (done / ids.length) * 100
    }
    const pct = (n, total) => Math.round(Math.min(100, total ? (n / total) * 100 : 0))

    const hookAnswered = Object.keys(state.hookEngine).length
    const hookCorrect = Object.values(state.hookEngine).filter((v) => v.correct).length
    const hookAccuracy = hookAnswered ? (hookCorrect / hookAnswered) * 100 : 0
    const hookConfidence = hookAccuracy * Math.min(1, hookAnswered / 8)

    const archDone = Object.keys(state.architecture).length
    const debugDone = Object.keys(state.debugFixed).length
    const challengeDone = Object.keys(state.challengeSolves).length
    const predictAnswered = Object.keys(state.predict).length
    const predictCorrect = Object.values(state.predict).filter((v) => v.correct).length
    const substantiveSessions = state.interviewSessions.filter(isSubstantive).length
    const capstoneDone = Object.keys(state.capstone).length

    // v3 counts
    const testingDone = Object.keys(state.testingDone).length
    const tddDone = Object.keys(state.tddSolved).length
    const internalsDone = Object.keys(state.internalsDone).length
    const teachBackSubstantive = state.teachBack.filter((e) => (e.text || '').trim().length >= 40).length

    // Flashcards mastery now derives from the shared SRS engine.
    const flashItems = Object.values(state.srs).filter((s) => s.type === 'flashcard')
    const flashGot = flashItems.filter((s) => s.strength >= 2).length
    const flashReviewed = flashItems.length
    const dueCount = Object.values(state.srs).filter((s) => s.nextDueAt <= Date.now()).length

    const testingScore = Math.round(0.7 * pct(testingDone, V2_TOTALS.testingModules) + 0.3 * pct(tddDone, V2_TOTALS.tdd))
    const communicationRaw = substantiveSessions + teachBackSubstantive

    const skills = [
      { key: 'componentsJsx', label: 'Components & JSX', value: Math.round(moduleAvg(SKILL_MODULES.componentsJsx)), link: '/learn/components' },
      { key: 'stateProps', label: 'State & Props', value: Math.round(moduleAvg(SKILL_MODULES.stateProps)), link: '/learn/state' },
      { key: 'hooks', label: 'Hooks Mastery', value: Math.round(0.45 * moduleAvg(SKILL_MODULES.hooks) + 0.55 * hookConfidence), link: '/hook-decision-engine' },
      { key: 'architecture', label: 'Architecture', value: pct(archDone, V2_TOTALS.architecture), link: '/architecture-trainer' },
      { key: 'debugging', label: 'Debugging', value: pct(debugDone, V2_TOTALS.debugging), link: '/debugging-gauntlet' },
      { key: 'testing', label: 'Testing', value: testingScore, link: '/testing/why-test' },
      { key: 'internals', label: 'Internals', value: pct(internalsDone, V2_TOTALS.internals), link: '/under-the-hood' },
      { key: 'communication', label: 'Communication', value: pct(communicationRaw, 5), link: '/interview-simulator' },
    ]

    const readiness = Math.round(skills.reduce((s, a) => s + a.value, 0) / skills.length)
    const weakest = [...skills].sort((a, b) => a.value - b.value)[0]

    return {
      skills, readiness, weakest, totals: V2_TOTALS,
      counts: {
        hookAnswered, hookCorrect, archDone, debugDone, challengeDone,
        predictAnswered, predictCorrect, flashGot, flashReviewed,
        interviewSessions: state.interviewSessions.length, substantiveSessions,
        capstoneDone, testingDone, tddDone, internalsDone,
        teachBack: state.teachBack.length, teachBackSubstantive, dueCount,
      },
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
