import { motion } from 'framer-motion'

/*
 * A tiny dependency-free confetti burst (just framer-motion). Rendered for a
 * moment when a quiz answer is correct. `fire` is a changing key so the same
 * spot can re-burst on repeated correct answers.
 */
const COLORS = ['#38bdf8', '#22d3ee', '#facc15', '#34d399', '#f472b6', '#a78bfa']

export function Confetti({ fire }) {
  if (!fire) return null
  const pieces = Array.from({ length: 18 })
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center overflow-visible">
      {pieces.map((_, i) => {
        const angle = (i / pieces.length) * Math.PI * 2
        const dist = 60 + Math.random() * 50
        const x = Math.cos(angle) * dist
        const y = Math.sin(angle) * dist
        return (
          <motion.span
            key={`${fire}-${i}`}
            className="absolute h-2 w-2 rounded-sm"
            style={{ backgroundColor: COLORS[i % COLORS.length] }}
            initial={{ opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 }}
            animate={{ opacity: 0, x, y, scale: 0.4, rotate: Math.random() * 360 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          />
        )
      })}
    </div>
  )
}
