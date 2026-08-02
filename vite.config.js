import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/akatsuki-roulette/',
  build: {
    chunkSizeWarningLimit: 1000, // Augmente la limite à 1000 ko (1 Mo)
  },
})
