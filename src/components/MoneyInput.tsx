import { FormControl, OutlinedInput } from "@mui/material"
import { ChangeEvent, useEffect, useRef } from "react"

export const MoneyInputV2 = <T extends { amount: number }>({
  value,
  setValue,
  autoFocus,
}: {
  value: number
  setValue: React.Dispatch<React.SetStateAction<T>>
  autoFocus?: boolean
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleAmount = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const MAX_AMOUNT = 9999.99
    const MAX_CENTS = MAX_AMOUNT * 100
    let digits = e.target.value.replace(/\D/g, "")
    const cents = Number(digits || 0)
    const decimal = cents / 100
    if (cents <= MAX_CENTS) {
      setValue((prev) => ({
        ...prev,
        amount: decimal,
      }))
    }
  }

  useEffect(() => {
    if (autoFocus) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 0)
    }
  }, [autoFocus])

  return (
    <FormControl fullWidth>
      <OutlinedInput
        inputRef={inputRef}
        type="text"
        inputMode="decimal"
        inputProps={{
          inputMode: "decimal",
          pattern: "[0-9]*[.]?[0-9]*",
          style: {
            textAlign: "center",
            fontSize: "2.5rem",
            padding: 0,
          },
        }}
        value={`$${value.toFixed(2)}`}
        onChange={handleAmount}
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
