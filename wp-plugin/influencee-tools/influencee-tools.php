<?php
/**
 * Plugin Name:       Influencee Tools
 * Description:       Tool gratuiti di influencer marketing con il loro URL attuale: fake follower checker, calcolatore costo influencer, engagement rate, preventivo campagna, emoticon. Testo completo per Google e motori AI, eventi GA4, lead verso tandem. Le offerte di lavoro sono nel plugin Influencee Annunci.
 * Version:           2.0.0
 * Author:            Partidea SRL
 * Requires at least: 6.0
 * Requires PHP:      7.4
 * Requires Plugins:  influencee-core
 * Text Domain:       influencee-tools
 */

defined( 'ABSPATH' ) || exit;

define( 'INFT_TOOLS_VERSION', '2.0.0' );
define( 'INFT_TOOLS_DIR', plugin_dir_path( __FILE__ ) );

add_action(
	'plugins_loaded',
	function () {
		if ( ! function_exists( 'inft_core_ready' ) ) {
			add_action(
				'admin_notices',
				function () {
					echo '<div class="notice notice-error"><p><b>Influencee Tools</b> ha bisogno del plugin <b>Influencee Core</b>: installalo e attivalo.</p></div>';
				}
			);
			return;
		}
		// le pagine dei tool (pages/meta.json + pages/*.html) sono servite dal motore di Influencee Core
		add_filter(
			'inft_page_sources',
			function ( $sources ) {
				$sources['tools'] = array( 'dir' => INFT_TOOLS_DIR, 'url' => plugin_dir_url( __FILE__ ) );
				return $sources;
			}
		);
	},
	5
);
