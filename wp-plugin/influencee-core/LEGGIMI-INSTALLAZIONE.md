# Plugin Influencee per influencee.it: installazione e impostazioni

Versione 2 (22/10/2026). I plugin sono cinque, ognuno col suo compito. Tutti usano **Influencee Core**.

| Plugin | Cosa fa | Pagine |
|---|---|---|
| **Influencee Core** | Base comune. SEO, GEO e AEO: title, description, canonical, dati strutturati, `llms.txt`. Tracciamento GA4. CSS e JavaScript condivisi. Redirect 301. Impostazioni e accesso MCP per Claude. Nessuna pagina propria. | — |
| **Influencee Tools** | I tool gratuiti, senza offerte di lavoro | 6: `/social-media-tool/`, fake follower, costo influencer, engagement rate, preventivo, emoticon |
| **Influencee Pagine** | Le pagine del sito col design nuovo, i profili creator e l'elenco con filtri | 150: home, influencer italiani, regioni, città, categorie, piattaforma, prezzi, contatti… e `/creator/…` |
| **Influencee Articoli** | Gli articoli del blog in HTML5 leggero, senza Elementor | gli 85 articoli, con gli indirizzi di oggi |
| **Influencee Annunci** | Le offerte di lavoro collegate ad app.influencee.it | `/offerte-lavoro-influencer/`, `/pubblica-offerta-lavoro/` |

Ogni plugin si accende e si spegne da solo. Le impostazioni sono tutte in un'unica pagina: menu **Influencee** a sinistra, in WordPress.

---

## 1. Prima di iniziare

- Fai un **backup** del sito, dal pannello dell'hosting o col plugin di backup.
- Il sito oggi è lento: ogni pagina non in cache impiega 6–12 secondi. Se il caricamento dei plugin dall'area admin non va a buon fine, usa il **File Manager** dell'hosting (punto 2B).

## 2. Installazione

**Ordine: prima Core, poi gli altri.** Senza Core gli altri mostrano un avviso e restano fermi.

### 2A. Dall'area admin
1. Plugin → Aggiungi nuovo → **Carica plugin** → `influencee-core.zip` → Installa → Attiva.
2. Ripeti con `influencee-tools.zip`, `influencee-pagine.zip`, `influencee-articoli.zip`, `influencee-annunci.zip`.

### 2B. Dal File Manager dell'hosting (se l'area admin è troppo lenta)
1. Apri `wp-content/plugins/`.
2. Carica i 5 zip ed estraili lì: si creano 5 cartelle `influencee-…`.
3. In WordPress, Plugin → attiva prima **Influencee Core**, poi gli altri.

### Se avevi già "Influencee Tools" 1.x
- La vecchia cartella `influencee-tools` va **sostituita** dalla nuova, che contiene solo i tool. Rinomina la vecchia in `influencee-tools-vecchio` e caricala solo dopo aver verificato che tutto funziona.
- **Le impostazioni restano:** pagine accese, eccezioni, articoli, profili e redirect sono salvati nello stesso posto.
- Le impostazioni non sono più in Impostazioni → Influencee Tools ma nel menu **Influencee**. Il vecchio indirizzo porta lì da solo.

## 3. Impostazioni (menu Influencee)

In alto vedi quali plugin sono attivi e se tandem-forms riceve i lead.

### Pagine (Tools e Pagine)
- **Tool gratuiti:** accesi all'installazione.
- **Pagine nuove:** accese all'installazione. Sono indirizzi che oggi su WordPress non esistono.
- **Sostituzioni:** spente all'installazione. Sostituiscono pagine che hanno traffico.
- **Eccezioni:** puoi spegnere o accendere singole pagine, una per riga.
- **Ordine consigliato per le sostituzioni:**
  1. Accendi solo Napoli: `/influencer-italiani/influencer-campania/influencer-napoli/` in "Pagine da accendere".
  2. Controlla per 2 settimane in Search Console, per esempio la ricerca "influencer napoletani".
  3. Accendi il gruppo, con la home tra le "Pagine da spegnere".
  4. Accendi la home per ultima.

### Offerte di lavoro (Annunci)
- **Servi le pagine:** la casella è spenta all'installazione. Accendila e la bacheca e "Pubblica un'offerta" sostituiscono le pagine di WP Job Manager. Spegnendola tornano quelle di prima.
- **Elenco annunci dell'app:** lascia vuoto finché l'app non lo espone (vedi punto 6). Nel frattempo la bacheca mostra le offerte di WP Job Manager degli ultimi 180 giorni; se non ce ne sono, invita a pubblicare e a iscriversi come creator.
- **Ricezione bozze nell'app + segreto:** da compilare quando l'app avrà il collegamento (punto 6).
  - **Senza collegamento:** l'offerta si salva in WordPress (menu Influencee → **Bozze annunci**), il lead va in tandem, il brand riceve un'email di riepilogo e crea l'account sull'app.
  - **Con collegamento:** l'offerta va nell'app e il brand sceglie solo la password per pubblicare.
- **Redirect delle offerte vecchie:** le offerte WP Job Manager scadute o del 2021–2022 vanno alla bacheca con un 301. Accendila dopo aver acceso le pagine.

### Articoli del blog (Articoli)
Le scelte sono tre: spenti, solo alcuni (per provare) o tutti.
1. Prova con 2 o 3 articoli con poco traffico.
2. Passa a "Tutti".
3. Escludi quelli che vuoi lasciare come sono.

Gli articoli che sono anche tool, cioè fake follower ed engagement rate, restano tool.

### Profili dei creator (Pagine)
- **Profili nelle liste:** nome, foto, handle, città, categoria; mai la bio.
- **Pagine profilo `/creator/…` col design nuovo:** spente all'installazione. Spegnendo la casella torna subito la pagina di prima.
- **Privacy:** toglie email e telefoni dalle bio, nelle API e nelle pagine pubbliche.

### Redirect 301
- Sono spenti all'installazione.
- **Redirect di base:** vecchi URL doppi o rotti verso la pagina giusta.
- **Redirect aggiuntivi:** uno per riga, per esempio gli articoli doppi:
  ```
  /come-diventare-influencer-tiktok-2026/ -> /come-diventare-influencer-su-tiktok-nel-2026/
  /come-creare-un-piano-editoriale-professionale/ -> /come-presentare-il-piano-editoriale-in-modo-professionale/
  ```

## 4. Il percorso "Pubblica un'offerta" (Annunci)

L'account si crea **alla fine**. I dati dell'iscrizione all'app sono mescolati con quelli dell'offerta:

| Passo | Campi | Uguali all'app |
|---|---|---|
| 1. La tua attività | tipo (azienda o negozio, e-commerce, agenzia), nome, città, sito | iscrizione brand: tipo, città |
| 2. L'offerta | titolo, cosa chiedi, piattaforme | annuncio veloce |
| 3. Compenso e contenuti | cosa offri (compenso €, cambio merce, % sulle vendite) e il suo campo; contenuto (piattaforma, tipo, quanti, giorni); candidature entro; quanti creator; città dei creator; pagina del prodotto | annuncio veloce |
| 4. Dati per fatture e contratti | **partita IVA** (paese + 11 cifre controllate) **oppure codice fiscale** per chi non ha la partita IVA (16 caratteri controllati, o 11 cifre per le associazioni); ragione sociale (facoltativa senza P.IVA), nome, cognome, ruolo, telefono + **scelta dei creator bloccata** ("si sblocca nell'app") | iscrizione brand: azienda e referente |
| 5. Account e pubblicazione | riepilogo, email di lavoro, consenso facoltativo alle novità | — |

**Decisioni (22/10/2026):** sono ammessi i brand senza partita IVA, con codice fiscale; l'offerta va online **subito**, senza revisione dello staff.

Dopo l'invio, il brand va su app.influencee.it e crea l'account **con email e password**.
- **La password non passa da WordPress:** si sceglie sul sito dell'app, che è più sicuro.
- **Accesso con Google:** è il passo successivo, sulla stessa pagina dell'app (l'app usa già Google per i creator).

**Protezioni:** campo trappola per i robot, tempo minimo di compilazione, al massimo 5 invii l'ora per indirizzo IP, stessi controlli dell'app anche sul server.

## 5. Google Analytics 4 (una volta sola)

1. **Proprietà:** GA4 `G-5BD025G8VP`, già installata nel sito. I plugin non aggiungono un secondo tag.
2. **Dimensioni personalizzate:** Amministrazione → Definizioni personalizzate, ambito evento. Aggiungi quelle che mancano:
   - `page_type`, `audience`, `lead_source`, `form_name`;
   - `cta_location`, `section_name`, `link_type`, `link_text`;
   - `calculator`, `tool`, `step`, `compenso`, `percent_scrolled`.
3. **Evento chiave:** segna `generate_lead`.

| `lead_source` | Dove | Chi è |
|---|---|---|
| `lead_pubblica_offerta` | Pubblica un'offerta (Annunci) | azienda con un'offerta pronta; nel lead ci sono anche P.IVA e referente |
| `lead_preventivo_campagna` | preventivo (Tools) | azienda che vuole la campagna gestita |
| `lead_fake_follower`, `lead_costo_influencer`, `lead_engagement_rate` | tool per brand | azienda che sta scegliendo un creator |
| `lead_emoticon`, `lead_hub_tool` | tool gratuiti | contatto per la newsletter dei nuovi tool |
| `lead_creator_citta`, `lead_creator_regione`, `lead_creator_categoria`, `lead_creator_hub` | Pagine | azienda che cerca creator di una zona o di un settore |
| `lead_creator_profilo` | profili `/creator/…` | azienda che vuole quel creator |
| `lead_articolo` | articoli | lettore che chiede una selezione di creator; nel lead c'è il titolo dell'articolo |
| `lead_demo`, `lead_demo_home`, `lead_demo_contatti` | pagine brand, home, contatti | richiesta di demo |
| `whatsapp_click` | ovunque | richiesta diretta su WhatsApp |

4. **Imbuto delle offerte:**
   - `post_job_click` (dalla bacheca);
   - `post_job_step` (con `step` da 1 a 5: si vede dove si fermano);
   - `generate_lead` (`lead_pubblica_offerta`);
   - `post_job_done`;
   - `claim_click` (verso l'app).

   Nell'app, i brand arrivati così hanno la provenienza "Annunci".

## 6. Collegamento con l'app

Fatto nel repository `appinfluencee` (piano `docs/plans/2026-10-22-annunci-dal-sito.md`), sui branch
`feat/annunci-elenco-json` e `feat/annunci-bozze-sito`. Gli interruttori partono spenti: si accendono quando i branch
sono in produzione.

1. **Elenco degli annunci aperti** `https://app.influencee.it/annunci/elenco.json` (switch `annunci.elenco_sito`):
   ```json
   {"annunci":[{"uuid":"…","title":"…","brief":"…","org_name":"…","platforms":["instagram"],"kind":"paid_fee","fee_amount":250,"product_desc":"","product_value":null,"commission_pct":null,"deliverables":[{"platform":"instagram","content_type":"reel","qty":2,"due_days":14}],"citta":"Milano","max_creators":3,"apply_by":"2026-11-30","published_at":"2026-10-22T10:00:00Z","url":"https://app.influencee.it/annunci/<uuid>/"}]}
   ```
   Solo i dati già pubblici nella bacheca. Con lo stesso switch la pagina dell'annuncio nell'app ha i dati JobPosting
   per Google, solo per gli annunci con compenso in denaro.
2. **Ricezione delle bozze** `POST https://app.influencee.it/annunci/bozze/` (switch `annunci.bozze_sito`):
   - corpo JSON `{versione, id_sito, creata, fonte:"sito_offerta", bozza:{…campi del percorso…}}`;
   - intestazioni `X-Influencee-Timestamp` e `X-Influencee-Signature: sha256=HMAC_SHA256(timestamp + "." + corpo, segreto)`;
   - risposta `{"ok":true,"claim_url":"https://app.influencee.it/annunci/bozza/<token>/"}`, oppure `422` con
     `{"campi":{"piva":"…"}}`: il sito mostra l'errore sul campo giusto (per esempio partita IVA già di un altro account).

   Il link mostra il riepilogo e chiede solo la password: l'account si crea e l'annuncio va online subito. Se l'email
   ha già un account brand, si accede e si conferma.

**Il segreto:** stesso valore nei due posti.
- App: variabile d'ambiente `ANNUNCI_SITO_SECRET` sul server.
- WordPress: in `wp-config.php` `define( 'INFLUENCEE_ANNUNCI_SECRET', '…' );`.

**Per accendere tutto, in ordine:**
1. pubblicare i due branch dell'app (con `deploy/migrate.sh`);
2. mettere il segreto nell'app e in `wp-config.php`;
3. Admin dell'app → Waffle → Switches: accendere `annunci.elenco_sito` e `annunci.bozze_sito`;
4. WordPress → **Influencee** → Annunci: «Elenco annunci dell'app» = `https://app.influencee.it/annunci/elenco.json`,
   «Ricezione bozze nell'app» = `https://app.influencee.it/annunci/bozze/`;
5. prova: pubblica un'offerta di test dal sito, apri il link, scegli la password, controlla che l'annuncio sia in
   `/offerte-lavoro-influencer/` (entro 10 minuti), poi chiudilo dall'app.

**Ancora da fare nell'app** (stesso piano):
- riepilogo settimanale dei nuovi annunci ai creator iscritti che lo vogliono, con disiscrizione;
- "aggiorna i tuoi dati" al login se i dati hanno più di 6 mesi;
- accesso con Google per i brand.

## 7. Aggiornamenti da Claude (MCP)

1. In **Influencee → Crea accesso per Claude** copia il valore mostrato.
2. Mettilo nella variabile `INFLUENCEE_WP_AUTH` delle impostazioni dell'ambiente di Claude Code. Non va mai incollato in chat.

Da quel momento Claude può:
- leggere lo stato (`influencee/stato`);
- accendere o spegnere pagine e articoli (`influencee/pagine`, `influencee/articoli`);
- gestire i redirect, svuotare la cache, controllare una pagina;
- **aggiornare qualsiasi plugin Influencee** (`influencee/aggiorna-plugin`): accetta solo i 5 plugin della famiglia, con controllo dell'impronta.

Ogni azione finisce nel registro in fondo alla pagina Influencee.

## 8. Tornare indietro

- **Una pagina:** mettila tra le "Pagine da spegnere".
- **Un tipo di contenuto:** togli la casella relativa (articoli, profili, annunci).
- **Un plugin:** disattivalo. Tornano le pagine WordPress di prima.
- **Tutto:** disattiva Core. Gli altri si fermano da soli.

## 9. Da fare su WordPress (fuori dai plugin)

- [ ] **Pixel Meta:** togliere le graffe dall'ID, `fbq('init','595078877779895')`.
- [ ] **Banner cookie** con "Accetta" e "Rifiuta" (Consent Mode v2): oggi il sito non lo ha.
- [ ] **Menù:**
  - "Free Social Media Tool" deve puntare a `/social-media-tool/`;
  - aggiungi Prezzi, Per le aziende, Per le agenzie, Funzionalità, Diventa creator.
- [ ] **WP Job Manager:** quando l'app espone l'elenco degli annunci, disattivalo (con i redirect delle offerte vecchie accesi).
- [ ] **Plugin da spegnere per la velocità:** lista nella chat del 22/10/2026. Fra questi il plugin che crea `claude/v1` ed Elementor MCP Composer, da spegnere anche per sicurezza.
- [ ] **Chi segue i lead** in tandem: offerte di lavoro, preventivi, articoli, profili.


## 9. Influencee Tema (intestazione e piè di pagina senza Elementor)

Serve **Influencee Core 2.1.0** (e Articoli 2.1.0 per gli articoli). Piano completo: `wp-plugin/PIANO-SENZA-ELEMENTOR.md`.

1. Aggiorna Core e Articoli (carica gli zip nuovi → «Sostituisci quello attuale»), poi carica e attiva **influencee-tema.zip**.
2. **Influencee → Impostazioni → Intestazione e piè di pagina**: parte **spento**. Scegli «Solo le pagine dei plugin»
   e salva (la cache di LiteSpeed si svuota da sola).
3. Controlla 3-4 pagine (un tool, un articolo, le offerte di lavoro) da telefono e da computer: menu, sottomenu,
   piè di pagina, pulsanti «Inizia gratis» e «Accedi».
4. Quando va bene: «Tutto il sito». Le pagine ancora fatte con Elementor tengono il contenuto Elementor ma prendono
   la nuova intestazione. Se una pagina ha problemi, scrivila in «Pagine che restano come prima».
5. **Non disattivare Elementor**: servirà finché tutte le pagine non sono convertite (fase 2 del piano).
