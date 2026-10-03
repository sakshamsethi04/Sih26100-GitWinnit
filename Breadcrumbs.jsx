import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Breadcrumbs({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="breadcrumbs">
      {items.map((item, i) => (
        <span key={item.label} className="row" style={{ gap: 6 }}>
          {i > 0 && <ChevronRight aria-hidden="true" />}
          {item.to && i < items.length - 1 ? <Link to={item.to}>{item.label}</Link> : <span aria-current={i === items.length - 1 ? 'page' : undefined}>{item.label}</span>}
        </span>
      ))}
    </nav>
  )
}

export function PageHeader({ crumbs, title, sub, actions }) {
  return (
    <>
      {crumbs && <Breadcrumbs items={crumbs} />}
      <div className="page-header">
        <div>
          <h1>{title}</h1>
          {sub && <div className="sub">{sub}</div>}
        </div>
        {actions && <div className="page-actions">{actions}</div>}
      </div>
    </>
  )
}
