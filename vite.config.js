import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Force refresh on file changes
    hmr: {
      overlay: true
    },
    // Clear cache on startup
    force: true
  },
  build: {
    // Prevent build caching issues
    rollupOptions: {
      output: {
        // Add hash to filenames to prevent caching
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]'
      }
    }
  }
})
