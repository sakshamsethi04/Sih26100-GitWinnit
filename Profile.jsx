import { PageHeader } from '../../components/Breadcrumbs'
import StatusBadge from '../../components/StatusBadge'
import { useToast } from '../../components/Toast'
import { bidderAccount } from '../../data/mock'

export default function BidderProfile() {
  const toast = useToast()
  const a = bidderAccount
  return (
    <>
      <PageHeader crumbs={[{ label: 'Dashboard', to: '/bidder/dashboard' }, { label: 'Profile' }]} title="Company profile" sub={`Bidder ID ${a.bidderId}`} />
      <div className="grid-main">
        <div className="card">
          <div className="card-header"><h2>{a.company}</h2><StatusBadge status="Verified" /></div>
          <div className="card-body kv">
            <div className="k">GSTIN</div><div className="v mono">{a.gstin}</div>
            <div className="k">PAN</div><div className="v mono">{a.pan}</div>
            <div className="k">CIN</div><div className="v mono">{a.cin}</div>
            <div className="k">Udyam registration</div><div className="v mono">{a.udyam}</div>
            <div className="k">Registered address</div><div className="v">{a.address}</div>
            <div className="k">Authorized representative</div><div className="v">{a.representative}, {a.designation}</div>
            <div className="k">Email</div><div className="v">{a.email}</div>
            <div className="k">Phone</div><div className="v">{a.phone}</div>
          </div>
          <div className="card-footer"><button type="button" className="btn btn-secondary btn-sm" onClick={() => toast('Change request sent. Registration details are re-verified before they update.', 'info')}>Request a change</button></div>
        </div>
        <div className="card">
          <div className="card-header"><h2>Registration checks</h2></div>
          <div className="card-body stack" style={{ gap: 10 }}>
            {[['GST Portal', 'Active'], ['Income Tax (PAN)', 'Valid'], ['MCA', 'Active'], ['Udyam', 'Small enterprise']].map(([k, v]) => (
              <div key={k} className="row-between"><span>{k}</span><StatusBadge status={v} tone="ok" /></div>
            ))}
            <p className="small muted">Last checked 03 Oct 2026, 15:12 · Demo verification response</p>
          </div>
        </div>
      </div>
    </>
  )
}
