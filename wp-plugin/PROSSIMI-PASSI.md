# Lavori in corso e prossimi passi (aggiornato il 27/10/2026)

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
