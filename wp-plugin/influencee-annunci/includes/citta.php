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

/* ─── Blocchi riusati dalla bacheca e dalle pagine città ─── */

/** Scheda di un annuncio. Anteprima: azienda e dettagli solo nell'app. */
function infn_card( $a, $anteprima ) {
	$e     = 'esc_html';
	$pills = array();
	if ( $a['compenso'] ) {
		$pills[] = '<span class="infn-pill infn-pill-pk">' . $e( $a['compenso'] ) . '</span>';
	}
	$what = trim( implode( ', ', $a['piattaforme'] ) . ( $a['contenuto'] ? ' · ' . $a['contenuto'] : '' ), ' ·' );
	if ( $what ) {
		$pills[] = '<span class="infn-pill">' . $e( $what ) . '</span>';
	}
	$pills[] = '<span class="infn-pill">' . $e( $a['citta'] ? $a['citta'] : 'Tutta Italia' ) . '</span>';
	if ( $a['scadenza'] ) {
		$pills[] = '<span class="infn-pill infn-pill-ac">Entro ' . $e( date_i18n( 'j M', strtotime( $a['scadenza'] ) ) ) . '</span>';
	}
	$app  = 'app' === $a['fonte'];
	$link = $app ? add_query_arg( array( 'utm_source' => 'influencee.it', 'utm_medium' => 'referral', 'utm_campaign' => 'offerte_lavoro' ), $a['url'] ) : $a['url'];
	$lock = $app && $anteprima;
	$h    = '<article class="infn-job' . ( $lock ? ' infn-job-lock' : '' ) . '"><h2><a href="' . esc_url( $link ) . '" data-track="job_teaser_click">' . $e( $a['titolo'] ) . '</a></h2>';
	if ( $lock ) {
		$h .= '<p class="infn-org infn-org-lock"><span aria-hidden="true">🔒</span> Azienda e dettagli visibili nell’app</p>';
	} else {
		$h .= ( $a['azienda'] ? '<p class="infn-org">' . $e( $a['azienda'] ) . '</p>' : '' ) . ( $a['brief'] ? '<p class="infn-brief">' . $e( wp_trim_words( $a['brief'], 30, '…' ) ) . '</p>' : '' );
	}
	$h .= '<p class="infn-pills">' . implode( '', $pills ) . '</p>';
	if ( $lock ) {
		$h .= '<p class="infn-job-cta"><a class="inf-btn" href="' . esc_url( $link ) . '" data-track="begin_job_apply">Accedi e candidati</a></p>';
	}
	return $h . '</article>';
}

/** Modulo «Avvisami delle nuove offerte» (tandem + GA4 generate_lead lead_source=avvisi_offerte). */
function infn_form_avvisi( $citta = '' ) {
	$opts = '';
	foreach ( infn_citta() as $slug => $c ) {
		$opts .= '<option' . selected( $citta, $slug, false ) . '>' . esc_html( $c[0] ) . '</option>';
	}
	$opts .= '<option>Un’altra città</option><option>Tutta Italia, anche da remoto</option>';
	$id    = 'infn-avvisi' . ( $citta ? '-' . $citta : '' );
	$h     = '<section class="infn-alert" data-section="avvisi"><div class="inf-wrap infn-alert-in"><div>';
	$h    .= '<p class="inf-eyebrow">Avvisi gratuiti</p><h2>Ricevi le nuove offerte <em>' . ( $citta ? 'di ' . esc_html( infn_citta()[ $citta ][0] ) : 'della tua città' ) . '</em></h2>';
	$h    .= '<p>Quando un brand pubblica un annuncio adatto a te ti scriviamo, al massimo una volta a settimana. Per candidarti entri nell’app, gratis.</p></div>';
	$h    .= '<form id="' . esc_attr( $id ) . '" class="inf-form" name="Avvisi offerte di lavoro" data-tandem data-inft-lead data-form="avvisi_offerte" novalidate>';
	$h    .= '<p class="inf-f"><label for="' . $id . '-email">Email *</label><input id="' . $id . '-email" name="email" type="email" required autocomplete="email" maxlength="200"></p>';
	$h    .= '<div class="infn-row"><p class="inf-f"><label for="' . $id . '-citta">Città</label><select id="' . $id . '-citta" name="citta">' . $opts . '</select></p>';
	$h    .= '<p class="inf-f"><label for="' . $id . '-tipo">Sei</label><select id="' . $id . '-tipo" name="tipo_creator"><option>Content creator</option><option>UGC creator</option><option>Influencer</option><option>Fotografo o videomaker</option></select></p></div>';
	$h    .= '<label class="inf-check"><input type="checkbox" name="consenso_email" value="si" required> <span>Voglio ricevere per email le nuove offerte di lavoro di Influencee. Posso cancellarmi quando voglio. <a href="' . esc_url( home_url( '/privacy-policy/' ) ) . '">Privacy</a></span></label>';
	$h    .= '<button class="inf-btn" type="submit">Avvisami</button>';
	$h    .= '<p class="inf-ok" hidden>Fatto: ti scriviamo quando esce una nuova offerta. Intanto <a href="' . esc_url( inft_app_link( '/iscriviti/creator/', 'avvisi_offerte' ) ) . '">crea il tuo profilo creator</a> per candidarti subito.</p>';
	return $h . '</form></div></section>';
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
		array( '@type' => 'CollectionPage', '@id' => $url . '#pagina', 'url' => $url, 'name' => 'Lavoro content creator a ' . $c[0], 'inLanguage' => 'it-IT', 'isPartOf' => array( '@id' => home_url( '/#org' ) ), 'about' => array( '@type' => 'City', 'name' => $c[0] ) ),
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
	$ant  = ! isset( $s['annunci_anteprima'] ) || ! empty( $s['annunci_anteprima'] );
	list( $in, $it ) = infn_annunci_citta( $slug );
	$crea = inft_app_link( '/iscriviti/creator/', 'offerte_' . $slug );
	$pub  = home_url( INFN_PUBBLICA );
	$h    = '<main id="infn" class="infn inf-scope" data-inft-track data-page-type="offerte_lavoro_citta" data-audience="creator">';
	$h   .= '<header class="infn-hero" data-section="testata"><div class="inf-wrap">';
	$h   .= '<nav class="infn-crumbs" aria-label="Percorso"><ol><li><a href="' . esc_url( home_url( '/' ) ) . '">Home</a></li><li><a href="' . esc_url( home_url( INFN_BACHECA ) ) . '">Offerte di lavoro</a></li><li aria-current="page">Content creator ' . $e( $name ) . '</li></ol></nav>';
	$h   .= '<p class="infn-kicker">' . $e( $c[2] ) . '</p><h1>Lavoro content creator <span class="infn-mark">a ' . $e( $name ) . '</span></h1>';
	$h   .= '<p class="infn-lead">Brand e attività di ' . $e( $name ) . ' che cercano creator per video, reel, foto e contenuti UGC. Vedi le offerte aperte e candidati gratis dall’app di Influencee.</p>';
	$h   .= '<p class="infn-actions"><a class="inf-btn inf-btn-acid" href="' . esc_url( $crea ) . '">Iscriviti gratis come creator</a> <a class="inf-btn infn-btn-ghost" href="#infn-avvisi-' . esc_attr( $slug ) . '">Avvisami delle offerte</a></p>';
	$h   .= '</div></header>';
	// risposta breve (AEO)
	$h .= '<section class="infn-answer" data-section="in_breve"><div class="inf-wrap"><p class="inf-eyebrow">In breve</p><p>Per lavorare come content creator a ' . $e( $name ) . ' crea un profilo gratuito su Influencee con social, categoria e città: i brand della zona pubblicano annunci con compenso, contenuti richiesti e scadenza, e tu ti candidi dall’app. Molte offerte locali cercano nano e micro creator o contenuti UGC, quindi non servono grandi numeri di follower.</p></div></section>';
	// offerte
	$h .= '<section class="infn-board" data-section="offerte" data-inft-read><div class="inf-wrap">';
	if ( $in ) {
		$h .= '<h2 class="infn-h2">Offerte aperte a ' . $e( $name ) . '</h2><p class="infn-count"><b>' . count( $in ) . '</b> ' . ( 1 === count( $in ) ? 'annuncio' : 'annunci' ) . '</p><div class="infn-jobs">';
		foreach ( $in as $a ) {
			$h .= infn_card( $a, $ant );
		}
		$h .= '</div>';
	}
	if ( $it ) {
		$h .= '<h2 class="infn-h2">' . ( $in ? 'Valide anche da ' . $e( $name ) : 'Offerte valide anche da ' . $e( $name ) ) . '</h2><p class="infn-count">Annunci per creator di tutta Italia o da remoto</p><div class="infn-jobs">';
		foreach ( array_slice( $it, 0, 6 ) as $a ) {
			$h .= infn_card( $a, $ant );
		}
		$h .= '</div>';
	}
	if ( ! $in && ! $it ) {
		$h .= '<div class="infn-empty"><h2>In questo momento non ci sono offerte aperte a ' . $e( $name ) . '</h2><p>I brand pubblicano annunci nuovi ogni settimana. Lascia la tua email qui sotto: ti avvisiamo appena ne esce uno per ' . $e( $name ) . '.</p><p class="infn-actions"><a class="inf-btn" href="#infn-avvisi-' . esc_attr( $slug ) . '">Avvisami</a> <a class="inf-btn inf-btn-line" href="' . esc_url( $crea ) . '">Iscriviti come creator</a></p></div>';
	}
	if ( $in || $it ) {
		$h .= '<p class="infn-note">Il nome dell’azienda, il brief completo e la candidatura sono nell’app: l’iscrizione per i creator è gratuita.</p>';
	}
	$h .= '</div></section>';
	// come funziona
	$h .= '<section class="infn-steps3" data-section="come_funziona"><div class="inf-wrap"><p class="inf-eyebrow">Come funziona</p><h2>Dalla candidatura <em>alla collaborazione</em></h2><ol>';
	$h .= '<li><b>Crei il profilo</b><span>Colleghi i social, scegli categoria e città: i brand di ' . $e( $name ) . ' ti trovano anche nella ricerca.</span></li>';
	$h .= '<li><b>Ti candidi agli annunci</b><span>Vedi compenso, contenuti richiesti e scadenza, e rispondi in un clic.</span></li>';
	$h .= '<li><b>Lavori con il brand</b><span>Concordate i contenuti nella collaborazione e consegni nei tempi dell’annuncio.</span></li>';
	$h .= '</ol><p class="infn-actions"><a class="inf-btn" href="' . esc_url( $crea ) . '">Crea il profilo gratis</a> <a class="inf-btn inf-btn-line" href="' . esc_url( home_url( '/social-media-tool/costo-influencer/' ) ) . '">Calcola quanto puoi chiedere</a></p></div></section>';
	// avvisi
	$h .= infn_form_avvisi( $slug );
	// aziende
	$h .= '<section class="infn-brand" data-section="brand"><div class="inf-wrap infn-brand-in"><div><p class="inf-eyebrow">Per le aziende di ' . $e( $name ) . '</p><h2>Cerchi un content creator? <em>Pubblica l’offerta gratis</em></h2><p>Descrivi contenuti, compenso e scadenza: i creator della zona si candidano e nell’app scegli i profili giusti. Puoi anche vedere i <a href="' . esc_url( home_url( $c[3] ) ) . '">creator di ' . $e( $name ) . '</a>.</p></div><p><a class="inf-btn" href="' . esc_url( $pub ) . '" data-track="post_job_click">Pubblica un’offerta gratis</a></p></div></section>';
	// FAQ
	$h .= '<section class="infn-faq" data-section="faq"><div class="inf-wrap"><h2>Domande frequenti</h2>';
	foreach ( infn_faq_citta( $name ) as $q ) {
		$h .= '<details><summary>' . $e( $q[0] ) . '</summary><p>' . $e( $q[1] ) . '</p></details>';
	}
	$h .= '</div></section>';
	// altre città
	$h .= '<section class="infn-cities" data-section="altre_citta"><div class="inf-wrap"><h2>Offerte per content creator <em>in altre città</em></h2><ul>';
	foreach ( infn_citta() as $k => $o ) {
		if ( $k !== $slug ) {
			$h .= '<li><a href="' . esc_url( home_url( infn_citta_path( $k ) ) ) . '">Content creator ' . $e( $o[0] ) . '</a></li>';
		}
	}
	$h .= '<li><a href="' . esc_url( home_url( INFN_BACHECA ) ) . '">Tutte le offerte</a></li></ul></div></section>';
	return $h . '</main>';
}
