import type { LeadPayload } from './lead';

export type FieldName = keyof LeadPayload;
export type FieldErrors = Partial<Record<FieldName, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// Numeri italiani e internazionali: cifre, spazi, +, -, parentesi, punti; 8–15 cifre
const PHONE_CHARS_RE = /^[+()\d\s.-]+$/;

export function validateField(name: FieldName, values: LeadPayload): string | undefined {
  switch (name) {
    case 'name': {
      const v = values.name.trim();
      if (!v) return 'Inserisci nome e cognome.';
      if (v.length < 3 || !/\s/.test(v)) return 'Inserisci sia il nome sia il cognome.';
      return undefined;
    }
    case 'email': {
      const v = values.email.trim();
      if (!v) return "Inserisci l'indirizzo email.";
      if (!EMAIL_RE.test(v)) return 'Inserisci un indirizzo email valido, ad esempio nome@dominio.it.';
      return undefined;
    }
    case 'phone': {
      const v = values.phone.trim();
      if (!v) return 'Inserisci un numero di telefono.';
      const digits = v.replace(/\D/g, '');
      if (!PHONE_CHARS_RE.test(v) || digits.length < 8 || digits.length > 15)
        return 'Inserisci un numero di telefono valido.';
      return undefined;
    }
    case 'city':
      return values.city.trim().length < 2 ? 'Indica la città o la provincia di interesse.' : undefined;
    case 'investment':
      return values.investment ? undefined : "Seleziona la disponibilità di investimento.";
    case 'message':
      return values.message.length > 2000 ? 'Il messaggio può contenere al massimo 2000 caratteri.' : undefined;
    case 'privacyConsent':
      return values.privacyConsent ? undefined : "Per inviare la richiesta è necessario accettare l'informativa privacy.";
  }
}

export const fieldOrder: FieldName[] = ['name', 'email', 'phone', 'city', 'investment', 'message', 'privacyConsent'];

export function validateAll(values: LeadPayload): FieldErrors {
  const errors: FieldErrors = {};
  for (const name of fieldOrder) {
    const error = validateField(name, values);
    if (error) errors[name] = error;
  }
  return errors;
}
