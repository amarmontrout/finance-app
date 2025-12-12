"use client"

import ShowCaseCard from "@/components/ShowCaseCard"
import TransactionsList from "@/components/TransactionsList"
import { INCOME } from "@/globals/globals"
import getTransactions from "@/utils/getTransactions"
import { TransactionData } from "@/utils/saveTransaction"
import { Box, Stack } from "@mui/material"
import { useState, useEffect } from "react"



const Page = () => {
  const [incomeTransactions, setIncomeTransactions] = useState<TransactionData>({})
  const [selectedYear, setSelectedYear] = useState<string>("")
  const [selectedMonth, setSelectedMonth] = useState<string>("")
  const [totalIncome, setTotalIncome] = useState<string>("")

  const refreshTransactions = () => {
    const localIncomeData = getTransactions({key: INCOME})
    if (!localIncomeData) {
      return
    }
    setIncomeTransactions(localIncomeData)
  }

  const getTotalIncome = () => {
    if (!incomeTransactions[selectedYear][selectedMonth]) {
      setTotalIncome("$ 0")
      return
    }
    if (selectedYear === "" && selectedMonth === "") {
      return "$ 0"
    }
    let total = 0
    incomeTransactions[selectedYear][selectedMonth].map((detail) => {
      total = total + Number(detail.amount)
    })
    return `$ ${total}`
  }

  useEffect(() => {
    refreshTransactions()
  }, [])

  useEffect(() => {
    if (selectedMonth !== "" && incomeTransactions) {
      const total = getTotalIncome()
      if (!total) return
      setTotalIncome(total)
    }
  }, [selectedMonth, incomeTransactions])

  return (
    <Box
      display={"flex"}
      flex={1}
      justifyContent={"center"}
      alignItems={"center"}
      padding={"50px"}
    >
      <Stack direction={"row"} width={"100%"} height={"100%"} spacing={1}>
        <ShowCaseCard title={"Income"}>
          <TransactionsList
            type={INCOME}
            transactions={incomeTransactions}
            refreshTransactions={refreshTransactions}
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
          />
        </ShowCaseCard>

        <ShowCaseCard title={"Income Trend"}>
          {totalIncome}
        </ShowCaseCard>
      </Stack>
    </Box>
  )
}

export default Page