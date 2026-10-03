import { useState } from 'react'
import { PageHeader } from '../../components/Breadcrumbs'
import { useToast } from '../../components/Toast'
import { useDemo } from '../../context/DemoContext'
import { bidderAccount } from '../../data/mock'

const TABS = ['Company information', 'Representative', 'Notifications', 'Security']

export default function BidderSettings() {
  const [tab, setTab] = useState(TABS[0])
  const toast = useToast()
  const { dispatch } = useDemo()
  const a = bidderAccount
  const save = (e) => { e.preventDefault(); toast(`${tab} saved`) }

  return (
    <>
      <PageHeader crumbs={[{ label: 'Dashboard', to: '/bidder/dashboard' }, { label: 'Settings' }]} title="Settings" />
      <div className="tabs" role="tablist">
        {TABS.map((t) => <button key={t} type="button" role="tab" aria-selected={tab === t} className={`tab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>{t}</button>)}
      </div>
      <form className="card" style={{ maxWidth: 820 }} onSubmit={save}>
        <div className="card-body">
          {tab === 'Company information' && (
            <div className="form-grid">
              <div className="field span-2"><label htmlFor="c">Company name</label><input id="c" className="input" defaultValue={a.company} readOnly /><span className="hint">Legal name comes from your GST registration.</span></div>
              <div className="field span-2"><label htmlFor="ad">Correspondence address</label><input id="ad" className="input" defaultValue={a.address} /></div>
              <div className="field"><label htmlFor="g">GSTIN</label><input id="g" className="input mono" defaultValue={a.gstin} readOnly /></div>
              <div className="field"><label htmlFor="p">PAN</label><input id="p" className="input mono" defaultValue={a.pan} readOnly /></div>
            </div>
          )}
          {tab === 'Representative' && (
            <div className="form-grid">
              <div className="field"><label htmlFor="r">Name</label><input id="r" className="input" defaultValue={a.representative} /></div>
              <div className="field"><label htmlFor="d">Designation</label><input id="d" className="input" defaultValue={a.designation} /></div>
              <div className="field"><label htmlFor="e">Email</label><input id="e" className="input" defaultValue={a.email} /></div>
              <div className="field"><label htmlFor="ph">Phone</label><input id="ph" className="input" defaultValue={a.phone} /></div>
            </div>
          )}
          {tab === 'Notifications' && (
            <div className="stack" style={{ gap: 12 }}>
              {['New tenders in my categories', 'Verification status changes', 'Clarification requests (always on)', 'Deadline reminders 48 hours before closing'].map((l, i) => (
                <label key={l} className="check"><input type="checkbox" defaultChecked={i !== 3} disabled={i === 2} />{l}</label>
              ))}
            </div>
          )}
          {tab === 'Security' && (
            <div className="form-grid">
              <div className="field"><label htmlFor="cp">Current password</label><input id="cp" type="password" className="input" autoComplete="current-password" /></div>
              <div className="field" />
              <div className="field"><label htmlFor="np">New password</label><input id="np" type="password" className="input" autoComplete="new-password" /><span className="hint">At least 12 characters.</span></div>
              <div className="field"><label htmlFor="mf">Two-factor authentication</label><select id="mf" className="select" defaultValue="on"><option value="on">Authenticator app (on)</option><option value="off">Off</option></select></div>
            </div>
          )}
        </div>
        <div className="card-footer row-between">
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => { dispatch({ type: 'reset' }); toast('Demo data reset', 'info') }}>Reset demo data</button>
          <button type="submit" className="btn btn-primary">Save changes</button>
        </div>
      </form>
    </>
  )
}
