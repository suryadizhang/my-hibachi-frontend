import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
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
    // Increase chunk size warning limit to 1000kb (1MB)
    chunkSizeWarningLimit: 1000,
    // CSS optimization
    cssCodeSplit: true,
    // Prevent build caching issues
    rollupOptions: {
      output: {
        // Add hash to filenames to prevent caching
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]',
        // Manual chunking for better performance
        manualChunks: {
          // Vendor chunks - separate large libraries
          'react-vendor': ['react', 'react-dom'],
          'bootstrap-vendor': ['bootstrap', 'react-bootstrap'],
          'redux-vendor': ['@reduxjs/toolkit', 'react-redux'],
          'router-vendor': ['react-router-dom'],
          'icons-vendor': ['react-icons', 'react-bootstrap-icons'],
          'date-vendor': ['react-calendar', 'react-datepicker'],
          'utils-vendor': ['axios', 'react-helmet-async']
        }
      }
    },
    // Enable tree shaking for better optimization
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true
      }
    }
  }
})
