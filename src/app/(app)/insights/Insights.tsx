"use client"

import { useTransactionContext } from "@/contexts/transactions-context"
import { useMemo, useState } from "react"
import { getCurrentDateInfo } from "@/utils/helperFunctions"
import { useCategoryContext } from "@/contexts/categories-context"
import { Stack, ToggleButton, ToggleButtonGroup } from "@mui/material"
import { accentColorPrimary, lightMode } from "@/globals/colors"
import BarChart from "@/components/BarChart"
import {
  buildMultiColumnData,
  buildTwoColumnData,
  TwoColumnDataType,
} from "@/utils/buildChartData"
import MonthYearSelector from "@/components/MonthYearSelector"
import { SelectedDateType } from "@/utils/type"
import { MONTHS } from "@/globals/globals"
import { getMonthTotal } from "@/utils/getTotals"
import { getNetCashFlow } from "@/utils/financialFunctions"
import ShowCaseCard from "@/components/ShowCaseCard"
import LoadingCircle from "@/components/LoadingCircle"

const Insights = () => {
  const { incomeTransactions, expenseTransactions, isLoading } =
    useTransactionContext()
  const { excludedSet } = useCategoryContext()
  const { currentYear, currentMonth } = getCurrentDateInfo()

  const CURRENT_DATE = {
    month: currentMonth,
    year: currentYear,
  }

  const [selectedDate, setSelectedDate] =
    useState<SelectedDateType>(CURRENT_DATE)
  const [type, setType] = useState<"incomeExpense" | "net">("incomeExpense")

  const IncomeExpenseData = useMemo(() => {
    return buildMultiColumnData({
      firstData: incomeTransactions,
      secondData: expenseTransactions,
      selectedYear: selectedDate.year,
      firstColumnTitle: "Month",
      method: "compare",
      excludedSet: excludedSet,
    })
  }, [incomeTransactions, expenseTransactions, excludedSet, selectedDate.year])

  const eachMonthNetIncome: [string, number][] = useMemo(() => {
    return MONTHS.map((month) => {
      const incomeTotal = getMonthTotal(
        selectedDate.year,
        month,
        incomeTransactions,
        excludedSet,
      )
      const expenseTotal = getMonthTotal(
        selectedDate.year,
        month,
        expenseTransactions,
        excludedSet,
      )
      const net = getNetCashFlow(incomeTotal, expenseTotal)
      return [month, net]
    })
  }, [selectedDate.year, incomeTransactions, expenseTransactions, excludedSet])

  const NetChartData: TwoColumnDataType = useMemo(() => {
    return buildTwoColumnData({
      data: eachMonthNetIncome,
      firstColumnTitle: "Month",
      secondColumnTitle: "Net Cash Flow",
    })
  }, [eachMonthNetIncome])

  const resetSelectedDate = () => {
    setSelectedDate(CURRENT_DATE)
  }

  const handleSelectType = (
    event: React.MouseEvent<HTMLElement>,
    newType: "incomeExpense" | "net" | null,
  ) => {
    if (newType !== null) {
      setType(newType)
    }
  }

  return (
    <Stack gap={1.5}>
      <MonthYearSelector
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        resetSelectedDate={resetSelectedDate}
        showMonth={false}
      />

      <ShowCaseCard title="">
        <Stack spacing={3}>
          <ToggleButtonGroup
            value={type}
            exclusive
            size={"small"}
            onChange={handleSelectType}
            sx={{
              width: "100%",
              justifyContent: "center",
              gap: 3,
              "& .MuiToggleButton-root": {
                borderRadius: "15px",
                border: "1px solid",
                px: 3,
                textTransform: "none",
              },
              "& .MuiToggleButtonGroup-grouped": {
                margin: 0,
                border: "1px solid",
                "&:not(:first-of-type)": {
                  borderLeft: "1px solid",
                },
              },
            }}
          >
            <ToggleButton value="incomeExpense">Income / Expense</ToggleButton>

            <ToggleButton value="net">Net Cash Flow</ToggleButton>
          </ToggleButtonGroup>

          {isLoading ? (
            <LoadingCircle />
          ) : (
            <BarChart
              multiColumnData={
                type === "incomeExpense" ? IncomeExpenseData : undefined
              }
              twoColumnData={type === "net" ? NetChartData : undefined}
              barColors={
                type === "incomeExpense"
                  ? [lightMode.success, lightMode.error]
                  : [accentColorPrimary]
              }
            />
          )}
        </Stack>
      </ShowCaseCard>

      {/* <NetCashFlow
        incomeTransactions={incomeTransactions}
        expenseTransactions={expenseTransactions}
        selectedYear={selectedDate.year}
        selectedMonth={selectedDate.month}
        view={view}
        currentTheme={currentTheme}
        excludedSet={excludedSet}
      />
      <SavingsRate
        incomeTransactions={incomeTransactions}
        expenseTransactions={expenseTransactions}
        selectedYear={selectedDate.year}
        selectedMonth={selectedDate.month}
        view={view}
        currentTheme={currentTheme}
      /> */}
    </Stack>
  )
}

export default Insights
