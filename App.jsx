import { Navigate, Route, Routes } from 'react-router-dom'
import PublicLayout from './layouts/PublicLayout'
import AppLayout from './layouts/AppLayout'
import Landing from './pages/public/Landing'
import PortalIntro from './pages/public/PortalIntro'
import NotFound from './pages/public/NotFound'

import OfficerLogin from './pages/officer/Login'
import OfficerRegister from './pages/officer/Register'
import VerificationPending from './pages/officer/VerificationPending'
import OfficerDashboard from './pages/officer/Dashboard'
import Tenders from './pages/officer/Tenders'
import CreateTender from './pages/officer/CreateTender'
import TenderDetail from './pages/officer/TenderDetail'
import Requirements from './pages/officer/Requirements'
import Bids from './pages/officer/Bids'
import BidDetail from './pages/officer/BidDetail'
import Verification from './pages/officer/Verification'
import Compliance from './pages/officer/Compliance'
import Review from './pages/officer/Review'
import Reviews from './pages/officer/Reviews'
import Audit from './pages/officer/Audit'
import Reports from './pages/officer/Reports'
import OfficerSettings from './pages/officer/Settings'

import BidderLogin from './pages/bidder/Login'
import BidderRegister from './pages/bidder/Register'
import BidderDashboard from './pages/bidder/Dashboard'
import BidderBids from './pages/bidder/Bids'
import BidderTenders from './pages/bidder/Tenders'
import BidderTenderDetail from './pages/bidder/TenderDetail'
import Documents from './pages/bidder/Documents'
import Submission from './pages/bidder/Submission'
import BidStatus from './pages/bidder/Status'
import BidderProfile from './pages/bidder/Profile'
import BidderSettings from './pages/bidder/Settings'

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/officer" element={<PortalIntro role="officer" />} />
        <Route path="/bidder" element={<PortalIntro role="bidder" />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route path="/officer/login" element={<OfficerLogin />} />
      <Route path="/officer/register" element={<OfficerRegister />} />
      <Route path="/officer/verification-pending" element={<VerificationPending />} />
      <Route path="/officer" element={<AppLayout role="officer" />}>
        <Route path="dashboard" element={<OfficerDashboard />} />
        <Route path="tenders" element={<Tenders />} />
        <Route path="tenders/create" element={<CreateTender />} />
        <Route path="tenders/:id" element={<TenderDetail />} />
        <Route path="tenders/:id/requirements" element={<Requirements />} />
        <Route path="tenders/:id/bids" element={<Bids />} />
        <Route path="tenders/:id/bids/:bidId" element={<BidDetail />} />
        <Route path="tenders/:id/bids/:bidId/verification" element={<Verification />} />
        <Route path="tenders/:id/bids/:bidId/compliance" element={<Compliance />} />
        <Route path="tenders/:id/bids/:bidId/review" element={<Review />} />
        <Route path="reviews" element={<Reviews />} />
        <Route path="audit" element={<Audit />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<OfficerSettings />} />
        <Route path="*" element={<Navigate to="/officer/dashboard" replace />} />
      </Route>

      <Route path="/bidder/login" element={<BidderLogin />} />
      <Route path="/bidder/register" element={<BidderRegister />} />
      <Route path="/bidder" element={<AppLayout role="bidder" />}>
        <Route path="dashboard" element={<BidderDashboard />} />
        <Route path="bids" element={<BidderBids />} />
        <Route path="tenders" element={<BidderTenders />} />
        <Route path="tenders/:id" element={<BidderTenderDetail />} />
        <Route path="tenders/:id/documents" element={<Documents />} />
        <Route path="tenders/:id/submission" element={<Submission />} />
        <Route path="tenders/:id/status" element={<BidStatus />} />
        <Route path="profile" element={<BidderProfile />} />
        <Route path="settings" element={<BidderSettings />} />
        <Route path="*" element={<Navigate to="/bidder/dashboard" replace />} />
      </Route>
    </Routes>
  )
}
