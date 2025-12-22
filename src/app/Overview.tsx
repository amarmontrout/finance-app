"use client"

import LineChart from "@/components/LineChart"
import MockDataWarning from "@/components/MockDataWarning"
import ShowCaseCard from "@/components/ShowCaseCard"
import { useTransactionContext } from "@/contexts/transactions-context"
import { darkMode, lightMode } from "@/globals/colors"
import { mockExpenseData, mockIncomeData, mockYears } from "@/globals/mockData"
import { buildMultiColumnData, MultiColumnDataType } from "@/utils/buildChartData"
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material"
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
  const [lineChartData, setLineChartData] = useState<MultiColumnDataType>([])

  const { theme: currentTheme } = useTheme()

  useEffect(() => {
    refreshIncomeTransactions()
    refreshExpenseTransactions()
  }, [selectedYear])

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

      <ShowCaseCard title={`${selectedYear} Income and Expense Overview`}>
        <LineChart
          multiColumnData={lineChartData}
          title={`Income and Expenses for ${selectedYear}`}
          lineColors={
            currentTheme === "light" 
            ? [lightMode.success, lightMode.error] 
            : [darkMode.success, darkMode.error]
          }
        />        
      </ShowCaseCard>
    </Box>
  )
}

export default Overview