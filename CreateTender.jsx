import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, FileSearch } from 'lucide-react'
import { PageHeader } from '../../components/Breadcrumbs'
import FileUpload from '../../components/FileUpload'
import ProcessSteps from '../../components/ProcessSteps'
import { useDemo } from '../../context/DemoContext'
import { useSteps } from '../../utils/useSteps'
import { formatINR } from '../../utils/format'

const ANALYSIS = [
  { label: 'Reading tender document', detail: '64 pages · 2 annexures detected' },
  { label: 'Detecting mandatory clauses', detail: 'Sections 4, 5 and 6 contain eligibility conditions' },
  { label: 'Extracting eligibility requirements', detail: '10 requirements found (8 mandatory, 2 conditional/optional)' },
  { label: 'Identifying mandatory documents', detail: '9 document types mapped to requirements' },
  { label: 'Mapping verification sources', detail: 'GST, Udyam, Income Tax, debarment list, OEM registry' },
  { label: 'Building compliance checklist', detail: 'Ready for officer confirmation' },
]

const DEFAULTS = {
  title: 'Supply of Network Equipment',
  ref: 'GEM/PROC/2026/1048',
  department: 'IT & Communications Procurement Cell',
  value: '24500000',
  deadline: '2026-09-25T15:00',
  description: 'Supply, installation and commissioning of managed L2/L3 switches, firewalls and wireless access points across 14 regional offices, with 3-year comprehensive warranty.',
}

function AnalysisScreen({ file, onDone }) {
  const current = useSteps(ANALYSIS.length, { interval: 800, onDone })
  const done = current >= ANALYSIS.length
  return (
    <div className="card" style={{ maxWidth: 640, margin: '0 auto' }}>
      <div className="card-header">
        <div className="row"><FileSearch size={18} /><h2>{done ? 'Analysis complete' : 'Analyzing tender…'}</h2></div>
        <span className="small muted mono">{file}</span>
      </div>
      <div className="card-body"><ProcessSteps steps={ANALYSIS} current={current} /></div>
      <div className="card-footer small muted">
        {done ? <span className="row" style={{ color: 'var(--green)' }}><CheckCircle2 size={16} />Opening extracted requirements…</span>
          : 'Simulated analysis for the prototype. No document leaves your browser.'}
      </div>
    </div>
  )
}

export default function CreateTender() {
  const { dispatch, state } = useDemo()
  const navigate = useNavigate()
  const [form, setForm] = useState(DEFAULTS)
  const [file, setFile] = useState(null)
  const [error, setError] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const tenderId = (form.ref.match(/(\d{3,4})\s*$/) || [])[1] || String(Date.now()).slice(-4)

  const analyze = (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.ref.trim()) { setError('Enter the tender title and tender ID.'); return }
    if (!file) { setError('Upload the tender document to analyse.'); return }
    setError('')
    setAnalyzing(true)
  }

  const finish = () => {
    const existing = state.tenders.find((t) => t.id === tenderId)
    const d = new Date(form.deadline)
    dispatch({
      type: 'upsertTender',
      tender: {
        ...(existing || { bids: 0, pendingReviews: 0, publishedOn: '03 Oct 2026', documentPages: 64 }),
        id: tenderId,
        ref: form.ref.trim(),
        title: form.title.trim(),
        department: form.department,
        value: Number(form.value) || 0,
        deadline: Number.isNaN(d.getTime()) ? form.deadline : `${d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}, ${d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`,
        description: form.description,
        document: file,
        status: existing?.status || 'Draft',
        compliance: existing?.compliance || 'Requirements pending confirmation',
      },
    })
    navigate(`/officer/tenders/${tenderId}/requirements`)
  }

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Dashboard', to: '/officer/dashboard' }, { label: 'Tenders', to: '/officer/tenders' }, { label: 'Create tender' }]}
        title="Create tender"
        sub="Enter the tender details and upload the tender document. Requirements are extracted for your confirmation."
      />
      {analyzing ? (
        <AnalysisScreen file={file} onDone={finish} />
      ) : (
        <form className="grid-main" onSubmit={analyze} noValidate>
          <div className="card">
            <div className="card-header"><h2>Tender details</h2></div>
            <div className="card-body form-grid">
              <div className="field span-2"><label htmlFor="t">Tender Title</label><input id="t" className="input" value={form.title} onChange={set('title')} /></div>
              <div className="field"><label htmlFor="r">Tender ID</label><input id="r" className="input mono" value={form.ref} onChange={set('ref')} /></div>
              <div className="field">
                <label htmlFor="d">Department</label>
                <select id="d" className="select" value={form.department} onChange={set('department')}>
                  {['IT & Communications Procurement Cell', 'Administration Division', 'Estate & Security Division'].map((x) => <option key={x}>{x}</option>)}
                </select>
              </div>
              <div className="field"><label htmlFor="v">Tender Value (₹)</label><input id="v" className="input num" inputMode="numeric" value={form.value} onChange={set('value')} /><span className="hint">Estimated value: {formatINR(Number(form.value) || 0)}</span></div>
              <div className="field"><label htmlFor="dl">Bid Submission Deadline</label><input id="dl" type="datetime-local" className="input" value={form.deadline} onChange={set('deadline')} /></div>
              <div className="field span-2"><label htmlFor="desc">Description</label><textarea id="desc" className="textarea" value={form.description} onChange={set('description')} /></div>
            </div>
          </div>
          <div className="stack">
            <div className="card">
              <div className="card-header"><h2>Tender document</h2></div>
              <div className="card-body">
                <FileUpload label="Drop tender PDF here" sample="Network_Equipment_Tender.pdf" file={file} onFile={setFile} />
                {file && <button type="button" className="link-btn small mt-8" onClick={() => setFile(null)}>Replace file</button>}
              </div>
            </div>
            {error && <div className="callout fail" role="alert">{error}</div>}
            <button type="submit" className="btn btn-primary btn-lg btn-block"><FileSearch />Analyze Tender</button>
            <p className="small muted">Extracted requirements are a draft. You confirm or edit each one before bids open.</p>
          </div>
        </form>
      )}
    </>
  )
}
