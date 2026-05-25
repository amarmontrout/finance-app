"use client"

import { useTransactionContext } from "@/contexts/transaction-context"
import {
  getExpenseTransactionsByPaymentMethod,
  getTransactionsByType,
  getTransactionsTotal,
} from "@/global/dataFunctions"
import {
  getCurrentDateInfo,
  getPreviousMonthInfo,
} from "@/global/infoFunctions"
import { Stack } from "@mui/material"
import { useMemo } from "react"
import { SummaryCard } from "./_components/SummaryCard"

const MonthlySummary = () => {
  const { today } = getCurrentDateInfo()
  const { previousMonthString, previousYear } = getPreviousMonthInfo({
    month: today.month,
    year: today.year,
  })
  const { transactions } = useTransactionContext()

  const summary = useMemo(() => {
    const currentIncome = getTransactionsByType({
      transactions,
      type: "income",
      month: today.month,
      year: today.year,
    })
    const previousIncome = getTransactionsByType({
      transactions,
      type: "income",
      month: previousMonthString,
      year: previousYear,
    })
    const currentDebitExpenses = getExpenseTransactionsByPaymentMethod({
      transactions,
      paymentMethod: "Debit",
      month: today.month,
      year: today.year,
    })
    const previousDebitExpenses = getExpenseTransactionsByPaymentMethod({
      transactions,
      paymentMethod: "Debit",
      month: previousMonthString,
      year: previousYear,
    })
    const currentAllExpenses = getTransactionsByType({
      transactions,
      type: "expense",
      month: today.month,
      year: today.year,
    })
    const previousAllExpenses = getTransactionsByType({
      transactions,
      type: "expense",
      month: previousMonthString,
      year: previousYear,
    })
    const incomeTotal = getTransactionsTotal({
      transactions: currentIncome,
    })
    const previousIncomeTotal = getTransactionsTotal({
      transactions: previousIncome,
    })
    const debitExpenseTotal = getTransactionsTotal({
      transactions: currentDebitExpenses,
    })
    const previousDebitExpenseTotal = getTransactionsTotal({
      transactions: previousDebitExpenses,
    })
    const allExpensesTotal = getTransactionsTotal({
      transactions: currentAllExpenses,
    })
    const previousAllExpensesTotal = getTransactionsTotal({
      transactions: previousAllExpenses,
    })
    return {
      incomeTotal,
      previousIncomeTotal,
      debitExpenseTotal,
      previousDebitExpenseTotal,
      allExpensesTotal,
      previousAllExpensesTotal,
      netIncome: incomeTotal - debitExpenseTotal,
      previousNetIncome: previousIncomeTotal - previousDebitExpenseTotal,
    }
  }, [transactions, today, previousMonthString, previousYear])

  return (
    <Stack sx={{ width: "100%", height: "100%" }} spacing={2}>
      <Stack direction={"column"} spacing={1}>
        <SummaryCard
          title={"Income"}
          amount={summary.incomeTotal}
          comparison={summary.previousIncomeTotal}
          type={"income"}
        />

        <SummaryCard
          title={"Expense"}
          amount={summary.debitExpenseTotal}
          comparison={summary.previousDebitExpenseTotal}
          type={"expense"}
        />

        <SummaryCard
          title={"Net Income"}
          amount={summary.netIncome}
          comparison={summary.previousNetIncome}
          type={"net"}
        />

        <SummaryCard
          title={"Total Spending"}
          amount={summary.allExpensesTotal}
          comparison={summary.previousAllExpensesTotal}
          type={"total"}
        />
      </Stack>
    </Stack>
  )
}

export default MonthlySummary
