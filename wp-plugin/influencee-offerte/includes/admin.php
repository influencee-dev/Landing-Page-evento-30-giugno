<?php
/**
 * Amministrazione: campi dell'offerta, colonne dell'elenco, importazione da WP Job Manager, impostazioni.
 */

defined( 'ABSPATH' ) || exit;

/* ─── Campi ─── */

add_action(
	'add_meta_boxes',
	function () {
		add_meta_box( 'info_campi', 'Dettagli dell’offerta (gli stessi dell’app)', 'info_box_campi', INFO_CPT, 'normal', 'high' );
		add_meta_box( 'info_stato', 'Stato e candidature', 'info_box_stato', INFO_CPT, 'side', 'high' );
		add_meta_box( 'info_privati', 'Contatto dell’azienda (riservato, mai sul sito)', 'info_box_privati', INFO_CPT, 'normal', 'default' );
	}
);

/* Il testo dell'editor è il brief: un'indicazione sopra */
add_action(
	'edit_form_after_title',
	function ( $post ) {
		if ( INFO_CPT === $post->post_type ) {
			echo '<p style="margin:12px 0 4px"><b>Brief</b>: cosa chiede il brand. Sul sito si vedono solo le prime righe, il resto nell’app.</p>';
		}
	}
);

function info_campo( $label, $html, $help = '' ) {
	return '<p class="info-f"><label><b>' . esc_html( $label ) . '</b><br>' . $html . '</label>' . ( $help ? '<br><span class="description">' . esc_html( $help ) . '</span>' : '' ) . '</p>';
}

function info_input( $id, $k, $type = 'text', $attr = '' ) {
	return '<input type="' . esc_attr( $type ) . '" name="info[' . esc_attr( $k ) . ']" value="' . esc_attr( (string) info_get( $id, $k ) ) . '" class="widefat" ' . $attr . '>';
}

function info_box_campi( $post ) {
	wp_nonce_field( 'info_salva', 'info_nonce' );
	$id   = $post->ID;
	$kind = (string) info_get( $id, 'kind' );
	$pl   = (array) info_get( $id, 'platforms', array() );
	$tipo = (string) info_get( $id, 'contenuto_tipo' );
	echo '<style>.info-g{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:4px 18px}.info-f{margin:8px 0}</style><div class="info-g">';
	echo info_campo( 'Azienda', info_input( $id, 'azienda' ) ); // phpcs:ignore WordPress.Security.EscapeOutput
	echo info_campo( 'Sito dell’azienda', info_input( $id, 'sito_azienda', 'url' ) ); // phpcs:ignore WordPress.Security.EscapeOutput
	echo '<p class="info-f"><label><input type="checkbox" name="info[mostra_azienda]" value="1"' . checked( (bool) info_get( $id, 'mostra_azienda' ), true, false ) . '> Mostra il nome dell’azienda sul sito</label><br><span class="description">Spento: il nome si vede solo nell’app (consigliato).</span></p>';
	$o = '';
	foreach ( infn_tipi_offerta() as $k => $l ) {
		$o .= '<option value="' . esc_attr( $k ) . '"' . selected( $kind, $k, false ) . '>' . esc_html( $l ) . '</option>';
	}
	echo info_campo( 'Compenso', '<select name="info[kind]" class="widefat"><option value="">— scegli —</option>' . $o . '</select>' ); // phpcs:ignore WordPress.Security.EscapeOutput
	echo info_campo( 'Importo (€ + IVA)', info_input( $id, 'fee_amount', 'number', 'min="0" step="1"' ), 'Solo per compenso in denaro.' ); // phpcs:ignore WordPress.Security.EscapeOutput
	echo info_campo( 'Prodotto in cambio merce', info_input( $id, 'product_desc' ) ); // phpcs:ignore WordPress.Security.EscapeOutput
	echo info_campo( 'Valore del prodotto (€)', info_input( $id, 'product_value', 'number', 'min="0" step="1"' ) ); // phpcs:ignore WordPress.Security.EscapeOutput
	echo info_campo( 'Percentuale sulle vendite (%)', info_input( $id, 'commission_pct', 'number', 'min="0" max="100" step="0.5"' ) ); // phpcs:ignore WordPress.Security.EscapeOutput
	$c = '';
	foreach ( infn_piattaforme() as $k => $l ) {
		$c .= '<label style="margin-right:12px"><input type="checkbox" name="info[platforms][]" value="' . esc_attr( $k ) . '"' . checked( in_array( $k, $pl, true ), true, false ) . '> ' . esc_html( $l ) . '</label>';
	}
	echo '<p class="info-f"><b>Piattaforme</b><br>' . $c . '</p>'; // phpcs:ignore WordPress.Security.EscapeOutput
	$t = '';
	foreach ( infn_tipi_contenuto() as $k => $l ) {
		$t .= '<option value="' . esc_attr( $k ) . '"' . selected( $tipo, $k, false ) . '>' . esc_html( $l ) . '</option>';
	}
	echo info_campo( 'Quanti contenuti', info_input( $id, 'contenuto_qty', 'number', 'min="1" step="1"' ) ); // phpcs:ignore WordPress.Security.EscapeOutput
	echo info_campo( 'Tipo di contenuto', '<select name="info[contenuto_tipo]" class="widefat"><option value="">— scegli —</option>' . $t . '</select>' ); // phpcs:ignore WordPress.Security.EscapeOutput
	echo info_campo( 'Da pubblicare entro (giorni dall’accordo)', info_input( $id, 'contenuto_giorni', 'number', 'min="1" step="1"' ) ); // phpcs:ignore WordPress.Security.EscapeOutput
	echo info_campo( 'Città', info_input( $id, 'citta', 'text', 'list="info-citta"' ), 'Vuoto = tutta Italia. Milano, Roma, Torino, Napoli, Bologna e Firenze compaiono anche nella loro pagina.' ); // phpcs:ignore WordPress.Security.EscapeOutput
	echo '<datalist id="info-citta">';
	foreach ( info_citta_pagine() as $n ) {
		echo '<option value="' . esc_attr( $n ) . '">';
	}
	echo '<option value="Tutta Italia"><option value="Da remoto"></datalist>';
	echo info_campo( 'Candidature entro', info_input( $id, 'apply_by', 'date' ), 'Il giorno dopo l’offerta si chiude da sola.' ); // phpcs:ignore WordPress.Security.EscapeOutput
	echo info_campo( 'Creator cercati', info_input( $id, 'max_creators', 'number', 'min="1" step="1"' ) ); // phpcs:ignore WordPress.Security.EscapeOutput
	echo info_campo( 'Link dell’offerta nell’app', info_input( $id, 'app_url', 'url' ), 'Se l’offerta esiste già nell’app: il pulsante «Candidati» porta lì. Vuoto = iscrizione creator.' ); // phpcs:ignore WordPress.Security.EscapeOutput
	echo '</div>';
}

function info_box_stato( $post ) {
	$id     = $post->ID;
	$chiusa = (string) info_get( $id, 'chiusa' );
	$fonti  = array( 'team' => 'Inserita dal team', 'sito_azienda' => 'Mandata da un’azienda dal sito', 'jobmanager' => 'Importata da WP Job Manager' );
	$f      = (string) info_get( $id, 'fonte', 'team' );
	echo '<p>' . esc_html( isset( $fonti[ $f ] ) ? $fonti[ $f ] : $f ) . '</p>';
	echo '<p><label><b>Offerta chiusa</b><br><select name="info[chiusa]" class="widefat"><option value="">No, aperta</option><option value="assegnata"' . selected( $chiusa, 'assegnata', false ) . '>Sì: creator scelti</option><option value="scaduta"' . selected( $chiusa, 'scaduta', false ) . '>Sì: scaduta</option></select></label></p>';
	if ( 'publish' === $post->post_status ) {
		echo '<p><a href="' . esc_url( home_url( info_path( $post ) ) ) . '" target="_blank" rel="noopener">Apri la pagina sul sito ↗</a></p>';
	}
	$app = (string) info_get( $id, 'app_stato' );
	echo '<p class="description">Candidature: solo nell’app. ' . ( info_app_endpoint() ? 'Invio all’app: ' . esc_html( $app ? $app : 'alla pubblicazione' ) : 'Invio automatico all’app non ancora attivo.' ) . '</p>';
}

function info_box_privati( $post ) {
	$id = $post->ID;
	echo '<div class="info-g">';
	echo info_campo( 'Nome del referente', info_input( $id, 'contatto_nome' ) ); // phpcs:ignore WordPress.Security.EscapeOutput
	echo info_campo( 'Email', info_input( $id, 'contatto_email', 'email' ) ); // phpcs:ignore WordPress.Security.EscapeOutput
	echo info_campo( 'Telefono', info_input( $id, 'contatto_tel', 'tel' ) ); // phpcs:ignore WordPress.Security.EscapeOutput
	echo '</div>';
	echo info_campo( 'Note interne', '<textarea name="info[note]" class="widefat" rows="3">' . esc_textarea( (string) info_get( $id, 'note' ) ) . '</textarea>' ); // phpcs:ignore WordPress.Security.EscapeOutput
}

add_action(
	'save_post_' . INFO_CPT,
	function ( $post_id, $post ) {
		if ( ! isset( $_POST['info_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['info_nonce'] ) ), 'info_salva' ) || ! current_user_can( 'edit_post', $post_id ) || wp_is_post_revision( $post_id ) || ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) ) {
			return;
		}
		$in = isset( $_POST['info'] ) && is_array( $_POST['info'] ) ? wp_unslash( $_POST['info'] ) : array(); // phpcs:ignore WordPress.Security.ValidatedSanitizedInput
		$num = function ( $k, $max = 1000000 ) use ( $in ) {
			return isset( $in[ $k ] ) && '' !== $in[ $k ] && is_numeric( $in[ $k ] ) ? (string) min( $max, max( 0, (float) $in[ $k ] ) ) : '';
		};
		$txt = function ( $k, $len = 200 ) use ( $in ) {
			return isset( $in[ $k ] ) ? mb_substr( sanitize_text_field( (string) $in[ $k ] ), 0, $len ) : '';
		};
		$kind = $txt( 'kind' );
		$tipo = $txt( 'contenuto_tipo' );
		$by   = $txt( 'apply_by', 10 );
		$val  = array(
			'azienda'          => $txt( 'azienda' ),
			'sito_azienda'     => isset( $in['sito_azienda'] ) ? esc_url_raw( (string) $in['sito_azienda'] ) : '',
			'mostra_azienda'   => empty( $in['mostra_azienda'] ) ? '' : '1',
			'kind'             => isset( infn_tipi_offerta()[ $kind ] ) ? $kind : '',
			'fee_amount'       => $num( 'fee_amount' ),
			'product_desc'     => $txt( 'product_desc', 300 ),
			'product_value'    => $num( 'product_value' ),
			'commission_pct'   => $num( 'commission_pct', 100 ),
			'platforms'        => array_values( array_intersect( isset( $in['platforms'] ) ? (array) $in['platforms'] : array(), array_keys( infn_piattaforme() ) ) ),
			'contenuto_qty'    => $num( 'contenuto_qty', 100 ),
			'contenuto_tipo'   => isset( infn_tipi_contenuto()[ $tipo ] ) ? $tipo : '',
			'contenuto_giorni' => $num( 'contenuto_giorni', 365 ),
			'citta'            => in_array( $txt( 'citta', 80 ), array( 'Tutta Italia' ), true ) ? '' : $txt( 'citta', 80 ),
			'apply_by'         => preg_match( '/^\d{4}-\d{2}-\d{2}$/', $by ) ? $by : '',
			'max_creators'     => $num( 'max_creators', 1000 ),
			'app_url'          => isset( $in['app_url'] ) ? esc_url_raw( (string) $in['app_url'] ) : '',
			'contatto_nome'    => $txt( 'contatto_nome' ),
			'contatto_email'   => isset( $in['contatto_email'] ) ? sanitize_email( (string) $in['contatto_email'] ) : '',
			'contatto_tel'     => $txt( 'contatto_tel', 40 ),
			'note'             => isset( $in['note'] ) ? mb_substr( sanitize_textarea_field( (string) $in['note'] ), 0, 2000 ) : '',
		);
		foreach ( $val as $k => $v ) {
			if ( '' === $v || array() === $v ) {
				delete_post_meta( $post_id, '_info_' . $k );
			} else {
				update_post_meta( $post_id, '_info_' . $k, $v );
			}
		}
		$ch  = $txt( 'chiusa' );
		$era = (string) get_post_meta( $post_id, '_info_chiusa', true );
		if ( in_array( $ch, array( 'assegnata', 'scaduta' ), true ) ) {
			update_post_meta( $post_id, '_info_chiusa', $ch );
			if ( ! $era ) {
				update_post_meta( $post_id, '_info_chiusa_il', current_time( 'Y-m-d' ) );
			}
		} else {
			delete_post_meta( $post_id, '_info_chiusa' );
			delete_post_meta( $post_id, '_info_chiusa_il' );
		}
		if ( ! get_post_meta( $post_id, '_info_fonte', true ) ) {
			update_post_meta( $post_id, '_info_fonte', 'team' );
		}
		do_action( 'info_salvata', get_post( $post_id ) );
	},
	10,
	2
);

/* Avviso se si pubblica un'offerta senza i dati che servono ai creator */
add_action(
	'admin_notices',
	function () {
		$s = get_current_screen();
		if ( ! $s || INFO_CPT !== $s->post_type || 'post' !== $s->base || empty( $_GET['post'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification
			return;
		}
		$id    = (int) $_GET['post']; // phpcs:ignore WordPress.Security.NonceVerification
		$manca = array();
		foreach ( array( 'kind' => 'compenso', 'platforms' => 'piattaforme', 'apply_by' => 'scadenza delle candidature' ) as $k => $l ) {
			if ( ! info_get( $id, $k ) ) {
				$manca[] = $l;
			}
		}
		if ( $manca && 'publish' === get_post_status( $id ) ) {
			echo '<div class="notice notice-warning"><p>Offerta pubblicata senza: <b>' . esc_html( implode( ', ', $manca ) ) . '</b>. I creator vedono una scheda incompleta.</p></div>';
		}
		if ( 'publish' === get_post_status( $id ) && info_chiusa( $id ) ) {
			echo '<div class="notice notice-info"><p>Offerta chiusa: sul sito si vede con «Offerta chiusa» per 30 giorni, poi porta alla pagina della città.</p></div>';
		}
	}
);

/* ─── Elenco ─── */

add_filter(
	'manage_' . INFO_CPT . '_posts_columns',
	function ( $c ) {
		$date = $c['date'];
		unset( $c['date'] );
		return array_merge( $c, array( 'info_azienda' => 'Azienda', 'info_compenso' => 'Compenso', 'info_citta' => 'Città', 'info_scadenza' => 'Candidature entro', 'info_stato' => 'Stato', 'info_fonte' => 'Da', 'date' => $date ) );
	}
);

add_action(
	'manage_' . INFO_CPT . '_posts_custom_column',
	function ( $col, $id ) {
		$p = get_post( $id );
		switch ( $col ) {
			case 'info_azienda':
				echo esc_html( (string) info_get( $id, 'azienda', '—' ) );
				break;
			case 'info_compenso':
				$a = info_normalizza( $p );
				echo esc_html( $a['compenso'] ? $a['compenso'] : '—' );
				break;
			case 'info_citta':
				echo esc_html( (string) info_get( $id, 'citta', 'Tutta Italia' ) );
				break;
			case 'info_scadenza':
				$by = (string) info_get( $id, 'apply_by' );
				echo esc_html( $by ? date_i18n( 'j M Y', strtotime( $by ) ) : '—' );
				break;
			case 'info_stato':
				$c = info_chiusa( $id );
				$s = array( 'publish' => '🟢 Online', 'pending' => '🟡 Da rivedere', 'draft' => '⚪ Bozza', 'future' => '🕒 Programmata' );
				echo esc_html( $c && 'publish' === $p->post_status ? ( 'assegnata' === $c ? '⚫ Chiusa (assegnata)' : '⚫ Scaduta' ) : ( isset( $s[ $p->post_status ] ) ? $s[ $p->post_status ] : $p->post_status ) );
				break;
			case 'info_fonte':
				$f = (string) info_get( $id, 'fonte', 'team' );
				echo esc_html( array( 'team' => 'Team', 'sito_azienda' => 'Azienda (sito)', 'jobmanager' => 'Job Manager' )[ $f ] ?? $f );
				break;
		}
	},
	10,
	2
);

/* Numero delle offerte da rivedere accanto al menu */
add_action(
	'admin_menu',
	function () {
		global $menu;
		$n = (int) wp_count_posts( INFO_CPT )->pending;
		if ( ! $n || ! is_array( $menu ) ) {
			return;
		}
		foreach ( $menu as $i => $m ) {
			if ( isset( $m[2] ) && 'edit.php?post_type=' . INFO_CPT === $m[2] ) {
				$menu[ $i ][0] .= ' <span class="awaiting-mod">' . $n . '</span>'; // phpcs:ignore WordPress.WP.GlobalVariablesOverride
			}
		}
	},
	99
);

/* ─── Strumenti: importazione da WP Job Manager e collegamento all'app ─── */

add_action(
	'admin_menu',
	function () {
		add_submenu_page( 'edit.php?post_type=' . INFO_CPT, 'Importa e collega', 'Importa e collega', 'manage_options', 'info-strumenti', 'info_pagina_strumenti' );
	}
);

/** Importa le offerte di WP Job Manager pubblicate dopo $da (Y-m-d) come bozze. Restituisce quante. */
function info_importa_wpjm( $da ) {
	if ( ! post_type_exists( 'job_listing' ) ) {
		return new WP_Error( 'info_wpjm', 'WP Job Manager non è attivo: niente da importare.' );
	}
	$n = 0;
	foreach ( get_posts( array( 'post_type' => 'job_listing', 'post_status' => 'publish', 'numberposts' => 200, 'date_query' => array( array( 'after' => $da, 'inclusive' => true ) ) ) ) as $j ) {
		$gia = get_posts( array( 'post_type' => INFO_CPT, 'post_status' => 'any', 'numberposts' => 1, 'fields' => 'ids', 'meta_key' => '_info_wpjm_id', 'meta_value' => $j->ID ) ); // phpcs:ignore WordPress.DB.SlowDBQuery
		if ( $gia ) {
			continue;
		}
		$tipi = wp_get_post_terms( $j->ID, 'job_listing_type', array( 'fields' => 'names' ) );
		$tipi = is_wp_error( $tipi ) ? '' : strtolower( implode( ' ', $tipi ) );
		$kind = false !== strpos( $tipi, 'merc' ) ? 'product_gifting' : ( false !== strpos( $tipi, 'vendit' ) ? 'affiliate_commission' : '' );
		$loc  = (string) get_post_meta( $j->ID, '_job_location', true );
		$id   = wp_insert_post(
			array(
				'post_type'    => INFO_CPT,
				'post_status'  => 'draft',
				'post_title'   => wp_strip_all_tags( get_the_title( $j ) ),
				'post_content' => wp_kses_post( $j->post_content ),
				'post_name'    => sanitize_title( get_the_title( $j ) ),
			),
			true
		);
		if ( is_wp_error( $id ) ) {
			continue;
		}
		$app  = (string) get_post_meta( $j->ID, '_application', true );
		$meta = array(
			'azienda'        => (string) get_post_meta( $j->ID, '_company_name', true ),
			'sito_azienda'   => esc_url_raw( (string) get_post_meta( $j->ID, '_company_website', true ) ),
			'kind'           => $kind,
			'citta'          => in_array( strtolower( $loc ), array( 'web', 'italia', 'online', '' ), true ) ? '' : $loc,
			'contatto_email' => is_email( $app ) ? $app : '',
			'note'           => 'Importata da WP Job Manager (' . get_the_date( 'j/m/Y', $j ) . ', tipo: ' . ( $tipi ? $tipi : 'n.d.' ) . '). Controlla compenso, piattaforme e scadenza prima di pubblicare.' . ( $app && ! is_email( $app ) ? ' Candidature: ' . esc_url_raw( $app ) : '' ),
			'fonte'          => 'jobmanager',
			'wpjm_id'        => (int) $j->ID,
			'wpjm_slug'      => $j->post_name,
		);
		foreach ( $meta as $k => $v ) {
			if ( '' !== $v ) {
				update_post_meta( $id, '_info_' . $k, $v );
			}
		}
		++$n;
	}
	return $n;
}

function info_pagina_strumenti() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}
	$msg = '';
	if ( isset( $_POST['info_azione'] ) && check_admin_referer( 'info_strumenti' ) ) {
		if ( 'importa' === $_POST['info_azione'] ) {
			$da  = isset( $_POST['info_da'] ) && preg_match( '/^\d{4}-\d{2}-\d{2}$/', (string) $_POST['info_da'] ) ? (string) $_POST['info_da'] : '2026-01-01';
			$r   = info_importa_wpjm( $da );
			$msg = is_wp_error( $r ) ? $r->get_error_message() : $r . ' offerte importate come bozze (dal ' . date_i18n( 'j/m/Y', strtotime( $da ) ) . ').';
		} elseif ( 'collega' === $_POST['info_azione'] ) {
			update_option( 'info_app_endpoint', isset( $_POST['info_endpoint'] ) ? esc_url_raw( wp_unslash( (string) $_POST['info_endpoint'] ) ) : '', false );
			$msg = 'Salvato.';
		}
	}
	$wpjm = post_type_exists( 'job_listing' ) ? (int) wp_count_posts( 'job_listing' )->publish : 0;
	echo '<div class="wrap"><h1>Offerte: importa e collega</h1>';
	if ( $msg ) {
		echo '<div class="notice notice-success"><p>' . esc_html( $msg ) . '</p></div>';
	}
	echo '<h2>1. Importa da WP Job Manager</h2>';
	if ( post_type_exists( 'job_listing' ) ) {
		echo '<p>In WP Job Manager ci sono <b>' . (int) $wpjm . '</b> offerte pubblicate. Si importano come <b>bozze</b> (nessuna va online da sola) quelle pubblicate dalla data scelta; i contatti per candidarsi restano riservati. Rifare l’importazione non crea doppioni.</p>';
		echo '<form method="post">';
		wp_nonce_field( 'info_strumenti' );
		echo '<input type="hidden" name="info_azione" value="importa"><label>Pubblicate dal <input type="date" name="info_da" value="2026-01-01"></label> ';
		submit_button( 'Importa come bozze', 'primary', 'submit', false );
		echo '</form>';
		echo '<p class="description">Dopo l’importazione WP Job Manager si può disattivare: i suoi indirizzi /offerta-lavoro/… portano in automatico alla bacheca (o all’offerta importata, se pubblicata).</p>';
	} else {
		echo '<p>WP Job Manager non è attivo. I vecchi indirizzi /offerta-lavoro/… portano alla bacheca.</p>';
	}
	echo '<h2>2. Collegamento all’app</h2><p>Indirizzo dell’app che riceve le offerte pubblicate dal sito (firmate con il segreto di Influencee Annunci). Quando c’è, il pulsante «Candidati» porta all’offerta nell’app; finché manca porta all’iscrizione creator.</p>';
	if ( defined( 'INFLUENCEE_OFFERTE_APP' ) ) {
		echo '<p>Impostato in wp-config.php: <code>' . esc_html( INFLUENCEE_OFFERTE_APP ) . '</code></p>';
	} else {
		echo '<form method="post">';
		wp_nonce_field( 'info_strumenti' );
		echo '<input type="hidden" name="info_azione" value="collega"><input type="url" class="regular-text" name="info_endpoint" placeholder="https://app.influencee.it/annunci/da-sito/" value="' . esc_attr( (string) get_option( 'info_app_endpoint', '' ) ) . '"> ';
		submit_button( 'Salva', 'secondary', 'submit', false );
		echo '</form>';
	}
	echo '</div>';
}
