import { formattedStringNumber } from "@/utils/helperFunctions"
import { BudgetType, TransactionType } from "@/utils/type"
import { Typography } from "@mui/material"
import { useMemo } from "react"
import BudgetProgressBar from "./BudgetProgressBar"

const MonthlyBudget = ({
  transactions,
  budgetCategories,
  currentMonth,
  currentYear,
}: {
  transactions: TransactionType[]
  budgetCategories: BudgetType[]
  currentMonth: string
  currentYear: number
}) => {
  const { actualTotal, budgetTotal } = useMemo(() => {
    const allowedCategories = new Set(budgetCategories.map((c) => c.category))
    let actual = 0
    let budget = 0
    for (const c of budgetCategories) {
      budget += c.amount
    }
    for (const t of transactions) {
      if (
        t.date.month === currentMonth &&
        t.date.year === currentYear &&
        allowedCategories.has(t.category)
      ) {
        actual += t.is_return ? -t.amount : t.amount
      }
    }
    return { actualTotal: actual, budgetTotal: budget }
  }, [transactions, budgetCategories, currentMonth, currentYear])

  const netTotal = budgetTotal - actualTotal

  return (
    <div>
      <BudgetProgressBar
        label="Month Total"
        actual={actualTotal}
        budget={budgetTotal}
      />
      <Typography>{`Net: $${formattedStringNumber(netTotal)}`}</Typography>
    </div>
  )
}

export default MonthlyBudget
