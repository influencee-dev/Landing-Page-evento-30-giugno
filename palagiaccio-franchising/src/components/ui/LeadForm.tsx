import { useId, useRef, useState, type ChangeEvent, type FocusEvent, type FormEvent } from 'react';
import { contact, ctas, site } from '../../data/content';
import { investmentOptions } from '../../data/franchise';
import { isLeadEndpointConfigured, submitLead, type LeadPayload } from '../../lib/lead';
import { fieldOrder, validateAll, validateField, type FieldErrors, type FieldName } from '../../lib/validation';
import { AlertIcon, ArrowRight, CheckLine } from './Icons';

type Status = 'idle' | 'submitting' | 'sent' | 'preview' | 'error';

const initialValues: LeadPayload = {
  name: '',
  email: '',
  phone: '',
  city: '',
  investment: '',
  message: '',
  privacyConsent: false,
};

/**
 * Modulo di acquisizione lead.
 * - validazione client-side con messaggi leggibili (al blur e all'invio)
 * - prevenzione dei doppi invii
 * - nessun salvataggio locale né log dei dati personali
 * - senza endpoint configurato: "modalità anteprima", dichiarata esplicitamente
 */
export function LeadForm() {
  const uid = useId();
  const [values, setValues] = useState<LeadPayload>(initialValues);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const [status, setStatus] = useState<Status>('idle');
  const lockRef = useRef(false);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const id = (name: string) => `${uid}-${name}`;

  const setFieldError = (name: FieldName, next: LeadPayload) =>
    setErrors((prev) => ({ ...prev, [name]: validateField(name, next) }));

  const onChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = event.target;
    const key = name as FieldName;
    const nextValue = type === 'checkbox' ? (event.target as HTMLInputElement).checked : value;
    const next = { ...values, [key]: nextValue } as LeadPayload;
    setValues(next);
    if (status === 'preview' || status === 'error') setStatus('idle');
    // Dopo il primo errore, la correzione viene confermata mentre si scrive.
    if (touched[key] || errors[key]) setFieldError(key, next);
  };

  const onBlur = (event: FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const key = event.target.name as FieldName;
    setTouched((prev) => ({ ...prev, [key]: true }));
    setFieldError(key, values);
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (lockRef.current) return;

    const nextErrors = validateAll(values);
    setErrors(nextErrors);
    setTouched(Object.fromEntries(fieldOrder.map((f) => [f, true])));

    const firstInvalid = fieldOrder.find((f) => nextErrors[f]);
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    // Campo trappola per i bot: se compilato, la richiesta viene ignorata.
    if (honeypotRef.current?.value) return;

    lockRef.current = true;
    setStatus('submitting');
    const result = await submitLead({
      ...values,
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      city: values.city.trim(),
      message: values.message.trim(),
    });
    lockRef.current = false;

    if (result.status === 'sent') {
      setStatus('sent');
      setValues(initialValues);
      requestAnimationFrame(() => resultRef.current?.focus());
    } else if (result.status === 'preview') {
      setStatus('preview');
    } else {
      setStatus('error');
    }
  };

  if (status === 'sent') {
    return (
      <div ref={resultRef} tabIndex={-1} role="status" className="py-6 outline-none">
        <span className="flex h-14 w-14 items-center justify-center rounded-full border border-success text-success">
          <CheckLine />
        </span>
        <h3 className="t-h3 mt-6 text-ink">{contact.status.successTitle}</h3>
        <p className="mt-4 text-muted">{contact.status.successText}</p>
      </div>
    );
  }

  const errorCount = fieldOrder.filter((f) => touched[f] && errors[f]).length;
  const describedBy = (name: FieldName, extra?: string) =>
    [errors[name] && touched[name] ? id(`${name}-error`) : '', extra ?? ''].filter(Boolean).join(' ') || undefined;
  const invalid = (name: FieldName) => Boolean(touched[name] && errors[name]);

  const fieldError = (name: FieldName) =>
    invalid(name) ? (
      <p id={id(`${name}-error`)} className="field__error">
        <AlertIcon className="mt-0.5 shrink-0" />
        {errors[name]}
      </p>
    ) : null;

  const textField = (name: 'name' | 'email' | 'phone' | 'city', type: string, autoComplete: string, inputMode?: 'email' | 'tel') => (
    <div className="field">
      <label htmlFor={id(name)} className="field__label">
        {contact.fields[name]}
      </label>
      <input
        id={id(name)}
        name={name}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        required
        value={values[name]}
        onChange={onChange}
        onBlur={onBlur}
        aria-invalid={invalid(name)}
        aria-describedby={describedBy(name)}
        className="field__control"
        maxLength={name === 'email' ? 254 : 120}
      />
      {fieldError(name)}
    </div>
  );

  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} aria-labelledby={id('title')} className="relative">
      <h3 id={id('title')} className="t-label text-bordeaux">
        {contact.formTitle}
      </h3>
      <p className="mt-2 text-sm text-muted">{contact.requiredNote}</p>

      <div aria-live="polite" className="sr-only">
        {errorCount > 0 ? `${contact.status.invalidSummary} ${errorCount} da correggere.` : ''}
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {textField('name', 'text', 'name')}
        {textField('email', 'email', 'email', 'email')}
        {textField('phone', 'tel', 'tel', 'tel')}
        {textField('city', 'text', 'address-level2')}

        <div className="field sm:col-span-2">
          <label htmlFor={id('investment')} className="field__label">
            {contact.fields.investment}
          </label>
          <select
            id={id('investment')}
            name="investment"
            required
            value={values.investment}
            onChange={onChange}
            onBlur={onBlur}
            aria-invalid={invalid('investment')}
            aria-describedby={describedBy('investment')}
            className={`field__control ${values.investment ? '' : 'text-[#6b665f]'}`}
          >
            <option value="" disabled>
              {contact.fields.investmentPlaceholder}
            </option>
            {investmentOptions.map((opt) => (
              <option key={opt.value} value={opt.value} className="text-ink">
                {opt.label}
              </option>
            ))}
          </select>
          {fieldError('investment')}
        </div>

        <div className="field sm:col-span-2">
          <label htmlFor={id('message')} className="field__label">
            {contact.fields.message} <span className="optional">{contact.fields.messageOptional}</span>
          </label>
          <textarea
            id={id('message')}
            name="message"
            rows={4}
            value={values.message}
            onChange={onChange}
            onBlur={onBlur}
            maxLength={2000}
            aria-invalid={invalid('message')}
            aria-describedby={describedBy('message')}
            className="field__control"
          />
          {fieldError('message')}
        </div>

        {/* Campo trappola anti-spam, invisibile agli utenti e ai lettori di schermo */}
        <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
          <label htmlFor={id('website')}>Sito web</label>
          <input ref={honeypotRef} id={id('website')} name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <div className="sm:col-span-2">
          <div className="flex items-start gap-3.5">
            <input
              id={id('privacyConsent')}
              name="privacyConsent"
              type="checkbox"
              required
              checked={values.privacyConsent}
              onChange={onChange}
              onBlur={onBlur}
              aria-invalid={invalid('privacyConsent')}
              aria-describedby={describedBy('privacyConsent')}
              className="checkbox"
            />
            <label htmlFor={id('privacyConsent')} className="text-sm leading-relaxed text-ink/90">
              {contact.fields.privacyBefore}
              <a
                href={site.privacyUrl}
                target="_blank"
                rel="noopener"
                className="text-bordeaux underline decoration-bordeaux/40 underline-offset-2 hover:decoration-bordeaux"
              >
                {contact.fields.privacyLink}
                <span className="sr-only"> (si apre in una nuova scheda)</span>
              </a>
              {contact.fields.privacyAfter}
            </label>
          </div>
          <div className="mt-2 pl-[2.1rem]">
            {fieldError('privacyConsent')}
          </div>
        </div>
      </div>

      <div aria-live="polite" ref={resultRef} tabIndex={-1} className="outline-none">
        {status === 'preview' && (
          <div className="mt-8 border border-dashed border-[#c58a1c] bg-[#fff8e6] p-5 text-sm leading-relaxed text-[#5e3c00]">
            <p className="font-semibold">{contact.status.previewTitle}</p>
            <p className="mt-1">{contact.status.previewText}</p>
          </div>
        )}
        {status === 'error' && (
          <div role="alert" className="mt-8 border-l-2 border-error bg-[#fbeeee] p-5 text-sm leading-relaxed text-error">
            <p className="font-semibold">{contact.status.errorTitle}</p>
            <p className="mt-1">{contact.status.errorText}</p>
          </div>
        )}
      </div>

      <button
        type="submit"
        className="btn btn--block mt-8"
        disabled={status === 'submitting'}
        aria-disabled={status === 'submitting'}
      >
        <span>{status === 'submitting' ? contact.status.sending : ctas.submit}</span>
        {status === 'submitting' ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />
        ) : (
          <ArrowRight className="btn-arrow" />
        )}
      </button>

      <p className="mt-5 text-xs leading-relaxed text-muted">{contact.disclaimer}</p>

      {!isLeadEndpointConfigured && import.meta.env.DEV && (
        <p className="mt-4 text-[0.6875rem] uppercase tracking-[0.14em] text-[#7a4b00]">
          Sviluppo: VITE_LEAD_ENDPOINT non configurato → modalità anteprima
        </p>
      )}
    </form>
  );
}
