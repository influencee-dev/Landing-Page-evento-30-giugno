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
  CalendarCheck
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

export default function App() {
  // Mobile menu visibility
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
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
          <a href="#" className="flex items-center gap-1.5 font-display font-extrabold text-2xl tracking-tight text-white select-none">
            SOCIALEE<span className="text-brand-fuchsia font-sans">.</span>
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
              Richiedi il posto
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
            AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-brand-fuchsia">APERITIVO</span>.
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
              className="bg-brand-fuchsia hover:bg-black text-black hover:text-brand-fuchsia font-display font-black text-sm uppercase tracking-wider px-8 py-4.5 border-2 border-brand-fuchsia transition-all text-center flex items-center justify-center gap-2 block shadow-[5px_5px_0px_0px_rgba(255,0,127,0.3)] hover:shadow-none"
            >
              Richiedi il tuo posto gratuito
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
                <p className="text-xs font-bold text-zinc-200">Presenza Fisica</p>
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
            <div className="relative bg-zinc-950 border-2 border-brand-fuchsia p-8 flex flex-col justify-between h-[420px] select-none text-left shadow-2xl">
              
              {/* Card Header decoration */}
              <div className="flex justify-between items-start border-b-2 border-zinc-900 pb-5">
                <span className="font-mono text-[11px] text-zinc-500 tracking-wider">SOCIAL MEDIA TECH</span>
                <span className="font-mono text-[10px] text-brand-fuchsia bg-brand-fuchsia/10 border border-brand-fuchsia/40 px-2 py-0.5">INGRESSO PASS</span>
              </div>

              {/* Central Title Statement */}
              <div className="my-8 flex flex-col gap-3 font-display">
                <p className="text-4xl sm:text-5xl font-black text-brand-fuchsia tracking-tight leading-none uppercase m-0">60 MINUTI.</p>
                <p className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-none uppercase m-0">AI LIVE.</p>
                <p className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-none uppercase m-0">APERITIVO.</p>
                <p className="text-4xl sm:text-5xl font-black text-brand-fuchsia tracking-tight leading-none uppercase m-0">NETWORKING.</p>
              </div>

              {/* Card Footer */}
              <div className="border-t-2 border-zinc-900 pt-5 flex items-center justify-between">
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

          {/* Three columns descriptive cards - Styled with heavy borders and square block aesthetic */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            
            {/* Card 1: Locandine */}
            <div className="bg-white border-4 border-black p-8 select-none flex flex-col justify-between hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 min-h-[250px]">
              <div>
                <div className="bg-black text-white w-12 h-12 flex items-center justify-center mb-6">
                  <LayoutTemplate className="w-6 h-6 text-brand-fuchsia" />
                </div>
                <h3 className="font-display font-extrabold text-xl uppercase tracking-tight text-black mb-3">
                  Locandine d'impatto
                </h3>
                <p className="text-zinc-600 text-sm leading-relaxed">
                  Crea una grafica promozionale o un poster coordinato partendo semplicemente da poche informazioni testuali o da una traccia di offerta grezza.
                </p>
              </div>
            </div>

            {/* Card 2: Menu e offerte */}
            <div className="bg-white border-4 border-black p-8 select-none flex flex-col justify-between hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 min-h-[250px]">
              <div>
                <div className="bg-black text-white w-12 h-12 flex items-center justify-center mb-6">
                  <span className="font-mono text-lg font-black text-brand-fuchsia">MENU</span>
                </div>
                <h3 className="font-display font-extrabold text-xl uppercase tracking-tight text-black mb-3">
                  Menu e offerte chiare
                </h3>
                <p className="text-zinc-600 text-sm leading-relaxed">
                  Trasforma una carta complicata, un pacchetto o una promozione in arrivo in una proposta commerciale leggibile, attraente e focalizzata sui margini.
                </p>
              </div>
            </div>

            {/* Card 3: Promo e testi */}
            <div className="bg-white border-4 border-black p-8 select-none flex flex-col justify-between hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 min-h-[250px]">
              <div>
                <div className="bg-black text-white w-12 h-12 flex items-center justify-center mb-6">
                  <MessageSquare className="w-6 h-6 text-brand-fuchsia" />
                </div>
                <h3 className="font-display font-extrabold text-xl uppercase tracking-tight text-black mb-3">
                  Promo e messaggi pronti
                </h3>
                <p className="text-zinc-600 text-sm leading-relaxed">
                  Scrivi in pochi secondi testi persuasivi pensati per generare risposte repentine su WhatsApp, broadcast locali o descrizioni post per Instagram e Facebook.
                </p>
              </div>
            </div>

          </div>

          {/* INTERACTIVE DEMO ACCENT: LIVE DEMO SIMULATION */}
          <div className="border-4 border-black bg-zinc-950 text-white p-6 sm:p-10">
            <div className="flex flex-col lg:flex-row gap-8 items-stretch">
              
              {/* Left sidebar: Industry selector & buttons */}
              <div className="lg:w-1/3 flex flex-col justify-between">
                <div>
                  <span className="text-brand-fuchsia font-mono text-xs font-black uppercase tracking-widest block mb-1">
                    DIMOSTRAZIONE LIVE INTERATTIVA
                  </span>
                  <h4 className="font-display font-extrabold text-2xl uppercase tracking-tight text-white mb-4">
                    Vedi come l'AI lavora per il tuo settore
                  </h4>
                  <p className="text-zinc-400 text-xs leading-relaxed mb-6">
                    Seleziona uno dei mercati di riferimento sottostanti e scopri quali tipologie di materiali grafici e testi persuasivi l'intelligenza artificiale può comporre all'istante durante il workshop.
                  </p>
                </div>

                {/* Industry grid buttons */}
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handlePlaygroundIndustryChange('ristoranti')}
                    className={`px-4 py-3 text-xs font-display font-extrabold tracking-wide uppercase border-2 text-left transition-all flex items-center justify-between ${
                      selectedPlaygroundIndustry === 'ristoranti' 
                        ? 'bg-brand-fuchsia text-black border-brand-fuchsia shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]' 
                        : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    Ristorazione &amp; Food
                    <ChevronRight className="w-4 h-4 shrink-0" />
                  </button>

                  <button
                    onClick={() => handlePlaygroundIndustryChange('beauty')}
                    className={`px-4 py-3 text-xs font-display font-extrabold tracking-wide uppercase border-2 text-left transition-all flex items-center justify-between ${
                      selectedPlaygroundIndustry === 'beauty' 
                        ? 'bg-brand-fuchsia text-black border-brand-fuchsia shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]' 
                        : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    Beauty &amp; Benessere
                    <ChevronRight className="w-4 h-4 shrink-0" />
                  </button>

                  <button
                    onClick={() => handlePlaygroundIndustryChange('retail')}
                    className={`px-4 py-3 text-xs font-display font-extrabold tracking-wide uppercase border-2 text-left transition-all flex items-center justify-between ${
                      selectedPlaygroundIndustry === 'retail' 
                        ? 'bg-brand-fuchsia text-black border-brand-fuchsia shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]' 
                        : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    Negozi &amp; Retail Locale
                    <ChevronRight className="w-4 h-4 shrink-0" />
                  </button>

                  <button
                    onClick={() => handlePlaygroundIndustryChange('professionisti')}
                    className={`px-4 py-3 text-xs font-display font-extrabold tracking-wide uppercase border-2 text-left transition-all flex items-center justify-between ${
                      selectedPlaygroundIndustry === 'professionisti' 
                        ? 'bg-brand-fuchsia text-black border-brand-fuchsia shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]' 
                        : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    Professionisti &amp; Consulting
                    <ChevronRight className="w-4 h-4 shrink-0" />
                  </button>
                </div>
              </div>

              {/* Right container: Live Generated Render */}
              <div className="lg:w-2/3 border-2 border-zinc-800 bg-black p-4 sm:p-6 flex flex-col justify-between min-h-[400px]">
                
                {/* Tabs to toggle material output type */}
                <div className="flex flex-wrap gap-2 border-b border-zinc-900 pb-4 mb-6">
                  <button
                    onClick={() => setActivePlaygroundTab('locandine')}
                    className={`px-4 py-1.5 text-xs font-mono uppercase tracking-widest flex items-center gap-1.5 border transition-colors ${
                      activePlaygroundTab === 'locandine' 
                        ? 'bg-white text-black border-white' 
                        : 'bg-zinc-950 text-zinc-400 border-zinc-900 hover:text-white'
                    }`}
                  >
                    <LayoutTemplate className="w-3.5 h-3.5" />
                    Locandina
                  </button>

                  <button
                    onClick={() => setActivePlaygroundTab('menu')}
                    className={`px-4 py-1.5 text-xs font-mono uppercase tracking-widest flex items-center gap-1.5 border transition-colors ${
                      activePlaygroundTab === 'menu' 
                        ? 'bg-white text-black border-white' 
                        : 'bg-zinc-950 text-zinc-400 border-zinc-900 hover:text-white'
                    }`}
                  >
                    <span className="font-sans font-bold text-[10px]">T1</span>
                    Menu / Listino
                  </button>

                  <button
                    onClick={() => setActivePlaygroundTab('promo')}
                    className={`px-4 py-1.5 text-xs font-mono uppercase tracking-widest flex items-center gap-1.5 border transition-colors ${
                      activePlaygroundTab === 'promo' 
                        ? 'bg-white text-black border-white' 
                        : 'bg-zinc-950 text-zinc-400 border-zinc-900 hover:text-white'
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    Promo WhatsApp
                  </button>
                </div>

                {/* Simulated AI compilation indicator */}
                {playgroundSimulating ? (
                  <div className="flex-1 flex flex-col items-center justify-center py-12">
                    <Sparkles className="w-8 h-8 text-brand-fuchsia animate-pulse mb-3" />
                    <p className="text-xs font-mono tracking-widest text-brand-fuchsia uppercase">Analisi dati e generazione traccia...</p>
                    <div className="w-48 h-1 bg-zinc-900 mt-4 overflow-hidden relative">
                      <div className="absolute top-0 left-0 h-full bg-brand-fuchsia transition-all duration-300" style={{ width: `${simulatedProgress}%` }}></div>
                    </div>
                  </div>
                ) : (
                  <div className="flex-grow flex flex-col justify-between">
                    
                    {/* Dynamic Template rendering to simulate actual generated output */}
                    {activePlaygroundTab === 'locandine' && (
                      <div className="border-2 border-brand-fuchsia/40 bg-zinc-950 p-6 flex flex-col justify-between min-h-[280px]">
                        <div className="flex items-center justify-between border-b border-zinc-900 pb-3 mb-4">
                          <span className="text-[10px] uppercase font-mono tracking-widest text-brand-fuchsia">{activeContent.locandine.tag}</span>
                          <span className="text-[9px] uppercase font-mono text-zinc-500">FORMATO VOLANTINO (A5)</span>
                        </div>
                        <div className="text-center">
                          <p className="font-mono text-[9px] font-black text-brand-fuchsia tracking-widest uppercase m-0">{activeContent.locandine.sub}</p>
                          <h5 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight leading-none uppercase my-2">
                            {activeContent.locandine.headline}
                          </h5>
                          <p className="text-zinc-400 text-xs leading-relaxed max-w-sm mx-auto my-3">
                            {activeContent.locandine.body}
                          </p>
                        </div>
                        <div className="border-t border-zinc-900 pt-3 mt-4 text-center">
                          <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest font-bold">
                            {activeContent.locandine.promos}
                          </span>
                        </div>
                      </div>
                    )}

                    {activePlaygroundTab === 'menu' && (
                      <div className="border-2 border-zinc-800 bg-zinc-950 p-6 flex flex-col justify-between min-h-[280px]">
                        <div className="flex justify-between items-center border-b border-zinc-900 pb-3 mb-4">
                          <span className="text-xs font-display font-extrabold text-white tracking-tight uppercase">
                            {activeContent.menu.title}
                          </span>
                          <span className="text-[9px] font-mono text-brand-fuchsia uppercase bg-brand-fuchsia/10 px-2 py-0.5 border border-brand-fuchsia/20">PRE-MERCATO</span>
                        </div>
                        
                        <div className="flex flex-col gap-3 py-1">
                          {activeContent.menu.items.map((item, id) => (
                            <div key={id} className="text-left border-l-2 border-zinc-800 pl-3">
                              <p className="text-xs font-bold text-white uppercase tracking-tight">{item.name}</p>
                              <p className="text-[11px] text-zinc-500 mt-0.5 leading-snug">{item.desc}</p>
                            </div>
                          ))}
                        </div>

                        <div className="border-t-2 border-zinc-900 pt-3 mt-4 text-right">
                          <span className="font-mono text-[10px] text-zinc-300 font-bold">
                            {activeContent.menu.footer}
                          </span>
                        </div>
                      </div>
                    )}

                    {activePlaygroundTab === 'promo' && (
                      <div className="border-2 border-zinc-800 bg-zinc-950 p-5 rounded-none flex flex-col h-full justify-between">
                        <div>
                          <div className="flex items-center justify-between border-b border-zinc-900 pb-3 mb-3">
                            <span className="text-[10px] font-mono font-bold text-brand-fuchsia uppercase tracking-wider">{activeContent.promo.title}</span>
                            <span className="text-[9px] font-mono text-zinc-500">MESSAGGIO BROADCAST</span>
                          </div>
                          <pre className="font-mono text-[11px] text-zinc-300 font-normal whitespace-pre-wrap leading-relaxed py-1 text-left bg-black p-3.5 border border-zinc-900 overflow-y-auto max-h-[200px]">
                            {activeContent.promo.text}
                          </pre>
                        </div>
                        <div className="text-right mt-3">
                          <button 
                            onClick={() => {
                              navigator.clipboard.writeText(activeContent.promo.text);
                              alert('Testo copiato negli appunti!');
                            }}
                            className="bg-zinc-900 hover:bg-brand-fuchsia hover:text-black border border-zinc-800 hover:border-brand-fuchsia text-white text-[10px] font-mono uppercase tracking-widest px-3 py-1.5 transition-all"
                          >
                            Copia Negli Appunti
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Simulation footer bar */}
                    <div className="flex items-center justify-between border-t border-zinc-900 pt-4 mt-6">
                      <p className="text-[10px] font-mono text-zinc-500 uppercase m-0">
                        * Questo mockup simula cosa programmeremo insieme.
                      </p>
                      <a 
                        href="#registrati" 
                        className="text-brand-fuchsia text-xs font-mono font-black uppercase tracking-widest hover:text-white flex items-center gap-1 transition-colors"
                      >
                        VOGLIO IMPARARLO DAL VIVO
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </div>

                  </div>
                )}

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
      <section id="programma" className="bg-black py-20 px-4 sm:px-8 border-b-2 border-zinc-900">
        <div className="max-w-7xl mx-auto">
          
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
              <div key={idx} className="bg-zinc-950 border-2 border-zinc-900 p-6 flex flex-col justify-between text-left relative overflow-hidden group hover:border-brand-fuchsia/40 transition-colors">
                
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
                  <div className="bg-black text-brand-fuchsia rounded-none p-1 shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
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
            <div className="bg-brand-fuchsia border-4 border-black p-8 sm:p-10 flex flex-col justify-between h-[360px] text-left select-none relative shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-sm">
              <div className="border-b-2 border-black pb-4">
                <span className="font-mono text-[10px] text-black uppercase tracking-widest font-black">SOCIALEE POSTULATO</span>
              </div>
              
              <div className="my-6">
                <p className="font-display font-black text-4xl text-black tracking-tight leading-none uppercase m-0">SE NON LO</p>
                <p className="font-display font-black text-4xl text-black tracking-tight leading-none uppercase m-0">USI BENE,</p>
                <p className="font-display font-black text-4xl text-zinc-950 tracking-tight leading-none uppercase m-0">L’AI RESTA</p>
                <p className="font-display font-black text-4xl text-white tracking-tight leading-none uppercase m-0">SOLO UN</p>
                <p className="font-display font-black text-4xl text-white tracking-tight leading-none uppercase m-0">GIOCO.</p>
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
      <section className="bg-brand-dark py-20 px-4 sm:px-8 border-b-2 border-zinc-900">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
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

          {/* Core team profile cards row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {TEAM_MEMBERS.map((member, idx) => (
              <div key={idx} className="bg-white border-2 border-black p-4 flex flex-col justify-between hover:shadow-[6px_6px_0px_0px_rgba(255,0,127,1)] transition-all duration-300">
                <div>
                  {/* Team image wrapper */}
                  <div className="w-full aspect-square border-2 border-black overflow-hidden mb-4 bg-zinc-100">
                    <img 
                      src={member.fotoUrl} 
                      alt={member.nome}
                      className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  
                  {/* Mini visual border banner */}
                  <span className="font-mono text-[9px] font-bold text-brand-fuchsia uppercase tracking-wider bg-black text-white px-2 py-0.5 inline-block mb-2">
                    {member.ruolo}
                  </span>

                  <h3 className="font-display font-black text-lg uppercase tracking-tight text-black m-0 mb-2">
                    {member.nome}
                  </h3>
                  
                  <p className="text-zinc-650 text-xs leading-relaxed m-0">
                    {member.descrizione}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-4">
            <a 
              href="#registrati" 
              className="inline-block bg-zinc-950 hover:bg-brand-fuchsia text-white hover:text-black font-display font-bold text-xs uppercase tracking-wider px-8 py-4 border-2 border-zinc-900 transition-all text-center uppercase"
            >
              Vuoi conoscerci dal vivo? Richiedi il tuo posto
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

          {/* Social Proof Progress Bar towards limit */}
          <div className="bg-zinc-950 border-2 border-zinc-900 p-6 max-w-xl mx-auto mb-10 text-left">
            <div className="flex justify-between items-center mb-2.5">
              <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">STATATO REGISTRAZIONI IMPRENDITORI</span>
              <span className="text-xs font-mono font-bold text-brand-fuchsia uppercase bg-brand-fuchsia/10 px-2 py-0.5 border border-brand-fuchsia/20">
                {leads.length + 61} / 100 REGISTRATI
              </span>
            </div>
            
            {/* Visual Progress Bar */}
            <div className="w-full h-3 bg-zinc-900 border border-zinc-800 overflow-hidden relative">
              <div 
                className="absolute top-0 left-0 h-full bg-brand-fuchsia transition-all duration-1000" 
                style={{ width: `${registrationProgress}%` }}
              ></div>
            </div>
            
            <p className="text-[10px] font-mono text-zinc-500 mt-2.5 uppercase leading-relaxed m-0 text-center">
              Posti rimasti liberi per l'aperitivo: massimo {100 - (leads.length + 61)}. Affrettati prima dell'esaurimento!
            </p>
          </div>

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
                RICHIEDI IL TUO POSTO GRATUITO.
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
                  <span>Lunedì 22 Giugno, Ore 18:00</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-brand-fuchsia shrink-0" />
                  <span>Presenza Fisica (Zona Centro)</span>
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
            <div className="w-full max-w-xl bg-white border-4 border-black p-6 sm:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-left">
              
              {!formSubmitted ? (
                <form onSubmit={handleFormSubmit} className="flex flex-col gap-5">
                  <div className="border-b-2 border-zinc-100 pb-3">
                    <p className="font-display font-black text-xl uppercase tracking-tight text-black m-0">MODULO REGISTRAZIONE</p>
                    <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mt-1 m-0">Seleziona e compila accuratamente</p>
                  </div>

                  {errorMsg && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-3.5 text-xs text-red-700 font-mono">
                      {errorMsg}
                    </div>
                  )}

                  {/* Name Fields Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <label className="font-mono text-[10px] font-bold text-zinc-700 uppercase tracking-wider mb-1">
                        Nome *
                      </label>
                      <input 
                        type="text" 
                        required
                        value={formData.nome}
                        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                        className="p-3 bg-zinc-50 border-2 border-black font-sans text-sm focus:bg-white focus:outline-none focus:border-brand-fuchsia transition-all text-black"
                        placeholder="Es. Mario"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="font-mono text-[10px] font-bold text-zinc-700 uppercase tracking-wider mb-1">
                        Cognome *
                      </label>
                      <input 
                        type="text" 
                        required
                        value={formData.cognome}
                        onChange={(e) => setFormData({ ...formData, cognome: e.target.value })}
                        className="p-3 bg-zinc-50 border-2 border-black font-sans text-sm focus:bg-white focus:outline-none focus:border-brand-fuchsia transition-all text-black"
                        placeholder="Es. Rossi"
                      />
                    </div>
                  </div>

                  {/* Contact Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <label className="font-mono text-[10px] font-bold text-zinc-700 uppercase tracking-wider mb-1">
                        Indirizzo Email *
                      </label>
                      <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="p-3 bg-zinc-50 border-2 border-black font-sans text-sm focus:bg-white focus:outline-none focus:border-brand-fuchsia transition-all text-black"
                        placeholder="mario.rossi@azienda.it"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="font-mono text-[10px] font-bold text-zinc-700 uppercase tracking-wider mb-1">
                        Cellulare / Telefono *
                      </label>
                      <input 
                        type="tel" 
                        required
                        value={formData.telefono}
                        onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                        className="p-3 bg-zinc-50 border-2 border-black font-sans text-sm focus:bg-white focus:outline-none focus:border-brand-fuchsia transition-all text-black"
                        placeholder="Es. 3331234567"
                      />
                    </div>
                  </div>

                  {/* Company credentials */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <label className="font-mono text-[10px] font-bold text-zinc-700 uppercase tracking-wider mb-1">
                        Nome Attività / Azienda *
                      </label>
                      <input 
                        type="text" 
                        required
                        value={formData.azienda}
                        onChange={(e) => setFormData({ ...formData, azienda: e.target.value })}
                        className="p-3 bg-zinc-50 border-2 border-black font-sans text-sm focus:bg-white focus:outline-none focus:border-brand-fuchsia transition-all text-black"
                        placeholder="Es. Bistrot 19"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="font-mono text-[10px] font-bold text-zinc-700 uppercase tracking-wider mb-1">
                        Città dell'attività *
                      </label>
                      <input 
                        type="text" 
                        required
                        value={formData.citta}
                        onChange={(e) => setFormData({ ...formData, citta: e.target.value })}
                        className="p-3 bg-zinc-50 border-2 border-black font-sans text-sm focus:bg-white focus:outline-none focus:border-brand-fuchsia transition-all text-black"
                        placeholder="Es. Milano"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Sectors */}
                    <div className="flex flex-col">
                      <label className="font-mono text-[10px] font-bold text-zinc-700 uppercase tracking-wider mb-1">
                        Settore commerciale *
                      </label>
                      <select 
                        value={formData.settore}
                        onChange={(e) => setFormData({ ...formData, settore: e.target.value })}
                        className="p-3 bg-zinc-50 border-2 border-black font-sans text-sm focus:bg-white focus:outline-none focus:border-brand-fuchsia transition-all text-black"
                      >
                        <option value="Ristorazione">Ristorazione &amp; Food &amp; Beverage</option>
                        <option value="Beauty">Estetica &amp; Beauty &amp; Benessere</option>
                        <option value="Negozi">Abbigliamento &amp; Commercio Locale</option>
                        <option value="Professionale">Consulenti, Studi &amp; Professionisti</option>
                        <option value="Startup">PMI &amp; Startup Innovative</option>
                        <option value="Altro">Altro Settore Business</option>
                      </select>
                    </div>

                    {/* Role */}
                    <div className="flex flex-col">
                      <label className="font-mono text-[10px] font-bold text-zinc-700 uppercase tracking-wider mb-1">
                        Tuo Ruolo Aziendale *
                      </label>
                      <input 
                        type="text" 
                        required
                        value={formData.ruolo}
                        onChange={(e) => setFormData({ ...formData, ruolo: e.target.value })}
                        className="p-3 bg-zinc-50 border-2 border-black font-sans text-sm focus:bg-white focus:outline-none focus:border-brand-fuchsia transition-all text-black"
                        placeholder="Es. Titolare, Responsabile, CEO"
                      />
                    </div>
                  </div>

                  {/* Additional Question Textarea */}
                  <div className="flex flex-col">
                    <label className="font-mono text-[10px] font-bold text-zinc-700 uppercase tracking-wider mb-1">
                      Che cosa vorresti migliorare nella tua comunicazione?
                    </label>
                    <textarea 
                      value={formData.miglioramento}
                      onChange={(e) => setFormData({ ...formData, miglioramento: e.target.value })}
                      className="p-3 bg-zinc-50 border-2 border-black font-sans text-sm focus:bg-white focus:outline-none focus:border-brand-fuchsia transition-all text-black min-h-[80px]"
                      placeholder="Es. Vorrei velocizzare la creazione dei testi per i post e trovare formati di locandine piú efficaci."
                    />
                  </div>

                  {/* Consenso Privacy Checklist */}
                  <div className="flex flex-col gap-2 pt-2 border-t border-zinc-150">
                    <label className="flex items-start gap-2.5 text-xs text-zinc-600 select-none cursor-pointer">
                      <input 
                        type="checkbox" 
                        required
                        checked={formData.consensoPrivacy}
                        onChange={(e) => setFormData({ ...formData, consensoPrivacy: e.target.checked })}
                        className="mt-0.5 w-4.5 h-4.5 border-2 border-black checked:bg-brand-fuchsia text-brand-fuchsia accent-brand-fuchsia"
                      />
                      <span className="leading-tight text-[11px]">
                        Accetto il trattamento dei miei recapiti per la gestione operativa e conferma d'invito all'evento in base alla Privacy Policy. *
                      </span>
                    </label>

                    <label className="flex items-start gap-2.5 text-xs text-zinc-650 select-none cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={formData.consensoMarketing}
                        onChange={(e) => setFormData({ ...formData, consensoMarketing: e.target.checked })}
                        className="mt-0.5 w-4.5 h-4.5 border-2 border-black checked:bg-brand-fuchsia text-brand-fuchsia accent-brand-fuchsia"
                      />
                      <span className="leading-tight text-[11px]">
                        Facoltativo: acconsento ad essere ricontattato in futuro da Socialee via WhatsApp ed email per aggiornamenti ed approfondimenti strategici commerciali.
                      </span>
                    </label>
                  </div>

                  <button 
                    type="submit"
                    className="bg-zinc-950 hover:bg-brand-fuchsia hover:text-black text-white hover:shadow-none transition-all duration-300 font-display font-black text-sm uppercase tracking-widest px-8 py-4 border-2 border-black shadow-[4px_4px_0px_0px_rgba(255,0,127,1)] select-none text-center cursor-pointer"
                  >
                    Richiedi il mio posto gratuito
                  </button>
                </form>
              ) : (
                <div className="text-center py-10 flex flex-col items-center">
                  <div className="bg-brand-fuchsia text-black w-14 h-14 flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  
                  <h3 className="font-display font-black text-2xl uppercase tracking-tight text-black mb-4">
                    Richiesta ricevuta con successo!
                  </h3>
                  
                  <p className="text-zinc-700 text-sm leading-relaxed max-w-md mx-auto mb-8">
                    Ti contatteremo rapidamente nei prossimi giorni per confermare la tua effettiva partecipazione all’evento. I posti sono strettamente limitati a 100 ed assegnati in base all’ordine di registrazione e alla coerenza del profilo imprenditoriale con il format proposto.
                  </p>

                  <div className="bg-zinc-50 border-2 border-dashed border-zinc-300 p-5 w-full text-left font-mono text-xs text-zinc-600 mb-6 rounded-none">
                    <p className="font-bold text-black border-b border-zinc-200 pb-2 mb-2 uppercase tracking-wide">RIEPILOGO RAGISTRATO:</p>
                    <p className="mb-1"><span className="text-zinc-400">Titolare:</span> {formData.nome} {formData.cognome}</p>
                    <p className="mb-1"><span className="text-zinc-400">Azienda:</span> {formData.azienda}</p>
                    <p className="mb-1"><span className="text-zinc-400">Settore:</span> {formData.settore}</p>
                    <p className="mb-1"><span className="text-zinc-400">Email:</span> {formData.email}</p>
                    <p className="m-0"><span className="text-zinc-400">Telefono:</span> {formData.telefono}</p>
                  </div>

                  <button 
                    onClick={() => {
                      setFormData({
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
                      setFormSubmitted(false);
                    }}
                    className="font-mono text-xs font-black text-zinc-500 hover:text-black uppercase tracking-wider border-b border-zinc-300 hover:border-black transition-colors"
                  >
                    Registra un altro nominativo / correggi
                  </button>
                </div>
              )}

            </div>
          </div>

        </div>
      </section>

      {/* ADMIN CONTROLLER DASHBOARD TRIGGER / PERSISTENCE PORTAL */}
      <section className="bg-zinc-950 border-t border-zinc-900 py-8 px-4 sm:px-8 text-center">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-wider m-0">
            STRUMENTI EVENTO • PERSISTENZA INTEGRATA DEI CANDIDATI IN TEMPO REALE
          </p>
          
          <button 
            onClick={() => setShowAdmin(!showAdmin)}
            className="bg-zinc-900 hover:bg-white text-zinc-400 hover:text-black px-4 py-2 text-[10px] font-mono uppercase tracking-widest border border-zinc-800 transition-colors flex items-center gap-1.5"
          >
            <Key className="w-3.5 h-3.5" />
            {showAdmin ? 'Nascondi Pannello Registrati' : 'Accedi al Registro Lead'}
          </button>
        </div>

        {/* Dynamic Admin Container */}
        {showAdmin && (
          <div className="max-w-7xl mx-auto mt-6 text-left border-2 border-zinc-800 p-6 bg-black">
            {!isAdminAuthenticated ? (
              <form onSubmit={handleAdminLogin} className="max-w-md mx-auto py-8">
                <h4 className="font-display font-extrabold text-lg uppercase tracking-tight text-white mb-2">
                  ACCESSO AMMINISTRATORE SOCIALEE
                </h4>
                <p className="text-zinc-500 text-xs leading-relaxed mb-6">
                  Inserisci la chiave d'accesso dell'agenzia per analizzare i lead registrati, confermare gli accrediti, esportare e testare il flusso. Sblocca usando la chiave predefinita <code className="bg-zinc-900 px-1 py-0.5 text-brand-fuchsia text-xs font-mono font-bold">admin</code>.
                </p>

                {adminError && (
                  <p className="text-red-500 text-xs font-mono mb-4">{adminError}</p>
                )}

                <div className="flex gap-2 items-center">
                  <input 
                    type="password" 
                    placeholder="Chiave d'accesso..."
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="bg-zinc-900 text-white p-3 border border-zinc-800 focus:outline-none focus:border-brand-fuchsia text-xs font-mono shrink-0 flex-1"
                  />
                  <button 
                    type="submit"
                    className="bg-brand-fuchsia hover:bg-white hover:text-black text-black px-5 py-3 text-xs font-display font-black uppercase tracking-wider shrink-0"
                  >
                    Sblocca Registro
                  </button>
                </div>
              </form>
            ) : (
              <div>
                {/* Admin Header with actions */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-zinc-900 pb-5 mb-6 gap-4">
                  <div>
                    <h4 className="font-display font-black text-xl uppercase tracking-tight text-white m-0">REGISTRO CANDIDATI IMPRENDITORI</h4>
                    <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-wider mt-1 m-0">
                      Totale Richieste: {leads.length} • Approvate: {confirmedLeadsCount} • Capacità Massima: 100
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2.5">
                    <button 
                      onClick={addSampleLead}
                      className="bg-zinc-900 hover:bg-zinc-800 text-white text-[10px] font-mono uppercase tracking-widest px-3 py-2 border border-zinc-800 flex items-center gap-1 shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Inietta Campione
                    </button>

                    <button 
                      onClick={exportCSV}
                      className="bg-zinc-900 hover:bg-zinc-800 text-white text-[10px] font-mono uppercase tracking-widest px-3 py-2 border border-zinc-800 flex items-center gap-1 shrink-0"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Esporta CSV
                    </button>
                    
                    <button 
                      onClick={() => setIsAdminAuthenticated(false)}
                      className="bg-red-950/40 hover:bg-red-900/50 text-red-400 text-[10px] font-mono uppercase tracking-widest px-3 py-2 border border-red-900/40 shrink-0"
                    >
                      Blocca Registro
                    </button>
                  </div>
                </div>

                {/* Dashboard statistics panel */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-zinc-950 p-4 border border-zinc-900">
                    <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest leading-none mb-2">Tasso di Riempimento</p>
                    <p className="text-2xl font-display font-black text-brand-fuchsia">{registrationProgress}%</p>
                    <p className="text-[9px] font-mono text-zinc-650 uppercase mt-1 leading-tight">Proiettati {leads.length + 61} / 100</p>
                  </div>

                  <div className="bg-zinc-950 p-4 border border-zinc-900">
                    <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest leading-none mb-2">In Attesa d'Incontro</p>
                    <p className="text-2xl font-display font-black text-white">
                      {leads.filter(l => l.status === 'pending').length}
                    </p>
                    <p className="text-[9px] font-mono text-zinc-650 uppercase mt-1 leading-tight">Da richiamare per accordo</p>
                  </div>

                  <div className="bg-zinc-950 p-4 border border-zinc-900">
                    <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest leading-none mb-2">Accrediti Confermati</p>
                    <p className="text-2xl font-display font-black text-emerald-500">
                      {confirmedLeadsCount}
                    </p>
                    <p className="text-[9px] font-mono text-zinc-650 uppercase mt-1 leading-tight">Posti garantiti all'aperitivo</p>
                  </div>

                  <div className="bg-zinc-950 p-4 border border-zinc-900">
                    <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest leading-none mb-2">Consenso Marketing</p>
                    <p className="text-2xl font-display font-black text-zinc-300">
                      {leads.filter(l => l.consensoMarketing).length}
                    </p>
                    <p className="text-[9px] font-mono text-zinc-650 uppercase mt-1 leading-tight">Contattabili post-evento</p>
                  </div>
                </div>

                {/* Table representation of leads */}
                {leads.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-zinc-900">
                    <p className="font-mono text-xs text-zinc-500 uppercase">La lista è vuota. Registrati dal form in alto per alimentare la coda.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto border border-zinc-900">
                    <table className="w-full text-left font-mono text-xs border-collapse">
                      <thead>
                        <tr className="bg-zinc-950 text-zinc-400 border-b border-zinc-900 uppercase">
                          <th className="p-3">Imprenditore</th>
                          <th className="p-3">Azienda / Città</th>
                          <th className="p-3">Settore / Ruolo</th>
                          <th className="p-3">Contatti</th>
                          <th className="p-3">Richiesta di Miglioramento</th>
                          <th className="p-3 text-center">Stato</th>
                          <th className="p-3 text-right">Azioni CODA</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-900">
                        {leads.map((lead) => (
                          <tr key={lead.id} className="hover:bg-zinc-950/40 transition-colors">
                            <td className="p-3 font-semibold text-white">
                              {lead.nome} {lead.cognome}
                            </td>
                            <td className="p-3">
                              <div>{lead.azienda}</div>
                              <div className="text-[10px] text-zinc-500">{lead.citta}</div>
                            </td>
                            <td className="p-3">
                              <div>{lead.settore}</div>
                              <div className="text-[10px] text-zinc-500">{lead.ruolo}</div>
                            </td>
                            <td className="p-3 text-[11px]">
                              <div>{lead.email}</div>
                              <div className="text-zinc-400">{lead.telefono}</div>
                            </td>
                            <td className="p-3 text-[11px] text-zinc-400 max-w-xs break-words">
                              {lead.miglioramento || <span className="text-zinc-700 italic">Non compilato</span>}
                            </td>
                            <td className="p-3 text-center">
                              {lead.status === 'confirmed' && (
                                <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 px-2 py-0.5 text-[9px] uppercase font-bold">
                                  Confermato
                                </span>
                              )}
                              {lead.status === 'pending' && (
                                <span className="bg-amber-500/10 text-amber-500 border border-amber-500/30 px-2 py-0.5 text-[9px] uppercase font-bold">
                                  In Attesa
                                </span>
                              )}
                              {lead.status === 'cancelled' && (
                                <span className="bg-red-500/10 text-red-500 border border-red-500/30 px-2 py-0.5 text-[9px] uppercase font-bold">
                                  Respinto
                                </span>
                              )}
                            </td>
                            <td className="p-3 text-right">
                              <div className="flex gap-1 justify-end">
                                <button
                                  onClick={() => updateLeadStatus(lead.id, 'confirmed')}
                                  title="Conferma registrazione"
                                  className={`p-1.5 border ${lead.status === 'confirmed' ? 'bg-emerald-500 text-black border-emerald-500' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'}`}
                                >
                                  Accetta
                                </button>
                                <button
                                  onClick={() => updateLeadStatus(lead.id, 'cancelled')}
                                  title="Annulla registrazione"
                                  className={`p-1.5 border ${lead.status === 'cancelled' ? 'bg-red-500 text-black border-red-500' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'}`}
                                >
                                  Respingi
                                </button>
                                <button
                                  onClick={() => deleteLead(lead.id)}
                                  title="Elimina definitivo"
                                  className="p-1.5 bg-zinc-950 border border-zinc-950 text-zinc-600 hover:text-red-500 transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </section>

      {/* FOOTER SECTION */}
      <footer className="bg-black text-zinc-400 py-16 px-4 sm:px-8 border-t-2 border-zinc-950">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-stretch gap-10">
          
          {/* Logo Brand Statement */}
          <div className="md:w-3/5 flex flex-col items-start text-left justify-between lg:pr-12">
            <div>
              <a href="#" className="flex items-center gap-1 font-display font-black text-2xl tracking-tight text-white mb-4 select-none">
                SOCIALEE<span className="text-brand-fuchsia">.</span>
              </a>
              <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed max-w-md m-0">
                Socialee è una premium social tech company specializzata nella strutturazione e ingegnerizzazione della comunicazione digitale ed azioni orientate esclusivamente a portare clienti ad industrie complesse, PMI territoriali e startup ad alta crescita.
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
                <span className="cursor-pointer text-zinc-500 hover:text-white transition-colors">Privacy Policy</span>
                <span className="cursor-pointer text-zinc-500 hover:text-white transition-colors">Cookie Policy</span>
                <span className="cursor-pointer text-zinc-500 hover:text-white transition-colors">Termini Registrazione</span>
                <span className="cursor-pointer text-zinc-500 hover:text-white transition-colors">Contatti Agenzia</span>
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

    </div>
  );
}
