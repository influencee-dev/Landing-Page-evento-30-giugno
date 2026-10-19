import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/oxanium';
import '@fontsource-variable/inter';
import './index.css';
import App from './App';
import { creator } from './data/creator';
import { missingData } from './lib/format';

if (import.meta.env.DEV) {
  const missing = missingData(creator);
  if (missing.length) {
    console.info(
      `%c[Media kit] Dati da completare in src/data/creator.ts (${missing.length}):\n- ${missing.join('\n- ')}`,
      'color:#63DFF7',
    );
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
