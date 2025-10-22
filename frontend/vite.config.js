import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Replace this with your actual Render backend URL
const BACKEND_URL = 'https://presko.onrender.com';
const LOCALBACKEND_URL = 'http://127.0.0.1:8000';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: LOCALBACKEND_URL,
        changeOrigin: true,       // Makes the request appear as coming from the backend host
        secure: true,             // Use HTTPS
        rewrite: (path) => path.replace(/^\/api/, ''), // Remove /api prefix
      },
    },
  },
});
