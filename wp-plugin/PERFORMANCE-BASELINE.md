# Velocità di influencee.it: fotografia di partenza (3 novembre 2026)

Perché questo file: dal 21/10/2026 Search Console segna **247 pagine "lente"**. Qui c'è la misura *prima* delle
correzioni (server, JavaScript), per poter dire dopo, con numeri, se hanno funzionato.

## In breve

- **Il problema principale è il server.** Ogni pagina impiega da **3,2 a 5,3 secondi** solo per mandare il primo byte
  dell'HTML (TTFB). Google considera buono un LCP (il momento in cui si vede l'elemento principale) entro 2,5 s:
  con un server così **nessuna pagina può passare**, qualunque cosa si faccia al JavaScript o alle immagini.
- **La metrica che fa finire le pagine tra le "lente" è quasi certamente l'LCP** su mobile (laboratorio: 4,7–9,9 s;
  soglia "scarso" oltre 4 s). Il CLS (spostamenti della pagina) è buono ovunque (≤ 0,04). L'INP (risposta ai tocchi)
  è a rischio solo dove il JavaScript pesa di più (home, categorie, tool).
- **Secondo problema: il JavaScript su mobile**, soprattutto `influencee-tools.js` (216 KB, fino a 2,9 s di CPU
  sulla pagina categoria), più Google Tag Manager (175 KB) e WonderPush (103 KB), jQuery bloccante nell'`<head>`.
- **Terzo, solo su alcune pagine: le immagini.** Pagina città: l'immagine principale ha `loading="lazy"` (arriva
  3,5 s più tardi del necessario). Pagina categoria: 0,8 MB di immagini su mobile, 2 MB su desktop.

## Come è stata fatta la misura (e cosa manca)

- **PageSpeed Insights (API pubblica senza chiave): bloccata.** Risposta `429 RESOURCE_EXHAUSTED · "Quota exceeded
  for quota metric 'Queries' and limit 'Queries per day'"` alla prima richiesta e ai 2 tentativi successivi
  (08:13, 08:15, 08:16): la quota giornaliera condivisa delle richieste senza chiave era già finita. Mi sono fermato lì.
- **Quindi niente dati di campo CrUX** (quelli degli utenti veri di Chrome, gli stessi di Search Console) in questa
  fotografia. Per averli: rifare la richiesta PSI domani, oppure con una chiave API di Google Cloud (gratuita) o
  dall'API CrUX. Da ora in poi li raccogliamo anche noi in GA4 (evento `web_vitals`, vedi sotto).
- **Dati di laboratorio: Lighthouse 12.8.2** in locale, lo stesso motore di PageSpeed Insights, con le stesse
  impostazioni (mobile: telefono di fascia media e rete 4G lenta simulata; desktop: preset desktop). Una pagina alla
  volta, 25 s tra una e l'altra. Il TTFB comprende il passaggio attraverso un proxy, quindi può essere un po' più
  alto di quello visto da un utente italiano; resta coerente con le misure dirette (2,6–4,5 s).
- JSON grezzi: `/tmp/claude-0/-home-user-Landing-Page-evento-30-giugno/b7268b3c-1169-54e1-91e0-3dfd977d8278/scratchpad/perf/lh-*.json`
  (riepilogo in `lh-riepilogo.json`, risposta 429 in `psi-429-home-mobile.json`).

## Tabella per pagina (laboratorio, mobile salvo dove indicato)

Soglie Google: LCP buono ≤ 2,5 s, scarso > 4 s · FCP buono ≤ 1,8 s · TBT (blocchi del JavaScript, legato all'INP)
buono ≤ 200 ms · CLS buono ≤ 0,1 · TTFB buono ≤ 0,8 s.

| Pagina | Punteggio | LCP | FCP | TBT | CLS | Speed Index | TTFB server | Peso totale | di cui JS | Cosa ritarda l'LCP |
|---|---|---|---|---|---|---|---|---|---|---|
| Home `/` | 45 | **5,7 s** | 4,3 s | 686 ms | 0,039 | 10,2 s | **3,9 s** | 961 KB | 545 KB | server 4,1 s + 1,6 s di JS prima di disegnare il titolo |
| Home `/` desktop | 78 | 2,1 s | 1,3 s | 0 | 0,021 | 4,0 s | **3,7 s** | 961 KB | 545 KB | server |
| Categoria `/influencer-italiani/` | 41 | **9,9 s** | 4,1 s | 614 ms | 0,016 | 19,9 s | **5,3 s** | 1.554 KB | 545 KB | server 5,5 s + 4,4 s di JS (`influencee-tools.js` 2,9 s di CPU) |
| Categoria desktop | 80 | 1,7 s | 1,2 s | 16 ms | 0,007 | 6,8 s | **3,8 s** | 2.733 KB (2 MB immagini) | 545 KB | server |
| Città `/…/influencer-milano/` | 50 | **8,1 s** | 3,8 s | 361 ms | 0,002 | 18,7 s | **3,7 s** | 1.270 KB | 545 KB | server 4,0 s + immagine principale in `lazy` (+3,5 s) |
| Food `/food-influencers/` | 58 | **4,8 s** | 3,8 s | 383 ms | 0,002 | 9,2 s | **3,7 s** | 905 KB | 545 KB | server 3,9 s + 0,9 s |
| Articolo `/migliori-app-gestione-follower/` | 63 | **4,9 s** | 3,8 s | 230 ms | 0,000 | 8,2 s | **3,3 s** | 645 KB | 329 KB | server 3,5 s + 1,4 s |
| Offerte `/offerte-lavoro-influencer/` | 58 | **4,7 s** | 3,7 s | 398 ms | 0,001 | 9,0 s | **3,5 s** | 472 KB | 333 KB | server 3,7 s + 1,0 s |
| Tool `/social-media-tool/costo-influencer/` | 51 | **5,2 s** | 4,1 s | 556 ms | 0,001 | 9,0 s | **3,2 s** | 733 KB | 545 KB | server 3,4 s + 1,7 s |
| Profilo creator `/creator/diletta-bonaiuti/` | 61 | **4,9 s** | 4,0 s | 238 ms | 0,001 | 9,9 s | **3,9 s** | 1.019 KB | 545 KB | server 4,1 s + 0,7 s |

Dati di campo CrUX (LCP, INP, CLS, TTFB degli utenti veri): **non disponibili** per il blocco 429 descritto sopra.

### Le 5 opportunità principali (risparmio stimato da Lighthouse)

| Pagina | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|
| Home | risposta del server −3,8 s | elemento LCP (JS che ritarda il titolo) | immagini in formato moderno −0,55 s | immagini della misura giusta −0,36 s (158 KB) | JS non usato −0,36 s (355 KB) |
| Categoria | elemento LCP −7,4 s | risposta del server −5,2 s | HTTP/2 −1,2 s* | cache dei file statici −1,1 s | JS non usato −0,9 s (359 KB) |
| Città | elemento LCP −5,6 s | risposta del server −3,6 s | HTTP/2 −1,3 s* | immagine LCP non in lazy −1,2 s | cache dei file statici −1,1 s |
| Food | risposta del server −3,6 s | elemento LCP −2,3 s | JS non usato −0,54 s | CSS/JS bloccanti −0,36 s | — |
| Articolo | risposta del server −3,2 s | elemento LCP −2,4 s | CSS/JS bloccanti −0,36 s | HTTP moderno −0,2 s* | — |
| Offerte | risposta del server −3,4 s | elemento LCP −2,3 s | HTTP/2 −0,36 s* | JS non usato −0,36 s | CSS/JS bloccanti −0,36 s |
| Tool | risposta del server −3,1 s | elemento LCP −2,7 s | CSS/JS bloccanti −0,55 s | HTTP/2 −0,37 s* | — |
| Creator | risposta del server −3,8 s | elemento LCP −2,4 s | CSS/JS bloccanti −0,55 s | JS non usato −0,36 s (374 KB) | — |

\* Tutte le richieste a influencee.it risultano in HTTP/1.1. La misura passa da un proxy, che potrebbe essere lui a
usare HTTP/1.1: **da verificare** dal pannello di hosting (LiteSpeed supporta HTTP/2 e HTTP/3).

## Cosa pesa di più, per tipo di pagina

| Tipo di pagina | Server | JavaScript | Immagini | Caratteri | CSS |
|---|---|---|---|---|---|
| Home, tool, food (Elementor + tool React) | **3,2–3,9 s, la causa principale** | **545 KB**; `influencee-tools.js` 216 KB (1,7–2,1 s di CPU), GTM 175 KB, WonderPush 103 KB, jQuery + jquery-migrate bloccanti | 0,2 MB; home: formati e misure da ottimizzare | 127 KB (Inter, Inter Tight, Montserrat) | 27 KB, ma `influencee-tools.css` blocca il disegno |
| Categoria e città (Influencee Geo) | **3,7–5,3 s** | come sopra, CPU fino a 2,9 s per `influencee-tools.js` | **0,5–0,8 MB mobile, 2 MB desktop**; città: LCP in `lazy` | 127 KB | `geo-pages.css` bloccante |
| Articoli, offerte, profili creator (HTML5 dei plugin) | **3,3–3,9 s** | 330 KB su articoli e offerte (senza `influencee-tools.js`), 545 KB sui profili creator (con); GTM e WonderPush sono la parte più grande | piccole | 83–115 KB | piccolo |

Cose che valgono per tutto il sito:
- **Cache dei file statici a 0**: `influencee-tools.js`, jQuery, `mailin-front.js`, `wp-emoji` tornano senza durata di
  cache: a ogni visita il telefono li riscarica (va impostata una scadenza lunga dal server/LiteSpeed).
- **jQuery e jquery-migrate nell'`<head>`** bloccano il disegno (circa 1–1,5 s su mobile): servono solo a Brevo/Elementor.
- **WonderPush** (notifiche push, 103 KB, 80–320 ms di blocco) su ogni pagina.
- **wp-emoji** caricato inutilmente.

## Perché Search Console dice "lente"

Search Console raggruppa le pagine per LCP, INP e CLS dei visitatori veri (75° percentile, 28 giorni). Il TTFB non è
nel report, ma è dentro l'LCP: con 3–5 s di attesa del server l'LCP supera i 2,5 s per tutti gli utenti, e su mobile
supera i 4 s ("scarso") quasi ovunque. Il CLS è buono. L'INP da laboratorio non si misura; il TBT alto su home,
categorie e tool (360–690 ms) fa pensare a un INP da migliorare su quelle pagine. **Da confermare con i dati di campo**
(PSI domani o evento GA4 `web_vitals`).

## Ordine consigliato delle correzioni

1. **Server** (agente server): far servire le pagine dalla cache LiteSpeed. Obiettivo TTFB < 0,8 s: da solo porta
   l'LCP mobile di articoli, offerte, creator e food intorno a 1,5–2 s.
2. **JavaScript** (agente JS): `influencee-tools.js` solo dove serve e dopo il disegno; jQuery non bloccante o tolto;
   WonderPush e GTM dopo l'interazione o dopo il caricamento.
3. **Immagini**: togliere `loading="lazy"` all'immagine principale delle pagine città (e `fetchpriority="high"`),
   formati WebP/AVIF e misure giuste sulla categoria.
4. **Cache dei file statici** con scadenza lunga (i file hanno già `?ver=` nel nome, quindi è sicuro).

## Misura dei tempi reali degli utenti (GA4)

Dal Core (`assets/inft-vitals.js`, caricato da `includes/ga4.php` su tutte le pagine col tag GA4) parte l'evento
`web_vitals` con `metric_name` (LCP, INP, CLS, FCP, TTFB), `metric_value`, `metric_rating`, `page_type`, `page_path`.
Dettagli e report in `src/influencee/v2/ANALYTICS-PIANO.md`.

## Cosa misurare dopo le correzioni

- **Subito (laboratorio)**: rifare le stesse 10 misure (stesse pagine, stessi preset) e confrontarle con questa tabella.
  Obiettivo: TTFB < 0,8 s, LCP mobile < 2,5 s, TBT < 200 ms.
- **Dopo 2–3 giorni (GA4)**: quota di `good` per `metric_name` = LCP e INP per `page_type` (deve superare il 75%);
  TTFB `poor` deve sparire. È il segnale più rapido che il server serve davvero dalla cache.
- **Dopo 28 giorni (Search Console)**: report "Core Web Vitals" → "Convalida correzione" sul gruppo delle 247 pagine,
  appena GA4 conferma i valori buoni.
- **Dati di campo PSI/CrUX**: home e una categoria, a 7 e 28 giorni.
