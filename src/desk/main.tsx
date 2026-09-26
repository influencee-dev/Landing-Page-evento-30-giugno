import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import DeskApp from './DeskApp';
import '../index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DeskApp />
  </StrictMode>,
);
