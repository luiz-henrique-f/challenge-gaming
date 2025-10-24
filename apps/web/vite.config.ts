import path from "path"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { tanstackRouter } from '@tanstack/router-plugin/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }), react(), tailwindcss()],
  optimizeDeps: {
    include: ['@repo/types']
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      '@repo/types': '/home/luiz_henrique/challenge-gaming-jungle/packages/types/src'
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
})
