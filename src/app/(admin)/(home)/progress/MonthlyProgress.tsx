"use client"

import { useCategoryContext } from "@/contexts/categories-context"
import { useTransactionContext } from "@/contexts/transaction-context"
import { negativeColor, positiveColor } from "@/global/colors"
import { getTransactionsByType } from "@/global/dataFunctions"
import { numberToString } from "@/global/formattingFunctions"
import { getBudgetInfo, getCurrentDateInfo } from "@/global/infoFunctions"
import { Stack } from "@mui/material"
import { useMemo, useState } from "react"
import InfoCard from "../_components/InfoCard"
import BudgetProgressBar from "../_components/ProgressBar"
import TransactionList from "../_components/TransactionList"

const MonthlyProgress = () => {
  const { transactions } = useTransactionContext()
  const { budgetCategories } = useCategoryContext()
  const { today } = getCurrentDateInfo()

  const [shownCategory, setShownCategory] = useState<string>()

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

  // Get total spent for each category
  const spentCategoryTotals = useMemo(() => {
    const totals = new Map<string, number>()
    thisMonthsExpenses.forEach((entry) => {
      const current = totals.get(entry.category) ?? 0
      const value = entry.is_return ? -entry.amount : entry.amount
      totals.set(entry.category, current + value)
    })
    return totals
  }, [thisMonthsExpenses])

  // Determine the remaining budget for each category
  const remainingCategoryBudget = useMemo(() => {
    return budgetCategories.map((category) => {
      const spent = spentCategoryTotals.get(category.category) ?? 0
      return {
        id: category.id,
        category: category.category,
        amount: category.amount - spent,
      }
    })
  }, [budgetCategories, spentCategoryTotals])

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

  const handleExpandCategory = (category: string) => {
    setShownCategory((prev) => (prev === category ? undefined : category))
  }

  return (
    <Stack sx={{ width: "100%", height: "100%" }} spacing={1}>
      <BudgetProgressBar
        label={`${today.month} Budget`}
        budget={budgetTotal}
        actual={actualTotal}
        expected={earnedBudget}
      />

      <Stack spacing={0.5}>
        {remainingCategoryBudget.map((entry) => {
          const cardColor = entry.amount < 0 ? negativeColor : positiveColor
          return (
            <InfoCard
              key={entry.category}
              cardColors={cardColor}
              title={entry.category}
              amount={`$${numberToString(entry.amount)}`}
              onClick={() => handleExpandCategory(entry.category)}
              moreInfo={
                shownCategory === entry.category && (
                  <TransactionList
                    expenses={thisMonthsExpenses}
                    category={entry.category}
                  />
                )
              }
            />
          )
        })}
      </Stack>
    </Stack>
  )
}

export default MonthlyProgress
