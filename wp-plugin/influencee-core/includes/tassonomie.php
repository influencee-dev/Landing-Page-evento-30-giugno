<?php
/**
 * Vecchie pagine automatiche di WordPress (archivi delle tassonomie dei creator, tag, autori).
 *
 * Erano quasi vuote (7–140 parole) e facevano concorrenza alle pagine nuove (verifica del 27/10/2026, 888 URL).
 * - /creator-city/<città>/   → 301 alla pagina «Lavoro content creator <città>» se esiste (plugin Annunci),
 *                              altrimenti a «Influencer <città>», altrimenti alla regione o all'hub;
 * - /creator-region/<r>/     → 301 a «Influencer <regione>»;
 * - /creator-cat/<c>/        → 301 alla pagina della categoria;
 * - tag e autori             → restano visibili ma noindex e fuori dalla sitemap;
 * - offerte WP Job Manager e tassonomie dei creator fuori dalla sitemap (oggi fanno redirect).
 * Interruttore: impostazione «redirect_vecchie» (le stesse regole delle pagine vecchie).
 */

defined( 'ABSPATH' ) || exit;

/** Categoria vecchia (slug del termine creator_category) → pagina di categoria nuova. */
function inft_tassonomia_categorie() {
	$map = array(
		'food-influencers'         => array( 'food', 'chef', 'nutrizione' ),
		'travel-influencers'       => array( 'travel' ),
		'fashion-influencers'      => array( 'fashion', 'model', 'model-photographer', 'stylist' ),
		'beauty-influencers'       => array( 'beauty' ),
		'fitness-influencers'      => array( 'fitness', 'sport', 'fit', 'gym', 'athlete' ),
		'mom-influencers'          => array( 'mom', 'mum', 'parenting' ),
		'music-influencers'        => array( 'music', 'producer' ),
		'lifestyle-influencers'    => array( 'lifestyle', 'content-creator', 'digital-creator', 'blogger', 'personal-blog', 'public-figure', 'youtuber' ),
		'home-influencers'         => array( 'design' ),
		'health-influencers'       => array( 'health' ),
		'photography-influencers'  => array( 'photographer', 'photograph', 'photography', 'artist', 'art' ),
		'book-influencers'         => array( 'cultura', 'editor', 'journalist', 'journalism', 'writer' ),
		'comic-influencers'        => array( 'comic', 'comedy', 'comedian', 'actor' ),
		'entrepreneur-influencers' => array( 'entrepreneur' ),
	);
	$out = array();
	foreach ( $map as $page => $terms ) {
		foreach ( $terms as $t ) {
			$out[ $t ] = '/' . $page . '/';
		}
	}
	return (array) apply_filters( 'inft_tassonomia_categorie', $out );
}

/** Un percorso è una pagina servita da un plugin Influencee o una pagina WordPress pubblicata? */
function inft_tassonomia_esiste( $path ) {
	if ( apply_filters( 'inft_tassonomia_esiste', false, $path ) ) {
		return true; // pagine servite da un plugin senza pagina WordPress (es. città del plugin Annunci)
	}
	$pages = inft_pages();
	if ( isset( $pages[ $path ] ) ) {
		return true;
	}
	$p = get_page_by_path( trim( $path, '/' ), OBJECT, 'page' );
	return $p && 'publish' === $p->post_status;
}

/** Destinazione della vecchia pagina /creator-city/<slug>/. */
function inft_tassonomia_citta( $slug ) {
	$to = apply_filters( 'inft_tassonomia_citta', '', $slug ); // es. pagina città del plugin Annunci
	if ( $to ) {
		return $to;
	}
	foreach ( array_keys( inft_pages() ) as $path ) {
		if ( preg_match( '#^/influencer-italiani/influencer-[^/]+/(?:influencer-)?' . preg_quote( $slug, '#' ) . '/$#', $path ) ) {
			return $path;
		}
	}
	$region = '';
	$posts  = get_posts( array( 'post_type' => 'creator', 'numberposts' => 1, 'fields' => 'ids', 'tax_query' => array( array( 'taxonomy' => 'creator_city', 'field' => 'slug', 'terms' => $slug ) ) ) );
	if ( $posts ) {
		$r = wp_get_post_terms( $posts[0], 'creator_region', array( 'fields' => 'slugs' ) );
		$region = is_array( $r ) && $r ? $r[0] : '';
	}
	return $region ? inft_tassonomia_regione( $region ) : '/influencer-italiani/';
}

function inft_tassonomia_regione( $slug ) {
	$path = '/influencer-italiani/influencer-' . sanitize_title( $slug ) . '/';
	return inft_tassonomia_esiste( $path ) ? $path : '/influencer-italiani/';
}

add_action(
	'template_redirect',
	function () {
		if ( empty( inft_settings()['redirect_vecchie'] ) || ! is_tax( array( 'creator_city', 'creator_region', 'creator_category' ) ) ) {
			return;
		}
		$t  = get_queried_object();
		$to = '';
		if ( 'creator_city' === $t->taxonomy ) {
			$to = inft_tassonomia_citta( $t->slug );
		} elseif ( 'creator_region' === $t->taxonomy ) {
			$to = inft_tassonomia_regione( $t->slug );
		} else {
			$map = inft_tassonomia_categorie();
			$to  = isset( $map[ $t->slug ] ) && inft_tassonomia_esiste( $map[ $t->slug ] ) ? $map[ $t->slug ] : '/influencer-italiani/';
		}
		if ( $to && inft_tassonomia_esiste( $to ) ) {
			wp_safe_redirect( home_url( $to ), 301, 'Influencee' );
			exit;
		}
	},
	-9998
);

/* Tag e autori: pagine di servizio, non per Google */
add_filter(
	'wp_robots',
	function ( $robots ) {
		if ( ! empty( inft_settings()['redirect_vecchie'] ) && ( is_tag() || is_author() ) ) {
			$robots['noindex'] = true;
			$robots['follow']  = true;
			unset( $robots['max-image-preview'] );
		}
		return $robots;
	}
);

add_filter(
	'wp_sitemaps_taxonomies',
	function ( $tax ) {
		if ( ! empty( inft_settings()['redirect_vecchie'] ) ) {
			unset( $tax['post_tag'], $tax['creator_city'], $tax['creator_region'], $tax['creator_category'] );
		}
		return $tax;
	}
);

add_filter(
	'wp_sitemaps_post_types',
	function ( $types ) {
		if ( ! empty( inft_settings()['redirect_vecchie'] ) ) {
			unset( $types['job_listing'] ); // le offerte vecchie fanno redirect alla bacheca
		}
		return $types;
	}
);

add_filter(
	'wp_sitemaps_add_provider',
	function ( $provider, $name ) {
		return ( 'users' === $name && ! empty( inft_settings()['redirect_vecchie'] ) ) ? false : $provider;
	},
	10,
	2
);
