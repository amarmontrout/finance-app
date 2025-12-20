"use client"

import LineChart from "@/components/LineChart"
import { useTransactionContext } from "@/contexts/transactions-context"
import { accentColorPrimary, accentColorSecondary } from "@/globals/colors"
import { MONTHS } from "@/globals/globals"
import { getMonthTotal, getNetCashFlow } from "@/utils/getTotals"
import { Box, Typography } from "@mui/material"
import { useEffect, useState } from "react"

const NetCashFlow = () => {
  const {
    incomeTransactions,
    expenseTransactions,
    getMonthIncomeTotal,
    getMonthExpenseTotal,
    selectedYear,
    selectedMonth
  } = useTransactionContext()

  // Gets income total for selected month
  const income = getMonthIncomeTotal()
  // Gets expense total for selected month
  const expense = getMonthExpenseTotal()
  // Gets net cash flow for selected month
  const netIncome = getNetCashFlow(income, expense)
  const [annualNetCashFlow, setAnnualNetCashFlow] = useState<[string, string][]>([])


  const getAnnualNetCashFlow = () => {
    const incomeExpenseTotals: Record<string, [string, string]> = {}
    const totalNetCashFlow: [string, string][] = []

    const removeCommas = (value: string): string =>
      value.replace(/,/g, "")


    MONTHS.map((month) => {
      const incomeTotal = getMonthTotal(selectedYear, month, incomeTransactions)
      const expenseTotal = getMonthTotal(selectedYear, month, expenseTransactions)
      incomeExpenseTotals[month] = [incomeTotal, expenseTotal]
    })

    Object.entries(incomeExpenseTotals).forEach(([month, array]) => {
      const netCashflow = getNetCashFlow(array[0], array[1])
      totalNetCashFlow.push([month, removeCommas(netCashflow)])
    })

    setAnnualNetCashFlow(totalNetCashFlow)
  }

  useEffect(() => {
    if (!selectedYear) return
    getAnnualNetCashFlow()
  }, [selectedYear])
  
  return (
    <Box
      className="flex flex-col gap-2 h-full"
    >  
      <LineChart
        selectedYear={selectedYear}
        netCashFlowData={annualNetCashFlow}
        title={`Net Cash Flow ${selectedYear}`}
        lineColors={[accentColorPrimary]}
      />
      
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

        <Typography variant="h3">${netIncome}</Typography>
      </Box>
    </Box>
  )
}

export default NetCashFlow