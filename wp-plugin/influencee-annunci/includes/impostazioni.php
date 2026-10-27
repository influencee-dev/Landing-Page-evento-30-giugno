<?php
/**
 * Parte "Offerte di lavoro" nella pagina Influencee del Core.
 */

defined( 'ABSPATH' ) || exit;

add_filter(
	'inft_settings_sanitize',
	function ( $out, $in ) {
		$url = function ( $k, $def = '' ) use ( $in ) {
			$v = isset( $in[ $k ] ) ? esc_url_raw( trim( (string) $in[ $k ] ) ) : $def;
			return ( '' === $v || 0 === strpos( $v, 'https://' ) ) ? $v : $def; // solo https
		};
		$out['annunci']          = empty( $in['annunci'] ) ? 0 : 1;
		$out['annunci_app']      = $url( 'annunci_app', 'https://app.influencee.it' );
		$out['annunci_app']      = $out['annunci_app'] ? untrailingslashit( $out['annunci_app'] ) : 'https://app.influencee.it';
		$out['annunci_feed']     = $url( 'annunci_feed' );
		$out['annunci_endpoint'] = $url( 'annunci_endpoint' );
		$out['annunci_wpjm']     = empty( $in['annunci_wpjm'] ) ? 0 : 1;
		$out['annunci_email']    = empty( $in['annunci_email'] ) ? 0 : 1;
		$out['annunci_vecchie']  = empty( $in['annunci_vecchie'] ) ? 0 : 1;
		$out['annunci_anteprima'] = empty( $in['annunci_anteprima'] ) ? 0 : 1;
		// il segreto si salva a parte e si sostituisce solo se ne scrivi uno nuovo
		if ( ! empty( $in['annunci_secret'] ) ) {
			update_option( 'infn_secret', sanitize_text_field( (string) $in['annunci_secret'] ), false );
		}
		delete_transient( 'infn_feed' );
		return $out;
	},
	10,
	2
);

add_action(
	'inft_settings_sections',
	function () {
		$s      = infn_settings();
		$drafts = wp_count_posts( 'inf_bozza_annuncio' );
		$n      = isset( $drafts->private ) ? (int) $drafts->private : 0;
		$feed   = infn_annunci_app();
		?>
		<h2>Offerte di lavoro (Influencee Annunci)</h2>
		<p><label><input type="checkbox" name="inft_settings[annunci]" value="1" <?php checked( ! empty( $s['annunci'] ) ); ?>> <b>Servi le pagine</b> <code><?php echo esc_html( INFN_BACHECA ); ?></code> (bacheca) e <code><?php echo esc_html( INFN_PUBBLICA ); ?></code> (pubblica un’offerta in 5 passi)</label></p>
		<p class="description">Spegnendo la casella tornano le pagine di WP Job Manager. Bozze ricevute finora: <a href="<?php echo esc_url( admin_url( 'edit.php?post_type=inf_bozza_annuncio' ) ); ?>"><?php echo (int) $n; ?></a>.</p>
		<table class="form-table" role="presentation"><tbody>
			<tr><th scope="row">Indirizzo dell’app</th><td><input type="url" name="inft_settings[annunci_app]" value="<?php echo esc_attr( $s['annunci_app'] ); ?>" class="regular-text"></td></tr>
			<tr><th scope="row">Elenco annunci dell’app</th><td><input type="url" name="inft_settings[annunci_feed]" value="<?php echo esc_attr( $s['annunci_feed'] ); ?>" class="regular-text" placeholder="https://app.influencee.it/annunci/elenco.json">
				<p class="description"><?php echo '' === $s['annunci_feed'] ? 'Vuoto: l’app non espone ancora l’elenco. La bacheca usa WP Job Manager (se attivo qui sotto).' : ( null === $feed ? '⚠️ L’app non risponde: la bacheca mostra l’ultimo elenco valido.' : '✅ Collegato: ' . count( $feed ) . ' annunci aperti.' ); ?></p></td></tr>
			<tr><th scope="row">Ricezione bozze nell’app</th><td><input type="url" name="inft_settings[annunci_endpoint]" value="<?php echo esc_attr( $s['annunci_endpoint'] ); ?>" class="regular-text" placeholder="https://app.influencee.it/annunci/bozze/">
				<p><input type="password" name="inft_settings[annunci_secret]" value="" class="regular-text" autocomplete="new-password" placeholder="<?php echo infn_secret() ? 'Segreto impostato: scrivine uno nuovo per cambiarlo' : 'Segreto condiviso con l’app'; ?>"></p>
				<p class="description"><?php echo infn_app_connected() ? '✅ Collegata: le offerte vanno nell’app e il brand sceglie la password su app.influencee.it.' : 'Non collegata: le offerte restano qui tra le bozze, il lead va in tandem e il brand crea l’account dall’app.'; ?> Meglio mettere il segreto in <code>wp-config.php</code>: <code>define( 'INFLUENCEE_ANNUNCI_SECRET', '…' );</code></p></td></tr>
			<tr><th scope="row">Altre opzioni</th><td>
				<label><input type="checkbox" name="inft_settings[annunci_wpjm]" value="1" <?php checked( ! empty( $s['annunci_wpjm'] ) ); ?>> Finché l’app non espone l’elenco, mostra in bacheca le offerte di WP Job Manager degli ultimi 180 giorni</label><br>
				<label><input type="checkbox" name="inft_settings[annunci_email]" value="1" <?php checked( ! empty( $s['annunci_email'] ) ); ?>> Manda al brand un’email di riepilogo con il link per creare l’account</label><br>
				<label><input type="checkbox" name="inft_settings[annunci_vecchie]" value="1" <?php checked( ! empty( $s['annunci_vecchie'] ) ); ?>> Redirect 301 delle offerte WP Job Manager scadute, chiuse o più vecchie di 180 giorni verso la bacheca</label><br>
				<label><input type="checkbox" name="inft_settings[annunci_anteprima]" value="1" <?php checked( ! empty( $s['annunci_anteprima'] ) ); ?>> Offerte dell’app in anteprima: sul sito titolo, città, compenso e scadenza; azienda, brief e candidatura solo nell’app</label>
			</td></tr>
		</tbody></table>
		<?php
	}
);
