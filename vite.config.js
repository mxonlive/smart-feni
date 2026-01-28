import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'Smart Feni',
        short_name: 'SmartFeni',
        description: 'Digital Services App for Feni City',
        theme_color: '#cc0000',
        background_color: '#efe7de',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        orientation: 'portrait'
      }
    })
  ],
})
