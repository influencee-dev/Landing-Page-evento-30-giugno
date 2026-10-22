# Piano: influencee.it senza Elementor, senza perdere traffico (22/10/2026)

## Com'è oggi (verificato sul sito)

- **199 pagine** pubblicate, 195 con Elementor. **132** sono già rifatte dai plugin (tool, pagine, home, regioni,
  città, categorie), **67** esistono solo in Elementor (2 sono le offerte di lavoro, già nel plugin Annunci).
- Le 67 portano circa **1.670 clic** da Google (Search Console), su circa 20.600 del sito. Il 90% viene da 10 pagine:
  `/influencer-italiane/` 455, `/sport-influencers/` 332, `/influencer/` 201, `/offerte-lavoro-influencer/` 188,
  `/luxury-influencers/` 79, `/wedding-influencers/` 68, `/academy-influencer-marketing/` 61, `/model-influencers/` 51,
  `/chi-siamo/` 42, `/entrepreneur-influencers/` 37. 32 pagine non hanno clic.
- **Ogni pagina carica Elementor**, anche quelle dei nostri plugin, per tre motivi:
  1. l'intestazione è un modello Elementor Pro (178) che contiene il menu `ifn-header` del plugin Influencee Header Footer;
  2. il piè di pagina è un modello Elementor Pro (18568);
  3. il tema è Hello Elementor.
  Risultato sulla home: 18 CSS e 16 JavaScript, 164 KB di HTML, 9–13 secondi senza cache.

## Obiettivo

Tutte le pagine in HTML5 con **un solo CSS e un solo JavaScript del sito** (quelli del Core, più il layout), stessi
indirizzi, stessi titoli, description, H1, testi, link interni e dati strutturati (o migliori). Elementor si spegne
solo quando nessuna pagina lo usa più.

## Le tre fasi

### Fase 1 · Plugin **Influencee Tema** (intestazione, piè di pagina, layout di tutto il sito)

- Intestazione e piè di pagina in HTML5, **con gli stessi link di oggi** (menu Piattaforma, Aziende, Creator, Trova
  influencer con le 20 regioni, Prezzi, Blog, Accedi, Inizia gratis; nel piè di pagina Cosa offriamo, Aziende, Creator,
  note legali, P.IVA). I link interni restano: per Google il sito resta collegato come prima.
- Stile del sito v2 (nero, verde acido), menu da telefono senza jQuery, eventi GA4 su ogni link (`cta_location`
  header/footer).
- Piè di pagina con la struttura del sito (SEO-PIANO §4.8): categorie e città principali, solo verso pagine che esistono.
- Non tocca la SEO delle pagine: title, description, canonical e dati strutturati restano quelli del Core o del plugin
  SEO del sito (verificato uguale con il Tema acceso e spento). Il Core 2.1.0 lascia un solo canonical.
- Si accende in tre modi dalle impostazioni: **spento** / **solo pagine dei plugin** / **tutto il sito**. Nelle pagine
  dove è acceso toglie i CSS e JS di Elementor, Elementor Pro, Hello Elementor e Header Footer.
- Core e Articoli chiamano «l'intestazione del sito» al posto di `get_header()`: se il Tema è spento resta tutto
  com'è.

### Fase 2 · **Conversione** delle 65 pagine Elementor in HTML5 (plugin Influencee Pagine)

- Finché Elementor è attivo, il plugin legge la pagina come la disegna Elementor, la ripulisce come già fa con gli
  articoli (via contenitori, classi e stili di Elementor; restano testi, titoli, link, immagini, moduli tandem) e la
  **salva come HTML5** nella pagina stessa. Da lì la pagina non dipende più da Elementor.
- Pagina **Influencee → Conversione**: elenco delle 67 pagine con clic da Google, stato (Elementor / convertita /
  online), pulsanti **Converti**, **Anteprima**, **Metti online**, **Torna a Elementor**.
- Prima di metterla online un controllo automatico confronta prima e dopo: title, description, canonical, H1, H2,
  numero di parole, link interni, immagini con alt, dati strutturati. Se qualcosa manca, la pagina non va online.
- Ordine: prima le 32 senza clic (prova), poi le altre, per ultime le 10 che portano traffico, una alla volta.

### Fase 2 bis · Regole del piano SEO del sito nuovo (`src/influencee/v2/SEO-PIANO.md`)

La conversione non è una copia cieca: per ognuna delle 67 pagine vale l'azione già decisa nel piano SEO.

| Pagine | Azione | Nota |
| :-- | :-- | :-- |
| `/sport-influencers/` (332 clic) | piano SEO: 301 → `/fitness-influencers/` | **da decidere**: solo quando `/fitness-influencers/` è online e parla anche di sport; altrimenti conversione allo stesso URL |
| `/social-media-tool-form/`, `/tool-influencer/` | 301 → `/social-media-tool/` | il primo è già nei redirect del Core (spenti), il secondo va aggiunto |
| `/piattaforma-influencer-marketing/` | 301 → `/piattaforma-influencer/` | stessa ricerca di due pagine (cannibalizzazione) |
| `/preventivi-influencer/` e i 9 tool in `/social-media-tool/…` | restauro del tool (fase 2 di `RESTAURO-TOOL.md`) oppure 301 → `/social-media-tool/` | mai 404 |
| `/influencer-italiane/` (455 clic) | stesso URL, contenuto da articolo; link a `/influencer-italiani/` | |
| `/luxury-influencers/`, `/model-influencers/`, `/wedding-influencers/`, `/entrepreneur-influencers/`, `/artist-influencer/` | stesso URL, stesso testo: solo HTML5 | categorie senza equivalente nell'app |
| `/offerte-lavoro-influencer/`, `/pubblica-offerta-lavoro/` | già nel plugin Annunci | |
| Tutte le altre (academy, chi siamo, corsi, privacy…) | conversione allo stesso URL | |

Ogni pagina convertita prende anche le regole GEO/AEO del piano SEO (§4), senza cambiare il testo che si posiziona:
box «In breve» con la risposta di 40–70 parole quando la pagina risponde a una domanda; FAQ visibili uguali al JSON-LD;
`Organization`, `WebPage`, `BreadcrumbList`; breadcrumb e «Continua a esplorare»; entità con le stesse parole
(Influencee, Partidea SRL, piattaforma italiana di influencer marketing, solo creator italiani).

### Fase 3 · Spegnere Elementor

- Quando il controllo dice «0 pagine usano Elementor»: si **disattiva** Elementor Pro, poi Elementor, poi Header
  Footer; il tema Hello Elementor resta (senza Elementor è un tema vuoto e leggero). Si elimina solo dopo 30 giorni
  senza problemi.

## Come non perdere traffico

| Rischio | Contromisura |
| :-- | :-- |
| URL che cambiano o 404 | Nessun URL cambia: stessa pagina WordPress, stesso indirizzo. Se una pagina convertita si spegne torna quella di prima. |
| Testi, titoli o H1 diversi | La conversione tiene il testo com'è; il controllo prima/dopo blocca la pubblicazione se cambia. |
| Link interni persi | Intestazione e piè di pagina con gli stessi link; il controllo conta i link di ogni pagina. |
| Dati strutturati persi | Si tengono e si aggiungono Organization, WebPage, BreadcrumbList; FAQ visibili uguali al JSON-LD. |
| Pagina rotta | Anteprima prima di andare online; «Torna a Elementor» con un clic finché Elementor è installato. |
| Calo da Google | Le 10 pagine con traffico per ultime, una alla volta; controllo in Search Console dopo 7 e 14 giorni. |
| Cache vecchia | Ogni cambio svuota LiteSpeed per quella pagina. |

## Cosa misurare

- Prima e dopo ogni fase: tempo di risposta senza cache e in cache, numero di CSS/JS, PageSpeed mobile.
- Search Console: clic e posizione delle 10 pagine con traffico, settimana per settimana.
