import type { ButtonHTMLAttributes, ReactNode } from "react"

type ButtonVariant = "filled" | "outlined"
type ButtonSize = "sm" | "md" | "lg"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  icon?: ReactNode
}

const VARIANT: Record<ButtonVariant, string> = {
  filled: "bg-primary text-on-primary hover:bg-primary-hover",
  outlined: "border border-border-strong bg-transparent text-text hover:bg-surface-2",
}

const SIZE: Record<ButtonSize, string> = {
  sm: "h-9 gap-2 px-4",
  md: "h-11 gap-2 px-5",
  lg: "h-13 gap-3 px-7",
}

const ICON_ONLY: Record<ButtonSize, string> = { sm: "h-9 w-9", md: "h-11 w-11", lg: "h-13 w-13" }

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
        "transition-[background-color,border-color,transform,opacity] duration-150 active:scale-[0.98]",
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
