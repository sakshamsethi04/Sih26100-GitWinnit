import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Info, Loader2 } from 'lucide-react'
import AuthLayout from '../../layouts/AuthLayout'

const FIELDS = [
  ['fullName', 'Full Name', 'text', 'name'],
  ['email', 'Official Email', 'email', 'email'],
  ['organization', 'Organization', 'text', 'organization'],
  ['department', 'Department', 'text'],
  ['designation', 'Designation', 'text', 'organization-title'],
  ['officerId', 'Employee / Officer ID', 'text'],
  ['password', 'Password', 'password', 'new-password'],
  ['confirm', 'Confirm Password', 'password', 'new-password'],
]

const DEMO = {
  fullName: 'A. K. Verma', email: 'ak.verma@cppd.gov.in', organization: 'Central Public Procurement Department',
  department: 'IT & Communications Procurement Cell', designation: 'Deputy Manager (Procurement)', officerId: 'CPPD-PO-2291',
  password: 'demo-password-2026', confirm: 'demo-password-2026',
}

export default function OfficerRegister() {
  const navigate = useNavigate()
  const [form, setForm] = useState(DEMO)
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const submit = (e) => {
    e.preventDefault()
    const errs = {}
    FIELDS.forEach(([k, label]) => { if (!form[k].trim()) errs[k] = `${label} is required.` })
    if (form.email && !/@(.+\.)?(gov|nic)\.in$/i.test(form.email)) errs.email = 'Use an official government email (gov.in or nic.in).'
    if (form.password && form.password.length < 12) errs.password = 'Use at least 12 characters.'
    if (form.confirm && form.confirm !== form.password) errs.confirm = 'Passwords do not match.'
    setErrors(errs)
    if (Object.keys(errs).length) return
    setBusy(true)
    setTimeout(() => navigate('/officer/verification-pending', { state: { organization: form.organization } }), 800)
  }

  return (
    <AuthLayout role="officer">
      <h1>Create officer account</h1>
      <p className="sub">Registration for procurement officers of government departments and PSUs.</p>
      <div className="callout info mt-16"><Info />Verification is required before procurement access is enabled.</div>
      <form className="form-grid mt-24" onSubmit={submit} noValidate>
        {FIELDS.map(([k, label, type, auto]) => (
          <div key={k} className={`field${['email', 'organization'].includes(k) ? ' span-2' : ''}`}>
            <label htmlFor={k}>{label}</label>
            <input id={k} className="input" type={type} autoComplete={auto} value={form[k]} onChange={set(k)} aria-invalid={Boolean(errors[k])} />
            {errors[k] && <span className="small" style={{ color: 'var(--red)' }}>{errors[k]}</span>}
          </div>
        ))}
        <div className="span-2">
          <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={busy}>
            {busy ? <><Loader2 className="spin" /> Submitting registration…</> : 'Register'}
          </button>
        </div>
      </form>
      <p className="mt-24 muted">Already registered? <Link to="/officer/login">Sign in</Link></p>
    </AuthLayout>
  )
}
