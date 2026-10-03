import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

export default function Modal({ open, title, onClose, children, footer, width }) {
  const panel = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    const prev = document.activeElement
    panel.current?.querySelector('textarea, input, button:not(.icon-btn)')?.focus()
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('keydown', onKey); prev?.focus?.() }
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" ref={panel} style={width ? { maxWidth: width } : undefined}>
        <div className="modal-head">
          <h2 id="modal-title">{title}</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close"><X /></button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-foot">{footer}</div>}
      </div>
    </div>
  )
}

export function ConfirmDialog({ open, title, children, confirmLabel = 'Confirm', tone = 'primary', onConfirm, onCancel, busy }) {
  return (
    <Modal
      open={open}
      title={title}
      onClose={onCancel}
      footer={
        <>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
          <button type="button" className={`btn btn-${tone}`} onClick={onConfirm} disabled={busy}>{confirmLabel}</button>
        </>
      }
    >
      {children}
    </Modal>
  )
}
