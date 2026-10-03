import { Check, Circle, Loader2 } from 'lucide-react'

function stateOf(i, current) {
  if (i < current) return 'done'
  if (i === current) return 'active'
  return 'pending'
}

/** Vertical list of process steps. `current` = index of the running step. */
export default function ProcessSteps({ steps, current, animate = true }) {
  return (
    <ol className="steps">
      {steps.map((s, i) => {
        const state = stateOf(i, current)
        return (
          <li key={s.label} className={`step ${state}`}>
            <span className="step-icon">
              {state === 'done' ? <Check /> : state === 'active' && animate ? <Loader2 className="spin" /> : <Circle size={8} />}
            </span>
            <div>
              <div className="step-title">{s.label}</div>
              {s.detail && state !== 'pending' && <div className="step-detail">{s.detail}</div>}
            </div>
          </li>
        )
      })}
    </ol>
  )
}

/** Horizontal progress indicator for multi-stage workflows. */
export function HSteps({ steps, current }) {
  return (
    <div className="hsteps">
      {steps.map((label, i) => {
        const state = stateOf(i, current)
        return (
          <div key={label} className={`hstep ${state}`}>
            <span className="step-icon">{state === 'done' ? <Check /> : <Circle size={8} />}</span>
            {label}
          </div>
        )
      })}
    </div>
  )
}
