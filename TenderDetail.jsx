import { Link, useParams } from 'react-router-dom'
import { ArrowRight, FileText } from 'lucide-react'
import { PageHeader } from '../../components/Breadcrumbs'
import StatusBadge from '../../components/StatusBadge'
import EmptyState from '../../components/EmptyState'
import { useDemo } from '../../context/DemoContext'
import { formatINR } from '../../utils/format'
import { docsFor, requirementStatus } from './shared'

export default function BidderTenderDetail() {
  const { id } = useParams()
  const { getTender, getRequirements, state } = useDemo()
  const tender = getTender(id)
  if (!tender) return <EmptyState icon={FileText} title="Tender not found" action={<Link className="btn btn-secondary" to="/bidder/tenders">Back to tenders</Link>} />
  const reqs = getRequirements(id).filter((r) => r.category !== 'Not Applicable')
  const docs = docsFor(id, state)
  const submitted = id === '1048' ? Boolean(state.bidSubmission) : ['0981', '0995', '0873'].includes(id)
  const open = tender.status === 'Open for Bids' || id === '1048'

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Available tenders', to: '/bidder/tenders' }, { label: tender.ref }]}
        title={tender.title}
        sub={<span className="mono">{tender.ref}</span>}
        actions={submitted
          ? <Link to={`/bidder/tenders/${id}/status`} className="btn btn-primary">Track verification status</Link>
          : open ? <Link to={`/bidder/tenders/${id}/documents`} className="btn btn-primary">Start Bid Submission <ArrowRight /></Link> : null}
      />
      <div className="card card-body meta-strip">
        <div><div className="k">Tender ID</div><div className="v mono">{tender.ref}</div></div>
        <div><div className="k">Department</div><div className="v">{tender.department}</div></div>
        <div><div className="k">Estimated value</div><div className="v">{formatINR(tender.value)}</div></div>
        <div><div className="k">Submission deadline</div><div className="v">{tender.deadline}</div></div>
        <div><div className="k">Tender document</div><div className="v">{tender.document}</div></div>
      </div>
      <p className="mt-16" style={{ maxWidth: '80ch' }}>{tender.description}</p>

      <div className="card mt-16">
        <div className="card-header"><h2>Eligibility requirements</h2><span className="small muted">{reqs.length} requirements</span></div>
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>ID</th><th>Requirement</th><th>Type</th><th>Required evidence</th><th>Current status</th></tr></thead>
            <tbody>
              {reqs.map((r) => (
                <tr key={r.id}>
                  <td className="mono small">{r.id}</td>
                  <td><div className="cell-title">{r.title}</div><div className="cell-sub" style={{ maxWidth: 420 }}>{r.criterion}</div></td>
                  <td><StatusBadge status={r.category === 'Mandatory' ? 'Mandatory' : 'Optional'} tone={r.category === 'Mandatory' ? 'info' : 'muted'} icon={false} /></td>
                  <td className="small">{r.evidence}</td>
                  <td><StatusBadge status={requirementStatus(r, docs)} tone={['Fetched from source', 'Signed at submission'].includes(requirementStatus(r, docs)) ? 'info' : undefined} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {open && !submitted && (
        <div className="row-between mt-16 wrap">
          <span className="muted small">Your GST, PAN and ITR status are fetched from source automatically using your registered GSTIN and PAN.</span>
          <Link to={`/bidder/tenders/${id}/documents`} className="btn btn-primary btn-lg">Start Bid Submission <ArrowRight /></Link>
        </div>
      )}
    </>
  )
}
