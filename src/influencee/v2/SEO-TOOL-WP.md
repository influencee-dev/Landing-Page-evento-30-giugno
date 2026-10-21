# SEO, GEO e AEO delle 8 pagine tool da portare su WordPress

Analisi del 21/10/2026 per le pagine tool che passano sul WordPress live di influencee.it con lo **stesso URL**.

**Domanda di business:** come portiamo le 8 pagine tool su WordPress senza perdere le query che già portano visite (fake follower, costo influencer, engagement rate), e quale pagina deve tenere ogni query per non fare concorrenza a se stesse?

## 0. Fonti e limiti (leggere prima)

| Fonte | Cosa dà | Stato in questa analisi |
| --- | --- | --- |
| **Ubersuggest MCP** (Italia `locId` 2380, `it`) | volume, difficoltà SEO (SD), intento, keyword del dominio | ⚠ **Non disponibile in questa sessione**: gli strumenti `mcp__Ubersuggest__*` non erano tra quelli dell'agente. Non sono stati chiamati, quindi non c'è un messaggio d'errore dello strumento. Al loro posto ho usato i **risultati Ubersuggest reali dell'ottobre 2026** già ottenuti nella sessione principale: `domain_keywords` di influencee.it (80 righe), `keyword_suggestions`, `keyword_overview`. Le keyword nuove hanno volume **n/d** |
| Semrush | — | crediti API esauriti (vedi `references/influencee.md`) |
| **Search Console** (`search-console-pagine.csv`) | clic, impressioni, CTR, posizione per URL | ✅ usato: è il dato più affidabile sulle pagine con traffico |
| **Google Autocomplete** (`suggestqueries.google.com`, `hl=it`, `gl=it`) | domande reali, cioè la stessa fonte di `google_suggestions` | ✅ usato per H2 e FAQ. Non dà volumi |
| WebSearch (al posto di `serp_analysis`) | chi è in prima pagina e con che formato | ✅ usato per 6 query |
| Pagine live di WordPress (curl: title, description, H1, H2) e i 284 URL da REST API | cannibalizzazioni, H2 da tenere | ✅ usato |
| `data.ts` (MARKET, GESTITO, FACTS, FAQ) e `tools.tsx` (FF_RULES, formule) | gli unici numeri usati nei testi | ✅ |

**Legenda delle colonne:** *volume* = ricerche al mese in Italia (Ubersuggest, ottobre 2026); *diff.* = difficoltà SEO di Ubersuggest (0–100); *n/d* = Ubersuggest senza dato o non interrogabile oggi. In quel caso la prova della domanda è Search Console o Autocomplete. *Uso*: **P** = principale (title + H1), **S** = secondaria (H2, testo, description), **F** = domanda FAQ, **L** = query di un'altra pagina, che qui serve solo da link.

**Da rifare quando torna Ubersuggest:** `keyword_overview` e `serp_analysis` sulle keyword n/d della §10 e `page_keywords` sulle 8 URL. Lo script è nella §10.

---

## 0-bis. Verifica Ubersuggest dal vivo (21/10/2026, Italia, `page_keywords` e `keyword_overview`)

| pagina | query per cui si posiziona oggi | volume | posizione | uso nella v2 |
| --- | --- | --- | --- | --- |
| fake follower | come scoprire chi compra like instagram | 210 | 9 | FAQ dedicata |
| fake follower | instagram fake follower check / fake follower check instagram / check fake followers instagram | 170 ciascuna | 12–20 | "check" nel title |
| fake follower | app per scoprire profili falsi instagram | 260 | 28 | testo del tool |
| fake follower | controllo follower instagram | 210 | 42 | H1 "controlla i follower falsi" |
| fake follower | fake follower instagram | 110 (diff. 24) | — | keyword principale |
| costo influencer | 10 mila follower instagram | 390 | 34 | FAQ "Quanto guadagna un influencer con 10 mila follower?" |
| costo influencer | tabella guadagni instagram | 260 | 73 | stessa FAQ + grafico per fascia |
| costo influencer | quanto costa un influencer | 10 (Ubersuggest; GSC ha 52.491 impressioni sulla pagina) | — | keyword principale: la coda lunga vale più del volume dichiarato |
| engagement rate | engagement rate instagram | 390 | 8 | title |
| engagement rate | engagement instagram | 390 | 17 | testo |
| engagement rate | calcolo engagement rate | 210 | 17 | H1 / description |
| agenzia influencer | agenzia influencer marketing | 140 | 48 (`/agenzia-influencer/`) | resta ad `/agenzia-influencer/`; il preventivo prende "preventivo campagna" |
| emoticon | emoji da copiare | 4.400 | 5 | title e H1 con "emoji" |
| emoticon | emoticon da copiare | 2.900 | 4 | keyword storica, resta |
| emoticon | emoticon copia incolla / emoji whatsapp da copiare | 390 / 260 | 4 / 7 | FAQ WhatsApp, categorie più ricche (13 categorie, 294 emoji) |
| offerte lavoro | offerte lavoro influencer / lavoro influencer | 10 / 10 | nessun dato di posizione | la pagina vive dei link interni e delle schede offerta |
| hub | tool influencer marketing | 20 (CPC 21,7 €) | — | title |
| preventivo | costo campagna influencer marketing / preventivo influencer marketing | 0 / 0 | — | pagina di conversione, non di traffico |

## 1. Chi tiene quale query (cannibalizzazione)

| Query / intento | Pagina che la tiene | Pagine che NON devono puntarla | Prova | Azione |
| --- | --- | --- | --- | --- |
| agenzia influencer marketing (140), agenzia influencer, agenzia influencer marketing milano (70) | **`/agenzia-influencer/`** (WP live) | `/preventivo-campagne/` | GSC: `/agenzia-influencer/` ha 11.000 impressioni (pos. 20,5); `/preventivo-campagne/` 13 impressioni | `/preventivo-campagne/` **cambia keyword principale** (vedi §5). Link a doppio senso tra le due |
| preventivo / costo di una **campagna** con influencer, servizio gestito | **`/preventivo-campagne/`** | `/social-media-tool/costo-influencer/` | intento diverso: prezzo totale del progetto, non del singolo creator | togliere da costo-influencer l'H2 "Costo medio di una campagna in Italia" (WP live) e metterci un link al preventivo |
| quanto costa un influencer, costo post influencer, tariffe influencer, costo influencer instagram/tiktok | **`/social-media-tool/costo-influencer/`** | `/preventivo-campagne/`, `/come-calcolare-il-costo-degli-influencer/` | GSC: 960 clic (pos. 5,9) + 918 dal vecchio `/costo-influencer/` | **tenere il 301** `/costo-influencer/` → `/social-media-tool/costo-influencer/` (oggi attivo, ma non è nella tabella di `SEO-PIANO.md` §3) |
| come calcolare il costo di una campagna **social** (SMM) | `/come-calcolare-il-costo-di-una-campagna-social-guida-2026/` (articolo WP) | — | 46 impressioni (pos. 5,5) | resta articolo; link a `/preventivo-campagne/` e al futuro preventivatore SMM |
| calcolo / come calcolare engagement rate, **engagement rate instagram** (390, pos. 8 oggi su questa URL) | **`/come-calcolare-engagement-rate/`** | `/benchmark-engagement-rate/` (v2), `/benchmark-influencer-2026-i-nuovi-standard-del-mercato/` | Ubersuggest `domain_keywords`: "engagement rate instagram" è in posizione 8 con questa URL | ⚠ `SEO-PIANO.md` assegna "engagement rate instagram" a `/benchmark-engagement-rate/`: **va spostata qui**, e il benchmark prende "engagement rate medio / benchmark engagement rate" |
| benchmark influencer 2026 | `/benchmark-influencer-2026-…/` (articolo WP) | — | 138 impressioni, pos. 4,95 | link al calcolatore ER. ⚠ Ha un H2 "L'impatto dell'AI sull'analisi dei dati": contrasta con "niente AI" |
| fake follower, come scovare / riconoscere follower falsi | **`/followe-instagram-fake-follower/`** | `/creator-verificati/` (v2) | GSC: 3.426 clic | 301 di `/come-riconoscere-e-rimuovere-fake-follower/` (già in piano). `/creator-verificati/` resta su "influencer verificati" |
| follower gratis, bot, app follower | `/instagram-follower-gratis-…/`, `/migliori-app-gestione-follower/` (articoli) | fake follower checker | Ubersuggest `domain_keywords` | solo link interni dal checker ("Perché evitare i follower gratis") |
| offerte lavoro influencer, lavoro ugc creator, cercasi influencer | **`/offerte-lavoro-influencer/`** | `/pubblica-offerta-lavoro/` | GSC: 188 clic + 304 dalle schede | ⚠ oggi su WP **`/pubblica-offerta-lavoro/` ha lo stesso H1 della bacheca** ("offerte di lavoro per influencer") e un secondo H1 "Inserisci/Modifica link": va corretto |
| pubblicare un annuncio per influencer (lato azienda) | **`/pubblica-offerta-lavoro/`** | bacheca | 255 impressioni | H1 e title solo lato azienda |
| come trovare influencer, trovare influencer (10), database influencer | `/funzionalita/database-influencer/` (v2) o `/piattaforma-influencer-marketing/` (WP) | pubblica-offerta-lavoro (solo link) | `SEO-PIANO.md` §2 | — |
| tool influencer, tool influencer marketing (30), social media tool gratis | **`/social-media-tool/`** | — | GSC: `/tool-influencer/` ha 10.714 impressioni (pos. 8,7) e 4 clic, con 301 verso l'hub in piano | l'hub eredita le query di `/tool-influencer/`: il title deve contenere "tool influencer" |
| emoji / emoticon da copiare | **`/social-media-tool/emoticon-da-copiare/`** | — | Ubersuggest: pos. 4–5 su 2.900 + 4.400 | 301 del vecchio `/emoticon-da-copiare/` (1 clic, 287 impressioni) → URL del tool |

**Altri doppioni trovati sul WP live (fuori dalle 8 pagine, da decidere):**
- `/piattaforma-influencer-marketing/` (8.942 impressioni, pos. 27,5) e `/piattaforma-influencer/` (6.716, pos. 26,5) si contendono la stessa ricerca. Conviene tenerne una sola (`/piattaforma-influencer/`, che è nel piano v2) e fare 301 dall'altra.
- `/agenzie/` (16.863 impressioni, pos. 26,9) è la pagina per le agenzie che usano la piattaforma. Non deve puntare "agenzia influencer marketing".
- `/cost/` ha title "cost" e H1 "Non facciamo marketing. Costruiamo community che comprano.": slug che non c'entra con il contenuto. Proposta: `noindex`, oppure 301 alla pagina servizi giusta.
- `/contratto-social-media-influencer-ugc/` è un **tool** (generatore di preventivo e contratto SMM, 17 clic, 630 impressioni, pos. 18) e manca nell'inventario di `RESTAURO-TOOL.md`. Va linkato dall'hub e non va perso.
- `/agenzia-influencer/` dice "Collaboriamo con più di 4.000 Brand", `FACTS.clients` dice "+5.000" (dato non verificato): serve un numero unico.

---

## 2. `/followe-instagram-fake-follower/`, fake follower checker

**Situazione.** GSC: 3.426 clic, 73.363 impressioni, CTR 4,67%, posizione 11,64. Le ancore dell'indice (`#elementor-toc__heading-anchor-0…6`) prendono da 2.775 a 9.826 impressioni ciascuna, in posizione 5,6–6,1. Vuol dire che Google mostra le sezioni H2 della guida come risposta. **Il contenuto guida va tenuto**, non basta il tool.

Title live: "Come Scovare Fake Follower su Instagram nel 2026: Guida Completa". La description live è sbagliata ("Lavorare con gli influencer di marca è un modo eccellente…"). Gli H2 live sono "Perché i fake follower esistono ancora", "Come identificare i fake follower: 4 segnali certi", "I migliori tool…", "Checklist pre-collaborazione", FAQ.

**SERP** (WebSearch "fake follower instagram check"): vincono i **tool gratuiti senza registrazione** (Heepsy, Modash, FakeCheck) e le **liste "migliori tool"** (Influencer Hero, Netinfluencer). Il formato giusto è tool in alto più guida sotto, cioè quello che fa la v2.

| pagina | keyword | volume | difficoltà | intento | uso |
| --- | --- | --- | --- | --- | --- |
| fake follower | fake follower instagram | n/d (GSC: la pagina ha 73.363 impressioni) | n/d | informativo → strumento | P |
| fake follower | fake follower check / fake follower checker | n/d (Autocomplete) | n/d | strumento | S (title, H2) |
| fake follower | fake follower instagram check | n/d (Autocomplete) | n/d | strumento | S |
| fake follower | follower falsi instagram | n/d (Autocomplete) | n/d | informativo | S (H1, testo) |
| fake follower | controllo follower falsi instagram | n/d (Autocomplete) | n/d | strumento | S (description) |
| fake follower | come scovare fake follower (title live) | n/d (GSC) | n/d | informativo | S (H2: da tenere) |
| fake follower | come vedere se i follower sono veri | n/d (Autocomplete) | n/d | informativo | F |
| fake follower | cosa succede se compri follower (su instagram / tiktok) | n/d (Autocomplete) | n/d | informativo | F |
| fake follower | come eliminare follower falsi instagram | n/d (Autocomplete) | n/d | informativo | L → articolo; nel testo una riga |
| fake follower | influencer marketing hub fake followers | 10 | 5 | navigazionale | — (non serve) |

**Proposta da copiare**

- **title** (60): `Fake follower Instagram: check gratuito e guida | Influencee`
- **description** (151): `Controlla gratis i follower falsi di un profilo Instagram o TikTok: 5 segnali con soglie dichiarate, senza login. Più la guida per riconoscerli a mano.`
- **H1**: `Fake follower Instagram: controlla i follower falsi di un profilo`
- **In breve** (domanda: "Come capire se un influencer ha follower falsi?", 64 parole):
  > Confronta tre numeri con la media della sua fascia di follower: engagement rate, crescita degli ultimi 30 giorni e visualizzazioni dei reel. È un segnale di rischio un engagement sotto il 50% della media, una crescita oltre il 20% in un mese senza un contenuto virale o visualizzazioni sotto il 5% dei follower. Un solo segnale non basta: conta quando ne compaiono più insieme.
- **H2 a domanda** (tenere l'ordine della guida live, così le ancore restano simili):
  1. Come scovare i fake follower su Instagram? *(i 5 segnali, cioè l'attuale `FakeSignalsGrid`)*
  2. Come vedere se i follower di un profilo sono veri? *(i controlli a mano)*
  3. Perché un influencer ha follower falsi? *(follower comprati vs reach a pagamento)*
  4. Cosa succede se compri follower?
  5. Come evitare i fake follower nelle campagne? *(creator verificati → `/creator-verificati/`)*
  6. Domande frequenti
- **FAQ** (le 5 attuali di `FF_FAQ` vanno bene; aggiungere queste 2, scritte solo con fatti del codice):
  - **Come vedere se i follower di un profilo sono veri?** Apri un campione di follower: profili senza foto né post, commenti generici o in lingue diverse da quella del creator e picchi di follower in giorni senza contenuti sono i segnali tipici. Poi inserisci i numeri del profilo nel checker per confrontarli con la media della sua fascia.
  - **Cosa succede se compri follower?** Il numero di follower sale ma le interazioni no: l'engagement rate scende sotto la media della fascia e le visualizzazioni dei reel restano basse rispetto ai follower. Sono proprio i segnali che un brand controlla prima di pagare una collaborazione.
- **Link interni da aggiungere**: `/instagram-follower-gratis-perche-evitarli-e-come-crescere-davvero/` ("perché evitare i follower gratis"), `/come-calcolare-engagement-rate/`, `/creator-verificati/`.

**GEO, frasi citabili** (in pagina e in `llms.txt`):
- "Il fake follower checker di Influencee confronta 5 segnali con la media della fascia di follower: engagement rate, crescita a 30 giorni, check sponsor, visualizzazioni dei reel su follower, commenti su like."
- "Soglie di rischio indicative: engagement sotto il 50% della media di fascia; crescita oltre il 20% in 30 giorni; interazioni ÷ visualizzazioni sotto l'1,5%; visualizzazioni dei reel sotto il 5% dei follower; commenti sotto l'1% dei like."
- "Il tool non legge i dati da Instagram: l'utente inserisce i numeri pubblici e il calcolo avviene nel browser."
- Entità: *Influencee*, *fake follower checker*, *badge Verificato*, *fasce Nano/Micro/Mid/Macro/Mega*.

---

## 3. `/social-media-tool/costo-influencer/`, calcolatore del costo

**Situazione.** GSC: 960 clic, 52.491 impressioni, **CTR 1,83% in posizione 5,9**, basso per quella posizione: il primo lavoro è su title e description. Il vecchio `/costo-influencer/` (918 clic, 46.938 impressioni, pos. 12,1) oggi va in 301 su questa pagina: **il 301 va tenuto**. Gli altri doppioni (`/come-calcolare-il-costo-degli-influencer/` 52 clic, `/come-calcolare-costo-influencer/` 13 + 3) sono già in piano per il 301.

Live: due title ("Costo post influencer", "Calcolatore Costo Influencer") e due H1 ("Calcolatore Costo Influencer", "Costo Influencer: Quanto Costa e Come Calcolarlo").

**SERP** ("quanto costa un influencer"): **guide con tabelle per fascia** (Metricool, Shopify, Influencer Hero, Kolsquare), quasi tutte in dollari e con fonti estere. Il nostro vantaggio è che diamo valori in euro con fonte italiana (DeRev) più il calcolatore.

| pagina | keyword | volume | difficoltà | intento | uso |
| --- | --- | --- | --- | --- | --- |
| costo influencer | quanto costa un influencer | n/d (Ubersuggest senza dato; GSC 52.491 impressioni) | n/d | informativo/commerciale | P |
| costo influencer | costo influencer (+ costo influencer instagram / tiktok) | n/d (Autocomplete) | n/d | commerciale | S (title) |
| costo influencer | quanto costa un post di un influencer / costo post influencer | n/d (Autocomplete) | n/d | commerciale | S (H2) |
| costo influencer | calcolo costo influencer | n/d (Autocomplete) | n/d | strumento | S (H1) |
| costo influencer | tariffe influencer (instagram) | n/d (Ubersuggest senza dato) | n/d | commerciale | S (testo) |
| costo influencer | quanto costa ingaggiare / farsi sponsorizzare da un influencer | n/d (Autocomplete) | n/d | commerciale | F |
| costo influencer | quanto costa invitare un influencer a un evento | n/d (Autocomplete) | n/d | commerciale locale | F |
| costo influencer | micro influencer cost / cost per post | 10 / 10 | 13 / 5 | commerciale | F (micro) |
| costo influencer | quanto guadagna un influencer (con X follower) | n/d (Autocomplete, molte varianti) | n/d | informativo (creator) | S (H2 lato creator) |
| costo influencer | costi influencer marketing / costo campagna | n/d | n/d | campagna | **L → `/preventivo-campagne/`** |

**Proposta da copiare**

- **title** (57): `Quanto costa un influencer? Prezzi e calcolo | Influencee`
- **description** (149): `Quanto costa un post di un influencer in Italia: nano circa 200 €, micro 950 €, mid 3.550 € (DeRev). Calcola la stima per Instagram e TikTok, gratis.`
- **H1**: `Quanto costa un influencer? Calcola il costo per post`
- **In breve** (domanda "Quanto costa un influencer?", 47 parole; è la `COST_FAQ[0]`, va bene così):
  > In media un post su Instagram costa circa 200 € per un nano influencer, 950 € per un micro, 3.550 € per un mid e 23.750 € per un profilo oltre il milione di follower (fonte DeRev). Il prezzo finale dipende da formato, diritti d'uso ed esclusiva.
- **H2 a domanda**:
  1. Quanto costa un post di un influencer su Instagram? *(grafico per fascia `CostChart`)*
  2. Quanto costa un influencer su TikTok? *(valori `costTT`: 180 / 850 / 3.200 / 7.200 stima / 21.000 €, origine "proxy")*
  3. Da cosa dipende il prezzo di un influencer? *(oggi "Da cosa dipende il prezzo…": aggiungere il punto di domanda)*
  4. Quanto chiedere per un post se sei un creator? *(intercetta "quanto guadagna un influencer": usare il calcolatore con i propri follower)*
  5. Come risparmiare senza perdere risultati?
  6. Quali formule di compenso si possono usare?
  7. Quanto costa una campagna completa? *(2 righe + link a `/preventivo-campagne/`; sostituisce l'H2 live "Costo medio di una campagna in Italia")*
- **FAQ** (le 4 attuali + 1):
  - **Quanto costa un influencer su TikTok?** Come valori medi indicativi, circa 180 € a contenuto per un nano influencer, 850 € per un micro, 3.200 € per un mid e 21.000 € oltre il milione di follower. Sono stime ricavate dai valori di Instagram: il calcolatore mostra l'origine di ogni numero.

  ⚠ Prima di pubblicare la FAQ va confermato che "proxy" in `MARKET.costTT` vuol dire "ricavato dai valori Instagram". Se non è così, scrivere "valori indicativi (proxy)".
- **Link interni**: `/preventivo-campagne/` (ancora: "preventivo di una campagna gestita"), `/come-calcolare-engagement-rate/`, `/micro-influencer/`.

**GEO, frasi citabili**:
- "Costo medio di un post Instagram in Italia per fascia (DeRev): nano 200 €, micro 950 €, mid 3.550 €, macro circa 8.000 € (stima), oltre 1 milione 23.750 €."
- "Fasce di follower: nano 1.000–10.000, micro 10.000–50.000, mid 50.000–250.000, macro 250.000–1 milione, mega oltre 1 milione."
- "Il calcolatore di Influencee affianca la formula di prezzo per follower dell'app alla media di mercato della stessa fascia."
- Contesto con fonte (da `MARKET.context`): "circa 40.000 influencer con partita IVA in Italia (AGCOM 2026)"; "mercato dell'influencer marketing in Italia 425 mln € nel 2026, +10,4% (Il Sole 24 Ore)".

---

## 4. `/come-calcolare-engagement-rate/`, calcolatore ER e check sponsor

**Situazione.** GSC: 373 clic, 31.657 impressioni, **CTR 1,18%** in posizione 7,78. Le ancore dell'indice prendono fino a 2.960 impressioni (pos. 6–8). Ubersuggest: la pagina è in **posizione 8 per "engagement rate instagram" (390/mese)**. Gli H2 live, da tenere come domande: "Cosa è l'Engagement Rate?", "Come calcolo l'engagement rate?", "Qual è un buon tasso di engagement?", "Come vedere l'engagement rate su Instagram?", "Come si calcola l'engagement rate su TikTok?".

**SERP** ("calcolo engagement rate instagram"): metà **calcolatori gratuiti** (Socialinsider, Hootsuite, Modash, ClickAnalytic), metà **guide con formula** (Kolsquare, Metricool, Kontentino). Le formule sono diverse tra loro (reach vs follower, ×100 vs ×1000). Il nostro spazio è una formula chiara, la mediana e il confronto per fascia.

| pagina | keyword | volume | difficoltà | intento | uso |
| --- | --- | --- | --- | --- | --- |
| calcolo ER | calcolo engagement rate | 210 | 14 | strumento | P |
| calcolo ER | engagement rate instagram | 390 (pos. 8 oggi) | 33 | informativo | S (title, H2) — **non perderla** |
| calcolo ER | calcolo engagement rate instagram | 110 | 16 | strumento | S (H1) |
| calcolo ER | come calcolare engagement rate (= slug) | n/d (Autocomplete) | n/d | informativo | S (H2) |
| calcolo ER | calcolo engagement rate tiktok / engagement rate tiktok | n/d (Autocomplete) | n/d | strumento | S (H2) |
| calcolo ER | engagement rate significato / cos'è | n/d (Autocomplete) | n/d | informativo | F |
| calcolo ER | qual è un buon engagement rate su instagram | n/d (Autocomplete) | n/d | informativo | F |
| calcolo ER | engagement rate formula | n/d (Autocomplete) | n/d | informativo | S |
| calcolo ER | tasso di engagement | n/d (Autocomplete) | n/d | informativo | S (sinonimo nel testo) |
| calcolo ER | engagement rate micro influencer | 10 | 5 | informativo | L → `/micro-influencer/`, `/benchmark-engagement-rate/` |

**Proposta da copiare**

- **title** (55): `Calcolo engagement rate Instagram e TikTok | Influencee`
- **description** (153): `Come calcolare l'engagement rate: formula, calcolatore gratuito per Instagram e TikTok e confronto con la media della fascia. Con check sponsor dei reel.`
- **H1**: `Come calcolare l'engagement rate: calcolatore gratuito`. Tiene lo slug e la query "come calcolare"; nell'H1 attuale della v2 non c'è.
- **In breve** (domanda "Come si calcola l'engagement rate?", 46 parole; è la `CALC_FAQ[0]`):
  > Si sommano le interazioni di un contenuto (like, commenti, condivisioni e salvataggi), si divide per il numero di follower e si moltiplica per 100. Per un valore affidabile usa la mediana degli ultimi contenuti invece della media, così un singolo post virale non falsa il risultato.
- **H2 a domanda**:
  1. Cos'è l'engagement rate?
  2. Come si calcola l'engagement rate? (formula)
  3. Qual è un buon engagement rate su Instagram? *(valori per fascia `MARKET.erIG`)*
  4. Come si calcola l'engagement rate su TikTok?
  5. Che differenza c'è tra engagement sui follower e sulle visualizzazioni? *(check sponsor)*
  6. Come capire se un contenuto è sponsorizzato? *(soglie 1,5 / 1,9 / 2,7%)*
- **FAQ** (le 4 attuali + 2):
  - **Cos'è l'engagement rate?** È la percentuale di follower che interagisce con i contenuti di un profilo: interazioni divise per follower, per 100. Misura quanto è attiva la community, ed è più utile del numero di follower per scegliere un creator.
  - **Come si calcola l'engagement rate su TikTok?** Con la stessa formula: interazioni (like, commenti, condivisioni e salvataggi) divise per follower, per 100. Su TikTok conviene guardare anche il rapporto tra interazioni e visualizzazioni, perché molti video arrivano a persone che non seguono il profilo.
- **Link interni**: `/benchmark-engagement-rate/`, `/benchmark-influencer-2026-i-nuovi-standard-del-mercato/` (articolo WP), `/followe-instagram-fake-follower/`.

**GEO, frasi citabili**:
- "Engagement rate = (like + commenti + condivisioni + salvataggi) ÷ follower × 100; su Influencee si usa la mediana dei reel e dei video degli ultimi 90 giorni."
- "Engagement medio su Instagram per fascia: nano 7,7% (ONIM), micro 4,6% (ONIM), mid 4,56% (DeRev), macro 2,5% (interpolazione), mega 1,61% (DeRev)."
- "Check sponsor (interazioni ÷ visualizzazioni): sotto 1,5% probabile reach a pagamento; 1,5–1,9% possibile mix di organico e ads; 1,9–2,7% media organica sana; oltre 2,7% ottimo organico."

---

## 5. `/preventivo-campagne/`, preventivo della campagna gestita

**Situazione.** GSC: 0 clic, 13 impressioni (pos. 20,2). Sul WP live la pagina ha title "preventivo campagne", nessun H1 e un solo H2 "Calcolatore Preventivi". **`/agenzia-influencer/` si posiziona già** su "agenzia influencer" (11.000 impressioni, pos. 20,5) e ha title, description e H1 sull'agenzia. Se anche il preventivo punta "agenzia influencer marketing", le due pagine si fanno concorrenza e la più debole, cioè questa, non sale.

**Decisione proposta:** `/agenzia-influencer/` tiene "agenzia influencer marketing" (140, diff. 29, transazionale; picco 390 a settembre 2025, poi 20–40 in estate 2026). `/preventivo-campagne/` prende l'intento **"quanto costa / preventivo di una campagna con influencer"**. Il volume Ubersuggest è 0, ma la pagina vale per le conversioni, non per il traffico: le visite arrivano dai link di `/agenzia-influencer/` e di `/social-media-tool/costo-influencer/` (960 clic).

**SERP** ("quanto costa una campagna di influencer marketing preventivo"): solo **guide al budget** (Influee, Kolsquare, Influencer Hero) con cifre generiche come "fee d'agenzia 15–30%". **Nessun listino pubblico con calcolatore** nei risultati: il nostro preventivo è un formato che manca.

| pagina | keyword | volume | difficoltà | intento | uso |
| --- | --- | --- | --- | --- | --- |
| preventivo campagne | preventivo campagna influencer marketing | 0 ("preventivo influencer marketing") | 12 | transazionale | **P** |
| preventivo campagne | quanto costa una campagna con influencer | 0 | 4 | commerciale | S (H1, In breve) |
| preventivo campagne | costi influencer marketing / costo influencer marketing | n/d (Autocomplete) | n/d | commerciale | S (description) |
| preventivo campagne | budget influencer marketing | n/d (Autocomplete) | n/d | commerciale | S (H2) |
| preventivo campagne | quanto costa un video ugc | n/d (Autocomplete) | n/d | commerciale | F |
| preventivo campagne | campagna influencer gestita / servizio gestito | n/d | n/d | transazionale | S |
| preventivo campagne | agenzia influencer marketing | 140 | 29 | transazionale | **L → `/agenzia-influencer/`** (non nel title) |
| preventivo campagne | agenzia influencer marketing milano | 70 | 15 | transazionale locale | L → `/agenzia-influencer/` |

**Proposta da copiare**

- **title** (53): `Preventivo campagna influencer marketing | Influencee`. Oggi in `pages.tsx` c'è "Agenzia influencer marketing: preventivo online": **da cambiare**. Anche `kw` diventa `'preventivo campagna influencer marketing'`.
- **description** (150): `Quanto costa una campagna con influencer e UGC creator gestita dal team Influencee: 500 € a influencer al mese, 150 € a video UGC, sconti fino all'8%.`
- **H1**: `Quanto costa una campagna con influencer? Calcola il preventivo`
- **eyebrow**: da "Agenzia di influencer marketing" a "Campagna gestita dal team"
- **In breve** (domanda "Quanto costa una campagna con influencer gestita da un'agenzia?", 60 parole; è la `GESTITO_FAQ[0]` più un esempio calcolato con `gestitoQuote`):
  > Con il listino di Influencee, per creator fino a 70.000 follower: 500 € al mese per ogni influencer (475 € per ogni contenuto in più), 250 € di gestione per influencer, 150 € per video UGC più 100 € di gestione. Esempio: 3 influencer con un contenuto al mese per 3 mesi costano 6.412,50 €, con lo sconto del 5%.
- **H2 a domanda**:
  1. Quanto costa una campagna con influencer? *(calcolatore `PreventivoPanel`)*
  2. Cosa comprende il servizio gestito?
  3. Quanto costa un video UGC nella campagna?
  4. Come cambia il prezzo con la durata? *(+10% per 1 mese; −5/6/8% a 3/6/12 mesi)*
  5. Meglio un'agenzia o la piattaforma in autonomia? *(link `/agenzia-influencer/` e `/prezzi/`)*
- **FAQ** (le 4 attuali + 2):
  - **Quanto costa un video UGC?** Nel listino del servizio gestito un video UGC costa 150 € più 100 € di gestione del team. Il prezzo vale per i creator fino a 70.000 follower.
  - **Perché una campagna di un mese costa di più?** Le campagne di un solo mese hanno una maggiorazione del 10% sul totale mensile. Dai 3 mesi in su c'è uno sconto: 5% a 3 mesi, 6% a 6 mesi, 8% a 12 mesi.
- **Link interni (decisione richiesta)**:
  - da `/agenzia-influencer/` → `/preventivo-campagne/`, ancora: "calcola il preventivo della campagna" (pulsante vicino al primo H2 e nelle FAQ);
  - da `/preventivo-campagne/` → `/agenzia-influencer/`, ancora: "la nostra agenzia di influencer marketing" (nel testo dell'H2 5 e in `Related`);
  - da `/social-media-tool/costo-influencer/` (H2 "Quanto costa una campagna completa?") e da `/come-calcolare-il-costo-di-una-campagna-social-guida-2026/` → `/preventivo-campagne/`.

**GEO, frasi citabili**:
- "Listino del servizio gestito di Influencee (creator fino a 70.000 follower): 500 € al mese per influencer, 475 € per ogni contenuto in più, 250 € di gestione per influencer; 150 € per video UGC più 100 € di gestione; +10% per campagne di un mese; sconto del 5, 6 e 8% a 3, 6 e 12 mesi."
- "Per profili oltre 70.000 follower, VIP o campagne con molti creator: preventivo su misura su WhatsApp +39 351 342 1629."

---

## 6. `/offerte-lavoro-influencer/`, bacheca per i creator

**Situazione.** GSC: 188 clic, 8.299 impressioni, pos. 11,21. Le 68 schede `/offerta-lavoro/<slug>/` hanno portato 304 clic (301 alla bacheca, già in piano). Oggi in bacheca ci sono **2 offerte** (`JOBS`, 2026): contenuto sottile finché l'endpoint dell'app non porta gli annunci aperti.

**SERP** ("offerte lavoro influencer"): **aggregatori di annunci** (Jobbydoo per regione) e articoli di giornale vecchi. Google cerca annunci veri: senza offerte aperte la pagina deve vincere con la guida "come trovare collaborazioni".

| pagina | keyword | volume | difficoltà | intento | uso |
| --- | --- | --- | --- | --- | --- |
| offerte lavoro | offerte lavoro influencer | n/d (GSC 8.299 impressioni) | n/d | transazionale (creator) | P |
| offerte lavoro | lavoro influencer (instagram) | n/d (Autocomplete) | n/d | transazionale | S |
| offerte lavoro | ugc creator lavoro | 90 | 31 | transazionale | S (H2) |
| offerte lavoro | ugc creator offerte di lavoro / offerte lavoro ugc creator | 30 | 15 | transazionale | S |
| offerte lavoro | collaborazioni con brand | 50 | 21 | transazionale | S (H2) |
| offerte lavoro | come fare collaborazioni con brand | 10 | 10 | informativo | F |
| offerte lavoro | cercasi influencer (instagram) | n/d (Autocomplete) | n/d | transazionale | S (testo) |
| offerte lavoro | come farsi sponsorizzare da un brand | n/d (Autocomplete) | n/d | informativo | F |
| offerte lavoro | quanti follower servono per guadagnare su instagram | n/d (Autocomplete) | n/d | informativo | F |
| offerte lavoro | offerte di lavoro influencer marketing | n/d (Autocomplete) | n/d | ⚠ lavoro *nelle agenzie* (dipendenti) | — (intento diverso, non puntarla) |

**Proposta da copiare**

- **title** (59): `Offerte di lavoro per influencer e UGC creator | Influencee` (quello attuale va bene)
- **description** (150): `Collaborazioni con i brand per influencer e UGC creator: offerte pagate, cambio merce e % sulle vendite. Cerca per settore e città e candidati gratis.`
- **H1**: `Offerte di lavoro per influencer e UGC creator`
- **In breve** (domanda "Come trovare lavoro come influencer?", 44 parole; è il testo attuale dell'`AnswerBox` con una frase in più, presa da `JOBS_FAQ`):
  > Crea un profilo con categoria, città e social collegati, poi candidati alle offerte dei brand nella bacheca. Su influencee le aziende vedono i tuoi numeri verificati e possono anche invitarti direttamente a una campagna, senza candidatura. Iscrizione e candidature sono gratuite per i creator.
- **H2 a domanda**:
  1. Quali offerte di collaborazione ci sono oggi? *(la bacheca)*
  2. Come trovare lavoro come influencer?
  3. Come trovare collaborazioni con i brand se sei un UGC creator?
  4. Quanti follower servono per candidarsi?
  5. Che tipi di compenso offrono i brand?
- **FAQ** (le 4 attuali + 1):
  - **Come farsi sponsorizzare da un brand?** Iscriviti gratis, collega Instagram o TikTok per avere il badge Verificato e indica categorie, città e prezzi indicativi. Poi candidati agli annunci aperti: i brand vedono i tuoi numeri e possono anche invitarti direttamente a una campagna.

  ⚠ C'è un'incoerenza da sistemare. `JOBS_FAQ[1]` dice "nano e micro influencer (da 1.000 follower)", mentre `FAQ.creator[1]` dice "Nessun minimo". Proposta per la FAQ "Quanti follower servono?": "Nessun minimo per iscriversi e candidarsi; molte offerte cercano nano influencer (1.000–10.000 follower) o UGC creator, per i quali contano i video, non i follower".
- **Dati strutturati**: `JobPosting` solo per le offerte aperte con data di scadenza (come da `RESTAURO-TOOL.md`). Per ora `CollectionPage` + `FAQPage`.
- **Link interni**: `/ugc-creator/`, `/diventa-creator/`, `/funzionalita/media-kit/`, e a `/pubblica-offerta-lavoro/` solo come "Sei un'azienda?".

**GEO, frasi citabili**:
- "Nella bacheca di Influencee le aziende pubblicano collaborazioni pagate, in cambio merce o con percentuale sulle vendite; i creator si candidano gratis dall'app."
- "Le offerte mostrano sempre la data di pubblicazione; le offerte scadute non vengono mostrate."

---

## 7. `/pubblica-offerta-lavoro/`, form per le aziende

**Situazione.** GSC: 1 clic, 255 impressioni, pos. 12,34. Sul WP live **H1 = "offerte di lavoro per influencer"** (uguale alla bacheca: cannibalizzazione) più un secondo H1 "Inserisci/Modifica link" rimasto dall'editor. Title live: "pubblica offerta lavoro".

| pagina | keyword | volume | difficoltà | intento | uso |
| --- | --- | --- | --- | --- | --- |
| pubblica offerta | pubblicare annuncio per influencer | n/d | n/d | transazionale (brand) | P |
| pubblica offerta | pubblica offerta lavoro (= slug, query di navigazione) | n/d (GSC 255 impressioni) | n/d | navigazionale | S |
| pubblica offerta | come trovare un influencer | n/d (Autocomplete); "come trovare influencer" 20 (`SEO-PIANO.md`) | n/d | commerciale | S (In breve) / L → database |
| pubblica offerta | come contattare un influencer | n/d (Autocomplete) | n/d | commerciale | F |
| pubblica offerta | dove trovare influencer | n/d (Autocomplete) | n/d | commerciale | F |
| pubblica offerta | trovare influencer | 10 | 41 | commerciale | L → `/funzionalita/database-influencer/` |
| pubblica offerta | cercasi influencer | n/d | n/d | ambiguo (creator) | L → bacheca |

**Proposta da copiare**

- **title** (56): `Pubblica un annuncio per influencer, gratis | Influencee`
- **description** (152): `Pubblica gratis un'offerta di collaborazione per influencer e UGC creator italiani: compenso, cambio merce o % sulle vendite. Ricevi candidature in app.`
- **H1**: `Pubblica un annuncio per trovare influencer`. Deve essere diverso dalla bacheca; il title della v2 oggi è "Pubblica un'offerta per influencer, gratis" e va bene anche quello.
- **In breve** (domanda "Come si trova un influencer per un'azienda?", 41 parole; è l'`AnswerBox` attuale):
  > Pubblica un'offerta con cosa cerchi, compenso e scadenza, oppure cerca direttamente nel database per categoria, città e fascia di follower e invita i creator. Su influencee puoi fare entrambe le cose, e gestire termini, contratto e link tracciati nella stessa collaborazione.
- **H2 a domanda**:
  1. Come pubblicare un annuncio per influencer? *(il form in 3 passi)*
  2. Come si trova un influencer per un'azienda?
  3. Come contattare un influencer?
  4. Che compenso offrire?
  5. Preferisci che la campagna la gestiamo noi? *(`ManagedRow` → `/preventivo-campagne/`)*
- **FAQ** (le 4 attuali + 1):
  - **Come contattare un influencer?** Su influencee scrivi al creator in chat dalla sua scheda, lo inviti a una campagna oppure pubblichi un annuncio e aspetti le candidature. Termini, consegne e contratto restano nella stessa collaborazione.
- **Link interni**: `/funzionalita/database-influencer/`, `/social-media-tool/costo-influencer/`, `/preventivo-campagne/`.

**GEO, frasi citabili**:
- "Su Influencee un'azienda pubblica un annuncio gratis dall'account aziendale; le formule di compenso sono denaro, cambio merce, percentuale sulle vendite, ibrida, ospitalità o evento."
- "Nessuna commissione per il brand sulle collaborazioni."

---

## 8. `/social-media-tool/emoticon-da-copiare/`

**Situazione.** Ubersuggest `domain_keywords`: la pagina è in **posizione 4 per "emoticon da copiare" (2.900) e 5 per "emoji da copiare" (4.400)**, più 9 varianti. Search Console, però, dà solo 48 clic e 4.367 impressioni (CTR 1,1%, pos. 8,9). Ubersuggest stima 92 + 85 visite al mese: **va controllato in GSC sulle ultime 16 settimane**, perché l'export potrebbe coprire un periodo breve. Il vecchio `/emoticon-da-copiare/` (1 clic, 287 impressioni) va in 301 sul tool.

**SERP** ("emoticon da copiare"): **elenchi per categoria con copia in un clic** (GetEmoji, Emojipedia, internetpasoapaso, Waalaxy) e siti di kaomoji. Vince chi ha tante categorie e nessun ostacolo prima della griglia: la griglia va subito sotto l'hero.

| pagina | keyword | volume | difficoltà | intento | uso |
| --- | --- | --- | --- | --- | --- |
| emoticon | emoji da copiare | 4.400 (pos. 5) | 24 | informativo/strumento | P (con emoticon) |
| emoticon | emoticon da copiare | 2.900 (pos. 4) | 26 | strumento | P |
| emoticon | emoticons copia incolla | 390 (pos. 5) | 28 | strumento | S |
| emoticon | emoticon copia incolla | 390 (pos. 4) | 28 | strumento | S |
| emoticon | emoji whatsapp da copiare | 260 (pos. 7) | 27 | strumento | S (H2) |
| emoticon | emoticon da copiare gratis | 210 (pos. 5) | 18 | strumento | S |
| emoticon | emoji da copiare e incollare | 210 (pos. 6) | 24 | strumento | S (H1) |
| emoticon | copia emoji | 170 (pos. 5) | 30 | strumento | S |
| emoticon | tutte le emoji da copiare | 140 (pos. 6) | 22 | strumento | S |
| emoticon | cuori da copiare / emoji cuore | n/d (Autocomplete) | n/d | strumento | S (H2 categoria Cuori) |
| emoticon | simboli da copiare (per instagram) | n/d (Autocomplete) | n/d | strumento | S (H2 categoria Simboli) |
| emoticon | come mettere emoji su instagram | n/d (Autocomplete) | n/d | informativo | F |

**Proposta da copiare**

- **title** (53): `Emoticon ed emoji da copiare e incollare | Influencee` (aggiunge "emoji", la query più grande)
- **description** (147): `Emoji ed emoticon da copiare e incollare gratis: faccine, cuori, mani, cibo, viaggi e simboli. Un clic per copiare su Instagram, TikTok e WhatsApp.`
- **H1**: `Emoticon ed emoji da copiare e incollare`
- **In breve** (domanda "Come si copiano le emoticon?", 46 parole):
  > Clicca un'emoticon: viene copiata negli appunti e aggiunta al riquadro "Il tuo testo". Poi incolla dove vuoi, oppure copia tutto il testo insieme. Sono caratteri Unicode, non immagini: funzionano su Instagram, TikTok, WhatsApp, Facebook e LinkedIn, anche se l'aspetto cambia un po' in base al telefono.
- **H2 a domanda** (brevi, sopra o tra le categorie):
  1. Quali sono le emoji più usate? *(categoria "Più usate")*
  2. Cuori da copiare *(categoria Cuori)*
  3. Simboli da copiare per Instagram *(categoria Simboli)*
  4. Le emoji funzionano anche su WhatsApp?
  5. Quante emoticon usare in una caption?
- **FAQ** (le 3 attuali + 1):
  - **Come mettere le emoji su Instagram?** Copia l'emoji con un clic in questa pagina e incollala nella caption, nella bio o in un commento. Puoi anche comporre tutto il testo nel riquadro "Il tuo testo" e copiarlo in una volta sola.
- **Link interni**: `/social-media-tool/`, `/diventa-creator/`, futuro tool hashtag.

**GEO**: pagina di utilità, poco citabile. In `llms.txt` basta una riga: "Emoticon da copiare: 9 categorie (più usate, faccine, cuori, mani, natura, cibo, viaggi, oggetti, simboli), copia con un clic".

---

## 9. `/social-media-tool/`, hub dei tool gratuiti

**Situazione.** GSC: 0 clic, 115 impressioni, pos. 34. **`/tool-influencer/`** (301 → hub in piano) ha **10.714 impressioni in posizione 8,7 e solo 4 clic**: il suo title live è "Alberatura – tool influencer – per Brand", cioè una nota interna finita in SERP. L'hub deve ereditare quelle query. Title live dell'hub: "Il Tool per pianificare Influencer & UGC Più Completo d'Italia" (superlativo, da togliere).

| pagina | keyword | volume | difficoltà | intento | uso |
| --- | --- | --- | --- | --- | --- |
| hub tool | tool influencer marketing | 30 | 31 | commerciale | P |
| hub tool | tool influencer | n/d (Autocomplete; GSC `/tool-influencer/` 10.714 impressioni) | n/d | commerciale | P (title) |
| hub tool | influencer marketing tools | 20 | 26 | commerciale | S |
| hub tool | social media tool gratis | n/d (Autocomplete) | n/d | strumento | S (H2) |
| hub tool | tool per social media manager gratis | n/d (Autocomplete) | n/d | strumento | S (filtro "smm") |
| hub tool | tool ricerca influencer / tool per trovare influencer | n/d (Autocomplete) | n/d | commerciale | L → `/funzionalita/database-influencer/` |
| hub tool | social media tools | n/d (Autocomplete, inglese) | n/d | informativo | — |

**Proposta da copiare**

- **title** (47): `Tool influencer marketing gratuiti | Influencee`. Non usare "Tool gratuiti per influencer e social media manager": arriva a 64 caratteri.
- **description** (149): `Tool gratuiti per influencer marketing: fake follower checker, calcolo engagement rate, costo influencer, preventivo campagna ed emoticon da copiare.`
- **H1**: `Tool gratuiti per influencer marketing` (attuale, va bene)
- **In breve** (domanda "Quali strumenti servono per l'influencer marketing?", 41 parole; è l'`AnswerBox` attuale):
  > Per scegliere un creator servono tre verifiche: qualità del pubblico (fake follower), engagement rispetto alla fascia di follower e costo in linea con il mercato. Poi servono strumenti per gestire la campagna: contratto, scadenze e link tracciati per misurare i risultati.
- **H2 a domanda**:
  1. Quali tool gratuiti ci sono? *(griglia `ToolsHubGrid` con filtro per pubblico)*
  2. Quali strumenti servono per l'influencer marketing?
  3. Quale tool usare prima di pagare un influencer?
  4. Tool gratuiti per social media manager *(includere `/contratto-social-media-influencer-ugc/`, che oggi ha traffico)*
- **FAQ**: le 3 attuali di `HUB_FAQ` vanno bene.
- **Dati strutturati**: `CollectionPage` con `ItemList` delle 8 card, più `FAQPage`.

**GEO, frasi citabili**:
- "I tool gratuiti di Influencee funzionano senza registrazione e senza leggere i dati dai social: l'utente inserisce i numeri pubblici e il calcolo avviene nel browser."
- "Prima di pagare un influencer: fake follower checker, calcolo engagement rate e calcolatore del costo."

---

## 10. Blocco per `llms.txt` (da sostituire alle righe dei tool)

```
## Tool gratuiti (senza registrazione, calcolo nel browser, nessun dato letto dai social)
- [Fake follower Instagram](https://influencee.it/followe-instagram-fake-follower/): 5 segnali con soglie indicative dichiarate — engagement sotto il 50% della media di fascia, crescita oltre il 20% in 30 giorni, interazioni ÷ visualizzazioni sotto l'1,5%, visualizzazioni dei reel sotto il 5% dei follower, commenti sotto l'1% dei like
- [Quanto costa un influencer](https://influencee.it/social-media-tool/costo-influencer/): costo medio di un post Instagram in Italia per fascia (DeRev) — nano 200 €, micro 950 €, mid 3.550 €, macro circa 8.000 € (stima), oltre 1 milione 23.750 €
- [Calcolo engagement rate](https://influencee.it/come-calcolare-engagement-rate/): ER = interazioni ÷ follower × 100, mediana degli ultimi contenuti; medie Instagram per fascia: nano 7,7%, micro 4,6% (ONIM), mid 4,56%, mega 1,61% (DeRev); check sponsor sotto 1,5% = probabile reach a pagamento
- [Preventivo campagna gestita](https://influencee.it/preventivo-campagne/): listino del servizio gestito per creator fino a 70.000 follower — 500 € al mese a influencer, 475 € per contenuto in più, 250 € di gestione a influencer, 150 € a video UGC + 100 € di gestione, sconti 5/6/8% a 3/6/12 mesi
- [Agenzia influencer](https://influencee.it/agenzia-influencer/): il servizio di agenzia di Influencee per campagne gestite
- [Offerte di lavoro per influencer](https://influencee.it/offerte-lavoro-influencer/): collaborazioni pagate, cambio merce o % sulle vendite; candidature gratuite per i creator
- [Pubblica un annuncio](https://influencee.it/pubblica-offerta-lavoro/): gratis per le aziende, nessuna commissione sulle collaborazioni
- [Emoticon da copiare](https://influencee.it/social-media-tool/emoticon-da-copiare/): 9 categorie, copia con un clic
- [Tutti i tool](https://influencee.it/social-media-tool/)
```

---

## 11. Controlli da fare quando Ubersuggest risponde (in ordine)

| Cosa | Strumento | Perché conta | Decisione abilitata |
| --- | --- | --- | --- |
| `page_keywords` sulle 8 URL (`https://influencee.it/<url>`, locId 2380, `it`) | Ubersuggest | elenco delle query che portano visite a ogni pagina | aggiungere al title/H2 le query perse in questo documento |
| `keyword_overview` su: fake follower instagram, fake follower check, follower falsi instagram, quanto costa un influencer, costo influencer, costo post influencer, offerte lavoro influencer, tool influencer, costo campagna influencer marketing | Ubersuggest | volumi oggi n/d | confermare le keyword principali (soprattutto preventivo e hub) |
| `serp_analysis` su "fake follower instagram" e "quanto costa un influencer" | Ubersuggest | DA dei concorrenti in prima pagina | stimare quanto lavoro di link serve per passare da pos. 11,6 a top 5 |
| Search Console, *Rendimento → Pagine →* URL `/followe-instagram-fake-follower/` *→ Query*, ultimi 16 mesi | GSC | query vere della pagina più visitata | non togliere dal testo le parole delle prime 20 query |
| Search Console, stessa vista per `/agenzia-influencer/` e `/preventivo-campagne/` | GSC | conferma della cannibalizzazione | se `/agenzia-influencer/` non ha query "agenzia…", rivalutare la §5 |

## 12. Checklist per la messa online su WordPress

- [ ] Un solo `<title>` e un solo H1 per pagina. Oggi su WP ce ne sono 2–5: costo-influencer, emoticon, hub, pubblica-offerta.
- [ ] Description scritta a mano su tutte le 8 pagine. Oggi mancano su ER, preventivo, offerte, pubblica, hub ed emoticon; quella del fake follower è sbagliata.
- [ ] FAQ visibili identiche al JSON-LD `FAQPage`.
- [ ] 301 da mantenere o aggiungere: `/costo-influencer/` (attivo), `/come-calcolare-il-costo-degli-influencer/`, `/come-calcolare-costo-influencer/` (e `/5/`), `/come-riconoscere-e-rimuovere-fake-follower/`, `/emoticon-da-copiare/`, `/tool-influencer/`, `/social-media-tool-form/`, `/preventivi-influencer/`, `/offerta-lavoro/<slug>/`.
- [ ] Link a doppio senso `/agenzia-influencer/` ↔ `/preventivo-campagne/`.
- [ ] Dopo 4 settimane: in GSC, CTR di costo-influencer (oggi 1,83%) ed ER (1,18%). Obiettivo: oltre il 3% in posizione 6–8.
