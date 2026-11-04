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

/**
 * Tabella delle opzioni (1.0.2, 04/11): se manca l'indice unico su option_name le righe si duplicano e ogni lettura
 * di un'opzione scorre tutta la tabella (lento). Conta anche il peso caricato a ogni pagina dai plugin non più installati.
 */
function infz_opzioni() {
	global $wpdb;
	$indici = (array) $wpdb->get_results( "SHOW INDEX FROM {$wpdb->options}", ARRAY_A ); // phpcs:ignore
	$unico  = false;
	$chiave = false;
	foreach ( $indici as $i ) {
		if ( 'option_name' === $i['Column_name'] && '0' === (string) $i['Non_unique'] ) {
			$unico = true;
		}
		if ( 'PRIMARY' === $i['Key_name'] ) {
			$chiave = true;
		}
	}
	$doppie = (array) $wpdb->get_results( "SELECT option_name AS nome, COUNT(*) AS volte FROM {$wpdb->options} GROUP BY option_name HAVING volte > 1 ORDER BY volte DESC LIMIT 15", ARRAY_A ); // phpcs:ignore
	$n_dop  = (int) $wpdb->get_var( "SELECT COUNT(*) FROM (SELECT option_name FROM {$wpdb->options} GROUP BY option_name HAVING COUNT(*) > 1) d" ); // phpcs:ignore
	$auto   = "autoload IN ('yes','on','auto-on','auto')";
	$prefissi = array( 'wpassetcleanup', 'rank_math', 'rank-math', 'wphb', 'wpseo', 'sg_security', 'siteground', 'CookieLawInfo', 'cookielawinfo', 'elementor', '_elementor', 'job_manager', 'wpjm', 'wpforms', 'litespeed', 'jetpack', 'woocommerce', 'mailin', 'sib_', 'ws_', 'tandem', 'infl', 'inft', 'infu' );
	$gruppi = array();
	foreach ( $prefissi as $pre ) {
		$r = $wpdb->get_row( $wpdb->prepare( "SELECT COUNT(*) AS n, COALESCE(SUM(LENGTH(option_value)),0) AS b FROM {$wpdb->options} WHERE {$auto} AND option_name LIKE %s", $wpdb->esc_like( $pre ) . '%' ), ARRAY_A ); // phpcs:ignore
		if ( $r && (int) $r['n'] ) {
			$gruppi[ $pre ] = array( 'opzioni' => (int) $r['n'], 'kb' => round( (int) $r['b'] / 1024, 1 ) );
		}
	}
	uasort( $gruppi, function ( $a, $b ) {
		return $b['kb'] <=> $a['kb'];
	} );
	return array(
		'righe'               => (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$wpdb->options}" ), // phpcs:ignore
		'righe_autoload'      => (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$wpdb->options} WHERE {$auto}" ), // phpcs:ignore
		'chiave_primaria'     => $chiave,
		'indice_unico_nome'   => $unico,
		'nomi_duplicati'      => $n_dop,
		'duplicati_esempi'    => $doppie,
		'transient_autoload_kb' => round( (int) $wpdb->get_var( "SELECT COALESCE(SUM(LENGTH(option_value)),0) FROM {$wpdb->options} WHERE {$auto} AND option_name LIKE '\\_transient\\_%'" ) / 1024 ), // phpcs:ignore
		'autoload_per_plugin' => $gruppi,
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
		'opzioni'     => infz_opzioni(),
		'da_pulire'   => $conta,
		'plugin'      => infz_plugin(),
		'cron'        => infz_cron_orfani(),
		'velocita'    => infz_velocita_impostazioni(),
	);
}
