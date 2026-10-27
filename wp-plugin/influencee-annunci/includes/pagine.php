<?php
/**
 * Le due pagine del plugin, in HTML5 generato da PHP (testo completo per Google e motori AI):
 * - /offerte-lavoro-influencer/  bacheca degli annunci aperti;
 * - /pubblica-offerta-lavoro/    percorso in 5 passi con gli stessi campi dell'app, account alla fine.
 * Il motore di Influencee Core serve la pagina (header e footer del sito, SEO, CSS base, tracciamento).
 */

defined( 'ABSPATH' ) || exit;

define( 'INFN_BACHECA', '/offerte-lavoro-influencer/' );
define( 'INFN_PUBBLICA', '/pubblica-offerta-lavoro/' );

/* ─── Presa in carico tramite Core ─── */

add_filter(
	'inft_current_page',
	function ( $page ) {
		if ( $page ) {
			return $page;
		}
		$s = infn_settings();
		if ( empty( $s['annunci'] ) ) {
			return null;
		}
		$path = inft_request_path();
		if ( INFN_BACHECA === $path ) {
			return infn_page_bacheca();
		}
		if ( INFN_PUBBLICA === $path ) {
			return infn_page_pubblica();
		}
		return null;
	},
	20
);

add_action(
	'inft_enqueue_page',
	function ( $page ) {
		if ( empty( $page['plugin'] ) || 'annunci' !== $page['plugin'] ) {
			return;
		}
		wp_enqueue_style( 'infn', INFN_URL . 'assets/annunci.css', array( 'inft-base' ), INFN_VERSION );
		if ( INFN_PUBBLICA === $page['path'] ) {
			wp_enqueue_script( 'infn', INFN_URL . 'assets/annunci.js', array( 'inft-track' ), INFN_VERSION, array( 'in_footer' => true, 'strategy' => 'defer' ) );
			wp_add_inline_script( 'infn', 'window.INFN=' . wp_json_encode( array( 'endpoint' => rest_url( 'influencee-annunci/v1/bozza' ) ) ) . ';', 'before' );
		}
	}
);

/* Offerte WP Job Manager scadute o chiuse → bacheca (se attivato) */
add_action(
	'template_redirect',
	function () {
		$s = infn_settings();
		if ( empty( $s['annunci'] ) || empty( $s['annunci_vecchie'] ) || ! is_singular( 'job_listing' ) ) {
			return;
		}
		$p   = get_queried_object();
		$exp = (string) get_post_meta( $p->ID, '_job_expires', true );
		$old = get_post_meta( $p->ID, '_filled', true ) || ( $exp && strtotime( $exp ) < time() ) || strtotime( $p->post_date ) < strtotime( '-180 days' );
		if ( $old ) {
			wp_safe_redirect( home_url( INFN_BACHECA ), 301, 'Influencee Annunci' );
			exit;
		}
	},
	2
);

/* ─── Pagina: bacheca ─── */

function infn_faq_bacheca() {
	return array(
		array( 'Come mi candido a un’offerta?', 'Apri l’annuncio e candidati dall’app di Influencee: l’iscrizione per i creator è gratuita. Il brand riceve la tua candidatura con le condizioni dell’annuncio e ti risponde nella collaborazione.' ),
		array( 'Che tipo di compenso offrono i brand?', 'Ogni annuncio indica cosa offre il brand: un compenso in denaro per creator, un prodotto in cambio merce oppure una percentuale sulle vendite. Nell’annuncio trovi anche i contenuti richiesti e i tempi di consegna.' ),
		array( 'Sono un brand: quanto costa pubblicare un’offerta?', 'Pubblicare un annuncio su Influencee è gratis. Compili offerta e dati dell’azienda, crei l’account alla fine e l’annuncio va online; nell’app puoi anche cercare e invitare direttamente i creator adatti.' ),
	);
}

function infn_page_bacheca() {
	$url   = home_url( INFN_BACHECA );
	$items = array();
	foreach ( infn_annunci() as $i => $a ) {
		$items[] = array( '@type' => 'ListItem', 'position' => $i + 1, 'url' => $a['url'], 'name' => $a['titolo'] );
	}
	$graph = array(
		inft_org_ld(),
		array( '@type' => 'CollectionPage', '@id' => $url . '#pagina', 'url' => $url, 'name' => 'Offerte di lavoro per influencer', 'inLanguage' => 'it-IT', 'isPartOf' => array( '@id' => home_url( '/#org' ) ) ),
		array( '@type' => 'BreadcrumbList', 'itemListElement' => array( array( '@type' => 'ListItem', 'position' => 1, 'name' => 'Home', 'item' => home_url( '/' ) ), array( '@type' => 'ListItem', 'position' => 2, 'name' => 'Offerte di lavoro per influencer', 'item' => $url ) ) ),
		array( '@type' => 'FAQPage', 'mainEntity' => array_map( function ( $q ) {
			return array( '@type' => 'Question', 'name' => $q[0], 'acceptedAnswer' => array( '@type' => 'Answer', 'text' => $q[1] ) );
		}, infn_faq_bacheca() ) ),
	);
	if ( $items ) {
		$graph[] = array( '@type' => 'ItemList', 'name' => 'Annunci aperti', 'numberOfItems' => count( $items ), 'itemListElement' => $items );
	}
	return array(
		'plugin'      => 'annunci',
		'group'       => 'annunci',
		'slug'        => 'offerte-lavoro',
		'path'        => INFN_BACHECA,
		'label'       => 'Offerte di lavoro per influencer',
		'title'       => 'Offerte di lavoro per influencer: annunci dei brand',
		'description' => 'Annunci di brand italiani che cercano creator: compenso, contenuti richiesti e scadenza. Candidati gratis dall’app di Influencee o pubblica la tua offerta.',
		'ld'          => array( '@context' => 'https://schema.org', '@graph' => $graph ),
		'render'      => 'infn_render_bacheca',
	);
}

function infn_render_bacheca() {
	$e     = 'esc_html';
	$list  = infn_annunci();
	$pub   = home_url( INFN_PUBBLICA );
	$app   = inft_app_link( '/annunci/', 'offerte_lavoro' );
	$crea  = inft_app_link( '/iscriviti/creator/', 'offerte_lavoro' );
	$h     = '<main id="infn" class="infn inf-scope" data-inft-track data-page-type="offerte_lavoro" data-audience="creator">';
	$h    .= '<header class="infn-hero" data-section="testata"><div class="inf-wrap">';
	$h    .= '<nav class="infn-crumbs" aria-label="Percorso"><ol><li><a href="' . esc_url( home_url( '/' ) ) . '">Home</a></li><li aria-current="page">Offerte di lavoro</li></ol></nav>';
	$h    .= '<p class="infn-kicker">Offerte di lavoro</p><h1>Offerte di lavoro <span class="infn-mark">per influencer</span></h1>';
	$h    .= '<p class="infn-lead">Brand italiani che cercano influencer e content creator adesso: cosa offrono, che contenuti chiedono e entro quando candidarsi. Ti candidi gratis dall’app di Influencee e ricevi per email le nuove offerte.</p>';
	$h    .= '<p class="infn-actions"><a class="inf-btn inf-btn-acid" href="' . esc_url( $pub ) . '" data-track="post_job_click">Pubblica un’offerta gratis</a> <a class="inf-btn infn-btn-ghost" href="' . esc_url( $crea ) . '">Sono un creator</a></p>';
	$h    .= '</div></header>';
	$h    .= '<section class="infn-board" data-section="bacheca" data-inft-read><div class="inf-wrap">';
	if ( $list ) {
		$h .= '<p class="infn-count"><b>' . count( $list ) . '</b> ' . ( 1 === count( $list ) ? 'annuncio aperto' : 'annunci aperti' ) . '</p><div class="infn-jobs">';
		$s   = infn_settings();
		$ant = ! empty( $s['annunci_anteprima'] );
		foreach ( $list as $a ) {
			$h .= infn_card( $a, $ant );
		}
		$h .= '</div>';
	} else {
		$h .= '<div class="infn-empty"><h2>Nessun annuncio aperto in questo momento</h2><p>I brand pubblicano annunci nuovi ogni settimana. Iscriviti gratis come creator: quando esce un’offerta adatta a te la trovi nell’app.</p><p class="infn-actions"><a class="inf-btn" href="' . esc_url( $crea ) . '">Iscriviti come creator</a> <a class="inf-btn inf-btn-line" href="' . esc_url( $app ) . '">Vedi la bacheca nell’app</a></p></div>';
	}
	$h .= '</div></section>';
	// città
	$h .= '<section class="infn-cities" data-section="citta"><div class="inf-wrap"><h2>Offerte per content creator <em>per città</em></h2><ul>';
	foreach ( infn_citta() as $k => $o ) {
		$h .= '<li><a href="' . esc_url( home_url( infn_citta_path( $k ) ) ) . '">Content creator ' . esc_html( $o[0] ) . '</a></li>';
	}
	$h .= '</ul></div></section>';
	$h .= infn_form_avvisi();
	// brand
	$h .= '<section class="infn-brand" data-section="brand"><div class="inf-wrap infn-brand-in"><div><p class="inf-eyebrow">Per i brand</p><h2>Cerchi creator? <em>Pubblica la tua offerta</em></h2><p>Descrivi cosa ti serve e cosa offri: in pochi minuti l’annuncio è online e i creator si candidano. Nell’app scegli tu i profili giusti.</p></div><p><a class="inf-btn" href="' . esc_url( $pub ) . '" data-track="post_job_click">Pubblica un’offerta gratis</a></p></div></section>';
	// FAQ
	$h .= '<section class="infn-faq" data-section="faq"><div class="inf-wrap"><h2>Domande frequenti</h2>';
	foreach ( infn_faq_bacheca() as $q ) {
		$h .= '<details><summary>' . $e( $q[0] ) . '</summary><p>' . $e( $q[1] ) . '</p></details>';
	}
	$h .= '</div></section></main>';
	return $h;
}

/* ─── Pagina: pubblica un'offerta ─── */

function infn_page_pubblica() {
	$url = home_url( INFN_PUBBLICA );
	return array(
		'plugin'      => 'annunci',
		'group'       => 'annunci',
		'slug'        => 'pubblica-offerta',
		'path'        => INFN_PUBBLICA,
		'label'       => 'Pubblica un’offerta di lavoro per influencer',
		'title'       => 'Pubblica un’offerta di lavoro per influencer gratis',
		'description' => 'Trova creator italiani per il tuo brand: descrivi l’offerta, il compenso e i contenuti, crea l’account alla fine e l’annuncio va online su Influencee. Gratis.',
		'ld'          => array(
			'@context' => 'https://schema.org',
			'@graph'   => array(
				inft_org_ld(),
				array( '@type' => 'WebPage', '@id' => $url . '#pagina', 'url' => $url, 'name' => 'Pubblica un’offerta di lavoro per influencer', 'inLanguage' => 'it-IT' ),
				array( '@type' => 'BreadcrumbList', 'itemListElement' => array( array( '@type' => 'ListItem', 'position' => 1, 'name' => 'Home', 'item' => home_url( '/' ) ), array( '@type' => 'ListItem', 'position' => 2, 'name' => 'Offerte di lavoro', 'item' => home_url( INFN_BACHECA ) ), array( '@type' => 'ListItem', 'position' => 3, 'name' => 'Pubblica un’offerta', 'item' => $url ) ) ),
			),
		),
		'render'      => 'infn_render_pubblica',
	);
}

/** Gruppo di scelte (radio o checkbox) con lo stile a pillole. */
function infn_choices( $name, $options, $type = 'radio', $checked = array(), $required = true ) {
	$h = '';
	foreach ( $options as $v => $label ) {
		$h .= '<label class="infn-choice"><input type="' . $type . '" name="' . esc_attr( $name ) . '" value="' . esc_attr( $v ) . '"' . ( in_array( $v, (array) $checked, true ) ? ' checked' : '' ) . ( $required && 'radio' === $type ? ' required' : '' ) . '><span>' . esc_html( $label ) . '</span></label>';
	}
	return $h;
}

function infn_select( $name, $options, $selected = '' ) {
	$h = '<select id="infn-' . esc_attr( $name ) . '" name="' . esc_attr( $name ) . '">';
	foreach ( $options as $v => $label ) {
		$h .= '<option value="' . esc_attr( $v ) . '"' . selected( $selected, $v, false ) . '>' . esc_html( $label ) . '</option>';
	}
	return $h . '</select>';
}

function infn_render_pubblica() {
	$e       = 'esc_html';
	$conn    = infn_app_connected();
	$n       = infn_creator_count();
	$default = gmdate( 'Y-m-d', strtotime( '+30 days' ) );
	$today   = gmdate( 'Y-m-d' );
	$steps   = array( 'La tua attività', 'L’offerta', 'Compenso e contenuti', 'Dati per fatture e contratti', 'Account e pubblicazione' );
	$h  = '<main id="infn" class="infn inf-scope" data-inft-track data-page-type="pubblica_offerta" data-audience="brand">';
	$h .= '<div class="inf-wrap infn-pub">';
	$h .= '<div class="infn-pub-intro" data-section="testata"><nav class="infn-crumbs infn-crumbs-dark" aria-label="Percorso"><ol><li><a href="' . esc_url( home_url( '/' ) ) . '">Home</a></li><li><a href="' . esc_url( home_url( INFN_BACHECA ) ) . '">Offerte di lavoro</a></li><li aria-current="page">Pubblica</li></ol></nav>';
	$h .= '<p class="inf-eyebrow">Gratis · 5 minuti</p><h1>Pubblica un’offerta di lavoro per <em>influencer</em></h1><p class="infn-lead-dark">Raccontaci la tua attività e cosa cerchi. L’account lo crei solo alla fine: l’annuncio va online su Influencee e i creator si candidano.</p>';
	$h .= '<ol class="infn-steps-list">';
	foreach ( $steps as $i => $st ) {
		$h .= '<li data-step-dot="' . ( $i + 1 ) . '"' . ( 0 === $i ? ' aria-current="step"' : '' ) . '><span>' . ( $i + 1 ) . '</span>' . $e( $st ) . '</li>';
	}
	$h .= '</ol></div>';

	$h .= '<form id="lead-form-pubblica-offerta" class="inf-form infn-form" data-tandem data-form="lead_pubblica_offerta" data-section="modulo" novalidate>';
	$h .= '<div class="infn-progress" aria-hidden="true"><span style="width:20%"></span></div>';

	// 1. attività
	$h .= '<fieldset class="infn-step" data-step="1"><legend><span class="infn-step-n">1 di 5</span> La tua attività</legend>';
	$h .= '<div class="inf-f"><span class="inf-f-l">Che attività hai? *</span><div class="infn-choices">' . infn_choices( 'tipo_attivita', infn_tipi_attivita() ) . '</div></div>';
	$h .= '<div class="infn-row"><p class="inf-f"><label for="infn-azienda">Nome dell’azienda o del brand *</label><input id="infn-azienda" name="azienda" maxlength="255" required autocomplete="organization"></p>';
	$h .= '<p class="inf-f"><label for="infn-citta_sede">Città *</label><input id="infn-citta_sede" name="citta_sede" maxlength="120" required autocomplete="address-level2"></p></div>';
	$h .= '<p class="inf-f"><label for="infn-sito">Sito o e-commerce <small>(facoltativo)</small></label><input id="infn-sito" name="sito" type="url" inputmode="url" maxlength="1000" placeholder="https://"></p>';
	$h .= '</fieldset>';

	// 2. offerta
	$h .= '<fieldset class="infn-step" data-step="2"><legend><span class="infn-step-n">2 di 5</span> L’offerta</legend>';
	$h .= '<p class="inf-f"><label for="infn-title">Titolo *</label><input id="infn-title" name="title" maxlength="160" required placeholder="Es. Cerco 3 creator food a Milano"></p>';
	$h .= '<p class="inf-f"><label for="infn-brief">Cosa chiedi *</label><textarea id="infn-brief" name="brief" maxlength="2000" rows="4" required placeholder="Il prodotto, che tipo di contenuto vuoi e per chi."></textarea></p>';
	$h .= '<div class="inf-f"><span class="inf-f-l">Piattaforme *</span><div class="infn-choices" data-min="1">' . infn_choices( 'platforms[]', infn_piattaforme(), 'checkbox', array( 'instagram' ) ) . '</div></div>';
	$h .= '</fieldset>';

	// 3. compenso e contenuti
	$h .= '<fieldset class="infn-step" data-step="3"><legend><span class="infn-step-n">3 di 5</span> Compenso e contenuti</legend>';
	$h .= '<div class="inf-f"><span class="inf-f-l">Cosa offri *</span><div class="infn-choices">' . infn_choices( 'kind', infn_tipi_offerta(), 'radio', array( 'paid_fee' ) ) . '</div></div>';
	$h .= '<p class="inf-f" data-kind="paid_fee"><label for="infn-fee_amount">Compenso per creator (€ + IVA) *</label><input id="infn-fee_amount" name="fee_amount" type="number" min="1" step="1" inputmode="numeric"></p>';
	$h .= '<div class="infn-row" data-kind="product_gifting" hidden><p class="inf-f"><label for="infn-product_desc">Prodotto in cambio *</label><input id="infn-product_desc" name="product_desc" maxlength="300"></p><p class="inf-f"><label for="infn-product_value">Valore del prodotto (€) <small>(facoltativo)</small></label><input id="infn-product_value" name="product_value" type="number" min="0" step="1"></p></div>';
	$h .= '<p class="inf-f" data-kind="affiliate_commission" hidden><label for="infn-commission_pct">Percentuale sulle vendite (%) *</label><input id="infn-commission_pct" name="commission_pct" type="number" min="1" max="100" step="0.5"></p>';
	$h .= '<div class="inf-f"><span class="inf-f-l">Contenuto richiesto *</span><div class="infn-row4"><label class="infn-mini">Su' . infn_select( 'contenuto_piattaforma', infn_piattaforme() ) . '</label><label class="infn-mini">Tipo' . infn_select( 'contenuto_tipo', infn_tipi_contenuto() ) . '</label><label class="infn-mini">Quanti<input name="contenuto_qty" type="number" min="1" max="50" value="1" required></label><label class="infn-mini">Consegna (giorni)<input name="contenuto_giorni" type="number" min="1" max="365" value="14" required></label></div></div>';
	$h .= '<div class="infn-row"><p class="inf-f"><label for="infn-apply_by">Candidature entro *</label><input id="infn-apply_by" name="apply_by" type="date" min="' . esc_attr( $today ) . '" value="' . esc_attr( $default ) . '" required></p>';
	$h .= '<p class="inf-f"><label for="infn-max_creators">Quanti creator cerchi <small>(facoltativo)</small></label><input id="infn-max_creators" name="max_creators" type="number" min="1" max="500"></p></div>';
	$h .= '<div class="infn-row"><p class="inf-f"><label for="infn-citta">Città dei creator <small>(facoltativa)</small></label><input id="infn-citta" name="citta" maxlength="80" placeholder="Es. Milano"></p>';
	$h .= '<p class="inf-f"><label for="infn-destination_url">Pagina del prodotto <small>(facoltativa)</small></label><input id="infn-destination_url" name="destination_url" type="url" maxlength="1000" placeholder="https://"></p></div>';
	$h .= '</fieldset>';

	// 4. dati azienda + creator bloccati
	$h .= '<fieldset class="infn-step" data-step="4"><legend><span class="infn-step-n">4 di 5</span> Dati per fatture e contratti</legend>';
	$h .= '<p class="inf-hint">Servono per i contratti con i creator, come nell’iscrizione all’app.</p>';
	$h .= '<div class="inf-f"><span class="inf-f-l">Dati fiscali *</span><div class="infn-choices">' . infn_choices( 'tipo_fiscale', array( 'piva' => 'Ho la partita IVA', 'cf' => 'Senza partita IVA (codice fiscale)' ), 'radio', array( 'piva' ) ) . '</div></div>';
	$h .= '<div class="infn-row" data-fiscale="piva"><p class="inf-f"><label for="infn-paese">Paese della sede</label>' . infn_select( 'paese', infn_paesi(), 'IT' ) . '</p>';
	$h .= '<p class="inf-f"><label for="infn-piva">Partita IVA *</label><input id="infn-piva" name="piva" maxlength="16" required inputmode="numeric" placeholder="11 cifre"></p></div>';
	$h .= '<p class="inf-f" data-fiscale="cf" hidden><label for="infn-codice_fiscale">Codice fiscale *</label><input id="infn-codice_fiscale" name="codice_fiscale" maxlength="16" autocapitalize="characters" placeholder="16 caratteri (o 11 cifre per associazioni)"></p>';
	$h .= '<p class="inf-f"><label for="infn-ragione_sociale" data-rs-label>Ragione sociale *</label><input id="infn-ragione_sociale" name="ragione_sociale" maxlength="255" required></p>';
	$h .= '<div class="infn-row"><p class="inf-f"><label for="infn-nome">Nome *</label><input id="infn-nome" name="nome" maxlength="150" required autocomplete="given-name"></p><p class="inf-f"><label for="infn-cognome">Cognome *</label><input id="infn-cognome" name="cognome" maxlength="150" required autocomplete="family-name"></p></div>';
	$h .= '<div class="infn-row"><p class="inf-f"><label for="infn-ruolo">Ruolo in azienda <small>(facoltativo)</small></label><input id="infn-ruolo" name="ruolo" maxlength="120"></p><p class="inf-f"><label for="infn-telefono">Telefono <small>(facoltativo)</small></label><input id="infn-telefono" name="telefono" type="tel" maxlength="30" autocomplete="tel"></p></div>';
	$h .= '<div class="infn-lock" data-section="creator_bloccati"><span class="infn-lock-tag">Nell’app</span><p class="infn-lock-t"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg> Scegli tu i creator</p><p>' . ( $n > 20 ? 'Su Influencee ci sono ' . number_format_i18n( $n ) . ' profili di creator italiani. ' : '' ) . 'Cercali per categoria, città e follower, invitali e chatta con loro: si sblocca appena crei l’account.</p><div class="infn-blur" aria-hidden="true"><i></i><i></i><i></i><i></i></div></div>';
	$h .= '</fieldset>';

	// 5. account
	$h .= '<fieldset class="infn-step" data-step="5"><legend><span class="infn-step-n">5 di 5</span> Account e pubblicazione</legend>';
	$h .= '<div class="infn-summary" data-summary></div>';
	$h .= '<p class="inf-f"><label for="infn-email">Email di lavoro *</label><input id="infn-email" name="email" type="email" maxlength="254" required autocomplete="email"></p>';
	$h .= '<p class="inf-hint">' . ( $conn ? 'Al passo successivo scegli la password su app.influencee.it: l’account si crea e l’annuncio va online.' : 'Dopo l’invio crei l’account su app.influencee.it con questa email: l’annuncio va online e sblocchi la scelta dei creator.' ) . '</p>';
	$h .= '<label class="inf-check"><input type="checkbox" name="consenso_marketing" value="Sì"> Voglio ricevere novità e consigli di Influencee (facoltativo)</label>';
	$h .= '<p class="inf-small">Inviando accetti che usiamo questi dati per creare l’annuncio e l’account. <a href="' . esc_url( home_url( '/privacy-policy/' ) ) . '">Informativa privacy</a></p>';
	$h .= '</fieldset>';

	$h .= '<p class="inf-hp" aria-hidden="true"><label>Lascia vuoto<input name="website_hp" tabindex="-1" autocomplete="off"></label></p>';
	$h .= '<input type="hidden" name="t0" value="' . esc_attr( (string) time() ) . '">';
	$h .= '<p class="inf-err" role="alert" data-err hidden></p>';
	$h .= '<div class="infn-nav"><button type="button" class="inf-btn inf-btn-line" data-prev hidden data-track-ignore>Indietro</button><button type="button" class="inf-btn" data-next data-track-ignore>Avanti</button><button type="submit" class="inf-btn inf-btn-acid" data-submit hidden>' . ( $conn ? 'Crea l’account e pubblica' : 'Invia l’offerta' ) . '</button></div>';

	// conferma
	$h .= '<div class="infn-done" data-done hidden><p class="infn-done-t">✓ Offerta ricevuta</p><p data-done-txt>' . ( $conn ? 'Ora scegli la password: l’account si crea e l’annuncio va online.' : 'Ti abbiamo scritto un riepilogo. Crea l’account su Influencee con la stessa email: l’annuncio va online e sblocchi la scelta dei creator.' ) . '</p>'
		. '<p><a class="inf-btn inf-btn-acid" data-claim href="' . esc_url( inft_app_link( '/iscriviti/brand/', 'pubblica_offerta', array( 'da' => 'annuncio' ) ) ) . '" data-track="claim_click">' . ( $conn ? 'Scegli la password e pubblica' : 'Crea l’account e pubblica' ) . '</a></p>'
		. '<p class="inf-small">Dopo la pubblicazione, nell’app trovi i creator adatti alla tua offerta e ricevi le candidature.</p></div>';
	$h .= '</form></div></main>';
	return $h;
}
