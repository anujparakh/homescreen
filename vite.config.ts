import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import path from 'path'

export default defineConfig({
  plugins: [preact()],
  server: {
    port: 3003,
    host: '0.0.0.0', // Listen on all network interfaces
    allowedHosts: true, // Allow requests from any host
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
