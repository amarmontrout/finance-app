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
import { getYearTotal } from "@/utils/getTotals"
import { cleanNumber, getCurrentDateInfo, getSavingsHealthState } from "@/utils/helperFunctions"
import { Box } from "@mui/material"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

const Overview = () => {
  const { currentYear} = getCurrentDateInfo()

  const { 
    incomeTransactions, 
    expenseTransactions, 
    refreshIncomeTransactions, 
    refreshExpenseTransactions,
    isMockData
  } = useTransactionContext()
  const { theme: currentTheme } = useTheme()
  
  const [lineChartData, setLineChartData] = useState<MultiColumnDataType>([])

  const annualIncome = getYearTotal(currentYear, incomeTransactions)
  const annualExpense = getYearTotal(currentYear, expenseTransactions)
  const annualNetIncome = getNetCashFlow(annualIncome, annualExpense)
  
  const savingsHealthState = getSavingsHealthState(cleanNumber(annualNetIncome), cleanNumber(annualIncome))
  const savingsColor = (currentTheme === "light" 
    ? healthStateLightMode 
    : healthStateDarkMode)[savingsHealthState]
  const defaultCardColor = (currentTheme === "light" 
    ? healthStateLightMode 
    : healthStateDarkMode)["default"]

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
      className="flex flex-col gap-2 h-full"
    >
      <MockDataWarning/>

      <Box
        className="flex flex-col 2xl:flex-row gap-2 h-full"
      >
        <ShowCaseCard title={`YTD Totals for ${currentYear}`}>
          <Box
            className="flex flex-col md:flex-row gap-2"
          >
            <ColoredInfoCard
              cardColors={defaultCardColor}
              info={`$${getYearTotal(currentYear, incomeTransactions)}`}
              title={"Total Income"}
            />

            <ColoredInfoCard
              cardColors={defaultCardColor}
              info={`$${getYearTotal(currentYear, expenseTransactions)}`}
              title={"Total Expenses"}
            />            
          </Box>
        </ShowCaseCard>

        <ShowCaseCard title={`YTD Net Cash Flow for ${currentYear}`}>
            <ColoredInfoCard
              cardColors={savingsColor}
              info={`$${annualNetIncome}`}
              title={`${currentYear} State: ${savingsHealthState}`}
            />
        </ShowCaseCard>
      </Box>

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
    </Box>
  )
}

export default Overview