<?php
/**
 * Riscaldamento della cache di LiteSpeed (03/11/2026): con la cache accesa una pagina già in cache risponde in
 * 0,2 s, ma la prima visita dopo uno svuotamento resta lenta (3–7 s, database lento dell'hosting). Il sito visita
 * da solo le sue pagine, piano, così sono sempre pronte.
 *
 * COME
 *     Coda di indirizzi dalla sitemap (prima pagine e articoli, poi il resto, al massimo INFU_RISC_MAX), riempita
 *     ogni 12 ore e dopo ogni svuotamento della cache. Ogni 2 minuti il controllo pianificato visita
 *     INFU_RISC_LOTTO indirizzi, uno alla volta (niente richieste in parallelo: il server non va caricato).
 *     Solo se LiteSpeed Cache è attivo.
 */

defined( 'ABSPATH' ) || exit;

const INFU_RISC_LOTTO = 6;
const INFU_RISC_MAX   = 1200;

add_filter(
	'cron_schedules',
	function ( $s ) {
		$s['infu_2min'] = array( 'interval' => 120, 'display' => 'Ogni 2 minuti (Influencee)' );
		return $s;
	}
);

/** Indirizzi della sitemap di WordPress, in ordine di importanza. */
function infu_risc_indirizzi() {
	$res = wp_remote_get( home_url( '/wp-sitemap.xml' ), array( 'timeout' => 20 ) );
	if ( is_wp_error( $res ) || 200 !== (int) wp_remote_retrieve_response_code( $res ) ) {
		return array();
	}
	preg_match_all( '#<loc>([^<]+)</loc>#', (string) wp_remote_retrieve_body( $res ), $m );
	$mappe = $m[1];
	// prima le sitemap delle pagine del sito, poi articoli, poi il resto (profili creator in fondo)
	usort( $mappe, function ( $a, $b ) {
		$peso = function ( $u ) {
			return false !== strpos( $u, 'influencee' ) ? 0 : ( false !== strpos( $u, '-page' ) ? 1 : ( false !== strpos( $u, '-post-' ) ? 2 : 3 ) );
		};
		return $peso( $a ) - $peso( $b );
	} );
	$tutti = array( home_url( '/' ) );
	foreach ( $mappe as $mappa ) {
		$r = wp_remote_get( html_entity_decode( $mappa ), array( 'timeout' => 20 ) );
		if ( is_wp_error( $r ) ) {
			continue;
		}
		preg_match_all( '#<loc>([^<]+)</loc>#', (string) wp_remote_retrieve_body( $r ), $u );
		foreach ( $u[1] as $url ) {
			$tutti[] = html_entity_decode( $url );
		}
		if ( count( $tutti ) >= INFU_RISC_MAX ) {
			break;
		}
	}
	return array_slice( array_values( array_unique( $tutti ) ), 0, INFU_RISC_MAX );
}

function infu_risc_riempi() {
	$coda = infu_risc_indirizzi();
	if ( $coda ) {
		update_option( 'infu_risc_coda', $coda, false );
		update_option( 'infu_risc_riempita', time(), false );
	}
}

/**
 * Un lotto di visite, una alla volta.
 * 1.3.1 (03/11): con la cache appena svuotata ogni pagina impiegava molti secondi, il lotto superava il minuto e
 * WordPress ne faceva partire un altro sopra (il blocco del cron dura 60 s): le visite si accumulavano e il server
 * rallentava tutto. Ora: un solo lotto alla volta, al massimo 30 secondi, e se una pagina è lenta si ferma 10 minuti.
 */
function infu_risc_lotto() {
	if ( ! defined( 'LSCWP_V' ) ) {
		return; // senza LiteSpeed Cache attivo non serve
	}
	if ( get_transient( 'infu_risc_in_corso' ) || time() < (int) get_option( 'infu_risc_pausa_fino', 0 ) ) {
		return;
	}
	$coda = (array) get_option( 'infu_risc_coda', array() );
	if ( ! $coda ) {
		if ( time() - (int) get_option( 'infu_risc_riempita', 0 ) > 12 * HOUR_IN_SECONDS ) {
			set_transient( 'infu_risc_in_corso', 1, 5 * MINUTE_IN_SECONDS );
			infu_risc_riempi();
			delete_transient( 'infu_risc_in_corso' );
		}
		return;
	}
	set_transient( 'infu_risc_in_corso', 1, 5 * MINUTE_IN_SECONDS );
	$host  = (string) wp_parse_url( home_url(), PHP_URL_HOST );
	$fatti = 0;
	$avvio = microtime( true );
	while ( $coda && $fatti < INFU_RISC_LOTTO && microtime( true ) - $avvio < 30 ) {
		$url = array_shift( $coda );
		if ( (string) wp_parse_url( $url, PHP_URL_HOST ) !== $host ) {
			continue;
		}
		$t = microtime( true );
		wp_remote_get( $url, array( 'timeout' => 15, 'redirection' => 0, 'user-agent' => 'Influencee riscaldamento cache' ) );
		++$fatti;
		if ( microtime( true ) - $t > 8 ) {
			update_option( 'infu_risc_pausa_fino', time() + 10 * MINUTE_IN_SECONDS, false ); // server lento: si riprova dopo
			break;
		}
	}
	update_option( 'infu_risc_coda', $coda, false );
	delete_transient( 'infu_risc_in_corso' );
}
add_action( 'infu_riscalda', 'infu_risc_lotto' );

add_action(
	'init',
	function () {
		if ( ! wp_next_scheduled( 'infu_riscalda' ) ) {
			wp_schedule_event( time() + 60, 'infu_2min', 'infu_riscalda' );
		}
	}
);

/* Dopo uno svuotamento completo della cache (aggiornamenti, LiteSpeed): la coda si riempie al prossimo giro (non
   dentro la richiesta che svuota, per non rallentarla) */
add_action(
	'litespeed_purged_all',
	function () {
		update_option( 'infu_risc_coda', array(), false );
		update_option( 'infu_risc_riempita', 0, false );
	}
);
