import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages serves this project under /Ahmed-SR/ (the repo name).
// base must match the repo path so asset URLs resolve in production.
export default defineConfig(({ isSsrBuild }) => ({
  base: '/Ahmed-SR/',
  plugins: [react()],
  build: {
    outDir: isSsrBuild ? 'dist-ssr' : 'dist',
    sourcemap: false,
    // The SSR pass only feeds scripts/prerender.mjs; it must not wipe the
    // client build in dist/.
    emptyOutDir: true,
    rollupOptions: isSsrBuild
      ? {}
      : {
          output: {
            manualChunks: {
              vendor: ['react', 'react-dom'],
            },
          },
        },
  },
}));
