import { useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Plus, Search } from 'lucide-react'
import { PageHeader } from '../../components/Breadcrumbs'
import DataTable from '../../components/DataTable'
import StatusBadge from '../../components/StatusBadge'
import EmptyState from '../../components/EmptyState'
import { useDemo } from '../../context/DemoContext'
import { formatINR } from '../../utils/format'

export default function Tenders() {
  const { state } = useDemo()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [q, setQ] = useState(params.get('q') || '')
  const [status, setStatus] = useState('All')
  const [dept, setDept] = useState('All')
  const [month, setMonth] = useState('All')

  const depts = [...new Set(state.tenders.map((t) => t.department))]
  const rows = useMemo(
    () => state.tenders.filter((t) =>
      (status === 'All' || t.status === status) &&
      (dept === 'All' || t.department === dept) &&
      (month === 'All' || t.deadline.includes(month)) &&
      (!q || `${t.ref} ${t.title}`.toLowerCase().includes(q.toLowerCase())),
    ),
    [state.tenders, status, dept, month, q],
  )

  const columns = [
    { key: 'ref', header: 'Tender ID', render: (t) => <span className="mono">{t.ref}</span> },
    { key: 'title', header: 'Title', render: (t) => (<><div className="cell-title">{t.title}</div><div className="cell-sub">{t.department} · {formatINR(t.value)}</div></>) },
    { key: 'deadline', header: 'Deadline' },
    { key: 'bids', header: 'Bids', align: 'right' },
    { key: 'status', header: 'Compliance Status', render: (t) => (<><StatusBadge status={t.status} /><div className="cell-sub mt-8">{t.compliance}</div></>) },
    {
      key: 'actions', header: '', align: 'right',
      render: (t) => (
        <div className="actions" onClick={(e) => e.stopPropagation()}>
          <Link className="btn btn-ghost btn-sm" to={`/officer/tenders/${t.id}`}>View</Link>
          <Link className="btn btn-secondary btn-sm" to={`/officer/tenders/${t.id}/bids`}>Evaluate</Link>
          <Link className="btn btn-ghost btn-sm" to={`/officer/tenders/${t.id}/requirements`}>Requirements</Link>
        </div>
      ),
    },
  ]

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Dashboard', to: '/officer/dashboard' }, { label: 'Tenders' }]}
        title="Tenders"
        sub={`${state.tenders.length} tenders · Central Public Procurement Department`}
        actions={<Link to="/officer/tenders/create" className="btn btn-primary"><Plus />Create New Tender</Link>}
      />
      <div className="card">
        <div className="filters">
          <div className="input-icon"><Search /><input className="input" placeholder="Search by tender ID or title" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search tenders" /></div>
          <select className="select" value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Status">
            {['All', 'Open for Bids', 'Under Evaluation', 'Review Required', 'Completed', 'Draft'].map((s) => <option key={s} value={s}>{s === 'All' ? 'All statuses' : s}</option>)}
          </select>
          <select className="select" value={dept} onChange={(e) => setDept(e.target.value)} aria-label="Department">
            <option value="All">All departments</option>
            {depts.map((d) => <option key={d}>{d}</option>)}
          </select>
          <select className="select" value={month} onChange={(e) => setMonth(e.target.value)} aria-label="Deadline month">
            {['All', 'Aug', 'Sep', 'Oct'].map((m) => <option key={m} value={m}>{m === 'All' ? 'Any deadline' : `Deadline in ${m} 2026`}</option>)}
          </select>
        </div>
        <DataTable
          columns={columns}
          rows={rows}
          onRowClick={(t) => navigate(`/officer/tenders/${t.id}`)}
          empty={<EmptyState icon={Search} title="No tenders match" text="Try a different search term or clear the filters." action={<button type="button" className="btn btn-secondary btn-sm" onClick={() => { setQ(''); setStatus('All'); setDept('All'); setMonth('All') }}>Clear filters</button>} />}
        />
      </div>
    </>
  )
}
