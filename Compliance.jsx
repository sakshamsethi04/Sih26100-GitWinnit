import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AlertTriangle, CheckCircle2, FileText, Info, MessageSquare, XCircle } from 'lucide-react'
import StatusBadge from '../../components/StatusBadge'
import Modal from '../../components/Modal'
import { Donut } from '../../components/Charts'
import { useToast } from '../../components/Toast'
import { evidenceFor, summarise } from '../../context/DemoContext'
import { apexEvidence } from '../../data/mock'
import { BidHeader, BidNotFound, useBidPage } from './bidShared'

const CHECK_ICON = { ok: CheckCircle2, warn: AlertTriangle, fail: XCircle }

export function ClarificationModal({ open, onClose, onSend, req }) {
  const [message, setMessage] = useState('')
  const preset = req?.id === 'REQ-003'
    ? 'Please submit a completion certificate or work order for the Mysuru Smart City project that describes the scope of supply (network equipment items and quantities).'
    : req ? `Please provide supporting evidence for ${req.id} ${req.title}.` : 'Please provide clarification on the items flagged in your bid.'
  return (
    <Modal
      open={open}
      title="Request clarification"
      onClose={onClose}
      footer={<><button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button><button type="button" className="btn btn-primary" onClick={() => onSend(message || preset)}>Send to bidder</button></>}
    >
      {req && <p className="muted"><span className="mono">{req.id}</span> · {req.title}</p>}
      <div className="field mt-12">
        <label htmlFor="clar">Message to bidder</label>
        <textarea id="clar" className="textarea" rows={5} defaultValue={preset} onChange={(e) => setMessage(e.target.value)} />
        <span className="hint">The bidder is notified and can respond within 3 working days. This request is logged in the audit trail.</span>
      </div>
    </Modal>
  )
}

export default function Compliance() {
  const { tender, bid, requirements, dispatch, id } = useBidPage()
  const toast = useToast()
  const [params, setParams] = useSearchParams()
  const [clarifying, setClarifying] = useState(false)
  if (!tender || !bid) return <BidNotFound id={id} />

  const s = summarise(bid, requirements)
  const rows = s.rows
  const selected = rows.find((r) => r.id === params.get('req')) || rows.find((r) => r.result === 'Review Required') || rows[0]
  const ev = evidenceFor(bid, selected)
  const flagged = rows.filter((r) => r.result === 'Review Required' || r.result === 'Clarification Requested')
  const why = bid.id === 'BID-2026-041' ? apexEvidence['REQ-003'].reviewReason : flagged[0] ? `${flagged[0].title}: evidence present but could not be matched with confidence.` : null

  const send = (message) => {
    dispatch({ type: 'requestClarification', bidId: bid.id, reqId: selected.id, message })
    setClarifying(false)
    toast(`Clarification requested from ${bid.bidder}`)
  }

  const resultTone = selected.result === 'Satisfied' ? 'ok' : selected.result === 'Not Satisfied' ? 'fail' : selected.result === 'Not Applicable' ? 'muted' : 'warn'

  return (
    <>
      <BidHeader tender={tender} bid={bid} page="Compliance" />

      {/* Compliance summary */}
      <div className="grid-main">
        <div className="card summary-hero" style={{ gridTemplateColumns: 'auto minmax(0, 1fr)' }}>
          <Donut
            size={128}
            segments={[
              { label: 'Satisfied', value: s.satisfied, color: '#1d7148' },
              { label: 'Review', value: s.review, color: '#d39b22' },
              { label: 'Not satisfied', value: s.failed, color: '#b42318' },
            ]}
            center={`${bid.compliance}%`}
            sub="compliance"
          />
          <div>
            <div className="summary-figures" style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', rowGap: 14 }}>
              <div><div className="k">Mandatory requirements</div><div className="v num">{s.mandatory.satisfied} / {s.mandatory.total} satisfied</div></div>
              <div><div className="k">Optional requirements</div><div className="v num">{s.optional.satisfied} / {s.optional.total} satisfied</div></div>
              <div><div className="k">Review required</div><div className="v num" style={{ color: 'var(--amber)' }}>{s.review}</div></div>
              <div><div className="k">Failed</div><div className="v num" style={{ color: 'var(--red)' }}>{s.failed}</div></div>
            </div>
            <div className="legend mt-12">
              <span><i style={{ background: '#1d7148' }} />Satisfied</span>
              <span><i style={{ background: '#d39b22' }} />Review required</span>
              <span><i style={{ background: '#b42318' }} />Not satisfied</span>
            </div>
          </div>
        </div>
        <div className="card card-body">
          <div className="row-between"><span className="section-title" style={{ margin: 0 }}>Risk level</span><StatusBadge status={bid.risk.toUpperCase()} tone={{ Low: 'ok', Medium: 'warn', High: 'fail' }[bid.risk]} icon={false} /></div>
          {why && (
            <>
              <div className="section-title mt-16" style={{ marginBottom: 6 }}>Why is this flagged?</div>
              <p>{why}</p>
            </>
          )}
          <p className="ai-note mt-16"><Info />AI-assisted assessment. Final decision remains with Procurement Officer.</p>
        </div>
      </div>

      {/* Requirement list + evidence */}
      <div className="split mt-16">
        <div className="card">
          <div className="card-header"><h2>Requirements</h2><span className="small muted">{rows.length}</span></div>
          <ul className="req-list">
            {rows.map((r) => (
              <li key={r.id}>
                <button type="button" className={r.id === selected.id ? 'active' : ''} onClick={() => setParams({ req: r.id }, { replace: true })} aria-current={r.id === selected.id}>
                  <span className="rid">{r.id} · {r.category}</span>
                  <span className="strong">{r.title}</span>
                  <StatusBadge status={r.result === 'Satisfied' ? 'Satisfied' : r.result} icon={false} />
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="card">
          <div className="evidence-head row-between wrap">
            <div>
              <div className="rid">{selected.id} · {selected.category}</div>
              <h2>{selected.title}</h2>
            </div>
            <StatusBadge status={selected.result} />
          </div>

          <div className="evidence-section">
            <h3>Tender requirement</h3>
            <p>{selected.criterion}</p>
            <p className="small muted mt-8">Tender clause: {selected.clause} · {tender.document}</p>
          </div>

          <div className="evidence-section">
            <h3>Submitted evidence</h3>
            {ev.documents.length ? (
              <div className="row wrap">
                {ev.documents.map((d) => (
                  <button key={d} type="button" className="doc-chip" onClick={() => toast(`${d} · ${ev.page} (document viewer is not part of the prototype)`, 'info')}>
                    <FileText />{d}
                  </button>
                ))}
              </div>
            ) : <p className="muted">No document submitted for this requirement.</p>}
          </div>

          <div className="evidence-section">
            <h3>Extracted values</h3>
            <div className="kv">
              {ev.extracted.map(([k, v]) => [<div key={`${k}k`} className="k">{k}</div>, <div key={`${k}v`} className="v">{v}</div>])}
            </div>
          </div>

          {ev.computed && (
            <div className="evidence-section">
              <h3>Rule evaluation</h3>
              <div className="calc">
                {ev.computed.map(([k, v]) => <div key={k}><div className="k">{k}</div><div className="v num">{v}</div></div>)}
              </div>
            </div>
          )}

          <div className="evidence-section">
            <h3>Verification checks</h3>
            {ev.checks.map(([k, v, t]) => {
              const Icon = CHECK_ICON[t] || CheckCircle2
              return <div key={k} className="check-row"><Icon className={t} aria-hidden="true" /><span style={{ flex: 1 }}>{k}</span><span className="strong">{v}</span></div>
            })}
          </div>

          <div className="evidence-section">
            <h3>Result</h3>
            <div className={`callout ${resultTone === 'muted' ? 'info' : resultTone}`}>
              <span><strong>{selected.result.toUpperCase()}</strong>. {ev.finding}</span>
            </div>
            <p className="small muted mt-12">Evidence source: {ev.source} · Checked {ev.checkedAt} · Reference: {ev.page}</p>
            {bid.clarifications.filter((c) => c.reqId === selected.id).map((c) => (
              <div key={c.at} className="callout warn mt-12"><MessageSquare /><span>Clarification requested {c.at}: “{c.message}”</span></div>
            ))}
          </div>

          <div className="card-footer row wrap">
            {selected.result !== 'Satisfied' && selected.result !== 'Not Applicable' && selected.result !== 'Clarification Requested' && (
              <button type="button" className="btn btn-primary" onClick={() => setClarifying(true)}><MessageSquare />Request Clarification</button>
            )}
            <Link to={`/officer/tenders/${tender.id}/bids/${bid.id}/review`} className="btn btn-secondary">Proceed to Officer Review</Link>
          </div>
        </div>
      </div>

      <ClarificationModal open={clarifying} req={selected} onClose={() => setClarifying(false)} onSend={send} />
    </>
  )
}
