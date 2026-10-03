import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import AuthLayout from '../../layouts/AuthLayout'
import { useDemo } from '../../context/DemoContext'
import { bidderAccount } from '../../data/mock'

const GSTIN_RE = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/
const PAN_RE = /^[A-Z]{5}[0-9]{4}[A-Z]$/

const FIELDS = [
  ['company', 'Company Name', 'text', 'organization', true],
  ['representative', 'Authorized Representative', 'text', 'name'],
  ['email', 'Email', 'email', 'email'],
  ['phone', 'Phone', 'tel', 'tel'],
  ['gstin', 'GSTIN', 'text'],
  ['pan', 'PAN', 'text'],
  ['password', 'Password', 'password', 'new-password', true],
]

export default function BidderRegister() {
  const { dispatch } = useDemo()
  const navigate = useNavigate()
  const [form, setForm] = useState({ ...bidderAccount, password: 'demo-password-2026' })
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)
  const set = (k) => (e) => setForm({ ...form, [k]: ['gstin', 'pan'].includes(k) ? e.target.value.toUpperCase() : e.target.value })

  const submit = (e) => {
    e.preventDefault()
    const errs = {}
    FIELDS.forEach(([k, label]) => { if (!String(form[k] || '').trim()) errs[k] = `${label} is required.` })
    if (form.gstin && !GSTIN_RE.test(form.gstin)) errs.gstin = 'GSTIN has 15 characters, e.g. 29ABCDE1234F1Z5.'
    if (form.pan && !PAN_RE.test(form.pan)) errs.pan = 'PAN has 10 characters, e.g. ABCDE1234F.'
    if (form.gstin && form.pan && GSTIN_RE.test(form.gstin) && form.gstin.slice(2, 12) !== form.pan) errs.pan = 'PAN must match characters 3–12 of the GSTIN.'
    if (form.password && form.password.length < 12) errs.password = 'Use at least 12 characters.'
    setErrors(errs)
    if (Object.keys(errs).length) return
    setBusy(true)
    setTimeout(() => { dispatch({ type: 'signIn', role: 'bidder' }); navigate('/bidder/dashboard') }, 800)
  }

  return (
    <AuthLayout role="bidder">
      <h1>Create bidder account</h1>
      <p className="sub">GSTIN and PAN are checked against the issuing authority after registration.</p>
      <form className="form-grid mt-24" onSubmit={submit} noValidate>
        {FIELDS.map(([k, label, type, auto, wide]) => (
          <div key={k} className={`field${wide ? ' span-2' : ''}`}>
            <label htmlFor={k}>{label}</label>
            <input id={k} className={`input${['gstin', 'pan'].includes(k) ? ' mono' : ''}`} type={type} autoComplete={auto} value={form[k]} onChange={set(k)} aria-invalid={Boolean(errors[k])} />
            {errors[k] && <span className="small" style={{ color: 'var(--red)' }}>{errors[k]}</span>}
          </div>
        ))}
        <label className="check span-2"><input type="checkbox" defaultChecked /> I confirm the details are accurate and consent to their verification for procurement purposes.</label>
        <div className="span-2">
          <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={busy}>{busy ? <><Loader2 className="spin" /> Creating account…</> : 'Create account'}</button>
        </div>
      </form>
      <p className="mt-24 muted">Already registered? <Link to="/bidder/login">Sign in</Link></p>
    </AuthLayout>
  )
}
