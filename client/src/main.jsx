import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './assets/css/bootstrap.min.css';
import './assets/css/font-awesome.css';
import './assets/css/animate.css';
import './assets/css/magnific-popup.css';
import './assets/css/meanmenu.css';
import './assets/css/odometer.css';
import './assets/css/swiper-bundle.min.css';
import './assets/css/nice-select.css';
import './assets/css/icomon.css';
import './assets/css/main.css';

import App from './App.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
