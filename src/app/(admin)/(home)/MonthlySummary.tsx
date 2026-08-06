"use client"

import { useDataContext } from "@/contexts/data-context"
import { Stack } from "@mui/material"
import BudgetProgress from "./BudgetProgress"
import CreditCardEstimate from "./CreditCardEstimate"
import FinancialSummary from "./FinancialSummary"

const MonthlySummary = () => {
  const { accounts, categories } = useDataContext()

  return (
    <Stack width={"100%"} height={"100%"} spacing={4}>
      <FinancialSummary accounts={accounts} />

      <Stack direction={"column"} spacing={1}>
        <BudgetProgress categories={categories} />
        <CreditCardEstimate accounts={accounts} />
      </Stack>
    </Stack>
  )
}

export default MonthlySummary
