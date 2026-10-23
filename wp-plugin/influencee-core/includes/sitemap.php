<?php
/**
 * Sitemap di WordPress (/wp-sitemap.xml):
 * - aggiunge le pagine dei plugin Influencee accese che non hanno una pagina WordPress (es. /prezzi/, /diventa-creator/):
 *   prima Google le trovava solo dai link interni;
 * - toglie dalla sitemap delle pagine quelle vecchie che oggi fanno un redirect 301 (non si mandano a Google URL che
 *   rimandano altrove).
 */

defined( 'ABSPATH' ) || exit;

add_action(
	'init',
	function () {
		if ( ! function_exists( 'wp_register_sitemap_provider' ) || ! class_exists( 'WP_Sitemaps_Provider' ) ) {
			return;
		}

		/** Pagine dei plugin Influencee senza pagina WordPress. */
		class INFT_Sitemap_Pagine extends WP_Sitemaps_Provider {
			public function __construct() {
				$this->name        = 'influencee';
				$this->object_type = 'influencee';
			}

			/** Percorsi accesi e non coperti da una pagina WordPress pubblicata. */
			private function percorsi() {
				$out = array();
				foreach ( inft_pages() as $path => $p ) {
					if ( ! inft_is_active( $path, $p ) || '/' === $path || false !== strpos( $path, '{' ) ) {
						continue;
					}
					$wp = get_page_by_path( trim( $path, '/' ), OBJECT, 'page' );
					if ( $wp && 'publish' === $wp->post_status ) {
						continue; // c'è già nella sitemap delle pagine
					}
					$out[] = $path;
				}
				sort( $out );
				return $out;
			}

			public function get_url_list( $page_num, $object_subtype = '' ) {
				$list = array();
				foreach ( array_slice( $this->percorsi(), ( $page_num - 1 ) * 2000, 2000 ) as $path ) {
					$list[] = array( 'loc' => home_url( $path ) );
				}
				return $list;
			}

			public function get_max_num_pages( $object_subtype = '' ) {
				return $this->percorsi() ? 1 : 0;
			}
		}

		wp_register_sitemap_provider( 'influencee', new INFT_Sitemap_Pagine() );
	}
);

/** Le pagine vecchie con il redirect attivo escono dalla sitemap delle pagine. */
add_filter(
	'wp_sitemaps_posts_query_args',
	function ( $args, $post_type ) {
		if ( 'page' !== $post_type || empty( inft_settings()['redirect_vecchie'] ) ) {
			return $args;
		}
		$escludi = array();
		foreach ( inft_redirect_vecchie() as $from => $to ) {
			$pg = get_page_by_path( trim( $from, '/' ), OBJECT, 'page' );
			if ( $pg && inft_destinazione_vecchia( $to ) ) {
				$escludi[] = (int) $pg->ID;
			}
		}
		if ( $escludi ) {
			$args['post__not_in'] = array_merge( isset( $args['post__not_in'] ) ? (array) $args['post__not_in'] : array(), $escludi );
		}
		return $args;
	},
	10,
	2
);
