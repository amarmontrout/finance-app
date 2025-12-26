"use client"

import ColoredInfoCard from "@/components/ColoredInfoCard"
import LineChart from "@/components/LineChart"
import MockDataWarning from "@/components/MockDataWarning"
import ShowCaseCard from "@/components/ShowCaseCard"
import { FlexColWrapper } from "@/components/Wrappers"
import { useTransactionContext } from "@/contexts/transactions-context"
import { darkMode, healthStateDarkMode, healthStateLightMode, lightMode } from "@/globals/colors"
import { buildMultiColumnData, MultiColumnDataType } from "@/utils/buildChartData"
import { getNetCashFlow } from "@/utils/financialFunctions"
import { getYearTotal } from "@/utils/getTotals"
import { cleanNumber, getCurrentDateInfo, getSavingsHealthState } from "@/utils/helperFunctions"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

const Overview = () => {
  const { 
    incomeTransactions, 
    expenseTransactions, 
    refreshIncomeTransactions, 
    refreshExpenseTransactions
  } = useTransactionContext()
  const { currentYear} = getCurrentDateInfo()
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
      firstData: incomeTransactions,
      secondData: expenseTransactions,
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
    <FlexColWrapper gap={2}>
      <MockDataWarning/>

      <FlexColWrapper gap={2} toRowBreak={"2xl"}>
        <ShowCaseCard title={`YTD Totals for ${currentYear}`}>
          <FlexColWrapper gap={2} toRowBreak={"md"}>
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
          </FlexColWrapper>
        </ShowCaseCard>

        <ShowCaseCard title={`YTD Net Cash Flow for ${currentYear}`}>
            <ColoredInfoCard
              cardColors={savingsColor}
              info={`$${annualNetIncome}`}
              title={`${currentYear} State: ${savingsHealthState}`}
            />
        </ShowCaseCard>
      </FlexColWrapper>

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
    </FlexColWrapper>
  )
}

export default Overview