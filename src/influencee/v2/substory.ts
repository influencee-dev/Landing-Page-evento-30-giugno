/* Testi delle vecchie pagine WordPress delle specialità (Elementor, scansione del 22/10/2026), ripresi così come
   si posizionano su Google: introduzione, «Trova i migliori…», perché collaborare, come scegliere, quanto costa. */

export interface SubStory {
  /** H1 della vecchia pagina (ripreso come etichetta sopra il titolo) */
  h1: string;
  hero: string;
  h2: string;
  intro: string;
  perche: { h: string; intro: string; list: { t: string; x: string }[] };
  come: { h: string; p: string };
  costo: { h: string; p: string };
}

export const SUB_STORY: Record<string, SubStory> = {
  "sport-influencers": {
    "h1": "Influencer Sportivi",
    "hero": "Fai squadra con i migliori talenti dello sport italiano. Collabora con atleti, coach e creator per ispirare performance, promuovere uno stile di vita attivo e associare il tuo brand a valori come disciplina e successo.",
    "h2": "Trova i Migliori Sport Influencer in Italia",
    "intro": "Lo sport è passione, disciplina e performance. Gli Sport Influencer, siano essi atleti professionisti, coach o creator specializzati, incarnano questi valori e li trasmettono a una community di fan e appassionati. Collaborare con loro significa associare il proprio brand a un mondo di energia, determinazione e successo, raggiungendo un pubblico attento alle performance e al benessere fisico.",
    "perche": {
      "h": "Perché collaborare con uno Sport Influencer?",
      "intro": "Un creator specializzato nel mondo dello sport offre opportunità uniche:",
      "list": [
        {
          "t": "Credibilità e Ispirazione",
          "x": "Gli atleti sono un modello di dedizione. Un loro endorsement per un prodotto tecnico, un integratore o un servizio è percepito come una garanzia di qualità e performance."
        },
        {
          "t": "Target Appassionato e Fedele",
          "x": "I fan dello sport seguono i loro idoli con grande passione e si fidano dei loro consigli. Questo crea un canale di marketing diretto ed estremamente efficace."
        },
        {
          "t": "Contenuti Dinamici e Coinvolgenti",
          "x": "Le campagne possono spaziare da tutorial tecnici a \"dietro le quinte\" di allenamenti e competizioni, creando contenuti autentici e ricchi di azione."
        }
      ]
    },
    "come": {
      "h": "Come scegliere lo Sport Influencer giusto",
      "p": "La scelta dipende dalla disciplina sportiva e dai valori che l'atleta rappresenta. È fondamentale che ci sia coerenza tra lo sport praticato (calcio, basket, tennis, sport estremi, etc.) e il target del tuo brand. Piattaforme come Influencee.it sono essenziali per filtrare i profili per disciplina, analizzare le metriche di engagement e trovare l'atleta perfetto per la tua campagna."
    },
    "costo": {
      "h": "Quanto costa uno Sport Influencer?",
      "p": "Il costo di una collaborazione con uno Sport Influencer varia in base alla sua notorietà, ai suoi risultati sportivi e al suo seguito sui social. Le collaborazioni possono includere sponsorizzazioni di maglia, product placement, brand ambassadorship e molto altro. Per una stima precisa, puoi utilizzare il nostro calcolatore di costo influencer qui accanto."
    }
  },
  "model-influencers": {
    "h1": "Influencer Modelle/i",
    "hero": "Dai un volto al tuo brand con i modelli e le modelle più iconici d'Italia. Collabora con professionisti dell'immagine per campagne memorabili e di altissimo impatto visivo.",
    "h2": "Trova i Migliori Model Influencer in Italia",
    "intro": "I Model Influencer rappresentano la perfetta fusione tra la professionalità del mondo della moda e l'autenticità dei social media. Non sono solo volti da copertina, ma creator con un forte personal brand, capaci di influenzare le tendenze e di creare un legame profondo con la propria community. Collaborare con loro significa garantire al proprio brand contenuti di qualità editoriale e, al tempo stesso, una comunicazione credibile e di impatto.",
    "perche": {
      "h": "Perché collaborare con un Model Influencer?",
      "intro": "Un creator che è anche modello/a professionista offre vantaggi unici per una campagna:",
      "list": [
        {
          "t": "Qualità Visiva Superiore",
          "x": "Hanno una profonda conoscenza dell'immagine, sanno come posare e come valorizzare un prodotto, garantendo scatti e video di livello professionale."
        },
        {
          "t": "Credibilità nel Settore Fashion e Beauty",
          "x": "Il loro endorsement è percepito come altamente autorevole. Se un modello/a sceglie di indossare o usare un prodotto, questo acquista immediatamente prestigio."
        },
        {
          "t": "Versatilità",
          "x": "Sono perfetti sia per campagne puramente digitali sia per attività offline come sfilate, eventi e shooting fotografici, offrendo una comunicazione integrata."
        }
      ]
    },
    "come": {
      "h": "Come scegliere il Model Influencer giusto",
      "p": "La scelta del volto giusto è cruciale. Bisogna valutare non solo la sua popolarità, ma anche se la sua immagine e il suo stile personale sono in linea con il target e i valori del brand. È importante analizzare il suo portfolio, le collaborazioni passate e il tipo di messaggio che veicola. Piattaforme come Influencee.it sono lo strumento ideale per trovare il modello o la modella che possa rappresentare al meglio la tua visione."
    },
    "costo": {
      "h": "Quanto costa un Model Influencer?",
      "p": "Il costo di una collaborazione con un Model Influencer dipende da vari fattori, tra cui la sua fama (se è rappresentato da un'agenzia, la sua notorietà internazionale), il suo seguito sui social e l'entità della campagna (numero di contenuti, diritti di utilizzo, esclusiva). Per una stima precisa, puoi utilizzare il nostro calcolatore di costo influencer qui accanto."
    }
  },
  "luxury-influencers": {
    "h1": "Influencer Luxury",
    "hero": "Eleva il tuo brand con i migliori interpreti del lusso. Collabora con creator che incarnano esclusività, raffinatezza e uno stile di vita aspirazionale per raggiungere un pubblico esigente e di alto profilo.",
    "h2": "Trova i Migliori Luxury Influencer in Italia",
    "intro": "Il lusso non è solo un prodotto, è un'esperienza, uno status, un sogno. I Luxury Influencer sono i custodi di questo immaginario: creator che, attraverso uno storytelling impeccabile e un'estetica raffinata, comunicano esclusività e desiderio. Collaborare con loro significa posizionare il proprio brand nell'olimpo dei marchi più ambiti, parlando direttamente a un'audience di consumatori di alto profilo.",
    "perche": {
      "h": "Perché collaborare con un Luxury Influencer?",
      "intro": "Un creator specializzato nel settore del lusso è un asset insostituibile per un brand di alta gamma:",
      "list": [
        {
          "t": "Brand Equity e Prestigio",
          "x": "L'associazione con un volto noto del mondo del lusso trasferisce immediatamente prestigio e desiderabilità al tuo brand."
        },
        {
          "t": "Target Esclusivo",
          "x": "Raggiungono un pubblico con alta capacità di spesa, appassionato di alta moda, gioielleria, orologeria, auto di lusso, viaggi esclusivi e arte."
        },
        {
          "t": "Contenuti Aspirazionali",
          "x": "Creano contenuti che non si limitano a mostrare un prodotto, ma ne raccontano il valore, l'artigianalità e l'unicità, alimentando il desiderio e l'aspirazione."
        }
      ]
    },
    "come": {
      "h": "Come scegliere il Luxury Influencer giusto",
      "p": "La scelta deve essere meticolosa. È cruciale valutare l'allineamento tra l'immagine dell'influencer e il DNA del brand. La sua reputazione, il suo stile personale e il livello di raffinatezza della sua comunicazione devono essere in perfetta sintonia con il posizionamento del marchio. Piattaforme come Influencee.it permettono un'analisi approfondita per individuare il partner perfetto, capace di rappresentare al meglio l'esclusività."
    },
    "costo": {
      "h": "Quanto costa un Luxury Influencer?",
      "p": "Il costo di una collaborazione nel settore lusso è tipicamente elevato e riflette l'esclusività e l'influenza del creator. La fee dipende dalla sua notorietà internazionale, dal tipo di collaborazione (es. brand ambassador, partecipazione a eventi esclusivi) e dai diritti di utilizzo dei contenuti. Per una valutazione precisa, puoi utilizzare il nostro calcolatore di costo influencer qui accanto."
    }
  },
  "wedding-influencers": {
    "h1": "Influencer Wedding",
    "hero": "Rendi indimenticabile il giorno più bello. Collabora con i migliori wedding planner e creator del settore per ispirare le future coppie e posizionare il tuo brand nel cuore di ogni matrimonio da sogno.",
    "h2": "Trova i Migliori Wedding Influencer in Italia",
    "intro": "Il settore del wedding è fatto di sogni, dettagli e emozioni. I Wedding Influencer sono i registi di questi sogni: wedding planner, designer e creator che ispirano e guidano le coppie nell'organizzazione del giorno perfetto. Collaborare con loro significa entrare in contatto con un pubblico altamente targettizzato e in un momento di forte propensione all'acquisto, per tutto ciò che riguarda abiti, location, catering, fiori e viaggi di nozze.",
    "perche": {
      "h": "Perché collaborare con un Wedding Influencer?",
      "intro": "Un creator specializzato nel mondo dei matrimoni è un partner strategico di inestimabile valore:",
      "list": [
        {
          "t": "Autorevolezza e Gusto",
          "x": "Sono professionisti riconosciuti per il loro stile e la loro capacità di creare eventi memorabili. Un loro consiglio è una garanzia di qualità per le coppie."
        },
        {
          "t": "Contenuti Aspirazionali",
          "x": "Creano contenuti visivamente mozzafiato che non solo mostrano un prodotto, ma lo inseriscono in un contesto da favola, aumentandone il valore percepito."
        },
        {
          "t": "Target in Fase di Spesa",
          "x": "Permettono di raggiungere direttamente le coppie di futuri sposi, un pubblico con un budget definito e alla ricerca attiva dei migliori fornitori per il loro evento."
        }
      ]
    },
    "come": {
      "h": "Come scegliere il Wedding Influencer giusto",
      "p": "La scelta del creator ideale dipende dallo stile del tuo brand. C'è chi è specializzato in matrimoni di lusso, chi in eventi country-chic, chi in cerimonie intime e non convenzionali. È fondamentale che lo stile dell'influencer sia in perfetta sintonia con quello del tuo prodotto o servizio. Piattaforme come Influencee.it sono lo strumento perfetto per scoprire i professionisti più adatti a raccontare la tua storia."
    },
    "costo": {
      "h": "Quanto costa un Wedding Influencer?",
      "p": "Il costo di una collaborazione con un Wedding Influencer varia in base alla sua notorietà, al tipo di servizio richiesto (product placement, copertura dell'evento, creazione di contenuti editoriali) e al prestigio della sua firma. Per una stima dettagliata, puoi utilizzare il nostro calcolatore di costo influencer qui accanto."
    }
  },
  "entrepreneur-influencers": {
    "h1": "Influencer Imprenditori",
    "hero": "Connettiti con le menti che guidano il mercato. Scopri la nostra selezione di imprenditori e business leader per associare il tuo brand a valori di successo, innovazione e leadership.",
    "h2": "Trova i Migliori Entrepreneur Influencer in Italia",
    "intro": "Gli Entrepreneur Influencer sono molto più che semplici testimonial. Sono figure di spicco nel mondo del business, fondatori di aziende, investitori e innovatori che hanno costruito un seguito basato sull'autorevolezza e sui risultati concreti. Collaborare con loro significa attingere a una credibilità ineguagliabile e parlare a un pubblico di professionisti, aspiranti imprenditori e decision-maker.",
    "perche": {
      "h": "Perché collaborare con un Entrepreneur Influencer?",
      "intro": "Associare il proprio brand a un imprenditore di successo offre vantaggi strategici unici:",
      "list": [
        {
          "t": "Massima Autorevolezza",
          "x": "Il loro nome è un brand a sé stante, sinonimo di competenza e successo. Un loro endorsement ha un peso specifico enorme."
        },
        {
          "t": "Accesso a un Target Qualificato",
          "x": "La loro community è composta da persone ambiziose, interessate a temi di business, finanza, crescita personale e innovazione."
        },
        {
          "t": "Contenuti Ispirazionali",
          "x": "Creano contenuti che non solo informano, ma motivano e ispirano, associando il tuo brand a una visione di crescita e successo."
        }
      ]
    },
    "come": {
      "h": "Come scegliere l'Entrepreneur Influencer giusto",
      "p": "La scelta deve basarsi su un'attenta valutazione della coerenza tra il settore e i valori dell'imprenditore e quelli del tuo brand. È fondamentale che la partnership appaia autentica e non una semplice transazione commerciale. Analizza la storia dell'imprenditore, il suo stile di comunicazione e la natura della sua community. Piattaforme come Influencee.it sono uno strumento chiave per identificare il business leader più in linea con i tuoi obiettivi."
    },
    "costo": {
      "h": "Quanto costa un Entrepreneur Influencer?",
      "p": "Il valore di una collaborazione con un imprenditore-influencer è spesso elevato e dipende dalla sua notorietà, dal settore in cui opera e dal tipo di attività richiesta (es. keynote speech, brand ambassadorship, consulenza strategica). Per una valutazione dettagliata e trasparente, puoi usare il nostro calcolatore di costo influencer qui accanto."
    }
  },
  "artist-influencer": {
    "h1": "Influencer Artisti",
    "hero": "Dai vita alla tua campagna con i più talentuosi artisti e divulgatori d'arte in Italia. Scopri la nostra selezione di Artist Influencer per dare al tuo brand un tocco di creatività e raggiungere un pubblico appassionato di cultura.",
    "h2": "Trova i Migliori Artist Influencer in Italia",
    "intro": "L'arte è un linguaggio universale e gli Artist Influencer sono i suoi interpreti moderni. Questi creator, che spaziano da pittori e scultori a curatori e divulgatori, offrono ai brand un'opportunità unica per connettersi con un pubblico colto e appassionato. Collaborare con un influencer d'arte significa legare il proprio marchio a valori di creatività, cultura e originalità.",
    "perche": {
      "h": "Perché collaborare con un Artist Influencer?",
      "intro": "Un creator specializzato nel mondo dell'arte può portare un valore inestimabile alla tua strategia di marketing:",
      "list": [
        {
          "t": "Credibilità e Autenticità",
          "x": "Gli artisti e i curatori hanno una profonda conoscenza del loro settore e una community che si fida del loro giudizio e della loro estetica."
        },
        {
          "t": "Target di Nicchia",
          "x": "Raggiungi un'audience specifica di appassionati d'arte, collezionisti, creativi e amanti della cultura, difficilmente intercettabile con i canali tradizionali."
        },
        {
          "t": "Contenuti Visivamente Unici",
          "x": "Le collaborazioni con gli artisti generano contenuti di altissimo impatto visivo, originali e memorabili, che elevano la percezione del tuo brand."
        }
      ]
    },
    "come": {
      "h": "Come scegliere l'Artist Influencer giusto",
      "p": "La scelta del partner creativo ideale dipende dall'allineamento stilistico ed etico con il tuo brand. È fondamentale analizzare il portfolio dell'artista, il suo medium (pittura, street art, arte digitale, fotografia), il tono di voce e l'engagement della sua community. Piattaforme come Influencee.it ti permettono di scoprire e valutare i profili più in linea con la tua visione."
    },
    "costo": {
      "h": "Quanto costa un Artist Influencer?",
      "p": "Il compenso per un Artist Influencer varia in base alla sua notorietà, alla complessità del progetto creativo e all'esclusività richiesta. Per ottenere una stima chiara e su misura per la tua campagna, puoi utilizzare il nostro calcolatore di costo influencer qui accanto."
    }
  }
};
