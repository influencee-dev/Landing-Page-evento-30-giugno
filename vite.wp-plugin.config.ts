import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Bundle del plugin WordPress (un solo file JS + un CSS): usato da scripts/build-wp-plugin.mjs
export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: { 'process.env.NODE_ENV': '"production"' },
  publicDir: false,
  build: {
    outDir: 'dist-wp/build',
    emptyOutDir: true,
    cssCodeSplit: false,
    rollupOptions: {
      input: 'src/influencee/v2/embed/client.tsx',
      output: { format: 'iife', entryFileNames: 'influencee-tools.js', assetFileNames: 'influencee-tools[extname]', inlineDynamicImports: true },
    },
  },
});
