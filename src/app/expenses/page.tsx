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
  const [selectedYear, setSelectedYear] = useState<string>("")
  const [selectedMonth, setSelectedMonth] = useState<string>("")

  const refreshTransactions = () => {
    const localExpenseData = getTransactions({key: EXPENSES})
    if (!localExpenseData) {
      return
    }
    setExpenseTransactions(localExpenseData)
  }

  // TODO
  // Make sure to not count water expense when calculating total
  const getTotalExpenses = () => {
    if (selectedYear === "" && selectedMonth === "") {
      return
    }
    let total = 0

    expenseTransactions[selectedYear][selectedMonth].map((detail) => {
      total = total + Number(detail.amount)
    })

    return total
  }

  useEffect(() => {
    refreshTransactions()
  }, [])

  useEffect(() => {
    if (selectedMonth !== "") {
      console.log(getTotalExpenses())
    }
  }, [selectedMonth])

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
          refreshTransactions={refreshTransactions}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
        />
      </ShowCaseCard>
    </Box>
  )
}

export default Page