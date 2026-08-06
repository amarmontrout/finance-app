import {
  V2CategoryType,
  V2HydratedBudgetType,
  V2TransactionType,
} from "@/api/v2/models"
import { getBudgetsV2, getTransactionsV2 } from "@/api/v2/requests"
import { getBudgetInfo, getNextMonthYear } from "@/global/infoFunctions"
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded"
import { Box, Stack, Typography } from "@mui/material"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { getToday, hydrateBudgets } from "../v2/utils"
import BudgetProgressBar from "./_components/ProgressBar"

const BudgetProgress = ({ categories }: { categories: V2CategoryType[] }) => {
  const today = getToday()
  const [yearStr, monthStr] = today.split("-")
  const currMonthYear = `${yearStr}-${monthStr}`
  const nextMonthYear = getNextMonthYear({ isoString: today })

  const [currentTransactions, setCurrentTransactions] = useState<
    V2TransactionType[]
  >([])
  const [budgets, setBudgets] = useState<V2HydratedBudgetType[]>([])

  // Get category budgets
  useEffect(() => {
    const refreshBudgets = async () => {
      if (categories.length === 0) return
      const b = await getBudgetsV2({
        filters: [
          {
            column: "deleted_at",
            operator: "eq",
            value: null,
          },
        ],
      })
      const hb = hydrateBudgets({
        categories: categories,
        budgets: b ?? [],
      })
      setBudgets(
        hb.sort((x, y) =>
          x.category_name.localeCompare(y.category_name, undefined, {
            sensitivity: "base",
          }),
        ),
      )
    }

    refreshBudgets()
  }, [categories])

  // Get all transactions for current months
  useEffect(() => {
    const load = async () => {
      const [currTransactions] = await Promise.all([
        getTransactionsV2({
          filters: [
            {
              column: "transaction_date",
              operator: "gte",
              value: `${currMonthYear}-01`,
            },
            {
              column: "transaction_date",
              operator: "lt",
              value: `${nextMonthYear}-01`,
            },
          ],
        }),
      ])

      setCurrentTransactions(currTransactions ?? [])
    }

    load().catch(console.error)
  }, [currMonthYear])

  // Calculate total spent on budget categories and total budgeted amount
  const { actualTotal, budgetTotal } = useMemo(() => {
    const budgetTotal = budgets.reduce((sum, b) => sum + b.amount, 0)

    const budgetCategoryIds = new Set(budgets.map((b) => b.category_id))
    const actualTotal = currentTransactions.reduce((total, transaction) => {
      if (!budgetCategoryIds.has(transaction.category_id)) return total

      switch (transaction.transaction_type) {
        case "Expense":
          return total + transaction.amount
        case "Return":
          return total - transaction.amount
        case "Refund":
          return total - transaction.amount
        default:
          return total
      }
    }, 0)

    return { actualTotal, budgetTotal }
  }, [budgets, currentTransactions])

  // Calculate how much of total budget was earned up to the current day
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
