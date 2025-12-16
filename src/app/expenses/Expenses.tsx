"use client"

import LineChart from "@/components/LineChart"
import ShowCaseCard from "@/components/ShowCaseCard"
import TransactionsList from "@/components/TransactionsList"
import { lightMode, darkMode } from "@/globals/colors"
import { EXPENSES } from "@/globals/globals"
import { getMonthTotal } from "@/utils/getTotals"
import getTransactions from "@/utils/getTransactions"
import { TransactionData } from "@/utils/saveTransaction"
import { Box } from "@mui/material"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"

const Expenses = () => {
  const [expenseTransactions, setExpenseTransactions] = useState<TransactionData>({})
  const [selectedYear, setSelectedYear] = useState<string>("")
  const [selectedMonth, setSelectedMonth] = useState<string>("")
  const [totalExpenses, setTotalExpenses] = useState<string>("")

  const theme = useTheme()
  const currentTheme = theme.theme

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
    if (selectedMonth == "") {
      setTotalExpenses("$ 0")
    }
  }, [selectedMonth, expenseTransactions])
  return (
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
      
      <ShowCaseCard title={"Expenses Chart"} secondaryTitle={""}>
        <Box 
          // This box makes the rounded corners for the chart
          marginTop={"10px"}
          overflow={"hidden"}
          borderRadius={"10px"}
        >
          <LineChart
            selectedYear={selectedYear}
            transactions={expenseTransactions}
            type={"Expenses"}
            lineColors={
              currentTheme === "light" 
              ? [lightMode.error] 
              : [darkMode.error]
            }
          />
        </Box>
      </ShowCaseCard>
    </Box>
  )
}

export default Expenses