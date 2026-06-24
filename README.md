# ⚛️ React Playground

An interactive, **learn-by-doing** web app for mastering React fundamentals —
from your very first component all the way to advanced hooks. Instead of just
reading theory, you edit live code, *watch* components re-render, take quick
quizzes, and earn XP as you go.

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
