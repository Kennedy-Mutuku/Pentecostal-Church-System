import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  assetsInclude: ['**/*.JPG'],
  plugins: [react()],
  server: {
    port: 5175,
    host: true,
    watch: {
      usePolling: true,
      interval: 100
    },
    hmr: {
      overlay: true
    },
    proxy: {
      '/users': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: true
      },
      '/news': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        bypass: (req) => req.headers.accept?.includes('text/html') ? '/index.html' : null
      },
      '/attendance': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        bypass: (req) => req.headers.accept?.includes('text/html') ? '/index.html' : null
      },
      '/api/finance': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      },
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      },
      '/sadmin': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      },
      '/admissionadmin': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      },
      '/documents': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        bypass: (req) => req.headers.accept?.includes('text/html') ? '/index.html' : null
      },
      '/minutes': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        bypass: (req) => req.headers.accept?.includes('text/html') ? '/index.html' : null
      },
      '/commitmentForm': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      },
      '/chat/': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        bypass: (req) => req.headers.accept?.includes('text/html') ? '/index.html' : null
      },
      '/messages': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      },
      '/uploads': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      },
      '/overseer': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        bypass: (req) => req.headers.accept?.includes('text/html') ? '/index.html' : null
      },
      '/patron': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        bypass: (req) => req.headers.accept?.includes('text/html') ? '/index.html' : null
      }
    }
  },
  css: {
    devSourcemap: true
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          fontawesome: ['@fortawesome/fontawesome-svg-core', '@fortawesome/free-solid-svg-icons', '@fortawesome/free-regular-svg-icons', '@fortawesome/free-brands-svg-icons', '@fortawesome/react-fontawesome'],
          pdf: ['jspdf', 'jspdf-autotable'],
          ui: ['bootstrap', 'react-icons', 'lucide-react']
        }
      }
    }
  }
})
