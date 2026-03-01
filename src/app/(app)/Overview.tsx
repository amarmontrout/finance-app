"use client"

import LineChart from "@/components/LineChart"
import { FlexColWrapper } from "@/components/Wrappers"
import { useCategoryContext } from "@/contexts/categories-context"
import { useTransactionContext } from "@/contexts/transactions-context"
import { darkMode, lightMode } from "@/globals/colors"
import { buildMultiColumnDataV2 } from "@/utils/buildChartData"
import { getCurrentDateInfo } from "@/utils/helperFunctions"
import { useTheme } from "next-themes"
import { useEffect, useMemo, useState } from "react"
import YearTotals from "./YearTotals"
import RemainingBudget from "./RemainingBudget"
import TopThreeExpenses from "./TopThreeCategories"
import SetUpDialog from "./SetUpDialog"

const Overview = () => {
  const { incomeTransactionsV2, expenseTransactionsV2, budgetTransactionsV2 } =
    useTransactionContext()
  const {
    excludedSet,
    budgetCategoriesV2,
    incomeCategoriesV2,
    expenseCategoriesV2,
    yearsV2,
    loadCategories,
    isLoading,
  } = useCategoryContext()
  const { currentYear, currentDay, currentMonth } = getCurrentDateInfo()
  const { theme: currentTheme } = useTheme()

  const [setUpDialogOpen, setSetUpDialogOpen] = useState<boolean>(false)

  useEffect(() => {
    if (isLoading) return

    if (
      yearsV2.length === 0 &&
      incomeCategoriesV2.length === 0 &&
      expenseCategoriesV2.length === 0
    ) {
      setSetUpDialogOpen(true)
    }
  }, [isLoading, yearsV2, incomeCategoriesV2, expenseCategoriesV2])

  // const lineColor =
  //   currentTheme === "light"
  //     ? [lightMode.success, lightMode.error]
  //     : [darkMode.success, darkMode.error]
  // const chartDataV2 = useMemo(() => {
  //   return buildMultiColumnDataV2({
  //     firstData: incomeTransactionsV2,
  //     secondData: expenseTransactionsV2,
  //     selectedYear: currentYear,
  //     firstColumnTitle: "Month",
  //     method: "compare",
  //     excludedSet: excludedSet,
  //   })
  // }, [incomeTransactionsV2, expenseTransactionsV2])

  return (
    <FlexColWrapper gap={2}>
      <YearTotals
        currentYear={currentYear}
        currentMonth={currentMonth}
        currentTheme={currentTheme}
        excludedSet={excludedSet}
        incomeTransactionsV2={incomeTransactionsV2}
        expenseTransactionsV2={expenseTransactionsV2}
        isLoading={isLoading}
      />

      <RemainingBudget
        budgetCategoriesV2={budgetCategoriesV2}
        budgetTransactionsV2={budgetTransactionsV2}
        currentTheme={currentTheme}
        currentMonth={currentMonth}
        currentDay={currentDay}
        currentYear={currentYear}
        isLoading={isLoading}
      />

      <TopThreeExpenses
        expenseTransactionsV2={expenseTransactionsV2}
        excludedSet={excludedSet}
        isLoading={isLoading}
      />

      {/* <LineChart multiColumnData={chartDataV2} lineColors={lineColor} /> */}

      <SetUpDialog
        setUpDialogOpen={setUpDialogOpen}
        setSetUpDialogOpen={setSetUpDialogOpen}
        currentYear={currentYear}
        loadCategories={loadCategories}
      />
    </FlexColWrapper>
  )
}

export default Overview
