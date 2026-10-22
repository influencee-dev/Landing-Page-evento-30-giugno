<?php
/**
 * Pagina o articolo di WordPress con il guscio del Tema (modo "tutto"). Il contenuto resta quello di WordPress:
 * se è fatto con Elementor lo disegna ancora Elementor, ma senza il suo header e footer.
 */
defined( 'ABSPATH' ) || exit;

inft_get_header();
while ( have_posts() ) {
	the_post();
	echo '<main id="post-' . (int) get_the_ID() . '" class="it-pagina">';
	if ( infe_contenuto_elementor() ) {
		the_content();
	} else {
		echo '<div class="inf-scope"><div class="inf-wrap it-testo"><h1>' . esc_html( get_the_title() ) . '</h1>';
		the_content();
		echo '</div></div>';
	}
	echo '</main>';
}
inft_get_footer();
