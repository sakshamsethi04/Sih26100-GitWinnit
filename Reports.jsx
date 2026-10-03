import { BarChart3, ClipboardCheck, Download, Flag, Timer } from 'lucide-react'
import { PageHeader } from '../../components/Breadcrumbs'
import StatCard from '../../components/StatCard'
import { BarChart, HBarChart } from '../../components/Charts'
import { useToast } from '../../components/Toast'
import { reports } from '../../data/mock'

const DIST_COLORS = ['#b42318', '#d39b22', '#2453b8', '#2f7d57', '#1d7148']

export default function Reports() {
  const toast = useToast()
  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Dashboard', to: '/officer/dashboard' }, { label: 'Reports' }]}
        title="Reports"
        sub="April – September 2026 · Central Public Procurement Department"
        actions={<button type="button" className="btn btn-secondary" onClick={() => toast('Report PDF prepared for download (simulated)', 'info')}><Download />Download PDF</button>}
      />
      <div className="stats">
        <StatCard icon={ClipboardCheck} label="Tenders Evaluated" value="143" note="+12% vs previous half-year" />
        <StatCard icon={Timer} label="Average Verification Time" value="18 min" note="Per bid, from submission to assessment" />
        <StatCard icon={Flag} label="Requirements Flagged" value="37" note="Across 143 tenders" />
        <StatCard icon={BarChart3} label="Manual Reviews" value="24" note="Officer judgement required" />
      </div>
      <div className="grid-2 mt-16">
        <div className="card">
          <div className="card-header"><h2>Compliance score distribution</h2><span className="small muted">Bids assessed</span></div>
          <div className="card-body"><BarChart data={reports.complianceDistribution.map((d, i) => ({ ...d, color: DIST_COLORS[i] }))} /></div>
        </div>
        <div className="card">
          <div className="card-header"><h2>Tender evaluation volume</h2><span className="small muted">Tenders per month</span></div>
          <div className="card-body"><BarChart data={reports.monthlyVolume} /></div>
        </div>
      </div>
      <div className="grid-2 mt-16">
        <div className="card">
          <div className="card-header"><h2>Requirement failure frequency</h2><span className="small muted">Not satisfied or review required</span></div>
          <div className="card-body"><HBarChart data={reports.failureFrequency} color="#c48a12" /></div>
        </div>
        <div className="card">
          <div className="card-header"><h2>Observations</h2></div>
          <div className="card-body">
            <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <li>Experience certificates are the most common reason for review, usually because project scope isn’t stated.</li>
              <li>OEM authorizations most often fail because they are generic rather than tender-specific.</li>
              <li>Source checks (GST, Udyam, PAN) resolve in under 2 seconds on average and rarely need officer input.</li>
            </ul>
            <p className="small muted mt-16">Figures are demonstration data for the prototype.</p>
          </div>
        </div>
      </div>
    </>
  )
}
