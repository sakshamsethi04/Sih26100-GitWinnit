import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  BarChart3, Bell, Building2, ClipboardCheck, FileSearch, FileText, FolderOpen, Gavel,
  LayoutDashboard, ListChecks, LogOut, ScrollText, Search, Settings, User,
} from 'lucide-react'
import Logo, { DemoChip } from '../components/Logo'
import { useDemo } from '../context/DemoContext'
import { bidderAccount, bidderNotifications, officer } from '../data/mock'

const NAV = {
  officer: [
    { to: '/officer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/officer/tenders', label: 'Tenders', icon: FileText, end: false, match: /^\/officer\/tenders(?!\/\w+\/bids)/ },
    { to: '/officer/tenders/1048/bids', label: 'Bid Evaluation', icon: Gavel, match: /^\/officer\/tenders\/\w+\/bids/ },
    { to: '/officer/reviews', label: 'Compliance Reviews', icon: ClipboardCheck },
    { to: '/officer/audit', label: 'Audit Trail', icon: ScrollText },
    { to: '/officer/reports', label: 'Reports', icon: BarChart3 },
    { to: '/officer/settings', label: 'Settings', icon: Settings },
  ],
  bidder: [
    { to: '/bidder/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/bidder/tenders', label: 'Available Tenders', icon: FileText, match: /^\/bidder\/tenders(\/\w+)?$/ },
    { to: '/bidder/bids', label: 'My Bids', icon: ListChecks, match: /^\/bidder\/(bids|tenders\/\w+\/submission)/ },
    { to: '/bidder/tenders/1048/documents', label: 'Documents', icon: FolderOpen, match: /documents$/ },
    { to: '/bidder/tenders/1048/status', label: 'Verification Status', icon: FileSearch, match: /status$/ },
    { to: '/bidder/profile', label: 'Profile', icon: Building2 },
    { to: '/bidder/settings', label: 'Settings', icon: Settings },
  ],
}

function useOutside(ref, onOutside) {
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) onOutside() }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [ref, onOutside])
}

export default function AppLayout({ role }) {
  const { state, dispatch } = useDemo()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [openMenu, setOpenMenu] = useState(null)
  const [query, setQuery] = useState('')
  const menus = useRef(null)
  useOutside(menus, () => setOpenMenu(null))
  useEffect(() => { setOpenMenu(null); window.scrollTo(0, 0) }, [pathname])

  const isOfficer = role === 'officer'
  const person = isOfficer
    ? { name: officer.name, sub: 'Procurement Officer', initials: 'AV' }
    : { name: bidderAccount.representative, sub: bidderAccount.company, initials: 'NK' }
  const notes = isOfficer
    ? state.activity.slice(0, 4).map((a) => ({ time: `${a.date}, ${a.time}`, text: a.text }))
    : bidderNotifications

  const onSearch = (e) => {
    e.preventDefault()
    const q = query.trim().toUpperCase()
    if (!q) return
    if (isOfficer) {
      if (q.includes('BID-2026-0')) navigate(`/officer/tenders/1048/bids/${q.match(/BID-2026-0\d\d/)?.[0] || 'BID-2026-041'}`)
      else navigate(`/officer/tenders?q=${encodeURIComponent(query.trim())}`)
    } else navigate(`/bidder/tenders?q=${encodeURIComponent(query.trim())}`)
    setQuery('')
  }

  const signOut = () => {
    dispatch({ type: 'signOut', role })
    navigate(`/${role}/login`)
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <Link to={`/${role}/dashboard`} className="sidebar-brand" style={{ textDecoration: 'none' }}><Logo light size={26} /></Link>
        <div className="sidebar-role">{isOfficer ? 'Procurement Officer' : 'Bidder'}</div>
        <nav aria-label="Sections">
          {NAV[role].map(({ to, label, icon: Icon, match }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `nav-link${(match ? match.test(pathname) : isActive) ? ' active' : ''}`}
              title={label}
            >
              <Icon aria-hidden="true" /><span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-foot">
          {isOfficer ? officer.organization : `Bidder ID ${bidderAccount.bidderId}`}
          <div className="mt-8"><DemoChip /></div>
        </div>
      </aside>

      <div>
        <header className="topbar">
          <form className="search input-icon" role="search" onSubmit={onSearch}>
            <Search aria-hidden="true" />
            <input
              className="input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={isOfficer ? 'Search tenders, bids (e.g. BID-2026-041)…' : 'Search tenders…'}
              aria-label="Search"
            />
          </form>
          <div className="topbar-right" ref={menus}>
            <div style={{ position: 'relative' }}>
              <button type="button" className="icon-btn" aria-label="Notifications" aria-expanded={openMenu === 'n'} onClick={() => setOpenMenu(openMenu === 'n' ? null : 'n')}>
                <Bell /><span className="count">{notes.length}</span>
              </button>
              {openMenu === 'n' && (
                <div className="dropdown">
                  <div className="card-header"><h3>Notifications</h3></div>
                  {notes.map((n) => (
                    <div key={n.time + n.text} className="dropdown-item" style={{ cursor: 'default' }}>
                      <div>{n.text}</div>
                      <div className="small muted">{n.time}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div style={{ position: 'relative' }}>
              <button type="button" className="profile" aria-expanded={openMenu === 'p'} onClick={() => setOpenMenu(openMenu === 'p' ? null : 'p')}>
                <span className="avatar">{person.initials}</span>
                <span className="profile-text">
                  <span className="profile-name" style={{ display: 'block' }}>{person.name}</span>
                  <span className="profile-role">{person.sub}</span>
                </span>
              </button>
              {openMenu === 'p' && (
                <div className="dropdown" style={{ width: 220 }}>
                  <Link className="dropdown-item" to={isOfficer ? '/officer/settings' : '/bidder/profile'}>
                    <span className="row"><User size={15} />{isOfficer ? 'Profile & settings' : 'Company profile'}</span>
                  </Link>
                  <button type="button" className="dropdown-item" onClick={signOut}>
                    <span className="row"><LogOut size={15} />Sign out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="content" id="main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
