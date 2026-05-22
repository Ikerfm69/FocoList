import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'       // CSS de Bootstrap 5
import 'bootstrap/dist/js/bootstrap.bundle.min.js'  // JS de Bootstrap (Modales, etc.)
import 'bootstrap-icons/font/bootstrap-icons.css'   // Iconos oficiales
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
