<?php
/** Impostazioni del Tema nella pagina Influencee del Core. */

defined( 'ABSPATH' ) || exit;

add_filter(
	'inft_settings_sanitize',
	function ( $out, $in ) {
		$out['tema']         = isset( $in['tema'] ) && in_array( $in['tema'], array( 'off', 'plugin', 'tutto' ), true ) ? $in['tema'] : 'off';
		$out['tema_esclusi'] = isset( $in['tema_esclusi'] ) ? sanitize_textarea_field( (string) $in['tema_esclusi'] ) : '';
		do_action( 'litespeed_purge_all' );
		return $out;
	},
	10,
	2
);

add_action(
	'inft_settings_sections',
	function () {
		$s = infe_settings();
		$m = array(
			'off'    => 'Spento: intestazione e piè di pagina di prima (Elementor)',
			'plugin' => 'Solo le pagine dei plugin Influencee (tool, pagine, articoli, annunci): niente Elementor su queste pagine',
			'tutto'  => 'Tutto il sito: anche le pagine fatte con Elementor hanno la nuova intestazione e il nuovo piè di pagina',
		);
		?>
		<h2>Intestazione e piè di pagina (Influencee Tema)</h2>
		<p>Stessi link di oggi, in HTML5. Prova prima «Solo le pagine dei plugin», controlla qualche pagina, poi «Tutto il sito». Ogni cambio svuota la cache di LiteSpeed.</p>
		<fieldset>
		<?php foreach ( $m as $k => $label ) : ?>
			<p><label><input type="radio" name="inft_settings[tema]" value="<?php echo esc_attr( $k ); ?>" <?php checked( $s['tema'], $k ); ?>> <?php echo esc_html( $label ); ?></label></p>
		<?php endforeach; ?>
		</fieldset>
		<p><label for="infe-esclusi"><b>Pagine che restano come prima</b> (un percorso per riga, es. <code>/chi-siamo/</code>)</label><br>
		<textarea id="infe-esclusi" name="inft_settings[tema_esclusi]" rows="3" class="large-text code"><?php echo esc_textarea( $s['tema_esclusi'] ); ?></textarea></p>
		<?php
	}
);
