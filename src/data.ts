import { TeamMember, ServiceItem } from './types';

export const TIMELINE_STEPS = [
  {
    time: "18:00",
    title: "1. Accoglienza e aperitivo",
    description: "Arrivo partecipanti, registrazione e primo momento informale con cocktail di benvenuto offerto."
  },
  {
    time: "18:25",
    title: "2. AI live demo",
    description: "Dimostrazione pratica e interattiva dal vivo su come ideare e creare locandine, menu, promo e contenuti in tempo reale."
  },
  {
    time: "19:10",
    title: "3. Metodo Socialee",
    description: "Come inserire e integrare l'AI dentro un processo di comunicazione strutturato, orientato unicamente a portare clienti."
  },
  {
    time: "19:30",
    title: "4. Networking & Domande",
    description: "Confronto guidato tra gli imprenditori, sessione di domande e risposte operative e approfondimento libero."
  }
];

export const PRACTICAL_PROMISES = [
  {
    title: "Locandine promozionali",
    description: "Crea una grafica promozionale di altissimo impatto visivo partendo unicamente da una semplice linea d'offerta o prodotto.",
    icon: "LayoutTemplate"
  },
  {
    title: "Menu e offerte chiare",
    description: "Trasforma un menu confuso, un pacchetto o una promozione del mese in una proposta irresistibile e commerciale.",
    icon: "Menu"
  },
  {
    title: "Promo e testi di vendita",
    description: "Scrivi testi magnetici per i tuoi canali social, campagne WhatsApp, broadcast locali e comunicazioni d'impatto.",
    icon: "MessageSquareCode"
  }
];

export const WHAT_YOU_LEARN = [
  "Creazione rapida di una locandina promozionale da zero.",
  "Scrittura guidata di testi persuasivi per post, caption e notifiche WhatsApp.",
  "Ideazione rapida di promo locali, offerte lampo e promozioni stagionali.",
  "Ottimizzazione di menu fisici, pacchetti e servizi commerciali.",
  "Utilizzo strategico dell'AI per generare ininterrottamente nuove idee di contenuto.",
  "I 3 errori critici da evitare assolutamente quando usi l'AI per comunicare."
];

export const SOCIALEE_SERVICES: ServiceItem[] = [
  {
    titolo: "Strategia social e contenuti",
    descrizione: "Pianificazione strategica e produzione di contenuti che fermano il pollice mentre l'utente scorre."
  },
  {
    titolo: "Campagne Meta & Google Ads",
    descrizione: "Ingegneria pubblicitaria per posizionare le offerte di fronte a un pubblico locale e nazionale profilato."
  },
  {
    titolo: "Landing page & Lead Gen",
    descrizione: "Sistemi completi realizzati per l'acquisizione ordinata di recapiti e contatti pronti ad acquistare."
  },
  {
    titolo: "Marketing automation",
    descrizione: "Automazioni intelligenti per gestire, nutrire e convertire i potenziali contatti commerciali 24 ore su 24."
  },
  {
    titolo: "AI applicata al business",
    descrizione: "Integrazione guidata di strumenti generativi per accelerare i flussi interni e la comunicazione aziendale."
  },
  {
    titolo: "Consulenza strategica",
    descrizione: "Piani commerciali e audit approfonditi pensati per PMI, industrie strutturate e startup ad alta crescita."
  }
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    nome: "GIORGIA PALAZZO",
    ruolo: "FOUNDER & CEO",
    descrizione: "Guida la visione strategica di Socialee, ordinando campagne di marketing e architetture digitali d'impatto.",
    fotoUrl: "/giorgia.png"
  },
  {
    nome: "GIUSEPPE BONACCORSO",
    ruolo: "FOUNDER & CEO",
    descrizione: "Cofondatore e mente strategica, progetta ecosistemi ad alte conversioni per brand e medie imprese selvaggiamente redditizi.",
    fotoUrl: "/giuseppe.png"
  },
  {
    nome: "MANUEL ARLOTTI",
    ruolo: "CO-FOUNDER & COO",
    descrizione: "Coordina le operazioni e l'ingegneria dei processi di Socialee per garantir l'eccellenza esecutiva.",
    fotoUrl: "/manuel.png"
  },
  {
    nome: "NOEMI VITONE",
    ruolo: "SOCIAL MEDIA MANAGER & ACCOUNT",
    descrizione: "Sviluppa formati social magnetici e gestisce le relazioni di account per far crescere la presenza online in modo costante.",
    fotoUrl: "/noemi.png"
  },
  {
    nome: "CARLO BALDASSINI",
    ruolo: "ACCOUNT MANAGER",
    descrizione: "Il punto di contatto strategico per le aziende per coordinare flussi di lavoro, performance e obiettivi commerciali.",
    fotoUrl: "/carlo.png"
  },
  {
    nome: "MARIKA MALASPINA",
    ruolo: "GRAPHIC DESIGNER & PROJECT",
    descrizione: "Dà forma alle idee traducendo concetti in design visivi straordinari, coerenti e ad altissimo impatto estetico.",
    fotoUrl: "/marika.png"
  },
  {
    nome: "SIMONA PANCIA",
    ruolo: "FOTOGRAFA & VIDEOMAKER",
    descrizione: "Cattura l'essenza visiva di brand e prodotti attraverso scatti fotografici iconici e riprese video ad alta carica narrativa.",
    fotoUrl: "/simona.png"
  }
];

export const INITIAL_LEADS = [
  {
    id: "lead-1",
    nome: "Roberto",
    cognome: "Gallo",
    email: "r.gallo@ristoranteilporto.it",
    telefono: "3331234567",
    azienda: "Trattoria Il Porto",
    settore: "Ristorazione",
    citta: "Milano",
    ruolo: "Titolare & Executive Chef",
    miglioramento: "Vorrei automatizzare la creazione delle proposte stagionali e scrivere testi che attirino più milanesi a pranzo.",
    consensoPrivacy: true,
    consensoMarketing: false,
    createdAt: "2026-06-14T10:45:00.000Z",
    status: "confirmed"
  },
  {
    id: "lead-2",
    nome: "Silvia",
    cognome: "Marini",
    email: "silvia@marinibeauty.com",
    telefono: "3499876543",
    azienda: "Marini Centro Estetico",
    settore: "Benessere & Beauty",
    citta: "Torino",
    ruolo: "Fondatrice",
    miglioramento: "Interessata a creare promozionali estetiche per Instagram senza dover pagare un grafico esterno ogni volta.",
    consensoPrivacy: true,
    consensoMarketing: true,
    createdAt: "2026-06-14T15:20:00.000Z",
    status: "pending"
  },
  {
    id: "lead-3",
    nome: "Gianluca",
    cognome: "Ferrari",
    email: "g.ferrari@ferrariconsulting.it",
    telefono: "3201112222",
    azienda: "Ferrari & Partners",
    settore: "Servizi Professionali",
    citta: "Bologna",
    ruolo: "Senior Associate",
    miglioramento: "Capire come sintetizzare report tecnici e usarli per creare locandine o post di alta caratura su LinkedIn.",
    consensoPrivacy: true,
    consensoMarketing: true,
    createdAt: "2026-06-15T08:12:00.000Z",
    status: "pending"
  }
];
