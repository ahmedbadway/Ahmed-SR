import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages serves this project under /Ahmed-SR/ (the repo name).
// base must match the repo path so asset URLs resolve in production.
export default defineConfig({
  base: '/Ahmed-SR/',
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
