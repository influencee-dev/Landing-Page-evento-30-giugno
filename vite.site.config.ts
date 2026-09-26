import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Build del sito Influencee (multi-pagina a hash) come bundle statico con
// percorsi relativi: npx vite build --config vite.site.config.ts
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: './',
  publicDir: 'public',
  build: {
    outDir: 'dist-site',
    emptyOutDir: true,
    rollupOptions: { input: 'site.html', output: { entryFileNames: 'app.js', assetFileNames: 'app[extname]' } },
  },
});
