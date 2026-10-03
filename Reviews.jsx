import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../../components/Breadcrumbs'
import DataTable from '../../components/DataTable'
import StatusBadge, { RiskBadge } from '../../components/StatusBadge'
import { ComplianceBar } from '../../components/Charts'
import { useDemo } from '../../context/DemoContext'

const OPEN = ['Under Review', 'Action Required', 'Ready for Review', 'Clarification Requested']

export default function Reviews() {
  const { getBids, getTender } = useDemo()
  const navigate = useNavigate()
  const all = getBids('1048')
  const open = all.filter((b) => OPEN.includes(b.status))
  const closed = all.filter((b) => !OPEN.includes(b.status))
  const tender = getTender('1048')

  const columns = [
    { key: 'id', header: 'Bid ID', render: (b) => <span className="mono">{b.id}</span> },
    { key: 'bidder', header: 'Bidder', render: (b) => <span className="cell-title">{b.bidder}</span> },
    { key: 'tender', header: 'Tender', render: () => <span className="small">{tender.ref}</span> },
    { key: 'compliance', header: 'Compliance', render: (b) => <ComplianceBar value={b.compliance} /> },
    { key: 'risk', header: 'Risk', render: (b) => <RiskBadge level={b.risk} /> },
    { key: 'status', header: 'Status', render: (b) => <StatusBadge status={b.status} /> },
  ]
  const open_ = (b) => navigate(`/officer/tenders/1048/bids/${b.id}/review`)

  return (
    <>
      <PageHeader crumbs={[{ label: 'Dashboard', to: '/officer/dashboard' }, { label: 'Compliance reviews' }]} title="Compliance Reviews" sub="Bids waiting for your decision, across all tenders you evaluate." />
      <div className="card">
        <div className="card-header"><h2>Awaiting decision</h2><span className="small muted">{open.length}</span></div>
        <DataTable columns={columns} rows={open} onRowClick={open_} />
      </div>
      <div className="card mt-16">
        <div className="card-header"><h2>Decided</h2><span className="small muted">{closed.length}</span></div>
        <DataTable columns={columns} rows={closed} onRowClick={open_} />
      </div>
    </>
  )
}
