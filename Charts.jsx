/** Lightweight SVG/CSS charts. No chart library needed for the demo. */

export function Donut({ segments, size = 132, thickness = 16, center, sub }) {
  const r = (size - thickness) / 2
  const c = 2 * Math.PI * r
  const total = segments.reduce((s, x) => s + x.value, 0) || 1
  let offset = 0
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={segments.map((s) => `${s.label}: ${s.value}`).join(', ')}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#eef1f5" strokeWidth={thickness} />
      {segments.map((s) => {
        const len = (s.value / total) * c
        const el = (
          <circle
            key={s.label}
            cx={size / 2} cy={size / 2} r={r} fill="none"
            stroke={s.color} strokeWidth={thickness}
            strokeDasharray={`${len} ${c - len}`} strokeDashoffset={-offset}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        )
        offset += len
        return el
      })}
      {center && (
        <text x="50%" y={sub ? '47%' : '53%'} textAnchor="middle" dominantBaseline="middle" fontSize={size * 0.2} fontWeight="700" fill="#18212f">{center}</text>
      )}
      {sub && <text x="50%" y="64%" textAnchor="middle" fontSize="11" fill="#5d6879">{sub}</text>}
    </svg>
  )
}

export function ScoreRing({ value, size = 132 }) {
  const color = value >= 90 ? '#1d7148' : value >= 75 ? '#2453b8' : value >= 60 ? '#c48a12' : '#b42318'
  return <Donut size={size} segments={[{ label: 'Score', value, color }, { label: 'Remaining', value: 100 - value, color: '#eef1f5' }]} center={`${value}%`} sub="compliance" />
}

export function BarChart({ data, color = 'var(--navy-700)', height = 180 }) {
  const max = Math.max(...data.map((d) => d.value)) || 1
  return (
    <div className="chart-bars" style={{ height }}>
      {data.map((d) => (
        <div key={d.label} className="col">
          <span className="val num">{d.value}</span>
          <span className="barv" style={{ height: `${(d.value / max) * 75}%`, background: d.color || color }} />
          <span className="lab">{d.label}</span>
        </div>
      ))}
    </div>
  )
}

export function HBarChart({ data, color }) {
  const max = Math.max(...data.map((d) => d.value)) || 1
  return (
    <div className="hbars">
      {data.map((d) => (
        <div key={d.label} className="hbar">
          <span>{d.label}</span>
          <span className="track"><span className="fill" style={{ display: 'block', width: `${(d.value / max) * 100}%`, background: color }} /></span>
          <span className="num strong" style={{ textAlign: 'right' }}>{d.value}</span>
        </div>
      ))}
    </div>
  )
}

export function ComplianceBar({ value }) {
  const color = value >= 90 ? 'var(--green)' : value >= 75 ? 'var(--blue)' : value >= 60 ? '#c48a12' : 'var(--red)'
  return (
    <div className="progress-inline">
      <span className="bar"><span style={{ width: `${value}%`, background: color }} /></span>
      <span className="num strong" style={{ width: 38, textAlign: 'right' }}>{value}%</span>
    </div>
  )
}
