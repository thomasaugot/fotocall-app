import {
  FiAlertCircle, FiAlertTriangle, FiArrowRight, FiCamera, FiCheck, FiDownload, FiGrid, FiImage, FiInfo,
  FiRefreshCw, FiRepeat, FiUpload, FiWifiOff, FiX,
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
export const IconDownload = (p: IconProps) => <FiDownload     aria-hidden="true" {...p} />
export const IconRefresh  = (p: IconProps) => <FiRefreshCw    aria-hidden="true" {...p} />
export const IconWifiOff  = (p: IconProps) => <FiWifiOff      aria-hidden="true" {...p} />
export const IconSwitchCamera = (p: IconProps) => <FiRepeat   aria-hidden="true" {...p} />
export const IconUpload       = (p: IconProps) => <FiUpload   aria-hidden="true" {...p} />

import { FiChevronLeft, FiChevronRight, FiTrash2 } from "react-icons/fi"

export const IconPrev  = (p: IconProps) => <FiChevronLeft  aria-hidden="true" {...p} />
export const IconNext  = (p: IconProps) => <FiChevronRight aria-hidden="true" {...p} />
export const IconTrash = (p: IconProps) => <FiTrash2       aria-hidden="true" {...p} />

// Admin area (appended: the import above is left untouched).
import { FiEye, FiEyeOff, FiLogOut, FiMinus, FiPrinter } from "react-icons/fi"

export const IconEye     = (p: IconProps) => <FiEye      aria-hidden="true" {...p} />
export const IconEyeOff  = (p: IconProps) => <FiEyeOff   aria-hidden="true" {...p} />
export const IconLogOut  = (p: IconProps) => <FiLogOut   aria-hidden="true" {...p} />
export const IconPrint   = (p: IconProps) => <FiPrinter  aria-hidden="true" {...p} />
export const IconMinus   = (p: IconProps) => <FiMinus    aria-hidden="true" {...p} />

import { FiPlusSquare, FiShare } from "react-icons/fi"

export const IconShare     = (p: IconProps) => <FiShare      aria-hidden="true" {...p} />
export const IconAddHome   = (p: IconProps) => <FiPlusSquare aria-hidden="true" {...p} />

import { FiEdit2 } from "react-icons/fi"

export const IconEdit = (p: IconProps) => <FiEdit2 aria-hidden="true" {...p} />
