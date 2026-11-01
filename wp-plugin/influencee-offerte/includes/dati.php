<?php
/**
 * Tipo di contenuto «Offerta di lavoro», campi (gli stessi dell'app) e lettura delle offerte.
 *
 * Stati: bozza (draft) → da rivedere (pending, le offerte mandate dalle aziende dal sito) → pubblicata
 * (publish) → chiusa: «scaduta» (in automatico alla scadenza) o «assegnata» (a mano). Una offerta chiusa
 * resta visibile 30 giorni con «Offerta chiusa» (noindex), poi fa 301 alla sua città o alla bacheca.
 */

defined( 'ABSPATH' ) || exit;

add_action(
	'init',
	function () {
		register_post_type(
			INFO_CPT,
			array(
				'label'               => 'Offerte di lavoro',
				'labels'              => array(
					'name'          => 'Offerte di lavoro',
					'singular_name' => 'Offerta di lavoro',
					'menu_name'     => 'Offerte lavoro',
					'add_new'       => 'Nuova offerta',
					'add_new_item'  => 'Nuova offerta di lavoro',
					'edit_item'     => 'Modifica offerta',
					'all_items'     => 'Tutte le offerte',
					'search_items'  => 'Cerca offerte',
					'not_found'     => 'Nessuna offerta',
				),
				'public'              => false, // la pagina pubblica la fa il plugin (motore pagine del Core)
				'publicly_queryable'  => false,
				'exclude_from_search' => true,
				'show_ui'             => true,
				'show_in_menu'        => true,
				'show_in_rest'        => false, // editor classico: campi nel riquadro sotto il testo
				'menu_position'       => 26,
				'menu_icon'           => 'dashicons-megaphone',
				'capability_type'     => 'post',
				'map_meta_cap'        => true,
				'supports'            => array( 'title', 'editor', 'revisions' ),
				'rewrite'             => false,
				'query_var'           => false,
			)
		);
	}
);

/** Città con pagina dedicata (da Influencee Annunci): slug => nome. */
function info_citta_pagine() {
	$out = array();
	foreach ( infn_citta() as $slug => $c ) {
		$out[ $slug ] = $c[0];
	}
	return $out;
}

/** Campi pubblici dell'offerta (meta _info_<chiave>). */
function info_campi() {
	return array( 'azienda', 'sito_azienda', 'mostra_azienda', 'kind', 'fee_amount', 'product_desc', 'product_value', 'commission_pct', 'platforms', 'contenuto_qty', 'contenuto_tipo', 'contenuto_giorni', 'citta', 'apply_by', 'max_creators', 'app_url' );
}

/** Campi riservati: visibili solo nell'amministrazione, mai nelle pagine. */
function info_campi_privati() {
	return array( 'contatto_nome', 'contatto_email', 'contatto_tel', 'note' );
}

function info_get( $id, $k, $def = '' ) {
	$v = get_post_meta( $id, '_info_' . $k, true );
	return ( '' === $v || null === $v ) ? $def : $v;
}

function info_path( $post ) {
	return INFN_BACHECA . $post->post_name . '/';
}

/** Slug della città se l'offerta è in una città con pagina («Milano» → milano), altrimenti ''. */
function info_citta_slug( $citta ) {
	$c = sanitize_title( $citta );
	foreach ( array_keys( info_citta_pagine() ) as $slug ) {
		if ( '' !== $c && false !== strpos( $c, $slug ) ) {
			return $slug;
		}
	}
	return '';
}

/** Chiusa? '' = aperta, altrimenti 'scaduta' o 'assegnata' (la scadenza vale anche prima del controllo giornaliero). */
function info_chiusa( $id ) {
	$c = (string) info_get( $id, 'chiusa' );
	if ( $c ) {
		return $c;
	}
	$by = (string) info_get( $id, 'apply_by' );
	return ( $by && strtotime( $by . ' 23:59:59' ) < current_time( 'timestamp' ) ) ? 'scaduta' : '';
}

/** Data di chiusura (Y-m-d): quella salvata o, per le scadute non ancora segnate, la scadenza. */
function info_chiusa_il( $id ) {
	$d = (string) info_get( $id, 'chiusa_il' );
	return $d ? $d : (string) info_get( $id, 'apply_by' );
}

/** Link per candidarsi: l'offerta nell'app se c'è, altrimenti l'iscrizione creator con il riferimento all'offerta. */
function info_link_app( $post ) {
	$u = (string) info_get( $post->ID, 'app_url' );
	if ( $u && ( (string) wp_parse_url( $u, PHP_URL_HOST ) === (string) wp_parse_url( infn_settings()['annunci_app'], PHP_URL_HOST ) ) ) {
		return add_query_arg( array( 'utm_source' => 'influencee.it', 'utm_medium' => 'referral', 'utm_campaign' => 'offerta_' . $post->post_name ), $u );
	}
	return inft_app_link( '/iscriviti/creator/', 'offerta_' . $post->post_name, array( 'offerta' => $post->post_name ) );
}

/** Offerta nel formato delle schede di Influencee Annunci. */
function info_normalizza( $post ) {
	$id   = $post->ID;
	$tipi = infn_tipi_contenuto();
	$pl   = infn_piattaforme();
	$qty  = (int) info_get( $id, 'contenuto_qty' );
	$tipo = (string) info_get( $id, 'contenuto_tipo' );
	$plat = array_values( array_filter( array_map( function ( $p ) use ( $pl ) {
		return isset( $pl[ $p ] ) ? $pl[ $p ] : '';
	}, (array) info_get( $id, 'platforms', array() ) ) ) );
	return array(
		'titolo'      => wp_strip_all_tags( get_the_title( $post ) ),
		'brief'       => wp_strip_all_tags( $post->post_content ),
		'azienda'     => info_get( $id, 'mostra_azienda' ) ? (string) info_get( $id, 'azienda' ) : '',
		'compenso'    => infn_compenso_label(
			array(
				'kind'           => info_get( $id, 'kind' ),
				'fee_amount'     => info_get( $id, 'fee_amount' ),
				'product_value'  => info_get( $id, 'product_value' ),
				'commission_pct' => info_get( $id, 'commission_pct' ),
			)
		),
		'piattaforme' => $plat,
		'contenuto'   => trim( ( $qty ? $qty . ' ' : '' ) . ( isset( $tipi[ $tipo ] ) ? $tipi[ $tipo ] : '' ) ),
		'citta'       => (string) info_get( $id, 'citta' ),
		'scadenza'    => (string) info_get( $id, 'apply_by' ),
		'pubblicato'  => get_post_time( 'c', true, $post ),
		'url'         => home_url( info_path( $post ) ),
		'fonte'       => 'offerte',
		'id'          => $id,
		'app_url'     => (string) info_get( $id, 'app_url' ),
	);
}

/** Offerte pubblicate e aperte, dalla più recente (cache fino alla prossima modifica). */
function info_aperte() {
	static $list = null;
	if ( null !== $list ) {
		return $list;
	}
	$list = array();
	foreach ( get_posts( array( 'post_type' => INFO_CPT, 'post_status' => 'publish', 'numberposts' => 100, 'orderby' => 'date', 'order' => 'DESC' ) ) as $p ) {
		if ( ! info_chiusa( $p->ID ) ) {
			$list[] = info_normalizza( $p );
		}
	}
	return $list;
}

/** Offerta dal percorso /offerte-lavoro-influencer/<slug>/ (qualunque stato: chi la mostra decide). */
function info_da_percorso( $path ) {
	if ( 0 !== strpos( $path, INFN_BACHECA ) ) {
		return null;
	}
	$slug = trim( substr( $path, strlen( INFN_BACHECA ) ), '/' );
	if ( '' === $slug || false !== strpos( $slug, '/' ) ) {
		return null;
	}
	$p = get_posts( array( 'post_type' => INFO_CPT, 'name' => $slug, 'post_status' => array( 'publish', 'draft', 'pending', 'future' ), 'numberposts' => 1 ) );
	return $p ? $p[0] : null;
}

/* Gli slug delle pagine città restano liberi: «content-creator-milano» non può essere il nome di un'offerta */
add_filter(
	'wp_unique_post_slug',
	function ( $slug, $post_id, $status, $type ) {
		if ( INFO_CPT === $type ) {
			foreach ( array_keys( info_citta_pagine() ) as $c ) {
				if ( 'content-creator-' . $c === $slug ) {
					return $slug . '-offerta';
				}
			}
		}
		return $slug;
	},
	10,
	4
);
