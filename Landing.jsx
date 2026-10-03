import { ArrowRight, Building2, ChevronRight, FileSearch, Gavel, History, ScrollText, ShieldCheck, Timer } from 'lucide-react'
import { Link } from 'react-router-dom'

const PROCESS = ['Tender', 'Requirements', 'Documents', 'Verification', 'Compliance', 'Decision']

const WHY = [
  { icon: Timer, title: 'Reduce manual verification effort', text: 'One screen per bidder instead of checking each certificate against a separate portal.' },
  { icon: FileSearch, title: 'Detect missing and inconsistent information', text: 'Expired certificates, mismatched names and incomplete scope are flagged with the page they came from.' },
  { icon: ShieldCheck, title: 'Cross-check evidence against sources', text: 'Claims are compared with GST, Udyam, MCA, Income Tax, EPFO and debarment records.' },
  { icon: History, title: 'Maintain an auditable trail', text: 'Every extraction, check and officer decision is logged with its timestamp and evidence.' },
]

const HOW = [
  { title: 'Officer uploads the tender', text: 'Eligibility criteria, thresholds and required documents are extracted into a requirement checklist. The officer confirms or edits it before bids open.' },
  { title: 'Bidders upload documents', text: 'Each document is matched to a requirement. Key fields such as GSTIN, turnover and validity dates are extracted for verification.' },
  { title: 'Evidence is verified, the officer decides', text: 'Claims are checked against authoritative sources and tender rules. The officer reviews flagged items and records the final decision.' },
]

export default function Landing() {
  return (
    <main>
      <section className="container hero">
        <h1>BID SAHAYAK</h1>
        <p className="lede">AI-Powered Bid Compliance Verification</p>
        <p className="quote">Evidence-backed verification for faster, more transparent government procurement. A compliance layer that works alongside GeM, not a replacement for it.</p>

        <div className="role-cards">
          <div className="card role-card">
            <span className="role-icon"><Gavel size={22} /></span>
            <h2>Procurement Officer</h2>
            <p>Create tenders, review bidder compliance, verify evidence and make the final procurement decision.</p>
            <div><Link to="/officer/login" className="btn btn-primary btn-lg">Continue as Procurement Officer <ArrowRight /></Link></div>
          </div>
          <div className="card role-card">
            <span className="role-icon"><Building2 size={22} /></span>
            <h2>Bidder</h2>
            <p>Submit bid documents, track verification and monitor compliance requirements.</p>
            <div><Link to="/bidder/login" className="btn btn-secondary btn-lg">Continue as Bidder <ArrowRight /></Link></div>
          </div>
        </div>

        <div className="card process" aria-label="Verification process">
          {PROCESS.map((step, i) => (
            <span key={step} className="row" style={{ gap: 8 }}>
              <span className="process-step"><span className="n">{i + 1}</span>{step}</span>
              {i < PROCESS.length - 1 && <ChevronRight className="process-arrow" size={18} aria-hidden="true" />}
            </span>
          ))}
        </div>
      </section>

      <section className="section" id="how" style={{ background: '#fff', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
        <div className="container">
          <h2 className="title">How it works</h2>
          <p className="muted">Three stages, with the procurement officer in control at each one.</p>
          <div className="how-steps">
            {HOW.map((h, i) => (
              <div key={h.title}>
                <div className="process-step"><span className="n">{i + 1}</span>{h.title}</div>
                <p className="muted mt-8">{h.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section container">
        <h2 className="title">Why Bid Sahayak?</h2>
        <p className="muted">Built around the checks officers already perform by hand on every bid.</p>
        <div className="why-grid">
          {WHY.map(({ icon: Icon, title, text }) => (
            <div key={title} className="card why-card"><Icon aria-hidden="true" /><h3>{title}</h3><p>{text}</p></div>
          ))}
        </div>
      </section>

      <section className="section container" id="about" style={{ paddingTop: 8 }}>
        <div className="card card-body row wrap" style={{ gap: 20, justifyContent: 'space-between' }}>
          <div style={{ maxWidth: 700 }}>
            <h2 className="title" style={{ fontSize: 18 }}>About this prototype</h2>
            <p className="muted">
              Built for Smart India Hackathon 2026, problem statement SIH26100 (Ministry of Petroleum &amp; Natural Gas).
              Tender analysis, document extraction and portal verification are simulated with demonstration data.
              The AI recommends; the procurement officer decides.
            </p>
          </div>
          <Link to="/officer/login" className="btn btn-secondary"><ScrollText />Start the officer demo</Link>
        </div>
      </section>
    </main>
  )
}
