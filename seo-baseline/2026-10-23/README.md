# Verifica del sito · 23/10/2026

344 indirizzi controllati uno alla volta (pausa 3 s): 199 pagine, 83 articoli, 24 pagine nuove dei plugin,
8 offerte, 20 profili creator, categorie del blog, ricerca, 404, sitemap, robots, llms.txt.
Dati grezzi: `verifica-sito.jsonl` (una riga per indirizzo).

| Controllo | Risultato |
| :-- | :-- |
| Risposte | 334 × 200, 8 × 301 (offerte vecchie → bacheca), 1 × 404 (pagina di prova), **1 × 500** (`/influencer-italiani/influencer-valle-daosta/`, pagina completa ma codice 500 → Core 2.2.7) |
| Tempo di risposta | mediana 3,4 s, massimo 10,4 s |
| Cache LiteSpeed | **spenta su tutte le pagine** (nessuna intestazione x-litespeed-cache) |
| Errori PHP visibili | nessuno |
| Intestazione | nuova su tutte le pagine, vecchia su nessuna |
| Elementor | **disattivato**: le 14 pagine che lo usavano mostrano il testo di riserva → Tema 1.1.5 lo impagina |
| Articoli | 83 su 83 serviti da Influencee Articoli |
| Sitemap | **24 pagine nuove dei plugin mancanti** → Core 2.2.6 |
| Description | 148 pagine senza description (listing geo, pagine ex Elementor, vecchie pagine) → Tema 1.1.5 la crea dal primo paragrafo se nessuno la mette |
| H1 | 21 pagine con 0 o più H1 (pagine ex Elementor e vecchi tool) → Tema 1.1.5: H1 = titolo della pagina |
| Redirect pagine vecchie | non attivi (le pagine vecchie rispondono 200): casella «Pagine vecchie» da accendere |
| noindex | solo la ricerca (corretto) |
