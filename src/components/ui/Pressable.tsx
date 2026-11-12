import type { ButtonHTMLAttributes } from "react"

// A pressable surface that draws itself (a photo in the album): a real <button> with the
// keyboard focus ring and `type="button"`, and no look of its own. For labelled actions use Button.
export const Pressable = ({ type = "button", className, ...rest }: ButtonHTMLAttributes<HTMLButtonElement>) => {
  return <button {...rest} type={type} className={`keyboard-focus-ring ${className ?? ""}`} />
}
