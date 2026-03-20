import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'
import { defineConfig } from 'vite'

const env = dotenv.config().parsed || {}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    'import.meta.env.HARDCODED_BEARER': JSON.stringify(env.HARDCODED_BEARER || process.env.HARDCODED_BEARER || ''),
    'import.meta.env.VITE_HARDCODED_BEARER': JSON.stringify(env.VITE_HARDCODED_BEARER || env.HARDCODED_BEARER || process.env.VITE_HARDCODED_BEARER || process.env.HARDCODED_BEARER || ''),
    'process.env.HARDCODED_BEARER': JSON.stringify(env.HARDCODED_BEARER || process.env.HARDCODED_BEARER || ''),
  },
})
