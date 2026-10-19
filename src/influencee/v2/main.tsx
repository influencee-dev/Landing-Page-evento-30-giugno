import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import SiteV2 from './App';
import '../../index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SiteV2 />
  </StrictMode>,
);
