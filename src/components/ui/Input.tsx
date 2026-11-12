import { useId, type InputHTMLAttributes, type Ref } from "react"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
  ref?: Ref<HTMLInputElement>
}

// Focus is the field's own edge (border turns primary and thickens, label follows), never a ring.
export const Input = ({ label, error, hint, id, className, ...rest }: InputProps) => {
  const autoId = useId()
  const inputId = id ?? autoId
  const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined

  return (
    <div className="flex flex-col gap-2">
      <div className="field-line flex flex-col gap-1 border-b-2 border-border-strong transition-[border-color,box-shadow] duration-150">
        <label htmlFor={inputId} className="text-body-sm transition-colors duration-150">{label}</label>
        <input
          {...rest}
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className={`keyboard-focus-ring text-body w-full bg-transparent pb-2 outline-none caret-primary ${className ?? ""}`}
        />
      </div>
      {error && (
        <p id={`${inputId}-error`} role="alert" className="text-body-sm">
          <span className="text-danger">{error}</span>
        </p>
      )}
      {!error && hint && <p id={`${inputId}-hint`} className="text-body-sm">{hint}</p>}
    </div>
  )
}
