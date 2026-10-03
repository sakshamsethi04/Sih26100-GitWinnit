import { Link, Outlet } from 'react-router-dom'
import Logo, { DemoChip } from '../components/Logo'

export default function PublicLayout() {
  return (
    <>
      <header className="public-header">
        <div className="inner">
          <Link to="/" aria-label="Bid Sahayak home" style={{ textDecoration: 'none' }}><Logo /></Link>
          <nav aria-label="Main">
            <a href="/#how">How It Works</a>
            <Link to="/officer">For Procurement Officers</Link>
            <Link to="/bidder">For Bidders</Link>
            <a href="/#about">About</a>
          </nav>
          <DemoChip />
        </div>
      </header>
      <Outlet />
      <footer className="public-footer">
        <div className="container row-between wrap">
          <span className="strong" style={{ color: 'var(--ink)' }}>AI-assisted verification. Human-decided outcomes.</span>
          <span>Smart India Hackathon 2026 · SIH26100 · Team GitWinnit, IIT Mandi · Prototype with simulated data</span>
        </div>
      </footer>
    </>
  )
}
