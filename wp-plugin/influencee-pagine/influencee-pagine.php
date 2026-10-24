<?php
/**
 * Plugin Name:       Influencee Pagine
 * Description:       Pagine del sito con il design nuovo e lo stesso URL (home, influencer italiani per regione, città e categoria, piattaforma, prezzi, contatti…), profili creator /creator/… ed elenco dei creator con filtri. SEO/GEO/AEO e tracciamento da Influencee Core; profili dal plugin dei creator (igm), senza contatti nelle bio.
 * Version:           2.0.5
 * Author:            Partidea SRL
 * Requires at least: 6.0
 * Requires PHP:      7.4
 * Requires Plugins:  influencee-core
 * Text Domain:       influencee-pagine
 */

defined( 'ABSPATH' ) || exit;

define( 'INFP_VERSION', '2.0.5' );
define( 'INFP_DIR', plugin_dir_path( __FILE__ ) );
define( 'INFP_URL', plugin_dir_url( __FILE__ ) );

add_action(
	'plugins_loaded',
	function () {
		if ( ! function_exists( 'inft_core_ready' ) ) {
			add_action(
				'admin_notices',
				function () {
					echo '<div class="notice notice-error"><p><b>Influencee Pagine</b> ha bisogno del plugin <b>Influencee Core</b>: installalo e attivalo.</p></div>';
				}
			);
			return;
		}
		require_once INFP_DIR . 'includes/creators.php';
		require_once INFP_DIR . 'includes/privacy.php';
		require_once INFP_DIR . 'includes/profiles.php';

		// pagine nuove e sostituzioni (pages/meta.json + pages/*.html), servite dal motore di Core
		add_filter(
			'inft_page_sources',
			function ( $sources ) {
				$sources['pagine'] = array( 'dir' => INFP_DIR, 'url' => INFP_URL );
				return $sources;
			}
		);

		// profili /creator/<slug>/ come pagina del plugin
		add_filter(
			'inft_current_page',
			function ( $page ) {
				return $page ? $page : inft_profile_page();
			}
		);

		// segnaposto: dati del profilo e card dei creator
		add_filter(
			'inft_page_html',
			function ( $html, $page ) {
				if ( ! empty( $page['profile'] ) ) {
					$html = inft_profile_fill( $html, $page['profile'] );
				}
				return preg_replace_callback(
					'#<!--INFLUENCEE_CREATORS:([^>]*?)-->#',
					function ( $m ) {
						return inft_creators_html_for( $m[1] );
					},
					$html
				);
			},
			10,
			2
		);

		// ItemList dei creator mostrati nella pagina
		add_action(
			'inft_head',
			function () {
				$list = inft_creators_itemlist();
				if ( $list ) {
					echo '<script type="application/ld+json" data-inft>' . wp_json_encode( $list, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES ) . '</script>' . "\n";
				}
			}
		);

		// dati per la versione interattiva (card già pronte, profilo, elenco completo per i filtri)
		add_filter(
			'inft_client_data',
			function ( $data, $page ) {
				if ( ! empty( $page['profile'] ) ) {
					$data['profile'] = $page['profile'];
				}
				if ( '/influencer-italiani/' === $page['path'] ) {
					$data['directory'] = inft_creators_directory();
				}
				$data['creators'] = (object) inft_creators_rendered();
				return $data;
			},
			10,
			2
		);

		add_filter(
			'inft_settings_sanitize',
			function ( $out, $in ) {
				$out['creators'] = empty( $in['creators'] ) ? 0 : 1;
				$out['profiles'] = empty( $in['profiles'] ) ? 0 : 1;
				$out['privacy']  = empty( $in['privacy'] ) ? 0 : 1;
				return $out;
			},
			10,
			2
		);

		add_action(
			'inft_settings_sections',
			function ( $s ) {
				?>
				<h2>Profili dei creator</h2>
				<p><label><input type="checkbox" name="inft_settings[creators]" value="1" <?php checked( ! empty( $s['creators'] ) ); ?>> Mostra i profili (tipo di contenuto "creator") nelle pagine città, regione, categoria, hub e home</label></p>
				<p class="description">Nelle liste si mostrano nome, handle, città, categoria e foto, mai le bio (a volte contengono email e telefoni).</p>
				<p><label><input type="checkbox" name="inft_settings[profiles]" value="1" <?php checked( ! empty( $s['profiles'] ) ); ?>> <b>Pagine profilo con la nuova grafica</b> (<code>/creator/…</code>): foto, follower, fascia, costo medio, modulo "Vuoi collaborare?" verso tandem e creator simili</label></p>
				<p class="description">I profili restano gestiti dal plugin dei creator: cambia solo come si vedono. Spegnendo la casella torna subito la pagina di prima.</p>
				<p><label><input type="checkbox" name="inft_settings[privacy]" value="1" <?php checked( ! empty( $s['privacy'] ) ); ?>> Togli email e telefoni dalle bio dei creator per chi non è redattore (API <code>/igm/v1/creators</code>, <code>/wp/v2/creator</code>, pagine <code>/creator/…</code> e dati strutturati)</label></p>
				<?php
			}
		);
	},
	5
);
