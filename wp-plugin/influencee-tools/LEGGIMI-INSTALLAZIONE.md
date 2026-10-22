# Influencee Tools: installazione su influencee.it

Il plugin serve le pagine del nuovo sito con l'URL attuale, quindi il posizionamento su Google non si perde. Sono 158, in tre gruppi:

- **Tool (8), accesi:** fake follower, costo influencer, engagement rate, preventivo campagna, bacheca offerte, pubblica offerta, emoticon e hub dei tool.
- **Pagine nuove (22), accese:** prezzi, funzionalità, aziende, agenzie, micro influencer, UGC, campagne locali, creator verificati e professionisti, diventa creator, nuove categorie (tech, gaming, casa, motori, finanza, libri).
- **Sostituzioni (128), spente:** home, hub influencer italiani, 20 regioni, 92 città, categorie, piattaforma, contatti. Hanno traffico (14.287 clic in Search Console): si accendono dopo, un gruppo alla volta (vedi §4).

Header e footer restano quelli del sito. Se qualcosa non va, si spegne una pagina o tutto il plugin e torna la pagina di prima.

Tempo: circa 15 minuti. Serve un utente amministratore di WordPress.

## 1. Prima di iniziare

1. Fai un **backup** del sito dal pannello dell'hosting, o con il plugin di backup che usate.
2. Controlla che siano **attivi** tandem-forms e WP Job Manager.

## 2. Installazione

1. In WordPress apri **Plugin → Aggiungi nuovo → Carica plugin** e scegli `influencee-tools.zip`. In alternativa: File Manager dell'hosting → `wp-content/plugins/`, carica lo zip ed estrailo.
2. Clicca **Attiva**.
3. Apri **Impostazioni → Influencee Tools** e controlla la sezione "Stato":
   - ✅ tandem-forms attivo (i lead dei tool arrivano a tandem);
   - ✅ WP Job Manager attivo (la bacheca mostra le offerte reali degli ultimi 180 giorni).
4. Se usate una cache (LiteSpeed, WP Rocket, Cloudflare…), **svuotala**.

## 3. Controlli dopo l'attivazione (5 minuti)

Apri ogni pagina in una finestra in incognito:

| Pagina | Cosa controllare |
| --- | --- |
| `/followe-instagram-fake-follower/` | Il calcolatore risponde quando cambi i numeri |
| `/social-media-tool/costo-influencer/` | La stima cambia con i follower |
| `/come-calcolare-engagement-rate/` | Ci sono le schede "Engagement rate" e "Check sponsor" |
| `/preventivo-campagne/` | Il totale cambia; "Invia su WhatsApp" apre la chat al 351 342 1629 |
| `/offerte-lavoro-influencer/` | Compaiono le offerte recenti, non quelle del 2022 |
| `/pubblica-offerta-lavoro/` | Il form in 3 passi arriva a "Offerta ricevuta" |
| `/social-media-tool/emoticon-da-copiare/` | Un clic copia l'emoji |
| `/social-media-tool/` | Il filtro "Per creator" cambia i tool mostrati |
| `/prezzi/`, `/influencer-marketing-aziende/`, `/tech-influencers/` | Pagine nuove: in fondo c'è il modulo "Richiedi la demo" o "Ricevi la selezione" |

**Prova un lead**: compila il modulo in fondo a una pagina con un'email di prova e controlla che arrivi in tandem. Nel lead c'è anche il campo "risultato_tool", con il risultato del calcolo.

**Prova Google Analytics**: apri la pagina con `?debug_analytics` alla fine dell'indirizzo, poi GA4 → Amministrazione → DebugView. Usa un tool e invia il modulo: devono comparire gli eventi `calculator_use`, `form_submit` e `generate_lead`.

**Prova la SEO**: tasto destro → "Visualizza sorgente pagina". Deve esserci **un solo** `<title>`, la `meta description` e uno script `application/ld+json` con le FAQ. Poi controlla la pagina con il test dei risultati multimediali di Google: https://search.google.com/test/rich-results

## 4. Impostazioni

- **Gruppi**: ogni gruppo si accende o si spegne con una spunta. Dentro "Elenco" vedi tutte le pagine, con un pallino verde se sono attive.
- **Eccezioni**: un indirizzo per riga, per spegnere una sola pagina o per accenderne una sola di un gruppo spento.
- **Accendere le sostituzioni senza rischi**:
  1. Scrivi `/influencer-italiani/influencer-campania/influencer-napoli/` in "Pagine da accendere" e salva.
  2. Controlla la pagina e, per due settimane, in Search Console la query "influencer napoletani" (oggi in posizione 7).
  3. Se tiene o sale, accendi il gruppo "Sostituzioni" e metti la home tra le "Pagine da spegnere".
  4. Accendi la home per ultima.
- **Profili dei creator**: le pagine città, regione, categoria, hub e home mostrano i profili del tipo di contenuto "Creator": nome, handle, città, categoria e foto. **Le bio non si mostrano**, perché a volte contengono email e telefoni. Chi chiede la rimozione si toglie da WordPress (Creator → cestina).
- **Redirect 301 dei vecchi URL**: sono spenti all'inizio. Accendili dopo aver controllato le pagine. Mandano i vecchi URL doppi o rotti (`/social-media-tool-form/`, `/preventivi-influencer/`, `/tool-finanziario/`…) alla pagina giusta.
- **llms.txt**: il plugin pubblica `https://influencee.it/llms.txt`, la descrizione del sito per i motori AI (GEO).

## 5. Google Analytics 4 (una volta sola)

1. **Proprietà**: GA4 `G-5BD025G8VP`, già installata nel sito. Il plugin non aggiunge un secondo tag.
2. **Dimensioni personalizzate**: Amministrazione → Definizioni personalizzate, ambito evento. Aggiungi queste, se non ci sono:
   - `page_type`, `audience`, `lead_source`, `form_name`;
   - `calculator`, `result_band`, `tier`, `tool`, `action`;
   - `cta_location`, `section_name`, `link_type`, `link_text`.
3. **Evento chiave**: segna `generate_lead`. In GA4 il lead si legge così:

| `lead_source` | Pagina | Chi è |
| --- | --- | --- |
| `lead_preventivo_campagna` | preventivo | azienda che vuole la campagna gestita (vale di più) |
| `lead_fake_follower`, `lead_costo_influencer`, `lead_engagement_rate` | tool per brand | azienda che sta scegliendo un creator |
| `lead_pubblica_offerta` | pubblica offerta | azienda con un'offerta pronta |
| `lead_offerte_lavoro` | bacheca | creator che vuole le offerte della sua categoria |
| `lead_emoticon`, `lead_hub_tool` | tool gratuiti | contatto per la newsletter dei nuovi tool |
| `lead_creator_citta`, `lead_creator_regione`, `lead_creator_categoria`, `lead_creator_hub` | città, regioni, categorie, hub | azienda che cerca creator di una zona o di un settore |
| `lead_creator_profilo` | pagine `/creator/…` (se accese) | azienda che vuole collaborare con quel creator: nel campo "risultato" arrivano nome, handle, categoria e città |
| `lead_demo`, `lead_demo_home`, `lead_demo_contatti` | pagine brand, home, contatti | richiesta di demo |
| `lead_creator_avvisi` | diventa creator, UGC creator | creator che vuole le offerte della sua categoria |
| `whatsapp_click` | ovunque | richiesta diretta su WhatsApp |

## 6. Da fare su WordPress (fuori dal plugin)

- [ ] **Pixel Meta**: togliere le graffe dall'ID, `fbq('init','595078877779895')`. Oggi non registra niente.
- [ ] **Banner cookie**: oggi il sito non ne mostra uno, ma GA4 e il Pixel sono attivi. In Italia serve un banner con "Accetta" e "Rifiuta" (Consent Mode v2), per esempio Complianz o Cookiebot.
- [ ] **Menù**:
  - la voce "Free Social Media Tool" deve puntare a `/social-media-tool/`, non a `/social-media-tool-form/`;
  - aggiungi le pagine nuove: Prezzi `/prezzi/`, Per le aziende `/influencer-marketing-aziende/`, Per le agenzie `/piattaforma-agenzie/`, Funzionalità `/funzionalita/database-influencer/`, Diventa creator `/diventa-creator/`.
- [ ] **Link a doppio senso**: dalla pagina `/agenzia-influencer/` aggiungi un pulsante "Calcola il preventivo" verso `/preventivo-campagne/`.
- [ ] **WP Job Manager**: in Impostazioni → Offerte, attiva "Nascondi le offerte scadute" e chiudi le offerte del 2021–2022.
- [ ] **Chi risponde ai lead**:
  - in tandem i lead dei tool hanno il nome "Lead tool: …";
  - chi lascia l'email nella bacheca aspetta le offerte della sua categoria;
  - chi la lascia nelle emoticon e nell'hub aspetta l'avviso dei nuovi tool.
  
  Serve una persona o un'automazione (Brevo) che li segua.
- [ ] **Numero di clienti**: in alcune pagine WordPress c'è "+4.000", nel sito nuovo "+5.000". Va scelto il numero vero.

## 7. Aggiornare il plugin

Il contenuto delle pagine viene dal sito v2 (`src/influencee/v2/`). Dopo una modifica al sito v2:

```
node scripts/build-wp-plugin.mjs
```

Ne esce un nuovo `dist-wp/influencee-tools.zip`. In WordPress si carica sopra la versione attuale: Plugin → Aggiungi nuovo → Carica plugin → "Sostituisci quella installata".

## 8. Tornare indietro

**Plugin → Influencee Tools → Disattiva.** Le pagine tornano subito come prima: il plugin non modifica né cancella le pagine WordPress.

## 9. Collegare Claude al sito (MCP)

Dalla versione 1.1.0 il plugin aggiunge 6 azioni al server MCP già presente nel sito (`https://influencee.it/wp-json/mcp/mcp-adapter-default-server`, plugin "MCP Adapter"). Così Claude può gestire i rilasci senza avere accesso a tutto il server.

| Azione | Cosa fa | Modifica il sito? |
| --- | --- | --- |
| `influencee/stato` | gruppi accesi, pagine attive, eccezioni, plugin collegati | no |
| `influencee/pagine` | accende o spegne un gruppo o singole pagine | sì, reversibile |
| `influencee/redirect` | attiva o disattiva i 301 | sì, reversibile |
| `influencee/svuota-cache` | svuota LiteSpeed e la cache di WordPress | no |
| `influencee/controlla-pagina` | title, description, H1, dati strutturati, profili e moduli di un URL | no |
| `influencee/rimuovi-creator` | sposta nel cestino un profilo, solo con conferma | sì, recuperabile per 30 giorni |

**Sicurezza**
- **Chi può usarle:** ogni azione richiede il ruolo amministratore. Il plugin alza a "solo amministratori" anche l'accesso all'intero server MCP: di default WordPress lo apre a qualunque utente iscritto.
- **Cosa non possono fare:** niente comandi, file o database.
- **Registro:** in Impostazioni → Influencee Tools → "Ultime azioni eseguite via MCP" trovi chi ha fatto cosa e quando.
- **Interfaccia `claude/v1`:** il sito ne ha già una con comandi, file e database. È protetta da password, ma è meglio **non collegarla** a un assistente: se qualcosa va storto i danni possono essere seri. Valutate di disattivarla se non la usate.

**Come si collega (una volta sola)**
1. Impostazioni → Influencee Tools → **Crea accesso per Claude**. Copia il valore che compare: si vede una sola volta.
2. In Claude Code apri le impostazioni dell'ambiente (menù dell'ambiente nel titolo della sessione → Modifica). Aggiungi la variabile d'ambiente `INFLUENCEE_WP_AUTH` con quel valore. **Non incollarlo in chat.**
3. Nel repository aggiungi questi due file. Per sicurezza Claude non li crea da solo, perché aprirebbero una connessione per sé stesso; puoi chiedermi di farlo e approvare.

`.mcp.json`
```json
{
  "mcpServers": {
    "influencee-wp": {
      "type": "http",
      "url": "https://influencee.it/wp-json/mcp/mcp-adapter-default-server",
      "headers": { "Authorization": "Basic ${INFLUENCEE_WP_AUTH}" }
    }
  }
}
```

`.claude/settings.json`
```json
{ "enabledMcpjsonServers": ["influencee-wp"] }
```

4. Apri una nuova sessione: Claude vede gli strumenti di `influencee-wp`.
5. Per togliere l'accesso: **Revoca accesso** nella stessa pagina. L'accesso smette di funzionare subito.

## 10. Privacy dei profili creator (versione 1.1.0)

Le bio dei profili, copiate da Instagram, contengono a volte email e numeri di telefono. Oggi sono leggibili da chiunque, senza password, in tre punti:
- `/wp-json/igm/v1/creators`: 325 profili, con 39 email e un telefono;
- `/wp-json/wp/v2/creator`;
- le pagine `/creator/…`, comprese nei dati strutturati.

Con l'opzione **Privacy** (accesa di default), per chi non è redattore email e telefoni diventano "[contatto rimosso]". Gli amministratori e i redattori vedono ancora la bio completa.

## 11. Pagine profilo dei creator con la nuova grafica (versione 1.2.0)

Le 325 pagine `/creator/<nome>/` possono usare la stessa grafica delle altre pagine. **I profili restano gestiti dal plugin dei creator del sito**: cambia solo come si vedono.

**Come accenderle:** Impostazioni → Influencee Tools → *Profili dei creator* → spunta **"Pagine profilo con la nuova grafica"** → Salva. Spegnendo la casella torna subito la pagina di prima.

**Cosa mostra ogni pagina:**
- foto, nome, @handle, categoria, città, follower, fascia (Nano…Mega);
- il prezzo indicato dal creator, se c'è;
- engagement medio e costo medio della fascia (fonti ONIM e DeRev, le stesse del calcolatore);
- la bio senza email e telefoni;
- il modulo **"Vuoi collaborare con …?"**, che arriva in tandem come `lead_creator_profilo`;
- altri creator della stessa zona e FAQ.

**SEO:**
- titolo tipo "Nome (@handle): influencer food a Milano", al massimo 60 caratteri;
- description;
- dati strutturati `ProfilePage` con la persona, il percorso (Home › Influencer italiani › regione › città) e le FAQ, uguali al testo visibile.

**Dati:** il plugin legge i dati dal plugin dei creator (`/igm/v1/creators`) e li tiene in memoria per un'ora. Dopo aver modificato un profilo, usa "Svuota cache" o attendi un'ora.

**Prima di accenderle per tutti:** apri 3–4 profili (uno con foto e prezzo, uno senza città) e controlla che i dati siano giusti.

## 12. Elenco completo dei creator con filtri (pagina /influencer-italiani/)

La pagina `/influencer-italiani/` mostra tutti i profili pubblicati, non solo una selezione. Si può:
- cercare per nome, @handle o città;
- filtrare per categoria, regione e fascia di follower (Nano…Mega);
- caricare altri 24 profili con "Mostra altri".

Se una ricerca non trova nessun creator, la pagina propone il modulo "Ricevi la selezione", che arriva in tandem.

- **Google** legge i primi 24 profili già nell'HTML. Gli altri restano raggiungibili dalle pagine città, regione e categoria.
- **Privacy:** nell'elenco ci sono solo nome, foto, handle, follower, città e categoria, mai bio o contatti.
- **Aggiornamento:** l'elenco si ricarica da solo quando modifichi o cestini un profilo. Altrimenti si aggiorna ogni ora.
- **GA4:** ogni ricerca manda l'evento `tool_filter` con `tool_name=elenco_creator`, i filtri usati e il numero di risultati. Così vedi cosa cercano le aziende, per esempio "food in Campania", e dove mancano creator.
- **Come accenderla:** la pagina fa parte del gruppo "sostituzione". Per provarla da sola, scrivi `/influencer-italiani/` nel riquadro "Pagine da accendere" delle impostazioni.

**Design (versione 1.2.1):** scheda, listing e profilo seguono il design del sito già costruito, il catalogo dei moduli con i profili reali di influencee.it:
- **scheda:** fascia magenta→nero con la categoria, foto tonda sovrapposta, nome e @handle, sotto follower · fascia · città;
- **listing:** ricerca, nicchie a pillole, colonna filtri (Dimensione, Regione, Città, Ordina per, Azzera filtri) e "N creator trovati · profili reali da influencee.it";
- **profilo:** hero nero centrato con la foto contornata di verde acido, pillole, tre numeri e i pulsanti "Proponi una collaborazione" e "Invitalo a una campagna" (link campaign.influencee.it del creator), poi "Creator simili".

Rispetto al design originale non vengono mostrati né il badge "Verificato" né "match" ed engagement del singolo creator, perché questi dati non sono nel sito.

## 13. Articoli del blog col nuovo modello (versione 1.3.0)

Gli 85 articoli restano in WordPress e si scrivono come sempre. Il plugin cambia solo come si vedono.

**Struttura:**
- **HTML5 pulito:** tutto il testo è già nella pagina, quindi Google, ChatGPT, Gemini e Claude lo leggono senza eseguire JavaScript.
- **CSS:** un solo file piccolo (`assets/articolo.css`).
- **JavaScript minimo:** solo per Analytics, il pulsante "Copia il link", la conferma del modulo e l'indice che segue la lettura.
- **Elementor spento SOLO sugli articoli accesi:** i suoi file CSS e JavaScript non vengono caricati e i suoi contenitori vengono tolti dal testo. Gli articoli Elementor usano solo testo, HTML e titoli, quindi non si rompe nulla. L'header e il footer Elementor, già nascosti dal sito, vengono tolti dalla pagina; resta quello del plugin header/footer.

**Ogni articolo ha:**
- testata col design del sito: categoria, titolo, sottotitolo, autore, data di aggiornamento e minuti di lettura;
- indice laterale, FAQ visibili, box autore;
- modulo "Ti mandiamo i creator adatti alla tua campagna", che arriva in tandem come `lead_articolo` con il titolo dell'articolo;
- articoli correlati;
- dati strutturati `BlogPosting` + autore (con ruolo, es. "CEO @ Influencee.it") + `BreadcrumbList` + `FAQPage`;
- canonical e immagine di anteprima se mancano.

Titolo e description restano quelli del plugin SEO del sito.

**Articoli col vecchio modello interno "ifn-post" (26):**
- dal testo si recuperano autore, ruolo, foto, sottotitolo e immagine;
- si tolgono i doppioni: percorso, titolo ripetuto, vecchio indice, vecchi correlati;
- "In breve", numeri, casi reali, CTA e FAQ prendono il design del sito;
- mockup e illustrazioni mantengono il loro CSS.

**Caratteri rovinati:** in `/come-diventare-influencer-tiktok-2026/` (43 caratteri tipo "Ã¨" o "Â·") vengono corretti automaticamente quando la pagina viene mostrata. Il testo in WordPress resta com'è.

**Come accenderli:** Impostazioni → Influencee Tools → *Articoli del blog*.
1. Scegli "Solo gli articoli elencati" e scrivi 2 o 3 articoli con poco traffico.
2. Controlla le pagine.
3. Passa a "Tutti". Per escludere un articolo, scrivilo in "Articoli da escludere".

Gli articoli che sono anche pagine tool (`/followe-instagram-fake-follower/`, `/come-calcolare-engagement-rate/`) restano tool.

**Redirect proposti per articoli doppi** (da incollare in *Redirect aggiuntivi* e poi attivare i redirect):

```
/come-diventare-influencer-tiktok-2026/ -> /come-diventare-influencer-su-tiktok-nel-2026/
/come-creare-un-piano-editoriale-professionale/ -> /come-presentare-il-piano-editoriale-in-modo-professionale/
/come-calcolare-costo-influencer/ -> /social-media-tool/costo-influencer/   (già nei redirect di base)
```

- **TikTok:** il primo dei due articoli, pubblicato due giorni dopo, ha caratteri rovinati e un mockup senza grafica. Si tiene il secondo.
- **Piano editoriale:** l'articolo da chiudere ha 0 clic e posizione 19,8; quello che resta ha 1 clic e posizione 7,4 (Search Console).

## 14. Aggiornare il plugin da Claude (MCP)

Dalla versione 1.3.0 c'è l'azione MCP `influencee/aggiorna-plugin`. Dopo questa installazione fatta a mano, Claude può caricare le versioni nuove da solo, con questi controlli:
- accetta solo lo zip di Influencee Tools (cartella `influencee-tools/`, file principale "Plugin Name: Influencee Tools");
- accetta lo zip solo se l'impronta sha256 coincide con quella inviata;
- solo per amministratori, e serve `conferma: true`;
- il plugin resta attivo con le stesse impostazioni;
- ogni azione finisce nel registro MCP delle impostazioni.

Per collegare Claude serve l'accesso del §9 ("Crea accesso per Claude" → variabile `INFLUENCEE_WP_AUTH` nell'ambiente). Con l'azione `influencee/articoli` Claude può anche accendere o spegnere articoli e aggiungere redirect.
