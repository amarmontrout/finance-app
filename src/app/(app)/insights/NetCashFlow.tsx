"use client"

import ColoredInfoCard from "@/components/ColoredInfoCard"
import LineChart from "@/components/LineChart"
import ShowCaseCard from "@/components/ShowCaseCard"
import { FlexColWrapper } from "@/components/Wrappers"
import { accentColorSecondary } from "@/globals/colors"
import { MONTHS } from "@/globals/globals"
import { buildTwoColumnData, TwoColumnDataType } from "@/utils/buildChartData"
import { getNetCashFlow } from "@/utils/financialFunctions"
import { getMonthTotalV2, getYearTotalV2 } from "@/utils/getTotals"
import {
  cleanNumber,
  formattedStringNumber,
  getCardColor,
  getSavingsHealthState,
  removeCommas,
} from "@/utils/helperFunctions"
import { TransactionTypeV2 } from "@/utils/type"
import { useMemo } from "react"

// Annual logic accounts for all transactions. Need to limit to past and current months only.

const NetCashFlow = ({
  incomeTransactions,
  expenseTransactions,
  selectedYear,
  selectedMonth,
  view,
  currentTheme,
  excludedSet,
}: {
  incomeTransactions: TransactionTypeV2[]
  expenseTransactions: TransactionTypeV2[]
  selectedYear: number
  selectedMonth: string
  view: "annual" | "month"
  currentTheme: string | undefined
  excludedSet: Set<string>
}) => {
  const monthIncome = getMonthTotalV2(
    selectedYear,
    selectedMonth,
    incomeTransactions,
    excludedSet,
  )
  const monthExpense = getMonthTotalV2(
    selectedYear,
    selectedMonth,
    expenseTransactions,
    excludedSet,
  )
  const monthNetIncome = getNetCashFlow(monthIncome, monthExpense)
  const annualIncome = getYearTotalV2(
    selectedYear,
    incomeTransactions,
    excludedSet,
  )
  const eachMonthNetIncome: [string, string][] = useMemo(() => {
    return MONTHS.map((month) => {
      const incomeTotal = getMonthTotalV2(
        selectedYear,
        month,
        incomeTransactions,
        excludedSet,
      )
      const expenseTotal = getMonthTotalV2(
        selectedYear,
        month,
        expenseTransactions,
        excludedSet,
      )
      const net = getNetCashFlow(incomeTotal, expenseTotal)
      return [month, removeCommas(net)]
    })
  }, [selectedYear, incomeTransactions, expenseTransactions])
  const annualNetIncome = useMemo(() => {
    return eachMonthNetIncome.reduce(
      (acc, [, amount]) => acc + Number(amount),
      0,
    )
  }, [eachMonthNetIncome])

  const monthSavingsHealthState = getSavingsHealthState(
    cleanNumber(monthNetIncome),
    cleanNumber(monthIncome),
  )
  const annualSavingsHealthState = getSavingsHealthState(
    annualNetIncome,
    cleanNumber(annualIncome),
  )
  const monthSavingsColor = getCardColor(currentTheme, monthSavingsHealthState)
  const annualSavingsColor = getCardColor(
    currentTheme,
    annualSavingsHealthState,
  )

  const lineChartData: TwoColumnDataType = useMemo(() => {
    return (
      buildTwoColumnData({
        data: eachMonthNetIncome,
        firstColumnTitle: "Month",
        secondColumnTitle: "Net Cash Flow",
      }) || []
    )
  }, [eachMonthNetIncome])

  return (
    <ShowCaseCard title={"Net Cash Flow"}>
      <FlexColWrapper gap={2}>
        {view === "month" && (
          <ColoredInfoCard
            cardColors={monthSavingsColor}
            info={`Net Cash: $${monthNetIncome}`}
            title={`${selectedMonth} ${selectedYear} 
              Net Cash Rating: ${monthSavingsHealthState}`}
          />
        )}

        {view === "annual" && (
          <ColoredInfoCard
            cardColors={annualSavingsColor}
            info={`Net Cash: $${formattedStringNumber(annualNetIncome)}`}
            title={`${selectedYear} Net Cash Rating: ${annualSavingsHealthState}`}
          />
        )}
        <LineChart
          twoColumnData={lineChartData}
          lineColors={[accentColorSecondary]}
        />
      </FlexColWrapper>
    </ShowCaseCard>
  )
}

export default NetCashFlow
