import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) return 'vendor_react'
          if (id.includes('node_modules/react-router')) return 'vendor_router'
          if (id.includes('node_modules/firebase')) return 'vendor_firebase'
          if (id.includes('node_modules/redux')) return 'vendor_redux'
        },
      },
    },
  },
})
