import {
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material"
import { ChangeEvent } from "react"

type HasAmount = {
  amount: string
}

const MoneyInput = <T extends HasAmount>({
  value,
  setValue,
  smallWidthBp,
  disabled,
}: {
  value: string
  setValue: React.Dispatch<React.SetStateAction<T>>
  smallWidthBp?: "sm" | "md" | "lg" | "xl" | "2xl" | undefined
  disabled?: boolean
}) => {
  const handleAmount = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    let digits = e.target.value.replace(/\D/g, "")
    const cents = digits.slice(-2)
    let dollars = digits.slice(0, -2)
    dollars = dollars.replace(/^0+/, "")
    const formatted = `${dollars}.${cents}`

    if (formatted.length <= 7) {
      setValue((prev) => ({
        ...prev,
        amount: dollars || cents ? formatted : "",
      }))
    }
  }
  return (
    <FormControl>
      <InputLabel>Amount</InputLabel>
      <OutlinedInput
        className={`w-full ${smallWidthBp ? `${smallWidthBp}:w-[175px]` : ""} `}
        label={"Amount"}
        value={value}
        name={"amount"}
        disabled={disabled}
        onChange={(e) => handleAmount(e)}
        startAdornment={<InputAdornment position="start">$</InputAdornment>}
      />
    </FormControl>
  )
}

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
    let digits = e.target.value.replace(/\D/g, "")
    const cents = digits.slice(-2)
    let dollars = digits.slice(0, -2)
    dollars = dollars.replace(/^0+/, "")
    const formatted = `${dollars || "0"}.${cents.padStart(2, "0")}`

    if (formatted.length <= 7) {
      setValue((prev) => ({
        ...prev,
        amount: Number(formatted),
      }))
    }
  }

  return (
    <FormControl>
      <InputLabel>Amount</InputLabel>
      <OutlinedInput
        className={`w-full ${smallWidthBp ? `${smallWidthBp}:w-[175px]` : ""}`}
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

export default MoneyInput
