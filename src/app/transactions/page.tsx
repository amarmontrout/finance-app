"use client"

import ShowCaseCard from "@/components/ShowCaseCard"
import TransactionForm from "@/components/TransactionForm"
import { EXPENSES, INCOME } from "@/globals/globals"
import getTransactions from "@/utils/getTransactions"
import { TransactionData } from "@/utils/saveTransaction"
import { Box, Stack, Typography } from "@mui/material"
import { useEffect, useState } from "react"

const incomeCategories = [
  "Paycheck",
  "Savings Interest",
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
  const [incomeTransactions, setIncomeTransactions] = useState<TransactionData>({})

  const refreshTransactions = () => {
    const localIncomeData = getTransactions({key: INCOME})
    if (!localIncomeData) {
      return
    }
    setIncomeTransactions(localIncomeData)
  }

  useEffect(() => {
    refreshTransactions()
  }, [])

  const RecentTransactions = () => {
    return (
      <Stack direction={"row"} gap={2}>
        {
          Object.entries(incomeTransactions).map(([year, months]) => {
            return (
              <Stack key={year} direction={"row"} gap={1}>
                <Typography>{year}:</Typography>
                <Stack direction={"column"} gap={2}>
                  {Object.entries(months).map(([month, transaction]) => {
                    return (
                      <Stack key={month} direction={"row"} gap={1} justifyContent={"space-between"}>
                        <Typography>{month}:</Typography>
                        <Stack direction={"column"}>
                          {transaction.map(({ category, amount}, idx) => {
                            return (
                              <Stack key={`${idx}-${category}-${amount}`} direction={"row"} gap={1}>
                                <Typography>{category}</Typography>
                                <Typography>{amount}</Typography>
                                <button onClick={() => {alert(idx)}}>X</button>
                              </Stack>
                            )
                          })}
                        </Stack>
                      </Stack>
                    )
                  })}
                </Stack>
              </Stack>
            )
          })
        }
      </Stack>
    )
  }

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
            refreshTransactions={refreshTransactions}
          />
          <Box 
            overflow={"hidden"}
            flex={1}
            sx={{
              overflowY: "scroll"
            }}
          >
            <RecentTransactions/>
          </Box>
        </ShowCaseCard>

        <ShowCaseCard title={"Add Expense"}>
          <TransactionForm
            categories={expenseCategories}
            type={EXPENSES}
            refreshTransactions={refreshTransactions}
          />
        </ShowCaseCard>
      </Stack>
    </Box>
  )
}

export default Page