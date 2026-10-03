import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import AuthLayout from '../../layouts/AuthLayout'
import { useDemo } from '../../context/DemoContext'
import { bidderAccount } from '../../data/mock'

export default function BidderLogin() {
  const { dispatch } = useDemo()
  const navigate = useNavigate()
  const [email, setEmail] = useState(bidderAccount.email)
  const [password, setPassword] = useState('demo-password')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const submit = (e) => {
    e.preventDefault()
    if (!email.includes('@') || !password) { setError('Enter your email and password.'); return }
    setBusy(true)
    setTimeout(() => { dispatch({ type: 'signIn', role: 'bidder' }); navigate('/bidder/dashboard') }, 700)
  }

  return (
    <AuthLayout role="bidder">
      <h1>Sign in</h1>
      <p className="sub">Bidder access</p>
      <div className="callout info mt-16 small">Demo credentials for Apex Systems Pvt Ltd are filled in.</div>
      <form className="stack mt-24" onSubmit={submit} noValidate>
        {error && <div className="callout fail" role="alert">{error}</div>}
        <div className="field"><label htmlFor="email">Email</label><input id="email" className="input" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
        <div className="field"><label htmlFor="password">Password</label><input id="password" className="input" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
        <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={busy}>{busy ? <><Loader2 className="spin" /> Signing in…</> : 'Login'}</button>
      </form>
      <p className="mt-24 muted">New bidder? <Link to="/bidder/register">Create an account</Link></p>
    </AuthLayout>
  )
}
