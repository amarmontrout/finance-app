"use client"

import LineChart from "@/components/LineChart"
import MockDataWarning from "@/components/MockDataWarning"
import { FlexColWrapper } from "@/components/Wrappers"
import { useCategoryContext } from "@/contexts/categories-context"
import { useTransactionContext } from "@/contexts/transactions-context"
import { darkMode, lightMode } from "@/globals/colors"
import { buildMultiColumnData } from "@/utils/buildChartData"
import { getCurrentDateInfo } from "@/utils/helperFunctions"
import { useTheme } from "next-themes"
import { useMemo } from "react"
import YearTotals from "./YearTotals"
import YearNetCash from "./YearNetCash"

const Overview = () => {
  const { 
    incomeTransactions, 
    expenseTransactions, 
    incomeTransactionsV2, 
    expenseTransactionsV2 
  } = useTransactionContext()
  const { excludedSet } = useCategoryContext()
  const { currentYear} = getCurrentDateInfo()
  const { theme: currentTheme } = useTheme()

  const lineColor = currentTheme === "light" 
    ? [lightMode.success, lightMode.error] 
    : [darkMode.success, darkMode.error]
  const chartData = useMemo(() => {
    return buildMultiColumnData({
      firstData: incomeTransactions,
      secondData: expenseTransactions,
      selectedYear: currentYear,
      firstColumnTitle: "Month",
      method: "compare"
    })
  }, [incomeTransactions, expenseTransactions])
    
  return (
    <FlexColWrapper gap={2}>
      <MockDataWarning/>
      <FlexColWrapper gap={2} toRowBreak={"2xl"}>
        <YearTotals
          currentYear={currentYear}
          currentTheme={currentTheme}
          incomeTransactions={incomeTransactions}
          expenseTransactions={expenseTransactions}
          excludedSet={excludedSet}
          incomeTransactionsV2={incomeTransactionsV2}
          expenseTransactionsV2={expenseTransactionsV2}
        />
        <YearNetCash
          currentYear={currentYear}
          currentTheme={currentTheme}
          incomeTransactions={incomeTransactions}
          expenseTransactions={expenseTransactions}
          excludedSet={excludedSet}
        />
      </FlexColWrapper>
      <LineChart
        multiColumnData={chartData}
        lineColors={lineColor}
      />        
    </FlexColWrapper>
  )
}

export default Overview