<?php
/**
 * Misura dei tempi di caricamento (03/11/2026: Search Console segnala 247 pagine lente dal 21/10; dall'esterno
 * ogni richiesta PHP, anche l'API REST, impiega 2,6–4,5 secondi e nessuna pagina esce dalla cache).
 *
 * Mette per 48 ore il mu-plugin misura-mu.php (si toglie da solo) e pubblica i risultati aggregati, solo lettura:
 * GET /wp-json/influencee-aggiornamenti/v1/misure → tempi medi per fase, plugin più lenti da caricare, funzioni più
 * lente, chiamate esterne, cache (pagina e oggetti), OPcache, peso delle opzioni caricate a ogni richiesta.
 */

defined( 'ABSPATH' ) || exit;

const INFU_MISURA_ORE = 48;

function infu_misura_file() {
	return trailingslashit( WPMU_PLUGIN_DIR ) . 'influencee-misura.php';
}

/** Mette il mu-plugin una volta (per versione della misura). */
function infu_misura_avvia() {
	if ( '1' === get_option( 'infu_misura_v' ) || ! wp_is_file_mod_allowed( 'infu_misura' ) ) {
		return;
	}
	$fino = time() + INFU_MISURA_ORE * HOUR_IN_SECONDS;
	$src  = (string) file_get_contents( INFU_DIR . 'misura-mu.php' ); // phpcs:ignore WordPress.WP.AlternativeFunctions
	if ( ! $src || ( ! is_dir( WPMU_PLUGIN_DIR ) && ! wp_mkdir_p( WPMU_PLUGIN_DIR ) ) ) {
		return;
	}
	if ( false === file_put_contents( infu_misura_file(), str_replace( '__SCADENZA__', (string) $fino, $src ) ) ) { // phpcs:ignore WordPress.WP.AlternativeFunctions
		return;
	}
	update_option( 'infu_misura_v', '1', false );
	update_option( 'infu_misura_fino', $fino, false );
	delete_option( 'infu_misure' );
	infu_log( 'Misura dei tempi di caricamento accesa per ' . INFU_MISURA_ORE . ' ore.' );
}
add_action( 'init', 'infu_misura_avvia', 20 );

/** Media dei valori di una chiave sui campioni. */
function infu_misura_media( $campioni, $chiave ) {
	$somma = array();
	$volte = array();
	foreach ( $campioni as $c ) {
		foreach ( isset( $c[ $chiave ] ) ? (array) $c[ $chiave ] : array() as $k => $v ) {
			$somma[ $k ] = ( isset( $somma[ $k ] ) ? $somma[ $k ] : 0 ) + (float) $v;
			$volte[ $k ] = ( isset( $volte[ $k ] ) ? $volte[ $k ] : 0 ) + 1;
		}
	}
	$n   = max( 1, count( $campioni ) );
	$out = array();
	foreach ( $somma as $k => $s ) {
		$out[ $k ] = round( $s / $n, 1 ); // media su tutte le richieste (0 dove non c'era)
	}
	arsort( $out );
	return $out;
}

function infu_misura_ambiente() {
	global $wpdb;
	$autoload = $wpdb->get_results( "SELECT option_name, LENGTH(option_value) AS peso FROM {$wpdb->options} WHERE autoload IN ('yes','on','auto-on','auto') ORDER BY peso DESC LIMIT 12", ARRAY_A ); // phpcs:ignore WordPress.DB.DirectDatabaseQuery
	$totale   = (int) $wpdb->get_var( "SELECT SUM(LENGTH(option_value)) FROM {$wpdb->options} WHERE autoload IN ('yes','on','auto-on','auto')" ); // phpcs:ignore WordPress.DB.DirectDatabaseQuery
	$attivi   = array_map( function ( $p ) {
		return strtok( $p, '/' );
	}, (array) get_option( 'active_plugins', array() ) );
	return array(
		'php'                => PHP_VERSION,
		'opcache'            => function_exists( 'opcache_get_status' ) ? (bool) ini_get( 'opcache.enable' ) : false,
		'cache_oggetti'      => wp_using_ext_object_cache(),
		'object_cache_php'   => file_exists( WP_CONTENT_DIR . '/object-cache.php' ),
		'litespeed_attivo'   => defined( 'LSCWP_V' ),
		'litespeed_cache'    => get_option( 'litespeed.conf.cache', null ),
		'litespeed_oggetti'  => get_option( 'litespeed.conf.object', null ),
		'server'             => isset( $_SERVER['SERVER_SOFTWARE'] ) ? sanitize_text_field( wp_unslash( $_SERVER['SERVER_SOFTWARE'] ) ) : '',
		'plugin_attivi'      => $attivi,
		'autoload_kb'        => round( $totale / 1024 ),
		'autoload_piu_pesanti' => array_map( function ( $r ) {
			return array( $r['option_name'], round( (int) $r['peso'] / 1024, 1 ) . ' KB' );
		}, (array) $autoload ),
		'cron_in_ritardo'    => count( array_filter( array_keys( (array) _get_cron_array() ), function ( $t ) {
			return $t < time() - 600;
		} ) ),
	);
}

add_action(
	'rest_api_init',
	function () {
		register_rest_route(
			'influencee-aggiornamenti/v1',
			'/misure',
			array(
				'methods'             => 'GET',
				'permission_callback' => '__return_true',
				'callback'            => function () {
					nocache_headers();
					$camp = (array) get_option( 'infu_misure', array() );
					$tot  = array_column( $camp, 'totale' );
					$http = array();
					foreach ( $camp as $c ) {
						foreach ( (array) $c['http'] as $h ) {
							$http[ $h[0] ] = isset( $http[ $h[0] ] ) ? array( $http[ $h[0] ][0] + 1, $http[ $h[0] ][1] + $h[1] ) : array( 1, $h[1] );
						}
					}
					foreach ( $http as $host => $v ) {
						$http[ $host ] = array( 'volte' => $v[0], 'ms_medi' => round( $v[1] / $v[0] ) );
					}
					sort( $tot );
					return array(
						'misura_fino'  => get_option( 'infu_misura_fino' ) ? gmdate( 'c', (int) get_option( 'infu_misura_fino' ) ) : '',
						'campioni'     => count( $camp ),
						'totale_ms'    => $tot ? array( 'medio' => round( array_sum( $tot ) / count( $tot ) ), 'mediano' => $tot[ (int) floor( count( $tot ) / 2 ) ], 'max' => end( $tot ) ) : null,
						'query_medie'  => $camp ? round( array_sum( array_column( $camp, 'query' ) ) / count( $camp ) ) : null,
						'fasi_ms'      => infu_misura_media( $camp, 'fasi' ),
						'plugin_ms'    => array_slice( infu_misura_media( $camp, 'plugin' ), 0, 20, true ),
						'funzioni_ms'  => array_slice( infu_misura_media( $camp, 'cb' ), 0, 25, true ),
						'chiamate_esterne' => $http,
						'ultime'       => array_map( function ( $c ) {
							return array( $c['quando'], $c['tipo'], $c['pagina'], $c['totale'] . ' ms', $c['query'] . ' query' );
						}, array_slice( $camp, -8 ) ),
						'ambiente'     => infu_misura_ambiente(),
					);
				},
			)
		);
	}
);
