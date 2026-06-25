# Changelog

All notable changes to **React Playground** are documented here.

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
