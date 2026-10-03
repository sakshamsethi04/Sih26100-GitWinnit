import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import { PageHeader } from '../../components/Breadcrumbs'
import DataTable from '../../components/DataTable'
import StatusBadge from '../../components/StatusBadge'
import EmptyState from '../../components/EmptyState'
import { useDemo } from '../../context/DemoContext'
import { formatINR } from '../../utils/format'

const BIDDER_VIEW = {
  1048: 'Bid submitted', '0981': 'Bid submitted', '0995': 'Bid submitted', '0873': 'Bid submitted',
}

export default function BidderTenders() {
  const { state } = useDemo()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [q, setQ] = useState(params.get('q') || '')
  const rows = state.tenders
    .filter((t) => t.status !== 'Draft')
    .filter((t) => !q || `${t.ref} ${t.title}`.toLowerCase().includes(q.toLowerCase()))

  const columns = [
    { key: 'ref', header: 'Tender ID', render: (t) => <span className="mono">{t.ref}</span> },
    { key: 'title', header: 'Title', render: (t) => (<><div className="cell-title">{t.title}</div><div className="cell-sub">{t.department}</div></>) },
    { key: 'value', header: 'Estimated value', align: 'right', render: (t) => formatINR(t.value) },
    { key: 'deadline', header: 'Submission deadline' },
    { key: 'status', header: 'Status', render: (t) => <StatusBadge status={BIDDER_VIEW[t.id] || (t.status === 'Open for Bids' ? 'Open for Bids' : 'Closed')} tone={BIDDER_VIEW[t.id] ? 'info' : t.status === 'Open for Bids' ? 'ok' : 'muted'} /> },
    { key: 'go', header: '', align: 'right', render: (t) => <Link className="btn btn-secondary btn-sm" to={`/bidder/tenders/${t.id}`} onClick={(e) => e.stopPropagation()}>View</Link> },
  ]

  return (
    <>
      <PageHeader crumbs={[{ label: 'Dashboard', to: '/bidder/dashboard' }, { label: 'Available tenders' }]} title="Available Tenders" sub="Tenders published on GeM that use Bid Sahayak for compliance verification." />
      <div className="card">
        <div className="filters"><div className="input-icon"><Search /><input className="input" placeholder="Search tenders" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search tenders" /></div></div>
        <DataTable columns={columns} rows={rows} onRowClick={(t) => navigate(`/bidder/tenders/${t.id}`)} empty={<EmptyState icon={Search} title="No tenders match" text="Try another search term." />} />
      </div>
    </>
  )
}
