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
			'figura' => array( 'engagement-medio-instagram-fascia-follower.svg', 'Grafico dell’engagement medio su Instagram per fascia di follower: nano 7,7%, micro 4,6%, mid 4,56%, mega 1,61%', 'Engagement medio dei profili italiani su Instagram per fascia di follower. Fonti: ONIM (nano, micro), DeRev (mid, mega); macro interpolato.' ),
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
			'desc'  => 'Come guadagnare con TikTok nel 2026: Creator Rewards Program, regali nelle live, collaborazioni con i brand e vendita di prodotti. Requisiti e consigli.',
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
		// lotto 2 (31/10/2026)
'/guida-completa-che-cosa-fa-un-brand-ambassador/' => array(
			'title' => 'Brand ambassador: cosa fa, quanto guadagna e come diventarlo',
			'desc'  => 'Cosa fa un brand ambassador, quanto guadagna (compenso fisso, variabile, prodotti), la differenza con il brand promoter e come diventarlo da creator.',
			'breve' => 'Un brand ambassador è una persona, spesso un creator, una celebrità o un dipendente, che rappresenta un marchio in modo continuativo: crea contenuti, partecipa a eventi e lanci, risponde al pubblico e porta all’azienda feedback dal mercato. A differenza di una singola sponsorizzazione, il rapporto dura mesi. Il compenso può essere fisso, legato ai risultati (vendite, clic) o in prodotti e benefit.',
			'faq'   => array(
				array( 'Quanto guadagna un brand ambassador?', 'Non esiste uno stipendio standard: dipende da notorietà, pubblico, durata dell’accordo e attività richieste. Di solito si combinano un compenso fisso mensile o annuale, una parte variabile su vendite o clic tracciati e benefit come prodotti e viaggi. Per stimare il valore dei singoli contenuti puoi usare il calcolatore gratuito del costo di un influencer.' ),
				array( 'Che differenza c’è tra brand ambassador e influencer?', 'L’influencer fa spesso collaborazioni singole con marchi diversi; il brand ambassador lega la propria immagine a un marchio per un periodo lungo, spesso con esclusiva nel settore, e lo rappresenta anche a eventi e lanci.' ),
				array( 'Come diventare brand ambassador?', 'Costruisci un profilo coerente in una nicchia, pubblica con costanza, racconta i marchi che usi davvero e prepara un media kit con i tuoi numeri. Su Influencee puoi iscriverti gratis come creator e candidarti agli annunci pubblicati dai brand.' ),
				array( 'Brand ambassador e brand promoter sono la stessa cosa?', 'No. Il brand promoter lavora soprattutto dal vivo, con dimostrazioni nei punti vendita, distribuzione di campioni ed eventi; il brand ambassador rappresenta il marchio nel tempo, soprattutto sui propri canali social.' ),
			),
			'links' => array(
				array( '/diventa-creator/', 'Diventa creator su Influencee', 'Iscrizione gratuita, ricevi proposte dai brand' ),
				array( '/creare-un-media-kit-perfetto-per-influencer-guida-in-5-step/', 'Crea il tuo media kit', 'Il documento da mandare ai brand' ),
				array( '/come-trasformare-clienti-brand-ambassador/', 'Clienti come brand ambassador', 'Il programma ambassador per le aziende' ),
			),
		),
		'/5-consigli-per-diventare-fashion-influencer/' => array(
			'title' => 'Come diventare fashion influencer: 5 consigli pratici',
			'desc'  => 'Come diventare fashion influencer partendo da zero: preparazione, nicchia e stile riconoscibile, tendenze, recensioni ai brand e autenticità. 5 consigli.',
			'breve' => 'Per diventare fashion influencer servono cinque cose: essere pronti a pubblicare con costanza e a investire all’inizio in vestiti, foto e montaggio; trovare una nicchia e uno stile riconoscibili; seguire tendenze e sfilate per commentarle; recensire e taggare i marchi che usi davvero finché non ti notano; restare te stesso. I brand cercano coerenza e un pubblico coinvolto, non solo tanti follower.',
			'faq'   => array(
				array( 'Quanti follower servono per diventare fashion influencer?', 'Non c’è una soglia: anche nano creator con poche migliaia di follower ricevono proposte, se il pubblico è coinvolto e interessato alla moda. Più del numero conta l’engagement rate, che puoi calcolare con lo strumento gratuito di Influencee.' ),
				array( 'Come farsi notare dai brand di moda?', 'Tagga i marchi nei contenuti, prepara un media kit con numeri ed esempi di lavori e candidati alle collaborazioni: su Influencee i brand pubblicano annunci a cui i creator iscritti possono rispondere.' ),
				array( 'Si può essere fashion influencer senza mostrare il volto?', 'Sì: alcuni profili di moda lavorano su outfit, dettagli e accessori senza mostrare il viso, come ricorda l’articolo tra le possibili nicchie. In questo caso lo stile delle foto deve essere ancora più riconoscibile.' ),
			),
			'links' => array(
				array( '/come-diventare-influencer-moda-2024/', 'Chi è un influencer di moda', 'Cosa fa e la differenza con il fashion blogger' ),
				array( '/fashion-influencers/', 'Fashion influencer italiani', 'Cercali per città e fascia di follower' ),
				array( '/offerte-lavoro-influencer/', 'Offerte di lavoro per creator', 'Annunci dei brand con compenso e scadenza' ),
			),
		),
		'/come-funziona-il-pagamento-degli-influencer/' => array(
			'title' => 'Come vengono pagati gli influencer: compensi e modelli',
			'desc'  => 'Come vengono pagati gli influencer: compenso fisso, a risultati o in affiliazione, e cosa alza il prezzo (follower, formato, esclusiva, diritti d’uso).',
			'breve' => 'Gli influencer vengono pagati in tre modi, spesso combinati: con un compenso fisso per i contenuti concordati, con un compenso legato ai risultati (clic, conversioni) oppure con una percentuale sulle vendite tramite codici sconto e link di affiliazione. Il prezzo dipende da numero di follower, engagement, piattaforma e formato, quantità di contenuti, esclusiva e diritti di riutilizzo dei contenuti.',
			'nota'  => 'Nota: la regola dei «100 € ogni 10.000 follower» citata nell’articolo è solo un punto di partenza indicativo. I compensi reali cambiano molto con engagement, formato, settore e diritti d’uso: per una stima sul singolo profilo usa il calcolatore del costo di un influencer.',
			'faq'   => array(
				array( 'Quanto guadagna un influencer al mese?', 'Non esiste uno stipendio medio affidabile: il guadagno dipende da quante collaborazioni chiude, dalla fascia di follower e dalle altre entrate, come affiliazioni e programmi delle piattaforme. Molti creator con pochi follower lavorano con compensi saltuari o in cambio merce.' ),
				array( 'Come si paga un influencer in Italia?', 'Dipende dalla sua posizione fiscale: chi ha partita IVA emette fattura, chi collabora solo in modo saltuario senza partita IVA può farsi pagare con una ricevuta per prestazione occasionale. Per il caso specifico conviene sentire un commercialista.' ),
				array( 'Meglio pagare un influencer a post o in base ai risultati?', 'Il compenso fisso è più semplice e più gradito ai creator; quello a risultati riduce il rischio per il brand, ma richiede link tracciati o codici sconto per misurare clic e vendite. Spesso si usa una base fissa con un bonus legato ai risultati.' ),
				array( 'Lo scambio merce è un pagamento?', 'Sì, è una forma di compenso: l’influencer riceve prodotti o servizi in cambio dei contenuti. Funziona soprattutto con nano e micro creator; va comunque concordato per iscritto cosa pubblicare e quando, e il contenuto va segnalato come collaborazione.' ),
			),
			'links' => array(
				array( '/social-media-tool/costo-influencer/', 'Quanto costa un influencer', 'Calcolatore gratuito' ),
				array( '/funzionalita/link-tracciati/', 'Link tracciati', 'Misura clic e risultati di ogni creator' ),
				array( '/funzionalita/contratto-influencer/', 'Contratto con l’influencer', 'Compenso, contenuti e diritti d’uso per iscritto' ),
			),
		),
		'/come-impostare-una-collaborazione-con-gli-influencer/' => array(
			'title' => 'Collaborazione con influencer: tipi e come impostarla',
			'desc'  => 'Come impostare una collaborazione con un influencer: i tipi di accordo (sponsorizzato, scambio merce, codice sconto, affiliazione), scelta e contratto.',
			'breve' => 'Per impostare una collaborazione con un influencer definisci prima obiettivo e budget, poi scegli il tipo di accordo (contenuto sponsorizzato, scambio merce, codice sconto o affiliazione, takeover, evento), cerca creator con un pubblico coerente e un engagement reale e metti per iscritto contenuti, scadenze, compenso, diritti d’uso ed eventuale esclusiva. Alla fine misura i risultati con link o codici tracciati.',
			'faq'   => array(
				array( 'Come contattare un influencer per una collaborazione?', 'Con un messaggio breve e personale: chi sei, quale prodotto, cosa chiedi (formati, date) e cosa offri. Su Influencee puoi cercare creator italiani per categoria, città e fascia di follower, invitarli a una campagna e parlarne in chat.' ),
				array( 'Cosa scrivere in un contratto con un influencer?', 'Le parti, i contenuti da pubblicare con formati e date, il compenso e i tempi di pagamento, i diritti di riutilizzo dei contenuti, l’eventuale esclusiva e l’obbligo di segnalare la collaborazione come pubblicità.' ),
				array( 'Che differenza c’è tra scambio merce e collaborazione pagata?', 'Nello scambio merce il creator riceve solo il prodotto o il servizio; nella collaborazione pagata riceve anche un compenso. In entrambi i casi il contenuto va dichiarato come collaborazione.' ),
			),
			'links' => array(
				array( '/funzionalita/contratto-influencer/', 'Contratto con l’influencer', 'Termini chiari prima di partire' ),
				array( '/come-funziona-il-pagamento-degli-influencer/', 'Come pagare gli influencer', 'Compenso fisso, a risultati o in affiliazione' ),
				array( '/come-trovare-influencer-per-il-tuo-brand/', 'Trovare l’influencer giusto', 'I criteri per scegliere il creator' ),
			),
		),
		'/come-diventare-influencer-moda-2024/' => array(
			'title' => 'Influencer di moda: chi è, cosa fa e come diventarlo',
			'desc'  => 'Chi è un influencer di moda, cosa fa ogni giorno, che differenza c’è con il fashion blogger e i primi passi per diventarlo e collaborare con i brand.',
			'breve' => 'Un influencer di moda è un creator che pubblica contenuti su abiti, stile e tendenze e, grazie alla fiducia del suo pubblico, ne orienta gli acquisti: propone outfit, recensisce capi, collabora con stilisti e marchi e partecipa a eventi e sfilate. Il fashion blogger nasce invece dal blog e punta soprattutto a informare con articoli e recensioni; oggi molti fanno entrambe le cose.',
			'nota'  => 'Nota: l’articolo è stato scritto nel 2024. Definizioni e consigli restano validi; oggi però molti contenuti di moda passano da video brevi come reel e TikTok, quindi conviene includerli fin dall’inizio.',
			'faq'   => array(
				array( 'Cosa significa fashion blogger?', 'È chi parla di moda soprattutto con articoli e foto su un blog o un sito: recensioni, consigli di stile, opinioni sulle collezioni. Lo scopo principale è informare; l’influenza sugli acquisti viene di conseguenza.' ),
				array( 'Quanto guadagna un influencer di moda?', 'Dipende da fascia di follower, engagement, numero di collaborazioni e diritti d’uso dei contenuti: non esiste una tariffa fissa. Per una stima su un profilo puoi usare il calcolatore gratuito del costo di un influencer di Influencee.' ),
				array( 'Da dove iniziare per diventare influencer di moda?', 'Scegli una nicchia (moda uomo, sostenibile, vintage, plus size…) e uno stile riconoscibile, pubblica con costanza e racconta i marchi che usi davvero. I passi pratici sono nei 5 consigli per diventare fashion influencer.' ),
			),
			'links' => array(
				array( '/5-consigli-per-diventare-fashion-influencer/', 'Diventare fashion influencer', '5 consigli pratici per iniziare' ),
				array( '/fashion-influencers/', 'Fashion influencer italiani', 'Cercali per città e fascia di follower' ),
				array( '/i-10-fashion-influencer-piu-seguiti-su-instagram/', 'Fashion influencer più seguiti', 'Italia e mondo' ),
			),
		),
		'/local-influencer-marketing-per-promuovere-le-imprese-locali/' => array(
			'title' => 'Local influencer: come trovarli per un’attività locale',
			'desc'  => 'Local influencer marketing per negozi, ristoranti e palestre: chi sono i local influencer, i vantaggi, come trovarli in città e impostare la campagna.',
			'breve' => 'I local influencer sono creator seguiti soprattutto da persone di una città o di una zona. Per un’impresa locale, come un ristorante, un negozio o una palestra, sono utili perché parlano proprio ai potenziali clienti, risultano più credibili e in genere costano meno dei profili nazionali. Si trovano con hashtag e luoghi taggati, con il passaparola o con piattaforme che filtrano i creator per città.',
			'faq'   => array(
				array( 'Come trovare influencer nella mia città?', 'Cerca su Instagram e TikTok gli hashtag e i luoghi della tua zona e guarda chi pubblica spesso con buone interazioni. Su Influencee puoi filtrare i creator italiani per città, categoria e fascia di follower e invitarli a una campagna.' ),
				array( 'Quanto costa un influencer locale?', 'Spesso meno di un profilo nazionale, perché ha un pubblico più piccolo; molti accettano anche ospitalità o cambio merce. Per una stima sul singolo profilo usa il calcolatore gratuito del costo di un influencer.' ),
				array( 'Come misurare i risultati con un local influencer?', 'Dai a ogni creator un codice sconto, un link tracciato o un’offerta da chiedere in negozio: così sai quanti clienti arrivano da ciascuno.' ),
			),
			'links' => array(
				array( '/influencer-italiani/', 'Influencer per regione e città', 'Trova i creator della tua zona' ),
				array( '/influencer-marketing-locale/', 'Influencer marketing locale', 'Campagne con creator del territorio' ),
				array( '/funzionalita/link-tracciati/', 'Link tracciati', 'Conta i clienti portati da ogni creator' ),
			),
		),
		'/10-idee-per-gestire-il-tuo-profilo-instagram-in-modo-creativo/' => array(
			'title' => 'Idee post Instagram: 10 format creativi per il profilo',
			'desc'  => 'Idee per post Instagram quando non sai cosa pubblicare: settimane a tema, caroselli, reel a intervista, sondaggi nelle storie, live, feed a blocchi e UGC.',
			'breve' => 'Quando non sai cosa pubblicare su Instagram, alterna format ricorrenti invece di inventare ogni giorno: settimane a tema, dietro le quinte fisso, caroselli che raccontano una storia, collab post, reel a intervista, un consiglio a settimana, sondaggi nelle storie da cui nascono nuovi post, live a cadenza fissa, feed a blocchi tematici e contenuti dei follower. Poi controlla negli Insights cosa funziona.',
			'nota'  => 'Nota: le percentuali dell’articolo (reach, engagement, salvataggi) vengono dall’esperienza diretta con alcuni profili e non sono medie di mercato: usale come riferimento e verifica i tuoi risultati negli Insights.',
			'faq'   => array(
				array( 'Cosa pubblicare su Instagram quando non hai idee?', 'Riprendi le domande ricevute nei commenti e nei messaggi, fai un sondaggio nelle storie, riproponi in un formato nuovo (carosello o reel) un contenuto che era piaciuto oppure racconta il dietro le quinte del tuo lavoro.' ),
				array( 'Quali post pubblicare sul profilo Instagram di un’azienda?', 'Dietro le quinte di prodotto e team, storie di clienti, risposte alle domande frequenti, contenuti dei clienti ripubblicati con il loro permesso e collaborazioni con creator del settore.' ),
				array( 'Come capire quali post funzionano meglio?', 'Negli Insights del profilo professionale confronta copertura, salvataggi, condivisioni e interazioni dei diversi format; per confrontarti con altri profili calcola l’engagement rate.' ),
			),
			'links' => array(
				array( '/come-calcolare-engagement-rate/', 'Calcola l’engagement rate', 'Misura quali format funzionano' ),
				array( '/come-fare-un-piano-editoriale-efficace-guida-pratica-2025/', 'Piano editoriale efficace', 'Organizza i format nella settimana' ),
				array( '/quando-pubblicare-su-instagram-orari-migliori-2025/', 'Quando pubblicare su Instagram', 'Gli orari migliori per post e reel' ),
			),
		),
'/come-guadagnare-con-i-social-media/' => array(
			'title' => 'Come guadagnare con i social: 8 modi per iniziare',
			'desc'  => 'Come guadagnare con i social media: post sponsorizzati, affiliazione, brand ambassador, prodotti propri e webinar. Come iniziare e cosa guardano i brand.',
			'breve' => 'Con i social media si guadagna soprattutto in cinque modi: post e video sponsorizzati dai brand, affiliazione con link o codice sconto, contratti da brand ambassador, vendita di prodotti o servizi propri (corsi, webinar, consulenze) e programmi di monetizzazione delle piattaforme. Per iniziare servono una nicchia chiara, contenuti costanti e un pubblico che interagisce: i brand guardano l’engagement più dei follower.',
			'nota'  => 'Aggiornamento 2026: le tariffe per post e le commissioni di affiliazione citate nell’articolo (Amazon, ASOS) vengono da rilevazioni di qualche anno fa e i programmi cambiano spesso le loro percentuali. Per una stima attuale del compenso usa il calcolatore del costo influencer e controlla le condizioni aggiornate di ogni programma.',
			'faq'   => array(
				array( 'Quanti follower servono per guadagnare sui social?', 'Non c’è una soglia unica. Le collaborazioni con i brand arrivano anche ai profili piccoli, se hanno una nicchia precisa e un pubblico attivo; i programmi di monetizzazione delle piattaforme hanno invece requisiti minimi propri, da controllare nelle impostazioni dell’app.' ),
				array( 'Quale social fa guadagnare di più?', 'Dipende dalla nicchia e dal formato: Instagram e TikTok sono i più usati per le collaborazioni con i brand, YouTube premia anche i video lunghi con le entrate pubblicitarie. Conviene partire dal social dove il tuo pubblico interagisce di più.' ),
				array( 'Come trovare brand che pagano per collaborare?', 'Puoi proporti direttamente ai brand con un media kit oppure usare una piattaforma che raccoglie le offerte. Su Influencee i creator italiani si iscrivono gratis, si candidano agli annunci pubblicati dalle aziende e ne parlano con il brand in chat.' ),
			),
			'links' => array(
				array( '/offerte-lavoro-influencer/', 'Offerte di lavoro per influencer', 'Gli annunci dei brand a cui candidarti' ),
				array( '/social-media-tool/costo-influencer/', 'Quanto vale un tuo post', 'Il calcolatore gratuito del costo influencer' ),
				array( '/come-guadagnare-con-tiktok-5-modi/', 'Come guadagnare con TikTok', 'Programmi e collaborazioni sulla piattaforma' ),
			),
		),
		'/come-calcolare-il-costo-degli-influencer/' => array(
			'figura' => array( 'costo-post-instagram-fascia-follower.svg', 'Grafico del costo medio di un post Instagram in Italia per fascia di follower: nano 200 €, micro 950 €, mid 3.550 €, mega 23.750 €', 'Costo medio di un post Instagram per fascia di follower. Fonte: DeRev; macro stimato. Valori indicativi: il compenso si concorda caso per caso.' ),
			'title' => 'Quanto costa un influencer: come calcolarlo (calcolatore)',
			'desc'  => 'Quanto costa un influencer su Instagram e TikTok? I fattori che fanno il prezzo, le formule di CPM e CPE e il calcolatore gratuito per stimare il compenso.',
			'breve' => 'Il costo di un influencer dipende da cinque fattori: fascia di follower (nano, micro, macro, celebrity), piattaforma, formato del contenuto (storie, post, reel, video), engagement rate e diritti di utilizzo richiesti. Per stimarlo parti dal media kit del creator, confronta il prezzo con il costo per mille visualizzazioni (CPM) e per interazione (CPE) e verifica la cifra con un calcolatore del costo influencer.',
			'faq'   => array(
				array( 'Quanto costa un influencer su Instagram?', 'Non esiste un listino unico: il prezzo cambia con la fascia di follower, il formato (una storia costa meno di un reel) e la nicchia. Per una cifra di partenza inserisci follower ed engagement nel calcolatore gratuito di Influencee, poi confrontala con il media kit del creator.' ),
				array( 'Quanto costa invitare un influencer a un evento?', 'Di solito si paga una fee per la presenza più i contenuti richiesti (storie, reel, post), oltre a viaggio e ospitalità. Conviene mettere per iscritto nel contratto cosa deve pubblicare, entro quando e per quanto tempo il brand può riusare i contenuti.' ),
				array( 'Come si calcola il CPM di un influencer?', 'Dividi il compenso per le visualizzazioni stimate e moltiplica per mille: CPM = costo ÷ visualizzazioni × 1.000. Per il costo per interazione (CPE) dividi il compenso per like, commenti, salvataggi e condivisioni attesi.' ),
			),
			'links' => array(
				array( '/social-media-tool/costo-influencer/', 'Calcola quanto costa un influencer', 'Il calcolatore gratuito per follower ed engagement' ),
				array( '/come-calcolare-engagement-rate/', 'Calcola l’engagement rate', 'Il dato che pesa sul prezzo più dei follower' ),
				array( '/funzionalita/contratto-influencer/', 'Contratto influencer', 'Contenuti, scadenze e diritti di utilizzo per iscritto' ),
			),
		),
		'/come-caricare-reels-da-meta-business-suite/' => array(
			'title' => 'Caricare e programmare reel da Meta Business Suite',
			'desc'  => 'Come pubblicare e programmare reel da Meta Business Suite su Facebook e Instagram, anche in blocco: i passaggi da PC e cosa fare se il reel non parte.',
			'breve' => 'Per caricare un reel da Meta Business Suite apri la suite da computer, scegli la pagina Facebook e il profilo Instagram collegato, clicca su «Crea reel», carica il video, aggiungi didascalia e copertina e scegli se pubblicarlo subito, programmarlo o salvarlo come bozza. Per più video insieme c’è il caricamento in blocco, che permette di preparare e programmare i reel in un’unica sessione.',
			'nota'  => 'Nota: Meta cambia spesso i menu di Business Suite. Se non trovi «Carica reel in blocco» sotto «Altro», cercalo nella sezione Contenuti o nel pulsante di creazione; anche il numero massimo di video caricabili insieme indicato nell’articolo può cambiare. Per le istruzioni aggiornate fai riferimento al Centro assistenza di Meta.',
			'faq'   => array(
				array( 'Si possono programmare i reel di Instagram da Meta Business Suite?', 'Sì, se il profilo Instagram professionale è collegato alla pagina Facebook nella suite. Al momento della pubblicazione scegli «Programma», indica data e ora e il reel compare nel calendario dei contenuti, dove puoi spostarlo o modificarlo.' ),
				array( 'Perché il reel non si pubblica da Meta Business Suite?', 'Le cause più comuni sono un file non adatto (formato, durata o proporzioni diverse dal verticale 9:16), l’account Instagram scollegato o con autorizzazioni scadute e problemi temporanei della piattaforma. Controlla il collegamento degli account nelle impostazioni, ricarica il video e, se l’errore resta, cercalo nel Centro assistenza di Meta.' ),
				array( 'Si può pubblicare lo stesso reel su Facebook e Instagram?', 'Sì: nella schermata di creazione puoi selezionare sia la pagina Facebook sia il profilo Instagram collegato e pubblicare lo stesso reel su entrambi, con la stessa didascalia o adattandola a ciascun canale.' ),
			),
			'links' => array(
				array( '/quando-pubblicare-su-instagram-orari-migliori-2025/', 'Quando pubblicare su Instagram', 'Gli orari in cui programmare i reel' ),
				array( '/come-creare-un-calendario-editoriale-automatizzato/', 'Calendario editoriale automatizzato', 'Organizzare i contenuti di più clienti' ),
				array( '/dove-trovare-video-brevi-da-usare-nei-reel/', 'Video brevi per i reel', 'Dove trovare clip da usare nei contenuti' ),
			),
		),
		'/cosa-usano-i-tiktokers-per-fare-video/' => array(
			'title' => 'Cosa usano i tiktoker per fare video: app e attrezzatura',
			'desc'  => 'Cosa usano i tiktoker per fare video: le app di montaggio (editor di TikTok, CapCut, InShot), smartphone, luce e microfono. Cosa serve per iniziare.',
			'breve' => 'Di solito i tiktoker girano i video con lo smartphone e li montano nell’editor di TikTok o in app come CapCut e InShot, che permettono di tagliare le clip e aggiungere testi, sottotitoli, transizioni e musica. Per migliorare la qualità contano più la luce e l’audio della fotocamera: una luce ad anello o una finestra, un microfono a clip e un treppiede bastano per iniziare.',
			'nota'  => 'Aggiornamento 2026: alcune app dell’elenco non sono più disponibili. Dubsmash è stata chiusa nel 2022; Adobe ha ritirato Premiere Rush (niente nuovi download dal 30 settembre 2025, fine del servizio a settembre 2026) e indica come alternativa l’app Premiere per smartphone. CapCut, InShot e VITA risultano ancora disponibili, insieme all’editor integrato di TikTok.',
			'faq'   => array(
				array( 'Quale app usano i tiktoker per montare i video?', 'Molti usano l’editor interno di TikTok per i video semplici e CapCut, dello stesso gruppo di TikTok, per modelli, sottotitoli automatici e tagli rapidi. InShot è un’alternativa semplice per chi monta dal telefono.' ),
				array( 'Che telefono serve per fare video su TikTok?', 'Basta uno smartphone recente con una buona fotocamera posteriore. Gira in verticale (9:16), con l’obiettivo pulito e alla risoluzione più alta disponibile: la differenza la fanno la luce e l’audio più del modello di telefono.' ),
				array( 'Serve un microfono per i video TikTok?', 'Per i video parlati è l’acquisto più utile: un microfono a clip o wireless collegato al telefono riduce rumori ed eco. Per i video con musica o con la voce registrata a parte se ne può fare a meno.' ),
				array( 'Perché non riesco a fare video su TikTok?', 'Di solito dipende dai permessi: controlla nelle impostazioni del telefono che TikTok possa usare fotocamera e microfono, aggiorna l’app e libera memoria. Se il problema resta, svuota la cache da Impostazioni e privacy, alla voce per liberare spazio.' ),
			),
			'links' => array(
				array( '/come-creare-contenuti-efficaci-su-tiktok-nel-2025/', 'Contenuti efficaci su TikTok', 'Formati, ganci e ritmo dei video' ),
				array( '/tiktok-keyword-tool/', 'Parole chiave per TikTok', 'I tool gratuiti per farti trovare nella ricerca' ),
				array( '/come-diventare-influencer-su-tiktok-nel-2026/', 'Diventare influencer su TikTok', 'Dal primo video alle collaborazioni' ),
			),
		),
		'/tiktok-keyword-tool/' => array(
			'title' => 'TikTok Keyword Tool: come trovare le parole chiave gratis',
			'desc'  => 'Come trovare le parole chiave su TikTok: i tool gratuiti (Creative Center, Keyword Tool, ricerca dell’app) e dove usarle: didascalia, testo e hashtag.',
			'breve' => 'Per trovare le parole chiave su TikTok parti dalla barra di ricerca dell’app: i suggerimenti automatici mostrano cosa cercano gli utenti. Poi controlla la popolarità con TikTok Creative Center (Keyword Insights) o con Keyword Tool, che genera idee dal completamento automatico. Usa la parola chiave principale nella didascalia, nel testo a schermo e, a voce, nei primi secondi del video.',
			'nota'  => 'Nota: i tool di terze parti dell’elenco (Hootsuite, Analisa, TikBuddy, Exolyt, Countik) cambiano spesso funzioni e piani gratuiti: prima di usarli controlla sul sito di ciascuno cosa è ancora gratis. Keyword Insights del Creative Center è pensato soprattutto per chi fa pubblicità su TikTok.',
			'faq'   => array(
				array( 'Come funzionano le parole chiave su TikTok?', 'TikTok usa didascalie, hashtag e testi del video per capire di cosa parla e mostrarlo nelle ricerche e nei feed di chi è interessato all’argomento. Una parola chiave chiara e coerente con il contenuto aiuta il video a comparire quando qualcuno cerca quel tema.' ),
				array( 'Cosa vuol dire «filtra parole chiave» su TikTok?', 'È un’impostazione per chi guarda, non uno strumento SEO: in Impostazioni e privacy, alla voce sulle preferenze dei contenuti, puoi inserire parole che non vuoi vedere e TikTok nasconde dal feed i video che le contengono nella descrizione o negli hashtag.' ),
				array( 'Gli hashtag servono ancora su TikTok?', 'Sì, ma come etichette del tema, non come trucco per la visibilità: bastano pochi hashtag pertinenti insieme a una didascalia descrittiva. Gli hashtag generici molto usati aiutano poco, perché il video compete con un numero enorme di altri contenuti.' ),
			),
			'links' => array(
				array( '/come-creare-contenuti-efficaci-su-tiktok-nel-2025/', 'Contenuti efficaci su TikTok', 'Come costruire video che vengono guardati' ),
				array( '/cosa-usano-i-tiktokers-per-fare-video/', 'Cosa usano i tiktoker', 'App e attrezzatura per girare e montare' ),
				array( '/come-calcolare-engagement-rate/', 'Calcola l’engagement rate', 'Misura se le parole chiave portano interazioni' ),
			),
		),
		'/guida-alla-verifica-su-tiktok-diventa-un-influencer-autentico-e-autorevole/' => array(
			'faq_testo' => false, // le FAQ scritte nell'articolo dicono che la verifica non si può chiedere: smentite dal centro assistenza di TikTok
			'title' => 'Spunta blu TikTok: come ottenere la verifica nel 2026',
			'desc'  => 'Come avere la spunta blu su TikTok: requisiti ufficiali, come fare richiesta dall’app, quanto costa (niente) e cosa fare se la domanda viene rifiutata.',
			'breve' => 'Per avere la spunta blu su TikTok l’account deve essere autentico, attivo, notabile e unico: profilo pubblico e completo, verifica in due passaggi attiva e presenza documentata in più fonti giornalistiche. Il numero di follower non è un requisito. Dove la funzione è disponibile, la richiesta si invia dall’app in Impostazioni e privacy > Account > Verifica, ed è gratuita.',
			'nota'  => 'Aggiornamento 2026: secondo il Centro assistenza di TikTok la verifica si può richiedere dall’app (Profilo > menu > Impostazioni e privacy > Account > Verifica), dove la funzione è attiva, oppure con il modulo online; se la richiesta viene respinta si può ripresentare dopo 30 giorni. Pesi dei segnali, percentuali e caso di studio dell’articolo sono osservazioni dell’autrice, non criteri ufficiali di TikTok.',
			'faq'   => array(
				array( 'Quanto costa la spunta blu su TikTok?', 'Niente: TikTok non fa pagare la verifica e chi vende la spunta blu non ha legami con TikTok. Diffida anche di email e messaggi diretti che ti invitano a fare domanda: TikTok non li invia, tranne che agli account di governi e politici.' ),
				array( 'Cosa significa la spunta blu su TikTok?', 'Indica che TikTok ha confermato che l’account appartiene davvero alla persona, al brand o all’ente che rappresenta. Non premia i numeri e non garantisce più visualizzazioni: serve a distinguere l’account ufficiale dalle imitazioni.' ),
				array( 'Perché non arriva il codice di verifica di TikTok?', 'Quello è il codice per accedere o confermare numero ed email, non la spunta blu. Controlla che numero o indirizzo siano corretti, guarda nello spam, aspetta qualche minuto prima di richiederlo di nuovo e prova l’altro metodo, SMS o email.' ),
			),
			'links' => array(
				array( '/come-diventare-influencer-su-tiktok-nel-2026/', 'Diventare influencer su TikTok', 'Crescere in modo organico nella tua nicchia' ),
				array( '/come-ottenere-la-spunta-blu-su-facebook-guida-completa/', 'Spunta blu su Facebook', 'Come funziona la verifica sui social Meta' ),
				array( '/diventa-creator/', 'Iscriviti come creator', 'Profilo gratuito e candidature agli annunci dei brand' ),
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

/** Grafico con dati veri (file in assets/grafici), con didascalia e fonte. */
function inft_article_figura_html( $p ) {
	if ( empty( $p['figura'] ) ) {
		return '';
	}
	list( $file, $alt, $cap ) = $p['figura'];
	return '<figure class="ia-fig" data-section="grafico"><img src="' . esc_url( INFA_URL . 'assets/grafici/' . $file ) . '" alt="' . esc_attr( $alt ) . '" width="1200" height="675" loading="lazy" decoding="async"><figcaption>' . esc_html( $cap ) . '</figcaption></figure>';
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
