<?php
/**
 * Pagine profilo dei creator (/creator/<slug>/) con la grafica del sito.
 *
 * I profili restano gestiti dal plugin dei creator del sito (tipo di contenuto "creator",
 * dati anche in /wp-json/igm/v1/creators): qui cambia solo come vengono mostrati.
 * Il modello pages/creator-profile.html è generato dalla build del sito v2 con segnaposto
 * {{campo}} e blocchi facoltativi <!--IF:campo-->…<!--/IF:campo--> (o [[IF:campo]] nei testi).
 * Si accende da Impostazioni → Influencee Tools → "Pagine profilo con la nuova grafica".
 */

defined( 'ABSPATH' ) || exit;

function inft_profile_data() {
	static $d = null;
	if ( null === $d ) {
		$file = INFT_DIR . 'pages/profile-data.json';
		$d    = file_exists( $file ) ? json_decode( (string) file_get_contents( $file ), true ) : array();
		$d    = is_array( $d ) ? $d : array();
	}
	return $d;
}

/** Dati del plugin dei profili (igm) per slug, se disponibili. Cache di un'ora. */
function inft_igm_by_slug( $slug ) {
	$all = get_transient( 'inft_igm_creators' );
	if ( false === $all ) {
		$all = array();
		if ( function_exists( 'rest_do_request' ) ) {
			$res = rest_do_request( new WP_REST_Request( 'GET', '/igm/v1/creators' ) );
			if ( ! $res->is_error() ) {
				$data = $res->get_data();
				$list = isset( $data['creators'] ) && is_array( $data['creators'] ) ? $data['creators'] : ( is_array( $data ) ? $data : array() );
				foreach ( $list as $c ) {
					if ( is_array( $c ) && ! empty( $c['slug'] ) ) {
						$all[ $c['slug'] ] = $c;
					}
				}
			}
		}
		set_transient( 'inft_igm_creators', $all, HOUR_IN_SECONDS );
	}
	return isset( $all[ $slug ] ) ? $all[ $slug ] : array();
}

/** Follower in forma breve: 52,2K · 1,2M. */
function inft_short_number( $n ) {
	$n = (int) $n;
	if ( $n >= 1000000 ) {
		return str_replace( '.', ',', rtrim( rtrim( number_format( $n / 1000000, 1, '.', '' ), '0' ), '.' ) ) . 'M';
	}
	if ( $n >= 1000 ) {
		return str_replace( '.', ',', rtrim( rtrim( number_format( $n / 1000, 1, '.', '' ), '0' ), '.' ) ) . 'K';
	}
	return (string) $n;
}

function inft_tier_of( $followers ) {
	$f = (int) $followers;
	if ( $f < 10000 ) {
		return 'nano';
	}
	if ( $f < 50000 ) {
		return 'micro';
	}
	if ( $f < 250000 ) {
		return 'mid';
	}
	return $f < 1000000 ? 'macro' : 'mega';
}

/** Tutti i campi del modello per un profilo. Contatti tolti dalla bio. */
function inft_profile_of( $post ) {
	$d    = inft_profile_data();
	$igm  = inft_igm_by_slug( $post->post_name );
	$base = inft_creator_data( $post );
	$term = function ( $tax ) use ( $post ) {
		$t = get_the_terms( $post->ID, $tax );
		return is_array( $t ) && $t ? $t[0] : null;
	};

	$name   = $base['name'];
	$handle = ! empty( $igm['handle'] ) ? ltrim( (string) $igm['handle'], '@' ) : $base['ig'];
	$handle = $handle ? $handle : sanitize_title( $name );
	$image  = ! empty( $igm['image'] ) ? (string) $igm['image'] : $base['image'];
	$fol    = ! empty( $igm['followers_n'] ) ? (int) $igm['followers_n'] : (int) $base['followers'];
	$tierId = ! empty( $igm['tier'] ) && isset( $d['tiers'][ strtolower( $igm['tier'] ) ] ) ? strtolower( $igm['tier'] ) : inft_tier_of( $fol );
	$tier   = isset( $d['tiers'][ $tierId ] ) ? $d['tiers'][ $tierId ] : array( 'name' => '', 'range' => '', 'er' => '', 'cost' => '' );

	// categoria: termine del profilo → categoria del sito
	$cat     = $term( 'creator_category' );
	$catSlug = $cat ? $cat->slug : sanitize_title( isset( $igm['category'] ) ? $igm['category'] : '' );
	$catMap  = isset( $d['cats'][ $catSlug ] ) ? $d['cats'][ $catSlug ] : null;
	$catName = $catMap ? $catMap['name'] : ( $cat ? ucfirst( strtolower( $cat->name ) ) : 'Lifestyle' );
	$catUrl  = $catMap ? $catMap['url'] : '/influencer-italiani/';

	// città e regione
	$city     = $term( 'creator_city' );
	$region   = $term( 'creator_region' );
	$citySlug = $city ? $city->slug : '';
	$cityMap  = $citySlug && isset( $d['cities'][ $citySlug ] ) ? $d['cities'][ $citySlug ] : null;
	$regSlug  = $region ? $region->slug : ( $cityMap ? $cityMap['regionSlug'] : '' );
	$regMap   = $regSlug && isset( $d['regions'][ $regSlug ] ) ? $d['regions'][ $regSlug ] : null;

	$bio = ! empty( $igm['bio'] ) ? (string) $igm['bio'] : (string) get_the_excerpt( $post );
	$bio = trim( preg_replace( '/\s+/', ' ', wp_strip_all_tags( inft_scrub_contacts( $bio ) ) ) );
	$bio = str_replace( '[contatto rimosso]', '', $bio );
	$bio = preg_replace( '/(?:\s*[•·|,\/–-]\s*){2,}/u', ' · ', $bio ); // separatori rimasti senza testo
	$bio = trim( preg_replace( '/\s{2,}/', ' ', $bio ) );
	$bio = trim( preg_replace( '/^(?:[•·|,\/–-]\s*)+|(?:\s*[•·|,\/–-])+$/u', '', $bio ) );
	if ( mb_strlen( $bio ) > 280 ) {
		$bio = rtrim( mb_substr( $bio, 0, 277 ) ) . '…';
	}
	$followers = $fol ? inft_short_number( $fol ) : 'n.d.';
	if ( '' === $bio ) {
		$bio = $name . ' è un creator ' . mb_strtolower( $catName ) . ' su Instagram' . ( $fol ? ' con ' . $followers . ' follower' : '' ) . '.';
	}

	$out = array(
		'id'          => $post->ID,
		'name'        => $name,
		'handle'      => $handle,
		'instagram'   => 'https://www.instagram.com/' . rawurlencode( $handle ) . '/',
		'image'       => $image,
		'bio'         => $bio,
		'category'    => $catName,
		'categoryUrl' => home_url( $catUrl ),
		'city'        => $cityMap ? $cityMap['name'] : ( $city ? $city->name : '' ),
		'cityUrl'     => $cityMap ? home_url( $cityMap['url'] ) : '',
		'region'      => $regMap ? $regMap['name'] : ( $region ? $region->name : '' ),
		'regionUrl'   => $regMap ? home_url( $regMap['url'] ) : '',
		'citySlug'    => $citySlug,
		'regionSlug'  => $regSlug,
		'catTerms'    => $catMap ? $catMap['terms'] : $catSlug,
		'followers'   => $followers,
		'tier'        => $tier['name'],
		'tierRange'   => $tier['range'],
		'tierEr'      => $tier['er'],
		'tierCost'    => $tier['cost'],
		'price'       => ! empty( $igm['price'] ) ? trim( (string) $igm['price'] ) : '',
		'cta'         => ! empty( $igm['cta_url'] ) && preg_match( '#^https://([a-z0-9-]+\.)?influencee\.it/#i', (string) $igm['cta_url'] ) ? (string) $igm['cta_url'] : '', // link alla campagna sulla piattaforma
		'updated'     => get_the_modified_date( 'j/n/Y', $post ),
	);
	$out['where'] = $out['city'] ? $out['city'] : ( $out['region'] ? $out['region'] : 'Italia' );
	if ( ! $out['cityUrl'] ) {
		$out['city'] = ''; // città senza pagina: si indica solo la regione
	}
	if ( ! $out['regionUrl'] ) {
		$out['region'] = '';
	}
	return $out;
}

/** Riempie un testo del modello: blocchi facoltativi, poi segnaposto. */
function inft_profile_fill( $html, $p, $escape = true ) {
	foreach ( array( '#<!--IF:(\w+)-->(.*?)<!--/IF:\1-->#s', '#\[\[IF:(\w+)\]\](.*?)\[\[/IF:\1\]\]#s' ) as $re ) {
		$html = preg_replace_callback(
			$re,
			function ( $m ) use ( $p ) {
				return empty( $p[ $m[1] ] ) ? '' : $m[2];
			},
			$html
		);
	}
	$html = preg_replace_callback(
		'/\{\{(\w+)\}\}/',
		function ( $m ) use ( $p, $escape ) {
			if ( ! isset( $p[ $m[1] ] ) ) {
				return $m[0]; // {{ASSETS}} e altri segnaposto del plugin
			}
			$v = (string) $p[ $m[1] ];
			if ( ! $escape ) {
				return $v;
			}
			return preg_match( '/(?:Url|^instagram|^image|^cta)$/', $m[1] ) ? esc_url( $v ) : esc_html( $v );
		},
		$html
	);
	// filtro dei creator della stessa zona: senza campi vuoti e senza il profilo stesso
	return preg_replace_callback(
		'#<!--INFLUENCEE_CREATORS:([^>]*?)-->#',
		function ( $m ) use ( $p ) {
			parse_str( html_entity_decode( $m[1] ), $f );
			$f = array_filter( $f, 'strlen' );
			$f['exclude'] = $p['id'];
			return '<!--INFLUENCEE_CREATORS:' . http_build_query( $f ) . '-->'; // solo slug e numeri, già codificati
		},
		$html
	);
}

/** Titolo (≤60 caratteri) e descrizione (≤155) del profilo. */
function inft_profile_meta( $p ) {
	$where = $p['city'] ? $p['city'] : ( $p['region'] ? $p['region'] : 'Italia' );
	$cands = array(
		$p['name'] . ' (@' . $p['handle'] . '): influencer ' . mb_strtolower( $p['category'] ) . ' a ' . $where,
		$p['name'] . ': influencer ' . mb_strtolower( $p['category'] ) . ' a ' . $where,
		$p['name'] . ': influencer a ' . $where,
		$p['name'] . ' · Influencee',
	);
	$title = end( $cands );
	foreach ( $cands as $c ) {
		if ( mb_strlen( $c ) <= 60 ) {
			$title = $c;
			break;
		}
	}
	$who   = $p['name'] . ' (@' . $p['handle'] . ') è un creator ' . mb_strtolower( $p['category'] ) . ( $p['city'] ? ' di ' . $p['city'] : '' ) . ' con ' . $p['followers'] . ' follower su Instagram.';
	$cands = array(
		$who . ' Fascia ' . $p['tier'] . ', costo medio di un post ' . $p['tierCost'] . '. Chiedi una collaborazione.',
		$who . ' Fascia ' . $p['tier'] . ', costo medio di un post ' . $p['tierCost'] . '.',
		$who . ' Chiedi una collaborazione.',
		$who,
	);
	$desc = '';
	foreach ( $cands as $c ) {
		if ( mb_strlen( $c ) <= 155 ) {
			$desc = $c;
			break;
		}
	}
	$desc = $desc ? $desc : rtrim( mb_substr( $who, 0, 152 ) ) . '…';
	return array( $title, $desc );
}

/** Dati strutturati: ProfilePage con la persona, percorso e FAQ (stessi testi della pagina). */
function inft_profile_ld( $p, $url, $title, $desc ) {
	$d      = inft_profile_data();
	$person = array(
		'@type'         => 'Person',
		'name'          => $p['name'],
		'alternateName' => '@' . $p['handle'],
		'description'   => $p['bio'],
		'sameAs'        => array( $p['instagram'] ),
		'knowsAbout'    => $p['category'],
	);
	if ( $p['image'] ) {
		$person['image'] = $p['image'];
	}
	if ( $p['city'] ) {
		$person['address'] = array( '@type' => 'PostalAddress', 'addressLocality' => $p['city'], 'addressRegion' => $p['region'], 'addressCountry' => 'IT' );
	}
	$crumbs = array( array( 'Home', home_url( '/' ) ), array( 'Influencer italiani', home_url( '/influencer-italiani/' ) ) );
	if ( $p['region'] && $p['regionUrl'] ) {
		$crumbs[] = array( 'Influencer ' . $p['region'], $p['regionUrl'] );
	}
	if ( $p['city'] && $p['cityUrl'] ) {
		$crumbs[] = array( 'Influencer ' . $p['city'], $p['cityUrl'] );
	}
	$crumbs[] = array( $p['name'], $url );
	$faq      = array();
	foreach ( isset( $d['faq'] ) ? $d['faq'] : array() as $qa ) {
		$faq[] = array(
			'@type'          => 'Question',
			'name'           => inft_profile_fill( $qa['q'], $p, false ),
			'acceptedAnswer' => array( '@type' => 'Answer', 'text' => inft_profile_fill( $qa['a'], $p, false ) ),
		);
	}
	$graph = array(
		array( '@type' => 'ProfilePage', '@id' => $url . '#page', 'url' => $url, 'name' => $title, 'description' => $desc, 'inLanguage' => 'it-IT', 'dateModified' => get_post_modified_time( 'c', false, $p['id'] ), 'mainEntity' => $person ),
		array(
			'@type'           => 'BreadcrumbList',
			'itemListElement' => array_map(
				function ( $c, $i ) {
					return array( '@type' => 'ListItem', 'position' => $i + 1, 'name' => $c[0], 'item' => $c[1] );
				},
				$crumbs,
				array_keys( $crumbs )
			),
		),
	);
	if ( $faq ) {
		$graph[] = array( '@type' => 'FAQPage', 'mainEntity' => $faq );
	}
	return array( '@context' => 'https://schema.org', '@graph' => $graph );
}

/** La pagina profilo della richiesta corrente, nel formato delle altre pagine del plugin. */
function inft_profile_page() {
	$s = inft_settings();
	if ( empty( $s['profiles'] ) || ! did_action( 'wp' ) || ! is_singular( 'creator' ) || ! file_exists( INFT_DIR . 'pages/creator-profile.html' ) ) {
		return null;
	}
	$post = get_queried_object();
	if ( ! $post instanceof WP_Post || 'publish' !== $post->post_status ) {
		return null;
	}
	$p                 = inft_profile_of( $post );
	$path              = '/' . trim( (string) wp_parse_url( get_permalink( $post ), PHP_URL_PATH ), '/' ) . '/';
	list( $t, $desc )  = inft_profile_meta( $p );
	$url               = get_permalink( $post );
	return array(
		'slug'        => 'creator-profile',
		'group'       => 'profilo',
		'label'       => 'Creator della stessa zona',
		'title'       => $t,
		'description' => $desc,
		'ld'          => inft_profile_ld( $p, $url, $t, $desc ),
		'path'        => $path,
		'profile'     => $p,
	);
}

/* ════════════════════════════════════════════════════════════════════
   ELENCO COMPLETO PER I FILTRI (pagina /influencer-italiani/)
   Solo dati pubblici delle card: nome, link, foto, handle, follower,
   categoria, regione, città. Mai bio o contatti. Cache di un'ora.
   ════════════════════════════════════════════════════════════════════ */

function inft_creators_directory() {
	$s = inft_settings();
	if ( empty( $s['creators'] ) || ! post_type_exists( 'creator' ) ) {
		return array();
	}
	$list = get_transient( 'inft_creators_dir' );
	if ( is_array( $list ) ) {
		return $list;
	}
	$d     = inft_profile_data();
	$list  = array();
	$posts = get_posts( array( 'post_type' => 'creator', 'post_status' => 'publish', 'numberposts' => 2000, 'orderby' => 'title', 'order' => 'ASC', 'suppress_filters' => false ) );
	foreach ( $posts as $post ) {
		$c    = inft_creator_data( $post );
		$igm  = inft_igm_by_slug( $post->post_name );
		$cats = wp_get_post_terms( $post->ID, 'creator_category', array( 'fields' => 'slugs' ) );
		$reg  = wp_get_post_terms( $post->ID, 'creator_region', array( 'fields' => 'slugs' ) );
		$city = wp_get_post_terms( $post->ID, 'creator_city', array( 'fields' => 'slugs' ) );
		$reg  = is_array( $reg ) && $reg ? $reg[0] : '';
		if ( ! $reg && is_array( $city ) && $city && isset( $d['cities'][ $city[0] ]['regionSlug'] ) ) {
			$reg = $d['cities'][ $city[0] ]['regionSlug'];
		}
		$list[] = array(
			'n' => $c['name'],
			'u' => $c['url'],
			'i' => ! empty( $igm['image'] ) ? (string) $igm['image'] : $c['image'],
			'h' => ! empty( $igm['handle'] ) ? ltrim( (string) $igm['handle'], '@' ) : $c['ig'],
			'f' => ! empty( $igm['followers_n'] ) ? (int) $igm['followers_n'] : (int) $c['followers'],
			'k' => is_array( $cats ) ? array_values( $cats ) : array(),
			'r' => $reg,
			'c' => is_array( $city ) && $city && isset( $d['cities'][ $city[0] ]['name'] ) ? $d['cities'][ $city[0] ]['name'] : $c['city'],
		);
	}
	set_transient( 'inft_creators_dir', $list, HOUR_IN_SECONDS );
	return $list;
}

/** Profilo modificato: elenco e dati del plugin dei profili si ricaricano. */
function inft_forget_creators() {
	delete_transient( 'inft_creators_dir' );
	delete_transient( 'inft_igm_creators' );
}
add_action( 'save_post_creator', 'inft_forget_creators' );
add_action( 'trashed_post', 'inft_forget_creators' );
