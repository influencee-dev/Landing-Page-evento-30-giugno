import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Check, 
  CheckCircle2, 
  LayoutTemplate, 
  Menu as MenuIcon, 
  MessageSquare, 
  Users, 
  Calendar, 
  MapPin, 
  Clock, 
  Download, 
  Plus, 
  Trash2, 
  X, 
  Key, 
  ShieldCheck, 
  Mail, 
  Phone, 
  ChevronRight, 
  Smartphone, 
  Info,
  CalendarCheck,
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  MoreHorizontal,
  Music
} from 'lucide-react';
import { 
  TIMELINE_STEPS, 
  PRACTICAL_PROMISES, 
  WHAT_YOU_LEARN, 
  SOCIALEE_SERVICES, 
  TEAM_MEMBERS, 
  INITIAL_LEADS 
} from './data';
import { Participant } from './types';
import { LegalModal } from './components/LegalModal';

// Reusable Logo with standard text fallback if image is missing/failing
function Logo() {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <span className="font-display font-black text-2xl tracking-tight text-white select-none">
        SOCIALEE<span className="text-brand-fuchsia font-sans">.</span>
      </span>
    );
  }
  return (
    <img 
      src="/logo.png" 
      alt="SOCIALEE" 
      className="h-8 w-auto object-contain select-none"
      onError={() => {
        setFailed(true);
      }}
    />
  );
}

// Fallback images for team members when their local custom assets are not yet on GitHub
function getFallbackImage(fotoUrl: string) {
  switch (fotoUrl) {
    case '/giorgia.png':
      return "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&h=400&fit=crop";
    case '/giuseppe.png':
      return "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&h=400&fit=crop";
    case '/manuel.png':
      return "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&h=400&fit=crop";
    case '/noemi.png':
      return "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?q=80&w=400&h=400&fit=crop";
    case '/carlo.png':
      return "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&h=400&fit=crop";
    case '/marika.png':
      return "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&h=400&fit=crop";
    case '/simona.png':
      return "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=400&h=400&fit=crop";
    default:
      return "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=400&h=400&fit=crop";
  }
}

export default function App() {
  // Mobile menu visibility
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Legal Modals state
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalModalType, setLegalModalType] = useState<'privacy' | 'cookie' | 'terms'>('privacy');
  
  // Registration form states
  const [formData, setFormData] = useState({
    nome: '',
    cognome: '',
    email: '',
    telefono: '',
    azienda: '',
    settore: 'Ristorazione',
    citta: '',
    ruolo: '',
    miglioramento: '',
    consensoPrivacy: false,
    consensoMarketing: false
  });
  
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Registrants database (stored in localStorage)
  const [leads, setLeads] = useState<Participant[]>([]);
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminError, setAdminError] = useState('');

  // Interactive AI Live Playground State
  const [activePlaygroundTab, setActivePlaygroundTab] = useState<'locandine' | 'menu' | 'promo'>('locandine');
  const [selectedPlaygroundIndustry, setSelectedPlaygroundIndustry] = useState<'ristoranti' | 'beauty' | 'retail' | 'professionisti'>('ristoranti');
  const [playgroundSimulating, setPlaygroundSimulating] = useState(false);
  const [simulatedProgress, setSimulatedProgress] = useState(100);

  // Load leads from localStorage or seed with default leads
  useEffect(() => {
    const stored = localStorage.getItem('socialee_ai_leads');
    if (stored) {
      try {
        setLeads(JSON.parse(stored));
      } catch (e) {
        setLeads(INITIAL_LEADS as Participant[]);
      }
    } else {
      setLeads(INITIAL_LEADS as Participant[]);
      localStorage.setItem('socialee_ai_leads', JSON.stringify(INITIAL_LEADS));
    }
  }, []);

  // Update leads database
  const saveLeadsToStorage = (updatedLeads: Participant[]) => {
    setLeads(updatedLeads);
    localStorage.setItem('socialee_ai_leads', JSON.stringify(updatedLeads));
  };

  // Switch industries in playround with a loading micro-effect
  const handlePlaygroundIndustryChange = (ind: 'ristoranti' | 'beauty' | 'retail' | 'professionisti') => {
    setPlaygroundSimulating(true);
    setSimulatedProgress(0);
    setSelectedPlaygroundIndustry(ind);
    
    // Simulate generation loading state
    const interval = setInterval(() => {
      setSimulatedProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setPlaygroundSimulating(false);
          return 100;
        }
        return prev + 20;
      });
    }, 80);
  };

  // Submit registration form
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.nome || !formData.cognome || !formData.email || !formData.telefono || !formData.azienda || !formData.citta || !formData.ruolo) {
      setErrorMsg('Per favore, compila tutti i campi obbligatori.');
      return;
    }

    if (!formData.consensoPrivacy) {
      setErrorMsg('Devi acconsentire al trattamento dei dati personali per registrarti.');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMsg('Inserisci un indirizzo email valido.');
      return;
    }

    const newLead: Participant = {
      id: 'lead-' + Date.now(),
      nome: formData.nome,
      cognome: formData.cognome,
      email: formData.email,
      telefono: formData.telefono,
      azienda: formData.azienda,
      settore: formData.settore,
      citta: formData.citta,
      ruolo: formData.ruolo,
      miglioramento: formData.miglioramento,
      consensoPrivacy: formData.consensoPrivacy,
      consensoMarketing: formData.consensoMarketing,
      createdAt: new Date().toISOString(),
      status: 'pending' // Defaults to pending approval
    };

    const updated = [newLead, ...leads];
    saveLeadsToStorage(updated);
    setFormSubmitted(true);
  };

  // Admin section: Login
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === 'socialee2026' || adminPassword === 'ai' || adminPassword === 'admin') {
      setIsAdminAuthenticated(true);
      setAdminError('');
    } else {
      setAdminError('Password non corretta. Utilizza "socialee2026" o "admin".');
    }
  };

  // Admin section: Update lead status
  const updateLeadStatus = (id: string, newStatus: 'confirmed' | 'cancelled' | 'pending') => {
    const updated = leads.map(l => {
      if (l.id === id) {
        return { ...l, status: newStatus };
      }
      return l;
    });
    saveLeadsToStorage(updated);
  };

  // Admin section: Delete lead
  const deleteLead = (id: string) => {
    if (window.confirm('Sei sicuro di voler eliminare questa registrazione?')) {
      const updated = leads.filter(l => l.id !== id);
      saveLeadsToStorage(updated);
    }
  };

  // Admin section: Add sample lead
  const addSampleLead = () => {
    const sectors = ['Ristorazione', 'Servizi', 'Beauty', 'Negozi'];
    const cities = ['Milano', 'Roma', 'Bologna', 'Firenze'];
    const names = ['Claudio', 'Sabrina', 'Mario', 'Franca'];
    const surnames = ['Neri', 'Russo', 'Galli', 'Esposito'];
    const companies = ['Bistrot 19', 'Estetica Solar', 'Nero Moda', 'Studio Valori'];
    const roles = ['Titolare', 'Direttore', 'Amministratore', 'CEO'];

    const randIdx = Math.floor(Math.random() * 4);
    
    const sample: Participant = {
      id: 'lead-' + Date.now(),
      nome: names[randIdx],
      cognome: surnames[(randIdx + 1) % 4],
      email: `${names[randIdx].toLowerCase()}.${surnames[(randIdx + 1) % 4].toLowerCase()}@example.com`,
      telefono: '339' + Math.floor(1000000 + Math.random() * 9000000),
      azienda: companies[randIdx],
      settore: sectors[randIdx],
      citta: cities[randIdx],
      ruolo: roles[randIdx],
      miglioramento: 'Migliorare l\'acquisizione di clienti locali tramite automazioni integrate.',
      consensoPrivacy: true,
      consensoMarketing: true,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };

    saveLeadsToStorage([sample, ...leads]);
  };

  // Admin section: Export CSV
  const exportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Nome,Cognome,Email,Telefono,Azienda,Settore,Citta,Ruolo,Miglioramento,Stato,Data\n";
    
    leads.forEach(l => {
      const row = [
        l.nome,
        l.cognome,
        l.email,
        l.telefono,
        l.azienda,
        l.settore,
        l.citta,
        l.ruolo,
        (l.miglioramento || '').replace(/,/g, ';'),
        l.status,
        l.createdAt
      ].join(",");
      csvContent += row + "\n";
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `socialee_leads_aperitivo_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Interactive Playground content map
  const PLAYGROUND_CONTENT = {
    ristoranti: {
      locandine: {
        headline: "SERATA AI DEGUSTAZIONE",
        sub: "MASTERY CHEFS MEETS GEN AI",
        tag: "BISTROT 19",
        body: "Un menu a 4 portate dove l'accostamento di sapori è stato co-progettato con algoritmi predittivi per esaltare ogni sfumatura di gusto.",
        promos: "Giovedì 25 Giugno | Ore 20:30 | Solo 25 Posti",
        visualText: "MENU FUTURISTA"
      },
      menu: {
        title: "MENU DEGUSTAZIONE SPERIMENTALE",
        items: [
          { name: "Sintesi di Mare", desc: "Carpaccio cotto a freddo con emulsione all'alga spirulina marina ottimizzata per consistenza." },
          { name: "Raviolo Predittivo", desc: "Ravioli ripieni di brasato con riduzione al passito di Pantelleria, dosato tramite bilanciamento sensoriale AI." },
          { name: "Evoluzione Carbonara", desc: "Crema d'uovo cotta a bassa temperatura con guanciale croccante disidratato e pepe nero di Szechuan." }
        ],
        footer: "Prezzo combinato: 55 Euro - Bevande escluse"
      },
      promo: {
        title: "WhatsApp Broadcast per Ristoranti",
        text: `Ciao [Nome]! Giovedì sera organizziamo un evento esclusivo al Bistrot: la prima Serata Degustazione AI. 4 portate sbalorditive i cui accostamenti sono stati raffinati usando l'intelligenza artificiale per amplificare le note aromatiche.

Coperti strettamente limitati a 25 ospiti.
Ti va se ti riservo un tavolo prima di pubblicarlo sui social? Scrivimi subito se ci sei!`
      }
    },
    beauty: {
      locandine: {
        headline: "REVOLUTIONARY SKIN CARE",
        sub: "OPEN DAY RIGENERAZIONE CELLULARE",
        tag: "ESTETICA SOLAR",
        body: "Una diagnosi d'avanguardia con scanner molecolare guidato dall'AI. Scopri il piano protocollare esatto per cancellare le imperfezioni cutanee.",
        promos: "Sabato 27 Giugno | Diagnosi Gratuita su Prenotazione",
        visualText: "GLOW PROTOCOL"
      },
      menu: {
        title: "LISTINO TRATTAMENTI TECNOLOGICI",
        items: [
          { name: "AI Skin Analysis", desc: "Mappatura ottica istantanea dello strato dermico per calcolare l'idratazione e rilevare micro-rughe nascoste." },
          { name: "Glow Cell Therapy", desc: "Trattamento biostimolante con ultrasuoni focalizzati sincronizzati sui ritmi biologici individuali." },
          { name: "Detox Molecolare", desc: "Maschera ai carboni attivi con infusione personalizzata di vitamine basata sul report del test preliminare." }
        ],
        footer: "Trattamento di prova da 49 Euro invece di 90"
      },
      promo: {
        title: "WhatsApp Broadcast per Centri Estetici",
        text: `Ciao [Nome], novità importante in salone! Sabato 27 organizziamo l'Open Day Skin Revolution. 

Utilizzeremo un nuovo sistema di mappatura dermica ad intelligenza artificiale per analizzare la tua pelle in profondità e darti la ricetta esatta per un viso radioso ed idratato quest'estate.

Il test di 15 minuti è gratuito invece di 45€, ma ho solo 12 slot liberi in giornata. Ti blocco una fascia oraria prima che finiscano?`
      }
    },
    retail: {
      locandine: {
        headline: "COMMUNITY FLASH SALE",
        sub: "FINO AL 40% DI SCONTO AGGIUNTIVO",
        tag: "NERO MODA",
        body: "Accesso privato esclusivo alla collezione estiva prima dei saldi nazionali. Scopri le combinazioni d'abbigliamento create con l'algoritmo di stile.",
        promos: "Venerdì e Sabato | Solo per iscritti al Canale Privato",
        visualText: "SECRET DROP"
      },
      menu: {
        title: "COUPON & PACCHETTI STYLE",
        items: [
          { name: "Summer Capsule", desc: "Selezione di 5 capi coordinabili progettati per creare fino a 12 combinazioni diverse per il viaggio." },
          { name: "Accessorio Smart", desc: "Acquista un vestito e l'algoritmo calcola l'abbinamento scarpa/borsa ideale con il 30% di sconto fisso." },
          { name: "Style Optimizer Ticket", desc: "Consulenza d'immagine istantanea basata sulle proporzioni corporee caricate in telecamera." }
        ],
        footer: "Disponibile solo in negozio fino a fine stock"
      },
      promo: {
        title: "WhatsApp Broadcast per Abbigliamento/Negozi",
        text: `Ciao [Nome], ti va un accesso privilegiato? Questo weekend lanciamo il Flash Sale Privato da Nero Moda prima dell'inizio dei saldi pubblici. 

Mostrando questo messaggio alla cassa avrai subito fino al 40% di sconto su tutta la collezione estiva selezionata e sui pacchetti Capsule consigliati.

Ci vediamo in negozio Venerdì o Sabato! Vuoi che ti mandi la lista dei brand inclusi in anteprima?`
      }
    },
    professionisti: {
      locandine: {
        headline: "IMPRESA SCALABILE 2026",
        sub: "MASTERCLASS DI EFFICIENZA COMMERCIALE",
        tag: "STUDIO VALORI",
        body: "Come tagliare il 30% del tempo sprecato in task ripetitivi e raddoppiare la pipeline di vendita strutturando risposte e flussi con l'AI.",
        promos: "Lunedì 6 Luglio | Ore 15:00 | Webinar Interattivo Gratuito",
        visualText: "LEAD ACCELERATOR"
      },
      menu: {
        title: "PROGRAMMA CONSULENZIALE E RETOUR",
        items: [
          { name: "Audit AI Readiness", desc: "Analisi dettagliata di come la tua impresa gestisce lead, email, database e testi commerciali." },
          { name: "Funnel Automator", desc: "Costruzione della tua prima landing page e sistema di mail marketing automatizzato che risponde in 45 secondi." },
          { name: "CRM AI Co-pilot", desc: "Integrazione dei sistemi di riassunto telefonate e generazione offerte automatica a fine chiamata." }
        ],
        footer: "Riservato ad attività con un fatturato superiore a 100k"
      },
      promo: {
        title: "LinkedIn/WhatsApp Direct Outreach",
        text: `Gentile [Nome], ho visto il costante sviluppo di [Nome Azienda] nel vostro settore.

Molti imprenditori oggi sprecano ore preziose dei collaboratori a inseguire risposte email e montare preventivi lenti. Lunedì 6 terremo un briefing operativo mostrando in diretta come impostare un assistente documentale che riduce questi tempi morti del 30%.

Iscrizione senza costi ma selettiva per soli 40 professionisti. Può interessarle ricevere l'invito privato? Un cordiale saluto.`
      }
    }
  };

  const activeContent = PLAYGROUND_CONTENT[selectedPlaygroundIndustry];

  const confirmedLeadsCount = leads.filter(l => l.status === 'confirmed').length;
  // Progress calculating towards 100 (capacity)
  const registrationProgress = Math.min(Math.round(((leads.length + 61) / 100) * 100), 100);

  return (
    <div className="font-sans bg-black text-white min-h-screen selection:bg-brand-fuchsia selection:text-white overflow-x-hidden">
      
      {/* GLOW DECORATIONS */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-brand-fuchsia/15 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute top-[40%] right-0 w-[400px] h-[400px] bg-brand-fuchsia/10 rounded-full blur-[140px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[10%] left-[-100px] w-[500px] h-[500px] bg-brand-fuchsia/15 rounded-full blur-[150px] pointer-events-none z-0"></div>

      {/* HEADER SECTION */}
      <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-sm border-b-2 border-zinc-900 px-4 py-3 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo Brand Socialee */}
          <a href="#" className="flex items-center gap-1.5 select-none text-white">
            <Logo />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-mono tracking-wider uppercase">
            <a href="#non-corso" className="text-zinc-400 hover:text-white transition-colors">Chi Siamo</a>
            <a href="#cosa-impari" className="text-zinc-400 hover:text-white transition-colors">Cosa Impari</a>
            <a href="#programma" className="text-zinc-400 hover:text-white transition-colors">Programma Evento</a>
            <a href="#team" className="text-zinc-400 hover:text-white transition-colors">Team Socialee</a>
            <a href="#registrati" className="text-zinc-400 hover:text-white transition-colors">Registrati</a>
          </nav>

          {/* Header CTA Button */}
          <div className="flex items-center gap-4">
            <a 
              href="#registrati" 
              className="bg-brand-fuchsia hover:bg-brand-fuchsia/90 text-white text-xs font-display font-bold uppercase tracking-wider px-4 py-2 border-2 border-brand-fuchsia hover:border-white transition-all transform hover:-translate-y-0.5 shadow-md active:translate-y-0 select-none block"
            >
              Prenota il tuo posto
            </a>

            {/* Mobile menu toggle */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="md:hidden text-zinc-400 hover:text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              <MenuIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-zinc-900 flex flex-col gap-3 font-mono text-xs tracking-wider uppercase pb-2">
            <a 
              href="#non-corso" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-zinc-400 hover:text-white py-1 transition-colors"
            >
              Chi Siamo
            </a>
            <a 
              href="#cosa-impari" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-zinc-400 hover:text-white py-1 transition-colors"
            >
              Cosa Impari
            </a>
            <a 
              href="#programma" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-zinc-400 hover:text-white py-1 transition-colors"
            >
              Programma Evento
            </a>
            <a 
              href="#team" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-zinc-400 hover:text-white py-1 transition-colors"
            >
              Team Socialee
            </a>
            <a 
              href="#registrati" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-brand-fuchsia font-bold py-1 transition-colors"
            >
              Registrati ora
            </a>
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 px-4 sm:px-8 max-w-7xl mx-auto z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column Text & CTAs */}
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          
          <span className="bg-brand-fuchsia text-black font-display font-extrabold text-[10px] tracking-widest uppercase px-3 py-1 mb-6 border border-brand-fuchsia">
            EVENTO GRATUITO IN PRESENZA PER IMPRENDITORI
          </span>

          <h1 className="font-display font-black text-5xl sm:text-7xl lg:text-8xl tracking-tight leading-none text-white uppercase mb-5">
            A(I)<span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-brand-fuchsia">PERITIVO</span>.
          </h1>

          <p className="font-display text-xl sm:text-2xl font-bold tracking-tight text-white mb-4">
            In 60 minuti scopri come usare l’intelligenza artificiale per creare locandine, menu, promo, contenuti social e materiali utili per vendere meglio la tua attività.
          </p>

          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed mb-8 max-w-xl">
            Un evento pratico, gratuito e a posti limitati, pensato per imprenditori, commercianti, ristoratori, PMI, professionisti e startup che desiderano inserire strumenti digitali avanzati nel lavoro quotidiano senza complicazioni tecniche.
          </p>

          {/* Call To Actions */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-8">
            <a 
              href="#registrati" 
              className="bg-brand-fuchsia hover:bg-black text-black hover:text-brand-fuchsia font-display font-black text-sm uppercase tracking-wider px-8 py-4.5 border-2 border-brand-fuchsia transition-all text-center flex items-center justify-center gap-2 block shadow-[5px_5px_0px_0px_rgba(255,0,255,0.3)] hover:shadow-none"
            >
              Prenota il tuo posto gratuito
              <ArrowRight className="w-4 h-4" />
            </a>

            <a 
              href="#cosa-impari" 
              className="bg-zinc-950 hover:bg-white text-white hover:text-black font-display font-bold text-sm uppercase tracking-wider px-8 py-4.5 border-2 border-zinc-800 hover:border-white transition-all text-center block"
            >
              Scopri cosa imparerai
            </a>
          </div>

          {/* Quick info badges row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full border-t border-zinc-900 pt-6">
            <div className="flex items-center gap-2.5">
              <Clock className="w-5 h-5 text-brand-fuchsia shrink-0" />
              <div>
                <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Durata</p>
                <p className="text-xs font-bold text-zinc-200">60 Minuti AI Live</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <MapPin className="w-5 h-5 text-brand-fuchsia shrink-0" />
              <div>
                <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Luogo</p>
                <p className="text-xs font-bold text-zinc-200">Via Trinitapoli 24, Foggia</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Users className="w-5 h-5 text-brand-fuchsia shrink-0" />
              <div>
                <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Posti</p>
                <p className="text-xs font-bold text-zinc-200">Massimo 100 Persone</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-brand-fuchsia shrink-0" />
              <div>
                <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Aperitivo</p>
                <p className="text-xs font-bold text-zinc-200">Incluso &amp; Offerto</p>
              </div>
            </div>
          </div>

          <p className="text-zinc-500 font-mono text-[10px] mt-4 uppercase tracking-wider">
            Ingresso gratuito con registrazione obbligatoria • Extra drink in convenzione: 5 Euro
          </p>
        </div>

        {/* Right Column Neon Manifesto Card */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <div className="relative group w-full max-w-sm">
            {/* Background Glow */}
            <div className="absolute -inset-1.5 bg-brand-fuchsia rounded-none blur opacity-40 group-hover:opacity-70 transition duration-1000 group-hover:duration-200"></div>
            
            {/* Massive Black Ticket Card */}
            <div className="relative bg-zinc-950 border-2 border-brand-fuchsia p-6 sm:p-8 flex flex-col justify-between min-h-[460px] select-none text-left shadow-2xl">
              
              {/* Card Header decoration */}
              <div className="flex justify-between items-start border-b-2 border-zinc-900 pb-4">
                <span className="font-mono text-[11px] text-zinc-500 tracking-wider">SOCIAL MEDIA TECH</span>
                <span className="font-mono text-[10px] text-brand-fuchsia bg-brand-fuchsia/10 border border-brand-fuchsia/40 px-2 py-0.5">INGRESSO PASS</span>
              </div>

              {/* Central Title Statement */}
              <div className="my-5 flex flex-col gap-2 font-display">
                <p className="text-4xl sm:text-5xl font-black text-brand-fuchsia tracking-tight leading-none uppercase m-0">60 MINUTI.</p>
                <p className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-none uppercase m-0">AI LIVE.</p>
                <p className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-none uppercase m-0">A(I)PERITIVO.</p>
                <p className="text-4xl sm:text-5xl font-black text-brand-fuchsia tracking-tight leading-none uppercase m-0">NETWORKING.</p>
              </div>

              {/* Card Footer */}
              <div className="border-t-2 border-zinc-900 pt-4 flex items-center justify-between">
                <div>
                  <p className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">Disponibilità</p>
                  <p className="font-display font-extrabold text-sm text-white tracking-tight uppercase">POSTI LIMITATI</p>
                </div>
                {/* Simulated barcode */}
                <div className="flex gap-0.5 items-center h-8">
                  <div className="w-1 h-full bg-white"></div>
                  <div className="w-0.5 h-full bg-white"></div>
                  <div className="w-1.5 h-full bg-white"></div>
                  <div className="w-0.5 h-full bg-white"></div>
                  <div className="w-2 h-full bg-white"></div>
                  <div className="w-1 h-full bg-white"></div>
                  <div className="w-0.5 h-full bg-white"></div>
                  <div className="w-1.5 h-full bg-white"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* SECTION 3 — WHITE ROW: PROMESSA PRATICA & INTERACTIVE SIMULATOR */}
      <section id="non-corso" className="bg-white text-zinc-900 py-20 px-4 sm:px-8 border-t-4 border-brand-fuchsia">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-brand-fuchsia font-display font-black text-xs uppercase tracking-widest block mb-3">
              NON IL SOLITO CORSO SULL'AI
            </span>
            <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-none text-black uppercase mb-6">
              TI FACCIAMO VEDERE COME USARLA DAVVERO NELLA TUA ATTIVITÀ.
            </h2>
            <p className="text-zinc-600 text-base sm:text-lg leading-relaxed">
              Durante l'evento vedrai esempi strategici e dimostrazioni dal vivo su come trasformare poche informazioni grezze in materiali promozionali finiti. Non parleremo in modo astratto: useremo l'AI per generare strumenti utili a chi ogni giorno deve promuovere e vendere.
            </p>
          </div>

          {/* Three columns descriptive cards - Styled as interactive "Social Reels" */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            
            {/* Card 1: Locandine d'impatto */}
            <div className="group relative overflow-hidden bg-black border-4 border-black aspect-[9/16] w-full select-none flex flex-col justify-between hover:shadow-[8px_8px_0px_0px_rgba(255,0,255,1)] transition-all duration-300">
              {/* Full-size background image */}
              <div className="absolute inset-0 z-0">
                <img 
                  src="card1.png" 
                  alt="Locandine d'impatto"
                  className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700 select-none pointer-events-none"
                  referrerPolicy="no-referrer"
                />
                {/* Dark gradient mapping for deep contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/30 z-10" />
              </div>

              {/* Spacer replacing header for consistent padding and flex layout */}
              <div className="relative z-20 p-4" />

              {/* Interactions Right Gutter */}
              <div className="absolute right-3.5 bottom-28 z-20 flex flex-col items-center gap-4 text-white">
                <button className="flex flex-col items-center cursor-pointer group/btn">
                  <div className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover/btn:bg-brand-fuchsia group-hover/btn:text-black group-hover/btn:border-black transition-all">
                    <Heart className="w-4.5 h-4.5 fill-brand-fuchsia text-brand-fuchsia" />
                  </div>
                  <span className="font-mono text-[9px] mt-1 text-zinc-300 font-bold">1,842</span>
                </button>
                <button className="flex flex-col items-center cursor-pointer group/btn">
                  <div className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover/btn:bg-brand-fuchsia group-hover/btn:text-black group-hover/btn:border-black transition-all">
                    <MessageCircle className="w-4.5 h-4.5" />
                  </div>
                  <span className="font-mono text-[9px] mt-1 text-zinc-300 font-bold">215</span>
                </button>
                <button className="flex flex-col items-center cursor-pointer group/btn">
                  <div className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover/btn:bg-brand-fuchsia group-hover/btn:text-black group-hover/btn:border-black transition-all">
                    <Bookmark className="w-4.5 h-4.5 fill-current" />
                  </div>
                  <span className="font-mono text-[9px] mt-1 text-zinc-300 font-bold">594</span>
                </button>
                <button className="flex flex-col items-center cursor-pointer group/btn">
                  <div className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover/btn:bg-brand-fuchsia group-hover/btn:text-black group-hover/btn:border-black transition-all">
                    <Share2 className="w-4.5 h-4.5" />
                  </div>
                  <span className="font-mono text-[9px] mt-1 text-zinc-300 font-bold">340</span>
                </button>
              </div>

              {/* Footer: Reel Details Overlay (Bottom Panel) */}
              <div className="relative z-20 p-5 mt-auto flex flex-col text-left">
                {/* Active topic capsule */}
                <div className="mb-2">
                  <span className="font-mono text-[8px] font-black text-black uppercase tracking-wider bg-brand-fuchsia px-2 py-0.5 inline-block rounded-none select-none">
                    WORKSHOP DESIGN
                  </span>
                </div>

                <h3 className="font-display font-black text-xl uppercase tracking-tight text-white mb-2 leading-tight drop-shadow-md">
                  Locandine d'impatto
                </h3>
                
                <p className="text-zinc-200 text-xs leading-relaxed mb-4 font-sans pr-10 drop-shadow-sm">
                  Crea una grafica promozionale o un poster coordinato partendo semplicemente da poche informazioni testuali o da una traccia di offerta grezza.
                </p>

                {/* Simulated Audio Track line */}
                <div className="flex items-center gap-1.5 border-t border-white/10 pt-3 text-zinc-400">
                  <Music className="w-3.5 h-3.5 text-brand-fuchsia shrink-0 animate-spin" style={{ animationDuration: '6s' }} />
                  <span className="font-mono text-[9px] text-zinc-300 overflow-hidden text-ellipsis whitespace-nowrap">
                    Socialee AI • Audio originale (Locandine)
                  </span>
                </div>
              </div>

              {/* Neo-brutalist pink neon playback progress bar at the very bottom */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-zinc-800 z-20 overflow-hidden">
                <div className="h-full bg-brand-fuchsia" style={{ width: '40%' }} />
              </div>
            </div>

            {/* Card 2: Menu e offerte */}
            <div className="group relative overflow-hidden bg-black border-4 border-black aspect-[9/16] w-full select-none flex flex-col justify-between hover:shadow-[8px_8px_0px_0px_rgba(255,0,255,1)] transition-all duration-300">
              {/* Full-size background image */}
              <div className="absolute inset-0 z-0">
                <img 
                  src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=600&fit=crop" 
                  alt="Menu e offerte chiare"
                  className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700 select-none pointer-events-none"
                  referrerPolicy="no-referrer"
                />
                {/* Dark gradient mapping for deep contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/30 z-10" />
              </div>

              {/* Spacer replacing header for consistent padding and flex layout */}
              <div className="relative z-20 p-4" />

              {/* Interactions Right Gutter */}
              <div className="absolute right-3.5 bottom-28 z-20 flex flex-col items-center gap-4 text-white">
                <button className="flex flex-col items-center cursor-pointer group/btn">
                  <div className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover/btn:bg-brand-fuchsia group-hover/btn:text-black group-hover/btn:border-black transition-all">
                    <Heart className="w-4.5 h-4.5 fill-brand-fuchsia text-brand-fuchsia" />
                  </div>
                  <span className="font-mono text-[9px] mt-1 text-zinc-300 font-bold">2,410</span>
                </button>
                <button className="flex flex-col items-center cursor-pointer group/btn">
                  <div className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover/btn:bg-brand-fuchsia group-hover/btn:text-black group-hover/btn:border-black transition-all">
                    <MessageCircle className="w-4.5 h-4.5" />
                  </div>
                  <span className="font-mono text-[9px] mt-1 text-zinc-300 font-bold">392</span>
                </button>
                <button className="flex flex-col items-center cursor-pointer group/btn">
                  <div className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover/btn:bg-brand-fuchsia group-hover/btn:text-black group-hover/btn:border-black transition-all">
                    <Bookmark className="w-4.5 h-4.5 fill-current" />
                  </div>
                  <span className="font-mono text-[9px] mt-1 text-zinc-300 font-bold">814</span>
                </button>
                <button className="flex flex-col items-center cursor-pointer group/btn">
                  <div className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover/btn:bg-brand-fuchsia group-hover/btn:text-black group-hover/btn:border-black transition-all">
                    <Share2 className="w-4.5 h-4.5" />
                  </div>
                  <span className="font-mono text-[9px] mt-1 text-zinc-300 font-bold">489</span>
                </button>
              </div>

              {/* Footer: Reel Details Overlay (Bottom Panel) */}
              <div className="relative z-20 p-5 mt-auto flex flex-col text-left">
                {/* Active topic capsule */}
                <div className="mb-2">
                  <span className="font-mono text-[8px] font-black text-black uppercase tracking-wider bg-brand-fuchsia px-2 py-0.5 inline-block rounded-none select-none">
                    MENÙ E OFFERTE
                  </span>
                </div>

                <h3 className="font-display font-black text-xl uppercase tracking-tight text-white mb-2 leading-tight drop-shadow-md">
                  Menu e offerte chiare
                </h3>
                
                <p className="text-zinc-200 text-xs leading-relaxed mb-4 font-sans pr-10 drop-shadow-sm">
                  Trasforma una carta complicata, un pacchetto o una promozione in arrivo in una proposta commerciale leggibile, attraente e focalizzata sui margini.
                </p>

                {/* Simulated Audio Track line */}
                <div className="flex items-center gap-1.5 border-t border-white/10 pt-3 text-zinc-400">
                  <Music className="w-3.5 h-3.5 text-brand-fuchsia shrink-0 animate-spin" style={{ animationDuration: '6s' }} />
                  <span className="font-mono text-[9px] text-zinc-300 overflow-hidden text-ellipsis whitespace-nowrap">
                    Socialee AI • Audio originale (Menu)
                  </span>
                </div>
              </div>

              {/* Neo-brutalist pink neon playback progress bar at the very bottom */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-zinc-800 z-20 overflow-hidden">
                <div className="h-full bg-brand-fuchsia" style={{ width: '65%' }} />
              </div>
            </div>

            {/* Card 3: Promo e messaggi pronti */}
            <div className="group relative overflow-hidden bg-black border-4 border-black aspect-[9/16] w-full select-none flex flex-col justify-between hover:shadow-[8px_8px_0px_0px_rgba(255,0,255,1)] transition-all duration-300">
              {/* Full-size background image */}
              <div className="absolute inset-0 z-0">
                <img 
                  src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=600&fit=crop" 
                  alt="Promo e messaggi pronti"
                  className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700 select-none pointer-events-none"
                  referrerPolicy="no-referrer"
                />
                {/* Dark gradient mapping for deep contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/30 z-10" />
              </div>

              {/* Spacer replacing header for consistent padding and flex layout */}
              <div className="relative z-20 p-4" />

              {/* Interactions Right Gutter */}
              <div className="absolute right-3.5 bottom-28 z-20 flex flex-col items-center gap-4 text-white">
                <button className="flex flex-col items-center cursor-pointer group/btn">
                  <div className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover/btn:bg-brand-fuchsia group-hover/btn:text-black group-hover/btn:border-black transition-all">
                    <Heart className="w-4.5 h-4.5 fill-brand-fuchsia text-brand-fuchsia" />
                  </div>
                  <span className="font-mono text-[9px] mt-1 text-zinc-300 font-bold">3,522</span>
                </button>
                <button className="flex flex-col items-center cursor-pointer group/btn">
                  <div className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover/btn:bg-brand-fuchsia group-hover/btn:text-black group-hover/btn:border-black transition-all">
                    <MessageCircle className="w-4.5 h-4.5" />
                  </div>
                  <span className="font-mono text-[9px] mt-1 text-zinc-300 font-bold">519</span>
                </button>
                <button className="flex flex-col items-center cursor-pointer group/btn">
                  <div className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover/btn:bg-brand-fuchsia group-hover/btn:text-black group-hover/btn:border-black transition-all">
                    <Bookmark className="w-4.5 h-4.5 fill-current" />
                  </div>
                  <span className="font-mono text-[9px] mt-1 text-zinc-300 font-bold">1,120</span>
                </button>
                <button className="flex flex-col items-center cursor-pointer group/btn">
                  <div className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover/btn:bg-brand-fuchsia group-hover/btn:text-black group-hover/btn:border-black transition-all">
                    <Share2 className="w-4.5 h-4.5" />
                  </div>
                  <span className="font-mono text-[9px] mt-1 text-zinc-300 font-bold">605</span>
                </button>
              </div>

              {/* Footer: Reel Details Overlay (Bottom Panel) */}
              <div className="relative z-20 p-5 mt-auto flex flex-col text-left">
                {/* Active topic capsule */}
                <div className="mb-2">
                  <span className="font-mono text-[8px] font-black text-black uppercase tracking-wider bg-brand-fuchsia px-2 py-0.5 inline-block rounded-none select-none">
                    MESSAGGI PERSUASIVI
                  </span>
                </div>

                <h3 className="font-display font-black text-xl uppercase tracking-tight text-white mb-2 leading-tight drop-shadow-md">
                  Promo e messaggi pronti
                </h3>
                
                <p className="text-zinc-200 text-xs leading-relaxed mb-4 font-sans pr-10 drop-shadow-sm">
                  Scrivi in pochi secondi testi persuasivi pensati per generare risposte repentine su WhatsApp, broadcast locali o descrizioni post per Instagram e Facebook.
                </p>

                {/* Simulated Audio Track line */}
                <div className="flex items-center gap-1.5 border-t border-white/10 pt-3 text-zinc-400">
                  <Music className="w-3.5 h-3.5 text-brand-fuchsia shrink-0 animate-spin" style={{ animationDuration: '6s' }} />
                  <span className="font-mono text-[9px] text-zinc-300 overflow-hidden text-ellipsis whitespace-nowrap">
                    Socialee AI • Audio originale (Copywriting)
                  </span>
                </div>
              </div>

              {/* Neo-brutalist pink neon playback progress bar at the very bottom */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-zinc-800 z-20 overflow-hidden">
                <div className="h-full bg-brand-fuchsia" style={{ width: '85%' }} />
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 4 — FUCHSIA FULL ROW: DATO FORTE */}
      <section className="bg-brand-fuchsia text-black py-16 px-4 sm:px-8 border-y-4 border-black select-none">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-8 text-left">
          <div className="md:w-3/5">
            <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-none uppercase mb-4 m-0 text-black">
              1 ora per capire cosa può fare l’AI per la tua comunicazione.
            </h2>
          </div>
          <div className="md:w-2/5 flex flex-col items-start justify-center">
            <p className="text-zinc-950 font-medium text-sm sm:text-base leading-relaxed mb-4 m-0">
              L’obiettivo non è farti diventare un tecnico o un programmatore. L’obiettivo è farti uscire dall’evento con un metodo pratico ed immediato per velocizzare l'ideazione di grafiche, promozioni e materiali commerciali ordinati per la tua impresa.
            </p>
            <span className="font-mono text-xs font-black uppercase tracking-wider bg-black text-brand-fuchsia px-3 py-1 border border-black">
              Ingresso Libero • Posti limitati a 100
            </span>
          </div>
        </div>
      </section>

      {/* SECTION 5 — BLACK ROW: PROGRAMMA / TIMELINE */}
      <section id="programma" className="relative overflow-hidden bg-black py-20 px-4 sm:px-8 border-b-2 border-zinc-900">
        
        {/* Background Image with Black Overlay & Elegant Fallback */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/spiegazione.png" 
            alt="Spiegazione Background"
            className="w-full h-full object-cover opacity-65 select-none pointer-events-none"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1470&fit=crop";
            }}
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/45 z-10" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-brand-fuchsia font-display font-black text-xs uppercase tracking-widest block mb-3">
              COME FUNZIONA
            </span>
            <h2 className="font-display font-black text-4xl sm:text-5xl tracking-tight leading-none uppercase text-white mb-6">
              UN APERITIVO, QUATTRO MOMENTI.
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
              L'evento è progettato per essere semplice, concreto ed estremamente utile. Prima una parte di dimostrazione pratica ed immediata al computer, poi ampio spazio a domande, confronto libero e networking informale tra titolari di attività.
            </p>
          </div>

          {/* Horizon Timeline step card sequence */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-stretch mb-12">
            {TIMELINE_STEPS.map((step, idx) => (
              <div key={idx} className="bg-zinc-950/80 backdrop-blur-xs border-2 border-zinc-900 p-6 flex flex-col justify-between text-left relative overflow-hidden group hover:border-brand-fuchsia/40 transition-colors">
                
                {/* Visual progression indicator */}
                <span className="absolute top-4 right-4 font-mono text-xs font-extrabold text-brand-fuchsia bg-brand-fuchsia/10 border border-brand-fuchsia/25 px-2.5 py-0.5">
                  {step.time}
                </span>

                <div className="pt-8">
                  <h3 className="font-display font-extrabold text-lg uppercase tracking-tight text-white mb-3 leading-tight">
                    {step.title}
                  </h3>
                  <p className="text-zinc-500 text-xs leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <a 
              href="#registrati" 
              className="inline-block bg-brand-fuchsia hover:bg-white text-black hover:text-black font-display font-black text-xs uppercase tracking-widest px-8 py-4 border-2 border-brand-fuchsia transition-all shadow-[4px_4px_0px_0px_white] hover:shadow-none"
            >
              Prenota il tuo posto gratuito
            </a>
          </div>

        </div>
      </section>

      {/* SECTION 6 — WHITE ROW: COSA IMPARI */}
      <section id="cosa-impari" className="bg-white text-zinc-900 py-20 px-4 sm:px-8 border-b-4 border-black">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left column contents list */}
          <div className="lg:col-span-7 text-left">
            <span className="text-brand-fuchsia font-display font-black text-xs uppercase tracking-widest block mb-3">
              COSA PORTI A CASA
            </span>
            <h2 className="font-display font-black text-4xl sm:text-5xl tracking-tight leading-none uppercase text-black mb-6">
              IDEE, STRUMENTI E UN METODO PIÙ VELOCE PER COMUNICARE.
            </h2>
            <p className="text-zinc-600 text-sm sm:text-base leading-relaxed mb-8">
              In 60 minuti vedrai come l’intelligenza artificiale può aiutarti a lavorare meglio sulla comunicazione quotidiana della tua attività. Capirai come passare da un’idea confusa a un contenuto strutturato, da una promo improvvisata a un messaggio d'impatto commerciale e da un menu rigido ad una proposta leggibile.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {WHAT_YOU_LEARN.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 border-b border-zinc-100 pb-3">
                  <div className="text-brand-fuchsia shrink-0 mt-0.5">
                    <Check className="w-5 h-5" />
                  </div>
                  <p className="text-zinc-800 font-medium text-xs sm:text-sm leading-relaxed m-0">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right column graphic poster */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="bg-brand-fuchsia border-4 border-black p-6 sm:p-8 flex flex-col justify-between min-h-[380px] text-left select-none relative shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-sm">
              <div className="border-b-2 border-black pb-4">
                <span className="font-mono text-[10px] text-black uppercase tracking-widest font-black">SOCIALEE POSTULATO</span>
              </div>
              
              <div className="my-4">
                <p className="font-display font-black text-3xl sm:text-4xl text-black tracking-tight leading-none uppercase m-0">SE NON LO</p>
                <p className="font-display font-black text-3xl sm:text-4xl text-black tracking-tight leading-none uppercase m-0">USI BENE,</p>
                <p className="font-display font-black text-3xl sm:text-4xl text-zinc-950 tracking-tight leading-none uppercase m-0">L’AI RESTA</p>
                <p className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight leading-none uppercase m-0">SOLO UN</p>
                <p className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight leading-none uppercase m-0">GIOCO.</p>
              </div>

              <div className="border-t-2 border-black pt-4">
                <p className="font-display font-extrabold text-xs text-black leading-tight uppercase tracking-tight m-0">
                  Noi ti facciamo vedere come usarla per lavorare meglio.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 7 — BLACK ROW: CHI E SOCIALEE */}
      <section className="relative overflow-hidden bg-brand-dark py-20 px-4 sm:px-8 border-b-2 border-zinc-900">
        
        {/* Background Image with Black Overlay & Elegant Fallback */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/evento.png" 
            alt="Evento Background"
            className="w-full h-full object-cover opacity-65 select-none pointer-events-none"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1470&fit=crop";
            }}
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/45 z-10" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Left Column Box quote */}
          <div className="lg:col-span-5 border-2 border-zinc-855 bg-black p-8 sm:p-10 flex flex-col justify-between select-none relative text-left">
            <div className="absolute top-4 left-4">
              <span className="text-zinc-800 font-display font-black text-5xl">“</span>
            </div>
            
            <div className="my-10">
              <p className="font-display font-extrabold text-2xl sm:text-3xl text-white uppercase tracking-tight leading-tight m-0">
                Non facciamo solo contenuti. Costruiamo comunicazione che porta clienti.
              </p>
            </div>

            <div className="border-t border-zinc-900 pt-5">
              <p className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">Filosofia d'Agenzia</p>
              <p className="font-display font-extrabold text-sm text-brand-fuchsia tracking-tight uppercase">SOCIALEE DIGITAL TECH</p>
            </div>
          </div>

          {/* Right Column Core Description */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left">
            <span className="text-brand-fuchsia font-display font-black text-xs uppercase tracking-widest block mb-3">
              CHI ORGANIZZA L'EVENTO
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight leading-none text-white mb-6">
              SOCIALEE: LA SOCIAL TECH COMPANY CHE PORTA RISULTATI AL TUO BUSINESS.
            </h2>
            
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed mb-6">
              Siamo una social tech company specializzata nella strutturazione e ingegnerizzazione della comunicazione che produce clienti effettivi per industrie, PMI, reti locali e startup innovative. Non ci occupiamo meramente di \"scrivere post su invito\". Montiamo strategie, funnel di traffico, automation e landing page in sistemi misurabili.
            </p>

            {/* Minimul services bullet grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-zinc-900 pt-6">
              {SOCIALEE_SERVICES.map((srv, idx) => (
                <div key={idx} className="text-left bg-zinc-950 p-4 border border-zinc-900">
                  <h4 className="font-mono text-xs font-bold text-brand-fuchsia uppercase tracking-wider mb-1">
                    {srv.titolo}
                  </h4>
                  <p className="text-zinc-500 text-[11px] leading-relaxed m-0">
                    {srv.descrizione}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 8 — TEAM ROW: PERSONE, NON SLIDE */}
      <section id="team" className="bg-white text-zinc-900 py-20 px-4 sm:px-8 border-b-4 border-brand-fuchsia">
        <div className="max-w-7xl mx-auto text-left">
          
          <div className="max-w-2xl mb-12">
            <span className="text-brand-fuchsia font-display font-black text-xs uppercase tracking-widest block mb-3">
              IL TEAM CHE TI GUIDERÀ DURANTE L'EVENTO
            </span>
            <h2 className="font-display font-black text-4xl sm:text-5xl tracking-tight leading-none uppercase text-black mb-4">
              PERSONE, NON SLIDE.
            </h2>
            <p className="text-zinc-600 text-sm sm:text-base leading-relaxed">
              Durante l'aperitivo e la demo live incontrerai di persona i professionisti di Socialee che ogni giorno montano campagne, progetti, automazioni ed architetture digitali per aziende, negozi e brand attivi sul mercato.
            </p>
          </div>

          {/* Core team profile cards arranged homogeneously over two rows (Row 1: 4 cards, Row 2: 3 cards centered) */}
          <div className="flex flex-col gap-4 md:gap-5 mb-12">
            {/* Row 1: First 4 Members */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
              {TEAM_MEMBERS.slice(0, 4).map((member, idx) => (
                <div key={idx} className="bg-white border-2 border-black p-3 sm:p-4 flex flex-col justify-between hover:shadow-[6px_6px_0px_0px_rgba(255,0,255,1)] transition-all duration-300">
                  <div>
                    {/* Team image wrapper */}
                    <div className="w-full aspect-square border-2 border-black overflow-hidden mb-3 bg-zinc-100 relative">
                      <img 
                        src={member.fotoUrl} 
                        alt={member.nome}
                        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                        onError={(e) => {
                          const fallback = getFallbackImage(member.fotoUrl || '');
                          if (e.currentTarget.src !== fallback) {
                            e.currentTarget.src = fallback;
                          }
                        }}
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    
                    {/* Mini visual border banner */}
                    <span className="font-mono text-[8px] sm:text-[9px] font-bold text-brand-fuchsia uppercase tracking-wider bg-black text-white px-2 py-0.5 inline-block mb-1.5 leading-none">
                      {member.ruolo}
                    </span>

                    <h3 className="font-display font-black text-sm sm:text-base uppercase tracking-tight text-black m-0 mb-1 leading-snug">
                      {member.nome}
                    </h3>
                    
                    <p className="text-zinc-650 text-[10px] sm:text-xs leading-relaxed m-0">
                      {member.descrizione}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Row 2: Remaining 3 Members Centered */}
            <div className="grid grid-cols-2 md:flex md:justify-center gap-4 md:gap-5">
              {TEAM_MEMBERS.slice(4).map((member, idx) => (
                <div key={idx} className="w-full md:w-[calc(25%-15px)] xl:w-[242px] bg-white border-2 border-black p-3 sm:p-4 flex flex-col justify-between hover:shadow-[6px_6px_0px_0px_rgba(255,0,255,1)] transition-all duration-300">
                  <div>
                    {/* Team image wrapper */}
                    <div className="w-full aspect-square border-2 border-black overflow-hidden mb-3 bg-zinc-100 relative">
                      <img 
                        src={member.fotoUrl} 
                        alt={member.nome}
                        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                        onError={(e) => {
                          const fallback = getFallbackImage(member.fotoUrl || '');
                          if (e.currentTarget.src !== fallback) {
                            e.currentTarget.src = fallback;
                          }
                        }}
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    
                    {/* Mini visual border banner */}
                    <span className="font-mono text-[8px] sm:text-[9px] font-bold text-brand-fuchsia uppercase tracking-wider bg-black text-white px-2 py-0.5 inline-block mb-1.5 leading-none">
                      {member.ruolo}
                    </span>

                    <h3 className="font-display font-black text-sm sm:text-base uppercase tracking-tight text-black m-0 mb-1 leading-snug">
                      {member.nome}
                    </h3>
                    
                    <p className="text-zinc-650 text-[10px] sm:text-xs leading-relaxed m-0">
                      {member.descrizione}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center pt-4">
            <a 
              href="#registrati" 
              className="inline-block bg-zinc-950 hover:bg-brand-fuchsia text-white hover:text-black font-display font-bold text-xs uppercase tracking-wider px-8 py-4 border-2 border-zinc-900 transition-all text-center uppercase"
            >
              Vuoi conoscerci dal vivo? Prenota il tuo posto
            </a>
          </div>

        </div>
      </section>

      {/* SECTION 9 — BLACK ROW: PERCHE PARTECIPARE ORA */}
      <section className="bg-black py-20 px-4 sm:px-8 border-b-4 border-black">
        <div className="max-w-4xl mx-auto text-center">
          
          <span className="text-brand-fuchsia font-mono text-xs font-black uppercase tracking-widest block mb-4">
            LA CHIAVE STRATEGICA DEL MERCATO
          </span>

          <h2 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight leading-tight text-white mb-6">
            L’AI è già entrata nel lavoro delle aziende.<br/>
            La differenza la farà chi saprà usarla bene.
          </h2>

          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed mb-10 max-w-2xl mx-auto">
            Molti commercianti ed imprenditori stanno spendendo tempo prezioso provando ad utilizzare software di intelligenza artificiale in modo casuale: copiano testi banali, interrogano chat generiche, e finiscono per produrre materiali impersonali privi di conversione commerciale. Durante l'evento toccherai con mano un approccio radicalmente diverso: usare l'AI inserita all'interno di un processo di comunicazione chiaro, orientato unicamente a massimizzare le tue vendite locali.
          </p>

          <a 
            href="#registrati" 
            className="inline-block bg-brand-fuchsia hover:bg-black text-black hover:text-brand-fuchsia font-display font-black text-xs uppercase tracking-widest px-8 py-4.5 border-2 border-brand-fuchsia transition-all shadow-[5px_5px_0px_0px_white] hover:shadow-none"
          >
            Registrati gratuitamente all'evento
          </a>

        </div>
      </section>

      {/* SECTION 10 — BREVO INTEGRATION FORM FIELD ROW */}
      <section id="registrati" className="bg-brand-fuchsia text-black py-20 px-4 sm:px-8 border-t-4 border-black font-sans scroll-mt-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Left Column Information Copy */}
          <div className="lg:col-span-5 flex flex-col justify-between text-left">
            <div>
              <span className="bg-black text-brand-fuchsia font-display font-extrabold text-[10px] tracking-widest uppercase px-3 py-1 mb-5 inline-block">
                INGRESSO LIMITATO A 100 PARTECIPANTI
              </span>
              
              <h2 className="font-display font-black text-4xl sm:text-5xl uppercase tracking-tight leading-none text-black mb-6 m-0">
                PRENOTA IL TUO POSTO GRATUITO.
              </h2>
              
              <p className="text-zinc-900 font-medium text-sm sm:text-base leading-relaxed mb-6 m-0">
                Compila ordinatamente il modulo per registrare la tua richiesta d’accesso all'evento. I posti sono strettamente limitati ed esclusi ad addetti ai lavori non in linea. Dopo l'invio riceverai una conferma d’assegnazione ed informazioni operative dettagliate tramite WhatsApp e telefono per l’aperitivo.
              </p>
            </div>

            {/* Quick Summary event card inside fucsia column */}
            <div className="mt-8 border-2 border-black bg-zinc-950 text-white p-5">
              <h4 className="font-display font-black text-sm uppercase text-brand-fuchsia tracking-wider mb-3 m-0">DETTAGLI EVENTO</h4>
              <div className="flex flex-col gap-2.5 font-mono text-xs text-zinc-300">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-brand-fuchsia shrink-0" />
                  <span>Martedì 30 Giugno, Ore 18:00</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-brand-fuchsia shrink-0" />
                  <span>Via Trinitapoli 24, 71121 Foggia FG, Italy</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-brand-fuchsia shrink-0" />
                  <span>Ingresso gratuito + Aperitivo Incluso</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column Form (Brevo Layout Style card with custom responsive validations) */}
          <div className="lg:col-span-7 flex justify-center">
            <div className="w-full max-w-[580px] bg-white border-4 border-black p-0 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-left overflow-hidden">
              <iframe 
                width="100%" 
                height="1020" 
                src="https://996d0fa4.sibforms.com/v2/serve/MUIFAIbK38rZSLJVzU-K_zbB661R5T_WujWJV1Ifb0bfB_eistCwCzU2ain4j6h_vQgcz-AM15mRE7yiUXIpa0ZpiYS0fmamcxDfpT5wWNxxp-p4oRhoerHj1Shuc5qd6j2hhXNg3d70pY_X6PokNBh3HuLmQPPCZCmVD88c2kUBKw7ylG6oTdh5KV7agPuIB38mnNerrZ_U4OKn" 
                frameBorder="0" 
                scrolling="no" 
                allowFullScreen 
                style={{ display: "block", marginLeft: "auto", marginRight: "auto", maxWidth: "100%", minHeight: "1020px", border: "none" }}
              />
            </div>
          </div>

        </div>
      </section>

      {/* FOOTER SECTION */}
      <footer className="bg-black text-zinc-400 py-16 px-4 sm:px-8 border-t-2 border-zinc-950">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-stretch gap-10">
          
          {/* Logo Brand Statement */}
          <div className="md:w-3/5 flex flex-col items-start text-left justify-between lg:pr-12">
            <div>
              <a href="#" className="flex items-center gap-1 mb-4 select-none">
                <Logo />
              </a>
              <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed max-w-md m-0">
                Socialee è una premium social tech company specializzata nella strutturazione e ingegnerizzazione della comunicazione digitale ed azioni orientate esclusivamente a portare clienti ad industrie comellesse, PMI territoriali e startup ad alta crescita.
              </p>
            </div>
            
            <p className="text-zinc-600 font-mono text-[10px] mt-8 m-0">
              &copy; 2026 Socialee Digital Tech S.r.l. Tutti i diritti riservati. P.IVA 10984830111
            </p>
          </div>

          {/* Useful Anchor links */}
          <div className="md:w-2/5 flex flex-col gap-6 justify-between text-left">
            <div className="grid grid-cols-2 gap-8">
              <div className="flex flex-col gap-2 font-mono text-xs">
                <p className="font-bold text-white uppercase tracking-wider mb-2">NAVIGAZIONE</p>
                <a href="#non-corso" className="text-zinc-500 hover:text-white transition-colors">Chi Siamo</a>
                <a href="#cosa-impari" className="text-zinc-500 hover:text-white transition-colors">Cosa Impari</a>
                <a href="#programma" className="text-zinc-500 hover:text-white transition-colors">Programma</a>
                <a href="#team" className="text-zinc-500 hover:text-white transition-colors">Team</a>
              </div>
              
              <div className="flex flex-col gap-2 font-mono text-xs">
                <p className="font-bold text-white uppercase tracking-wider mb-2">SUPPORTO LEGAL</p>
                <button 
                  onClick={() => { setLegalModalType('privacy'); setLegalModalOpen(true); }}
                  className="text-left cursor-pointer text-zinc-500 hover:text-white transition-colors"
                >
                  Privacy Policy
                </button>
                <button 
                  onClick={() => { setLegalModalType('cookie'); setLegalModalOpen(true); }}
                  className="text-left cursor-pointer text-zinc-500 hover:text-white transition-colors"
                >
                  Cookie Policy
                </button>
                <button 
                  onClick={() => { setLegalModalType('terms'); setLegalModalOpen(true); }}
                  className="text-left cursor-pointer text-zinc-500 hover:text-white transition-colors"
                >
                  Termini Registrazione
                </button>
              </div>
            </div>

            {/* Bottom CTA small box */}
            <div className="border-t border-zinc-950 pt-5 mt-4 flex items-center justify-between">
              <div>
                <p className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest leading-none m-0">Hai un'attività?</p>
                <p className="font-display font-extrabold text-sm text-white tracking-tight uppercase leading-snug m-0">PARLIAMONE.</p>
              </div>
              <a 
                href="#registrati" 
                className="bg-brand-fuchsia text-black font-display font-extrabold text-[10px] uppercase tracking-wider px-3.5 py-1.5 shadow-[2px_2px_0px_0px_white] hover:shadow-none transition-all block text-center"
              >
                Iniziamo Ora
              </a>
            </div>

          </div>

        </div>
      </footer>

      {/* RENDER LEGAL POLICIES DIALOG */}
      <LegalModal 
        isOpen={legalModalOpen} 
        onClose={() => setLegalModalOpen(false)} 
        type={legalModalType} 
      />

    </div>
  );
}
