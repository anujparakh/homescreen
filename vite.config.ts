import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import path from 'path'

const isPages = process.env.GITHUB_PAGES === 'true'

export default defineConfig({
  plugins: [preact()],
  server: {
    port: 3003,
  },
  base: isPages ? '/homescreen' : '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
