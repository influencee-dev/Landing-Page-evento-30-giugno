<?php
/**
 * Plugin Name:       Influencee Tools
 * Description:       Tool gratuiti di influencer marketing (fake follower, costo influencer, engagement rate, preventivo campagna, offerte di lavoro, emoticon) con SEO/GEO/AEO, eventi GA4 e lead verso tandem-forms. Serve le pagine tool con il loro URL attuale.
 * Version:           1.2.1
 * Author:            Partidea SRL
 * Requires at least: 6.0
 * Requires PHP:      7.4
 * Text Domain:       influencee-tools
 */

defined( 'ABSPATH' ) || exit;

define( 'INFT_VERSION', '1.2.1' );
define( 'INFT_DIR', plugin_dir_path( __FILE__ ) );
define( 'INFT_URL', plugin_dir_url( __FILE__ ) );

require_once INFT_DIR . 'includes/privacy.php';
require_once INFT_DIR . 'includes/mcp-abilities.php';
require_once INFT_DIR . 'includes/profiles.php';

/* ════════════════════════════════════════════════════════════════════
   DATI DELLE PAGINE
   pages/meta.json e pages/<slug>.html sono generati dalla build del sito v2
   (scripts/build-wp-plugin.mjs): stessi testi, FAQ e dati strutturati.
   ════════════════════════════════════════════════════════════════════ */

function inft_pages() {
	static $pages = null;
	if ( null === $pages ) {
		$file  = INFT_DIR . 'pages/meta.json';
		$pages = file_exists( $file ) ? json_decode( (string) file_get_contents( $file ), true ) : array();
		$pages = is_array( $pages ) ? $pages : array();
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
	$current = inft_profile_page();
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

function inft_redirect_map() {
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
		if ( '/llms.txt/' !== inft_request_path() || ! file_exists( INFT_DIR . 'llms.txt' ) ) {
			return;
		}
		status_header( 200 );
		header( 'Content-Type: text/plain; charset=utf-8' );
		readfile( INFT_DIR . 'llms.txt' );
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
		$file = INFT_DIR . 'pages/' . basename( $page['slug'] ) . '.html';
		if ( ! file_exists( $file ) ) {
			return; // file mancante: resta la pagina WordPress
		}
		global $wp_query;
		if ( $wp_query && $wp_query->is_404() ) {
			$wp_query->is_404 = false;
		}
		status_header( 200 );
		$html = (string) file_get_contents( $file );
		if ( ! empty( $page['profile'] ) ) {
			$html = inft_profile_fill( $html, $page['profile'] );
		}
		$html = str_replace( '{{ASSETS}}', esc_url( untrailingslashit( INFT_URL . 'assets' ) ), $html );
		$html = preg_replace_callback(
			'#<!--INFLUENCEE_CREATORS:([^>]*?)-->#',
			function ( $m ) {
				return inft_creators_html_for( $m[1] );
			},
			$html
		);
		if ( false !== strpos( $html, '<!--INFLUENCEE_JOBS-->' ) ) {
			$html = str_replace( '<!--INFLUENCEE_JOBS-->', inft_jobs_html( inft_jobs() ), $html );
		}
		ob_start( 'inft_clean_head' );
		get_header();
		echo '<main id="inft-main" class="inft-main">';
		echo '<div id="influencee-tools" class="influencee-tools" data-route="' . esc_attr( $page['path'] ) . '">';
		echo $html; // phpcs:ignore WordPress.Security.EscapeOutput -- HTML generato dalla build del plugin
		echo '</div></main>';
		get_footer();
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
		echo "\n<!-- Influencee Tools: SEO -->\n";
		echo '<meta data-inft name="description" content="' . esc_attr( $page['description'] ) . '">' . "\n";
		echo '<meta data-inft property="og:type" content="website">' . "\n";
		echo '<meta data-inft property="og:locale" content="it_IT">' . "\n";
		echo '<meta data-inft property="og:site_name" content="Influencee">' . "\n";
		echo '<meta data-inft property="og:title" content="' . esc_attr( $page['title'] ) . '">' . "\n";
		echo '<meta data-inft property="og:description" content="' . esc_attr( $page['description'] ) . '">' . "\n";
		echo '<meta data-inft property="og:url" content="' . esc_url( $url ) . '">' . "\n";
		echo '<meta data-inft name="twitter:card" content="summary_large_image">' . "\n";
		if ( ! empty( $page['ld'] ) ) {
			echo '<script type="application/ld+json" data-inft>' . wp_json_encode( $page['ld'], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES ) . '</script>' . "\n";
		}
		$list = inft_creators_itemlist();
		if ( $list ) {
			echo '<script type="application/ld+json" data-inft>' . wp_json_encode( $list, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES ) . '</script>' . "\n";
		}
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
		wp_enqueue_style( 'inft-fonts', 'https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap', array(), null );
		wp_enqueue_style( 'inft', INFT_URL . 'assets/influencee-tools.css', array( 'inft-fonts' ), INFT_VERSION );
		wp_enqueue_script( 'inft', INFT_URL . 'assets/influencee-tools.js', array(), INFT_VERSION, array( 'in_footer' => true, 'strategy' => 'defer' ) );
		$data = array(
			'assets' => untrailingslashit( INFT_URL . 'assets' ),
			'path'   => $page['path'],
		);
		if ( '/offerte-lavoro-influencer/' === $page['path'] ) {
			$data['jobs'] = inft_jobs();
		}
		if ( ! empty( $page['profile'] ) ) {
			$data['profile'] = $page['profile'];
		}
		if ( '/influencer-italiani/' === $page['path'] ) {
			$data['directory'] = inft_creators_directory(); // filtri dell'elenco completo
		}
		$data['creators'] = (object) inft_creators_rendered();
		wp_add_inline_script( 'inft', 'window.INFLUENCEE_TOOLS=' . wp_json_encode( $data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES ) . ';', 'before' );
	},
	100
);

/* ════════════════════════════════════════════════════════════════════
   OFFERTE DI LAVORO REALI (WP Job Manager)
   Solo offerte pubblicate negli ultimi 180 giorni, non chiuse e non scadute.
   ════════════════════════════════════════════════════════════════════ */

function inft_jobs() {
	if ( ! post_type_exists( 'job_listing' ) ) {
		return array();
	}
	$posts = get_posts(
		array(
			'post_type'        => 'job_listing',
			'post_status'      => 'publish',
			'numberposts'      => 40,
			'date_query'       => array( array( 'after' => '180 days ago' ) ),
			'orderby'          => 'date',
			'order'            => 'DESC',
			'suppress_filters' => false,
		)
	);
	$types = array(
		'sulle-vendite'  => 'percentuale',
		'cambio-merci'   => 'cambio-merce',
		'collaborazione' => 'collaborazione',
		'pagata'         => 'pagata',
	);
	$today = current_time( 'Y-m-d' );
	$out   = array();
	foreach ( $posts as $p ) {
		$expires = (string) get_post_meta( $p->ID, '_job_expires', true );
		if ( get_post_meta( $p->ID, '_filled', true ) || ( $expires && $expires < $today ) ) {
			continue;
		}
		$t     = array();
		$terms = get_the_terms( $p->ID, 'job_listing_type' );
		foreach ( is_array( $terms ) ? $terms : array() as $term ) {
			$t[] = isset( $types[ $term->slug ] ) ? $types[ $term->slug ] : 'collaborazione';
		}
		$remote   = (bool) get_post_meta( $p->ID, '_remote_position', true );
		$location = trim( (string) get_post_meta( $p->ID, '_job_location', true ) );
		$out[]    = array(
			'title'    => wp_strip_all_tags( get_the_title( $p ) ),
			'company'  => wp_strip_all_tags( (string) get_post_meta( $p->ID, '_company_name', true ) ),
			'location' => $remote ? 'Da remoto' : ( $location ? $location : 'Italia' ),
			'remote'   => $remote,
			'types'    => array_values( array_unique( $t ? $t : array( 'collaborazione' ) ) ),
			'date'     => get_the_date( 'Y-m-d', $p ),
			'url'      => get_permalink( $p ),
		);
	}
	return $out;
}

/** Le stesse card della versione interattiva, in HTML: Google le legge anche senza JavaScript. */
function inft_jobs_html( $jobs ) {
	if ( ! $jobs ) {
		return '<div class="rounded-[22px] bg-white p-8 text-center ring-1 ring-line"><p class="font-heading text-xl font-semibold">Nuove offerte in arrivo</p><p class="mt-2 text-sm text-mute">Crea il profilo gratis: i brand ti trovano anche senza candidatura.</p></div>';
	}
	$labels = array(
		'pagata'         => 'Pagata',
		'cambio-merce'   => 'Cambio merce',
		'percentuale'    => '% sulle vendite',
		'collaborazione' => 'Collaborazione',
	);
	$html = '';
	foreach ( $jobs as $j ) {
		$words    = preg_split( '/\s+/', $j['company'] ? $j['company'] : 'Az' );
		$initials = strtoupper( substr( $words[0], 0, 1 ) . ( isset( $words[1] ) ? substr( $words[1], 0, 1 ) : substr( $words[0], 1, 1 ) ) );
		$pills    = '';
		foreach ( $j['types'] as $t ) {
			$pills .= '<span class="rounded-full px-2.5 py-1 text-xs font-semibold bg-paper text-ink">' . esc_html( isset( $labels[ $t ] ) ? $labels[ $t ] : $t ) . '</span>';
		}
		$html .= '<div class="grid grid-cols-[48px_1fr] items-center gap-4 rounded-[22px] bg-white p-5 ring-1 ring-line sm:grid-cols-[56px_1fr_auto]">'
			. '<span class="flex h-12 w-12 items-center justify-center rounded-2xl bg-acid font-heading text-base font-semibold sm:h-14 sm:w-14">' . esc_html( $initials ) . '</span>'
			. '<div class="min-w-0"><p class="font-heading text-lg font-semibold leading-snug tracking-tight">' . esc_html( $j['title'] ) . '</p>'
			. '<p class="mt-1 text-[13px] text-mute">' . esc_html( $j['company'] ) . ' · ' . esc_html( $j['location'] ) . ' · ' . esc_html( date_i18n( 'j F Y', strtotime( $j['date'] ) ) ) . '</p>'
			. '<div class="mt-2.5 flex flex-wrap gap-1.5">' . $pills . '</div></div>'
			. '<a href="' . esc_url( $j['url'] ) . '" class="col-span-2 inline-flex h-10 items-center justify-center rounded-full bg-ink px-5 text-sm font-semibold text-white sm:col-span-1">Candidati</a>'
			. '</div>';
	}
	return '<div class="grid gap-3">' . $html . '</div>';
}

/* ════════════════════════════════════════════════════════════════════
   PROFILI DEI CREATOR (tipo di contenuto "creator" del sito)
   Filtri dal segnaposto: city, region, cat (lista), limit.
   Si mostrano nome, handle, città, categoria e foto: mai i contatti delle bio.
   ════════════════════════════════════════════════════════════════════ */

/** Dati di una card: cerca foto, handle e follower nei campi del profilo, qualunque nome abbiano. */
function inft_creator_data( $post ) {
	$image     = '';
	$ig        = '';
	$followers = 0;
	foreach ( (array) get_post_meta( $post->ID ) as $key => $values ) {
		$v = isset( $values[0] ) ? maybe_unserialize( $values[0] ) : '';
		if ( ! is_string( $v ) && ! is_numeric( $v ) ) {
			continue;
		}
		$v = trim( (string) $v );
		if ( ! $image && preg_match( '#^https?://\S+\.(?:webp|jpe?g|png)(?:\?\S*)?$#i', $v ) ) {
			$image = $v;
		}
		if ( ! $ig && preg_match( '/insta|handle|username|(^|_)ig(_|$)/i', $key ) && preg_match( '/^@?[A-Za-z0-9._]{2,30}$/', $v ) ) {
			$ig = ltrim( $v, '@' );
		}
		if ( ! $followers && preg_match( '/follower/i', $key ) && is_numeric( str_replace( array( '.', ',' ), '', $v ) ) ) {
			$followers = (int) str_replace( array( '.', ',' ), '', $v );
		}
	}
	if ( ! $image ) {
		$image = (string) get_the_post_thumbnail_url( $post, 'thumbnail' );
	}
	if ( ! $image && preg_match( '#<img[^>]+src=["\']([^"\']+)#i', (string) $post->post_content, $m ) ) {
		$image = $m[1];
	}
	$term = function ( $tax, $field = 'name' ) use ( $post ) {
		$t = get_the_terms( $post->ID, $tax );
		return is_array( $t ) && $t ? $t[0]->$field : '';
	};
	return array(
		'name'      => wp_strip_all_tags( get_the_title( $post ) ),
		'url'       => get_permalink( $post ),
		'image'     => $image,
		'ig'        => $ig,
		'followers' => $followers,
		'city'      => $term( 'creator_city' ),
		'category'  => $term( 'creator_category' ),
		'cat_slug'  => $term( 'creator_category', 'slug' ),
		'city_slug' => $term( 'creator_city', 'slug' ),
	);
}

function inft_creators_query( $key ) {
	static $cache = array();
	if ( isset( $cache[ $key ] ) ) {
		return $cache[ $key ];
	}
	$cache[ $key ] = array();
	$s             = inft_settings();
	if ( empty( $s['creators'] ) || ! post_type_exists( 'creator' ) ) {
		return $cache[ $key ];
	}
	parse_str( html_entity_decode( $key ), $f );
	$limit = isset( $f['limit'] ) ? max( 1, min( 48, (int) $f['limit'] ) ) : 12;
	$base  = array( 'post_type' => 'creator', 'post_status' => 'publish', 'numberposts' => $limit, 'orderby' => 'date', 'order' => 'DESC', 'suppress_filters' => false );
	if ( ! empty( $f['exclude'] ) ) {
		$base['post__not_in'] = array( (int) $f['exclude'] ); // pagina profilo: non ripete il creator stesso
	}
	$tax   = array();
	if ( ! empty( $f['cat'] ) ) {
		$tax[] = array( 'taxonomy' => 'creator_category', 'field' => 'slug', 'terms' => array_map( 'sanitize_title', explode( ',', $f['cat'] ) ) );
	}
	$posts = array();
	if ( ! empty( $f['city'] ) ) {
		$posts = get_posts( $base + array( 'tax_query' => array_merge( $tax, array( array( 'taxonomy' => 'creator_city', 'field' => 'slug', 'terms' => sanitize_title( $f['city'] ) ) ) ) ) );
		// città con pochi profili: si completa con la regione
		if ( count( $posts ) < 3 && ! empty( $f['region'] ) ) {
			$more  = get_posts( array_merge( $base, array( 'numberposts' => $limit - count( $posts ), 'post__not_in' => array_merge( isset( $base['post__not_in'] ) ? $base['post__not_in'] : array(), wp_list_pluck( $posts, 'ID' ) ) ) ) + array( 'tax_query' => array_merge( $tax, array( array( 'taxonomy' => 'creator_region', 'field' => 'slug', 'terms' => sanitize_title( $f['region'] ) ) ) ) ) );
			$posts = array_merge( $posts, $more );
		}
	} elseif ( ! empty( $f['region'] ) ) {
		$posts = get_posts( $base + array( 'tax_query' => array_merge( $tax, array( array( 'taxonomy' => 'creator_region', 'field' => 'slug', 'terms' => sanitize_title( $f['region'] ) ) ) ) ) );
	} else {
		$posts = get_posts( $base + ( $tax ? array( 'tax_query' => $tax ) : array() ) );
	}
	$cache[ $key ] = array_map( 'inft_creator_data', $posts );
	return $cache[ $key ];
}

/** HTML delle card (stesse classi della versione interattiva). */
function inft_creators_html_for( $key ) {
	static $done = array();
	$list = inft_creators_query( $key );
	if ( ! $list ) {
		$html = '<div class="rounded-2xl bg-white p-8 text-center ring-1 ring-line"><p class="font-heading text-lg font-semibold">Nuovi profili in arrivo</p><p class="mt-2 text-sm text-mute">Nella piattaforma trovi tutti i creator con i filtri per categoria, città e fascia di follower.</p></div>';
	} else {
		$cards = '';
		foreach ( $list as $c ) {
			$cards .= inft_creator_card( $c );
		}
		$html = '<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">' . $cards . '</div>';
	}
	$done[ $key ] = $html;
	$GLOBALS['inft_creators_rendered'] = $done;
	return $html;
}

/** Card del creator: stesso markup di CreatorTile (src/influencee/v2/creators.tsx). */
function inft_creator_card( $c ) {
	$d     = function_exists( 'inft_profile_data' ) ? inft_profile_data() : array();
	$igm   = function_exists( 'inft_igm_by_slug' ) ? inft_igm_by_slug( basename( untrailingslashit( (string) wp_parse_url( $c['url'], PHP_URL_PATH ) ) ) ) : array();
	$image = ! empty( $igm['image'] ) ? (string) $igm['image'] : $c['image'];
	$ig    = ! empty( $igm['handle'] ) ? ltrim( (string) $igm['handle'], '@' ) : $c['ig'];
	$fol   = ! empty( $igm['followers_n'] ) ? (int) $igm['followers_n'] : (int) $c['followers'];
	$cat   = isset( $d['cats'][ $c['cat_slug'] ] ) ? $d['cats'][ $c['cat_slug'] ]['name'] : 'Lifestyle';
	$city  = isset( $d['cities'][ $c['city_slug'] ] ) ? $d['cities'][ $c['city_slug'] ]['name'] : ( $c['city'] ? $c['city'] : 'Italia' );
	$tier  = $fol && function_exists( 'inft_tier_of' ) && isset( $d['tiers'][ inft_tier_of( $fol ) ] ) ? $d['tiers'][ inft_tier_of( $fol ) ]['name'] : '—';
	$shadow = 'shadow-[0_8px_22px_-10px_rgba(10,10,10,.45)]';
	$photo  = $image
		? '<img src="' . esc_url( $image ) . '" alt="' . esc_attr( $c['name'] ) . '" loading="lazy" width="88" height="88" class="h-[88px] w-[88px] rounded-full border-4 border-white bg-white object-cover text-[0px] ' . $shadow . ' transition duration-500 group-hover:scale-105">'
		: '<span class="flex h-[88px] w-[88px] items-center justify-center rounded-full border-4 border-white bg-acid font-heading text-2xl font-semibold text-ink ' . $shadow . '">' . esc_html( mb_strtoupper( mb_substr( $c['name'], 0, 2 ) ) ) . '</span>';
	$stat   = function ( $v, $l ) {
		return '<span class="block min-w-0"><span class="block truncate px-1 font-heading font-semibold">' . esc_html( $v ) . '</span><span class="block text-[11px] text-mute">' . esc_html( $l ) . '</span></span>';
	};
	return '<a href="' . esc_url( $c['url'] ) . '" class="group block overflow-hidden rounded-3xl bg-white ring-1 ring-line transition hover:-translate-y-1 hover:shadow-card">'
		. '<span class="relative block h-[84px] bg-[linear-gradient(135deg,#E6007E_0%,#A3005E_55%,#0A0A0A_100%)]"><span class="absolute left-3 top-3 max-w-[calc(100%-1.5rem)] truncate rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-ink">' . esc_html( $cat ) . '</span></span>'
		. '<span class="relative z-[2] -mt-11 flex justify-center">' . $photo . '</span>'
		. '<span class="block px-4 pb-3.5 pt-3 text-center"><span class="block truncate font-heading font-semibold text-ink">' . esc_html( $c['name'] ) . '</span>'
		. '<span class="block truncate text-xs text-mute">' . ( $ig ? '@' . esc_html( $ig ) : '&nbsp;' ) . '</span></span>'
		. '<span class="grid grid-cols-3 divide-x divide-line border-t border-line px-2 py-3 text-center">'
		. $stat( $fol ? inft_short_number( $fol ) : '—', 'follower' ) . $stat( $tier, 'fascia' ) . $stat( $city, 'città' )
		. '</span></a>';
}

function inft_creators_rendered() {
	return isset( $GLOBALS['inft_creators_rendered'] ) ? $GLOBALS['inft_creators_rendered'] : array();
}

/** Dato strutturato ItemList delle persone mostrate nella pagina. */
function inft_creators_itemlist() {
	$items = array();
	$seen  = array();
	foreach ( array_keys( inft_creators_rendered() ) as $key ) {
		foreach ( inft_creators_query( $key ) as $c ) {
			if ( isset( $seen[ $c['url'] ] ) ) {
				continue;
			}
			$seen[ $c['url'] ] = 1;
			$person            = array( '@type' => 'Person', 'name' => $c['name'], 'url' => $c['url'] );
			if ( $c['image'] ) {
				$person['image'] = $c['image'];
			}
			if ( $c['ig'] ) {
				$person['sameAs'] = array( 'https://www.instagram.com/' . $c['ig'] . '/' );
			}
			if ( $c['city'] ) {
				$person['address'] = array( '@type' => 'PostalAddress', 'addressLocality' => $c['city'], 'addressCountry' => 'IT' );
			}
			$items[] = array( '@type' => 'ListItem', 'position' => count( $items ) + 1, 'item' => $person );
		}
	}
	$page = inft_current();
	return $items ? array( '@context' => 'https://schema.org', '@type' => 'ItemList', 'name' => $page ? $page['label'] : 'Creator', 'numberOfItems' => count( $items ), 'itemListElement' => $items ) : null;
}

/* ════════════════════════════════════════════════════════════════════
   IMPOSTAZIONI (Impostazioni → Influencee Tools)
   ════════════════════════════════════════════════════════════════════ */

add_action(
	'admin_menu',
	function () {
		add_options_page( 'Influencee Tools', 'Influencee Tools', 'manage_options', 'influencee-tools', 'inft_settings_page' );
	}
);

add_action(
	'admin_init',
	function () {
		register_setting(
			'inft',
			'inft_settings',
			array(
				'type'              => 'array',
				'sanitize_callback' => function ( $in ) {
					$paths = array_keys( inft_pages() );
					$list  = function ( $txt ) use ( $paths ) {
						$out = array();
						foreach ( preg_split( '/[\r\n,]+/', (string) $txt ) as $l ) {
							$l = '/' . trim( trim( wp_parse_url( trim( $l ), PHP_URL_PATH ) ?? '' ), '/' ) . '/';
							$l = '//' === $l ? '/' : $l;
							if ( in_array( $l, $paths, true ) ) {
								$out[] = $l;
							}
						}
						return array_values( array_unique( $out ) );
					};
					$g = isset( $in['groups'] ) && is_array( $in['groups'] ) ? $in['groups'] : array();
					return array(
						'groups'    => array( 'tool' => empty( $g['tool'] ) ? 0 : 1, 'nuova' => empty( $g['nuova'] ) ? 0 : 1, 'sostituzione' => empty( $g['sostituzione'] ) ? 0 : 1 ),
						'off'       => $list( isset( $in['off'] ) ? $in['off'] : '' ),
						'on'        => $list( isset( $in['on'] ) ? $in['on'] : '' ),
						'creators'  => empty( $in['creators'] ) ? 0 : 1,
						'profiles'  => empty( $in['profiles'] ) ? 0 : 1,
						'redirects' => empty( $in['redirects'] ) ? 0 : 1,
						'privacy'   => empty( $in['privacy'] ) ? 0 : 1,
						'mcp_admin_only' => empty( $in['mcp_admin_only'] ) ? 0 : 1,
					);
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
		$name = 'Claude MCP (Influencee Tools)';
		foreach ( WP_Application_Passwords::get_user_application_passwords( $user->ID ) as $item ) {
			if ( $name === $item['name'] ) {
				WP_Application_Passwords::delete_application_password( $user->ID, $item['uuid'] );
			}
		}
		$back = admin_url( 'options-general.php?page=influencee-tools' );
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
	$s      = inft_settings();
	$routes = function_exists( 'rest_get_server' ) ? rest_get_server()->get_routes() : array();
	$tandem = isset( $routes['/tandem-forms/v1/capture'] );
	$wpjm   = post_type_exists( 'job_listing' );
	?>
	<div class="wrap">
		<h1>Influencee Tools</h1>
		<p>Le pagine attive sono servite dal plugin con lo stesso URL. Se ne spegni una torna la pagina Elementor di prima.</p>
		<h2>Stato</h2>
		<ul>
			<li><?php echo $tandem ? '✅' : '⚠️'; ?> tandem-forms: <?php echo $tandem ? 'attivo, i lead dei tool arrivano a /wp-json/tandem-forms/v1/capture' : 'non trovato: i moduli dei tool non verranno registrati'; ?></li>
			<li><?php echo $wpjm ? '✅' : '⚠️'; ?> WP Job Manager: <?php echo $wpjm ? 'attivo, la bacheca mostra le offerte reali degli ultimi 180 giorni' : 'non attivo, la bacheca mostra solo il rimando all’app'; ?></li>
			<li>Google Analytics: gli eventi usano il tag GA4 già presente nel sito (G-5BD025G8VP).</li>
		</ul>
		<form method="post" action="options.php">
			<?php settings_fields( 'inft' ); ?>
			<h2>Pagine</h2>
			<?php
			$groups = array(
				'tool'         => array( 'Tool restaurati', 'fake follower, costo influencer, engagement rate, preventivo, offerte, emoticon' ),
				'nuova'        => array( 'Pagine nuove', 'URL che oggi su WordPress non esistono (prezzi, funzionalità, aziende, agenzie, nuove categorie…)' ),
				'sostituzione' => array( 'Sostituzioni di pagine esistenti', 'home, hub influencer italiani, regioni e città, categorie, piattaforma, contatti: hanno traffico, accendile dopo aver controllato l’anteprima' ),
			);
			$by     = array();
			foreach ( inft_pages() as $path => $p ) {
				$by[ isset( $p['group'] ) ? $p['group'] : 'tool' ][ $path ] = $p;
			}
			?>
			<table class="form-table" role="presentation"><tbody>
			<?php foreach ( $groups as $g => $txt ) : ?>
				<tr><th scope="row"><?php echo esc_html( $txt[0] ); ?> (<?php echo isset( $by[ $g ] ) ? count( $by[ $g ] ) : 0; ?>)</th><td>
					<label><input type="checkbox" name="inft_settings[groups][<?php echo esc_attr( $g ); ?>]" value="1" <?php checked( ! empty( $s['groups'][ $g ] ) ); ?>> attive</label>
					<p class="description"><?php echo esc_html( $txt[1] ); ?></p>
					<details><summary>Elenco</summary><ul style="columns:3">
					<?php foreach ( isset( $by[ $g ] ) ? $by[ $g ] : array() as $path => $p ) : ?>
						<li><?php echo inft_is_active( $path, $p, $s ) ? '🟢' : '⚪'; ?> <a href="<?php echo esc_url( home_url( $path ) ); ?>" target="_blank" rel="noopener"><?php echo esc_html( $path ); ?></a></li>
					<?php endforeach; ?>
					</ul></details>
				</td></tr>
			<?php endforeach; ?>
				<tr><th scope="row">Eccezioni</th><td>
					<p><label>Pagine da <b>spegnere</b> anche se il gruppo è acceso (una per riga)<br><textarea name="inft_settings[off]" rows="3" cols="70"><?php echo esc_textarea( implode( "\n", (array) $s['off'] ) ); ?></textarea></label></p>
					<p><label>Pagine da <b>accendere</b> anche se il gruppo è spento (una per riga), es. per provare solo <code>/influencer-italiani/influencer-campania/influencer-napoli/</code><br><textarea name="inft_settings[on]" rows="3" cols="70"><?php echo esc_textarea( implode( "\n", (array) $s['on'] ) ); ?></textarea></label></p>
				</td></tr>
				<tr><th scope="row">Profili dei creator</th><td>
					<label><input type="checkbox" name="inft_settings[creators]" value="1" <?php checked( ! empty( $s['creators'] ) ); ?>> Mostra i profili (tipo di contenuto "creator") nelle pagine città, regione, categoria, hub e home</label>
					<p class="description">Nelle liste si mostrano nome, handle, città, categoria e foto, mai le bio (a volte contengono email e telefoni).</p>
					<p><label><input type="checkbox" name="inft_settings[profiles]" value="1" <?php checked( ! empty( $s['profiles'] ) ); ?>> <b>Pagine profilo con la nuova grafica</b> (<code>/creator/…</code>): foto, follower, fascia, costo medio, modulo "Vuoi collaborare?" verso tandem e creator della stessa zona</label></p>
					<p class="description">I profili restano gestiti dal plugin dei creator: cambia solo come si vedono. La bio si vede senza email e telefoni. Spegnendo la casella torna subito la pagina di prima.</p>
				</td></tr>
			</tbody></table>
						<h2>Privacy e MCP</h2>
			<p><label><input type="checkbox" name="inft_settings[privacy]" value="1" <?php checked( ! empty( $s['privacy'] ) ); ?>> Togli email e telefoni dalle bio dei creator per chi non è redattore (API <code>/igm/v1/creators</code>, <code>/wp/v2/creator</code>, pagine <code>/creator/…</code> e dati strutturati)</label></p>
			<p><label><input type="checkbox" name="inft_settings[mcp_admin_only]" value="1" <?php checked( ! empty( $s['mcp_admin_only'] ) ); ?>> Server MCP del sito solo per amministratori (di default WordPress lo apre a ogni utente con accesso)</label></p>
			<p>Azioni MCP del plugin: <code>influencee/stato</code>, <code>influencee/pagine</code>, <code>influencee/redirect</code>, <code>influencee/svuota-cache</code>, <code>influencee/controlla-pagina</code>, <code>influencee/rimuovi-creator</code>. Indirizzo: <code><?php echo esc_html( rest_url( 'mcp/mcp-adapter-default-server' ) ); ?></code></p>
			<?php $log = array_reverse( (array) get_option( 'inft_mcp_log', array() ) ); if ( $log ) : ?>
				<details><summary>Ultime azioni eseguite via MCP (<?php echo count( $log ); ?>)</summary><table class="widefat striped"><thead><tr><th>Quando</th><th>Utente</th><th>Azione</th><th>Dati</th><th>Esito</th></tr></thead><tbody>
				<?php foreach ( array_slice( $log, 0, 20 ) as $l ) : ?>
					<tr><td><?php echo esc_html( $l['quando'] ); ?></td><td><?php echo esc_html( $l['utente'] ); ?></td><td><?php echo esc_html( $l['azione'] ); ?></td><td><code><?php echo esc_html( mb_substr( (string) $l['input'], 0, 120 ) ); ?></code></td><td><?php echo esc_html( $l['esito'] ); ?></td></tr>
				<?php endforeach; ?>
				</tbody></table></details>
			<?php endif; ?>
			<h2>Redirect 301 dei vecchi URL</h2>
			<p><label><input type="checkbox" name="inft_settings[redirects]" value="1" <?php checked( ! empty( $s['redirects'] ) ); ?>> Attiva i redirect qui sotto (dal piano SEO)</label></p>
			<ul style="list-style:disc;margin-left:20px">
			<?php foreach ( inft_redirect_map() as $from => $to ) : ?>
				<li><code><?php echo esc_html( $from ); ?></code> → <code><?php echo esc_html( $to ); ?></code></li>
			<?php endforeach; ?>
			</ul>
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
			<h2>Accesso per Claude (MCP)</h2>
			<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" style="margin:8px 0 16px">
				<?php wp_nonce_field( 'inft_mcp_access' ); ?>
				<input type="hidden" name="action" value="inft_mcp_access">
				<button class="button button-primary" name="do" value="crea">Crea accesso per Claude</button>
				<button class="button" name="do" value="revoca">Revoca accesso</button>
				<span class="description">Crea una password per le applicazioni del tuo utente (nome "Claude MCP (Influencee Tools)"). Rifarlo sostituisce la precedente.</span>
			</form>
	</div>
	<?php
}

add_filter(
	'plugin_action_links_' . plugin_basename( __FILE__ ),
	function ( $links ) {
		array_unshift( $links, '<a href="' . esc_url( admin_url( 'options-general.php?page=influencee-tools' ) ) . '">Impostazioni</a>' );
		return $links;
	}
);
