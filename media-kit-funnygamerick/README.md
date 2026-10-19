# FunnyGameRick — Media kit

Landing page media kit di **FunnyGameRick** (Riccardo Buttitta): una sola pagina, in italiano, pensata per brand e agenzie.

Progetto autonomo dentro questo repository: ha il suo `package.json` e non tocca la landing dell'evento nella cartella principale.

**Stack:** Vite 6 · React 19 · TypeScript · Tailwind CSS 4 · Motion (animazioni) · Lucide (icone) · Simple Icons (loghi social) · font Oxanium e Inter installati in locale (nessuna chiamata a Google Fonts).

## Avvio

```bash
cd media-kit-funnygamerick
npm install
npm run dev        # http://localhost:3001
npm run build      # controllo TypeScript + build in dist/
npm run preview    # anteprima della build su http://localhost:4173
```

Serve Node.js 20 o superiore.

## Dove si modificano i contenuti

**Tutto è in `src/data/creator.ts`.** I componenti leggono solo da lì, nessun testo è scritto dentro il layout.

Regole:

- Un dato sconosciuto si lascia `null` (o un array vuoto `[]`): la pagina lo nasconde da sola. **Mai 0 o numeri stimati.**
- I numeri si scrivono interi (`75200`), la pagina li formatta in italiano (`75,2K`).
- `approximate: true` indica un valore arrotondato (come "75,2K" letto su YouTube): viene mostrato con `≈`.
- Dopo ogni aggiornamento delle metriche, aggiorna `metricsUpdatedAt` (formato `AAAA-MM-GG`).

Cosa succede quando un dato manca:

| Dato mancante | Comportamento |
| --- | --- |
| Follower di una piattaforma | La piattaforma compare in "Presente anche su", solo con link al profilo |
| Visualizzazioni medie, reach, engagement | La card non viene mostrata |
| Dati audience (età, genere, paesi…) | Al posto dei grafici c'è un testo sulla community |
| Video in evidenza (`featuredContent`) | La sezione "Press play" e la voce di menu "Video" spariscono |
| Email (`contact.email`) | La CTA porta al profilo Instagram (`fallbackUrl`); niente pulsante "copia email" |
| Logo partner | Card con monogramma grafico |
| Foto reale (`images.aboutPhoto`) | "Dietro il controller" mostra una scheda personaggio in stile HUD |

In sviluppo (`npm run dev`) la console del browser elenca i dati ancora da compilare.

## Dati già presenti e fonti

Verificati il 19/10/2026 sulla pagina pubblica [youtube.com/@FunnyGameRick](https://www.youtube.com/@FunnyGameRick):

- Iscritti YouTube: 75,2K · Video pubblicati: 6,6K (arrotondati da YouTube).
- Link social ufficiali (YouTube, TikTok, Instagram, Twitch, Facebook, Telegram, Linktree), presi dai link del canale.
- Storia: inizio su TikTok nel 2022, da 1 a 4 short al giorno, walkthrough al 100% con missioni secondarie, video e live (dalla descrizione del canale).
- Programmi di affiliazione (Amazon, Instant Gaming, AliExpress, Shein), dichiarati dal creator nella descrizione del canale.
- Partnership (Ubisoft Creator Program, Deep Silver Collective, Keymailer): dal brief. Sono presentate come programmi creator / accesso ai giochi, **non** come sponsorizzazioni.

Immagini: avatar e banner ufficiali scaricati dal canale YouTube e convertiti in WebP (`public/images/`). `public/og-image.jpg` è l'anteprima per i social, composta con avatar e titolo.

## Da fornire prima della pubblicazione

**Contatti**
- [ ] Email professionale → `contact.email`

**Metriche** (con screenshot o export dagli strumenti delle piattaforme)
- [ ] Follower TikTok, Instagram, Twitch, Facebook (e iscritti Telegram, se si vuole mostrarli: impostare `showInStats: true`)
- [ ] Visualizzazioni medie per video, reach mensile, engagement rate → `aggregateMetrics`
- [ ] Verifica e aggiornamento dei numeri YouTube (iscritti esatti da YouTube Studio)

**Audience** (YouTube Studio / TikTok Analytics / Instagram Insights) → `audience`
- [ ] Fasce d'età, genere, paesi/città principali, ripartizione per piattaforma, metriche di engagement
- [ ] Fonte e periodo dei dati → `audience.source`

**Contenuti e immagini**
- [ ] 1–4 video rappresentativi (link reali) → `featuredContent`. Per YouTube la miniatura si ricava dal link.
- [ ] Una foto reale di Riccardo (verticale, almeno 800×1000 px) → `public/images/` + `images.aboutPhoto`
- [ ] Loghi partner, solo se ufficiali e utilizzabili (SVG o PNG trasparente) → `public/logos/` + campo `logo`
- [ ] Conferma da Riccardo di testi, partnership e formati di collaborazione

## Pubblicazione

1. Compila i dati mancanti in `src/data/creator.ts`.
2. Imposta l'URL definitivo, che serve per canonical e anteprima social:
   ```bash
   SITE_URL=https://dominio-definitivo.it npm run build
   ```
   (oppure crea un file `.env` partendo da `.env.example`).
3. Pubblica la cartella `dist/` su un hosting statico (Vercel, Netlify, Cloudflare Pages, o un qualsiasi web server).
   Su Vercel/Netlify: root directory `media-kit-funnygamerick`, build command `npm run build`, output `dist`.
4. Controlla l'anteprima social con il [Sharing Debugger di Facebook](https://developers.facebook.com/tools/debug/) e il [Post Inspector di LinkedIn](https://www.linkedin.com/post-inspector/).

Non serve un backend: la pagina non ha moduli. Il contatto avviene via email (`mailto:`) o tramite il canale indicato in `fallbackUrl`.

## Struttura

```
src/
  data/creator.ts        ← contenuti (l'unico file da modificare)
  data/types.ts          tipi dei dati
  lib/format.ts          formattazione numeri/date e regole "mostra o nascondi"
  App.tsx                ordine delle sezioni e menu
  components/            una sezione per file: Hero, Stats, About, ContentUniverse,
                         Partnerships, Audience, Formats, Featured, Contact, Navbar, Footer
  components/ui/         elementi riutilizzabili (Reveal, CountUp, WaveField, PlatformIcon…)
  index.css              design token (colori, font) ed effetti grafici
public/                  immagini, favicon, og-image
```

**Design token** (`src/index.css`, blocco `@theme`): `night #030A18`, `deep #07152B`, `surface #0C203A`, `gaming #1165A3`, `cyan #63DFF7`, `cyan-bright #35D9FF`, `ink #F5FAFF`, `muted #A6B8CC`, `line #234663`.

**Accessibilità e movimento:** link "Vai al contenuto", focus sempre visibile, menu mobile chiudibile con Esc, testi alternativi sulle immagini. Con "riduci movimento" attivo nel sistema operativo le animazioni (rotazioni, count-up, parallax, onde) si fermano.
