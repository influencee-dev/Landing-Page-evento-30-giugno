<?php
/**
 * Influencee: misura temporanea dei tempi di caricamento (messa da Influencee Aggiornamenti, si toglie da sola).
 * Per una richiesta su due registra: tempo di caricamento di ogni plugin, fasi di WordPress, le funzioni più lente
 * agganciate a init/wp/template_redirect/rest_api_init, le chiamate esterne e il numero di query. Nessun dato
 * personale: solo percorso della pagina, tempi e nomi di plugin e funzioni.
 */

defined( 'ABSPATH' ) || exit;

if ( time() > (int) '__SCADENZA__' ) {
	@unlink( __FILE__ ); // phpcs:ignore WordPress.PHP.NoSilencedErrors,WordPress.WP.AlternativeFunctions
	return;
}
if ( ( defined( 'WP_CLI' ) && WP_CLI ) || mt_rand( 0, 1 ) ) { // phpcs:ignore WordPress.WP.AlternativeFunctions
	return;
}

$GLOBALS['infu_m'] = array(
	't0'     => isset( $_SERVER['REQUEST_TIME_FLOAT'] ) ? (float) $_SERVER['REQUEST_TIME_FLOAT'] : microtime( true ),
	'mu'     => microtime( true ),
	'plugin' => array(),
	'fasi'   => array(),
	'cb'     => array(),
	'http'   => array(),
	'_http'  => array(),
);

/** Plugin (cartella), tema o core di un file. */
function infu_m_dove( $file ) {
	$file = wp_normalize_path( (string) $file );
	foreach ( array( 'plugins' => wp_normalize_path( WP_PLUGIN_DIR ), 'mu' => wp_normalize_path( WPMU_PLUGIN_DIR ), 'tema' => wp_normalize_path( get_theme_root() ) ) as $tipo => $dir ) {
		if ( 0 === strpos( $file, $dir . '/' ) ) {
			$resto = substr( $file, strlen( $dir ) + 1 );
			return ( 'plugins' === $tipo ? '' : $tipo . ':' ) . strtok( $resto, '/' );
		}
	}
	return 'core';
}

function infu_m_nome( $cb ) {
	try {
		if ( is_string( $cb ) && false === strpos( $cb, '::' ) ) {
			$r = new ReflectionFunction( $cb );
			return infu_m_dove( $r->getFileName() ) . ' · ' . $cb;
		}
		if ( $cb instanceof Closure ) {
			$r = new ReflectionFunction( $cb );
			return infu_m_dove( $r->getFileName() ) . ' · ' . basename( (string) $r->getFileName() ) . ':' . $r->getStartLine();
		}
		if ( is_string( $cb ) ) {
			$cb = explode( '::', $cb );
		}
		if ( is_array( $cb ) ) {
			$r = new ReflectionMethod( $cb[0], $cb[1] );
			return infu_m_dove( $r->getFileName() ) . ' · ' . ( is_object( $cb[0] ) ? get_class( $cb[0] ) : $cb[0] ) . '::' . $cb[1];
		}
	} catch ( Throwable $e ) {
		return 'sconosciuto';
	}
	return 'sconosciuto';
}

add_action(
	'muplugins_loaded',
	function () {
		$GLOBALS['infu_m']['fasi']['muplugins_loaded'] = microtime( true );
	},
	PHP_INT_MAX
);

add_action(
	'plugin_loaded',
	function ( $file ) {
		static $prima = null;
		$ora   = microtime( true );
		$da    = $prima ? $prima : ( isset( $GLOBALS['infu_m']['fasi']['muplugins_loaded'] ) ? $GLOBALS['infu_m']['fasi']['muplugins_loaded'] : $GLOBALS['infu_m']['mu'] );
		$prima = $ora;
		$GLOBALS['infu_m']['plugin'][ infu_m_dove( $file ) ] = round( ( $ora - $da ) * 1000, 1 );
	}
);

foreach ( array( 'plugins_loaded', 'setup_theme', 'after_setup_theme', 'init', 'wp_loaded', 'parse_request', 'wp', 'template_redirect', 'rest_api_init' ) as $infu_fase ) {
	add_action(
		$infu_fase,
		function () use ( $infu_fase ) {
			if ( ! isset( $GLOBALS['infu_m']['fasi'][ $infu_fase ] ) ) {
				$GLOBALS['infu_m']['fasi'][ $infu_fase ] = microtime( true );
			}
		},
		PHP_INT_MIN
	);
}

/* A fine caricamento dei plugin: ogni funzione agganciata alle fasi principali viene cronometrata */
add_action(
	'plugins_loaded',
	function () {
		global $wp_filter;
		foreach ( array( 'after_setup_theme', 'init', 'wp_loaded', 'parse_request', 'wp', 'template_redirect', 'rest_api_init' ) as $hook ) {
			if ( empty( $wp_filter[ $hook ] ) || ! ( $wp_filter[ $hook ] instanceof WP_Hook ) ) {
				continue;
			}
			foreach ( $wp_filter[ $hook ]->callbacks as $prio => $lista ) {
				foreach ( $lista as $id => $voce ) {
					$orig = $voce['function'];
					$nome = $hook . ' · ' . infu_m_nome( $orig );
					$wp_filter[ $hook ]->callbacks[ $prio ][ $id ]['function'] = function () use ( $orig, $nome ) {
						$t = microtime( true );
						$r = call_user_func_array( $orig, func_get_args() );
						$c = &$GLOBALS['infu_m']['cb'];
						$c[ $nome ] = ( isset( $c[ $nome ] ) ? $c[ $nome ] : 0 ) + ( microtime( true ) - $t ) * 1000;
						return $r;
					};
				}
			}
		}
	},
	PHP_INT_MAX
);

add_filter(
	'pre_http_request',
	function ( $pre, $args, $url ) {
		$GLOBALS['infu_m']['_http'][ $url ] = microtime( true );
		return $pre;
	},
	PHP_INT_MAX,
	3
);

add_action(
	'http_api_debug',
	function ( $risposta, $ctx, $classe, $args, $url ) {
		$m = &$GLOBALS['infu_m'];
		if ( isset( $m['_http'][ $url ] ) ) {
			$host = (string) wp_parse_url( $url, PHP_URL_HOST );
			$m['http'][] = array( $host, round( ( microtime( true ) - $m['_http'][ $url ] ) * 1000 ) );
		}
	},
	10,
	5
);

add_action(
	'shutdown',
	function () {
		global $wpdb;
		$m = $GLOBALS['infu_m'];
		if ( is_admin() || wp_doing_cron() || wp_doing_ajax() ) {
			return;
		}
		$fine = microtime( true );
		$tipo = ( defined( 'REST_REQUEST' ) && REST_REQUEST ) ? 'rest' : ( is_feed() ? 'feed' : 'pagina' );
		$fasi = array( 'php_fino_mu' => round( ( $m['mu'] - $m['t0'] ) * 1000 ) );
		$prec = $m['mu'];
		foreach ( $m['fasi'] as $nome => $t ) {
			$fasi[ $nome ] = round( ( $t - $prec ) * 1000 );
			$prec          = $t;
		}
		$fasi['fino_alla_fine'] = round( ( $fine - $prec ) * 1000 );
		arsort( $m['cb'] );
		$cb = array();
		foreach ( array_slice( $m['cb'], 0, 25, true ) as $k => $v ) {
			if ( $v >= 2 ) {
				$cb[ $k ] = round( $v, 1 );
			}
		}
		$campione = array(
			'quando'  => gmdate( 'c' ),
			'tipo'    => $tipo,
			'pagina'  => strtok( isset( $_SERVER['REQUEST_URI'] ) ? (string) $_SERVER['REQUEST_URI'] : '', '?' ), // phpcs:ignore
			'totale'  => round( ( $fine - $m['t0'] ) * 1000 ),
			'query'   => (int) $wpdb->num_queries,
			'memoria' => round( memory_get_peak_usage() / 1048576, 1 ),
			'plugin'  => $m['plugin'],
			'fasi'    => $fasi,
			'cb'      => $cb,
			'http'    => $m['http'],
		);
		$tutti   = (array) get_option( 'infu_misure', array() );
		$tutti[] = $campione;
		update_option( 'infu_misure', array_slice( $tutti, -40 ), false );
	},
	PHP_INT_MAX
);
