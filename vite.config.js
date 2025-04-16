import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'My AQI Map',
        short_name: 'AQIMap',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#ffffff',
        icons: [
          {
            src: '/react.svg',
            sizes: '192x192',
            type: 'image/svg'
          },
          {
            src: '/react.svg',
            sizes: '512x512',
            type: 'image/svg'
          }
        ]
      }
    })
  ], server: {
    proxy: {
      '/api': {
        target: 'http://air4thai.pcd.go.th',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
