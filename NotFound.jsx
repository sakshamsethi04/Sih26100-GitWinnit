import { Link } from 'react-router-dom'
import { FileSearch } from 'lucide-react'
import EmptyState from '../../components/EmptyState'

export default function NotFound() {
  return (
    <main className="container" style={{ padding: '64px 24px' }}>
      <EmptyState icon={FileSearch} title="Page not found" text="The link may be out of date." action={<Link to="/" className="btn btn-primary">Go to home</Link>} />
    </main>
  )
}
