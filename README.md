# ⚛️ React Playground

An interactive, **learn-by-doing** web app that takes you from your first React
component all the way to **interview-ready**. Instead of just reading theory,
you edit live code, *watch* components re-render, take quizzes, drill the
decisions interviewers probe, debug broken code, and run timed mock interviews.

Organized into three tracks:

1. **Foundations** — 19 learn-by-doing modules (the v1 course).
2. **Interview Mastery** — decision trainers, a challenge library, a debugging
   gauntlet, predict-the-output, flashcards and a live interview simulator.
3. **Capstone** — build your own portfolio site with shrinking scaffolding.

…all feeding a **Confidence Dashboard** that scores your interview readiness
across six skill axes.

> Built as a real, incrementally-developed project. The app's own source code
> doubles as a worked example of the concepts it teaches (its global state is a
> hand-rolled `useReducer` + Context store; the render-flash effect is a custom
> hook).

---

## ✨ Features

- **19 hands-on modules** — Components, JSX, Props, State, Events, Conditional
  Rendering, Lists & Keys, Forms, `useEffect`, `useRef`, `useContext`,
  `useReducer`, Custom Hooks, Optimization, Error Boundaries, Composition,
  React Router, and a final **Todo App** capstone.
- **Live playgrounds** — every module embeds an editable code editor + instant
  preview (powered by Sandpack), with a collapsible **Show Solution**.
- **Render Visualizer** — a reusable `useRenderFlash()` hook makes components
  flash amber *exactly* when React re-renders them, so re-render behavior is
  visible rather than abstract (used heavily in Modules 1, 4, 9, 10 & 14).
- **Comparison Mode** — function vs class side-by-side (Modules 1, 4, 9, plus
  controlled-vs-uncontrolled and useState-vs-useReducer).
- **Instant quizzes** — immediate feedback, a confetti burst on correct answers,
  and explanations when you miss.
- **Mini State Inspector** — a live JSON view of demo state next to playgrounds.
- **Progress system** — XP, levels, achievement badges and a global progress
  bar, all **persisted to `localStorage`**.
- **Free Sandbox** — a blank editor for open experimentation.
- **Dark / light theme** (dark by default), **module search**, smooth
  **framer-motion** page transitions, and a **responsive** layout (the sidebar
  becomes a drawer on mobile).

### Interview Mastery (v2.0)

- **Hook Decision Engine** — 12 scenarios drilling "which hook & why", with a
  "why NOT the alternatives" reveal, plus a visual **Decision Map**.
- **Component Architecture Trainer** — 6 wireframes: split the UI into
  components and decide where state lives, then compare to a model breakdown.
- **Challenge Library** — 23 realistic live-coding exercises with reference
  solutions and "what a strong candidate also considers" notes.
- **Debugging Gauntlet** — the 9 classic React bugs, each a broken app to fix.
- **Predict-the-Output** — 12 code-reading challenges, run live to confirm.
- **Flashcards** — 16 rapid-fire concept cards with spaced repetition.
- **Live Interview Simulator** — brief → clarify gate → plan gate → timed
  coding → self-review → reference solution, saved to an **Interview Journal**.
- **Confidence Dashboard** — a recharts **skill radar** across 6 axes driven by
  real activity, with a deep-linked "focus next" nudge.

See [CHANGELOG.md](./CHANGELOG.md) for the full v2.0 breakdown.

---

## 🧱 Tech Stack

| Concern            | Choice                                            |
| ------------------ | ------------------------------------------------- |
| Build tool         | **Vite**                                          |
| Framework          | **React 18** (plain JavaScript, no TypeScript)    |
| Styling            | **Tailwind CSS** (CSS-variable theme tokens)      |
| Live code editor   | **@codesandbox/sandpack-react**                   |
| Routing            | **react-router-dom**                              |
| Animation          | **framer-motion**                                 |
| Icons              | **lucide-react**                                  |
| Global state       | **React Context + useReducer** (no external lib)  |
| Charting           | **recharts** (v2.0, dashboard radar only)         |
| Persistence        | **localStorage**                                  |

---

## 🚀 Getting Started

```bash
# install dependencies
npm install

# start the dev server (http://localhost:5173)
npm run dev

# production build
npm run build

# preview the production build locally
npm run preview
```

> Requires Node 18+.

---

## 📂 Project Structure

```
src/
  components/
    layout/      Sidebar, Header, ProgressBar, PageTransition
    learning/    ModuleLayout, CodePlayground, ComparisonTabs, Quiz,
                 Challenge, RenderFlashWrapper, StateInspector, Section, …
    ui/          Button, Card, Badge, Toggle, Tabs
  context/
    AppContext.jsx   global state (progress, XP, theme) via useReducer
  hooks/
    useRenderFlash.js  the Render Visualizer engine
    useProgress.js     ergonomic facade over AppContext
  data/
    modulesList.js   metadata for routing + sidebar
    badges.js        achievement definitions
  modules/
    00-welcome/ … 18-final-project/   one folder per module (content.jsx)
    registry.js   lazy-loads each module by slug
  pages/
    Home.jsx, ModulePage.jsx, Sandbox.jsx, Progress.jsx, NotFound.jsx
  lib/
    cn.js, icons.js
  App.jsx, main.jsx, index.css
```

Each module follows the same **six-layer teaching rhythm**: opening hook →
short explanation + analogy → live playground → render visualizer → mini
challenge → instant quiz.

---

## 🎓 How It's Built

This repository was developed incrementally, the way a senior engineer would —
the Git history reads as a step-by-step build log (scaffold → core building
blocks → reference modules → remaining modules → platform features → polish).
Browse `git log` to retrace it.

Highlights of the architecture:

- **`AppContext`** is a from-scratch `useReducer` store. XP, level, completion %
  and earned badges are all *derived* from raw progress, so the numbers can
  never disagree.
- **`useRenderFlash`** counts renders in a ref and restarts a CSS keyframe on
  each commit — a real, reusable hook that powers every visualizer.
- **Modules are data + lazy components**: `modulesList.js` drives navigation,
  while `registry.js` code-splits each lesson so you only download what you open.
- **Theming** uses CSS-variable color tokens (`surface-*`, `content-*`, `line`)
  that flip between dark and light, wired to Tailwind.

---

## 📜 License

Educational project — free to use and learn from.
