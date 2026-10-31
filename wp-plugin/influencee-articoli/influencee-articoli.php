<?php
/**
 * Plugin Name:       Influencee Articoli
 * Description:       Articoli del blog con il design del sito in HTML5 leggero: indice, autore e data di aggiornamento, FAQ, modulo lead verso tandem, articoli correlati, dati strutturati BlogPosting/FAQ. Elementor spento solo sugli articoli accesi. I testi restano quelli scritti in WordPress.
 * Version:           2.5.0
 * Author:            Partidea SRL
 * Requires at least: 6.0
 * Requires PHP:      7.4
 * Requires Plugins:  influencee-core
 * Text Domain:       influencee-articoli
 */

defined( 'ABSPATH' ) || exit;

define( 'INFA_VERSION', '2.5.0' );
define( 'INFA_DIR', plugin_dir_path( __FILE__ ) );
define( 'INFA_URL', plugin_dir_url( __FILE__ ) );

add_action(
	'plugins_loaded',
	function () {
		if ( ! function_exists( 'inft_core_ready' ) ) {
			add_action(
				'admin_notices',
				function () {
					echo '<div class="notice notice-error"><p><b>Influencee Articoli</b> ha bisogno del plugin <b>Influencee Core</b>: installalo e attivalo.</p></div>';
				}
			);
			return;
		}
		require_once INFA_DIR . 'includes/potenziamenti.php';
		require_once INFA_DIR . 'includes/riscritti.php';
		require_once INFA_DIR . 'includes/articoli.php';

		add_filter(
			'inft_settings_sanitize',
			function ( $out, $in ) {
				$out['articles']     = isset( $in['articles'] ) && in_array( $in['articles'], array( 'off', 'lista', 'tutti' ), true ) ? $in['articles'] : 'off';
				$out['articles_on']  = inft_clean_paths( isset( $in['articles_on'] ) ? $in['articles_on'] : '' );
				$out['articles_off'] = inft_clean_paths( isset( $in['articles_off'] ) ? $in['articles_off'] : '' );
				return $out;
			},
			10,
			2
		);

		add_action(
			'inft_settings_sections',
			function ( $s ) {
				$am = isset( $s['articles'] ) ? $s['articles'] : 'off';
				?>
				<h2>Articoli del blog</h2>
				<p><label><input type="radio" name="inft_settings[articles]" value="off" <?php checked( 'off', $am ); ?>> Spenti (articoli come oggi)</label><br>
				<label><input type="radio" name="inft_settings[articles]" value="lista" <?php checked( 'lista', $am ); ?>> Solo gli articoli elencati qui sotto (per provare)</label><br>
				<label><input type="radio" name="inft_settings[articles]" value="tutti" <?php checked( 'tutti', $am ); ?>> Tutti gli articoli</label></p>
				<p><label>Articoli da accendere in prova (uno per riga, es. <code>/come-funziona-il-pagamento-degli-influencer/</code>)<br><textarea name="inft_settings[articles_on]" rows="3" cols="70"><?php echo esc_textarea( implode( "\n", (array) $s['articles_on'] ) ); ?></textarea></label></p>
				<p><label>Articoli da escludere anche con "Tutti" (uno per riga)<br><textarea name="inft_settings[articles_off]" rows="2" cols="70"><?php echo esc_textarea( implode( "\n", (array) $s['articles_off'] ) ); ?></textarea></label></p>
				<p class="description">HTML5 leggero col design del sito, indice, autore e data, FAQ, modulo lead verso tandem, correlati, dati strutturati. Elementor non viene caricato sugli articoli accesi. Gli articoli che sono anche pagine tool (fake follower, engagement rate) restano tool.</p>
				<?php
			}
		);
	},
	5
);
