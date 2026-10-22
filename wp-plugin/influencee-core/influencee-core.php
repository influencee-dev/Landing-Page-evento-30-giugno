<?php
/**
 * Plugin Name:       Influencee Core
 * Description:       Base comune dei plugin Influencee: SEO/GEO/AEO (title, description, dati strutturati, llms.txt), tracciamento GA4, CSS e JavaScript condivisi, redirect 301, impostazioni e accesso MCP per Claude. Necessario per Influencee Tools, Pagine, Articoli e Annunci.
 * Version:           2.2.1
 * Author:            Partidea SRL
 * Requires at least: 6.0
 * Requires PHP:      7.4
 * Text Domain:       influencee-core
 */

defined( 'ABSPATH' ) || exit;

define( 'INFC_VERSION', '2.2.1' );
define( 'INFC_DIR', plugin_dir_path( __FILE__ ) );
define( 'INFC_URL', plugin_dir_url( __FILE__ ) );
define( 'INFT_COMPANY', 'Partidea SRL' );

require_once INFC_DIR . 'includes/mcp-abilities.php';
require_once INFC_DIR . 'includes/assets.php';

/** I plugin Influencee installati (per lo stato nelle impostazioni). */
function inft_family() {
	return array(
		'influencee-tools/influencee-tools.php'       => array( 'Influencee Tools', 'INFT_TOOLS_VERSION', 'i tool gratuiti (fake follower, costo influencer, engagement rate, preventivo, emoticon)' ),
		'influencee-pagine/influencee-pagine.php'     => array( 'Influencee Pagine', 'INFP_VERSION', 'pagine del sito, profili creator, elenco con filtri' ),
		'influencee-articoli/influencee-articoli.php' => array( 'Influencee Articoli', 'INFA_VERSION', 'articoli del blog in HTML5 leggero' ),
		'influencee-annunci/influencee-annunci.php'   => array( 'Influencee Annunci', 'INFN_VERSION', 'offerte di lavoro collegate ad app.influencee.it' ),
		'influencee-tema/influencee-tema.php'         => array( 'Influencee Tema', 'INFE_VERSION', 'intestazione, piè di pagina e layout del sito senza Elementor' ),
	);
}

/* ════════════════════════════════════════════════════════════════════
   DATI DELLE PAGINE
   Ogni plugin di pagine (Tools, Pagine) registra la sua cartella con il filtro
   'inft_page_sources'; pages/meta.json e pages/<slug>.html sono generati dalla
   build del sito v2 (scripts/build-wp-plugin.mjs): stessi testi, FAQ e dati strutturati.
   ════════════════════════════════════════════════════════════════════ */

/** Cartelle di pagine registrate: array( nome => array( 'dir' => …, 'url' => … ) ). */
function inft_page_sources() {
	return (array) apply_filters( 'inft_page_sources', array() );
}

function inft_pages() {
	static $pages = null;
	if ( null === $pages ) {
		$pages = array();
		foreach ( inft_page_sources() as $name => $src ) {
			$file = trailingslashit( $src['dir'] ) . 'pages/meta.json';
			$list = file_exists( $file ) ? json_decode( (string) file_get_contents( $file ), true ) : array();
			foreach ( is_array( $list ) ? $list : array() as $path => $p ) {
				$p['src']      = trailingslashit( $src['dir'] );
				$p['plugin']   = $name;
				$pages[ $path ] = $p;
			}
		}
	}
	return $pages;
}

/** Percorso richiesto, normalizzato con lo slash finale (tiene conto di WordPress in sottocartella). */
function inft_request_path() {
	$uri  = isset( $_SERVER['REQUEST_URI'] ) ? wp_unslash( $_SERVER['REQUEST_URI'] ) : '/';
	$path = (string) wp_parse_url( $uri, PHP_URL_PATH );
	$base = (string) wp_parse_url( home_url( '/' ), PHP_URL_PATH );
	if ( $base && '/' !== $base && 0 === strpos( $path, rtrim( $base, '/' ) ) ) {
		$path = substr( $path, strlen( rtrim( $base, '/' ) ) );
	}
	$path = '/' . trim( rawurldecode( $path ), '/' ) . '/';
	return '//' === $path ? '/' : $path;
}

function inft_settings() {
	$s = get_option( 'inft_settings', array() );
	return wp_parse_args(
		is_array( $s ) ? $s : array(),
		array(
			// gruppi accesi: tool e pagine nuove sì; le sostituzioni di pagine WordPress con traffico no, finché il titolare non le accende
			'groups'    => array( 'tool' => 1, 'nuova' => 1, 'sostituzione' => 0 ),
			'off'       => array(), // eccezioni: percorsi spenti anche se il gruppo è acceso
			'on'        => array(), // eccezioni: percorsi accesi anche se il gruppo è spento
			'creators'  => 1,       // mostra i profili dei creator (tipo di contenuto "creator")
			'profiles'  => 0,       // pagine /creator/<slug>/ con la nuova grafica (spente finché non le accendi)
			'articles'  => 'off',   // articoli col nuovo modello: off | lista (solo quelli in articles_on) | tutti
			'articles_on'  => array(), // articoli accesi in modalità "lista"
			'articles_off' => array(), // articoli esclusi anche in modalità "tutti"
			'redirect_vecchie' => 0, // pagine vecchie Elementor → pagine nuove, solo se la nuova è online
			'redirects_extra' => array(), // redirect 301 aggiuntivi (es. articoli doppi), attivi solo con 'redirects'
			'redirects' => 0,       // redirect 301 dei vecchi URL (spenti finché non li attivi)
			'privacy'   => 1,       // toglie email e telefoni dalle bio dei creator nelle API e nelle pagine pubbliche
			'mcp_admin_only' => 1,  // la porta MCP del sito solo per amministratori (di default basta essere iscritti)
		)
	);
}

/** Una pagina è attiva se il suo gruppo è acceso (salvo eccezioni). */
function inft_is_active( $path, $page, $s = null ) {
	$s     = $s ? $s : inft_settings();
	$group = isset( $page['group'] ) ? $page['group'] : 'tool';
	if ( in_array( $path, (array) $s['off'], true ) ) {
		return false;
	}
	if ( in_array( $path, (array) $s['on'], true ) ) {
		return true;
	}
	return ! empty( $s['groups'][ $group ] );
}

/** La pagina della richiesta corrente servita dal plugin, oppure null. */
function inft_current() {
	static $current = false;
	if ( false !== $current ) {
		return $current;
	}
	if ( is_admin() || wp_doing_ajax() || ( defined( 'REST_REQUEST' ) && REST_REQUEST ) ) {
		$current = null;
		return $current;
	}
	if ( ! did_action( 'wp' ) ) {
		return null; // richiesta non ancora letta: niente cache
	}
	// pagine "virtuali" di altri plugin (profili creator, annunci…)
	$current = apply_filters( 'inft_current_page', null );
	if ( $current ) {
		return $current;
	}
	$path  = inft_request_path();
	$pages = inft_pages();
	$s     = inft_settings();
	if ( isset( $pages[ $path ] ) && inft_is_active( $path, $pages[ $path ], $s ) ) {
		$current         = $pages[ $path ];
		$current['path'] = $path;
	}
	return $current;
}

/* ════════════════════════════════════════════════════════════════════
   REDIRECT 301 (dal piano SEO: SEO-PIANO.md §3) — si attivano dalle impostazioni
   ════════════════════════════════════════════════════════════════════ */

/** Elenco di percorsi da un testo (uno per riga o separati da virgole): "/titolo/". */
function inft_clean_paths( $txt ) {
	$out = array();
	foreach ( is_array( $txt ) ? $txt : preg_split( '/[\r\n,]+/', (string) $txt ) as $l ) {
		$p = trim( (string) wp_parse_url( trim( (string) $l ), PHP_URL_PATH ), '/' );
		if ( '' !== $p ) {
			$out[] = '/' . $p . '/';
		}
	}
	return array_values( array_unique( $out ) );
}

/** Redirect da testo "da -> a" (uno per riga): solo percorsi interni, niente catene verso sé stessi. */
function inft_clean_redirects( $txt ) {
	$out = array();
	foreach ( is_array( $txt ) ? $txt : preg_split( '/[\r\n]+/', (string) $txt ) as $k => $l ) {
		if ( is_array( $txt ) ) {
			$l = $k . ' -> ' . $l;
		}
		$parts = preg_split( '/\s*(?:->|→|=>|\s)\s*/u', trim( (string) $l ), 2 );
		if ( count( $parts ) < 2 ) {
			continue;
		}
		$from = inft_clean_paths( array( $parts[0] ) );
		$to   = inft_clean_paths( array( $parts[1] ) );
		if ( $from && $to && $from[0] !== $to[0] ) {
			$out[ $from[0] ] = $to[0];
		}
	}
	return $out;
}

function inft_redirect_map() {
	$s = inft_settings();
	return array_merge( inft_redirect_base(), (array) $s['redirects_extra'] );
}

function inft_redirect_base() {
	return array(
		'/social-media-tool-form/'                    => '/social-media-tool/',
		'/tool-finanziario/'                          => '/social-media-tool/',
		'/preventivi-influencer/'                     => '/preventivo-campagne/',
		'/come-calcolare-il-costo-degli-influencer/'  => '/social-media-tool/costo-influencer/',
		'/come-calcolare-costo-influencer/'           => '/social-media-tool/costo-influencer/',
		'/come-riconoscere-e-rimuovere-fake-follower/' => '/followe-instagram-fake-follower/',
		'/annunci-collaborazioni/'                    => '/offerte-lavoro-influencer/',
	);
}

/**
 * Pagine vecchie fatte con Elementor che passano a una pagina nuova (piano wp-plugin/PAGINE-VECCHIE.md).
 * Il redirect parte solo se la pagina di arrivo è già online: accendendo le pagine nuove, le vecchie si spostano da
 * sole e non nasce mai un 404.
 */
function inft_redirect_vecchie() {
	$tool = '/social-media-tool/';
	$map  = array(
		'/piattaforma-influencer-marketing/'                    => '/piattaforma-influencer/',
		'/trova-influencer/'                                    => '/funzionalita/database-influencer/',
		'/tool-influencer/'                                     => $tool,
		'/gestione-campagne-influencer/'                        => '/funzionalita/gestione-campagne/',
		'/gestione-campagne-influecer/'                         => '/funzionalita/gestione-campagne/',
		'/gestionale-influencer/'                               => '/piattaforma-influencer/',
		'/demo-piattaforma-influencer/'                         => '/piattaforma-influencer/',
		'/agenzie/'                                             => '/piattaforma-agenzie/',
		'/agenzia-content-creator/'                             => '/agenzia-influencer/',
		'/content-creator/'                                     => '/diventa-creator/',
		'/gestione-ugc/'                                        => '/contenuti-ugc/',
		'/guida-definitiva-al-micro-influencer-marketing-2026/' => '/micro-influencer/',
		'/virtual-influencer/'                                  => '/influencer-italiani/',
		'/converti-immagini-in-webp/'                           => $tool,
		'/benvenuto-su-influencee/'                             => '/diventa-creator/',
		'/cost/'                                                => '/prezzi/',
	);
	foreach ( array( 'anteprima-dei-tuoi-post-sui-social', 'generatore-prompt-per-social-media-manager', 'calcola-preventivo-gestione-social', 'comprimi-immagini-online', 'report-social-organico', 'social-media-strategy-tool', 'calendario-editoriale', 'social-campaign-planner', 'piano-editoriale-online' ) as $t ) {
		$map[ $tool . $t . '/' ] = $tool;
	}
	return apply_filters( 'inft_redirect_vecchie', $map );
}

/** La pagina di arrivo esiste davvero? (pagina dei plugin accesa o pagina WordPress pubblicata) */
function inft_destinazione_online( $path ) {
	$pages = inft_pages();
	if ( isset( $pages[ $path ] ) ) {
		return inft_is_active( $path, $pages[ $path ] );
	}
	$p = get_page_by_path( trim( $path, '/' ), OBJECT, array( 'page', 'post' ) );
	return $p && 'publish' === $p->post_status;
}

add_action(
	'template_redirect',
	function () {
		$s = inft_settings();
		if ( empty( $s['redirect_vecchie'] ) ) {
			return;
		}
		$path = inft_request_path();
		$map  = inft_redirect_vecchie();
		if ( isset( $map[ $path ] ) && inft_destinazione_online( $map[ $path ] ) && ! inft_current() ) {
			wp_safe_redirect( home_url( $map[ $path ] ), 301, 'Influencee' );
			exit;
		}
	},
	0
);

add_action(
	'template_redirect',
	function () {
		$s = inft_settings();
		if ( empty( $s['redirects'] ) ) {
			return;
		}
		$path = inft_request_path();
		$map  = inft_redirect_map();
		if ( isset( $map[ $path ] ) ) {
			wp_safe_redirect( home_url( $map[ $path ] ), 301, 'Influencee Tools' );
			exit;
		}
	},
	0
);

/* llms.txt alla radice del sito (GEO: descrizione per i motori AI), se WordPress non ne ha già uno */
add_action(
	'template_redirect',
	function () {
		if ( '/llms.txt/' !== inft_request_path() || ! file_exists( INFC_DIR . 'llms.txt' ) ) {
			return;
		}
		status_header( 200 );
		header( 'Content-Type: text/plain; charset=utf-8' );
		readfile( INFC_DIR . 'llms.txt' );
		exit;
	},
	1
);

/* ════════════════════════════════════════════════════════════════════
   PRESA IN CARICO DELLA PAGINA
   Header e footer restano quelli del sito; il contenuto è la pagina tool.
   ════════════════════════════════════════════════════════════════════ */

add_action(
	'template_redirect',
	function () {
		$page = inft_current();
		if ( ! $page ) {
			return;
		}
		if ( isset( $page['render'] ) && is_callable( $page['render'] ) ) {
			$html = (string) call_user_func( $page['render'], $page ); // pagina HTML5 generata da un plugin (es. annunci)
		} else {
			$file = ( isset( $page['src'] ) ? $page['src'] : INFC_DIR ) . 'pages/' . basename( $page['slug'] ) . '.html';
			if ( ! file_exists( $file ) ) {
				return; // file mancante: resta la pagina WordPress
			}
			$html = (string) file_get_contents( $file );
		}
		global $wp_query;
		if ( $wp_query && $wp_query->is_404() ) {
			$wp_query->is_404 = false;
		}
		status_header( 200 );
		// segnaposto riempiti dagli altri plugin (profili creator, liste…)
		$html = (string) apply_filters( 'inft_page_html', $html, $page );
		$html = str_replace( '{{ASSETS}}', esc_url( untrailingslashit( INFC_URL . 'assets' ) ), $html );
		ob_start( 'inft_clean_head' );
		inft_get_header();
		if ( isset( $page['render'] ) ) {
			echo $html; // phpcs:ignore WordPress.Security.EscapeOutput -- HTML5 costruito ed escapato dal plugin che lo genera
		} else {
			echo '<main id="inft-main" class="inft-main">';
			echo '<div id="influencee-tools" class="influencee-tools" data-route="' . esc_attr( $page['path'] ) . '">';
			echo $html; // phpcs:ignore WordPress.Security.EscapeOutput -- HTML generato dalla build del plugin
			echo '</div></main>';
		}
		inft_get_footer();
		ob_end_flush();
		exit;
	},
	5
);

/** Un solo <title>; description, Open Graph e dati strutturati solo del plugin (gli altri plugin SEO li duplicherebbero). */
function inft_clean_head( $html ) {
	$n    = 0;
	$html = preg_replace_callback(
		'#<title\b[^>]*>.*?</title>#is',
		function ( $m ) use ( &$n ) {
			return 0 === $n++ ? $m[0] : '';
		},
		$html
	);
	$html = preg_replace( '#<meta\s+(?![^>]*data-inft)[^>]*(?:name=["\']description["\']|property=["\']og:[^"\']+["\']|name=["\']twitter:[^"\']+["\'])[^>]*>\s*#i', '', $html );
	$html = preg_replace( '#<script\s+type=["\']application/ld\+json["\'](?![^>]*data-inft)[^>]*>.*?</script>\s*#is', '', $html );
	// un solo canonical: se c'è il nostro, via quello di WordPress o di altri plugin SEO
	if ( preg_match( '#<link\s+data-inft\s+rel=["\']canonical["\']#i', $html ) ) {
		$html = preg_replace( '#<link\s+(?![^>]*data-inft)[^>]*rel=["\']canonical["\'][^>]*>\s*#i', '', $html );
	}
	return $html;
}

/* ════════════════════════════════════════════════════════════════════
   SEO / GEO / AEO NELL'HTML
   ════════════════════════════════════════════════════════════════════ */

add_filter(
	'pre_get_document_title',
	function ( $title ) {
		$page = inft_current();
		return $page ? $page['title'] : $title;
	},
	99
);

add_action(
	'wp_head',
	function () {
		$page = inft_current();
		if ( ! $page ) {
			return;
		}
		$url = home_url( $page['path'] );
		echo "\n<!-- Influencee Core: SEO -->\n";
		echo '<meta data-inft name="description" content="' . esc_attr( $page['description'] ) . '">' . "\n";
		echo '<meta data-inft property="og:type" content="website">' . "\n";
		echo '<meta data-inft property="og:locale" content="it_IT">' . "\n";
		echo '<meta data-inft property="og:site_name" content="Influencee">' . "\n";
		echo '<meta data-inft property="og:title" content="' . esc_attr( $page['title'] ) . '">' . "\n";
		echo '<meta data-inft property="og:description" content="' . esc_attr( $page['description'] ) . '">' . "\n";
		echo '<meta data-inft property="og:url" content="' . esc_url( $url ) . '">' . "\n";
		echo '<link data-inft rel="canonical" href="' . esc_url( $url ) . '">' . "\n";
		if ( ! empty( $page['image'] ) ) {
			echo '<meta data-inft property="og:image" content="' . esc_url( $page['image'] ) . '">' . "\n";
		}
		echo '<meta data-inft name="twitter:card" content="summary_large_image">' . "\n";
		if ( ! empty( $page['ld'] ) ) {
			echo '<script type="application/ld+json" data-inft>' . wp_json_encode( $page['ld'], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES ) . '</script>' . "\n";
		}
		foreach ( isset( $page['ld_extra'] ) ? (array) $page['ld_extra'] : array() as $ld ) {
			echo '<script type="application/ld+json" data-inft>' . wp_json_encode( $ld, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES ) . '</script>' . "\n";
		}
		do_action( 'inft_head', $page ); // es. ItemList dei creator mostrati (Influencee Pagine)
	},
	1
);

/* ════════════════════════════════════════════════════════════════════
   CSS, FONT, JAVASCRIPT
   ════════════════════════════════════════════════════════════════════ */

add_action(
	'wp_enqueue_scripts',
	function () {
		$page = inft_current();
		if ( ! $page ) {
			return;
		}
		if ( isset( $page['render'] ) ) {
			inft_enqueue_base(); // pagine HTML5: CSS base + tracciamento leggero; il resto lo aggiunge il plugin
			do_action( 'inft_enqueue_page', $page );
			return;
		}
		wp_enqueue_style( 'inft-fonts', 'https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap', array(), null );
		wp_enqueue_style( 'inft', INFC_URL . 'assets/influencee-tools.css', array( 'inft-fonts' ), INFC_VERSION );
		wp_enqueue_script( 'inft', INFC_URL . 'assets/influencee-tools.js', array(), INFC_VERSION, array( 'in_footer' => true, 'strategy' => 'defer' ) );
		$data = array(
			'assets' => untrailingslashit( INFC_URL . 'assets' ),
			'path'   => $page['path'],
		);
		$data = (array) apply_filters( 'inft_client_data', $data, $page ); // es. creator, profilo, elenco (Influencee Pagine)
		wp_add_inline_script( 'inft', 'window.INFLUENCEE_TOOLS=' . wp_json_encode( $data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES ) . ';', 'before' );
	},
	100
);

/* ════════════════════════════════════════════════════════════════════
   IMPOSTAZIONI (menu "Influencee")
   Un'unica pagina: Core mostra stato, pagine, redirect e accesso MCP;
   ogni plugin aggiunge la sua parte con 'inft_settings_sections' e salva
   i suoi campi con il filtro 'inft_settings_sanitize'.
   ════════════════════════════════════════════════════════════════════ */

function inft_settings_url() {
	return admin_url( 'admin.php?page=influencee' );
}

add_action(
	'admin_menu',
	function () {
		add_menu_page( 'Influencee', 'Influencee', 'manage_options', 'influencee', 'inft_settings_page', 'dashicons-chart-area', 58 );
	}
);

// vecchio indirizzo delle impostazioni (Impostazioni → Influencee Tools): porta al nuovo menu
add_action(
	'admin_init',
	function () {
		if ( isset( $_GET['page'] ) && 'influencee-tools' === $_GET['page'] && false !== strpos( (string) $_SERVER['REQUEST_URI'], 'options-general.php' ) ) {
			wp_safe_redirect( inft_settings_url() );
			exit;
		}
	}
);

/** Percorsi validi tra le pagine registrate (uno per riga o separati da virgole). */
function inft_known_paths( $txt ) {
	$paths = array_keys( inft_pages() );
	return array_values( array_filter( inft_clean_paths( $txt ), function ( $p ) use ( $paths ) {
		return in_array( $p, $paths, true );
	} ) );
}

add_action(
	'admin_init',
	function () {
		register_setting(
			'inft',
			'inft_settings',
			array(
				'type'              => 'array',
				'sanitize_callback' => function ( $in ) {
					$in  = is_array( $in ) ? $in : array();
					$out = inft_settings(); // si parte dai valori attuali: i plugin spenti non perdono le loro impostazioni
					$g   = isset( $in['groups'] ) && is_array( $in['groups'] ) ? $in['groups'] : array();
					$out['groups']          = array( 'tool' => empty( $g['tool'] ) ? 0 : 1, 'nuova' => empty( $g['nuova'] ) ? 0 : 1, 'sostituzione' => empty( $g['sostituzione'] ) ? 0 : 1 );
					$out['off']             = inft_known_paths( isset( $in['off'] ) ? $in['off'] : '' );
					$out['on']              = inft_known_paths( isset( $in['on'] ) ? $in['on'] : '' );
					$out['redirects']       = empty( $in['redirects'] ) ? 0 : 1;
					$out['redirect_vecchie'] = empty( $in['redirect_vecchie'] ) ? 0 : 1;
					$out['redirects_extra'] = inft_clean_redirects( isset( $in['redirects_extra'] ) ? $in['redirects_extra'] : '' );
					$out['mcp_admin_only']  = empty( $in['mcp_admin_only'] ) ? 0 : 1;
					return (array) apply_filters( 'inft_settings_sanitize', $out, $in );
				},
			)
		);
	}
);

/** Crea o revoca l'accesso MCP per Claude: password per le applicazioni dell'utente corrente. */
add_action(
	'admin_post_inft_mcp_access',
	function () {
		if ( ! current_user_can( 'manage_options' ) || ! check_admin_referer( 'inft_mcp_access' ) || ! class_exists( 'WP_Application_Passwords' ) ) {
			wp_die( 'Non consentito.' );
		}
		$user = wp_get_current_user();
		$name = 'Claude MCP (Influencee)';
		foreach ( WP_Application_Passwords::get_user_application_passwords( $user->ID ) as $item ) {
			if ( in_array( $item['name'], array( $name, 'Claude MCP (Influencee Tools)' ), true ) ) {
				WP_Application_Passwords::delete_application_password( $user->ID, $item['uuid'] );
			}
		}
		$back = inft_settings_url();
		if ( 'crea' === ( isset( $_POST['do'] ) ? sanitize_key( $_POST['do'] ) : '' ) ) {
			$new = WP_Application_Passwords::create_new_application_password( $user->ID, array( 'name' => $name ) );
			if ( is_wp_error( $new ) ) {
				wp_safe_redirect( add_query_arg( 'inft_mcp', 'errore', $back ) );
				exit;
			}
			// mostrato una sola volta: transient di 5 minuti legato all'utente
			set_transient( 'inft_mcp_key_' . $user->ID, base64_encode( $user->user_login . ':' . $new[0] ), 300 );
			wp_safe_redirect( add_query_arg( 'inft_mcp', 'creato', $back ) );
			exit;
		}
		wp_safe_redirect( add_query_arg( 'inft_mcp', 'revocato', $back ) );
		exit;
	}
);

function inft_settings_page() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}
	if ( ! function_exists( 'is_plugin_active' ) ) {
		require_once ABSPATH . 'wp-admin/includes/plugin.php';
	}
	$s      = inft_settings();
	$routes = function_exists( 'rest_get_server' ) ? rest_get_server()->get_routes() : array();
	$tandem = isset( $routes['/tandem-forms/v1/capture'] );
	?>
	<div class="wrap">
		<h1>Influencee</h1>
		<p>Impostazioni comuni dei plugin Influencee. Le pagine accese sono servite con lo stesso URL di oggi; se ne spegni una torna la pagina WordPress di prima.</p>
		<h2>Plugin</h2>
		<table class="widefat striped" style="max-width:900px"><tbody>
			<tr><td>✅ <b>Influencee Core</b> <?php echo esc_html( INFC_VERSION ); ?></td><td>SEO/GEO/AEO, tracciamento GA4, CSS e JavaScript condivisi, redirect, MCP</td></tr>
			<?php foreach ( inft_family() as $file => $info ) : $on = is_plugin_active( $file ); ?>
			<tr><td><?php echo $on ? '✅' : '⚪'; ?> <b><?php echo esc_html( $info[0] ); ?></b> <?php echo $on && defined( $info[1] ) ? esc_html( constant( $info[1] ) ) : ( file_exists( WP_PLUGIN_DIR . '/' . $file ) ? '(installato, spento)' : '(non installato)' ); ?></td><td><?php echo esc_html( $info[2] ); ?></td></tr>
			<?php endforeach; ?>
			<tr><td><?php echo $tandem ? '✅' : '⚠️'; ?> tandem-forms</td><td><?php echo $tandem ? 'attivo: i lead dei moduli arrivano a /wp-json/tandem-forms/v1/capture' : 'non trovato: i moduli non verranno registrati'; ?></td></tr>
			<tr><td>📊 Google Analytics</td><td>gli eventi usano il tag GA4 già presente nel sito (G-5BD025G8VP)</td></tr>
		</tbody></table>
		<form method="post" action="options.php">
			<?php settings_fields( 'inft' ); ?>
			<?php
			$labels = array(
				'tool'         => array( 'Tool gratuiti', 'Influencee Tools: fake follower, costo influencer, engagement rate, preventivo, emoticon' ),
				'nuova'        => array( 'Pagine nuove', 'Influencee Pagine: URL che oggi su WordPress non esistono (prezzi, funzionalità, aziende, agenzie, nuove categorie…)' ),
				'sostituzione' => array( 'Sostituzioni di pagine esistenti', 'Influencee Pagine: home, hub influencer italiani, regioni e città, categorie, piattaforma, contatti. Hanno traffico: accendile dopo aver controllato l’anteprima' ),
			);
			$by = array();
			foreach ( inft_pages() as $path => $p ) {
				$by[ isset( $p['group'] ) ? $p['group'] : 'tool' ][ $path ] = $p;
			}
			?>
			<?php if ( $by ) : ?>
			<h2>Pagine</h2>
			<table class="form-table" role="presentation"><tbody>
			<?php foreach ( $labels as $g => $txt ) : if ( empty( $by[ $g ] ) ) { continue; } ?>
				<tr><th scope="row"><?php echo esc_html( $txt[0] ); ?> (<?php echo count( $by[ $g ] ); ?>)</th><td>
					<label><input type="checkbox" name="inft_settings[groups][<?php echo esc_attr( $g ); ?>]" value="1" <?php checked( ! empty( $s['groups'][ $g ] ) ); ?>> attive</label>
					<p class="description"><?php echo esc_html( $txt[1] ); ?></p>
					<details><summary>Elenco</summary><ul style="columns:3">
					<?php foreach ( $by[ $g ] as $path => $p ) : ?>
						<li><?php echo inft_is_active( $path, $p, $s ) ? '🟢' : '⚪'; ?> <a href="<?php echo esc_url( home_url( $path ) ); ?>" target="_blank" rel="noopener"><?php echo esc_html( $path ); ?></a></li>
					<?php endforeach; ?>
					</ul></details>
				</td></tr>
			<?php endforeach; ?>
				<tr><th scope="row">Eccezioni</th><td>
					<p><label>Pagine da <b>spegnere</b> anche se il gruppo è acceso (una per riga)<br><textarea name="inft_settings[off]" rows="3" cols="70"><?php echo esc_textarea( implode( "\n", (array) $s['off'] ) ); ?></textarea></label></p>
					<p><label>Pagine da <b>accendere</b> anche se il gruppo è spento (una per riga), es. per provare solo <code>/influencer-italiani/influencer-campania/influencer-napoli/</code><br><textarea name="inft_settings[on]" rows="3" cols="70"><?php echo esc_textarea( implode( "\n", (array) $s['on'] ) ); ?></textarea></label></p>
				</td></tr>
			</tbody></table>
			<?php endif; ?>
			<?php do_action( 'inft_settings_sections', $s ); // parti dei singoli plugin (profili, articoli, annunci) ?>
			<h2>Redirect 301 dei vecchi URL</h2>
			<h3>Pagine vecchie (Elementor) che passano alle pagine nuove</h3>
			<p><label><input type="checkbox" name="inft_settings[redirect_vecchie]" value="1" <?php checked( ! empty( $s['redirect_vecchie'] ) ); ?>> Attiva: ogni pagina vecchia va con un 301 alla nuova <b>solo quando la nuova è online</b> (mai 404)</label></p>
			<table class="widefat striped" style="max-width:900px"><thead><tr><th>Pagina vecchia</th><th>Pagina nuova</th><th>Nuova online?</th></tr></thead><tbody>
			<?php foreach ( inft_redirect_vecchie() as $from => $to ) : ?>
				<tr><td><code><?php echo esc_html( $from ); ?></code></td><td><code><?php echo esc_html( $to ); ?></code></td><td><?php echo inft_destinazione_online( $to ) ? '✅ sì: il redirect è attivo' : '⏳ non ancora: resta la pagina vecchia'; ?></td></tr>
			<?php endforeach; ?>
			</tbody></table>
			<h3>Altri redirect del piano SEO</h3>
			<p><label><input type="checkbox" name="inft_settings[redirects]" value="1" <?php checked( ! empty( $s['redirects'] ) ); ?>> Attiva i redirect qui sotto (dal piano SEO)</label></p>
			<ul style="list-style:disc;margin-left:20px">
			<?php foreach ( inft_redirect_base() as $from => $to ) : ?>
				<li><code><?php echo esc_html( $from ); ?></code> → <code><?php echo esc_html( $to ); ?></code></li>
			<?php endforeach; ?>
			</ul>
			<p><label>Redirect aggiuntivi, uno per riga nel formato <code>/vecchio/ -> /nuovo/</code> (es. articoli doppi)<br><textarea name="inft_settings[redirects_extra]" rows="4" cols="70"><?php foreach ( (array) $s['redirects_extra'] as $from => $to ) { echo esc_textarea( $from . ' -> ' . $to . "\n" ); } ?></textarea></label></p>
			<h2>MCP (accesso per Claude)</h2>
			<p><label><input type="checkbox" name="inft_settings[mcp_admin_only]" value="1" <?php checked( ! empty( $s['mcp_admin_only'] ) ); ?>> Server MCP del sito solo per amministratori (di default WordPress lo apre a ogni utente con accesso)</label></p>
			<p>Indirizzo: <code><?php echo esc_html( rest_url( 'mcp/mcp-adapter-default-server' ) ); ?></code></p>
			<?php $log = array_reverse( (array) get_option( 'inft_mcp_log', array() ) ); if ( $log ) : ?>
				<details><summary>Ultime azioni eseguite via MCP (<?php echo count( $log ); ?>)</summary><table class="widefat striped"><thead><tr><th>Quando</th><th>Utente</th><th>Azione</th><th>Dati</th><th>Esito</th></tr></thead><tbody>
				<?php foreach ( array_slice( $log, 0, 20 ) as $l ) : ?>
					<tr><td><?php echo esc_html( $l['quando'] ); ?></td><td><?php echo esc_html( $l['utente'] ); ?></td><td><?php echo esc_html( $l['azione'] ); ?></td><td><code><?php echo esc_html( mb_substr( (string) $l['input'], 0, 120 ) ); ?></code></td><td><?php echo esc_html( $l['esito'] ); ?></td></tr>
				<?php endforeach; ?>
				</tbody></table></details>
			<?php endif; ?>
			<?php submit_button( 'Salva' ); ?>
		</form>
		<?php
		$key = get_transient( 'inft_mcp_key_' . get_current_user_id() );
		if ( $key ) {
			delete_transient( 'inft_mcp_key_' . get_current_user_id() );
		}
		?>
		<?php if ( $key ) : ?>
			<div class="notice notice-warning" style="padding:12px"><p><b>Valore da copiare adesso: non verrà più mostrato.</b> Inseriscilo come variabile d'ambiente <code>INFLUENCEE_WP_AUTH</code> nelle impostazioni dell'ambiente di Claude Code. Non incollarlo in chat.</p>
			<p><input type="text" readonly value="<?php echo esc_attr( $key ); ?>" style="width:100%;font-family:monospace" onclick="this.select()"></p></div>
		<?php elseif ( isset( $_GET['inft_mcp'] ) && 'revocato' === $_GET['inft_mcp'] ) : ?>
			<div class="notice notice-success"><p>Accesso di Claude revocato.</p></div>
		<?php endif; ?>
		<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" style="margin:8px 0 16px">
			<?php wp_nonce_field( 'inft_mcp_access' ); ?>
			<input type="hidden" name="action" value="inft_mcp_access">
			<button class="button button-primary" name="do" value="crea">Crea accesso per Claude</button>
			<button class="button" name="do" value="revoca">Revoca accesso</button>
			<span class="description">Crea una password per le applicazioni del tuo utente (nome "Claude MCP (Influencee)"). Rifarlo sostituisce la precedente.</span>
		</form>
	</div>
	<?php
}

add_filter(
	'plugin_action_links_' . plugin_basename( __FILE__ ),
	function ( $links ) {
		array_unshift( $links, '<a href="' . esc_url( inft_settings_url() ) . '">Impostazioni</a>' );
		return $links;
	}
);

/** Avviso per i plugin Influencee che non trovano il Core (usato da Tools, Pagine, Articoli, Annunci). */
function inft_core_ready() {
	return true;
}
