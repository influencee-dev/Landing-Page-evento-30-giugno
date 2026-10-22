<?php
/**
 * Elenco degli articoli (blog, categorie, tag, autore, ricerca) con il guscio del Tema e le schede nello stile degli
 * articoli. Titolo e description restano quelli del plugin SEO del sito.
 */
defined( 'ABSPATH' ) || exit;

if ( is_home() ) {
	$infe_titolo = get_option( 'page_for_posts' ) ? get_the_title( (int) get_option( 'page_for_posts' ) ) : 'Blog';
	$infe_testo  = 'Guide, dati e novità sull’influencer marketing in Italia, per brand, agenzie e creator.';
} elseif ( is_search() ) {
	$infe_titolo = 'Risultati per «' . get_search_query() . '»';
	$infe_testo  = '';
} else {
	$infe_titolo = wp_strip_all_tags( get_the_archive_title() );
	$infe_titolo = preg_replace( '/^(Categoria|Tag|Autore|Archivi):\s*/u', '', $infe_titolo );
	$infe_testo  = wp_strip_all_tags( get_the_archive_description() );
}

inft_get_header();
?>
<main class="it-elenco inf-scope" data-inft-track data-page-type="blog">
	<div class="inf-wrap">
		<nav class="it-crumbs" aria-label="Percorso" data-section="testata"><a href="<?php echo esc_url( home_url( '/' ) ); ?>">Home</a> <span>›</span> <?php echo is_home() ? '<span>Blog</span>' : '<a href="' . esc_url( get_option( 'page_for_posts' ) ? get_permalink( (int) get_option( 'page_for_posts' ) ) : home_url( '/news-influencer-marketing/' ) ) . '">Blog</a> <span>›</span> <span>' . esc_html( $infe_titolo ) . '</span>'; ?></nav>
		<h1><?php echo esc_html( $infe_titolo ); ?></h1>
		<?php if ( $infe_testo ) : ?><p class="it-elenco-lead"><?php echo esc_html( $infe_testo ); ?></p><?php endif; ?>
		<?php if ( have_posts() ) : ?>
		<div class="it-schede" data-section="elenco">
			<?php
			while ( have_posts() ) :
				the_post();
				$infe_cat = get_the_category();
				$infe_min = max( 1, (int) round( count( preg_split( '/\s+/u', trim( wp_strip_all_tags( get_the_content() ) ) ) ) / 200 ) );
				?>
				<article class="it-scheda">
					<a href="<?php the_permalink(); ?>">
						<?php if ( has_post_thumbnail() ) : ?>
							<?php the_post_thumbnail( 'medium_large', array( 'loading' => 'lazy', 'decoding' => 'async', 'alt' => '' ) ); ?>
						<?php else : ?>
							<span class="it-scheda-ph" aria-hidden="true"><?php echo esc_html( wp_trim_words( get_the_title(), 6, '…' ) ); ?></span>
						<?php endif; ?>
						<span class="it-scheda-cat"><?php echo esc_html( $infe_cat ? $infe_cat[0]->name : 'Blog' ); ?></span>
						<h2><?php echo esc_html( wp_strip_all_tags( get_the_title() ) ); ?></h2>
						<p><?php echo esc_html( wp_trim_words( wp_strip_all_tags( get_the_excerpt() ), 22, '…' ) ); ?></p>
						<span class="it-scheda-meta"><time datetime="<?php echo esc_attr( get_the_date( 'c' ) ); ?>"><?php echo esc_html( get_the_date( 'j M Y' ) ); ?></time> · <?php echo (int) $infe_min; ?> min</span>
					</a>
				</article>
			<?php endwhile; ?>
		</div>
		<nav class="it-pagine" aria-label="Pagine"><?php echo wp_kses_post( paginate_links( array( 'prev_text' => '← Più recenti', 'next_text' => 'Meno recenti →' ) ) ); ?></nav>
		<?php else : ?>
			<p class="it-elenco-lead">Nessun articolo trovato.</p>
		<?php endif; ?>
	</div>
</main>
<?php
inft_get_footer();
