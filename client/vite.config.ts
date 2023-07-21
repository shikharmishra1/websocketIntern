import { defineConfig } from 'vite'
import dns from 'dns'
import react from '@vitejs/plugin-react'

dns.setDefaultResultOrder('verbatim')

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host:'localhost',
    proxy: {
      'ws': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        ws: true,
        secure: false,
      }
    }
    }})
