export default function StatCard({ icon: Icon, label, value, note }) {
  return (
    <div className="card stat">
      <div className="stat-label">{Icon && <Icon aria-hidden="true" />}{label}</div>
      <div className="stat-value num">{value}</div>
      {note && <div className="stat-note">{note}</div>}
    </div>
  )
}
