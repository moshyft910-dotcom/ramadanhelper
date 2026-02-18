import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Relative base path is best for flexibility across different hosting providers (Vercel, Netlify, GitHub Pages)
  base: './', 
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false, // Disable sourcemaps in production for smaller bundle size
    target: 'esnext', // Modern browsers target
  },
  server: {
    port: 5173,
    strictPort: true,
    host: true // Allow network access for testing on mobile via local network
  }
});