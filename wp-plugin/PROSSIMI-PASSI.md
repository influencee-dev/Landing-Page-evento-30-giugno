# Lavori in corso e prossimi passi (aggiornato il 13/11/2026)

## ✅ Popup del preventivo dopo un minuto (13/11/2026) — Core 2.3.7, Tools 2.0.7, Pagine 2.0.13; grafica nuova Core 2.3.8

- Core 2.3.8: popup ridisegnato (pannello nero con bagliore fucsia/verde, titolo con «campagna» evidenziata in verde
  acido, anteprima sfocata del preventivo «si sblocca alla fine», tre punti di forza; su telefono scheda dal basso).

- Dopo 60 secondi sulla pagina si apre il calcolatore compatto in un popup (su telefono sale dal basso):
  pagine per aziende e miste (React: `PreventivoPopup` in `resolve`) e articoli (Core, `wp_footer` + `inft-preventivo.js`).
  Mai su pagine per creator, /preventivo-campagne/, /preventivi-influencer/, contatti, pubblica offerta.
- Al massimo una volta ogni 7 giorni per visitatore (localStorage `inft_pv_popup`), mai a chi ha già chiesto il
  preventivo (`inft_pv_sent`) o ha già iniziato un calcolatore nella pagina. Chiusura con X, Esc, clic fuori.
- Modulo «Lead tool: preventivo_popup_<pagina>» in Tandem; GA4 `preventivo_popup_open`, `preventivo_popup_close`
  (modo esc/fuori), poi gli stessi eventi del calcolatore.
- Impostazioni → Preventivo → «Popup»: secondi di attesa (0 = spento).


## ✅ Email del preventivo via Brevo (13/11/2026, quarta parte) — Core 2.3.5 e 2.3.6, installati subito via MCP

- Prima prova (Core 2.3.4): le email partivano con wp_mail dal server Netsons a nome di giorgia@influencee.it e non
  arrivavano: l'SPF di influencee.it autorizza solo Zoho (`v=spf1 include:zohomail.eu ~all`).
- Core 2.3.5: strumento MCP `influencee__preventivo` (sola lettura: impostazioni, origine della chiave Brevo,
  mittenti Brevo, registro; errori di wp_mail nel registro).
- Core 2.3.6: la chiave Brevo si legge anche da `sib_api_key_v3` (plugin Brevo 3.x «mailin», attivo sul sito).
  giorgia@influencee.it è un mittente **attivo** in Brevo; il dominio ha il codice di verifica Brevo.
  Seconda prova (verso l'alias giorgia@socialee.it): registro `{"guida":"brevo","team":"brevo"}`.
- L'avviso al team va a influencee2019@gmail.com (email amministratore di WordPress): si cambia in Impostazioni → Preventivo.
- Consiglio: aggiungere Brevo all'SPF (`include:spf.brevo.com`) per una consegna più sicura.


## ✅ Correzioni di Giorgia al calcolatore e all'email (13/11/2026, terza parte) — Core 2.3.4, Pagine 2.0.12, Tools 2.0.6

- **Prezzi solo dopo il modulo**: nessun prezzo del listino nelle pagine né nei passi del calcolatore (nemmeno
  nascosto nell'HTML). Dopo «Calcola il preventivo» compaiono la stima al mese (creator × contenuti × fascia, più
  UGC, con la maggiorazione di nicchia) e il listino indicativo, creati in quel momento. Tolti il vecchio
  listino GESTITO (500 € al mese a influencer…) da FAQ e pagine /preventivo-campagne/ e /agenzia-influencer/,
  il vecchio calcolatore `PreventivoPanel` e la riga in llms.txt. Restano solo le fasce di budget del menu e i
  prezzi dell'abbonamento alla piattaforma (19/49/199 €).
- **UGC da 120 €** (120–300 € a video).
- **Ultimo passo**: nome, cognome, email, tipo di azienda (brand o azienda, e-commerce, agenzia, startup, negozio o
  attività locale, professionista o studio, altro), tutti obbligatori. Telefono e nome dell'azienda tolti.
- **Email**: mittente **giorgia@influencee.it**; firma copiata da Zoho (email inviate da giorgia@influencee.it il
  12/11): nome in fucsia, «CEO & CO-Founder», email, telefono, nuovo logo e icone Instagram/LinkedIn (immagini
  già su influencee.it/wp-content/uploads/). Carattere Manrope come in Zoho. P.S. con la stima vista nel
  calcolatore. All'avviso al team: nome e cognome, tipo di azienda, stima mostrata.
- Ruolo e telefono della firma modificabili in Influencee → Impostazioni → Preventivo.


## ✅ Calcolatore del preventivo a passi ovunque + email con la guida (13/11/2026, seconda parte) — Core 2.3.3, Pagine 2.0.11, Tools 2.0.5, Articoli 2.5.2

Richiesta di Giorgia: il calcolatore in tutte le pagine dei brand e negli articoli; deve sembrare un preventivo fatto
al momento, ma alla fine chiede i contatti e risponde «Grazie, ti contatteremo al più presto per inviarti il
preventivo»; dopo l'invio parte in automatico un'email scritta da lei con una guida su come funzionano le campagne.
- **Calcolatore** (`src/influencee/v2/preventivo/`: `widget.ts`, `widget.css`, `listino.ts`): 5 passi —
  influencer o UGC (spiegati), fascia di follower con prezzo indicativo + generici o di nicchia/professionisti
  (il prezzo sale), quanti creator/contenuti/durata, città e budget, contatti. Senza React: lo stesso codice gira
  nelle pagine nuove (`PreventivoWidget` in `tools.tsx`) e negli articoli/pagine WordPress (Core
  `assets/inft-preventivo.js/.css`, `infc_preventivo_mount()`). Modulo `<form data-tandem>` «Lead tool:
  preventivo_<pagina>», riepilogo nel campo visibile `risultato_tool`.
- **Prezzi indicativi** (`listino.ts`, a contenuto, gestione esclusa): fino a 10k 150–300 €, 10–50k 300–600 €,
  50–100k 800–1.200 €, oltre 100k da 1.500 € su misura; UGC 150–300 € a video; nicchia ×1,3–1,6.
  **Da confermare con Giorgia** (sue solo: 10k ≈ 300 €, 80k ≈ 900–1.000 €). ⚠ Le FAQ di /preventivo-campagne/ e
  il listino di /agenzia-influencer/ dicono ancora «500 € al mese a influencer» (listino GESTITO): da allineare.
- **Dove**: /preventivo-campagne/ (calcolatore grande con riepilogo laterale, spiegazione influencer/UGC, prezzi per
  fascia; tolti il vecchio calcolatore a listino e il modulo «Ti richiamiamo»); fascia compatta in home, prezzi,
  aziende, agenzia, hub, categorie, regioni, città, costo influencer, engagement rate, piattaforma, funzionalità,
  agenzie, micro influencer, UGC, campagne locali, professionisti, verificati, tool, fake follower, benchmark,
  pubblica offerta, contatti (al posto del modulo «demo»): 160 pagine; **articoli**: riquadro a metà testo
  (preventivo + «Prova Influencee gratis» + «Sei un creator? Iscriviti») e calcolatore in fondo al posto del
  modulo «Ricevi la selezione»; **/preventivi-influencer/**: calcolatore aggiunto sotto il testo, il modulo Brevo
  «INVIA» resta (si spegne in Influencee → Impostazioni → Preventivo). Nessun redirect.
- **Scheda finale per pubblico** (`CtaDual`, pubblico deciso in `resolve` con `AudienceCtx`): creator → iscrizione
  creator + offerte; aziende → registra l'azienda + pubblica un'offerta + calcola il preventivo; miste (home,
  blog…) → tutte e quattro.
- **Email** (Core `includes/preventivo.php`, `includes/email-guida.php`): `POST /wp-json/influencee/v1/preventivo`
  (pubblico; trappola per robot, 5 richieste/ora per IP, guida una volta al giorno per indirizzo). Manda al cliente
  la guida firmata Giorgia Palazzo (testo semplice, «scritto a mano»), avvisa il team (copia di sicurezza del
  lead), aggiunge a una lista Brevo chi dà il consenso. Invio con l'API di Brevo se c'è una chiave (impostazioni
  o quella del plugin Brevo del sito, `sib_main_option`), altrimenti `wp_mail`. Registro delle ultime 30 richieste
  nelle impostazioni. Copia per Brevo con `{{ contact.FIRSTNAME }}`: `consegne/email/guida-campagne-influencer.html`.
- **Da fare (Giorgia)**: in Influencee → Impostazioni → «Preventivo»: controllare mittente (di base
  info@influencee.it, nome «Giorgia Palazzo»; con Brevo deve essere un mittente verificato), email del team, chiave
  Brevo e numero della lista. Il connettore Brevo di Claude non rispondeva (502): niente fatto direttamente su Brevo.
  Formattazione delle email di Manuel Arlotti non trovata in questa sessione: se la manda, si adatta il modello.
- GA4: `preventivo_start`, `preventivo_step` (step, scelta), `form_submit` + `generate_lead` con
  `form_name = lead_preventivo_<pagina>` e `lead_type = brand`; clic sulle schede con `lead_type` brand/creator.


## ✅ Fascia «Preventivo campagna gestita» nelle pagine dei brand (13/11/2026) — Core 2.3.2, Pagine 2.0.10, Tools 2.0.4

Perché: richieste di preventivo scese da 6–7 al mese (2025) a 1–2 (2026). In 16 giorni (28/10–13/11) 2.178 persone
sul sito, ma /preventivo-campagne/ l'hanno vista in 10, /preventivi-influencer/ in 3, /prezzi/ in 49.
Cosa: `PreventivoBand` (`src/influencee/v2/tools.tsx`): calcolatore ridotto (influencer, video UGC, durata; stesso
listino `GESTITO`) con pulsante «Calcola il preventivo completo» → `/preventivo-campagne/#preventivo`, e accanto il
modulo «Ti richiamiamo con il preventivo» (nome, azienda, email, telefono obbligatorio, budget indicativo, città o
settore precompilati se la pagina li conosce, consenso marketing facoltativo). Il modulo è `<form data-tandem>`
con `name="Lead tool: preventivo_<pagina>"`; pagina di origine e stima vanno nel campo visibile `risultato_tool`.
- Pagine: home (sopra le FAQ), /prezzi/, /influencer-marketing-aziende/, /agenzia-influencer/, /influencer-italiani/,
  tutte le categorie e sottocategorie («Campagna con food influencer?»), regioni e città («Campagna con influencer
  di Napoli?»), /social-media-tool/costo-influencer/, /come-calcolare-engagement-rate/. In tutto 143 pagine
  pre-renderizzate. Non messa in diventa-creator, offerte di lavoro, emoticon, profili creator.
- Nomi dei moduli: `preventivo_home`, `_prezzi`, `_aziende`, `_agenzia`, `_influencer_italiani`, `_categoria`,
  `_regione`, `_citta`, `_costo_influencer`, `_engagement_rate` (categoria/città precise nel campo «risultato»).
- GA4: clic sul pulsante = `preventivo_cta_click`; invio = `form_submit` + `generate_lead`; tutti con
  `lead_type = brand` e `form_name = lead_preventivo_<pagina>` (nuovi parametri: registrarli come dimensioni
  personalizzate `lead_type` e `form_name` se non ci sono). Uso del calcolatore = `calculator_use` con
  `calculator = preventivo_<pagina>`.
- **/preventivi-influencer/ NON toccata** (form Brevo «INVIA», quasi tutti i preventivi degli ultimi 18 mesi):
  nessun redirect. Da rivalutare solo quando la fascia porta richieste in Tandem.
- Core, Pagine e Tools sono «automatici» in `aggiornamenti.json`: arrivano sul sito entro un'ora dal push.
  Gli zip degli altri plugin (Pulizia compresa) sono rimasti identici a prima.
- Da misurare tra 2–4 settimane: in Tandem i lead «Lead tool: preventivo_*», in GA4 `generate_lead` per
  `form_name` e `page_path`.


## ✅ Aggiornamenti automatici dal repository (Influencee Aggiornamenti 1.0.0, 31/10/2026)

La chiave MCP non arrivava al sito (401 anche da una sessione nuova). Soluzione senza chiavi: il plugin
**Influencee Aggiornamenti** (`wp-plugin/influencee-aggiornamenti/`), caricato una volta a mano, ogni ora legge
`consegne/plugin-wordpress/versioni.json` dal ramo `claude/dreamy-mendel-3qxvue` (repository pubblico, raw GitHub),
scarica gli zip con `auto: true` più nuovi di quelli installati, verifica lo sha256, fa una copia in
`uploads/influencee-backup/`, installa, svuota la cache e controlla la home; se non risponde rimette la copia.
- Pubblicare un aggiornamento = cambiare versione del plugin, `node scripts/build-wp-plugin.mjs` (scrive zip e
  versioni.json in consegne/), commit e push. Entro un'ora è sul sito.
- `wp-plugin/aggiornamenti.json` decide quali plugin si aggiornano da soli (Core spento finché la 2.2.18 del sito
  non è recuperata e unita).
- Stato da fuori: `GET https://influencee.it/wp-json/influencee-aggiornamenti/v1/stato` (versioni, ultimo controllo,
  ultime 5 righe del registro). Pagina admin: Strumenti → Influencee Aggiornamenti («Controlla adesso»).
- Provato su WordPress locale: aggiornamento di Articoli e Annunci, copia di sicurezza, ritorno indietro con un
  aggiornamento che rompeva il sito.


Nota per riprendere il lavoro in una sessione nuova di Claude Code (ambiente **Influencee v2**).

## ✅ Accesso al sito: server MCP dentro il Core (Core 2.2.13, 27/10/2026) — usare questo

Niente plugin esterni, niente password per le applicazioni (Netsons toglie `Authorization`), niente bridge.
- **MCP** (JSON-RPC 2.0 su HTTP): `POST https://influencee.it/wp-json/influencee/v1/mcp`
  (`initialize`, `tools/list`, `tools/call`, `ping`; `GET` sulla stessa URL = elenco strumenti). Nomi con `__` al posto
  della barra: `influencee__stato`, `influencee__pagine`, `influencee__articoli`, `influencee__redirect`,
  `influencee__svuota-cache`, `influencee__controlla-pagina`, `influencee__rimuovi-creator`, `influencee__impostazioni`,
  `influencee__imposta` (valori + conferma), `influencee__plugin-elenco`, `influencee__plugin-attiva` (file, attiva,
  conferma; il Core non si spegne), `influencee__pagine-pausa` (riprendi, conferma).
- **Zip dei plugin della famiglia**: `POST https://influencee.it/wp-json/influencee/v1/plugin?attiva=1`, corpo = zip
  (`--data-binary @file.zip`), intestazione `X-Sha256: <sha256>`. Accetta solo i plugin Influencee, riattiva se era attivo.
- **Chiave**: intestazione `X-Influencee-Key`, creata da *Influencee → Impostazioni → Crea la chiave per Claude*
  (mostrata una volta) e salvata dal titolare come **segreto di rete** dell'ambiente Influencee v2 (sito `influencee.it`,
  percorso `/wp-json/influencee/`, intestazione `X-Influencee-Key`, senza prefisso). Il proxy la aggiunge da solo:
  basta `curl https://influencee.it/wp-json/influencee/v1/mcp ...` senza intestazione. 20 chiavi sbagliate = 10 minuti
  di blocco per indirizzo. Ogni azione finisce nel registro del Core.
- Prova: `curl -s -X POST https://influencee.it/wp-json/influencee/v1/mcp -d '{"jsonrpc":"2.0","id":1,"method":"ping"}'`
  → `{"jsonrpc":"2.0","id":1,"result":{}}`. Se dà 401: chiave mancante (segreto non salvato o sessione aperta prima).
- Provato su WordPress locale: initialize/list/call, impostazioni, rifiuto senza conferma, Core non spegnibile, 401 con
  chiave sbagliata, blocco, caricamento di Tema, Pagine e del Core stesso, zip estraneo e sha sbagliato rifiutati.

## (superato) Accesso al sito: nuovo bridge (decisione del titolare, 25/10/2026)

Il titolare vuole usare il bridge. Il vecchio plugin `claude/v1` non era nel repository: rifatto come
**Influencee Claude Bridge 2.0.0** (`wp-plugin/influencee-claude-bridge/`, zip in `consegne/plugin-wordpress/`,
istruzioni nel suo `LEGGIMI.md`). Chiave propria nell'intestazione `X-Claude-Key` (il server non la toglie),
all'attivazione aggiunge la riga di `.htaccess` per `Authorization`, comandi shell e scrittura nel database spenti di
base. Provato su un WordPress locale: installa e sovrascrive Core 2.2.11, Pagine 2.0.6, Tema 1.1.7, rifiuta chiavi
sbagliate, wp-config.php e percorsi fuori dal sito.

Uso da Claude (una richiesta alla volta):
- `GET /wp-json/claude/v1/info` → versioni, stato `.htaccess`, permessi accesi;
- `POST /wp-json/claude/v1/plugin/install` con JSON `{"zip": <base64>, "sha256": <hex>, "activate": true}`;
- `POST /wp-json/claude/v1/cache/flush`; registro in `GET /wp-json/claude/v1/log`.

## ⚠ Accesso con password per le applicazioni: NON funziona (verificato il 25/10/2026)

- `GET /wp-json/wp/v2/users/me?context=edit` → **401 `rest_not_logged_in`**, anche con credenziali finte inviate
  direttamente, anche su `www.influencee.it` e su `/?rest_route=` (dove il proxy non aggiunge niente). Con una password
  sbagliata WordPress risponderebbe `invalid_username`/`incorrect_password`: quindi **l'intestazione
  `Authorization` non arriva a PHP**, la toglie il server. Le password per le applicazioni sono attive
  (`/wp-json/` le dichiara). Il segreto di rete potrebbe essere giusto: non si può verificare finché il server la toglie.
- **Server MCP assente**: `/wp-json/mcp/mcp-adapter-default-server` → 404, nell'indice REST non c'è il namespace `mcp`
  (plugin MCP Adapter non attivo). Le abilità del Core si possono comunque eseguire dalla REST
  `/wp-json/wp-abilities/v1/...` una volta autenticati.
- **Cosa deve fare il titolare** (2 minuti, nessuno zip):
  1. *Impostazioni → Permalink → Salva le modifiche* senza cambiare nulla: WordPress riscrive il suo blocco del file
     `.htaccess`, che dalla versione 5.6 contiene la riga che passa l'intestazione a PHP.
  2. Controllo: *Strumenti → Salute del sito*: non deve più comparire l'avviso sull'intestazione «Authorization».
  3. Se l'avviso resta: dal file manager dell'hosting, in cima a `.htaccess` (fuori dai blocchi `# BEGIN …`):
     ```
     RewriteEngine On
     RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]
     ```
  4. Poi aprire una sessione nuova e riprovare la richiesta di prova qui sotto.

## Accesso al sito da Claude (come dovrebbe funzionare)

- Il titolare ha salvato il codice di **Influencee → Crea accesso per Claude** come **segreto di rete** dell'ambiente
  Influencee v2: sito `influencee.it`, percorso `/wp-json/`, intestazione `Authorization: Basic <codice>`.
  L'intestazione la aggiunge il proxy: le richieste a `https://influencee.it/wp-json/...` sono già autenticate,
  senza variabili d'ambiente e senza vedere il codice. Prova: `GET /wp-json/wp/v2/users/me?context=edit` deve dare 200.
  (Se invece esiste la variabile `INFLUENCEE_WP_AUTH`, va usata così com'è dopo `Authorization: Basic`.)
- Server MCP del sito: `https://influencee.it/wp-json/mcp/mcp-adapter-default-server`.
- Abilità del Core (`wp-plugin/influencee-core/includes/mcp-abilities.php`): `influencee/stato`, `influencee/pagine`,
  `influencee/articoli`, `influencee/redirect`, `influencee/svuota-cache`, `influencee/controlla-pagina`,
  `influencee/rimuovi-creator`, `influencee/aggiorna-plugin` (zip in base64 + sha256 + `conferma: true`).
- Anche la REST di WordPress (`/wp-json/wp/v2/...`) funziona con lo stesso accesso.
- Regole: una richiesta alla volta con pausa (il sito è lento, una scansione in parallelo lo ha già bloccato);
  disattivare prima di eliminare; per il bridge usare solo il nuovo Influencee Claude Bridge (il vecchio va eliminato);
  prima di cancellare qualcosa chiedere al titolare. Il titolare non vuole più caricare zip a mano.

## Revisione SEO/GEO/AEO di tutti gli articoli (31/10/2026) — Articoli 2.4.0

- Controllo degli 85 articoli (scratchpad/seo/audit.json): 32 con autore «influencee_admin», 51 non aggiornati dal
  2025, 29 senza immagini, 22 immagini senza alt, 34 senza fonti esterne, 54 senza H2 a domanda.
- Per tutti: autore tecnico → «Team Influencee»; Person con url /chi-siamo/; alt automatico (didascalia, sezione
  o titolo) e caricamento differito delle immagini del testo; title senza anno vecchio per /instagram-story-download/.
- Potenziati altri 13 articoli (in tutto 23, `includes/potenziamenti.php`), con due grafici di dati veri in
  `assets/grafici/` (costo post per fascia, engagement per fascia; fonti DeRev/ONIM, stime indicate).
- `faq_testo => false` per /guida-alla-verifica-su-tiktok-…/: le FAQ dell'articolo dicono che la verifica non si
  può chiedere, smentite dal centro assistenza TikTok. Da correggere nel testo.
- Immagini: cartella Drive «Influencee · Immagini articoli» (https://drive.google.com/drive/folders/1hoPmah8J59Xm3Z1O7kkRq6OTpU_Axj1P)
  con linee guida e prompt per ChatGPT dei 23 articoli; le immagini pronte vanno in «Immagini pronte» e poi in
  `assets/` del plugin Articoli con alt e didascalia.
- Da correggere nei testi (numeri senza fonte, refusi, dati superati): vedi i report dei lotti A e B in questa
  sessione — 10 idee Instagram (percentuali e caso «Sara»), verifica TikTok (percentuali, caso «Martina»),
  guadagnare con i social (tariffe senza fonte, refuso «Influecee»), 5 consigli fashion (refusi), Meta Business
  Suite («tutti i clienti in una sessione» contro l'aiuto ufficiale), cosa usano i tiktoker (Dubsmash chiusa,
  Premiere Rush dismessa). Il redirect del Core /come-calcolare-il-costo-degli-influencer/ → calcolatore (spento
  sul sito) cancellerebbe un articolo in 6ª posizione: decidere prima di accendere «redirects».

## Potenziamento di 10 articoli (30/10/2026) — Articoli 2.3.0

`wp-plugin/influencee-articoli/includes/potenziamenti.php`: per 10 articoli (Search Console: molte impressioni,
posizione 6–18) title e description sulle ricerche reali (Ubersuggest), «In breve» in apertura, nota di
aggiornamento dove i dati erano superati (TikTok Creator Fund → Creator Rewards Program), domande in più, link del
cluster, «Aggiornato il» e dateModified. Per tutti gli articoli: le FAQ scritte nel testo (details o h3) ora
entrano nei dati FAQPage. Da misurare in Search Console tra 3–4 settimane (posizione, CTR per pagina).
Da rivedere nei testi (non modificati): numeri non verificabili (es. «180K+ creator beauty»), funzioni di
Influencee descritte negli articoli (es. «audience quality score» in /migliori-app-gestione-follower/).

## ⚠ Verifica SEO del 29/10/2026 e versione del Core sul sito

- Sul sito gira **Core 2.2.18**, che non è in nessun ramo del repository (qui c'è 2.2.19, costruita su 2.2.16).
  Prima di installare: scaricare la cartella `influencee-core` del sito (o chiedere alla sessione che l'ha
  installata), confrontarla con questa e unire le differenze. Non sovrascrivere alla cieca.
- Esplorazione del sito (640 pagine seguendo i link): nessuna pagina raggiungibile manca dalla sitemap; 13 link
  interni a 404 e 27 a redirect (negli articoli); robots.txt senza riga Sitemap (plugin Simple Robots.txt);
  89 articoli senza Open Graph; 16 pagine con due `<title>` (testo incollato come pagina HTML intera);
  35 title oltre 60 caratteri; 5 profili creator doppi (`-2`); archivi /category/ senza canonical.
- Correzioni: **Core 2.2.19** (`includes/seo-fix.php`: 301 dei link rotti, link riscritti negli articoli,
  niente «indovina 404» di WordPress, creator doppi in 301 e fuori sitemap, /category/ noindex e fuori sitemap,
  blog con canonical/OG/dati strutturati; robots.txt con Sitemap), **Articoli 2.3.0** (un solo title, title
  SEO ≤ 60, 5 description riscritte, Open Graph), **Tema 1.1.8** (title e description incollati nel corpo tolti).
- Da controllare: 9 tool social (calendario editoriale, report social, piano editoriale, ecc.) oggi fanno
  redirect a /social-media-tool/ (li sta rifacendo un'altra sessione); `/social-media-tool-form/` risponde 200
  (redirect del Core spento? impostazione «redirects»).

## Da installare con il server MCP (27/10/2026)

Core **2.2.16** (server MCP, GA4, percorso nei lead di Tandem, redirect /creator-city|region|cat/, noindex tag e
autori, sitemap pulita), Annunci **1.3.1** (pagine «Lavoro content creator» per 6 città, anteprime, avvisi; grafica rifatta, file Figma https://www.figma.com/design/IllO8MdS5rt71UFuNRjpNk),
Pagine **2.0.7** (link da «Influencer <città>» a «Lavoro content creator <città>»), Tema 1.1.7. Poi impostazioni: `redirect_vecchie` = 1, `annunci` = 1, `annunci_anteprima` = 1;
svuota cache; controlla /creator-city/milano/ → 301, /offerte-lavoro-influencer/content-creator-milano/ 200,
/wp-sitemap.xml senza tag/utenti/offerte vecchie. Verifica completa del 27/10: 888 URL, nessun 404
(`scratchpad`, non salvata nel repo).

## Google Analytics 4 (27/10/2026)

- Il tag G-5BD025G8VP non era più sul sito (lo caricava Elementor o Header & Footer, spenti): da qualche giorno GA4
  non riceveva dati. **Core 2.2.12** lo carica da solo (`includes/ga4.php`) con Consent Mode v2 (tutto negato
  all'apertura), banner cookie Accetta/Rifiuta, linker verso app.influencee.it, niente tag per lo staff collegato.
  Impostazioni: Influencee → Impostazioni → «Google Analytics 4». Da controllare dopo l'installazione: un solo tag
  nella pagina (nessun altro plugin che lo carica) e in GA4 → Tempo reale le visite.

## Stato del sito (25/10/2026)

- Plugin sul sito: Core 2.2.10, Tema 1.1.6; da installare: **Core 2.2.11** (JavaScript delle pagine nuove), **Pagine 2.0.6** (cache delle liste dei creator + 10 pagine ex Elementor), **Tema 1.1.7** e,
  se non già fatto, Tools 2.0.2, Articoli 2.2.0, Annunci 1.1.1 (zip in `consegne/plugin-wordpress/`).
- Elementor **disattivato** (file ancora presenti). Le 14 pagine fatte con Elementor si vedono con il testo di riserva
  impaginato dal Tema (`template-pagina.php`); copia dell'HTML originale in
  `wp-plugin/elementor-copia/pagine-elementor-2026-10-22.json`.
- LiteSpeed Cache attivo (cache pagine, TTL 1 settimana, niente CDN, niente ottimizzazione CSS/JS, niente crawler).
  La CDN `cdn.influencee.it` non funziona in HTTPS: tenerla spenta in LiteSpeed.
- Gruppi «sostituzione» e «nuova» accesi; hub, regioni e città ora sono le pagine nuove (Core 2.2.10 passa davanti
  al plugin influencee-geo).
- Verifica completa del 23/10 in `seo-baseline/2026-10-23/`.

## Pagine ex Elementor: fatte nel codice il 25/10/2026 (seconda sessione)

10 pagine rifatte in `src/influencee/v2/` (agenzia in `pages.tsx`, le altre 9 in `v2/ex/`, una per file) e incluse
in **Pagine 2.0.6** (`dist-wp/influencee-pagine.zip`, da `node scripts/build-wp-plugin.mjs`): agenzia-influencer,
influencer, influencer-italiane, academy-influencer-marketing, chi-siamo, guide-e-risorse, tutorial-piattaforma-influencee,
contratto-social-media-influencer-ugc (di nuovo un editor funzionante), creator-manager, amministrazione-pagamenti-influencer.
Gruppo «sostituzione» (già acceso): **vanno online appena si installa Pagine 2.0.6**. Le 4 legali restano testo
WordPress impaginato dal Tema; **Tema 1.1.7** dà loro una description scritta a mano.

Testi riscritti solo sulle funzioni reali: tolti pagamenti in piattaforma, fatture, firma digitale, creator esterni,
note private, corsi in pausa, numeri non verificabili (4.000 brand, 6.000 creator), AI.

Domande per il titolare:
- `/chi-siamo/`: i 4 founders e le foto (2022/2024) sono attuali? `info@influencee.it` è ancora attiva?
- `/influencer-italiane/`: va bene citare influencer famose (Ferragni, Benedetta Rossi…) come informazione? Il filtro
  per genere non esiste: la pagina lo dice, e propone una selezione fatta a mano dal team.
- L'app ha ancora Creator Manager con creator esterni, documenti/fatture o richiesta fattura? Se sì, si aggiungono a
  creator-manager, amministrazione-pagamenti e tutorial.
- Contratto: clausole aggiunte (dati personali, foro) e frase fiscale sui pagamenti da far vedere a un legale/commercialista.
- `/guide-e-risorse/` linka `/benchmark-influencer-2026-i-nuovi-standard-del-mercato/` (il vecchio link
  `/benchmark-content-creator-2026-…/` non esiste più): è lo stesso articolo?

## Da fare appena c'è l'accesso

1. Controllo stato (`influencee/stato`) e versioni; installare con `influencee/aggiorna-plugin` gli zip mancanti
   (Pagine 2.0.5 per primo), poi `influencee/svuota-cache` e controllo di home, una categoria, una regione, un articolo.
2. **Le 14 pagine ex Elementor nel nuovo template** (agenzia-influencer, chi-siamo, influencer, influencer-italiane,
   academy, contratto, creator-manager, amministrazione-pagamenti, tutorial, guide-e-risorse, privacy, cookie,
   termini, extension-privacy): partire dai testi della copia, stesso URL, title/description/H1 coerenti con il
   piano SEO; le legali restano testo impaginato.
3. Impostazioni: «Pagine vecchie» accesa, poi «Metti in pausa» (17 pagine), Annunci «Servi le pagine».
4. Ricategorizzazione creator: `python3 scripts/creator/ricategorizza.py` (prova) poi `--scrivi` — solo le 20
   correzioni sicure; proposte dalla bio (`scripts/creator/proposta-ricategorizzazione.csv`) dopo l'ok del titolare.
   Da confermare: `lizasoberano` (non italiana), doppione `rubinarovini_official` / `-2`.
5. Plugin da disattivare (concordato): Influencee Header & Footer, Modular Page, il vecchio bridge Claude v1 (sostituito),
   Elementor MCP Composer. Elementor/Elementor Pro: eliminarli dopo che le 14 pagine sono nel nuovo template.

## Dopo

- App: branch `feat/annunci-bozze-sito` allineato a main (migration collab/0026, 0027, intelligence/0052), pronto per
  la PR; istruzioni in `appinfluencee/docs/guide/annunci-dal-sito.md` («Messa online passo passo»).
- Velocità: valutare Preact + animazioni CSS per dimezzare il JavaScript delle pagine nuove.
- WonderPush e tracciamento Brevo su tutte le pagine: chiedere al titolare se servono ancora.

## Lotto 1: 23 articoli riscritti (31/10/2026) — Articoli 2.5.0

Testi in `wp-plugin/influencee-articoli/riscritti/<slug>.html`, voci (title, description, «In breve», link) in
`riscritti/voci.php`, stato in `riscritti/stato.json`: tutti in **bozza**, visibili solo con `?anteprima=1`
(noindex, senza cache). Per pubblicare un articolo: `"stato": "pubblicato"` nella sua voce, versione su, build,
push. La voce di `voci.php` vale solo quando si vede il testo nuovo. Segnaposti immagine con quarto campo di
riserva (screenshot già caricati) nell'articolo Meta Business Suite. Da far controllare al commercialista:
/come-funziona-il-pagamento-degli-influencer/ (ritenute, forfettario, ATECO 73.11.03).

## Influencee Offerte 1.0.0 (01/11/2026) — al posto di WP Job Manager

Plugin a parte (`wp-plugin/influencee-offerte`, usa Core e Annunci). Menu «Offerte lavoro» in WordPress:
- il team inserisce le offerte con gli stessi campi dell'app (compenso, piattaforme, contenuti, città, scadenza);
  contatto dell'azienda riservato, mai sul sito;
- le offerte mandate dalle aziende da /pubblica-offerta-lavoro/ arrivano «da rivedere» (email all'admin) se
  l'app non le ha ricevute; se l'app le riceve, l'azienda le pubblica nell'app e arrivano dall'elenco dell'app;
- pagina per ogni offerta /offerte-lavoro-influencer/<offerta>/ (titolo, compenso, contenuti, inizio del brief;
  azienda e brief completo nell'app), «Candidati nell'app»; in bacheca, pagine città e sitemap;
- scadenza automatica; chiusa = «Offerta chiusa» noindex per 30 giorni, poi 301 a città o bacheca;
- «Importa e collega»: importa da WP Job Manager come bozze (default dal 01/01/2026: le 2 offerte del 2026);
  campo per l'indirizzo dell'app che riceve le offerte pubblicate (firma HMAC con il segreto di Annunci).
Annunci 1.4.0: filtro `infn_annunci_lista`, azione `infn_bozza_ricevuta`. Aggiornamenti 1.1.0: «installa» in
`aggiornamenti.json` aggiunge e attiva un plugin nuovo della famiglia (con ritiro se il sito si rompe).

Da fare: 1) importare le 2 offerte 2026 e controllarle; 2) disattivare WP Job Manager (poi eliminarlo, su
conferma); 3) nell'app: indirizzo che riceve le offerte del sito e restituisce il link dell'annuncio, elenco
pubblico degli annunci (annunci_feed), pagina di candidatura che legge ?offerta=; 4) JobPosting per Google solo
per offerte pagate con azienda visibile (oggi nessun dato strutturato di offerta: l'azienda è nascosta).
