<?php
/**
 * Azioni MCP dei plugin Influencee (WordPress Abilities API + MCP Adapter).
 *
 * Il server MCP già presente nel sito (/wp-json/mcp/mcp-adapter-default-server) espone
 * le "abilities" marcate mcp.public. Qui registriamo solo azioni mirate e reversibili
 * sul plugin: niente comandi, file o database. Ogni azione richiede il ruolo amministratore.
 */

defined( 'ABSPATH' ) || exit;

/** Solo gli amministratori possono usare le azioni. */
function inft_mcp_can() {
	return current_user_can( 'manage_options' );
}

/** Registro delle azioni eseguite via MCP (ultime 50, visibile nelle impostazioni). */
function inft_mcp_log( $ability, $input, $result ) {
	$log   = (array) get_option( 'inft_mcp_log', array() );
	$user  = wp_get_current_user();
	$log[] = array(
		'quando' => current_time( 'mysql' ),
		'utente' => $user ? $user->user_login : '',
		'azione' => $ability,
		'input'  => wp_json_encode( is_array( $input ) && isset( $input['zip_base64'] ) ? array_merge( $input, array( 'zip_base64' => '[' . strlen( (string) $input['zip_base64'] ) . ' caratteri]' ) ) : $input ),
		'esito'  => is_wp_error( $result ) ? 'errore: ' . $result->get_error_message() : 'ok',
	);
	update_option( 'inft_mcp_log', array_slice( $log, -50 ), false );
}

add_action(
	'wp_abilities_api_categories_init',
	function () {
		if ( function_exists( 'wp_register_ability_category' ) ) {
			wp_register_ability_category(
				'influencee',
				array(
					'label'       => 'Influencee',
					'description' => 'Gestione delle pagine del sito influencee.it servite dai plugin Influencee.',
				)
			);
		}
	}
);

add_action(
	'wp_abilities_api_init',
	function () {
		if ( ! function_exists( 'wp_register_ability' ) ) {
			return;
		}
		$readonly = array( 'readonly' => true, 'destructive' => false, 'idempotent' => true );
		$write    = array( 'readonly' => false, 'destructive' => false, 'idempotent' => true );
		$path     = array( 'type' => 'string', 'description' => 'Percorso della pagina, es. /influencer-italiani/influencer-campania/influencer-napoli/', 'pattern' => '^/' );

		// 1. Stato del plugin e delle pagine
		wp_register_ability(
			'influencee/stato',
			array(
				'label'               => 'Stato dei plugin Influencee',
				'description'         => 'Versione del plugin, gruppi di pagine accesi o spenti, eccezioni, redirect, profili creator e plugin collegati (tandem-forms, WP Job Manager, LiteSpeed).',
				'category'            => 'influencee',
				'input_schema'        => array( 'type' => 'object', 'properties' => new stdClass(), 'additionalProperties' => false ),
				'execute_callback'    => function () {
					if ( ! function_exists( 'is_plugin_active' ) ) {
						require_once ABSPATH . 'wp-admin/includes/plugin.php';
					}
					$s      = inft_settings();
					$count  = array();
					$active = array();
					foreach ( inft_pages() as $p => $page ) {
						$g           = isset( $page['group'] ) ? $page['group'] : 'tool';
						$count[ $g ] = isset( $count[ $g ] ) ? $count[ $g ] + 1 : 1;
						if ( inft_is_active( $p, $page, $s ) ) {
							$active[ $g ] = isset( $active[ $g ] ) ? $active[ $g ] + 1 : 1;
						}
					}
					$routes = rest_get_server()->get_routes();
					return array(
						'versione'        => INFC_VERSION,
						'gruppi'          => $s['groups'],
						'pagine_totali'   => $count,
						'pagine_attive'   => $active,
						'eccezioni_off'   => array_values( (array) $s['off'] ),
						'eccezioni_on'    => array_values( (array) $s['on'] ),
						'redirect_attivi' => (bool) $s['redirects'],
						'profili_creator' => (bool) $s['creators'],
						'tandem_forms'    => isset( $routes['/tandem-forms/v1/capture'] ),
						'wp_job_manager'  => post_type_exists( 'job_listing' ),
						'litespeed_cache' => defined( 'LSCWP_V' ),
						'plugin'          => array_map(
							function ( $f ) {
								return is_plugin_active( $f ) ? 'attivo' : ( file_exists( WP_PLUGIN_DIR . '/' . $f ) ? 'spento' : 'non installato' );
							},
							array_combine( array_keys( inft_family() ), array_keys( inft_family() ) )
						),
					);
				},
				'permission_callback' => 'inft_mcp_can',
				'meta'                => array( 'annotations' => $readonly, 'mcp' => array( 'public' => true ) ),
			)
		);

		// 2. Accendere o spegnere un gruppo o singole pagine
		wp_register_ability(
			'influencee/pagine',
			array(
				'label'               => 'Accendi o spegni pagine',
				'description'         => 'Accende o spegne un gruppo di pagine (tool, nuova, sostituzione) oppure singole pagine come eccezione. Spegnere una pagina riporta la pagina WordPress di prima. Esempio: accendere solo Napoli prima di tutto il gruppo sostituzione.',
				'category'            => 'influencee',
				'input_schema'        => array(
					'type'                 => 'object',
					'properties'           => array(
						'azione' => array( 'type' => 'string', 'enum' => array( 'accendi', 'spegni', 'togli_eccezione' ) ),
						'gruppo' => array( 'type' => 'string', 'enum' => array( 'tool', 'nuova', 'sostituzione' ) ),
						'pagine' => array( 'type' => 'array', 'items' => $path, 'maxItems' => 200 ),
					),
					'required'             => array( 'azione' ),
					'additionalProperties' => false,
				),
				'execute_callback'    => function ( $in ) {
					$s     = inft_settings();
					$pages = inft_pages();
					$az    = $in['azione'];
					if ( empty( $in['gruppo'] ) && empty( $in['pagine'] ) ) {
						return new WP_Error( 'inft_input', 'Indica un gruppo oppure delle pagine.' );
					}
					if ( ! empty( $in['gruppo'] ) && 'togli_eccezione' !== $az ) {
						$s['groups'][ $in['gruppo'] ] = 'accendi' === $az ? 1 : 0;
					}
					$sconosciute = array();
					foreach ( isset( $in['pagine'] ) ? (array) $in['pagine'] : array() as $p ) {
						$p = '/' . trim( (string) $p, '/' ) . '/';
						$p = '//' === $p ? '/' : $p;
						if ( ! isset( $pages[ $p ] ) ) {
							$sconosciute[] = $p;
							continue;
						}
						$s['on']  = array_values( array_diff( (array) $s['on'], array( $p ) ) );
						$s['off'] = array_values( array_diff( (array) $s['off'], array( $p ) ) );
						if ( 'accendi' === $az ) {
							$s['on'][] = $p;
						} elseif ( 'spegni' === $az ) {
							$s['off'][] = $p;
						}
					}
					update_option( 'inft_settings', $s );
					inft_purge_cache();
					return array( 'impostazioni' => inft_settings(), 'pagine_sconosciute' => $sconosciute, 'cache' => 'svuotata' );
				},
				'permission_callback' => 'inft_mcp_can',
				'meta'                => array( 'annotations' => $write, 'mcp' => array( 'public' => true ) ),
			)
		);

		// 3. Redirect 301
		wp_register_ability(
			'influencee/redirect',
			array(
				'label'               => 'Redirect 301 dei vecchi URL',
				'description'         => 'Attiva o disattiva i redirect 301 del piano SEO (es. /social-media-tool-form/ verso /social-media-tool/). Restituisce l’elenco dei redirect.',
				'category'            => 'influencee',
				'input_schema'        => array( 'type' => 'object', 'properties' => array( 'attivi' => array( 'type' => 'boolean' ) ), 'required' => array( 'attivi' ), 'additionalProperties' => false ),
				'execute_callback'    => function ( $in ) {
					$s              = inft_settings();
					$s['redirects'] = empty( $in['attivi'] ) ? 0 : 1;
					update_option( 'inft_settings', $s );
					inft_purge_cache();
					return array( 'attivi' => (bool) $s['redirects'], 'redirect' => inft_redirect_map() );
				},
				'permission_callback' => 'inft_mcp_can',
				'meta'                => array( 'annotations' => $write, 'mcp' => array( 'public' => true ) ),
			)
		);

		// 4. Svuotare la cache
		wp_register_ability(
			'influencee/svuota-cache',
			array(
				'label'               => 'Svuota la cache',
				'description'         => 'Svuota la cache di LiteSpeed e quella di WordPress, così le modifiche sono visibili subito.',
				'category'            => 'influencee',
				'input_schema'        => array( 'type' => 'object', 'properties' => new stdClass(), 'additionalProperties' => false ),
				'execute_callback'    => function () {
					return array( 'svuotata' => inft_purge_cache() );
				},
				'permission_callback' => 'inft_mcp_can',
				'meta'                => array( 'annotations' => array( 'readonly' => false, 'destructive' => false, 'idempotent' => true ), 'mcp' => array( 'public' => true ) ),
			)
		);

		// 5. Controllo SEO di una pagina
		wp_register_ability(
			'influencee/controlla-pagina',
			array(
				'label'               => 'Controlla la SEO di una pagina',
				'description'         => 'Scarica una pagina del sito e restituisce title, meta description, H1, tipi di dati strutturati, numero di profili e moduli lead, e se è servita dal plugin.',
				'category'            => 'influencee',
				'input_schema'        => array( 'type' => 'object', 'properties' => array( 'percorso' => $path ), 'required' => array( 'percorso' ), 'additionalProperties' => false ),
				'execute_callback'    => function ( $in ) {
					$url = home_url( '/' . ltrim( (string) $in['percorso'], '/' ) );
					$res = wp_remote_get( add_query_arg( 'inft_check', time(), $url ), array( 'timeout' => 20, 'redirection' => 0 ) );
					if ( is_wp_error( $res ) ) {
						return $res;
					}
					$html  = (string) wp_remote_retrieve_body( $res );
					// solo il contenuto visibile (non i dati passati alla versione interattiva)
					$start = strpos( $html, 'id="influencee-tools"' );
					$main  = false === $start ? $html : substr( $html, $start, max( 0, (int) strpos( $html, '</main>', $start ) - $start ) );
					$clean = function ( $s ) {
						return trim( html_entity_decode( wp_strip_all_tags( $s ), ENT_QUOTES, 'UTF-8' ) );
					};
					preg_match_all( '#<title[^>]*>(.*?)</title>#is', $html, $titles );
					preg_match_all( '#<meta[^>]+name=["\']description["\'][^>]+content=["\']([^"\']*)#i', $html, $desc );
					preg_match_all( '#<h1[^>]*>(.*?)</h1>#is', $html, $h1 );
					preg_match_all( '#<script[^>]+application/ld\+json[^>]*>(.*?)</script>#is', $html, $ld );
					$types = array();
					foreach ( $ld[1] as $j ) {
						$d = json_decode( $j, true );
						foreach ( isset( $d['@graph'] ) ? $d['@graph'] : array( $d ) as $g ) {
							if ( isset( $g['@type'] ) ) {
								$types[] = is_array( $g['@type'] ) ? implode( '/', $g['@type'] ) : $g['@type'];
							}
						}
					}
					return array(
						'url'             => $url,
						'stato_http'      => (int) wp_remote_retrieve_response_code( $res ),
						'redirect_verso'  => (string) wp_remote_retrieve_header( $res, 'location' ),
						'servita_plugin'  => false !== strpos( $html, 'id="influencee-tools"' ),
						'title'           => array_map( $clean, $titles[1] ),
						'description'     => array_map( $clean, $desc[1] ),
						'h1'              => array_map( $clean, $h1[1] ),
						'dati_strutturati' => $types,
						'profili_creator' => substr_count( $main, 'group flex items-center gap-3 rounded-2xl' ),
						'moduli_lead'     => substr_count( $main, '<form' ),
						'parole'          => str_word_count( wp_strip_all_tags( $html ) ),
					);
				},
				'permission_callback' => 'inft_mcp_can',
				'meta'                => array( 'annotations' => $readonly, 'mcp' => array( 'public' => true ) ),
			)
		);

		// 6. Rimuovere un profilo creator (su richiesta del creator)
		wp_register_ability(
			'influencee/rimuovi-creator',
			array(
				'label'               => 'Rimuovi un profilo creator',
				'description'         => 'Sposta nel cestino il profilo di un creator che ha chiesto di essere tolto dal sito (recuperabile per 30 giorni). Serve conferma esplicita.',
				'category'            => 'influencee',
				'input_schema'        => array(
					'type'                 => 'object',
					'properties'           => array(
						'slug'     => array( 'type' => 'string', 'description' => 'Slug del profilo, es. ilmenestrelloh (da /creator/ilmenestrelloh/)' ),
						'motivo'   => array( 'type' => 'string', 'maxLength' => 200 ),
						'conferma' => array( 'type' => 'boolean', 'description' => 'Deve essere true' ),
					),
					'required'             => array( 'slug', 'conferma' ),
					'additionalProperties' => false,
				),
				'execute_callback'    => function ( $in ) {
					if ( true !== $in['conferma'] ) {
						return new WP_Error( 'inft_conferma', 'Serve conferma: true.' );
					}
					$post = get_page_by_path( sanitize_title( $in['slug'] ), OBJECT, 'creator' );
					if ( ! $post ) {
						return new WP_Error( 'inft_creator', 'Profilo non trovato: ' . $in['slug'] );
					}
					wp_trash_post( $post->ID );
					update_post_meta( $post->ID, '_inft_rimozione', array( 'quando' => current_time( 'mysql' ), 'motivo' => isset( $in['motivo'] ) ? sanitize_text_field( $in['motivo'] ) : '' ) );
					inft_purge_cache();
					return array( 'rimosso' => $post->post_title, 'id' => $post->ID, 'recuperabile' => 'dal cestino di WordPress per 30 giorni' );
				},
				'permission_callback' => 'inft_mcp_can',
				'meta'                => array( 'annotations' => array( 'readonly' => false, 'destructive' => true, 'idempotent' => true ), 'mcp' => array( 'public' => true ) ),
			)
		);

		// 7. Articoli del blog col nuovo modello (solo se Influencee Articoli è attivo)
		if ( function_exists( 'inft_articles_list' ) ) {
		wp_register_ability(
			'influencee/articoli',
			array(
				'label'               => 'Articoli col nuovo modello',
				'description'         => 'Sceglie come mostrare gli articoli del blog: off (come oggi), lista (solo gli articoli indicati), tutti. Può accendere o spegnere singoli articoli (percorsi tipo /titolo-articolo/) e aggiungere redirect 301 per articoli doppi (attivi solo se i redirect sono attivi). Restituisce lo stato.',
				'category'            => 'influencee',
				'input_schema'        => array(
					'type'                 => 'object',
					'properties'           => array(
						'modo'     => array( 'type' => 'string', 'enum' => array( 'off', 'lista', 'tutti' ) ),
						'accendi'  => array( 'type' => 'array', 'items' => $path, 'maxItems' => 200 ),
						'spegni'   => array( 'type' => 'array', 'items' => $path, 'maxItems' => 200 ),
						'redirect' => array( 'type' => 'object', 'additionalProperties' => $path, 'description' => 'Mappa { "/vecchio/": "/nuovo/" } da aggiungere; valore vuoto per togliere.' ),
					),
					'additionalProperties' => false,
				),
				'execute_callback'    => function ( $in ) {
					$s     = inft_settings();
					$known = inft_articles_list();
					if ( ! empty( $in['modo'] ) ) {
						$s['articles'] = $in['modo'];
					}
					$sconosciuti = array();
					foreach ( array( 'accendi' => 'articles_on', 'spegni' => 'articles_off' ) as $k => $list ) {
						$other = 'articles_on' === $list ? 'articles_off' : 'articles_on';
						foreach ( inft_clean_paths( isset( $in[ $k ] ) ? (array) $in[ $k ] : array() ) as $p ) {
							if ( ! isset( $known[ $p ] ) ) {
								$sconosciuti[] = $p;
								continue;
							}
							$s[ $other ] = array_values( array_diff( (array) $s[ $other ], array( $p ) ) );
							$s[ $list ]  = array_values( array_unique( array_merge( (array) $s[ $list ], array( $p ) ) ) );
						}
					}
					if ( ! empty( $in['redirect'] ) && is_array( $in['redirect'] ) ) {
						$extra = (array) $s['redirects_extra'];
						foreach ( $in['redirect'] as $from => $to ) {
							$f = inft_clean_paths( array( $from ) );
							if ( ! $f ) {
								continue;
							}
							if ( '' === trim( (string) $to ) ) {
								unset( $extra[ $f[0] ] );
							} else {
								$extra = array_merge( $extra, inft_clean_redirects( array( $f[0] => $to ) ) );
							}
						}
						$s['redirects_extra'] = $extra;
					}
					update_option( 'inft_settings', $s );
					inft_purge_cache();
					$s = inft_settings();
					return array( 'modo' => $s['articles'], 'accesi' => $s['articles_on'], 'esclusi' => $s['articles_off'], 'redirect_extra' => $s['redirects_extra'], 'redirect_attivi' => (bool) $s['redirects'], 'sconosciuti' => $sconosciuti, 'articoli_totali' => count( $known ) );
				},
				'permission_callback' => 'inft_mcp_can',
				'meta'                => array( 'annotations' => $write, 'mcp' => array( 'public' => true ) ),
			)
		);

		}

		// 8. Aggiornare un plugin Influencee (solo i pacchetti della famiglia, con controllo dell'impronta)
		wp_register_ability(
			'influencee/aggiorna-plugin',
			array(
				'label'               => 'Aggiorna un plugin Influencee',
				'description'         => 'Installa o aggiorna un plugin Influencee (influencee-core, influencee-tools, influencee-pagine, influencee-articoli, influencee-annunci) da uno zip in base64. Accetta solo zip con una di queste cartelle e il file principale col nome giusto, e solo se l\'impronta sha256 coincide. Le impostazioni restano; con attiva=true il plugin viene attivato. Richiede conferma.',
				'category'            => 'influencee',
				'input_schema'        => array(
					'type'                 => 'object',
					'properties'           => array(
						'zip_base64' => array( 'type' => 'string', 'maxLength' => 25000000 ),
						'sha256'     => array( 'type' => 'string', 'pattern' => '^[a-f0-9]{64}$' ),
						'conferma'   => array( 'type' => 'boolean' ),
						'attiva'     => array( 'type' => 'boolean' ),
					),
					'required'             => array( 'zip_base64', 'sha256', 'conferma' ),
					'additionalProperties' => false,
				),
				'execute_callback'    => 'inft_mcp_update_plugin',
				'permission_callback' => function () {
					return current_user_can( 'manage_options' ) && current_user_can( 'update_plugins' ) && current_user_can( 'install_plugins' );
				},
				'meta'                => array( 'annotations' => array( 'readonly' => false, 'destructive' => true, 'idempotent' => true ), 'mcp' => array( 'public' => true ) ),
			)
		);
	}
);

// Registro: ogni esecuzione delle nostre azioni via REST/MCP
add_action(
	'wp_after_execute_ability',
	function ( $name, $input, $result ) {
		if ( 0 === strpos( (string) $name, 'influencee/' ) ) {
			inft_mcp_log( $name, $input, $result );
		}
	},
	10,
	3
);

/**
 * La porta MCP del sito di default è aperta a qualunque utente con accesso (capability "read"):
 * la alziamo agli amministratori, così nessun utente iscritto può usare gli strumenti MCP del sito.
 */
add_filter(
	'mcp_adapter_default_transport_permission_user_capability',
	function ( $cap ) {
		$s = inft_settings();
		return empty( $s['mcp_admin_only'] ) ? $cap : 'manage_options';
	}
);

/** Svuota LiteSpeed (se presente) e la cache oggetti di WordPress. */
function inft_purge_cache() {
	if ( function_exists( 'inft_forget_creators' ) ) {
		inft_forget_creators();
	}
	do_action( 'litespeed_purge_all' );
	wp_cache_flush();
	return defined( 'LSCWP_V' ) ? 'litespeed + wordpress' : 'wordpress';
}

/** Installa lo zip del plugin dopo i controlli: impronta, dimensione, contenuto solo cartelle dei plugin Influencee. */
function inft_mcp_update_plugin( $in ) {
	if ( empty( $in['conferma'] ) ) {
		return new WP_Error( 'inft_conferma', 'Serve conferma: true.' );
	}
	if ( ! wp_is_file_mod_allowed( 'inft_update_plugin' ) ) {
		return new WP_Error( 'inft_bloccato', 'Il sito non permette di modificare i plugin (DISALLOW_FILE_MODS).' );
	}
	$zip = base64_decode( (string) $in['zip_base64'], true );
	if ( false === $zip || strlen( $zip ) < 1000 || strlen( $zip ) > 18 * MB_IN_BYTES ) {
		return new WP_Error( 'inft_zip', 'Zip non valido o troppo grande.' );
	}
	if ( ! hash_equals( strtolower( $in['sha256'] ), hash( 'sha256', $zip ) ) ) {
		return new WP_Error( 'inft_impronta', 'L\'impronta sha256 non coincide: zip rifiutato.' );
	}
	if ( ! class_exists( 'ZipArchive' ) ) {
		return new WP_Error( 'inft_zip', 'ZipArchive non disponibile sul server.' );
	}
	require_once ABSPATH . 'wp-admin/includes/file.php';
	require_once ABSPATH . 'wp-admin/includes/misc.php';
	require_once ABSPATH . 'wp-admin/includes/plugin.php';
	require_once ABSPATH . 'wp-admin/includes/class-wp-upgrader.php';
	$tmp = wp_tempnam( 'influencee-plugin.zip' );
	file_put_contents( $tmp, $zip ); // phpcs:ignore WordPress.WP.AlternativeFunctions
	$za = new ZipArchive();
	if ( true !== $za->open( $tmp ) ) {
		wp_delete_file( $tmp );
		return new WP_Error( 'inft_zip', 'Zip non leggibile.' );
	}
	$family = array( 'influencee-core' => 'Influencee Core', 'influencee-tools' => 'Influencee Tools', 'influencee-pagine' => 'Influencee Pagine', 'influencee-articoli' => 'Influencee Articoli', 'influencee-annunci' => 'Influencee Annunci' );
	$first  = $za->numFiles > 0 ? (string) $za->getNameIndex( 0 ) : '';
	$slug   = strtok( $first, '/' );
	$ok     = isset( $family[ $slug ] );
	for ( $i = 0; $ok && $i < $za->numFiles; $i++ ) {
		$name = (string) $za->getNameIndex( $i );
		$ok   = 0 === strpos( $name, $slug . '/' ) && false === strpos( $name, '..' );
	}
	$main = $ok ? (string) $za->getFromName( $slug . '/' . $slug . '.php' ) : '';
	$za->close();
	if ( ! $ok || ! preg_match( '/Plugin Name:\s*' . preg_quote( $family[ $slug ], '/' ) . '\s*$/mi', $main ) || ! preg_match( '/Version:\s*([0-9.]+)/i', $main, $ver ) ) {
		wp_delete_file( $tmp );
		return new WP_Error( 'inft_contenuto', 'Lo zip non è un plugin Influencee: rifiutato.' );
	}
	$file = $slug . '/' . $slug . '.php';
	if ( ! WP_Filesystem() ) {
		wp_delete_file( $tmp );
		return new WP_Error( 'inft_fs', 'WordPress non può scrivere i file dei plugin su questo server.' );
	}
	$data     = file_exists( WP_PLUGIN_DIR . '/' . $file ) ? get_plugin_data( WP_PLUGIN_DIR . '/' . $file, false, false ) : array();
	$before   = isset( $data['Version'] ) ? $data['Version'] : '';
	$was_on   = is_plugin_active( $file );
	$upgrader = new Plugin_Upgrader( new Automatic_Upgrader_Skin() );
	$res      = $upgrader->install( $tmp, array( 'overwrite_package' => true ) );
	wp_delete_file( $tmp );
	if ( is_wp_error( $res ) || ! $res ) {
		return is_wp_error( $res ) ? $res : new WP_Error( 'inft_install', 'Installazione non riuscita.' );
	}
	$act = null;
	if ( $was_on || ! empty( $in['attiva'] ) ) {
		$act = activate_plugin( $file );
	}
	inft_purge_cache();
	return array( 'plugin' => $slug, 'installato' => true, 'versione_prima' => $before ? $before : 'nuovo', 'versione_nuova' => $ver[1], 'attivo' => is_plugin_active( $file ), 'errore_attivazione' => is_wp_error( $act ) ? $act->get_error_message() : null, 'cache' => 'svuotata' );
}
