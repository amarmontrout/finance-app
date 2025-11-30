import ShowCaseCard from "@/components/ShowCaseCard"
import TransactionForm from "@/components/TransactionForm"
import { Box, Stack } from "@mui/material"

const incomeCategories = [
  "Paycheck",
  "Misc"
]

const expenseCategories = [
  "Mortgage",
  "Electric",
  "Water",
  "Internet",
  "Water",
  "Trash",
  "Phone",
  "Credit Card",
  "Misc"
]

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
          />
        </ShowCaseCard>

        <ShowCaseCard title={"Add Expense"}>
          <TransactionForm
            categories={expenseCategories}
          />
        </ShowCaseCard>
      </Stack>
    </Box>
  )
}

export default Page