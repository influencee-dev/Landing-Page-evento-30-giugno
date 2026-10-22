<?php
/**
 * Accorgimenti di velocità, tutti spenti finché non li accendi. Valgono solo mentre il plugin è attivo:
 * se lo spegni, il sito torna come prima. Se LiteSpeed Cache fa già la stessa cosa, lascia spento qui.
 */

defined( 'ABSPATH' ) || exit;

function infz_velocita_voci() {
	return array(
		'emoji'      => array( 'Togli lo script delle emoji di WordPress', 'Un file in meno su ogni pagina; le emoji si vedono lo stesso con i caratteri del telefono o del computer.' ),
		'embed'      => array( 'Togli lo script per incorporare articoli di altri siti WordPress (oEmbed)', 'Non serve se non incolli link di altri siti WordPress negli articoli. YouTube e Instagram continuano a funzionare.' ),
		'xmlrpc'     => array( 'Chiudi XML-RPC', 'Vecchio accesso remoto, bersaglio di attacchi che rallentano il server. Chiudilo se non usi Jetpack o l’app WordPress.' ),
		'heartbeat'  => array( 'Riduci il «battito» di WordPress (Heartbeat)', 'Nel sito pubblico lo spegne, in amministrazione lo porta a ogni 60 secondi: meno chiamate ad admin-ajax.php.' ),
		'dashicons'  => array( 'Non caricare le icone dell’amministrazione ai visitatori', 'Le icone Dashicons servono solo a chi è dentro WordPress.' ),
		'revisioni'  => array( 'Tieni al massimo 5 revisioni per contenuto', 'Le revisioni non crescono più senza limite.' ),
		'pingback'   => array( 'Niente pingback verso i propri articoli', 'Evita le notifiche inutili quando un articolo linka un altro articolo del sito.' ),
	);
}

function infz_velocita_impostazioni() {
	$s = (array) get_option( 'infz_velocita', array() );
	$o = array();
	foreach ( array_keys( infz_velocita_voci() ) as $k ) {
		$o[ $k ] = ! empty( $s[ $k ] );
	}
	return $o;
}

add_action(
	'init',
	function () {
		$v = infz_velocita_impostazioni();
		if ( $v['emoji'] ) {
			remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
			remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
			remove_action( 'wp_print_styles', 'print_emoji_styles' );
			remove_action( 'admin_print_styles', 'print_emoji_styles' );
			remove_action( 'wp_enqueue_scripts', 'wp_enqueue_emoji_styles' );
			remove_action( 'admin_enqueue_scripts', 'wp_enqueue_emoji_styles' );
			remove_filter( 'the_content_feed', 'wp_staticize_emoji' );
			remove_filter( 'comment_text_rss', 'wp_staticize_emoji' );
			remove_filter( 'wp_mail', 'wp_staticize_emoji_for_email' );
			add_filter( 'emoji_svg_url', '__return_false' );
		}
		if ( $v['embed'] ) {
			remove_action( 'wp_head', 'wp_oembed_add_discovery_links' );
			remove_action( 'wp_head', 'wp_oembed_add_host_js' );
			add_action( 'wp_footer', function () { wp_deregister_script( 'wp-embed' ); } );
		}
		if ( $v['xmlrpc'] ) {
			add_filter( 'xmlrpc_enabled', '__return_false' );
			remove_action( 'wp_head', 'rsd_link' );
			add_filter( 'wp_headers', function ( $h ) { unset( $h['X-Pingback'] ); return $h; } );
		}
		if ( $v['revisioni'] ) {
			add_filter( 'wp_revisions_to_keep', function ( $n ) { return ( $n < 0 || $n > 5 ) ? 5 : $n; } );
		}
	}
);

add_action(
	'wp_enqueue_scripts',
	function () {
		$v = infz_velocita_impostazioni();
		if ( $v['heartbeat'] ) {
			wp_deregister_script( 'heartbeat' );
		}
		if ( $v['dashicons'] && ! is_user_logged_in() ) {
			wp_dequeue_style( 'dashicons' );
		}
	},
	100
);

add_filter(
	'heartbeat_settings',
	function ( $s ) {
		$v = infz_velocita_impostazioni();
		if ( $v['heartbeat'] ) {
			$s['interval'] = 60;
		}
		return $s;
	}
);

add_action(
	'pre_ping',
	function ( &$links ) {
		$v = infz_velocita_impostazioni();
		if ( ! $v['pingback'] ) {
			return;
		}
		$casa = home_url();
		foreach ( $links as $i => $l ) {
			if ( 0 === strpos( $l, $casa ) ) {
				unset( $links[ $i ] );
			}
		}
	}
);
