"use client"

import { useTransactionContext } from "@/contexts/transactions-context"
import { useEffect, useMemo, useState } from "react"
import NetCashFlow from "./NetCashFlow"
import SavingsRate from "./SavingsRate"
import { getCurrentDateInfo } from "@/utils/helperFunctions"
import DateSelector from "@/components/DateSelector"
import { FlexColWrapper } from "@/components/Wrappers"
import { useCategoryContext } from "@/contexts/categories-context"
import {
  Box,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Tab,
  Tabs,
} from "@mui/material"
import { darkMode, lightMode } from "@/globals/colors"
import { useTheme } from "next-themes"
import BarChart from "@/components/BarChart"
import { buildMultiColumnDataV2 } from "@/utils/buildChartData"
import MonthYearSelector from "@/components/MonthYearSelector"
import { SelectedDateType } from "@/utils/type"

const TabPanel = ({
  children,
  value,
  index,
  ...other
}: {
  children?: React.ReactNode
  index: number
  value: number
}) => {
  return (
    <div hidden={value !== index} {...other}>
      {value === index && <Box>{children}</Box>}
    </div>
  )
}

const Insights = () => {
  const { incomeTransactionsV2, expenseTransactionsV2 } =
    useTransactionContext()
  const { excludedSet, yearsV2 } = useCategoryContext()
  const { currentYear, currentMonth } = getCurrentDateInfo()
  const { theme: currentTheme } = useTheme()

  const CURRENT_DATE = {
    month: currentMonth,
    year: currentYear,
  }

  const [selectedDate, setSelectedDate] =
    useState<SelectedDateType>(CURRENT_DATE)
  const [view, setView] = useState<"annual" | "month">("month")
  const [value, setValue] = useState(0)

  const barColors = useMemo(() => {
    return currentTheme === "light"
      ? [lightMode.success, lightMode.error]
      : [darkMode.success, darkMode.error]
  }, [currentTheme])

  const chartDataV2 = useMemo(() => {
    return buildMultiColumnDataV2({
      firstData: incomeTransactionsV2,
      secondData: expenseTransactionsV2,
      selectedYear: selectedDate.year,
      firstColumnTitle: "Month",
      method: "compare",
      excludedSet: excludedSet,
    })
  }, [incomeTransactionsV2, expenseTransactionsV2, selectedDate])

  const resetSelectedDate = () => {
    setSelectedDate(CURRENT_DATE)
  }

  useEffect(() => {
    resetSelectedDate()
  }, [])

  return (
    <Stack gap={1.5}>
      {/* <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={(_event: React.SyntheticEvent, newValue: number) => {
            setValue(newValue)
          }}
        >
          <Tab label="Net Cash Flow" />
          <Tab label="Savings Rate" />
        </Tabs>
      </Box> */}

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

      <MonthYearSelector
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        resetSelectedDate={resetSelectedDate}
        showMonth={view === "month"}
      />

      <BarChart multiColumnData={chartDataV2} barColors={barColors} />

      {/* <TabPanel value={value} index={0}>
        <NetCashFlow
          incomeTransactions={incomeTransactionsV2}
          expenseTransactions={expenseTransactionsV2}
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          view={view}
          currentTheme={currentTheme}
          excludedSet={excludedSet}
        />
      </TabPanel> */}

      {/* <TabPanel value={value} index={1}>
        <SavingsRate
          incomeTransactions={incomeTransactionsV2}
          expenseTransactions={expenseTransactionsV2}
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          view={view}
          currentTheme={currentTheme}
        />
      </TabPanel> */}
    </Stack>
  )
}

export default Insights
