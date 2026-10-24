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
	if ( infe_pagina_plugin() ) {
		return false; // la pagina WordPress può essere Elementor, ma il contenuto lo disegna il plugin
	}
	if ( ! is_singular() ) {
		return false;
	}
	if ( ! defined( 'ELEMENTOR_VERSION' ) ) {
		return false; // Elementor spento: il contenuto è il testo di riserva salvato da Elementor, lo impagina il Tema
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
		$esito = true; // tutto il sito: anche profili, offerte di lavoro, 404 e archivi degli altri plugin
	}
	return $esito;
}

add_filter( 'inft_shell_active', function ( $v ) { return $v || infe_attivo(); } );

/* ─── Documento: intestazione ─── */

/** Avvia una sola volta il filtro che toglie header e footer vecchi dall'HTML finale. */
function infe_avvia_pulizia() {
	if ( ! infe_stampato( 'pulizia' ) ) {
		infe_stampato( 'pulizia', true );
		ob_start( 'infe_pulisci_html' );
	}
}

/** Intestazione già stampata in questa richiesta (guscio del Tema o template di un altro plugin). */
function infe_stampato( $cosa, $segna = false ) {
	static $fatto = array();
	if ( $segna ) {
		$fatto[ $cosa ] = true;
	}
	return ! empty( $fatto[ $cosa ] );
}

/*
 * Pagine con il template di un altro plugin o del tema (profili creator, offerte di lavoro, 404, archivi):
 * il tema non stampa il suo header (filtro di Hello Elementor), noi stampiamo i nostri in wp_body_open e wp_footer
 * e l'HTML finale viene ripulito da header e footer di Elementor Pro o del vecchio plugin.
 */
add_action(
	'template_redirect',
	function () {
		if ( infe_attivo() ) {
			add_filter( 'hello_elementor_header_footer', '__return_false' );
			infe_avvia_pulizia();
		}
	},
	999
);
add_action(
	'wp_body_open',
	function () {
		if ( infe_attivo() && ! infe_stampato( 'header' ) ) {
			infe_stampato( 'header', true );
			echo '<a class="it-skip" href="#contenuto">Vai al contenuto</a>' . infe_header_html() . '<div id="contenuto" class="it-contenuto">'; // phpcs:ignore WordPress.Security.EscapeOutput
		}
	},
	1
);
add_action(
	'wp_footer',
	function () {
		if ( infe_attivo() && infe_stampato( 'header' ) && ! infe_stampato( 'footer' ) ) {
			infe_stampato( 'footer', true );
			echo "</div>\n" . infe_footer_html(); // phpcs:ignore WordPress.Security.EscapeOutput
		}
	},
	1
);
add_filter( 'body_class', function ( $c ) { return infe_attivo() ? array_merge( $c, array( 'inf-tema' ) ) : $c; } );

add_action(
	'inft_shell_header',
	function () {
		infe_avvia_pulizia(); // le pagine dei plugin arrivano qui prima di template_redirect 999
		infe_stampato( 'header', true );
		infe_stampato( 'footer', true ); // il guscio stampa da sé il piè di pagina
		?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1">
<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
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
	}
);

function infe_logo() {
	return '<a class="it-logo" href="' . esc_url( home_url( '/' ) ) . '" aria-label="Influencee, home"><img src="' . esc_url( INFE_URL . 'assets/logo.svg' ) . '" alt="Influencee" width="150" height="24"></a>';
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
	if ( infe_elenco() ) {
		return 'blog';
	}
	return is_front_page() ? 'home' : 'pagina';
}

function infe_header_html() {
	$t  = esc_attr( infe_tipo_pagina() );
	$h  = '<header class="it-header inf-scope" data-inft-track data-page-type="' . $t . '" data-section="header"><div class="it-wrapw it-bar">' . infe_logo();
	$h .= '<nav class="it-nav" id="it-nav" aria-label="Menu principale"><ul class="it-menu">';
	foreach ( infe_menu() as $i => $g ) {
		if ( empty( $g['cols'] ) ) {
			$h .= '<li><a class="it-top" href="' . esc_url( infe_url( $g['href'] ) ) . '">' . esc_html( $g['label'] ) . '</a></li>';
			continue;
		}
		$sez = 'header_' . sanitize_title( $g['label'] );
		$h  .= '<li class="it-group"><details><summary class="it-top">' . esc_html( $g['label'] ) . '<svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg></summary>';
		$h  .= '<div class="it-mega" data-section="' . esc_attr( $sez ) . '"><div class="it-wrapw it-mega-in' . ( ! empty( $g['wide'] ) ? ' it-mega-wide' : '' ) . '">';
		foreach ( $g['cols'] as $c ) {
			if ( empty( $c['items'] ) ) {
				continue;
			}
			$h .= '<div class="it-col"><p class="it-col-t">' . esc_html( $c['title'] ) . '</p><div class="' . ( ! empty( $c['chips'] ) ? 'it-chips' : 'it-voci' ) . '">';
			foreach ( $c['items'] as $it ) {
				if ( ! empty( $c['chips'] ) ) {
					$h .= '<a class="it-chip" href="' . esc_url( infe_url( $it[1] ) ) . '">' . esc_html( $it[0] ) . '</a>';
					continue;
				}
				$h .= '<a class="it-voce" href="' . esc_url( infe_url( $it[1] ) ) . '"><span class="it-ico">' . infe_icona( $it[3] ) . '</span><span><b>' . esc_html( $it[0] ) . '</b>' . ( $it[2] ? '<small>' . esc_html( $it[2] ) . '</small>' : '' ) . '</span></a>';
			}
			$h .= '</div></div>';
		}
		if ( ! empty( $g['card'] ) ) {
			list( $eye, $tit, $txt, $cta, $href ) = $g['card'];
			$h .= '<div class="it-card"><p class="it-card-eye">' . esc_html( $eye ) . '</p><p class="it-card-t">' . esc_html( $tit ) . '</p><p class="it-card-x">' . esc_html( $txt ) . '</p><a class="inf-btn inf-btn-acid" href="' . esc_url( infe_url( $href ) ) . '">' . esc_html( $cta ) . ' <span aria-hidden="true">→</span></a></div>';
		}
		$h .= '</div></div></details></li>';
	}
	$h .= '</ul><div class="it-mobile-cta"><a class="inf-btn inf-btn-line" href="' . esc_url( infe_app( '/accounts/login/' ) ) . '">Accedi</a><a class="inf-btn inf-btn-acid" href="' . esc_url( infe_app( '/iscriviti/' ) ) . '">Inizia gratis</a></div></nav>';
	$h .= '<div class="it-cta"><a class="it-login" href="' . esc_url( infe_app( '/accounts/login/' ) ) . '">Accedi</a><a class="inf-btn inf-btn-acid it-start" href="' . esc_url( infe_app( '/iscriviti/' ) ) . '">Inizia gratis</a>';
	$h .= '<button type="button" class="it-burger" aria-controls="it-nav" aria-expanded="false" aria-label="Apri il menu"><span></span><span></span><span></span></button></div>';
	return $h . '</div></header>';
}

function infe_footer_html() {
	$f  = '<footer class="it-footer inf-scope" data-inft-track data-page-type="' . esc_attr( infe_tipo_pagina() ) . '" data-section="footer">';
	$f .= '<div class="it-fcta" data-section="footer_cta"><div class="it-wrapw it-fcta-in"><div><p class="it-feye">Influencer marketing 100% italiano</p><p class="it-fhead">Brand e creator italiani, <em>nello stesso posto.</em></p></div>';
	$f .= '<div class="it-fbtn"><a class="inf-btn inf-btn-acid" href="' . esc_url( infe_app( '/iscriviti/brand/' ) ) . '">Sono un brand</a><a class="inf-btn it-btn-ghost" href="' . esc_url( infe_app( '/iscriviti/creator/' ) ) . '">Sono un creator</a></div></div></div>';
	$f .= '<div class="it-wrapw it-fgrid"><div class="it-fbrand">' . infe_logo();
	$f .= '<p>Piattaforma di influencer marketing con solo creator italiani: per aziende, agenzie e creator.</p><p class="it-social">';
	foreach ( infe_social() as $s ) {
		$f .= '<a href="' . esc_url( $s[1] ) . '" rel="noopener" target="_blank" aria-label="' . esc_attr( $s[0] ) . '"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' . $s[2] . '</svg></a>';
	}
	$f .= '</p></div>';
	foreach ( infe_footer_colonne() as $titolo => $links ) {
		$f .= '<div><p class="it-ftit">' . esc_html( $titolo ) . '</p><ul>';
		foreach ( $links as $l ) {
			$f .= '<li><a href="' . esc_url( infe_url( $l[1] ) ) . '">' . esc_html( $l[0] ) . '</a></li>';
		}
		$f .= '</ul></div>';
	}
	$f .= '</div>';
	$f .= '<div class="it-wrapw it-flegal"><span>© ' . esc_html( gmdate( 'Y' ) ) . ' Partidea S.r.l. · P.IVA 04405500408</span><span>';
	foreach ( infe_legali() as $l ) {
		$f .= '<a href="' . esc_url( infe_url( $l[1] ) ) . '">' . esc_html( $l[0] ) . '</a>';
	}
	return $f . '</span></div></footer>';
}

/**
 * Testo di una pagina WordPress (anche il testo di riserva di Elementor): gli H1 del testo diventano H2 (l'H1 è il titolo),
 * via paragrafi e contenitori vuoti, via i resti delle icone di Elementor.
 */
function infe_testo_pulito( $html ) {
	$html = preg_replace( '#<h1(\s[^>]*)?>(.*?)</h1>#is', '<h2$1>$2</h2>', $html );
	$html = preg_replace( '#<(p|div|span|h[2-6])[^>]*>(\s|&nbsp;|\x{200B})*</\1>#iu', '', $html );
	$html = preg_replace( '#<li[^>]*>\s*(Facebook-f|Instagram|Linkedin|Youtube|Tiktok|Twitter)\s*</li>#i', '', $html );
	return (string) $html;
}

/** Pagine elenco degli articoli: blog, categorie, tag, autore, ricerca. */
function infe_elenco() {
	return is_home() || is_category() || is_tag() || is_author() || is_search() || is_date();
}

/* ─── Pagine non servite dai plugin (modo "tutto"): stesso guscio, contenuto di WordPress ─── */

add_filter(
	'template_include',
	function ( $tpl ) {
		if ( infe_attivo() && ! infe_pagina_plugin() && is_singular( array( 'page', 'post' ) ) ) {
			return INFE_DIR . 'includes/template-pagina.php';
		}
		if ( infe_attivo() && infe_elenco() ) {
			return INFE_DIR . 'includes/template-elenco.php';
		}
		return $tpl;
	},
	99
);

/* ─── CSS e JS: solo i nostri dove il contenuto è HTML5; dove resta Elementor, via solo tema e vecchio header ─── */

/** Pagine che usano davvero WP Job Manager (singola offerta, archivio, shortcode delle offerte). */
function infe_pagina_offerte() {
	if ( is_singular( 'job_listing' ) || is_post_type_archive( 'job_listing' ) || is_tax( array( 'job_listing_type', 'job_listing_category' ) ) ) {
		return true;
	}
	$post = get_queried_object();
	return $post instanceof WP_Post && preg_match( '/\[(jobs|submit_job_form|job_dashboard|job)\b/', (string) $post->post_content );
}

function infe_da_togliere( $src ) {
	$sempre = '#/themes/hello-elementor/|/plugins/influencee-header-footer/#';
	// CSS di WP Job Manager solo dove servono le sue offerte (prima su ogni pagina)
	if ( preg_match( '#/plugins/wp-job-manager/assets/[^?]*\.css#', $src ) && ! infe_pagina_offerte() ) {
		return true;
	}
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
		if ( function_exists( 'inft_enqueue_fonts' ) ) {
			inft_enqueue_fonts(); // Core 2.2.8+: un solo foglio con tutti i caratteri del sito (Montserrat compreso)
			$font = 'inft-fonts';
		} else {
			wp_enqueue_style( 'infe-font', 'https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700;800&display=swap', array(), null );
			$font = 'infe-font';
		}
		wp_enqueue_style( 'infe-tema', INFE_URL . 'assets/tema.css', array( 'inft-base', $font ), INFE_VERSION );
		wp_enqueue_script( 'infe-tema', INFE_URL . 'assets/tema.js', array(), INFE_VERSION, array( 'in_footer' => true, 'strategy' => 'defer' ) );
	},
	50
);

// script di Brevo (mailin) senza bloccare il disegno della pagina: parte dopo, come gli altri
add_filter(
	'script_loader_tag',
	function ( $tag, $handle ) {
		if ( 'sib-front-js' === $handle && infe_attivo() && false === strpos( $tag, ' defer' ) ) {
			$tag = str_replace( ' src=', ' defer src=', $tag );
		}
		return $tag;
	},
	10,
	2
);

/** Toglie dall'HTML finale gli header e footer di Elementor e del vecchio plugin, se qualcuno li stampa lo stesso. */
/**
 * Description per Google quando la pagina non ne ha (pagine del listing geo, pagine ex Elementor):
 * dal primo paragrafo vero del contenuto, al massimo 155 caratteri.
 */
function infe_description_mancante( $html ) {
	$head_end = stripos( $html, '</head>' );
	if ( false === $head_end || preg_match( '#<meta[^>]+name=["\']description["\']#i', substr( $html, 0, $head_end ) ) ) {
		return $html;
	}
	$start = stripos( $html, 'id="contenuto"' );
	$body  = false !== $start ? substr( $html, $start ) : substr( $html, $head_end );
	$body  = preg_replace( '#<(script|style|nav|header|footer|form)\b.*?</\1>#is', '', $body );
	if ( ! preg_match_all( '#<p\b[^>]*>(.*?)</p>#is', (string) $body, $m ) ) {
		return $html;
	}
	foreach ( $m[1] as $p ) {
		$t = trim( preg_replace( '/\s+/u', ' ', html_entity_decode( wp_strip_all_tags( $p ), ENT_QUOTES, 'UTF-8' ) ) );
		if ( mb_strlen( $t ) < 70 || false !== stripos( $t, 'cookie' ) ) {
			continue;
		}
		if ( mb_strlen( $t ) > 155 ) {
			$t = mb_substr( $t, 0, 152 );
			$t = mb_substr( $t, 0, (int) mb_strrpos( $t, ' ' ) ) . '…';
		}
		$meta = '<meta name="description" content="' . esc_attr( $t ) . '" data-infe>' . "\n";
		return substr( $html, 0, $head_end ) . $meta . substr( $html, $head_end );
	}
	return $html;
}

function infe_pulisci_html( $html ) {
	$html = infe_description_mancante( $html );
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
