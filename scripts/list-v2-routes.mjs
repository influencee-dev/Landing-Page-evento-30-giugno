// Elenco delle pagine del sito v2 (route, title, keyword) in JSON: node scripts/list-v2-routes.mjs
import { createServer } from 'vite';
const vite = await createServer({ configFile: 'vite.wp-plugin.config.ts', server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' });
const m = await vite.ssrLoadModule('/src/influencee/v2/pages.tsx');
const out = m.allPaths().map((p) => { const r = m.resolve(p); return { p, title: r.meta.title, kw: r.meta.kw, type: r.meta.type }; });
process.stdout.write(JSON.stringify(out));
await vite.close();
