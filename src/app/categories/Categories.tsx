"use client"

import MockDataWarning from "@/components/MockDataWarning"
import PieChart from "@/components/PieChart"
import ShowCaseCard from "@/components/ShowCaseCard"
import { useTransactionContext } from "@/contexts/transactions-context"
import { mockExpenseData, mockIncomeData, mockYears } from "@/globals/mockData"
import { getCategoryTotals } from "@/utils/getTotals"
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material"
import { useEffect, useState } from "react"

const Categories = () => {
  const { 
    incomeTransactions, 
    refreshIncomeTransactions,
    expenseTransactions, 
    refreshExpenseTransactions,
    years,
    currentYear,
    isMockData,
  } = useTransactionContext()

  const [selectedYear, setSelectedYear] = useState<string>(String(currentYear))
  const [incomeCategoryTotals, setIncomeCategoryTotals] = useState<[string, string | number][]>([])
  const [expenseCategoryTotals, setExpenseCategoryTotals] = useState<[string, string | number][]>([])

  useEffect(() => {
    refreshIncomeTransactions()
    refreshExpenseTransactions()
  }, [selectedYear])

  useEffect(() => {
    const incomeCategoryTotal = getCategoryTotals(selectedYear, isMockData ? mockIncomeData : incomeTransactions)
    const expenseCategoryTotal = getCategoryTotals(selectedYear, isMockData ? mockExpenseData : expenseTransactions)
    if (!incomeCategoryTotal || !expenseCategoryTotal) return
    setIncomeCategoryTotals(incomeCategoryTotal)
    setExpenseCategoryTotals(expenseCategoryTotal)
  }, [incomeTransactions, expenseTransactions, selectedYear])

  return (
    <Box
      className="flex flex-col gap-2 h-full"
    >
      <MockDataWarning/>

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
            { isMockData ?
              mockYears.map((year) => {
                return <MenuItem value={year}>{year}</MenuItem>
              })
              : years.map((year) => {
                return <MenuItem value={year}>{year}</MenuItem>
              })
            }
          </Select>
        </FormControl>
      </Box>

      <hr style={{width: "100%"}}/>

      <Box
        className="flex flex-col xl:flex-row gap-2 h-full"
      >
        <ShowCaseCard title={`${selectedYear} Income Categories`}>
          <PieChart
            data={incomeCategoryTotals}
          />
        </ShowCaseCard>

        <ShowCaseCard title={`${selectedYear} Expense Categories`}>
          <PieChart
            data={expenseCategoryTotals}
          />
        </ShowCaseCard>
      </Box>
    </Box>
  )
}

export default Categories