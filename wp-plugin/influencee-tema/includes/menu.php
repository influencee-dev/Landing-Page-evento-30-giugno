<?php
/**
 * Menu e piè di pagina: gli stessi link dell'intestazione e del piè di pagina di oggi (Influencee Header Footer +
 * modello Elementor 18568, rilevati il 22/10/2026), così i collegamenti interni per Google restano quelli.
 */

defined( 'ABSPATH' ) || exit;

/** La nuova app (iscrizione e accesso), come in tutte le pagine del sito. */
function infe_app( $path = '' ) {
	return 'https://app.influencee.it' . $path;
}

/** Il primo percorso che porta a una pagina online: la pagina nuova se è accesa, altrimenti quella di oggi. */
function infe_meglio( $percorsi ) {
	foreach ( (array) $percorsi as $p ) {
		if ( 0 !== strpos( $p, '/' ) || false !== strpos( $p, '#' ) || infe_esiste( $p ) ) {
			return $p;
		}
	}
	$p = (array) $percorsi;
	return end( $p );
}

function infe_regioni() {
	return array( 'lombardia' => 'Lombardia', 'lazio' => 'Lazio', 'campania' => 'Campania', 'veneto' => 'Veneto', 'emilia-romagna' => 'Emilia-Romagna', 'piemonte' => 'Piemonte', 'toscana' => 'Toscana', 'sicilia' => 'Sicilia', 'puglia' => 'Puglia', 'liguria' => 'Liguria', 'marche' => 'Marche', 'abruzzo' => 'Abruzzo', 'umbria' => 'Umbria', 'calabria' => 'Calabria', 'sardegna' => 'Sardegna', 'trentino-alto-adige' => 'Trentino-Alto Adige', 'friuli-venezia-giulia' => 'Friuli-Venezia Giulia', 'basilicata' => 'Basilicata', 'molise' => 'Molise', 'valle-d-aosta' => 'Valle d’Aosta' );
}

/** Voci del menu: gruppo con sottovoci (etichetta, link, testo breve) oppure link semplice. */
function infe_menu() {
	$regioni = array( array( 'Tutti gli influencer italiani', '/influencer-italiani/', 'Cerca per regione, città e categoria' ) );
	foreach ( infe_regioni() as $slug => $nome ) {
		$regioni[] = array( $nome, '/influencer-italiani/influencer-' . $slug . '/', '' );
	}
	$regioni[] = array( 'Cerca nel database dei creator →', infe_app( '/iscriviti/brand/' ), '' );
	$menu = array(
		array(
			'label' => 'Piattaforma',
			'items' => array(
				array( 'La piattaforma', '/piattaforma-influencer/', 'Ricerca creator, campagne, contratti, chat' ),
				array( 'Gestione campagne', infe_meglio( array( '/funzionalita/gestione-campagne/', '/gestione-campagne-influencer/' ) ), 'Dalla proposta ai risultati' ),
				array( 'Bacheca offerte di lavoro', '/offerte-lavoro-influencer/', 'Gli annunci dei brand per i creator' ),
			),
		),
		array(
			'label' => 'Aziende',
			'items' => array(
				array( 'Lancia una campagna', infe_meglio( array( '/influencer-marketing-aziende/', '/gestione-campagne-influencer/' ) ), 'Per brand ed e-commerce' ),
				array( 'Servizio full-service', '/agenzia-influencer/', 'La campagna la seguiamo noi' ),
				array( 'Calcolo preventivo', infe_meglio( array( '/preventivo-campagne/', '/preventivi-influencer/' ) ), 'Quanto costa la tua campagna' ),
				array( 'Pubblica un’offerta di lavoro', '/pubblica-offerta-lavoro/', 'Gratis, i creator si candidano' ),
				array( 'Tool gratuiti', '/social-media-tool/', 'Fake follower, costo influencer, engagement' ),
			),
		),
		array(
			'label' => 'Creator',
			'items' => array(
				array( 'Entra come creator', infe_meglio( array( '/diventa-creator/', '/influencer/' ) ), 'Iscrizione gratuita, ricevi proposte' ),
				array( 'Calcolatore costo post', '/social-media-tool/costo-influencer/', 'Quanto vale un tuo contenuto' ),
				array( 'Offerte di lavoro', '/offerte-lavoro-influencer/', 'Candidati agli annunci' ),
				array( 'Guide gratuite', '/guide-e-risorse/', 'Per crescere sui social' ),
			),
		),
		array( 'label' => 'Trova influencer', 'wide' => true, 'items' => $regioni ),
		array( 'label' => 'Prezzi', 'href' => infe_meglio( array( '/prezzi/', '/#prezzi' ) ) ),
		array( 'label' => 'Blog', 'href' => '/news-influencer-marketing/' ),
	);
	return apply_filters( 'infe_menu', $menu );
}

function infe_footer_colonne() {
	return apply_filters(
		'infe_footer_colonne',
		array(
			'Cosa offriamo' => array( array( 'Tool influencer e UGC', '/piattaforma-influencer/' ), array( 'Gestione campagne', infe_meglio( array( '/funzionalita/gestione-campagne/', '/gestione-campagne-influencer/' ) ) ), array( 'Calcolo preventivo campagna', infe_meglio( array( '/preventivo-campagne/', '/preventivi-influencer/' ) ) ), array( 'Annunci lavoro influencer', '/offerte-lavoro-influencer/' ), array( 'Guide gratuite', '/guide-e-risorse/' ) ),
			'Aziende'       => array( array( 'Piattaforma influencer', '/piattaforma-influencer/' ), array( 'Progetti influencer', '/agenzia-influencer/' ), array( 'Tool gratuiti', '/social-media-tool/' ), array( 'Pubblica offerte lavoro creator', '/pubblica-offerta-lavoro/' ) ),
			'Creator'       => array( array( 'Piattaforma creator', infe_meglio( array( '/diventa-creator/', '/influencer/' ) ) ), array( 'Calcolatore costo', '/social-media-tool/costo-influencer/' ), array( 'Offerte di lavoro', '/offerte-lavoro-influencer/' ), array( 'Trova influencer', '/influencer-italiani/' ), array( 'Blog', '/news-influencer-marketing/' ) ),
		)
	);
}

function infe_legali() {
	return array( array( 'Cookie policy', '/cookie-policy/' ), array( 'Privacy policy', '/privacy-policy/' ), array( 'Termini e condizioni', '/termini-legali/' ) );
}

function infe_social() {
	return array( array( 'Instagram', 'https://instagram.com/influencee' ), array( 'LinkedIn', 'https://linkedin.com/company/influencee' ) );
}

/** Link: i percorsi interni passano da home_url(). */
function infe_url( $href ) {
	return 0 === strpos( $href, '/' ) ? home_url( $href ) : $href;
}

/**
 * Struttura del sito nel piè di pagina (SEO-PIANO §4.8: categorie e città). Solo pagine che esistono davvero:
 * pagina WordPress pubblicata o pagina dei plugin accesa. Ricalcolata ogni 12 ore o quando cambiano le impostazioni.
 */
function infe_struttura() {
	$cache = get_transient( 'infe_struttura' );
	if ( is_array( $cache ) ) {
		return $cache;
	}
	$categorie = array( 'food' => 'Food', 'travel' => 'Travel', 'fashion' => 'Fashion', 'beauty' => 'Beauty', 'fitness' => 'Fitness', 'lifestyle' => 'Lifestyle', 'mom' => 'Family', 'pets' => 'Pet', 'music' => 'Musica', 'health' => 'Salute', 'comic' => 'Comicità', 'photography' => 'Arte e fotografia', 'luxury' => 'Luxury', 'model' => 'Model', 'wedding' => 'Wedding', 'entrepreneur' => 'Imprenditori' );
	$citta     = array( 'lombardia/milano' => 'Milano', 'lazio/roma' => 'Roma', 'campania/napoli' => 'Napoli', 'piemonte/torino' => 'Torino', 'emilia-romagna/bologna' => 'Bologna', 'toscana/firenze' => 'Firenze', 'veneto/verona' => 'Verona', 'puglia/bari' => 'Bari', 'sicilia/palermo' => 'Palermo', 'liguria/genova' => 'Genova' );
	$out       = array( 'Influencer per categoria' => array(), 'Influencer per città' => array() );
	foreach ( $categorie as $slug => $nome ) {
		$path = '/' . $slug . '-influencers/';
		if ( infe_esiste( $path ) ) {
			$out['Influencer per categoria'][] = array( $nome . ' influencer', $path );
		}
	}
	foreach ( $citta as $k => $nome ) {
		list( $reg, $c ) = explode( '/', $k );
		$path = '/influencer-italiani/influencer-' . $reg . '/influencer-' . $c . '/';
		if ( infe_esiste( $path ) ) {
			$out['Influencer per città'][] = array( 'Influencer ' . $nome, $path );
		}
	}
	$out = array_filter( $out );
	set_transient( 'infe_struttura', $out, 12 * HOUR_IN_SECONDS );
	return $out;
}

/** Il percorso porta a una pagina vera (mai link a pagine che darebbero 404)? */
function infe_esiste( $path ) {
	static $visti = array();
	if ( isset( $visti[ $path ] ) ) {
		return $visti[ $path ];
	}
	$visti[ $path ] = infe_esiste_davvero( $path );
	return $visti[ $path ];
}
function infe_esiste_davvero( $path ) {
	if ( function_exists( 'inft_pages' ) && function_exists( 'inft_is_active' ) ) {
		$pages = inft_pages();
		if ( isset( $pages[ $path ] ) && inft_is_active( $path, $pages[ $path ] ) ) {
			return true;
		}
	}
	$p = get_page_by_path( trim( $path, '/' ), OBJECT, 'page' );
	return $p && 'publish' === $p->post_status;
}
add_action( 'update_option_inft_settings', function () { delete_transient( 'infe_struttura' ); } );
add_action( 'save_post_page', function () { delete_transient( 'infe_struttura' ); } );
