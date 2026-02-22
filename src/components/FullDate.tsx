import { MONTHS } from "@/globals/globals"
import { BudgetTransactionTypeV2, DateType, HookSetter } from "@/utils/type"
import { 
  Stack, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  OutlinedInput, 
  SelectChangeEvent
} from "@mui/material"
import { ChangeEvent, useEffect, useState } from "react"

const FullDate = ({
  today,
  setBudgetEntry,
  disabled
}: {
  today: DateType
  setBudgetEntry: HookSetter<BudgetTransactionTypeV2>
  disabled?: boolean
}) => {
  const [date, setDate] = useState<DateType>(today)

  const handleMonth = (
    e: SelectChangeEvent
  ) => {
    const { value } = e.target
    setDate(prev => ({
      ...prev,
      month: value,
    }));
  }

  const handleDay = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    let digits = e.target.value.replace(/\D/g, "")
    if (digits.length <= 2) {
      setDate(prev => ({
        ...prev,
        day: Number(digits),
      }));
    }
  }

  const handleYear = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    let digits = e.target.value.replace(/\D/g, "")
    if (digits.length <= 4) {
      setDate(prev => ({
        ...prev,
        year: Number(digits),
      }));
    }
  }

  useEffect(() => {
    setBudgetEntry(prev => ({
      ...prev,
      date: date
    }))
  }, [date])

  return (
    <Stack direction={"row"} spacing={1}>
      <FormControl
        sx={{
          width: "45%"
        }}
      >
        <InputLabel>Month</InputLabel>
        <Select
          label="Month"
          value={date.month}
          name={"month"}
          onChange={e => handleMonth(e)}
          disabled={disabled}
        >
          {MONTHS.map((month) => {
            return (
              <MenuItem 
                value={month}
              >
                {month}
              </MenuItem>
            )
          })}
        </Select>
      </FormControl>

      <FormControl
        sx={{
          width: "25%"
        }}
      >
        <InputLabel>Day</InputLabel>
        <OutlinedInput
          label={"Day"}
          value={date.day}
          name={"day"}
          onChange={e => handleDay(e)}
          disabled={disabled}
        />
      </FormControl>

      <FormControl 
        sx={{
          width: "30%"
        }}
      >
        <InputLabel>Year</InputLabel>
        <OutlinedInput
          label={"Year"}
          value={date.year}
          name={"year"}
          onChange={e => handleYear(e)}
          disabled={disabled}
        />
      </FormControl>
    </Stack>
  )
}

export default FullDate