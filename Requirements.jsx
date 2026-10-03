import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Ban, CheckCircle2, FileText, Info, Pencil, Undo2 } from 'lucide-react'
import { PageHeader } from '../../components/Breadcrumbs'
import RequirementCard from '../../components/RequirementCard'
import StatusBadge from '../../components/StatusBadge'
import EmptyState from '../../components/EmptyState'
import Modal, { ConfirmDialog } from '../../components/Modal'
import { useToast } from '../../components/Toast'
import { useDemo } from '../../context/DemoContext'

function EditRequirement({ req, onSave, onClose }) {
  const [draft, setDraft] = useState(req)
  const set = (k) => (e) => setDraft({ ...draft, [k]: e.target.value })
  return (
    <Modal
      open
      title={`Edit ${req.id}`}
      onClose={onClose}
      width={600}
      footer={<><button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button><button type="button" className="btn btn-primary" onClick={() => onSave(draft)}>Save requirement</button></>}
    >
      <div className="form-grid">
        <div className="field span-2"><label htmlFor="rt">Requirement</label><input id="rt" className="input" value={draft.title} onChange={set('title')} /></div>
        <div className="field span-2"><label htmlFor="rc">Criterion</label><textarea id="rc" className="textarea" value={draft.criterion} onChange={set('criterion')} /></div>
        <div className="field"><label htmlFor="rth">Threshold</label><input id="rth" className="input" value={draft.threshold || ''} onChange={set('threshold')} placeholder="None" /></div>
        <div className="field">
          <label htmlFor="rcat">Category</label>
          <select id="rcat" className="select" value={draft.category} onChange={set('category')}>
            {['Mandatory', 'Applicable', 'Optional', 'Not Applicable'].map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="field span-2"><label htmlFor="re">Required evidence</label><input id="re" className="input" value={draft.evidence} onChange={set('evidence')} /></div>
      </div>
    </Modal>
  )
}

export default function Requirements() {
  const { id } = useParams()
  const { getTender, getRequirements, state, dispatch } = useDemo()
  const toast = useToast()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(null)
  const [confirming, setConfirming] = useState(false)
  const tender = getTender(id)
  if (!tender) return <EmptyState icon={FileText} title="Tender not found" action={<Link className="btn btn-secondary" to="/officer/tenders">Back to tenders</Link>} />

  const reqs = getRequirements(id)
  const confirmed = state.confirmed[id]
  const update = (req, note) => {
    dispatch({ type: 'updateRequirement', tenderId: id, req: { ...req, status: confirmed ? req.status : 'Edited' } })
    if (note) toast(note, 'info')
  }
  const counts = {
    mandatory: reqs.filter((r) => r.category === 'Mandatory').length,
    other: reqs.filter((r) => ['Optional', 'Applicable'].includes(r.category)).length,
    na: reqs.filter((r) => r.category === 'Not Applicable').length,
  }

  const confirm = () => {
    dispatch({ type: 'confirmRequirements', tenderId: id })
    setConfirming(false)
    toast('Requirements confirmed. Tender is open for bid evaluation.')
    navigate(`/officer/tenders/${id}/bids`)
  }

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Tenders', to: '/officer/tenders' }, { label: tender.ref, to: `/officer/tenders/${id}` }, { label: 'Requirements' }]}
        title="Tender Requirements"
        sub={<><span className="mono">{tender.ref}</span> · {tender.title}</>}
        actions={confirmed
          ? <Link to={`/officer/tenders/${id}/bids`} className="btn btn-primary">Open Bid Evaluation</Link>
          : <button type="button" className="btn btn-primary" onClick={() => setConfirming(true)}><CheckCircle2 />Confirm Requirements &amp; Open for Bids</button>}
      />

      <div className="card card-body meta-strip">
        <div><div className="k">Extraction status</div><div className="v"><StatusBadge status="Requirements extracted" tone="ok" /></div></div>
        <div><div className="k">Source document</div><div className="v">{tender.document}</div></div>
        <div><div className="k">Mandatory</div><div className="v num">{counts.mandatory}</div></div>
        <div><div className="k">Optional / applicable</div><div className="v num">{counts.other}</div></div>
        <div><div className="k">Not applicable</div><div className="v num">{counts.na}</div></div>
        <div><div className="k">Officer confirmation</div><div className="v">{confirmed ? <StatusBadge status="Confirmed" /> : <StatusBadge status="Pending" />}</div></div>
      </div>

      <div className="callout info mt-16">
        <Info />
        <span>Requirements below were extracted from the uploaded tender document. Officer confirmation is required before evaluation.</span>
      </div>

      <div className="card mt-16">
        {reqs.map((r) => {
          const na = r.category === 'Not Applicable'
          return (
            <RequirementCard
              key={r.id}
              req={r}
              status={na ? 'Not Applicable' : confirmed ? 'Confirmed' : r.status === 'Edited' ? 'Edited' : 'Extracted'}
              actions={
                <div className="row wrap" style={{ gap: 4, justifyContent: 'flex-end' }}>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => setEditing(r)}><Pencil />Edit</button>
                  {r.category === 'Mandatory' && (
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => update({ ...r, category: 'Optional' }, `${r.id} marked optional`)}>Mark optional</button>
                  )}
                  {na ? (
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => update({ ...r, category: 'Mandatory' }, `${r.id} restored`)}><Undo2 />Restore</button>
                  ) : (
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => update({ ...r, category: 'Not Applicable' }, `${r.id} marked not applicable`)}><Ban />Not applicable</button>
                  )}
                </div>
              }
            />
          )
        })}
      </div>

      {!confirmed && (
        <div className="row-between mt-16 wrap">
          <span className="muted small">Review each requirement against the tender clause shown before confirming.</span>
          <button type="button" className="btn btn-primary btn-lg" onClick={() => setConfirming(true)}><CheckCircle2 />Confirm Requirements &amp; Open for Bids</button>
        </div>
      )}

      {editing && <EditRequirement req={editing} onClose={() => setEditing(null)} onSave={(r) => { update(r, `${r.id} updated`); setEditing(null) }} />}
      <ConfirmDialog
        open={confirming}
        title="Confirm requirements?"
        confirmLabel="Confirm & open for bids"
        onConfirm={confirm}
        onCancel={() => setConfirming(false)}
      >
        <p>{reqs.length - counts.na} requirements ({counts.mandatory} mandatory) will be used to assess every bid for <strong>{tender.ref}</strong>.</p>
        <p className="muted mt-8">This confirmation is recorded in the audit trail.</p>
      </ConfirmDialog>
    </>
  )
}
