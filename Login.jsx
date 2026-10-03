import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import AuthLayout from '../../layouts/AuthLayout'
import { useDemo } from '../../context/DemoContext'
import { officer } from '../../data/mock'

export default function OfficerLogin() {
  const { dispatch } = useDemo()
  const navigate = useNavigate()
  const [email, setEmail] = useState(officer.email)
  const [password, setPassword] = useState('demo-password')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const submit = (e) => {
    e.preventDefault()
    if (!email.includes('@') || !password) { setError('Enter your official email and password.'); return }
    setBusy(true)
    setTimeout(() => {
      dispatch({ type: 'signIn', role: 'officer' })
      navigate('/officer/dashboard')
    }, 700)
  }

  return (
    <AuthLayout role="officer">
      <h1>Sign in</h1>
      <p className="sub">Procurement Officer access</p>
      <div className="callout info mt-16 small">Demo credentials are filled in. Any email and password will work in this prototype.</div>
      <form className="stack mt-24" onSubmit={submit} noValidate>
        {error && <div className="callout fail" role="alert">{error}</div>}
        <div className="field">
          <label htmlFor="email">Official Email</label>
          <input id="email" className="input" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="field">
          <div className="row-between">
            <label htmlFor="password">Password</label>
            <button type="button" className="link-btn small" onClick={() => setError('Password reset is not part of this prototype. Use the demo credentials.')}>Forgot password?</button>
          </div>
          <input id="password" className="input" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <label className="check"><input type="checkbox" defaultChecked /> Remember me on this device</label>
        <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={busy}>
          {busy ? <><Loader2 className="spin" /> Signing in…</> : 'Login'}
        </button>
      </form>
      <p className="mt-24 muted">Need an account? <Link to="/officer/register">Register</Link></p>
    </AuthLayout>
  )
}
