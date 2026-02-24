"use client"

import ShowCaseCard from "@/components/ShowCaseCard"
import { useTransactionContext } from "@/contexts/transactions-context"
import { 
  formattedStringNumber,
} from "@/utils/helperFunctions"
import { Stack, Typography } from "@mui/material"

const TransactionFeed = ({
  selectedMonth,
  selectedYear
}: {
  selectedMonth: string
  selectedYear: number
}) => {
  const { 
    incomeTransactionsV2, 
    expenseTransactionsV2
  } = useTransactionContext()

  const transactionList = [
    ...incomeTransactionsV2.map(t => ({ ...t, type: "income" })),
    ...expenseTransactionsV2.map(t => ({ ...t, type: "expense" })),
  ]

  const sortTransactionsByCategory = (transactions: typeof transactionList) => {
    return [...transactions].sort((a, b) =>
      a.category.localeCompare(b.category)
    )
  }

  const sortedTransactions = sortTransactionsByCategory(transactionList)

  return (
    <ShowCaseCard 
      title={`${selectedMonth} ${selectedYear}`}
    >
      <Stack direction={"column"} width={"75%"} margin={"0 auto"}>
          {
            sortedTransactions.map((transaction) => {
              if (
                transaction.year === selectedYear 
                && transaction.month === selectedMonth
              ) {
                return (
                  <Stack 
                    key={transaction.id} 
                    direction={"row"} 
                    justifyContent={"space-between"}
                  >
                    <Typography>
                      {transaction.category}
                    </Typography>

                    <Typography 
                      key={transaction.id} 
                      color={transaction.type === "income" ? 
                        "success" : "error"
                      }
                    >
                      {transaction.type === "income" ? "+ " : "- "}
                      {`$${formattedStringNumber(transaction.amount)}`}
                    </Typography>
                  </Stack>
                )
              }
            })
          }
      </Stack>
    </ShowCaseCard>
  )
}

export default TransactionFeed