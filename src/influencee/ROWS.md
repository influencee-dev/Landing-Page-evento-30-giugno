# Catalogo row Influencee

48 row riutilizzabili (52 voci contando le varianti 02a/02b, 10a/10b, 27a/b/c), tutte costruite sul design system in `ds.tsx` (regole in `README.md`).

## Regole di composizione di una pagina

1. **Una hero** in apertura (famiglia Hero oppure `PageHero` per le pagine interne).
2. **Alterna i toni:** prevalenza di pannelli `white`; al massimo un pannello `ink` ogni 2-3 row bianche; `brand` (fucsia) e `soft` (verde acido) al massimo una volta per pagina.
3. **Una sola row interattiva** per pagina (famiglia Interattivi).
4. **Chiudi sempre** con `CtaBand` (o `Newsletter`) e `Footer`.
5. **Testi:** la parola accento tra `*asterischi*`, al massimo una per titolo; `\n` per andare a capo.
6. **Contenuti** da `content.ts` e `site/data.ts`: non scrivere numeri o nomi direttamente nelle row.

## Pagine del sito e row usate

| Pagina | Route | Row |
| --- | --- | --- |
| Home | `#home` | HeroPill · StatsBento · ServicesAccordion · FeaturedCreators · PlatformTour · ProjectsBento · TestimonialSwipe · LatestArticles · Faq · CtaBand |
| Per i brand | `#brand` | PageHero · BenefitsGrid · ProcessSteps · NichePills · CaseCards · Comparison · Faq · CtaBand |
| Per le agenzie | `#agenzie` | HeroShowcase · PlatformTour · FeatureCardsUI · StepsHighlight · TestimonialFeature · CtaBand |
| Piattaforma | `#piattaforma` | HeroDashboard · PlatformTour · FeatureRows · PlatformsGrid · Faq · CtaBand |
| Creator (listing) | `#creator` | PageHero · CreatorExplorer · CtaBand |
| Nicchia (categoria) | `#nicchia.food` | PageHero con statistiche · CreatorExplorer filtrato · CtaBand |
| Profilo creator | `#creator.giulia-eats` | scheda profilo · audience · contenuti · creator simili |
| Casi studio | `#casi-studio` | PageHero · ProjectsBento · CaseStudyFeature · ResultsList · Storywell · CtaBand |
| Blog (listing) | `#blog` | PageHero con categorie · articolo in evidenza · griglia · Newsletter |
| Categoria blog | `#categoria.guide` | PageHero · griglia filtrata · Leggi anche |
| Articolo | `#articolo.<slug>` | testata · corpo con indice · box autore · correlati · Newsletter |
| Diventa creator | `#diventa-creator` | PageHero · BenefitsGrid · modulo candidatura · Faq |
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

## Quando usare ogni famiglia

- **Hero:** Apertura di pagina: una sola hero per pagina, sempre come prima row (con `showNav={false}` se il sito ha già l’header globale).
- **Team:** Pagine Chi siamo / Agenzia, o prima della chiusura per dare un volto al servizio.
- **Social proof:** Dopo i servizi o prima della CTA finale: numeri, recensioni, testimonianze.
- **Lavori:** Casi studio e portfolio: home, pagina Casi studio, pagine soluzione.
- **Servizi:** Spiegare cosa si offre e come: pagine soluzione e home.
- **Interattivi:** Una per pagina al massimo: momento “wow” con carosello o storie.
- **Piattaforma:** Pagine Piattaforma e Agenzie: funzioni, passi, FAQ, confronto.
- **Sito:** Blocchi specifici del sito: hero interne, elenchi creator, tour piattaforma, blog.
- **Chiusura:** Fine pagina: newsletter, CTA finale e footer (il footer è sempre l’ultima row).
