# Changelog

All notable changes to **React Playground** are documented here.

## v3.0.0 — Test It, Understand It, Make It Stick

v3 closes the three highest-leverage gaps toward "genuinely zero to hero":
testing, a real mental model of how React works, and long-term retention. It
extends the existing codebase (same `AppContext`, design tokens, Sandpack
patterns, generalized `ModuleLayout`) — not a rewrite.

### Added — Track 4: Testing Fundamentals (Jest + RTL)

- A **live in-browser test runner** (`TestPlayground`) built on Sandpack's
  `SandpackTests` — no new dependency. Spike confirmed `render`, `screen`,
  role/text/label queries, `getBy`/`queryBy`/`findBy`, `fireEvent`, `jest.fn`,
  `waitFor` and `renderHook` run live; `user-event` is shown as annotated
  best-practice (documented fallback).
- **11 modules**: Why Test/The Pyramid, Jest basics, RTL philosophy, querying,
  simulating interaction, testing forms, async, mocking, snapshots, testing
  custom hooks, and what's worth testing.
- **Reinforcement** exercises that test v1/v2-style components (validated form,
  fetch flow, custom hook) rather than throwaway examples.
- **TDD Mode** — 4 failing-tests-first exercises (counter, toggle, validator,
  hook): implement until green, then reveal the reference.

### Added — Track 5: Under the Hood

- A reusable, **data-driven `ReconciliationStepper`** with debugger-style
  controls (play/pause/step-forward/step-back) across 4 scenarios: simple
  update, list with good-vs-index keys, unmount/remount on type change, and
  batching — highlighting reused/updated/added/removed nodes (render phase) and
  DOM-touched nodes (commit phase).

### Added — Retention Engine

- **`useSpacedRepetition`** — one shared Leitner engine (3d → 7d → 21d → 45d).
  Flashcards migrated onto it (no parallel system); quizzes, challenges and
  debugging exercises seed reviews on completion.
- **Today's Review** (`/review`) — a unified mixed queue of everything due.
- **Teach-Back Journal** — a Feynman-technique prompt after modules, challenges
  and Under-the-Hood scenarios (write → self-check → optional model reveal,
  gated so it never anchors), persisted and browsable.
- **`<CommonMistake>`** inline callouts retrofitted across 10 v1 modules and the
  v2 Challenge Library, each cross-linking to existing Debugging/Predict content.

### Changed

- Confidence Dashboard radar gains **Testing** and **Internals** axes (now 8),
  and **Communication** is also driven by Teach-Back entries.
- Navigation adds Track 4, Track 5, a persistent **Today's Review** item (with a
  due badge) and a Teach-Back Journal link.

## v2.0.0 — Interview Mastery

v1 made React concepts understandable. **v2.0 turns the app into an
interview-prep platform** — built to make decision-making under pressure
reflexive. It extends the existing codebase (same `AppContext`, design tokens,
`useRenderFlash`, `CodePlayground`) rather than rewriting it.

### Added

- **Hook Decision Engine** (`/hook-decision-engine`) — 12 real-world scenarios:
  pick the right hook, articulate *why*, then see a "why NOT the alternatives"
  breakdown. Score feeds the Hooks Mastery skill axis.
- **Hooks Decision Map** (`/decision-map`) — a one-page visual flowchart
  (state vs ref vs reducer) plus a quick-reference table for the side cases.
- **Component Architecture Trainer** (`/architecture-trainer`) — 6 wireframe
  mockups (Simple → Complex): name regions, sketch a component tree, and assign
  state ownership, then reveal the model breakdown and "what would go wrong"
  pitfall. Drills the "lifting state up" instinct.
- **Interview Challenge Library** (`/challenges`) — 23 realistic live-coding
  exercises across component classics, data/async patterns, forms, custom hooks
  and patterns. Each has an interviewer-style brief, a minimal starter, a
  reference solution and a "what a strong candidate also considers" callout.
- **Debugging Gauntlet** (`/debugging-gauntlet`) — the 9 classic React bugs,
  each a broken app that genuinely misbehaves; fix it live, then reveal the fix,
  the cause, and the general pattern.
- **Predict-the-Output** (`/predict-output`) — 12 code-reading challenges
  (batching, closures, effect timing, render vs commit, identity). Predict
  first, then run the snippet live to confirm.
- **Flashcards** (`/flashcards`) — 16 rapid-fire concept Q&A cards
  (question → model answer → likely follow-up) with simple spaced repetition.
- **Live Interview Simulator** (`/interview-simulator`) — the full mock round:
  brief → required clarifying-questions gate → required plan gate → timed
  Sandpack coding (high-stakes countdown header) → self-review checklist →
  reference solution + senior discussion notes + follow-ups. Every attempt is
  saved to an **Interview Journal** in localStorage.
- **Capstone — Build Your Portfolio Site** (`/capstone`) — 8 milestones with
  deliberately *decreasing* scaffolding (full code → on your own), ending in a
  zero-hint deploy milestone with a Vercel/Netlify guide.
- **Confidence Dashboard / Interview Readiness Report** (`/readiness`) — a
  6-axis skill radar (recharts) derived from real activity, per-axis bars,
  activity tiles, and a deep-linked "focus next" nudge to your weakest area.

### Changed

- **Navigation** restructured into three tracks — **Foundations** (the v1
  modules), **Interview Mastery**, and **Capstone** — with a persistent
  Readiness summary always visible in the sidebar.
- **`AppContext`** extended (same store, same localStorage key) with new metric
  slices and a derived skill radar / readiness score. All v1 progress is
  preserved.

### Dependencies

- Added **recharts** — the single new dependency, used only for the dashboard
  radar chart.

---

## v1.0.0 — Foundations

- 19 learn-by-doing modules (Components → Final Todo App) with live Sandpack
  playgrounds, a real Render Visualizer (`useRenderFlash`), comparison tabs,
  instant quizzes, an XP/level/badge progress system, a free sandbox, dark/light
  theming, search and smooth page transitions.
