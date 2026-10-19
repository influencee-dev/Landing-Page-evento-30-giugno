import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv, type Plugin } from 'vite';

/**
 * Inserisce nell'HTML i meta che richiedono un URL assoluto (canonical, og:url, og:image).
 * Impostare SITE_URL (es. https://funnygamerick.it) in fase di build: senza, i meta restano relativi.
 */
function siteMeta(siteUrl: string): Plugin {
  const base = siteUrl.replace(/\/+$/, '');
  return {
    name: 'site-meta',
    transformIndexHtml(html) {
      const abs = (p: string) => (base ? `${base}${p}` : p);
      const extra = base
        ? `<link rel="canonical" href="${base}/" />\n    <meta property="og:url" content="${base}/" />`
        : '';
      return html.replaceAll('%OG_IMAGE%', abs('/og-image.jpg')).replace('<!--SITE_META-->', extra);
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react(), tailwindcss(), siteMeta(env.SITE_URL ?? '')],
    // Percorsi relativi: il sito funziona anche se pubblicato in una sottocartella.
    base: './',
    build: { target: 'es2020', cssCodeSplit: true },
  };
});
