"use client"

import ShowCaseCard from "@/components/ShowCaseCard"
import TransactionsList from "@/components/TransactionsList"
import { EXPENSES } from "@/globals/globals"
import getTransactions from "@/utils/getTransactions"
import { TransactionData } from "@/utils/saveTransaction"
import { Box } from "@mui/material"
import { useEffect, useState } from "react"

const Page = () => {
  const [expenseTransactions, setExpenseTransactions] = useState<TransactionData>({})

  const refreshTransactions = () => {
    const localExpenseData = getTransactions({key: EXPENSES})
    if (!localExpenseData) {
      return
    }
    setExpenseTransactions(localExpenseData)
  }

  useEffect(() => {
    refreshTransactions()
  }, [])

  return (
    <Box
      display={"flex"}
      flex={1}
      justifyContent={"center"}
      alignItems={"center"}
      padding={"50px"}
    >
      <ShowCaseCard title={"Expenses"}>
        <TransactionsList
          type={EXPENSES}
          transactions={expenseTransactions}
        />
      </ShowCaseCard>
    </Box>
  )
}

export default Page