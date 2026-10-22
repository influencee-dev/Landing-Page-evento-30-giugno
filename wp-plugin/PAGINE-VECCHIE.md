# Le 67 pagine vecchie (solo Elementor): cosa fare di ognuna · 22/10/2026

Clic = Search Console (ultimi mesi, `src/influencee/v2/search-console-pagine.csv`). Regola: **mai un 404**. Una pagina
si elimina solo dopo che il suo indirizzo porta (301) a una pagina online.

## A. Già fatte dai plugin

| Pagina | Clic | Chi la fa |
| :-- | --: | :-- |
| `/offerte-lavoro-influencer/` | 188 | Influencee Annunci |
| `/pubblica-offerta-lavoro/` | 1 | Influencee Annunci |
| `/news-influencer-marketing/` (pagina del blog) | 0 | Influencee Tema 1.0.3 (elenco articoli) |

## A bis. Sotto-categorie del database creator (Pagine 2.0.2, gruppo «sostituzione»)

Stesso indirizzo, nessun redirect: diventano una classificazione in più dello stesso elenco dei creator, sotto la
loro famiglia. La pagina della famiglia ha i link alle sue specialità, la specialità ha la breadcrumb verso la famiglia.

| Pagina | Clic | Famiglia | Etichette WordPress (Creator → Categorie) |
| :-- | --: | :-- | :-- |
| `/sport-influencers/` | 332 | Fitness | `sport` (18), `athlete` (1) |
| `/luxury-influencers/` | 79 | Moda | `luxury` (0): per ora mostra creator moda, viaggi, lifestyle (lo dice il testo) |
| `/wedding-influencers/` | 68 | Lifestyle | `wedding` (0): per ora mostra creator moda e lifestyle (lo dice il testo) |
| `/model-influencers/` | 51 | Moda | `model` (6), `model-photographer` (1) |
| `/entrepreneur-influencers/` | 37 | Lifestyle | `entrepreneur` (4) |
| `/artist-influencer/` | 18 | Arte e fotografia | `artist` (23), `art` (2), `design` (1) |

Per riempire luxury e wedding basta dare ai creator giusti la categoria `luxury` o `wedding` in WordPress.

Testi: ogni specialità riprende i testi della vecchia pagina Elementor che si posizionano (introduzione, «Trova i migliori…», perché collaborare, come scegliere, quanto costa), salvati in `src/influencee/v2/substory.ts` dalla scansione del 22/10/2026; l'H1 vecchio resta come etichetta sopra il titolo.

## B. Redirect 301 automatici verso le pagine nuove (Core 2.2.0, «Pagine vecchie»)

Partono da soli quando la pagina nuova è online. Poi la pagina vecchia si può mettere nel cestino.

| Pagina vecchia | Clic | Va a | Si accende con |
| :-- | --: | :-- | :-- |
| `/piattaforma-influencer-marketing/` | 29 | `/piattaforma-influencer/` | gruppo «sostituzione» |
| `/trova-influencer/` | 25 | `/funzionalita/database-influencer/` | gruppo «nuova» |
| `/tool-influencer/` | 4 | `/social-media-tool/` | già online |
| `/gestione-campagne-influencer/`, `/gestione-campagne-influecer/` | 1 | `/funzionalita/gestione-campagne/` | gruppo «nuova» |
| `/gestionale-influencer/`, `/demo-piattaforma-influencer/` | 0 | `/piattaforma-influencer/` | gruppo «sostituzione» |
| `/agenzie/` | 4 | `/piattaforma-agenzie/` | gruppo «nuova» |
| `/agenzia-content-creator/` | 0 | `/agenzia-influencer/` | già online |
| `/content-creator/`, `/benvenuto-su-influencee/` | 0 | `/diventa-creator/` | gruppo «nuova» |
| `/gestione-ugc/` | 0 | `/contenuti-ugc/` | gruppo «nuova» |
| `/guida-definitiva-al-micro-influencer-marketing-2026/` | 1 | `/micro-influencer/` | gruppo «nuova» |
| `/virtual-influencer/` | 0 | `/influencer-italiani/` | gruppo «sostituzione» |
| `/converti-immagini-in-webp/` e i 9 vecchi tool in `/social-media-tool/…` | 22 in tutto | `/social-media-tool/` | già online |
| `/cost/` | 0 | `/prezzi/` | gruppo «nuova» |
| `/social-media-tool-form/`, `/preventivi-influencer/` | 6 | `/social-media-tool/`, `/preventivo-campagne/` | redirect del piano SEO (casella «Altri redirect») |

## C. Da rifare nel template nuovo, stesso indirizzo (fase 2: conversione)

| Pagina | Clic | Nota |
| :-- | --: | :-- |
| `/influencer-italiane/` | 455 | la pagina con più clic tra le vecchie: per ultima, da sola |
| `/influencer/` | 201 | pagina «per i creator»; in alternativa 301 a `/diventa-creator/` (da decidere dopo) |
| `/academy-influencer-marketing/` | 61 | pagina principale dell'academy |
| `/chi-siamo/` | 42 | |
| `/contratto-social-media-influencer-ugc/` | 17 | |
| `/agenzia-influencer/` | 5 | servizio gestito (nel menu) |
| `/creator-manager/`, `/amministrazione-pagamenti-influencer/`, `/tutorial-piattaforma-influencee/`, `/guide-e-risorse/` | 13 | |
| `/privacy-policy/`, `/cookie-policy/`, `/termini-legali/`, `/influencee-extension-privacy/` | 6 | pagine legali: obbligatorie |

## D. Da confermare (servono ancora?)

| Pagine | Clic | Se non servono |
| :-- | --: | :-- |
| Corsi: `/academy-influencer-marketing/corso-…/` (5), `/corsi-content-creator/`, `/corso-content-creator/`, `/programma-corso-content-creator/`, `/corso-gratuito-social-ads-2025/` | 9 | 301 → `/academy-influencer-marketing/` |
| `/selezione-ambassador-influencee-2026/` | 0 | 301 → `/diventa-creator/` |
| `/consulenza-creator/`, `/modulo-consulenza-creator/` | 0 | 301 → `/diventa-creator/` |
| `/promo-social-media/`, `/promo-bundle/`, `/gestione-social-influencee/` | 0 | 301 → `/agenzia-influencer/` |
| `/guida-ristoranti/` | 0 | 301 → `/influencer-marketing-locale/` |
| `/thank-you/` | 0 | da tenere se un modulo ci rimanda dopo l'invio |

## Ordine dei passi

1. **Aggiornare i plugin** (Core 2.2.0, Tools 2.0.1, Pagine 2.0.1, Tema 1.0.3) e accendere «Pagine vecchie» nelle impostazioni.
2. **Accendere le pagine già rifatte**, un gruppo alla volta, con un controllo dopo ognuno:
   - «sostituzione» (home, regioni, città, categorie, piattaforma);
   - poi «nuova» (funzionalità, prezzi, aziende, agenzie, creator, UGC).
3. **Cestino** per le pagine della tabella B, una volta che il redirect è attivo (✅ nella tabella delle impostazioni).
4. **Fase 2**: conversione delle pagine C (e D se servono).
5. **Spegnere**: Elementor Pro, Elementor, Influencee Header & Footer, Modular Page. Poi eliminarli dopo 30 giorni senza problemi.
