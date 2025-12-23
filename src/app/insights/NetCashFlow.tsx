"use client"

import ColoredInfoCard from "@/components/ColoredInfoCard"
import LineChart from "@/components/LineChart"
import { useTransactionContext } from "@/contexts/transactions-context"
import { accentColorSecondary, healthStateDarkMode, healthStateLightMode } from "@/globals/colors"
import { MONTHS } from "@/globals/globals"
import { buildTwoColumnData, TwoColumnDataType } from "@/utils/buildChartData"
import { getNetCashFlow } from "@/utils/financialFunctions"
import { getMonthTotal, getYearTotal } from "@/utils/getTotals"
import { cleanNumber, formattedStringNumber, removeCommas } from "@/utils/helperFunctions"
import { Box, Typography } from "@mui/material"
import { useTheme } from "next-themes"
import { useMemo } from "react"

const NetCashFlow = (props: {
  selectedYear: string
  selectedMonth: string
}) => {
  const {
    selectedYear,
    selectedMonth
  } = props

  const {
    incomeTransactions,
    expenseTransactions
  } = useTransactionContext()

  const { theme: currentTheme } = useTheme()

  const income = getMonthTotal(selectedYear, selectedMonth, incomeTransactions)
  const annualIncome = getYearTotal(selectedYear, incomeTransactions)
  const expense = getMonthTotal(selectedYear, selectedMonth, expenseTransactions)
  const netIncome = getNetCashFlow(income, expense)

  const annualNet: [string, string][] = useMemo(() => {
    return MONTHS.map(month => {
      const incomeTotal = getMonthTotal(selectedYear, month, incomeTransactions)
      const expenseTotal = getMonthTotal(selectedYear, month, expenseTransactions)
      const net = getNetCashFlow(incomeTotal, expenseTotal)
      return [month, removeCommas(net)]
    })
  }, [selectedYear, incomeTransactions, expenseTransactions])

  const annualNetIncome = useMemo(() => {
    return formattedStringNumber(
      annualNet.reduce((acc, [, amount]) => acc + Number(amount), 0)
    )
  }, [annualNet])

  const getHealthColor = (net: number, total: number) => {
    const percent = total === 0 ? -1 : net / total
    if (percent < 0) return "mayday"
    if (percent < 0.05) return "improvement"
    if (percent < 0.2) return "good"
    return "excellent"
  }

  const monthState = getHealthColor(cleanNumber(netIncome), cleanNumber(income))
  const annualState = getHealthColor(Number(annualNetIncome.replace(/,/g, '')), cleanNumber(annualIncome))

  const monthResult = currentTheme === "light"
    ? healthStateLightMode[monthState]
    : healthStateDarkMode[monthState]

  const annualResult = currentTheme === "light"
    ? healthStateLightMode[annualState]
    : healthStateDarkMode[annualState]

  const lineChartData: TwoColumnDataType = useMemo(() => {
    return buildTwoColumnData({
      data: annualNet,
      firstColumnTitle: "Month",
      secondColumnTitle: "Net Cash Flow"
    }) || []
  }, [annualNet])
  
  return (
    <Box
      className="flex flex-col gap-4 h-full"
    >  
      <LineChart
        twoColumnData={lineChartData}
        title={`Net Cash Flow ${selectedYear}`}
        lineColors={[accentColorSecondary]}
      />

      <Box
        className="flex flex-col sm:flex-row gap-3"
      >
        <ColoredInfoCard
          resultColors={monthResult}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          data={`$${netIncome}`}
        />

        <ColoredInfoCard
          resultColors={annualResult}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          data={`$${annualNetIncome}`}
        />      
      </Box>
    </Box>
  )
}

export default NetCashFlow