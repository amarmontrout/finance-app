"use client"

import ShowCaseCard from "@/components/ShowCaseCard"
import TransactionsList from "@/components/TransactionsList"
import { INCOME } from "@/globals/globals"
import getTransactions from "@/utils/getTransactions"
import { TransactionData } from "@/utils/saveTransaction"
import { Box } from "@mui/material"
import { useState, useEffect } from "react"

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

  return (
    <Box
      display={"flex"}
      flex={1}
      justifyContent={"center"}
      alignItems={"center"}
      padding={"50px"}
    >
      <ShowCaseCard title={"Income"}>
        <TransactionsList
          type={INCOME}
          transactions={incomeTransactions}
        />
      </ShowCaseCard>
    </Box>
  )
}

export default Page