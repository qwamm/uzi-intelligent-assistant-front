import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const API_ORIGIN_URL = 'http://localhost:8000'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/media': {
        target: API_ORIGIN_URL,
        changeOrigin: true,
        secure: false,
      },
      '/api/v3': {
        target: API_ORIGIN_URL,
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
