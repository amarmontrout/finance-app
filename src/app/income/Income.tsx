"use client"

import LineChart from "@/components/LineChart"
import ShowCaseCard from "@/components/ShowCaseCard"
import TransactionsList from "@/components/TransactionsList"
import { lightMode, darkMode } from "@/globals/colors"
import { INCOME } from "@/globals/globals"
import { getMonthTotal } from "@/utils/getTotals"
import getTransactions from "@/utils/getTransactions"
import { TransactionData } from "@/utils/saveTransaction"
import { Box } from "@mui/material"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"

const Income = () => {
  const [incomeTransactions, setIncomeTransactions] = useState<TransactionData>({})
  const [selectedYear, setSelectedYear] = useState<string>("")
  const [selectedMonth, setSelectedMonth] = useState<string>("")
  const [totalIncome, setTotalIncome] = useState<string>("")
    
  const theme = useTheme()
  const currentTheme = theme.theme
    
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
    
  useEffect(() => {
    if (selectedMonth !== "" && incomeTransactions) {
      const total = getMonthTotal( selectedYear, selectedMonth, incomeTransactions)
      if (!total) return
      setTotalIncome(total)
    }
    if (selectedMonth == "") {
      setTotalIncome("$ 0")
    }
  }, [selectedMonth, incomeTransactions])

  return (
    <Box
      className="flex flex-col xl:flex-row gap-2 h-full"
    >
      <ShowCaseCard title={"Income"} secondaryTitle={`Total ${totalIncome}`}>
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
      <ShowCaseCard title={"Income Chart"} secondaryTitle={""}>
        <Box 
          // This box makes the rounded corners for the chart
          marginTop={"10px"}
          overflow={"hidden"}
          borderRadius={"10px"}
        >
          <LineChart
            selectedYear={selectedYear}
            transactions={incomeTransactions}
            type={"Income"}
            lineColors={
              currentTheme === "light" 
              ? [lightMode.success] 
              : [darkMode.success]
            }
          />
        </Box>
      </ShowCaseCard>
    </Box>
  )
}

export default Income