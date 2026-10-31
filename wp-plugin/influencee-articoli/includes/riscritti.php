<?php
/**
 * Articoli riscritti (lotto 1 dal 31/10/2026): il testo nuovo sta in riscritti/<slug>.html e riscritti/stato.json
 * dice se è «bozza» o «pubblicato». Il testo vecchio resta nel database: per tornare indietro basta togliere la voce.
 * - pubblicato: il sito mostra il testo nuovo allo stesso indirizzo;
 * - bozza: si vede solo con ?anteprima=1 (noindex, fuori dalla cache), per la lettura prima della pubblicazione.
 * Segnaposto immagini nel testo: <!-- IMMAGINE: nome-file.webp | testo alternativo | didascalia --> diventa una
 * figura quando il file è in assets/immagini/ (immagini dalla cartella Drive «Immagini pronte»).
 */

defined( 'ABSPATH' ) || exit;

function inft_riscritti_stato() {
	static $s = null;
	if ( null === $s ) {
		$f = INFA_DIR . 'riscritti/stato.json';
		$s = file_exists( $f ) ? json_decode( (string) file_get_contents( $f ), true ) : array(); // phpcs:ignore WordPress.WP.AlternativeFunctions
		$s = is_array( $s ) ? $s : array();
	}
	return $s;
}

function inft_riscritto_anteprima() {
	return isset( $_GET['anteprima'] ) && '1' === (string) $_GET['anteprima']; // phpcs:ignore WordPress.Security.NonceVerification
}

/** Testo riscritto dell'articolo, se c'è e se si può mostrare: array( html, data ) oppure null. */
function inft_riscritto( $path ) {
	$s = inft_riscritti_stato();
	if ( empty( $s[ $path ]['file'] ) ) {
		return null;
	}
	$e    = $s[ $path ];
	$pub  = isset( $e['stato'] ) && 'pubblicato' === $e['stato'];
	if ( ! $pub && ! inft_riscritto_anteprima() ) {
		return null;
	}
	$file = INFA_DIR . 'riscritti/' . basename( $e['file'] );
	if ( ! file_exists( $file ) ) {
		return null;
	}
	$html = (string) file_get_contents( $file ); // phpcs:ignore WordPress.WP.AlternativeFunctions
	return array( 'html' => inft_riscritto_immagini( $html ), 'data' => isset( $e['data'] ) ? (string) $e['data'] : '', 'bozza' => ! $pub );
}

/** Voce (title, desc, «In breve», link) del testo riscritto, solo quando il testo riscritto si vede. */
function inft_riscritto_voce( $path ) {
	static $voci = null;
	if ( null === $voci ) {
		$f    = INFA_DIR . 'riscritti/voci.php';
		$voci = file_exists( $f ) ? (array) require $f : array();
	}
	return ( isset( $voci[ $path ] ) && inft_riscritto( $path ) ) ? $voci[ $path ] : null;
}

/**
 * Segnaposto immagine → figura, solo se il file esiste. Quarto campo facoltativo: immagine di riserva già
 * caricata su WordPress (/wp-content/uploads/…), mostrata finché il file nuovo non c'è.
 */
function inft_riscritto_immagini( $html ) {
	return preg_replace_callback(
		'#<!--\s*IMMAGINE:\s*([a-z0-9-]+\.(?:webp|jpg|png|svg))\s*\|\s*([^|]*?)\s*(?:\|\s*([^|]*?))?\s*(?:\|\s*(/wp-content/uploads/\S+))?\s*-->#i',
		function ( $m ) {
			$dir = file_exists( INFA_DIR . 'assets/immagini/' . $m[1] ) ? 'immagini' : ( file_exists( INFA_DIR . 'assets/grafici/' . $m[1] ) ? 'grafici' : '' );
			if ( ! $dir ) {
				if ( ! empty( $m[4] ) && preg_match( '#^/wp-content/uploads/[\w/.-]+\.(?:webp|jpe?g|png)$#i', $m[4] ) ) {
					return '<figure class="ia-fig"><img src="' . esc_url( home_url( $m[4] ) ) . '" alt="' . esc_attr( $m[2] ) . '" loading="lazy" decoding="async">' . ( ! empty( $m[3] ) ? '<figcaption>' . esc_html( $m[3] ) . '</figcaption>' : '' ) . '</figure>';
				}
				return '';
			}
			$size = 'grafici' === $dir ? ' width="1200" height="675"' : '';
			if ( 'immagini' === $dir && function_exists( 'getimagesize' ) ) {
				$sz = @getimagesize( INFA_DIR . 'assets/immagini/' . $m[1] ); // phpcs:ignore WordPress.PHP.NoSilencedErrors
				$size = $sz ? ' width="' . (int) $sz[0] . '" height="' . (int) $sz[1] . '"' : '';
			}
			return '<figure class="ia-fig"><img src="' . esc_url( INFA_URL . 'assets/' . $dir . '/' . $m[1] ) . '" alt="' . esc_attr( $m[2] ) . '"' . $size . ' loading="lazy" decoding="async">' . ( ! empty( $m[3] ) ? '<figcaption>' . esc_html( $m[3] ) . '</figcaption>' : '' ) . '</figure>';
		},
		$html
	);
}

/* Anteprima delle bozze: mai indicizzata, mai in cache */
add_filter(
	'wp_robots',
	function ( $r ) {
		if ( inft_riscritto_anteprima() && is_singular( 'post' ) ) {
			$r['noindex'] = true;
			$r['nofollow'] = true;
		}
		return $r;
	}
);
add_action(
	'template_redirect',
	function () {
		if ( inft_riscritto_anteprima() && is_singular( 'post' ) ) {
			nocache_headers();
			do_action( 'litespeed_control_set_nocache', 'anteprima articolo riscritto' );
		}
	},
	1
);
