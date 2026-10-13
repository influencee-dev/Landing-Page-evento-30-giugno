/* ==========================================================================
   INTEGRAZIONE MODULO → BACKEND
   Unico punto da modificare per collegare il modulo a un endpoint reale
   (CRM, Make/Zapier webhook, API interna, ecc.).

   - L'endpoint si imposta con la variabile VITE_LEAD_ENDPOINT (.env).
   - Senza endpoint il modulo resta in "modalità anteprima": nessuna richiesta
     di rete parte e l'utente viene informato che i dati NON sono stati inviati.
   - I dati personali non vengono salvati in localStorage né scritti nei log.
   ========================================================================== */

export interface LeadPayload {
  name: string;
  email: string;
  phone: string;
  city: string;
  investment: string;
  message: string;
  privacyConsent: boolean;
}

export type LeadResult =
  | { status: 'sent' }
  | { status: 'preview' }
  | { status: 'error'; reason: 'network' | 'server' };

const ENDPOINT = (import.meta.env.VITE_LEAD_ENDPOINT as string | undefined)?.trim() ?? '';

export const isLeadEndpointConfigured = ENDPOINT.length > 0;

/** Raccoglie i parametri di campagna (utm_*, gclid, fbclid) dall'URL corrente. */
function getAttribution(): Record<string, string> {
  const params = new URLSearchParams(window.location.search);
  const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'];
  const out: Record<string, string> = {};
  for (const key of keys) {
    const value = params.get(key);
    if (value) out[key] = value.slice(0, 200);
  }
  return out;
}

export async function submitLead(payload: LeadPayload, signal?: AbortSignal): Promise<LeadResult> {
  if (!isLeadEndpointConfigured) {
    return { status: 'preview' };
  }

  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        ...payload,
        source: 'landing-franchising-palagiaccio',
        page: window.location.origin + window.location.pathname,
        submittedAt: new Date().toISOString(),
        attribution: getAttribution(),
      }),
      signal,
    });
    return response.ok ? { status: 'sent' } : { status: 'error', reason: 'server' };
  } catch {
    // Nessun log: l'errore potrebbe contenere dati della richiesta.
    return { status: 'error', reason: 'network' };
  }
}
