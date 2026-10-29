<?php
/**
 * Correzioni SEO dalla verifica del 29/10/2026 (640 pagine esplorate seguendo i link, scratchpad/seo).
 *
 * - Link interni che finivano in 404 o passavano da un redirect: 301 per chi arriva da fuori e, nelle pagine
 *   degli articoli, href riscritti verso la destinazione finale (inft_link_finale / inft_fix_links).
 * - WordPress «indovinava» la pagina di un 404 (/brand/ portava a un'offerta di lavoro scaduta): spento.
 * - Profili creator doppi (/creator/nome-2/): 301 al profilo originale e fuori dalla sitemap.
 * - Archivi delle categorie del blog (/category/…/): pagine sottili senza canonical → noindex,follow e fuori
 *   dalla sitemap; la pagina del blog resta indicizzata.
 */

defined( 'ABSPATH' ) || exit;

/** Indirizzi linkati nel sito che non esistono più → pagina giusta (verifica del 29/10/2026). */
function inft_link_rotti() {
	return (array) apply_filters(
		'inft_link_rotti',
		array(
			'/news-influencer-marketing/come-automatizzare-tutto-con-la-piattaforma/' => '/come-automatizzare-gestione-ugc-guida/',
			'/come-creare-una-strategia-di-influencer-marketing/'                     => '/come-creare-una-influencer-marketing-strategy-nel-2026/',
			'/micro-influencer-b2b-startup-lead-generation-2026/'                     => '/micro-influencer-b2b-per-startup-come-generare-lead-qualificati-nel-2026/',
			'/performance-marketing-creator-cpa-attribution-2026/'                    => '/benchmark-influencer-2026-i-nuovi-standard-del-mercato/',
			'/ai-influencer-marketing-2026-guida-roi-creator/'                        => '/ai-e-influencer-marketing-nel-2026-come-raddoppiare-il-roi-dei-creator/',
			'/come-creare-perfetto-media-kit-influencer-2024/'                        => '/creare-un-media-kit-perfetto-per-influencer-guida-in-5-step/',
			'/personal-branding/'                                                    => '/le-8-regole-del-personal-branding-una-guida-essenziale/',
			'/media-kit-influencer/'                                                 => '/funzionalita/media-kit/',
			'/come-diventare-un-influencer-di-successo-consigli-dai-migliori-del-settore/' => '/come-diventare-influencer-la-guida-completa-2026/',
			'/come-eliminare-falsi-follower/'                                        => '/come-riconoscere-e-rimuovere-fake-follower/',
			'/migliori-beauty-influencer-instagram/'                                 => '/i-migliori-beauty-influencer-su-instagram/',
			'/come-trovare-il-giusto-influencer-per-il-tuo-brand/'                   => '/come-trovare-un-influencer-del-brand-per-promuovere-la-propria-attivita/',
			'/brand/'                                                                => '/influencer-marketing-aziende/',
		)
	);
}

/**
 * Indirizzi che fanno già un redirect (di altri plugin o del server) ma sono ancora linkati negli articoli:
 * solo per riscrivere i link, nessun redirect nuovo. Le pagine dei tool social non sono qui: si stanno rifacendo.
 */
function inft_link_gia_rediretti() {
	return array(
		'/trova-influencer/'               => '/funzionalita/database-influencer/',
		'/corsi-content-creator/'          => '/academy-influencer-marketing/',
		'/corso-content-creator/'          => '/academy-influencer-marketing/',
		'/corso-gratuito-social-ads-2025/' => '/academy-influencer-marketing/',
		'/costo-influencer/'               => '/social-media-tool/costo-influencer/',
		'/come-automatizzare-gestione-ugc-influencer-e-contratti/' => '/come-automatizzare-gestione-ugc-guida/',
		'/come-calcolare-il-costo-di-una-campagna-social-completa-guida-definitiva/' => '/come-calcolare-il-costo-di-una-campagna-social-guida-2026/',
		'/guida-definitiva-al-micro-influencer-marketing-2026/' => '/micro-influencer/',
		'/demo-piattaforma-influencer/'    => '/piattaforma-influencer/',
		'/gestione-ugc/'                   => '/contenuti-ugc/',
		'/consulenza-creator/'             => '/diventa-creator/',
		'/gestione-campagne-influencer/'   => '/funzionalita/gestione-campagne/',
		'/influencer-milano/'              => '/influencer-italiani/influencer-lombardia/influencer-milano/',
	);
}

/** Destinazione finale di un percorso interno: segue link rotti e redirect del Core (al massimo 5 salti). */
function inft_link_finale( $path ) {
	$rotti = inft_link_rotti();
	$s     = inft_settings();
	$base  = ! empty( $s['redirects'] ) ? inft_redirect_map() : array();
	$vecch = ! empty( $s['redirect_vecchie'] ) ? inft_redirect_vecchie() : array();
	$rotti = array_merge( inft_link_gia_rediretti(), $rotti );
	for ( $i = 0; $i < 5; $i++ ) {
		if ( isset( $rotti[ $path ] ) ) {
			$path = $rotti[ $path ];
		} elseif ( isset( $base[ $path ] ) ) {
			$path = $base[ $path ];
		} elseif ( isset( $vecch[ $path ] ) && ( $to = inft_destinazione_vecchia( $vecch[ $path ] ) ) ) {
			$path = $to;
		} else {
			break;
		}
	}
	return $path;
}

/** Riscrive gli href interni di una pagina verso la destinazione finale (niente link a 404 o a redirect). */
function inft_fix_links( $html ) {
	$host = preg_quote( (string) wp_parse_url( home_url(), PHP_URL_HOST ), '#' );
	return preg_replace_callback(
		'#(<a\b[^>]*?\bhref=)(["\'])(?:https?://(?:www\.)?' . $host . ')?(/[^"\'\#?]*)([^"\']*)\2#i',
		function ( $m ) {
			$path = $m[3];
			if ( preg_match( '#^/(wp-|feed)|\.[a-z0-9]{2,4}$#i', $path ) ) {
				return $m[0];
			}
			$norm = trailingslashit( $path );
			$to   = inft_link_finale( $norm );
			if ( $to === $norm ) {
				return $m[0];
			}
			return $m[1] . $m[2] . esc_url( home_url( $to ) ) . $m[4] . $m[2];
		},
		$html
	);
}

/* 301 per gli indirizzi rotti (backlink e vecchi link da fuori) */
add_action(
	'template_redirect',
	function () {
		$path  = inft_request_path();
		$rotti = inft_link_rotti();
		if ( isset( $rotti[ $path ] ) && ! inft_current() ) {
			wp_safe_redirect( home_url( $rotti[ $path ] ), 301, 'Influencee' );
			exit;
		}
	},
	-9997
);

/* WordPress non indovina più la destinazione di un 404 (portava a pagine a caso) */
add_filter( 'do_redirect_guess_404_permalink', '__return_false' );

/* ─── Profili creator doppi: /creator/nome-2/ → /creator/nome/ ─── */

function inft_creator_originale( $post ) {
	if ( ! $post || 'creator' !== $post->post_type || ! preg_match( '/^(.+)-\d+$/', $post->post_name, $m ) ) {
		return null;
	}
	$orig = get_page_by_path( $m[1], OBJECT, 'creator' );
	return ( $orig && 'publish' === $orig->post_status && $orig->ID !== $post->ID ) ? $orig : null;
}

add_action(
	'template_redirect',
	function () {
		if ( ! is_singular( 'creator' ) ) {
			return;
		}
		$orig = inft_creator_originale( get_queried_object() );
		if ( $orig ) {
			wp_safe_redirect( get_permalink( $orig ), 301, 'Influencee' );
			exit;
		}
	},
	-9996
);

add_filter(
	'wp_sitemaps_posts_query_args',
	function ( $args, $post_type ) {
		if ( 'creator' !== $post_type ) {
			return $args;
		}
		$dup = get_transient( 'inft_creator_doppi' );
		if ( ! is_array( $dup ) ) {
			$dup = array();
			foreach ( get_posts( array( 'post_type' => 'creator', 'post_status' => 'publish', 'numberposts' => -1 ) ) as $p ) {
				if ( inft_creator_originale( $p ) ) {
					$dup[] = (int) $p->ID;
				}
			}
			set_transient( 'inft_creator_doppi', $dup, DAY_IN_SECONDS );
		}
		if ( $dup ) {
			$args['post__not_in'] = array_merge( isset( $args['post__not_in'] ) ? (array) $args['post__not_in'] : array(), $dup );
		}
		return $args;
	},
	10,
	2
);

/* ─── Archivi delle categorie del blog: noindex e fuori dalla sitemap ─── */

add_filter(
	'wp_robots',
	function ( $robots ) {
		if ( is_category() ) {
			$robots['noindex'] = true;
			$robots['follow']  = true;
		}
		return $robots;
	}
);

add_filter(
	'wp_sitemaps_taxonomies',
	function ( $tax ) {
		unset( $tax['category'] );
		return $tax;
	}
);

/* Pagina del blog (pagina degli articoli di WordPress): canonical, Open Graph e dati strutturati se mancano */
add_action(
	'wp_head',
	function () {
		if ( ! is_home() || is_front_page() || inft_current() ) {
			return;
		}
		$id  = (int) get_option( 'page_for_posts' );
		$url = $id ? get_permalink( $id ) : home_url( '/' );
		$tit = 'Blog di influencer marketing: guide e novità';
		$des = 'Guide pratiche di influencer marketing per brand e creator: campagne, engagement, prezzi, UGC, strumenti social e novità delle piattaforme.';
		echo '<link data-inft rel="canonical" href="' . esc_url( $url ) . '">' . "\n";
		echo '<meta data-inft property="og:type" content="website"><meta data-inft property="og:locale" content="it_IT"><meta data-inft property="og:site_name" content="Influencee">' . "\n";
		echo '<meta data-inft property="og:title" content="' . esc_attr( $tit ) . '"><meta data-inft property="og:url" content="' . esc_url( $url ) . '"><meta data-inft property="og:description" content="' . esc_attr( $des ) . '">' . "\n";
		$ld = array( '@context' => 'https://schema.org', '@graph' => array( inft_org_ld(), array( '@type' => 'Blog', '@id' => $url . '#blog', 'url' => $url, 'name' => $tit, 'description' => $des, 'inLanguage' => 'it-IT', 'publisher' => array( '@id' => home_url( '/#org' ) ) ) ) );
		echo '<script type="application/ld+json" data-inft>' . wp_json_encode( $ld, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES ) . '</script>' . "\n";
	},
	2
);

add_filter(
	'pre_get_document_title',
	function ( $title ) {
		return ( is_home() && ! is_front_page() && ! inft_current() ) ? 'Blog di influencer marketing: guide e novità' : $title;
	},
	98
);
