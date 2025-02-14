import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  root: '.',
  resolve: {
    alias: {
      '@astrodraw/astrochart': path.resolve(__dirname, './project/src/index.ts')
    }
  },
  server: {
    open: true
  }
}) 