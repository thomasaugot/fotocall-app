// The gloria: the rays around the Host on a monstrance. Twenty-four gold rays, long and short.
const RAYS = Array.from({ length: 24 }, (_, i) => i)

export const Gloria = ({ className = "" }: { className?: string }) => (
  <svg aria-hidden="true" viewBox="0 0 200 200" className={`pointer-events-none shrink-0 text-gold ${className}`}>
    <g className="gloria-turn">
      {RAYS.map((i) => (
        <path
          key={i}
          d={i % 2 ? "M100 34 L99.5 70 L100.5 70 Z" : "M100 6 L99.3 70 L100.7 70 Z"}
          transform={`rotate(${i * 15} 100 100)`}
          fill="currentColor"
        />
      ))}
    </g>
  </svg>
)
