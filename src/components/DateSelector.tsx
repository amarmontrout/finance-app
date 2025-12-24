import { MONTHS } from "@/globals/globals"
import { mockYears } from "@/globals/mockData"
import { Box, FormControl, InputLabel, Select, MenuItem } from "@mui/material"

type Props = {
  view: "annual" | "month"
  setView: (v: "annual" | "month") => void
  selectedYear: string
  setSelectedYear: (y: string) => void
  selectedMonth: string
  setSelectedMonth: (m: string) => void
  years: string[]
  isMockData: boolean
}

const DateSelector = ({
  view,
  setView,
  selectedYear,
  setSelectedYear,
  selectedMonth,
  setSelectedMonth,
  years,
  isMockData
}: Props) => {
  return (
    <Box
      className="flex flex-col sm:flex-row gap-3 h-full"
      width={"fit-content"}
      paddingTop={"10px"}
    >
      <FormControl>
        <InputLabel>View</InputLabel>
        <Select
          label="View"
          value={view}
          name={"view"}
          onChange={e => setView(e.target.value)}
          sx={{
            width: "175px"
          }}
        >
          <MenuItem key={"annual"} value={"annual"}>By Year</MenuItem>
          <MenuItem key={"month"} value={"month"}>By Month</MenuItem>
        </Select>
      </FormControl>
      
      <FormControl>
        <InputLabel>Year</InputLabel>
        <Select
          label="Year"
          value={selectedYear}
          name={"year"}
          onChange={e => setSelectedYear(e.target.value)}
          sx={{
            width: "175px"
          }}
        >
          { isMockData ?
            mockYears.map((year) => {
              return <MenuItem key={year} value={year}>{year}</MenuItem>
            })
            : years.map((year) => {
              return <MenuItem key={year} value={year}>{year}</MenuItem>
            })
          }
        </Select>
      </FormControl>

      {view === "month" &&
        <FormControl>
          <InputLabel>Month</InputLabel>
          <Select
            label="Month"
            value={selectedMonth}
            name={"month"}
            onChange={e => setSelectedMonth(e.target.value)}
            sx={{
              width: "175px"
            }}
          >
            {
            MONTHS.map((month) => {
                return <MenuItem key={month} value={month}>{month}</MenuItem>
              })
            }
          </Select>
        </FormControl>
      }
    </Box>    
  )
}

export default DateSelector