<?php
/**
 * Plugin Name:       Influencee Claude Bridge
 * Description:       Accesso di Claude al sito (REST claude/v1): stato, plugin (installa, attiva, disattiva), opzioni, file, database, cache. Chiave propria nell'intestazione X-Claude-Key, generata e revocata da Strumenti → Claude Bridge. Comandi shell e scrittura nel database spenti finché non li accendi tu.
 * Version:           2.0.0
 * Requires at least: 6.0
 * Requires PHP:      7.4
 * Author:            Partidea SRL
 * License:           GPL-2.0-or-later
 * Text Domain:       influencee-claude-bridge
 */

defined( 'ABSPATH' ) || exit;

define( 'ICB_VERSION', '2.0.0' );
define( 'ICB_NS', 'claude/v1' );

/* ════════════════════════════════════════════════════════════════════
   1. Intestazione Authorization
   Su questo hosting non arriva a PHP: la recuperiamo dove il server la
   lascia, così funzionano anche le password per le applicazioni di WordPress.
   ════════════════════════════════════════════════════════════════════ */
function icb_fix_auth_header() {
	if ( ! empty( $_SERVER['HTTP_AUTHORIZATION'] ) || ! empty( $_SERVER['PHP_AUTH_USER'] ) ) {
		return;
	}
	$h = '';
	if ( ! empty( $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ) ) {
		$h = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
	} elseif ( function_exists( 'getallheaders' ) ) {
		foreach ( (array) getallheaders() as $k => $v ) {
			if ( 'authorization' === strtolower( $k ) ) {
				$h = $v;
				break;
			}
		}
	}
	if ( $h ) {
		$_SERVER['HTTP_AUTHORIZATION'] = $h;
	}
}
icb_fix_auth_header();

const ICB_HT_MARK = '# BEGIN Influencee Claude Bridge';

/** Riga di .htaccess che passa l'intestazione Authorization a PHP (in cima, prima del blocco di WordPress). */
function icb_htaccess_status() {
	$file = ABSPATH . '.htaccess';
	if ( ! file_exists( $file ) ) {
		return 'manca';
	}
	$c = (string) file_get_contents( $file );
	if ( false !== strpos( $c, 'E=HTTP_AUTHORIZATION' ) ) {
		return 'ok';
	}
	return is_writable( $file ) ? 'da-aggiungere' : 'non-scrivibile';
}

function icb_htaccess_add() {
	$file = ABSPATH . '.htaccess';
	if ( 'da-aggiungere' !== icb_htaccess_status() ) {
		return icb_htaccess_status();
	}
	$c     = (string) file_get_contents( $file );
	$block = ICB_HT_MARK . "\n<IfModule mod_rewrite.c>\nRewriteEngine On\nRewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]\n</IfModule>\n# END Influencee Claude Bridge\n\n";
	copy( $file, $file . '.bak-claude-bridge' );
	return false !== file_put_contents( $file, $block . $c, LOCK_EX ) ? 'ok' : 'errore';
}

register_activation_hook( __FILE__, 'icb_htaccess_add' );

/* ════════════════════════════════════════════════════════════════════
   2. Impostazioni, chiave, registro
   ════════════════════════════════════════════════════════════════════ */
function icb_settings() {
	return wp_parse_args( (array) get_option( 'icb_settings', array() ), array( 'exec' => 0, 'db_write' => 0, 'files_write' => 1 ) );
}

function icb_log( $route, $ok, $detail = '' ) {
	$log   = (array) get_option( 'icb_log', array() );
	$log[] = array( 't' => gmdate( 'Y-m-d H:i:s' ), 'r' => $route, 'ok' => $ok ? 1 : 0, 'd' => mb_substr( (string) $detail, 0, 200 ) );
	update_option( 'icb_log', array_slice( $log, -100 ), false );
}

/** Chiave valida in X-Claude-Key? Allora la richiesta lavora come l'amministratore che l'ha creata. */
function icb_check_key( WP_REST_Request $req ) {
	$key  = (string) $req->get_header( 'x_claude_key' );
	$hash = (string) get_option( 'icb_key_hash', '' );
	if ( '' === $key || '' === $hash ) {
		return false;
	}
	$ip   = isset( $_SERVER['REMOTE_ADDR'] ) ? preg_replace( '/[^0-9a-f.:]/i', '', $_SERVER['REMOTE_ADDR'] ) : '';
	$fail = 'icb_fail_' . md5( $ip );
	if ( (int) get_transient( $fail ) >= 20 ) {
		return false; // troppi tentativi sbagliati: 10 minuti di pausa
	}
	if ( ! hash_equals( $hash, hash( 'sha256', $key ) ) ) {
		set_transient( $fail, (int) get_transient( $fail ) + 1, 10 * MINUTE_IN_SECONDS );
		return false;
	}
	$uid = (int) get_option( 'icb_key_user', 0 );
	if ( ! $uid || ! user_can( $uid, 'manage_options' ) ) {
		return false;
	}
	wp_set_current_user( $uid );
	return true;
}

function icb_permission( WP_REST_Request $req ) {
	if ( icb_check_key( $req ) || current_user_can( 'manage_options' ) ) {
		return true;
	}
	return new WP_Error( 'rest_forbidden', 'Serve la chiave di Claude Bridge (intestazione X-Claude-Key) o un amministratore.', array( 'status' => 401 ) );
}

/* ════════════════════════════════════════════════════════════════════
   3. Rotte REST
   ════════════════════════════════════════════════════════════════════ */
add_action(
	'rest_api_init',
	function () {
		$r = function ( $path, $methods, $cb ) {
			register_rest_route(
				ICB_NS,
				$path,
				array(
					'methods'             => $methods,
					'permission_callback' => 'icb_permission',
					'callback'            => function ( WP_REST_Request $req ) use ( $cb, $path ) {
						try {
							$out = $cb( $req );
						} catch ( Throwable $e ) {
							$out = new WP_Error( 'icb_errore', $e->getMessage(), array( 'status' => 500 ) );
						}
						icb_log( $path, ! is_wp_error( $out ), is_wp_error( $out ) ? $out->get_error_message() : '' );
						return $out;
					},
				)
			);
		};
		$r( '/info', 'GET', 'icb_info' );
		$r( '/plugins', 'GET', 'icb_plugins' );
		$r( '/plugins/activate', 'POST', 'icb_plugin_activate' );
		$r( '/plugins/deactivate', 'POST', 'icb_plugin_deactivate' );
		$r( '/plugin/install', 'POST', 'icb_plugin_install' );
		$r( '/options/(?P<key>[\w-]+)', 'GET', 'icb_option_get' );
		$r( '/options', 'POST', 'icb_option_set' );
		$r( '/files/read', 'POST', 'icb_file_read' );
		$r( '/files/list', 'POST', 'icb_file_list' );
		$r( '/files/write', 'POST', 'icb_file_write' );
		$r( '/files/delete', 'POST', 'icb_file_delete' );
		$r( '/db/query', 'POST', 'icb_db_query' );
		$r( '/cache/flush', 'POST', 'icb_cache_flush' );
		$r( '/exec', 'POST', 'icb_exec' );
		$r( '/htaccess', 'POST', function () { return array( 'htaccess' => icb_htaccess_add() ); } );
		$r( '/log', 'GET', function () { return array_reverse( (array) get_option( 'icb_log', array() ) ); } );
	}
);

function icb_need_admin_files() {
	require_once ABSPATH . 'wp-admin/includes/plugin.php';
	require_once ABSPATH . 'wp-admin/includes/file.php';
	require_once ABSPATH . 'wp-admin/includes/misc.php';
}

function icb_info() {
	global $wp_version;
	icb_need_admin_files();
	$s = icb_settings();
	return array(
		'bridge'      => ICB_VERSION,
		'wordpress'   => $wp_version,
		'php'         => PHP_VERSION,
		'tema'        => get_stylesheet(),
		'utente'      => wp_get_current_user()->user_login,
		'htaccess'    => icb_htaccess_status(),
		'auth_header' => ! empty( $_SERVER['HTTP_AUTHORIZATION'] ),
		'fs_method'   => get_filesystem_method(),
		'upload_max'  => ini_get( 'upload_max_filesize' ) . ' / post ' . ini_get( 'post_max_size' ),
		'permessi'    => array( 'exec' => (bool) $s['exec'], 'db_write' => (bool) $s['db_write'], 'files_write' => (bool) $s['files_write'] ),
		'plugin'      => icb_plugins(),
	);
}

function icb_plugins() {
	icb_need_admin_files();
	$out = array();
	foreach ( get_plugins() as $file => $p ) {
		$out[] = array( 'file' => $file, 'nome' => $p['Name'], 'versione' => $p['Version'], 'attivo' => is_plugin_active( $file ) );
	}
	return $out;
}

function icb_plugin_file( WP_REST_Request $req ) {
	icb_need_admin_files();
	$f = (string) $req->get_param( 'plugin' );
	if ( '' === $f || ! array_key_exists( $f, get_plugins() ) ) {
		return new WP_Error( 'icb_plugin', 'Plugin non trovato: usa il campo "file" di /plugins (es. cartella/file.php).', array( 'status' => 404 ) );
	}
	return $f;
}

function icb_plugin_activate( WP_REST_Request $req ) {
	$f = icb_plugin_file( $req );
	if ( is_wp_error( $f ) ) {
		return $f;
	}
	$r = activate_plugin( $f );
	return is_wp_error( $r ) ? $r : array( 'attivo' => $f );
}

function icb_plugin_deactivate( WP_REST_Request $req ) {
	$f = icb_plugin_file( $req );
	if ( is_wp_error( $f ) ) {
		return $f;
	}
	if ( plugin_basename( __FILE__ ) === $f ) {
		return new WP_Error( 'icb_plugin', 'Il bridge non si spegne da solo: fallo da Plugin in WordPress.', array( 'status' => 400 ) );
	}
	deactivate_plugins( $f );
	return array( 'disattivato' => $f );
}

/** Installa o aggiorna un plugin da zip (base64 + sha256). Se esiste già lo sostituisce, se era attivo resta attivo. */
function icb_plugin_install( WP_REST_Request $req ) {
	icb_need_admin_files();
	require_once ABSPATH . 'wp-admin/includes/class-wp-upgrader.php';
	$zip = base64_decode( (string) $req->get_param( 'zip' ), true );
	if ( ! $zip ) {
		return new WP_Error( 'icb_zip', 'Campo "zip" mancante o non in base64.', array( 'status' => 400 ) );
	}
	if ( ! hash_equals( strtolower( (string) $req->get_param( 'sha256' ) ), hash( 'sha256', $zip ) ) ) {
		return new WP_Error( 'icb_zip', 'sha256 non corrisponde: zip arrivato incompleto.', array( 'status' => 400 ) );
	}
	if ( ! WP_Filesystem() ) {
		return new WP_Error( 'icb_fs', 'WordPress non può scrivere i file direttamente (FS_METHOD diverso da direct).', array( 'status' => 500 ) );
	}
	$tmp = wp_tempnam( 'claude-bridge.zip' );
	file_put_contents( $tmp, $zip );
	$skin     = new WP_Ajax_Upgrader_Skin();
	$upgrader = new Plugin_Upgrader( $skin );
	$res      = $upgrader->install( $tmp, array( 'overwrite_package' => true ) );
	@unlink( $tmp );
	if ( is_wp_error( $res ) || ! $res ) {
		$err = is_wp_error( $res ) ? $res : $skin->get_errors();
		return new WP_Error( 'icb_install', is_wp_error( $err ) && $err->has_errors() ? $err->get_error_message() : 'Installazione non riuscita.', array( 'status' => 500, 'messaggi' => $skin->get_upgrade_messages() ) );
	}
	$file = $upgrader->plugin_info();
	if ( $file && $req->get_param( 'activate' ) && ! is_plugin_active( $file ) ) {
		$a = activate_plugin( $file );
		if ( is_wp_error( $a ) ) {
			return $a;
		}
	}
	wp_clean_plugins_cache();
	$all = get_plugins();
	return array( 'plugin' => $file, 'versione' => $file && isset( $all[ $file ] ) ? $all[ $file ]['Version'] : null, 'attivo' => $file ? is_plugin_active( $file ) : false );
}

/** Opzioni che non si toccano da qui: indirizzo del sito, registrazioni, chiave del bridge. */
function icb_option_blocked( $k, $write ) {
	if ( 0 === strpos( $k, 'icb_key' ) ) {
		return true;
	}
	return $write && in_array( $k, array( 'siteurl', 'home', 'admin_email', 'users_can_register', 'default_role', 'active_plugins', 'icb_settings' ), true );
}

function icb_option_get( WP_REST_Request $req ) {
	$k = (string) $req['key'];
	if ( icb_option_blocked( $k, false ) ) {
		return new WP_Error( 'icb_option', 'Opzione riservata.', array( 'status' => 403 ) );
	}
	return array( 'key' => $k, 'value' => get_option( $k, null ) );
}

function icb_option_set( WP_REST_Request $req ) {
	$k = (string) $req->get_param( 'key' );
	if ( '' === $k || icb_option_blocked( $k, true ) ) {
		return new WP_Error( 'icb_option', 'Opzione mancante o riservata.', array( 'status' => 403 ) );
	}
	update_option( $k, $req->get_param( 'value' ) );
	return array( 'key' => $k, 'value' => get_option( $k ) );
}

/** Percorso dentro la cartella di WordPress; wp-config.php escluso (contiene le password del database). */
function icb_path( $rel, $must_exist = true ) {
	$rel  = ltrim( str_replace( '\\', '/', (string) $rel ), '/' );
	$root = realpath( ABSPATH );
	$full = $root . '/' . $rel;
	$real = $must_exist ? realpath( $full ) : ( realpath( dirname( $full ) ) ? realpath( dirname( $full ) ) . '/' . basename( $full ) : false );
	if ( ! $real || ( $real !== $root && 0 !== strpos( $real, $root . '/' ) ) ) {
		return new WP_Error( 'icb_path', 'Percorso fuori dal sito o inesistente.', array( 'status' => 400 ) );
	}
	if ( 'wp-config.php' === basename( $real ) ) {
		return new WP_Error( 'icb_path', 'wp-config.php è escluso.', array( 'status' => 403 ) );
	}
	return $real;
}

function icb_file_read( WP_REST_Request $req ) {
	$p = icb_path( $req->get_param( 'path' ) );
	if ( is_wp_error( $p ) ) {
		return $p;
	}
	if ( ! is_file( $p ) || filesize( $p ) > 5 * MB_IN_BYTES ) {
		return new WP_Error( 'icb_file', 'Non è un file o supera 5 MB.', array( 'status' => 400 ) );
	}
	$c = (string) file_get_contents( $p );
	$b = ! preg_match( '//u', $c );
	return array( 'path' => $req->get_param( 'path' ), 'size' => strlen( $c ), 'base64' => $b, 'content' => $b ? base64_encode( $c ) : $c );
}

function icb_file_list( WP_REST_Request $req ) {
	$p = icb_path( $req->get_param( 'path' ) ? $req->get_param( 'path' ) : '' );
	if ( is_wp_error( $p ) ) {
		return $p;
	}
	if ( ! is_dir( $p ) ) {
		return new WP_Error( 'icb_file', 'Non è una cartella.', array( 'status' => 400 ) );
	}
	$out = array();
	foreach ( array_slice( scandir( $p ), 2, 1000 ) as $n ) {
		$f     = $p . '/' . $n;
		$out[] = array( 'nome' => $n, 'dir' => is_dir( $f ), 'size' => is_file( $f ) ? filesize( $f ) : null, 'modificato' => gmdate( 'Y-m-d H:i', filemtime( $f ) ) );
	}
	return $out;
}

function icb_file_write( WP_REST_Request $req ) {
	if ( ! icb_settings()['files_write'] ) {
		return new WP_Error( 'icb_off', 'Scrittura dei file spenta in Strumenti → Claude Bridge.', array( 'status' => 403 ) );
	}
	$p = icb_path( $req->get_param( 'path' ), false );
	if ( is_wp_error( $p ) ) {
		return $p;
	}
	$c = (string) $req->get_param( 'content' );
	if ( $req->get_param( 'base64' ) ) {
		$c = base64_decode( $c, true );
		if ( false === $c ) {
			return new WP_Error( 'icb_file', 'Contenuto base64 non valido.', array( 'status' => 400 ) );
		}
	}
	if ( file_exists( $p ) ) {
		copy( $p, $p . '.bak-claude-bridge' ); // copia della versione precedente
	}
	if ( false === file_put_contents( $p, $c, LOCK_EX ) ) {
		return new WP_Error( 'icb_file', 'Scrittura non riuscita (permessi?).', array( 'status' => 500 ) );
	}
	return array( 'path' => $req->get_param( 'path' ), 'size' => strlen( $c ), 'backup' => file_exists( $p . '.bak-claude-bridge' ) );
}

function icb_file_delete( WP_REST_Request $req ) {
	if ( ! icb_settings()['files_write'] ) {
		return new WP_Error( 'icb_off', 'Scrittura dei file spenta in Strumenti → Claude Bridge.', array( 'status' => 403 ) );
	}
	$p = icb_path( $req->get_param( 'path' ) );
	if ( is_wp_error( $p ) ) {
		return $p;
	}
	if ( ! is_file( $p ) ) {
		return new WP_Error( 'icb_file', 'Si cancellano solo file singoli.', array( 'status' => 400 ) );
	}
	return array( 'cancellato' => (bool) unlink( $p ) );
}

/** SELECT/SHOW/DESCRIBE/EXPLAIN sempre; il resto solo se acceso nelle impostazioni. */
function icb_db_query( WP_REST_Request $req ) {
	global $wpdb;
	$sql  = trim( (string) $req->get_param( 'sql' ) );
	$read = (bool) preg_match( '/^(select|show|describe|desc|explain)\b/i', $sql );
	if ( '' === $sql ) {
		return new WP_Error( 'icb_db', 'Campo "sql" mancante.', array( 'status' => 400 ) );
	}
	if ( ! $read && ! icb_settings()['db_write'] ) {
		return new WP_Error( 'icb_off', 'Le query che modificano il database sono spente in Strumenti → Claude Bridge.', array( 'status' => 403 ) );
	}
	if ( $read ) {
		$rows = $wpdb->get_results( $sql, ARRAY_A );
		return $wpdb->last_error ? new WP_Error( 'icb_db', $wpdb->last_error, array( 'status' => 400 ) ) : array( 'righe' => count( (array) $rows ), 'dati' => array_slice( (array) $rows, 0, 500 ), 'prefisso' => $wpdb->prefix );
	}
	$n = $wpdb->query( $sql );
	return $wpdb->last_error ? new WP_Error( 'icb_db', $wpdb->last_error, array( 'status' => 400 ) ) : array( 'righe_modificate' => $n );
}

function icb_cache_flush() {
	do_action( 'litespeed_purge_all' );
	wp_cache_flush();
	return array( 'svuotata' => true, 'litespeed' => (bool) has_action( 'litespeed_purge_all' ) );
}

function icb_exec( WP_REST_Request $req ) {
	if ( ! icb_settings()['exec'] ) {
		return new WP_Error( 'icb_off', 'I comandi shell sono spenti in Strumenti → Claude Bridge.', array( 'status' => 403 ) );
	}
	if ( ! function_exists( 'exec' ) ) {
		return new WP_Error( 'icb_exec', 'exec() è disabilitata su questo hosting.', array( 'status' => 500 ) );
	}
	$out = array();
	$code = 0;
	exec( 'cd ' . escapeshellarg( ABSPATH ) . ' && ' . (string) $req->get_param( 'cmd' ) . ' 2>&1', $out, $code );
	return array( 'codice' => $code, 'output' => implode( "\n", array_slice( $out, -500 ) ) );
}

/* ════════════════════════════════════════════════════════════════════
   4. Pagina Strumenti → Claude Bridge
   ════════════════════════════════════════════════════════════════════ */
add_action(
	'admin_menu',
	function () {
		add_management_page( 'Claude Bridge', 'Claude Bridge', 'manage_options', 'claude-bridge', 'icb_admin_page' );
	}
);

add_action(
	'admin_post_icb_azione',
	function () {
		if ( ! current_user_can( 'manage_options' ) || ! check_admin_referer( 'icb_azione' ) ) {
			wp_die( 'Non consentito.' );
		}
		$do   = isset( $_POST['do'] ) ? sanitize_key( $_POST['do'] ) : '';
		$back = admin_url( 'tools.php?page=claude-bridge' );
		if ( 'crea' === $do ) {
			$key = 'icb_' . wp_generate_password( 40, false, false );
			update_option( 'icb_key_hash', hash( 'sha256', $key ), false );
			update_option( 'icb_key_user', get_current_user_id(), false );
			update_option( 'icb_key_creata', gmdate( 'Y-m-d H:i' ), false );
			set_transient( 'icb_key_show_' . get_current_user_id(), $key, 300 ); // mostrata una volta sola
		} elseif ( 'revoca' === $do ) {
			delete_option( 'icb_key_hash' );
			delete_option( 'icb_key_user' );
			delete_option( 'icb_key_creata' );
		} elseif ( 'impostazioni' === $do ) {
			update_option(
				'icb_settings',
				array(
					'exec'        => empty( $_POST['exec'] ) ? 0 : 1,
					'db_write'    => empty( $_POST['db_write'] ) ? 0 : 1,
					'files_write' => empty( $_POST['files_write'] ) ? 0 : 1,
				)
			);
		} elseif ( 'htaccess' === $do ) {
			icb_htaccess_add();
		}
		wp_safe_redirect( $back );
		exit;
	}
);

function icb_admin_page() {
	$s     = icb_settings();
	$show  = get_transient( 'icb_key_show_' . get_current_user_id() );
	$ht    = icb_htaccess_status();
	$form  = function ( $do, $label, $class = 'button' ) {
		echo '<form method="post" action="' . esc_url( admin_url( 'admin-post.php' ) ) . '" style="display:inline-block;margin-right:8px">';
		wp_nonce_field( 'icb_azione' );
		echo '<input type="hidden" name="action" value="icb_azione"><input type="hidden" name="do" value="' . esc_attr( $do ) . '"><button class="' . esc_attr( $class ) . '">' . esc_html( $label ) . '</button></form>';
	};
	if ( $show ) {
		delete_transient( 'icb_key_show_' . get_current_user_id() );
	}
	?>
	<div class="wrap">
		<h1>Claude Bridge <?php echo esc_html( ICB_VERSION ); ?></h1>
		<p>Accesso di Claude al sito tramite <code>/wp-json/<?php echo esc_html( ICB_NS ); ?>/</code>. Ogni chiamata è registrata qui sotto.</p>

		<h2>Chiave</h2>
		<?php if ( $show ) : ?>
			<div class="notice notice-success"><p><b>Copia ora la chiave, non verrà più mostrata:</b></p>
			<p><input type="text" readonly value="<?php echo esc_attr( $show ); ?>" style="width:100%;max-width:560px;font-family:monospace" onclick="this.select()"></p>
			<p>In Claude Code: impostazioni dell'ambiente → <b>Segreti di rete</b> → sito <code>influencee.it</code>, percorso <code>/wp-json/</code>, intestazione <code>X-Claude-Key</code>, valore = la chiave. Poi apri una sessione nuova.</p></div>
		<?php endif; ?>
		<p><?php echo get_option( 'icb_key_hash' ) ? '🟢 Chiave attiva, creata il ' . esc_html( get_option( 'icb_key_creata' ) ) . ' UTC da ' . esc_html( get_userdata( (int) get_option( 'icb_key_user' ) ) ? get_userdata( (int) get_option( 'icb_key_user' ) )->user_login : '?' ) : '⚪ Nessuna chiave: Claude non può entrare (salvo con una password per le applicazioni).'; ?></p>
		<?php
		$form( 'crea', get_option( 'icb_key_hash' ) ? 'Crea una chiave nuova (sostituisce quella attuale)' : 'Crea la chiave', 'button button-primary' );
		if ( get_option( 'icb_key_hash' ) ) {
			$form( 'revoca', 'Revoca la chiave' );
		}
		?>

		<h2>Intestazione Authorization</h2>
		<p>
		<?php
		$txt = array(
			'ok'             => '🟢 La regola in .htaccess c’è: funzionano anche le password per le applicazioni.',
			'da-aggiungere'  => '🟠 Manca la regola in .htaccess: le password per le applicazioni non arrivano a WordPress.',
			'non-scrivibile' => '🔴 Manca la regola e .htaccess non è scrivibile: va aggiunta dal file manager dell’hosting.',
			'manca'          => '🔴 Il file .htaccess non esiste.',
		);
		echo esc_html( $txt[ $ht ] );
		?>
		</p>
		<?php if ( 'da-aggiungere' === $ht ) { $form( 'htaccess', 'Aggiungi la regola (copia di sicurezza: .htaccess.bak-claude-bridge)' ); } ?>

		<h2>Permessi</h2>
		<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
			<?php wp_nonce_field( 'icb_azione' ); ?>
			<input type="hidden" name="action" value="icb_azione"><input type="hidden" name="do" value="impostazioni">
			<p><label><input type="checkbox" name="files_write" value="1" <?php checked( $s['files_write'] ); ?>> Scrivere e cancellare file del sito (wp-config.php escluso; copia di sicurezza a ogni modifica)</label></p>
			<p><label><input type="checkbox" name="db_write" value="1" <?php checked( $s['db_write'] ); ?>> Query che modificano il database (la lettura è sempre permessa)</label></p>
			<p><label><input type="checkbox" name="exec" value="1" <?php checked( $s['exec'] ); ?>> <b>Comandi shell sul server</b> (il più potente: accendilo solo quando serve)</label></p>
			<p><button class="button">Salva i permessi</button></p>
		</form>
		<p class="description">Installare, attivare e disattivare plugin, leggere opzioni e file, svuotare la cache: sempre permessi a chi ha la chiave.</p>

		<h2>Ultime chiamate</h2>
		<table class="widefat striped" style="max-width:900px"><thead><tr><th>Quando (UTC)</th><th>Chiamata</th><th>Esito</th></tr></thead><tbody>
		<?php foreach ( array_reverse( (array) get_option( 'icb_log', array() ) ) as $l ) : ?>
			<tr><td><?php echo esc_html( $l['t'] ); ?></td><td><code><?php echo esc_html( $l['r'] ); ?></code></td><td><?php echo $l['ok'] ? '✅' : '❌ ' . esc_html( $l['d'] ); ?></td></tr>
		<?php endforeach; ?>
		</tbody></table>
	</div>
	<?php
}
