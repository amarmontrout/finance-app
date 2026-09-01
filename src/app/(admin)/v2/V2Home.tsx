"use client"

import { useDataContext } from "@/contexts/data-context"
import { Stack } from "@mui/material"
import BudgetProgress from "../(home)/BudgetProgress"
import CreditCardEstimate from "../(home)/CreditCardEstimate"
import FinancialSummary from "../(home)/FinancialSummary"

const V2Home = () => {
  const { accounts, categories } = useDataContext()

  return (
    <Stack width={"100%"} height={"100%"} spacing={4}>
      <FinancialSummary />

      <Stack direction={"column"} spacing={1}>
        <BudgetProgress categories={categories} />
        <CreditCardEstimate accounts={accounts} />
      </Stack>
    </Stack>
  )
}

export default V2Home
