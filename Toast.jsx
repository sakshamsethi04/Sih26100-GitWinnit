import { createContext, useCallback, useContext, useState } from 'react'
import { AlertTriangle, CheckCircle2, Info } from 'lucide-react'

const ToastContext = createContext(() => {})
const ICONS = { ok: CheckCircle2, warn: AlertTriangle, info: Info }

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const push = useCallback((text, tone = 'ok') => {
    const id = Math.random().toString(36).slice(2)
    setToasts((t) => [...t, { id, text, tone }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3800)
  }, [])

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div className="toasts" aria-live="polite">
        {toasts.map((t) => {
          const Icon = ICONS[t.tone] || Info
          return (
            <div key={t.id} className={`toast ${t.tone}`}><Icon aria-hidden="true" /><span>{t.text}</span></div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
