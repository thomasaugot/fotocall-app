// The mark: a small camera, navy body, gold lens. It is a photocall.
// data-part hooks let the loader settle the body, then light the lens.
export const BrandMark = ({ className = "" }: { className?: string }) => (
  <svg aria-hidden="true" viewBox="0 0 100 100" className={`shrink-0 overflow-visible ${className}`}>
    <g data-part="cup">
      <rect x={34} y={18} width={32} height={18} rx={5} className="fill-primary" />
      <rect x={10} y={28} width={80} height={56} rx={12} className="fill-primary" />
      <circle cx={50} cy={56} r={18} className="fill-surface" />
    </g>
    <circle data-part="host" cx={50} cy={56} r={10} className="fill-gold" />
  </svg>
)
