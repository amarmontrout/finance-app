"use client"

import LineChart from "@/components/LineChart"
import { useTransactionContext } from "@/contexts/transactions-context"
import { accentColorSecondary, darkMode, lightMode } from "@/globals/colors"
import { MONTHS } from "@/globals/globals"
import { buildTwoColumnData, TwoColumnDataType } from "@/utils/buildChartData"
import { getNetCashFlow } from "@/utils/financialFunctions"
import { getMonthTotal } from "@/utils/getTotals"
import { cleanNumber, formattedStringNumber } from "@/utils/helperFunctions"
import { Box, Typography } from "@mui/material"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

const NetCashFlow = (props: {
  selectedYear: string
  selectedMonth: string
}) => {
  const {
    selectedYear,
    selectedMonth
  } = props

  const {
    incomeTransactions,
    expenseTransactions
  } = useTransactionContext()

  // Gets income total for selected month
  const income = getMonthTotal(selectedYear, selectedMonth, incomeTransactions)
  // Gets expense total for selected month
  const expense = getMonthTotal(selectedYear, selectedMonth, expenseTransactions)
  // Gets net cash flow for selected month
  const netIncome = getNetCashFlow(income, expense)
  const netIncomeNumber = cleanNumber(netIncome)

  const [annualNetCashFlow, setAnnualNetCashFlow] = useState<[string, string][]>([])
  const [totalAnnualNetCashFlow, setTotalAnnualNetCashFlow] = useState<string>("")
  const totalAnnualNetCashFlowNumber = cleanNumber(totalAnnualNetCashFlow)
  const [lineChartData, setLineChartData] = useState<TwoColumnDataType>([])

  const { theme: currentTheme } = useTheme()
  const positiveNet = currentTheme === "light" ? lightMode.success : darkMode.success
  const negativeNet = currentTheme === "light" ? lightMode.error : darkMode.error
  const monthNetIncomeColor = netIncomeNumber > 0 ? positiveNet : negativeNet
  const annualNetIncomeColor = totalAnnualNetCashFlowNumber > 0 ? positiveNet : negativeNet

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

  const getTotalAnnualNetCashflow = () => {
    let total = 0
    annualNetCashFlow.forEach(([month, amount]) => {
      total += Number(amount)
    })
    setTotalAnnualNetCashFlow(formattedStringNumber(total))
  }

  const buildNetCashFlowChartData = () => {
    const chartData = buildTwoColumnData({
      data: annualNetCashFlow, 
      firstColumnTitle: "Month", 
      secondColumnTitle: "Net Cash Flow"
    })

    if (!chartData) return

    setLineChartData(chartData)
  }

  useEffect(() => {
    if (!selectedYear) return

    getAnnualNetCashFlow()
  }, [selectedYear])

  useEffect(() => {
    buildNetCashFlowChartData()
    getTotalAnnualNetCashflow()
  }, [annualNetCashFlow])
  
  return (
    <Box
      className="flex flex-col gap-4 h-full"
    >  
      <LineChart
        twoColumnData={lineChartData}
        title={`Net Cash Flow ${selectedYear}`}
        lineColors={[accentColorSecondary]}
      />

      <Box
        className="flex flex-row gap-2"
      >
        <Box
          className="flex flex-col gap-2 h-full"
          border={`2px solid ${monthNetIncomeColor}`} 
          borderRadius={"10px"} 
          padding={"15px"} 
          margin={"0 auto"} 
          width={"100%"}
          alignItems={"center"}
        >
          <Typography color={monthNetIncomeColor}>{`Net Cash Flow for ${selectedMonth} ${selectedYear}`}</Typography>

          <hr style={{ width: "100%", borderColor: monthNetIncomeColor}}/>

          <Typography variant="h3" color={monthNetIncomeColor}>${netIncome}</Typography>
        </Box>

        <Box
          className="flex flex-col gap-2"
          border={`2px solid ${annualNetIncomeColor}`} 
          borderRadius={"10px"} 
          padding={"15px"} 
          margin={"0 auto"} 
          width={"100%"}
          alignItems={"center"}
        >
          <Typography color={annualNetIncomeColor}>{`Total Net Cash Flow for ${selectedYear}`}</Typography>

          <hr style={{ width: "100%", borderColor: annualNetIncomeColor}}/>

          <Typography variant="h3" color={annualNetIncomeColor}>${totalAnnualNetCashFlow}</Typography>
        </Box>        
      </Box>
    </Box>
  )
}

export default NetCashFlow