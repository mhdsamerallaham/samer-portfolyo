import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss(), react()],
  build: {
    // Target modern browsers only (drops legacy polyfills)
    target: 'es2020',
    rollupOptions: {
      output: {
        // Manual chunk splitting for optimal caching and parallel loading
        manualChunks(id) {
          // React core — cached separately
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) {
            return 'vendor-react';
          }
          // Routing — cached separately
          if (id.includes('node_modules/react-router')) {
            return 'vendor-router';
          }
          // i18n framework
          if (id.includes('node_modules/i18next') || id.includes('node_modules/react-i18next')) {
            return 'vendor-i18n';
          }
          // Locale JSON files (large data blobs)
          if (id.includes('/locales/')) {
            return 'locales';
          }
          // GSAP animation library
          if (id.includes('node_modules/gsap') || id.includes('node_modules/@gsap')) {
            return 'vendor-gsap';
          }
          // Lenis smooth scroll
          if (id.includes('node_modules/lenis')) {
            return 'vendor-lenis';
          }
          // Lucide icons
          if (id.includes('node_modules/lucide-react')) {
            return 'vendor-icons';
          }
        },
      },
    },
  },
})
