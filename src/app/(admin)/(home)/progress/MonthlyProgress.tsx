"use client"

import { useCategoryContext } from "@/contexts/categories-context"
import { useTransactionContext } from "@/contexts/transaction-context"
import { neutralColor } from "@/global/colors"
import { getTransactionsByType } from "@/global/dataFunctions"
import {
  numberToString,
  timestampToDateString,
} from "@/global/formattingFunctions"
import {
  getBudgetInfo,
  getCurrentDateInfo,
  getWeekBounds,
} from "@/global/infoFunctions"
import { Divider, Stack, Typography } from "@mui/material"
import { useMemo, useState } from "react"
import MonthTotalBudget from "./_components/MonthTotalBudget"

const MonthlyProgress = () => {
  const { transactions } = useTransactionContext()
  const { budgetCategories } = useCategoryContext()
  const { currentMonthString, currentDay, currentYear } = getCurrentDateInfo()

  const [shownCategory, setShownCategory] = useState<string>()

  const TODAY = {
    month: currentMonthString,
    day: currentDay,
    year: currentYear,
  }

  // Filter for this month's expenses
  const thisMonthsExpenses = useMemo(
    () =>
      getTransactionsByType({
        transactions: transactions,
        type: "expense",
        month: currentMonthString,
        year: currentYear,
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
  }, [thisMonthsExpenses, budgetCategories, currentMonthString, currentYear])

  const {
    remainingDays,
    remainingBudget,
    earnedBudget,
    budgetLeftToEarn,
    budgetPerDay,
  } = getBudgetInfo({
    monthlyBudget: budgetTotal,
    spentSoFar: actualTotal,
    date: { month: currentMonthString, day: currentDay, year: currentYear },
  })

  const handleExpandCategory = (category: string) => {
    setShownCategory((prev) => (prev === category ? undefined : category))
  }

  //============================================================================

  const { start, end } = getWeekBounds(TODAY, 0)

  return (
    <Stack sx={{ width: "100%", height: "100%" }} spacing={1}>
      <MonthTotalBudget
        transactions={thisMonthsExpenses}
        budgetCategories={budgetCategories}
        currentMonth={currentMonthString}
      />

      <Typography>{timestampToDateString(start)}</Typography>
      <Typography>{timestampToDateString(end)}</Typography>

      {/* <Stack spacing={0.5}>
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
      </Stack> */}

      <Stack
        spacing={1}
        divider={<Divider sx={{ borderColor: neutralColor.color }} />}
      >
        <Typography>{`Remaining Days: ${remainingDays}`}</Typography>
        <Typography>{`Budget Per Day: $${numberToString(budgetPerDay)}`}</Typography>
        <Typography>
          {`Remaining Budget: $${numberToString(remainingBudget)}`}
        </Typography>
        <Typography>
          {`Earned Budget: $${numberToString(earnedBudget)}`}
        </Typography>
        <Typography>
          {`Remaining Budget To Earn: $${numberToString(budgetLeftToEarn)}`}
        </Typography>
      </Stack>
    </Stack>
  )
}

export default MonthlyProgress
