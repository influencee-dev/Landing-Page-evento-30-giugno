import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Build del sito Influencee (multi-pagina a hash) come bundle statico con
// percorsi relativi: npx vite build --config vite.site-v2.config.ts (sito v2)
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: './',
  publicDir: 'public',
  build: {
    outDir: 'dist-site-v2',
    emptyOutDir: true,
    rollupOptions: { input: 'site-v2.html', output: { entryFileNames: 'app.js', assetFileNames: 'app[extname]' } },
  },
});
