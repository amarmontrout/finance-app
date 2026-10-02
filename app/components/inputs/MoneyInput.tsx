import { FormControl, OutlinedInput } from "@mui/material"
import { ChangeEvent, RefObject } from "react"

const handleAmount = (
  e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  onChange: (value: number) => void,
) => {
  const MAX_AMOUNT = 9999.99
  const MAX_CENTS = MAX_AMOUNT * 100
  let digits = e.target.value.replace(/\D/g, "")
  const cents = Number(digits || 0)
  const decimal = cents / 100
  if (cents <= MAX_CENTS) {
    onChange(decimal)
  }
}

const MoneyInput = ({
  value,
  onChange,
  inputRef,
  autoFocus = false,
}: {
  value: number
  onChange: (value: number) => void
  inputRef?: RefObject<HTMLInputElement | null>
  autoFocus?: boolean
}) => {
  return (
    <FormControl fullWidth>
      <OutlinedInput
        inputRef={inputRef}
        autoFocus={autoFocus}
        type={"text"}
        inputMode={"decimal"}
        inputProps={{
          style: {
            textAlign: "center",
            fontSize: "2.5rem",
            padding: 0,
          },
        }}
        value={`$${value.toFixed(2)}`}
        onChange={(e) => handleAmount(e, onChange)}
        sx={{
          "& .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
          backgroundColor: "transparent",
        }}
      />
    </FormControl>
  )
}

export default MoneyInput
