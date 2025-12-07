import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  server: {
    port: 80,
    host: true
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
