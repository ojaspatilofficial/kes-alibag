import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Forward API calls and uploaded files to the Express server (server/index.js).
    proxy: {
      '/api': 'http://localhost:5050',
      '/uploads': 'http://localhost:5050',
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // React, React DOM and React Router change rarely: keep them in their own long-cached file.
          if (/node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/.test(id)) return 'react';
          return undefined;
        },
      },
    },
  },
});
