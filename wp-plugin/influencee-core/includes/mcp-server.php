<?php
/**
 * Server MCP del Core: Claude gestisce il sito senza plugin esterni (MCP Adapter) e senza password per le applicazioni.
 *
 * - Indirizzo MCP:   POST /wp-json/influencee/v1/mcp   (JSON-RPC 2.0, trasporto HTTP «streamable», risposte JSON)
 * - Caricamento zip: POST /wp-json/influencee/v1/plugin (corpo = zip, intestazione X-Sha256): un file da 2 MB non può
 *   viaggiare come argomento di uno strumento MCP.
 * - Accesso: intestazione X-Influencee-Key con la chiave creata in Influencee → Impostazioni (il server non la toglie,
 *   a differenza di Authorization). Si salva solo l'impronta; 20 chiavi sbagliate dallo stesso indirizzo = 10 minuti di
 *   blocco. Funziona anche per un amministratore collegato.
 * - Con la chiave giusta le azioni girano come l'amministratore che l'ha creata, e finiscono nel registro del Core.
 */

defined( 'ABSPATH' ) || exit;

const INFT_MCP_HEADER = 'X-Influencee-Key';

function inft_mcp_key_hash( $key ) {
	return hash_hmac( 'sha256', (string) $key, wp_salt( 'auth' ) );
}

/** La richiesta porta la chiave giusta? (imposta l'utente che ha creato la chiave) */
function inft_mcp_key_ok( WP_REST_Request $req ) {
	$key  = (string) $req->get_header( 'x_influencee_key' );
	$hash = (string) get_option( 'inft_mcp_key_hash', '' );
	if ( '' === $key || '' === $hash ) {
		return false;
	}
	$ip   = isset( $_SERVER['REMOTE_ADDR'] ) ? (string) $_SERVER['REMOTE_ADDR'] : '';
	$lock = 'inft_mcpk_' . md5( $ip );
	if ( (int) get_transient( $lock ) >= 20 ) {
		return false;
	}
	if ( ! hash_equals( $hash, inft_mcp_key_hash( $key ) ) ) {
		set_transient( $lock, (int) get_transient( $lock ) + 1, 10 * MINUTE_IN_SECONDS );
		return false;
	}
	$user = (int) get_option( 'inft_mcp_key_user', 0 );
	if ( ! $user || ! user_can( $user, 'manage_options' ) ) {
		return false; // l'utente che l'ha creata non è più amministratore: chiave inutilizzabile
	}
	wp_set_current_user( $user );
	return true;
}

function inft_mcp_permesso( WP_REST_Request $req ) {
	if ( inft_mcp_key_ok( $req ) || current_user_can( 'manage_options' ) ) {
		return true;
	}
	return new WP_Error( 'inft_mcp_chiave', 'Serve la chiave di Influencee (intestazione ' . INFT_MCP_HEADER . ') o un amministratore.', array( 'status' => 401 ) );
}

/** Le risposte del server MCP non vanno mai in cache. */
function inft_mcp_nocache() {
	nocache_headers();
	do_action( 'litespeed_control_set_nocache', 'influencee mcp' );
}

/* ─── Strumenti ─── */

/** Impostazioni che Claude può cambiare, con il loro tipo. */
function inft_mcp_impostazioni_ammesse() {
	return array(
		'tema'             => array( 'off', 'plugin', 'tutto' ),
		'articles'         => array( 'off', 'lista', 'tutti' ),
		'groups'           => 'gruppi',
		'off'              => 'percorsi',
		'on'               => 'percorsi',
		'redirects'        => 'bool',
		'redirect_vecchie' => 'bool',
		'creators'         => 'bool',
		'profiles'         => 'bool',
		'privacy'          => 'bool',
		'annunci'          => 'bool',
		'annunci_wpjm'     => 'bool',
		'annunci_email'    => 'bool',
		'annunci_vecchie'  => 'bool',
		'annunci_feed'     => 'https',
		'annunci_endpoint' => 'https',
		'ga4_on'           => 'bool',
		'ga4_banner'       => 'bool',
		'ga4_id'           => 'ga4',
	);
}

function inft_mcp_imposta( $in ) {
	if ( empty( $in['conferma'] ) ) {
		return new WP_Error( 'inft_conferma', 'Serve conferma: true.' );
	}
	$nuove = isset( $in['valori'] ) && is_array( $in['valori'] ) ? $in['valori'] : array();
	$ok    = inft_mcp_impostazioni_ammesse();
	$cur   = get_option( 'inft_settings', array() );
	$cur   = is_array( $cur ) ? $cur : array();
	$fatte = array();
	foreach ( $nuove as $k => $v ) {
		if ( ! isset( $ok[ $k ] ) ) {
			return new WP_Error( 'inft_chiave', 'Impostazione non modificabile da qui: ' . $k );
		}
		$t = $ok[ $k ];
		if ( is_array( $t ) ) {
			if ( ! in_array( $v, $t, true ) ) {
				return new WP_Error( 'inft_valore', $k . ' accetta solo: ' . implode( ', ', $t ) );
			}
		} elseif ( 'bool' === $t ) {
			$v = $v ? 1 : 0;
		} elseif ( 'gruppi' === $t ) {
			$g = is_array( $v ) ? $v : array();
			$v = array();
			foreach ( array( 'tool', 'nuova', 'sostituzione' ) as $n ) {
				$v[ $n ] = empty( $g[ $n ] ) ? 0 : 1;
			}
		} elseif ( 'percorsi' === $t ) {
			$v = inft_known_paths( is_array( $v ) ? implode( "\n", $v ) : (string) $v );
		} elseif ( 'https' === $t ) {
			$v = esc_url_raw( trim( (string) $v ) );
			if ( '' !== $v && 0 !== strpos( $v, 'https://' ) ) {
				return new WP_Error( 'inft_valore', $k . ' deve iniziare con https://' );
			}
		} elseif ( 'ga4' === $t ) {
			$v = strtoupper( trim( (string) $v ) );
			if ( ! preg_match( '/^G-[A-Z0-9]{4,15}$/', $v ) ) {
				return new WP_Error( 'inft_valore', 'ID GA4 non valido.' );
			}
		}
		$cur[ $k ]   = $v;
		$fatte[ $k ] = $v;
	}
	// scrittura diretta: il filtro del modulo azzererebbe le caselle non inviate (pensato per la pagina delle impostazioni)
	remove_all_filters( 'sanitize_option_inft_settings' );
	update_option( 'inft_settings', $cur );
	inft_purge_cache();
	return array( 'cambiate' => $fatte, 'cache' => 'svuotata' );
}

function inft_mcp_plugin_elenco() {
	require_once ABSPATH . 'wp-admin/includes/plugin.php';
	$out = array();
	foreach ( get_plugins() as $file => $p ) {
		$out[] = array( 'file' => $file, 'nome' => $p['Name'], 'versione' => $p['Version'], 'attivo' => is_plugin_active( $file ) );
	}
	return array( 'plugin' => $out, 'tema' => get_stylesheet() );
}

function inft_mcp_plugin_attiva( $in ) {
	require_once ABSPATH . 'wp-admin/includes/plugin.php';
	$file = isset( $in['file'] ) ? (string) $in['file'] : '';
	if ( empty( $in['conferma'] ) ) {
		return new WP_Error( 'inft_conferma', 'Serve conferma: true.' );
	}
	if ( ! isset( get_plugins()[ $file ] ) ) {
		return new WP_Error( 'inft_plugin', 'Plugin non trovato: ' . $file . ' (usa influencee/plugin-elenco).' );
	}
	if ( empty( $in['attiva'] ) && 'influencee-core/influencee-core.php' === $file ) {
		return new WP_Error( 'inft_plugin', 'Il Core non si spegne da qui: spegnerebbe anche questo accesso.' );
	}
	if ( empty( $in['attiva'] ) ) {
		deactivate_plugins( $file );
	} else {
		$r = activate_plugin( $file );
		if ( is_wp_error( $r ) ) {
			return $r;
		}
	}
	inft_purge_cache();
	return array( 'file' => $file, 'attivo' => is_plugin_active( $file ) );
}

/** Elenco degli strumenti MCP: azioni del Core (Abilities API, se c'è) + strumenti di questo server. */
function inft_mcp_strumenti() {
	$t = array();
	if ( function_exists( 'wp_get_abilities' ) ) {
		foreach ( wp_get_abilities() as $a ) {
			$name = $a->get_name();
			if ( 0 !== strpos( $name, 'influencee/' ) || 'influencee/aggiorna-plugin' === $name ) {
				continue; // lo zip si carica con POST /influencee/v1/plugin
			}
			$schema = $a->get_input_schema();
			$t[ $name ] = array(
				'description' => $a->get_description(),
				'inputSchema' => $schema ? $schema : array( 'type' => 'object', 'properties' => new stdClass() ),
				'run'         => function ( $args ) use ( $a, $schema ) {
					return $a->execute( $schema ? (array) $args : ( $args ? $args : null ) ); // schema «object»: va bene anche vuoto, null no
				},
			);
		}
	}
	$t['influencee/impostazioni'] = array(
		'description' => 'Legge le impostazioni dei plugin Influencee (tema, gruppi di pagine, eccezioni, redirect, articoli, annunci, GA4).',
		'inputSchema' => array( 'type' => 'object', 'properties' => new stdClass() ),
		'run'         => function () {
			$s = inft_settings();
			return array_intersect_key( $s, inft_mcp_impostazioni_ammesse() );
		},
	);
	$t['influencee/imposta'] = array(
		'description' => 'Cambia impostazioni dei plugin Influencee (solo le chiavi di influencee/impostazioni; valori: tema off|plugin|tutto, articles off|lista|tutti, groups {tool,nuova,sostituzione}, off/on elenco di percorsi, booleani, URL https, ga4_id). Svuota la cache. Richiede conferma.',
		'inputSchema' => array( 'type' => 'object', 'properties' => array( 'valori' => array( 'type' => 'object' ), 'conferma' => array( 'type' => 'boolean' ) ), 'required' => array( 'valori', 'conferma' ) ),
		'run'         => 'inft_mcp_imposta',
	);
	$t['influencee/plugin-elenco'] = array(
		'description' => 'Elenco dei plugin installati (file, nome, versione, attivo) e tema attivo.',
		'inputSchema' => array( 'type' => 'object', 'properties' => new stdClass() ),
		'run'         => 'inft_mcp_plugin_elenco',
	);
	$t['influencee/plugin-attiva'] = array(
		'description' => 'Attiva (attiva=true) o disattiva (attiva=false) un plugin installato, indicato con il suo file (es. modular-page/modular-page.php). Non elimina mai niente; il Core non si spegne da qui. Richiede conferma.',
		'inputSchema' => array( 'type' => 'object', 'properties' => array( 'file' => array( 'type' => 'string' ), 'attiva' => array( 'type' => 'boolean' ), 'conferma' => array( 'type' => 'boolean' ) ), 'required' => array( 'file', 'attiva', 'conferma' ) ),
		'run'         => 'inft_mcp_plugin_attiva',
	);
	$t['influencee/pagine-pausa'] = array(
		'description' => 'Mette in bozza (riprendi=false) le pagine vecchie in pausa il cui redirect è già attivo, o le ripubblica (riprendi=true). Richiede conferma.',
		'inputSchema' => array( 'type' => 'object', 'properties' => array( 'riprendi' => array( 'type' => 'boolean' ), 'conferma' => array( 'type' => 'boolean' ) ), 'required' => array( 'conferma' ) ),
		'run'         => function ( $args ) {
			if ( empty( $args['conferma'] ) ) {
				return new WP_Error( 'inft_conferma', 'Serve conferma: true.' );
			}
			$n = inft_pausa_esegui( ! empty( $args['riprendi'] ) );
			inft_purge_cache();
			return array( 'pagine_cambiate' => $n );
		},
	);
	if ( ! isset( $t['influencee/svuota-cache'] ) ) {
		$t['influencee/svuota-cache'] = array(
			'description' => 'Svuota la cache di LiteSpeed e di WordPress.',
			'inputSchema' => array( 'type' => 'object', 'properties' => new stdClass() ),
			'run'         => function () {
				return array( 'cache' => inft_purge_cache() );
			},
		);
	}
	return $t;
}

/** Nomi MCP: solo lettere, numeri, _ e - (la barra delle azioni diventa __). */
function inft_mcp_nome_mcp( $name ) {
	return str_replace( '/', '__', $name );
}

function inft_mcp_rpc( $msg ) {
	$id     = isset( $msg['id'] ) ? $msg['id'] : null;
	$method = isset( $msg['method'] ) ? (string) $msg['method'] : '';
	$params = isset( $msg['params'] ) && is_array( $msg['params'] ) ? $msg['params'] : array();
	$ok     = function ( $result ) use ( $id ) {
		return array( 'jsonrpc' => '2.0', 'id' => $id, 'result' => $result );
	};
	$err    = function ( $code, $text ) use ( $id ) {
		return array( 'jsonrpc' => '2.0', 'id' => $id, 'error' => array( 'code' => $code, 'message' => $text ) );
	};
	switch ( $method ) {
		case 'initialize':
			return $ok(
				array(
					'protocolVersion' => isset( $params['protocolVersion'] ) ? (string) $params['protocolVersion'] : '2025-03-26',
					'capabilities'    => array( 'tools' => array( 'listChanged' => false ) ),
					'serverInfo'      => array( 'name' => 'influencee', 'version' => INFC_VERSION ),
					'instructions'    => 'Gestione del sito influencee.it (plugin Influencee). Una richiesta alla volta: il server è lento. Gli zip dei plugin si caricano con POST /wp-json/influencee/v1/plugin, non da qui.',
				)
			);
		case 'ping':
			return $ok( new stdClass() );
		case 'tools/list':
			$list = array();
			foreach ( inft_mcp_strumenti() as $name => $t ) {
				$list[] = array( 'name' => inft_mcp_nome_mcp( $name ), 'description' => $t['description'], 'inputSchema' => $t['inputSchema'] );
			}
			return $ok( array( 'tools' => $list ) );
		case 'tools/call':
			$name = str_replace( '__', '/', isset( $params['name'] ) ? (string) $params['name'] : '' );
			$args = isset( $params['arguments'] ) && is_array( $params['arguments'] ) ? $params['arguments'] : array();
			$all  = inft_mcp_strumenti();
			if ( ! isset( $all[ $name ] ) ) {
				return $err( -32602, 'Strumento sconosciuto: ' . $name );
			}
			$res = call_user_func( $all[ $name ]['run'], $args );
			inft_mcp_log( $name . ' (mcp)', $args, $res );
			$is_err = is_wp_error( $res );
			$text   = $is_err ? $res->get_error_message() : wp_json_encode( $res, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT );
			return $ok( array( 'content' => array( array( 'type' => 'text', 'text' => (string) $text ) ), 'isError' => $is_err ) );
		default:
			return $err( -32601, 'Metodo non supportato: ' . $method );
	}
}

add_action(
	'rest_api_init',
	function () {
		register_rest_route(
			'influencee/v1',
			'/mcp',
			array(
				array(
					'methods'             => 'POST',
					'permission_callback' => 'inft_mcp_permesso',
					'callback'            => function ( WP_REST_Request $req ) {
						inft_mcp_nocache();
						$body = json_decode( (string) $req->get_body(), true );
						if ( ! is_array( $body ) ) {
							return new WP_REST_Response( array( 'jsonrpc' => '2.0', 'id' => null, 'error' => array( 'code' => -32700, 'message' => 'JSON non valido' ) ), 400 );
						}
						$batch = isset( $body[0] );
						$out   = array();
						foreach ( $batch ? $body : array( $body ) as $msg ) {
							if ( ! isset( $msg['id'] ) ) {
								continue; // notifiche (es. notifications/initialized): nessuna risposta
							}
							$out[] = inft_mcp_rpc( $msg );
						}
						if ( ! $out ) {
							return new WP_REST_Response( null, 202 );
						}
						return new WP_REST_Response( $batch ? $out : $out[0], 200 );
					},
				),
				array(
					'methods'             => 'GET',
					'permission_callback' => 'inft_mcp_permesso',
					'callback'            => function () {
						inft_mcp_nocache();
						return new WP_REST_Response( array( 'server' => 'influencee', 'versione' => INFC_VERSION, 'strumenti' => array_map( 'inft_mcp_nome_mcp', array_keys( inft_mcp_strumenti() ) ) ), 200 );
					},
				),
			)
		);
		// caricamento di uno zip della famiglia Influencee: corpo della richiesta = zip, X-Sha256 = impronta
		register_rest_route(
			'influencee/v1',
			'/plugin',
			array(
				'methods'             => 'POST',
				'permission_callback' => 'inft_mcp_permesso',
				'callback'            => function ( WP_REST_Request $req ) {
					inft_mcp_nocache();
					$zip = (string) $req->get_body();
					$in  = array( 'zip_base64' => base64_encode( $zip ), 'sha256' => strtolower( (string) $req->get_header( 'x_sha256' ) ), 'conferma' => true, 'attiva' => '1' === (string) $req->get_param( 'attiva' ) );
					$res = inft_mcp_update_plugin( $in );
					inft_mcp_log( 'influencee/aggiorna-plugin (upload)', $in, $res );
					return is_wp_error( $res ) ? new WP_REST_Response( array( 'errore' => $res->get_error_message() ), 400 ) : new WP_REST_Response( $res, 200 );
				},
			)
		);
	}
);

/* ─── Chiave: creazione e revoca dalle impostazioni ─── */

add_action(
	'admin_post_inft_mcp_chiave',
	function () {
		if ( ! current_user_can( 'manage_options' ) || ! check_admin_referer( 'inft_mcp_chiave' ) ) {
			wp_die( 'Non consentito.' );
		}
		$back = inft_settings_url();
		if ( 'crea' === ( isset( $_POST['do'] ) ? sanitize_key( $_POST['do'] ) : '' ) ) {
			$key = 'infk_' . wp_generate_password( 44, false, false );
			update_option( 'inft_mcp_key_hash', inft_mcp_key_hash( $key ), false );
			update_option( 'inft_mcp_key_user', get_current_user_id(), false );
			set_transient( 'inft_mcp_chiave_' . get_current_user_id(), $key, 300 ); // mostrata una volta sola
			wp_safe_redirect( add_query_arg( 'inft_chiave', 'creata', $back ) . '#chiave-claude' );
			exit;
		}
		delete_option( 'inft_mcp_key_hash' );
		delete_option( 'inft_mcp_key_user' );
		wp_safe_redirect( add_query_arg( 'inft_chiave', 'revocata', $back ) . '#chiave-claude' );
		exit;
	}
);

/** Riquadro nella pagina delle impostazioni (fuori dal modulo principale). */
function inft_mcp_chiave_box() {
	$uid = get_current_user_id();
	$key = get_transient( 'inft_mcp_chiave_' . $uid );
	if ( $key ) {
		delete_transient( 'inft_mcp_chiave_' . $uid );
	}
	$attiva = (bool) get_option( 'inft_mcp_key_hash', '' );
	?>
	<h2 id="chiave-claude">Accesso di Claude (server MCP del Core)</h2>
	<p>Indirizzo MCP: <code><?php echo esc_html( rest_url( 'influencee/v1/mcp' ) ); ?></code> · caricamento zip: <code><?php echo esc_html( rest_url( 'influencee/v1/plugin' ) ); ?></code><br>
	Stato: <?php echo $attiva ? '✅ chiave attiva' : '⚪ nessuna chiave'; ?>. La chiave viaggia nell'intestazione <code><?php echo esc_html( INFT_MCP_HEADER ); ?></code>; se la rifai, la precedente smette di funzionare.</p>
	<?php if ( $key ) : ?>
		<div class="notice notice-warning" style="padding:12px"><p><b>Chiave da copiare adesso: non verrà più mostrata.</b> In Claude Code: impostazioni dell'ambiente → Segreti di rete → sito <code>influencee.it</code>, percorso <code>/wp-json/influencee/</code>, intestazione <code><?php echo esc_html( INFT_MCP_HEADER ); ?></code> senza prefisso, valore = questa chiave. Non incollarla in chat.</p>
		<p><input type="text" readonly value="<?php echo esc_attr( $key ); ?>" style="width:100%;font-family:monospace" onclick="this.select()"></p></div>
	<?php endif; ?>
	<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" style="margin:8px 0 16px">
		<?php wp_nonce_field( 'inft_mcp_chiave' ); ?>
		<input type="hidden" name="action" value="inft_mcp_chiave">
		<button class="button button-primary" name="do" value="crea"><?php echo $attiva ? 'Rifai la chiave per Claude' : 'Crea la chiave per Claude'; ?></button>
		<?php if ( $attiva ) : ?><button class="button" name="do" value="revoca">Revoca la chiave</button><?php endif; ?>
	</form>
	<?php
}
