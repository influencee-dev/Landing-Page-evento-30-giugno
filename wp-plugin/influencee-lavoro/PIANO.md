# Influencee Lavoro — piano (27/10/2026, da approvare)

Plugin WordPress nuovo, basato su Influencee Core, per le pagine delle offerte di lavoro per content creator e
influencer. Scopo: **esca e nurturing per i creator** (vedono le offerte, per candidarsi entrano nell'app) e
**lista di aziende da contattare** per il team commerciale.

## 1. Dati di partenza (fonti)

| Dato | Valore | Fonte |
|---|---|---|
| /offerte-lavoro-influencer/ | 188 clic, 8.299 impressioni, posizione 11,2 | Search Console (export in `src/influencee/v2/search-console-pagine.csv`) |
| singole /offerta-lavoro/…/ (oggi in 301) | fino a 46 clic l'una, posizione 6–9 | Search Console, stesso export |
| content creator milano / roma / torino | 90 / 70 / 50 ricerche al mese | Ubersuggest, Italia, 27/10/2026 |
| content creator napoli / bologna / firenze / palermo | 20 / 20 / 20 / 10 | Ubersuggest |
| Risultati di Google per «content creator milano/roma» | quasi solo offerte di lavoro (Indeed, LinkedIn, Glassdoor, Jooble) | Ubersuggest SERP, 27/10/2026 |
| Creator sul sito per città | da 2 a 7 (Milano 7, Roma 6) | REST `creator_city`, 27/10/2026 |

Conclusione: chi cerca «content creator + città» cerca lavoro → pagine per i creator; l'URL
/offerte-lavoro-influencer/ ha già valore e **resta** come pagina principale.

## 2. Pagine e indirizzi

| Pagina | URL | Per chi |
|---|---|---|
| Principale (resta, rifatta) | `/offerte-lavoro-influencer/` | creator in cerca di collaborazioni |
| Città (6) | `/offerte-lavoro-influencer/content-creator-milano/` … roma, torino, napoli, bologna, firenze | creator della città + aziende locali |
| Singola offerta Influencee | `/offerta-lavoro/<slug>/` (torna a essere una pagina, anteprima) | creator |
| Pubblica un'offerta (resta nel plugin Annunci) | `/pubblica-offerta-lavoro/` | aziende |

- Le 6 città sono quelle con ricerche; le altre si aggiungono quando hanno ricerche e offerte.
- Vecchie pagine automatiche → redirect 301: `/creator-city/<città>/` → pagina città di questo plugin se esiste,
  altrimenti la pagina «Influencer <città>»; `/creator-region/<r>/` → «Influencer <regione>»;
  `/creator-cat/<c>/` → pagina della categoria; tag e autori: `noindex` e fuori dalla sitemap.
- Le offerte vecchie scadute restano in 301 verso la pagina principale; quelle nuove hanno la loro pagina finché
  sono aperte, poi 301 alla pagina della loro città (o principale).

## 3. Due tipi di offerta

**A. Offerte pubblicate su Influencee** (dall'elenco dell'app, `annunci_feed` del plugin Annunci)
- Sul sito: titolo, città, categoria, piattaforme, tipo di compenso, scadenza. Nome dell'azienda e dettagli
  nascosti → «Accedi all'app per vedere l'azienda e candidarti» (link con `next=` all'annuncio nell'app).
- Nell'app: annuncio completo e candidatura (esiste già).

**B. Offerte esterne, solo da siti che lo autorizzano** (API o feed ufficiali, condizioni lette e salvate)
- Sul sito: titolo, città, data, fonte («da Jooble», ecc.) e **link all'annuncio originale**
  (`rel="nofollow noopener"`, con i parametri richiesti dalla fonte). Niente testo copiato, niente accesso richiesto.
- Riga fissa sotto l'elenco: «Alcune offerte arrivano da altri siti: la candidatura avviene sul sito di origine».
- Scadono dopo 30 giorni o quando la fonte le chiude. Aggiornate da un cron giornaliero, salvate in cache.
- Fonti da verificare (condizioni d'uso, attribuzione, eventuale compenso per clic): Jooble, Careerjet, Adzuna.
  Nessuna fonte entra senza condizioni che permettano la pubblicazione. Indeed, LinkedIn, Glassdoor: no.

## 4. Contenuto delle pagine città (oltre all'elenco)

- Risposta breve in apertura: come trovare lavoro come content creator a <città>.
- Quanto guadagna un content creator (dal calcolatore `/social-media-tool/costo-influencer/`, senza numeri inventati).
- Come candidarsi su Influencee in 3 passi; creator della città (lista che c'è già); FAQ diverse dalle pagine
  «Influencer <città>».
- Blocco per le aziende: «Cerchi un content creator a <città>? Pubblica l'offerta gratis» → `/pubblica-offerta-lavoro/`.
- Se in città non ci sono offerte aperte: niente elenco vuoto, solo «Ricevi le nuove offerte: iscriviti».
- Dati strutturati: `ItemList` + `FAQPage` + `BreadcrumbList`. **Niente `JobPosting`**: i dettagli completi sono
  nell'app o su un altro sito, e Google lo considererebbe scorretto.

## 5. Radar aziende (nell'app, piano separato da approvare secondo `docs/MASTER.md`)

- Ogni offerta esterna e ogni azienda trovata dal team diventa una riga «azienda da contattare»: nome, sito,
  città, ruolo cercato, link all'annuncio, data, stato (da chiamare, contattata, interessata, cliente).
- Solo dati dell'azienda, nessun dato personale del selezionatore. Contatto **a mano** (telefono dopo il
  controllo del Registro delle opposizioni, LinkedIn, modulo del sito). Nessuna email automatica (art. 130
  Codice Privacy).
- Messaggio tipo: «Avete pubblicato un'offerta per content creator a Milano: pubblicatela gratis su Influencee,
  la vedono i creator della città».

## 6. Tracciamento (GA4, secondo `src/influencee/v2/ANALYTICS-PIANO.md`)

| Evento | Quando | Perché conta |
|---|---|---|
| `view_item_list` (`item_list_name` = città) | apertura di una pagina offerte | quali città attirano |
| `job_teaser_click` (`job_source` = influencee/esterna, `job_city`) | clic su un'offerta | interesse per offerta |
| `begin_sign_up` (`cta_location` = job_teaser) | «Accedi per candidarti» | iscrizioni nate dalle offerte |
| `outbound_click` (`link_type` = offerta_esterna, `job_source`) | clic verso la fonte esterna | valore delle fonti partner |
| `post_job_click` | «Pubblica l'offerta gratis» | aziende che arrivano dalle pagine creator |

Nell'app: `sign_up` con `signup_origin` = offerta, poi `job_apply` (piano tracciamento app).

## 7. Fasi

1. Plugin con pagina principale rifatta, 6 città, singole offerte Influencee, redirect delle vecchie pagine.
2. Prima fonte esterna autorizzata (dopo la lettura delle condizioni).
3. Radar aziende nell'app (piano a parte) e avvisi email ai creator per le nuove offerte della loro città.

Rischi: poche offerte all'inizio (mitigato da fonti esterne e radar), fonte esterna che cambia condizioni (si
spegne con un interruttore), sovrapposizione con «Influencer <città>» (testi e intento diversi, link incrociati).
Rollback: spegnere il plugin; i redirect tornano a quelli del Core.

## 8. Domande aperte

1. Chi del team contatta le aziende e con quale canale.
2. Offerte da dipendente a tempo pieno dalle fonti esterne: mostrarle o tenere solo collaborazioni e progetti?
3. L'app espone già l'elenco pubblico degli annunci (`annunci_feed`)? Se no, va creato (piano app).
