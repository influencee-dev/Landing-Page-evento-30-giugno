<?php
/**
 * Google Analytics 4 su tutto il sito, con Consent Mode v2 e un banner cookie minimo.
 *
 * - Il tag (gtag.js) si carica su ogni pagina pubblica, non per chi è collegato come redattore o amministratore.
 * - Consent Mode v2: tutto negato all'apertura; con «Accetta» si concede solo analytics_storage (statistiche).
 *   Pubblicità (ad_storage, ad_user_data, ad_personalization) resta negata: il banner non la chiede.
 * - Banner: «Accetta» e «Rifiuta» con lo stesso peso, link alla cookie policy, scelta ricordata 6 mesi
 *   (linee guida del Garante). «Preferenze cookie» nel piè di pagina lo riapre.
 * - Se sul sito c'è già un altro banner che gestisce il consenso, il nostro si spegne dalle impostazioni.
 * - Dominio incrociato con app.influencee.it (linker), così la visita sito → iscrizione resta una sola sessione.
 */

defined( 'ABSPATH' ) || exit;

function inft_ga4_id() {
	$s  = inft_settings();
	$id = strtoupper( trim( (string) $s['ga4_id'] ) );
	return preg_match( '/^G-[A-Z0-9]{4,15}$/', $id ) ? $id : '';
}

/** Il tag va stampato in questa richiesta? */
function inft_ga4_attivo() {
	$s = inft_settings();
	if ( empty( $s['ga4_on'] ) || ! inft_ga4_id() || is_admin() || wp_doing_ajax() || is_feed() || is_embed() ) {
		return false;
	}
	if ( is_user_logged_in() && current_user_can( 'edit_posts' ) ) {
		return false; // niente visite dello staff nei dati
	}
	return (bool) apply_filters( 'inft_ga4_attivo', true );
}

add_action(
	'wp_head',
	function () {
		if ( ! inft_ga4_attivo() ) {
			return;
		}
		$s      = inft_settings();
		$id     = inft_ga4_id();
		$banner = ! empty( $s['ga4_banner'] );
		$domini = array_values( array_unique( array_filter( array( wp_parse_url( home_url(), PHP_URL_HOST ), 'influencee.it', 'app.influencee.it' ) ) ) );
		?>
<script data-inft-ga4>
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
(function(){
  var scelta = (document.cookie.match(/(?:^|; )inft_consenso=(si|no)/) || [])[1];
  gtag('consent', 'default', {
    ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
    analytics_storage: scelta === 'si' ? 'granted' : 'denied',
    functionality_storage: 'granted', security_storage: 'granted',
    wait_for_update: <?php echo $banner ? '0' : '500'; ?>
  });
  gtag('set', 'url_passthrough', true);
})();
gtag('js', new Date());
gtag('config', <?php echo wp_json_encode( $id ); ?>, { linker: { domains: <?php echo wp_json_encode( $domini ); ?> } });
</script>
<script async src="https://www.googletagmanager.com/gtag/js?id=<?php echo rawurlencode( $id ); ?>"></script>
		<?php
	},
	1
);

/* ─── Banner del consenso ─── */

add_action(
	'wp_footer',
	function () {
		$s = inft_settings();
		if ( ! inft_ga4_attivo() || empty( $s['ga4_banner'] ) ) {
			return;
		}
		$policy = home_url( '/cookie-policy/' );
		?>
<div id="inft-cookie" class="inft-cookie" role="dialog" aria-live="polite" aria-label="Preferenze cookie" hidden>
  <p><b>Usiamo i cookie</b> tecnici, necessari al sito, e, solo con il tuo consenso, cookie di statistica (Google Analytics) per capire come viene usato. Puoi cambiare idea quando vuoi da «Preferenze cookie» in fondo alla pagina. <a href="<?php echo esc_url( $policy ); ?>">Cookie policy</a></p>
  <div class="inft-cookie-btn"><button type="button" data-scelta="no">Rifiuta</button><button type="button" data-scelta="si">Accetta</button></div>
</div>
<style>
.inft-cookie{position:fixed;left:16px;right:16px;bottom:16px;z-index:99999;max-width:560px;margin:0 auto;background:#fff;color:#0a0a0a;border-radius:20px;box-shadow:0 20px 50px -20px rgba(0,0,0,.45);padding:18px 20px;font:14px/1.5 Inter,system-ui,sans-serif}
.inft-cookie p{margin:0}.inft-cookie a{color:#e6007e}
.inft-cookie-btn{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:14px}
.inft-cookie-btn button{border:1px solid #0a0a0a;border-radius:999px;background:#fff;color:#0a0a0a;font:600 14px/1 Inter,system-ui,sans-serif;padding:12px;cursor:pointer}
.inft-cookie-btn button:hover{background:#0a0a0a;color:#fff}
</style>
<script>
(function(){
  var b = document.getElementById('inft-cookie'); if (!b) return;
  var c = (document.cookie.match(/(?:^|; )inft_consenso=(si|no)/) || [])[1];
  if (!c) b.hidden = false;
  b.addEventListener('click', function(e){
    var t = e.target.closest('button[data-scelta]'); if (!t) return;
    var si = t.getAttribute('data-scelta') === 'si';
    document.cookie = 'inft_consenso=' + (si ? 'si' : 'no') + ';path=/;max-age=15552000;SameSite=Lax' + (location.protocol === 'https:' ? ';Secure' : '');
    if (typeof gtag === 'function') gtag('consent', 'update', { analytics_storage: si ? 'granted' : 'denied' });
    b.hidden = true;
  });
  // «Preferenze cookie» nel piè di pagina: riapre il banner
  document.addEventListener('click', function(e){
    var a = e.target.closest('a[href="#preferenze-cookie"]'); if (!a) return;
    e.preventDefault(); b.hidden = false;
  });
  var legal = document.querySelector('.it-flegal span:last-child');
  if (legal && !legal.querySelector('a[href="#preferenze-cookie"]')) {
    var l = document.createElement('a'); l.href = '#preferenze-cookie'; l.textContent = 'Preferenze cookie'; legal.appendChild(l);
  }
})();
</script>
		<?php
	},
	5
);
