const TONE_COLORS = { ok: 'var(--green)', warn: 'var(--amber)', fail: 'var(--red)', info: 'var(--blue)' }

export default function ActivityTimeline({ items }) {
  return (
    <ul className="activity">
      {items.map((a, i) => (
        <li key={`${a.date}-${a.time}-${i}`}>
          <span className="dot" style={{ color: TONE_COLORS[a.tone] || TONE_COLORS.info }} />
          <div>
            <div>{a.text}</div>
            <div className="when">{a.actor} · {a.date}, {a.time}</div>
          </div>
        </li>
      ))}
    </ul>
  )
}
