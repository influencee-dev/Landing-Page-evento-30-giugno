export interface Participant {
  id: string;
  nome: string;
  cognome: string;
  email: string;
  telefono: string;
  azienda: string;
  settore: string;
  citta: string;
  ruolo: string;
  miglioramento?: string;
  consensoPrivacy: boolean;
  consensoMarketing: boolean;
  createdAt: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export interface TeamMember {
  nome: string;
  ruolo: string;
  descrizione: string;
  fotoUrl?: string;
  initials?: string;
}

export interface ServiceItem {
  titolo: string;
  descrizione: string;
}
