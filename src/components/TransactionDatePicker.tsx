import { MONTHS } from "@/globals/globals"
import { DateType } from "@/utils/type"
import { Stack, Select, MenuItem } from "@mui/material"

const TransactionDatePicker = ({
  date,
  days,
  years,
  onChange,
}: {
  date: DateType
  days: number[]
  years: number[]
  onChange: (field: keyof DateType, value: string | number) => void
}) => {
  return (
    <Stack
      direction={"row"}
      spacing={1}
      justifyContent={"flex-end"}
      maxHeight={24}
    >
      <Select
        size={"small"}
        variant={"standard"}
        value={date.month}
        MenuProps={{
          style: {
            maxHeight: 7 * 39,
          },
        }}
        onChange={(e) => onChange("month", e.target.value)}
      >
        {MONTHS.map((m) => (
          <MenuItem key={m} value={m}>
            {m}
          </MenuItem>
        ))}
      </Select>

      <Select
        size={"small"}
        variant={"standard"}
        value={date.day ?? 1}
        MenuProps={{
          style: {
            maxHeight: 7 * 39,
          },
        }}
        onChange={(e) => onChange("day", Number(e.target.value))}
      >
        {days.map((d) => (
          <MenuItem key={d} value={d}>
            {d}
          </MenuItem>
        ))}
      </Select>

      <Select
        size={"small"}
        variant={"standard"}
        value={date.year}
        MenuProps={{
          style: {
            maxHeight: 7 * 39,
          },
        }}
        onChange={(e) => onChange("year", Number(e.target.value))}
      >
        {years.map((y) => (
          <MenuItem key={y} value={y}>
            {y}
          </MenuItem>
        ))}
      </Select>
    </Stack>
  )
}

export default TransactionDatePicker
