import { useEffect, useId, useRef, type ChangeEventHandler } from "react"
import { IconCheck, IconMinus } from "@/components/ui/Icons"

interface CheckboxProps {
  label: string
  checked: boolean
  onChange: ChangeEventHandler<HTMLInputElement>
  /** Dash instead of a tick: some, not all, of a group. */
  indeterminate?: boolean
  /** The label stays for screen readers only (a checkbox laid over a photo). */
  hideLabel?: boolean
  id?: string
  name?: string
  className?: string
}

// Custom look, native behaviour: a real, visually hidden <input type="checkbox"> with the box drawn
// next to it. Space, label click, form submit and screen-reader state come from the platform.
export const Checkbox = ({ label, checked, onChange, indeterminate = false, hideLabel = false, id, name, className }: CheckboxProps) => {
  const autoId = useId()
  const inputId = id ?? autoId
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate
  }, [indeterminate])

  return (
    <label htmlFor={inputId} className={`inline-flex min-h-11 cursor-pointer items-center gap-3 ${className ?? ""}`}>
      <input ref={ref} id={inputId} name={name} type="checkbox" checked={checked} onChange={onChange} className="peer sr-only" />
      <span
        aria-hidden="true"
        className={[
          "relative flex h-6 w-6 shrink-0 items-center justify-center rounded-sm border-2 border-border-strong bg-surface text-on-primary",
          "transition-[background-color,border-color] duration-150",
          "peer-checked:border-primary peer-checked:bg-primary peer-indeterminate:border-primary peer-indeterminate:bg-primary",
          "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-primary",
          "[&>svg]:absolute [&>svg]:opacity-0 peer-checked:[&>.tick]:opacity-100 peer-indeterminate:[&>.dash]:opacity-100",
        ].join(" ")}
      >
        <IconCheck className="tick h-4 w-4" />
        <IconMinus className="dash h-4 w-4" />
      </span>
      {hideLabel ? <span className="sr-only">{label}</span> : <span className="text-body">{label}</span>}
    </label>
  )
}
