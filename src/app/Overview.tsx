"use client"

import LineChart from "@/components/LineChart"
import PieChart from "@/components/PieChart"
import ShowCaseCard from "@/components/ShowCaseCard"
import { useTransactionContext } from "@/contexts/transactions-context"
import { darkMode, lightMode } from "@/globals/colors"
import { getCategoryTotals } from "@/utils/getTotals"
import { Box, FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

const Overview = () => {
  const today = new Date()
  const currentYear = today.getFullYear()

  const { 
    incomeTransactions, 
    expenseTransactions, 
    refreshIncomeTransactions, 
    refreshExpenseTransactions,
    years
  } = useTransactionContext()
  
  const [selectedYear, setSelectedYear] = useState<string>(String(currentYear))
  const [incomeCategoryTotals, setIncomeCategoryTotals] = useState<[string, string | number][]>([])
  const [expenseCategoryTotals, setExpenseCategoryTotals] = useState<[string, string | number][]>([])

  const theme = useTheme()
  const currentTheme = theme.theme

  useEffect(() => {
    refreshIncomeTransactions()
    refreshExpenseTransactions()
  }, [selectedYear])

  useEffect(() => {
    if (!selectedYear || !incomeTransactions) return
    const incomeCategoryTotal = getCategoryTotals(selectedYear, incomeTransactions)
    const expenseCategoryTotal = getCategoryTotals(selectedYear, expenseTransactions)
    if (!incomeCategoryTotal || !expenseCategoryTotal) return
    setIncomeCategoryTotals(incomeCategoryTotal)
    setExpenseCategoryTotals(expenseCategoryTotal)
  }, [incomeTransactions])

  return (
    <Box
      className="flex flex-col gap-2 h-full"
    >
      <Box
        className="flex flex-row gap-2 h-full"
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
            {years.map((year) => {
              return <MenuItem value={year}>{year}</MenuItem>
            })}
          </Select>
        </FormControl>
      </Box>

      <hr style={{width: "100%"}}/>

      <ShowCaseCard title={"Income and Expense Overview"} secondaryTitle={""}>
        <Box
          width={"fit-content"}
          paddingTop={"10px"}
        >

        </Box>

        <LineChart
          selectedYear={selectedYear}
          transactions={incomeTransactions}
          comparisonTransactions={expenseTransactions}
          title={`Income and Expenses for ${selectedYear}`}
          lineColors={
            currentTheme === "light" 
            ? [lightMode.success, lightMode.error] 
            : [darkMode.success, darkMode.error]
          }
          height="400px"
        />        
      </ShowCaseCard>

      <Box
        className="flex flex-col xl:flex-row gap-2 h-full"
      >
        <ShowCaseCard title={`${selectedYear} Income Categories`} secondaryTitle={""}>
          <PieChart
            data={incomeCategoryTotals}
            year={selectedYear}
          />
        </ShowCaseCard>

        <ShowCaseCard title={`${selectedYear} Expense Categories`} secondaryTitle={""}>
          <PieChart
            data={expenseCategoryTotals}
            year={selectedYear}
          />
        </ShowCaseCard>
      </Box>
    </Box>
  )
}

export default Overview