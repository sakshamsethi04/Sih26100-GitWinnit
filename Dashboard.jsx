import { useNavigate, Link } from 'react-router-dom'
import { ClipboardCheck, FileText, Hourglass, ShieldCheck, Plus } from 'lucide-react'
import { PageHeader } from '../../components/Breadcrumbs'
import StatCard from '../../components/StatCard'
import DataTable from '../../components/DataTable'
import StatusBadge from '../../components/StatusBadge'
import ActivityTimeline from '../../components/ActivityTimeline'
import { Donut } from '../../components/Charts'
import { useDemo } from '../../context/DemoContext'
import { greeting } from '../../utils/format'

export default function OfficerDashboard() {
  const { state } = useDemo()
  const navigate = useNavigate()
  const current = ['1048', '0981', '0873', '0995'].map((id) => state.tenders.find((t) => t.id === id)).filter(Boolean)

  const columns = [
    { key: 'ref', header: 'Tender ID', render: (t) => <span className="mono">{t.ref}</span> },
    { key: 'title', header: 'Tender Title', render: (t) => <span className="cell-title">{t.title}</span> },
    { key: 'bids', header: 'Bids', align: 'right' },
    { key: 'pendingReviews', header: 'Pending Reviews', align: 'right' },
    { key: 'status', header: 'Status', render: (t) => <StatusBadge status={t.status} /> },
  ]

  const dist = [
    { label: 'Compliant', value: 61, color: 'var(--green)' },
    { label: 'Review required', value: 24, color: '#d39b22' },
    { label: 'Non-compliant', value: 15, color: 'var(--red)' },
  ]

  return (
    <>
      <PageHeader
        title={`${greeting()}, Procurement Officer`}
        sub="Central Public Procurement Department · Last updated 03 Oct 2026, 15:42"
        actions={<Link to="/officer/tenders/create" className="btn btn-primary"><Plus />Create New Tender</Link>}
      />
      <div className="stats">
        <StatCard icon={FileText} label="Active Tenders" value="12" note="3 closing this week" />
        <StatCard icon={Hourglass} label="Bids Awaiting Review" value="27" note="Across 5 tenders" />
        <StatCard icon={ShieldCheck} label="Under Verification" value="9" note="Source checks in progress" />
        <StatCard icon={ClipboardCheck} label="Reviews Completed" value="143" note="Since April 2026" />
      </div>

      <div className="grid-main mt-16">
        <div className="card">
          <div className="card-header">
            <h2>Current evaluations</h2>
            <Link to="/officer/tenders" className="small">All tenders</Link>
          </div>
          <DataTable
            columns={columns}
            rows={current}
            onRowClick={(t) => navigate(t.id === '1048' ? `/officer/tenders/${t.id}/bids` : `/officer/tenders/${t.id}`)}
          />
        </div>
        <div className="card">
          <div className="card-header"><h2>Compliance overview</h2><span className="small muted">Last 30 days · 143 bids</span></div>
          <div className="card-body row" style={{ gap: 20 }}>
            <Donut segments={dist} center="143" sub="bids assessed" size={128} />
            <div className="stack" style={{ gap: 10 }}>
              {dist.map((d) => (
                <div key={d.label}>
                  <div className="row small" style={{ gap: 6 }}><i style={{ width: 10, height: 10, borderRadius: 2, background: d.color, display: 'inline-block' }} />{d.label}</div>
                  <div className="strong num">{d.value}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid-main mt-16">
        <div className="card">
          <div className="card-header"><h2>Recent activity</h2><Link to="/officer/audit" className="small">Audit trail</Link></div>
          <div className="card-body" style={{ paddingTop: 4, paddingBottom: 4 }}><ActivityTimeline items={state.activity.slice(0, 6)} /></div>
        </div>
        <div className="card">
          <div className="card-header"><h2>Needs your attention</h2></div>
          <div className="card-body stack" style={{ gap: 12 }}>
            <div className="callout warn"><span><strong>BID-2026-041</strong> · Relevant Experience needs manual review. <Link to="/officer/tenders/1048/bids/BID-2026-041/compliance?req=REQ-003">Open evidence</Link></span></div>
            <div className="callout fail"><span><strong>BID-2026-042</strong> · OEM authorization not satisfied. <Link to="/officer/tenders/1048/bids/BID-2026-042">View bid</Link></span></div>
            <div className="callout info"><span><strong>GEM/PROC/2026/1067</strong> closes 08 Oct 2026, 15:00 with 3 bids received.</span></div>
          </div>
        </div>
      </div>
    </>
  )
}
