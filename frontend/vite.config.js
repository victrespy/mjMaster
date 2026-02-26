import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    // Permitir cualquier host (ngrok, etc.)
    allowedHosts: true,
    hmr: {
      // Al no definir host ni port, el cliente HMR usará 
      // automáticamente la URL del navegador (ngrok o localhost)
    },
    watch: {
      usePolling: true
    }
  }
})
