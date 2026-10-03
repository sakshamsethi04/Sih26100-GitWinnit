import { useRef, useState } from 'react'
import { CheckCircle2, Loader2, UploadCloud } from 'lucide-react'

/**
 * Drop zone with a "use sample file" shortcut for demos. Nothing is uploaded:
 * the selected file name is passed to onFile and processing is simulated by the caller.
 */
export default function FileUpload({ label = 'Drop file here', accept = '.pdf', sample, onFile, file, processing, compact }) {
  const input = useRef(null)
  const [drag, setDrag] = useState(false)

  const pick = (f) => { if (f) onFile(f.name, f.size) }

  if (file) {
    return (
      <div className="file-row">
        <span className="file-icon">PDF</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="strong" style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{file}</div>
          <div className="small muted">{processing ? 'Processing…' : 'Ready'}</div>
        </div>
        {processing ? <Loader2 className="spin" size={18} color="var(--blue)" /> : <CheckCircle2 size={18} color="var(--green)" />}
      </div>
    )
  }

  return (
    <div>
      <div
        className={`dropzone${drag ? ' drag' : ''}`}
        style={compact ? { padding: '16px' } : undefined}
        role="button"
        tabIndex={0}
        onClick={() => input.current?.click()}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); input.current?.click() } }}
        onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); pick(e.dataTransfer.files?.[0]) }}
      >
        <UploadCloud aria-hidden="true" />
        <div className="strong">{label}</div>
        <div className="muted small">or <span className="link-btn">choose file</span> · PDF, max 20 MB</div>
        <input ref={input} type="file" accept={accept} hidden onChange={(e) => pick(e.target.files?.[0])} />
      </div>
      {sample && (
        <div className="small muted mt-8">
          No file handy? <button type="button" className="link-btn" onClick={() => onFile(sample)}>Use sample: {sample}</button>
        </div>
      )}
    </div>
  )
}
