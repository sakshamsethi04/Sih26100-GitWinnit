import { AlertTriangle, CheckCircle2, CircleDot, MinusCircle, XCircle } from 'lucide-react'
import { toneOf } from '../utils/format'

const ICONS = { ok: CheckCircle2, warn: AlertTriangle, fail: XCircle, muted: MinusCircle, info: CircleDot }

export default function StatusBadge({ status, tone, icon = true }) {
  const t = tone || toneOf(status)
  const Icon = ICONS[t]
  return (
    <span className={`badge tone-${t}`}>
      {icon && <Icon aria-hidden="true" />}
      {status}
    </span>
  )
}

export function RiskBadge({ level }) {
  return <StatusBadge status={level} icon={false} />
}
