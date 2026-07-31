"use client"

import { useCategoryContext } from "@/contexts/categories-context"
import { useTransactionContext } from "@/contexts/transaction-context"
import { getCurrentDateInfo } from "@/global/infoFunctions"
import { Stack } from "@mui/material"
import BudgetProgress from "./BudgetProgress"
import CreditCardEstimate from "./CreditCardEstimate"
import FinancialSummary from "./FinancialSummary"

const MonthlySummary = () => {
  const { today } = getCurrentDateInfo()
  const { transactions } = useTransactionContext()
  const { budgetCategories } = useCategoryContext()

  return (
    <Stack width={"100%"} height={"100%"} spacing={4}>
      <FinancialSummary today={today} transactions={transactions} />

      <Stack direction={"column"} spacing={1}>
        <BudgetProgress
          today={today}
          transactions={transactions}
          budgetCategories={budgetCategories}
        />

        <CreditCardEstimate today={today} transactions={transactions} />
      </Stack>
    </Stack>
  )
}

export default MonthlySummary
