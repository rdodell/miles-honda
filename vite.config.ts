import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Tailwind v4 is processed via PostCSS (postcss.config.mjs) rather than the
// @tailwindcss/vite plugin, whose dev-mode candidate scanning is broken under
// Vite 8 (utilities generated at build time but not in the dev server).
export default defineConfig({
  plugins: [react()],
  server: { port: 5175, strictPort: true },
})
