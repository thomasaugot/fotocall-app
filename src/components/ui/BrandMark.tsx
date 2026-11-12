// The ring: the Host and a camera lens at once. Same mark the PageLoader draws.
export const BrandMark = ({ className = "" }: { className?: string }) => {
  return (
    <svg aria-hidden="true" viewBox="0 0 100 100" className={`shrink-0 text-primary ${className}`}>
      <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth={6} />
      <circle cx="50" cy="50" r="18" fill="currentColor" fillOpacity={0.22} />
    </svg>
  )
}
