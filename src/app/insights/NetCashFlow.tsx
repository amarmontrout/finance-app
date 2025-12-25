"use client"

import ColoredInfoCard from "@/components/ColoredInfoCard"
import LineChart from "@/components/LineChart"
import { useTransactionContext } from "@/contexts/transactions-context"
import { accentColorSecondary, healthStateDarkMode, healthStateLightMode } from "@/globals/colors"
import { MONTHS } from "@/globals/globals"
import { buildTwoColumnData, TwoColumnDataType } from "@/utils/buildChartData"
import { getNetCashFlow } from "@/utils/financialFunctions"
import { getMonthTotal, getYearTotal } from "@/utils/getTotals"
import { cleanNumber, formattedStringNumber, getSavingsHealthState, removeCommas } from "@/utils/helperFunctions"
import { Box } from "@mui/material"
import { useTheme } from "next-themes"
import { useMemo } from "react"

const NetCashFlow = (props: {
  selectedYear: string
  selectedMonth: string
  view: "annual" | "month"
}) => {
  const { selectedYear, selectedMonth, view } = props

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
    return annualNet.reduce((acc, [, amount]) => acc + Number(amount), 0)
  }, [annualNet])

  const monthSavingsHealthState = getSavingsHealthState(cleanNumber(netIncome), cleanNumber(income))
  const annualSavingsHealthState = getSavingsHealthState(annualNetIncome, cleanNumber(annualIncome))
  const monthSavingsColor = (currentTheme === "light"
    ? healthStateLightMode
    : healthStateDarkMode)[monthSavingsHealthState]
  const annualSavingsColor = (currentTheme === "light"
    ? healthStateLightMode
    : healthStateDarkMode)[annualSavingsHealthState]

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
        {view === "month" &&
          <ColoredInfoCard
            cardColors={monthSavingsColor}
            info={`$${netIncome}`}
            title={`${selectedMonth} ${selectedYear} State: ${monthSavingsHealthState}`}
          />
        }

        {view === "annual" &&
          <ColoredInfoCard
            cardColors={annualSavingsColor}
            info={`$${formattedStringNumber(annualNetIncome)}`}
            title={`${selectedYear} State: ${annualSavingsHealthState}`}
          />      
        }
      </Box>
    </Box>
  )
}

export default NetCashFlow