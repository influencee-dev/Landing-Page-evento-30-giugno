<?php
/**
 * Invio del percorso "Pubblica un'offerta".
 *
 * POST /wp-json/influencee-annunci/v1/bozza
 * 1. controlla i campi con le stesse regole dell'app (AnnuncioForm, AziendaForm, ReferenteForm);
 * 2. salva la bozza in WordPress (tipo di contenuto privato "Bozze annunci": nulla va perso);
 * 3. se l'app è collegata (indirizzo + segreto), la manda all'app firmata (HMAC SHA-256) e riceve
 *    il link per scegliere la password e pubblicare; la password non passa mai da WordPress;
 * 4. manda al brand un'email di riepilogo con il link (se attivato).
 * Il lead arriva anche in tandem: lo script del sito raccoglie il modulo (data-tandem) all'invio.
 */

defined( 'ABSPATH' ) || exit;

add_action(
	'init',
	function () {
		register_post_type(
			'inf_bozza_annuncio',
			array(
				'label'           => 'Bozze annunci',
				'labels'          => array( 'name' => 'Bozze annunci', 'singular_name' => 'Bozza annuncio', 'menu_name' => 'Bozze annunci' ),
				'public'          => false,
				'show_ui'         => true,
				'show_in_menu'    => 'influencee',
				'show_in_rest'    => false,
				'capability_type' => 'post',
				'capabilities'    => array( 'create_posts' => 'do_not_allow' ),
				'map_meta_cap'    => true,
				'supports'        => array( 'title', 'editor' ),
			)
		);
	}
);

add_action(
	'rest_api_init',
	function () {
		register_rest_route(
			'influencee-annunci/v1',
			'/bozza',
			array(
				'methods'             => 'POST',
				'permission_callback' => '__return_true', // modulo pubblico: protetto da campo trappola, tempo minimo e limite per IP
				'callback'            => 'infn_ricevi_bozza',
			)
		);
	}
);

/** Controlli dei campi. Restituisce array( dati puliti, errori ). */
function infn_valida( $in ) {
	$err  = array();
	$txt  = function ( $k, $max ) use ( $in ) {
		return isset( $in[ $k ] ) ? mb_substr( sanitize_text_field( wp_unslash( (string) $in[ $k ] ) ), 0, $max ) : '';
	};
	$area = function ( $k, $max ) use ( $in ) {
		return isset( $in[ $k ] ) ? mb_substr( sanitize_textarea_field( wp_unslash( (string) $in[ $k ] ) ), 0, $max ) : '';
	};
	$num  = function ( $k ) use ( $in ) {
		return isset( $in[ $k ] ) && '' !== $in[ $k ] && is_numeric( $in[ $k ] ) ? (float) $in[ $k ] : null;
	};
	$d = array(
		'tipo_attivita'         => $txt( 'tipo_attivita', 20 ),
		'azienda'               => $txt( 'azienda', 255 ),
		'citta_sede'            => $txt( 'citta_sede', 120 ),
		'sito'                  => esc_url_raw( $txt( 'sito', 1000 ) ),
		'title'                 => $txt( 'title', 160 ),
		'brief'                 => $area( 'brief', 2000 ),
		'platforms'             => array_values( array_intersect( (array) ( isset( $in['platforms'] ) ? $in['platforms'] : array() ), array_keys( infn_piattaforme() ) ) ),
		'kind'                  => $txt( 'kind', 30 ),
		'fee_amount'            => $num( 'fee_amount' ),
		'product_desc'          => $txt( 'product_desc', 300 ),
		'product_value'         => $num( 'product_value' ),
		'commission_pct'        => $num( 'commission_pct' ),
		'contenuto_piattaforma' => $txt( 'contenuto_piattaforma', 20 ),
		'contenuto_tipo'        => $txt( 'contenuto_tipo', 20 ),
		'contenuto_qty'         => (int) $num( 'contenuto_qty' ),
		'contenuto_giorni'      => (int) $num( 'contenuto_giorni' ),
		'apply_by'              => $txt( 'apply_by', 10 ),
		'max_creators'          => $num( 'max_creators' ) ? (int) $num( 'max_creators' ) : null,
		'citta'                 => $txt( 'citta', 80 ),
		'destination_url'       => esc_url_raw( $txt( 'destination_url', 1000 ) ),
		'paese'                 => 'ALTRO' === $txt( 'paese', 5 ) ? 'ALTRO' : 'IT',
		'piva'                  => strtoupper( preg_replace( '/\s+/', '', $txt( 'piva', 16 ) ) ),
		'ragione_sociale'       => $txt( 'ragione_sociale', 255 ),
		'nome'                  => $txt( 'nome', 150 ),
		'cognome'               => $txt( 'cognome', 150 ),
		'ruolo'                 => $txt( 'ruolo', 120 ),
		'telefono'              => $txt( 'telefono', 30 ),
		'email'                 => strtolower( sanitize_email( $txt( 'email', 254 ) ) ),
		'consenso_marketing'    => ! empty( $in['consenso_marketing'] ),
	);
	if ( ! isset( infn_tipi_attivita()[ $d['tipo_attivita'] ] ) ) {
		$err['tipo_attivita'] = 'Scegli che attività hai.';
	}
	foreach ( array( 'azienda' => 'Indica il nome dell’azienda.', 'citta_sede' => 'Indica la città.', 'title' => 'Scrivi un titolo.', 'brief' => 'Scrivi cosa chiedi.', 'ragione_sociale' => 'Indica la ragione sociale.', 'nome' => 'Indica il nome.', 'cognome' => 'Indica il cognome.' ) as $k => $m ) {
		if ( '' === $d[ $k ] ) {
			$err[ $k ] = $m;
		}
	}
	if ( ! $d['platforms'] ) {
		$err['platforms'] = 'Scegli almeno una piattaforma.';
	}
	if ( ! isset( infn_tipi_offerta()[ $d['kind'] ] ) ) {
		$err['kind'] = 'Scegli cosa offri.';
	} elseif ( 'paid_fee' === $d['kind'] && ( null === $d['fee_amount'] || $d['fee_amount'] < 1 ) ) {
		$err['fee_amount'] = 'Indica il compenso.';
	} elseif ( 'product_gifting' === $d['kind'] && '' === $d['product_desc'] ) {
		$err['product_desc'] = 'Descrivi il prodotto.';
	} elseif ( 'affiliate_commission' === $d['kind'] && ( null === $d['commission_pct'] || $d['commission_pct'] < 1 || $d['commission_pct'] > 100 ) ) {
		$err['commission_pct'] = 'Indica la percentuale (1-100).';
	}
	if ( ! isset( infn_piattaforme()[ $d['contenuto_piattaforma'] ] ) ) {
		$err['contenuto_piattaforma'] = 'Scegli la piattaforma del contenuto.';
	}
	if ( ! isset( infn_tipi_contenuto()[ $d['contenuto_tipo'] ] ) ) {
		$err['contenuto_tipo'] = 'Scegli il tipo di contenuto.';
	}
	if ( $d['contenuto_qty'] < 1 || $d['contenuto_qty'] > 50 ) {
		$err['contenuto_qty'] = 'Da 1 a 50 contenuti.';
	}
	if ( $d['contenuto_giorni'] < 1 || $d['contenuto_giorni'] > 365 ) {
		$err['contenuto_giorni'] = 'Consegna tra 1 e 365 giorni.';
	}
	if ( ! preg_match( '/^\d{4}-\d{2}-\d{2}$/', $d['apply_by'] ) || $d['apply_by'] < current_time( 'Y-m-d' ) ) {
		$err['apply_by'] = 'Scegli una data da oggi in poi.';
	}
	if ( null !== $d['max_creators'] && ( $d['max_creators'] < 1 || $d['max_creators'] > 500 ) ) {
		$err['max_creators'] = 'Da 1 a 500 creator.';
	}
	if ( 'IT' === $d['paese'] ) {
		$d['piva'] = preg_replace( '/^IT/', '', $d['piva'] );
		if ( ! infn_piva_valida( $d['piva'] ) ) {
			$err['piva'] = 'La partita IVA non è valida: controlla le 11 cifre.';
		}
	} elseif ( strlen( $d['piva'] ) < 5 ) {
		$err['piva'] = 'Indica la partita IVA.';
	}
	if ( ! is_email( $d['email'] ) ) {
		$err['email'] = 'Indica un’email valida.';
	}
	return array( $d, $err );
}

function infn_ricevi_bozza( WP_REST_Request $req ) {
	$in = $req->get_json_params();
	$in = is_array( $in ) ? $in : $req->get_body_params();
	// anti-spam: campo trappola, tempo minimo di compilazione, massimo 5 invii l'ora per IP
	if ( ! empty( $in['website_hp'] ) || ( isset( $in['t0'] ) && time() - (int) $in['t0'] < 8 ) ) {
		return new WP_REST_Response( array( 'ok' => true ), 200 ); // risposta neutra ai robot
	}
	$ip  = isset( $_SERVER['REMOTE_ADDR'] ) ? (string) $_SERVER['REMOTE_ADDR'] : '';
	$key = 'infn_rl_' . md5( $ip );
	$n   = (int) get_transient( $key );
	if ( $n >= 5 ) {
		return new WP_REST_Response( array( 'ok' => false, 'errore' => 'Troppi invii ravvicinati: riprova tra un’ora o scrivici.' ), 429 );
	}
	set_transient( $key, $n + 1, HOUR_IN_SECONDS );

	list( $d, $err ) = infn_valida( $in );
	if ( $err ) {
		return new WP_REST_Response( array( 'ok' => false, 'campi' => $err, 'errore' => reset( $err ) ), 422 );
	}

	$id = wp_insert_post(
		array(
			'post_type'    => 'inf_bozza_annuncio',
			'post_status'  => 'private',
			'post_title'   => $d['title'] . ' — ' . $d['azienda'],
			'post_content' => $d['brief'],
		)
	);
	$uuid = wp_generate_uuid4();
	update_post_meta( $id, '_infn_dati', $d );
	update_post_meta( $id, '_infn_uuid', $uuid );

	$claim = '';
	$stato = 'salvata';
	if ( infn_app_connected() ) {
		list( $claim, $stato ) = infn_manda_app( $uuid, $d );
	}
	update_post_meta( $id, '_infn_stato', $stato );
	if ( ! $claim ) {
		$claim = inft_app_link( '/iscriviti/brand/', 'pubblica_offerta', array( 'da' => 'annuncio' ) );
	}
	update_post_meta( $id, '_infn_claim', $claim );

	$s = infn_settings();
	if ( ! empty( $s['annunci_email'] ) ) {
		infn_email_riepilogo( $d, $claim );
	}
	return new WP_REST_Response( array( 'ok' => true, 'claim_url' => $claim, 'collegata' => 'inviata' === $stato ), 200 );
}

/** Manda la bozza all'app con firma HMAC. Restituisce array( link per la password, stato ). */
function infn_manda_app( $uuid, $d ) {
	$s    = infn_settings();
	$body = wp_json_encode(
		array(
			'versione' => 1,
			'id_sito'  => $uuid,
			'creata'   => gmdate( 'c' ),
			'fonte'    => 'sito_offerta',
			'bozza'    => $d,
		),
		JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
	);
	$ts   = (string) time();
	$sig  = hash_hmac( 'sha256', $ts . '.' . $body, infn_secret() );
	$res  = wp_remote_post(
		$s['annunci_endpoint'],
		array(
			'timeout' => 10,
			'headers' => array( 'Content-Type' => 'application/json', 'X-Influencee-Timestamp' => $ts, 'X-Influencee-Signature' => 'sha256=' . $sig ),
			'body'    => $body,
		)
	);
	if ( is_wp_error( $res ) || 200 !== (int) wp_remote_retrieve_response_code( $res ) ) {
		return array( '', 'errore_app' );
	}
	$j    = json_decode( (string) wp_remote_retrieve_body( $res ), true );
	$url  = isset( $j['claim_url'] ) ? (string) $j['claim_url'] : '';
	$host = (string) wp_parse_url( $s['annunci_app'], PHP_URL_HOST );
	if ( ! $url || (string) wp_parse_url( $url, PHP_URL_HOST ) !== $host ) {
		return array( '', 'errore_app' );
	}
	return array( $url, 'inviata' );
}

function infn_email_riepilogo( $d, $claim ) {
	$k   = infn_tipi_offerta();
	$off = 'paid_fee' === $d['kind'] ? '€ ' . number_format_i18n( $d['fee_amount'] ) . ' + IVA per creator' : ( 'product_gifting' === $d['kind'] ? 'Cambio merce: ' . $d['product_desc'] : number_format_i18n( $d['commission_pct'] ) . '% sulle vendite' );
	$msg = 'Ciao ' . $d['nome'] . ",\n\n"
		. "abbiamo ricevuto la tua offerta \"" . $d['title'] . "\".\n"
		. '- ' . $off . "\n"
		. '- ' . $d['contenuto_qty'] . ' ' . infn_tipi_contenuto()[ $d['contenuto_tipo'] ] . ' su ' . infn_piattaforme()[ $d['contenuto_piattaforma'] ] . ', consegna entro ' . $d['contenuto_giorni'] . " giorni\n"
		. '- Candidature entro il ' . date_i18n( 'j F Y', strtotime( $d['apply_by'] ) ) . "\n\n"
		. "Per pubblicarla crea l'account su Influencee con questa email (" . $d['email'] . "):\n" . $claim . "\n\n"
		. "Nell'app puoi anche cercare e invitare direttamente i creator adatti alla tua offerta.\n\n"
		. "Se non hai inviato tu questa richiesta, ignora questa email: l'offerta non verrà pubblicata.\n\n"
		. "Influencee\n" . home_url( '/' );
	wp_mail( $d['email'], 'La tua offerta "' . $d['title'] . '": ultimo passo per pubblicarla', $msg );
}
