<?php
/**
 * Percorso dell'utente nei lead di Tandem.
 *
 * Ogni modulo che Tandem raccoglie (form[data-tandem], form.brief-form) riceve un campo in più, «Percorso sul sito»:
 * da dove è arrivato (Google, Google Ads, social, app, diretto, campagna utm), la prima pagina vista, le pagine viste
 * prima di scrivere e quante visite ha fatto. Tandem lo mostra nel lead come gli altri campi.
 * - Le pagine viste si ricordano (localStorage del browser, nessun cookie) solo con il consenso alle statistiche
 *   (cookie inft_consenso=si). Senza consenso il campo dice solo da dove arriva la visita di adesso.
 * - Tandem salta i campi type="hidden": il campo è un input di testo dentro un contenitore nascosto.
 */

defined( 'ABSPATH' ) || exit;

add_action(
	'wp_footer',
	function () {
		if ( is_admin() || is_feed() || is_embed() ) {
			return;
		}
		?>
<script data-inft-percorso>
(function(){
  var K = 'inft_percorso', ok = /(?:^|; )inft_consenso=si/.test(document.cookie), now = Date.now();
  function host(u){ try { return new URL(u).hostname.replace(/^www\./,''); } catch(e){ return ''; } }
  function fonte(){
    var q = new URLSearchParams(location.search), r = host(document.referrer), me = location.hostname.replace(/^www\./,'');
    if (q.get('gclid') || q.get('gbraid') || q.get('wbraid')) return 'Google Ads';
    if (q.get('utm_source')) return 'campagna ' + [q.get('utm_source'), q.get('utm_medium'), q.get('utm_campaign')].filter(Boolean).join(' / ');
    if (q.get('fbclid')) return 'social (Meta)';
    if (!r || r === me) return '';
    if (/(^|\.)google\./.test(r)) return 'Google (ricerca organica)';
    if (/bing\.|duckduckgo\.|yahoo\.|ecosia\./.test(r)) return 'ricerca organica (' + r + ')';
    if (/facebook\.|instagram\.|tiktok\.|linkedin\.|t\.co$|twitter\.|x\.com|youtube\./.test(r)) return 'social (' + r + ')';
    if (/chatgpt\.|openai\.|perplexity\.|gemini\.|copilot\./.test(r)) return 'assistente AI (' + r + ')';
    if (/influencee\.it$/.test(r)) return 'app o sottodominio (' + r + ')';
    return 'link da ' + r;
  }
  var d = null;
  if (ok) { try { d = JSON.parse(localStorage.getItem(K) || 'null'); } catch(e){} }
  var f = fonte();
  if (!d) d = { fonte: f || 'diretto', prima: location.pathname, il: now, visite: 1, ultima: now, pagine: [] };
  if (now - (d.ultima || 0) > 30 * 60 * 1000) { d.visite = (d.visite || 1) + 1; if (f) d.fonte_ultima = f; }
  d.ultima = now;
  var p = d.pagine; if (!p.length || p[p.length - 1] !== location.pathname) p.push(location.pathname);
  if (p.length > 25) d.pagine = p.slice(-25);
  if (ok) { try { localStorage.setItem(K, JSON.stringify(d)); } catch(e){} }
  else { try { localStorage.removeItem(K); } catch(e){} }

  function data(t){ var x = new Date(t); return x.getDate() + '/' + (x.getMonth() + 1) + '/' + x.getFullYear(); }
  function testo(){
    if (!ok) return 'Arrivato da: ' + (f || 'diretto o non indicato') + ' · Pagina del modulo: ' + location.pathname + ' (pagine precedenti non registrate: niente consenso ai cookie di statistica)';
    var s = 'Arrivato da: ' + d.fonte + (d.fonte_ultima && d.fonte_ultima !== d.fonte ? ' (ultima visita: ' + d.fonte_ultima + ')' : '');
    s += ' · Prima pagina: ' + d.prima + ' il ' + data(d.il) + ' · Visite: ' + d.visite;
    s += ' · Pagine viste (' + d.pagine.length + '): ' + d.pagine.join(' → ');
    return s.slice(0, 1900);
  }
  function aggiungi(form){
    var el = form.querySelector('input[name="percorso_sul_sito"]');
    if (!el) {
      var box = document.createElement('div'); box.hidden = true; box.setAttribute('aria-hidden', 'true');
      box.innerHTML = '<label>Percorso sul sito <input type="text" name="percorso_sul_sito" tabindex="-1" autocomplete="off"></label>';
      form.appendChild(box); el = box.querySelector('input');
    }
    el.value = testo();
  }
  function tutti(){ document.querySelectorAll('form[data-tandem], form.brief-form').forEach(aggiungi); }
  tutti();
  // moduli aggiunti dopo (pagine React, finestre) e consenso dato a metà visita
  document.addEventListener('focusin', function(e){ var fm = e.target.closest && e.target.closest('form[data-tandem], form.brief-form'); if (fm) { ok = /(?:^|; )inft_consenso=si/.test(document.cookie); aggiungi(fm); } }, true);
})();
</script>
		<?php
	},
	20
);

/** Dopo l'aggiornamento di un plugin Influencee: cache svuotata, così nessuna pagina resta con il codice vecchio. */
add_action(
	'upgrader_process_complete',
	function ( $upgrader, $extra ) {
		if ( empty( $extra['type'] ) || 'plugin' !== $extra['type'] ) {
			return;
		}
		$files = isset( $extra['plugins'] ) ? (array) $extra['plugins'] : array();
		if ( isset( $upgrader->result['destination_name'] ) ) {
			$files[] = $upgrader->result['destination_name'];
		}
		foreach ( $files as $f ) {
			if ( 0 === strpos( (string) $f, 'influencee-' ) ) {
				inft_purge_cache();
				return;
			}
		}
	},
	10,
	2
);
