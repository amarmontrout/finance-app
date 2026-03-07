import LoadingCircle from "@/components/LoadingCircle"
import ShowCaseCard from "@/components/ShowCaseCard"
import { Stack, Typography } from "@mui/material"
import { useMemo } from "react"
import BudgetProgressBar from "./BudgetProgressBar"
import { formattedStringNumber } from "@/utils/helperFunctions"
import {
  BudgetType,
  DateType,
  NewTransactionType,
  WeekType,
} from "@/utils/type"

const WeekTotalBudget = ({
  transactions,
  week,
  isLoading,
  budgetCategories,
}: {
  transactions: NewTransactionType[]
  week: WeekType
  isLoading: boolean
  budgetCategories: BudgetType[]
}) => {
  const expenseTransactions = useMemo(() => {
    const toDate = (date: DateType) => {
      const monthIndex = new Date(`${date.month} 1, ${date.year}`).getMonth()
      return new Date(date.year, monthIndex, date.day)
    }

    const weekStart = toDate(week.start)
    const weekEnd = toDate(week.end)

    return transactions.filter((entry) => {
      if (!entry.date?.day || entry.type !== "expense") return false

      const entryDate = toDate(entry.date)

      return entryDate >= weekStart && entryDate <= weekEnd
    })
  }, [transactions, week.start, week.end])

  const budgetTotal = budgetCategories.reduce((sum, c) => sum + c.amount, 0)
  const actualTotal = useMemo(() => {
    const allowedCategories = new Set(budgetCategories.map((c) => c.category))

    return expenseTransactions
      .filter((entry) => allowedCategories.has(entry.category))
      .reduce((sum, t) => sum + (t.is_return ? -t.amount : t.amount), 0)
  }, [expenseTransactions, budgetCategories])
  const netTotal = budgetTotal - actualTotal

  return (
    <ShowCaseCard title={""}>
      {isLoading ? (
        <LoadingCircle />
      ) : (
        <Stack className="xl:w-[50%]" spacing={1.5} margin={"0 auto"}>
          <BudgetProgressBar
            label={"Week Total"}
            actual={actualTotal}
            budget={budgetTotal}
          />

          {expenseTransactions.length !== 0 && (
            <Typography variant={"h6"} textAlign={"left"}>
              {`${netTotal < 0 ? "Overspending" : "Saving"}
                    $${formattedStringNumber(Math.abs(netTotal))} for the week`}
            </Typography>
          )}
        </Stack>
      )}
    </ShowCaseCard>
  )
}

export default WeekTotalBudget
