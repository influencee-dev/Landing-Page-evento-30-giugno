# Contesto influencee per la skill

- **Prodotto**: piattaforma italiana di influencer marketing (app.influencee.it, repo `influencee-dev/appinfluencee`, Django). Società Partidea SRL.
- **Pubblici**: brand e agenzie (paganti: Premium 19 €/mese, 49 €/trimestre, 199 €/anno IVA inclusa, prova di 3 giorni) e creator (iscrizione gratuita).
- **Servizio gestito**: preventivi su WhatsApp +39 351 342 1629. È il lead di valore più alto.
- **Vincoli di comunicazione**:
  - niente AI e niente dati in tempo reale;
  - solo creator italiani;
  - nessun numero sul database finché non è verificato;
  - piani 2026 (35/57/99 €) spenti finché non vengono attivati nell'app.

## File del progetto

| File | Contenuto |
| --- | --- |
| `src/influencee/v2/analytics.ts` | Tracciamento GA4: ascoltatore globale, Consent Mode v2, page view virtuali, sezioni viste, scroll, FAQ. ID in `GA4_ID` |
| `src/influencee/v2/ANALYTICS-PIANO.md` | Piano di misurazione: eventi, parametri, configurazione GA4, esplorazioni, decisioni |
| `src/influencee/v2/SEO-PIANO.md` | Keyword per pagina (Ubersuggest Italia), redirect dai vecchi URL, regole GEO/AEO, checklist di lancio |
| `src/influencee/v2/data.ts` | Fatti reali, prezzi, URL dell'app, WhatsApp, FAQ (fonte unica anche per il JSON-LD) |
| `src/influencee/v2/pages.tsx` | Pagine, metadati SEO (`resolve`, `allPaths`) |

## Strumenti disponibili nelle sessioni

- **Ubersuggest MCP**: keyword e domini; Italia ha `locId` 2380, lingua `it`.
- **Semrush MCP**: a ottobre 2026 aveva i crediti API esauriti. Se torna disponibile è da preferire.
- **Supermetrics MCP**: dati di GA4, Google Ads e Search Console, se gli account sono collegati.
- **Playwright** con Chromium preinstallato, per testare gli eventi: aprire con `?debug_analytics` e leggere la console.

## URL già indicizzati sul vecchio sito (da non perdere)

- `/influencer-italiani/` con le sottopagine regione e città;
- `/food-influencers/`, `/fitness-influencers/`, `/travel-influencers/`;
- `/piattaforma-influencer/`;
- `/social-media-tool/emoticon-da-copiare/` (la pagina con più traffico);
- gli articoli del blog: vedi `SEO-PIANO.md` §3.
