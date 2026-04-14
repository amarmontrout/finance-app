"use client"

import { useCategoryContext } from "@/contexts/categories-context"
import { useTransactionContext } from "@/contexts/transactions-context"
import { getCurrentDateInfo } from "@/utils/helperFunctions"
import { useTheme } from "next-themes"
import SetUpDialog from "./SetUpDialog"
import { Divider, Stack, Typography } from "@mui/material"
import MonthlySummary from "./MonthlySummary"
import WeeklyBudget from "./WeeklyBudget"
import TopMonthlyExpenses from "./TopMonthlyExpenses"
import CreditCardEstimate from "./CreditCardEstimate"
import { neutralColor } from "@/globals/colors"

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
    <Stack spacing={1.5}>
      <>
        <Typography variant={"h6"} fontWeight={700} textAlign={"center"}>
          {`${currentMonth} Overview`}
        </Typography>
        <Divider sx={{ borderColor: neutralColor.color }} />
      </>

      <MonthlySummary
        transactions={transactions}
        currentMonth={currentMonth}
        currentYear={currentYear}
        isLoading={isLoading}
      />

      {transactions.length !== 0 && (
        <>
          <Divider sx={{ borderColor: neutralColor.color }} />
          <WeeklyBudget
            transactions={transactions}
            budgetCategories={budgetCategories}
            currentMonth={currentMonth}
            currentDay={currentDay}
            currentYear={currentYear}
            currentTheme={currentTheme}
            isLoading={isLoading}
          />
        </>
      )}

      {transactions.length !== 0 && (
        <>
          <Divider sx={{ borderColor: neutralColor.color }} />
          <CreditCardEstimate
            transactions={transactions}
            currentMonth={currentMonth}
            currentDay={currentDay}
            currentYear={currentYear}
          />
        </>
      )}

      {transactions.length !== 0 && (
        <>
          <Divider sx={{ borderColor: neutralColor.color }} />
          <TopMonthlyExpenses
            transactions={transactions}
            currentMonth={currentMonth}
            currentYear={currentYear}
            currentTheme={currentTheme}
          />
        </>
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
