"use client"

import LineChart from "@/components/LineChart"
import { FlexColWrapper } from "@/components/Wrappers"
import { useCategoryContext } from "@/contexts/categories-context"
import { useTransactionContext } from "@/contexts/transactions-context"
import { darkMode, lightMode } from "@/globals/colors"
import { buildMultiColumnDataV2 } from "@/utils/buildChartData"
import { getCurrentDateInfo, getWeekBounds } from "@/utils/helperFunctions"
import { useTheme } from "next-themes"
import { useMemo } from "react"
import YearTotals from "./YearTotals"
import RemainingBudget from "./budget/RemainingBudget"
import { BudgetTypeV2, DateType } from "@/utils/type"

const Overview = () => {
  const { incomeTransactionsV2, expenseTransactionsV2, budgetTransactionsV2 } =
    useTransactionContext()
  const { excludedSet, budgetCategoriesV2 } = useCategoryContext()
  const { currentYear, currentDay, currentMonth, passedMonths } =
    getCurrentDateInfo()
  const { theme: currentTheme } = useTheme()

  const { start, end, prevStart, prevEnd } = useMemo(() => {
    return getWeekBounds({
      month: currentMonth,
      day: currentDay,
      year: currentYear,
    })
  }, [])

  const lineColor =
    currentTheme === "light"
      ? [lightMode.success, lightMode.error]
      : [darkMode.success, darkMode.error]
  const chartDataV2 = useMemo(() => {
    return buildMultiColumnDataV2({
      firstData: incomeTransactionsV2,
      secondData: expenseTransactionsV2,
      selectedYear: currentYear,
      firstColumnTitle: "Month",
      method: "compare",
      excludedSet: excludedSet,
    })
  }, [incomeTransactionsV2, expenseTransactionsV2])

  const weeklyTransactions = useMemo(() => {
    const toDate = (date: DateType) => {
      const monthIndex = new Date(`${date.month} 1, ${date.year}`).getMonth()
      return new Date(date.year, monthIndex, date.day)
    }

    const weekStart = toDate(start)
    const weekEnd = toDate(end)

    return budgetTransactionsV2.filter((entry) => {
      if (!entry.date?.day) return false

      const entryDate = toDate(entry.date)

      return entryDate >= weekStart && entryDate <= weekEnd
    })
  }, [budgetTransactionsV2, start, end, prevStart, prevEnd])

  const remainingBudgetCategories = useMemo(() => {
    let remaining: BudgetTypeV2[] = []

    budgetCategoriesV2.map((category) => {
      let budget = category.amount
      let total = 0

      weeklyTransactions.map((entry) => {
        if (entry.category === category.category) {
          if (entry.isReturn) {
            total -= entry.amount
          } else {
            total += entry.amount
          }
        }
      })

      remaining.push({
        id: category.id,
        category: category.category,
        amount: budget - total,
      })
    })

    return remaining
  }, [budgetCategoriesV2, weeklyTransactions])

  return (
    <FlexColWrapper gap={2}>
      <YearTotals
        currentYear={currentYear}
        passedMonths={passedMonths}
        currentTheme={currentTheme}
        excludedSet={excludedSet}
        incomeTransactionsV2={incomeTransactionsV2}
        expenseTransactionsV2={expenseTransactionsV2}
      />
      <RemainingBudget
        budgetCategories={remainingBudgetCategories}
        currentTheme={currentTheme}
      />
      <LineChart multiColumnData={chartDataV2} lineColors={lineColor} />
    </FlexColWrapper>
  )
}

export default Overview
