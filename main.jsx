import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import App from './App'
import { DemoProvider } from './context/DemoContext'
import { ToastProvider } from './components/Toast'
import './styles/global.css'

// Hash routing is used for single-file/static hosting builds (VITE_HASH_ROUTER=true).
const Router = import.meta.env.VITE_HASH_ROUTER === 'true' ? HashRouter : BrowserRouter

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <DemoProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </DemoProvider>
    </Router>
  </StrictMode>,
)
