# Restauro dei tool lead magnet e della bacheca offerte

- **Design:** Figma "Influencee – Tool lead magnet e bacheca offerte (restauro)", https://www.figma.com/design/va5iYdE0tP7ehCCIOGUf7b
- **Codice:** `tools.tsx` (componenti) e `pages.tsx` (pagine e metadati)
- **Dati:** Search Console del vecchio sito (`search-console-pagine.csv`, clic e impressioni del periodo esportato)

## In breve

Sul vecchio sito c'erano circa 22 pagine "tool", tutte in JavaScript dentro Elementor, senza calcoli sul server. Le visite si concentrano su tre: fake follower (3.426 clic), costo influencer (960) e calcolo engagement (373). La bacheca offerte ne porta 492, tra pagina principale e 68 schede offerta.

Le prime cinque pagine sono restaurate con lo **stesso URL**, più l'hub dei tool. Le altre sono in fase 2, in ordine di traffico.

## Inventario completo

| Vecchio URL | Clic GSC | Cos'era | Stato v2 |
| --- | --- | --- | --- |
| `/followe-instagram-fake-follower/` | 3.426 | Articolo con statistiche senza fonte e un "Audience Quality Score" che l'app non ha | ✅ **Tool vero**: 5 segnali calcolati con soglie dichiarate, più la guida |
| `/social-media-tool/costo-influencer/` | 960 | Calcolatore JS: follower × tariffa per formato (post 0,01; stories 0,005; video 0,02) × piattaforma (IG 1; TikTok 1,2; YouTube 1,5) × nicchia (da 1 a 2). Non usava l'engagement, anche se lo prometteva | ✅ **Calcolatore**: formula di prezzo dell'app (€/follower) e media di mercato per fascia (DeRev), con la fonte |
| `/come-calcolare-engagement-rate/` | 373 | Articolo | ✅ Già restaurato: calcolatore ER e check sponsor |
| `/offerte-lavoro-influencer/` | 188 | Bacheca WP Job Manager, con 60 offerte quasi tutte del 2022 | ✅ **Bacheca** con ricerca e filtri per compenso; le offerte arrivano dall'app |
| `/offerta-lavoro/<slug>/` (68) | 304 | Schede offerta, scadute | ↪ 301 alla bacheca |
| `/pubblica-offerta-lavoro/` | 1 | Form WP Job Manager | ✅ **Form in 3 passi** con anteprima, poi account aziendale |
| `/social-media-tool/` | — | Hub | ✅ **Hub** con filtro per pubblico |
| `/social-media-tool/emoticon-da-copiare/` | 48 | Elenco emoticon | ✅ **Tool**: copia con un clic e "Il tuo testo" da copiare tutto insieme |
| `/come-calcolare-il-costo-degli-influencer/` e varianti | 73 | Articoli doppi | ↪ 301 al calcolatore del costo |
| `/tiktok-keyword-tool/` | 27 | Tool keyword TikTok | ⏳ Fase 2 |
| `/social-media-tool/anteprima-dei-tuoi-post-sui-social/` | 11 | Anteprima post | ⏳ Fase 2 |
| `/preventivo-campagne/` | — | **Calcolatore funzionante ma non linkato da nessuna pagina**, con il listino del servizio gestito: influencer 500 €, ogni contenuto in più 475 €, fee 250 € a influencer, UGC 150 € + fee 100 €, +10% se dura 1 mese, sconti del 5/6/8% a 3/6/12 mesi | ✅ **Restaurato** (listino confermato il 20/10/2026): preventivo della campagna gestita con riepilogo per voce e invio su WhatsApp con il messaggio già compilato. Keyword "agenzia influencer marketing" |
| `/preventivi-influencer/` | 6 | Form Brevo con brief e budget, nessun numero in risposta | ↪ 301 a `/preventivo-campagne/` (prima la stima, poi WhatsApp) |
| `/tool-influencer/` | 4 (10.714 impressioni) | Pagina prodotto | ↪ 301 all'hub; title da rivedere sulla query |
| `/social-media-tool/generatore-prompt-per-social-media-manager/` | 3 | Generatore di prompt | ⏳ Fase 2, bassa priorità |
| `/social-media-tool/calcola-preventivo-gestione-social/` | 3 | Preventivatore SMM: tariffa oraria (28/35/40 € per esperienza) × ore stimate, più un contratto in 7 articoli scaricabile in PDF | ⏳ Fase 2, alta priorità per i social media manager |
| `/social-media-tool/piano-editoriale-online/`, `/calendario-editoriale/`, `/social-campaign-planner/`, `/social-media-strategy-tool/`, `/report-social-organico/`, `/comprimi-immagini-online/` | 0–2 | Template e utility | ⏳ Fase 2: accorpare in 2–3 tool (piano editoriale, preventivo social) |
| `/hashtag-piu-cercati-su-instagram/` | n/d | Articolo fermo al 2023 | ⏳ Fase 2, bassa priorità |
| `/converti-immagini-in-webp/` | n/d | Convertitore WebP (canvas) | ⏳ Fase 2: unire al compressore immagini |
| `/corso-gratuito-social-ads-2025/` | n/d | Corso con form Brevo (nome + email): l'unico vero lead magnet a email | ⏳ Da decidere: tenerlo o aggiornarlo al 2026 |
| `/social-media-tool-form/` | — | **Vicolo cieco**: le 13 card aprono un form Brevo che chiede nome, telefono ed email, ma nessun tool si sblocca | ↪ 301 all'hub; da togliere subito dal menù del vecchio sito |
| `/tool-finanziario/` | 0 | 404 | ↪ 301 all'hub |

## Problemi del sito attuale da sistemare subito (prima della v2)

Fonte: analisi del vecchio sito del 19/10/2026, con screenshot in scratchpad (`old-site-shots/`).

| Problema | Effetto | Correzione |
| --- | --- | --- |
| Pixel Meta inizializzato con l'ID tra graffe: `fbq('init','{595078877779895}')` | Il Pixel non registra niente: campagne Meta senza conversioni | Togliere le graffe |
| Voce di menù "Free Social Media Tool" → `/social-media-tool-form/` | Chiede telefono ed email, ma poi non dà nessun tool: perde fiducia e lead | Puntare la voce di menù a `/social-media-tool/` |
| Form Brevo con il testo d'esempio "Personalizza questo testo di aiuto…" | Sembra un sito non finito | Togliere il testo |
| Da 3 a 5 tag `<title>` sulle pagine `/social-media-tool/*`, anche "Influencer Verona" | Google sceglie un title a caso | Un solo title per pagina |
| Bacheca: 56 offerte scadute (2021–2022) ancora online, con `JobPosting` senza scadenza e senza luogo valido | Avvisi in Google Jobs e una bacheca che sembra abbandonata | Chiudere le offerte scadute |
| Campaign Planner: export PNG rotto (manca html2canvas) | Il tool dà errore | Nella v2 è da rifare |

## Scelte di contenuto

1. **Niente numeri inventati.** Le statistiche del vecchio articolo fake follower non hanno fonte, ad esempio "34% dei creator con il 15% di follower falsi, fonte Influencee Benchmark 2026". Non sono state riprese.
2. **Soglie dichiarate.**
   - Le soglie del fake follower checker sono indicative e sono scritte in pagina, nelle FAQ e in `llms.txt`.
   - Il check sponsor usa le soglie dell'app (1,5 / 1,9 / 2,7%).
   - Le medie di engagement vengono dal benchmark di mercato (`MARKET.erIG`).
3. **Il tool non legge i social.** L'utente inserisce numeri pubblici e il calcolo avviene nel browser. La pagina lo dice chiaramente e rimanda ai **creator verificati**, che collegano l'account. È il collegamento naturale verso il prodotto.
4. **Bacheca onesta.** Le offerte del 2022 non si mostrano. Restano le due del 2026, con la loro data, finché la pagina non legge gli annunci aperti dell'app.

## Cosa serve dal team dell'app

| Richiesta | Perché |
| --- | --- |
| Un endpoint JSON pubblico degli annunci aperti (titolo, azienda, luogo, compenso, data, scadenza, URL) | Per riempire la bacheca del sito e generare `JobPosting` solo per le offerte aperte (Google Jobs) |
| Leggere `?da=pubblica-offerta` all'iscrizione brand e aprire direttamente "nuovo annuncio" | Chiude l'imbuto del form: oggi l'utente deve riscrivere l'offerta, anche se può copiarla |
| Registrare `?da=` come fonte del lead (oggi solo link e annuncio) | Per sapere quanti clienti arrivano da ogni tool |

## Misurazione (dettagli in `ANALYTICS-PIANO.md`)

| Evento | Domanda di business |
| --- | --- |
| `calculator_use` (fake_follower, costo_influencer) | Quale tool porta brand che poi provano la piattaforma? |
| `tool_use` | I tool "di traffico", come le emoticon, portano solo visite o anche iscrizioni? |
| `job_search` (con `results`) | I creator trovano offerte? Se `results = 0` è frequente, mancano offerte da chiedere ai brand |
| `job_post_step` → `begin_sign_up` | Quante aziende iniziano a pubblicare e quante arrivano all'account? |

## Fase 2: ordine consigliato

1. ✅ Preventivo campagne del servizio gestito: fatto.
2. Preventivatore per social media manager con contratto in PDF.
3. Nel calcolatore del costo: aggiungere formato (post, stories, video) e nicchia, con i moltiplicatori del vecchio tool, se il titolare li conferma.
4. Anteprima post, con TikTok e il troncamento "…altro".
5. Piano editoriale, che accorpa calendario, planner, Gantt e report.
6. Compressore immagini e WebP insieme. TikTok keyword e hashtag restano articoli.

Ogni tool passa prima da Figma (stessa pagina del file), poi va nel codice con lo stesso URL, gli eventi GA4 e le FAQ.

## Regole di consegna (valgono per ogni tool nuovo)

1. **Codice prima, Figma come archivio.** Se il tool riusa i blocchi esistenti si costruisce direttamente nel sito e la pagina finita si porta in Figma. Si parte da Figma solo per le interfacce nuove o quando qualcuno deve approvare prima.
2. **Controllo automatico di tutte le pagine** (script `audit.mjs` nella scratchpad, da rilanciare a ogni consegna). Controlla:
   - title entro 60 caratteri, description tra 70 e 155;
   - un solo H1, nessuno scorrimento orizzontale a 390 px;
   - nessuna sezione solo testo, nessun link rotto, nessun title duplicato.
3. **Eventi verificati in Chromium** con `?debug_analytics`: ogni pulsante ha il suo evento e un form conta come lead solo se il lead arriva davvero.
4. **Stesso URL** per le pagine con traffico; 301 per i doppioni.
5. **Niente note interne in pagina** ("prototipo", "stesso URL del sito attuale", "da inserire").

## Plugin WordPress (21/10/2026)

I tool restaurati vanno su influencee.it con il plugin `influencee-tools` (guida: `wp-plugin/influencee-tools/LEGGIMI-INSTALLAZIONE.md`).

| Requisito | Come è fatto | Verificato su WordPress locale (6.x, tema Hello Elementor, WP Job Manager, SQLite) |
| --- | --- | --- |
| Stesso URL delle 8 pagine | il plugin serve la pagina con header e footer del tema; interruttore per pagina | ✅ 8 pagine; spegnendone una torna la pagina Elementor |
| SEO/GEO/AEO leggibile senza JavaScript | HTML pre-renderizzato: un `<title>`, description, OG, JSON-LD (WebApplication, BreadcrumbList, FAQPage), FAQ con le risposte nell'HTML, `/llms.txt` | ✅ title ×1, H1 ×1, FAQ schema = FAQ visibili, nessun link `#/`, 1.360–2.090 parole per pagina |
| Tracciamenti GA4 | eventi sul tag del sito (G-5BD025G8VP), solo nell'area dei tool | ✅ `calculator_use`, `tool_use`, `job_search`, `job_post_step`, `form_submit`, `generate_lead` con `lead_source` |
| Ogni tool genera lead in tandem | `<form data-tandem>` con email/telefono e il risultato del tool in `risultato_tool` | ✅ 8 lead su 8 arrivati all'endpoint `/wp-json/tandem-forms/v1/capture` con lo script tandem reale del sito |
| Offerte reali | WP Job Manager: pubblicate negli ultimi 180 giorni, non chiuse, non scadute | ✅ esclusa l'offerta del 2022 e quella chiusa |
| Non rompere il tema | CSS senza `@layer`, tutto sotto `#influencee-tools` | ✅ nessuna pagina più larga dello schermo a 390 px e a 1280 px |
| Tornare indietro | disattivare il plugin | ✅ tornano le pagine di prima |

Analisi SEO con Ubersuggest dal vivo: `SEO-TOOL-WP.md` §0-bis.
