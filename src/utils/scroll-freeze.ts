import { WHEEL_DELIBERATE_PX } from "@/constants/scroll"

// A momentum glide only decays; a delta that grows, or a mouse notch, is the visitor scrolling.
export const isDeliberateWheel = (delta: number, previous: number): boolean => {
  const size = Math.abs(delta)
  return size >= WHEEL_DELIBERATE_PX || size > Math.abs(previous)
}
