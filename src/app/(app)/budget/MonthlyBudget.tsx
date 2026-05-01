import {
  calculateDailyBudget,
  formattedStringNumber,
} from "@/utils/helperFunctions"
import { BudgetType, TransactionType } from "@/utils/type"
import { Divider, Stack, Typography } from "@mui/material"
import { useMemo } from "react"
import BudgetProgressBar from "./BudgetProgressBar"

const budgetExamplesForTesting = [
  {
    id: 1,
    category: "Fast Food",
    amount: 125,
  },
  {
    id: 2,
    category: "Groceries",
    amount: 850,
  },
  {
    id: 3,
    category: "Restaurant",
    amount: 375,
  },
  {
    id: 4,
    category: "Shopping",
    amount: 350,
  },
]

const MonthlyBudget = ({
  transactions,
  budgetCategories,
  currentMonth,
  currentDay,
  currentYear,
}: {
  transactions: TransactionType[]
  budgetCategories: BudgetType[]
  currentMonth: string
  currentDay: number
  currentYear: number
}) => {
  const { actualTotal, budgetTotal } = useMemo(() => {
    const allowedCategories = new Set(
      budgetExamplesForTesting.map((c) => c.category),
    )
    let actual = 0
    let budget = 0
    for (const c of budgetExamplesForTesting) {
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
  }, [transactions, budgetExamplesForTesting, currentMonth, currentYear])

  const netTotal = budgetTotal - actualTotal

  const { remainingDays, remainingBudget, dailyAllowance } =
    calculateDailyBudget({
      monthlyBudget: budgetTotal,
      spentSoFar: actualTotal,
      date: { month: currentMonth, day: currentDay, year: currentYear },
    })

  return (
    <div>
      <BudgetProgressBar
        label="Month Total"
        actual={actualTotal}
        budget={budgetTotal}
      />
      <Stack spacing={1} divider={<Divider />}>
        <Typography>{`Net: $${formattedStringNumber(netTotal)}`}</Typography>
        <Typography>
          {`Today's Date: ${currentMonth} ${currentDay}, ${currentYear}`}
        </Typography>
        <Typography>{`Remaining Days: ${remainingDays}`}</Typography>
        <Typography>
          {`Remaining Budget: $${formattedStringNumber(remainingBudget)}`}
        </Typography>
        <Typography>
          {`Daily Allowance: $${formattedStringNumber(dailyAllowance)}`}
        </Typography>
      </Stack>
    </div>
  )
}

export default MonthlyBudget
