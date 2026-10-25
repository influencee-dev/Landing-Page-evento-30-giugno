<?php
/**
 * Controllo del sito (sola lettura): cosa pesa nel database, opzioni caricate a ogni pagina,
 * file rimasti dagli aggiornamenti, plugin spenti, eventi pianificati senza plugin.
 */

defined( 'ABSPATH' ) || exit;

/** Plugin che sul sito influencee.it non servono più (analisi del 21/10/2026). */
function infz_plugin_da_valutare() {
	return array(
		'elementor-mcp-composer' => 'Elementor MCP Composer: non serve, aggiunge un accesso MCP in più.',
		'claude'                 => 'Vecchio plugin con l’endpoint claude/v1: sostituito da Influencee Claude Bridge (chiave propria e permessi), va disattivato e cancellato.',
	);
}

/** Dimensione del database per tabella (le 12 più grandi) e totale, in MB. */
function infz_tabelle() {
	global $wpdb;
	$righe = $wpdb->get_results( $wpdb->prepare( 'SELECT table_name AS t, ROUND((data_length + index_length) / 1048576, 2) AS mb, table_rows AS r, ROUND(data_free / 1048576, 2) AS libero FROM information_schema.tables WHERE table_schema = %s ORDER BY (data_length + index_length) DESC', DB_NAME ), ARRAY_A ); // phpcs:ignore
	$totale = 0;
	foreach ( (array) $righe as $r ) {
		$totale += (float) $r['mb'];
	}
	return array( 'totale_mb' => round( $totale, 1 ), 'tabelle' => array_slice( (array) $righe, 0, 12 ) );
}

/** Opzioni caricate a ogni pagina (autoload): peso totale e le 15 più pesanti. */
function infz_autoload() {
	global $wpdb;
	$auto  = "autoload IN ('yes','on','auto-on','auto')";
	$tot   = (int) $wpdb->get_var( "SELECT SUM(LENGTH(option_value)) FROM {$wpdb->options} WHERE {$auto}" ); // phpcs:ignore
	$top   = $wpdb->get_results( "SELECT option_name AS nome, LENGTH(option_value) AS byte FROM {$wpdb->options} WHERE {$auto} ORDER BY byte DESC LIMIT 15", ARRAY_A ); // phpcs:ignore
	return array( 'totale_kb' => round( $tot / 1024 ), 'piu_pesanti' => (array) $top );
}

/** Eventi pianificati (cron) il cui hook non ha nessuna funzione collegata: di solito plugin tolti. Solo controllo. */
function infz_cron_orfani() {
	$orfani = array();
	$tot    = 0;
	foreach ( (array) _get_cron_array() as $eventi ) {
		foreach ( (array) $eventi as $hook => $istanze ) {
			$tot += count( (array) $istanze );
			if ( ! has_action( $hook ) ) {
				$orfani[ $hook ] = isset( $orfani[ $hook ] ) ? $orfani[ $hook ] + 1 : 1;
			}
		}
	}
	return array( 'totali' => $tot, 'senza_plugin' => $orfani );
}

/** Plugin installati ma spenti, e plugin da valutare ancora presenti. */
function infz_plugin() {
	if ( ! function_exists( 'get_plugins' ) ) {
		require_once ABSPATH . 'wp-admin/includes/plugin.php';
	}
	$spenti = array();
	$valuta = array();
	$elenco = infz_plugin_da_valutare();
	foreach ( get_plugins() as $file => $p ) {
		$slug = dirname( $file );
		if ( ! is_plugin_active( $file ) ) {
			$spenti[] = $p['Name'] . ' ' . $p['Version'];
		}
		foreach ( $elenco as $chiave => $perche ) {
			if ( $slug === $chiave || ( 'claude' === $chiave && 'influencee-claude-bridge' !== $slug && false !== stripos( $p['Name'], 'claude' ) ) ) {
				$valuta[] = array( 'plugin' => $p['Name'], 'attivo' => is_plugin_active( $file ), 'perche' => $perche );
			}
		}
	}
	return array( 'attivi' => count( (array) get_option( 'active_plugins', array() ) ), 'spenti' => $spenti, 'da_valutare' => $valuta );
}

/** Il server e le impostazioni che contano per la velocità. */
function infz_server() {
	global $wpdb;
	return array(
		'php'             => PHP_VERSION,
		'wordpress'       => get_bloginfo( 'version' ),
		'database'        => $wpdb->db_server_info(),
		'memoria_php'     => ini_get( 'memory_limit' ),
		'wp_memory_limit' => WP_MEMORY_LIMIT,
		'cache_oggetti'   => wp_using_ext_object_cache() ? 'sì' : 'no (con Redis o Memcached le pagine non in cache sono più veloci)',
		'litespeed_cache' => defined( 'LSCWP_V' ) ? 'attivo ' . LSCWP_V : 'non attivo',
		'wp_debug'        => ( defined( 'WP_DEBUG' ) && WP_DEBUG ) ? 'acceso (spegnilo in produzione)' : 'spento',
		'cron'            => ( defined( 'DISABLE_WP_CRON' ) && DISABLE_WP_CRON ) ? 'dal server' : 'a ogni visita (meglio un cron del server)',
	);
}

/** Tutto il controllo in un colpo: lo usano la pagina e Claude (MCP). */
function infz_controllo() {
	$conta = array();
	foreach ( infz_voci() as $k => $v ) {
		$conta[ $k ] = array( 'cosa' => $v['label'], 'da_pulire' => (int) call_user_func( $v['conta'] ) );
	}
	return array(
		'server'      => infz_server(),
		'database'    => infz_tabelle(),
		'autoload'    => infz_autoload(),
		'da_pulire'   => $conta,
		'plugin'      => infz_plugin(),
		'cron'        => infz_cron_orfani(),
		'velocita'    => infz_velocita_impostazioni(),
	);
}
