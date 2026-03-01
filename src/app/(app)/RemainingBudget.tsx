import ColoredInfoCard from "@/components/ColoredInfoCard"
import LoadingCircle from "@/components/LoadingCircle"
import ShowCaseCard from "@/components/ShowCaseCard"
import { FlexColWrapper } from "@/components/Wrappers"
import {
  formattedStringNumber,
  getCardColor,
  getWeekBounds,
} from "@/utils/helperFunctions"
import { BudgetTransactionTypeV2, BudgetTypeV2, DateType } from "@/utils/type"
import { Stack, Typography } from "@mui/material"
import { useMemo } from "react"
import BudgetProgressBar from "./budget/BudgetProgressBar"

const RemainingBudget = ({
  budgetCategoriesV2,
  budgetTransactionsV2,
  currentTheme,
  currentMonth,
  currentDay,
  currentYear,
  isLoading,
}: {
  budgetCategoriesV2: BudgetTypeV2[]
  budgetTransactionsV2: BudgetTransactionTypeV2[]
  currentTheme: string | undefined
  currentMonth: string
  currentDay: number
  currentYear: number
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
  }, [])

  const weeklyTransactions = useMemo(() => {
    const toDate = (date: DateType) => {
      const monthIndex = new Date(`${date.month} 1, ${date.year}`).getMonth()
      return new Date(date.year, monthIndex, date.day)
    }

    const weekStart = toDate(start)
    const weekEnd = toDate(end)

    return budgetTransactionsV2.filter((entry) => {
      if (!entry.date?.day) return false

      const entryDate = toDate(entry.date)

      return entryDate >= weekStart && entryDate <= weekEnd
    })
  }, [budgetTransactionsV2, start, end])

  const remainingBudgetCategories = useMemo(() => {
    let remaining: BudgetTypeV2[] = []

    budgetCategoriesV2.map((category) => {
      let budget = category.amount
      let total = 0

      weeklyTransactions.map((entry) => {
        if (entry.category === category.category) {
          if (entry.isReturn) {
            total -= entry.amount
          } else {
            total += entry.amount
          }
        }
      })

      remaining.push({
        id: category.id,
        category: category.category,
        amount: budget - total,
      })
    })

    return remaining
  }, [budgetCategoriesV2, weeklyTransactions])

  const budgetTotal = budgetCategoriesV2.reduce((sum, c) => sum + c.amount, 0)
  const actualTotal = weeklyTransactions.reduce(
    (sum, t) => sum + (t.isReturn ? -t.amount : t.amount),
    0,
  )
  const netTotal = budgetTotal - actualTotal

  return (
    <ShowCaseCard title={""}>
      {isLoading ? (
        <LoadingCircle />
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
                const category = entry.category
                const remaining = entry.amount
                const cardColor =
                  remaining < 0 ? negativeCardColor : positiveCardColor

                return (
                  <ColoredInfoCard
                    key={category}
                    cardColors={cardColor}
                    title={category}
                    info={`$${formattedStringNumber(remaining)}`}
                  />
                )
              })
            )}
          </FlexColWrapper>

          {weeklyTransactions.length !== 0 && (
            <Typography variant={"h6"} textAlign={"right"}>
              {`${netTotal < 0 ? "Overspent" : "Saved"}
              $${formattedStringNumber(Math.abs(netTotal))} for the week`}
            </Typography>
          )}
        </Stack>
      )}
    </ShowCaseCard>
  )
}

export default RemainingBudget
