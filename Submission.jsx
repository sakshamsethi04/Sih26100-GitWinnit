import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AlertTriangle, CheckCircle2, FileText, Send } from 'lucide-react'
import { PageHeader } from '../../components/Breadcrumbs'
import StatusBadge from '../../components/StatusBadge'
import EmptyState from '../../components/EmptyState'
import { ConfirmDialog } from '../../components/Modal'
import { useToast } from '../../components/Toast'
import { useDemo } from '../../context/DemoContext'
import { docSummary, docsFor } from './shared'

export default function Submission() {
  const { id } = useParams()
  const { getTender, state, dispatch } = useDemo()
  const toast = useToast()
  const [confirming, setConfirming] = useState(false)
  const [declared, setDeclared] = useState(false)
  const tender = getTender(id)
  if (!tender) return <EmptyState icon={FileText} title="Tender not found" action={<Link className="btn btn-secondary" to="/bidder/tenders">Back to tenders</Link>} />

  const docs = docsFor(id, state)
  const sum = docSummary(docs)
  const mandatoryDocs = docs.filter((d) => d.mandatory)
  const satisfied = mandatoryDocs.filter((d) => ['Verified', 'Uploaded'].includes(d.status)).length
  const submission = id === '1048' ? state.bidSubmission : null

  const submit = () => {
    dispatch({ type: 'submitBid' })
    setConfirming(false)
    toast('Bid submitted successfully')
  }

  if (submission) {
    return (
      <>
        <PageHeader crumbs={[{ label: 'Available tenders', to: '/bidder/tenders' }, { label: tender.ref, to: `/bidder/tenders/${id}` }, { label: 'Submission' }]} title="Bid submitted" />
        <div className="card" style={{ maxWidth: 640 }}>
          <div className="card-body stack">
            <div className="row"><CheckCircle2 color="var(--green)" size={28} /><h2 style={{ fontSize: 20 }}>Bid submitted successfully.</h2></div>
            <div className="kv">
              <div className="k">Bid ID</div><div className="v mono" style={{ fontSize: 16 }}>{submission.bidId}</div>
              <div className="k">Tender</div><div className="v">{tender.ref} · {tender.title}</div>
              <div className="k">Submitted</div><div className="v">{submission.at}</div>
              <div className="k">Documents</div><div className="v">{sum.uploaded} files</div>
            </div>
            <p className="muted">Your documents will now be verified against government sources and the tender rules. The procurement officer makes the final decision.</p>
          </div>
          <div className="card-footer row">
            <Link to={`/bidder/tenders/${id}/status`} className="btn btn-primary">Track Verification Status</Link>
            <Link to="/bidder/dashboard" className="btn btn-secondary">Back to dashboard</Link>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Available tenders', to: '/bidder/tenders' }, { label: tender.ref, to: `/bidder/tenders/${id}` }, { label: 'Submission' }]}
        title="Review & submit bid"
        sub={<><span className="mono">{tender.ref}</span> · {tender.title}</>}
      />
      <div className="grid-main">
        <div className="card">
          <div className="card-header"><h2>Final checklist</h2></div>
          <div className="card-body">
            <div className="summary-figures" style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
              <div style={{ borderLeft: 0, paddingLeft: 0 }}><div className="k">Documents</div><div className="v num">{sum.mandatoryUploaded} / {sum.mandatoryTotal} uploaded</div></div>
              <div><div className="k">Requirements</div><div className="v num">{satisfied} / {mandatoryDocs.length} satisfied</div></div>
            </div>
            {mandatoryDocs.length - satisfied > 0 && (
              <div className="callout warn mt-16"><AlertTriangle /><span>{mandatoryDocs.length - satisfied} requirement{mandatoryDocs.length - satisfied > 1 ? 's require' : ' requires'} attention.</span></div>
            )}
          </div>
          <table className="table">
            <tbody>
              {docs.map((d) => (
                <tr key={d.key}>
                  <td className="mono small" style={{ width: 90 }}>{d.reqId}</td>
                  <td className="cell-title">{d.name}</td>
                  <td className="small muted">{d.file || '—'}</td>
                  <td><StatusBadge status={d.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="card-footer small muted">Under Review means our checks need the officer to confirm the document. You can still submit.</div>
        </div>
        <div className="card">
          <div className="card-header"><h2>Submit</h2></div>
          <div className="card-body stack">
            {!sum.ready && <div className="callout fail"><span>Upload all mandatory documents before submitting. <Link to={`/bidder/tenders/${id}/documents`}>Go to documents</Link></span></div>}
            <label className="check"><input type="checkbox" checked={declared} onChange={(e) => setDeclared(e.target.checked)} />I declare that my firm is not blacklisted or debarred by any government entity (REQ-008).</label>
            <button type="button" className="btn btn-primary btn-lg btn-block" disabled={!sum.ready || !declared} onClick={() => setConfirming(true)}><Send />Submit Bid</button>
            <Link to={`/bidder/tenders/${id}/documents`} className="btn btn-ghost btn-block">Back to documents</Link>
          </div>
        </div>
      </div>
      <ConfirmDialog open={confirming} title="Submit bid?" confirmLabel="Submit Bid" onConfirm={submit} onCancel={() => setConfirming(false)}>
        <p>By submitting, you confirm that the information provided is complete and accurate.</p>
        <p className="muted mt-8">Documents can’t be changed after submission unless the procurement officer requests a clarification.</p>
      </ConfirmDialog>
    </>
  )
}
