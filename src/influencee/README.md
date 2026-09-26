# Influencee — template a row unificato

Tutte le row della libreria (`src/rows`, fase 1) sono state riscritte su **un unico
design system** per influencee.it.

| URL | Cosa mostra |
| --- | --- |
| `/?influencee` | Gallery: pagina delle regole + tutte le 48 voci (43 row e le loro varianti) |
| `/?influencee=hero` | Gallery filtrata (per nome, id o famiglia: `team`, `interattivi`, …) |
| `/?influencee=home` | Esempio di home completa composta con le row |

## Struttura

```
src/influencee/
  ds.tsx        design system: Section, Container, Heading, Button, Card, Navbar…
  content.ts    tutti i testi, link e immagini (⚠ numeri e testimonianze = segnaposto)
  mocks.tsx     mockup condivisi: piattaforma, browser, telefono, story/post card
  rows/         le row, raggruppate per famiglia
  registry.ts   catalogo ordinato delle row
  Gallery.tsx   gallery, pagina regole e home composta
```

I token di colore e font sono in `src/index.css` (blocco `@theme`, sezione
"Design system Influencee"): cambiando lì i valori cambia l'intero template.

## Regole

- **Layout:** ogni row è un `<Section>`, cioè un pannello a tutta larghezza con margine
  esterno di 8/12px (colore `canvas`) e raggio 24/32px. Il contenuto sta in `<Container>`:
  max 1200px, gutter 20/32/40px.
- **Ritmo:** padding verticale 80/112px, intestazione → contenuto 48/64px (`GAP.header`),
  gap delle griglie 16/20px (`GAP.grid`).
- **Colori:** il **bianco** è dominante (quasi tutti i pannelli sono `white`), il **nero**
  (`ink`) serve per testo e sezioni scure. Gli accenti sono due:
  - **fucsia** `#ff1f8f` (`brand`): CTA, parole evidenziate e badge su fondo chiaro;
  - **verde acido** `#c8ff1a` (`acid`): CTA e parole evidenziate su fondo nero, più i
    pannelli "statement".
- **Toni dei pannelli:** `white` (predefinito), `ink` (nero), `brand` (fucsia),
  `soft` (verde acido); `paper` e `muted` sono grigi chiarissimi di servizio. Testi, card,
  bottoni e accenti si adattano al tono da soli (`useInk`).
- **Font:** titoli Inter Tight semibold, testo Inter. **Niente corsivi:** la parola
  evidenziata si scrive tra `*asterischi*` e cambia solo colore, nello stesso font
  (fucsia su bianco, verde acido su nero, nero su fucsia, evidenziata in nero sul verde acido):
  `title="Creator giusti, *risultati*"`.
- **Scala:** `TYPE.display`, `h2`, `h3`, `lead`, `body`, `label`, `number`, `numberXL`.
- **Raggi:** pannello 32, card 24, media 16, controlli a pillola.
- **Bottoni:** `primary` (fucsia su chiaro, verde acido su nero), `secondary` (contorno), `contrast` (nero/bianco),
  altezza 48px (`sm` 40px).
- **Motion:** `reveal(i)`, cioè comparsa dal basso di 24px in 0.6s, con ritardo 0.06s per
  elemento.

## Uso

```tsx
import { HeroPill } from './rows/heroes-a';
import { ServicesAccordion } from './rows/services';

<HeroPill title="Il tuo titolo con *accento*" />
<ServicesAccordion tone="ink" />
```

Ogni row accetta `tone` e le props dei testi principali. Nelle hero, `showNav={false}`
nasconde la navbar quando la row non è la prima della pagina.
