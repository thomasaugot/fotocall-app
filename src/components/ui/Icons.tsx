import {
  FiAlertCircle, FiAlertTriangle, FiArrowRight, FiCamera, FiCheck, FiGrid, FiImage, FiInfo, FiX,
} from "react-icons/fi"
import type { IconBaseProps } from "react-icons"

type IconProps = IconBaseProps

export const IconCamera  = (p: IconProps) => <FiCamera        aria-hidden="true" {...p} />
export const IconImage   = (p: IconProps) => <FiImage         aria-hidden="true" {...p} />
export const IconGallery = (p: IconProps) => <FiGrid          aria-hidden="true" {...p} />
export const IconClose   = (p: IconProps) => <FiX             aria-hidden="true" {...p} />
export const IconArrow   = (p: IconProps) => <FiArrowRight    aria-hidden="true" {...p} />
export const IconCheck   = (p: IconProps) => <FiCheck         aria-hidden="true" {...p} />
export const IconAlert   = (p: IconProps) => <FiAlertCircle   aria-hidden="true" {...p} />
export const IconWarning = (p: IconProps) => <FiAlertTriangle aria-hidden="true" {...p} />
export const IconInfo    = (p: IconProps) => <FiInfo          aria-hidden="true" {...p} />
