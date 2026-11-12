import type { ButtonHTMLAttributes, ReactNode } from "react"

// "bare": no fill, no border: the child draws the whole control (the camera shutter).
// "inverse": white with ink text, for the ink camera stage and the live viewfinder.
type ButtonVariant = "filled" | "outlined" | "bare" | "inverse"
type ButtonSize = "sm" | "md" | "lg" | "xl"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  icon?: ReactNode
}

const VARIANT: Record<ButtonVariant, string> = {
  filled: "bg-primary text-on-primary hover:bg-primary-hover",
  outlined: "border border-border-strong bg-transparent text-text hover:bg-surface-2",
  bare: "bg-transparent text-primary",
  inverse: "bg-surface text-text shadow-md hover:bg-surface-2",
}

const SIZE: Record<ButtonSize, string> = {
  sm: "h-10 gap-2 px-4",
  md: "h-12 gap-2 px-6",
  lg: "h-14 gap-3 px-7",
  xl: "h-20 w-20 p-0",
}

const ICON_ONLY: Record<ButtonSize, string> = { sm: "h-10 w-10", md: "h-12 w-12", lg: "h-14 w-14", xl: "h-20 w-20" }

export const Button = ({
  variant = "filled", size = "md", loading = false, icon, type = "button",
  disabled, className, children, ...rest
}: ButtonProps) => {
  const iconOnly = !children
  return (
    <button
      {...rest}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={[
        "keyboard-focus-ring text-button inline-flex shrink-0 items-center justify-center rounded-full",
        "transition-[background-color,border-color,transform,opacity] duration-150 active:scale-[0.96]",
        "disabled:cursor-not-allowed disabled:opacity-60",
        loading ? "cursor-wait" : "",
        VARIANT[variant],
        iconOnly ? ICON_ONLY[size] : SIZE[size],
        className ?? "",
      ].join(" ")}
    >
      {icon && <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center">{icon}</span>}
      {children}
    </button>
  )
}
