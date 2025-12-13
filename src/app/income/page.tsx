"use client"

import LineChart from "@/components/LineChart"
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
  const [totalIncome, setTotalIncome] = useState<string>("")

  const refreshTransactions = () => {
    const localIncomeData = getTransactions({key: INCOME})
    if (!localIncomeData) {
      return
    }
    setIncomeTransactions(localIncomeData)
  }

  const getTotalIncome = () => {
    if (!incomeTransactions[selectedYear] || !incomeTransactions[selectedYear][selectedMonth]) {
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
      width={"100%"}
      padding={"50px"}
    >
      <Box
        className="flex flex-col xl:flex-row gap-2 h-full"
      >
        <ShowCaseCard title={"Income"} secondaryTitle={`Total Income ${totalIncome}`}>
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

        <ShowCaseCard title={"Income Trend"} secondaryTitle={""}>
          <Box marginTop={"10px"}>
            <LineChart/>
          </Box>
        </ShowCaseCard>
      </Box>
    </Box>
  )
}

export default Page