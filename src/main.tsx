import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import RowsGallery from './rows/RowsGallery.tsx';
import './index.css';

// /?rows apre la gallery delle row del template, altrimenti la landing attuale.
const showRows = new URLSearchParams(window.location.search).has('rows');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {showRows ? <RowsGallery /> : <App />}
  </StrictMode>,
);
