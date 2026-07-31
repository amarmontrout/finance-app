import { BudgetType } from "@/api/choices/models"
import { TransactionType } from "@/api/transactions/models"
import { getTransactionsByType } from "@/global/dataFunctions"
import { getBudgetInfo } from "@/global/infoFunctions"
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded"
import { Box, Stack, Typography } from "@mui/material"
import Link from "next/link"
import { useMemo } from "react"
import BudgetProgressBar from "./_components/ProgressBar"

const BudgetProgress = ({
  today,
  transactions,
  budgetCategories,
}: {
  today: { month: string; day: number; year: number }
  transactions: TransactionType[]
  budgetCategories: BudgetType[]
}) => {
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

  return (
    <Box bgcolor={"rgba(255,255,255,0.15)"} borderRadius={5} padding={2}>
      <Stack direction={"column"} spacing={2}>
        <BudgetProgressBar
          label={"Total Budget"}
          budget={budgetTotal}
          actual={actualTotal}
          expected={earnedBudget !== 0 ? earnedBudget : undefined}
        />

        <Link
          href={"/budget"}
          style={{ textDecoration: "none", textAlign: "right" }}
        >
          <Typography
            variant={"body2"}
            sx={{
              gap: 0.5,
              color: "#F5F1E8",
              lineHeight: 1,
            }}
          >
            View breakdown
            <ArrowForwardIosRoundedIcon sx={{ fontSize: 12 }} />
          </Typography>
        </Link>
      </Stack>
    </Box>
  )
}

export default BudgetProgress
