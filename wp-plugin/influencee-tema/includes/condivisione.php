<?php
/**
 * Anteprima quando si condivide un link (LinkedIn, WhatsApp, Facebook, X, Slack): immagine 1200×630.
 * Le pagine servite dal Core senza immagine propria (home compresa) usano lo screenshot dell'hero della home
 * (assets/condivisione/home.jpg). Una pagina può averne una sua: assets/condivisione/<slug-della-pagina>.jpg.
 * I tag hanno data-inft perché il Core toglie dall'head gli Open Graph degli altri plugin.
 */

defined( 'ABSPATH' ) || exit;

/** Immagine di condivisione per una pagina del Core: array( url, larghezza, altezza ) oppure null. */
function infe_immagine_condivisione( $page ) {
	if ( ! empty( $page['image'] ) ) {
		return null; // la pagina ne ha già una (la stampa il Core)
	}
	$slug = isset( $page['path'] ) ? trim( (string) $page['path'], '/' ) : '';
	$slug = '' === $slug ? 'home' : sanitize_title( str_replace( '/', '-', $slug ) );
	$file = file_exists( INFE_DIR . 'assets/condivisione/' . $slug . '.jpg' ) ? $slug . '.jpg' : 'home.jpg';
	$img  = apply_filters( 'infe_immagine_condivisione', INFE_URL . 'assets/condivisione/' . $file, $page );
	return $img ? array( $img, 1200, 630 ) : null;
}

add_action(
	'wp_head',
	function () {
		if ( ! function_exists( 'inft_current' ) ) {
			return;
		}
		$page = inft_current();
		if ( ! $page ) {
			return;
		}
		$img = infe_immagine_condivisione( $page );
		if ( ! $img ) {
			return;
		}
		$alt = ! empty( $page['title'] ) ? $page['title'] : 'Influencee';
		echo '<meta data-inft property="og:image" content="' . esc_url( $img[0] ) . '">' . "\n";
		echo '<meta data-inft property="og:image:secure_url" content="' . esc_url( $img[0] ) . '">' . "\n";
		echo '<meta data-inft property="og:image:type" content="image/jpeg">' . "\n";
		echo '<meta data-inft property="og:image:width" content="' . (int) $img[1] . '">' . "\n";
		echo '<meta data-inft property="og:image:height" content="' . (int) $img[2] . '">' . "\n";
		echo '<meta data-inft property="og:image:alt" content="' . esc_attr( $alt ) . '">' . "\n";
		echo '<meta data-inft name="twitter:image" content="' . esc_url( $img[0] ) . '">' . "\n";
		echo '<meta data-inft name="twitter:title" content="' . esc_attr( isset( $page['title'] ) ? $page['title'] : '' ) . '">' . "\n";
		echo '<meta data-inft name="twitter:description" content="' . esc_attr( isset( $page['description'] ) ? $page['description'] : '' ) . '">' . "\n";
	},
	2
);
