"use client"

import ShowCaseCard from "@/components/ShowCaseCard"
import TransactionForm from "@/components/TransactionForm"
import { expenseCategories, EXPENSES, INCOME, incomeCategories } from "@/globals/globals"
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
            categories={incomeCategories}
            type={INCOME}
          />
        </ShowCaseCard>

        <ShowCaseCard title={"Add Expense"}>
          <TransactionForm
            categories={expenseCategories}
            type={EXPENSES}
          />
        </ShowCaseCard>
      </Stack>
    </Box>
  )
}

export default Page