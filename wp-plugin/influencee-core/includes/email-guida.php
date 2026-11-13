<?php
/**
 * Email automatica dopo la richiesta di preventivo: la guida su come funzionano le campagne con influencer,
 * scritta da Giorgia Palazzo. Volutamente semplice (niente immagini, niente pulsanti, una colonna):
 * deve sembrare un'email scritta a mano, non una newsletter.
 * La stessa email, con i segnaposto di Brevo, è in consegne/email/guida-campagne-influencer.html.
 */

defined( 'ABSPATH' ) || exit;

/** Oggetto dell'email. */
function infc_guida_oggetto( $nome ) {
	$nome = trim( (string) $nome );
	return ( '' !== $nome ? $nome . ', ' : '' ) . 'prima del tuo preventivo: come funziona una campagna con influencer';
}

/**
 * Corpo dell'email in HTML e in testo.
 *
 * @param array $d nome, riepilogo, citta, link_brand, link_offerta, whatsapp, firma_nome, firma_ruolo.
 * @return array( 'html' => string, 'text' => string )
 */
function infc_guida_corpo( $d ) {
	$e     = function ( $s ) {
		return esc_html( (string) $s );
	};
	$nome  = trim( (string) $d['nome'] );
	$citta = trim( (string) $d['citta'] );
	$p     = array(); // paragrafi: array( tipo, testo ) — testo già in HTML sicuro

	$p[] = array( 'p', 'Ciao ' . ( '' !== $nome ? $e( $nome ) : '' ) . ',' );
	$p[] = array( 'p', 'sono Giorgia, amministratrice di Influencee. Ho visto la tua richiesta di preventivo' . ( '' !== $citta ? ' per una campagna a ' . $e( $citta ) : '' ) . ': il team ci sta già lavorando e ti scriviamo al più presto.' );
	$p[] = array( 'p', 'Nel frattempo ti lascio quello che spiego sempre a chi parte con l’influencer marketing. Così, quando ti arriva il preventivo, sai già come leggerlo.' );
	$p[] = array( 'h', '1. Influencer e UGC non sono la stessa cosa' );
	$p[] = array( 'p', 'L’influencer pubblica sul suo profilo: paghi il contenuto e anche la sua community, cioè le persone che lo seguono e si fidano di lui. L’UGC creator invece gira video per i tuoi canali e per le tue inserzioni: paghi il video, non i follower. Molti brand partono con tanti piccoli creator UGC per tenere vivi i propri social, e aggiungono un paio di influencer quando vogliono farsi conoscere.' );
	$p[] = array( 'h', '2. Cosa fa salire il prezzo' );
	$p[] = array( 'p', 'Tre cose. I follower: un creator con 10.000 follower parte da circa 300 € a contenuto, verso gli 80.000 si va sui 900–1.000 €. La nicchia: nutrizionisti, medici, avvocati, notai costano di più, perché il loro pubblico li ascolta davvero. E i diritti d’uso: se vuoi usare il video anche nelle inserzioni, va concordato.' );
	$p[] = array( 'p', 'Non farti spaventare dai numeri: per ogni budget costruiamo un progetto, e la trattativa con i creator la facciamo noi. È lì che si risparmia.' );
	$p[] = array( 'h', '3. Come si capisce se ha funzionato' );
	$p[] = array( 'p', 'Ogni contenuto ha il suo link tracciato: alla fine sai quante persone sono arrivate da ogni creator. Non ti chiedo di fidarti sulla parola, ti facciamo vedere i numeri.' );
	$p[] = array( 'h', '4. Le due strade' );
	$p[] = array( 'p', '<strong>La gestisci tu.</strong> Su Influencee cerchi i creator per categoria e città, pubblichi un’offerta gratis e i creator si candidano; contratto e link tracciati li fa la piattaforma. Hai 3 giorni di Premium gratis, senza carta: <a href="' . esc_url( $d['link_brand'] ) . '" style="color:#d6006f">inizia da qui</a>. Se vuoi solo far candidare i creator, <a href="' . esc_url( $d['link_offerta'] ) . '" style="color:#d6006f">pubblica l’offerta</a>.' );
	$p[] = array( 'p', '<strong>La gestiamo noi.</strong> Scegliamo i creator con te, contrattiamo il prezzo, seguiamo brief e contenuti e ti mandiamo i risultati. È quello che trovi nel preventivo che ti arriva.' );
	$p[] = array( 'p', 'Se vuoi accorciare i tempi, rispondi pure a questa email: la leggo io. Oppure scrivici su WhatsApp al ' . $e( $d['whatsapp'] ) . '.' );
	$p[] = array( 'p', 'A presto,<br>' . $e( $d['firma_nome'] ) . '<br><span style="color:#6b6b6b">' . $e( $d['firma_ruolo'] ) . '</span>' );
	if ( ! empty( $d['riepilogo'] ) ) {
		$p[] = array( 'ps', 'P.S. Questo è quello che mi hai scritto nel calcolatore. Se qualcosa non torna, rispondimi e lo sistemiamo: ' . $e( $d['riepilogo'] ) );
	}

	$html = '<!doctype html><html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>' . $e( infc_guida_oggetto( $nome ) ) . '</title></head>'
		. '<body style="margin:0;padding:0;background:#ffffff"><div style="max-width:560px;margin:0 auto;padding:24px 20px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#222222">';
	$text = '';
	foreach ( $p as $x ) {
		if ( 'h' === $x[0] ) {
			$html .= '<p style="margin:22px 0 6px"><strong>' . $x[1] . '</strong></p>';
		} elseif ( 'ps' === $x[0] ) {
			$html .= '<p style="margin:22px 0 0;font-size:13px;color:#6b6b6b">' . $x[1] . '</p>';
		} else {
			$html .= '<p style="margin:0 0 14px">' . $x[1] . '</p>';
		}
		$plain = html_entity_decode( wp_strip_all_tags( str_replace( '<br>', "\n", preg_replace( '#<a href="([^"]+)"[^>]*>(.*?)</a>#', '$2 ($1)', $x[1] ) ) ), ENT_QUOTES, 'UTF-8' );
		$text .= $plain . "\n\n";
	}
	$html .= '</div></body></html>';
	return array( 'html' => $html, 'text' => trim( $text ) . "\n" );
}
