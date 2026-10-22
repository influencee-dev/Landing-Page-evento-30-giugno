<?php
/**
 * Privacy dei profili creator.
 *
 * Le bio dei profili (copiate da Instagram) a volte contengono email e numeri di telefono.
 * Oggi sono leggibili senza password da /wp-json/igm/v1/creators, /wp-json/wp/v2/creator
 * e nelle pagine /creator/<slug>/. Per chi non è redattore li sostituiamo con "[contatto rimosso]".
 */

defined( 'ABSPATH' ) || exit;

/** Toglie email e telefoni da un testo. */
function inft_scrub_contacts( $text ) {
	if ( ! is_string( $text ) || '' === $text ) {
		return $text;
	}
	$text = preg_replace( '/(?:mailto:)?[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/', '[contatto rimosso]', $text );
	// telefoni: +39 / 0039 / numeri italiani di 9-11 cifre, anche con spazi o punti
	$text = preg_replace( '/(?<![\w\/.=-])(?:\+|00)?(?:39[\s.-]?)?(?:3\d{2}|0\d{1,3})[\s.-]?\d{3,4}[\s.-]?\d{3,4}(?![\w\/])/', '[contatto rimosso]', $text );
	return $text;
}

function inft_privacy_on() {
	$s = inft_settings();
	return ! empty( $s['privacy'] ) && ! current_user_can( 'edit_posts' );
}

/** Pulisce ricorsivamente un dato REST. */
function inft_scrub_deep( $data ) {
	if ( is_array( $data ) ) {
		foreach ( $data as $k => $v ) {
			$data[ $k ] = inft_scrub_deep( $v );
		}
		return $data;
	}
	return is_string( $data ) ? inft_scrub_contacts( $data ) : $data;
}

// API pubbliche: /igm/v1/creators… e /wp/v2/creator…
add_filter(
	'rest_post_dispatch',
	function ( $response, $server, $request ) {
		$route = $request->get_route();
		if ( inft_privacy_on() && $response instanceof WP_REST_Response && ( 0 === strpos( $route, '/igm/v1/creators' ) || 0 === strpos( $route, '/wp/v2/creator' ) ) ) {
			$response->set_data( inft_scrub_deep( $response->get_data() ) );
		}
		return $response;
	},
	10,
	3
);

// Pagine pubbliche dei profili /creator/<slug>/
add_filter(
	'the_content',
	function ( $content ) {
		return ( inft_privacy_on() && 'creator' === get_post_type() ) ? inft_scrub_contacts( $content ) : $content;
	},
	20
);
add_filter(
	'get_the_excerpt',
	function ( $excerpt, $post = null ) {
		return ( inft_privacy_on() && $post && 'creator' === get_post_type( $post ) ) ? inft_scrub_contacts( $excerpt ) : $excerpt;
	},
	20,
	2
);

// Dati strutturati di altri plugin (es. ItemList delle città con la bio nel campo description):
// sulle pagine pubbliche tolgo email e telefoni dentro i blocchi JSON-LD che descrivono persone.
add_action(
	'template_redirect',
	function () {
		if ( ! inft_privacy_on() || is_admin() || wp_doing_ajax() ) {
			return;
		}
		ob_start(
			function ( $html ) {
				return preg_replace_callback(
					'#(<script[^>]+application/ld\+json[^>]*>)(.*?)(</script>)#is',
					function ( $m ) {
						return false === strpos( $m[2], '"Person"' ) ? $m[0] : $m[1] . inft_scrub_contacts( $m[2] ) . $m[3];
					},
					$html
				);
			}
		);
	},
	0
);
