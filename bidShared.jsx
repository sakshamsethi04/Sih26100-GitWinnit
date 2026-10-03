import { Link, NavLink, useParams } from 'react-router-dom'
import { FileSearch } from 'lucide-react'
import { PageHeader } from '../../components/Breadcrumbs'
import EmptyState from '../../components/EmptyState'
import StatusBadge from '../../components/StatusBadge'
import { useDemo } from '../../context/DemoContext'

/** Loads tender + bid from the URL and renders the shared header and tabs for bid pages. */
export function useBidPage() {
  const { id, bidId } = useParams()
  const demo = useDemo()
  const tender = demo.getTender(id)
  const bid = demo.getBid(bidId)
  const requirements = demo.getRequirements(id)
  return { id, bidId, tender, bid, requirements, ...demo }
}

export function BidNotFound({ id }) {
  return (
    <EmptyState
      icon={FileSearch}
      title="Bid not found"
      text="This bid isn’t part of the demo data."
      action={<Link className="btn btn-secondary" to={`/officer/tenders/${id || '1048'}/bids`}>Back to bid evaluation</Link>}
    />
  )
}

export function BidHeader({ tender, bid, page, actions }) {
  const base = `/officer/tenders/${tender.id}/bids/${bid.id}`
  const tabs = [
    { to: base, label: 'Overview', end: true },
    { to: `${base}/verification`, label: 'Verification' },
    { to: `${base}/compliance`, label: 'Compliance & Evidence' },
    { to: `${base}/review`, label: 'Officer Review' },
  ]
  return (
    <>
      <PageHeader
        crumbs={[
          { label: 'Tenders', to: '/officer/tenders' },
          { label: tender.ref, to: `/officer/tenders/${tender.id}` },
          { label: 'Bid evaluation', to: `/officer/tenders/${tender.id}/bids` },
          { label: bid.id, to: base },
          ...(page ? [{ label: page }] : []),
        ]}
        title={bid.bidder}
        sub={<><span className="mono">{bid.id}</span> · Submitted {bid.submitted} · GSTIN <span className="mono">{bid.gstin}</span></>}
        actions={<>{actions}<StatusBadge status={bid.status} /></>}
      />
      <div className="tabs" role="navigation" aria-label="Bid sections">
        {tabs.map((t) => (
          <NavLink key={t.to} to={t.to} end={t.end} className={({ isActive }) => `tab${isActive ? ' active' : ''}`} style={{ textDecoration: 'none' }}>{t.label}</NavLink>
        ))}
      </div>
    </>
  )
}
