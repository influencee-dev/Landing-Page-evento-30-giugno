# Il Palagiaccio — Landing Franchising

Landing page per l'acquisizione di potenziali affiliati della Bottega Il Palagiaccio.
Stack: **Vite + React 19 + TypeScript + Tailwind CSS 4** (stesso stack del progetto che la contiene),
font self-hosted con Fontsource, nessuna libreria di animazione (CSS + IntersectionObserver).

## Avvio

```bash
cd palagiaccio-franchising
npm install
npm run dev        # http://localhost:3001
npm run build      # typecheck + build in dist/
npm run preview    # anteprima della build
```

La cartella `dist/` è statica: si pubblica su qualunque hosting (Vercel, Netlify, server Apache/Nginx).

## Struttura

```
src/
  data/
    content.ts     ← tutti i testi (fonte: documento "Landing Page Palagiaccio – Testi")
    franchise.ts   ← investimenti, superfici, condizioni, opzioni del modulo
    images.ts      ← configurazione centralizzata delle immagini
  styles/
    tokens.css     ← design token: colori, font, scale, spaziature, raggi, easing
    global.css     ← base, tipografia, bottoni, segnaposto, modulo, animazioni
  components/
    layout/        ← Header, Footer, Logo, CTA sticky mobile
    sections/      ← una sezione per file, nell'ordine del documento
    ui/            ← ImageSlot, LeadForm, Button, ReviewFlag, icone
  lib/lead.ts      ← integrazione del modulo con il backend
  lib/validation.ts
public/
  brand/           ← logo ufficiale (colore e bianco) da palagiaccio.com
  images/          ← foto definitive (vedi public/images/README.md)
```

## Sostituire le immagini

Copia le foto in `public/images/` con i nomi elencati in `public/images/README.md`.
Non serve toccare il codice: se il file esiste viene mostrato, altrimenti resta il segnaposto.
In `src/data/images.ts` puoi cambiare per ogni immagine:
- `focal` / `focalMobile`: punto focale (`object-position`, es. `"50% 30%"`);
- `alt`: testo alternativo;
- `srcSet` (facoltativo): varianti responsive, es. `"/images/hero-1200.jpg 1200w, /images/hero-2000.jpg 2000w"`.

## Colori e font

Tutto è in `src/styles/tokens.css` (blocco `@theme`): ogni variabile genera anche le utility
Tailwind (`bg-bordeaux`, `text-gold-deep`, `font-serif`, …).
Per cambiare font: sostituisci gli import in `src/main.tsx` e aggiorna `--font-serif` / `--font-sans`.

### Analisi del brand (palagiaccio.com, CSS del tema Shopify)

Valori **ufficiali** estratti dagli asset:
- Bordeaux `#802938` (link e bottoni), `#79242f` (footer), `#772531` (header)
- Oro `#c09a53` (titoli e testo della modalità scura del sito)
- Nero `#1f1f1f` testo, `#1a1a1a` sfondo scuro; grigio `#7c7b7b`; separatori `#e0e0e0`
- Titoli: *Baskerville No 2* (proprietario) con fallback **Libre Baskerville** → usato Libre Baskerville
- Testi e label: **Montserrat** (maiuscoletto spaziato nel menu)
- Bottoni squadrati (raggio 0–3px)

Valori **stimati** (coerenti con l'identità, scelti per ritmo e contrasto WCAG AA):
- Crema `#f6f1e8` e `#ece4d6` (sezioni alternate e segnaposto)
- `#80622a` oro scurito per testo piccolo su chiaro; `#e2c993` oro chiaro su bordeaux
- `#5c5a57` grigio caldo per testi secondari; `#5c1b25` bordeaux profondo
- Scala tipografica fluida, spaziature e durate delle animazioni

Il logo ufficiale (PNG 400×200) è stato preso dal sito; se disponibile, sostituirlo con la versione vettoriale SVG.

## Testi e dati economici

- Testi: `src/data/content.ts`. I componenti non contengono copy.
- Investimenti, superfici, condizioni, 80/20, opzioni "Disponibilità di investimento": `src/data/franchise.ts`.
- I valori con `needsReview: true` mostrano un contrassegno **"DA VALIDARE"** in sviluppo
  (`npm run dev`) o con `VITE_SHOW_REVIEW_FLAGS=true`. In produzione non compare mai.

## Collegare il modulo a un endpoint reale

1. Copia `.env.example` in `.env` e imposta `VITE_LEAD_ENDPOINT=https://…` (webhook Make/Zapier, CRM, API).
2. Il modulo invia una `POST` JSON con: `name, email, phone, city, investment, message, privacyConsent`,
   più `source`, `page`, `submittedAt` e `attribution` (utm_*, gclid, fbclid).
   L'endpoint deve rispondere 2xx e consentire CORS dal dominio della landing.
3. Per formati diversi (form-data, header di autenticazione lato server…) modifica solo `src/lib/lead.ts`.

Senza endpoint il modulo è in **modalità anteprima**: valida i campi ma non invia nulla e lo dichiara
all'utente ("nessun dato è stato inviato"). Non viene mai mostrato un falso messaggio di successo.
I dati non vengono salvati in localStorage né scritti in console. È presente un campo trappola anti-spam
e la protezione dai doppi invii. Consigliato aggiungere anche una verifica lato server (rate limit / captcha).

Imposta anche `VITE_SITE_URL` (es. `https://franchising.palagiaccio.com`) per canonical e Open Graph,
e carica `public/images/og-franchising.jpg` (1200×630).

## ⚠ Da confermare prima della pubblicazione

Dalle note strategiche del documento (SOE v3) e dalle scelte di implementazione:

1. **Corrispettivi** — fee €10.000, royalty 2–3%, contributo marketing €600/mese sono indicati come
   formule consigliate: confermarli come condizioni commerciali definitive (`franchise.ts → conditions`).
2. **Investimento** — le fasce €55.000–€75.000 e €85.000–€110.000 escludono i lavori edili: verificare
   quali voci sono comprese (fee, prima fornitura, attrezzature). Il "a partire da €55.000" compare in hero,
   CTA finale e meta description (`index.html`).
3. **Degustazioni** — verificare configurazione operativa e requisiti autorizzativi prima di presentarle
   come disponibili in ogni tipologia di negozio (sezione Format, punto 02; testi in Prodotti e Format standard).
4. **Privacy** — il link punta all'informativa del sito ufficiale (`content.ts → site.privacyUrl`):
   verificare che copra il trattamento dei lead franchising. Validare anche il testo del consenso
   (`contact.fields.privacy*`).
5. **Opzioni "Disponibilità di investimento"** — derivate dalle due configurazioni del documento.
6. **Dati societari nel footer** — "Storica Fattoria Palagiaccio s.s.a. · P.IVA 06083140480", ripresi dal
   footer di palagiaccio.com: confermare la ragione sociale da indicare per il franchising.
7. **Cookie / tracciamento** — la pagina non carica pixel né analytics. Aggiungendo Meta Pixel o Google Ads
   serve un banner di consenso conforme.
8. **Foto** — tutte le immagini sono segnaposto.

## Accessibilità, SEO e prestazioni

Un solo H1, gerarchia H2/H3 coerente, landmark semantici, link "Vai al contenuto", focus visibili,
navigazione da tastiera (menu con Esc), label e messaggi di errore collegati ai campi (`aria-describedby`),
contrasti AA, `prefers-reduced-motion` rispettato. Immagini lazy sotto la hero e prioritarie nella hero,
font self-hosted con `font-display: swap`, nessuna dipendenza di animazione.
