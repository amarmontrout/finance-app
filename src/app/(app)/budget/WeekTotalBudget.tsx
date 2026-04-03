import { Stack, Typography } from "@mui/material"
import { useMemo } from "react"
import BudgetProgressBar from "./BudgetProgressBar"
import { formattedStringNumber, toTimestamp } from "@/utils/helperFunctions"
import { BudgetType, TransactionType, WeekType } from "@/utils/type"

const WeekTotalBudget = ({
  transactions,
  week,
  isLoading,
  budgetCategories,
}: {
  transactions: TransactionType[]
  week: WeekType
  isLoading: boolean
  budgetCategories: BudgetType[]
}) => {
  const expenseTransactions = useMemo(() => {
    const weekStart = toTimestamp(week.start)
    const weekEnd = toTimestamp(week.end)

    return transactions.filter((entry) => {
      if (!entry.date?.day || entry.type !== "expense") return false
      const entryTime = toTimestamp(entry.date)
      return entryTime >= weekStart && entryTime <= weekEnd
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
  )
}

export default WeekTotalBudget
