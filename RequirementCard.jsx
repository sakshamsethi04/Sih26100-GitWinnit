import StatusBadge from './StatusBadge'

export default function RequirementCard({ req, status, actions }) {
  const na = req.category === 'Not Applicable'
  return (
    <div className={`req-card${na ? ' is-na' : ''}`}>
      <div className="req-id">{req.id}</div>
      <div>
        <div className="row wrap" style={{ gap: 8 }}>
          <span className="req-title">{req.title}</span>
          <StatusBadge status={req.category} tone={req.category === 'Mandatory' ? 'info' : 'muted'} icon={false} />
        </div>
        <p className="muted mt-8" style={{ maxWidth: '72ch' }}>{req.criterion}</p>
        <div className="req-meta">
          <div><div className="k">Evidence</div>{req.evidence}</div>
          {req.threshold && <div><div className="k">Threshold</div>{req.threshold}</div>}
          <div><div className="k">Verification</div>{req.source}</div>
          <div><div className="k">Tender clause</div>{req.clause}</div>
        </div>
      </div>
      <div className="req-side">
        {status && <StatusBadge status={status} />}
        {actions}
      </div>
    </div>
  )
}
