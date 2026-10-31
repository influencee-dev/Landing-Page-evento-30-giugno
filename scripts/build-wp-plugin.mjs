// Build dei plugin WordPress Influencee → dist-wp/<plugin>.zip
//   influencee-core     motore pagine, SEO/GEO/AEO, tracciamento, CSS/JS (bundle del sito v2 + base HTML5), MCP
//   influencee-tools    pagine dei tool (gruppo "tool"), senza offerte di lavoro
//   influencee-pagine   pagine nuove e sostituzioni, profili creator, elenco
//   influencee-articoli articoli del blog (PHP + CSS/JS propri)
//   influencee-annunci  offerte di lavoro collegate all'app (PHP + CSS/JS propri)
//   influencee-tema     intestazione, piè di pagina e layout del sito senza Elementor (usa il Core)
//   influencee-pulizia  controllo e pulizia di WordPress (a sé, non usa il Core: si accende quando serve)
// Uso: node scripts/build-wp-plugin.mjs
import { build, createServer } from 'vite';
import postcss from 'postcss';
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync, copyFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';

const ROOT = process.cwd();
const PLUGINS = ['influencee-core', 'influencee-tools', 'influencee-pagine', 'influencee-articoli', 'influencee-annunci', 'influencee-tema', 'influencee-pulizia', 'influencee-claude-bridge', 'influencee-aggiornamenti'];
const D = (slug) => join(ROOT, 'dist-wp', slug);
for (const slug of [...PLUGINS, 'influencee-tools-legacy']) rmSync(D(slug), { recursive: true, force: true });
rmSync(join(ROOT, 'dist-wp/influencee-tools'), { recursive: true, force: true });
const OUT = D('influencee-core'); // bundle e immagini stanno nel Core
mkdirSync(join(OUT, 'assets/img'), { recursive: true });
mkdirSync(join(D('influencee-tools'), 'pages'), { recursive: true });
mkdirSync(join(D('influencee-pagine'), 'pages'), { recursive: true });

// 1. bundle client (JS + CSS)
await build({ configFile: join(ROOT, 'vite.wp-plugin.config.ts'), logLevel: 'warn' });
copyFileSync(join(ROOT, 'dist-wp/build/influencee-tools.js'), join(OUT, 'assets/influencee-tools.js'));

// 2. CSS isolato: niente @layer (il tema li batterebbe), ogni regola sotto #influencee-tools,
//    via i font importati (li carica WordPress), html/body/:root → il contenitore.
const SCOPE = '#influencee-tools';
const scope = {
  postcssPlugin: 'influencee-scope',
  Once(root) {
    root.walkAtRules('import', (r) => r.remove());
    root.walkAtRules('layer', (r) => (r.nodes ? r.replaceWith(r.nodes) : r.remove()));
    root.walkRules((rule) => {
      if (rule.parent?.type === 'atrule' && /keyframes/i.test(rule.parent.name)) return;
      rule.selectors = rule.selectors.map((sel) => {
        const s = sel.trim();
        if (/^(:root|:host|html|body)(\s*,|$)/.test(s) || s === ':root, :host' || s === 'html, :host') return SCOPE;
        if (/^(html|body|:root|:host)\b/.test(s)) return s.replace(/^(html|body|:root|:host)/, SCOPE);
        return `${SCOPE} ${s}`;
      });
      rule.selectors = [...new Set(rule.selectors)];
    });
  },
};
const css = readFileSync(join(ROOT, 'dist-wp/build/influencee-tools.css'), 'utf8');
const scoped = (await postcss([scope]).process(css, { from: undefined })).css;
// proprietà che il tema Hello Elementor impone a pulsanti e campi e che il reset di Tailwind non tocca
// (es. white-space:nowrap sui pulsanti: le domande delle FAQ uscivano dallo schermo su mobile)
const THEME_RESET = `${SCOPE} button,${SCOPE} [type=button],${SCOPE} [type=submit],${SCOPE} [type=reset]{white-space:normal;-webkit-user-select:auto;user-select:auto;vertical-align:middle;transition:none;box-shadow:none;cursor:pointer}${SCOPE} input,${SCOPE} select,${SCOPE} textarea{box-shadow:none;transition:none}`;
writeFileSync(join(OUT, 'assets/influencee-tools.css'), `/* Influencee Tools: stili isolati sotto ${SCOPE} */\n${SCOPE}{font-family:var(--font-sans,Inter,sans-serif);color:var(--color-ink,#1d1d1f);background:#fff;line-height:1.5;-webkit-font-smoothing:antialiased}\n${THEME_RESET}\n${scoped}`);

// 3. pagine pre-renderizzate + meta (title, description, JSON-LD)
const vite = await createServer({ configFile: join(ROOT, 'vite.wp-plugin.config.ts'), server: { middlewareMode: true }, appType: 'custom', logLevel: 'warn' });
const { renderAll, renderProfile } = await vite.ssrLoadModule('/src/influencee/v2/embed/ssr.tsx');
const pages = renderAll();
const profile = renderProfile();
await vite.close();
const meta = { 'influencee-tools': {}, 'influencee-pagine': {} };
const imgs = new Set();
for (const p of pages) {
  const target = p.group === 'tool' ? 'influencee-tools' : 'influencee-pagine';
  writeFileSync(join(D(target), 'pages', `${p.slug}.html`), p.html);
  meta[target][p.path] = { slug: p.slug, group: p.group, label: p.meta.label, title: p.meta.title, description: p.meta.description, ld: p.ld };
  p.images.forEach((i) => imgs.add(i));
}
for (const t of Object.keys(meta)) writeFileSync(join(D(t), 'pages/meta.json'), JSON.stringify(meta[t], null, 1));
writeFileSync(join(D('influencee-pagine'), 'pages/creator-profile.html'), profile.html);
writeFileSync(join(D('influencee-pagine'), 'pages/profile-data.json'), JSON.stringify(profile.data));
for (const i of imgs) {
  const src = [join(ROOT, 'public', i), join(ROOT, 'public', i.replace(/\.webp$/, '.png'))].find(existsSync);
  if (src) copyFileSync(src, join(OUT, 'assets/img', i));
  else console.warn('immagine mancante:', i);
}

// 4. PHP, CSS/JS propri, guida; uno zip per plugin
for (const slug of PLUGINS) cpSync(join(ROOT, 'wp-plugin', slug), D(slug), { recursive: true });
copyFileSync(join(ROOT, 'src/influencee/v2/llms.txt'), join(OUT, 'llms.txt'));
const kb = (f) => Math.round(readFileSync(f).length / 1024);
for (const slug of PLUGINS) {
  rmSync(join(ROOT, 'dist-wp', `${slug}.zip`), { force: true });
  execFileSync('zip', ['-qr', `${slug}.zip`, slug], { cwd: join(ROOT, 'dist-wp') });
}
// 5. consegne/plugin-wordpress: zip + versioni.json (letto da Influencee Aggiornamenti sul sito, ogni ora)
{
  const { createHash } = await import('node:crypto');
  const auto = JSON.parse(readFileSync(join(ROOT, 'wp-plugin/aggiornamenti.json'), 'utf8'));
  const CONS = join(ROOT, 'consegne/plugin-wordpress');
  mkdirSync(CONS, { recursive: true });
  const man = { generato: new Date().toISOString(), plugin: {} };
  for (const slug of PLUGINS) {
    const zip = join(ROOT, 'dist-wp', `${slug}.zip`);
    copyFileSync(zip, join(CONS, `${slug}.zip`));
    const main = readFileSync(join(ROOT, 'wp-plugin', slug, `${slug}.php`), 'utf8');
    const v = (main.match(/Version:\s*([0-9.]+)/) || [])[1];
    man.plugin[slug] = { versione: v, file: `${slug}.zip`, sha256: createHash('sha256').update(readFileSync(zip)).digest('hex'), auto: auto[slug] === true };
  }
  writeFileSync(join(CONS, 'versioni.json'), JSON.stringify(man, null, 1) + '\n');
}
console.log(`ok · pagine ${pages.length} · immagini ${imgs.size} · js ${kb(join(OUT, 'assets/influencee-tools.js'))} KB · css ${kb(join(OUT, 'assets/influencee-tools.css'))} KB`);
for (const slug of PLUGINS) console.log(`  ${slug.padEnd(20)} ${String(kb(join(ROOT, 'dist-wp', `${slug}.zip`))).padStart(5)} KB`, slug === 'influencee-tools' || slug === 'influencee-pagine' ? `· ${Object.keys(meta[slug]).length} pagine` : '');
console.log('  tool:', Object.keys(meta['influencee-tools']).join(' '));
