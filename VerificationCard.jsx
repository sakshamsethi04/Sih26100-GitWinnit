import { Database } from 'lucide-react'
import StatusBadge from './StatusBadge'

export default function VerificationCard({ item }) {
  return (
    <div className="card source-card">
      <div className="card-body">
        <div className="row-between">
          <div className="row" style={{ gap: 8 }}>
            <Database size={16} color="var(--navy-700)" aria-hidden="true" />
            <span className="source-name">{item.name}</span>
          </div>
          <StatusBadge status={item.verdict} tone="ok" />
        </div>
        <div className="source-label mt-8">Source: {item.source}</div>
        <div className="strong mt-8">{item.result}</div>
        <div className="kv mt-8">
          {item.fields.map(([k, v]) => [
            <div key={`${k}-k`} className="k small">{k}</div>,
            <div key={`${k}-v`} className="v small mono">{v}</div>,
          ])}
        </div>
      </div>
      <div className="source-foot">
        <span>Demo verification response</span>
        <span className="num">{item.ms} ms</span>
      </div>
    </div>
  )
}
