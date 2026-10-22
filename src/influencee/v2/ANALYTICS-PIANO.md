# Piano di misurazione GA4: sito influencee v2

Questo piano spiega cosa misuriamo e come leggerlo. Lo scopo è vedere il percorso completo di chi arriva sul sito e capire dove investire: SEO, contenuti, campagne Ads, pagine da migliorare.

Il codice è in `analytics.ts`. Un solo ascoltatore intercetta **ogni clic su link e pulsanti**, quindi nessun elemento resta senza evento, nemmeno quelli che verranno aggiunti in futuro.

---

## 1. Le domande di business a cui rispondiamo

| Domanda | Dove si legge |
| --- | --- |
| Da dove arrivano i brand che provano la piattaforma? | Evento chiave `begin_sign_up` con `signup_audience = brand`, per sorgente/mezzo e pagina di destinazione |
| Quali pagine generano più iscrizioni di creator? | `signup_creator_click` per `page_path` e `page_type` |
| Quante richieste di preventivo arrivano su WhatsApp, e da quale pagina e sezione? | `whatsapp_click` e `generate_lead` per `page_path`, `section_name` e `cta_location` |
| Le pagine SEO (città, categorie, guide) portano clienti o solo visite? | Esplorazione a imbuto: `page_view` con `page_type = citta / categoria` → `begin_sign_up` o `generate_lead` |
| Quali sezioni vengono davvero viste e quali ignorate? | `section_view` per `section_name` e `section_index`: dove cala, la pagina perde attenzione |
| Le persone leggono fino in fondo? | `scroll_depth` (25 / 50 / 75 / 90 %) per pagina |
| Quali dubbi hanno prima di comprare? | `faq_open` per `faq_question`: le domande più aperte vanno spostate più in alto nella pagina |
| Il menù aiuta o confonde? | `menu_click` per `menu_group` e `link_text` |
| Il prezzo frena? | Percorso `/prezzi/` → uscita, oppure `/prezzi/` → `begin_sign_up` |

---

## 2. Eventi

### Eventi chiave (conversioni da segnare in GA4)

Si segnano in Amministrazione → Eventi → "Segna come evento chiave".

| Evento | Quando parte | Perché conta |
| --- | --- | --- |
| `begin_sign_up` | Clic verso l'iscrizione all'app, per brand, creator o scelta | È il passaggio dal sito all'app: il primo impegno concreto. Il parametro `signup_audience` dice chi è |
| `generate_lead` | Clic su WhatsApp, telefono o email, oppure invio del modulo demo | Richiesta di preventivo per un progetto gestito: il lead di valore più alto. Il parametro `lead_source` dice il canale |
| `signup_brand_click` | Clic su "Prova gratis", "Registra la tua azienda" e simili | Dettaglio del lato brand, il pubblico pagante |
| `signup_creator_click` | Clic su "Iscriviti gratis", "Sono un creator" e simili | Dettaglio del lato creator, l'offerta del marketplace |
| `whatsapp_click` | Qualunque link WhatsApp: pulsante fisso, sezione "Gestiamo noi", footer, FAQ | Canale preventivi |
| `form_submit` | Invio di un modulo (`form_name`: `richiesta_demo_whatsapp`, `lead_fake_follower`, `lead_costo_influencer`, `lead_engagement_rate`, `lead_preventivo_campagna`, `lead_offerte_lavoro`, `lead_pubblica_offerta`, `lead_emoticon`, `lead_hub_tool`) | Quale modulo e quale tool porta lead |

### Eventi di navigazione e interesse

| Evento | Quando parte | Lettura strategica |
| --- | --- | --- |
| `page_view` | Ogni cambio pagina, comprese le pagine virtuali | Base di tutti i percorsi. Alla prima pagina ha `is_landing = true` più referrer e UTM |
| `menu_click` | Clic su una voce del menù, desktop o mobile | Quali sezioni cercano le persone appena arrivano |
| `footer_click` | Clic su un link del footer | Se è alto, chi arriva in fondo non ha trovato ciò che cercava |
| `internal_link_click` | Clic verso un'altra pagina del sito dal corpo della pagina | Quali collegamenti interni funzionano (card, "Continua a esplorare", categorie, città) |
| `login_click` | Clic su "Accedi" | Utenti già clienti che passano dal sito: da escludere dai pubblici pubblicitari |
| `app_tool_click` | Clic verso la bacheca annunci o il benchmark dell'app | Interesse per gli strumenti gratuiti, buoni come lead magnet |
| `outbound_click` | Clic verso siti esterni | Fuoriuscite di traffico |
| `phone_click` / `email_click` | Clic su telefono o email | Lead, canale alternativo |
| `ui_click` | Altri pulsanti senza link, come apri menù o schede | Interazione con l'interfaccia |
| `section_view` | Una sezione visibile almeno al 40%, una volta per pagina | Mappa di attenzione: quali blocchi vengono visti |
| `scroll_depth` | Superamento del 25, 50, 75 e 90% della pagina | Profondità di lettura |
| `faq_open` | Apertura di una domanda frequente | Le obiezioni reali dei clienti |
| `calculator_use` | Uso del calcolatore (engagement rate o check sponsor), 1,2 secondi dopo l'ultima modifica | Quanto è usato lo strumento gratuito e con che esito (`calculator`, `result_band`, `tier`): chi lo usa e poi clicca "Confronta i creator" è un brand ad alta intenzione |
| `calculator_use` (tool restaurati) | Fake follower checker (`calculator: fake_follower`, con `risk_signals`, `warn_signals`, `tier`, `platform`) e calcolatore costo (`calculator: costo_influencer`, con `tier`, `quantity`, `result_band` = forbice in €) | Quali tool portano brand ad alta intenzione: chi controlla un profilo e poi clicca "Cerca creator verificati" sta per scegliere un creator. Confronta `risk_signals` alti con i clic su WhatsApp: chi trova profili a rischio cerca qualcuno di cui fidarsi |
| `calculator_use` (preventivo) | Preventivo della campagna gestita (`calculator: preventivo_campagna`, con `creators`, `contents`, `ugc`, `months`, `result_band` = € al mese) | Che dimensione di campagna chiedono le aziende. Il clic su "Invia su WhatsApp" vale `generate_lead` con il messaggio già compilato: confronta i preventivi calcolati con quelli inviati |
| `form_submit` + `generate_lead` | Invio del modulo demo (`form_name` / `lead_source` = `richiesta_demo_whatsapp`): apre WhatsApp con nome, azienda e settore | Il modulo prima non inviava dati: ora ogni invio è una richiesta reale su WhatsApp. Nome e azienda non vanno mai a GA4 |
| `tool_use` | Azioni nei tool senza calcolo: copia di un'emoticon o del testo (`tool: emoticon`), copia del risultato del checker, copia del testo dell'offerta | Valore reale dei tool "di traffico" (emoticon): se l'uso è alto ma i clic verso l'app sono zero, il tool porta visite e non clienti |
| `tool_filter` | Filtro per pubblico nell'hub dei tool (`filter`: brand, creator, smm) | Chi visita l'hub: decide quali tool restaurare dopo |
| `job_search` | Ricerca nella bacheca offerte, 1,2 secondi dopo l'ultima modifica (`has_keyword`, `has_location`, `compenso`, `results`) | Domanda dei creator per tipo di compenso; `results = 0` frequente = mancano offerte, da chiedere ai brand |
| `job_post_step` | Passo del form "Pubblica offerta" (`step` 2 o 3, `compenso`) | Imbuto delle aziende che vogliono pubblicare: abbandono tra passo 2 e 3 = form troppo lungo. Il passo finale porta a `begin_sign_up` con `link_url` che contiene `da=pubblica-offerta` |
| `consent_choice` | Scelta nel banner cookie | Tasso di consenso, per stimare la quota di dati persa |

### Parametri inviati con ogni evento

| Parametro | Esempio | A cosa serve |
| --- | --- | --- |
| `page_path` | `/influencer-italiani/influencer-campania/influencer-napoli/` | Pagina in cui avviene l'azione |
| `page_type` | `home`, `prodotto`, `soluzione`, `creator`, `categoria`, `citta`, `regione`, `prezzi`, `strumento` | Raggruppa le pagine per tipo: confronta "le città" contro "le categorie" |
| `audience` | `brand`, `creator`, `misto` | A chi parla la pagina |
| `link_text` | `Prova gratis 3 giorni` | Quale testo del pulsante converte di più (A/B test naturali) |
| `link_url` | `https://app.influencee.it/iscriviti/brand/` | Destinazione |
| `link_type` | `iscrizione_brand`, `whatsapp`, `interno`, `esterno` | Tipo di destinazione |
| `cta_location` | `hero`, `sezione_4`, `header`, `menu_mobile`, `footer`, `barra_mobile`, `pulsante_whatsapp_fisso` | In che zona della pagina si clicca |
| `section_name` | `Preferisci che ce ne occupiamo noi?` | Titolo della sezione: si legge senza conoscere il codice |
| `section_index` | `5` | Posizione della sezione nella pagina |
| `menu_group` | `Soluzioni` | Gruppo del menù |
| `element` | `pulsante` / `link` | Pulsanti contro link testuali |

---

## 3. Configurazione in GA4 (una volta sola)

1. **Proprietà**: `G-5BD025G8VP`, la stessa del sito WordPress attuale (`GA4_ID` in `analytics.ts`). Sul WordPress il plugin `influencee-tools` non installa un secondo tag: usa quello già presente e aggiunge solo gli eventi dell'area dei tool (`initEmbedAnalytics`).
2. **Dimensioni personalizzate** (Amministrazione → Definizioni personalizzate), tutte con ambito evento: `page_type`, `audience`, `link_text`, `link_type`, `cta_location`, `section_name`, `section_index`, `menu_group`, `signup_audience`, `lead_source`, `faq_question`, `percent_scrolled`, `calculator`, `result_band`, `tier`, `form_name`, `tool`, `action`, `platform`, `risk_signals`, `creators`, `months`, `compenso`, `results`, `step`, `filter`.
3. **Eventi chiave**: `begin_sign_up`, `generate_lead`. Opzionali, per avere il dettaglio: `signup_brand_click`, `signup_creator_click`, `whatsapp_click`, `form_submit`. Nei report dei lead usa `lead_source` per separare i tool: ogni lead dei tool arriva anche a tandem-forms (vedi `RESTAURO-TOOL.md`).
4. **Raggruppamento contenuti**: si usa `content_group`, che è uguale a `page_type`.
5. **Dominio incrociato**: `influencee.it` e `app.influencee.it` (Stream di dati → Configura le impostazioni del tag). Nel codice è già attivo (`linker`). Così chi passa dal sito all'app resta lo stesso utente e la sorgente non diventa "referral da influencee.it".
6. **Esclusione referral**: `app.influencee.it`, `wa.me`, `paypal.com`.
7. **Stessa proprietà nell'app**: l'app deve inviare `sign_up` (iscrizione completata), `trial_start` e `purchase` (abbonamento Premium, con `value` in euro). Solo così si vede il percorso intero, dalla pagina SEO al pagamento.
8. **Collegamenti**: Google Ads (conversioni importate da `begin_sign_up` e `generate_lead`) e Search Console (query → pagina di destinazione → conversioni).
9. **Conservazione dei dati**: 14 mesi (di default sono 2).

---

## 4. Report ed esplorazioni da costruire

| Nome | Tipo | Impostazione | Decisione che permette |
| --- | --- | --- | --- |
| **Percorso dei brand** | Esplorazione percorso | Punto di partenza: `page_view` con `is_landing = true`. Passi successivi per nome pagina, fine su `begin_sign_up` | Le pagine "ponte" che portano all'iscrizione vanno rafforzate e linkate di più |
| **Imbuto brand** | Esplorazione imbuto | 1. pagina soluzione o prodotto → 2. `/prezzi/` → 3. `signup_brand_click` → 4. (app) `sign_up` → 5. `purchase` | Mostra in quale passaggio si perdono più persone |
| **Imbuto creator** | Esplorazione imbuto | 1. `/ugc-creator/` o categoria → 2. `/diventa-creator/` → 3. `signup_creator_click` → 4. (app) `sign_up` | Misura l'efficacia delle guide SEO sulle iscrizioni |
| **SEO che converte** | Esplorazione libera | Righe: `page_type`, `page_path`. Colonne: utenti, `begin_sign_up`, `generate_lead`, tasso di conversione. Filtro: organico | Dove scrivere nuovi contenuti e quali pagine città o categoria attivare per prime |
| **Mappa sezioni** | Esplorazione libera | Righe: `page_path` + `section_index` + `section_name`. Valore: utenti con `section_view` | Le sezioni viste da pochi vanno spostate, accorciate o tolte |
| **CTA migliori** | Esplorazione libera | Righe: `link_text`, `cta_location`. Valori: clic e conversioni | Quali testi e posizioni dei pulsanti tenere |
| **Obiezioni** | Esplorazione libera | Righe: `faq_question`, `page_path` | Le domande più aperte diventano testi in pagina o righe dedicate |
| **WhatsApp** | Esplorazione libera | `generate_lead` con `lead_source = whatsapp`, per `page_path` e `cta_location` | Dove il servizio gestito interessa di più: alimenta le campagne Ads |

**Pubblici da creare** (per remarketing e analisi):
- "Brand interessati": ha visto `/prezzi/` oppure 2 o più pagine con `audience = brand`, senza `begin_sign_up`.
- "Creator interessati": ha visto `/ugc-creator/` o `/diventa-creator/`, senza `signup_creator_click`.
- "Richiesta preventivo": ha fatto `whatsapp_click`. Da escludere dalle campagne per brand che si iscrivono in autonomia.
- "Clienti esistenti": ha fatto `login_click`. Da escludere da tutte le campagne di acquisizione.

---

## 5. Come leggere i dati e cosa fare

- **Le pagine città o categoria hanno visite ma zero `begin_sign_up`.** Il traffico è informativo. Aggiungi in quelle pagine un annuncio o un esempio locale, oppure manda il traffico verso `/micro-influencer/`, che converte meglio.
- **Il `section_view` cala molto dopo la sezione 3.** La pagina è troppo lunga. Porta più in alto la CTA o la sezione che converte.
- **I `faq_open` si concentrano su prezzi e costi.** Il prezzo è un'obiezione. Rendi più visibile la prova di 3 giorni o il piano gratuito.
- **I `whatsapp_click` sono alti sulle pagine agenzie.** C'è domanda di servizio gestito. Crea una campagna Ads dedicata al servizio e una pagina "progetti gestiti".
- **I `menu_click` vanno spesso su Prezzi dalla home.** Le persone vogliono il prezzo subito: valuta di mostrarlo nella home più in alto.
- **Molte persone su `/prezzi/` escono senza cliccare.** Prova un testo diverso sul pulsante, confrontando `link_text`, oppure aggiungi una garanzia.

**Ritmo consigliato**:
- ogni settimana: eventi chiave per sorgente e per pagina;
- ogni mese: imbuti, mappa delle sezioni e domande frequenti, con 3 decisioni scritte da applicare al sito;
- ogni trimestre: pagine SEO da attivare o accorpare.

---

## 6. Privacy e qualità del dato

- **Consent Mode v2 attivo.** Senza consenso GA4 riceve solo segnali anonimi, senza cookie. Il banner offre "Accetta" e "Rifiuta" con lo stesso peso, come chiede il Garante. Nessun cookie pubblicitario.
- **Nessun dato personale negli eventi.** Si inviano solo testi dei pulsanti, URL e titoli delle sezioni, mai email o telefoni dell'utente.
- **Verifica.** Apri il sito con `?debug_analytics` nell'indirizzo per vedere gli eventi nella console. In GA4 usa Amministrazione → DebugView.
- **Da aggiornare nella privacy policy:** uso di GA4, finalità di analisi, base giuridica (consenso), conservazione di 14 mesi.

### Pagine profilo creator (`/creator/…`, plugin WordPress)

| cosa | quando | perché conta | decisione che abilita |
|---|---|---|---|
| `page_type=profilo_creator` | ogni visita a un profilo | quali profili attirano aziende da Google | quali creator spingere nelle campagne e nelle pagine città |
| `generate_lead` con `lead_source=lead_creator_profilo` | invio di "Vuoi collaborare con …?" | richieste dirette su un creator (nome e handle nel campo risultato in tandem) | contattare il creator e proporre anche creator simili |
| `tool_filter` con `tool_name=elenco_creator` | ricerca o filtri nell'elenco di /influencer-italiani/ | cosa cercano le aziende (categoria, regione, fascia) e quanti risultati trovano | dove reclutare nuovi creator (ricerche con pochi risultati) |

### Articoli del blog (plugin WordPress)

| cosa | quando | perché conta | decisione che abilita |
|---|---|---|---|
| `page_type=articolo` + `scroll_depth` | lettura di un articolo | quali articoli vengono letti davvero, non solo aperti | quali argomenti espandere o aggiornare |
| `generate_lead` con `lead_source=lead_articolo` | invio del modulo in fondo all articolo (titolo nel campo risultato in tandem) | quali articoli portano richieste | dove mettere più CTA e cosa scrivere |
| `internal_link_click` / `cta_location` (indice, testo, correlati, box laterale) | clic nell articolo | percorsi verso tool e pagine commerciali | migliorare i link interni |
| `faq_open`, `share` (copia link) | interazioni | domande più aperte, articoli condivisi | FAQ e contenuti da approfondire |

### Offerte di lavoro (plugin Influencee Annunci)

| cosa | quando | perché conta | decisione che abilita |
|---|---|---|---|
| `page_type=offerte_lavoro`, `job_click`, `post_job_click` | bacheca | quali annunci attirano e quanti brand vogliono pubblicare | annunci da spingere, testi della bacheca |
| `post_job_step` (`step` 1-5, `compenso`) | ogni passo superato del percorso | dove si fermano i brand (es. passo 4 con la partita IVA) | semplificare il passo che perde di più |
| `generate_lead` con `lead_source=lead_pubblica_offerta`, `post_job_done` | invio del percorso | offerte arrivate (anche in tandem e tra le Bozze annunci) | chi richiamare, quante offerte diventano annunci |
| `claim_click` (verso app.influencee.it, `utm_campaign=pubblica_offerta`) | clic su "crea l'account / scegli la password" | quanti brand entrano davvero nell'app | lavorare sul passaggio sito → app |
