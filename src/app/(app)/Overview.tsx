"use client"

import { useCategoryContext } from "@/contexts/categories-context"
import { useTransactionContext } from "@/contexts/transactions-context"
import { getCurrentDateInfo } from "@/utils/helperFunctions"
import { useTheme } from "next-themes"
import { useEffect, useMemo, useState } from "react"
import YearTotals from "./YearTotals"
import RemainingBudget from "./RemainingBudget"
import TopThreeExpenses from "./TopThreeCategories"
import SetUpDialog from "./SetUpDialog"
import { Stack } from "@mui/material"
import MonthlySummary from "./experimental/MonthlySummary"
import WeeklyBudget from "./experimental/WeeklyBudget"
import TopMonthlyExpenses from "./experimental/TopMonthlyExpenses"

const Overview = () => {
  const {
    incomeTransactionsV2,
    expenseTransactionsV2,
    budgetTransactionsV2,
    transactions,
  } = useTransactionContext()
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

  return (
    <Stack spacing={1}>
      <MonthlySummary
        transactions={transactions}
        currentMonth={currentMonth}
        currentYear={currentYear}
        currentTheme={currentTheme}
        isLoading={isLoading}
      />
      {/* <YearTotals
        currentYear={currentYear}
        currentMonth={currentMonth}
        currentTheme={currentTheme}
        excludedSet={excludedSet}
        incomeTransactionsV2={incomeTransactionsV2}
        expenseTransactionsV2={expenseTransactionsV2}
        isLoading={isLoading}
      /> */}

      <WeeklyBudget
        transactions={transactions}
        budgetCategoriesV2={budgetCategoriesV2}
        currentMonth={currentMonth}
        currentDay={currentDay}
        currentYear={currentYear}
        currentTheme={currentTheme}
        isLoading={isLoading}
      />
      {/* <RemainingBudget
        budgetCategoriesV2={budgetCategoriesV2}
        budgetTransactionsV2={budgetTransactionsV2}
        currentTheme={currentTheme}
        currentMonth={currentMonth}
        currentDay={currentDay}
        currentYear={currentYear}
        isLoading={isLoading}
      /> */}

      <TopMonthlyExpenses
        transactions={transactions}
        currentMonth={currentMonth}
        currentYear={currentYear}
        currentTheme={currentTheme}
        isLoading={isLoading}
      />
      {/* <TopThreeExpenses
        expenseTransactionsV2={expenseTransactionsV2}
        excludedSet={excludedSet}
        isLoading={isLoading}
      /> */}

      <SetUpDialog
        setUpDialogOpen={setUpDialogOpen}
        setSetUpDialogOpen={setSetUpDialogOpen}
        currentYear={currentYear}
        loadCategories={loadCategories}
      />
    </Stack>
  )
}

export default Overview
