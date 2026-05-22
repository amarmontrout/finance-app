"use client"

import { useCategoryContext } from "@/contexts/categories-context"
import { useTransactionContext } from "@/contexts/transaction-context"
import { getTransactionsByType } from "@/global/dataFunctions"
import { getBudgetInfo, getCurrentDateInfo } from "@/global/infoFunctions"
import { Stack } from "@mui/material"
import { useMemo, useState } from "react"
import { BudgetPaceProgressBar } from "../_components/BudgetPaceProgressBar"

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
    budget: budgetTotal,
    spent: actualTotal,
    date: { month: currentMonthString, day: currentDay, year: currentYear },
  })

  const handleExpandCategory = (category: string) => {
    setShownCategory((prev) => (prev === category ? undefined : category))
  }

  return (
    <Stack sx={{ width: "100%", height: "100%" }} spacing={1}>
      <BudgetPaceProgressBar
        label={`${currentMonthString} Budget`}
        total={budgetTotal}
        spent={actualTotal}
        expected={earnedBudget}
      />

      {/* <MonthTotalBudget
        transactions={thisMonthsExpenses}
        budgetCategories={budgetCategories}
        currentMonth={currentMonthString}
      /> */}
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

      {/* <Stack
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
      </Stack> */}
    </Stack>
  )
}

export default MonthlyProgress
