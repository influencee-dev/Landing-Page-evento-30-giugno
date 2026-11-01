<?php
/**
 * Flussi: offerte nella bacheca di Influencee Annunci, offerte mandate dalle aziende dal sito (da rivedere),
 * scadenza automatica, invio all'app delle offerte pubblicate (quando l'app ha l'indirizzo per riceverle).
 */

defined( 'ABSPATH' ) || exit;

/* Bacheca e pagine città: prima le offerte del sito, poi quelle dell'app (senza doppioni) */
add_filter(
	'infn_annunci_lista',
	function ( $list ) {
		$mie = info_aperte();
		if ( ! $mie ) {
			return $list;
		}
		$gia = array_filter( wp_list_pluck( $mie, 'app_url' ) );
		$out = $mie;
		foreach ( (array) $list as $a ) {
			if ( 'sito' === $a['fonte'] ) {
				continue; // WP Job Manager: sostituito da questo plugin
			}
			if ( 'app' === $a['fonte'] && in_array( strtok( $a['url'], '?' ), array_map( function ( $u ) {
				return strtok( $u, '?' );
			}, $gia ), true ) ) {
				continue; // la stessa offerta, già pubblicata dal sito
			}
			$out[] = $a;
		}
		usort( $out, function ( $x, $y ) {
			return strcmp( (string) $y['pubblicato'], (string) $x['pubblicato'] );
		} );
		return $out;
	}
);

/*
 * Offerta mandata da un'azienda con «Pubblica un'offerta» del sito. Se l'app l'ha ricevuta (l'azienda la pubblica
 * nell'app) non si fa nulla: arriverà nella bacheca dall'elenco dell'app. Altrimenti diventa un'offerta «da rivedere».
 */
add_action(
	'infn_bozza_ricevuta',
	function ( $bozza_id, $d, $stato ) {
		if ( 'inviata' === $stato ) {
			return;
		}
		$azienda = ! empty( $d['azienda'] ) ? $d['azienda'] : ( ! empty( $d['ragione_sociale'] ) ? $d['ragione_sociale'] : '' );
		$id      = wp_insert_post(
			array(
				'post_type'    => INFO_CPT,
				'post_status'  => 'pending',
				'post_title'   => isset( $d['title'] ) ? $d['title'] : 'Offerta da rivedere',
				'post_content' => isset( $d['brief'] ) ? $d['brief'] : '',
			),
			true
		);
		if ( is_wp_error( $id ) ) {
			return;
		}
		$map = array(
			'azienda'          => $azienda,
			'sito_azienda'     => isset( $d['sito'] ) ? $d['sito'] : '',
			'kind'             => isset( $d['kind'] ) ? $d['kind'] : '',
			'fee_amount'       => isset( $d['fee_amount'] ) ? $d['fee_amount'] : '',
			'product_desc'     => isset( $d['product_desc'] ) ? $d['product_desc'] : '',
			'product_value'    => isset( $d['product_value'] ) ? $d['product_value'] : '',
			'commission_pct'   => isset( $d['commission_pct'] ) ? $d['commission_pct'] : '',
			'platforms'        => isset( $d['platforms'] ) ? (array) $d['platforms'] : array(),
			'contenuto_qty'    => isset( $d['contenuto_qty'] ) ? $d['contenuto_qty'] : '',
			'contenuto_tipo'   => isset( $d['contenuto_tipo'] ) ? $d['contenuto_tipo'] : '',
			'contenuto_giorni' => isset( $d['contenuto_giorni'] ) ? $d['contenuto_giorni'] : '',
			'citta'            => isset( $d['citta_sede'] ) ? $d['citta_sede'] : '', // città della sede: da controllare in revisione
			'apply_by'         => isset( $d['apply_by'] ) ? substr( (string) $d['apply_by'], 0, 10 ) : '',
			'max_creators'     => isset( $d['max_creators'] ) ? $d['max_creators'] : '',
			'contatto_nome'    => trim( ( isset( $d['nome'] ) ? $d['nome'] : '' ) . ' ' . ( isset( $d['cognome'] ) ? $d['cognome'] : '' ) ),
			'contatto_email'   => isset( $d['email'] ) ? $d['email'] : '',
			'contatto_tel'     => isset( $d['telefono'] ) ? $d['telefono'] : '',
			'fonte'            => 'sito_azienda',
			'bozza_id'         => (int) $bozza_id,
		);
		foreach ( $map as $k => $v ) {
			if ( '' !== $v && array() !== $v ) {
				update_post_meta( $id, '_info_' . $k, $v );
			}
		}
		info_avvisa_team( $id );
	},
	10,
	3
);

/** Email al team: c'è un'offerta da rivedere (destinatario: email dell'amministratore del sito). */
function info_avvisa_team( $id ) {
	$to = (string) apply_filters( 'info_email_team', get_option( 'admin_email' ) );
	if ( ! is_email( $to ) ) {
		return;
	}
	$link = admin_url( 'post.php?post=' . (int) $id . '&action=edit' );
	wp_mail(
		$to,
		'Nuova offerta da rivedere: ' . get_the_title( $id ),
		"Un'azienda ha mandato un'offerta di lavoro dal sito.\n\nControllala e pubblicala da qui:\n" . $link . "\n\nNon è ancora online.",
		array( 'Content-Type: text/plain; charset=UTF-8' )
	);
}

/* Scadenza: ogni giorno le offerte pubblicate oltre la data di candidatura diventano «scadute» */
add_action(
	'info_scadenze',
	function () {
		$oggi = current_time( 'Y-m-d' );
		$ids  = get_posts(
			array(
				'post_type'   => INFO_CPT,
				'post_status' => 'publish',
				'numberposts' => 200,
				'fields'      => 'ids',
				'meta_query'  => array( // phpcs:ignore WordPress.DB.SlowDBQuery
					array( 'key' => '_info_apply_by', 'value' => $oggi, 'compare' => '<', 'type' => 'DATE' ),
				),
			)
		);
		foreach ( $ids as $id ) {
			if ( ! get_post_meta( $id, '_info_chiusa', true ) ) {
				update_post_meta( $id, '_info_chiusa', 'scaduta' );
				update_post_meta( $id, '_info_chiusa_il', (string) get_post_meta( $id, '_info_apply_by', true ) );
			}
		}
		if ( $ids ) {
			do_action( 'litespeed_purge_all' );
		}
	}
);

add_action(
	'init',
	function () {
		if ( ! wp_next_scheduled( 'info_scadenze' ) ) {
			wp_schedule_event( time() + 300, 'daily', 'info_scadenze' );
		}
	}
);

/* ─── Invio all'app: l'offerta pubblicata dal sito diventa un annuncio dell'app, dove i creator si candidano ─── */

/** Indirizzo dell'app che riceve le offerte pubblicate (da creare nell'app). Vuoto = niente invio. */
function info_app_endpoint() {
	$u = defined( 'INFLUENCEE_OFFERTE_APP' ) ? INFLUENCEE_OFFERTE_APP : (string) get_option( 'info_app_endpoint', '' );
	return esc_url_raw( trim( (string) $u ) );
}

function info_manda_app( $post ) {
	$end = info_app_endpoint();
	if ( ! $end || '' === (string) infn_secret() ) {
		return;
	}
	$id   = $post->ID;
	$dati = array();
	foreach ( info_campi() as $k ) {
		$dati[ $k ] = info_get( $id, $k );
	}
	unset( $dati['app_url'] );
	$body = wp_json_encode(
		array(
			'versione'  => 1,
			'id_sito'   => (string) get_post_meta( $id, '_info_uuid', true ),
			'url_sito'  => home_url( info_path( $post ) ),
			'titolo'    => get_the_title( $post ),
			'brief'     => wp_strip_all_tags( $post->post_content ),
			'chiusa'    => info_chiusa( $id ),
			'offerta'   => $dati,
			'contatto'  => array( 'email' => (string) info_get( $id, 'contatto_email' ), 'nome' => (string) info_get( $id, 'contatto_nome' ) ),
			'inviata'   => gmdate( 'c' ),
		),
		JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
	);
	$ts   = (string) time();
	$res  = wp_remote_post(
		$end,
		array(
			'timeout' => 8,
			'headers' => array( 'Content-Type' => 'application/json', 'X-Influencee-Timestamp' => $ts, 'X-Influencee-Signature' => 'sha256=' . hash_hmac( 'sha256', $ts . '.' . $body, infn_secret() ) ),
			'body'    => $body,
		)
	);
	$code = is_wp_error( $res ) ? 0 : (int) wp_remote_retrieve_response_code( $res );
	$j    = 200 === $code ? json_decode( (string) wp_remote_retrieve_body( $res ), true ) : null;
	$url  = is_array( $j ) && ! empty( $j['url'] ) ? esc_url_raw( (string) $j['url'] ) : '';
	if ( $url && (string) wp_parse_url( $url, PHP_URL_HOST ) === (string) wp_parse_url( infn_settings()['annunci_app'], PHP_URL_HOST ) ) {
		update_post_meta( $id, '_info_app_url', $url );
		update_post_meta( $id, '_info_app_stato', 'inviata ' . current_time( 'mysql' ) );
	} else {
		update_post_meta( $id, '_info_app_stato', 'errore ' . ( $code ? $code : 'connessione' ) . ' ' . current_time( 'mysql' ) );
	}
}

/* Dopo il salvataggio di un'offerta pubblicata (o chiusa): invio all'app e cache svuotata */
add_action(
	'info_salvata',
	function ( $post ) {
		if ( ! get_post_meta( $post->ID, '_info_uuid', true ) ) {
			update_post_meta( $post->ID, '_info_uuid', wp_generate_uuid4() );
		}
		if ( 'publish' === $post->post_status ) {
			info_manda_app( $post );
		}
		do_action( 'litespeed_purge_all' );
	}
);
