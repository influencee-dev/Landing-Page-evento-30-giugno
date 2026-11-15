<?php
/**
 * Guide «Calendario marketing 2027» (15/11/2026). Le pagine le crea il plugin Influencee Guide 2027 (Pagine → Guide 2027)
 * come pagine WordPress con HTML proprio; qui il Core aggiunge solo quello che manca:
 * - title e description per Google (il sito non ha Yoast), og:* e copertina per le anteprime dei link, dal seo.json del plugin;
 * - il modulo prima del download: il pulsante «Scarica il PDF» diventa un modulo (nome, email, azienda) che tandem-forms
 *   raccoglie come lead; dopo l'invio compare il link al PDF. GA4: form_submit + generate_lead (lead_guida_2027_<guida>);
 * - il comando MCP influencee/guide-2027-pubblica (in mcp-server.php).
 * Vale solo per le pagine create da quel plugin (opzione infg27_creati).
 */

defined( 'ABSPATH' ) || exit;

/** Pagine create dal plugin: chiave del seo.json (hub, food, …) → ID. */
function inft_g27_pagine() {
	$c = get_option( 'infg27_creati', array() );
	return isset( $c['pagine'] ) && is_array( $c['pagine'] ) ? array_map( 'intval', $c['pagine'] ) : array();
}

/** Chiave della pagina guida che si sta guardando, o ''. */
function inft_g27_corrente() {
	static $k = null;
	if ( null !== $k ) {
		return $k;
	}
	$k = '';
	// 2.3.17: se la pagina la disegna il Core (template del sito, ex/calendario-2027.tsx) qui non si aggiunge niente
	if ( function_exists( 'inft_current' ) && inft_current() ) {
		return $k;
	}
	if ( did_action( 'wp' ) && is_page() ) {
		$id = (int) get_queried_object_id();
		$f  = array_search( $id, inft_g27_pagine(), true );
		$k  = false === $f ? '' : (string) $f;
	}
	return $k;
}

/** Dati SEO della guida (seo.json del plugin), o null. */
function inft_g27_seo( $chiave ) {
	static $seo = null;
	if ( null === $seo ) {
		$f   = WP_PLUGIN_DIR . '/influencee-guide-2027/seo.json';
		$seo = file_exists( $f ) ? (array) json_decode( (string) file_get_contents( $f ), true ) : array(); // phpcs:ignore WordPress.WP.AlternativeFunctions
	}
	return isset( $seo[ $chiave ] ) ? $seo[ $chiave ] : null;
}

function inft_g27_titolo( $s ) {
	$t = (string) $s['title_seo'];
	return mb_strlen( $t ) > 60 ? trim( preg_replace( '/\s*\|\s*Influencee$/u', '', $t ) ) : $t; // entro 60 caratteri quando si può
}

add_filter(
	'pre_get_document_title',
	function ( $title ) {
		$k = inft_g27_corrente();
		$s = $k ? inft_g27_seo( $k ) : null;
		return $s ? inft_g27_titolo( $s ) : $title;
	},
	99
);

add_action(
	'wp_head',
	function () {
		$k = inft_g27_corrente();
		$s = $k ? inft_g27_seo( $k ) : null;
		if ( ! $s ) {
			return;
		}
		$url = get_permalink();
		$c   = get_option( 'infg27_creati', array() );
		$img = 'hub' === $k ? 'copertina-food.jpg' : 'copertina-' . $k . '.jpg';
		$img = ! empty( $c['media'][ $img ] ) ? wp_get_attachment_url( (int) $c['media'][ $img ] ) : '';
		echo '<meta name="description" content="' . esc_attr( $s['meta'] ) . '" data-inft>' . "\n";
		echo '<meta data-inft property="og:type" content="article"><meta data-inft property="og:locale" content="it_IT"><meta data-inft property="og:site_name" content="Influencee">' . "\n";
		echo '<meta data-inft property="og:title" content="' . esc_attr( inft_g27_titolo( $s ) ) . '"><meta data-inft property="og:description" content="' . esc_attr( $s['meta'] ) . '"><meta data-inft property="og:url" content="' . esc_url( $url ) . '">' . "\n";
		if ( $img ) {
			echo '<meta data-inft property="og:image" content="' . esc_url( $img ) . '"><meta data-inft name="twitter:card" content="summary_large_image"><meta data-inft name="twitter:image" content="' . esc_url( $img ) . '">' . "\n";
		}
	},
	1
);

/* Modulo prima del download */
add_filter(
	'the_content',
	function ( $html ) {
		$k = inft_g27_corrente();
		if ( ! $k || 'hub' === $k || ! in_the_loop() ) {
			return $html;
		}
		$s     = inft_g27_seo( $k );
		$guida = $s ? (string) $s['titolo_pagina'] : 'Guida 2027';
		$form  = substr( 'lead_guida_2027_' . str_replace( '-', '_', $k ), 0, 40 );
		return preg_replace_callback(
			'#<a class="bottone" href="([^"]+\.pdf)" download>([^<]*)</a>#i',
			function ( $m ) use ( $guida, $form, $k ) {
				$id = 'g27-' . $k . '-' . wp_rand( 100, 999 );
				$in = 'display:block;width:100%;box-sizing:border-box;margin:4px 0 10px;padding:11px 14px;border-radius:12px;border:1px solid #d9d9d9;font:inherit;color:#202124;background:#fff';
				return '<div class="g27-scarica" data-inft-track data-page-type="guida_2027" data-section="guida_scarica" style="max-width:460px">'
					. '<form data-tandem="" data-form="' . esc_attr( $form ) . '" name="' . esc_attr( 'Guida PDF: ' . $guida ) . '" data-g27 style="margin:8px 0 0">'
					. '<label for="' . $id . '-n" style="font-size:13px">Nome</label><input id="' . $id . '-n" name="nome" autocomplete="given-name" required style="' . $in . '">'
					. '<label for="' . $id . '-e" style="font-size:13px">Email di lavoro</label><input id="' . $id . '-e" name="email" type="email" autocomplete="email" required style="' . $in . '">'
					. '<label for="' . $id . '-a" style="font-size:13px">Azienda o attività (facoltativo)</label><input id="' . $id . '-a" name="azienda" autocomplete="organization" style="' . $in . '">'
					. '<label for="' . $id . '-g" style="font-size:13px">Guida richiesta</label><input id="' . $id . '-g" name="guida" readonly value="' . esc_attr( $guida ) . '" style="' . $in . ';background:#f1f3f4">'
					. '<label style="display:flex;gap:8px;font-size:12px;margin:2px 0 12px"><input type="checkbox" name="consenso_marketing" value="Sì"> Voglio ricevere le prossime guide e le novità di Influencee (facoltativo)</label>'
					. '<button type="submit" class="bottone" style="border:0;cursor:pointer;font:inherit;font-weight:700">' . esc_html( trim( preg_replace( '/\s*\(.*\)$/', '', $m[2] ) ) ?: 'Scarica il PDF' ) . ' gratis</button>'
					. '<p style="font-size:11px;margin:10px 0 0">Usiamo i tuoi dati per inviarti la guida e, solo se lo scegli, le prossime. <a href="/privacy-policy/">Informativa privacy</a></p>'
					. '</form>'
					. '<p data-g27-ok hidden style="margin:8px 0 0"><b>La tua guida è pronta.</b><br><a class="bottone" href="' . esc_url( $m[1] ) . '" download target="_blank" rel="noopener">' . esc_html( $m[2] ) . '</a></p>'
					. '</div>';
			},
			$html
		);
	},
	99
);

add_action(
	'wp_footer',
	function () {
		if ( ! inft_g27_corrente() || 'hub' === inft_g27_corrente() ) {
			return;
		}
		// tandem-forms legge il modulo dal submit (sendBeacon): qui si evita solo il ricaricamento e si mostra il PDF
		echo "<script>document.addEventListener('submit',function(e){var f=e.target;if(!f||!f.hasAttribute||!f.hasAttribute('data-g27'))return;e.preventDefault();setTimeout(function(){var b=f.parentNode;f.hidden=true;var ok=b.querySelector('[data-g27-ok]');if(ok)ok.hidden=false;},150);});</script>\n";
	},
	99
);

/** Pubblica le pagine create dal plugin (solo quelle). */
function inft_g27_pubblica() {
	$out = array();
	foreach ( inft_g27_pagine() as $k => $id ) {
		$p = get_post( $id );
		if ( ! $p || 'page' !== $p->post_type || 'trash' === $p->post_status ) {
			$out[] = array( 'guida' => $k, 'errore' => 'pagina non trovata' );
			continue;
		}
		if ( 'publish' !== $p->post_status ) {
			$r = wp_update_post( array( 'ID' => $id, 'post_status' => 'publish' ), true );
			if ( is_wp_error( $r ) ) {
				$out[] = array( 'guida' => $k, 'errore' => $r->get_error_message() );
				continue;
			}
		}
		$out[] = array( 'guida' => $k, 'id' => $id, 'stato' => get_post_status( $id ), 'url' => get_permalink( $id ) );
	}
	return $out;
}
