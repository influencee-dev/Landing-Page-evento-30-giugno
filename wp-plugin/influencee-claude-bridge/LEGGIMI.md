# Influencee Claude Bridge 2.0.0

Accesso di Claude al sito su `/wp-json/claude/v1/` (stesso indirizzo del vecchio bridge, che va tolto).
Indipendente dal Core: funziona anche se gli altri plugin sono spenti.

## Installazione (una volta sola)

1. **Plugin → Plugin installati**: disattiva ed elimina il vecchio plugin che crea `claude/v1`
   (due plugin con lo stesso indirizzo si danno fastidio).
2. **Plugin → Aggiungi nuovo → Carica plugin**: `influencee-claude-bridge.zip`, poi **Attiva**.
   All'attivazione aggiunge in cima a `.htaccess` la riga che fa arrivare a WordPress l'intestazione
   `Authorization` (copia di sicurezza: `.htaccess.bak-claude-bridge`).
3. **Strumenti → Claude Bridge → Crea la chiave**. La chiave si vede una volta sola: copiala.
4. In Claude Code: impostazioni dell'ambiente → **Segreti di rete** → sito `influencee.it`, percorso `/wp-json/`,
   intestazione **`X-Claude-Key`**, valore = la chiave. Poi apri una sessione nuova.
   Il segreto con `Authorization: Basic …` che c'è già può restare: con la riga in `.htaccess` funziona anche quello.

## Cosa può fare Claude

| Sempre | Solo se lo accendi in Strumenti → Claude Bridge |
| :-- | :-- |
| stato del sito (`GET /info`), elenco plugin, registro chiamate (`GET /log`) | scrivere e cancellare file (acceso di base, copia `.bak-claude-bridge` a ogni modifica) |
| installare/aggiornare plugin da zip con sha256 (`POST /plugin/install`), attivare, disattivare | query che modificano il database |
| leggere opzioni e file, query di lettura, svuotare la cache LiteSpeed | **comandi shell** (spento di base) |

Mai: leggere o scrivere `wp-config.php`, uscire dalla cartella del sito, cambiare indirizzo del sito, email
dell'amministratore, registrazioni e ruolo predefinito, spegnere il bridge da remoto. 20 chiavi sbagliate dallo
stesso indirizzo = 10 minuti di blocco. **Revoca la chiave** quando non serve più: Claude non entra più.
