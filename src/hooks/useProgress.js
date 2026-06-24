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
  const { state, dispatch, stats, badges } = useApp()

  return {
    // raw state (rarely needed directly)
    state,
    stats,
    badges,

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
