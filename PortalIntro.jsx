import { ArrowRight, Building2, Gavel } from 'lucide-react'
import { Link } from 'react-router-dom'

const COPY = {
  officer: {
    icon: Gavel,
    title: 'Procurement Officer Portal',
    text: 'For officers who publish tenders and evaluate bids. Accounts require organisation verification before procurement access is enabled.',
    steps: ['Upload a tender and confirm its extracted requirements', 'Review each bid’s requirement-wise compliance and evidence', 'Approve, seek clarification or reject, with every step logged'],
  },
  bidder: {
    icon: Building2,
    title: 'Bidder Portal',
    text: 'For firms submitting bids. See what each tender requires, upload documents and follow verification of your bid.',
    steps: ['Review a tender’s eligibility requirements', 'Upload documents and check what was extracted', 'Submit your bid and track verification status'],
  },
}

export default function PortalIntro({ role }) {
  const c = COPY[role]
  const Icon = c.icon
  return (
    <main className="container" style={{ padding: '56px 24px 24px', maxWidth: 760 }}>
      <span className="role-icon" style={{ width: 48, height: 48, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--blue-50)', color: 'var(--blue)' }}>
        <Icon size={24} />
      </span>
      <h1 style={{ fontSize: 30, marginTop: 18 }}>{c.title}</h1>
      <p className="muted mt-12" style={{ fontSize: 16, maxWidth: 620 }}>{c.text}</p>
      <ol className="card card-body mt-24" style={{ margin: '24px 0 0', paddingLeft: 38, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {c.steps.map((s) => <li key={s}>{s}</li>)}
      </ol>
      <div className="row mt-24">
        <Link to={`/${role}/login`} className="btn btn-primary btn-lg">Login <ArrowRight /></Link>
        <Link to={`/${role}/register`} className="btn btn-secondary btn-lg">Create account</Link>
      </div>
    </main>
  )
}
