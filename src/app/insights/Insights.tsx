"use client"

import ShowCaseCard from "@/components/ShowCaseCard"
import { useTransactionContext } from "@/contexts/transactions-context"
import { accentColorSecondary } from "@/globals/colors"
import { MONTHS } from "@/globals/globals"
import { getSavingRate } from "@/utils/getTotals"
import { Box, FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material"
import { useEffect } from "react"
import NetCashFlow from "./NetCashFlow"

const Insights = () => {
  const { 
    years,
    currentYear,
    currentMonth,
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
    getMonthIncomeTotal,
    getMonthExpenseTotal,
    refreshIncomeTransactions,
    refreshExpenseTransactions
  } = useTransactionContext()

  useEffect(() => {
    setSelectedYear(String(currentYear))
    setSelectedMonth(String(currentMonth))
    refreshIncomeTransactions()
    refreshExpenseTransactions()
  }, [])

  const SavingsRate = () => {
    const monthIncomeTotal = getMonthIncomeTotal()
    const monthExpenseTotal = getMonthExpenseTotal()
    const savingsRate = getSavingRate(monthIncomeTotal, monthExpenseTotal)

    return (
      <Box 
        className="flex flex-col gap-2 h-full"
        border={`2px solid ${accentColorSecondary}`} 
        borderRadius={"10px"} 
        padding={"15px"} 
        margin={"0 auto"} 
        width={"fit-content"}
        alignItems={"center"}
      >
        <Typography>{`${selectedMonth} ${selectedYear}`}</Typography>

        <hr style={{ width: "100%"}}/>

        <Typography variant="h3">{savingsRate}%</Typography>
      </Box>
    )
  }

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
            onChange={(e) => setSelectedYear(e.target.value)}
            sx={{
              width: "175px"
            }}
          >
            {years.map((year) => {
              return <MenuItem value={year}>{year}</MenuItem>
            })}
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
      </Box>

      <hr style={{width: "100%"}}/>
      
      <Box
        className="flex flex-col xl:flex-row gap-2 h-full"
      >
        <ShowCaseCard title={"Net Cash Flow"} secondaryTitle={""}>
          <NetCashFlow/>
        </ShowCaseCard>

        <ShowCaseCard title={"Savings Rate"} secondaryTitle={""}>
          {"YTD average, current month badge, color coded - green good and red bad"}
          <Box>
            <SavingsRate/>
          </Box>
        </ShowCaseCard>
      </Box>

      <ShowCaseCard title={"Top 3 Expense Categories"} secondaryTitle={""}>
        {"% of total expenses, change from previous month, small bar chart or cards"}
      </ShowCaseCard>        
    </Box>
  )
}

export default Insights