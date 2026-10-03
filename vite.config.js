import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// `npm run build:single` produces one self-contained HTML file (hash routing,
// fonts and assets inlined) that can be opened from disk or shared as a demo link.
export default defineConfig(({ mode }) => ({
  plugins: [react(), ...(mode === 'single' ? [viteSingleFile()] : [])],
  server: { port: 5173 },
  build: mode === 'single' ? { outDir: 'dist-single', assetsInlineLimit: 100000000 } : {},
}))
