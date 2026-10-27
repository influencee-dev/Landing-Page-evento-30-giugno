<?php
/**
 * Plugin Name:       Influencee Annunci
 * Description:       Offerte di lavoro per influencer collegate ad app.influencee.it: bacheca con gli annunci aperti dell'app e percorso "Pubblica un'offerta" con gli stessi campi dell'app (offerta + dati azienda), scelta dei creator bloccata fino all'ingresso nell'app, account creato alla fine. Pagine «Lavoro content creator» per città con offerte in anteprima e avvisi email per i creator. Lead verso tandem, eventi GA4, HTML5 leggero.
 * Version:           1.2.0
 * Author:            Partidea SRL
 * Requires at least: 6.0
 * Requires PHP:      7.4
 * Requires Plugins:  influencee-core
 * Text Domain:       influencee-annunci
 */

defined( 'ABSPATH' ) || exit;

define( 'INFN_VERSION', '1.2.0' );
define( 'INFN_DIR', plugin_dir_path( __FILE__ ) );
define( 'INFN_URL', plugin_dir_url( __FILE__ ) );

add_action(
	'plugins_loaded',
	function () {
		if ( ! function_exists( 'inft_core_ready' ) ) {
			add_action(
				'admin_notices',
				function () {
					echo '<div class="notice notice-error"><p><b>Influencee Annunci</b> ha bisogno del plugin <b>Influencee Core</b>: installalo e attivalo.</p></div>';
				}
			);
			return;
		}
		require_once INFN_DIR . 'includes/dati.php';
		require_once INFN_DIR . 'includes/pagine.php';
		require_once INFN_DIR . 'includes/citta.php';
		require_once INFN_DIR . 'includes/invio.php';
		require_once INFN_DIR . 'includes/impostazioni.php';
	},
	5
);
