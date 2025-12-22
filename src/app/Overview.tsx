"use client"

import LineChart from "@/components/LineChart"
import PieChart from "@/components/PieChart"
import ShowCaseCard from "@/components/ShowCaseCard"
import { useTransactionContext } from "@/contexts/transactions-context"
import { darkMode, lightMode } from "@/globals/colors"
import { mockExpenseData, mockIncomeData, mockYears } from "@/globals/mockData"
import { buildMultiColumnData, MultiColumnDataType } from "@/utils/buildChartData"
import { getCategoryTotals } from "@/utils/getTotals"
import { Alert, Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material"
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
    years,
    isMockData
  } = useTransactionContext()
  
  const [selectedYear, setSelectedYear] = useState<string>(String(currentYear))
  const [incomeCategoryTotals, setIncomeCategoryTotals] = useState<[string, string | number][]>([])
  const [expenseCategoryTotals, setExpenseCategoryTotals] = useState<[string, string | number][]>([])
  const [lineChartData, setLineChartData] = useState<MultiColumnDataType>([])

  const theme = useTheme()
  const currentTheme = theme.theme

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

  const buildCompareChartData = () => {
    const chartData = buildMultiColumnData({
      firstData: isMockData ? mockIncomeData : incomeTransactions,
      secondData: isMockData ? mockExpenseData : expenseTransactions,
      selectedYear: selectedYear,
      firstColumnTitle: "Month",
      method: "compare"
    })
    
    if (!chartData) return
    
    setLineChartData(chartData)
  }
    
  useEffect(() => {
    buildCompareChartData()
  }, [incomeTransactions, expenseTransactions, selectedYear])

  return (
    <Box
      className="flex flex-col gap-2 h-full"
    >
      <Box
        sx={{
          display: isMockData? "flex" : "none",
          height: "100%",
          alignItems: "center"
        }}
      >
        <Alert severity="error" sx={{width: "100%"}}>
          This contains mock data for demonstrations purposes.
          Add your first income and expense transactions to start tracking your finances.
        </Alert>
      </Box>

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

      <ShowCaseCard title={`${selectedYear} Income and Expense Overview`} secondaryTitle={""}>
        <LineChart
          multiColumnData={lineChartData}
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
          />
        </ShowCaseCard>

        <ShowCaseCard title={`${selectedYear} Expense Categories`} secondaryTitle={""}>
          <PieChart
            data={expenseCategoryTotals}
          />
        </ShowCaseCard>
      </Box>
    </Box>
  )
}

export default Overview