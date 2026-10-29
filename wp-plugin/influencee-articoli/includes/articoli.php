<?php
/**
 * Articoli del blog con il design del sito, in HTML5 leggero.
 *
 * Gli articoli restano in WordPress (si scrivono come sempre). Il plugin cambia solo come si vedono:
 * - HTML5 semantico generato da PHP: tutto il testo è nella pagina, leggibile da Google e dai motori AI;
 * - un solo file CSS piccolo (assets/articolo.css) e un JavaScript minimo (assets/articolo.js);
 * - Elementor spento SOLO sugli articoli (i suoi file non vengono caricati, i contenitori vengono tolti dal testo);
 * - dati strutturati Article + autore + date + percorso + FAQ, canonical e immagine di anteprima.
 * Si accende da Impostazioni → Influencee Tools → Articoli (spenti / solo alcuni / tutti).
 */

defined( 'ABSPATH' ) || exit;

/** Percorso di un articolo, come lo usano le impostazioni ("/titolo-articolo/"). */
function inft_post_path( $post ) {
	return '/' . trim( (string) wp_parse_url( get_permalink( $post ), PHP_URL_PATH ), '/' ) . '/';
}

/** L'articolo della richiesta corrente se va mostrato con il nuovo modello, altrimenti null. */
function inft_article_current() {
	static $cur = false;
	if ( false !== $cur ) {
		return $cur;
	}
	if ( ! did_action( 'wp' ) ) {
		return null;
	}
	$cur = null;
	$s   = inft_settings();
	$mode = isset( $s['articles'] ) ? $s['articles'] : 'off';
	if ( 'off' === $mode || is_admin() || ! is_singular( 'post' ) || is_preview() ) {
		return $cur;
	}
	$post = get_queried_object();
	if ( ! $post instanceof WP_Post || 'publish' !== $post->post_status || post_password_required( $post ) ) {
		return $cur;
	}
	$path = inft_post_path( $post );
	if ( in_array( $path, (array) $s['articles_off'], true ) ) {
		return $cur;
	}
	if ( 'tutti' === $mode || in_array( $path, (array) $s['articles_on'], true ) ) {
		$cur = $post;
	}
	return $cur;
}

/* ════════════════════════════════════════════════════════════════════
   PULIZIA DEL TESTO
   Toglie i contenitori di Elementor (gli articoli usano solo testo, HTML e titoli),
   raccoglie le FAQ scritte come JSON-LD dentro il testo e prepara l'indice.
   ════════════════════════════════════════════════════════════════════ */

function inft_article_clean( $html ) {
	$out = array( 'html' => '', 'toc' => array(), 'faq' => array(), 'meta' => array() );
	if ( '' === trim( (string) $html ) || ! class_exists( 'DOMDocument' ) ) {
		$out['html'] = (string) $html;
		return $out;
	}
	$prev = libxml_use_internal_errors( true );
	$dom  = new DOMDocument( '1.0', 'UTF-8' );
	$dom->loadHTML( '<?xml encoding="UTF-8"><div id="inft-root">' . $html . '</div>', LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD );
	libxml_clear_errors();
	libxml_use_internal_errors( $prev );
	$xp   = new DOMXPath( $dom );
	$root = $dom->getElementById( 'inft-root' );
	if ( ! $root ) {
		$out['html'] = (string) $html;
		return $out;
	}

	// FAQ e altri dati strutturati scritti nel testo: si leggono e si tolgono (vanno nell'intestazione)
	foreach ( iterator_to_array( $xp->query( './/script', $root ) ) as $sc ) {
		if ( false !== stripos( (string) $sc->getAttribute( 'type' ), 'ld+json' ) ) {
			$data = json_decode( trim( $sc->textContent ), true );
			foreach ( isset( $data['@graph'] ) ? (array) $data['@graph'] : array( $data ) as $node ) {
				if ( is_array( $node ) && isset( $node['@type'] ) && 'FAQPage' === $node['@type'] && ! empty( $node['mainEntity'] ) ) {
					foreach ( (array) $node['mainEntity'] as $q ) {
						$a = isset( $q['acceptedAnswer']['text'] ) ? $q['acceptedAnswer']['text'] : '';
						if ( ! empty( $q['name'] ) && $a ) {
							$out['faq'][] = array( 'q' => wp_strip_all_tags( $q['name'] ), 'a' => wp_strip_all_tags( $a ) );
						}
					}
				}
			}
		}
		$sc->parentNode->removeChild( $sc );
	}
	// CSS scritto nel testo: si tiene solo quello dei disegni (mockup, illustrazioni), il resto lo dà il plugin
	$keep_css = '';
	foreach ( iterator_to_array( $xp->query( './/style', $root ) ) as $st ) {
		$keep_css .= inft_css_keep( $st->textContent, '/(mock|illu)/i' );
	}
	foreach ( iterator_to_array( $xp->query( './/style|.//comment()', $root ) ) as $n ) {
		$n->parentNode->removeChild( $n );
	}
	$out['meta'] = inft_article_ifn_template( $dom, $xp, $root );
	if ( '' !== trim( $keep_css ) ) {
		$style = $dom->createElement( 'style' );
		$style->appendChild( $dom->createTextNode( $keep_css ) );
		$root->insertBefore( $style, $root->firstChild );
	}

	// contenitori di Elementor: si tolgono lasciando il contenuto
	$is_wrapper = function ( $el ) {
		$c = ' ' . $el->getAttribute( 'class' ) . ' ';
		return in_array( $el->nodeName, array( 'div', 'section' ), true ) && ( $el->hasAttribute( 'data-elementor-type' ) || $el->hasAttribute( 'data-element_type' ) || preg_match( '/\s(elementor[\w-]*|e-con[\w-]*|e-flex|e-parent|e-child)\s/', $c ) );
	};
	$changed = true;
	while ( $changed ) {
		$changed = false;
		foreach ( iterator_to_array( $xp->query( './/div|.//section', $root ) ) as $el ) {
			if ( $is_wrapper( $el ) ) {
				while ( $el->firstChild ) {
					$el->parentNode->insertBefore( $el->firstChild, $el );
				}
				$el->parentNode->removeChild( $el );
				$changed = true;
			}
		}
	}

	// attributi superflui, paragrafi vuoti, un solo H1 (quello del titolo)
	foreach ( iterator_to_array( $xp->query( './/*', $root ) ) as $el ) {
		// nei disegni (mockup, illustrazioni) gli stili in linea servono: si lasciano
		$in_art = $xp->query( 'ancestor-or-self::*[contains(@class,"mock") or contains(@class,"illu") or self::svg]', $el )->length > 0;
		foreach ( iterator_to_array( $el->attributes ) as $at ) {
			if ( ( 0 === strpos( $at->name, 'data-' ) && ! $in_art ) || ( 'style' === $at->name && ! $in_art ) || ( 'class' === $at->name && preg_match( '/^(elementor|e-)/', $at->value ) ) ) {
				$el->removeAttribute( $at->name );
			}
		}
	}
	foreach ( iterator_to_array( $xp->query( './/p', $root ) ) as $p ) {
		if ( '' === trim( str_replace( "\xc2\xa0", '', $p->textContent ) ) && ! $xp->query( './/img|.//iframe|.//video', $p )->length ) {
			$p->parentNode->removeChild( $p );
		}
	}
	foreach ( iterator_to_array( $xp->query( './/h1', $root ) ) as $h ) {
		$h2 = $dom->createElement( 'h2' );
		while ( $h->firstChild ) {
			$h2->appendChild( $h->firstChild );
		}
		$h->parentNode->replaceChild( $h2, $h );
	}

	// articoli scritti solo con H3: diventano H2 (e H4 → H3), così i titoli hanno l'ordine giusto e c'è l'indice
	if ( ! $xp->query( './/h2', $root )->length && $xp->query( './/h3', $root )->length ) {
		foreach ( array( 'h3' => 'h2', 'h4' => 'h3' ) as $from => $to ) {
			foreach ( iterator_to_array( $xp->query( './/' . $from, $root ) ) as $h ) {
				$n = $dom->createElement( $to );
				while ( $h->firstChild ) {
					$n->appendChild( $h->firstChild );
				}
				foreach ( iterator_to_array( $h->attributes ) as $at ) {
					$n->setAttribute( $at->name, $at->value );
				}
				$h->parentNode->replaceChild( $n, $h );
			}
		}
	}

	// indice: id sugli H2
	$used = array();
	foreach ( iterator_to_array( $xp->query( './/h2', $root ) ) as $h ) {
		$t = trim( preg_replace( '/\s+/', ' ', $h->textContent ) );
		if ( '' === $t ) {
			continue;
		}
		$id = $h->getAttribute( 'id' ) ? $h->getAttribute( 'id' ) : sanitize_title( $t );
		$id = $id ? $id : 'sezione';
		$base = $id;
		$i    = 2;
		while ( isset( $used[ $id ] ) ) {
			$id = $base . '-' . $i++;
		}
		$used[ $id ] = 1;
		$h->setAttribute( 'id', $id );
		$out['toc'][] = array( 'id' => $id, 'text' => $t );
	}

	// immagini leggere, tabelle e video adattabili, link esterni sicuri
	foreach ( iterator_to_array( $xp->query( './/img', $root ) ) as $img ) {
		if ( ! $img->hasAttribute( 'loading' ) ) {
			$img->setAttribute( 'loading', 'lazy' );
		}
		$img->setAttribute( 'decoding', 'async' );
	}
	// a capo e paragrafi vuoti aggiunti dalla formattazione automatica tra un blocco e l'altro (rompono griglie e box)
	foreach ( iterator_to_array( $xp->query( './/br', $root ) ) as $br ) {
		if ( in_array( $br->parentNode->nodeName, array( 'div', 'section', 'ul', 'ol', 'figure', 'aside', 'nav', 'article', 'table', 'tbody', 'thead', 'tr' ), true ) ) {
			$br->parentNode->removeChild( $br );
		}
	}
	foreach ( iterator_to_array( $xp->query( './/p', $root ) ) as $pp ) {
		if ( '' === trim( str_replace( "\xc2\xa0", '', $pp->textContent ) ) && ! $xp->query( './/img|.//iframe|.//svg|.//video|.//input', $pp )->length ) {
			$pp->parentNode->removeChild( $pp );
		}
	}
	foreach ( iterator_to_array( $xp->query( './/table|.//iframe', $root ) ) as $t ) {
		if ( 'table' === $t->nodeName && $xp->query( 'ancestor::*[contains(@class,"ifn-post__table-wrap")]', $t )->length ) {
			continue; // già nel riquadro del modello
		}
		$wrap = $dom->createElement( 'div' );
		$wrap->setAttribute( 'class', 'table' === $t->nodeName ? 'ifn-post__table-wrap' : 'ia-embed' );
		$t->parentNode->replaceChild( $wrap, $t );
		$wrap->appendChild( $t );
	}
	$host = (string) wp_parse_url( home_url(), PHP_URL_HOST );
	foreach ( iterator_to_array( $xp->query( './/a[@href]', $root ) ) as $a ) {
		$h = (string) wp_parse_url( $a->getAttribute( 'href' ), PHP_URL_HOST );
		if ( $h && $h !== $host && 0 !== strpos( $h, 'app.influencee.it' ) && 0 !== strpos( $h, 'campaign.influencee.it' ) ) {
			$a->setAttribute( 'rel', trim( $a->getAttribute( 'rel' ) . ' noopener' ) );
		}
	}

	$html = '';
	foreach ( $root->childNodes as $n ) {
		$html .= $dom->saveHTML( $n );
	}
	$fixed       = inft_fix_mojibake( trim( $html ) );
	$broken      = trim( $html ) !== $fixed; // testo con caratteri rovinati: si correggono anche autore e sottotitolo
	$out['html'] = $fixed;
	foreach ( $out['meta'] as $k => $v ) {
		$out['meta'][ $k ] = inft_fix_mojibake( $v, $broken );
	}
	return $out;
}

/* ════════════════════════════════════════════════════════════════════
   DATI DELL'ARTICOLO
   ════════════════════════════════════════════════════════════════════ */

function inft_article_data( $post ) {
	static $cache = array();
	if ( isset( $cache[ $post->ID ] ) ) {
		return $cache[ $post->ID ];
	}
	setup_postdata( $post );
	$GLOBALS['post'] = $post;
	$raw     = apply_filters( 'the_content', get_the_content( null, false, $post ) );
	$clean   = inft_article_clean( $raw );
	$text    = wp_strip_all_tags( $clean['html'] );
	$words   = max( 1, count( preg_split( '/\s+/u', trim( $text ) ) ) );
	$cats    = get_the_category( $post->ID );
	$cat     = $cats ? $cats[0] : null;
	$author  = get_userdata( (int) $post->post_author );
	$aname   = $author ? $author->display_name : '';
	// nomi utente tecnici (admin, influencee2019…) diventano "Team Influencee"
	if ( ! $aname || preg_match( '/^(admin|administrator|root|editor|wp)\b|\d{3,}|@/i', $aname ) ) {
		$aname = 'Team Influencee';
	}
	$abio    = $author ? trim( (string) get_the_author_meta( 'description', $author->ID ) ) : '';
	$m       = $clean['meta'];
	if ( ! empty( $m['author'] ) ) {
		$aname = $m['author']; // autore scritto nell'articolo (es. Giorgia Palazzo)
		$abio  = ! empty( $m['author_role'] ) ? $m['author_role'] : $abio;
	}
	$faq     = $clean['faq'];
	// FAQ già visibili nel testo? Allora non si ripetono
	$visible = $faq && false !== mb_stripos( $text, mb_substr( $faq[0]['q'], 0, 40 ) );
	$image   = get_the_post_thumbnail_url( $post, 'full' );
	$image   = $image ? $image : ( ! empty( $m['image'] ) ? $m['image'] : '' );
	$blog    = get_option( 'page_for_posts' ) ? get_permalink( (int) get_option( 'page_for_posts' ) ) : home_url( '/news-influencer-marketing/' );
	$cache[ $post->ID ] = array(
		'title'       => wp_strip_all_tags( get_the_title( $post ) ),
		'url'         => get_permalink( $post ),
		'path'        => inft_post_path( $post ),
		'excerpt'     => has_excerpt( $post ) ? wp_strip_all_tags( get_the_excerpt( $post ) ) : ( ! empty( $m['lead'] ) ? $m['lead'] : '' ),
		'html'        => $clean['html'],
		'toc'         => $clean['toc'],
		'faq'         => $faq,
		'faq_show'    => $faq && ! $visible,
		'words'       => $words,
		'minutes'     => max( 1, (int) round( $words / 200 ) ),
		'cat'         => $cat ? $cat->name : 'Blog',
		'cat_url'     => $cat ? get_category_link( $cat ) : $blog,
		'cat_id'      => $cat ? (int) $cat->term_id : 0,
		'blog_url'    => $blog,
		'author'      => $aname,
		'author_bio'  => $abio ? $abio : 'Team Influencee · scrive di strategia e creator marketing.',
		'avatar'      => ! empty( $m['avatar'] ) ? $m['avatar'] : ( $author ? get_avatar_url( $author->ID, array( 'size' => 96 ) ) : '' ),
		'author_role' => ! empty( $m['author_role'] ) ? $m['author_role'] : '',
		'related_html' => ! empty( $m['related_html'] ) ? $m['related_html'] : '',
		'image'       => $image ? $image : '',
		'published'   => get_post_time( 'c', false, $post ),
		'modified'    => get_post_modified_time( 'c', false, $post ),
		'updated_txt' => get_the_modified_date( 'j F Y', $post ),
	);
	wp_reset_postdata();
	return $cache[ $post->ID ];
}

/** Dati strutturati: Article + percorso + FAQ, con editore Influencee. */
function inft_article_ld( $a ) {
	$org     = inft_org_ld(); // stessa entità delle altre pagine (Core)
	$article = array(
		'@type'            => 'BlogPosting',
		'@id'              => $a['url'] . '#articolo',
		'mainEntityOfPage' => $a['url'],
		'headline'         => mb_substr( $a['title'], 0, 110 ),
		'description'      => $a['excerpt'] ? $a['excerpt'] : wp_trim_words( wp_strip_all_tags( $a['html'] ), 30, '…' ),
		'datePublished'    => $a['published'],
		'dateModified'     => $a['modified'],
		'inLanguage'       => 'it-IT',
		'wordCount'        => $a['words'],
		'articleSection'   => $a['cat'],
		'author'           => 'Team Influencee' === $a['author'] ? array( '@id' => home_url( '/#org' ) ) : array_filter( array( '@type' => 'Person', 'name' => $a['author'], 'jobTitle' => $a['author_role'], 'worksFor' => array( '@id' => home_url( '/#org' ) ) ) ),
		'publisher'        => array( '@id' => home_url( '/#org' ) ),
	);
	if ( $a['image'] ) {
		$article['image'] = $a['image'];
	}
	$graph = array(
		$org,
		$article,
		array(
			'@type'           => 'BreadcrumbList',
			'itemListElement' => array(
				array( '@type' => 'ListItem', 'position' => 1, 'name' => 'Home', 'item' => home_url( '/' ) ),
				array( '@type' => 'ListItem', 'position' => 2, 'name' => 'Blog', 'item' => $a['blog_url'] ),
				array( '@type' => 'ListItem', 'position' => 3, 'name' => $a['cat'], 'item' => $a['cat_url'] ),
				array( '@type' => 'ListItem', 'position' => 4, 'name' => $a['title'], 'item' => $a['url'] ),
			),
		),
	);
	if ( $a['faq'] ) {
		$graph[] = array(
			'@type'      => 'FAQPage',
			'mainEntity' => array_map(
				function ( $q ) {
					return array( '@type' => 'Question', 'name' => $q['q'], 'acceptedAnswer' => array( '@type' => 'Answer', 'text' => $q['a'] ) );
				},
				$a['faq']
			),
		);
	}
	return array( '@context' => 'https://schema.org', '@graph' => $graph );
}

/* ════════════════════════════════════════════════════════════════════
   HTML DELLA PAGINA
   ════════════════════════════════════════════════════════════════════ */

function inft_article_card( $p ) {
	$img = get_the_post_thumbnail_url( $p, 'medium_large' );
	$c   = get_the_category( $p->ID );
	$min = max( 1, (int) round( count( preg_split( '/\s+/u', trim( wp_strip_all_tags( $p->post_content ) ) ) ) / 200 ) );
	return '<article class="ia-card"><a href="' . esc_url( get_permalink( $p ) ) . '">'
		. ( $img ? '<img src="' . esc_url( $img ) . '" alt="" loading="lazy" decoding="async" width="768" height="576">' : '<span class="ia-card-ph" aria-hidden="true"></span>' )
		. '<span class="ia-card-meta"><span class="inf-pill inf-pill-sm">' . esc_html( $c ? $c[0]->name : 'Blog' ) . '</span> ' . (int) $min . ' min</span>'
		. '<h3>' . esc_html( wp_strip_all_tags( get_the_title( $p ) ) ) . '</h3>'
		. '<time datetime="' . esc_attr( get_post_time( 'c', false, $p ) ) . '">' . esc_html( get_the_date( 'j F Y', $p ) ) . '</time>'
		. '</a></article>';
}

function inft_article_related( $post, $a ) {
	$args = array( 'post_type' => 'post', 'post_status' => 'publish', 'posts_per_page' => 4, 'post__not_in' => array( $post->ID ), 'ignore_sticky_posts' => true, 'no_found_rows' => true );
	$list = $a['cat_id'] ? get_posts( $args + array( 'category__in' => array( $a['cat_id'] ) ) ) : array();
	if ( count( $list ) < 4 ) {
		$list = array_merge( $list, get_posts( array_merge( $args, array( 'posts_per_page' => 4 - count( $list ), 'post__not_in' => array_merge( array( $post->ID ), wp_list_pluck( $list, 'ID' ) ) ) ) ) );
	}
	return $list;
}

function inft_article_html( $post ) {
	$a    = inft_article_data( $post );
	$e    = 'esc_html';
	$date = $a['published'] ? mysql2date( 'j M Y', get_post_time( 'Y-m-d H:i:s', false, $post ) ) : '';
	// Schema "ifn-post" (modello degli articoli del sito, es. /benchmark-influencer-2026-…/): stesse classi e stesso CSS
	$h  = '<main id="ia" class="ia" data-inft-track data-page-type="articolo">';
	$h .= '<article class="ifn-post" itemscope itemtype="https://schema.org/BlogPosting">';
	$h .= '<nav class="ifn-post__crumbs" aria-label="Breadcrumb" data-section="testata"><a href="' . esc_url( home_url( '/' ) ) . '">Home</a> <span class="sep">›</span> <a href="' . esc_url( $a['blog_url'] ) . '">Blog</a> <span class="sep">›</span> <span>' . $e( wp_trim_words( $a['title'], 6, '…' ) ) . '</span></nav>';
	$h .= '<a class="ifn-post__cat" href="' . esc_url( $a['cat_url'] ) . '">' . $e( $a['cat'] ) . '</a>';
	$h .= '<h1 itemprop="headline">' . $e( $a['title'] ) . '</h1>';
	if ( $a['excerpt'] ) {
		$h .= '<p class="ifn-post__sub">' . $e( $a['excerpt'] ) . '</p>';
	}
	$h .= '<div class="ifn-post__author" data-section="autore">';
	if ( $a['avatar'] ) {
		$h .= '<img class="ifn-post__avatar" src="' . esc_url( $a['avatar'] ) . '" alt="' . esc_attr( $a['author'] ) . '" width="48" height="48" loading="eager" decoding="async">';
	}
	$h .= '<div class="ifn-post__author-meta"><span class="ifn-post__author-name" itemprop="author" itemscope itemtype="https://schema.org/Person"><span itemprop="name">' . $e( $a['author'] ) . '</span></span>';
	$h .= '<span class="ifn-post__author-title">' . $e( $a['author_role'] ? $a['author_role'] : $a['author_bio'] ) . '</span></div>';
	$h .= '<div class="ifn-post__date-row"><time datetime="' . esc_attr( substr( $a['published'], 0, 10 ) ) . '" itemprop="datePublished">' . $e( $date ) . '</time><span class="dot"></span><span>' . (int) $a['minutes'] . ' min lettura</span></div></div>';
	$h .= '<figure class="ifn-post__hero"><div class="ifn-post__hero-fallback">' . $e( $a['title'] ) . '</div>';
	if ( $a['image'] ) {
		$h .= '<img src="' . esc_url( $a['image'] ) . '" alt="' . esc_attr( $a['title'] ) . '" loading="eager" fetchpriority="high" decoding="async">';
	}
	$h .= '</figure>';
	$h .= '<div class="ia-content" data-section="testo" data-inft-read>' . $a['html'] . '</div>'; // phpcs:ignore -- testo dell'articolo già filtrato da WordPress e ripulito
	if ( $a['faq_show'] ) {
		$h .= '<section class="ifn-post__faq" data-section="faq"><h2 id="faq">Domande frequenti</h2>';
		foreach ( $a['faq'] as $q ) {
			$h .= '<details><summary>' . $e( $q['q'] ) . '</summary><div class="faq-a"><p>' . $e( $q['a'] ) . '</p></div></details>';
		}
		$h .= '</section>';
	}
	// lead verso tandem (lo script del sito raccoglie i form con data-tandem), nello stile dei box del modello
	$h .= '<section id="ia-lead" class="ia-lead" data-section="modulo_lead"><p><strong>Vuoi applicarlo alla tua campagna?</strong><br>Dicci categoria, zona e budget: il team di Influencee ti propone una prima selezione di creator italiani. Nessun impegno.</p>';
	$h .= '<form class="ia-form" id="lead-form-articolo" data-tandem data-form="lead_articolo" data-inft-lead>'
		. '<p class="ia-f"><label for="ia-nome">Nome</label><input id="ia-nome" name="nome" autocomplete="name" required></p>'
		. '<p class="ia-f"><label for="ia-email">Email</label><input id="ia-email" type="email" name="email" autocomplete="email" required></p>'
		. '<p class="ia-f"><label for="ia-tel">Telefono <small>(facoltativo)</small></label><input id="ia-tel" type="tel" name="telefono" autocomplete="tel"></p>'
		. '<p class="ia-f ia-f-full"><label for="ia-rich">Di cosa hai bisogno</label><textarea id="ia-rich" name="richiesta" rows="3" placeholder="Brand, categoria, zona, budget…"></textarea></p>'
		. '<textarea name="risultato_tool" hidden readonly>' . $e( 'Articolo: ' . $a['title'] ) . '</textarea>'
		. '<label class="ia-check ia-f-full"><input type="checkbox" name="consenso_marketing" value="Sì"> Voglio ricevere novità e tool gratuiti di Influencee (facoltativo)</label>'
		. '<p class="ia-f-full"><button type="submit" class="ia-btn">Ricevi la selezione →</button></p>'
		. '<p class="ia-small ia-f-full">Usiamo i tuoi dati solo per risponderti. <a href="' . esc_url( home_url( '/privacy-policy/' ) ) . '">Informativa privacy</a></p>'
		. '<p class="inf-ok ia-ok ia-f-full" role="status" hidden>Richiesta ricevuta: ti rispondiamo presto.</p>'
		. '</form></section>';
	// "Continua a leggere": quelli scelti nell'articolo (link interni di oggi), altrimenti stessi argomenti
	if ( ! empty( $a['related_html'] ) ) {
		$h .= str_replace( '<section class="ifn-post__related"', '<section class="ifn-post__related" data-section="correlati"', $a['related_html'] ); // phpcs:ignore -- HTML dell'articolo, già ripulito
	} else {
		$rel = inft_article_related( $post, $a );
		if ( $rel ) {
			$h .= '<section class="ifn-post__related" data-section="correlati"><h2>Continua a leggere</h2><div class="ifn-post__related-grid">';
			foreach ( $rel as $p ) {
				$c   = get_the_category( $p->ID );
				$h  .= '<a href="' . esc_url( get_permalink( $p ) ) . '"><p class="ifn-post__related-cat">' . $e( $c ? $c[0]->name : 'Blog' ) . '</p><p class="ifn-post__related-title">' . $e( wp_strip_all_tags( get_the_title( $p ) ) ) . '</p></a>';
			}
			$h .= '</div></section>';
		}
	}
	return $h . '</article></main>';
}

/* ════════════════════════════════════════════════════════════════════
   PRESA IN CARICO, FILE E INTESTAZIONE
   ════════════════════════════════════════════════════════════════════ */

add_action(
	'template_redirect',
	function () {
		$post = inft_article_current();
		if ( ! $post || ( function_exists( 'inft_current' ) && inft_current() ) ) {
			return; // le pagine tool del plugin hanno la precedenza (es. fake follower, engagement rate)
		}
		$html = inft_article_html( $post );
		ob_start( 'inft_article_clean_page' );
		inft_get_header(); // Core: intestazione del Tema se acceso, altrimenti quella del tema WordPress
		echo $html; // phpcs:ignore WordPress.Security.EscapeOutput -- costruito ed escapato in inft_article_html
		inft_get_footer();
		ob_end_flush();
		exit;
	},
	6
);

/** Togli dalla coda CSS e JavaScript di Elementor e del tema (solo sugli articoli). */
function inft_article_strip_assets() {
	if ( ! inft_article_current() ) {
		return;
	}
	$re = '/^(elementor|e-|swiper|widget-|hello-elementor-theme|hello-elementor-header-footer|elementor-icons)/';
	foreach ( array( wp_styles(), wp_scripts() ) as $q ) {
		foreach ( (array) $q->queue as $h ) {
			if ( preg_match( $re, $h ) ) {
				$q->dequeue( $h );
			}
		}
	}
}
add_action( 'wp_enqueue_scripts', 'inft_article_strip_assets', 9999 );
add_action( 'wp_print_styles', 'inft_article_strip_assets', 0 );
add_action( 'wp_print_scripts', 'inft_article_strip_assets', 0 );
add_action( 'wp_print_footer_scripts', 'inft_article_strip_assets', 0 );

add_action(
	'wp_enqueue_scripts',
	function () {
		if ( ! inft_article_current() ) {
			return;
		}
		inft_enqueue_base(); // Core: CSS base + tracciamento GA4
		wp_enqueue_style( 'inft-articolo', INFA_URL . 'assets/articolo.css', array( 'inft-base' ), INFA_VERSION );
		wp_enqueue_script( 'inft-articolo', INFA_URL . 'assets/articolo.js', array(), INFA_VERSION, array( 'in_footer' => true, 'strategy' => 'defer' ) );
	},
	100
);

add_action(
	'wp_head',
	function () {
		$post = inft_article_current();
		if ( ! $post || ( function_exists( 'inft_current' ) && inft_current() ) ) {
			return;
		}
		$a = inft_article_data( $post );
		echo "\n<!-- Influencee Tools: articolo -->\n";
		echo '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' . "\n";
		echo '<meta data-inft property="article:published_time" content="' . esc_attr( $a['published'] ) . '">' . "\n";
		echo '<meta data-inft property="article:modified_time" content="' . esc_attr( $a['modified'] ) . '">' . "\n";
		echo '<script type="application/ld+json" data-inft>' . wp_json_encode( inft_article_ld( $a ), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES ) . '</script>' . "\n";
	},
	1
);

/** Rimuove un elemento con i suoi figli (gestisce tag annidati con lo stesso nome). */
function inft_remove_element( $html, $open_re, $tag ) {
	while ( preg_match( $open_re, $html, $m, PREG_OFFSET_CAPTURE ) ) {
		$start = $m[0][1];
		$pos   = $start + strlen( $m[0][0] );
		$depth = 1;
		while ( $depth > 0 && preg_match( '#<(/?)' . $tag . '\b[^>]*>#i', $html, $t, PREG_OFFSET_CAPTURE, $pos ) ) {
			$depth += '/' === $t[1][0] ? -1 : 1;
			$pos    = $t[0][1] + strlen( $t[0][0] );
		}
		if ( $depth > 0 ) {
			break;
		}
		$html = substr( $html, 0, $start ) . substr( $html, $pos );
	}
	return $html;
}

/**
 * Pagina finale dell'articolo:
 * - header e footer di Elementor (già nascosti dal CSS del sito) tolti dall'HTML;
 * - un solo blocco di dati strutturati (il nostro) al posto di quelli di altri plugin;
 * - canonical e immagine di anteprima aggiunti se mancano.
 * Titolo e description restano quelli del plugin SEO del sito.
 */
function inft_article_clean_page( $html ) {
	$html = inft_remove_element( $html, '#<header\b[^>]*data-elementor-type=["\']header["\'][^>]*>#i', 'header' );
	$html = inft_remove_element( $html, '#<footer\b[^>]*data-elementor-type=["\']footer["\'][^>]*>#i', 'footer' );
	$html = preg_replace( '#<script\s+type=["\']application/ld\+json["\'](?![^>]*data-inft)[^>]*>.*?</script>\s*#is', '', $html );
	$post = inft_article_current();
	if ( $post ) {
		$a    = inft_article_data( $post );
		$html = inft_article_seo_head( $html, $a );
		if ( function_exists( 'inft_fix_links' ) ) {
			$html = inft_fix_links( $html ); // Core: niente link a 404 o a redirect
		}
		$add = '';
		if ( ! preg_match( '#<link[^>]+rel=["\']canonical["\']#i', $html ) ) {
			$add .= '<link rel="canonical" href="' . esc_url( $a['url'] ) . '">' . "\n";
		}
		if ( $a['image'] && ! preg_match( '#<meta[^>]+property=["\']og:image["\']#i', $html ) ) {
			$add .= '<meta data-inft property="og:image" content="' . esc_url( $a['image'] ) . '">' . "\n" . '<meta data-inft name="twitter:card" content="summary_large_image">' . "\n";
		}
		if ( $add ) {
			$html = preg_replace( '#</head>#i', $add . '</head>', $html, 1 );
		}
	}
	return $html;
}

/** Title SEO (massimo 60 caratteri) per gli articoli con il titolo troppo lungo (verifica del 29/10/2026). */
function inft_article_titoli_seo() {
	return array(
		'/10-idee-per-gestire-il-tuo-profilo-instagram-in-modo-creativo/' => '10 idee per gestire il profilo Instagram in modo creativo',
		'/3-motivi-per-cui-i-marchi-di-viaggio-hanno-bisogno-di-influencer-nei-social-media/' => 'Travel influencer: 3 motivi per cui servono ai brand',
		'/5-consigli-per-scegliere-linfluencer-giusto-per-la-tua-azienda/' => '5 consigli per scegliere l’influencer giusto per l’azienda',
		'/6-consigli-per-avere-successo-nelle-collaborazioni-con-i-brand-su-youtube/' => 'Collaborazioni con i brand su YouTube: 6 consigli',
		'/ai-e-influencer-marketing-nel-2026-come-raddoppiare-il-roi-dei-creator/' => 'AI e influencer marketing 2026: come aumentare il ROI',
		'/benchmark-influencer-2026-i-nuovi-standard-del-mercato/' => 'Benchmark influencer 2026: i nuovi standard del mercato',
		'/buzzsumo-guida-completa-2025-per-trovare-contenuti-virali-e-analizzare-la-concorrenza/' => 'BuzzSumo: guida per trovare contenuti virali',
		'/come-creare-contenuti-virali-sui-social-media-strategie-strumenti-e-trend-2025/' => 'Contenuti virali sui social: strategie e strumenti',
		'/come-creare-strategia-content-marketing-efficace/' => 'Strategia di content marketing efficace: come crearla',
		'/come-creare-una-influencer-marketing-strategy-nel-2026/' => 'Influencer marketing strategy 2026: come crearla',
		'/come-fare-un-piano-editoriale-efficace-guida-pratica-2025/' => 'Come fare un piano editoriale efficace: guida pratica',
		'/come-il-marketing-dei-micro-influencer-condiziona-il-comportamento-dacquisto-dei-consumatori/' => 'Micro influencer e comportamento d’acquisto',
		'/come-ottenere-il-massimo-dalla-collaborazione-con-un-influencer/' => 'Collaborazione con un influencer: come ottenere il massimo',
		'/come-ottenere-la-spunta-blu-su-facebook-guida-completa/' => 'Spunta blu su Facebook: come ottenerla',
		'/come-perche-dovresti-attirare-i-proprietari-di-animali-domestici-per-il-tuo-marchio/' => 'Proprietari di animali: perché attirarli con gli influencer',
		'/come-trasformare-clienti-brand-ambassador/' => 'Come trasformare i clienti in brand ambassador',
		'/come-trovare-un-influencer-del-brand-per-promuovere-la-propria-attivita/' => 'Come trovare influencer per il brand: criteri e checklist',
		'/content-creator-vs-influencer-differenze-vantaggi-e-strategie/' => 'Content creator vs influencer: differenze e strategie',
		'/creare-un-media-kit-perfetto-per-influencer-guida-in-5-step/' => 'Media kit influencer perfetto: guida in 5 step',
		'/ecommerce-i-vantaggi-della-user-generated-content/' => 'UGC per ecommerce: vantaggi, esempi e strategia',
		'/guida-alla-pianificazione-content-creator-geolocalizzati-per-retail-nel-2026/' => 'Content creator geolocalizzati per il retail: guida 2026',
		'/guida-alla-verifica-su-tiktok-diventa-un-influencer-autentico-e-autorevole/' => 'Verifica su TikTok: come ottenerla in 6 consigli',
		'/hashtag-piu-cercati-su-instagram/' => 'Hashtag più cercati su Instagram dalle aziende',
		'/i-10-food-influencer-piu-popolari-su-tiktok/' => '10 food influencer italiani più popolari su TikTok',
		'/in-che-modo-pianificare-il-budget-influencer/' => 'Come pianificare il budget per gli influencer',
		'/influencer-affidabili-caratteristiche-successo/' => 'Influencer affidabili: le caratteristiche del successo',
		'/influencer-marketing-cose-come-funziona/' => 'Influencer marketing: cos’è e come funziona',
		'/instagram-follower-gratis-perche-evitarli-e-come-crescere-davvero/' => 'Follower Instagram gratis: perché evitarli nel 2026',
		'/la-rivoluzione-ugc-nel-2024impatto-e-strategie-dei-creator-sui-brand/' => 'Rivoluzione UGC: l’impatto dei creator sui brand',
		'/le-8-regole-del-personal-branding-una-guida-essenziale/' => 'Le 8 regole del personal branding: guida essenziale',
		'/local-influencer-marketing-per-promuovere-le-imprese-locali/' => 'Local influencer marketing per le imprese locali',
		'/micro-influencer-b2b-per-startup-come-generare-lead-qualificati-nel-2026/' => 'Micro influencer B2B per startup: lead qualificati',
		'/migliori-app-gestione-follower/' => 'Migliori app per gestire i follower Instagram (2026)',
		'/social-content-creator/' => 'Social content creator: chi è e cosa fa per i brand',
		'/travel-influencer-perche-usarli-e-dove-trovarli/' => 'Travel influencer marketing 2026: come scegliere i creator',
	);
}

/** Description riscritte: troppo corte o troppo lunghe (verifica del 29/10/2026). */
function inft_article_desc_seo() {
	return array(
		'/come-guadagnare-con-i-social-media/' => 'Come guadagnare con i social media: le basi per monetizzare come influencer, dalle collaborazioni con i brand all’affiliazione ai contenuti UGC.',
		'/i-10-food-influencer-piu-popolari-su-tiktok/' => 'I 10 food influencer italiani più seguiti su TikTok: chi sono, che contenuti pubblicano e come collaborare con loro per una campagna food.',
		'/migliori-app-gestione-follower/' => 'Le migliori app per gestire i follower su Instagram nel 2026: cosa fanno e come scegliere quella giusta senza rischi per il tuo account.',
		'/benchmark-influencer-2026-i-nuovi-standard-del-mercato/' => 'Benchmark di influencer marketing 2026: engagement rate, CPM e CPE per Instagram, TikTok e YouTube, con i KPI aggiornati per le campagne.',
		'/come-impostare-una-collaborazione-con-gli-influencer/' => 'Come impostare una collaborazione con gli influencer: obiettivi, scelta dei creator, brief, compenso e misurazione dei risultati, passo per passo.',
	);
}

/**
 * Testata dell'articolo: un solo <title> (alcuni articoli ne avevano un secondo dentro il testo), title SEO entro
 * 60 caratteri, una sola description e un solo canonical, Open Graph completo se manca.
 */
function inft_article_seo_head( $html, $a ) {
	$path = (string) wp_parse_url( $a['url'], PHP_URL_PATH );
	$end  = stripos( $html, '</head>' );
	if ( false === $end ) {
		return $html;
	}
	$head = substr( $html, 0, $end );
	$body = substr( $html, $end );
	// <title> e description dentro il corpo (testi incollati come pagina HTML intera): via
	$body = preg_replace( '#<title\b[^>]*>.*?</title>#is', '', $body );
	$body = preg_replace( '#<meta\b[^>]*name=["\']description["\'][^>]*>#i', '', $body );
	$n    = 0;
	$head = preg_replace_callback( '#<title\b[^>]*>.*?</title>#is', function ( $m ) use ( &$n ) {
		return 0 === $n++ ? $m[0] : '';
	}, $head );
	$n    = 0;
	$head = preg_replace_callback( '#<link\b[^>]*rel=["\']canonical["\'][^>]*>\s*#i', function ( $m ) use ( &$n ) {
		return 0 === $n++ ? $m[0] : '';
	}, $head );
	// title
	$map   = inft_article_titoli_seo();
	$title = '';
	if ( preg_match( '#<title\b[^>]*>(.*?)</title>#is', $head, $t ) ) {
		$title = trim( html_entity_decode( wp_strip_all_tags( $t[1] ), ENT_QUOTES, 'UTF-8' ) );
	}
	if ( isset( $map[ $path ] ) ) {
		$title = $map[ $path ];
	} elseif ( mb_strlen( $title ) > 60 ) {
		$title = trim( preg_replace( '/\s*[–|\-]\s*Influencee(\.it)?\s*$/u', '', $title ) ); // via il nome del sito se non ci sta
	}
	if ( $title ) {
		$new  = '<title>' . esc_html( $title ) . '</title>';
		$head = preg_match( '#<title\b#i', $head ) ? preg_replace( '#<title\b[^>]*>.*?</title>#is', $new, $head, 1 ) : $head . $new . "\n";
	}
	// description
	$dmap = inft_article_desc_seo();
	$desc = '';
	if ( preg_match( '#<meta\b[^>]*name=["\']description["\'][^>]*content=["\']([^"\']*)["\'][^>]*>#i', $head, $d ) ) {
		$desc = html_entity_decode( $d[1], ENT_QUOTES, 'UTF-8' );
	}
	if ( isset( $dmap[ $path ] ) ) {
		$desc = $dmap[ $path ];
		$head = preg_replace( '#<meta\b[^>]*name=["\']description["\'][^>]*>\s*#i', '', $head );
		$head .= '<meta data-inft name="description" content="' . esc_attr( $desc ) . '">' . "\n";
	}
	// Open Graph, se nessun plugin SEO lo stampa
	if ( ! preg_match( '#property=["\']og:title["\']#i', $head ) ) {
		$og  = '<meta data-inft property="og:type" content="article">' . "\n";
		$og .= '<meta data-inft property="og:locale" content="it_IT">' . "\n";
		$og .= '<meta data-inft property="og:site_name" content="Influencee">' . "\n";
		$og .= '<meta data-inft property="og:title" content="' . esc_attr( $title ) . '">' . "\n";
		$og .= $desc ? '<meta data-inft property="og:description" content="' . esc_attr( $desc ) . '">' . "\n" : '';
		$og .= '<meta data-inft property="og:url" content="' . esc_url( $a['url'] ) . '">' . "\n";
		$head .= $og;
	}
	return $head . $body;
}

/** Elenco degli articoli per le impostazioni: percorso, titolo e se è acceso. */
function inft_articles_list() {
	$out = array();
	foreach ( get_posts( array( 'post_type' => 'post', 'post_status' => 'publish', 'numberposts' => 500, 'orderby' => 'date', 'order' => 'DESC' ) ) as $p ) {
		$out[ inft_post_path( $p ) ] = wp_strip_all_tags( get_the_title( $p ) );
	}
	return $out;
}

/**
 * Articoli scritti col vecchio modello "ifn-post" dentro il testo (26 articoli):
 * si leggono autore, ruolo, foto, sottotitolo, data e immagine e si tolgono le parti
 * che il nuovo modello mostra già (percorso, categoria, titolo ripetuto, autore, indice, correlati).
 */
function inft_article_ifn_template( $dom, $xp, $root ) {
	$meta = array();
	$post = $xp->query( './/*[contains(concat(" ",normalize-space(@class)," ")," ifn-post ")]', $root )->item( 0 );
	if ( ! $post ) {
		return $meta;
	}
	$q    = function ( $cls, $ctx = null ) use ( $xp, $post ) {
		return $xp->query( './/*[contains(concat(" ",normalize-space(@class)," ")," ' . $cls . ' ")]', $ctx ? $ctx : $post );
	};
	$txt  = function ( $n ) {
		return $n ? trim( preg_replace( '/\s+/u', ' ', $n->textContent ) ) : '';
	};
	$drop = function ( $n ) {
		if ( $n && $n->parentNode ) {
			$n->parentNode->removeChild( $n );
		}
	};
	$sub = $q( 'ifn-post__sub' )->item( 0 );
	if ( $sub ) {
		$meta['lead'] = $txt( $sub );
		// il titolo ripetuto è l'H1/H2 subito prima del sottotitolo
		$prev = $sub->previousSibling;
		while ( $prev && XML_ELEMENT_NODE !== $prev->nodeType ) {
			$prev = $prev->previousSibling;
		}
		if ( $prev && preg_match( '/^h[12]$/', $prev->nodeName ) ) {
			$drop( $prev );
		}
		$drop( $sub );
	}
	$author = $q( 'ifn-post__author' )->item( 0 );
	if ( $author ) {
		$name = $q( 'ifn-post__author-name', $author )->item( 0 );
		$role = $q( 'ifn-post__author-title', $author )->item( 0 );
		$img  = $xp->query( './/img', $author )->item( 0 );
		$time = $xp->query( './/time', $author )->item( 0 );
		$meta['author']      = $txt( $name );
		$meta['author_role'] = $txt( $role );
		$meta['avatar']      = $img ? $img->getAttribute( 'src' ) : '';
		$meta['date']        = $time ? $time->getAttribute( 'datetime' ) : '';
		$drop( $author );
	}
	$hero = $q( 'ifn-post__hero' )->item( 0 );
	if ( $hero ) {
		$img = $xp->query( './/img', $hero )->item( 0 );
		if ( $img ) {
			$meta['image'] = $img->getAttribute( 'src' );
			$drop( $hero );
		} elseif ( ! $xp->query( './/svg', $hero )->length ) {
			$drop( $hero ); // solo il riquadro di testo di riserva
		}
	}
	$rel = $q( 'ifn-post__related' )->item( 0 );
	if ( $rel ) {
		$meta['related_html'] = preg_replace( array( '#<br\s*/?>#i', '#<p>\s*</p>#i' ), '', $dom->saveHTML( $rel ) ); // i "Continua a leggere" scelti a mano: stessi link interni di oggi
	}
	foreach ( array( 'ifn-post__crumbs', 'ifn-post__date-row', 'ifn-post__toc', 'ifn-post__related' ) as $cls ) {
		foreach ( iterator_to_array( $q( $cls ) ) as $n ) {
			$drop( $n );
		}
	}
	foreach ( iterator_to_array( $q( 'ifn-post__cat' ) ) as $n ) {
		$p = $n->parentNode;
		$drop( $n );
		if ( $p && 'p' === $p->nodeName && '' === trim( $p->textContent ) ) {
			$drop( $p );
		}
	}
	// il contenitore <article class="ifn-post"> si toglie lasciando il contenuto
	while ( $post->firstChild ) {
		$post->parentNode->insertBefore( $post->firstChild, $post );
	}
	$drop( $post );
	return $meta;
}

/** Tiene solo le regole CSS i cui selettori corrispondono a $re (anche dentro @media) e le variabili usate. */
function inft_css_keep( $css, $re ) {
	$css  = preg_replace( '#/\*.*?\*/#s', '', (string) $css );
	$out  = '';
	$len  = strlen( $css );
	$i    = 0;
	while ( $i < $len ) {
		$open = strpos( $css, '{', $i );
		if ( false === $open ) {
			break;
		}
		$sel   = trim( substr( $css, $i, $open - $i ) );
		$depth = 1;
		$j     = $open + 1;
		while ( $j < $len && $depth > 0 ) {
			if ( '{' === $css[ $j ] ) {
				$depth++;
			} elseif ( '}' === $css[ $j ] ) {
				$depth--;
			}
			$j++;
		}
		$body = substr( $css, $open + 1, $j - $open - 2 );
		if ( 0 === strpos( $sel, '@media' ) || 0 === strpos( $sel, '@supports' ) ) {
			$inner = inft_css_keep( $body, $re );
			if ( '' !== $inner ) {
				$out .= $sel . '{' . $inner . '}';
			}
		} elseif ( 0 === strpos( $sel, '@keyframes' ) ) {
			$out .= $sel . '{' . $body . '}';
		} elseif ( preg_match( $re, $sel ) ) {
			$out .= $sel . '{' . $body . '}';
		} elseif ( preg_match_all( '/(--[\w-]+)\s*:\s*([^;]+)/', $body, $m, PREG_SET_ORDER ) && preg_match( '/(:root|\.ifn-post)\s*$/', $sel ) ) {
			// variabili (colori, raggi) usate dai disegni: valgono dentro l'articolo
			$vars = '';
			foreach ( $m as $v ) {
				$vars .= $v[1] . ':' . trim( $v[2] ) . ';';
			}
			$out .= '.ia-content{' . $vars . '}';
		}
		$i = $j;
	}
	return $out;
}

/**
 * Caratteri rovinati da una doppia codifica (es. "Ã¨" al posto di "è", "Â·" al posto di "·").
 * Si correggono solo le sequenze che tornano UTF-8 valido, e solo se nel testo ce ne sono almeno 3.
 */
function inft_fix_mojibake( $s, $force = false ) {
	if ( ! is_string( $s ) || ( ! $force && preg_match_all( '/[\x{00C2}-\x{00F4}][\x{0080}-\x{00BF}\x{0152}\x{0153}\x{0160}\x{0161}\x{0178}\x{017D}\x{017E}\x{2013}\x{2014}\x{2018}-\x{201E}\x{2020}-\x{2022}\x{2026}\x{20AC}\x{2122}]/u', $s ) < 3 ) ) {
		return $s;
	}
	return preg_replace_callback(
		'/[\x{00C2}-\x{00F4}][\x{0080}-\x{00BF}\x{0152}\x{0153}\x{0160}\x{0161}\x{0178}\x{017D}\x{017E}\x{2013}\x{2014}\x{2018}-\x{201E}\x{2020}-\x{2022}\x{2026}\x{20AC}\x{2122}]+/u',
		function ( $m ) {
			foreach ( array( 'Windows-1252', 'ISO-8859-1' ) as $enc ) {
				$b = mb_convert_encoding( $m[0], $enc, 'UTF-8' );
				if ( mb_check_encoding( $b, 'UTF-8' ) && $b !== $m[0] ) {
					return $b;
				}
			}
			return $m[0];
		},
		$s
	);
}
