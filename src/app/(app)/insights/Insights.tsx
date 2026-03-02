"use client"

import { useTransactionContext } from "@/contexts/transactions-context"
import { useEffect, useMemo, useState } from "react"
import { getCurrentDateInfo } from "@/utils/helperFunctions"
import { useCategoryContext } from "@/contexts/categories-context"
import { Stack, ToggleButton, ToggleButtonGroup } from "@mui/material"
import { accentColorPrimary, lightMode } from "@/globals/colors"
import BarChart from "@/components/BarChart"
import {
  buildMultiColumnDataV2,
  buildTwoColumnData,
  TwoColumnDataType,
} from "@/utils/buildChartData"
import MonthYearSelector from "@/components/MonthYearSelector"
import { SelectedDateType } from "@/utils/type"
import { MONTHS } from "@/globals/globals"
import { getMonthTotalV2 } from "@/utils/getTotals"
import { getNetCashFlow } from "@/utils/financialFunctions"
import ShowCaseCard from "@/components/ShowCaseCard"
import LoadingCircle from "@/components/LoadingCircle"

const Insights = () => {
  const { incomeTransactionsV2, expenseTransactionsV2, isLoading } =
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
    return buildMultiColumnDataV2({
      firstData: incomeTransactionsV2,
      secondData: expenseTransactionsV2,
      selectedYear: selectedDate.year,
      firstColumnTitle: "Month",
      method: "compare",
      excludedSet: excludedSet,
    })
  }, [incomeTransactionsV2, expenseTransactionsV2, selectedDate])

  const eachMonthNetIncome: [string, number][] = useMemo(() => {
    return MONTHS.map((month) => {
      const incomeTotal = getMonthTotalV2(
        selectedDate.year,
        month,
        incomeTransactionsV2,
        excludedSet,
      )
      const expenseTotal = getMonthTotalV2(
        selectedDate.year,
        month,
        expenseTransactionsV2,
        excludedSet,
      )
      const net = getNetCashFlow(incomeTotal, expenseTotal)
      return [month, net]
    })
  }, [selectedDate.year, incomeTransactionsV2, expenseTransactionsV2])

  const NetChartData: TwoColumnDataType = useMemo(() => {
    return (
      buildTwoColumnData({
        data: eachMonthNetIncome,
        firstColumnTitle: "Month",
        secondColumnTitle: "Net Cash Flow",
      }) || []
    )
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

  useEffect(() => {
    resetSelectedDate()
  }, [])

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
        incomeTransactions={incomeTransactionsV2}
        expenseTransactions={expenseTransactionsV2}
        selectedYear={selectedDate.year}
        selectedMonth={selectedDate.month}
        view={view}
        currentTheme={currentTheme}
        excludedSet={excludedSet}
      />
      <SavingsRate
        incomeTransactions={incomeTransactionsV2}
        expenseTransactions={expenseTransactionsV2}
        selectedYear={selectedDate.year}
        selectedMonth={selectedDate.month}
        view={view}
        currentTheme={currentTheme}
      /> */}
    </Stack>
  )
}

export default Insights
