<?php
/**
 * Pulizie, una per voce. Ognuna conta prima cosa toglierebbe e lavora a lotti (al massimo 500 elementi per giro),
 * così una pulizia non blocca un sito lento: se resta qualcosa si ripete.
 * Nessuna tocca contenuti pubblicati, utenti, ordini o lead.
 */

defined( 'ABSPATH' ) || exit;

define( 'INFZ_LOTTO', 500 );
define( 'INFZ_REVISIONI_DA_TENERE', 5 );

/** Le voci di pulizia: etichetta, perché, contatore e azione. */
function infz_voci() {
	return array(
		'revisioni'        => array(
			'label'  => 'Revisioni vecchie degli articoli e delle pagine',
			'perche' => 'Restano le ultime ' . INFZ_REVISIONI_DA_TENERE . ' di ogni contenuto; le altre appesantiscono il database.',
			'conta'  => 'infz_conta_revisioni',
			'pulisci' => 'infz_pulisci_revisioni',
		),
		'bozze_auto'       => array(
			'label'  => 'Bozze automatiche più vecchie di 7 giorni',
			'perche' => 'WordPress le crea quando apri «Aggiungi nuovo» e non le usa più.',
			'conta'  => 'infz_conta_bozze_auto',
			'pulisci' => 'infz_pulisci_bozze_auto',
		),
		'cestino'          => array(
			'label'  => 'Contenuti nel cestino da più di 30 giorni',
			'perche' => 'Sono già stati cestinati; WordPress li toglierebbe comunque.',
			'conta'  => 'infz_conta_cestino',
			'pulisci' => 'infz_pulisci_cestino',
		),
		'commenti'         => array(
			'label'  => 'Commenti spam e nel cestino',
			'perche' => 'Non si vedono da nessuna parte.',
			'conta'  => 'infz_conta_commenti',
			'pulisci' => 'infz_pulisci_commenti',
		),
		'transient'        => array(
			'label'  => 'Dati temporanei scaduti (transient)',
			'perche' => 'Cache dei plugin già scadute che restano nel database.',
			'conta'  => 'infz_conta_transient',
			'pulisci' => 'infz_pulisci_transient',
		),
		'meta_orfani'      => array(
			'label'  => 'Dati di contenuti che non esistono più (postmeta orfani)',
			'perche' => 'Righe rimaste dopo aver cancellato articoli o pagine.',
			'conta'  => 'infz_conta_meta_orfani',
			'pulisci' => 'infz_pulisci_meta_orfani',
		),
		'action_scheduler' => array(
			'label'  => 'Registro delle attività pianificate già finite (più di 30 giorni)',
			'perche' => 'Tabelle di Action Scheduler (usato da Brevo, WooCommerce e altri) che crescono senza limite.',
			'conta'  => 'infz_conta_action_scheduler',
			'pulisci' => 'infz_pulisci_action_scheduler',
		),
		'file_rimasti'     => array(
			'label'  => 'File rimasti da installazioni e aggiornamenti',
			'perche' => 'Zip in wp-content/plugins e cartelle temporanee in wp-content/upgrade e upgrade-temp-backup.',
			'conta'  => 'infz_conta_file_rimasti',
			'pulisci' => 'infz_pulisci_file_rimasti',
		),
		'elementor_css'    => array(
			'label'  => 'File CSS generati da Elementor',
			'perche' => 'Elementor li rigenera alla prossima visita, aggiornati: utile dopo aver tolto plugin o widget.',
			'conta'  => 'infz_conta_elementor_css',
			'pulisci' => 'infz_pulisci_elementor_css',
		),
		'ottimizza'        => array(
			'label'  => 'Ottimizza le tabelle con spazio libero',
			'perche' => 'Recupera lo spazio lasciato dalle righe cancellate. Fallo dopo le altre pulizie, in un orario tranquillo.',
			'conta'  => 'infz_conta_ottimizza',
			'pulisci' => 'infz_pulisci_ottimizza',
		),
	);
}

/** Esegue le voci scelte. Restituisce per ogni voce quanti elementi ha tolto e quanti ne restano. */
function infz_pulisci( $voci, $chi = 'pagina' ) {
	$tutte = infz_voci();
	$fatto = array();
	foreach ( (array) $voci as $k ) {
		if ( ! isset( $tutte[ $k ] ) ) {
			continue;
		}
		$tolti       = (int) call_user_func( $tutte[ $k ]['pulisci'] );
		$fatto[ $k ] = array( 'tolti' => $tolti, 'restano' => (int) call_user_func( $tutte[ $k ]['conta'] ) );
	}
	if ( $fatto ) {
		wp_cache_flush();
		$testo = array();
		foreach ( $fatto as $k => $f ) {
			$testo[] = $k . ' ' . $f['tolti'] . ( $f['restano'] ? ' (restano ' . $f['restano'] . ')' : '' );
		}
		infz_log( $chi, array_keys( $fatto ), implode( '; ', $testo ) );
	}
	return $fatto;
}

/* ─── Revisioni ─── */

/** ID delle revisioni oltre le ultime N per contenuto. */
function infz_revisioni_in_piu( $limite ) {
	global $wpdb;
	$genitori = $wpdb->get_col( $wpdb->prepare( "SELECT post_parent FROM {$wpdb->posts} WHERE post_type = 'revision' GROUP BY post_parent HAVING COUNT(*) > %d", INFZ_REVISIONI_DA_TENERE ) ); // phpcs:ignore
	$ids      = array();
	foreach ( $genitori as $g ) {
		$tutte = $wpdb->get_col( $wpdb->prepare( "SELECT ID FROM {$wpdb->posts} WHERE post_type = 'revision' AND post_parent = %d ORDER BY post_date DESC, ID DESC", $g ) ); // phpcs:ignore
		$ids   = array_merge( $ids, array_slice( $tutte, INFZ_REVISIONI_DA_TENERE ) );
		if ( $limite && count( $ids ) >= $limite ) {
			return array_slice( $ids, 0, $limite );
		}
	}
	return $ids;
}
function infz_conta_revisioni() {
	return count( infz_revisioni_in_piu( 0 ) );
}
function infz_pulisci_revisioni() {
	$n = 0;
	foreach ( infz_revisioni_in_piu( INFZ_LOTTO ) as $id ) {
		$n += wp_delete_post_revision( (int) $id ) ? 1 : 0;
	}
	return $n;
}

/* ─── Bozze automatiche e cestino ─── */

function infz_ids_post( $where, $limite ) {
	global $wpdb;
	return $wpdb->get_col( "SELECT ID FROM {$wpdb->posts} WHERE {$where}" . ( $limite ? ' LIMIT ' . (int) $limite : '' ) ); // phpcs:ignore
}
function infz_where_bozze() {
	return "post_status = 'auto-draft' AND post_date < '" . esc_sql( gmdate( 'Y-m-d H:i:s', time() - 7 * DAY_IN_SECONDS ) ) . "'";
}
function infz_where_cestino() {
	return "post_status = 'trash' AND post_modified < '" . esc_sql( gmdate( 'Y-m-d H:i:s', time() - 30 * DAY_IN_SECONDS ) ) . "'";
}
function infz_conta_bozze_auto() {
	return count( infz_ids_post( infz_where_bozze(), 0 ) );
}
function infz_pulisci_bozze_auto() {
	$n = 0;
	foreach ( infz_ids_post( infz_where_bozze(), INFZ_LOTTO ) as $id ) {
		$n += wp_delete_post( (int) $id, true ) ? 1 : 0;
	}
	return $n;
}
function infz_conta_cestino() {
	return count( infz_ids_post( infz_where_cestino(), 0 ) );
}
function infz_pulisci_cestino() {
	$n = 0;
	foreach ( infz_ids_post( infz_where_cestino(), INFZ_LOTTO ) as $id ) {
		$n += wp_delete_post( (int) $id, true ) ? 1 : 0;
	}
	return $n;
}

/* ─── Commenti ─── */

function infz_conta_commenti() {
	global $wpdb;
	return (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$wpdb->comments} WHERE comment_approved IN ('spam','trash')" ); // phpcs:ignore
}
function infz_pulisci_commenti() {
	global $wpdb;
	$n = 0;
	foreach ( $wpdb->get_col( "SELECT comment_ID FROM {$wpdb->comments} WHERE comment_approved IN ('spam','trash') LIMIT " . INFZ_LOTTO ) as $id ) { // phpcs:ignore
		$n += wp_delete_comment( (int) $id, true ) ? 1 : 0;
	}
	return $n;
}

/* ─── Transient scaduti ─── */

function infz_conta_transient() {
	global $wpdb;
	return (int) $wpdb->get_var( $wpdb->prepare( "SELECT COUNT(*) FROM {$wpdb->options} WHERE (option_name LIKE %s OR option_name LIKE %s) AND option_value < %d", $wpdb->esc_like( '_transient_timeout_' ) . '%', $wpdb->esc_like( '_site_transient_timeout_' ) . '%', time() ) ); // phpcs:ignore
}
function infz_pulisci_transient() {
	$prima = infz_conta_transient();
	delete_expired_transients( true );
	return max( 0, $prima - infz_conta_transient() );
}

/* ─── Postmeta orfani ─── */

function infz_conta_meta_orfani() {
	global $wpdb;
	return (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$wpdb->postmeta} pm LEFT JOIN {$wpdb->posts} p ON p.ID = pm.post_id WHERE p.ID IS NULL" ); // phpcs:ignore
}
function infz_pulisci_meta_orfani() {
	global $wpdb;
	$ids = $wpdb->get_col( "SELECT pm.meta_id FROM {$wpdb->postmeta} pm LEFT JOIN {$wpdb->posts} p ON p.ID = pm.post_id WHERE p.ID IS NULL LIMIT " . INFZ_LOTTO ); // phpcs:ignore
	if ( ! $ids ) {
		return 0;
	}
	return (int) $wpdb->query( "DELETE FROM {$wpdb->postmeta} WHERE meta_id IN (" . implode( ',', array_map( 'intval', $ids ) ) . ')' ); // phpcs:ignore
}

/* ─── Action Scheduler ─── */

function infz_as_tabelle() {
	global $wpdb;
	$t = $wpdb->prefix . 'actionscheduler_actions';
	return $t === $wpdb->get_var( $wpdb->prepare( 'SHOW TABLES LIKE %s', $t ) ) ? array( $t, $wpdb->prefix . 'actionscheduler_logs' ) : null;
}
function infz_as_where() {
	return "status IN ('complete','failed','canceled') AND scheduled_date_gmt < '" . esc_sql( gmdate( 'Y-m-d H:i:s', time() - 30 * DAY_IN_SECONDS ) ) . "'";
}
function infz_conta_action_scheduler() {
	global $wpdb;
	$t = infz_as_tabelle();
	return $t ? (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$t[0]} WHERE " . infz_as_where() ) : 0; // phpcs:ignore
}
function infz_pulisci_action_scheduler() {
	global $wpdb;
	$t = infz_as_tabelle();
	if ( ! $t ) {
		return 0;
	}
	$ids = $wpdb->get_col( "SELECT action_id FROM {$t[0]} WHERE " . infz_as_where() . ' LIMIT ' . ( INFZ_LOTTO * 4 ) ); // phpcs:ignore
	if ( ! $ids ) {
		return 0;
	}
	$in = implode( ',', array_map( 'intval', $ids ) );
	$wpdb->query( "DELETE FROM {$t[1]} WHERE action_id IN ({$in})" ); // phpcs:ignore
	return (int) $wpdb->query( "DELETE FROM {$t[0]} WHERE action_id IN ({$in})" ); // phpcs:ignore
}

/* ─── File rimasti ─── */

/** Solo questi posti: zip nella cartella dei plugin e il contenuto delle due cartelle temporanee di WordPress. */
function infz_file_rimasti() {
	$out    = array();
	$limite = time() - HOUR_IN_SECONDS; // un aggiornamento in corso non si tocca
	foreach ( (array) glob( WP_PLUGIN_DIR . '/*.zip' ) as $f ) {
		if ( is_file( $f ) && filemtime( $f ) < $limite ) {
			$out[] = $f;
		}
	}
	foreach ( array( WP_CONTENT_DIR . '/upgrade', WP_CONTENT_DIR . '/upgrade-temp-backup' ) as $dir ) {
		foreach ( (array) glob( $dir . '/*' ) as $f ) {
			if ( basename( $f ) !== 'index.php' && filemtime( $f ) < $limite ) {
				$out[] = $f;
			}
		}
	}
	return $out;
}
function infz_conta_file_rimasti() {
	return count( infz_file_rimasti() );
}
function infz_pulisci_file_rimasti() {
	global $wp_filesystem;
	require_once ABSPATH . 'wp-admin/includes/file.php';
	if ( ! WP_Filesystem() ) {
		return 0;
	}
	$consentite = array( realpath( WP_PLUGIN_DIR ), realpath( WP_CONTENT_DIR . '/upgrade' ), realpath( WP_CONTENT_DIR . '/upgrade-temp-backup' ) );
	$n          = 0;
	foreach ( array_slice( infz_file_rimasti(), 0, INFZ_LOTTO ) as $f ) {
		$padre = realpath( dirname( $f ) );
		if ( ! $padre || ! in_array( $padre, $consentite, true ) || is_link( $f ) ) {
			continue; // mai fuori da queste tre cartelle, mai collegamenti
		}
		if ( dirname( $f ) === WP_PLUGIN_DIR && '.zip' !== strtolower( substr( $f, -4 ) ) ) {
			continue; // nella cartella dei plugin solo gli zip
		}
		$n += $wp_filesystem->delete( $f, true ) ? 1 : 0;
	}
	return $n;
}

/* ─── Elementor ─── */

function infz_conta_elementor_css() {
	$dir = wp_upload_dir( null, false );
	$css = $dir['basedir'] . '/elementor/css';
	return is_dir( $css ) ? count( (array) glob( $css . '/*.css' ) ) : 0;
}
function infz_pulisci_elementor_css() {
	$prima = infz_conta_elementor_css();
	if ( class_exists( '\Elementor\Plugin' ) && isset( \Elementor\Plugin::$instance->files_manager ) ) {
		\Elementor\Plugin::$instance->files_manager->clear_cache();
		return $prima;
	}
	return 0;
}

/* ─── Ottimizzazione tabelle ─── */

/** Tabelle del sito con almeno 1 MB di spazio libero. */
function infz_tabelle_da_ottimizzare() {
	global $wpdb;
	return (array) $wpdb->get_col( $wpdb->prepare( 'SELECT table_name FROM information_schema.tables WHERE table_schema = %s AND table_name LIKE %s AND data_free > 1048576', DB_NAME, $wpdb->esc_like( $wpdb->prefix ) . '%' ) ); // phpcs:ignore
}
function infz_conta_ottimizza() {
	return count( infz_tabelle_da_ottimizzare() );
}
function infz_pulisci_ottimizza() {
	global $wpdb;
	$n = 0;
	foreach ( array_slice( infz_tabelle_da_ottimizzare(), 0, 10 ) as $t ) {
		if ( preg_match( '/^[A-Za-z0-9_]+$/', $t ) ) {
			$n += false !== $wpdb->query( "OPTIMIZE TABLE `{$t}`" ) ? 1 : 0; // phpcs:ignore
		}
	}
	return $n;
}
