import { Link, useParams } from 'react-router-dom'
import { FileText, Gavel, ListChecks } from 'lucide-react'
import { PageHeader } from '../../components/Breadcrumbs'
import StatusBadge from '../../components/StatusBadge'
import EmptyState from '../../components/EmptyState'
import { HSteps } from '../../components/ProcessSteps'
import ActivityTimeline from '../../components/ActivityTimeline'
import { useDemo } from '../../context/DemoContext'
import { formatINR } from '../../utils/format'

const STAGES = ['Tender created', 'Requirements confirmed', 'Bids open', 'Evaluation', 'Decision']
const STAGE_BY_STATUS = { Draft: 1, 'Open for Bids': 2, 'Under Evaluation': 3, 'Review Required': 3, Completed: 5 }

export default function TenderDetail() {
  const { id } = useParams()
  const { getTender, getRequirements, state } = useDemo()
  const tender = getTender(id)
  if (!tender) return <EmptyState icon={FileText} title="Tender not found" text={`No tender with ID ${id}.`} action={<Link className="btn btn-secondary" to="/officer/tenders">Back to tenders</Link>} />

  const reqs = getRequirements(id)
  const confirmed = state.confirmed[id]
  const activity = state.activity.filter((a) => a.text.includes(tender.ref) || (id === '1048' && a.text.includes('BID-2026-04')))

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Tenders', to: '/officer/tenders' }, { label: tender.ref }]}
        title={tender.title}
        sub={<span className="mono">{tender.ref}</span>}
        actions={
          <>
            <Link to={`/officer/tenders/${id}/requirements`} className="btn btn-secondary"><ListChecks />Requirements</Link>
            <Link to={`/officer/tenders/${id}/bids`} className="btn btn-primary"><Gavel />Open Bid Evaluation</Link>
          </>
        }
      />
      <div className="card card-body"><HSteps steps={STAGES} current={confirmed ? STAGE_BY_STATUS[tender.status] ?? 2 : 1} /></div>

      <div className="grid-main mt-16">
        <div className="stack">
          <div className="card">
            <div className="card-header"><h2>Tender details</h2><StatusBadge status={tender.status} /></div>
            <div className="card-body kv">
              <div className="k">Department</div><div className="v">{tender.department}</div>
              <div className="k">Estimated value</div><div className="v">{formatINR(tender.value)}</div>
              <div className="k">Published</div><div className="v">{tender.publishedOn}</div>
              <div className="k">Bid submission deadline</div><div className="v">{tender.deadline}</div>
              <div className="k">Bids received</div><div className="v">{tender.bids}</div>
              <div className="k">Description</div><div className="v" style={{ fontWeight: 400 }}>{tender.description}</div>
            </div>
          </div>
          <div className="card">
            <div className="card-header">
              <h2>Requirements ({reqs.length})</h2>
              <StatusBadge status={confirmed ? 'Confirmed' : 'Pending'} />
            </div>
            <table className="table">
              <tbody>
                {reqs.map((r) => (
                  <tr key={r.id}>
                    <td className="mono small" style={{ width: 90 }}>{r.id}</td>
                    <td className="cell-title">{r.title}</td>
                    <td className="muted small">{r.evidence}</td>
                    <td><StatusBadge status={r.category} tone={r.category === 'Mandatory' ? 'info' : 'muted'} icon={false} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="stack">
          <div className="card">
            <div className="card-header"><h2>Tender document</h2></div>
            <div className="card-body file-row" style={{ border: 0 }}>
              <span className="file-icon">PDF</span>
              <div><div className="strong">{tender.document}</div><div className="small muted">{tender.documentPages} pages · uploaded {tender.publishedOn}</div></div>
            </div>
          </div>
          <div className="card">
            <div className="card-header"><h2>Activity</h2></div>
            <div className="card-body" style={{ paddingTop: 4, paddingBottom: 4 }}>
              {activity.length ? <ActivityTimeline items={activity.slice(0, 5)} /> : <p className="muted" style={{ padding: '12px 0' }}>No activity yet for this tender.</p>}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
