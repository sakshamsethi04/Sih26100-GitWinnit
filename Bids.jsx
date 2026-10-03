import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../../components/Breadcrumbs'
import DataTable from '../../components/DataTable'
import { bidderBids } from '../../data/mock'
import { bidColumns } from './Dashboard'

export default function BidderBids() {
  const navigate = useNavigate()
  return (
    <>
      <PageHeader crumbs={[{ label: 'Dashboard', to: '/bidder/dashboard' }, { label: 'My bids' }]} title="My Bids" sub="Click a bid to see its verification status." />
      <div className="card"><DataTable columns={bidColumns} rows={bidderBids} rowKey="bidId" onRowClick={(b) => navigate(`/bidder/tenders/${b.tenderId}/status`)} /></div>
    </>
  )
}
