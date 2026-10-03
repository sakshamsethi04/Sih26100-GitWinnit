import { useMemo, useState } from 'react'
import { Download, Lock, Search } from 'lucide-react'
import { PageHeader } from '../../components/Breadcrumbs'
import DataTable from '../../components/DataTable'
import StatusBadge from '../../components/StatusBadge'
import { useToast } from '../../components/Toast'
import { useDemo } from '../../context/DemoContext'

export default function Audit() {
  const { state } = useDemo()
  const toast = useToast()
  const [q, setQ] = useState('')
  const [actor, setActor] = useState('All')

  const rows = useMemo(
    () => state.audit
      .map((r, i) => ({ ...r, key: `${r.ts}-${i}`, seq: `AUD-${String(48210 - i).padStart(6, '0')}` }))
      .filter((r) => (actor === 'All' || r.user === actor) && (!q || `${r.action} ${r.entity} ${r.name}`.toLowerCase().includes(q.toLowerCase()))),
    [state.audit, q, actor],
  )

  const exportCsv = () => {
    const header = ['Event ID', 'Timestamp', 'User', 'Name', 'Action', 'Entity', 'Status']
    const lines = [header, ...rows.map((r) => [r.seq, r.ts, r.user, r.name, r.action, r.entity, r.status])]
      .map((cols) => cols.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))
    const blob = new Blob([`${lines.join('\n')}\n`], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    Object.assign(document.createElement('a'), { href: url, download: 'BidSahayak_Audit_Report_03-Oct-2026.csv' }).click()
    URL.revokeObjectURL(url)
    toast(`Audit report exported (${rows.length} entries)`)
  }

  const columns = [
    { key: 'ts', header: 'Timestamp', render: (r) => <span className="num small" style={{ whiteSpace: 'nowrap' }}>{r.ts}</span> },
    { key: 'user', header: 'User', render: (r) => (<><div className="cell-title">{r.user}</div><div className="cell-sub">{r.name}</div></>) },
    { key: 'action', header: 'Action' },
    { key: 'entity', header: 'Entity', render: (r) => <span className="mono small">{r.entity}</span> },
    { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} icon={false} /> },
    { key: 'seq', header: 'Event ID', render: (r) => <span className="mono small muted">{r.seq}</span> },
  ]

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Dashboard', to: '/officer/dashboard' }, { label: 'Audit trail' }]}
        title="Audit Trail"
        sub="Every extraction, verification, assessment and officer decision, in order."
        actions={<button type="button" className="btn btn-primary" onClick={exportCsv}><Download />Export Audit Report</button>}
      />
      <div className="callout info" style={{ marginBottom: 16 }}>
        <Lock />
        <span>Entries are append-only. They cannot be edited or deleted by any user, including administrators.</span>
      </div>
      <div className="card">
        <div className="filters">
          <div className="input-icon"><Search /><input className="input" placeholder="Search action, entity or user" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search audit log" /></div>
          <select className="select" value={actor} onChange={(e) => setActor(e.target.value)} aria-label="User type">
            {['All', 'Procurement Officer', 'Bid Sahayak Engine', 'Bidder'].map((a) => <option key={a} value={a}>{a === 'All' ? 'All users' : a}</option>)}
          </select>
          <span className="small muted" style={{ alignSelf: 'center', marginLeft: 'auto' }}>{rows.length} entries · Last updated {state.audit[0]?.ts}</span>
        </div>
        <DataTable columns={columns} rows={rows} rowKey="key" />
      </div>
    </>
  )
}
