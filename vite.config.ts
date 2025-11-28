import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import path from 'path'

export default defineConfig({
  plugins: [preact()],
  server: {
    port: 3003,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
