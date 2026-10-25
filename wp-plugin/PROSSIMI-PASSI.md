# Lavori in corso e prossimi passi (25/10/2026)

Nota per riprendere il lavoro in una sessione nuova di Claude Code (ambiente **Influencee v2**).

## Accesso al sito da Claude

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
  disattivare prima di eliminare; non usare il bridge `claude/v1` (esegue comandi sul server: va spento);
  prima di cancellare qualcosa chiedere al titolare. Il titolare non vuole più caricare zip a mano.

## Stato del sito (25/10/2026)

- Plugin sul sito: Core 2.2.10, Tema 1.1.6; da installare: **Pagine 2.0.5** (cache delle liste dei creator) e,
  se non già fatto, Tools 2.0.2, Articoli 2.2.0, Annunci 1.1.1 (zip in `consegne/plugin-wordpress/`).
- Elementor **disattivato** (file ancora presenti). Le 14 pagine fatte con Elementor si vedono con il testo di riserva
  impaginato dal Tema (`template-pagina.php`); copia dell'HTML originale in
  `wp-plugin/elementor-copia/pagine-elementor-2026-10-22.json`.
- LiteSpeed Cache attivo (cache pagine, TTL 1 settimana, niente CDN, niente ottimizzazione CSS/JS, niente crawler).
  La CDN `cdn.influencee.it` non funziona in HTTPS: tenerla spenta in LiteSpeed.
- Gruppi «sostituzione» e «nuova» accesi; hub, regioni e città ora sono le pagine nuove (Core 2.2.10 passa davanti
  al plugin influencee-geo).
- Verifica completa del 23/10 in `seo-baseline/2026-10-23/`.

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
5. Plugin da disattivare (concordato): Influencee Header & Footer, Modular Page, Claude v1 (bridge),
   Elementor MCP Composer. Elementor/Elementor Pro: eliminarli dopo che le 14 pagine sono nel nuovo template.

## Dopo

- App: branch `feat/annunci-bozze-sito` allineato a main (migration collab/0026, 0027, intelligence/0052), pronto per
  la PR; istruzioni in `appinfluencee/docs/guide/annunci-dal-sito.md` («Messa online passo passo»).
- Velocità: valutare Preact + animazioni CSS per dimezzare il JavaScript delle pagine nuove.
- WonderPush e tracciamento Brevo su tutte le pagine: chiedere al titolare se servono ancora.
