<?php
/**
 * Potenziamenti SEO/GEO/AEO di 10 articoli (30/10/2026), scelti da Search Console: molte impressioni, posizione
 * 6–18, pochi clic. Ricerche da Ubersuggest (Italia). Niente modifiche al database: i blocchi si aggiungono quando
 * la pagina viene costruita, e restano spegnibili togliendo la voce da questo elenco.
 *
 * Per ogni articolo:
 * - title e description riscritti sulle ricerche per cui la pagina esce già (CTR);
 * - «In breve»: risposta diretta di 40–70 parole in apertura (featured snippet, assistenti AI);
 * - «Aggiornamento»: correzione dei dati superati, quando serve;
 * - domande in più prese dalle ricerche correlate, visibili e nei dati strutturati FAQPage;
 * - link interni verso le pagine collegate (cluster) e data di aggiornamento visibile e in dateModified.
 * Regole: nessun numero inventato, solo funzioni reali di Influencee.
 */

defined( 'ABSPATH' ) || exit;

const INFT_POTENZIATO_IL = '2026-10-30';

function inft_article_potenziamenti() {
	return array(
		'/migliori-app-gestione-follower/' => array(
			'title' => 'App per vedere i follower Instagram: le migliori del 2026',
			'desc'  => 'Le migliori app per vedere e gestire i follower Instagram nel 2026: chi smette di seguirti, follower falsi e crescita, gratis e a pagamento.',
			'breve' => 'Per vedere chi ti segue e chi smette di seguirti su Instagram si usano app di monitoraggio come Followers & Unfollowers o FollowMeter; per statistiche e qualità del pubblico bastano gli Insights di Instagram del profilo professionale. Evita le app che chiedono la password: violano le regole di Instagram e mettono a rischio l’account.',
			'faq'   => array(
				array( 'Come controllare i follower Instagram gratis?', 'Con un profilo professionale (creator o azienda) gli Insights di Instagram mostrano gratis crescita, follower persi e momenti di attività del pubblico. Per sapere chi ha smesso di seguirti servono app di terze parti con piano gratuito, che però vedono solo i cambiamenti successivi all’installazione.' ),
				array( 'Le app per vedere i follower Instagram sono sicure?', 'Sono più sicure quelle che non chiedono la password e usano l’accesso ufficiale di Instagram. Le app che chiedono le credenziali o promettono follower in cambio violano le regole della piattaforma: Instagram può limitare l’account o chiedere di cambiare password.' ),
				array( 'Si può vedere chi visita il proprio profilo Instagram?', 'No. Instagram non mostra chi visita il profilo: lo vedi solo per le storie, nell’elenco delle visualizzazioni. Le app che promettono di mostrare i visitatori del profilo non hanno accesso a questi dati.' ),
			),
			'links' => array(
				array( '/followe-instagram-fake-follower/', 'Come scoprire i follower falsi', 'I segnali per riconoscere un pubblico gonfiato' ),
				array( '/come-calcolare-engagement-rate/', 'Calcola l’engagement rate', 'La formula e le medie per fascia di follower' ),
				array( '/instagram-follower-gratis-perche-evitarli-e-come-crescere-davvero/', 'Follower gratis: perché evitarli', 'Cosa succede al profilo con i follower finti' ),
			),
		),
		'/instagram-follower-gratis-perche-evitarli-e-come-crescere-davvero/' => array(
			'title' => 'Follower Instagram gratis: perché evitarli (e cosa fare)',
			'desc'  => 'Follower Instagram gratis e bot: cosa succede davvero al profilo, i rischi per reach e collaborazioni e come crescere senza follower finti nel 2026.',
			'breve' => 'I servizi di follower Instagram gratis, compresi i bot e le offerte da «500» o «5000 follower gratis», portano account falsi o inattivi: abbassano l’engagement rate, riducono la reach dei post e fanno scartare il profilo dai brand, che controllano la qualità del pubblico. Instagram rimuove periodicamente gli account falsi. Per crescere servono contenuti costanti, reel e collaborazioni.',
			'faq'   => array(
				array( 'Esistono app sicure per avere follower gratis?', 'No. Le app che regalano follower usano account falsi o scambi di follow automatici, vietati dalle regole di Instagram. Spesso chiedono anche la password, con il rischio di perdere l’account. Gli unici follower utili sono quelli che arrivano dai contenuti.' ),
				array( 'Instagram può bloccare l’account se uso bot di follower?', 'Sì. Le regole di Instagram vietano l’acquisto di follower e le attività automatiche: la piattaforma può limitare le funzioni, togliere i follower falsi o, nei casi ripetuti, disattivare l’account.' ),
				array( 'Come capire se un profilo ha follower falsi?', 'Guarda il rapporto tra follower e interazioni, la crescita improvvisa e la qualità dei commenti. Una guida con le soglie da controllare è nella pagina sui fake follower di Influencee.' ),
			),
			'links' => array(
				array( '/followe-instagram-fake-follower/', 'Come scoprire i follower falsi', 'Le soglie da controllare su un profilo' ),
				array( '/come-riconoscere-e-rimuovere-fake-follower/', 'Rimuovere i fake follower', 'Come ripulire il tuo pubblico' ),
				array( '/come-aumentare-il-numero-di-follower-su-instagram-esistono-ancora-i-bot/', 'Crescere su Instagram senza bot', 'Strategie organiche passo per passo' ),
			),
		),
		'/quando-pubblicare-su-instagram-orari-migliori-2025/' => array(
			'title' => 'Quando pubblicare su Instagram: orari migliori 2026',
			'desc'  => 'Qual è l’orario migliore per postare su Instagram nel 2026? Le fasce che funzionano per post, reel e storie e come trovare i tuoi orari con gli Insights.',
			'breve' => 'Non esiste un orario valido per tutti: il momento migliore per pubblicare su Instagram è quando i tuoi follower sono online. Come punto di partenza, nei giorni feriali funzionano spesso la pausa pranzo e la sera dopo il lavoro; poi controlla negli Insights del profilo professionale i momenti di maggiore attività dei follower e pubblica poco prima del picco.',
			'nota'  => 'Aggiornamento 2026: i principi dell’articolo restano validi, ma l’orario pesa meno del contenuto. Instagram distribuisce i reel anche a chi non ti segue e per giorni: conta soprattutto quanto il video viene guardato fino alla fine nelle prime ore.',
			'faq'   => array(
				array( 'Qual è l’orario migliore per pubblicare un reel?', 'Lo stesso dei post: quando il tuo pubblico è più attivo, che vedi negli Insights. I reel però continuano a essere mostrati per giorni, quindi un orario non perfetto si recupera se il video tiene l’attenzione.' ),
				array( 'Meglio pubblicare la mattina o la sera?', 'Dipende dal pubblico: chi lavora in ufficio è più attivo in pausa pranzo e la sera, studenti e genitori in altri momenti. Prova per due o tre settimane fasce diverse e confronta copertura e interazioni.' ),
				array( 'L’orario di pubblicazione conta ancora nel 2026?', 'Sì, ma meno di qualità e formato. Pubblicare quando i follower sono online aiuta a raccogliere le prime interazioni, che spingono la distribuzione del contenuto.' ),
			),
			'links' => array(
				array( '/come-fare-un-piano-editoriale-efficace-guida-pratica-2025/', 'Piano editoriale efficace', 'Organizza cosa e quando pubblicare' ),
				array( '/come-calcolare-engagement-rate/', 'Calcola l’engagement rate', 'Misura se l’orario nuovo funziona' ),
				array( '/hashtag-piu-cercati-su-instagram/', 'Hashtag più cercati su Instagram', 'Le parole chiave delle aziende' ),
			),
		),
		'/i-10-fashion-influencer-piu-seguiti-su-instagram/' => array(
			'title' => 'Fashion influencer più seguiti su Instagram: Italia e mondo',
			'desc'  => 'Chi sono i fashion influencer più seguiti su Instagram in Italia e nel mondo, perché i loro profili crescono e cosa possono imparare brand e creator.',
			'breve' => 'Tra i profili più seguiti su Instagram nella moda ci sono quelli di celebrità internazionali come Kylie Jenner e Kim Kardashian, che uniscono fama e marchi propri; in Italia il nome di riferimento nel fashion è Chiara Ferragni. Il successo di questi profili nasce da identità riconoscibile, pubblicazione costante e collaborazioni scelte con i brand.',
			'nota'  => 'Nota: i numeri di follower citati nell’articolo risalgono all’ultima revisione del testo e cambiano ogni mese; per una campagna controlla sempre i dati aggiornati del profilo.',
			'faq'   => array(
				array( 'Chi è la fashion influencer italiana più seguita?', 'Chiara Ferragni è da anni la fashion influencer italiana più seguita su Instagram. Per una campagna, però, spesso rendono di più profili più piccoli e specializzati, con un pubblico coinvolto e coerente con il brand.' ),
				array( 'Come diventare fashion influencer?', 'Serve uno stile riconoscibile, una nicchia chiara (streetwear, vintage, sostenibile…), pubblicazione costante e foto curate. I consigli pratici sono nella guida di Influencee su come diventare fashion influencer.' ),
				array( 'Come trovare fashion influencer per un brand?', 'Su Influencee puoi cercare creator italiani della categoria moda per città e fascia di follower, vedere i loro numeri e invitarli a una campagna o pubblicare un annuncio.' ),
			),
			'links' => array(
				array( '/fashion-influencers/', 'Fashion influencer italiani', 'Cercali per città e fascia di follower' ),
				array( '/influencer-italiane/', 'Influencer italiane', 'I profili più noti, per settore' ),
				array( '/5-consigli-per-diventare-fashion-influencer/', 'Diventare fashion influencer', '5 consigli pratici' ),
			),
		),
		'/dove-trovare-video-brevi-da-usare-nei-reel/' => array(
			'title' => 'Video per reel gratis: dove trovarli senza copyright',
			'desc'  => 'Dove trovare video brevi e B-roll per reel e TikTok nel 2026: siti gratuiti senza copyright, archivi a pagamento e le regole per usarli senza problemi.',
			'breve' => 'Per trovare video brevi da usare nei reel senza violare il copyright usa archivi di clip con licenza gratuita, come Pexels, Pixabay e Mixkit, oppure archivi a pagamento se ti servono riprese esclusive. Prima di pubblicare controlla sempre la licenza: alcune vietano l’uso pubblicitario, altre chiedono di citare l’autore, e persone o marchi riconoscibili possono richiedere un’autorizzazione.',
			'faq'   => array(
				array( 'I video di Pexels si possono usare nei reel sponsorizzati?', 'La licenza di Pexels permette l’uso gratuito, anche commerciale e senza citare l’autore, ma non consente di rivendere i video così come sono. Per persone, loghi o prodotti riconoscibili nelle clip serve più attenzione in un contenuto pubblicitario.' ),
				array( 'Si possono usare spezzoni di film o serie nei reel?', 'No, senza una licenza sono protetti dal diritto d’autore: Instagram può togliere il contenuto o bloccare l’audio. Usa archivi con licenza o riprese tue.' ),
			),
			'links' => array(
				array( '/contenuti-ugc/', 'Contenuti UGC per il tuo brand', 'Video originali girati dai creator' ),
				array( '/strumenti-di-video-editing-usano-gli-influencer-202/', 'Strumenti di video editing', 'Le app usate dai creator' ),
				array( '/come-creare-contenuti-efficaci-su-tiktok-nel-2025/', 'Contenuti efficaci su TikTok', 'Hook, durata e formati' ),
			),
		),
		'/i-migliori-beauty-influencer-su-instagram/' => array(
			'title' => 'Beauty influencer italiani su Instagram: chi seguire (2026)',
			'desc'  => 'I migliori beauty influencer italiani su Instagram nel 2026 per makeup, skincare e clean beauty: profili, nicchie e come sceglierli per una campagna.',
			'breve' => 'Tra i beauty influencer italiani di riferimento su Instagram ci sono ClioMakeup per il makeup e divulgatori della skincare come Estetica Cinica. Per una campagna contano anche i micro-influencer beauty: meno follower, ma un pubblico più coinvolto e di nicchia, spesso con risultati migliori in rapporto al costo.',
			'faq'   => array(
				array( 'Quanto costa un beauty influencer?', 'Dipende dalla fascia di follower, dal formato e dai diritti d’uso dei contenuti. Per una stima puoi usare il calcolatore gratuito del costo di un influencer di Influencee.' ),
				array( 'Come trovare beauty influencer per il mio brand?', 'Su Influencee cerchi creator beauty italiani per città e fascia di follower, vedi numeri ed engagement di ogni profilo e li inviti a una campagna, oppure pubblichi un annuncio gratuito a cui si candidano.' ),
			),
			'links' => array(
				array( '/beauty-influencers/', 'Beauty influencer italiani', 'Cercali per città e fascia di follower' ),
				array( '/social-media-tool/costo-influencer/', 'Quanto costa un influencer', 'Calcolatore gratuito' ),
				array( '/i-10-fashion-influencer-piu-seguiti-su-instagram/', 'Fashion influencer più seguiti', 'Italia e mondo' ),
			),
		),
		'/i-10-food-influencer-piu-popolari-su-tiktok/' => array(
			'title' => 'Food influencer italiani su TikTok: i 10 più seguiti 2026',
			'desc'  => 'I 10 food influencer italiani più seguiti su TikTok nel 2026: chef, ricette veloci e street food, con i profili e come sceglierli per una campagna food.',
			'breve' => 'I food influencer italiani più popolari su TikTok sono chef e creator di ricette veloci, street food e cucina di casa, che raccontano il cibo in video brevi e riconoscibili. Nell’articolo trovi la classifica dei 10 profili, cosa li distingue e i criteri per scegliere il creator giusto per una campagna food.',
			'faq'   => array(
				array( 'Quanto costa una collaborazione con un food influencer?', 'Dipende da fascia di follower, numero di contenuti e diritti d’uso; per ristoranti e locali funzionano spesso nano e micro creator, anche con ospitalità o cambio merce. Una stima la trovi nel calcolatore del costo di un influencer.' ),
				array( 'Food blogger e food influencer: che differenza c’è?', 'Il food blogger nasce dal blog e dalla scrittura di ricette; il food influencer lavora soprattutto con video e social. Oggi molti fanno entrambe le cose: per una campagna conta su quale piattaforma è più forte il pubblico.' ),
			),
			'links' => array(
				array( '/food-influencers/', 'Food influencer italiani', 'Cercali per città e fascia di follower' ),
				array( '/social-media-tool/costo-influencer/', 'Quanto costa un influencer', 'Calcolatore gratuito' ),
				array( '/come-creare-contenuti-efficaci-su-tiktok-nel-2025/', 'Contenuti efficaci su TikTok', 'Hook, durata e formati' ),
			),
		),
		'/come-guadagnare-con-tiktok-5-modi/' => array(
			'title' => 'Come guadagnare con TikTok nel 2026: i modi che funzionano',
			'desc'  => 'Come guadagnare con TikTok nel 2026: Creator Rewards Program, regali nelle live, collaborazioni con i brand, vendita di prodotti e servizi. Requisiti e consigli.',
			'breve' => 'Su TikTok si guadagna in cinque modi: con il Creator Rewards Program, che paga i video originali più lunghi di un minuto; con i regali durante le live; con le collaborazioni pagate dai brand; vendendo prodotti propri o in affiliazione; offrendo servizi come consulenze. Per la maggior parte dei creator italiani la fonte principale sono le collaborazioni con i brand.',
			'nota'  => 'Aggiornamento 2026: il TikTok Creator Fund citato nell’articolo è stato chiuso e sostituito dal Creator Rewards Program (requisiti principali: almeno 18 anni, 10.000 follower e 100.000 visualizzazioni negli ultimi 30 giorni, video originali oltre il minuto). Il Creator Marketplace è confluito in TikTok One. Controlla in «Strumenti per creator» quali programmi sono attivi in Italia.',
			'faq'   => array(
				array( 'Quanti follower servono per guadagnare su TikTok?', 'Per il Creator Rewards Program ne servono 10.000, insieme a 100.000 visualizzazioni negli ultimi 30 giorni. Per le collaborazioni con i brand non c’è un minimo: molte aziende cercano nano creator con poche migliaia di follower ma un pubblico coinvolto.' ),
				array( 'Quanto paga TikTok per 1.000 visualizzazioni?', 'TikTok non pubblica una tariffa fissa: il compenso del Creator Rewards Program cambia con paese, durata, originalità e coinvolgimento dei video. Per molti creator le collaborazioni con i brand rendono più delle visualizzazioni.' ),
				array( 'Si guadagna guardando video su TikTok?', 'No: TikTok paga chi crea contenuti, non chi li guarda. Diffida di app e siti che promettono soldi per guardare video: spesso servono a raccogliere dati o a far installare altre app.' ),
			),
			'links' => array(
				array( '/offerte-lavoro-influencer/', 'Offerte di lavoro per creator', 'Annunci dei brand con compenso e scadenza' ),
				array( '/diventa-creator/', 'Diventa creator su Influencee', 'Iscrizione gratuita, ricevi proposte dai brand' ),
				array( '/come-guadagnare-con-i-social-media/', 'Guadagnare con i social media', 'Le basi per monetizzare' ),
			),
		),
		'/i-migliori-tech-influencer-da-seguire-su-youtube/' => array(
			'title' => 'Tech YouTuber da seguire nel 2026: i migliori canali',
			'desc'  => 'I migliori tech YouTuber da seguire nel 2026, italiani e internazionali: recensioni hardware, AI, cybersecurity e programmazione, scelti per affidabilità.',
			'breve' => 'I tech influencer su YouTube più affidabili sono quelli che provano i prodotti di persona, spiegano come li testano e dichiarano le collaborazioni pagate. Nell’articolo trovi i canali selezionati per hardware e recensioni, intelligenza artificiale e produttività, cybersecurity e programmazione, con una sezione dedicata ai tech YouTuber italiani.',
			'faq'   => array(
				array( 'Come collaborare con un tech YouTuber?', 'Prepara un brief con prodotto, obiettivo e tempi, lascia libertà sul giudizio e chiedi di dichiarare la collaborazione. Su Influencee puoi cercare creator tech italiani per fascia di follower e invitarli a una campagna.' ),
				array( 'Quanto costa una recensione su YouTube?', 'Dipende da iscritti, visualizzazioni medie, durata del video e diritti d’uso. Per una prima stima usa il calcolatore gratuito del costo di un influencer di Influencee.' ),
			),
			'links' => array(
				array( '/tech-influencers/', 'Tech influencer italiani', 'Cercali per fascia di follower' ),
				array( '/social-media-tool/costo-influencer/', 'Quanto costa un influencer', 'Calcolatore gratuito' ),
				array( '/influencer-marketing-aziende/', 'Influencer marketing per aziende', 'Come lanciare una campagna' ),
			),
		),
		'/come-creare-contenuti-efficaci-su-tiktok-nel-2025/' => array(
			'title' => 'Come creare contenuti efficaci su TikTok: guida pratica',
			'desc'  => 'Come creare contenuti efficaci su TikTok: idee di video, hook nei primi secondi, durata, audio, hashtag e costanza. La guida pratica per creator e brand.',
			'breve' => 'Un contenuto efficace su TikTok aggancia nei primi due o tre secondi, fa capire subito di cosa parla, usa un formato o un audio riconoscibile e ha un solo messaggio. Pubblica con costanza, guarda in Analytics quanta parte del video viene vista e ripeti i formati che tengono l’attenzione più a lungo.',
			'faq'   => array(
				array( 'Quanto deve durare un video TikTok?', 'Quanto serve a dire una cosa sola senza tempi morti. Per la distribuzione conta che il video venga guardato fino alla fine; per il Creator Rewards Program i video devono superare il minuto.' ),
				array( 'Quante volte pubblicare su TikTok?', 'Con una frequenza che riesci a mantenere: la costanza conta più del numero. Meglio tre video curati a settimana che uno al giorno fatto di fretta.' ),
			),
			'links' => array(
				array( '/come-guadagnare-con-tiktok-5-modi/', 'Come guadagnare con TikTok', 'I modi che funzionano nel 2026' ),
				array( '/dove-trovare-video-brevi-da-usare-nei-reel/', 'Video brevi per reel e TikTok', 'Dove trovarli senza copyright' ),
				array( '/contenuti-ugc/', 'Contenuti UGC per il tuo brand', 'Video originali girati dai creator' ),
			),
		),
	);
}

function inft_article_potenziamento( $path ) {
	$all = inft_article_potenziamenti();
	return isset( $all[ $path ] ) ? $all[ $path ] : null;
}

/** Blocco in apertura: «In breve» e, se c'è, la nota di aggiornamento. */
function inft_article_breve_html( $p ) {
	$h = '<aside class="ia-breve" data-section="in_breve"><p class="ia-breve-t">In breve</p><p>' . esc_html( $p['breve'] ) . '</p></aside>';
	if ( ! empty( $p['nota'] ) ) {
		$h .= '<aside class="ia-nota" role="note" data-section="aggiornamento"><p>' . esc_html( $p['nota'] ) . '</p></aside>';
	}
	return $h;
}

/** Blocco «Approfondisci» con i link del cluster. */
function inft_article_links_html( $p ) {
	if ( empty( $p['links'] ) ) {
		return '';
	}
	$h = '<nav class="ia-links" aria-label="Approfondisci" data-section="approfondisci"><p class="ia-breve-t">Approfondisci</p><ul>';
	foreach ( $p['links'] as $l ) {
		$h .= '<li><a href="' . esc_url( home_url( $l[0] ) ) . '"><b>' . esc_html( $l[1] ) . '</b><span>' . esc_html( $l[2] ) . '</span></a></li>';
	}
	return $h . '</ul></nav>';
}
