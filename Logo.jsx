export function LogoMark({ size = 28, light = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <path d="M8 3h11l6 6v18a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" fill={light ? '#ffffff' : '#112443'} />
      <path d="M19 3v6h6" fill={light ? '#c9d6ea' : '#2a4570'} />
      <path d="M10.5 18.2l3.3 3.3 7-7.2" fill="none" stroke={light ? '#1d7148' : '#7fd3a5'} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function Logo({ light = false, size = 28 }) {
  return (
    <span className="row" style={{ gap: 10 }}>
      <LogoMark size={size} light={light} />
      <span className="wordmark" style={{ fontWeight: 700, letterSpacing: '0.06em', fontSize: size * 0.56, color: light ? '#fff' : 'var(--navy-900)' }}>
        BID SAHAYAK
      </span>
    </span>
  )
}

export function DemoChip({ title = 'Prototype with simulated data' }) {
  return <span className="demo-chip" title={title}>DEMO / POC</span>
}
