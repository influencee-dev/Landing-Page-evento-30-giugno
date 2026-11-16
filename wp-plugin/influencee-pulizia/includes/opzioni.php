<?php
/**
 * Riparazione della tabella delle impostazioni (16/11/2026). Sul sito la tabella wp_options aveva perso chiave primaria e
 * indice unico: 207.594 righe invece di poco più di mille (le impostazioni del plugin d'immagini «Image Optimizer», non
 * più installato, ripetute 77.268 volte) e ogni pagina non in cache ne caricava più di 200.000.
 *
 * COME (niente si cancella): si crea una tabella nuova con lo schema standard di WordPress (chiave primaria, nome
 * unico, indice su autoload), ci si copia una riga per impostazione (la più recente), senza le impostazioni di
 * Image Optimizer; si controlla che sia giusta; poi in un solo passo la tabella vecchia viene rinominata in
 * <prefisso>options_prima_<data> e la nuova prende il suo posto. «Ripristina» rimette la vecchia in un passo.
 */

defined( 'ABSPATH' ) || exit;

/** Impostazioni da non copiare: plugin non installati che riempivano la tabella. */
function infz_opz_escluse_sql() {
	return "option_name NOT LIKE 'image\\_optimizer\\_%'";
}

/** Stato attuale: chiave, indice, righe, nomi doppi, copia di sicurezza presente. */
function infz_opz_stato() {
	global $wpdb;
	$t      = $wpdb->options;
	$chiave = false;
	$unico  = false;
	foreach ( (array) $wpdb->get_results( "SHOW INDEX FROM {$t}", ARRAY_A ) as $i ) { // phpcs:ignore
		$chiave = $chiave || 'PRIMARY' === $i['Key_name'];
		$unico  = $unico || ( 'option_name' === $i['Column_name'] && '0' === (string) $i['Non_unique'] );
	}
	return array(
		'righe'         => (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$t}" ), // phpcs:ignore
		'nomi'          => (int) $wpdb->get_var( "SELECT COUNT(DISTINCT option_name) FROM {$t}" ), // phpcs:ignore
		'chiave'        => $chiave,
		'indice_unico'  => $unico,
		'da_riparare'   => ! $chiave || ! $unico,
		'copia'         => (string) get_option( 'infz_opz_copia', '' ),
	);
}

function infz_opz_tabella_esiste( $nome ) {
	global $wpdb;
	return $nome === $wpdb->get_var( $wpdb->prepare( 'SHOW TABLES LIKE %s', $wpdb->esc_like( $nome ) ) );
}

/** Ripara. Restituisce array( 'ok' => bool, 'messaggio' => string ). */
function infz_opz_ripara() {
	global $wpdb;
	$t     = $wpdb->options;
	$nuova = $t . '_nuova';
	$copia = $t . '_prima_' . gmdate( 'Ymd_His' );
	$stato = infz_opz_stato();
	if ( ! $stato['da_riparare'] ) {
		return array( 'ok' => false, 'messaggio' => 'La tabella ha già chiave primaria e indice unico: niente da riparare.' );
	}
	$lung = (int) $wpdb->get_var( "SELECT MAX(CHAR_LENGTH(option_name)) FROM {$t}" ); // phpcs:ignore
	if ( $lung > 191 ) {
		return array( 'ok' => false, 'messaggio' => "Un nome di impostazione è lungo {$lung} caratteri (massimo 191): riparazione fermata, niente cambiato." );
	}
	@set_time_limit( 600 ); // phpcs:ignore WordPress.PHP.NoSilencedErrors
	$wpdb->query( "DROP TABLE IF EXISTS {$nuova}" ); // phpcs:ignore
	$ok = $wpdb->query(
		"CREATE TABLE {$nuova} (
		option_id bigint(20) unsigned NOT NULL auto_increment,
		option_name varchar(191) NOT NULL default '',
		option_value longtext NOT NULL,
		autoload varchar(20) NOT NULL default 'yes',
		PRIMARY KEY  (option_id),
		UNIQUE KEY option_name (option_name),
		KEY autoload (autoload)
		) " . $wpdb->get_charset_collate()
	); // phpcs:ignore
	if ( false === $ok ) {
		return array( 'ok' => false, 'messaggio' => 'Non riesco a creare la tabella nuova: ' . $wpdb->last_error . '. Niente cambiato.' );
	}
	// una riga per nome: la più recente (option_id più alto) entra per prima, le altre sono ignorate dall'indice unico
	$copiate = $wpdb->query( "INSERT IGNORE INTO {$nuova} (option_name, option_value, autoload) SELECT option_name, option_value, autoload FROM {$t} WHERE " . infz_opz_escluse_sql() . ' ORDER BY option_id DESC' ); // phpcs:ignore
	if ( false === $copiate ) {
		$err = $wpdb->last_error;
		$wpdb->query( "DROP TABLE IF EXISTS {$nuova}" ); // phpcs:ignore
		return array( 'ok' => false, 'messaggio' => 'Copia non riuscita: ' . $err . '. Niente cambiato.' );
	}
	// controlli prima dello scambio
	$attese = (int) $wpdb->get_var( "SELECT COUNT(DISTINCT option_name) FROM {$t} WHERE " . infz_opz_escluse_sql() ); // phpcs:ignore
	$righe  = (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$nuova}" ); // phpcs:ignore
	$mancano = array();
	foreach ( array( 'siteurl', 'home', 'active_plugins', 'template', 'stylesheet', 'cron', 'permalink_structure', 'wp_user_roles' ) as $n ) {
		if ( null !== $wpdb->get_var( $wpdb->prepare( "SELECT option_id FROM {$t} WHERE option_name = %s LIMIT 1", $n ) ) // phpcs:ignore
			&& null === $wpdb->get_var( $wpdb->prepare( "SELECT option_id FROM {$nuova} WHERE option_name = %s", $n ) ) ) { // phpcs:ignore
			$mancano[] = $n;
		}
	}
	if ( $righe !== $attese || $mancano || $righe < 50 ) {
		$wpdb->query( "DROP TABLE IF EXISTS {$nuova}" ); // phpcs:ignore
		return array( 'ok' => false, 'messaggio' => "Controllo non superato (righe {$righe} su {$attese} attese" . ( $mancano ? ', mancano ' . implode( ', ', $mancano ) : '' ) . '). Niente cambiato.' );
	}
	// scambio in un solo passo: la vecchia resta come copia di sicurezza
	if ( false === $wpdb->query( "RENAME TABLE {$t} TO {$copia}, {$nuova} TO {$t}" ) ) { // phpcs:ignore
		$err = $wpdb->last_error;
		$wpdb->query( "DROP TABLE IF EXISTS {$nuova}" ); // phpcs:ignore
		return array( 'ok' => false, 'messaggio' => 'Scambio non riuscito: ' . $err . '. Niente cambiato.' );
	}
	wp_cache_flush();
	update_option( 'infz_opz_copia', $copia, false );
	$msg = sprintf( 'Tabella riparata: da %s righe a %s (una per impostazione). La tabella vecchia resta come %s.', number_format_i18n( $stato['righe'] ), number_format_i18n( $righe ), $copia );
	infz_log( 'pagina', array( 'ripara_opzioni' ), $msg );
	do_action( 'litespeed_purge_all' );
	return array( 'ok' => true, 'messaggio' => $msg );
}

/** Rimette la tabella com'era prima della riparazione. */
function infz_opz_ripristina() {
	global $wpdb;
	$t     = $wpdb->options;
	$copia = (string) get_option( 'infz_opz_copia', '' );
	if ( ! $copia || ! infz_opz_tabella_esiste( $copia ) ) {
		return array( 'ok' => false, 'messaggio' => 'Nessuna copia da ripristinare.' );
	}
	$scartata = $t . '_riparata_' . gmdate( 'Ymd_His' );
	if ( false === $wpdb->query( "RENAME TABLE {$t} TO {$scartata}, {$copia} TO {$t}" ) ) { // phpcs:ignore
		return array( 'ok' => false, 'messaggio' => 'Ripristino non riuscito: ' . $wpdb->last_error );
	}
	wp_cache_flush();
	update_option( 'infz_opz_copia', '', false );
	infz_log( 'pagina', array( 'ripristina_opzioni' ), "Tabella vecchia rimessa; quella riparata resta come {$scartata}." );
	do_action( 'litespeed_purge_all' );
	return array( 'ok' => true, 'messaggio' => "Tabella vecchia rimessa al suo posto. Quella riparata resta come {$scartata}." );
}

add_action(
	'admin_post_infz_opzioni',
	function () {
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( 'Non hai i permessi.' );
		}
		check_admin_referer( 'infz_opzioni' );
		if ( isset( $_POST['ripristina'] ) ) {
			$r = infz_opz_ripristina();
		} elseif ( empty( $_POST['backup_fatto'] ) ) {
			$r = array( 'ok' => false, 'messaggio' => 'Prima fai il backup del database e spunta la casella.' );
		} else {
			$r = infz_opz_ripara();
		}
		set_transient( 'infz_opz_esito_' . get_current_user_id(), $r, 600 );
		wp_safe_redirect( admin_url( 'tools.php?page=influencee-pulizia#opzioni' ) );
		exit;
	}
);

/** Riquadro in cima alla pagina Pulizia e velocità. */
function infz_opz_riquadro() {
	$s = infz_opz_stato();
	$e = get_transient( 'infz_opz_esito_' . get_current_user_id() );
	if ( $e ) {
		delete_transient( 'infz_opz_esito_' . get_current_user_id() );
		echo '<div class="notice ' . ( $e['ok'] ? 'notice-success' : 'notice-error' ) . '"><p>' . esc_html( $e['messaggio'] ) . '</p></div>';
	}
	echo '<h2 id="opzioni">0. Tabella delle impostazioni</h2>';
	echo '<p>Righe: <strong>' . esc_html( number_format_i18n( $s['righe'] ) ) . '</strong> per ' . esc_html( number_format_i18n( $s['nomi'] ) ) . ' impostazioni · chiave primaria: ' . ( $s['chiave'] ? 'sì' : '<strong style="color:#b32d2e">no</strong>' ) . ' · nome unico: ' . ( $s['indice_unico'] ? 'sì' : '<strong style="color:#b32d2e">no</strong>' ) . '</p>';
	echo '<form method="post" action="' . esc_url( admin_url( 'admin-post.php' ) ) . '">';
	echo '<input type="hidden" name="action" value="infz_opzioni">';
	wp_nonce_field( 'infz_opzioni' );
	if ( $s['da_riparare'] ) {
		echo '<p style="max-width:900px">La tabella ha perso chiave e indice: le stesse impostazioni sono ripetute migliaia di volte e ogni pagina non in cache è lenta. La riparazione crea una tabella nuova con una riga per impostazione (senza quelle di Image Optimizer, non più installato), la controlla e poi la mette al posto della vecchia. <strong>La vecchia non viene cancellata</strong>: resta come copia e si può rimettere con un clic.</p>';
		echo '<p><label><input type="checkbox" name="backup_fatto" value="1"> Ho fatto il backup completo del database dal pannello hosting</label></p>';
		echo '<p><button class="button button-primary" onclick="return confirm(\'Riparo la tabella delle impostazioni? Ci vuole circa un minuto: non chiudere la pagina.\');">Ripara la tabella delle impostazioni</button></p>';
	} else {
		echo '<p style="color:#008a20">La tabella è a posto.</p>';
	}
	if ( $s['copia'] && infz_opz_tabella_esiste( $s['copia'] ) ) {
		echo '<p>Copia della tabella prima della riparazione: <code>' . esc_html( $s['copia'] ) . '</code> <button class="button" name="ripristina" value="1" onclick="return confirm(\'Rimetto la tabella com era prima della riparazione?\');">Ripristina la tabella di prima</button></p>';
	}
	echo '</form>';
}
