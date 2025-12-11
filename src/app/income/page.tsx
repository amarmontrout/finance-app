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
  const [selectedYear, setSelectedYear] = useState<string>("")
  const [selectedMonth, setSelectedMonth] = useState<string>("")

  const refreshTransactions = () => {
    const localIncomeData = getTransactions({key: INCOME})
    if (!localIncomeData) {
      return
    }
    setIncomeTransactions(localIncomeData)
  }

  const getTotalIncome = () => {
    if (selectedYear === "" && selectedMonth === "") {
      return
    }
    let total = 0

    incomeTransactions[selectedYear][selectedMonth].map((detail) => {
      total = total + Number(detail.amount)
    })

    return total
  }

  useEffect(() => {
    refreshTransactions()
  }, [])

  useEffect(() => {
    if (selectedMonth !== "") {
      console.log(getTotalIncome())
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
    </Box>
  )
}

export default Page