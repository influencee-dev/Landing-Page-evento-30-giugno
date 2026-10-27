<?php
/**
 * Offerte di lavoro per content creator, per città, e avvisi delle nuove offerte (nurturing dei creator).
 *
 * - /offerte-lavoro-influencer/content-creator-<città>/  per le 6 città con ricerche «content creator <città>»
 *   (Ubersuggest 27/10/2026: Milano 90, Roma 70, Torino 50, Napoli/Bologna/Firenze 20 al mese). Su Google queste
 *   ricerche mostrano offerte di lavoro: la pagina è per i creator che cercano collaborazioni.
 * - Anteprima: sul sito titolo, città, compenso, contenuti e scadenza; azienda e dettagli solo nell'app.
 * - Modulo «Avvisami» (tandem): email, città e consenso esplicito alle email con le nuove offerte.
 * Le altre città si aggiungono con il filtro infn_citta quando hanno ricerche e offerte.
 */

defined( 'ABSPATH' ) || exit;

/** Città con pagina: slug => [nome, regione (slug), regione (nome), pagina «Influencer <città>»]. */
function infn_citta() {
	return (array) apply_filters(
		'infn_citta',
		array(
			'milano'  => array( 'Milano', 'lombardia', 'Lombardia', '/influencer-italiani/influencer-lombardia/influencer-milano/' ),
			'roma'    => array( 'Roma', 'lazio', 'Lazio', '/influencer-italiani/influencer-lazio/influencer-roma/' ),
			'torino'  => array( 'Torino', 'piemonte', 'Piemonte', '/influencer-italiani/influencer-piemonte/influencer-torino/' ),
			'napoli'  => array( 'Napoli', 'campania', 'Campania', '/influencer-italiani/influencer-campania/influencer-napoli/' ),
			'bologna' => array( 'Bologna', 'emilia-romagna', 'Emilia-Romagna', '/influencer-italiani/influencer-emilia-romagna/influencer-bologna/' ),
			'firenze' => array( 'Firenze', 'toscana', 'Toscana', '/influencer-italiani/influencer-toscana/influencer-firenze/' ),
		)
	);
}

function infn_citta_path( $slug ) {
	return INFN_BACHECA . 'content-creator-' . $slug . '/';
}

/** Annunci di una città (confronto sul nome, senza accenti e maiuscole) e annunci validi in tutta Italia. */
function infn_annunci_citta( $slug ) {
	$in = array();
	$it = array();
	foreach ( infn_annunci() as $a ) {
		$c = sanitize_title( $a['citta'] );
		if ( '' === $c || false !== strpos( $c, 'italia' ) || false !== strpos( $c, 'remoto' ) ) {
			$it[] = $a;
		} elseif ( false !== strpos( $c, $slug ) ) {
			$in[] = $a;
		}
	}
	return array( $in, $it );
}

/** Le vecchie pagine /creator-city/<città>/ portano qui (Core 2.2.15). */
add_filter(
	'inft_tassonomia_citta',
	function ( $to, $slug ) {
		$s = infn_settings();
		return ( ! $to && ! empty( $s['annunci'] ) && isset( infn_citta()[ $slug ] ) ) ? infn_citta_path( $slug ) : $to;
	},
	10,
	2
);

add_filter(
	'inft_tassonomia_esiste',
	function ( $ok, $path ) {
		if ( $ok || empty( infn_settings()['annunci'] ) ) {
			return $ok;
		}
		foreach ( array_keys( infn_citta() ) as $slug ) {
			if ( infn_citta_path( $slug ) === $path ) {
				return true;
			}
		}
		return false;
	},
	10,
	2
);

/** Pagine città servite dal plugin. */
add_filter(
	'inft_current_page',
	function ( $page ) {
		if ( $page || empty( infn_settings()['annunci'] ) ) {
			return $page;
		}
		$path = inft_request_path();
		foreach ( infn_citta() as $slug => $c ) {
			if ( infn_citta_path( $slug ) === $path ) {
				return infn_page_citta( $slug );
			}
		}
		return null;
	},
	21
);

/* Sitemap: le pagine città (non hanno una pagina WordPress) entrano nella sitemap «influencee» del Core */
add_filter(
	'inft_sitemap_percorsi',
	function ( $paths ) {
		if ( ! empty( infn_settings()['annunci'] ) ) {
			foreach ( array_keys( infn_citta() ) as $slug ) {
				$paths[] = infn_citta_path( $slug );
			}
		}
		return $paths;
	}
);

/* ─── Testi ─── */

function infn_faq_citta( $name ) {
	return array(
		array( 'Come trovo lavoro come content creator a ' . $name . '?', 'Iscriviti gratis su Influencee come creator e completa il profilo con social, categoria e città. Nella bacheca dell’app trovi gli annunci dei brand, anche di ' . $name . ', e ti candidi in un clic; puoi ricevere per email le nuove offerte della tua città.' ),
		array( 'Quanto guadagna un content creator a ' . $name . '?', 'Dipende dalla fascia di follower, dal tipo di contenuto e dai diritti d’uso. Ogni annuncio indica cosa offre il brand: un compenso in denaro, un prodotto in cambio merce o una percentuale sulle vendite. Per una stima del tuo compenso usa il calcolatore gratuito del costo di un influencer.' ),
		array( 'Serve avere tanti follower?', 'No. Molti brand locali cercano nano e micro creator, con un pubblico vicino e coinvolto, e diversi annunci chiedono contenuti UGC da usare sui canali del brand, dove conta la qualità del video più dei follower.' ),
		array( 'Sono un’azienda di ' . $name . ': come trovo un content creator?', 'Pubblica gratis un’offerta su Influencee: indichi contenuti, compenso e scadenza, i creator della zona si candidano e nell’app scegli i profili giusti. Puoi anche cercare e invitare direttamente i creator di ' . $name . '.' ),
	);
}

/** Risposta diretta in apertura (AEO), la stessa nel testo e nei dati strutturati. */
function infn_in_breve( $name ) {
	return 'Per lavorare come content creator a ' . $name . ' crea un profilo gratuito su Influencee con social, categoria e città: i brand della zona pubblicano annunci con compenso, contenuti richiesti e scadenza, e tu ti candidi dall’app. Molte offerte locali cercano nano e micro creator o video UGC: non servono grandi numeri di follower.';
}

/** Data dell'offerta più recente (ISO 8601), per dateModified e «Aggiornato il». */
function infn_ultima_offerta( $list ) {
	$max = 0;
	foreach ( $list as $a ) {
		$t = $a['pubblicato'] ? strtotime( $a['pubblicato'] ) : 0;
		$max = max( $max, (int) $t );
	}
	return $max ? gmdate( 'c', $max ) : '';
}

function infn_aggiornato( $list ) {
	$d = infn_ultima_offerta( $list );
	return $d ? '<span class="infn-upd">Ultima offerta: ' . esc_html( date_i18n( 'j F Y', strtotime( $d ) ) ) . '</span>' : '';
}

/* ─── Blocchi riusati dalla bacheca e dalle pagine città (design 27/10/2026, file Figma «Influencee · Offerte lavoro content creator») ─── */

/** Scheda di un annuncio. Anteprima: azienda e dettagli solo nell'app. */
function infn_card( $a, $anteprima ) {
	$e    = 'esc_html';
	$app  = 'app' === $a['fonte'];
	$link = $app ? add_query_arg( array( 'utm_source' => 'influencee.it', 'utm_medium' => 'referral', 'utm_campaign' => 'offerte_lavoro' ), $a['url'] ) : $a['url'];
	$lock = $app && $anteprima;
	$new  = $a['pubblicato'] && strtotime( $a['pubblicato'] ) > time() - 7 * DAY_IN_SECONDS;
	$h    = '<article class="infn-job"><div class="infn-job-top"><div class="infn-plat">';
	foreach ( array_slice( $a['piattaforme'], 0, 3 ) as $pl ) {
		$h .= '<span>' . $e( $pl ) . '</span>';
	}
	$h .= '</div>' . ( $new ? '<span class="infn-new">Nuova</span>' : '' ) . '</div>';
	$h .= '<h3><a href="' . esc_url( $link ) . '" data-track="job_teaser_click">' . $e( $a['titolo'] ) . '</a></h3>';
	if ( $lock ) {
		$h .= '<p class="infn-org"><i aria-hidden="true"></i><span><b aria-hidden="true"></b><br><em>🔒 Azienda visibile nell’app</em></span></p>';
	} else {
		$h .= ( $a['azienda'] ? '<p class="infn-org"><i aria-hidden="true"></i><span class="infn-org-name">' . $e( $a['azienda'] ) . '</span></p>' : '' ) . ( $a['brief'] ? '<p class="infn-brief">' . $e( wp_trim_words( $a['brief'], 26, '…' ) ) . '</p>' : '' );
	}
	$meta = array();
	if ( $a['compenso'] ) {
		$meta[] = '<div class="is-money"><dt>Compenso</dt><dd>' . $e( $a['compenso'] ) . '</dd></div>';
	}
	if ( $a['contenuto'] ) {
		$meta[] = '<div><dt>Contenuti</dt><dd>' . $e( $a['contenuto'] ) . '</dd></div>';
	}
	$meta[] = '<div><dt>Entro</dt><dd>' . ( $a['scadenza'] ? $e( date_i18n( 'j M', strtotime( $a['scadenza'] ) ) ) : 'Aperta' ) . '</dd></div>';
	$h .= '<dl class="infn-meta" style="grid-template-columns:repeat(' . count( $meta ) . ',1fr)">' . implode( '', $meta ) . '</dl>';
	$h .= '<div class="infn-job-foot"><small>' . $e( $a['citta'] ? $a['citta'] : 'Tutta Italia' ) . '</small><a class="inf-btn" href="' . esc_url( $link ) . '" data-track="begin_job_apply">' . ( $lock ? 'Accedi e candidati' : 'Vedi l’offerta' ) . '</a></div>';
	return $h . '</article>';
}

/** Intestazione nera delle pagine offerte. */
function infn_hero( $crumbs, $live, $h1, $mark, $lead, $actions, $preview ) {
	$h  = '<header class="infn-hero" data-section="testata"><div class="inf-wrap">';
	$h .= '<nav class="infn-crumbs" aria-label="Percorso"><ol>' . $crumbs . '</ol></nav>';
	$h .= '<div class="infn-hero-grid"><div>';
	$h .= '<p class="infn-live"><i aria-hidden="true"></i>' . esc_html( $live ) . '</p>';
	$h .= '<h1>' . esc_html( $h1 ) . ' <span>' . esc_html( $mark ) . '</span></h1>';
	$h .= '<p class="infn-lead">' . esc_html( $lead ) . '</p><div class="infn-actions">' . $actions . '</div>';
	$h .= '<ul class="infn-proof"><li><b>Gratis</b><span>per i creator</span></li><li><b>1 clic</b><span>per candidarti</span></li><li><b>1 email</b><span>a settimana, al massimo</span></li></ul>';
	$h .= '</div><div class="infn-stack" aria-hidden="true"><span class="infn-stack-back"></span><span class="infn-stack-back"></span>' . $preview . '</div></div>';
	return $h . '</div></header>';
}

/** Anteprima nell'intestazione: la prima offerta, oppure l'esempio di avviso email (nessuna offerta inventata). */
function infn_hero_preview( $a, $ant, $place ) {
	if ( $a ) {
		return '<div class="infn-ping"><i>✦</i>Offerta aperta ' . esc_html( $place ) . '</div>' . infn_card( $a, $ant );
	}
	return '<div class="infn-job"><div class="infn-job-top"><div class="infn-plat"><span>Avviso email</span></div></div><h3>Le nuove offerte ' . esc_html( $place ) . ', appena escono</h3><p class="infn-brief">Lascia la tua email: quando un brand pubblica un annuncio adatto a te ti scriviamo, al massimo una volta a settimana.</p><div class="infn-job-foot"><small>Gratis</small><a class="inf-btn" href="#avvisi">Avvisami</a></div></div>';
}

/** Modulo «Avvisami delle nuove offerte» (tandem + GA4 generate_lead lead_source=avvisi_offerte). */
function infn_form_avvisi( $citta = '' ) {
	$name = $citta ? infn_citta()[ $citta ][0] : '';
	$opts = '';
	foreach ( infn_citta() as $slug => $c ) {
		$opts .= '<option' . selected( $citta, $slug, false ) . '>' . esc_html( $c[0] ) . '</option>';
	}
	$opts .= '<option>Un’altra città</option><option>Tutta Italia, anche da remoto</option>';
	$id    = 'infn-avvisi' . ( $citta ? '-' . $citta : '' );
	$h     = '<section id="avvisi" class="infn-sec infn-alert" data-section="avvisi"><div class="inf-wrap"><div class="infn-alert-card"><div>';
	$h    .= '<p class="infn-tag">Avvisi gratuiti</p><h2>Le nuove offerte' . ( $name ? ' di ' . esc_html( $name ) : '' ) . ', <em>nella tua email</em></h2>';
	$h    .= '<p>Quando un brand pubblica un annuncio adatto a te ti scriviamo, al massimo una volta a settimana. Ti cancelli quando vuoi; per candidarti entri nell’app, gratis.</p>';
	$h    .= '<div class="infn-mail" aria-hidden="true"><div class="infn-mail-row"><i>i</i><div><b>Nuova offerta' . ( $name ? ' a ' . esc_html( $name ) : ' per te' ) . '</b><span>Titolo, compenso e scadenza, con il link per candidarti</span></div></div></div></div>';
	$h    .= '<form id="' . esc_attr( $id ) . '" class="inf-form" name="Avvisi offerte di lavoro" data-tandem data-inft-lead data-form="avvisi_offerte" novalidate>';
	$h    .= '<p class="inf-f"><label for="' . $id . '-email">Email *</label><input id="' . $id . '-email" name="email" type="email" required autocomplete="email" maxlength="200" placeholder="nome@email.it"></p>';
	$h    .= '<div class="infn-row"><p class="inf-f"><label for="' . $id . '-citta">Città</label><select id="' . $id . '-citta" name="citta">' . $opts . '</select></p>';
	$h    .= '<p class="inf-f"><label for="' . $id . '-tipo">Sei</label><select id="' . $id . '-tipo" name="tipo_creator"><option>Content creator</option><option>UGC creator</option><option>Influencer</option><option>Fotografo o videomaker</option></select></p></div>';
	$h    .= '<label class="inf-check"><input type="checkbox" name="consenso_email" value="si" required> <span>Voglio ricevere per email le nuove offerte di lavoro di Influencee. Posso cancellarmi quando voglio. <a href="' . esc_url( home_url( '/privacy-policy/' ) ) . '">Privacy</a></span></label>';
	$h    .= '<button class="inf-btn" type="submit">Avvisami</button>';
	$h    .= '<p class="inf-ok" hidden>Fatto: ti scriviamo quando esce una nuova offerta. Intanto <a href="' . esc_url( inft_app_link( '/iscriviti/creator/', 'avvisi_offerte' ) ) . '">crea il tuo profilo creator</a> per candidarti subito.</p>';
	return $h . '</form></div></div></section>';
}

/** Blocco per le aziende. */
function infn_blocco_aziende( $name, $creator_url ) {
	$pub = home_url( INFN_PUBBLICA );
	$h   = '<section class="infn-sec infn-biz" data-section="brand"><div class="inf-wrap infn-biz-in"><div>';
	$h  .= '<p class="infn-tag">Per le aziende' . ( $name ? ' di ' . esc_html( $name ) : '' ) . '</p><h2>Cerchi un content creator? Pubblica l’offerta gratis</h2>';
	$h  .= '<p>Descrivi contenuti, compenso e scadenza: i creator si candidano e nell’app scegli i profili giusti.</p>';
	$h  .= '<ul><li>Annuncio online in pochi minuti</li><li>Candidature di creator italiani</li><li>Cerchi e inviti direttamente i creator' . ( $name ? ' di ' . esc_html( $name ) : '' ) . '</li></ul></div>';
	$h  .= '<div class="infn-biz-card"><p>Pubblicare un annuncio costa</p><b>0 €</b><a class="inf-btn" href="' . esc_url( $pub ) . '" data-track="post_job_click">Pubblica un’offerta gratis</a>';
	$h  .= '<a class="inf-btn inf-btn-line" style="margin-top:10px;width:100%" href="' . esc_url( $creator_url ) . '">' . ( $name ? 'Vedi i creator di ' . esc_html( $name ) : 'Vedi gli influencer italiani' ) . '</a></div>';
	return $h . '</div></section>';
}

function infn_blocco_faq( $title, $faq ) {
	$h = '<section class="infn-sec infn-faq" data-section="faq"><div class="inf-wrap infn-faq-in"><div><p class="infn-tag">Domande frequenti</p><h2>' . esc_html( $title ) . '</h2></div><div>';
	foreach ( $faq as $i => $q ) {
		$h .= '<details' . ( 0 === $i ? ' open' : '' ) . '><summary>' . esc_html( $q[0] ) . '</summary><p>' . esc_html( $q[1] ) . '</p></details>';
	}
	return $h . '</div></div></section>';
}

function infn_blocco_citta( $current, $title ) {
	$h = '<section class="infn-sec infn-cities" data-section="altre_citta"><div class="inf-wrap"><div class="infn-head"><p class="infn-tag">' . ( $current ? 'Altre città' : 'Per città' ) . '</p><h2>' . esc_html( $title ) . '</h2></div><ul class="infn-city-grid">';
	foreach ( infn_citta() as $k => $o ) {
		if ( $k !== $current ) {
			$h .= '<li><a href="' . esc_url( home_url( infn_citta_path( $k ) ) ) . '">' . esc_html( $o[0] ) . '</a></li>';
		}
	}
	if ( $current ) {
		$h .= '<li><a href="' . esc_url( home_url( INFN_BACHECA ) ) . '">Tutta Italia</a></li>';
	}
	return $h . '</ul></div></section>';
}

/* ─── Pagina città ─── */

function infn_page_citta( $slug ) {
	$c    = infn_citta()[ $slug ];
	$path = infn_citta_path( $slug );
	$url  = home_url( $path );
	list( $in, $it ) = infn_annunci_citta( $slug );
	$items = array();
	foreach ( array_merge( $in, $it ) as $i => $a ) {
		$items[] = array( '@type' => 'ListItem', 'position' => $i + 1, 'url' => $a['url'], 'name' => $a['titolo'] );
	}
	$graph = array(
		inft_org_ld(),
		array_filter( array( '@type' => 'CollectionPage', '@id' => $url . '#pagina', 'url' => $url, 'name' => 'Lavoro content creator a ' . $c[0], 'description' => infn_in_breve( $c[0] ), 'inLanguage' => 'it-IT', 'isPartOf' => array( '@id' => home_url( '/#org' ) ), 'about' => array( '@type' => 'City', 'name' => $c[0] ), 'dateModified' => infn_ultima_offerta( array_merge( $in, $it ) ) ) ),
		array( '@type' => 'BreadcrumbList', 'itemListElement' => array(
			array( '@type' => 'ListItem', 'position' => 1, 'name' => 'Home', 'item' => home_url( '/' ) ),
			array( '@type' => 'ListItem', 'position' => 2, 'name' => 'Offerte di lavoro', 'item' => home_url( INFN_BACHECA ) ),
			array( '@type' => 'ListItem', 'position' => 3, 'name' => 'Content creator ' . $c[0], 'item' => $url ),
		) ),
		array( '@type' => 'FAQPage', 'mainEntity' => array_map( function ( $q ) {
			return array( '@type' => 'Question', 'name' => $q[0], 'acceptedAnswer' => array( '@type' => 'Answer', 'text' => $q[1] ) );
		}, infn_faq_citta( $c[0] ) ) ),
	);
	if ( $items ) {
		$graph[] = array( '@type' => 'ItemList', 'name' => 'Offerte per content creator a ' . $c[0], 'numberOfItems' => count( $items ), 'itemListElement' => $items );
	}
	return array(
		'plugin'      => 'annunci',
		'group'       => 'annunci',
		'slug'        => 'offerte-' . $slug,
		'path'        => $path,
		'label'       => 'Content creator ' . $c[0],
		'title'       => 'Lavoro content creator ' . $c[0] . ': offerte dei brand',
		'description' => 'Offerte di lavoro per content creator a ' . $c[0] . ': brand che cercano video, reel e UGC, con compenso e scadenza. Candidati gratis su Influencee.',
		'ld'          => array( '@context' => 'https://schema.org', '@graph' => $graph ),
		'render'      => function () use ( $slug ) {
			return infn_render_citta( $slug );
		},
	);
}

function infn_render_citta( $slug ) {
	$e    = 'esc_html';
	$c    = infn_citta()[ $slug ];
	$name = $c[0];
	$s    = infn_settings();
	$ant  = ! empty( $s['annunci_anteprima'] );
	list( $in, $it ) = infn_annunci_citta( $slug );
	$crea = inft_app_link( '/iscriviti/creator/', 'offerte_' . $slug );
	$n    = count( $in );
	$live = $n ? $n . ( 1 === $n ? ' offerta aperta a ' : ' offerte aperte a ' ) . $name : ( $it ? count( $it ) . ' offerte valide anche da ' . $name : 'Avvisi gratuiti per ' . $name );
	$crumbs  = '<li><a href="' . esc_url( home_url( '/' ) ) . '">Home</a></li><li><a href="' . esc_url( home_url( INFN_BACHECA ) ) . '">Offerte di lavoro</a></li><li aria-current="page">Content creator ' . $e( $name ) . '</li>';
	$actions = '<a class="inf-btn inf-btn-acid" href="' . esc_url( $crea ) . '">Iscriviti gratis come creator</a><a class="inf-btn infn-btn-ghost" href="#avvisi">Avvisami delle offerte</a>';
	$first   = $in ? $in[0] : ( $it ? $it[0] : null );
	$h  = '<main id="infn" class="infn inf-scope" data-inft-track data-page-type="offerte_lavoro_citta" data-audience="creator">';
	$h .= infn_hero( $crumbs, $live, 'Lavoro content creator', 'a ' . $name, 'Ristoranti, negozi e brand di ' . $name . ' cercano creator per reel, video UGC e foto. Guarda le offerte, poi candidati gratis dall’app di Influencee.', $actions, infn_hero_preview( $first, $ant, 'a ' . $name ) );
	// in breve (AEO): risposta diretta subito dopo l'intestazione
	$h .= '<section class="infn-sec infn-inbreve" data-section="in_breve"><div class="inf-wrap infn-inbreve-in"><div><p class="infn-tag">In breve</p><h2>Come si trova lavoro come content creator a ' . $e( $name ) . '?</h2></div><div>';
	$h .= '<p class="infn-inbreve-text">' . $e( infn_in_breve( $name ) ) . '</p>';
	$h .= '<ul class="infn-facts"><li><b>Compenso chiaro</b><span>Denaro, cambio merce o percentuale sulle vendite, scritto nell’annuncio.</span></li><li><b>Contenuti definiti</b><span>Reel, storie, video UGC o foto, con quantità e tempi.</span></li><li><b>Brand locali</b><span>Ristoranti, negozi, palestre ed eventi di ' . $e( $name ) . '.</span></li></ul></div></div></section>';
	// offerte
	$h .= '<section class="infn-sec infn-board" data-section="offerte" data-inft-read><div class="inf-wrap">';
	$h .= '<div class="infn-board-head"><div class="infn-head"><p class="infn-tag">Offerte aperte</p><h2>Quali brand cercano content creator a ' . $e( $name ) . '?</h2>' . infn_aggiornato( array_merge( $in, $it ) ) . '</div>';
	if ( $in || $it ) {
		$h .= '<span class="infn-count"><b>' . $n . '</b> a ' . $e( $name ) . ' · <b>' . count( $it ) . '</b> in tutta Italia</span>';
	}
	$h .= '</div>';
	if ( $in ) {
		$h .= '<div class="infn-jobs">';
		foreach ( $in as $a ) {
			$h .= infn_card( $a, $ant );
		}
		$h .= '</div>';
	}
	if ( $it ) {
		$h .= '<p class="infn-sub">Valide anche da ' . $e( $name ) . '<small>Annunci per creator di tutta Italia o da remoto</small></p><div class="infn-jobs">';
		foreach ( array_slice( $it, 0, 6 ) as $a ) {
			$h .= infn_card( $a, $ant );
		}
		$h .= '</div>';
	}
	if ( ! $in && ! $it ) {
		$h .= '<div class="infn-empty"><div><h3>In questo momento non ci sono offerte aperte a ' . $e( $name ) . '</h3><p>I brand pubblicano annunci durante tutto l’anno. Lascia la tua email: ti avvisiamo appena ne esce uno per ' . $e( $name ) . '. Intanto crea il profilo, così i brand ti trovano anche nella ricerca.</p><div class="infn-actions"><a class="inf-btn" href="#avvisi">Avvisami</a><a class="inf-btn inf-btn-line" href="' . esc_url( $crea ) . '">Crea il profilo gratis</a></div></div><div class="infn-ghosts" aria-hidden="true"><i></i><i></i><i></i></div></div>';
	} elseif ( $ant ) {
		$h .= '<p class="infn-note">🔒 Nome dell’azienda, brief completo e candidatura sono nell’app: per i creator l’iscrizione è gratuita.</p>';
	}
	$h .= '</div></section>';
	// come funziona
	$h .= '<section class="infn-sec" data-section="come_funziona"><div class="inf-wrap"><div class="infn-head"><p class="infn-tag">Come funziona</p><h2>Come funziona la candidatura?</h2></div><ol class="infn-steps">';
	$h .= '<li><b>Crei il profilo</b><span>Colleghi i social e scegli categoria e città: i brand di ' . $e( $name ) . ' ti trovano anche nella ricerca.</span></li>';
	$h .= '<li><b>Ti candidi</b><span>Vedi compenso, contenuti e scadenza, e rispondi all’annuncio in un clic.</span></li>';
	$h .= '<li><b>Lavori con il brand</b><span>Concordate i dettagli nella collaborazione e consegni nei tempi dell’annuncio.</span></li></ol>';
	$h .= '<div class="infn-steps-cta"><a class="inf-btn" href="' . esc_url( $crea ) . '">Crea il profilo gratis</a><a class="inf-btn inf-btn-line" href="' . esc_url( home_url( '/social-media-tool/costo-influencer/' ) ) . '">Calcola quanto puoi chiedere</a></div></div></section>';
	$h .= infn_form_avvisi( $slug );
	$h .= infn_blocco_aziende( $name, home_url( $c[3] ) );
	$h .= infn_blocco_faq( 'Lavorare come content creator a ' . $name . ': le domande', infn_faq_citta( $name ) );
	$h .= infn_blocco_citta( $slug, 'Offerte per content creator in Italia' );
	return $h . '</main>';
}
