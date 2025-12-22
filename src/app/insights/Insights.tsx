"use client"

import ShowCaseCard from "@/components/ShowCaseCard"
import { useTransactionContext } from "@/contexts/transactions-context"
import { MONTHS } from "@/globals/globals"
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material"
import { useEffect } from "react"
import NetCashFlow from "./NetCashFlow"
import SavingsRate from "./SavingsRate"
import { mockYears } from "@/globals/mockData"
import MockDataWarning from "@/components/MockDataWarning"

const Insights = () => {
  const { 
    years,
    currentYear,
    currentMonth,
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
    refreshIncomeTransactions,
    refreshExpenseTransactions,
    isMockData
  } = useTransactionContext()

  useEffect(() => {
    setSelectedYear(String(currentYear))
    setSelectedMonth(String(currentMonth))
    refreshIncomeTransactions()
    refreshExpenseTransactions()
  }, [])

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
            onChange={(e) => setSelectedYear(e.target.value)}
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

        <FormControl>
          <InputLabel>Month</InputLabel>
          <Select
            label="Month"
            value={selectedMonth}
            name={"month"}
            onChange={(e) => setSelectedMonth(e.target.value)}
            sx={{
              width: "175px"
            }}
          >
            {MONTHS.map((month) => {
              return <MenuItem value={month}>{month}</MenuItem>
            })}
          </Select>
        </FormControl>

        {/* <FormControl>
          <InputLabel>Range</InputLabel>
          <Select
            label="Range"
            value={selectedMonth}
            name={"range"}
            onChange={(e) => setSelectedMonth(e.target.value)}
            sx={{
              width: "175px"
            }}
          >
            <MenuItem value={"selectedMonth"}>Selected Month</MenuItem>
            <MenuItem value={"ytd"}>YTD</MenuItem>
          </Select>
        </FormControl> */}
      </Box>

      <hr style={{width: "100%"}}/>
      
      <Box
        className="flex flex-col 2xl:flex-row gap-2 h-full"
      >
        <Box
          className="flex flex-1 min-w-0"
        >
          <ShowCaseCard title={"Net Cash Flow"}>
            <NetCashFlow/>
          </ShowCaseCard>
        </Box>

        <Box
          className="flex flex-1 flex-col gap-2 h-full"
        >
          <ShowCaseCard title={"Savings Rate"}>
            <SavingsRate/>
          </ShowCaseCard>

          {/* <ShowCaseCard title={"Top 3 Expense Categories"}>
            {"% of total expenses, change from previous month, small bar chart or cards"}
          </ShowCaseCard>          */}
        </Box>
      </Box>
    </Box>
  )
}

export default Insights