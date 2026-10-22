<?php
/** Pagina Strumenti → Pulizia e velocità: controllo, pulizia con conferma, accorgimenti di velocità, registro. */

defined( 'ABSPATH' ) || exit;

add_action(
	'admin_menu',
	function () {
		add_management_page( 'Pulizia e velocità', 'Pulizia e velocità', 'manage_options', 'influencee-pulizia', 'infz_pagina' );
	}
);

add_filter(
	'plugin_action_links_influencee-pulizia/influencee-pulizia.php',
	function ( $l ) {
		array_unshift( $l, '<a href="' . esc_url( admin_url( 'tools.php?page=influencee-pulizia' ) ) . '">Apri</a>' );
		return $l;
	}
);

add_action(
	'admin_post_infz_pulisci',
	function () {
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( 'Non hai i permessi.' );
		}
		check_admin_referer( 'infz_pulisci' );
		$voci  = array_map( 'sanitize_key', (array) ( isset( $_POST['voci'] ) ? wp_unslash( $_POST['voci'] ) : array() ) );
		$fatto = infz_pulisci( $voci, 'pagina' );
		set_transient( 'infz_esito_' . get_current_user_id(), $fatto, 300 );
		wp_safe_redirect( admin_url( 'tools.php?page=influencee-pulizia&fatto=1' ) );
		exit;
	}
);

add_action(
	'admin_post_infz_velocita',
	function () {
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( 'Non hai i permessi.' );
		}
		check_admin_referer( 'infz_velocita' );
		$s = array();
		foreach ( array_keys( infz_velocita_voci() ) as $k ) {
			$s[ $k ] = ! empty( $_POST['v'][ $k ] ) ? 1 : 0;
		}
		update_option( 'infz_velocita', $s, true );
		do_action( 'litespeed_purge_all' );
		wp_safe_redirect( admin_url( 'tools.php?page=influencee-pulizia&salvato=1#velocita' ) );
		exit;
	}
);

function infz_kb( $byte ) {
	return $byte >= 1048576 ? number_format_i18n( $byte / 1048576, 1 ) . ' MB' : number_format_i18n( $byte / 1024 ) . ' KB';
}

function infz_pagina() {
	$c     = infz_controllo();
	$voci  = infz_voci();
	$vel   = infz_velocita_voci();
	$esito = isset( $_GET['fatto'] ) ? get_transient( 'infz_esito_' . get_current_user_id() ) : false;
	?>
	<div class="wrap">
		<h1>Pulizia e velocità</h1>
		<p>Controllo del sito e pulizia solo con la tua conferma. <strong>Prima di pulire fai un backup</strong> (anche quello del pannello hosting va bene). Quando hai finito puoi disattivare il plugin.</p>
		<?php if ( $esito ) : ?>
			<div class="notice notice-success"><p><strong>Pulizia fatta.</strong>
			<?php foreach ( $esito as $k => $f ) : ?>
				<br><?php echo esc_html( $voci[ $k ]['label'] . ': ' . $f['tolti'] . ' tolti' . ( $f['restano'] ? ', ne restano ' . $f['restano'] . ' (ripeti la pulizia)' : '' ) ); ?>
			<?php endforeach; ?></p></div>
		<?php endif; ?>
		<?php if ( isset( $_GET['salvato'] ) ) : ?><div class="notice notice-success"><p>Impostazioni di velocità salvate e cache di LiteSpeed svuotata.</p></div><?php endif; ?>

		<?php if ( $c['plugin']['da_valutare'] ) : ?>
			<div class="notice notice-warning"><p><strong>Plugin da togliere:</strong>
			<?php foreach ( $c['plugin']['da_valutare'] as $p ) : ?>
				<br><?php echo esc_html( $p['plugin'] . ( $p['attivo'] ? ' (attivo)' : ' (spento)' ) . ': ' . $p['perche'] ); ?>
			<?php endforeach; ?>
			<br>Prima disattivali, poi eliminali da Plugin installati.</p></div>
		<?php endif; ?>

		<h2>1. Da pulire</h2>
		<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" onsubmit="return confirm('Confermi la pulizia delle voci scelte? Non si può annullare.');">
			<input type="hidden" name="action" value="infz_pulisci">
			<?php wp_nonce_field( 'infz_pulisci' ); ?>
			<table class="widefat striped" style="max-width:1000px">
				<thead><tr><th style="width:30px"></th><th>Cosa</th><th style="width:110px">Quanti</th><th>Perché</th></tr></thead>
				<tbody>
				<?php foreach ( $voci as $k => $v ) : $n = $c['da_pulire'][ $k ]['da_pulire']; ?>
					<tr>
						<td><input type="checkbox" name="voci[]" value="<?php echo esc_attr( $k ); ?>" id="infz-<?php echo esc_attr( $k ); ?>" <?php disabled( 0, $n ); ?>></td>
						<td><label for="infz-<?php echo esc_attr( $k ); ?>"><?php echo esc_html( $v['label'] ); ?></label></td>
						<td><?php echo $n ? '<strong>' . esc_html( number_format_i18n( $n ) ) . '</strong>' : '<span style="color:#008a20">pulito</span>'; ?></td>
						<td><?php echo esc_html( $v['perche'] ); ?></td>
					</tr>
				<?php endforeach; ?>
				</tbody>
			</table>
			<p>Ogni giro toglie al massimo <?php echo (int) INFZ_LOTTO; ?> elementi per voce, così il sito non si blocca: se ne restano, ripeti.</p>
			<?php submit_button( 'Pulisci le voci scelte', 'primary', 'submit', false ); ?>
		</form>

		<h2 id="velocita" style="margin-top:2em">2. Velocità (facoltativo)</h2>
		<p>Valgono solo finché il plugin è attivo. Se LiteSpeed Cache fa già la stessa cosa, lascia spento qui.</p>
		<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
			<input type="hidden" name="action" value="infz_velocita">
			<?php wp_nonce_field( 'infz_velocita' ); ?>
			<table class="form-table" role="presentation">
			<?php foreach ( $vel as $k => $v ) : ?>
				<tr><th scope="row"><label for="infz-v-<?php echo esc_attr( $k ); ?>"><?php echo esc_html( $v[0] ); ?></label></th>
				<td><input type="checkbox" id="infz-v-<?php echo esc_attr( $k ); ?>" name="v[<?php echo esc_attr( $k ); ?>]" value="1" <?php checked( $c['velocita'][ $k ] ); ?>> <span class="description"><?php echo esc_html( $v[1] ); ?></span></td></tr>
			<?php endforeach; ?>
			</table>
			<?php submit_button( 'Salva', 'secondary' ); ?>
		</form>

		<h2 style="margin-top:2em">3. Controllo</h2>
		<table class="widefat striped" style="max-width:1000px">
			<tbody>
			<?php foreach ( $c['server'] as $k => $v ) : ?>
				<tr><th style="width:240px"><?php echo esc_html( str_replace( '_', ' ', $k ) ); ?></th><td><?php echo esc_html( $v ); ?></td></tr>
			<?php endforeach; ?>
				<tr><th>database</th><td><?php echo esc_html( $c['database']['totale_mb'] . ' MB' ); ?></td></tr>
				<tr><th>opzioni caricate a ogni pagina</th><td><strong><?php echo esc_html( $c['autoload']['totale_kb'] . ' KB' ); ?></strong> <?php echo $c['autoload']['totale_kb'] > 800 ? '— alto: sopra 800 KB ogni pagina non in cache rallenta' : '— ok'; ?></td></tr>
				<tr><th>plugin</th><td><?php echo esc_html( $c['plugin']['attivi'] . ' attivi' . ( $c['plugin']['spenti'] ? ' · spenti: ' . implode( ', ', $c['plugin']['spenti'] ) : '' ) ); ?></td></tr>
				<tr><th>eventi pianificati</th><td><?php echo esc_html( $c['cron']['totali'] . ' in tutto' . ( $c['cron']['senza_plugin'] ? ' · senza plugin collegato: ' . implode( ', ', array_keys( $c['cron']['senza_plugin'] ) ) : '' ) ); ?></td></tr>
			</tbody>
		</table>

		<h3>Opzioni più pesanti caricate a ogni pagina</h3>
		<p>Se una viene da un plugin che non usi più, eliminare quel plugin la toglie. Non cancellarle a mano.</p>
		<table class="widefat striped" style="max-width:700px"><tbody>
		<?php foreach ( $c['autoload']['piu_pesanti'] as $o ) : ?>
			<tr><td><code><?php echo esc_html( $o['nome'] ); ?></code></td><td style="width:120px"><?php echo esc_html( infz_kb( (int) $o['byte'] ) ); ?></td></tr>
		<?php endforeach; ?>
		</tbody></table>

		<?php if ( $c['database']['tabelle'] ) : ?>
		<h3>Tabelle più grandi</h3>
		<table class="widefat striped" style="max-width:700px"><thead><tr><th>Tabella</th><th>MB</th><th>Righe circa</th></tr></thead><tbody>
		<?php foreach ( $c['database']['tabelle'] as $t ) : ?>
			<tr><td><code><?php echo esc_html( $t['t'] ); ?></code></td><td><?php echo esc_html( $t['mb'] ); ?></td><td><?php echo esc_html( number_format_i18n( (int) $t['r'] ) ); ?></td></tr>
		<?php endforeach; ?>
		</tbody></table>
		<?php endif; ?>

		<?php $log = array_reverse( (array) get_option( 'infz_log', array() ) ); if ( $log ) : ?>
		<h2 style="margin-top:2em">Registro</h2>
		<table class="widefat striped" style="max-width:1000px"><thead><tr><th>Quando</th><th>Chi</th><th>Da</th><th>Esito</th></tr></thead><tbody>
		<?php foreach ( array_slice( $log, 0, 20 ) as $r ) : ?>
			<tr><td><?php echo esc_html( $r['quando'] ); ?></td><td><?php echo esc_html( $r['utente'] ); ?></td><td><?php echo esc_html( $r['da'] ); ?></td><td><?php echo esc_html( $r['esito'] ); ?></td></tr>
		<?php endforeach; ?>
		</tbody></table>
		<?php endif; ?>
	</div>
	<?php
}
