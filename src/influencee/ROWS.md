# Catalogo row Influencee

52 row riutilizzabili (56 voci contando le varianti 02a/02b, 10a/10b, 27a/b/c), tutte costruite sul design system in `ds.tsx` (regole in `README.md`).

## Regole di composizione di una pagina

1. **Fasce a tutta larghezza:** nessun riquadro o margine esterno. Due fasce consecutive dello stesso tono si fondono automaticamente.
2. **Una hero** in apertura, scelta in base al **tipo di pagina**:
   | Tipo di pagina | Hero obbligatoria |
   | --- | --- |
   | Categoria **creator** (elenco, nicchia, profilo, candidatura) | `HeroReels`: fondo nero, testo centrato, reel che scorrono |
   | **Piattaforma** (Piattaforma, Agenzie) | `HeroDashboard` / `HeroShowcase`: piattaforma in primo piano, **più** una row di reel nella pagina |
   | **Soluzioni** per i brand | `HeroWidgets`: telefono con reel e widget di risultati |
   | **Casi studio** | `HeroCentered` variante `work` (filtri + lavori) |
   | **Blog** (listing e categorie) | hero editoriale con articolo in evidenza grande |
   | **Articolo** | copertina a tutta larghezza su nero con titolo centrato |
   | Home | `HeroHome`: messaggio + reel sopra la piega + ingressi brand/creator + nicchie |
   | Contatti | `HeroCentered` variante `contact` |
3. **Reel ovunque:** ogni pagina commerciale contiene almeno una row della famiglia Reel (`ReelsStrip` o `ReelWall`) o una hero con reel.
4. **Alterna i toni:** prevalenza di bianco; al massimo un blocco `ink` ogni 2-3 fasce bianche; `brand` (fucsia) e `soft` (verde acido) al massimo una volta per pagina.
5. **Una sola row interattiva** per pagina (famiglia Interattivi).
6. **Chiudi sempre** con `CtaBand` (o `Newsletter`) e `Footer`.
7. **Cambio pagina:** sipario nero con il nome della pagina, poi la nuova pagina parte dall'alto (niente scroll visibile).
8. **Testi:** la parola accento tra `*asterischi*`, al massimo una per titolo; negli attributi JSX usare `{'...\n...'}` per andare a capo.
9. **Contenuti** da `content.ts` e `site/data.ts`: non scrivere numeri o nomi direttamente nelle row.

## Regole UX (revisione)

- **Sopra la piega** ci sono sempre la promessa, la CTA principale, la riprova sociale e una **prova visiva** (volti o reel dei creator, oppure la piattaforma).
- **Doppio pubblico:** la home offre due ingressi espliciti, "Sono un brand" e "Sono un creator".
- **Un solo pannello saturo per pagina** (fucsia *oppure* verde acido). Gli altri blocchi sono bianchi, grigio chiaro o neri.
- **Su mobile c'è una barra fissa in basso** con la CTA principale, sempre raggiungibile col pollice.
- **Cambio pagina** sotto i 750ms. Ogni pagina si apre in cima (scroll del browser disattivato).
- **Tutto ciò che sembra cliccabile porta da qualche parte:** nicchie, card, reel, badge.

## Pagine del sito e row usate

| Pagina | Route | Row |
| --- | --- | --- |
| Home | `#home` | HeroHome · StatsBento · ServicesAccordion · FeaturedCreators · PlatformTour · ProjectsBento · TestimonialSwipe (paper) · LatestArticles · Faq · CtaBand |
| Per i brand | `#brand` | HeroWidgets · BenefitsGrid · ReelWall · ProcessSteps · NichePills · CaseCards · Comparison · Faq · CtaBand |
| Per le agenzie | `#agenzie` | HeroShowcase · ReelsStrip · PlatformTour · FeatureCardsUI · StepsHighlight · TestimonialFeature · CtaBand |
| Piattaforma | `#piattaforma` | HeroDashboard · PlatformTour · ReelsStrip · FeatureRows · PlatformsGrid · Faq · CtaBand |
| Creator (listing) | `#creator` | HeroReels · CreatorExplorer · CtaBand |
| Nicchia (categoria) | `#nicchia.food` | HeroReels con statistiche · altre nicchie · CreatorExplorer filtrato · CtaBand |
| Profilo creator | `#creator.giulia-eats` | hero nera con profilo e reel del creator · audience · creator simili |
| Casi studio | `#casi-studio` | HeroCentered (work) · ReelWall · CaseStudyFeature · ResultsList · Storywell · CtaBand |
| Blog (listing) | `#blog` | hero editoriale con articolo in evidenza · griglia · Newsletter |
| Categoria blog | `#categoria.guide` | hero editoriale della categoria · griglia filtrata · Leggi anche |
| Articolo | `#articolo.<slug>` | copertina a tutta larghezza su nero · corpo con indice · box autore · correlati · Newsletter |
| Diventa creator | `#diventa-creator` | HeroReels · BenefitsGrid · modulo candidatura · Faq |
| Contatti | `#contatti` | HeroCentered (contact) · Faq |
| Libreria row | `#libreria` | regole + tutte le row |

## Elenco row

| # | Row | Id | Famiglia | Componente |
| --- | --- | --- | --- | --- |
| 01 | Hero titolo + pillola | `hero-pill` | Hero | `HeroPill` |
| 02a | Hero video · scuro | `hero-video-dark` | Hero | `HeroVideo` |
| 02b | Hero video · chiaro | `hero-video-light` | Hero | `HeroVideo` |
| 03 | Hero story card | `hero-stories` | Hero | `HeroStories` |
| 04 | Team a card | `team-cards` | Team | `TeamCards` |
| 05 | Hero split ritratto | `hero-portrait` | Hero | `HeroPortrait` |
| 06 | Testimonianza scura | `testimonial-feature` | Social proof | `TestimonialFeature` |
| 07 | Hero telefono notifiche | `hero-notifications` | Hero | `HeroNotifications` |
| 08 | Team bento | `team-bento` | Team | `TeamBento` |
| 09 | Hero + piattaforma | `hero-showcase` | Hero | `HeroShowcase` |
| 10a | Hero ventaglio · stories | `hero-fan-stories` | Hero | `HeroFan` |
| 10b | Hero ventaglio · post | `hero-fan-posts` | Hero | `HeroFan` |
| 11 | Hero telefono + widget | `hero-widgets` | Hero | `HeroWidgets` |
| 12 | Hero UGC 3 colonne | `hero-ugc` | Hero | `HeroUGC` |
| 13 | Storytelling 3 media | `media-trio` | Lavori | `MediaTrio` |
| 14 | Progetti bento | `projects-bento` | Lavori | `ProjectsBento` |
| 15 | Video UGC + stat | `stat-video` | Lavori | `StatVideo` |
| 16 | Nicchie a pillole | `niche-pills` | Servizi | `NichePills` |
| 17 | Carosello testimonianze | `testimonial-carousel` | Social proof | `TestimonialCarousel` |
| 18 | Casi studio a card | `case-cards` | Lavori | `CaseCards` |
| 19 | About / valori | `about-values` | Servizi | `AboutValues` |
| 20 | Team zig-zag | `team-zigzag` | Team | `TeamZigzag` |
| 21 | Case study in evidenza | `case-study-feature` | Lavori | `CaseStudyFeature` |
| 22 | Processo a step | `process-steps` | Servizi | `ProcessSteps` |
| 23 | Mission + numeri | `stats-bento` | Social proof | `StatsBento` |
| 24 | Hero calendario | `hero-calendar` | Hero | `HeroCalendar` |
| 25 | Servizi accordion | `services-accordion` | Servizi | `ServicesAccordion` |
| 26 | Risultati con contatori | `results-list` | Social proof | `ResultsList` |
| 27a | Hero centrata · marquee | `hero-centered-marquee` | Hero | `HeroCentered` |
| 27b | Hero centrata · lavori | `hero-centered-work` | Hero | `HeroCentered` |
| 27c | Hero centrata · contatti | `hero-centered-contact` | Hero | `HeroCentered` |
| 28 | Feature con mini-UI | `feature-cards-ui` | Piattaforma | `FeatureCardsUI` |
| 29 | Hero + dashboard | `hero-dashboard` | Hero | `HeroDashboard` |
| 30 | Velocity Carousel | `velocity-carousel` | Interattivi | `VelocityCarousel` |
| 31 | Fluid Carousel | `fluid-carousel` | Interattivi | `FluidCarousel` |
| 32 | Editorial Video Card | `editorial-stack` | Interattivi | `EditorialStack` |
| 33 | Testimonial Swipe | `testimonial-swipe` | Interattivi | `TestimonialSwipe` |
| 34 | Customer Storywell | `storywell` | Interattivi | `Storywell` |
| 35 | Griglia vantaggi | `benefits-grid` | Piattaforma | `BenefitsGrid` |
| 36 | Step con evidenza | `steps-highlight` | Piattaforma | `StepsHighlight` |
| 37 | Griglia piattaforme | `platforms-grid` | Piattaforma | `PlatformsGrid` |
| 38 | FAQ | `faq` | Piattaforma | `Faq` |
| 39 | Feature alternate | `feature-rows` | Piattaforma | `FeatureRows` |
| 40 | Newsletter | `newsletter` | Chiusura | `Newsletter` |
| 41 | Vecchio metodo vs nuovo | `comparison` | Piattaforma | `Comparison` |
| 42 | Fascia CTA finale | `cta-band` | Chiusura | `CtaBand` |
| 43 | Footer | `footer` | Chiusura | `Footer` |
| 44 | Hero pagina interna + breadcrumb | `page-hero` | Sito | `PageHero` |
| 45 | Creator in evidenza | `featured-creators` | Sito | `FeaturedCreators` |
| 46 | Elenco creator con filtri | `creator-explorer` | Sito | `CreatorExplorer` |
| 47 | Tour piattaforma a schede | `platform-tour` | Sito | `PlatformTour` |
| 48 | Ultimi articoli | `latest-articles` | Sito | `LatestArticles` |
| 49 | Strip di reel | `reels-strip` | Reel | `ReelsStrip` |
| 50 | Muro di reel + numeri | `reel-wall` | Reel | `ReelWall` |
| 51 | Hero reel su nero (pagine creator) | `hero-reels` | Hero | `HeroReels` |
| 52 | Hero home: messaggio + reel + doppio ingresso | `hero-home` | Hero | `HeroHome` |

## Quando usare ogni famiglia

- **Hero:** Apertura di pagina: una sola hero per pagina, sempre come prima row (con `showNav={false}` se il sito ha già l’header globale).
- **Team:** Pagine Chi siamo / Agenzia, o prima della chiusura per dare un volto al servizio.
- **Social proof:** Dopo i servizi o prima della CTA finale: numeri, recensioni, testimonianze.
- **Lavori:** Casi studio e portfolio: home, pagina Casi studio, pagine soluzione.
- **Servizi:** Spiegare cosa si offre e come: pagine soluzione e home.
- **Reel:** almeno una per pagina commerciale: reel con interfaccia Reels/TikTok (strip su nero o muro con numeri).
- **Interattivi:** Una per pagina al massimo: momento “wow” con carosello o storie.
- **Piattaforma:** Pagine Piattaforma e Agenzie: funzioni, passi, FAQ, confronto.
- **Sito:** Blocchi specifici del sito: hero interne, elenchi creator, tour piattaforma, blog.
- **Chiusura:** Fine pagina: newsletter, CTA finale e footer (il footer è sempre l’ultima row).
