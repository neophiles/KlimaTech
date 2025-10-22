import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Replace this with your actual Render backend URL
const BACKEND_URL = 'https://presko.onrender.com';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      // All requests starting with /api will be forwarded to the backend
      '/api': {
        target: BACKEND_URL,
        changeOrigin: true,       // Makes the request appear as coming from the backend host
        secure: true,             // Use HTTPS
        rewrite: (path) => path.replace(/^\/api/, ''), // Remove /api prefix
      },
    },
  },
});
