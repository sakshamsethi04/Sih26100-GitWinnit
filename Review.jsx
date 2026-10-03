import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, FileText, Info, MessageSquare, XCircle } from 'lucide-react'
import StatusBadge from '../../components/StatusBadge'
import { ConfirmDialog } from '../../components/Modal'
import { useToast } from '../../components/Toast'
import { evidenceFor, summarise } from '../../context/DemoContext'
import { apexEvidence } from '../../data/mock'
import { AssessmentHero } from './BidDetail'
import { BidHeader, BidNotFound, useBidPage } from './bidShared'

const ACTIONS = {
  approve: { label: 'Approve Compliance', title: 'Approve this compliance assessment?', tone: 'success', icon: CheckCircle2,
    text: 'The bid will be recorded as technically compliant and moves to financial evaluation.' },
  clarify: { label: 'Request Clarification', title: 'Request clarification from the bidder?', tone: 'primary', icon: MessageSquare,
    text: 'The bidder is notified and can respond within 3 working days. The assessment stays open until then.' },
  reject: { label: 'Mark as Non-Compliant', title: 'Mark this bid as non-compliant?', tone: 'danger', icon: XCircle,
    text: 'The bid will be excluded from further evaluation. The bidder is informed with the reasons you record.' },
}

const RESULT_COPY = {
  approve: { tone: 'ok', title: 'Compliance approved', text: 'The bid is recorded as technically compliant.' },
  clarify: { tone: 'warn', title: 'Clarification requested', text: 'The bidder has been notified. The bid stays open until they respond.' },
  reject: { tone: 'fail', title: 'Marked as non-compliant', text: 'The bid has been excluded from further evaluation.' },
}

export default function Review() {
  const { tender, bid, requirements, dispatch, id } = useBidPage()
  const toast = useToast()
  const [pending, setPending] = useState(null)
  const [comment, setComment] = useState('')
  const [error, setError] = useState('')
  if (!tender || !bid) return <BidNotFound id={id} />

  const s = summarise(bid, requirements)
  const attention = s.rows.filter((r) => !['Satisfied', 'Not Applicable'].includes(r.result))
  const docs = s.rows.flatMap((r) => evidenceFor(bid, r).documents.map((d) => ({ d, r })))
  const decided = bid.decision

  const ask = (action) => {
    if (action !== 'approve' && !comment.trim()) { setError('Add an officer comment explaining the reason before this action.'); return }
    setError('')
    setPending(action)
  }

  const act = () => {
    dispatch({ type: 'decide', bidId: bid.id, decision: pending, comment: comment.trim() })
    toast(`${RESULT_COPY[pending].title} · ${bid.id}`, pending === 'approve' ? 'ok' : 'warn')
    setPending(null)
  }

  return (
    <>
      <BidHeader tender={tender} bid={bid} page="Officer review" />
      <h2 style={{ fontSize: 18, marginBottom: 12 }}>Final Review</h2>

      {decided && (
        <div className={`callout ${RESULT_COPY[decided].tone} mb-16`} style={{ marginBottom: 16 }}>
          {decided === 'approve' ? <CheckCircle2 /> : decided === 'reject' ? <XCircle /> : <MessageSquare />}
          <div>
            <div className="strong">{RESULT_COPY[decided].title}</div>
            <div>{RESULT_COPY[decided].text} Recorded by A. K. Verma on {bid.decidedAt}.</div>
            {bid.comment && <div className="mt-8">Officer comment: “{bid.comment}”</div>}
            <div className="row mt-12">
              <Link to={`/officer/tenders/${tender.id}/bids`} className="btn btn-secondary btn-sm">Back to all bids</Link>
              <Link to="/officer/audit" className="btn btn-ghost btn-sm">View audit trail</Link>
            </div>
          </div>
        </div>
      )}

      <AssessmentHero bid={bid} s={s} />

      <div className="grid-main mt-16">
        <div className="stack">
          <div className="card">
            <div className="card-header"><h2>Requirements requiring review</h2><span className="small muted">{attention.length}</span></div>
            {attention.length === 0 ? (
              <div className="card-body muted">All requirements are satisfied. No items need review.</div>
            ) : attention.map((r) => {
              const ev = evidenceFor(bid, r)
              return (
                <div key={r.id} className="req-card" style={{ gridTemplateColumns: '92px minmax(0, 1fr) auto' }}>
                  <div className="req-id">{r.id}</div>
                  <div>
                    <div className="req-title">{r.title}</div>
                    <p className="muted mt-8">{r.id === 'REQ-003' && bid.id === 'BID-2026-041' ? apexEvidence['REQ-003'].reviewReason : ev.finding}</p>
                    <Link to={`/officer/tenders/${tender.id}/bids/${bid.id}/compliance?req=${r.id}`} className="small mt-8" style={{ display: 'inline-block' }}>View evidence</Link>
                  </div>
                  <div className="req-side"><StatusBadge status={r.result} /></div>
                </div>
              )
            })}
          </div>

          <div className="card">
            <div className="card-header"><h2>Risk summary</h2><StatusBadge status={bid.risk} icon={false} /></div>
            <div className="card-body">
              <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <li>Identity and registrations (GST, MCA, PAN) consistent across all sources.</li>
                <li>{s.failed} requirement{s.failed === 1 ? '' : 's'} not satisfied{s.failed ? `: ${s.rows.filter((r) => r.result === 'Not Satisfied').map((r) => r.title).join(', ')}` : ''}.</li>
                <li>{s.review} requirement{s.review === 1 ? '' : 's'} need officer judgement.</li>
                <li>No debarment record found.</li>
              </ul>
            </div>
          </div>

          <div className="card">
            <div className="card-header"><h2>Evidence</h2><span className="small muted">{docs.length} documents</span></div>
            <div className="card-body row wrap">
              {docs.map(({ d, r }) => (
                <button key={`${r.id}-${d}`} type="button" className="doc-chip" onClick={() => toast(`${d} (${r.id})`, 'info')}><FileText />{d}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="card" style={{ position: 'sticky', top: 76 }}>
          <div className="card-header"><h2>Officer decision</h2></div>
          <div className="card-body stack">
            <div className="field">
              <label htmlFor="comment">Officer Comment</label>
              <textarea id="comment" className="textarea" rows={5} value={comment} onChange={(e) => setComment(e.target.value)}
                placeholder="Record the basis of your decision. Required for clarification and non-compliance." />
            </div>
            {error && <div className="callout fail" role="alert">{error}</div>}
            {Object.entries(ACTIONS).map(([key, a]) => {
              const Icon = a.icon
              return (
                <button key={key} type="button" className={`btn btn-${a.tone === 'primary' ? 'secondary' : a.tone} btn-block`} onClick={() => ask(key)}>
                  <Icon />{a.label}
                </button>
              )
            })}
            <p className="ai-note"><Info />AI-assisted assessment. Final decision remains with Procurement Officer.</p>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={Boolean(pending)}
        title={pending ? ACTIONS[pending].title : ''}
        confirmLabel={pending ? ACTIONS[pending].label : ''}
        tone={pending === 'reject' ? 'danger' : pending === 'approve' ? 'success' : 'primary'}
        onConfirm={act}
        onCancel={() => setPending(null)}
      >
        {pending && (
          <>
            <p><strong>{bid.bidder}</strong> · <span className="mono">{bid.id}</span></p>
            <p className="mt-8">{ACTIONS[pending].text}</p>
            {comment && <p className="muted mt-8">Comment: “{comment}”</p>}
            <p className="small muted mt-12">This decision is recorded in the audit trail under your name.</p>
          </>
        )}
      </ConfirmDialog>
    </>
  )
}
