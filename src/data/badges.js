// Achievement definitions. Each badge is pure data + a `check(stats)` predicate,
// so "which badges are earned" is always derived from progress — never stored
// separately (no chance of drift). The Progress page renders these.
//
// `stats` shape (built in AppContext):
//   { modulesDone, totalModules, percent, quizCorrect, challengesDone,
//     xp, categoriesComplete: { Fundamentals: bool, Hooks: bool, ... } }

export const badges = [
  {
    id: 'first-steps',
    title: 'First Steps',
    description: 'Complete your very first module.',
    icon: 'Footprints',
    check: (s) => s.modulesDone >= 1,
  },
  {
    id: 'curious-mind',
    title: 'Curious Mind',
    description: 'Answer your first quiz question correctly.',
    icon: 'Lightbulb',
    check: (s) => s.quizCorrect >= 1,
  },
  {
    id: 'challenger',
    title: 'Challenger',
    description: 'Finish 3 mini challenges.',
    icon: 'Swords',
    check: (s) => s.challengesDone >= 3,
  },
  {
    id: 'quiz-whiz',
    title: 'Quiz Whiz',
    description: 'Get 10 quiz questions right.',
    icon: 'Brain',
    check: (s) => s.quizCorrect >= 10,
  },
  {
    id: 'fundamentalist',
    title: 'Fundamentalist',
    description: 'Complete every Fundamentals module.',
    icon: 'BookOpenCheck',
    check: (s) => s.categoriesComplete.Fundamentals,
  },
  {
    id: 'hooked',
    title: 'Hooked',
    description: 'Complete every Hooks module.',
    icon: 'Anchor',
    check: (s) => s.categoriesComplete.Hooks,
  },
  {
    id: 'halfway-there',
    title: 'Halfway There',
    description: 'Reach 50% overall completion.',
    icon: 'Flag',
    check: (s) => s.percent >= 50,
  },
  {
    id: 'xp-500',
    title: 'XP Hunter',
    description: 'Earn 500 XP.',
    icon: 'Zap',
    check: (s) => s.xp >= 500,
  },
  {
    id: 'graduate',
    title: 'React Graduate',
    description: 'Complete all 19 modules. You did it!',
    icon: 'GraduationCap',
    check: (s) => s.percent >= 100,
  },
]
