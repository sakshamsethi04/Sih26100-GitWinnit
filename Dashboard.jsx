import { Link, useNavigate } from 'react-router-dom'
import { AlertTriangle, FileText, Send, ShieldCheck } from 'lucide-react'
import { PageHeader } from '../../components/Breadcrumbs'
import StatCard from '../../components/StatCard'
import DataTable from '../../components/DataTable'
import StatusBadge from '../../components/StatusBadge'
import { ComplianceBar } from '../../components/Charts'
import { bidderAccount, bidderBids, bidderNotifications } from '../../data/mock'
import { greeting } from '../../utils/format'

export const bidColumns = [
  { key: 'tender', header: 'Tender', render: (b) => (<><div className="cell-title">{b.tender}</div><div className="cell-sub mono">{b.ref}</div></>) },
  { key: 'bidId', header: 'Bid ID', render: (b) => <span className="mono">{b.bidId}</span> },
  { key: 'submitted', header: 'Submission Date' },
  { key: 'documents', header: 'Documents', align: 'right' },
  { key: 'compliance', header: 'Compliance', render: (b) => <ComplianceBar value={b.compliance} /> },
  { key: 'status', header: 'Status', render: (b) => <StatusBadge status={b.status} /> },
]

export default function BidderDashboard() {
  const navigate = useNavigate()
  return (
    <>
      <PageHeader
        title={`${greeting()}, ${bidderAccount.representative.split(' ')[0]}`}
        sub={`${bidderAccount.company} · Bidder ID ${bidderAccount.bidderId}`}
        actions={<Link to="/bidder/tenders" className="btn btn-primary">Browse tenders</Link>}
      />
      <div className="stats">
        <StatCard icon={FileText} label="Open Tenders" value="14" note="Matching your registered categories" />
        <StatCard icon={Send} label="Submitted Bids" value="4" note="This financial year" />
        <StatCard icon={ShieldCheck} label="Under Verification" value="2" />
        <StatCard icon={AlertTriangle} label="Action Required" value="1" note="Clarification on BID-2026-029" />
      </div>
      <div className="grid-main mt-16">
        <div className="card">
          <div className="card-header"><h2>Active bids</h2><Link to="/bidder/bids" className="small">All bids</Link></div>
          <DataTable columns={bidColumns} rows={bidderBids} rowKey="bidId" onRowClick={(b) => navigate(`/bidder/tenders/${b.tenderId}/status`)} />
        </div>
        <div className="card">
          <div className="card-header"><h2>Notifications</h2></div>
          <div className="card-body" style={{ paddingTop: 4, paddingBottom: 4 }}>
            <ul className="activity">
              {bidderNotifications.map((n) => (
                <li key={n.time}><span className="dot" style={{ color: 'var(--blue)' }} /><div><div>{n.text}</div><div className="when">{n.time}</div></div></li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="card card-body mt-16 row-between wrap">
        <div>
          <div className="strong">Continue your bid for Supply of Network Equipment</div>
          <div className="muted small">GEM/PROC/2026/1048 · 2 documents still need attention before you can submit</div>
        </div>
        <Link to="/bidder/tenders/1048/documents" className="btn btn-secondary">Open document checklist</Link>
      </div>
    </>
  )
}
