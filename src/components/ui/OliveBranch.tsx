// An olive branch, as engraved on a communion keepsake card: a curved stem and nine gold leaves.
const LEAVES = [
  [16, 82, -62], [30, 86, 18], [28, 66, -70], [44, 72, 12], [42, 50, -76],
  [58, 58, 6], [58, 36, -82], [72, 44, -4], [78, 22, -58],
] as const

export const OliveBranch = ({ className = "" }: { className?: string }) => (
  <svg aria-hidden="true" viewBox="0 0 100 100" className={`pointer-events-none shrink-0 text-gold ${className}`}>
    <path d="M6 96 C 30 78, 58 54, 84 12" fill="none" stroke="currentColor" strokeWidth={1} strokeLinecap="round" />
    {LEAVES.map(([x, y, angle]) => (
      <ellipse key={`${x}-${y}`} cx={x} cy={y} rx={8.5} ry={2.6} transform={`rotate(${angle} ${x} ${y})`} fill="currentColor" />
    ))}
  </svg>
)
