import {
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material"
import { ChangeEvent } from "react"

export const MoneyInputV2 = <T extends { amount: number }>({
  value,
  setValue,
  smallWidthBp,
  disabled,
}: {
  value: number
  setValue: React.Dispatch<React.SetStateAction<T>>
  smallWidthBp?: "sm" | "md" | "lg" | "xl" | "2xl"
  disabled?: boolean
}) => {
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

  return (
    <FormControl>
      <InputLabel>Amount</InputLabel>
      <OutlinedInput
        className={`w-full ${smallWidthBp ? `${smallWidthBp}:w-[175px]` : ""}`}
        type={"text"}
        inputMode={"decimal"}
        inputProps={{
          inputMode: "decimal",
          pattern: "[0-9]*[.]?[0-9]*",
        }}
        label="Amount"
        value={value.toFixed(2)}
        name="amount"
        disabled={disabled}
        onChange={handleAmount}
        startAdornment={<InputAdornment position="start">$</InputAdornment>}
      />
    </FormControl>
  )
}
