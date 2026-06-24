import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite config — fast dev server + optimized production build for React Playground.
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
  build: {
    // The Sandpack bundler is intentionally large and already lives in its own
    // chunk; raise the limit so the build stays warning-free.
    chunkSizeWarningLimit: 1600,
  },
})
