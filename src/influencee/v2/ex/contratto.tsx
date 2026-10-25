import React, { useRef, useState } from 'react';
import { Check, Copy, Download, FileText, Printer, ShieldAlert } from 'lucide-react';
import { Button, Container, Section, SectionHeader } from '../../ds';
import { AnswerBox, CardGrid, CtaBandV2, FaqSeo, FeatureSplit, HeroPlatform, ManagedRow, Related } from '../rows';
import { CollabMock, ContractMock } from '../mocks';
import { APP, type QA } from '../data';
import { track } from '../analytics';
import type { ExPage } from './types';

/* /contratto-social-media-influencer-ugc/ — pagina ex Elementor (testo originale: copia del 22/10/2026).
   La vecchia pagina era un editor: dati di cliente e fornitore → testo di un contratto per servizi di
   marketing digitale (social media, ads, UGC, influencer). Qui l'editor è client-side; lo stato iniziale
   (tutti i servizi attivi, campi vuoti) mostra il modello completo con i segnaposto, così il testo è
   nell'HTML pre-renderizzato e leggibile da Google. Clausole riprese dal vecchio modello e riscritte. */

/* ─── Modello del contratto ──────────────────────────────────────── */
type Seg = string | { val: string; ph: string };
type Block = { k: 'h' | 'sub' | 'p' | 'li'; s: Seg[] } | { k: 'table'; fees: [string, Seg][]; vivi: [string, Seg][]; totFee: Seg; totVivi: Seg } | { k: 'sign'; a: Seg; b: Seg };

interface Data {
  cliente: string;
  piva: string;
  sede: string;
  fatt: string;
  fornitore: string;
  fornDati: string;
  luogo: string;
  foro: string;
  durata: string;
  preavviso: string;
  smm: boolean;
  smmFee: string;
  post: string;
  report: string;
  community: string;
  ads: boolean;
  adsFee: string;
  budget: string;
  creative: string;
  adsReport: string;
  ugc: boolean;
  ugcFee: string;
  ugcDel: string;
  ugcCost: string;
  ugcRev: string;
  ugcRights: string;
  inf: boolean;
  infFee: string;
  infDel: string;
  infCost: string;
  infExcl: string;
  infApproval: string;
  infRights: string;
}

const EMPTY: Data = {
  cliente: '', piva: '', sede: '', fatt: '', fornitore: '', fornDati: '', luogo: '', foro: '', durata: '3', preavviso: '30',
  smm: true, smmFee: '', post: '', report: '', community: '',
  ads: true, adsFee: '', budget: '', creative: '', adsReport: '',
  ugc: true, ugcFee: '', ugcDel: '', ugcCost: '', ugcRev: '', ugcRights: '',
  inf: true, infFee: '', infDel: '', infCost: '', infExcl: '', infApproval: '', infRights: '',
};

const COMMUNITY = [
  ['', 'Non incluso'],
  ['base, con risposta ai commenti pubblici', 'Base (risposta ai commenti)'],
  ['avanzato, con risposta ai commenti e gestione dei messaggi diretti', 'Avanzato (inclusi i DM)'],
];
const CREATIVE = [
  ['', 'Da definire'],
  ['fornite dal Cliente', 'Fornite dal cliente'],
  ['realizzate dal Fornitore e incluse nella fee di gestione', 'Create dal fornitore'],
];
const UGC_RIGHTS = [
  ['', 'Da definire'],
  ['concessi in licenza d’uso perpetua, non esclusiva e mondiale per tutti i canali digitali (organici e a pagamento) e offline del Cliente (buyout totale)', 'Buyout totale (uso illimitato)'],
  ['concessi in licenza d’uso per 12 mesi sui canali social organici del Cliente', '12 mesi, solo organico'],
  ['concessi in licenza d’uso per 6 mesi per l’utilizzo in inserzioni a pagamento', '6 mesi, solo ads'],
];
const INF_APPROVAL = [
  ['', 'Da definire'],
  ['preventiva da parte del Cliente prima della pubblicazione', 'Sì, approvazione del cliente'],
  ['non richiesta: l’influencer mantiene libertà creativa nel rispetto del brief', 'No, libertà creativa'],
];
const INF_RIGHTS = [
  ['', 'Da definire'],
  ['per repost e condivisione sui canali social organici del Cliente per 12 mesi', 'Repost organico (12 mesi)'],
  ['anche in inserzioni a pagamento (whitelisting) per 6 mesi', 'Uso in ads (6 mesi)'],
];

const num = (s: string) => Math.max(0, Number(String(s).replace(/\./g, '').replace(',', '.')) || 0);
const eur = (n: number) => `${n.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;
const v = (val: string, ph: string): Seg => ({ val: val.trim(), ph });
const money = (val: string, ph = 'importo'): Seg => (val.trim() ? eur(num(val)) : { val: '', ph: `${ph} €` });

function build(d: Data): Block[] {
  const b: Block[] = [];
  const h = (...s: Seg[]) => b.push({ k: 'h', s });
  const sub = (...s: Seg[]) => b.push({ k: 'sub', s });
  const p = (...s: Seg[]) => b.push({ k: 'p', s });
  const li = (...s: Seg[]) => b.push({ k: 'li', s });
  const forn = v(d.fornitore, 'Nome fornitore');
  const cli = v(d.cliente, 'Nome cliente');
  let n = 0;

  p('Tra ', forn, ' e ', cli, '. Luogo e data: ', v(d.luogo, 'luogo e data'), '.');
  h('Le parti');
  p(forn, d.fornDati.trim() ? ', ' : '', d.fornDati.trim() ? v(d.fornDati, '') : '', ' (di seguito “Fornitore”)');
  p('e');
  p(cli, ', con sede legale in ', v(d.sede, 'indirizzo del cliente'), ', P.IVA/C.F. ', v(d.piva, 'P.IVA del cliente'), ', dati per la fatturazione elettronica: ', v(d.fatt, 'PEC e codice SDI'), ' (di seguito “Cliente”).');
  h('Premesse');
  p('Il presente contratto (di seguito “Contratto”) definisce i termini e le condizioni della collaborazione tra il Fornitore e il Cliente per i servizi di marketing digitale descritti di seguito, finalizzati alla gestione e alla valorizzazione della presenza online del Cliente.');
  h(`${++n}. Oggetto del contratto`);
  p('Il Fornitore si impegna a fornire al Cliente i servizi professionali descritti all’articolo 2 (“Descrizione dei servizi”), con le modalità e i corrispettivi indicati nel Contratto.');
  h(`${++n}. Descrizione dei servizi`);
  if (!d.smm && !d.ads && !d.ugc && !d.inf) p({ val: '', ph: 'seleziona almeno un servizio' });
  let s = 0;
  if (d.smm) {
    sub(`2.${++s} Gestione dei social media`);
    li('Strategia e piano editoriale.');
    li('Creazione e pubblicazione di n. ', v(d.post, 'numero'), ' contenuti (post) al mese.');
    li(d.community ? 'Community management di livello ' : 'Community management: ', d.community ? d.community : 'non incluso', '.');
    li('Redazione e invio di n. ', v(d.report, 'numero'), ' report mensili sulle performance.');
  }
  if (d.ads) {
    sub(`2.${++s} Gestione delle campagne pubblicitarie sui social`);
    li('Configurazione, gestione e ottimizzazione delle campagne pubblicitarie.');
    li('Il Cliente mette a disposizione un budget pubblicitario mensile di ', money(d.budget), ', versato direttamente alle piattaforme pubblicitarie o anticipato al Fornitore. Il budget è un costo vivo escluso dalla fee di gestione.');
    li('Le creatività per le campagne sono ', v(d.creative, 'fornite dal Cliente / realizzate dal Fornitore'), '.');
    li('Il reporting sulle performance delle campagne avviene con frequenza ', v(d.adsReport, 'settimanale / mensile'), '.');
  }
  if (d.ugc) {
    sub(`2.${++s} Campagna di contenuti UGC (user generated content)`);
    li('Ricerca, selezione e coordinamento dei creator per la produzione dei seguenti contenuti: ', v(d.ugcDel, 'es. 3 video verticali 9:16 da 15–30 secondi, con sottotitoli'), '.');
    li('Il Fornitore supervisiona il processo creativo e verifica l’aderenza al brief del Cliente.');
    li('Sono inclusi n. ', v(d.ugcRev, 'numero'), ' round di revisione per ogni contenuto.');
    li('Diritti d’uso: dopo il saldo completo, i contenuti sono ', v(d.ugcRights, 'licenza concordata: durata, canali, uso in ads'), '. Il Cliente manleva il Fornitore da responsabilità derivanti da un uso dei contenuti diverso da quello concordato.');
  }
  if (d.inf) {
    sub(`2.${++s} Campagna di influencer marketing`);
    li('Ricerca, negoziazione e coordinamento degli influencer per la realizzazione dei seguenti contenuti: ', v(d.infDel, 'es. 1 reel Instagram, 3 storie con link, 1 post'), '.');
    li('Approvazione dei contenuti: ', v(d.infApproval, 'preventiva del Cliente / non richiesta'), '.');
    li('Esclusiva: l’influencer si impegna a rispettare un periodo di esclusività di ', v(d.infExcl, 'es. 30 giorni da brand concorrenti'), '.');
    li('Diritti d’uso: il Cliente può utilizzare i contenuti prodotti dall’influencer ', v(d.infRights, 'canali e durata concordati'), '.');
    li('Trasparenza: il Fornitore si assicura che l’influencer segnali la collaborazione come pubblicità secondo le norme vigenti (per esempio con #adv o #sponsorizzato e con gli strumenti di contenuto sponsorizzato delle piattaforme).');
  }
  h(`${++n}. Corrispettivo e modalità di pagamento`);
  p('Per i servizi, il Cliente corrisponde al Fornitore gli importi indicati nella tabella seguente. Tutti gli importi si intendono al netto di IVA.');
  const fees: [string, Seg][] = [];
  const vivi: [string, Seg][] = [];
  if (d.smm) fees.push(['Fee gestione social media (mensile)', money(d.smmFee)]);
  if (d.ads) fees.push(['Fee gestione campagne ads (mensile)', money(d.adsFee)]);
  if (d.ugc) fees.push(['Fee gestione campagna UGC', money(d.ugcFee)]);
  if (d.inf) fees.push(['Fee gestione campagna influencer', money(d.infFee)]);
  if (d.ads) vivi.push(['Budget pubblicitario (mensile)', money(d.budget)]);
  if (d.ugc) vivi.push(['Contenuti UGC', money(d.ugcCost)]);
  if (d.inf) vivi.push(['Compenso influencer', money(d.infCost)]);
  const tot = (keys: (keyof Data)[], on: boolean[]) => {
    const vals = keys.filter((_, i) => on[i]).map((k) => d[k] as string);
    return vals.some((x) => x.trim()) ? eur(vals.reduce((a, x) => a + num(x), 0)) : ({ val: '', ph: 'totale €' } as Seg);
  };
  b.push({ k: 'table', fees, vivi, totFee: tot(['smmFee', 'adsFee', 'ugcFee', 'infFee'], [d.smm, d.ads, d.ugc, d.inf]), totVivi: tot(['budget', 'ugcCost', 'infCost'], [d.ads, d.ugc, d.inf]) });
  p('Le fee di gestione ricorrenti sono fatturate e pagate mensilmente in via anticipata. I costi vivi (budget pubblicitario, contenuti, compensi degli influencer) sono fatturati e pagati prima dell’avvio delle relative attività.');
  h(`${++n}. Durata e recesso`);
  p('Il Contratto è valido dalla data di sottoscrizione, ha una durata minima iniziale di ', v(d.durata, 'numero'), ' mesi e si rinnova tacitamente di mese in mese. Ciascuna parte può recedere con un preavviso di ', v(d.preavviso, 'numero'), ' giorni, comunicato via PEC o raccomandata A/R.');
  h(`${++n}. Responsabilità e riservatezza`);
  p('Il Fornitore svolge l’incarico con la diligenza professionale richiesta (obbligazione di mezzi e non di risultato): non garantisce risultati specifici in termini di follower, interazioni o vendite. Le parti si impegnano a non divulgare le informazioni riservate di cui vengano a conoscenza durante la collaborazione.');
  h(`${++n}. Trattamento dei dati personali`);
  p('Le parti trattano i dati personali scambiati per l’esecuzione del Contratto nel rispetto del Regolamento UE 2016/679 (GDPR) e della normativa italiana applicabile.');
  h(`${++n}. Legge applicabile e foro competente`);
  p('Il Contratto è regolato dalla legge italiana. Per ogni controversia è competente in via esclusiva il Foro di ', v(d.foro, 'città'), '.');
  b.push({ k: 'sign', a: forn, b: cli });
  return b;
}

const TITLE = 'Contratto per la fornitura di servizi di marketing digitale';
const segText = (s: Seg) => (typeof s === 'string' ? s : s.val || `[${s.ph}]`);
const line = (ss: Seg[]) => ss.map(segText).join('');
function toText(blocks: Block[]) {
  const out: string[] = [TITLE.toUpperCase(), ''];
  for (const b of blocks) {
    if (b.k === 'h') out.push('', line(b.s).toUpperCase());
    else if (b.k === 'sub') out.push('', line(b.s));
    else if (b.k === 'p') out.push(line(b.s));
    else if (b.k === 'li') out.push(`- ${line(b.s)}`);
    else if (b.k === 'table') {
      out.push('', ...b.fees.map(([l, x]) => `${l}: ${segText(x)}`), `TOTALE FEE DI GESTIONE: ${segText(b.totFee)}`);
      if (b.vivi.length) out.push(...b.vivi.map(([l, x]) => `Costi vivi – ${l}: ${segText(x)}`), `TOTALE COSTI VIVI: ${segText(b.totVivi)}`);
      out.push('');
    } else if (b.k === 'sign') out.push('', '', `Il Fornitore: ${segText(b.a)}  ____________________`, '', `Il Cliente: ${segText(b.b)}  ____________________`);
  }
  out.push('', 'Modello indicativo fornito da Influencee (influencee.it): da far verificare a un legale prima della firma.');
  return out.join('\n');
}
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
function toHtml(blocks: Block[]) {
  const l = (ss: Seg[]) => esc(line(ss));
  let body = `<h1>${TITLE}</h1>`;
  let inList = false;
  for (const b of blocks) {
    if (b.k !== 'li' && inList) (body += '</ul>'), (inList = false);
    if (b.k === 'h') body += `<h2>${l(b.s)}</h2>`;
    else if (b.k === 'sub') body += `<h3>${l(b.s)}</h3>`;
    else if (b.k === 'p') body += `<p>${l(b.s)}</p>`;
    else if (b.k === 'li') body += `${inList ? '' : '<ul>'}<li>${l(b.s)}</li>`, (inList = true);
    else if (b.k === 'table') {
      const r = (a: string, x: Seg, strong = false) => `<tr><td>${strong ? `<b>${esc(a)}</b>` : esc(a)}</td><td style="text-align:right">${strong ? `<b>${esc(segText(x))}</b>` : esc(segText(x))}</td></tr>`;
      body += `<table>${b.fees.map(([a, x]) => r(a, x)).join('')}${r('Totale fee di gestione', b.totFee, true)}${b.vivi.map(([a, x]) => r(`Costi vivi: ${a}`, x)).join('')}${b.vivi.length ? r('Totale costi vivi', b.totVivi, true) : ''}</table>`;
    } else if (b.k === 'sign') body += `<table class="sign"><tr><td>Il Fornitore<br>${esc(segText(b.a))}<br><br>____________________</td><td>Il Cliente<br>${esc(segText(b.b))}<br><br>____________________</td></tr></table>`;
  }
  if (inList) body += '</ul>';
  body += '<p class="nota">Modello indicativo fornito da Influencee (influencee.it): da far verificare a un legale prima della firma.</p>';
  return `<!doctype html><html lang="it"><head><meta charset="utf-8"><title>${TITLE}</title><style>body{font-family:Georgia,serif;font-size:12pt;line-height:1.5;max-width:720px;margin:40px auto;color:#111}h1{font-size:18pt;text-align:center}h2{font-size:13pt;margin-top:24px;text-transform:uppercase}h3{font-size:12pt}table{width:100%;border-collapse:collapse;margin:12px 0}td{border:1px solid #999;padding:6px 8px}.sign td{border:0;padding-top:40px;width:50%}.nota{font-size:9pt;color:#555;margin-top:40px}</style></head><body>${body}</body></html>`;
}

/* ─── Anteprima del documento (JSX: è nell'HTML statico) ─────────── */
function S({ s }: { s: Seg }) {
  if (typeof s === 'string') return <>{s}</>;
  if (s.val) return <span className="font-semibold text-ink">{s.val}</span>;
  return s.ph ? <span className="rounded bg-acid-soft px-1 text-ink/70">[{s.ph}]</span> : null;
}
const Ss = ({ ss }: { ss: Seg[] }) => (
  <>
    {ss.map((s, i) => (
      <S key={i} s={s} />
    ))}
  </>
);
function Doc({ blocks }: { blocks: Block[] }) {
  const out: React.ReactNode[] = [];
  let list: React.ReactNode[] = [];
  const flush = () => {
    if (list.length) out.push(<ul key={`ul${out.length}`} className="mt-2 list-disc space-y-1.5 pl-5">{list}</ul>);
    list = [];
  };
  blocks.forEach((b, i) => {
    if (b.k !== 'li') flush();
    if (b.k === 'h') out.push(<h3 key={i} className="mt-7 font-heading text-[15px] font-semibold uppercase tracking-wide text-ink"><Ss ss={b.s} /></h3>);
    else if (b.k === 'sub') out.push(<h4 key={i} className="mt-5 font-semibold text-ink"><Ss ss={b.s} /></h4>);
    else if (b.k === 'p') out.push(<p key={i} className="mt-2"><Ss ss={b.s} /></p>);
    else if (b.k === 'li') list.push(<li key={i}><Ss ss={b.s} /></li>);
    else if (b.k === 'table')
      out.push(
        <table key={i} className="mt-4 w-full text-[13px]">
          <tbody>
            {b.fees.map(([l, x]) => (
              <tr key={l} className="border-b border-line"><td className="py-2 pr-3">{l}</td><td className="py-2 text-right tabular-nums"><S s={x} /></td></tr>
            ))}
            <tr className="border-b border-line font-semibold text-ink"><td className="py-2 pr-3">Totale fee di gestione</td><td className="py-2 text-right tabular-nums"><S s={b.totFee} /></td></tr>
            {b.vivi.map(([l, x]) => (
              <tr key={l} className="border-b border-line"><td className="py-2 pr-3">Costi vivi: {l.toLowerCase()}</td><td className="py-2 text-right tabular-nums"><S s={x} /></td></tr>
            ))}
            {b.vivi.length > 0 && <tr className="font-semibold text-ink"><td className="py-2 pr-3">Totale costi vivi</td><td className="py-2 text-right tabular-nums"><S s={b.totVivi} /></td></tr>}
          </tbody>
        </table>,
      );
    else if (b.k === 'sign')
      out.push(
        <div key={i} className="mt-10 grid grid-cols-2 gap-6 text-[13px]">
          {([['Il Fornitore', b.a], ['Il Cliente', b.b]] as [string, Seg][]).map(([l, x]) => (
            <div key={l}>
              <p className="text-mute">{l}</p>
              <p className="mt-1"><S s={x} /></p>
              <p className="mt-8 border-t border-ink/40 pt-1 text-[11px] text-mute">Firma</p>
            </div>
          ))}
        </div>,
      );
  });
  flush();
  return <>{out}</>;
}

/* ─── Editor ─────────────────────────────────────────────────────── */
const field = 'mt-1.5 h-11 w-full rounded-2xl bg-paper px-4 text-[15px] text-ink outline-none ring-1 ring-line placeholder:text-mute/60 focus:ring-brand';

function ContractEditor() {
  const [d, setD] = useState<Data>(EMPTY);
  const [copied, setCopied] = useState(false);
  const edited = useRef(false);
  const up = <K extends keyof Data>(k: K, val: Data[K]) => {
    if (!edited.current) {
      edited.current = true;
      track('tool_use', { tool: 'contratto', action: 'compila' });
    }
    setD((x) => ({ ...x, [k]: val }));
  };
  const blocks = build(d);
  const services = [d.smm && 'social', d.ads && 'ads', d.ugc && 'ugc', d.inf && 'influencer'].filter(Boolean).join('+') || 'nessuno';

  const copy = () => {
    navigator.clipboard?.writeText(toText(blocks)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
    track('tool_use', { tool: 'contratto', action: 'copia_testo', services });
  };
  const download = () => {
    const blob = new Blob(['﻿', toHtml(blocks)], { type: 'application/msword' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'contratto-servizi-marketing-digitale.doc';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    track('tool_use', { tool: 'contratto', action: 'scarica_doc', services });
  };
  const print = () => {
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(toHtml(blocks));
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 300);
    track('tool_use', { tool: 'contratto', action: 'stampa_pdf', services });
  };

  const input = (k: keyof Data, label: string, ph: string, opts: { area?: boolean; numeric?: boolean; full?: boolean } = {}) => (
    <label htmlFor={`ct-${k}`} className={`block ${opts.full ? 'sm:col-span-2' : ''}`}>
      <span className="text-xs font-semibold text-mute">{label}</span>
      {opts.area ? (
        <textarea id={`ct-${k}`} value={d[k] as string} placeholder={ph} rows={2} onChange={(e) => up(k, e.target.value)} className={`${field} h-auto py-2.5`} />
      ) : (
        <input id={`ct-${k}`} value={d[k] as string} placeholder={ph} inputMode={opts.numeric ? 'decimal' : undefined} onChange={(e) => up(k, e.target.value)} className={field} />
      )}
    </label>
  );
  const select = (k: keyof Data, label: string, items: string[][]) => (
    <label htmlFor={`ct-${k}`} className="block">
      <span className="text-xs font-semibold text-mute">{label}</span>
      <select id={`ct-${k}`} value={d[k] as string} onChange={(e) => up(k, e.target.value)} className={field}>
        {items.map(([val, l]) => (
          <option key={l} value={val}>{l}</option>
        ))}
      </select>
    </label>
  );
  const group = (k: 'smm' | 'ads' | 'ugc' | 'inf', title: string, children: React.ReactNode) => (
    <fieldset className={`rounded-3xl p-5 ring-1 transition ${d[k] ? 'bg-white ring-line' : 'bg-paper/60 ring-transparent'}`}>
      <legend className="sr-only">{title}</legend>
      <label className="flex cursor-pointer items-center justify-between gap-4">
        <span className="font-heading text-lg font-semibold tracking-tight">{title}</span>
        <input type="checkbox" checked={d[k]} onChange={(e) => { up(k, e.target.checked); track('tool_use', { tool: 'contratto', action: e.target.checked ? 'aggiungi_servizio' : 'togli_servizio', service: k }); }} className="peer sr-only" />
        <span aria-hidden className={`relative h-7 w-12 flex-none rounded-full transition ${d[k] ? 'bg-ink' : 'bg-line'}`}>
          <span className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${d[k] ? 'left-6 bg-acid' : 'left-1'}`} />
        </span>
      </label>
      {d[k] && <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">{children}</div>}
    </fieldset>
  );

  return (
    <Section tone="paper" id="editor">
      <Container>
        <SectionHeader eyebrow="Editor gratuito" title={'Compila il contratto\n*con i tuoi dati*'} lead="Il testo si aggiorna mentre scrivi. I campi vuoti restano evidenziati come segnaposto: puoi completarli anche dopo, nel documento scaricato." />
        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          <div className="grid gap-4" data-track-zone="editor_contratto">
            <fieldset className="rounded-3xl bg-white p-5 ring-1 ring-line">
              <legend className="sr-only">Le parti</legend>
              <p className="font-heading text-lg font-semibold tracking-tight">Cliente e fornitore</p>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {input('cliente', 'Cliente (ragione sociale)', 'Es. Rossi S.r.l.')}
                {input('piva', 'P.IVA / C.F. del cliente', 'IT12345678901')}
                {input('sede', 'Sede legale del cliente', 'Via Roma 1, 20121 Milano (MI)', { full: true })}
                {input('fatt', 'Fatturazione (PEC, codice SDI)', 'rossisrl@pec.it, XXXXXXX', { full: true })}
                {input('fornitore', 'Fornitore / social media manager', 'Mario Bianchi')}
                {input('fornDati', 'Dati del fornitore (facoltativo)', 'P.IVA, indirizzo')}
                {input('luogo', 'Luogo e data', 'Milano, 1 dicembre 2026')}
                {input('foro', 'Foro competente', 'Milano')}
                {input('durata', 'Durata minima (mesi)', '3', { numeric: true })}
                {input('preavviso', 'Preavviso di recesso (giorni)', '30', { numeric: true })}
              </div>
            </fieldset>
            {group('smm', 'Gestione social media', <>
              {input('smmFee', 'Fee mensile (€)', '500', { numeric: true })}
              {input('post', 'Post al mese', '8', { numeric: true })}
              {input('report', 'Report al mese', '1', { numeric: true })}
              {select('community', 'Community management', COMMUNITY)}
            </>)}
            {group('ads', 'Social ads', <>
              {input('adsFee', 'Fee gestione ads (€/mese)', '250', { numeric: true })}
              {input('budget', 'Budget pubblicitario (€/mese)', '1000', { numeric: true })}
              {select('creative', 'Creatività', CREATIVE)}
              {input('adsReport', 'Frequenza report', 'settimanale')}
            </>)}
            {group('ugc', 'Contenuti UGC', <>
              {input('ugcDel', 'Contenuti da consegnare', 'Es. 3 video verticali 9:16 da 15–30 secondi, con sottotitoli', { area: true, full: true })}
              {input('ugcFee', 'Fee gestione UGC (€)', '150', { numeric: true })}
              {input('ugcCost', 'Costo dei contenuti (€)', '300', { numeric: true })}
              {input('ugcRev', 'Round di revisione', '1', { numeric: true })}
              {select('ugcRights', 'Diritti d’uso', UGC_RIGHTS)}
            </>)}
            {group('inf', 'Influencer marketing', <>
              {input('infDel', 'Contenuti da pubblicare', 'Es. 1 reel Instagram, 3 storie con link, 1 post', { area: true, full: true })}
              {input('infFee', 'Fee gestione campagna (€)', '200', { numeric: true })}
              {input('infCost', 'Compenso influencer (€)', '1000', { numeric: true })}
              {input('infExcl', 'Esclusiva', '30 giorni da brand concorrenti')}
              {select('infApproval', 'Approvazione dei contenuti', INF_APPROVAL)}
              {select('infRights', 'Diritti d’uso', INF_RIGHTS)}
            </>)}
          </div>

          <div className="lg:sticky lg:top-24">
            <div className="flex flex-wrap gap-2 rounded-t-[28px] bg-ink p-4 text-white">
              <button type="button" data-track-ignore onClick={copy} className="inline-flex h-10 items-center gap-1.5 rounded-full bg-acid px-4 text-sm font-semibold text-ink">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {copied ? 'Copiato' : 'Copia il testo'}
              </button>
              <button type="button" data-track-ignore onClick={download} className="inline-flex h-10 items-center gap-1.5 rounded-full px-4 text-sm font-semibold ring-1 ring-white/25">
                <Download className="h-4 w-4" /> Scarica Word
              </button>
              <button type="button" data-track-ignore onClick={print} className="inline-flex h-10 items-center gap-1.5 rounded-full px-4 text-sm font-semibold ring-1 ring-white/25">
                <Printer className="h-4 w-4" /> Stampa o PDF
              </button>
            </div>
            <article aria-label="Testo del contratto" className="max-h-[78vh] overflow-y-auto rounded-b-[28px] bg-white p-6 font-serif text-[14px] leading-relaxed text-ink/80 shadow-[0_24px_60px_-30px_rgba(29,29,31,0.35)] ring-1 ring-line sm:p-8">
              <h2 className="text-center font-heading text-xl font-semibold tracking-tight text-ink">{TITLE}</h2>
              <Doc blocks={blocks} />
              <p className="mt-8 flex gap-2 rounded-2xl bg-paper p-4 font-sans text-[12px] leading-relaxed text-mute">
                <ShieldAlert className="h-4 w-4 flex-none text-brand" /> Modello indicativo, non è una consulenza legale: fallo verificare a un legale o al tuo commercialista prima della firma, soprattutto per esclusive lunghe, licenze ampie o compensi importanti.
              </p>
            </article>
          </div>
        </div>
      </Container>
    </Section>
  );
}

/* ─── Visual dell'hero: il documento compilato ───────────────────── */
function DocHero() {
  const rows = ['Le parti', '1. Oggetto del contratto', '2. Social media · Ads · UGC · Influencer', '3. Corrispettivo e pagamenti', '4. Durata e recesso', '5. Responsabilità e riservatezza'];
  return (
    <div className="relative mx-auto max-w-[460px]">
      <div className="absolute -right-3 -top-3 hidden h-full w-full rotate-3 rounded-[26px] bg-white/10 sm:block" />
      <div className="relative rounded-[26px] bg-white p-6 text-ink shadow-float">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-white"><FileText className="h-4 w-4" /></span>
          <p className="font-heading text-[15px] font-semibold leading-tight">Contratto per servizi di marketing digitale</p>
        </div>
        <p className="mt-4 text-[12px] text-mute">Tra <span className="rounded bg-acid-soft px-1 text-ink">[Nome fornitore]</span> e <span className="rounded bg-acid-soft px-1 text-ink">[Nome cliente]</span></p>
        <div className="mt-4 space-y-2">
          {rows.map((r, i) => (
            <div key={r} className="flex items-center justify-between rounded-xl bg-paper px-3 py-2 text-[12px]">
              <span className="font-semibold">{r}</span>
              <span className={`h-1.5 rounded-full ${i % 2 ? 'w-10 bg-brand/30' : 'w-14 bg-ink/15'}`} />
            </div>
          ))}
        </div>
        <div className="mt-4 flex gap-2 text-[11px] font-semibold">
          <span className="inline-flex items-center gap-1 rounded-full bg-ink px-3 py-1.5 text-white"><Copy className="h-3 w-3" /> Copia</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-acid px-3 py-1.5"><Download className="h-3 w-3" /> Word</span>
          <span className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 ring-1 ring-line"><Printer className="h-3 w-3" /> PDF</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Pagina ─────────────────────────────────────────────────────── */
const FAQ: QA[] = [
  { q: 'Cosa deve contenere un contratto per un social media manager?', a: 'Le parti con i dati di fatturazione, i servizi inclusi (numero di post, report, community management), la fee mensile, la durata minima, il preavviso di recesso, chi fornisce le creatività, la riservatezza e il fatto che il servizio è un’obbligazione di mezzi e non di risultato.' },
  { q: 'Cosa deve contenere un contratto con un influencer?', a: 'Le parti, i contenuti da consegnare con formati e scadenze, il compenso e la sua forma, i diritti d’uso e la loro durata, l’eventuale esclusiva, l’approvazione dei contenuti, le revisioni previste e l’obbligo di segnalare la collaborazione come pubblicità.' },
  { q: 'Chi possiede i diritti dei contenuti UGC?', a: 'Quelli scritti nel contratto: buyout totale, licenza a tempo solo per i canali organici o licenza per le inserzioni a pagamento. Senza una clausola sui diritti d’uso il brand rischia di non poter usare i video nelle ads.' },
  { q: 'Il budget pubblicitario fa parte della fee del social media manager?', a: 'No, di solito è un costo vivo separato: il cliente lo paga direttamente alle piattaforme o lo anticipa al fornitore. Il modello lo tiene distinto dalla fee di gestione nella tabella dei corrispettivi.' },
  { q: 'Questo modello di contratto è valido legalmente?', a: 'È un modello indicativo con le clausole più comuni, utile come base di partenza. Non è una consulenza legale: prima della firma fallo verificare a un legale, soprattutto per esclusive lunghe, licenze internazionali o compensi importanti.' },
  { q: 'Su influencee serve scrivere il contratto con il creator a mano?', a: 'No. Nella piattaforma il contratto con il creator nasce dai termini che brand e creator hanno accettato nella stessa versione: contenuti, scadenze, compenso e diritti d’uso. La piattaforma genera il documento in DOCX (o PDF) e ne registra l’impronta.' },
];

function ContractPage() {
  return (
    <>
      <HeroPlatform
        crumbs={[{ label: 'Risorse' }, { label: 'Modello di contratto' }]}
        eyebrow="Modello gratuito"
        title={'Contratto social media,\n*influencer e UGC*'}
        lead="Compila i dati di cliente e fornitore, scegli i servizi e ottieni il testo del contratto per gestione social, ads, contenuti UGC e influencer marketing. Lo copi o lo scarichi, gratis e senza registrazione."
        actions={
          <>
            <Button onClick={() => document.getElementById('editor')?.scrollIntoView({ behavior: 'smooth' })}>Compila il contratto</Button>
            <Button href="#/funzionalita/contratto-influencer/" variant="secondary">Contratto nella piattaforma</Button>
          </>
        }
        visual={<DocHero />}
        note="Modello indicativo: fallo verificare a un legale prima della firma."
      />
      <ContractEditor />
      <AnswerBox q="Cosa deve contenere un contratto di servizi social?" a="Chi sono le parti, quali servizi sono inclusi e in che quantità, quanto costano (tenendo separate le fee di gestione dai costi vivi come budget pubblicitario e compensi dei creator), chi possiede i diritti dei contenuti e per quanto tempo, la durata minima, il preavviso di recesso e la riservatezza. Per gli influencer servono anche esclusiva, approvazione dei contenuti e obbligo di segnalare la pubblicità." points={['Servizi e quantità', 'Fee separate dai costi vivi', 'Diritti d’uso e durata', 'Recesso e riservatezza']} />
      <CardGrid tone="white" eyebrow="Le clausole del modello" title={'Le clausole\n*da non dimenticare*'} cols={4} items={[
        { tag: 'Art. 2', t: 'Servizi e consegne', x: 'Numero di post e report, contenuti UGC e dell’influencer con formati e scadenze: niente lavori “a sentimento”.' },
        { tag: 'Art. 3', t: 'Fee e costi vivi', x: 'Fee di gestione da una parte, budget ads, contenuti e compensi dall’altra, con i tempi di fatturazione.' },
        { tag: 'Diritti', t: 'Diritti d’uso', x: 'Buyout totale, 12 mesi organico o 6 mesi in ads: decide se puoi usare i video nelle inserzioni.' },
        { tag: 'Influencer', t: 'Esclusiva e approvazione', x: 'Periodo senza brand concorrenti e approvazione preventiva dei contenuti, se ti serve.' },
        { tag: 'Trasparenza', t: 'Pubblicità dichiarata', x: 'L’influencer segnala la collaborazione come pubblicità, con #adv e gli strumenti delle piattaforme.' },
        { tag: 'Art. 4', t: 'Durata e recesso', x: 'Durata minima, rinnovo tacito mensile e preavviso via PEC o raccomandata.' },
        { tag: 'Art. 5', t: 'Mezzi, non risultati', x: 'Il fornitore garantisce diligenza professionale, non un numero di follower o di vendite.' },
        { tag: 'Art. 7', t: 'Legge e foro', x: 'Legge italiana e foro competente: meglio deciderlo prima che serva.' },
      ]} />
      <FeatureSplit tone="paper" eyebrow="Lavori con i creator?" title={'Su influencee il contratto\n*si genera da solo*'} lead="Per le collaborazioni con i creator italiani iscritti non serve compilare nulla: il contratto nasce dai termini accettati da entrambi." items={[
        { eyebrow: 'Contratto generato', title: 'Dai termini concordati al documento', text: 'Quando brand e creator accettano la stessa versione dei termini, la piattaforma genera il contratto con parti, contenuti, scadenze, compenso e diritti d’uso, e ne registra l’impronta.', bullets: ['DOCX, PDF quando disponibile', 'Impronta del documento registrata', 'Sempre legato alla collaborazione'], visual: <ContractMock />, href: '#/funzionalita/contratto-influencer/', cta: 'Come funziona il contratto' },
        { eyebrow: 'Termini in versioni', title: 'Ogni controproposta è una nuova versione', text: 'Il creator può proporre condizioni diverse: ogni controproposta crea una nuova versione dei termini e azzera le accettazioni. La collaborazione parte solo quando entrambi accettano la stessa versione.', bullets: ['Compenso in denaro, cambio merce o affiliazione', 'Consegne, richieste di modifica e scadenze', 'Valutazione reciproca a fine collaborazione'], visual: <CollabMock />, href: '#/funzionalita/gestione-campagne/', cta: 'Scopri la gestione campagne' },
      ]} />
      <ManagedRow />
      <FaqSeo items={FAQ} />
      <Related links={[
        { label: 'Contratto influencer', text: 'Generato dai termini nella piattaforma', href: '#/funzionalita/contratto-influencer/' },
        { label: 'Quanto costa un influencer', text: 'Prezzi medi per fascia', href: '#/social-media-tool/costo-influencer/' },
        { label: 'Contenuti UGC', text: 'Diritti d’uso per le ads', href: '#/contenuti-ugc/' },
        { label: 'Tool gratuiti', text: 'Altri strumenti per social media manager', href: '#/social-media-tool/' },
      ]} />
      <CtaBandV2 title={'Trova i creator\n*e firma con un clic*'} lead="Cerca creator italiani, concorda i termini e lascia che il contratto si generi da solo." primary={{ label: 'Registra la tua azienda', href: APP.brand }} secondary={{ label: 'Vedi i prezzi', href: '#/prezzi/' }} />
    </>
  );
}

export const PAGE: ExPage = {
  path: '/contratto-social-media-influencer-ugc/',
  ready: true,
  titles: ['Modello contratto social media, influencer, UGC', 'Contratto social media, influencer e UGC', 'Contratto social media e influencer'],
  meta: {
    label: 'Modello di contratto',
    type: 'tool',
    kw: 'contratto social media manager',
    description: 'Modello di contratto gratuito per social media manager, influencer e UGC: inserisci i dati di cliente e fornitore, copia il testo o scaricalo in Word.',
    crumbs: [{ label: 'Risorse' }, { label: 'Modello di contratto' }],
    faq: FAQ,
  },
  el: () => <ContractPage />,
};
