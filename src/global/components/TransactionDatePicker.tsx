import { DateType } from "@/api/transactions/models"
import { MenuItem, Select, Stack } from "@mui/material"
import { MONTHS } from "../objects"

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
      sx={{
        justifyContent: "flex-end",
        maxHeight: 24,
      }}
    >
      <Select
        variant={"standard"}
        value={date.month}
        sx={{ minWidth: "125px" }}
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
        variant={"standard"}
        value={date.day ?? 1}
        sx={{ minWidth: "75px" }}
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
        variant={"standard"}
        value={date.year}
        sx={{ minWidth: "75px" }}
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
