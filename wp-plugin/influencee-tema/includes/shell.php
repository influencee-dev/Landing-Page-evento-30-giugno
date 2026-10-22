<?php
/**
 * Guscio HTML5 del sito: documento, intestazione, piè di pagina, CSS e JS del Tema.
 *
 * Modi (impostazione "tema"):
 * - off:    tutto come prima (tema WordPress + Elementor);
 * - plugin: solo le pagine servite dai plugin Influencee (tool, pagine, articoli, annunci);
 * - tutto:  anche le altre pagine e articoli singoli; se il contenuto è fatto con Elementor resta Elementor
 *           per il contenuto, ma intestazione e piè di pagina sono i nostri.
 * Percorsi in "tema_esclusi" non usano mai il Tema.
 */

defined( 'ABSPATH' ) || exit;

function infe_settings() {
	return wp_parse_args( inft_settings(), array( 'tema' => 'off', 'tema_esclusi' => '' ) );
}

/** Pagina servita da un plugin Influencee (contenuto già HTML5)? */
function infe_pagina_plugin() {
	return ( function_exists( 'inft_current' ) && inft_current() ) || ( function_exists( 'inft_article_current' ) && inft_article_current() );
}

/** Pagina o articolo singolo il cui contenuto è disegnato con Elementor. */
function infe_contenuto_elementor() {
	if ( ! is_singular() ) {
		return false;
	}
	return 'builder' === get_post_meta( get_queried_object_id(), '_elementor_edit_mode', true );
}

/** Il Tema vale per questa richiesta? */
function infe_attivo() {
	static $esito = null;
	if ( null !== $esito ) {
		return $esito;
	}
	$esito = false;
	if ( is_admin() || wp_doing_ajax() || is_feed() || is_embed() || ( defined( 'REST_REQUEST' ) && REST_REQUEST ) || ! did_action( 'wp' ) ) {
		return false;
	}
	if ( isset( $_GET['elementor-preview'] ) || isset( $_GET['preview'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification
		return false;
	}
	$s    = infe_settings();
	$path = function_exists( 'inft_request_path' ) ? inft_request_path() : '/';
	foreach ( preg_split( '/\s+/', (string) $s['tema_esclusi'], -1, PREG_SPLIT_NO_EMPTY ) as $x ) {
		if ( trailingslashit( '/' . trim( $x, '/' ) ) === $path || ( '/' === $x && '/' === $path ) ) {
			return false;
		}
	}
	if ( 'plugin' === $s['tema'] ) {
		$esito = infe_pagina_plugin();
	} elseif ( 'tutto' === $s['tema'] ) {
		$esito = infe_pagina_plugin() || is_singular( array( 'page', 'post' ) );
	}
	return $esito;
}

add_filter( 'inft_shell_active', function ( $v ) { return $v || infe_attivo(); } );

/* ─── Documento: intestazione ─── */

add_action(
	'inft_shell_header',
	function () {
		ob_start( 'infe_pulisci_html' );
		?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1">
<?php wp_head(); ?>
</head>
<body <?php body_class( 'inf-tema' ); ?>>
<?php wp_body_open(); ?>
<a class="it-skip" href="#contenuto">Vai al contenuto</a>
<?php echo infe_header_html(); // phpcs:ignore WordPress.Security.EscapeOutput -- costruito ed escapato in infe_header_html ?>
<div id="contenuto" class="it-contenuto">
		<?php
	}
);

add_action(
	'inft_shell_footer',
	function () {
		echo "</div>\n" . infe_footer_html(); // phpcs:ignore WordPress.Security.EscapeOutput -- costruito ed escapato in infe_footer_html
		wp_footer();
		echo "\n</body>\n</html>\n";
		ob_end_flush();
	}
);

function infe_logo() {
	return '<a class="it-logo" href="' . esc_url( home_url( '/' ) ) . '" aria-label="Influencee, home"><span class="it-mark" aria-hidden="true"><span></span><i></i></span>influencee</a>';
}

/** Tipo di pagina per GA4 (page_type) quando il contenuto non lo dichiara: tool, articolo, offerte, pagina. */
function infe_tipo_pagina() {
	if ( function_exists( 'inft_current' ) && inft_current() ) {
		$p = inft_current();
		return isset( $p['group'] ) && 'tool' === $p['group'] ? 'tool' : ( isset( $p['render'] ) ? 'offerte' : 'pagina' );
	}
	if ( function_exists( 'inft_article_current' ) && inft_article_current() ) {
		return 'articolo';
	}
	return is_front_page() ? 'home' : 'pagina';
}

function infe_header_html() {
	$t  = esc_attr( infe_tipo_pagina() );
	$h  = '<header class="it-header inf-scope" data-inft-track data-page-type="' . $t . '" data-section="header"><div class="inf-wrap it-bar">' . infe_logo();
	$h .= '<nav class="it-nav" id="it-nav" aria-label="Menu principale"><ul class="it-menu">';
	foreach ( infe_menu() as $g ) {
		if ( empty( $g['items'] ) ) {
			$h .= '<li><a class="it-top" href="' . esc_url( infe_url( $g['href'] ) ) . '">' . esc_html( $g['label'] ) . '</a></li>';
			continue;
		}
		$h .= '<li class="it-group' . ( ! empty( $g['wide'] ) ? ' it-wide' : '' ) . '"><details><summary class="it-top">' . esc_html( $g['label'] ) . '<svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg></summary><div class="it-drop">';
		foreach ( $g['items'] as $it ) {
			$h .= '<a href="' . esc_url( infe_url( $it[1] ) ) . '"><b>' . esc_html( $it[0] ) . '</b>' . ( $it[2] ? '<span>' . esc_html( $it[2] ) . '</span>' : '' ) . '</a>';
		}
		$h .= '</div></details></li>';
	}
	$h .= '</ul><div class="it-mobile-cta"><a class="inf-btn inf-btn-line" href="' . esc_url( infe_app( '/login' ) ) . '">Accedi</a><a class="inf-btn inf-btn-acid" href="' . esc_url( infe_app() ) . '">Inizia gratis</a></div></nav>';
	$h .= '<div class="it-cta"><a class="it-login" href="' . esc_url( infe_app( '/login' ) ) . '">Accedi</a><a class="inf-btn inf-btn-acid it-start" href="' . esc_url( infe_app() ) . '">Inizia gratis</a>';
	$h .= '<button type="button" class="it-burger" aria-controls="it-nav" aria-expanded="false" aria-label="Apri il menu"><span></span><span></span><span></span></button></div>';
	return $h . '</div></header>';
}

function infe_footer_html() {
	$f  = '<footer class="it-footer inf-scope" data-inft-track data-page-type="' . esc_attr( infe_tipo_pagina() ) . '" data-section="footer"><div class="inf-wrap it-fgrid"><div class="it-fbrand">' . infe_logo();
	$f .= '<p>Influencer 100% italiani. Piattaforma di influencer marketing per aziende, agenzie e creator.</p>';
	$f .= '<p class="it-social">';
	foreach ( infe_social() as $s ) {
		$f .= '<a href="' . esc_url( $s[1] ) . '" rel="noopener" target="_blank">' . esc_html( $s[0] ) . '</a>';
	}
	$f .= '</p></div>';
	foreach ( array_merge( infe_footer_colonne(), infe_struttura() ) as $titolo => $links ) {
		$f .= '<div><p class="inf-label">' . esc_html( $titolo ) . '</p><ul>';
		foreach ( $links as $l ) {
			$f .= '<li><a href="' . esc_url( infe_url( $l[1] ) ) . '">' . esc_html( $l[0] ) . '</a></li>';
		}
		$f .= '</ul></div>';
	}
	$f .= '</div><div class="inf-wrap it-flegal"><span>© ' . esc_html( gmdate( 'Y' ) ) . ' Partidea S.r.l. · P.IVA 04405500408</span><span>';
	foreach ( infe_legali() as $l ) {
		$f .= '<a href="' . esc_url( infe_url( $l[1] ) ) . '">' . esc_html( $l[0] ) . '</a>';
	}
	return $f . '</span></div></footer>';
}

/* ─── Pagine non servite dai plugin (modo "tutto"): stesso guscio, contenuto di WordPress ─── */

add_filter(
	'template_include',
	function ( $tpl ) {
		if ( infe_attivo() && ! infe_pagina_plugin() && is_singular( array( 'page', 'post' ) ) ) {
			return INFE_DIR . 'includes/template-pagina.php';
		}
		return $tpl;
	},
	99
);

/* ─── CSS e JS: solo i nostri dove il contenuto è HTML5; dove resta Elementor, via solo tema e vecchio header ─── */

function infe_da_togliere( $src ) {
	$sempre = '#/themes/hello-elementor/|/plugins/influencee-header-footer/#';
	$elem   = '#/plugins/elementor/|/plugins/elementor-pro/|/uploads/elementor/#';
	if ( preg_match( $sempre, $src ) ) {
		return true;
	}
	return ! infe_contenuto_elementor() && preg_match( $elem, $src );
}

function infe_togli_asset() {
	if ( ! infe_attivo() ) {
		return;
	}
	foreach ( array( wp_styles(), wp_scripts() ) as $q ) {
		foreach ( (array) $q->queue as $h ) {
			$src = isset( $q->registered[ $h ] ) ? (string) $q->registered[ $h ]->src : '';
			if ( ( $src && infe_da_togliere( $src ) ) || ( 0 === strpos( $h, 'elementor-gf-' ) && ! infe_contenuto_elementor() ) ) { // anche i Google Fonts globali di Elementor
				$q->dequeue( $h );
			}
		}
	}
}
add_action( 'wp_enqueue_scripts', 'infe_togli_asset', 9999 );
add_action( 'wp_print_styles', 'infe_togli_asset', 0 );
add_action( 'wp_print_scripts', 'infe_togli_asset', 0 );
add_action( 'wp_print_footer_scripts', 'infe_togli_asset', 0 );

add_action(
	'wp_enqueue_scripts',
	function () {
		if ( ! infe_attivo() ) {
			return;
		}
		inft_enqueue_base(); // Core: CSS base e tracciamento GA4
		wp_enqueue_style( 'infe-tema', INFE_URL . 'assets/tema.css', array( 'inft-base' ), INFE_VERSION );
		wp_enqueue_script( 'infe-tema', INFE_URL . 'assets/tema.js', array(), INFE_VERSION, array( 'in_footer' => true, 'strategy' => 'defer' ) );
	},
	50
);

/** Toglie dall'HTML finale gli header e footer di Elementor e del vecchio plugin, se qualcuno li stampa lo stesso. */
function infe_pulisci_html( $html ) {
	$html = infe_togli_elemento( $html, '#<header\b[^>]*data-elementor-type=["\']header["\'][^>]*>#i', 'header' );
	$html = infe_togli_elemento( $html, '#<footer\b[^>]*data-elementor-type=["\']footer["\'][^>]*>#i', 'footer' );
	$html = infe_togli_elemento( $html, '#<header\b[^>]*class=["\'][^"\']*\bifn-header\b[^>]*>#i', 'header' );
	$html = infe_togli_elemento( $html, '#<div\b[^>]*class=["\'][^"\']*\bifn-preheader\b[^>]*>#i', 'div' );
	$html = infe_togli_elemento( $html, '#<footer\b[^>]*class=["\'][^"\']*\bifn-footer\b[^>]*>#i', 'footer' );
	return $html;
}

function infe_togli_elemento( $html, $open_re, $tag ) {
	while ( preg_match( $open_re, $html, $m, PREG_OFFSET_CAPTURE ) ) {
		$start = $m[0][1];
		$pos   = $start + strlen( $m[0][0] );
		$depth = 1;
		while ( $depth > 0 && preg_match( '#<(/?)' . $tag . '\b[^>]*>#i', $html, $t, PREG_OFFSET_CAPTURE, $pos ) ) {
			$depth += '/' === $t[1][0] ? -1 : 1;
			$pos    = $t[0][1] + strlen( $t[0][0] );
		}
		if ( $depth > 0 ) {
			break;
		}
		$html = substr( $html, 0, $start ) . substr( $html, $pos );
	}
	return $html;
}
