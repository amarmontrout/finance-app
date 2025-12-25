"use client"

import ColoredInfoCard from "@/components/ColoredInfoCard"
import { useTransactionContext } from "@/contexts/transactions-context"
import { healthStateDarkMode, healthStateLightMode } from "@/globals/colors"
import { getSavingRate } from "@/utils/financialFunctions"
import { getMonthTotal, getYearTotal } from "@/utils/getTotals"
import { cleanNumber, getSavingsHealthState } from "@/utils/helperFunctions"
import { Box } from "@mui/material"
import { useTheme } from "next-themes"
import { useMemo } from "react"

const SavingsRate = (props: {
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

  const income = useMemo(() => getMonthTotal(selectedYear, selectedMonth, incomeTransactions), [selectedYear, selectedMonth, incomeTransactions])
  const expense = useMemo(() => getMonthTotal(selectedYear, selectedMonth, expenseTransactions), [selectedYear, selectedMonth, expenseTransactions])
  const savingsRate = useMemo(() => getSavingRate(income, expense), [income, expense])
  const annualIncome = useMemo(() => getYearTotal(selectedYear, incomeTransactions), [selectedYear, incomeTransactions])
  const annualExpense = useMemo(() => getYearTotal(selectedYear, expenseTransactions), [selectedYear, expenseTransactions])
  const annualSavingsRate = useMemo(() => getSavingRate(annualIncome, annualExpense), [annualIncome, annualExpense])

  const monthSavingsHealthState = getSavingsHealthState(cleanNumber(savingsRate), 100)
  const annualSavingsHealthState = getSavingsHealthState(cleanNumber(annualSavingsRate), 100)
  const monthSavingsColor = (currentTheme === "light"
    ? healthStateLightMode
    : healthStateDarkMode)[monthSavingsHealthState]
  const annualSavingsColor = (currentTheme === "light"
    ? healthStateLightMode
    : healthStateDarkMode)[annualSavingsHealthState]

  return (
     <Box
      className="flex flex-col gap-3 h-full"
    >
      <Box
        className="flex flex-col sm:flex-row  gap-3"
      >
        {view === "month" &&       
          <ColoredInfoCard
            cardColors={monthSavingsColor}
            info={`${savingsRate}%`}
            title={`${selectedMonth} ${selectedYear} State: ${monthSavingsHealthState}`}
          />          
        }

        {view === "annual" &&        
          <ColoredInfoCard
            cardColors={annualSavingsColor}
            info={`${annualSavingsRate}%`}
            title={`${selectedYear} State: ${annualSavingsHealthState}`}
          />  
        }
      </Box>
    </Box>
  )
}

export default SavingsRate