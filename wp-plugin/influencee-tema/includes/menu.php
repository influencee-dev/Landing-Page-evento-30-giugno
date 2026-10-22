<?php
/**
 * Menu e piè di pagina: gli stessi link dell'intestazione e del piè di pagina di oggi (Influencee Header Footer +
 * modello Elementor 18568, rilevati il 22/10/2026), così i collegamenti interni per Google restano quelli.
 */

defined( 'ABSPATH' ) || exit;

function infe_app( $path = '' ) {
	return 'https://campaign.influencee.it' . $path;
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
	$regioni[] = array( 'Sfoglia tutto il database →', infe_app(), '' );
	$menu = array(
		array(
			'label' => 'Piattaforma',
			'items' => array(
				array( 'La piattaforma', '/piattaforma-influencer/', 'Ricerca creator, approvazione, contratti, chat' ),
				array( 'Gestione campagne', '/gestione-campagne-influencer/', 'Dalla proposta ai risultati' ),
				array( 'Bacheca offerte di lavoro', '/offerte-lavoro-influencer/', 'Gli annunci dei brand per i creator' ),
			),
		),
		array(
			'label' => 'Aziende',
			'items' => array(
				array( 'Lancia una campagna', '/gestione-campagne-influencer/', 'Per brand ed e-commerce' ),
				array( 'Servizio full-service', '/agenzia-influencer/', 'La campagna la seguiamo noi' ),
				array( 'Calcolo preventivo', '/preventivi-influencer/', 'Quanto costa la tua campagna' ),
				array( 'Pubblica un’offerta di lavoro', '/pubblica-offerta-lavoro/', 'Gratis, i creator si candidano' ),
				array( 'Free social media tool', '/social-media-tool-form/', 'Gli strumenti gratuiti' ),
			),
		),
		array(
			'label' => 'Creator',
			'items' => array(
				array( 'Entra come creator', '/influencer/', 'Iscrizione gratuita, ricevi proposte' ),
				array( 'Calcolatore costo post', '/social-media-tool/costo-influencer/', 'Quanto vale un tuo contenuto' ),
				array( 'Offerte di lavoro', '/offerte-lavoro-influencer/', 'Candidati agli annunci' ),
				array( 'Guide gratuite', '/guide-e-risorse/', 'Per crescere sui social' ),
			),
		),
		array( 'label' => 'Trova influencer', 'wide' => true, 'items' => $regioni ),
		array( 'label' => 'Prezzi', 'href' => '/#prezzi' ),
		array( 'label' => 'Blog', 'href' => '/news-influencer-marketing/' ),
	);
	return apply_filters( 'infe_menu', $menu );
}

function infe_footer_colonne() {
	return apply_filters(
		'infe_footer_colonne',
		array(
			'Cosa offriamo' => array( array( 'Tool influencer e UGC', '/piattaforma-influencer/' ), array( 'Gestione campagne', '/gestione-campagne-influencer/' ), array( 'Calcolo preventivo campagna', '/preventivi-influencer/' ), array( 'Annunci lavoro influencer', '/offerte-lavoro-influencer/' ), array( 'Guide gratuite', '/guide-e-risorse/' ) ),
			'Aziende'       => array( array( 'Piattaforma influencer', '/piattaforma-influencer/' ), array( 'Progetti influencer', '/agenzia-influencer/' ), array( 'Free social media tool', '/social-media-tool-form/' ), array( 'Pubblica offerte lavoro creator', '/pubblica-offerta-lavoro/' ) ),
			'Creator'       => array( array( 'Piattaforma creator', '/influencer/' ), array( 'Calcolatore costo', '/social-media-tool/costo-influencer/' ), array( 'Offerte di lavoro', '/offerte-lavoro-influencer/' ), array( 'Trova influencer', '/influencer-italiani/' ), array( 'Blog', '/news-influencer-marketing/' ) ),
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
