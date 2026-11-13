<?php
/**
 * CALCOLATORE DEL PREVENTIVO (13/11/2026)
 * - POST /wp-json/influencee/v1/preventivo: lo chiama il calcolatore a passi dopo l'invio (il lead va già
 *   a Tandem con <form data-tandem>). Qui: email con la guida al cliente (firmata Giorgia Palazzo),
 *   avviso al team, contatto in una lista Brevo se c'è il consenso.
 *   Invio con l'API di Brevo se c'è la chiave (impostazioni, oppure quella del plugin Brevo del sito),
 *   altrimenti con wp_mail.
 * - Calcolatore negli articoli e nelle pagine WordPress: infc_preventivo_mount() + assets/inft-preventivo.js/.css.
 * - /preventivi-influencer/: il calcolatore si aggiunge sotto il testo della pagina (il modulo Brevo resta).
 */

defined( 'ABSPATH' ) || exit;

require_once __DIR__ . '/email-guida.php';

/** Impostazioni del preventivo, con i valori di partenza. */
function infc_preventivo_cfg() {
	$s = inft_settings();
	$d = array(
		'preventivo_email'    => 1,                       // manda la guida al cliente
		'preventivo_mittente' => 'giorgia@influencee.it', // indirizzo del mittente (deve essere un mittente verificato in Brevo)
		'preventivo_nome'     => 'Giorgia Palazzo',       // nome del mittente
		'preventivo_ruolo'    => 'CEO & CO-Founder',     // come nella firma Zoho
		'preventivo_telefono' => '+39 3281230265',       // telefono nella firma (come in Zoho)
		'preventivo_team'     => get_option( 'admin_email' ), // chi riceve l'avviso di ogni richiesta
		'preventivo_brevo_key'   => '',                   // chiave API v3 di Brevo (xkeysib-…); vuota = quella del plugin Brevo, se c'è
		'preventivo_brevo_lista' => 0,                    // lista Brevo dove aggiungere chi dà il consenso (0 = nessuna)
		'preventivo_pagina_vecchia' => 1,                 // calcolatore anche in /preventivi-influencer/
	);
	foreach ( $d as $k => $v ) {
		if ( isset( $s[ $k ] ) && '' !== $s[ $k ] ) {
			$d[ $k ] = $s[ $k ];
		}
	}
	return $d;
}

/** Chiave API di Brevo: quella delle impostazioni o quella salvata dal plugin Brevo (Sendinblue) del sito. */
function infc_brevo_key() {
	$k = trim( (string) infc_preventivo_cfg()['preventivo_brevo_key'] );
	if ( '' === $k ) {
		$o = get_option( 'sib_main_option' );
		if ( is_array( $o ) && ! empty( $o['access_key'] ) ) {
			$k = (string) $o['access_key'];
		}
	}
	return 0 === strpos( $k, 'xkeysib-' ) ? $k : '';
}

function infc_brevo( $method, $path, $body ) {
	$key = infc_brevo_key();
	if ( ! $key ) {
		return new WP_Error( 'brevo', 'chiave Brevo assente' );
	}
	$r = wp_remote_request(
		'https://api.brevo.com/v3' . $path,
		array(
			'method'  => $method,
			'timeout' => 8,
			'headers' => array( 'api-key' => $key, 'Content-Type' => 'application/json', 'Accept' => 'application/json' ),
			'body'    => wp_json_encode( $body ),
		)
	);
	if ( is_wp_error( $r ) ) {
		return $r;
	}
	$code = (int) wp_remote_retrieve_response_code( $r );
	return $code >= 200 && $code < 300 ? true : new WP_Error( 'brevo', 'Brevo ' . $code . ': ' . substr( (string) wp_remote_retrieve_body( $r ), 0, 200 ) );
}

/** Manda un'email: Brevo se c'è la chiave, altrimenti wp_mail. Restituisce 'brevo', 'wp_mail' o un WP_Error. */
function infc_manda_email( $to, $to_name, $subject, $html, $text, $tag ) {
	$c    = infc_preventivo_cfg();
	$from = sanitize_email( $c['preventivo_mittente'] );
	if ( infc_brevo_key() ) {
		$r = infc_brevo(
			'POST',
			'/smtp/email',
			array(
				'sender'      => array( 'name' => $c['preventivo_nome'], 'email' => $from ),
				'replyTo'     => array( 'name' => $c['preventivo_nome'], 'email' => $from ),
				'to'          => array( array( 'email' => $to, 'name' => $to_name ? $to_name : $to ) ),
				'subject'     => $subject,
				'htmlContent' => $html,
				'textContent' => $text,
				'tags'        => array( $tag ),
			)
		);
		if ( true === $r ) {
			return 'brevo';
		}
		inft_preventivo_log( 'Brevo non ha inviato (' . $r->get_error_message() . '): provo con wp_mail' );
	}
	$headers = array( 'Content-Type: text/html; charset=UTF-8', 'From: ' . $c['preventivo_nome'] . ' <' . $from . '>', 'Reply-To: ' . $c['preventivo_nome'] . ' <' . $from . '>' );
	return wp_mail( $to, $subject, $html, $headers ) ? 'wp_mail' : new WP_Error( 'mail', 'wp_mail non ha inviato' );
}

/** Ultime 30 righe di registro (visibili nelle impostazioni). */
function inft_preventivo_log( $msg ) {
	$log   = (array) get_option( 'infc_preventivo_log', array() );
	$log[] = current_time( 'Y-m-d H:i' ) . ' · ' . $msg;
	update_option( 'infc_preventivo_log', array_slice( $log, -30 ), false );
}

add_action(
	'rest_api_init',
	function () {
		register_rest_route(
			'influencee/v1',
			'/preventivo',
			array(
				'methods'             => 'POST',
				'permission_callback' => '__return_true', // modulo pubblico: limiti per indirizzo ed email qui sotto
				'callback'            => 'infc_preventivo_ricevi',
			)
		);
	}
);

function infc_preventivo_ricevi( WP_REST_Request $req ) {
	$in  = (array) $req->get_json_params();
	$txt = function ( $k, $max = 120 ) use ( $in ) {
		return isset( $in[ $k ] ) ? mb_substr( sanitize_text_field( (string) $in[ $k ] ), 0, $max ) : '';
	};
	// trappola per i robot: il campo nascosto «sito_web» lo compilano solo loro
	if ( '' !== $txt( 'sito_web' ) ) {
		return new WP_REST_Response( array( 'ok' => true ), 200 );
	}
	$email = sanitize_email( isset( $in['email'] ) ? (string) $in['email'] : '' );
	if ( ! is_email( $email ) ) {
		return new WP_REST_Response( array( 'ok' => false, 'errore' => 'email' ), 400 );
	}
	// al massimo 5 richieste all'ora per indirizzo IP
	$ip  = isset( $_SERVER['REMOTE_ADDR'] ) ? (string) $_SERVER['REMOTE_ADDR'] : '';
	$kip = 'infc_pv_ip_' . md5( $ip );
	$n   = (int) get_transient( $kip );
	if ( $n >= 5 ) {
		return new WP_REST_Response( array( 'ok' => false, 'errore' => 'troppe richieste' ), 429 );
	}
	set_transient( $kip, $n + 1, HOUR_IN_SECONDS );

	// nel nome niente indirizzi web: l'email al cliente lo ripete
	$nome  = trim( preg_replace( '#(https?://|www\.)\S*#i', '', $txt( 'nome', 40 ) ) );
	$d     = array(
		'nome'      => $nome,
		'azienda'   => $txt( 'azienda', 80 ),
		'cognome'   => trim( preg_replace( '#(https?://|www\.)\S*#i', '', $txt( 'cognome', 40 ) ) ),
		'tipo'      => $txt( 'tipo_azienda', 60 ),
		'preventivo' => $txt( 'preventivo_indicativo', 300 ),
		'telefono'  => $txt( 'telefono', 30 ),
		'citta'     => $txt( 'citta', 60 ),
		'budget'    => $txt( 'budget', 60 ),
		'riepilogo' => $txt( 'risultato_tool', 600 ),
		'consenso'  => 'Sì' === $txt( 'consenso_marketing', 5 ),
		'modulo'    => $txt( 'modulo', 60 ),
		'pagina'    => $txt( 'pagina', 200 ),
	);
	$c     = infc_preventivo_cfg();
	$esito = array();

	// 1. guida al cliente (una volta al giorno per indirizzo)
	$kmail = 'infc_pv_mail_' . md5( strtolower( $email ) );
	if ( ! empty( $c['preventivo_email'] ) && ! get_transient( $kmail ) ) {
		$corpo = infc_guida_corpo(
			array(
				'nome'         => $d['nome'],
				'citta'        => $d['citta'],
				'riepilogo'    => preg_replace( '/^Pagina di origine: [^·]*·\s*/u', '', $d['riepilogo'] ), // al cliente senza la pagina di origine
				'link_brand'   => 'https://app.influencee.it/iscriviti/brand/',
				'link_offerta' => home_url( '/pubblica-offerta-lavoro/' ),
				'whatsapp'     => '+39 351 342 1629',
				'preventivo'   => $d['preventivo'],
				'firma_nome'   => $c['preventivo_nome'],
				'firma_ruolo'  => $c['preventivo_ruolo'],
				'firma_email'  => sanitize_email( $c['preventivo_mittente'] ),
				'firma_tel'    => $c['preventivo_telefono'],
			)
		);
		$r = infc_manda_email( $email, trim( $d['nome'] . ' ' . $d['cognome'] ), infc_guida_oggetto( $d['nome'] ), $corpo['html'], $corpo['text'], 'guida-preventivo' );
		$esito['guida'] = is_wp_error( $r ) ? 'errore' : $r;
		if ( ! is_wp_error( $r ) ) {
			set_transient( $kmail, 1, DAY_IN_SECONDS );
		}
	}

	// 2. avviso al team (sempre: è la copia di sicurezza se Tandem non riceve il lead)
	$team = sanitize_email( $c['preventivo_team'] );
	if ( is_email( $team ) ) {
		$righe = array(
			'Nome: ' . trim( $d['nome'] . ' ' . $d['cognome'] ),
			'Tipo di azienda: ' . $d['tipo'],
			'Email: ' . $email,
			'Città: ' . $d['citta'],
			'Budget: ' . $d['budget'],
			'Richiesta: ' . $d['riepilogo'],
			'Preventivo indicativo mostrato: ' . $d['preventivo'],
			'Modulo: ' . $d['modulo'] . ' · pagina ' . $d['pagina'],
			'Consenso marketing: ' . ( $d['consenso'] ? 'sì' : 'no' ),
			'Guida inviata: ' . ( isset( $esito['guida'] ) ? $esito['guida'] : 'no (già inviata oggi o spenta)' ),
		);
		$html = '<div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.6">' . implode( '<br>', array_map( 'esc_html', $righe ) ) . '</div>';
		$r    = infc_manda_email( $team, 'Team Influencee', 'Nuova richiesta di preventivo: ' . trim( $d['nome'] . ' ' . $d['cognome'] ) . ( $d['tipo'] ? ' (' . $d['tipo'] . ')' : '' ), $html, implode( "\n", $righe ), 'avviso-preventivo' );
		$esito['team'] = is_wp_error( $r ) ? 'errore' : $r;
	}

	// 3. contatto in Brevo (solo con il consenso marketing e una lista scelta)
	if ( $d['consenso'] && (int) $c['preventivo_brevo_lista'] > 0 && infc_brevo_key() ) {
		$r = infc_brevo(
			'POST',
			'/contacts',
			array(
				'email'         => $email,
				'attributes'    => array( 'NOME' => $d['nome'], 'FIRSTNAME' => $d['nome'], 'COGNOME' => $d['cognome'], 'LASTNAME' => $d['cognome'] ),
				'listIds'       => array( (int) $c['preventivo_brevo_lista'] ),
				'updateEnabled' => true,
			)
		);
		$esito['brevo_lista'] = true === $r ? 'ok' : 'errore';
	}

	inft_preventivo_log( 'richiesta da ' . $d['modulo'] . ' · ' . wp_json_encode( $esito ) );
	return new WP_REST_Response( array( 'ok' => true ), 200 );
}

/* ─── Calcolatore negli articoli e nelle pagine WordPress ─────────── */

function infc_preventivo_enqueue() {
	wp_enqueue_style( 'inft-preventivo', INFC_URL . 'assets/inft-preventivo.css', array(), INFC_VERSION );
	wp_enqueue_script( 'inft-preventivo', INFC_URL . 'assets/inft-preventivo.js', array(), INFC_VERSION, array( 'in_footer' => true, 'strategy' => 'defer' ) );
}

/**
 * HTML del calcolatore (lo disegna assets/inft-preventivo.js).
 *
 * @param array $a page (chiave breve), origin (pagina di origine), variant (full|compact), title, city, sector.
 */
function infc_preventivo_mount( $a ) {
	if ( ! file_exists( INFC_DIR . 'assets/inft-preventivo.js' ) ) {
		return '';
	}
	if ( did_action( 'wp_enqueue_scripts' ) ) {
		infc_preventivo_enqueue();
	} else {
		add_action( 'wp_enqueue_scripts', 'infc_preventivo_enqueue' );
	}
	$a    = wp_parse_args( $a, array( 'page' => 'sito', 'origin' => '', 'variant' => 'compact', 'title' => '', 'city' => '', 'sector' => '' ) );
	$attr = '';
	foreach ( $a as $k => $v ) {
		if ( '' !== (string) $v ) {
			$attr .= ' data-' . $k . '="' . esc_attr( $v ) . '"';
		}
	}
	return '<div class="inft-preventivo" data-inft-preventivo-mount' . $attr . ' style="min-height:' . ( 'full' === $a['variant'] ? 560 : 480 ) . 'px"></div>';
}

/* /preventivi-influencer/ (pagina WordPress con il modulo Brevo che ha portato quasi tutti i preventivi):
   il modulo resta; il calcolatore si aggiunge sotto. */
add_action(
	'wp',
	function () {
		if ( ! empty( infc_preventivo_cfg()['preventivo_pagina_vecchia'] ) && is_page( 'preventivi-influencer' ) ) {
			add_action( 'wp_enqueue_scripts', 'infc_preventivo_enqueue' );
		}
	}
);
add_filter(
	'the_content',
	function ( $html ) {
		if ( empty( infc_preventivo_cfg()['preventivo_pagina_vecchia'] ) || ! is_page( 'preventivi-influencer' ) || ! in_the_loop() || ! is_main_query() ) {
			return $html;
		}
		return $html . '<section class="inft-preventivo-sezione" style="margin:48px auto;max-width:1200px;padding:0 16px"><h2 style="font-size:30px;line-height:1.15;margin:0 0 8px">Calcola il preventivo in cinque passi</h2><p style="margin:0 0 24px;color:#6b6b6b">Influencer o UGC, che creator, dove e con quale budget: vedi la fascia di prezzo e ti mandiamo il preventivo completo.</p>'
			. infc_preventivo_mount( array( 'page' => 'preventivi_influencer', 'origin' => 'Pagina /preventivi-influencer/', 'variant' => 'full', 'title' => 'Calcola il preventivo' ) )
			. '</section>';
	},
	20
);

/* ─── Impostazioni ──────────────────────────────────────────────── */

add_filter(
	'inft_settings_sanitize',
	function ( $out, $in ) {
		if ( ! isset( $in['preventivo_form'] ) ) {
			return $out; // salvataggio senza questa sezione: valori invariati
		}
		$out['preventivo_email']          = empty( $in['preventivo_email'] ) ? 0 : 1;
		$out['preventivo_pagina_vecchia'] = empty( $in['preventivo_pagina_vecchia'] ) ? 0 : 1;
		$out['preventivo_mittente']       = sanitize_email( isset( $in['preventivo_mittente'] ) ? $in['preventivo_mittente'] : '' );
		$out['preventivo_nome']           = sanitize_text_field( isset( $in['preventivo_nome'] ) ? $in['preventivo_nome'] : '' );
		$out['preventivo_ruolo']          = sanitize_text_field( isset( $in['preventivo_ruolo'] ) ? $in['preventivo_ruolo'] : '' );
		$out['preventivo_telefono']       = sanitize_text_field( isset( $in['preventivo_telefono'] ) ? $in['preventivo_telefono'] : '' );
		$out['preventivo_team']           = sanitize_email( isset( $in['preventivo_team'] ) ? $in['preventivo_team'] : '' );
		$key                              = trim( sanitize_text_field( isset( $in['preventivo_brevo_key'] ) ? $in['preventivo_brevo_key'] : '' ) );
		if ( '' !== $key || ! empty( $in['preventivo_brevo_key_cancella'] ) ) {
			$out['preventivo_brevo_key'] = $key; // campo vuoto = tieni la chiave salvata
		}
		$out['preventivo_brevo_lista'] = isset( $in['preventivo_brevo_lista'] ) ? absint( $in['preventivo_brevo_lista'] ) : 0;
		return $out;
	},
	10,
	2
);

add_action(
	'inft_settings_sections',
	function () {
		$c   = infc_preventivo_cfg();
		$key = infc_brevo_key();
		$own = '' !== trim( (string) $c['preventivo_brevo_key'] );
		$log = array_reverse( (array) get_option( 'infc_preventivo_log', array() ) );
		?>
		<h2>Preventivo: email automatica con la guida</h2>
		<input type="hidden" name="inft_settings[preventivo_form]" value="1">
		<table class="form-table" role="presentation"><tbody>
			<tr><th scope="row">Guida al cliente</th><td><label><input type="checkbox" name="inft_settings[preventivo_email]" value="1" <?php checked( ! empty( $c['preventivo_email'] ) ); ?>> Dopo ogni richiesta di preventivo manda l’email «come funziona una campagna con influencer» (una volta al giorno per indirizzo)</label></td></tr>
			<tr><th scope="row">Mittente</th><td><input type="text" name="inft_settings[preventivo_nome]" value="<?php echo esc_attr( $c['preventivo_nome'] ); ?>" class="regular-text"> <input type="email" name="inft_settings[preventivo_mittente]" value="<?php echo esc_attr( $c['preventivo_mittente'] ); ?>" class="regular-text"><p class="description">Nome e indirizzo da cui parte l’email; le risposte arrivano qui. Con Brevo l’indirizzo deve essere un mittente verificato.</p></td></tr>
			<tr><th scope="row">Firma</th><td><input type="text" name="inft_settings[preventivo_ruolo]" value="<?php echo esc_attr( $c['preventivo_ruolo'] ); ?>" class="regular-text"> <input type="text" name="inft_settings[preventivo_telefono]" value="<?php echo esc_attr( $c['preventivo_telefono'] ); ?>" class="regular-text"><p class="description">Ruolo e telefono nella firma (come in Zoho, con il nuovo logo).</p></td></tr>
			<tr><th scope="row">Avviso al team</th><td><input type="email" name="inft_settings[preventivo_team]" value="<?php echo esc_attr( $c['preventivo_team'] ); ?>" class="regular-text"><p class="description">Riceve una copia di ogni richiesta (anche se Tandem non la registra).</p></td></tr>
			<tr><th scope="row">Brevo</th><td>
				<p><?php echo $key ? '✅ invio con l’API di Brevo' . ( $own ? ' (chiave salvata qui)' : ' (chiave del plugin Brevo del sito)' ) : '⚪ nessuna chiave Brevo: le email partono con il server del sito (wp_mail)'; ?></p>
				<input type="password" name="inft_settings[preventivo_brevo_key]" value="" placeholder="<?php echo $own ? 'chiave salvata: lascia vuoto per tenerla' : 'xkeysib-…'; ?>" class="regular-text" autocomplete="off">
				<?php if ( $own ) : ?><label><input type="checkbox" name="inft_settings[preventivo_brevo_key_cancella]" value="1"> cancella la chiave salvata</label><?php endif; ?>
				<p class="description">Chiave API v3 (Brevo → Impostazioni SMTP e API → Chiavi API).</p>
				<p><label>Lista per chi dà il consenso marketing (numero della lista, 0 = nessuna) <input type="number" min="0" name="inft_settings[preventivo_brevo_lista]" value="<?php echo (int) $c['preventivo_brevo_lista']; ?>" style="width:90px"></label></p>
			</td></tr>
			<tr><th scope="row">/preventivi-influencer/</th><td><label><input type="checkbox" name="inft_settings[preventivo_pagina_vecchia]" value="1" <?php checked( ! empty( $c['preventivo_pagina_vecchia'] ) ); ?>> Aggiungi il calcolatore sotto il testo della pagina (il modulo Brevo resta com’è)</label></td></tr>
			<?php if ( $log ) : ?>
			<tr><th scope="row">Ultime richieste</th><td><details><summary><?php echo count( $log ); ?> righe</summary><pre style="white-space:pre-wrap"><?php echo esc_html( implode( "\n", $log ) ); ?></pre></details></td></tr>
			<?php endif; ?>
		</tbody></table>
		<?php
	}
);
