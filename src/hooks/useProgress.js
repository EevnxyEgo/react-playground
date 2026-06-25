import { useApp } from '../context/AppContext'

/*
 * useProgress — an ergonomic façade over AppContext so components don't have to
 * hand-write dispatch objects. Returns small, well-named action helpers plus
 * the derived stats/badges/theme.
 *
 * This keeps the dispatch "vocabulary" in one place and makes call sites read
 * like intentions: completeModule('jsx'), markQuizCorrect('jsx-q1'), etc.
 */
export function useProgress() {
  const { state, dispatch, stats, badges, v2 } = useApp()

  return {
    // raw state (rarely needed directly)
    state,
    stats,
    badges,
    v2,

    // ---- v2: Interview Mastery actions & selectors ----
    // Hook Decision Engine
    hookResult: (id) => state.hookEngine[id] || null,
    answerHook: (id, correct) => dispatch({ type: 'HOOK_ANSWER', id, correct }),
    // Architecture Trainer
    isArchDone: (id) => Boolean(state.architecture[id]),
    completeArch: (id) => dispatch({ type: 'ARCH_COMPLETE', id }),
    // Challenge Library
    isChallengeSolved: (id) => Boolean(state.challengeSolves[id]),
    solveChallenge: (id) => dispatch({ type: 'CHALLENGE_SOLVE', id }),
    // Debugging Gauntlet
    isDebugFixed: (id) => Boolean(state.debugFixed[id]),
    markDebugFixed: (id) => dispatch({ type: 'DEBUG_FIXED', id }),
    // Predict the Output
    predictResult: (id) => state.predict[id] || null,
    answerPredict: (id, correct) => dispatch({ type: 'PREDICT_ANSWER', id, correct }),
    // Flashcards
    flashcardStatus: (id) => state.flashcards[id] || null,
    markFlashcard: (id, status) => dispatch({ type: 'FLASHCARD_MARK', id, status }),
    // Interview Simulator
    interviewSessions: state.interviewSessions,
    saveInterview: (session) => dispatch({ type: 'INTERVIEW_SAVE', session }),
    // Capstone
    isCapstoneDone: (id) => Boolean(state.capstone[id]),
    toggleCapstone: (id) => dispatch({ type: 'CAPSTONE_TOGGLE', id }),

    // theme
    theme: state.theme,
    isDark: state.theme === 'dark',
    toggleTheme: () => dispatch({ type: 'TOGGLE_THEME' }),
    setTheme: (theme) => dispatch({ type: 'SET_THEME', theme }),

    // module completion
    isComplete: (moduleId) => Boolean(state.completed[moduleId]),
    completeModule: (moduleId) => dispatch({ type: 'COMPLETE_MODULE', moduleId }),
    toggleComplete: (moduleId) =>
      dispatch({
        type: state.completed[moduleId] ? 'UNCOMPLETE_MODULE' : 'COMPLETE_MODULE',
        moduleId,
      }),

    // quizzes (keyed per-question so XP is awarded once)
    isQuizCorrect: (key) => Boolean(state.quizCorrect[key]),
    markQuizCorrect: (key) => dispatch({ type: 'MARK_QUIZ_CORRECT', key }),

    // mini challenges (one per module)
    isChallengeDone: (moduleId) => Boolean(state.challengesDone[moduleId]),
    markChallengeDone: (moduleId) =>
      dispatch({ type: 'MARK_CHALLENGE_DONE', moduleId }),
    toggleChallenge: (moduleId) =>
      dispatch({
        type: state.challengesDone[moduleId] ? 'UNMARK_CHALLENGE' : 'MARK_CHALLENGE_DONE',
        moduleId,
      }),

    // danger zone
    resetProgress: () => dispatch({ type: 'RESET_PROGRESS' }),
  }
}
