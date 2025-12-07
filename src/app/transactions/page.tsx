"use client"

import ShowCaseCard from "@/components/ShowCaseCard"
import TransactionForm from "@/components/TransactionForm"
import { EXPENSE_CATEGORIES, EXPENSES, INCOME, INCOME_CATEGORIES } from "@/globals/globals"
import { Box, Stack } from "@mui/material"

const Page = () => {
  return (
    <Box
      width={"100%"}
      padding={"50px"}
    >
      <Stack width={"100%"} height={"100%"} gap={2}>
        <ShowCaseCard title={"Add Income"}>
          <TransactionForm
            categories={INCOME_CATEGORIES}
            type={INCOME}
          />
        </ShowCaseCard>

        <ShowCaseCard title={"Add Expense"}>
          <TransactionForm
            categories={EXPENSE_CATEGORIES}
            type={EXPENSES}
          />
        </ShowCaseCard>
      </Stack>
    </Box>
  )
}

export default Page