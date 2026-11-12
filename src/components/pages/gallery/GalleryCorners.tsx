interface GalleryCornersProps {
  size?: "sm" | "lg"
  released?: boolean
}

const SIZE = { sm: "h-3.5 w-3.5", lg: "h-6 w-6" } as const

// Each mount hugs one corner of the print, and backs away from it along its diagonal when the
// print is pressed (`group-active`), pointed at, or let go before being taken out (`released`).
const CORNERS = [
  {
    place: "-left-0.5 -top-0.5 [clip-path:polygon(0_0,100%_0,0_100%)]",
    loose: "group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 group-active:-translate-x-1 group-active:-translate-y-1",
    released: "-translate-x-2 -translate-y-2",
  },
  {
    place: "-right-0.5 -top-0.5 [clip-path:polygon(0_0,100%_0,100%_100%)]",
    loose: "group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-active:translate-x-1 group-active:-translate-y-1",
    released: "translate-x-2 -translate-y-2",
  },
  {
    place: "-bottom-0.5 -right-0.5 [clip-path:polygon(100%_0,100%_100%,0_100%)]",
    loose: "group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-active:translate-x-1 group-active:translate-y-1",
    released: "translate-x-2 translate-y-2",
  },
  {
    place: "-bottom-0.5 -left-0.5 [clip-path:polygon(0_0,100%_100%,0_100%)]",
    loose: "group-hover:-translate-x-0.5 group-hover:translate-y-0.5 group-active:-translate-x-1 group-active:translate-y-1",
    released: "-translate-x-2 translate-y-2",
  },
] as const

// The four photo corners of a family album, in the brand colour. They hold every print on the
// page; the mount animations close them on it (`data-anim="mount"`).
export const GalleryCorners = ({ size = "sm", released = false }: GalleryCornersProps) => {
  return (
    <span data-anim="mount" className="invisible pointer-events-none absolute inset-0" aria-hidden="true">
      {CORNERS.map((corner) => (
        <span
          key={corner.place}
          className={`bg-mount absolute transition-transform duration-300 ease-out ${SIZE[size]} ${corner.place} ${released ? corner.released : corner.loose}`}
        />
      ))}
    </span>
  )
}
