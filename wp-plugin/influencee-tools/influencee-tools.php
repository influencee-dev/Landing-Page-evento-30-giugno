<?php
/**
 * Plugin Name:       Influencee Tools
 * Description:       Tool gratuiti di influencer marketing (fake follower, costo influencer, engagement rate, preventivo campagna, offerte di lavoro, emoticon) con SEO/GEO/AEO, eventi GA4 e lead verso tandem-forms. Serve le pagine tool con il loro URL attuale.
 * Version:           1.0.0
 * Author:            Partidea SRL
 * Requires at least: 6.0
 * Requires PHP:      7.4
 * Text Domain:       influencee-tools
 */

defined( 'ABSPATH' ) || exit;

define( 'INFT_VERSION', '1.0.0' );
define( 'INFT_DIR', plugin_dir_path( __FILE__ ) );
define( 'INFT_URL', plugin_dir_url( __FILE__ ) );

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
			'disabled'  => array(), // percorsi spenti: torna la pagina Elementor
			'redirects' => 0,       // redirect 301 dei vecchi URL (spenti finché non li attivi)
		)
	);
}

/** La pagina tool della richiesta corrente, oppure null. */
function inft_current() {
	static $current = false;
	if ( false !== $current ) {
		return $current;
	}
	$current = null;
	if ( is_admin() || wp_doing_ajax() || ( defined( 'REST_REQUEST' ) && REST_REQUEST ) ) {
		return $current;
	}
	$path  = inft_request_path();
	$pages = inft_pages();
	$s     = inft_settings();
	if ( isset( $pages[ $path ] ) && ! in_array( $path, (array) $s['disabled'], true ) ) {
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
		ob_start( 'inft_clean_head' );
		get_header();
		$html = (string) file_get_contents( $file );
		$html = str_replace( '{{ASSETS}}', esc_url( untrailingslashit( INFT_URL . 'assets' ) ), $html );
		if ( false !== strpos( $html, '<!--INFLUENCEE_JOBS-->' ) ) {
			$html = str_replace( '<!--INFLUENCEE_JOBS-->', inft_jobs_html( inft_jobs() ), $html );
		}
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

/** Un solo <title> e una sola meta description (il vecchio sito ne aveva fino a 5). */
function inft_clean_head( $html ) {
	$n    = 0;
	$html = preg_replace_callback(
		'#<title\b[^>]*>.*?</title>#is',
		function ( $m ) use ( &$n ) {
			return 0 === $n++ ? $m[0] : '';
		},
		$html
	);
	$d    = 0;
	$html = preg_replace_callback(
		'#<meta\s+name=["\']description["\'][^>]*>#i',
		function ( $m ) use ( &$d ) {
			return 0 === $d++ ? $m[0] : '';
		},
		$html
	);
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
		echo '<meta name="description" content="' . esc_attr( $page['description'] ) . '">' . "\n";
		echo '<meta property="og:type" content="website">' . "\n";
		echo '<meta property="og:locale" content="it_IT">' . "\n";
		echo '<meta property="og:site_name" content="Influencee">' . "\n";
		echo '<meta property="og:title" content="' . esc_attr( $page['title'] ) . '">' . "\n";
		echo '<meta property="og:description" content="' . esc_attr( $page['description'] ) . '">' . "\n";
		echo '<meta property="og:url" content="' . esc_url( $url ) . '">' . "\n";
		echo '<meta name="twitter:card" content="summary_large_image">' . "\n";
		if ( ! empty( $page['ld'] ) ) {
			echo '<script type="application/ld+json">' . wp_json_encode( $page['ld'], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES ) . '</script>' . "\n";
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
					$pages   = array_keys( inft_pages() );
					$enabled = isset( $in['enabled'] ) && is_array( $in['enabled'] ) ? array_map( 'sanitize_text_field', $in['enabled'] ) : array();
					return array(
						'disabled'  => array_values( array_diff( $pages, $enabled ) ),
						'redirects' => empty( $in['redirects'] ) ? 0 : 1,
					);
				},
			)
		);
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
			<table class="form-table" role="presentation"><tbody>
			<?php foreach ( inft_pages() as $path => $p ) : ?>
				<tr><th scope="row"><?php echo esc_html( $p['label'] ); ?></th><td>
					<label><input type="checkbox" name="inft_settings[enabled][]" value="<?php echo esc_attr( $path ); ?>" <?php checked( ! in_array( $path, (array) $s['disabled'], true ) ); ?>> attiva</label>
					&nbsp; <a href="<?php echo esc_url( home_url( $path ) ); ?>" target="_blank" rel="noopener"><?php echo esc_html( $path ); ?></a>
				</td></tr>
			<?php endforeach; ?>
			</tbody></table>
			<h2>Redirect 301 dei vecchi URL</h2>
			<p><label><input type="checkbox" name="inft_settings[redirects]" value="1" <?php checked( ! empty( $s['redirects'] ) ); ?>> Attiva i redirect qui sotto (dal piano SEO)</label></p>
			<ul style="list-style:disc;margin-left:20px">
			<?php foreach ( inft_redirect_map() as $from => $to ) : ?>
				<li><code><?php echo esc_html( $from ); ?></code> → <code><?php echo esc_html( $to ); ?></code></li>
			<?php endforeach; ?>
			</ul>
			<?php submit_button( 'Salva' ); ?>
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
