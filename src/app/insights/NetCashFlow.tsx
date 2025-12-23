"use client"

import LineChart from "@/components/LineChart"
import { useTransactionContext } from "@/contexts/transactions-context"
import { accentColorSecondary, healthStateDarkMode, healthStateLightMode } from "@/globals/colors"
import { MONTHS } from "@/globals/globals"
import { buildTwoColumnData, TwoColumnDataType } from "@/utils/buildChartData"
import { getNetCashFlow } from "@/utils/financialFunctions"
import { getMonthTotal, getYearTotal } from "@/utils/getTotals"
import { cleanNumber, formattedStringNumber, removeCommas } from "@/utils/helperFunctions"
import { Box, Typography } from "@mui/material"
import { useTheme } from "next-themes"
import { useMemo } from "react"

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

  const { theme: currentTheme } = useTheme()

  const income = getMonthTotal(selectedYear, selectedMonth, incomeTransactions)
  const annualIncome = getYearTotal(selectedYear, incomeTransactions)
  const expense = getMonthTotal(selectedYear, selectedMonth, expenseTransactions)
  const netIncome = getNetCashFlow(income, expense)

  const annualNet: [string, string][] = useMemo(() => {
    return MONTHS.map(month => {
      const incomeTotal = getMonthTotal(selectedYear, month, incomeTransactions)
      const expenseTotal = getMonthTotal(selectedYear, month, expenseTransactions)
      const net = getNetCashFlow(incomeTotal, expenseTotal)
      return [month, removeCommas(net)]
    })
  }, [selectedYear, incomeTransactions, expenseTransactions])

  const annualNetIncome = useMemo(() => {
    return formattedStringNumber(
      annualNet.reduce((acc, [, amount]) => acc + Number(amount), 0)
    )
  }, [annualNet])

  const getHealthColor = (net: number, total: number) => {
    const percent = total === 0 ? -1 : net / total
    if (percent < 0) return "mayday"
    if (percent < 0.05) return "improvement"
    if (percent < 0.2) return "good"
    return "excellent"
  }

  const monthState = getHealthColor(cleanNumber(netIncome), cleanNumber(income))
  const annualState = getHealthColor(Number(annualNetIncome.replace(/,/g, '')), cleanNumber(annualIncome))

  const monthResult = currentTheme === "light"
    ? healthStateLightMode[monthState]
    : healthStateDarkMode[monthState]

  const annualResult = currentTheme === "light"
    ? healthStateLightMode[annualState]
    : healthStateDarkMode[annualState]

  const lineChartData: TwoColumnDataType = useMemo(() => {
    return buildTwoColumnData({
      data: annualNet,
      firstColumnTitle: "Month",
      secondColumnTitle: "Net Cash Flow"
    }) || []
  }, [annualNet])
  
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
        className="flex flex-col sm:flex-row gap-3"
      >
        <Box
          className="flex flex-col gap-2 h-full"
          border={`2px solid ${monthResult.border}`} 
          borderRadius={"10px"} 
          padding={"15px"} 
          margin={"0 auto"} 
          width={"100%"}
          alignItems={"center"}
          sx={{
            backgroundColor: monthResult.background
          }}
        >
          <Typography 
            color={monthResult.textIcon}
            sx={{
              fontSize: {
                xs: ".75rem",
                md: "1rem"
              }
            }}
          >
            {`Net Cash Flow for ${selectedMonth} ${selectedYear}`}
          </Typography>

          <hr style={{ width: "100%", borderColor: monthResult.border}}/>

          <Typography 
            color={monthResult.textIcon}
            sx={{
              fontSize: {
                xs: "2rem",
                md: "3rem"
              }
            }}
          >
            ${netIncome}
          </Typography>
        </Box>

        <Box
          className="flex flex-col gap-2"
          border={`2px solid ${annualResult.border}`} 
          borderRadius={"10px"} 
          padding={"15px"} 
          margin={"0 auto"} 
          width={"100%"}
          alignItems={"center"}
          sx={{
            backgroundColor: annualResult.background
          }}
        >
          <Typography 
            color={annualResult.textIcon}
            sx={{
              fontSize: {
                xs: ".75rem",
                md: "1rem"
              }
            }}
          >
            {`Total Net Cash Flow for ${selectedYear}`}
          </Typography>

          <hr style={{ width: "100%", borderColor: annualResult.border}}/>

          <Typography 
            color={annualResult.textIcon}
            sx={{
              fontSize: {
                xs: "2rem",
                md: "3rem"
              }
            }}            
          >
            ${annualNetIncome}
          </Typography>
        </Box>        
      </Box>
    </Box>
  )
}

export default NetCashFlow