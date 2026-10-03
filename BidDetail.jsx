import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, ShieldCheck } from 'lucide-react'
import DataTable from '../../components/DataTable'
import StatusBadge from '../../components/StatusBadge'
import { ScoreRing } from '../../components/Charts'
import { summarise } from '../../context/DemoContext'
import { BidHeader, BidNotFound, useBidPage } from './bidShared'

const LABEL = { Satisfied: 'Verified', 'Not Satisfied': 'Not Satisfied', 'Review Required': 'Review Required', 'Not Applicable': 'Not Applicable', 'Clarification Requested': 'Clarification Requested' }
const RISK_TONE = { Low: 'ok', Medium: 'warn', High: 'fail' }

export function AssessmentHero({ bid, s }) {
  const tone = RISK_TONE[bid.risk]
  return (
    <div className="card summary-hero">
      <ScoreRing value={bid.compliance} size={120} />
      <div>
        <div className="small muted strong">Compliance assessment</div>
        <div style={{ fontSize: 17, fontWeight: 600, marginTop: 2 }}>{s.satisfied} of {s.total} requirements satisfied</div>
        <div className="summary-figures mt-12">
          <div><div className="k">Mandatory</div><div className="v num">{s.mandatory.satisfied} / {s.mandatory.total}</div></div>
          <div><div className="k">Optional</div><div className="v num">{s.optional.satisfied} / {s.optional.total}</div></div>
          <div><div className="k">Review required</div><div className="v num" style={{ color: s.review ? 'var(--amber)' : undefined }}>{s.review}</div></div>
          <div><div className="k">Not satisfied</div><div className="v num" style={{ color: s.failed ? 'var(--red)' : undefined }}>{s.failed}</div></div>
        </div>
      </div>
      <div className={`risk-box tone-${tone}`}><div className="k">Risk</div><div className="v">{bid.risk.toUpperCase()}</div></div>
    </div>
  )
}

export default function BidDetail() {
  const { tender, bid, requirements, id } = useBidPage()
  const navigate = useNavigate()
  if (!tender || !bid) return <BidNotFound id={id} />
  const s = summarise(bid, requirements)
  const base = `/officer/tenders/${tender.id}/bids/${bid.id}`

  const columns = [
    { key: 'id', header: 'ID', render: (r) => <span className="mono small">{r.id}</span>, width: 90 },
    { key: 'title', header: 'Requirement', render: (r) => <span className="cell-title">{r.title}</span> },
    { key: 'category', header: 'Type', render: (r) => <span className="small muted">{r.category}</span> },
    { key: 'source', header: 'Verification source', render: (r) => <span className="small">{r.source}</span> },
    { key: 'result', header: 'Result', render: (r) => <StatusBadge status={LABEL[r.result] || r.result} tone={r.result === 'Satisfied' ? 'ok' : undefined} /> },
    { key: 'go', header: '', align: 'right', render: () => <ArrowRight size={16} color="var(--muted)" /> },
  ]

  return (
    <>
      <BidHeader tender={tender} bid={bid} actions={<Link to={`${base}/verification`} className="btn btn-primary"><ShieldCheck />View Detailed Verification</Link>} />
      <AssessmentHero bid={bid} s={s} />
      <div className="grid-main mt-16">
        <div className="card">
          <div className="card-header"><h2>Requirement-wise results</h2><span className="small muted">Click a row to see evidence</span></div>
          <DataTable columns={columns} rows={s.rows} onRowClick={(r) => navigate(`${base}/compliance?req=${r.id}`)} />
        </div>
        <div className="stack">
          <div className="card">
            <div className="card-header"><h2>Bid details</h2></div>
            <div className="card-body kv">
              <div className="k">Bidder ID</div><div className="v mono">{bid.bidderId}</div>
              <div className="k">PAN</div><div className="v mono">{bid.pan}</div>
              <div className="k">Documents</div><div className="v">{bid.documents} uploaded</div>
              <div className="k">Submitted</div><div className="v">{bid.submitted}</div>
              <div className="k">Assessment</div><div className="v">03 Oct 2026, 15:38</div>
            </div>
          </div>
          {(s.review > 0 || s.failed > 0) && (
            <div className="card card-body">
              <div className="section-title">Items needing attention</div>
              <div className="stack" style={{ gap: 8 }}>
                {s.rows.filter((r) => r.result !== 'Satisfied' && r.result !== 'Not Applicable').map((r) => (
                  <Link key={r.id} to={`${base}/compliance?req=${r.id}`} className="row-between" style={{ color: 'var(--ink)' }}>
                    <span><span className="mono small muted">{r.id}</span> {r.title}</span>
                    <StatusBadge status={r.result} />
                  </Link>
                ))}
              </div>
            </div>
          )}
          <Link to={`${base}/review`} className="btn btn-secondary btn-block">Go to Officer Review</Link>
          <p className="ai-note">AI-assisted assessment. Final decision remains with Procurement Officer.</p>
        </div>
      </div>
    </>
  )
}
