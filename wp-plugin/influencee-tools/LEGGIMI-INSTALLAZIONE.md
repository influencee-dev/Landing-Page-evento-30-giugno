# Influencee Tools: installazione su influencee.it

Il plugin serve 8 pagine tool con il loro URL attuale, quindi il posizionamento su Google non si perde:
- hub dei tool;
- fake follower;
- costo influencer;
- engagement rate;
- preventivo campagna;
- bacheca offerte;
- pubblica offerta;
- emoticon.

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

**Prova un lead**: compila il modulo in fondo a una pagina con un'email di prova e controlla che arrivi in tandem. Nel lead c'è anche il campo "risultato_tool", con il risultato del calcolo.

**Prova Google Analytics**: apri la pagina con `?debug_analytics` alla fine dell'indirizzo, poi GA4 → Amministrazione → DebugView. Usa un tool e invia il modulo: devono comparire gli eventi `calculator_use`, `form_submit` e `generate_lead`.

**Prova la SEO**: tasto destro → "Visualizza sorgente pagina". Deve esserci **un solo** `<title>`, la `meta description` e uno script `application/ld+json` con le FAQ. Poi controlla la pagina con il test dei risultati multimediali di Google: https://search.google.com/test/rich-results

## 4. Impostazioni

- **Pagine**: togli la spunta "attiva" per tornare alla pagina Elementor di prima solo su quella pagina.
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
| `whatsapp_click` | ovunque | richiesta diretta su WhatsApp |

## 6. Da fare su WordPress (fuori dal plugin)

- [ ] **Pixel Meta**: togliere le graffe dall'ID, `fbq('init','595078877779895')`. Oggi non registra niente.
- [ ] **Banner cookie**: oggi il sito non ne mostra uno, ma GA4 e il Pixel sono attivi. In Italia serve un banner con "Accetta" e "Rifiuta" (Consent Mode v2), per esempio Complianz o Cookiebot.
- [ ] **Menù**: la voce "Free Social Media Tool" deve puntare a `/social-media-tool/`, non a `/social-media-tool-form/`.
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
