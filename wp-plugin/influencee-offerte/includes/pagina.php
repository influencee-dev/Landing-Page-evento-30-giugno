<?php
/**
 * Pagina pubblica di ogni offerta: /offerte-lavoro-influencer/<offerta>/ (motore pagine del Core, grafica di
 * Influencee Annunci). Sul sito: titolo, compenso, contenuti, piattaforme, città, scadenza e l'inizio del brief;
 * nome dell'azienda (se non scelto di mostrarlo), brief completo e candidatura sono nell'app.
 */

defined( 'ABSPATH' ) || exit;

/** Offerta da mostrare nella richiesta corrente: pubblicata, oppure in anteprima per chi la può modificare. */
function info_corrente() {
	static $p = false;
	if ( false !== $p ) {
		return $p;
	}
	$p = null;
	if ( empty( infn_settings()['annunci'] ) ) {
		return $p;
	}
	$o = info_da_percorso( inft_request_path() );
	if ( $o && ! info_da_spostare( $o ) && ( 'publish' === $o->post_status || current_user_can( 'edit_post', $o->ID ) ) ) {
		$p = $o;
	}
	return $p;
}

/** Chiusa da più di 30 giorni: la pagina non c'è più, fa 301 alla città o alla bacheca. */
function info_da_spostare( $o ) {
	return 'publish' === $o->post_status && info_chiusa( $o->ID ) && strtotime( info_chiusa_il( $o->ID ) ) < strtotime( '-30 days', current_time( 'timestamp' ) );
}

add_filter(
	'inft_current_page',
	function ( $page ) {
		if ( $page ) {
			return $page;
		}
		$o = info_corrente();
		return $o ? info_page( $o ) : null;
	},
	22
);

/* Offerte chiuse da più di 30 giorni → pagina della città o bacheca; vecchi indirizzi di WP Job Manager → bacheca */
add_action(
	'template_redirect',
	function () {
		if ( empty( infn_settings()['annunci'] ) ) {
			return;
		}
		$path = inft_request_path();
		$o    = info_da_percorso( $path );
		if ( $o && info_da_spostare( $o ) ) {
			$c = info_citta_slug( (string) info_get( $o->ID, 'citta' ) );
			wp_safe_redirect( home_url( $c ? infn_citta_path( $c ) : INFN_BACHECA ), 301, 'Influencee Offerte' );
			exit;
		}
		if ( 0 === strpos( $path, '/offerta-lavoro/' ) && ! post_type_exists( 'job_listing' ) ) {
			$slug = trim( substr( $path, strlen( '/offerta-lavoro/' ) ), '/' );
			$imp  = $slug ? get_posts( array( 'post_type' => INFO_CPT, 'post_status' => 'publish', 'numberposts' => 1, 'meta_key' => '_info_wpjm_slug', 'meta_value' => $slug ) ) : array(); // phpcs:ignore WordPress.DB.SlowDBQuery
			wp_safe_redirect( home_url( $imp && ! info_chiusa( $imp[0]->ID ) ? info_path( $imp[0] ) : INFN_BACHECA ), 301, 'Influencee Offerte' );
			exit;
		}
	},
	1
);

/* Chiuse, bozze e anteprime: fuori dall'indice di Google */
add_filter(
	'wp_robots',
	function ( $robots ) {
		$o = info_corrente();
		if ( $o && ( 'publish' !== $o->post_status || info_chiusa( $o->ID ) ) ) {
			$robots['noindex'] = true;
			$robots['follow']  = true;
			unset( $robots['max-image-preview'] );
		}
		return $robots;
	},
	20
);

add_action(
	'template_redirect',
	function () {
		$o = info_corrente();
		if ( $o && 'publish' !== $o->post_status ) {
			nocache_headers();
			do_action( 'litespeed_control_set_nocache', 'anteprima offerta' );
		}
	},
	5
);

/* Sitemap: le offerte aperte entrano nella sitemap «influencee» del Core */
add_filter(
	'inft_sitemap_percorsi',
	function ( $paths ) {
		if ( ! empty( infn_settings()['annunci'] ) ) {
			foreach ( info_aperte() as $a ) {
				$paths[] = (string) wp_parse_url( $a['url'], PHP_URL_PATH );
			}
		}
		return $paths;
	}
);

/* «Anteprima» nell'amministrazione apre la pagina vera dell'offerta */
add_filter(
	'preview_post_link',
	function ( $link, $post ) {
		return INFO_CPT === $post->post_type && $post->post_name ? home_url( info_path( $post ) ) : $link;
	},
	10,
	2
);

add_filter(
	'post_type_link',
	function ( $link, $post ) {
		return INFO_CPT === $post->post_type && $post->post_name ? home_url( info_path( $post ) ) : $link;
	},
	10,
	2
);

/** Testo breve per la pagina: primi 45 parole del brief (il brief completo è nell'app). */
function info_brief_breve( $post ) {
	return wp_trim_words( wp_strip_all_tags( $post->post_content ), 45, '…' );
}

function info_page( $post ) {
	$a      = info_normalizza( $post );
	$path   = info_path( $post );
	$url    = home_url( $path );
	$chiusa = info_chiusa( $post->ID );
	$cslug  = info_citta_slug( $a['citta'] );
	$dove   = $a['citta'] ? $a['citta'] : 'Tutta Italia';
	$title  = $a['titolo'];
	$suff   = ' – offerta per creator';
	$title  = mb_strlen( $title . $suff ) <= 60 ? $title . $suff : ( mb_strlen( $title ) <= 60 ? $title : rtrim( mb_substr( $title, 0, 59 ) ) . '…' );
	$parti  = array_filter( array( $a['compenso'], $a['contenuto'], $a['piattaforme'] ? implode( ', ', $a['piattaforme'] ) : '', $dove ) );
	$desc   = ( $chiusa ? 'Offerta chiusa. ' : 'Offerta per creator: ' ) . implode( ' · ', $parti ) . ( $a['scadenza'] && ! $chiusa ? '. Candidature entro il ' . date_i18n( 'j F Y', strtotime( $a['scadenza'] ) ) : '' ) . '. Candidati gratis dall’app di Influencee.';
	$crumbs = array(
		array( '@type' => 'ListItem', 'position' => 1, 'name' => 'Home', 'item' => home_url( '/' ) ),
		array( '@type' => 'ListItem', 'position' => 2, 'name' => 'Offerte di lavoro', 'item' => home_url( INFN_BACHECA ) ),
	);
	if ( $cslug ) {
		$crumbs[] = array( '@type' => 'ListItem', 'position' => 3, 'name' => 'Content creator ' . info_citta_pagine()[ $cslug ], 'item' => home_url( infn_citta_path( $cslug ) ) );
	}
	$crumbs[] = array( '@type' => 'ListItem', 'position' => count( $crumbs ) + 1, 'name' => $a['titolo'], 'item' => $url );
	$graph    = array(
		inft_org_ld(),
		array(
			'@type'         => 'WebPage',
			'@id'           => $url . '#pagina',
			'url'           => $url,
			'name'          => $a['titolo'],
			'description'   => $desc,
			'inLanguage'    => 'it-IT',
			'isPartOf'      => array( '@id' => home_url( '/#org' ) ),
			'datePublished' => get_post_time( 'c', false, $post ),
			'dateModified'  => get_post_modified_time( 'c', false, $post ),
		),
		array( '@type' => 'BreadcrumbList', 'itemListElement' => $crumbs ),
	);
	return array(
		'plugin'      => 'annunci', // grafica e script di Influencee Annunci
		'group'       => 'annunci',
		'slug'        => 'offerta-' . $post->post_name,
		'path'        => $path,
		'label'       => $a['titolo'],
		'title'       => $title,
		'description' => mb_strlen( $desc ) > 158 ? rtrim( mb_substr( $desc, 0, 155 ) ) . '…' : $desc,
		'ld'          => array( '@context' => 'https://schema.org', '@graph' => $graph ),
		'render'      => function () use ( $post ) {
			return info_render( $post );
		},
	);
}

function info_render( $post ) {
	$e      = 'esc_html';
	$a      = info_normalizza( $post );
	$chiusa = info_chiusa( $post->ID );
	$cslug  = info_citta_slug( $a['citta'] );
	$dove   = $a['citta'] ? $a['citta'] : 'Tutta Italia';
	$app    = info_link_app( $post );
	$max    = (int) info_get( $post->ID, 'max_creators' );
	$giorni = (int) info_get( $post->ID, 'contenuto_giorni' );
	$merce  = (string) info_get( $post->ID, 'product_desc' );

	$crumbs = '<li><a href="' . esc_url( home_url( '/' ) ) . '">Home</a></li><li><a href="' . esc_url( home_url( INFN_BACHECA ) ) . '">Offerte di lavoro</a></li>';
	if ( $cslug ) {
		$crumbs .= '<li><a href="' . esc_url( home_url( infn_citta_path( $cslug ) ) ) . '">Content creator ' . $e( info_citta_pagine()[ $cslug ] ) . '</a></li>';
	}
	$crumbs .= '<li aria-current="page">' . $e( $a['titolo'] ) . '</li>';

	if ( 'publish' !== $post->post_status ) {
		$live = 'Anteprima: offerta non pubblicata';
	} elseif ( $chiusa ) {
		$live = 'assegnata' === $chiusa ? 'Offerta chiusa: creator già scelti' : 'Offerta chiusa: candidature terminate';
	} else {
		$live = 'Offerta aperta' . ( $a['scadenza'] ? ' · candidature entro il ' . date_i18n( 'j F', strtotime( $a['scadenza'] ) ) : '' );
	}
	if ( $chiusa ) {
		$actions = '<a class="inf-btn inf-btn-acid" href="' . esc_url( home_url( $cslug ? infn_citta_path( $cslug ) : INFN_BACHECA ) ) . '">Vedi le offerte aperte</a><a class="inf-btn infn-btn-ghost" href="#avvisi">Avvisami delle nuove</a>';
	} else {
		$actions = '<a class="inf-btn inf-btn-acid" href="' . esc_url( $app ) . '" data-track="begin_job_apply" data-cta="offerta_testata">Candidati nell’app</a><a class="inf-btn infn-btn-ghost" href="#dettagli">Vedi i dettagli</a>';
	}
	$lead = $a['compenso'] ? $a['compenso'] . ( $a['contenuto'] ? ' per ' . $a['contenuto'] : '' ) . ' · ' . $dove : $dove;

	$h  = '<main id="infn" class="infn inf-scope info-offerta" data-inft-track data-page-type="offerta_lavoro" data-audience="creator">';
	$h .= infn_hero( $crumbs, $live, $a['titolo'], '', $lead, $actions, infn_card( $a, ! empty( infn_settings()['annunci_anteprima'] ) ) );

	// dettagli
	$righe = array();
	if ( $a['compenso'] ) {
		$righe[] = array( 'Compenso', $a['compenso'] );
	}
	if ( $merce && 'product_gifting' === info_get( $post->ID, 'kind' ) ) {
		$righe[] = array( 'Prodotto', wp_trim_words( $merce, 18, '…' ) );
	}
	if ( $a['contenuto'] ) {
		$righe[] = array( 'Contenuti', $a['contenuto'] . ( $giorni ? ' entro ' . $giorni . ' giorni dall’accordo' : '' ) );
	}
	if ( $a['piattaforme'] ) {
		$righe[] = array( 'Piattaforme', implode( ', ', $a['piattaforme'] ) );
	}
	$righe[] = array( 'Dove', $dove );
	$righe[] = array( 'Candidature entro', $a['scadenza'] ? date_i18n( 'j F Y', strtotime( $a['scadenza'] ) ) : 'Fino a chiusura' );
	if ( $max ) {
		$righe[] = array( 'Creator cercati', (string) $max );
	}
	$righe[] = array( 'Azienda', $a['azienda'] ? $a['azienda'] : '🔒 Visibile nell’app' );

	$h .= '<section id="dettagli" class="infn-sec info-dettagli" data-section="dettagli_offerta"><div class="inf-wrap info-grid"><div>';
	$h .= '<p class="infn-tag">L’offerta</p><h2>Cosa chiede il brand</h2><p class="info-brief">' . $e( info_brief_breve( $post ) ) . '</p>';
	$h .= '<div class="info-lock"><b>Nell’app trovi il resto</b><span>Brief completo, nome dell’azienda, candidatura e chat con il brand. Per i creator l’iscrizione è gratuita.</span>';
	$h .= $chiusa ? '' : '<a class="inf-btn" href="' . esc_url( $app ) . '" data-track="begin_job_apply" data-cta="offerta_dettagli">Candidati nell’app</a>';
	$h .= '</div></div><dl class="info-dl">';
	foreach ( $righe as $r ) {
		$h .= '<div><dt>' . $e( $r[0] ) . '</dt><dd>' . $e( $r[1] ) . '</dd></div>';
	}
	$h .= '</dl></div></section>';

	// altre offerte aperte (stessa città prima)
	$altre = array();
	foreach ( infn_annunci() as $x ) {
		if ( ( isset( $x['id'] ) && (int) $x['id'] === $post->ID ) || count( $altre ) >= 3 ) {
			continue;
		}
		$altre[] = $x;
	}
	if ( $cslug ) {
		usort( $altre, function ( $x, $y ) use ( $cslug ) {
			return (int) ( info_citta_slug( $y['citta'] ) === $cslug ) - (int) ( info_citta_slug( $x['citta'] ) === $cslug );
		} );
	}
	if ( $altre ) {
		$h .= '<section class="infn-sec infn-board" data-section="altre_offerte"><div class="inf-wrap"><div class="infn-head"><p class="infn-tag">Altre offerte aperte</p><h2>Brand che cercano creator adesso</h2></div><div class="infn-jobs">';
		foreach ( $altre as $x ) {
			$h .= infn_card( $x, ! empty( infn_settings()['annunci_anteprima'] ) );
		}
		$h .= '</div></div></section>';
	}
	$h .= infn_form_avvisi( $cslug );
	$h .= infn_blocco_aziende( $cslug ? info_citta_pagine()[ $cslug ] : '', home_url( '/influencer-italiani/' ) );
	return $h . '</main>';
}

/* Stili della pagina offerta (piccoli, sopra quelli di Influencee Annunci) */
add_action(
	'inft_enqueue_page',
	function ( $page ) {
		if ( ! empty( $page['slug'] ) && 0 === strpos( $page['slug'], 'offerta-' ) ) {
			wp_enqueue_style( 'info', INFO_URL . 'assets/offerte.css', array( 'infn' ), INFO_VERSION );
		}
	},
	20
);
