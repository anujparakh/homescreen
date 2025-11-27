import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'

const isPages = process.env.GITHUB_PAGES === 'true'

export default defineConfig({
  plugins: [preact()],
  server: {
    port: 3003,
  },
  base: isPages ? '/homescreen' : '/',
})
