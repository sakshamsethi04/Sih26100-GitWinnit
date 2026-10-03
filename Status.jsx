import { Link, useParams } from 'react-router-dom'
import { FileText, Info, MessageSquare } from 'lucide-react'
import { PageHeader } from '../../components/Breadcrumbs'
import StatusBadge from '../../components/StatusBadge'
import EmptyState from '../../components/EmptyState'
import ProcessSteps from '../../components/ProcessSteps'
import { useDemo, summarise } from '../../context/DemoContext'
import { bidderBids } from '../../data/mock'

const DECISION_LABEL = { approve: 'Compliant', reject: 'Non-Compliant', clarify: 'Clarification Requested' }
const BIDDER_RESULT = { Satisfied: 'Verified', 'Review Required': 'Under Review', 'Not Satisfied': 'Not Satisfied', 'Not Applicable': 'Not Applicable', 'Clarification Requested': 'Clarification Requested' }

export default function BidStatus() {
  const { id } = useParams()
  const { getTender, getBid, getRequirements, state } = useDemo()
  const tender = getTender(id)
  const entry = bidderBids.find((b) => b.tenderId === id)
  if (!tender) return <EmptyState icon={FileText} title="Tender not found" action={<Link className="btn btn-secondary" to="/bidder/bids">My bids</Link>} />

  if (id !== '1048') {
    return (
      <>
        <PageHeader crumbs={[{ label: 'My bids', to: '/bidder/bids' }, { label: tender.ref }]} title="Bid verification status" sub={`${tender.ref} · ${tender.title}`} />
        {entry ? (
          <div className="card card-body kv" style={{ maxWidth: 640 }}>
            <div className="k">Bid ID</div><div className="v mono">{entry.bidId}</div>
            <div className="k">Submitted</div><div className="v">{entry.submitted}</div>
            <div className="k">Compliance</div><div className="v">{entry.compliance}%</div>
            <div className="k">Overall</div><div className="v"><StatusBadge status={entry.status} /></div>
          </div>
        ) : (
          <div className="card"><EmptyState title="No bid submitted for this tender" action={<Link className="btn btn-primary" to={`/bidder/tenders/${id}`}>View tender</Link>} /></div>
        )}
      </>
    )
  }

  const bid = getBid('BID-2026-041')
  const decision = bid.decision
  const steps = [
    { label: 'Bid Submitted', detail: state.bidSubmission?.at || '18 Sep 2026, 14:32' },
    { label: 'Document Extraction', detail: '63 fields extracted from 11 files' },
    { label: 'Government Verification', detail: 'GST, Udyam, MCA, PAN/ITR, EPFO, debarment list' },
    { label: 'Compliance Assessment', detail: 'Generated 03 Oct 2026, 15:38' },
    { label: 'Officer Review', detail: decision ? `Completed ${bid.decidedAt}` : 'With the procurement officer' },
    { label: 'Final Decision', detail: decision ? DECISION_LABEL[decision] : undefined },
  ]
  const current = decision === 'clarify' ? 4 : decision ? 6 : 4
  const overall = decision ? DECISION_LABEL[decision] : 'Under Review'
  const rows = summarise(bid, getRequirements('1048')).rows

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'My bids', to: '/bidder/bids' }, { label: tender.ref, to: `/bidder/tenders/${id}` }, { label: 'Verification status' }]}
        title="Bid Verification Status"
        sub={`${tender.ref} · ${tender.title}`}
      />
      <div className="card card-body meta-strip">
        <div><div className="k">Bid ID</div><div className="v mono">BID-2026-041</div></div>
        <div><div className="k">Bidder</div><div className="v">Apex Systems Pvt Ltd</div></div>
        <div><div className="k">Overall</div><div className="v"><StatusBadge status={overall} /></div></div>
        <div><div className="k">Last updated</div><div className="v">{bid.decidedAt || '03 Oct 2026, 15:38'}</div></div>
      </div>

      {decision === 'clarify' || bid.clarifications.length ? (
        <div className="callout warn mt-16">
          <MessageSquare />
          <span><strong>Clarification requested by the procurement officer.</strong> {bid.clarifications.at(-1)?.message || bid.comment} Respond by uploading the requested document on the <Link to={`/bidder/tenders/${id}/documents`}>documents page</Link>.</span>
        </div>
      ) : null}

      <div className="grid-main mt-16" style={{ gridTemplateColumns: 'minmax(280px, 1fr) minmax(0, 2fr)' }}>
        <div className="card">
          <div className="card-header"><h2>Progress</h2></div>
          <div className="card-body"><ProcessSteps steps={steps} current={current} animate={false} /></div>
        </div>
        <div className="card">
          <div className="card-header"><h2>Requirement status</h2></div>
          <div className="table-wrap">
            <table className="table">
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td className="mono small" style={{ width: 90 }}>{r.id}</td>
                    <td className="cell-title">{r.title}</td>
                    <td className="small muted">{r.category === 'Mandatory' ? 'Mandatory' : 'Optional'}</td>
                    <td><StatusBadge status={BIDDER_RESULT[r.result] || r.result} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="card-footer ai-note"><Info />Results are an automated assessment. The procurement officer makes the final decision.</div>
        </div>
      </div>
    </>
  )
}
