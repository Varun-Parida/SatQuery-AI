import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  // The frontend calls the FastAPI backend directly at VITE_API_BASE_URL
  // (default http://127.0.0.1:8000, CORS enabled in backend/app/main.py),
  // so no dev proxy is needed.
  server: {
    port: 5173,
  },
})
