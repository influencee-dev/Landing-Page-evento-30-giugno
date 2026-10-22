# Influencee Pulizia

Plugin a sé (non usa il Core): si accende quando serve, si spegne dopo.

1. Plugin → Aggiungi nuovo → Carica plugin → `influencee-pulizia.zip` → Attiva.
2. **Strumenti → Pulizia e velocità**: in alto cosa c'è da pulire, con i numeri; sotto il controllo del sito.
3. **Fai un backup** dal pannello hosting, poi spunta le voci e premi «Pulisci le voci scelte». Ogni giro toglie al
   massimo 500 elementi per voce: se ne restano, ripeti.
4. Velocità (facoltativo): accorgimenti spenti finché non li accendi; valgono solo con il plugin attivo.
5. Quando hai finito: Plugin → Influencee Pulizia → Disattiva. Eliminandolo si cancellano solo le sue impostazioni.

Cosa non tocca mai: contenuti pubblicati, utenti, lead, ordini, file fuori da `wp-content/plugins/*.zip`,
`wp-content/upgrade` e `wp-content/upgrade-temp-backup`. I file più recenti di un'ora restano.

Con il sito collegato via MCP, Claude può usare `influencee-pulizia/controllo` (sola lettura) e
`influencee-pulizia/pulisci` (solo con `conferma: true`). Ogni pulizia finisce nel registro in fondo alla pagina.
