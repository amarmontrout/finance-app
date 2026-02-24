import { MONTHS } from "@/globals/globals"
import { ChoiceTypeV2, HookSetter } from "@/utils/type"
import { Box, FormControl, InputLabel, Select, MenuItem } from "@mui/material"

const DateSelector = ({
  view,
  setView,
  selectedYear,
  setSelectedYear,
  selectedMonth,
  setSelectedMonth,
  years,
}: {
  view: "annual" | "month"
  setView: (v: "annual" | "month") => void
  selectedYear: number
  setSelectedYear: HookSetter<number>
  selectedMonth: string
  setSelectedMonth: HookSetter<string>
  years: ChoiceTypeV2[]
}) => {
  return (
    <Box className="flex flex-col sm:flex-row gap-3 h-full" paddingTop={"10px"}>
      <FormControl>
        <InputLabel>View</InputLabel>
        <Select
          className="w-full sm:w-[175px]"
          label="View"
          value={view}
          name={"view"}
          onChange={(e) => setView(e.target.value)}
        >
          <MenuItem key={"annual"} value={"annual"}>
            By Year
          </MenuItem>
          <MenuItem key={"month"} value={"month"}>
            By Month
          </MenuItem>
        </Select>
      </FormControl>

      <FormControl>
        <InputLabel>Year</InputLabel>
        <Select
          className="w-full sm:w-[175px]"
          label="Year"
          value={selectedYear}
          name={"year"}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          {years.map((year) => {
            return (
              <MenuItem key={year.name} value={year.name}>
                {year.name}
              </MenuItem>
            )
          })}
        </Select>
      </FormControl>

      {view === "month" && (
        <FormControl>
          <InputLabel>Month</InputLabel>
          <Select
            className="w-full sm:w-[175px]"
            label="Month"
            value={selectedMonth}
            name={"month"}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {MONTHS.map((month) => {
              return (
                <MenuItem key={month} value={month}>
                  {month}
                </MenuItem>
              )
            })}
          </Select>
        </FormControl>
      )}
    </Box>
  )
}

export default DateSelector
