"use client"

import LineChart from "@/components/LineChart"
import ShowCaseCard from "@/components/ShowCaseCard"
import { darkMode, lightMode } from "@/globals/colors"
import { INCOME, EXPENSES, YEARS } from "@/globals/globals"
import getTransactions from "@/utils/getTransactions"
import { TransactionData } from "@/utils/saveTransaction"
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

const Overview = () => {
  const today = new Date()
  const currentYear = today.getFullYear()

  const [incomeTransactions, setIncomeTransactions] = useState<TransactionData>({})
  const [expenseTransactions, setExpenseTransactions] = useState<TransactionData>({})
  const [selectedYear, setSelectedYear] = useState<string>(String(currentYear))

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

  return (
    <Box
      className="flex flex-col gap-2 h-full"
    >
      <ShowCaseCard title={"Overview"} secondaryTitle={""}>
        <Box
          width={"fit-content"}
          paddingTop={"10px"}
        >
          <FormControl>
            <InputLabel>Year</InputLabel>
            <Select
              label="Year"
              value={selectedYear}
              name={"year"}
              onChange={e => setSelectedYear(e.target.value)}
              sx={{
                width: "175px"
              }}
            >
              {YEARS.map((year) => {
                return <MenuItem value={year}>{year}</MenuItem>
              })}
            </Select>
          </FormControl>
        </Box>


        <Box 
          // This box makes the rounded corners for the chart
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
      </ShowCaseCard>
    </Box>
  )
}

export default Overview