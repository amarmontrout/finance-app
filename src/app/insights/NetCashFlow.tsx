"use client"

import ColoredInfoCard from "@/components/ColoredInfoCard"
import LineChart from "@/components/LineChart"
import { FlexColWrapper } from "@/components/Wrappers"
import { useTransactionContext } from "@/contexts/transactions-context"
import { 
  accentColorSecondary, 
  healthStateDarkMode, 
  healthStateLightMode 
} from "@/globals/colors"
import { MONTHS } from "@/globals/globals"
import { buildTwoColumnData, TwoColumnDataType } from "@/utils/buildChartData"
import { getNetCashFlow } from "@/utils/financialFunctions"
import { getMonthTotal, getYearTotal } from "@/utils/getTotals"
import { 
  cleanNumber, 
  formattedStringNumber, 
  getSavingsHealthState, 
  removeCommas 
} from "@/utils/helperFunctions"
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

  const monthIncome = getMonthTotal(
    selectedYear, 
    selectedMonth, 
    incomeTransactions
  )
  const monthExpense = getMonthTotal(
    selectedYear, 
    selectedMonth, 
    expenseTransactions
  )
  const monthNetIncome = getNetCashFlow(monthIncome, monthExpense)
  const annualIncome = getYearTotal(selectedYear, incomeTransactions)
  const eachMonthNetIncome: [string, string][] = useMemo(() => {
    return MONTHS.map(month => {
      const incomeTotal = getMonthTotal(selectedYear, month, incomeTransactions)
      const expenseTotal = getMonthTotal(
        selectedYear, 
        month, 
        expenseTransactions
      )
      const net = getNetCashFlow(incomeTotal, expenseTotal)
      return [month, removeCommas(net)]
    })
  }, [selectedYear, incomeTransactions, expenseTransactions])
  const annualNetIncome = useMemo(() => {
    return eachMonthNetIncome.reduce(
      (acc, [, amount]) => acc + Number(amount), 
      0
    )
  }, [eachMonthNetIncome])

  const monthSavingsHealthState = getSavingsHealthState(
    cleanNumber(monthNetIncome), 
    cleanNumber(monthIncome)
  )
  const annualSavingsHealthState = getSavingsHealthState(
    annualNetIncome, 
    cleanNumber(annualIncome)
  )
  const monthSavingsColor = (currentTheme === "light"
    ? healthStateLightMode
    : healthStateDarkMode)[monthSavingsHealthState]
  const annualSavingsColor = (currentTheme === "light"
    ? healthStateLightMode
    : healthStateDarkMode)[annualSavingsHealthState]

  const lineChartData: TwoColumnDataType = useMemo(() => {
    return buildTwoColumnData({
      data: eachMonthNetIncome,
      firstColumnTitle: "Month",
      secondColumnTitle: "Net Cash Flow"
    }) || []
  }, [eachMonthNetIncome])
  
  return (
    <FlexColWrapper gap={4}> 
      <LineChart
        twoColumnData={lineChartData}
        lineColors={[accentColorSecondary]}
      />
        {view === "month" &&
          <ColoredInfoCard
            cardColors={monthSavingsColor}
            info={`$${monthNetIncome}`}
            title={`${selectedMonth} ${selectedYear} 
              State: ${monthSavingsHealthState}`}
          />
        }

        {view === "annual" &&
          <ColoredInfoCard
            cardColors={annualSavingsColor}
            info={`$${formattedStringNumber(annualNetIncome)}`}
            title={`${selectedYear} State: ${annualSavingsHealthState}`}
          />      
        }
    </FlexColWrapper>
  )
}

export default NetCashFlow