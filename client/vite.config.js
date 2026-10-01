import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  // Kokoro (onnxruntime / wasm) Vite pre-bundle karanna giyama awul wenawa,
  // eka nisa ekata exclude karanawa
  optimizeDeps: {
    exclude: ['kokoro-js'],
  },

  build: {
    target: 'esnext',
  },
})