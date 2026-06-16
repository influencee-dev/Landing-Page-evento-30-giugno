import React from 'react';
import { X, Shield, ShieldCheck, Terminal, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'privacy' | 'cookie' | 'terms';
}

export const LegalModal: React.FC<LegalModalProps> = ({ isOpen, onClose, type }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop with elegant modern blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
          />

          {/* Modal Card body */}
          <motion.div
            initial={{ scale: 0.95, y: 15, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 15, opacity: 0 }}
            className="relative w-full max-w-2xl bg-white text-black border-4 border-black shadow-[8px_8px_0px_0px_rgba(255,0,255,1)] z-10 flex flex-col max-h-[85vh] overflow-hidden"
          >
            {/* Header branding & close */}
            <div className="bg-black text-white p-5 flex items-center justify-between border-b-4 border-black select-none">
              <div className="flex items-center gap-3">
                <div className="bg-brand-fuchsia text-black p-1.5 border border-black">
                  {type === 'privacy' ? <Shield className="w-5 h-5 font-bold" /> : <ShieldCheck className="w-5 h-5 font-bold" />}
                </div>
                <div>
                  <h3 className="font-display font-black text-sm sm:text-base uppercase tracking-tight m-0">
                    {type === 'privacy' && 'Informativa Privacy — GDPR'}
                    {type === 'cookie' && 'Cookie Policy — Uso dei Traccianti'}
                    {type === 'terms' && 'Termini di Registrazione'}
                  </h3>
                  <p className="font-mono text-[9px] text-zinc-400 uppercase tracking-widest leading-none mt-1 m-0">
                    Socialee Digital Tech S.r.l.
                  </p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="text-zinc-400 hover:text-brand-fuchsia transition-colors p-1 bg-zinc-900 border border-zinc-800 hover:border-brand-fuchsia cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Document Content */}
            <div className="p-6 overflow-y-auto text-sm leading-relaxed text-zinc-700 font-sans text-left space-y-6">
              {type === 'privacy' && (
                <>
                  <div className="border-b-2 border-zinc-100 pb-3">
                    <p className="font-mono text-[10px] font-bold text-brand-fuchsia uppercase tracking-wider mb-1 m-0">Ultimo aggiornamento: Giugno 2026</p>
                    <h4 className="font-display font-extrabold text-lg uppercase tracking-tight text-black m-0">1. CONTITOLARE E TITOLARE DEL TRATTAMENTO</h4>
                    <p className="mt-2 text-xs">
                      Il titolare del trattamento dei Suoi dati personali è <strong>Socialee Digital Tech S.r.l.</strong> con sede legale in Milano, P.IVA 10984830111, contattabile in qualsiasi momento per chiarimenti in ambito Privacy all'indirizzo email: <a href="mailto:influencee2019@gmail.com" className="text-brand-fuchsia underline font-semibold">influencee2019@gmail.com</a>.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-display font-extrabold text-base uppercase tracking-tight text-black mb-2">2. TIPOLOGIA DI DATI RACCOLTI</h4>
                    <p className="text-xs">
                      Attraverso la partecipazione all'evento ed i relativi canali telematici di accredito (compreso il modulo Brevo integrato in questa landing page), raccogliamo e trattiamo i seguenti dati personali:
                    </p>
                    <ul className="list-disc pl-5 mt-2 space-y-1.5 text-xs">
                      <li><strong>Dati identificativi e anagrafici:</strong> Nome, cognome, ruolo aziendale e nome dell'attività commerciale.</li>
                      <li><strong>Dati di contatto diretto:</strong> Indirizzo email e numero di telefono cellulare (utilizzati per le conferme dell'invito ed invio dettagli logistici).</li>
                      <li><strong>Informazioni di business aggiuntive:</strong> Settore commerciale dell'impresa di appartenenza, città, risposte libere agli interrogativi di miglioramento della comunicazione.</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-display font-extrabold text-base uppercase tracking-tight text-black mb-2">3. FINALITÀ DEL TRATTAMENTO E BASE GIURIDICA</h4>
                    <p className="text-xs">
                      I dati raccolti saranno trattati unicamente per le seguenti precise finalità leciti:
                    </p>
                    <ol className="list-decimal pl-5 mt-2 space-y-1.5 text-xs">
                      <li><strong>Gestione organizzativa ed accredito all'evento:</strong> Registrazione della candidatura, filtro selettivo in base ai 100 posti limitati e contatti telefonici/WhatsApp/email esclusivamente per la pianificazione e conferma strategica (Base giuridica: Esecuzione di misure precontrattuali o contrattuali).</li>
                      <li><strong>Adempimento ad obblighi di legge:</strong> Ottemperanza ad obblighi fiscali o normativi amministrativi (Base giuridica: Obbligo di legge).</li>
                      <li><strong>Comunicazioni informative e commerciali successive (FACOLTATIVO):</strong> Previo Suo esplicito e separato consenso facoltativo, Socialee potrà contattarLa eccezionalmente in futuro tramite WhatsApp, telefono o email per aggiornamenti di mercato, strategie ed innovazioni commerciali di comunicazione (Base giuridica: Consenso dell'interessato).</li>
                    </ol>
                  </div>

                  <div>
                    <h4 className="font-display font-extrabold text-base uppercase tracking-tight text-black mb-2">4. TEMPI DI CONVERSIONE E CONSERVAZIONE DEI DATI</h4>
                    <p className="text-xs">
                      I dati per l'operatività dell'evento saranno conservati per il tempo strettamente necessario a completare l'evento stesso e la successiva fase di debriefing (massimo 90 giorni). I dati relativi al consenso commerciale saranno trattati fino a revoca dello stesso da parte Sua, in ogni caso per un periodo non superiore a 24 mesi dalla registrazione.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-display font-extrabold text-base uppercase tracking-tight text-black mb-2">5. DIRITTI DELL'INTERESSATO</h4>
                    <p className="text-xs">
                      Ai sensi del Regolamento Europeo 679/2016 (GDPR), Lei ha il diritto in qualunque momento di:
                    </p>
                    <ul className="list-disc pl-5 mt-2 space-y-1.5 text-xs">
                      <li>Ottenere la cancellazione completa o la rettifica dei dati trattati inesatti (diritto all'oblio).</li>
                      <li>Revocare in qualsiasi istante il consenso precedentemente espresso per le comunicazioni di marketing.</li>
                      <li>Ottenere limitazione del trattamento o opporsi allo stesso per motivi legittimi.</li>
                    </ul>
                    <p className="mt-3 text-xs">
                      Per esercitare tali diritti, è sufficiente mandare un'email rapida e senza formalità all'indirizzo dedicato: <a href="mailto:influencee2019@gmail.com" className="text-brand-fuchsia underline font-semibold">influencee2019@gmail.com</a>. Provvederemo a dar seguito alla richiesta entro poche ore lavorative.
                    </p>
                  </div>
                </>
              )}

              {type === 'cookie' && (
                <>
                  <div className="border-b-2 border-zinc-100 pb-3">
                    <p className="font-mono text-[10px] font-bold text-brand-fuchsia uppercase tracking-wider mb-1 m-0">Ultimo aggiornamento: Giugno 2026</p>
                    <h4 className="font-display font-extrabold text-lg uppercase tracking-tight text-black m-0">COSA SONO I COOKIE</h4>
                    <p className="mt-2 text-xs">
                      I cookie sono piccoli file di testo che i siti internet salvano sul Suo browser o dispositivo mobile per migliorare l'esperienza di navigazione, ricordare preferenze di visualizzazione o consentire l'interazione interattiva fluida con tool esterni.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-display font-extrabold text-base uppercase tracking-tight text-black mb-2">1. COOKIE TECNICI ESSENZIALI (Sempre Attivi)</h4>
                    <p className="text-xs">
                      Questa tipologia è strettamente necessaria per erogare il servizio visualizzato in questa landing page. Senza di essi, il modulo di prenotazione Brevo (tramite iframe sicuro) o l'ottimizzazione del caricamento di caratteri e immagini non potrebbe funzionare. Non raccolgono informazioni di marketing.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-display font-extrabold text-base uppercase tracking-tight text-black mb-2">2. INTEGRAZIONI DI TERZE PARTI</h4>
                    <p className="text-xs">
                      Questa landing page include un modulo iframe generato da Brevo (Sendinblue) per consentire all'utente l'inserimento lecito dei contatti. Questo widget di terze parti potrebbe installare cookie tecnici o aggregati anonimi volti a prevenire spam e abusi sulla compilazione del modulo (misure reCAPTCHA o simili).
                    </p>
                  </div>

                  <div>
                    <h4 className="font-display font-extrabold text-base uppercase tracking-tight text-black mb-2">3. HOW TO CONTROL OR DELETE COOKIES</h4>
                    <p className="text-xs">
                      L'utente può regolare liberamente le impostazioni del proprio browser web per bloccare o cancellare i cookie. Di seguito i collegamenti alle istruzioni dei software più diffusi:
                    </p>
                    <ul className="list-disc pl-5 mt-2 space-y-1.5 text-xs">
                      <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-zinc-650 hover:text-brand-fuchsia underline">Google Chrome</a></li>
                      <li><a href="https://support.mozilla.org/it/kb/Attivare%20e%20disattivare%20i%20cookie" target="_blank" rel="noopener noreferrer" className="text-zinc-650 hover:text-brand-fuchsia underline">Mozilla Firefox</a></li>
                      <li><a href="https://support.apple.com/it-it/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-zinc-650 hover:text-brand-fuchsia underline">Apple Safari</a></li>
                    </ul>
                  </div>
                </>
              )}

              {type === 'terms' && (
                <>
                  <div className="border-b-2 border-zinc-100 pb-3">
                    <p className="font-mono text-[10px] font-bold text-brand-fuchsia uppercase tracking-wider mb-1 m-0">Ultimo aggiornamento: Giugno 2026</p>
                    <h4 className="font-display font-extrabold text-lg uppercase tracking-tight text-black m-0">CONDIZIONI DI PARTECIPAZIONE</h4>
                    <p className="mt-2 text-xs">
                      La partecipazione all'evento Aperitivo AI &amp; Networking organizzato da Socialee Digital Tech S.r.l. è regolata dai presenti termini e condizioni. La compilazione del modulo di candidatura costituisce piena accettazione degli stessi.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-display font-extrabold text-base uppercase tracking-tight text-black mb-2">1. REQUISITI E DESTINATARI</h4>
                    <p className="text-xs">
                      L'evento è indirizzato specificamente a titolari d'azienda, negozianti locali, direttori d'albergo, ristoratori, responsabili marketing, liberi professionisti e fondatori di startup operanti nel territorio di riferimento. L'organizzazione si riserva il diritto esclusivo di rifiutare o revocare registrazioni non in linea con il target professionale o che non presentino dati di contatto veritieri.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-display font-extrabold text-base uppercase tracking-tight text-black mb-2">2. SELEZIONE E DISPONIBILITÀ DEI POSTI</h4>
                    <p className="text-xs">
                      La disponibilità complessiva è fissata rigorosamente in <strong>100 posti massimi</strong> per tutelare l'interazione e la qualità del networking post-workshop. 
                      La candidatura inviata tramite il presente sito non garantisce l'accredito immediato. L'iscrizione è considerata approvata e confermata valida solo a fronte della ricezione di un messaggio di conferma esplicito (tramite email, colloquio telefonico o messaggio WhatsApp) da parte di un addetto appartenente allo staff legittimo di Socialee.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-display font-extrabold text-base uppercase tracking-tight text-black mb-2">3. GRATUITÀ E IMPEGNO DI PRESENZA</h4>
                    <p className="text-xs">
                      L'ingresso al workshop e l'aperitivo collegato sono interamente offerti da Socialee e non prevedono alcuna transazione economica per il partecipante selezionato. Trattandosi di posti molto limitati e aperti su invito selettivo, l'utente iscritto e confermato si impegna moralmente a garantire la propria presenza o, in caso di impedimento imprevisto sopravvenuto, a darne preavviso tempestivo (almeno 24 ore prima) per permettere lo scorrimento della coda e il recupero del posto a favore di altri candidati in lista d'attesa.
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Bottom Bar Close footer */}
            <div className="bg-zinc-50 p-4 border-t-2 border-black flex items-center justify-end select-none">
              <button
                onClick={onClose}
                className="bg-black hover:bg-brand-fuchsia hover:text-black text-white px-5 py-2.5 font-display font-black text-xs uppercase tracking-widest border-2 border-black shadow-[3px_3px_0px_0px_rgba(255,0,255,1)] hover:shadow-none transition-all cursor-pointer"
              >
                Ho Capito
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
