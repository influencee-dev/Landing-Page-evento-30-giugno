<?php
/**
 * Dati degli annunci: impostazioni, scelte del modulo (uguali all'app), annunci aperti.
 *
 * Fonte degli annunci in bacheca, in ordine:
 * 1. elenco pubblico dell'app (impostazione "annunci_feed", JSON) quando l'app lo espone;
 * 2. offerte di WP Job Manager degli ultimi 180 giorni (finché è attivo);
 * 3. nessun annuncio: la pagina invita a pubblicare e rimanda alla bacheca dell'app.
 */

defined( 'ABSPATH' ) || exit;

function infn_settings() {
	$s = inft_settings();
	return wp_parse_args(
		$s,
		array(
			'annunci'          => 0,  // pagine /offerte-lavoro-influencer/ e /pubblica-offerta-lavoro/ servite dal plugin
			'annunci_app'      => 'https://app.influencee.it',
			'annunci_feed'     => '', // es. https://app.influencee.it/annunci/elenco.json (da creare nell'app)
			'annunci_endpoint' => '', // es. https://app.influencee.it/annunci/bozze/ (da creare nell'app)
			'annunci_wpjm'     => 1,  // in attesa dell'elenco dell'app: mostra le offerte recenti di WP Job Manager
			'annunci_email'    => 1,  // email di riepilogo al brand dopo l'invio
			'annunci_vecchie'  => 0,  // redirect 301 delle offerte WP Job Manager scadute verso la bacheca
			'annunci_anteprima' => 1, // offerte dell'app in anteprima: azienda e dettagli solo nell'app
		)
	);
}

/** Segreto condiviso con l'app: meglio in wp-config.php (define INFLUENCEE_ANNUNCI_SECRET), altrimenti nelle impostazioni. */
function infn_secret() {
	if ( defined( 'INFLUENCEE_ANNUNCI_SECRET' ) && INFLUENCEE_ANNUNCI_SECRET ) {
		return (string) INFLUENCEE_ANNUNCI_SECRET;
	}
	return (string) get_option( 'infn_secret', '' );
}

function infn_app_connected() {
	$s = infn_settings();
	return '' !== trim( (string) $s['annunci_endpoint'] ) && '' !== infn_secret();
}

add_filter(
	'inft_app_url',
	function ( $url ) {
		$s = infn_settings();
		return $s['annunci_app'] ? $s['annunci_app'] : $url;
	}
);

/* ─── Scelte del modulo: stesse dell'app (collab/forms.py AnnuncioForm, iscrizione/forms.py) ─── */

function infn_piattaforme() {
	return array( 'instagram' => 'Instagram', 'tiktok' => 'TikTok', 'youtube' => 'YouTube' );
}
function infn_tipi_contenuto() {
	return array( 'reel' => 'Reel', 'post' => 'Post', 'story' => 'Storie', 'video' => 'Video', 'short' => 'Short', 'live' => 'Diretta' );
}
function infn_tipi_offerta() {
	return array( 'paid_fee' => 'Compenso in denaro', 'product_gifting' => 'Cambio merce', 'affiliate_commission' => 'Percentuale sulle vendite' );
}
/** Tipo di attività chiesto sul sito; nell'app diventa "brand" o "agenzia". */
function infn_tipi_attivita() {
	return array( 'azienda' => 'Azienda o negozio', 'ecommerce' => 'E-commerce', 'agenzia' => 'Agenzia (per un cliente)' );
}

/** Paese della sede: stessi codici dell'app (abbonamenti/iva.py SCELTE_PAESE), il regime IVA dipende da qui. */
function infn_paesi() {
	return array(
		'IT' => 'Italia', 'AT' => 'Austria', 'BE' => 'Belgio', 'BG' => 'Bulgaria', 'CY' => 'Cipro', 'HR' => 'Croazia',
		'DK' => 'Danimarca', 'EE' => 'Estonia', 'FI' => 'Finlandia', 'FR' => 'Francia', 'DE' => 'Germania',
		'GR' => 'Grecia', 'IE' => 'Irlanda', 'LV' => 'Lettonia', 'LT' => 'Lituania', 'LU' => 'Lussemburgo',
		'MT' => 'Malta', 'NL' => 'Paesi Bassi', 'PL' => 'Polonia', 'PT' => 'Portogallo', 'CZ' => 'Cechia',
		'RO' => 'Romania', 'SK' => 'Slovacchia', 'SI' => 'Slovenia', 'ES' => 'Spagna', 'SE' => 'Svezia',
		'HU' => 'Ungheria', 'CH' => 'Svizzera', 'GB' => 'Regno Unito', 'NO' => 'Norvegia', 'SM' => 'San Marino',
		'US' => 'Stati Uniti', 'CA' => 'Canada', 'AU' => 'Australia', 'AE' => 'Emirati Arabi Uniti',
	);
}

/** Partita IVA italiana: 11 cifre con cifra di controllo (stesso controllo dell'app, senza VIES). */
function infn_piva_valida( $piva ) {
	$p = preg_replace( '/^IT/i', '', preg_replace( '/\s+/', '', (string) $piva ) );
	if ( ! preg_match( '/^\d{11}$/', $p ) ) {
		return false;
	}
	$sum = 0;
	for ( $i = 0; $i < 11; $i++ ) {
		$d = (int) $p[ $i ];
		if ( 1 === $i % 2 ) {
			$d *= 2;
			if ( $d > 9 ) {
				$d -= 9;
			}
		}
		$sum += $d;
	}
	return 0 === $sum % 10;
}

/* ─── Annunci aperti ─── */

/** Annunci normalizzati: titolo, brief, azienda, compenso, piattaforme, contenuto, città, scadenza, url, fonte. */
function infn_annunci() {
	static $list = null;
	if ( null !== $list ) {
		return $list;
	}
	$list = infn_annunci_app();
	if ( null === $list ) {
		$s    = infn_settings();
		$list = ! empty( $s['annunci_wpjm'] ) ? infn_annunci_wpjm() : array();
	}
	return $list;
}

/** Elenco pubblico dell'app (cache 10 minuti). null = non configurato o non raggiungibile. */
function infn_annunci_app() {
	$s = infn_settings();
	if ( '' === trim( (string) $s['annunci_feed'] ) ) {
		return null;
	}
	$cached = get_transient( 'infn_feed' );
	if ( is_array( $cached ) ) {
		return $cached;
	}
	$res = wp_remote_get( $s['annunci_feed'], array( 'timeout' => 6, 'headers' => array( 'Accept' => 'application/json' ) ) );
	if ( is_wp_error( $res ) || 200 !== (int) wp_remote_retrieve_response_code( $res ) ) {
		$old = get_option( 'infn_feed_last', null ); // ultimo elenco valido, se l'app non risponde
		return is_array( $old ) ? $old : null;
	}
	$data = json_decode( (string) wp_remote_retrieve_body( $res ), true );
	$out  = array();
	$tipi = infn_tipi_contenuto();
	$pl   = infn_piattaforme();
	foreach ( isset( $data['annunci'] ) ? (array) $data['annunci'] : array() as $a ) {
		if ( empty( $a['title'] ) || empty( $a['url'] ) ) {
			continue;
		}
		$d    = isset( $a['deliverables'][0] ) ? $a['deliverables'][0] : array();
		$out[] = array(
			'titolo'      => wp_strip_all_tags( $a['title'] ),
			'brief'       => wp_strip_all_tags( isset( $a['brief'] ) ? $a['brief'] : '' ),
			'azienda'     => wp_strip_all_tags( isset( $a['org_name'] ) ? $a['org_name'] : '' ),
			'compenso'    => infn_compenso_label( $a ),
			'piattaforme' => array_values( array_filter( array_map( function ( $p ) use ( $pl ) {
				return isset( $pl[ $p ] ) ? $pl[ $p ] : '';
			}, isset( $a['platforms'] ) ? (array) $a['platforms'] : array() ) ) ),
			'contenuto'   => $d ? trim( ( isset( $d['qty'] ) ? (int) $d['qty'] . ' ' : '' ) . ( isset( $tipi[ $d['content_type'] ] ) ? $tipi[ $d['content_type'] ] : '' ) ) : '',
			'citta'       => wp_strip_all_tags( isset( $a['citta'] ) ? $a['citta'] : '' ),
			'scadenza'    => isset( $a['apply_by'] ) ? substr( (string) $a['apply_by'], 0, 10 ) : '',
			'pubblicato'  => isset( $a['published_at'] ) ? (string) $a['published_at'] : '',
			'url'         => esc_url_raw( $a['url'] ),
			'fonte'       => 'app',
		);
	}
	set_transient( 'infn_feed', $out, 10 * MINUTE_IN_SECONDS );
	update_option( 'infn_feed_last', $out, false );
	return $out;
}

function infn_compenso_label( $a ) {
	$kind = isset( $a['kind'] ) ? $a['kind'] : '';
	$num  = function ( $v ) {
		return number_format_i18n( (float) $v, ( floor( (float) $v ) == (float) $v ) ? 0 : 2 );
	};
	if ( 'paid_fee' === $kind && ! empty( $a['fee_amount'] ) ) {
		return '€ ' . $num( $a['fee_amount'] ) . ' + IVA';
	}
	if ( 'product_gifting' === $kind ) {
		return 'Cambio merce' . ( ! empty( $a['product_value'] ) ? ' · € ' . $num( $a['product_value'] ) : '' );
	}
	if ( 'affiliate_commission' === $kind && ! empty( $a['commission_pct'] ) ) {
		return $num( $a['commission_pct'] ) . '% sulle vendite';
	}
	return '';
}

/** Offerte di WP Job Manager pubblicate negli ultimi 180 giorni, non chiuse né scadute. */
function infn_annunci_wpjm() {
	if ( ! post_type_exists( 'job_listing' ) ) {
		return array();
	}
	$out   = array();
	$posts = get_posts( array( 'post_type' => 'job_listing', 'post_status' => 'publish', 'numberposts' => 30, 'date_query' => array( array( 'after' => '180 days ago' ) ) ) );
	foreach ( $posts as $p ) {
		if ( get_post_meta( $p->ID, '_filled', true ) ) {
			continue;
		}
		$exp = (string) get_post_meta( $p->ID, '_job_expires', true );
		if ( $exp && strtotime( $exp ) < time() ) {
			continue;
		}
		$out[] = array(
			'titolo'      => wp_strip_all_tags( get_the_title( $p ) ),
			'brief'       => wp_trim_words( wp_strip_all_tags( $p->post_content ), 28, '…' ),
			'azienda'     => (string) get_post_meta( $p->ID, '_company_name', true ),
			'compenso'    => (string) get_post_meta( $p->ID, '_job_salary', true ),
			'piattaforme' => array(),
			'contenuto'   => '',
			'citta'       => (string) get_post_meta( $p->ID, '_job_location', true ),
			'scadenza'    => $exp ? substr( $exp, 0, 10 ) : '',
			'pubblicato'  => get_post_time( 'c', false, $p ),
			'url'         => get_permalink( $p ),
			'fonte'       => 'sito',
		);
	}
	return $out;
}

/** Numero di profili creator nel sito (da Influencee Pagine, se attivo): per l'anteprima bloccata. */
function infn_creator_count() {
	if ( function_exists( 'inft_creators_directory' ) ) {
		return count( inft_creators_directory() );
	}
	$c = wp_count_posts( 'creator' );
	return isset( $c->publish ) ? (int) $c->publish : 0;
}

/**
 * Codice fiscale italiano: 16 caratteri con carattere di controllo (anche con omocodia),
 * oppure 11 cifre per enti e associazioni (stesso controllo della partita IVA).
 */
function infn_cf_valido( $cf ) {
	$cf = strtoupper( preg_replace( '/\s+/', '', (string) $cf ) );
	if ( preg_match( '/^\d{11}$/', $cf ) ) {
		return infn_piva_valida( $cf );
	}
	if ( ! preg_match( '/^[A-Z]{6}[0-9LMNPQRSTUV]{2}[ABCDEHLMPRST][0-9LMNPQRSTUV]{2}[A-Z][0-9LMNPQRSTUV]{3}[A-Z]$/', $cf ) ) {
		return false;
	}
	$odd = array( 1, 0, 5, 7, 9, 13, 15, 17, 19, 21, 2, 4, 18, 20, 11, 3, 6, 8, 12, 14, 16, 10, 22, 25, 24, 23 );
	$sum = 0;
	for ( $i = 0; $i < 15; $i++ ) {
		$c = $cf[ $i ];
		$v = ctype_digit( $c ) ? (int) $c : ord( $c ) - 65;
		$sum += 0 === $i % 2 ? $odd[ $v ] : $v; // posizioni dispari (1ª, 3ª…) e pari
	}
	return chr( 65 + $sum % 26 ) === $cf[15];
}
