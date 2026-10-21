// Build del plugin WordPress "influencee-tools" → dist-wp/influencee-tools.zip
// Uso: node scripts/build-wp-plugin.mjs
import { build, createServer } from 'vite';
import postcss from 'postcss';
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync, copyFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';

const ROOT = process.cwd();
const OUT = join(ROOT, 'dist-wp/influencee-tools');
rmSync(OUT, { recursive: true, force: true });
mkdirSync(join(OUT, 'assets/img'), { recursive: true });
mkdirSync(join(OUT, 'pages'), { recursive: true });

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
const meta = {};
const imgs = new Set();
for (const p of pages) {
  writeFileSync(join(OUT, 'pages', `${p.slug}.html`), p.html);
  meta[p.path] = { slug: p.slug, group: p.group, label: p.meta.label, title: p.meta.title, description: p.meta.description, ld: p.ld };
  p.images.forEach((i) => imgs.add(i));
}
writeFileSync(join(OUT, 'pages/meta.json'), JSON.stringify(meta, null, 1));
writeFileSync(join(OUT, 'pages/creator-profile.html'), profile.html);
writeFileSync(join(OUT, 'pages/profile-data.json'), JSON.stringify(profile.data));
for (const i of imgs) {
  const src = [join(ROOT, 'public', i), join(ROOT, 'public', i.replace(/\.webp$/, '.png'))].find(existsSync);
  if (src) copyFileSync(src, join(OUT, 'assets/img', i));
  else console.warn('immagine mancante:', i);
}

// 4. PHP + readme, zip
cpSync(join(ROOT, 'wp-plugin/influencee-tools'), OUT, { recursive: true });
copyFileSync(join(ROOT, 'src/influencee/v2/llms.txt'), join(OUT, 'llms.txt'));
rmSync(join(ROOT, 'dist-wp/influencee-tools.zip'), { force: true });
execFileSync('zip', ['-qr', 'influencee-tools.zip', 'influencee-tools'], { cwd: join(ROOT, 'dist-wp') });
const kb = (f) => Math.round(readFileSync(f).length / 1024);
console.log(`ok · pagine ${pages.length} · immagini ${imgs.size} · js ${kb(join(OUT, 'assets/influencee-tools.js'))} KB · css ${kb(join(OUT, 'assets/influencee-tools.css'))} KB · zip ${kb(join(ROOT, 'dist-wp/influencee-tools.zip'))} KB`);
const byG = {}; pages.forEach((p) => (byG[p.group] = (byG[p.group] || 0) + 1)); console.log('  gruppi:', JSON.stringify(byG));
for (const p of pages.filter((x) => x.group !== 'sostituzione' || ['/', '/influencer-italiani/'].includes(x.path))) console.log(' ', p.group.padEnd(12), p.path, '→', p.meta.title);
