<?php
/**
 * Pagina o articolo di WordPress con il guscio del Tema (modo "tutto").
 * - Contenuto fatto con Elementor e Elementor acceso: lo disegna ancora Elementor, senza il suo header e footer.
 * - Altrimenti (anche pagine Elementor con Elementor spento, che mostrano il testo di riserva): il Tema lo impagina
 *   nello stile del sito, con un solo H1.
 */
defined( 'ABSPATH' ) || exit;

inft_get_header();
while ( have_posts() ) {
	the_post();
	echo '<main id="post-' . (int) get_the_ID() . '" class="it-pagina">';
	if ( infe_contenuto_elementor() ) {
		the_content();
	} else {
		ob_start();
		the_content();
		$html = (string) ob_get_clean();
		// 1.2.8: pagine con impaginazione propria (guide «Calendario marketing 2027», classe infg) tengono il loro H1
		$propria = false !== strpos( $html, 'class="infg"' ) && preg_match( '#<h1[\s>]#i', $html );
		$html    = $propria ? $html : infe_testo_pulito( $html );
		echo '<div class="inf-scope"><article class="inf-wrap it-testo">';
		if ( ! $propria ) {
			echo '<h1>' . esc_html( get_the_title() ) . '</h1>'; // H1 = titolo della pagina; quelli del testo diventano H2
		}
		echo $html; // phpcs:ignore WordPress.Security.EscapeOutput -- contenuto della pagina già filtrato da WordPress
		echo '</article></div>';
	}
	echo '</main>';
}
inft_get_footer();
