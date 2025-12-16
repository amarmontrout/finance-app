"use client"

import LineChart from "@/components/LineChart"
import ShowCaseCard from "@/components/ShowCaseCard"
import TransactionsList from "@/components/TransactionsList"
import { EXPENSES } from "@/globals/globals"
import { getMonthTotal } from "@/utils/getTotals"
import getTransactions from "@/utils/getTransactions"
import { TransactionData } from "@/utils/saveTransaction"
import { Box } from "@mui/material"
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

  useEffect(() => {
    refreshTransactions()
  }, [])

  useEffect(() => {
    if (selectedMonth !== "" && expenseTransactions) {
      const total = getMonthTotal(selectedYear, selectedMonth, expenseTransactions)
      if (!total) return
      setTotalExpenses(total)
    }
  }, [selectedMonth, expenseTransactions])

  return (
    <Box
      width={"100%"}
      height={"100%"}
      padding={"50px"}
    >
      <Box
        className="flex flex-col xl:flex-row gap-2 h-full"
      >
        <ShowCaseCard title={"Expenses"} secondaryTitle={`Total ${totalExpenses}`}>
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

        <ShowCaseCard title={"Expenses Trend"} secondaryTitle={""}>
          <Box 
            marginTop={"10px"}
            overflow={"hidden"}
            borderRadius={"10px"}
          >
            <LineChart
              selectedYear={selectedYear}
              transactions={expenseTransactions}
              type={"Expenses"}
            />
          </Box>
        </ShowCaseCard>
      </Box>
    </Box>
  )
}

export default Page