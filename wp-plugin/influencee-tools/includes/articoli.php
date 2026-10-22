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
	foreach ( iterator_to_array( $xp->query( './/table|.//iframe', $root ) ) as $t ) {
		$wrap = $dom->createElement( 'div' );
		$wrap->setAttribute( 'class', 'table' === $t->nodeName ? 'ia-table' : 'ia-embed' );
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
	$logo    = get_theme_mod( 'custom_logo' ) ? wp_get_attachment_image_url( (int) get_theme_mod( 'custom_logo' ), 'full' ) : get_site_icon_url( 512 );
	// stessa entità delle altre pagine del plugin (@id /#org): coerenza per Google e motori AI
	$org     = array( '@type' => 'Organization', '@id' => home_url( '/#org' ), 'name' => 'Influencee', 'legalName' => INFT_COMPANY, 'url' => home_url( '/' ) );
	if ( $logo ) {
		$org['logo'] = array( '@type' => 'ImageObject', 'url' => $logo );
	}
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
		. '<span class="ia-card-meta"><span class="ia-pill ia-pill-sm">' . esc_html( $c ? $c[0]->name : 'Blog' ) . '</span> ' . (int) $min . ' min</span>'
		. '<h3>' . esc_html( wp_strip_all_tags( get_the_title( $p ) ) ) . '</h3>'
		. '<time datetime="' . esc_attr( get_post_time( 'c', false, $p ) ) . '">' . esc_html( get_the_date( 'j F Y', $p ) ) . '</time>'
		. '</a></article>';
}

function inft_article_related( $post, $a ) {
	$args = array( 'post_type' => 'post', 'post_status' => 'publish', 'posts_per_page' => 3, 'post__not_in' => array( $post->ID ), 'ignore_sticky_posts' => true, 'no_found_rows' => true );
	$list = $a['cat_id'] ? get_posts( $args + array( 'category__in' => array( $a['cat_id'] ) ) ) : array();
	if ( count( $list ) < 3 ) {
		$list = array_merge( $list, get_posts( array_merge( $args, array( 'posts_per_page' => 3 - count( $list ), 'post__not_in' => array_merge( array( $post->ID ), wp_list_pluck( $list, 'ID' ) ) ) ) ) );
	}
	return $list;
}

function inft_article_html( $post ) {
	$a   = inft_article_data( $post );
	$e   = 'esc_html';
	$h   = '<main id="ia" class="ia" data-page-type="articolo">';
	$h  .= '<article class="ia-art">';
	// testata
	$h .= '<header class="ia-hero">';
	if ( $a['image'] ) {
		$h .= '<img class="ia-hero-bg" src="' . esc_url( $a['image'] ) . '" alt="" fetchpriority="high" decoding="async">';
	}
	$h .= '<div class="ia-wrap ia-hero-in">';
	$h .= '<nav class="ia-crumbs" aria-label="Percorso"><ol><li><a href="' . esc_url( home_url( '/' ) ) . '">Home</a></li><li><a href="' . esc_url( $a['blog_url'] ) . '">Blog</a></li><li><a href="' . esc_url( $a['cat_url'] ) . '">' . $e( $a['cat'] ) . '</a></li><li aria-current="page">Articolo</li></ol></nav>';
	$h .= '<a class="ia-pill" href="' . esc_url( $a['cat_url'] ) . '">' . $e( $a['cat'] ) . '</a>';
	$h .= '<h1>' . $e( $a['title'] ) . '</h1>';
	if ( $a['excerpt'] ) {
		$h .= '<p class="ia-lead">' . $e( $a['excerpt'] ) . '</p>';
	}
	$h .= '<p class="ia-meta">' . ( $a['avatar'] ? '<img src="' . esc_url( $a['avatar'] ) . '" alt="" width="40" height="40">' : '' ) . '<span><b>' . $e( $a['author'] ) . '</b> · <span>Aggiornato il <time datetime="' . esc_attr( $a['modified'] ) . '">' . $e( $a['updated_txt'] ) . '</time> · ' . (int) $a['minutes'] . ' min di lettura</span></span></p>';
	$h .= '</div></header>';
	// corpo + colonna
	$h .= '<div class="ia-wrap ia-grid"><div class="ia-body">';
	$h .= '<div class="ia-content">' . $a['html'] . '</div>'; // phpcs:ignore -- testo dell'articolo già filtrato da WordPress e ripulito
	if ( $a['faq_show'] ) {
		$h .= '<section class="ia-faq" aria-labelledby="ia-faq-t"><h2 id="ia-faq-t">Domande frequenti</h2>';
		foreach ( $a['faq'] as $q ) {
			$h .= '<details><summary>' . $e( $q['q'] ) . '</summary><p>' . $e( $q['a'] ) . '</p></details>';
		}
		$h .= '</section>';
	}
	$h .= '<aside class="ia-author">' . ( $a['avatar'] ? '<img src="' . esc_url( $a['avatar'] ) . '" alt="" width="64" height="64" loading="lazy">' : '' ) . '<div><p class="ia-author-n">' . $e( $a['author'] ) . '</p><p>' . $e( $a['author_bio'] ) . '</p></div></aside>';
	$h .= '</div><aside class="ia-side">';
	if ( $a['toc'] ) {
		$h .= '<nav class="ia-toc" aria-labelledby="ia-toc-t"><p id="ia-toc-t" class="ia-label">In questo articolo</p><ol>';
		foreach ( $a['toc'] as $t ) {
			$h .= '<li><a href="#' . esc_attr( $t['id'] ) . '">' . $e( $t['text'] ) . '</a></li>';
		}
		$h .= '</ol><button type="button" class="ia-copy" data-ia-copy>Copia il link</button></nav>';
	}
	$h .= '<div class="ia-cta"><p class="ia-cta-t">Vuoi applicarlo alla tua campagna?</p><p>Ti proponiamo una prima selezione di creator italiani adatti al tuo brand.</p><a href="#ia-lead" class="ia-btn ia-btn-acid">Parliamone</a></div>';
	$h .= '</aside></div></article>';
	// lead verso tandem (lo script del sito raccoglie i form con data-tandem)
	$h .= '<section id="ia-lead" class="ia-leadsec"><div class="ia-wrap ia-lead-grid"><div><p class="ia-eyebrow">Selezione gratuita</p><h2>Ti mandiamo i creator <em>adatti alla tua campagna</em></h2><p>Dicci categoria, zona e budget: il team di Influencee ti propone una prima selezione di creator italiani. Nessun impegno.</p></div>';
	$h .= '<form class="ia-form" id="lead-form-articolo" data-tandem data-form="lead_articolo" data-inft-lead>'
		. '<p class="ia-f"><label for="ia-nome">Nome</label><input id="ia-nome" name="nome" autocomplete="name" required></p>'
		. '<p class="ia-f"><label for="ia-email">Email</label><input id="ia-email" type="email" name="email" autocomplete="email" required></p>'
		. '<p class="ia-f"><label for="ia-tel">Telefono (facoltativo)</label><input id="ia-tel" type="tel" name="telefono" autocomplete="tel"></p>'
		. '<p class="ia-f"><label for="ia-rich">Di cosa hai bisogno</label><textarea id="ia-rich" name="richiesta" rows="3" placeholder="Brand, categoria, zona, budget…"></textarea></p>'
		. '<p class="ia-f"><label for="ia-art">Articolo letto</label><textarea id="ia-art" name="risultato_tool" rows="2" readonly>' . $e( 'Articolo: ' . $a['title'] ) . '</textarea></p>'
		. '<label class="ia-check"><input type="checkbox" name="consenso_marketing" value="Sì"> Voglio ricevere novità e tool gratuiti di Influencee (facoltativo)</label>'
		. '<button type="submit" class="ia-btn">Ricevi la selezione</button>'
		. '<p class="ia-small">Usiamo i tuoi dati solo per risponderti. <a href="' . esc_url( home_url( '/privacy-policy/' ) ) . '">Informativa privacy</a></p>'
		. '<p class="ia-ok" role="status" hidden>Richiesta ricevuta: ti rispondiamo presto.</p>'
		. '</form></div></section>';
	// correlati
	$rel = inft_article_related( $post, $a );
	if ( $rel ) {
		$h .= '<section class="ia-related"><div class="ia-wrap"><h2>Articoli <em>correlati</em></h2><div class="ia-cards">';
		foreach ( $rel as $p ) {
			$h .= inft_article_card( $p );
		}
		$h .= '</div><p class="ia-more"><a href="' . esc_url( $a['blog_url'] ) . '" class="ia-btn ia-btn-line">Tutti gli articoli</a></p></div></section>';
	}
	return $h . '</main>';
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
		get_header();
		echo $html; // phpcs:ignore WordPress.Security.EscapeOutput -- costruito ed escapato in inft_article_html
		get_footer();
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
		wp_enqueue_style( 'inft-fonts', 'https://fonts.googleapis.com/css2?family=Inter+Tight:wght@600;700&family=Inter:wght@400;600&display=swap', array(), null );
		wp_enqueue_style( 'inft-articolo', INFT_URL . 'assets/articolo.css', array(), INFT_VERSION );
		wp_enqueue_script( 'inft-articolo', INFT_URL . 'assets/articolo.js', array(), INFT_VERSION, array( 'in_footer' => true, 'strategy' => 'defer' ) );
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
		$a   = inft_article_data( $post );
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
