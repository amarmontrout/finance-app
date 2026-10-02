import { TextField } from "@mui/material"

const DateInput = ({
  value,
  onChange,
  autoFocus,
  onBlur,
}: {
  value: string
  onChange: (value: string) => void
  autoFocus?: boolean
  onBlur: () => void
}) => {
  return (
    <TextField
      fullWidth
      type={"date"}
      variant={"standard"}
      size={"small"}
      value={value}
      autoFocus={autoFocus}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      slotProps={{
        inputLabel: {
          shrink: true,
        },
      }}
    />
  )
}

export default DateInput
