import { Link } from 'react-router-dom'

export default function Logo({ compact = false }) {
  return (
    <Link to="/" className="brand" aria-label="架构图谱首页">
      <span className="brand-mark" aria-hidden="true">
        <svg viewBox="0 0 40 40" fill="none">
          <path d="M20 4.5 34 12.7 20 21 6 12.7 20 4.5Z" fill="currentColor" opacity=".18" />
          <path d="M6 20.2 20 28.4 34 20.2M6 27.2 20 35.4 34 27.2" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M20 4.5 34 12.7 20 21 6 12.7 20 4.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          <circle cx="20" cy="12.7" r="2.2" fill="var(--gold)" />
        </svg>
      </span>
      {!compact && (
        <span className="brand-text">
          <strong>架构图谱</strong>
          <small>ARCHITECTURE ATLAS</small>
        </span>
      )}
    </Link>
  )
}
