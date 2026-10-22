<?php
/**
 * Plugin Name:       Influencee Tema
 * Description:       Intestazione, piè di pagina e layout del sito in HTML5, senza Elementor: stessi link di oggi, un solo CSS e un solo JavaScript leggeri, eventi GA4. Si accende da Influencee → Impostazioni (spento, solo pagine dei plugin, tutto il sito).
 * Version:           1.1.1
 * Requires at least: 6.5
 * Requires PHP:      7.4
 * Requires Plugins:  influencee-core
 * Author:            Partidea SRL
 * License:           GPL-2.0-or-later
 * Text Domain:       influencee-tema
 */

defined( 'ABSPATH' ) || exit;

define( 'INFE_VERSION', '1.1.1' );
define( 'INFE_DIR', plugin_dir_path( __FILE__ ) );
define( 'INFE_URL', plugin_dir_url( __FILE__ ) );

add_action(
	'plugins_loaded',
	function () {
		if ( ! function_exists( 'inft_core_ready' ) || ! function_exists( 'inft_get_header' ) ) {
			add_action(
				'admin_notices',
				function () {
					echo '<div class="notice notice-error"><p><b>Influencee Tema</b> ha bisogno di <b>Influencee Core 2.1.0</b> o successivo: installalo o aggiornalo e attivalo.</p></div>';
				}
			);
			return;
		}
		require_once INFE_DIR . 'includes/menu.php';
		require_once INFE_DIR . 'includes/shell.php';
		require_once INFE_DIR . 'includes/impostazioni.php';
	},
	5
);
