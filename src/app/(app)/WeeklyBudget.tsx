import LoadingCircle from "@/components/LoadingCircle"
import { FlexColWrapper } from "@/components/Wrappers"
import { Stack, Typography } from "@mui/material"
import { useMemo } from "react"
import BudgetProgressBar from "./budget/BudgetProgressBar"
import ColoredInfoCard from "@/components/ColoredInfoCard"
import {
  formattedStringNumber,
  getCardColor,
  getWeekBounds,
  toTimestamp,
} from "@/utils/helperFunctions"
import { BudgetType, NewTransactionType } from "@/utils/type"

const WeeklyBudget = ({
  transactions,
  budgetCategories,
  currentMonth,
  currentDay,
  currentYear,
  currentTheme,
  isLoading,
}: {
  transactions: NewTransactionType[]
  budgetCategories: BudgetType[]
  currentMonth: string
  currentDay: number
  currentYear: number
  currentTheme: string | undefined
  isLoading: boolean
}) => {
  const positiveCardColor = getCardColor(currentTheme, "great")
  const negativeCardColor = getCardColor(currentTheme, "concerning")

  const { start, end } = useMemo(() => {
    return getWeekBounds({
      month: currentMonth,
      day: currentDay,
      year: currentYear,
    })
  }, [currentMonth, currentDay, currentYear])

  const weeklyTransactions = useMemo(() => {
    const weekStart = toTimestamp(start)
    const weekEnd = toTimestamp(end)
    const budgetCategorySet = new Set(budgetCategories.map((b) => b.category))

    return transactions.filter((entry) => {
      if (entry.type !== "expense") return false
      if (!entry.date?.day) return false
      if (!budgetCategorySet.has(entry.category ?? "")) return false
      const entryTime = toTimestamp(entry.date)
      return entryTime >= weekStart && entryTime <= weekEnd
    })
  }, [transactions, start, end, budgetCategories])

  const categoryTotals = useMemo(() => {
    const totals = new Map<string, number>()

    weeklyTransactions.forEach((entry) => {
      const current = totals.get(entry.category ?? "") ?? 0
      const value = entry.is_return ? -entry.amount : entry.amount
      totals.set(entry.category ?? "", current + value)
    })

    return totals
  }, [weeklyTransactions])

  const remainingBudgetCategories = useMemo(() => {
    return budgetCategories.map((category) => {
      const spent = categoryTotals.get(category.category) ?? 0

      return {
        id: category.id,
        category: category.category,
        amount: category.amount - spent,
      }
    })
  }, [budgetCategories, categoryTotals])

  const budgetTotal = budgetCategories.reduce((sum, c) => sum + c.amount, 0)
  const actualTotal = weeklyTransactions.reduce(
    (sum, t) => sum + (t.is_return ? -t.amount : t.amount),
    0,
  )
  return isLoading ? (
    <LoadingCircle height={410} />
  ) : (
    <Stack spacing={1.5}>
      <BudgetProgressBar
        label={"Weekly Budget"}
        actual={actualTotal}
        budget={budgetTotal}
      />
      <FlexColWrapper gap={2} toRowBreak={"xl"}>
        {remainingBudgetCategories.length === 0 ? (
          <Typography width={"100%"} textAlign={"center"}>
            Set up your budget in settings
          </Typography>
        ) : (
          remainingBudgetCategories.map((entry) => {
            const cardColor =
              entry.amount < 0 ? negativeCardColor : positiveCardColor

            return (
              <ColoredInfoCard
                key={entry.category}
                cardColors={cardColor}
                title={entry.category}
                info={`$${formattedStringNumber(entry.amount)}`}
              />
            )
          })
        )}
      </FlexColWrapper>
    </Stack>
  )
}

export default WeeklyBudget
