<?php
/**
 * CSS e JavaScript condivisi dai plugin Influencee che generano pagine HTML5 (Articoli, Annunci…).
 * - assets/inft-base.css: colori, caratteri, pulsanti, moduli, etichette del sito (un solo file, in cache tra le pagine);
 * - assets/inft-track.js: tracciamento GA4 leggero (clic, profondità di lettura, FAQ, moduli lead, copia link)
 *   con gli stessi nomi di eventi del piano di misurazione (ANALYTICS-PIANO.md).
 * Ogni pagina indica il suo tipo con data-page-type sul contenitore [data-inft-track].
 */

defined( 'ABSPATH' ) || exit;

/**
 * Caratteri ospitati sul sito (assets/fonts, sottoinsieme latino, font variabili): prima arrivavano da Google Fonts,
 * cioè due connessioni in più (fonts.googleapis.com e fonts.gstatic.com) e un CSS che bloccava il disegno della
 * pagina. Ora le regole @font-face sono scritte nella pagina e i due caratteri della prima schermata sono
 * precaricati: il testo compare subito (font-display: swap) e il titolo non aspetta server esterni.
 * File presi da Google Fonts il 15/11/2026 (Inter, Inter Tight, Montserrat: licenza SIL Open Font License).
 */
function inft_fonts_css() {
	$u     = INFC_URL . 'assets/fonts/';
	$range = 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD';
	$css   = '';
	foreach ( array( 'Inter' => array( 'inter', '400 700' ), 'Inter Tight' => array( 'inter-tight', '400 700' ), 'Montserrat' => array( 'montserrat', '500 800' ) ) as $fam => $x ) {
		$css .= "@font-face{font-family:'" . $fam . "';font-style:normal;font-weight:" . $x[1] . ';font-display:swap;src:url(' . $u . $x[0] . '-latin.woff2?v=1) format("woff2");unicode-range:' . $range . '}';
	}
	return $css;
}

function inft_enqueue_fonts() {
	if ( wp_style_is( 'inft-fonts', 'registered' ) ) {
		wp_enqueue_style( 'inft-fonts' );
		return;
	}
	wp_register_style( 'inft-fonts', false, array(), null );
	wp_enqueue_style( 'inft-fonts' );
	wp_add_inline_style( 'inft-fonts', inft_fonts_css() );
}

/** Compatibilità: chi chiedeva l'indirizzo dei caratteri riceve quello del file principale ospitato sul sito. */
function inft_fonts_url() {
	return INFC_URL . 'assets/fonts/inter-latin.woff2';
}

// precarica i caratteri della prima schermata (titoli e testo), così arrivano insieme al CSS
add_action(
	'wp_head',
	function () {
		if ( ! wp_style_is( 'inft-fonts', 'enqueued' ) ) {
			return;
		}
		foreach ( array( 'inter-tight', 'inter' ) as $f ) {
			echo '<link rel="preload" href="' . esc_url( INFC_URL . 'assets/fonts/' . $f . '-latin.woff2?v=1' ) . '" as="font" type="font/woff2" crossorigin>' . "\n";
		}
	},
	2
);

function inft_enqueue_base() {
	inft_enqueue_fonts();
	wp_enqueue_style( 'inft-base', INFC_URL . 'assets/inft-base.css', array(), INFC_VERSION );
	wp_enqueue_script( 'inft-track', INFC_URL . 'assets/inft-track.js', array(), INFC_VERSION, array( 'in_footer' => true, 'strategy' => 'defer' ) );
}

/**
 * Intestazione e piè di pagina del sito per le pagine dei plugin. Se il plugin Influencee Tema è acceso per questa
 * pagina usa i suoi (HTML5, senza Elementor); altrimenti quelli del tema WordPress, come prima.
 */
function inft_get_header() {
	if ( has_action( 'inft_shell_header' ) && apply_filters( 'inft_shell_active', false ) ) {
		do_action( 'inft_shell_header' );
		return;
	}
	get_header();
}
function inft_get_footer() {
	if ( has_action( 'inft_shell_footer' ) && apply_filters( 'inft_shell_active', false ) ) {
		do_action( 'inft_shell_footer' );
		return;
	}
	get_footer();
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

/**
 * Pagine dei plugin Influencee (home, categorie, regioni, città, tool…): via quello che altri plugin caricano su
 * tutto il sito ma qui non serve e blocca il disegno della pagina.
 * - Brevo (mailin-front.css/js): serve solo dove c'è un modulo Brevo nel contenuto ([sibwp_form]);
 * - jQuery e jQuery Migrate (in testa alla pagina, bloccanti): tolti se nessuno script rimasto li usa;
 * - vecchio Influencee GeoPages Manager: chiede due file che non esistono più (404 su regioni e città).
 * Filtro 'inft_alleggerisci' (false) per tornare come prima.
 */
function inft_script_usa( $handle, $cercato, $visti = array() ) {
	$wp = wp_scripts();
	if ( empty( $wp->registered[ $handle ] ) || isset( $visti[ $handle ] ) ) {
		return false;
	}
	$visti[ $handle ] = true;
	foreach ( (array) $wp->registered[ $handle ]->deps as $d ) {
		if ( $d === $cercato || inft_script_usa( $d, $cercato, $visti ) ) {
			return true;
		}
	}
	return false;
}

add_action(
	'wp_enqueue_scripts',
	function () {
		if ( is_admin() || ! function_exists( 'inft_current' ) || ! inft_current() || ! apply_filters( 'inft_alleggerisci', true ) ) {
			return;
		}
		$post = get_post();
		if ( ! ( $post && false !== strpos( (string) $post->post_content, 'sibwp_form' ) ) ) {
			wp_dequeue_script( 'sib-front-js' );
			wp_dequeue_style( 'sib-front-css' );
		}
		foreach ( array( wp_scripts(), wp_styles() ) as $deps ) {
			foreach ( (array) $deps->queue as $h ) {
				$src = isset( $deps->registered[ $h ] ) ? (string) $deps->registered[ $h ]->src : '';
				if ( false !== strpos( $src, '/plugins/influencee-geo/' ) ) {
					$deps instanceof WP_Scripts ? wp_dequeue_script( $h ) : wp_dequeue_style( $h );
				}
			}
		}
		$serve = false;
		foreach ( (array) wp_scripts()->queue as $h ) {
			if ( in_array( $h, array( 'jquery', 'jquery-core', 'jquery-migrate' ), true ) ) {
				continue;
			}
			if ( inft_script_usa( $h, 'jquery' ) || inft_script_usa( $h, 'jquery-core' ) ) {
				$serve = true;
				break;
			}
		}
		if ( ! $serve ) {
			wp_dequeue_script( 'jquery' );
			wp_dequeue_script( 'jquery-core' );
			wp_dequeue_script( 'jquery-migrate' );
		}
	},
	999
);
