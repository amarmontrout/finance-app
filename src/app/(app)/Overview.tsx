"use client"

import { useCategoryContext } from "@/contexts/categories-context"
import { useTransactionContext } from "@/contexts/transactions-context"
import { getCurrentDateInfo } from "@/utils/helperFunctions"
import { Stack, Typography } from "@mui/material"
import { useTheme } from "next-themes"
import CreditCardEstimate from "./CreditCardEstimate"
import MonthlySummary from "./MonthlySummary"
import SetUpDialog from "./SetUpDialog"
import WeeklyBudget from "./WeeklyBudget"

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
    <Stack spacing={3}>
      <Typography variant={"h6"} fontWeight={700} textAlign={"center"}>
        {`${currentMonth} Overview`}
      </Typography>

      <MonthlySummary
        transactions={transactions}
        currentMonth={currentMonth}
        currentYear={currentYear}
      />

      {transactions.length !== 0 && (
        <WeeklyBudget
          transactions={transactions}
          budgetCategories={budgetCategories}
          currentMonth={currentMonth}
          currentDay={currentDay}
          currentYear={currentYear}
          currentTheme={currentTheme}
        />
      )}

      {transactions.length !== 0 && (
        <CreditCardEstimate
          transactions={transactions}
          currentMonth={currentMonth}
          currentDay={currentDay}
          currentYear={currentYear}
        />
      )}

      <SetUpDialog
        setUpDialogOpen={isSetUpDialogOpen}
        currentYear={currentYear}
        loadCategories={loadCategories}
      />
    </Stack>
  )
}

export default Overview
