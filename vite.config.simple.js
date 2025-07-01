import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/ - SIMPLIFIED FOR DEBUGGING
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.js',
    devSourcemap: true
  },
  server: {
    // Force refresh on file changes
    hmr: {
      overlay: true
    },
    // Clear cache on startup
    force: true
  },
  build: {
    // Basic build options
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]'
      }
    }
  }
})
