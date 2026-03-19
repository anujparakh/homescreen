import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import path from 'path'
import type { Connect } from 'vite'

export default defineConfig({
  plugins: [
    preact(),
    {
      name: 'backgrounds-cache-headers',
      configureServer(server) {
        server.middlewares.use(
          (req: Connect.IncomingMessage, res, next) => {
            if (req.url?.startsWith('/backgrounds/')) {
              res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
            }
            next()
          }
        )
      },
    },
  ],
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
