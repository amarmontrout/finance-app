"use client"

import ColoredInfoCard from "@/components/ColoredInfoCard"
import LineChart from "@/components/LineChart"
import MockDataWarning from "@/components/MockDataWarning"
import ShowCaseCard from "@/components/ShowCaseCard"
import { useTransactionContext } from "@/contexts/transactions-context"
import { darkMode, healthStateDarkMode, healthStateLightMode, lightMode } from "@/globals/colors"
import { mockExpenseData, mockIncomeData } from "@/globals/mockData"
import { buildMultiColumnData, MultiColumnDataType } from "@/utils/buildChartData"
import { getNetCashFlow } from "@/utils/financialFunctions"
import { getMonthTotal } from "@/utils/getTotals"
import { cleanNumber, getCurrentDateInfo } from "@/utils/helperFunctions"
import { Box } from "@mui/material"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

const Overview = () => {
  const { currentMonth, currentYear} = getCurrentDateInfo()

  const { 
    incomeTransactions, 
    expenseTransactions, 
    refreshIncomeTransactions, 
    refreshExpenseTransactions,
    isMockData
  } = useTransactionContext()
  
  const [lineChartData, setLineChartData] = useState<MultiColumnDataType>([])

  const { theme: currentTheme } = useTheme()

  const income = getMonthTotal(currentYear, currentMonth, incomeTransactions)
  const expense = getMonthTotal(currentYear, currentMonth, expenseTransactions)
  const netIncome = getNetCashFlow(income, expense)
  const getHealthColor = (net: number, total: number) => {
    const percent = total === 0 ? -1 : net / total
    if (percent < 0) return "mayday"
    if (percent < 0.05) return "improvement"
    if (percent < 0.2) return "good"
    return "excellent"
  }
  const monthState = getHealthColor(cleanNumber(netIncome), cleanNumber(income))
  const monthResult = currentTheme === "light"
    ? healthStateLightMode[monthState]
    : healthStateDarkMode[monthState]

  useEffect(() => {
    refreshIncomeTransactions()
    refreshExpenseTransactions()
  }, [])

  const buildCompareChartData = () => {
    const chartData = buildMultiColumnData({
      firstData: isMockData ? mockIncomeData : incomeTransactions,
      secondData: isMockData ? mockExpenseData : expenseTransactions,
      selectedYear: currentYear,
      firstColumnTitle: "Month",
      method: "compare"
    })
    if (!chartData) return
    setLineChartData(chartData)
  }
    
  useEffect(() => {
    buildCompareChartData()
  }, [incomeTransactions, expenseTransactions])

  return (
    <Box
      className="flex flex-col gap-2"
    >
      <MockDataWarning/>

      <ShowCaseCard title={`${currentYear} Overview`}>
        <LineChart
          multiColumnData={lineChartData}
          title={``}
          lineColors={
            currentTheme === "light" 
            ? [lightMode.success, lightMode.error] 
            : [darkMode.success, darkMode.error]
          }
        />        
      </ShowCaseCard>

      <ShowCaseCard title={`Net Cash Flow for ${currentMonth}`}>
          <ColoredInfoCard
            resultColors={monthResult}
            selectedMonth={currentMonth}
            selectedYear={currentYear}
            data={`$${netIncome}`}
          />
      </ShowCaseCard>
    </Box>
  )
}

export default Overview