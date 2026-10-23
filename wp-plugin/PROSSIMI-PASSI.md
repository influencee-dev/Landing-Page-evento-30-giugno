# Lavori in corso e prossimi passi (23/10/2026)

Nota per riprendere il lavoro in una sessione nuova di Claude Code.

## Accesso al sito da Claude

- Variabile d'ambiente `INFLUENCEE_WP_AUTH` = il valore mostrato da **Influencee → Crea accesso per Claude**
  (è già `utente:password` in base64: si usa così com'è dopo `Authorization: Basic`). Va salvata nelle impostazioni dell'ambiente, mai in chat né nel codice.
- Server MCP del sito: `https://influencee.it/wp-json/mcp/mcp-adapter-default-server` (Basic auth con la variabile).
- Abilità del Core (`wp-plugin/influencee-core/includes/mcp-abilities.php`): `influencee/stato`, `influencee/pagine`,
  `influencee/articoli`, `influencee/redirect`, `influencee/svuota-cache`, `influencee/controlla-pagina`,
  `influencee/rimuovi-creator`, `influencee/aggiorna-plugin` (zip in base64 + sha256 + `conferma: true`).
- Anche la REST di WordPress (`/wp-json/wp/v2/...`) funziona con la stessa variabile.
- Regole: una richiesta alla volta con pausa (il sito è lento, una scansione in parallelo lo ha già bloccato);
  disattivare prima di eliminare; non usare il bridge `claude/v1` (esegue comandi sul server: va spento).

## Da fare appena c'è l'accesso

1. **Aggiornare i plugin dal repository**: `node scripts/build-wp-plugin.mjs`, poi `influencee/aggiorna-plugin` per
   ogni zip cambiato (Core per primo), poi `influencee/svuota-cache`, poi controllo di home, una categoria, un articolo.
2. **Ricategorizzazione dei creator**: `python3 scripts/creator/ricategorizza.py` (prova) e poi `--scrivi`.
   Applica solo le 20 correzioni sicure (doppioni uniti, famiglia aggiunta dove manca).
   Le proposte dalla bio (`scripts/creator/proposta-ricategorizzazione.csv`, colonne «famiglia suggerita da bio» e
   specialità con «?») solo dopo l'ok del titolare.
   Da confermare col titolare prima di toglierli: `lizasoberano` (non sembra italiana), doppione
   `rubinarovini_official` / `rubinarovini_official-2`.
3. **Plugin da disattivare** (già concordato): Influencee Header & Footer, Modular Page, Claude v1 (bridge),
   Elementor MCP Composer. Non toccare Elementor, Elementor Pro, WP Job Manager, Brevo finché non indicato.

## Lavoro successivo

- **Convertitore Elementor → HTML5** (fase 2 di `PIANO-SENZA-ELEMENTOR.md`): pagina Influencee → Conversione,
  copia di sicurezza dei dati Elementor e «Torna a Elementor», controllo prima/dopo di title, description, H1, H2,
  parole, link e immagini. Quando nessuna pagina usa più Elementor: spegnere Elementor Pro ed Elementor.
- **Annunci**: casella «Servi le pagine» da accendere; WP Job Manager resta finché l'app non pubblica l'elenco annunci
  e i redirect delle offerte vecchie non sono accesi.
- Immagini vere al posto dei disegni in HTML5 nelle pagine v2 (quando il titolare le manda).
