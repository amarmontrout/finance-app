"use client"

import { FormControl, OutlinedInput } from "@mui/material"
import { ChangeEvent, RefObject, useEffect, useState } from "react"

const MAX_AMOUNT = 9999.99
const MAX_CENTS = Math.round(MAX_AMOUNT * 100)

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
  const [inputValue, setInputValue] = useState(`$${value.toFixed(2)}`)

  useEffect(() => {
    setInputValue(`$${value.toFixed(2)}`)
  }, [value])

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const digits = e.target.value.replace(/\D/g, "")
    const cents = Number(digits || 0)
    if (cents > MAX_CENTS) return
    setInputValue(`$${(cents / 100).toFixed(2)}`)
    onChange(cents / 100)
  }

  return (
    <FormControl fullWidth>
      <OutlinedInput
        inputRef={inputRef}
        autoFocus={autoFocus}
        type="text"
        value={inputValue}
        onChange={handleChange}
        slotProps={{
          input: {
            inputMode: "numeric",
            "aria-label": "Amount",
            style: {
              textAlign: "center",
              fontSize: "2.5rem",
              fontVariantNumeric: "tabular-nums",
            },
          },
        }}
        sx={{
          backgroundColor: "transparent",
          "& .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
        }}
      />
    </FormControl>
  )
}

export default MoneyInput
