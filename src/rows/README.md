# Row library — template landing

Ogni file in questa cartella è una **row** (sezione di pagina) indipendente, ricostruita
da una reference. Tutte hanno contenuti Socialee di default e accettano props per
cambiare testi, immagini, link e colori.

- **Anteprima:** `npm run dev` → apri `http://localhost:3000/?rows`
- **Filtrare:** `/?rows=hero`, `/?rows=team`, `/?rows=carousel`
- **Catalogo:** `registry.ts` (ordine, nome, reference, props di esempio)

## Uso

```tsx
import HeroVideo from './rows/HeroVideo';

<HeroVideo theme="light" title="…" cta={{ label: 'Prenota', href: '#iscrizione' }} />
```

## Famiglie

| Tipo | Row |
| --- | --- |
| Hero | HeroBoldPill, HeroVideo (dark/light), HeroStoryCards, HeroSplitPortrait, HeroPhoneNotifications, HeroProductShowcase, HeroFanCards (signal/looped), HeroPhoneWidgets, HeroUGC, HeroCalendar, HeroImpacta (marquee/work/contact), HeroDashboard |
| Team | TeamCards, TeamBento, TeamZigzag |
| Social proof | TestimonialDark, TestimonialCarousel, TestimonialSwipe, CustomerStorywell, ResultsList, StatsBento |
| Lavori / casi | ProjectsBento, CaseCards, CaseStudyFeature, MediaTrio, StatVideo |
| Servizi / metodo | ProcessSteps, ServicesAccordion, FeatureCardsUI, IndustryPills, AboutValues |
| Caroselli interattivi | VelocityCarousel, FluidVideoCarousel, EditorialVideoStack |
| Blocchi SaaS (Celest) | BenefitsGrid, StepsHighlight, LogoGrid, FaqAccordion, FeatureRows, Newsletter, Comparison |

Pezzi condivisi: `shared.tsx` (Stars, AvatarStack, tipi Cta/NavLink),
`CurvedMarquee.tsx` (nastro di testo su curva), `GridLines`/`GoogleG` in `HeroSplitPortrait.tsx`.

## Fase 2 (prossimo passo)

Ogni row oggi usa ancora palette e font della sua reference. Il passo successivo è
scegliere un unico set di token (colori, font, raggi, ombre, stile bottoni) e
applicarlo a tutte le row, così che qualsiasi combinazione formi un sito coerente.
