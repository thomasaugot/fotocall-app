import type { ReactNode } from "react"

interface StageFrameProps {
  children: ReactNode
  // Under the window, on the white mat: the signature line.
  foot?: ReactNode
  className?: string
}

// A large photo print with a white mat: the camera, the name form and the shot all live in its
// 3:4 window; the wider lower margin carries the guest's signature.
export const StageFrame = ({ children, foot, className = "" }: StageFrameProps) => (
  <div className={`relative rounded-xl bg-surface p-3 shadow-lg ${className}`}>
    <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-cielo">{children}</div>
    {foot && <div className="px-3 pt-5 pb-3">{foot}</div>}
  </div>
)
