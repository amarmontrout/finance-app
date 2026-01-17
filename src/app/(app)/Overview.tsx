"use client"

import LineChart from "@/components/LineChart"
import { FlexColWrapper } from "@/components/Wrappers"
import { useCategoryContext } from "@/contexts/categories-context"
import { useTransactionContext } from "@/contexts/transactions-context"
import { darkMode, lightMode } from "@/globals/colors"
import { buildMultiColumnDataV2 } from "@/utils/buildChartData"
import { getCurrentDateInfo } from "@/utils/helperFunctions"
import { useTheme } from "next-themes"
import { useMemo } from "react"
import YearTotals from "./YearTotals"
import YearNetCash from "./YearNetCash"

const Overview = () => {
  const { 
    incomeTransactionsV2, 
    expenseTransactionsV2 
  } = useTransactionContext()
  const { excludedSet } = useCategoryContext()
  const { currentYear} = getCurrentDateInfo()
  const { theme: currentTheme } = useTheme()
  const lineColor = currentTheme === "light" 
    ? [lightMode.success, lightMode.error] 
    : [darkMode.success, darkMode.error]
  const chartDataV2 = useMemo(() => {
    return buildMultiColumnDataV2({
      firstData: incomeTransactionsV2,
      secondData: expenseTransactionsV2,
      selectedYear: Number(currentYear),
      firstColumnTitle: "Month",
      method: "compare",
      excludedSet: excludedSet
    })
  }, [incomeTransactionsV2, expenseTransactionsV2])
    
  return (
    <FlexColWrapper gap={2}>
      <FlexColWrapper gap={2} toRowBreak={"2xl"}>
        <YearTotals
          currentYear={Number(currentYear)}
          currentTheme={currentTheme}
          excludedSet={excludedSet}
          incomeTransactionsV2={incomeTransactionsV2}
          expenseTransactionsV2={expenseTransactionsV2}
        />

        <YearNetCash
          currentYear={Number(currentYear)}
          currentTheme={currentTheme}
          excludedSet={excludedSet}
          incomeTransactionsV2={incomeTransactionsV2}
          expenseTransactionsV2={expenseTransactionsV2}
        />
      </FlexColWrapper>

      <LineChart
        multiColumnData={chartDataV2}
        lineColors={lineColor}
      /> 
    </FlexColWrapper>
  )
}

export default Overview