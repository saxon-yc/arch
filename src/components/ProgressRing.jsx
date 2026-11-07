export default function ProgressRing({ value = 0, size = 44, stroke = 3, label, dark = false }) {
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (Math.min(100, Math.max(0, value)) / 100) * circumference
  return (
    <span className={`progress-ring ${dark ? 'is-dark' : ''}`} style={{ width: size, height: size }} aria-label={label || `完成 ${value}%`}>
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--line)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <span className="progress-ring-label" style={{ fontSize: `${Math.max(8, Math.round(size * 0.17))}px` }}>{Math.round(value)}<small>%</small></span>
    </span>
  )
}
