<?php
/**
 * Plugin Name:       Influencee Pulizia
 * Description:       Controllo e pulizia del sito WordPress: mostra cosa lo rallenta (database, opzioni caricate a ogni pagina, file rimasti, plugin spenti) e lo pulisce solo dopo la tua conferma. Accorgimenti di velocità facoltativi. Si accende quando serve e si spegne dopo.
 * Version:           1.0.1
 * Requires at least: 6.5
 * Requires PHP:      7.4
 * Author:            Partidea SRL
 * License:           GPL-2.0-or-later
 * Text Domain:       influencee-pulizia
 */

defined( 'ABSPATH' ) || exit;

define( 'INFZ_VERSION', '1.0.1' );
define( 'INFZ_DIR', plugin_dir_path( __FILE__ ) );

require_once INFZ_DIR . 'includes/controllo.php';
require_once INFZ_DIR . 'includes/pulizia.php';
require_once INFZ_DIR . 'includes/velocita.php';
require_once INFZ_DIR . 'includes/mcp.php';
if ( is_admin() ) {
	require_once INFZ_DIR . 'includes/admin.php';
}

/** Registro delle pulizie (ultime 50), dalla pagina o da Claude via MCP. */
function infz_log( $chi, $voci, $esito ) {
	$log   = (array) get_option( 'infz_log', array() );
	$user  = wp_get_current_user();
	$log[] = array(
		'quando' => current_time( 'mysql' ),
		'utente' => $user && $user->exists() ? $user->user_login : '',
		'da'     => $chi,
		'voci'   => implode( ', ', (array) $voci ),
		'esito'  => $esito,
	);
	update_option( 'infz_log', array_slice( $log, -50 ), false );
}
