import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles.css';
import './header.css';
import './hero.css';
import './frame-hero.css';
import './chemistry.css';
import './manufacturing.css';
import './closing-sections.css';
import './footer.css';
import './buttons.css';
import './typography.css';

createRoot(document.getElementById('root')).render(
  <StrictMode><App /></StrictMode>
);
