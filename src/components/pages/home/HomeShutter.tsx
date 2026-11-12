import { Button } from "@/components/ui/Button"

interface Props {
  label: string
  disabled: boolean
  onShoot: () => void
}

// The shutter is the Host: a white disc in a gold ring that gives under the thumb.
export const HomeShutter = ({ label, disabled, onShoot }: Props) => (
  <Button variant="bare" size="xl" aria-label={label} disabled={disabled} onClick={onShoot} className="group">
    <svg aria-hidden="true" viewBox="0 0 80 80" className="h-20 w-20">
      <circle cx="40" cy="40" r="37" className="fill-ink/30 stroke-gold-light" strokeWidth={4} />
      <circle
        cx="40" cy="40" r="29"
        className="origin-center fill-surface transition-transform duration-150 group-active:scale-90"
      />
    </svg>
  </Button>
)
