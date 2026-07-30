"use client"

import { useCategoryContext } from "@/contexts/categories-context"
import { useTransactionContext } from "@/contexts/transaction-context"
import {
  getExpenseTransactionsByPaymentMethod,
  getTransactionsByType,
  getTransactionsTotal,
} from "@/global/dataFunctions"
import {
  currencyFormatter,
  dateTypeToTimestamp,
} from "@/global/formattingFunctions"
import {
  getBudgetInfo,
  getCurrentDateInfo,
  getPreviousMonthInfo,
} from "@/global/infoFunctions"
import { MONTH_INDEX } from "@/global/objects"
import { Box, Stack, Typography } from "@mui/material"
import { useMemo } from "react"
import BudgetProgressBar from "./_components/ProgressBar"

const MonthlySummary = () => {
  const { today } = getCurrentDateInfo()
  const { previousMonthString, previousYear } = getPreviousMonthInfo({
    month: today.month,
    year: today.year,
  })
  const { transactions } = useTransactionContext()
  const { budgetCategories } = useCategoryContext()

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

  // Filter for this month's expenses
  const thisMonthsExpenses = useMemo(
    () =>
      getTransactionsByType({
        transactions: transactions,
        type: "expense",
        month: today.month,
        year: today.year,
      }),
    [transactions],
  )

  const { actualTotal, budgetTotal } = useMemo(() => {
    let actual = 0
    const allowedCategories = new Set(budgetCategories.map((c) => c.category))
    const budget = budgetCategories.reduce((sum, c) => sum + c.amount, 0)
    for (const t of thisMonthsExpenses) {
      if (allowedCategories.has(t.category)) {
        actual += t.is_return ? -t.amount : t.amount
      }
    }
    return { actualTotal: actual, budgetTotal: budget }
  }, [thisMonthsExpenses, budgetCategories, today.month, today.year])

  const { earnedBudget } = getBudgetInfo({
    budget: budgetTotal,
    spent: actualTotal,
    date: today,
  })

  const { statementStart, statementEnd } = useMemo(() => {
    const statementStartDay = 6

    let startMonth = MONTH_INDEX[today.month]
    let startYear = today.year

    if (today.day < statementStartDay) {
      startMonth -= 1

      if (startMonth < 0) {
        startMonth = 11
        startYear -= 1
      }
    }

    const start = new Date(startYear, startMonth, statementStartDay)

    const end = new Date(startYear, startMonth + 1, statementStartDay - 1)

    return {
      statementStart: start,
      statementEnd: end,
    }
  }, [today.day, today.month, today.year])

  const creditTransactions = useMemo(
    () =>
      transactions
        .filter(
          (tx) =>
            tx.payment_method === "Credit" &&
            dateTypeToTimestamp(tx.date) >= statementStart.getTime() &&
            dateTypeToTimestamp(tx.date) <= statementEnd.getTime(),
        )
        .sort(
          (a, b) => dateTypeToTimestamp(b.date!) - dateTypeToTimestamp(a.date!),
        ),
    [transactions, statementStart, statementEnd],
  )

  const estimatedBill = useMemo(
    () => creditTransactions.reduce((total, tx) => total + tx.amount, 0),
    [creditTransactions],
  )

  const getDaysUntil = (targetDate: Date, currentDate: Date = new Date()) => {
    const millisecondsPerDay = 1000 * 60 * 60 * 24

    const target = new Date(
      targetDate.getFullYear(),
      targetDate.getMonth(),
      targetDate.getDate(),
    )

    const current = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
    )

    const days = Math.ceil(
      (target.getTime() - current.getTime()) / millisecondsPerDay,
    )

    return Math.max(days, 0)
  }

  const daysUntilStatementClose = getDaysUntil(statementEnd, new Date())

  return (
    <Stack width={"100%"} height={"100%"} spacing={2}>
      <Stack direction={"column"} spacing={1}>
        <Box
          bgcolor={"rgba(255,255,255,0.15)"}
          borderRadius={5}
          minHeight={"150px"}
          padding={2}
        >
          <Stack direction={"column"}>
            <Typography variant={"caption"}>Net Income</Typography>
            <Typography fontWeight={"bold"} variant={"h5"}>
              {currencyFormatter.format(summary.netIncome)}
            </Typography>
          </Stack>
        </Box>

        <Stack direction={"row"} justifyContent={"space-between"} spacing={1}>
          <Box
            bgcolor={"rgba(255,255,255,0.15)"}
            borderRadius={5}
            width={"100%"}
            padding={1.5}
          >
            <Stack direction={"column"}>
              <Typography variant={"caption"}>Income</Typography>
              <Typography fontWeight={"bold"} variant={"h6"}>
                {currencyFormatter.format(summary.incomeTotal)}
              </Typography>
            </Stack>
          </Box>

          <Box
            bgcolor={"rgba(255,255,255,0.15)"}
            borderRadius={5}
            width={"100%"}
            padding={1.5}
          >
            <Stack direction={"column"}>
              <Typography variant={"caption"}>Expense</Typography>
              <Typography fontWeight={"bold"} variant={"h6"}>
                {currencyFormatter.format(summary.debitExpenseTotal)}
              </Typography>
            </Stack>
          </Box>
        </Stack>
      </Stack>

      <BudgetProgressBar
        label={`${today.month} Budget`}
        budget={budgetTotal}
        actual={actualTotal}
        expected={earnedBudget !== 0 ? earnedBudget : undefined}
      />

      <Box bgcolor={"rgba(255,255,255,0.15)"} borderRadius={5} padding={2}>
        <Stack
          direction={"column"}
          height={"100%"}
          justifyContent={"space-between"}
        >
          <Stack
            direction={"row"}
            borderBottom={`1px solid ${"#102A1B"}`}
            justifyContent={"space-between"}
          >
            <Typography>Estimated Credit Card Bill</Typography>

            <Typography>
              {statementStart.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
              {" - "}
              {statementEnd.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </Typography>
          </Stack>

          <Stack direction={"column"}>
            <Typography fontWeight={"bold"} variant={"h5"}>
              {currencyFormatter.format(estimatedBill)}
            </Typography>
            <Typography variant="body2">
              Closes in {daysUntilStatementClose} days
            </Typography>
            <Typography variant={"body2"}>
              {creditTransactions.length} transactions
            </Typography>
          </Stack>
        </Stack>
      </Box>
    </Stack>
  )
}

export default MonthlySummary

{
  /* <Stack direction={"column"} spacing={1}>
        <Stack direction={"row"} spacing={1}>
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
        </Stack>

        <Stack direction={"row"} spacing={1}>
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

      <BudgetProgressBar
        label={`${today.month} Budget`}
        budget={budgetTotal}
        actual={actualTotal}
        expected={earnedBudget}
      />

      <Stack direction={"row"} sx={{ justifyContent: "space-between" }}>
        <Typography variant={"h6"} sx={{ fontWeight: 700 }}>
          Credit Card Estimate
        </Typography>
        <Typography variant="h6" sx={{ textAlign: "right" }}>
          ${numberToString(estimatedBill)}
        </Typography>
      </Stack> */
}
