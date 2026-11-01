<?php
/**
 * Plugin Name:       Influencee Offerte
 * Description:       Offerte di lavoro per creator inserite e gestite da WordPress (al posto di WP Job Manager): stessi campi dell'app, revisione delle offerte mandate dalle aziende dal sito, pagina per ogni offerta su /offerte-lavoro-influencer/<offerta>/ con candidatura nell'app, scadenza automatica, importazione da WP Job Manager. Le offerte compaiono nella bacheca e nelle pagine città di Influencee Annunci.
 * Version:           1.0.0
 * Author:            Partidea SRL
 * Requires at least: 6.0
 * Requires PHP:      7.4
 * Requires Plugins:  influencee-core, influencee-annunci
 * Text Domain:       influencee-offerte
 */

defined( 'ABSPATH' ) || exit;

define( 'INFO_VERSION', '1.0.0' );
define( 'INFO_DIR', plugin_dir_path( __FILE__ ) );
define( 'INFO_URL', plugin_dir_url( __FILE__ ) );
define( 'INFO_CPT', 'inf_offerta' );

add_action(
	'plugins_loaded',
	function () {
		if ( ! function_exists( 'inft_core_ready' ) || ! function_exists( 'infn_annunci' ) ) {
			add_action(
				'admin_notices',
				function () {
					echo '<div class="notice notice-error"><p><b>Influencee Offerte</b> ha bisogno di <b>Influencee Core</b> e <b>Influencee Annunci</b> attivi.</p></div>';
				}
			);
			return;
		}
		require_once INFO_DIR . 'includes/dati.php';
		require_once INFO_DIR . 'includes/pagina.php';
		require_once INFO_DIR . 'includes/flussi.php';
		if ( is_admin() ) {
			require_once INFO_DIR . 'includes/admin.php';
		}
	},
	6
);

register_activation_hook(
	__FILE__,
	function () {
		if ( ! wp_next_scheduled( 'info_scadenze' ) ) {
			wp_schedule_event( time() + 120, 'daily', 'info_scadenze' );
		}
	}
);

register_deactivation_hook(
	__FILE__,
	function () {
		wp_clear_scheduled_hook( 'info_scadenze' );
	}
);
