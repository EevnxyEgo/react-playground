import { useState, lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { Sidebar } from './components/layout/Sidebar'
import { Header } from './components/layout/Header'
import Home from './pages/Home'
import Sandbox from './pages/Sandbox'
import ModulePage from './pages/ModulePage'
import Progress from './pages/Progress'
import NotFound from './pages/NotFound'

// v2 "Interview Mastery" + Capstone + Readiness pages are code-split — they pull
// in heavier deps (Sandpack data banks, recharts) only when visited.
const HookDecisionEngine = lazy(() => import('./pages/HookDecisionEngine'))
const DecisionMap = lazy(() => import('./pages/DecisionMap'))
const ArchitectureTrainer = lazy(() => import('./pages/ArchitectureTrainer'))
const Challenges = lazy(() => import('./pages/Challenges'))
const DebuggingGauntlet = lazy(() => import('./pages/DebuggingGauntlet'))
const PredictOutput = lazy(() => import('./pages/PredictOutput'))
const Flashcards = lazy(() => import('./pages/Flashcards'))
const InterviewSimulator = lazy(() => import('./pages/InterviewSimulator'))
const Capstone = lazy(() => import('./pages/Capstone'))
const Readiness = lazy(() => import('./pages/Readiness'))
// v3 — Testing, Under the Hood, Retention
const TestingModulePage = lazy(() => import('./pages/TestingModulePage'))
const TddMode = lazy(() => import('./pages/TddMode'))
const UnderTheHood = lazy(() => import('./pages/UnderTheHood'))
const Review = lazy(() => import('./pages/Review'))
const TeachBackJournal = lazy(() => import('./pages/TeachBackJournal'))

function RouteFallback() {
  return (
    <div className="grid h-64 place-items-center text-content-faint">
      <Loader2 className="animate-spin text-accent" size={28} />
    </div>
  )
}

/*
 * App — the persistent shell: a fixed Sidebar + Header that frame the routed
 * page content. Routes are wrapped in AnimatePresence (subtle page transitions)
 * and Suspense (for the lazy v2 pages).
 */
export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="min-h-screen">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />

      <div className="lg:pl-72">
        <Header onMenu={() => setMenuOpen(true)} />

        <main className="mx-auto w-full max-w-6xl px-4 py-6 lg:px-8 lg:py-8">
          <AnimatePresence mode="wait">
            <Suspense fallback={<RouteFallback />}>
              <Routes location={location} key={location.pathname}>
                {/* Track 1 — Foundations */}
                <Route path="/" element={<Home />} />
                <Route path="/learn/:slug" element={<ModulePage />} />
                <Route path="/sandbox" element={<Sandbox />} />
                <Route path="/progress" element={<Progress />} />

                {/* Track 2 — Interview Mastery */}
                <Route path="/hook-decision-engine" element={<HookDecisionEngine />} />
                <Route path="/decision-map" element={<DecisionMap />} />
                <Route path="/architecture-trainer" element={<ArchitectureTrainer />} />
                <Route path="/challenges" element={<Challenges />} />
                <Route path="/debugging-gauntlet" element={<DebuggingGauntlet />} />
                <Route path="/predict-output" element={<PredictOutput />} />
                <Route path="/flashcards" element={<Flashcards />} />
                <Route path="/interview-simulator" element={<InterviewSimulator />} />

                {/* Track 4 — Testing Fundamentals */}
                <Route path="/testing/:slug" element={<TestingModulePage />} />
                <Route path="/tdd" element={<TddMode />} />

                {/* Track 5 — Under the Hood */}
                <Route path="/under-the-hood" element={<UnderTheHood />} />

                {/* Retention */}
                <Route path="/review" element={<Review />} />
                <Route path="/teach-back" element={<TeachBackJournal />} />

                {/* Track 3 — Capstone + Readiness */}
                <Route path="/capstone" element={<Capstone />} />
                <Route path="/readiness" element={<Readiness />} />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
