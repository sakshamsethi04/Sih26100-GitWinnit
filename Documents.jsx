import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowRight, CheckCircle2, FileText, Loader2, Upload } from 'lucide-react'
import { PageHeader } from '../../components/Breadcrumbs'
import StatusBadge from '../../components/StatusBadge'
import Modal from '../../components/Modal'
import FileUpload from '../../components/FileUpload'
import ProcessSteps from '../../components/ProcessSteps'
import EmptyState from '../../components/EmptyState'
import { useToast } from '../../components/Toast'
import { useDemo } from '../../context/DemoContext'
import { useSteps } from '../../utils/useSteps'
import { docSummary, docsFor } from './shared'

const PROCESS = [
  { label: 'Uploading document' },
  { label: 'Document extraction', detail: 'Text and fields read from the PDF' },
  { label: 'Matching to requirement' },
]

function UploadModal({ doc, onClose, onDone }) {
  const [file, setFile] = useState(null)
  const [stage, setStage] = useState('pick') // pick | processing | done
  const current = useSteps(PROCESS.length, { running: stage === 'processing', interval: 700, onDone: () => setStage('done') })

  const footer = stage === 'done'
    ? <button type="button" className="btn btn-primary" onClick={() => onDone(file)}>Done</button>
    : <>
        <button type="button" className="btn btn-secondary" onClick={onClose} disabled={stage === 'processing'}>Cancel</button>
        <button type="button" className="btn btn-primary" disabled={!file || stage === 'processing'} onClick={() => setStage('processing')}>
          {stage === 'processing' ? <><Loader2 className="spin" />Processing…</> : <><Upload />Upload</>}
        </button>
      </>

  return (
    <Modal open title={`Upload ${doc.name}`} onClose={stage === 'processing' ? () => {} : onClose} footer={footer} width={560}>
      {stage === 'pick' && <FileUpload label={`Drop ${doc.name} here`} sample={doc.sample || doc.file || `${doc.name.replace(/\s+/g, '_')}.pdf`} file={file} onFile={setFile} />}
      {stage !== 'pick' && (
        <>
          <FileUpload file={file} processing={stage === 'processing'} onFile={() => {}} />
          <div className="mt-16"><ProcessSteps steps={PROCESS} current={stage === 'done' ? PROCESS.length : current} /></div>
        </>
      )}
      {stage === 'done' && (
        <div className="mt-16">
          <div className="callout ok"><CheckCircle2 /><span>Document uploaded successfully. Document extraction ✓ completed.</span></div>
          <div className="card mt-12">
            <div className="card-header"><h3>Extracted fields</h3><span className="small muted">Check these match your document</span></div>
            <div className="card-body kv">
              {doc.extracted.map(([k, v]) => [<div key={`${k}k`} className="k">{k}</div>, <div key={`${k}v`} className="v">{v}</div>])}
            </div>
          </div>
        </div>
      )}
    </Modal>
  )
}

export default function Documents() {
  const { id } = useParams()
  const { getTender, state, dispatch } = useDemo()
  const toast = useToast()
  const [uploading, setUploading] = useState(null)
  const [localDocs, setLocalDocs] = useState(null)
  const tender = getTender(id)
  if (!tender) return <EmptyState icon={FileText} title="Tender not found" action={<Link className="btn btn-secondary" to="/bidder/tenders">Back to tenders</Link>} />

  const docs = id === '1048' ? state.bidderDocs : localDocs || docsFor(id, state)
  const sum = docSummary(docs)
  const submitted = id === '1048' && state.bidSubmission

  const finish = (doc, file) => {
    if (id === '1048') dispatch({ type: 'uploadBidderDoc', key: doc.key, file, name: doc.name })
    else setLocalDocs(docs.map((d) => (d.key === doc.key ? { ...d, status: 'Verified', file } : d)))
    setUploading(null)
    toast(`${doc.name} uploaded and extracted`)
  }

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Available tenders', to: '/bidder/tenders' }, { label: tender.ref, to: `/bidder/tenders/${id}` }, { label: 'Documents' }]}
        title="Bid documents"
        sub={<><span className="mono">{tender.ref}</span> · {tender.title}</>}
        actions={<Link to={`/bidder/tenders/${id}/submission`} className="btn btn-primary">Review &amp; submit <ArrowRight /></Link>}
      />
      <div className="card card-body">
        <div className="row-between wrap">
          <div>
            <div className="strong">{sum.mandatoryUploaded} of {sum.mandatoryTotal} mandatory documents uploaded</div>
            <div className="small muted">{sum.attention.length ? `${sum.attention.length} document${sum.attention.length > 1 ? 's need' : ' needs'} attention` : 'All documents are in order'}</div>
          </div>
          <div style={{ width: 280 }} className="progress-inline">
            <span className="bar"><span style={{ width: `${(sum.mandatoryUploaded / sum.mandatoryTotal) * 100}%`, background: sum.ready ? 'var(--green)' : 'var(--blue)' }} /></span>
            <span className="num strong">{Math.round((sum.mandatoryUploaded / sum.mandatoryTotal) * 100)}%</span>
          </div>
        </div>
      </div>
      {submitted && <div className="callout info mt-16"><span>This bid was submitted on {state.bidSubmission.at}. Documents are locked. <Link to={`/bidder/tenders/${id}/status`}>Track verification</Link></span></div>}

      <div className="card mt-16">
        <div className="card-header"><h2>Document checklist</h2></div>
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Document</th><th>Requirement</th><th>File</th><th>Status</th><th /></tr></thead>
            <tbody>
              {docs.map((d) => {
                const needsUpload = ['Not uploaded', 'Missing'].includes(d.status)
                return (
                  <tr key={d.key}>
                    <td><div className="cell-title">{d.name}</div><div className="cell-sub">{d.note || (d.mandatory ? 'Mandatory' : 'Optional')}</div></td>
                    <td className="mono small">{d.reqId}</td>
                    <td className="small">{d.file ? <span className="row" style={{ gap: 6 }}><FileText size={14} color="var(--red)" />{d.file}</span> : <span className="muted">—</span>}</td>
                    <td><StatusBadge status={d.status} /></td>
                    <td style={{ textAlign: 'right' }}>
                      <button type="button" className={`btn btn-sm ${needsUpload ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setUploading(d)} disabled={Boolean(submitted)}>
                        <Upload />{needsUpload ? 'Upload' : 'Replace'}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className="card-footer small muted">PDF only, up to 20 MB each. Scanned documents are read with OCR; check the extracted fields after each upload.</div>
      </div>

      {uploading && <UploadModal doc={uploading} onClose={() => setUploading(null)} onDone={(file) => finish(uploading, file)} />}
    </>
  )
}
