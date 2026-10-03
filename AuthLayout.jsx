import { CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import Logo, { DemoChip } from '../components/Logo'

const COPY = {
  officer: {
    heading: 'Procurement Officer Portal',
    text: 'Evaluate bids against tender requirements with evidence from authoritative sources.',
    points: [
      'Requirement checklist extracted from each tender',
      'Bidder claims cross-checked against GST, Udyam, MCA and more',
      'Requirement-wise findings with evidence references',
      'Every action recorded in the audit trail',
    ],
  },
  bidder: {
    heading: 'Bidder Portal',
    text: 'Submit bid documents and see exactly which requirements are met before you submit.',
    points: [
      'Clear checklist of documents each tender needs',
      'Instant extraction check after every upload',
      'Track verification and officer review in one place',
    ],
  },
}

export default function AuthLayout({ role, children }) {
  const copy = COPY[role]
  return (
    <div className="auth-page">
      <aside className="auth-aside">
        <div>
          <Link to="/" style={{ textDecoration: 'none' }}><Logo light /></Link>
          <h2>{copy.heading}</h2>
          <p>{copy.text}</p>
          <ul>
            {copy.points.map((p) => <li key={p}><CheckCircle2 aria-hidden="true" />{p}</li>)}
          </ul>
        </div>
        <p className="small">AI-assisted verification. Human-decided outcomes.</p>
      </aside>
      <div className="auth-main">
        <div className="row-between">
          <Link to={`/${role}`} className="small">← {role === 'officer' ? 'Officer portal' : 'Bidder portal'}</Link>
          <DemoChip />
        </div>
        <div className="auth-form">{children}</div>
      </div>
    </div>
  )
}
