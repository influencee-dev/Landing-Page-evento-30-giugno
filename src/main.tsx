import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import RowsGallery from './rows/RowsGallery.tsx';
import {InfluenceeGallery, InfluenceeHome} from './influencee/Gallery.tsx';
import './index.css';

// Routing minimale via query string:
//   /?influencee        → gallery row Influencee (design system unificato)
//   /?influencee=home   → home Influencee composta con le row
//   /?rows              → libreria row di reference (fase 1)
//   /                   → landing evento attuale
const params = new URLSearchParams(window.location.search);
const influencee = params.get('influencee');

function Root() {
  if (influencee === 'home') return <InfluenceeHome />;
  if (influencee !== null) return <InfluenceeGallery />;
  if (params.has('rows')) return <RowsGallery />;
  return <App />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);
