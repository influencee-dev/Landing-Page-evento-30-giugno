# Restauro dei tool lead magnet e della bacheca offerte

- **Design:** Figma "Influencee – Tool lead magnet e bacheca offerte (restauro)", https://www.figma.com/design/va5iYdE0tP7ehCCIOGUf7b
- **Codice:** `tools.tsx` (componenti) e `pages.tsx` (pagine e metadati)
- **Dati:** Search Console del vecchio sito (`search-console-pagine.csv`, clic e impressioni del periodo esportato)

## In breve

Sul vecchio sito c'erano 20 pagine "tool". Le visite si concentrano su tre: fake follower (3.426 clic), costo influencer (960) e calcolo engagement (373). La bacheca offerte ne porta 492, tra pagina principale e 68 schede offerta.

Le prime cinque pagine sono restaurate con lo **stesso URL**, più l'hub dei tool. Le altre sono in fase 2, in ordine di traffico.

## Inventario completo

| Vecchio URL | Clic GSC | Cos'era | Stato v2 |
| --- | --- | --- | --- |
| `/followe-instagram-fake-follower/` | 3.426 | Articolo con statistiche senza fonte e un "Audience Quality Score" che l'app non ha | ✅ **Tool vero**: 5 segnali calcolati con soglie dichiarate, più la guida |
| `/social-media-tool/costo-influencer/` | 960 | Articolo con forbici di prezzo senza fonte | ✅ **Calcolatore**: formula di prezzo dell'app (€/follower) e media di mercato per fascia (DeRev), con la fonte |
| `/come-calcolare-engagement-rate/` | 373 | Articolo | ✅ Già restaurato: calcolatore ER e check sponsor |
| `/offerte-lavoro-influencer/` | 188 | Bacheca WP Job Manager, con 60 offerte quasi tutte del 2022 | ✅ **Bacheca** con ricerca e filtri per compenso; le offerte arrivano dall'app |
| `/offerta-lavoro/<slug>/` (68) | 304 | Schede offerta, scadute | ↪ 301 alla bacheca |
| `/pubblica-offerta-lavoro/` | 1 | Form WP Job Manager | ✅ **Form in 3 passi** con anteprima, poi account aziendale |
| `/social-media-tool/` | — | Hub | ✅ **Hub** con filtro per pubblico |
| `/social-media-tool/emoticon-da-copiare/` | 48 | Elenco emoticon | ✅ **Tool**: copia con un clic e "Il tuo testo" da copiare tutto insieme |
| `/come-calcolare-il-costo-degli-influencer/` e varianti | 73 | Articoli doppi | ↪ 301 al calcolatore del costo |
| `/tiktok-keyword-tool/` | 27 | Tool keyword TikTok | ⏳ Fase 2 |
| `/social-media-tool/anteprima-dei-tuoi-post-sui-social/` | 11 | Anteprima post | ⏳ Fase 2 |
| `/preventivi-influencer/`, `/preventivo-campagne/` | 6 | Calcolo preventivo campagna | ⏳ Fase 2: unire al calcolatore del costo (pacchetto con più creator) |
| `/tool-influencer/` | 4 (10.714 impressioni) | Pagina prodotto | ↪ 301 all'hub; title da rivedere sulla query |
| `/social-media-tool/generatore-prompt-per-social-media-manager/` | 3 | Generatore di prompt | ⏳ Fase 2, bassa priorità |
| `/social-media-tool/calcola-preventivo-gestione-social/` | 3 | Preventivo per social media manager | ⏳ Fase 2 |
| `/social-media-tool/piano-editoriale-online/`, `/calendario-editoriale/`, `/social-campaign-planner/`, `/social-media-strategy-tool/`, `/report-social-organico/`, `/comprimi-immagini-online/` | 0–2 | Template e utility | ⏳ Fase 2: accorpare in 2–3 tool (piano editoriale, preventivo social) |
| `/hashtag-piu-cercati-su-instagram/` | n/d | Elenco hashtag | ⏳ Fase 2 |
| `/tool-finanziario/` | 0 | 404 | ↪ 301 all'hub |

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

1. Preventivo campagna con più creator, dentro il calcolatore del costo.
2. TikTok keyword tool.
3. Anteprima post.
4. Preventivo gestione social e piano editoriale, che accorpa i 6 template.

Ogni tool passa prima da Figma (stessa pagina del file), poi va nel codice con lo stesso URL, gli eventi GA4 e le FAQ.
