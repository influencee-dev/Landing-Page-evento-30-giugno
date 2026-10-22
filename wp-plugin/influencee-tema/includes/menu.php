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

/** Prima voce che esiste tra i percorsi indicati, oppure null (la voce non compare: mai link a pagine che non ci sono). */
function infe_se_esiste( $percorsi ) {
	foreach ( (array) $percorsi as $p ) {
		if ( 0 !== strpos( $p, '/' ) || false !== strpos( $p, '#' ) || infe_esiste( $p ) ) {
			return $p;
		}
	}
	return null;
}

/** Categorie e specialità dell'elenco creator (slug della pagina → nome), come nel plugin Pagine. */
function infe_categorie() {
	return array( 'fashion' => 'Moda', 'beauty' => 'Beauty', 'food' => 'Food', 'travel' => 'Viaggi', 'fitness' => 'Fitness', 'sport' => 'Sport', 'lifestyle' => 'Lifestyle', 'mom' => 'Famiglia', 'pets' => 'Animali', 'music' => 'Musica', 'tech' => 'Tecnologia', 'gaming' => 'Gaming', 'home' => 'Casa', 'motori' => 'Motori', 'finanza' => 'Finanza', 'health' => 'Salute', 'photography' => 'Arte e foto', 'book' => 'Libri', 'comic' => 'Comicità', 'model' => 'Model', 'luxury' => 'Luxury', 'wedding' => 'Wedding', 'entrepreneur' => 'Imprenditori' );
}

function infe_citta() {
	return array( 'lombardia/milano' => 'Milano', 'lazio/roma' => 'Roma', 'campania/napoli' => 'Napoli', 'piemonte/torino' => 'Torino', 'emilia-romagna/bologna' => 'Bologna', 'toscana/firenze' => 'Firenze', 'veneto/verona' => 'Verona', 'puglia/bari' => 'Bari', 'sicilia/palermo' => 'Palermo', 'liguria/genova' => 'Genova' );
}

/**
 * Voci del menu. Ogni gruppo ha colonne di voci (etichetta, link, testo, icona) e una scheda in evidenza;
 * i link semplici hanno solo 'href'. Le voci verso pagine che non esistono vengono saltate.
 */
function infe_menu() {
	$cache = get_transient( 'infe_menu_' . INFE_VERSION );
	if ( is_array( $cache ) ) {
		return $cache;
	}
	$v = function ( $label, $percorsi, $testo = '', $icona = '' ) {
		$href = infe_se_esiste( $percorsi );
		return $href ? array( $label, $href, $testo, $icona ) : null;
	};
	// Nel mega menu solo categorie e specialità: le pagine geografiche ricevono i link dal flusso
	// home → categorie → regioni → città (link juice), non dal menu.
	$spec      = array( 'sport', 'model', 'luxury', 'wedding', 'entrepreneur' );
	$categorie = array();
	$special   = array();
	foreach ( infe_categorie() as $slug => $nome ) {
		$voce = $v( $nome, '/' . $slug . '-influencers/' );
		if ( in_array( $slug, $spec, true ) ) {
			$special[] = $voce;
		} else {
			$categorie[] = $voce;
		}
	}
	$special[] = $v( 'Artisti', '/artist-influencer/' );
	$menu = array(
		array(
			'label' => 'Piattaforma',
			'cols'  => array(
				array(
					'title' => 'Come funziona',
					'items' => array(
						array( 'La piattaforma', '/piattaforma-influencer/', 'Ricerca creator, campagne, contratti, chat', 'grid' ),
						$v( 'Database influencer', array( '/funzionalita/database-influencer/', '/trova-influencer/' ), 'Filtri per categoria, città e follower', 'search' ),
						$v( 'Gestione campagne', array( '/funzionalita/gestione-campagne/', '/gestione-campagne-influencer/' ), 'Dalla proposta ai risultati', 'megaphone' ),
						$v( 'Contenuti UGC', array( '/contenuti-ugc/', '/gestione-ugc/' ), 'Video e foto dei creator per i tuoi social', 'camera' ),
					),
				),
				array(
					'title' => 'Per chi',
					'items' => array(
						$v( 'Aziende ed e-commerce', array( '/influencer-marketing-aziende/' ), 'Campagne con creator italiani', 'store' ),
						$v( 'Agenzie', array( '/piattaforma-agenzie/', '/agenzie/' ), 'Più clienti, un solo strumento', 'users' ),
						$v( 'Creator', array( '/diventa-creator/', '/influencer/' ), 'Ricevi proposte dai brand', 'star' ),
						array( 'Bacheca offerte di lavoro', '/offerte-lavoro-influencer/', 'Gli annunci dei brand per i creator', 'briefcase' ),
					),
				),
			),
			'card'  => array( 'Gratis per iniziare', 'Trova i creator giusti e lancia la prima campagna', 'Crea l’account e cerca tra i creator italiani con i filtri.', 'Inizia gratis', infe_app( '/iscriviti/brand/' ) ),
		),
		array(
			'label' => 'Aziende',
			'cols'  => array(
				array(
					'title' => 'Lancia una campagna',
					'items' => array(
						$v( 'Influencer marketing per aziende', array( '/influencer-marketing-aziende/', '/gestione-campagne-influencer/' ), 'Per brand ed e-commerce', 'store' ),
						array( 'Servizio full-service', '/agenzia-influencer/', 'La campagna la seguiamo noi', 'handshake' ),
						$v( 'Influencer marketing locale', array( '/influencer-marketing-locale/' ), 'Negozi, ristoranti, eventi', 'pin' ),
						$v( 'Micro influencer', array( '/micro-influencer/' ), 'Community piccole, engagement alto', 'heart' ),
					),
				),
				array(
					'title' => 'Strumenti',
					'items' => array(
						$v( 'Calcolo preventivo', array( '/preventivo-campagne/', '/preventivi-influencer/' ), 'Quanto costa la tua campagna', 'calc' ),
						array( 'Pubblica un’offerta di lavoro', '/pubblica-offerta-lavoro/', 'Gratis, i creator si candidano', 'briefcase' ),
						array( 'Tool gratuiti', '/social-media-tool/', 'Fake follower, costo influencer, engagement', 'spark' ),
						$v( 'Prezzi', array( '/prezzi/' ), 'Piani per brand e agenzie', 'tag' ),
					),
				),
			),
			'card'  => array( 'Preventivo in un minuto', 'Quanto costa una campagna con influencer?', 'Scegli piattaforma, fascia di follower e numero di contenuti.', 'Calcola il preventivo', infe_meglio( array( '/preventivo-campagne/', '/preventivi-influencer/', '/social-media-tool/' ) ) ),
		),
		array(
			'label' => 'Creator',
			'cols'  => array(
				array(
					'title' => 'Lavora con i brand',
					'items' => array(
						$v( 'Entra come creator', array( '/diventa-creator/', '/influencer/' ), 'Iscrizione gratuita, ricevi proposte', 'star' ),
						array( 'Offerte di lavoro', '/offerte-lavoro-influencer/', 'Candidati agli annunci dei brand', 'briefcase' ),
						$v( 'Creator UGC', array( '/contenuti-ugc/' ), 'Contenuti per i brand anche senza follower', 'camera' ),
					),
				),
				array(
					'title' => 'Cresci sui social',
					'items' => array(
						array( 'Calcolatore costo post', '/social-media-tool/costo-influencer/', 'Quanto vale un tuo contenuto', 'calc' ),
						$v( 'Engagement rate', array( '/come-calcolare-engagement-rate/' ), 'Calcola il tuo in pochi secondi', 'chart' ),
						$v( 'Guide gratuite', array( '/guide-e-risorse/' ), 'Per crescere sui social', 'book' ),
						array( 'Blog', '/news-influencer-marketing/', 'Novità e consigli per creator', 'book' ),
					),
				),
			),
			'card'  => array( 'Per i creator', 'Fatti trovare dai brand italiani', 'Crea il profilo gratis: i brand ti contattano per collaborazioni pagate.', 'Iscriviti come creator', infe_app( '/iscriviti/creator/' ) ),
		),
		array(
			'label' => 'Trova influencer',
			'wide'  => true,
			'cols'  => array(
				array( 'title' => 'Categorie', 'chips' => true, 'items' => $categorie ),
				array( 'title' => 'Specialità', 'chips' => true, 'items' => $special ),
			),
			'card'  => array( 'Database creator', 'Tutti gli influencer italiani', 'Scegli la categoria del tuo brand, poi la regione e la città della campagna.', 'Vedi gli influencer italiani', '/influencer-italiani/' ),
		),
		array( 'label' => 'Prezzi', 'href' => infe_meglio( array( '/prezzi/', '/#prezzi' ) ) ),
		array( 'label' => 'Blog', 'href' => '/news-influencer-marketing/' ),
	);
	foreach ( $menu as &$g ) {
		if ( isset( $g['cols'] ) ) {
			foreach ( $g['cols'] as &$c ) {
				$c['items'] = array_values( array_filter( $c['items'] ) );
			}
			unset( $c );
		}
	}
	unset( $g );
	$menu = apply_filters( 'infe_menu', $menu );
	set_transient( 'infe_menu_' . INFE_VERSION, $menu, 12 * HOUR_IN_SECONDS );
	return $menu;
}

/** Icone (tratto 2, 24×24) per le voci del menu. */
function infe_icona( $nome ) {
	$p = array(
		'grid'      => '<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>',
		'search'    => '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
		'megaphone' => '<path d="M3 11v2a1 1 0 0 0 1 1h3l6 4V6L7 10H4a1 1 0 0 0-1 1Z"/><path d="M17 8a5 5 0 0 1 0 8"/>',
		'camera'    => '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
		'store'     => '<path d="M4 10v10h16V10"/><path d="M3 10 5 4h14l2 6a3 3 0 0 1-6 0 3 3 0 0 1-6 0 3 3 0 0 1-6 0"/>',
		'users'     => '<circle cx="9" cy="8" r="3.5"/><path d="M3 20a6 6 0 0 1 12 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M21 20a6 6 0 0 0-3.5-5.5"/>',
		'star'      => '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
		'briefcase' => '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"/>',
		'handshake' => '<path d="m11 17 2 2a1.4 1.4 0 0 0 2-2"/><path d="m14 14 2.5 2.5a1.4 1.4 0 0 0 2-2l-3.9-3.9a2.8 2.8 0 0 0-4 0l-.9.9a1.4 1.4 0 0 1-2-2L10.5 7a5 5 0 0 1 6.6-.4l.4.3L21 6v8l-2 1"/><path d="M3 6v8l6.5 6.5a1.4 1.4 0 0 0 2-2"/><path d="m3 6 3.5-1L9 7"/>',
		'pin'       => '<path d="M12 21s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12Z"/><circle cx="12" cy="9" r="2.5"/>',
		'heart'     => '<path d="M12 20s-8-4.7-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 9c0 6.3-8 11-8 11Z"/>',
		'calc'      => '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01"/>',
		'spark'     => '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>',
		'tag'       => '<path d="M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9z"/><circle cx="8" cy="8" r="1.5"/>',
		'chart'     => '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
		'book'      => '<path d="M4 4h6a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4zM20 4h-6a3 3 0 0 0-3 3"/><path d="M20 4v14h-7"/>',
	);
	if ( empty( $p[ $nome ] ) ) {
		return '';
	}
	return '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' . $p[ $nome ] . '</svg>';
}

function infe_footer_colonne() {
	$cache = get_transient( 'infe_footer_' . INFE_VERSION );
	if ( is_array( $cache ) ) {
		return $cache;
	}
	$col = array(
		'Aziende'          => array( array( 'Piattaforma influencer', '/piattaforma-influencer/' ), array( 'Influencer marketing per aziende', infe_se_esiste( array( '/influencer-marketing-aziende/', '/gestione-campagne-influencer/' ) ) ), array( 'Servizio full-service', '/agenzia-influencer/' ), array( 'Agenzie', infe_se_esiste( array( '/piattaforma-agenzie/', '/agenzie/' ) ) ), array( 'Pubblica un’offerta di lavoro', '/pubblica-offerta-lavoro/' ), array( 'Prezzi', infe_se_esiste( array( '/prezzi/' ) ) ) ),
		'Creator'          => array( array( 'Entra come creator', infe_meglio( array( '/diventa-creator/', '/influencer/' ) ) ), array( 'Offerte di lavoro', '/offerte-lavoro-influencer/' ), array( 'Creator UGC', infe_se_esiste( array( '/contenuti-ugc/' ) ) ), array( 'Trova influencer', '/influencer-italiani/' ), array( 'Blog', '/news-influencer-marketing/' ) ),
		// tool gratuiti: tutti, con il modulo per ricevere il risultato o la selezione (lead)
		'Tool gratuiti'    => array( array( 'Calcolo preventivo campagna', infe_se_esiste( array( '/preventivo-campagne/', '/preventivi-influencer/' ) ) ), array( 'Quanto costa un influencer', '/social-media-tool/costo-influencer/' ), array( 'Calcolo engagement rate', infe_se_esiste( array( '/come-calcolare-engagement-rate/' ) ) ), array( 'Check fake follower', infe_se_esiste( array( '/followe-instagram-fake-follower/' ) ) ), array( 'Emoticon da copiare', infe_se_esiste( array( '/social-media-tool/emoticon-da-copiare/' ) ) ), array( 'Tutti i tool', '/social-media-tool/' ) ),
		// lead magnet: risorse gratuite in cambio del contatto o dell'iscrizione
		'Risorse gratuite' => array( array( 'Selezione gratuita di creator', '/influencer-italiani/' ), array( 'Guide e risorse', infe_se_esiste( array( '/guide-e-risorse/' ) ) ), array( 'Contratto influencer e UGC', infe_se_esiste( array( '/contratto-social-media-influencer-ugc/', '/funzionalita/contratto-influencer/' ) ) ), array( 'Media kit per creator', infe_se_esiste( array( '/funzionalita/media-kit/' ) ) ), array( 'Academy influencer marketing', infe_se_esiste( array( '/academy-influencer-marketing/' ) ) ) ),
	);
	foreach ( $col as $t => $links ) {
		$col[ $t ] = array_values( array_filter( $links, function ( $l ) { return ! empty( $l[1] ); } ) );
	}
	$col = apply_filters( 'infe_footer_colonne', array_filter( $col ) );
	set_transient( 'infe_footer_' . INFE_VERSION, $col, 12 * HOUR_IN_SECONDS );
	return $col;
}

function infe_legali() {
	return array( array( 'Cookie policy', '/cookie-policy/' ), array( 'Privacy policy', '/privacy-policy/' ), array( 'Termini e condizioni', '/termini-legali/' ) );
}

function infe_social() {
	return array( array( 'Instagram', 'https://instagram.com/influencee', '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor"/>' ), array( 'LinkedIn', 'https://linkedin.com/company/influencee', '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7"/>' ) );
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
	$cache = get_transient( 'infe_struttura_2' );
	if ( is_array( $cache ) ) {
		return $cache;
	}
	$categorie = infe_categorie();
	$citta     = infe_citta();
	$out       = array( 'Influencer per categoria' => array(), 'Influencer per città' => array() );
	foreach ( $categorie as $slug => $nome ) {
		$path = '/' . $slug . '-influencers/';
		if ( infe_esiste( $path ) ) {
			$out['Influencer per categoria'][] = array( $nome . ' influencer', $path );
		}
	}
	if ( infe_esiste( '/artist-influencer/' ) ) {
		$out['Influencer per categoria'][] = array( 'Artisti influencer', '/artist-influencer/' );
	}
	foreach ( $citta as $k => $nome ) {
		list( $reg, $c ) = explode( '/', $k );
		$path = '/influencer-italiani/influencer-' . $reg . '/influencer-' . $c . '/';
		if ( infe_esiste( $path ) ) {
			$out['Influencer per città'][] = array( 'Influencer ' . $nome, $path );
		}
	}
	$out = array_filter( $out );
	set_transient( 'infe_struttura_2', $out, 12 * HOUR_IN_SECONDS );
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
/** Svuota menu e piè di pagina salvati: quando cambiano le impostazioni o una pagina. */
function infe_svuota_menu() {
	delete_transient( 'infe_struttura_2' );
	delete_transient( 'infe_menu_' . INFE_VERSION );
	delete_transient( 'infe_footer_' . INFE_VERSION );
}
add_action( 'update_option_inft_settings', 'infe_svuota_menu' );
add_action( 'save_post_page', 'infe_svuota_menu' );
add_action( 'trashed_post', 'infe_svuota_menu' );
