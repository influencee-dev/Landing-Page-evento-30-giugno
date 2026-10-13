import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv, type Plugin } from 'vite';

/** Inserisce VITE_SITE_URL nei metadati canonical/Open Graph di index.html (vuoto se non impostato). */
function siteUrl(url: string): Plugin {
  return {
    name: 'site-url',
    transformIndexHtml: (html) => html.replaceAll('__SITE_URL__', url.replace(/\/+$/, '')),
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  return {
    plugins: [react(), tailwindcss(), siteUrl(env.VITE_SITE_URL ?? '')],
    build: {
      target: 'es2020',
      cssCodeSplit: false,
    },
  };
});
