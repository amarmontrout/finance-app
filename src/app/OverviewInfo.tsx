"use client"

import LineChart from "@/components/LineChart"
import { darkMode, lightMode } from "@/globals/colors"
import { INCOME, EXPENSES } from "@/globals/globals"
import getTransactions from "@/utils/getTransactions"
import { TransactionData } from "@/utils/saveTransaction"
import { Box } from "@mui/material"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

const OverviewInfo = () => {
  const [incomeTransactions, setIncomeTransactions] = useState<TransactionData>({})
  const [expenseTransactions, setExpenseTransactions] = useState<TransactionData>({})
  const [selectedYear, setSelectedYear] = useState<string>("2025")

  const theme = useTheme()
  const currentTheme = theme.theme

  const getIncomeExpenseTransactions = () => {
    const localIncomeData = getTransactions({key: INCOME})
    if (!localIncomeData) return
    setIncomeTransactions(localIncomeData)

    const localExpenseData = getTransactions({key: EXPENSES})
    if (!localExpenseData) return
    setExpenseTransactions(localExpenseData)
  }

  useEffect(() => {
    getIncomeExpenseTransactions()
  }, [selectedYear])

  useEffect(() => {
    console.log(incomeTransactions)
    console.log(expenseTransactions)
  }, [incomeTransactions, expenseTransactions])

  return (
    <Box 
      marginTop={"10px"}
      overflow={"hidden"}
      borderRadius={"10px"}
    >
      <LineChart
        selectedYear={selectedYear}
        transactions={incomeTransactions}
        comparisonTransactions={expenseTransactions}
        type={"Income and Expenses"}
        lineColors={
          currentTheme === "light" 
          ? [lightMode.success, lightMode.error] 
          : [darkMode.success, darkMode.error]
        }
        height="500px"
      />
    </Box>
  )
}

export default OverviewInfo