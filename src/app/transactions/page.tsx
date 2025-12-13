"use client"

import ShowCaseCard from "@/components/ShowCaseCard"
import TransactionForm from "@/components/TransactionForm"
import { EXPENSE_CATEGORIES, EXPENSES, INCOME, INCOME_CATEGORIES } from "@/globals/globals"
import { Box } from "@mui/material"

const Page = () => {
  return (
    <Box
      width={"100%"}
      padding={"50px"}
    >
      <Box
        className="flex flex-row xl:flex-col gap-2"
        height={"100%"}
      >
        <ShowCaseCard title={"Add Income"} secondaryTitle={""}>
          <TransactionForm
            categories={INCOME_CATEGORIES}
            type={INCOME}
          />
        </ShowCaseCard>

        <ShowCaseCard title={"Add Expense"} secondaryTitle={""}>
          <TransactionForm
            categories={EXPENSE_CATEGORIES}
            type={EXPENSES}
          />
        </ShowCaseCard>
      </Box>
    </Box>
  )
}

export default Page