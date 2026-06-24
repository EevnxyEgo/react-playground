# 🚀 ULTRAPROMPT: Build "React Playground" — An Interactive React Learning Web App

You are a senior frontend engineer + instructional designer. Your task: build an **interactive web app** called **"React Playground"** for learning React fundamentals from zero to confidently understanding hooks — using a **learning-by-doing** approach. Not just theory: live-coding, render visualization, side-by-side code style comparisons, and instant quizzes for every topic.

Target user: a beginner who already knows basic HTML/CSS/JS but has never touched React. Primary goal: make React concepts genuinely **stick** through repetition, visuals, and hands-on experimentation — not just reading.

This is also a real software project. You must work and commit like an experienced senior developer would: incrementally, with clean history, not a single giant dump at the end. See **Section 7 (Git Workflow)** — it is just as important as the feature requirements.

---

## 1. REQUIRED TECH STACK

- **Vite + React 18** (plain JavaScript, NOT TypeScript — to keep focus on React concepts rather than type system overhead)
- **Tailwind CSS** for all styling
- **@codesandbox/sandpack-react** — this is the CORE component. Used for the live code editor + live preview in every module (the user edits code and sees results in real time, like a real playground)
- **framer-motion** for page transitions & micro-interactions
- **react-router-dom** for navigation between modules
- **lucide-react** for all icons
- Global app state (progress, XP, dark mode) implemented with **React Context + useReducer**, written from scratch (do NOT use an external state management library — this is intentional: the app itself becomes a living example of the concepts it teaches)
- **localStorage** to persist learning progress across sessions

---

## 2. PEDAGOGICAL DESIGN PRINCIPLES (IMPORTANT — THIS IS WHAT MAKES IT DIFFERENT FROM REGULAR DOCS)

Every module/topic MUST follow this 6-layer structure:

1. **Opening hook** — a question or scenario that triggers curiosity before any theory (e.g. "Why doesn't this button's number update when you click it?")
2. **Short explanation + analogy** — casual tone, minimal jargon, max 3-4 short paragraphs
3. **Live Playground (Sandpack)** — code editor + preview side-by-side, with editable starter code, plus a collapsible "Show Solution" button
4. **Render Visualizer** — every time a component re-renders, show a visual effect (a colored border flash, e.g. yellow fading out) around that component in the preview, so the user can LITERALLY see when React re-renders something. This must be a reusable custom hook, e.g. `useRenderFlash()`
5. **Mini Challenge** — a small task ("modify the code so the counter starts at 10"), with simple automatic validation (checking the preview/console output) OR at minimum a self-check checklist
6. **Instant Quiz** — 1-2 multiple choice questions with immediate feedback (correct = small confetti animation, incorrect = explanation of why), no backend submission needed

Additional requirement for many modules: **Comparison Mode** — a toggle/tabs to compare two ways of writing the same concept (see module list below — several explicitly require this).

---

## 3. MODULE LIST (REQUIRED CONTENT, KEEP THIS ORDER)

### Module 0 — Welcome
App intro, what React is in one paragraph, how to use this playground, explain the progress tracker.

### Module 1 — Ways to Create a Component (MUST HAVE 3-TAB COMPARISON MODE)
Show **3 ways to write the same component** (e.g. `Greeting`) side by side via tabs:
- **Function Declaration**: `function Greeting() { return <h1>Hi</h1> }`
- **Function Expression (arrow + const)**: `const Greeting = () => { return <h1>Hi</h1> }`
- **Class Component**: `class Greeting extends React.Component { render() { return <h1>Hi</h1> } }`

Explain: functionally equivalent, but function components are the modern standard (reason: hooks only work in function components). Class components are still worth knowing because many legacy codebases use them.

### Module 2 — JSX
JSX rules (must return a single root element / Fragment, camelCase attributes, `className` instead of `class`, embedding JS with `{}`). Playground: broken vs correct JSX so the user can see React's real error messages.

### Module 3 — Props
Passing data into components, destructuring props, default props, `props.children`. Playground: build a reusable `<Card title="..." />` component.

### Module 4 — State (COMPARISON MODE REQUIRED)
- **Function component**: `const [count, setCount] = useState(0)`
- **Class component**: `this.state = { count: 0 }` + `this.setState(...)`

The Render Visualizer matters most here — show the flash on every state change/re-render.

### Module 5 — Event Handling
`onClick`, `onChange`, passing arguments to handlers, synthetic events. Playground: a simple form.

### Module 6 — Conditional Rendering
`&&`, ternary, early return, switch-case. Playground: show/hide toggle.

### Module 7 — Rendering Lists & Keys
`.map()`, why `key` matters (demonstrate a visual bug when key is missing or index is misused during list reordering).

### Module 8 — Forms & Controlled Components
Controlled vs uncontrolled inputs, `value` + `onChange`, multiple inputs with a single state object.

### Module 9 — useEffect vs Lifecycle Methods (COMPARISON MODE REQUIRED)
Side-by-side comparison:
- Class: `componentDidMount`, `componentDidUpdate`, `componentWillUnmount`
- Function: `useEffect(() => {...}, [])`, `useEffect(() => {...}, [dep])`, cleanup function `return () => {...}`

Playground: a timer/interval that must be cleaned up, so the user can see a memory leak when cleanup is forgotten.

### Module 10 — useRef
Direct DOM access, storing a value that does NOT trigger a re-render (contrast with useState which does — use the Render Visualizer to prove the difference).

### Module 11 — useContext & Context API
Visualize the "prop drilling" problem as a component tree diagram, then the Context solution. Playground: a global theme switcher using Context.

### Module 12 — useReducer
For more complex state logic. Compare stacked useState calls vs useReducer for the same use case (e.g. a simple cart).

### Module 13 — Custom Hooks
How to extract repeated logic into your own hook (e.g. `useLocalStorage`, `useWindowSize`). Rule: must start with `use`.

### Module 14 — Optimization: React.memo, useMemo, useCallback
Use the Render Visualizer to PROVE the difference — unoptimized render (every child flashes) vs optimized (only the relevant child flashes).

### Module 15 — Error Boundaries
Explain this currently only exists as a class component pattern (no official hook equivalent). Playground: a component that intentionally throws, caught by an Error Boundary.

### Module 16 — Composition vs Inheritance
React recommends composition. Show the `props.children` pattern and render props.

### Module 17 (Bonus) — React Router Basics
`<Route>`, `<Link>`, `useParams`, SPA navigation between "pages".

### Module 18 — Final Mini Project
Combine everything learned: build a complete Todo App (state, list+keys, forms, useEffect for localStorage persistence, conditional rendering, a custom hook). This is the "boss level".

---

## 4. PLATFORM-WIDE FEATURES (BEYOND PER-MODULE CONTENT)

1. **Sidebar navigation** — list of modules with progress checkmarks, collapsible on mobile
2. **Progress System** — XP per completed module + correct quiz answers, global progress bar, simple badges/achievements (persisted in localStorage)
3. **Free Sandbox page** — an empty Sandpack instance with no instructions, for free experimentation
4. **Dark/Light mode toggle** (default: dark, fitting a developer-tool aesthetic)
5. **Module search** in the sidebar
6. **Mini State Inspector** — a small panel next to each playground's preview showing the current state value in real time (live JSON display), so state feels concrete rather than abstract
7. **Smooth page transitions** via framer-motion (subtle, must stay snappy — not heavy)
8. **Responsive** — optimized for desktop (since it's a coding tool), but still usable on tablet/mobile (sidebar becomes a drawer)

---

## 5. VISUAL DESIGN

- Aesthetic: modern developer tool, inspired by the new React docs / Scrimba / Linear — not a generic bootstrap-looking template
- Fonts: **Inter** or **Geist** for UI text, **JetBrains Mono** or **Fira Code** for all code
- Base palette: dark theme with a blue-cyan gradient accent (React-flavored), with a distinct yellow/orange color reserved specifically for the "render flash" effect so it's unmistakably visible
- Card-based layout, rounded-xl, soft shadows, generous whitespace — avoid cramped, cluttered UI
- Avoid excessive emoji in the production UI; use lucide-react icons consistently instead

---

## 6. SUGGESTED FOLDER STRUCTURE

```
src/
  components/
    layout/        (Sidebar, Header, ProgressBar)
    learning/       (ModuleLayout, CodePlayground, ComparisonTabs, Quiz, Challenge, RenderFlashWrapper)
    ui/              (Button, Card, Badge, Toggle, Tabs)
  hooks/
    useRenderFlash.js
    useProgress.js
  context/
    AppContext.jsx   (progress, theme, XP)
  modules/
    01-components/
      content.jsx
      examples/        (variant code: function, arrow, class)
    02-jsx/
    ...etc for all modules above
  data/
    modulesList.js    (metadata for all modules, used for routing & sidebar)
  pages/
    Home.jsx
    Sandbox.jsx
    ModulePage.jsx
  App.jsx
  main.jsx
```

---

## 7. GIT WORKFLOW — WORK AND COMMIT LIKE A REAL SENIOR DEVELOPER

This is a hard requirement, not optional polish. **Do not do all the work and then make one single commit at the end.** Do not reuse the same commit message repeatedly. A reviewer should be able to read `git log` afterward and reconstruct exactly how this project was built, step by step — the same way a real senior engineer's history would look.

### Rules
- Initialize the git repository **before** writing any feature code, right after the Vite scaffold exists.
- Add a proper `.gitignore` (node_modules, dist, .env, etc.) in the very first commit — never commit `node_modules`.
- Commit **after every meaningful, working unit of progress** — not just once per "phase." A meaningful unit means: one reusable component finished, one module's content finished, one platform feature finished, etc.
- Each commit must represent the codebase in a working (buildable) state whenever realistically possible.
- Use **Conventional Commits** format: `type(scope): short description`
  - Types: `feat`, `fix`, `refactor`, `style`, `docs`, `chore`, `test`
  - Scope = the area touched, e.g. `setup`, `sandpack`, `module-01`, `progress`, `sidebar`, `darkmode`
- Every commit message must be **specific to what actually changed in that commit** — never copy-paste the same message twice. If a commit body is useful (for non-trivial commits), add 1-3 lines explaining *why*, not just *what*.
- Group logically: don't split a single tiny change into 5 commits, and don't cram 5 unrelated changes into 1 commit.

### Expected commit sequence (use this as a guide, adapt as needed — this is illustrative of the *granularity* expected, not a rigid script)
```
chore(setup): scaffold Vite + React project with Tailwind config
chore(setup): initialize git, add .gitignore
chore(routing): add react-router-dom and base route structure
feat(layout): build Sidebar and Header shell components
feat(context): implement global AppContext for progress, theme and XP
feat(sandpack): build reusable CodePlayground wrapper around Sandpack
feat(hooks): implement useRenderFlash for visualizing re-renders
feat(learning): build ComparisonTabs reusable component
feat(learning): build Quiz component with instant feedback
feat(module-01): add content and 3-way component creation comparison
feat(module-01): wire up live playground and render visualizer
feat(module-04): add useState vs class state comparison content
feat(module-04): wire up render visualizer to prove re-render behavior
feat(module-02): add JSX rules module with broken/correct examples
...
feat(module-18): build final Todo App mini-project module
feat(progress): implement XP, badges and localStorage persistence
feat(sandbox): add free-form sandbox page
feat(darkmode): implement dark/light theme toggle
style(global): polish spacing, typography and animations pass
fix(...): <only if something genuinely needed fixing>
docs(readme): write project README with setup instructions
```
- At the very end, write a clean `README.md` (setup steps, tech stack, what was built) as its own commit — do not skip this.
- If you create branches, that's fine, but it is NOT required — committing directly to `main` with this discipline is acceptable for this project's scope.

---

## 8. EXECUTION PLAN (FOR YOU, CLAUDE CODE)

1. Scaffold the Vite + Tailwind + routing + global Context setup first (a working skeleton app with an empty but functional sidebar) — **commit this before moving on**
2. Build the core reusable building blocks: `<CodePlayground>` (Sandpack wrapper), `<ComparisonTabs>`, `<Quiz>`, `<RenderFlashWrapper>`, `useRenderFlash()` — these are the foundation every module depends on — **commit each as it's completed**
3. Fully implement **Module 1 and Module 4 completely with every feature** (live playground, render visualizer, comparison mode, quiz) as the reference "template pattern" the rest of the modules will follow — **commit per module once it's genuinely working**
4. Once that pattern is solid and verified working, proceed through the remaining modules in order, filling in the educational content per Section 2 — **commit module by module, not all at once**
5. Finally: free Sandbox, progress system, dark mode, animation polish — **commit each feature separately**
6. Write clear code comments throughout (the app's own source code doubles as a learning reference for the user)
7. Confirm `npm run build` succeeds with no errors before declaring anything done
8. Write the final `README.md` as its own last commit

---

## 9. DEFINITION OF DONE

- [ ] All 18 modules exist and are reachable from the sidebar, with progress persisted
- [ ] Every module has a live playground that is genuinely editable with real-time results
- [ ] The Render Visualizer is functionally real (not a placeholder) at minimum in modules 1, 4, 9, and 14
- [ ] Comparison Mode (function vs class) exists in modules 1, 4, and 9
- [ ] Every module's quiz gives instant feedback
- [ ] Dark mode, the progress bar, and the free Sandbox all work
- [ ] No console errors when running the app
- [ ] The git history shows clear, incremental, well-labeled commits reflecting how the project was actually built — not one giant commit at the end
- [ ] A clean README.md exists explaining setup and what was built
- [ ] The UI feels polished and intentional, not like a generic template