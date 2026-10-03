import { Inbox, Loader2 } from 'lucide-react'

export default function EmptyState({ icon: Icon = Inbox, title, text, action }) {
  return (
    <div className="empty">
      <Icon aria-hidden="true" />
      <h3>{title}</h3>
      {text && <p style={{ maxWidth: 420 }}>{text}</p>}
      {action && <div className="mt-8">{action}</div>}
    </div>
  )
}

export function Loading({ label = 'Loading…' }) {
  return (
    <div className="loading" role="status">
      <Loader2 className="spin" size={18} aria-hidden="true" />
      {label}
    </div>
  )
}
