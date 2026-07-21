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

// JavaScript
import './assets/js/jquery-3.7.1.min.js';
import './assets/js/bootstrap.bundle.min.js';
import './assets/js/jquery.nice-select.min.js';
import './assets/js/odometer.min.js';
import './assets/js/jquery.appear.min.js';
import './assets/js/swiper-bundle.min.js';
import './assets/js/jquery.meanmenu.min.js';
import './assets/js/jquery.magnific-popup.min.js';
import './assets/js/wow.min.js';
import './assets/js/gsap.min.js';
import './assets/js/ScrollTrigger.min.js';
import './assets/js/SplitText.min.js';
import './assets/js/splitType.js';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
