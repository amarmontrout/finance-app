"use client"

import { useCategoryContext } from "@/contexts/categories-context"
import { useTransactionContext } from "@/contexts/transactions-context"
import { getCurrentDateInfo } from "@/utils/helperFunctions"
import { useTheme } from "next-themes"
import SetUpDialog from "./SetUpDialog"
import { Stack } from "@mui/material"
import MonthlySummary from "./MonthlySummary"
import WeeklyBudget from "./WeeklyBudget"
import TopMonthlyExpenses from "./TopMonthlyExpenses"

const Overview = () => {
  const { transactions } = useTransactionContext()
  const {
    budgetCategories,
    incomeCategories,
    expenseCategories,
    years,
    loadCategories,
    isLoading,
  } = useCategoryContext()
  const { currentYear, currentDay, currentMonth } = getCurrentDateInfo()
  const { theme: currentTheme } = useTheme()

  const isSetUpDialogOpen =
    !isLoading &&
    years.length === 0 &&
    incomeCategories.length === 0 &&
    expenseCategories.length === 0

  return (
    <Stack spacing={1}>
      <MonthlySummary
        transactions={transactions}
        currentMonth={currentMonth}
        currentYear={currentYear}
        currentTheme={currentTheme}
        isLoading={isLoading}
      />

      <WeeklyBudget
        transactions={transactions}
        budgetCategories={budgetCategories}
        currentMonth={currentMonth}
        currentDay={currentDay}
        currentYear={currentYear}
        currentTheme={currentTheme}
        isLoading={isLoading}
      />

      <TopMonthlyExpenses
        transactions={transactions}
        currentMonth={currentMonth}
        currentYear={currentYear}
        currentTheme={currentTheme}
        isLoading={isLoading}
      />

      <SetUpDialog
        setUpDialogOpen={isSetUpDialogOpen}
        currentYear={currentYear}
        loadCategories={loadCategories}
      />
    </Stack>
  )
}

export default Overview
