import { Link, useLocation } from 'react-router-dom'
import { Clock } from 'lucide-react'
import AuthLayout from '../../layouts/AuthLayout'
import ProcessSteps from '../../components/ProcessSteps'
import StatusBadge from '../../components/StatusBadge'
import { useDemo } from '../../context/DemoContext'

const STEPS = [
  { label: 'Registration submitted', detail: '03 Oct 2026, 16:05' },
  { label: 'Email verified', detail: '03 Oct 2026, 16:07' },
  { label: 'Organization verification', detail: 'Nodal officer of your organization confirms your appointment' },
  { label: 'Access enabled' },
]

export default function VerificationPending() {
  const { state } = useLocation()
  const { dispatch } = useDemo()
  return (
    <AuthLayout role="officer">
      <div className="row" style={{ gap: 10 }}><Clock color="var(--amber)" /><span className="small strong" style={{ color: 'var(--amber)' }}>Verification pending</span></div>
      <h1 className="mt-8">Your officer registration has been submitted</h1>
      <div className="card mt-24">
        <div className="card-body kv">
          <div className="k">Organization</div><div className="v">{state?.organization || 'Central Public Procurement Department'}</div>
          <div className="k">Status</div><div className="v"><StatusBadge status="Pending Organization Verification" /></div>
          <div className="k">Reference</div><div className="v mono">REG-OFF-2026-00418</div>
        </div>
      </div>
      <div className="card card-body mt-16">
        <ProcessSteps steps={STEPS} current={2} animate={false} />
      </div>
      <p className="small muted mt-16">Prototype note: organization verification is simulated for demonstration.</p>
      <Link to="/officer/dashboard" className="btn btn-primary btn-lg btn-block mt-16" onClick={() => dispatch({ type: 'signIn', role: 'officer' })}>
        Continue to Demo Dashboard
      </Link>
    </AuthLayout>
  )
}
