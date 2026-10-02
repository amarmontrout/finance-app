import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded"
import { Stack, Typography } from "@mui/material"
import Link from "next/link"
import { useEffect, useMemo } from "react"
import ProgressBar from "../components/ui/ProgressBar"
import { useDataContext } from "../contexts/data-context"
import { useTransactionContext } from "../contexts/transaction-context"
import { TEXT_COLOR } from "../data/colors"
import { getBudgetInfo, getISODate } from "../lib/functions/getters"

const BudgetProgress = () => {
  const { transactions, setSelectedDate } = useTransactionContext()
  const { activeBudgets } = useDataContext()

  const { actualTotal, budgetTotal } = useMemo(() => {
    const budgetTotal = activeBudgets.reduce(
      (sum, budget) => sum + budget.amount,
      0,
    )
    const budgetCategoryIds = new Set(
      activeBudgets.map((budget) => budget.category_id),
    )
    const actualTotal = transactions.reduce((total, transaction) => {
      if (!budgetCategoryIds.has(transaction.category_id)) {
        return total
      }
      switch (transaction.transaction_type) {
        case "Expense":
          return total + transaction.amount
        case "Return":
          return total - transaction.amount
        default:
          return total
      }
    }, 0)
    return { actualTotal, budgetTotal }
  }, [activeBudgets, transactions])

  const { earnedBudget } = getBudgetInfo({
    budget: budgetTotal,
    spent: actualTotal,
    date: getISODate(),
  })

  useEffect(() => setSelectedDate(new Date()), [setSelectedDate])

  return (
    <Stack direction={"column"} spacing={1} sx={{ textAlign: "right" }}>
      <ProgressBar
        label={"Total Budget"}
        budget={budgetTotal}
        actual={actualTotal}
        expected={earnedBudget !== 0 ? earnedBudget : undefined}
      />

      <Link href={"/budget"} style={{ textDecoration: "none" }}>
        <Typography
          variant={"body2"}
          sx={{ gap: 0.5, color: TEXT_COLOR, lineHeight: 1 }}
        >
          View breakdown
          <ArrowForwardIosRoundedIcon sx={{ fontSize: 12 }} />
        </Typography>
      </Link>
    </Stack>
  )
}

export default BudgetProgress
