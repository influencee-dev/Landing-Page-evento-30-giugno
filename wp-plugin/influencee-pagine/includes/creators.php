<?php
/**
 * Profili dei creator nelle pagine (card, liste, dato strutturato ItemList).
 * Spostato da Influencee Tools 1.x. Richiede Influencee Core.
 */

defined( 'ABSPATH' ) || exit;

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
	// risultato salvato per un giorno (si rinnova quando cambia un creator: inft_forget_creators)
	$tkey  = 'inft_cq_' . md5( $key . '|' . get_option( 'inft_creators_ver', '0' ) );
	$saved = get_transient( $tkey );
	if ( is_array( $saved ) ) {
		$cache[ $key ] = $saved;
		return $saved;
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
	set_transient( $tkey, $cache[ $key ], DAY_IN_SECONDS );
	return $cache[ $key ];
}

/** HTML delle card (stesse classi della versione interattiva). */
function inft_creators_html_for( $key ) {
	static $done = array();
	// schede della lista salvate per un giorno (prima: ricerca nel database a ogni costruzione della pagina)
	$tkey   = 'inft_cards_' . md5( $key . '|' . get_option( 'inft_creators_ver', '0' ) . '|' . INFP_VERSION );
	$cached = get_transient( $tkey );
	if ( is_string( $cached ) && '' !== $cached ) {
		$done[ $key ] = $cached;
		$GLOBALS['inft_creators_rendered'] = $done;
		return $cached;
	}
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
	if ( $list ) {
		set_transient( $tkey, $html, DAY_IN_SECONDS );
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

