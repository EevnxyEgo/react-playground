/** @type {import('tailwindcss').Config} */
// Tailwind configuration for React Playground.
// - darkMode: 'class' so we can toggle themes from our AppContext (default: dark).
// - Custom palette: React-flavored blue→cyan accents, plus a reserved "flash"
//   yellow/orange used *only* by the Render Visualizer so re-renders are unmistakable.
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // React brand-ish accent gradient endpoints
        react: {
          blue: '#087ea4',
          cyan: '#58c4dc',
          light: '#61dafb',
        },
        accent: {
          DEFAULT: '#38bdf8', // sky-400
          glow: '#22d3ee', // cyan-400
        },
        // Reserved exclusively for the render-flash effect
        flash: {
          DEFAULT: '#facc15', // amber-400
          strong: '#f59e0b', // amber-500
        },
        // Neutral surface scale — CSS-variable driven so it flips between the
        // dark (default) and light themes. Values live in src/index.css.
        surface: {
          950: 'rgb(var(--s-950) / <alpha-value>)',
          900: 'rgb(var(--s-900) / <alpha-value>)',
          800: 'rgb(var(--s-800) / <alpha-value>)',
          700: 'rgb(var(--s-700) / <alpha-value>)',
          600: 'rgb(var(--s-600) / <alpha-value>)',
        },
        // Themed neutral text scale (replaces hard-coded slate-* for body text).
        content: {
          strong: 'rgb(var(--c-strong) / <alpha-value>)',
          DEFAULT: 'rgb(var(--c-base) / <alpha-value>)',
          muted: 'rgb(var(--c-muted) / <alpha-value>)',
          faint: 'rgb(var(--c-faint) / <alpha-value>)',
        },
        // Themed hairline color for borders / subtle fills.
        line: 'rgb(var(--line) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(56,189,248,0.15), 0 8px 30px rgba(56,189,248,0.12)',
        card: '0 4px 24px -8px rgba(0,0,0,0.4)',
      },
      keyframes: {
        'flash-fade': {
          '0%': { boxShadow: '0 0 0 2px #facc15, 0 0 18px 2px rgba(250,204,21,0.7)' },
          '100%': { boxShadow: '0 0 0 0px rgba(250,204,21,0)' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pop': {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '60%': { transform: 'scale(1.05)', opacity: '1' },
          '100%': { transform: 'scale(1)' },
        },
      },
      animation: {
        'flash-fade': 'flash-fade 0.7s ease-out',
        'fade-in': 'fade-in 0.4s ease-out both',
        'pop': 'pop 0.3s ease-out both',
      },
    },
  },
  plugins: [],
}
