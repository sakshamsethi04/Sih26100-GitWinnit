import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, ClipboardCheck, RefreshCw } from 'lucide-react'
import ProcessSteps from '../../components/ProcessSteps'
import VerificationCard from '../../components/VerificationCard'
import { useToast } from '../../components/Toast'
import { verificationSources, verificationStages } from '../../data/mock'
import { useSteps } from '../../utils/useSteps'
import { BidHeader, BidNotFound, useBidPage } from './bidShared'

// Bids whose verification animation has already played in this session.
const played = new Set()

function sourcesFor(bid) {
  if (verificationSources[bid.id]) return verificationSources[bid.id]
  const upper = bid.bidder.toUpperCase()
  return [
    { key: 'gst', name: 'GST', source: 'GST Taxpayer Search', result: 'Active', verdict: 'Match', fields: [['Submitted GSTIN', bid.gstin], ['Matched legal name', bid.bidder]], ms: 790 },
    { key: 'udyam', name: 'Udyam', source: 'Udyam Registration Verification', result: bid.results['REQ-004'] === 'Not Applicable' ? 'Not an MSE (no claim made)' : 'Registration found', verdict: bid.results['REQ-004'] === 'Not Applicable' ? 'N/A' : 'Active', fields: [['Claimed MSE status', bid.results['REQ-004'] === 'Not Applicable' ? 'No' : 'Yes']], ms: 1012 },
    { key: 'mca', name: 'MCA', source: 'MCA Company Master Data', result: 'Company status: Active', verdict: 'Match', fields: [['Name on record', upper]], ms: 1288 },
    { key: 'pan', name: 'PAN / ITR', source: 'Income Tax Department', result: 'PAN valid', verdict: bid.results['REQ-009'] === 'Satisfied' ? 'Match' : 'Partial', fields: [['PAN', bid.pan], ['ITR filed (last 3 AY)', bid.results['REQ-009'] === 'Satisfied' ? '3 of 3' : '2 of 3']], ms: 902 },
    { key: 'epfo', name: 'EPFO', source: 'EPFO Establishment Search', result: 'Establishment found', verdict: 'Active', fields: [['Last ECR filed', 'Aug 2026']], ms: 1540 },
    { key: 'debar', name: 'Debarment', source: 'Central Debarment List', result: 'No record found', verdict: 'Clear', fields: [['Searched by', 'PAN, GSTIN, legal name']], ms: 688 },
  ]
}

export default function Verification() {
  const { tender, bid, id } = useBidPage()
  const toast = useToast()
  const [run, setRun] = useState(() => (bid && !played.has(bid.id) ? 1 : 0))
  const current = useSteps(verificationStages.length, {
    running: run > 0,
    interval: 650,
    restartKey: run,
    onDone: () => { if (bid) played.add(bid.id) },
  })
  if (!tender || !bid) return <BidNotFound id={id} />

  const done = run === 0 || current >= verificationStages.length
  const sources = sourcesFor(bid)
  const base = `/officer/tenders/${tender.id}/bids/${bid.id}`

  const rerun = () => {
    played.delete(bid.id)
    setRun((r) => r + 1)
    toast('Verification re-run started', 'info')
  }

  return (
    <>
      <BidHeader
        tender={tender}
        bid={bid}
        page="Verification"
        actions={<button type="button" className="btn btn-secondary" onClick={rerun} disabled={!done}><RefreshCw />Re-run verification</button>}
      />
      <div className="grid-main" style={{ gridTemplateColumns: 'minmax(280px, 1fr) minmax(0, 2fr)' }}>
        <div className="card">
          <div className="card-header"><h2>Verification pipeline</h2>{done && <span className="small" style={{ color: 'var(--green)' }}>Completed</span>}</div>
          <div className="card-body">
            <ProcessSteps steps={verificationStages} current={done ? verificationStages.length : current} />
          </div>
          <div className="card-footer small muted">Run ID VR-{tender.ref.slice(-4)}-{bid.id.slice(-3)} · 03 Oct 2026, 15:12–15:38</div>
        </div>

        <div className="stack">
          {done ? (
            <>
              <div className="callout ok"><CheckCircle2 /><span>All {sources.length} source checks returned. Identity, registration and tax status are consistent with the bid documents.</span></div>
              <div className="source-grid" style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
                {sources.map((s) => <VerificationCard key={s.key} item={s} />)}
              </div>
              <p className="small muted">All source responses on this screen are demonstration data. A production system would call the official APIs (GST, Udyam, MCA21, Income Tax, EPFO) under the department’s credentials.</p>
              <div className="row">
                <Link to={`${base}/compliance`} className="btn btn-primary"><ClipboardCheck />View Compliance Assessment</Link>
                <Link to={base} className="btn btn-secondary">Back to overview</Link>
              </div>
            </>
          ) : (
            <div className="card card-body">
              <div className="strong">Checking claims against authoritative sources…</div>
              <p className="muted mt-8">Each claim in the bid (GSTIN, Udyam number, PAN, CIN) is matched against the issuing authority’s records. Results appear here when the run completes.</p>
              <div className="stack mt-16" style={{ gap: 10 }}>
                {[80, 64, 72, 50].map((w) => <div key={w} className="skeleton" style={{ width: `${w}%` }} />)}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
