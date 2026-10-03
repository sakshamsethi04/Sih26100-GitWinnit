import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { FileText, Gavel, Search } from 'lucide-react'
import { PageHeader } from '../../components/Breadcrumbs'
import DataTable from '../../components/DataTable'
import StatusBadge, { RiskBadge } from '../../components/StatusBadge'
import StatCard from '../../components/StatCard'
import EmptyState from '../../components/EmptyState'
import { ComplianceBar } from '../../components/Charts'
import { useDemo } from '../../context/DemoContext'

export default function Bids() {
  const { id } = useParams()
  const { getTender, getBids, state } = useDemo()
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const [risk, setRisk] = useState('All')
  const tender = getTender(id)
  const all = getBids(id)
  const rows = useMemo(
    () => all.filter((b) => (risk === 'All' || b.risk === risk) && (!q || `${b.bidder} ${b.id}`.toLowerCase().includes(q.toLowerCase()))),
    [all, q, risk],
  )
  if (!tender) return <EmptyState icon={FileText} title="Tender not found" action={<Link className="btn btn-secondary" to="/officer/tenders">Back to tenders</Link>} />

  const columns = [
    { key: 'bidder', header: 'Bidder', render: (b) => (<><div className="cell-title">{b.bidder}</div><div className="cell-sub mono">{b.gstin}</div></>) },
    { key: 'id', header: 'Bid ID', render: (b) => <span className="mono">{b.id}</span> },
    { key: 'submitted', header: 'Submitted', render: (b) => <span className="small">{b.submitted}</span> },
    { key: 'documents', header: 'Documents', align: 'right' },
    { key: 'compliance', header: 'Compliance', render: (b) => <ComplianceBar value={b.compliance} /> },
    { key: 'risk', header: 'Risk', render: (b) => <RiskBadge level={b.risk} /> },
    { key: 'status', header: 'Status', render: (b) => <StatusBadge status={b.status} /> },
  ]

  const pending = all.filter((b) => ['Under Review', 'Action Required', 'Ready for Review', 'Clarification Requested'].includes(b.status)).length

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Tenders', to: '/officer/tenders' }, { label: tender.ref, to: `/officer/tenders/${id}` }, { label: 'Bid evaluation' }]}
        title="Bid Evaluation"
        sub={<><span className="mono">{tender.ref}</span> · {tender.title} · Submission closed {tender.deadline}</>}
        actions={<Link to={`/officer/tenders/${id}/requirements`} className="btn btn-secondary">Requirements ({state.requirements[id]?.length || 10})</Link>}
      />
      {all.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={Gavel}
            title={tender.status === 'Open for Bids' || tender.status === 'Draft' ? 'No bids to evaluate yet' : 'Bid records not loaded in this demo'}
            text={tender.status === 'Open for Bids' || tender.status === 'Draft'
              ? `Bids can be submitted until ${tender.deadline}. Evaluation opens after the deadline.`
              : 'The demo includes full bid data for GEM/PROC/2026/1048 (Supply of Network Equipment).'}
            action={<Link className="btn btn-primary" to="/officer/tenders/1048/bids">Open sample evaluation: GEM/PROC/2026/1048</Link>}
          />
        </div>
      ) : (
        <>
          <div className="stats">
            <StatCard label="Bids received" value={all.length} />
            <StatCard label="Awaiting officer review" value={pending} />
            <StatCard label="High risk" value={all.filter((b) => b.risk === 'High').length} />
            <StatCard label="Average compliance" value={`${Math.round(all.reduce((s, b) => s + b.compliance, 0) / all.length)}%`} />
          </div>
          <div className="card mt-16">
            <div className="filters">
              <div className="input-icon"><Search /><input className="input" placeholder="Search bidder or bid ID" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search bids" /></div>
              <select className="select" value={risk} onChange={(e) => setRisk(e.target.value)} aria-label="Risk">
                {['All', 'Low', 'Medium', 'High'].map((r) => <option key={r} value={r}>{r === 'All' ? 'All risk levels' : `${r} risk`}</option>)}
              </select>
            </div>
            <DataTable columns={columns} rows={rows} onRowClick={(b) => navigate(`/officer/tenders/${id}/bids/${b.id}`)} />
          </div>
          <p className="ai-note mt-12">Compliance scores are AI-assisted assessments. Final decisions remain with the Procurement Officer.</p>
        </>
      )}
    </>
  )
}
