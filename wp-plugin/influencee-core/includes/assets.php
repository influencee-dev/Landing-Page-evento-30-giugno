<?php
/**
 * CSS e JavaScript condivisi dai plugin Influencee che generano pagine HTML5 (Articoli, Annunci…).
 * - assets/inft-base.css: colori, caratteri, pulsanti, moduli, etichette del sito (un solo file, in cache tra le pagine);
 * - assets/inft-track.js: tracciamento GA4 leggero (clic, profondità di lettura, FAQ, moduli lead, copia link)
 *   con gli stessi nomi di eventi del piano di misurazione (ANALYTICS-PIANO.md).
 * Ogni pagina indica il suo tipo con data-page-type sul contenitore [data-inft-track].
 */

defined( 'ABSPATH' ) || exit;

function inft_enqueue_base() {
	wp_enqueue_style( 'inft-fonts-lite', 'https://fonts.googleapis.com/css2?family=Inter+Tight:wght@600;700&family=Inter:wght@400;600&display=swap', array(), null );
	wp_enqueue_style( 'inft-base', INFC_URL . 'assets/inft-base.css', array(), INFC_VERSION );
	wp_enqueue_script( 'inft-track', INFC_URL . 'assets/inft-track.js', array(), INFC_VERSION, array( 'in_footer' => true, 'strategy' => 'defer' ) );
}

/** Stampa i tag SEO di una pagina HTML5 generata da un plugin (description, Open Graph, canonical, JSON-LD). */
function inft_print_seo( $meta ) {
	$url = isset( $meta['url'] ) ? $meta['url'] : home_url( isset( $meta['path'] ) ? $meta['path'] : '/' );
	if ( ! empty( $meta['description'] ) ) {
		echo '<meta data-inft name="description" content="' . esc_attr( $meta['description'] ) . '">' . "\n";
		echo '<meta data-inft property="og:description" content="' . esc_attr( $meta['description'] ) . '">' . "\n";
	}
	if ( ! empty( $meta['title'] ) ) {
		echo '<meta data-inft property="og:title" content="' . esc_attr( $meta['title'] ) . '">' . "\n";
	}
	echo '<meta data-inft property="og:type" content="' . esc_attr( isset( $meta['og_type'] ) ? $meta['og_type'] : 'website' ) . '">' . "\n";
	echo '<meta data-inft property="og:locale" content="it_IT">' . "\n";
	echo '<meta data-inft property="og:site_name" content="Influencee">' . "\n";
	echo '<meta data-inft property="og:url" content="' . esc_url( $url ) . '">' . "\n";
	echo '<link data-inft rel="canonical" href="' . esc_url( $url ) . '">' . "\n";
	if ( ! empty( $meta['image'] ) ) {
		echo '<meta data-inft property="og:image" content="' . esc_url( $meta['image'] ) . '">' . "\n";
	}
	echo '<meta data-inft name="twitter:card" content="summary_large_image">' . "\n";
	foreach ( isset( $meta['ld'] ) ? (array) $meta['ld'] : array() as $ld ) {
		if ( $ld ) {
			echo '<script type="application/ld+json" data-inft>' . wp_json_encode( $ld, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES ) . '</script>' . "\n";
		}
	}
}

/** Entità Influencee, uguale su tutte le pagine (coerenza per Google e motori AI). */
function inft_org_ld() {
	$logo = get_theme_mod( 'custom_logo' ) ? wp_get_attachment_image_url( (int) get_theme_mod( 'custom_logo' ), 'full' ) : get_site_icon_url( 512 );
	$org  = array( '@type' => 'Organization', '@id' => home_url( '/#org' ), 'name' => 'Influencee', 'legalName' => INFT_COMPANY, 'url' => home_url( '/' ) );
	if ( $logo ) {
		$org['logo'] = array( '@type' => 'ImageObject', 'url' => $logo );
	}
	return $org;
}

/** Link verso l'app con i parametri di provenienza (per GA4 e per la fonte di iscrizione dell'app). */
function inft_app_link( $path, $campaign, $extra = array() ) {
	$base = untrailingslashit( apply_filters( 'inft_app_url', 'https://app.influencee.it' ) );
	return add_query_arg( array_merge( array( 'utm_source' => 'influencee.it', 'utm_medium' => 'referral', 'utm_campaign' => $campaign ), $extra ), $base . $path );
}
