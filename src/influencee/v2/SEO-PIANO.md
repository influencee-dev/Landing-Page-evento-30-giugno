# Sito influencee v2: piano SEO, GEO e AEO

Copia del sito costruita sulle funzioni reali dell'app (`influencee-dev/appinfluencee`, ottobre 2026). Il sito v1 (`src/influencee/site/`) resta intatto.

Anteprima: build `npx vite build --config vite.site-v2.config.ts` → `dist-site-v2/`.

Volumi: Ubersuggest, Italia, ottobre 2026. Semrush non disponibile (crediti API esauriti).

## 1. Obiettivi e misura

| Obiettivo | Pagine che lo servono | Conversione |
| --- | --- | --- |
| Traffico | `/influencer-italiani/` + regioni/città, categorie, `/ugc-creator/`, `/micro-influencer/`, `/benchmark-engagement-rate/`, blog | sessioni organiche, citazioni AI |
| Lead brand/agenzie | home, `/influencer-marketing-aziende/`, `/piattaforma-agenzie/`, `/prezzi/`, funzionalità | `app.influencee.it/iscriviti/brand/` (prova 3 giorni), form demo |
| Preventivi per progetti gestiti | home, aziende, agenzie, prezzi, contatti (sezione "Gestiamo noi") + pulsante fisso | WhatsApp +39 351 342 1629 (link wa.me con messaggio precompilato) |
| Iscrizioni creator | `/diventa-creator/`, `/ugc-creator/`, `/offerte-lavoro-influencer/`, CTA su categorie e città | `app.influencee.it/iscriviti/creator/` |

Ogni pagina ha una CTA principale coerente con l'intento, più una secondaria per l'altro pubblico. Su mobile la barra fissa cambia CTA in base alla pagina.

## 2. Mappa keyword → pagina

| URL | Keyword principale | Vol./mese | Secondarie (vol.) | Intento |
| --- | --- | --- | --- | --- |
| `/` | piattaforma influencer marketing | — | influencer marketing (720), brand influencer marketing (70) | navigazionale/commerciale |
| `/piattaforma-influencer/` ⭐ | piattaforma influencer | — | influencer marketing platform/tool (30+30), influee (1.600, già in posizione 15) | commerciale |
| `/influencer-marketing-aziende/` | influencer marketing aziende | — | influencer marketing (720), micro influencer marketing (50) | commerciale |
| `/piattaforma-agenzie/` | piattaforma influencer marketing agenzie | — | agenzie influencer marketing italia (40) | commerciale (agenzie che cercano uno strumento) |
| `/agenzia-influencer/` ⭐ | agenzia influencer marketing | 140 (picco 390, intento transazionale; Ubersuggest 10/2026) | agenzia influencer (la pagina ha già 11.000 impressioni, posizione media 20) | transazionale: aziende che cercano chi gestisca la campagna (pagina ex Elementor rifatta il 25/10/2026) |
| `/preventivo-campagne/` | preventivo influencer marketing | 0 | quanto costa una campagna con influencer (0) | transazionale: calcolo del costo del servizio gestito, collegata ad `/agenzia-influencer/` |
| `/micro-influencer/` | micro influencer | 480 | micro influencer italiani (90), micro influencer quanti follower (90), micro influencer milano (90) | informativo/commerciale |
| `/ugc-creator/` | ugc creator | 4.400 | ugc creator italia (320), ugc creator cos'è (170), come diventare ugc creator (170), brand che cercano ugc creator (70) | informativo → iscrizione |
| `/diventa-creator/` | collaborazioni con brand | 50 | come diventare influencer (390), diventare influencer (50) | transazionale (iscrizione) |
| `/offerte-lavoro-influencer/` ⭐ | offerte lavoro influencer | GSC: 188 clic, 8.299 impressioni | ugc creator lavoro (90), ugc creator offerte di lavoro (30), annunci collaborazioni influencer | transazionale (creator) |
| `/pubblica-offerta-lavoro/` ⭐ | pubblicare offerta influencer | GSC: 1 clic, 255 impressioni | cercare influencer per azienda | transazionale (brand) |
| `/social-media-tool/` ⭐ | tool influencer marketing gratis | n/d* | social media tool gratis | hub dei tool |
| `/followe-instagram-fake-follower/` ⭐ | fake follower instagram | GSC: 3.426 clic, 73.363 impressioni, pos. 11,6 | come scoprire fake follower, follower falsi instagram | informativo → strumento |
| `/influencer-italiani/` ⭐ | influencer italiani | 390 | tutti influencer (260), top 100 influencer italia (260), creator italiani (140) | informativo |
| `/<categoria>-influencers/` ⭐ (18) | es. food/fitness influencer italiani | 140–210 cad. | foodie influencers (210, pos. 1), fitness influencers (260) | informativo |
| `/influencer-italiani/influencer-<regione>/[influencer-<città>/]` ⭐ | influencer napoli, milano, torino… | 110–1.600 | influencer napoletani (1.600, pos. 7), influencer veneti (170) | locale |
| `/funzionalita/database-influencer/` | database influencer italiani | — | come trovare influencer (20), trovare influencer (10) | commerciale |
| `/funzionalita/gestione-campagne/` | gestione campagne influencer | — | influencer marketing contratto (10) | commerciale |
| `/funzionalita/link-tracciati/` | link tracciati influencer | — | — | commerciale |
| `/funzionalita/media-kit/` | media kit influencer | 90 | media kit influencer esempio (20) | informativo → iscrizione |
| `/benchmark-engagement-rate/` | engagement rate instagram | 390 | engagement rate micro influencer | informativo (lead magnet) |
| `/come-calcolare-engagement-rate/` ⭐ | calcolo engagement rate | 210 | calcolo engagement rate instagram (110) | informativo (strumento interattivo) |
| `/social-media-tool/costo-influencer/` ⭐ | quanto costa un influencer | GSC: 960 clic, 52.491 impressioni, pos. 5,9 | quanto costa un micro influencer, tariffe influencer (n/d*) | informativo/commerciale |
| `/contenuti-ugc/` | contenuti ugc | 170 | contenuti ugc cosa sono (70) | informativo → brand |
| `/influencer-marketing-locale/` | influencer per ristoranti | n/d* | micro influencer milano (90), influencer marketing locale | commerciale locale |
| `/creator-professionisti/` | medici influencer italiani | 20 | nutrizionisti, personal trainer | nicchia B2B |
| `/creator-verificati/` | influencer verificati | n/d* | come riconoscere follower falsi | informativo/fiducia (E-E-A-T) |
| `/funzionalita/contratto-influencer/` | contratto influencer | n/d* | influencer marketing contratto (10) | commerciale |
| `/funzionalita/calendario-campagne/` | calendario campagne influencer | n/d* | — | commerciale |
| `/prezzi/` | prezzi piattaforma influencer | — | quanto costa un influencer | transazionale |

⭐ = URL già indicizzato sul sito attuale: lo slug resta identico.

\* n/d = Ubersuggest non restituisce volumi per la keyword: pagina creata per coprire il modulo del tool e intenti a coda lunga. Da verificare con Search Console dopo il lancio (impressioni reali).

**Fonti dei numeri nelle pagine**: costi per fascia ed engagement di riferimento arrivano dal benchmark di mercato dell'app (`rinnovo/benchmark_mercato.py`) con la loro origine (IT · DeRev/ONIM, proxy, stima), mostrata accanto a ogni valore. Il check sponsor usa le soglie dell'app (1,5% / 1,9% / 2,7%).

## 3. Migrazione: URL da mantenere e redirect 301

Pagine che oggi portano traffico, da Ubersuggest `domain_keywords`:

| URL attuale | Azione |
| --- | --- |
| `/influencer-italiani/` e tutte le sottopagine `influencer-<regione>/influencer-<città>/` | **stesso URL**, nuovo template |
| `/food-influencers/`, `/fitness-influencers/`, `/travel-influencers/` | **stesso URL**, pagina categoria |
| `/sport-influencers/` | sotto-categoria di Fitness, stesso URL (decisione 22/10/2026, vedi `wp-plugin/PAGINE-VECCHIE.md`) |
| `/piattaforma-influencer/` | **stesso URL**, panoramica piattaforma |
| `/influencer-italiane/` | stesso URL, articolo blog; link a `/influencer-italiani/` |
| `/i-migliori-beauty-influencer-su-instagram/`, `/i-10-food-influencer-piu-popolari-su-tiktok/`, `/i-10-fashion-influencer-piu-seguiti-su-instagram/` | stesso URL, articoli blog; link alla pagina categoria |
| `/come-calcolare-engagement-rate/` | **stesso URL**, diventa la pagina del calcolatore gratuito (stesso intento, contenuto più forte) |
| `/migliori-app-gestione-follower/`, `/instagram-follower-gratis-perche-evitarli-e-come-crescere-davvero/` | stesso URL, blog |
| `/social-media-tool/emoticon-da-copiare/` | **stesso URL**: è la pagina con più traffico (2.900 + 4.400 ricerche) |
| `/followe-instagram-fake-follower/` | **stesso URL, anche con il refuso "followe"**: 3.426 clic in Search Console, la pagina che porta più visite. Da articolo diventa tool (fake follower checker) + guida |
| `/social-media-tool/costo-influencer/` | **stesso URL**: diventa il calcolatore del costo (960 clic) |
| `/come-calcolare-il-costo-degli-influencer/`, `/come-calcolare-costo-influencer/` (e `/5/`), `/come-calcolare-il-costo-di-una-campagna-social-completa-guida-definitiva/` | 301 → `/social-media-tool/costo-influencer/` (stesso intento, 73 clic in totale) |
| `/come-riconoscere-e-rimuovere-fake-follower/` | 301 → `/followe-instagram-fake-follower/` |
| `/offerte-lavoro-influencer/` | **stesso URL**: bacheca offerte restaurata, collegata agli annunci dell'app |
| `/offerta-lavoro/<slug>/` (68 pagine, 304 clic) | 301 → `/offerte-lavoro-influencer/`. Le offerte sono scadute (quasi tutte del 2022): Google chiede di togliere le offerte chiuse, non di tenerle con `JobPosting` |
| `/pubblica-offerta-lavoro/` | **stesso URL**: form in 3 passi che porta all'account aziendale |
| `/annunci-collaborazioni/` (pagina nuova della v2, mai indicizzata) | 301 → `/offerte-lavoro-influencer/`, per non avere due pagine sulla stessa ricerca |
| `/social-media-tool/` | **stesso URL**: hub dei tool gratuiti |
| `/social-media-tool-form/`, `/tool-influencer/` (10.714 impressioni, 4 clic), `/tool-finanziario/` (404) | 301 → `/social-media-tool/` |
| `/tiktok-keyword-tool/` (27 clic), `/social-media-tool/anteprima-dei-tuoi-post-sui-social/` (11), `/preventivi-influencer/` (6), `/preventivo-campagne/`, `/social-media-tool/generatore-prompt-per-social-media-manager/`, `/social-media-tool/calcola-preventivo-gestione-social/`, `/social-media-tool/piano-editoriale-online/`, `/social-media-tool/calendario-editoriale/`, `/social-media-tool/social-campaign-planner/`, `/social-media-tool/social-media-strategy-tool/`, `/social-media-tool/report-social-organico/`, `/social-media-tool/comprimi-immagini-online/`, `/hashtag-piu-cercati-su-instagram/` | **fase 2 del restauro** (vedi `RESTAURO-TOOL.md`). Finché il tool non è rifatto: stesso URL sul vecchio sito, oppure 301 → `/social-media-tool/`. Mai 404 |

Prima del passaggio servono due cose:
- l'export completo degli URL attuali (sitemap + Search Console) per mappare ogni pagina con traffico o backlink;
- nessuna pagina deve sparire senza 301.

## 4. Regole GEO e AEO (motori di risposta e AI)

1. **Risposta in apertura.** Subito sotto l'hero c'è il box "In breve" con la domanda principale e una risposta autonoma di 40–70 parole, che si può citare anche fuori contesto.
2. **H2 in forma di domanda** sulle pagine informative ("Chi sono i micro influencer?", "Quanto guadagna un UGC creator").
3. **FAQ visibili uguali al JSON-LD** `FAQPage`. Il testo coincide parola per parola: lo genera la stessa fonte (`meta.faq`).
4. **Dati strutturati** in ogni pagina:
   - `Organization` (Partidea SRL), `WebSite`, `WebPage`, `BreadcrumbList`;
   - `SoftwareApplication` con le `Offer` dei piani su home, piattaforma, funzionalità e prezzi.
5. **Entità coerenti.** Nome "Influencee", ragione sociale Partidea SRL, "piattaforma italiana di influencer marketing", "solo creator italiani": sempre con le stesse parole.
6. **Fatti verificabili e definizioni precise.** Esempi: fasce nano–mega con i numeri, metodo di calcolo dell'ER, prezzi esatti. Niente superlativi né numeri inventati.
7. **`llms.txt`** nella root (bozza in `llms.txt` in questa cartella), con le pagine chiave e una descrizione fattuale.
8. **Link interni.** Ogni pagina ha:
   - breadcrumb;
   - "Continua a esplorare";
   - un footer con tutta la struttura (categorie e città).

## 5. Cosa il sito NON promette (vincoli dall'app)

- Niente AI, matching AI o "punteggio di affinità": la ricerca è deterministica.
- Solo creator italiani.
- Niente "dati in tempo reale": il sito dice sempre che ogni dato ha fonte e data di aggiornamento.
- Niente numeri sul database: oggi 2.653 creator cercabili, 0 verificati e l'engagement non ancora calcolato. Il sito non cita quantità.
- Niente escrow o pagamenti Stripe, Shopify/WooCommerce, annunci Meta, pubblicazione sui social: sono spenti o senza chiavi.
- Prezzi: oggi 19 €/mese, 49 €/trimestre, 199 €/anno IVA inclusa, prova di 3 giorni. **Se si accendono i piani 2026** (Base 35 €, Business 57 €, Illimitato 99 € + IVA, early bird 27 €) vanno aggiornati `PLANS` in `data.ts` e la pagina `/prezzi/`.

## 6. Checklist tecnica per la messa online

- [ ] **Pagine statiche (SSG/prerender)** per ogni percorso di `allPaths()`, con URL reali e senza hash. Il router a hash serve solo all'anteprima. Title, description, canonical e JSON-LD vanno nell'HTML statico. Un'opzione è Vite SSG o Astro con le stesse row React.
- [ ] `sitemap.xml` generata da `allPaths()`, più gli articoli del blog migrati.
- [ ] `robots.txt`: consentire GPTBot, PerplexityBot, Google-Extended, ClaudeBot, se si vuole visibilità sulle AI.
- [ ] 301 della tabella §3 sul server.
- [ ] Immagini WebP con `alt` descrittivo, LCP sotto 2,5 s, font precaricati.
- [ ] Il form demo deve inviare davvero, ad esempio a Brevo, già usato dall'app.
- [ ] Search Console: invio della sitemap e controllo delle pagine 404 dopo la migrazione.

## 7. Rischi e prossimi passi

- **Pagine programmatiche** (18 categorie × 20 regioni × città): testi in parte simili. Per evitare contenuti sottili:
  - attivare prima le pagine con domanda reale (Napoli, Milano, Torino, Bologna, Palermo, Veneto);
  - aggiungere a ciascuna un paragrafo locale scritto a mano;
  - quando l'app avrà almeno 6 creator verificati per città, incorporare la lista da `app.influencee.it/creator/<categoria>/<città>/`.
- Le liste SEO pubbliche dell'app oggi rispondono 404, perché i creator verificati sono 0. Per questo le CTA puntano all'iscrizione e non alle liste.
- Blog: migrare gli articoli esistenti mantenendo gli URL, poi pubblicare guide sulle keyword informative ("come diventare influencer" 390, "ugc creator cos'è" 170, "micro influencer quanti follower" 90).
- Immagini: profili e volti dei creator generati con il brief Drive `00_PROMPT UNICO`. Serve il consenso dei clienti per le reel Socialee.
