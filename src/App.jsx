import { useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Sidebar } from './components/layout/Sidebar'
import { Header } from './components/layout/Header'
import Home from './pages/Home'
import Sandbox from './pages/Sandbox'
import ModulePage from './pages/ModulePage'
import Progress from './pages/Progress'
import NotFound from './pages/NotFound'

/*
 * App — the persistent shell: a fixed Sidebar + Header that frame the routed
 * page content. Routes are wrapped in AnimatePresence so framer-motion can run
 * a subtle enter/exit transition between pages (kept snappy, see PageTransition).
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
          {/* `key={location.pathname}` lets AnimatePresence detect route changes. */}
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/learn/:slug" element={<ModulePage />} />
              <Route path="/sandbox" element={<Sandbox />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
