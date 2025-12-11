"use client"

import ShowCaseCard from "@/components/ShowCaseCard"
import TransactionsList from "@/components/TransactionsList"
import { EXPENSES } from "@/globals/globals"
import getTransactions from "@/utils/getTransactions"
import { TransactionData } from "@/utils/saveTransaction"
import { Box, Stack } from "@mui/material"
import { useEffect, useState } from "react"

const Page = () => {
  const [expenseTransactions, setExpenseTransactions] = useState<TransactionData>({})
  const [selectedYear, setSelectedYear] = useState<string>("")
  const [selectedMonth, setSelectedMonth] = useState<string>("")
  const [totalExpenses, setTotalExpenses] = useState<string>("")

  const refreshTransactions = () => {
    const localExpenseData = getTransactions({key: EXPENSES})
    if (!localExpenseData) {
      return
    }
    setExpenseTransactions(localExpenseData)
  }

  const getTotalExpenses = () => {
    if (!expenseTransactions[selectedYear][selectedMonth]) {
      setTotalExpenses("$ 0")
      return
    }
    if (selectedYear === "" && selectedMonth === "") {
      return "$ 0"
    }
    let total = 0
    expenseTransactions[selectedYear][selectedMonth].map((detail) => {
      if (detail.category !== "Water") {
        total = total + Number(detail.amount)
      }
    })
    return `$ ${total}`
  }

  useEffect(() => {
    refreshTransactions()
  }, [])

  useEffect(() => {
    if (selectedMonth !== "" && expenseTransactions) {
      const total = getTotalExpenses()
      if (!total) return
      setTotalExpenses(total)
    }
  }, [selectedMonth, expenseTransactions])

  return (
    <Box
      display={"flex"}
      flex={1}
      justifyContent={"center"}
      alignItems={"center"}
      padding={"50px"}
    >
      <Stack direction={"column"} width={"100%"} height={"100%"} spacing={1}>
        <ShowCaseCard title={"Expenses"}>
          <TransactionsList
            type={EXPENSES}
            transactions={expenseTransactions}
            refreshTransactions={refreshTransactions}
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
          />
        </ShowCaseCard>

        <ShowCaseCard title={"Expenses Trend"}>
          {totalExpenses}
        </ShowCaseCard>
      </Stack>
    </Box>
  )
}

export default Page