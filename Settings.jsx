import { useState } from 'react'
import { PageHeader } from '../../components/Breadcrumbs'
import { useToast } from '../../components/Toast'
import { useDemo } from '../../context/DemoContext'
import { officer } from '../../data/mock'

const TABS = ['Profile', 'Organization', 'Notifications', 'Verification Preferences']

function Toggle({ label, hint, defaultChecked }) {
  return (
    <label className="row-between" style={{ padding: '12px 0', borderBottom: '1px solid var(--line)' }}>
      <span><span className="strong">{label}</span>{hint && <span className="small muted" style={{ display: 'block' }}>{hint}</span>}</span>
      <input type="checkbox" defaultChecked={defaultChecked} style={{ width: 18, height: 18, accentColor: 'var(--blue)' }} />
    </label>
  )
}

export default function OfficerSettings() {
  const [tab, setTab] = useState(TABS[0])
  const toast = useToast()
  const { dispatch } = useDemo()
  const save = (e) => { e.preventDefault(); toast(`${tab} settings saved`) }

  return (
    <>
      <PageHeader crumbs={[{ label: 'Dashboard', to: '/officer/dashboard' }, { label: 'Settings' }]} title="Settings" />
      <div className="tabs" role="tablist">
        {TABS.map((t) => <button key={t} type="button" role="tab" aria-selected={tab === t} className={`tab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>{t}</button>)}
      </div>
      <form className="card" style={{ maxWidth: 820 }} onSubmit={save}>
        <div className="card-body">
          {tab === 'Profile' && (
            <div className="form-grid">
              <div className="field"><label htmlFor="n">Full name</label><input id="n" className="input" defaultValue={officer.name} /></div>
              <div className="field"><label htmlFor="d">Designation</label><input id="d" className="input" defaultValue={officer.designation} /></div>
              <div className="field"><label htmlFor="e">Official email</label><input id="e" className="input" defaultValue={officer.email} readOnly /></div>
              <div className="field"><label htmlFor="i">Officer ID</label><input id="i" className="input mono" defaultValue={officer.employeeId} readOnly /></div>
            </div>
          )}
          {tab === 'Organization' && (
            <div className="kv">
              <div className="k">Organization</div><div className="v">{officer.organization}</div>
              <div className="k">Department</div><div className="v">{officer.department}</div>
              <div className="k">Verification</div><div className="v">Verified by nodal officer, 12 Apr 2026</div>
              <div className="k">Procurement access</div><div className="v">Tender creation, bid evaluation, final decision</div>
            </div>
          )}
          {tab === 'Notifications' && (
            <>
              <Toggle label="Assessment ready" hint="When a bid’s compliance assessment is generated" defaultChecked />
              <Toggle label="Requirement flagged for review" defaultChecked />
              <Toggle label="Bidder responds to clarification" defaultChecked />
              <Toggle label="Daily summary email" hint="Sent at 09:00" />
            </>
          )}
          {tab === 'Verification Preferences' && (
            <>
              <Toggle label="Re-verify sources before final decision" hint="Refresh GST and debarment status if older than 24 hours" defaultChecked />
              <Toggle label="Flag name mismatches across documents" defaultChecked />
              <Toggle label="Require comment for every decision" hint="Comments are always required for rejection and clarification" />
              <div className="field mt-16" style={{ maxWidth: 320 }}>
                <label htmlFor="th">Review threshold</label>
                <select id="th" className="select" defaultValue="0.80"><option value="0.70">Flag below 70% confidence</option><option value="0.80">Flag below 80% confidence</option><option value="0.90">Flag below 90% confidence</option></select>
              </div>
            </>
          )}
        </div>
        <div className="card-footer row-between">
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => { dispatch({ type: 'reset' }); toast('Demo data reset', 'info') }}>Reset demo data</button>
          {tab !== 'Organization' && <button type="submit" className="btn btn-primary">Save changes</button>}
        </div>
      </form>
    </>
  )
}
