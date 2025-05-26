import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    // Only include specific env vars if needed
    'process.env.SOME_VAR': JSON.stringify(process.env.SOME_VAR)
  }
})